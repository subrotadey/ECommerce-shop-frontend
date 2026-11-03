// src/hooks/useMediaLifecycle.js
//
// Image ও Video-র জন্য একটিই media lifecycle।
//
// প্রতিটি asset চেনা হয় "resourceType:publicId" key দিয়ে।
//
//   originals       -> Edit খোলার সময় product-এ যা ছিল। কখনো সঙ্গে সঙ্গে delete হয় না।
//   sessionUploads  -> এই form session-এ upload করা। Remove করলে সঙ্গে সঙ্গে delete হয়।
//   pendingDeletion -> original থেকে remove করা। শুধু Update সফল হলে delete হয়।
//   failedQueue     -> delete ব্যর্থ হওয়া asset। localStorage-এ থাকে, retry করা যায়।
//
// এই hook কোনো notification দেখায় না। কী দেখানো হবে তা component ঠিক করবে।

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { deleteMultipleAssets, getAssetKey } from '../services/cloudinaryService';

// --------------------------------------
// HELPERS
// --------------------------------------

const normalizeAsset = (asset) => {
  if (!asset?.publicId) return null;

  return {
    publicId: asset.publicId,
    resourceType: asset.resourceType === 'video' ? 'video' : 'image',
  };
};

const toAssets = (list, resourceType) =>
  (Array.isArray(list) ? list : [])
    .map((item) => normalizeAsset({ ...item, resourceType }))
    .filter(Boolean);

// images[] ও videos[] থেকে delete/save-যোগ্য asset-এর তালিকা।
export const buildMediaAssets = ({ images = [], videos = [] } = {}) => [
  ...toAssets(images, 'image'),
  ...toAssets(videos, 'video'),
];

// Video list normalize: array / legacy single object / null সব handle করে।
// publicId ও url ছাড়া entry এবং duplicate publicId বাদ যায়।
export const normalizeVideoList = (input) => {
  const list = Array.isArray(input) ? input : input ? [input] : [];
  const seen = new Set();
  const result = [];

  for (const video of list) {
    if (!video || typeof video !== 'object') continue;
    if (!video.publicId || !video.url) continue;
    if (seen.has(video.publicId)) continue;

    seen.add(video.publicId);
    result.push({
      url: video.url,
      publicId: video.publicId,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration ?? null,
    });
  }

  return result;
};

// Product থেকে videos[] বের করে। নতুন structure আগে, না থাকলে legacy।
export const getProductVideos = (product) => {
  if (!product) return [];

  const candidates = [
    product.media?.videos,
    product.videos,
    product.media?.video,
    product.video,
  ];

  for (const candidate of candidates) {
    const videos = normalizeVideoList(candidate);
    if (videos.length > 0) return videos;
  }

  return [];
};

// --------------------------------------
// FAILED DELETION STORE (module-level, localStorage-backed)
// --------------------------------------
// Module-level রাখা হয়েছে যাতে Products.jsx ও ProductForm একই queue দেখে।
// Form বন্ধ বা page refresh হলেও failed asset হারায় না।

const STORAGE_KEY = 'anisAbaya.failedMediaDeletions.v1';

const readStoredFailures = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.publicId)
      : [];
  } catch {
    return [];
  }
};

let failedSnapshot = typeof window === 'undefined' ? [] : readStoredFailures();
const listeners = new Set();

const emitChange = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getFailedSnapshot = () => failedSnapshot;

const setFailed = (list) => {
  failedSnapshot = list;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage unavailable: memory-তে tracking চলবে।
  }

  emitChange();
};

// অন্য browser tab-এ queue বদলালে sync।
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      failedSnapshot = readStoredFailures();
      emitChange();
    }
  });
}

const addFailedAssets = (assets, fallbackMessage = '') => {
  const map = new Map(failedSnapshot.map((item) => [getAssetKey(item), item]));

  assets.forEach((asset) => {
    const normalized = normalizeAsset(asset);
    if (!normalized) return;

    const key = getAssetKey(normalized);
    const previous = map.get(key);

    map.set(key, {
      ...normalized,
      attempts: (previous?.attempts || 0) + 1,
      lastError: asset.error || fallbackMessage || previous?.lastError || '',
      failedAt: new Date().toISOString(),
    });
  });

  setFailed(Array.from(map.values()));
};

const removeFailedAssets = (keys) => {
  const keySet = new Set(keys);
  const next = failedSnapshot.filter((item) => !keySet.has(getAssetKey(item)));

  if (next.length !== failedSnapshot.length) {
    setFailed(next);
  }
};

// --------------------------------------
// VERIFIED DELETION
// --------------------------------------
// ফেরত দেয়:
//   deleted -> backend verify করেছে
//   failed  -> ব্যর্থ। failed queue-তে যায় (retry-যোগ্য)
//   inUse   -> saved product এখনো ব্যবহার করছে (backend 409)।
//              এটি delete করা ভুল, তাই queue থেকেও বাদ যায়।

const deleteVerified = async (assets) => {
  const list = assets.map(normalizeAsset).filter(Boolean);

  if (list.length === 0) {
    return { deleted: [], failed: [], inUse: [] };
  }

  const { deleted, failed } = await deleteMultipleAssets(list);

  const inUse = failed.filter((asset) => asset.inUse);
  const retryable = failed.filter((asset) => !asset.inUse);

  if (retryable.length > 0) {
    addFailedAssets(retryable);
  }

  // সফল হলে এবং "in use" হলে পুরোনো failed entry সরে যায়।
  removeFailedAssets([...deleted, ...inUse].map(getAssetKey));

  if (inUse.length > 0) {
    console.warn(
      'Cloudinary assets still used by a saved product were not deleted:',
      inUse
    );
  }

  return { deleted, failed: retryable, inUse };
};

let retryInFlight = null;

export const retryFailedDeletions = async () => {
  if (retryInFlight) return retryInFlight;

  const snapshot = failedSnapshot;

  if (snapshot.length === 0) {
    return { deleted: [], failed: [], inUse: [] };
  }

  retryInFlight = deleteVerified(snapshot).finally(() => {
    retryInFlight = null;
  });

  return retryInFlight;
};

// Failed queue দেখা ও retry করার hook। Products.jsx-এও এটি আলাদাভাবে ব্যবহার করা যাবে।
export const useFailedMediaDeletions = () => {
  const failedAssets = useSyncExternalStore(
    subscribe,
    getFailedSnapshot,
    getFailedSnapshot
  );
  const [isRetrying, setIsRetrying] = useState(false);

  const retryFailed = useCallback(async () => {
    setIsRetrying(true);

    try {
      return await retryFailedDeletions();
    } finally {
      setIsRetrying(false);
    }
  }, []);

  return { failedAssets, retryFailed, isRetrying };
};

// --------------------------------------
// MAIN HOOK
// --------------------------------------

export const useMediaLifecycle = ({
  initialImages = [],
  initialVideos = [],
} = {}) => {
  // Edit খোলার সময়ের asset। একবারই নেওয়া হয়।
  const originalsRef = useRef(null);

  if (originalsRef.current === null) {
    originalsRef.current = new Map(
      buildMediaAssets({ images: initialImages, videos: initialVideos }).map(
        (asset) => [getAssetKey(asset), asset]
      )
    );
  }

  const sessionRef = useRef(new Map());
  const pendingRef = useRef(new Map());
  const [activeDeletes, setActiveDeletes] = useState(0);

  const { failedAssets, retryFailed, isRetrying } = useFailedMediaDeletions();

  const runDeletion = useCallback(async (assets) => {
    setActiveDeletes((count) => count + 1);

    try {
      return await deleteVerified(assets);
    } finally {
      setActiveDeletes((count) => count - 1);
    }
  }, []);

  // Upload সফল হওয়ার সঙ্গে সঙ্গে call করতে হবে।
  // assets: [{ publicId, resourceType }]
  const registerUploads = useCallback((assets = []) => {
    assets.forEach((asset) => {
      const normalized = normalizeAsset(asset);
      if (!normalized) return;

      const key = getAssetKey(normalized);

      // Original asset কখনো "নতুন upload" নয়।
      if (originalsRef.current.has(key)) return;

      sessionRef.current.set(key, normalized);
    });
  }, []);

  // Upload মাঝপথে ব্যর্থ হয়ে cleanup-ও ব্যর্থ হলে (error.orphanedAssets)।
  const trackOrphanedAssets = useCallback((assets = []) => {
    if (assets.length > 0) {
      addFailedAssets(assets, 'Upload was interrupted');
    }
  }, []);

  // Form থেকে asset সরানোর সময় call করতে হবে।
  //
  //   এই session-এর upload  -> সঙ্গে সঙ্গে Cloudinary থেকে delete (verified)
  //   original / অজানা asset -> pending queue-তে, Update সফল হলে delete
  //
  // status: 'deleted' | 'deferred' | 'failed' | 'in_use' | 'ignored'
  const removeAsset = useCallback(
    async (asset) => {
      const normalized = normalizeAsset(asset);

      if (!normalized) return { status: 'ignored' };

      const key = getAssetKey(normalized);

      // নিরাপদ default: session-এর নয় এমন যেকোনো asset delete হবে পরে।
      if (!sessionRef.current.has(key)) {
        pendingRef.current.set(key, normalized);
        return { status: 'deferred', asset: normalized };
      }

      // Ownership আগে ছাড়া হয়, যাতে delete চলার সময় Close/Reset একই asset দুবার না মোছে।
      sessionRef.current.delete(key);

      const result = await runDeletion([normalized]);

      if (result.deleted.length > 0) {
        return {
          status: 'deleted',
          asset: normalized,
          alreadyDeleted: result.deleted[0].status === 'not_found',
        };
      }

      if (result.inUse.length > 0) {
        return { status: 'in_use', asset: normalized };
      }

      return {
        status: 'failed',
        asset: normalized,
        error: result.failed[0]?.error || 'Deletion failed.',
      };
    },
    [runDeletion]
  );

  // MongoDB Update সফল হওয়ার পরেই call করতে হবে।
  // savedAssets: যা এখন product-এ saved আছে (buildMediaAssets দিয়ে বানানো)।
  //
  // pending queue ও বাকি session upload-এর যেগুলো saved-এ নেই, সেগুলো delete হয়।
  const finalizeSave = useCallback(
    async (savedAssets = []) => {
      const savedKeys = new Set(
        savedAssets
          .map(normalizeAsset)
          .filter(Boolean)
          .map(getAssetKey)
      );

      const toDelete = [];

      pendingRef.current.forEach((asset, key) => {
        if (!savedKeys.has(key)) toDelete.push(asset);
      });

      sessionRef.current.forEach((asset, key) => {
        if (!savedKeys.has(key)) toDelete.push(asset);
      });

      // Saved asset এখন product-এর অংশ, নতুন baseline।
      pendingRef.current.clear();
      sessionRef.current.clear();
      originalsRef.current = new Map(
        savedAssets
          .map(normalizeAsset)
          .filter(Boolean)
          .map((asset) => [getAssetKey(asset), asset])
      );

      return runDeletion(toDelete);
    },
    [runDeletion]
  );

  // Reset ও Modal Close: শুধু এই session-এর unsaved upload delete হয়।
  // Pending queue খালি হয়, কারণ original ফিরে আসছে। Original কখনো delete হয় না।
  const discardUnsaved = useCallback(async () => {
    const toDelete = Array.from(sessionRef.current.values());

    sessionRef.current.clear();
    pendingRef.current.clear();

    return runDeletion(toDelete);
  }, [runDeletion]);

  // Close-এর সময় "Discard changes?" confirm দেখাতে হবে কি না।
  const hasUnsavedMedia = useCallback(
    () => sessionRef.current.size > 0 || pendingRef.current.size > 0,
    []
  );

  return {
    registerUploads,
    trackOrphanedAssets,
    removeAsset,
    finalizeSave,
    discardUnsaved,
    hasUnsavedMedia,

    isDeleting: activeDeletes > 0,
    failedAssets,
    retryFailed,
    isRetrying,
  };
};

export default useMediaLifecycle;