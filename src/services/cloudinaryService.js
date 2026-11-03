// src/services/cloudinaryService.js

import axios from 'axios';
import axiosInstance from '../utils/axios';

import {
  CLOUDINARY_CONFIG,
  IMAGE_UPLOAD_CONFIG,
  VIDEO_UPLOAD_CONFIG,
  formatTransformations,
  getVideoThumbnailUrl,
  getCloudinaryUrl,
  isCloudinaryConfigured,
} from '../config/cloudinary';

// --------------------------------------
// CLOUDINARY HELPERS
// --------------------------------------

const RESOURCE_TYPES = ['image', 'video'];

// Backend শুধু এই দুই status-কে "delete সফল" বলে।
const VERIFIED_DELETE_STATUSES = ['deleted', 'not_found'];

const getCloudinaryUploadUrl = (resourceType) => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary configuration is missing.');
  }

  if (!RESOURCE_TYPES.includes(resourceType)) {
    throw new Error('Invalid Cloudinary resource type.');
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
};

const getFileExtension = (file) => {
  return file?.name?.split('.').pop()?.toLowerCase() || '';
};

const validateFile = (file, config, resourceType) => {
  if (!file || typeof file !== 'object') {
    throw new Error('Please select a valid file.');
  }

  const extension = getFileExtension(file);

  if (!config.allowedFormats.includes(extension)) {
    throw new Error(
      `Invalid file format. Allowed formats: ${config.allowedFormats.join(', ')}.`
    );
  }

  if (file.size > config.maxFileSize) {
    const maxSizeMB = config.maxFileSize / (1024 * 1024);

    throw new Error(`File size cannot exceed ${maxSizeMB} MB.`);
  }

  if (
    file.type &&
    !file.type.toLowerCase().startsWith(`${resourceType}/`)
  ) {
    throw new Error(`Please select a valid ${resourceType} file.`);
  }
};

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const createProgressHandler = (onProgress) => {
  return (event) => {
    if (!onProgress || !event.total) return;

    const percentage = Math.round(
      (event.loaded * 100) / event.total
    );

    onProgress(percentage);
  };
};

const createUploadFormData = (file, folder, resourceType = 'image') => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append(
    'upload_preset',
    resourceType === 'video'
      ? CLOUDINARY_CONFIG.videoUploadPreset
      : CLOUDINARY_CONFIG.uploadPreset
  );
  formData.append('folder', folder);

  return formData;
};

// publicId + resourceType থেকে unique key।
// Image ও video-র publicId আলাদা namespace-এ থাকে, তাই type সহ key।
export const getAssetKey = (asset) =>
  `${asset?.resourceType || 'image'}:${asset?.publicId}`;

// --------------------------------------
// IMAGE UPLOAD
// --------------------------------------

export const uploadImage = async (
  file,
  folder = IMAGE_UPLOAD_CONFIG.folder,
  onProgress
) => {
  try {
    validateFile(file, IMAGE_UPLOAD_CONFIG, 'image');

    const formData = createUploadFormData(file, folder, 'video');

    // Keep unsigned upload parameters minimal.
    // Transformations are applied through Cloudinary delivery URLs.
    const response = await axios.post(
      getCloudinaryUploadUrl('image'),
      formData,
      {
        onUploadProgress: createProgressHandler(onProgress),
      }
    );

    const data = response.data;

    return {
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: getCloudinaryUrl(
        data.public_id,
        IMAGE_UPLOAD_CONFIG.thumbnailTransformation
      ),
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes,
      isMain: false,
    };
  } catch (error) {
    console.error(
      'Cloudinary image upload error:',
      error.response?.data || error
    );

    throw new Error(
      getErrorMessage(error, 'Image upload failed.')
    );
  }
};

// --------------------------------------
// VIDEO UPLOAD
// --------------------------------------

export const uploadVideo = async (
  file,
  folder = VIDEO_UPLOAD_CONFIG.folder,
  onProgress
) => {
  try {
    validateFile(file, VIDEO_UPLOAD_CONFIG, 'video');

    const formData = createUploadFormData(file, folder);

    const response = await axios.post(
      getCloudinaryUploadUrl('video'),
      formData,
      {
        onUploadProgress: createProgressHandler(onProgress),
      }
    );

    const data = response.data;

    return {
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: getVideoThumbnailUrl(data.public_id),
      duration: data.duration,
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes,
    };
  } catch (error) {
    console.error(
      'Cloudinary video upload error:',
      error.response?.data || error
    );

    throw new Error(
      getErrorMessage(error, 'Video upload failed.')
    );
  }
};

// --------------------------------------
// DELETE SINGLE ASSET (VERIFIED)
// --------------------------------------
//
// সফল হলে resolve করে: { publicId, resourceType, status, alreadyDeleted }
//   status = 'deleted'   -> Cloudinary থেকে এইমাত্র মুছেছে
//   status = 'not_found' -> আগেই মুছে গেছে (এটিও সফল ধরা হয়)
//
// ব্যর্থ হলে reject করে। Error-এ থাকে:
//   error.inUse  -> true হলে saved product এখনো asset ব্যবহার করছে (backend 409)
//   error.status -> HTTP status
//   error.publicId, error.resourceType
//
// Backend verify না করলে কখনো success ধরা হবে না।

export const deleteAsset = async (
  publicId,
  resourceType = 'image'
) => {
  if (!publicId) {
    throw new Error('Cloudinary public ID is required.');
  }

  if (!RESOURCE_TYPES.includes(resourceType)) {
    throw new Error('Invalid Cloudinary resource type.');
  }

  const endpoint =
    resourceType === 'video'
      ? '/cloudinary/delete/video'
      : '/cloudinary/delete/image';

  let response;

  try {
    response = await axiosInstance.delete(endpoint, {
      data: { publicId },
      timeout: 30000,
    });
  } catch (error) {
    const deleteError = new Error(
      getErrorMessage(error, 'Failed to delete Cloudinary asset.')
    );

    deleteError.status = error?.response?.status;
    deleteError.inUse =
      error?.response?.status === 409 ||
      error?.response?.data?.inUse === true;
    deleteError.publicId = publicId;
    deleteError.resourceType = resourceType;

    throw deleteError;
  }

  const data = response?.data;

  if (
    data?.success !== true ||
    !VERIFIED_DELETE_STATUSES.includes(data?.status)
  ) {
    const verifyError = new Error(
      data?.message || 'Cloudinary did not confirm the deletion.'
    );

    verifyError.status = response?.status;
    verifyError.publicId = publicId;
    verifyError.resourceType = resourceType;

    throw verifyError;
  }

  return {
    ...data,
    publicId,
    resourceType,
    status: data.status,
    alreadyDeleted: data.status === 'not_found',
  };
};

// --------------------------------------
// DELETE MULTIPLE ASSETS (VERIFIED)
// --------------------------------------
//
// প্রতিটি asset আলাদাভাবে verify হয়। কোনোটি ব্যর্থ হলে বাকিগুলো থামে না।
//
// ফেরত দেয়:
//   success -> সব asset verified delete হলে true
//   deleted -> সফল asset-এর তালিকা ({ publicId, resourceType, status })
//   failed  -> ব্যর্থ asset-এর তালিকা ({ publicId, resourceType, error, inUse })
//             publicId ও resourceType এখানে সবসময় থাকে, retry-র জন্য।
//   results -> আগের মতো Promise.allSettled-এর ফলাফল (backward compatibility)

export const deleteMultipleAssets = async (assets = []) => {
  const uniqueAssets = [
    ...new Map(
      assets
        .filter((asset) => asset?.publicId)
        .map((asset) => [
          getAssetKey(asset),
          {
            publicId: asset.publicId,
            resourceType: asset.resourceType || 'image',
          },
        ])
    ).values(),
  ];

  const results = await Promise.allSettled(
    uniqueAssets.map((asset) =>
      deleteAsset(asset.publicId, asset.resourceType)
    )
  );

  const deleted = [];
  const failed = [];

  results.forEach((result, index) => {
    const asset = uniqueAssets[index];

    if (result.status === 'fulfilled') {
      deleted.push({
        publicId: asset.publicId,
        resourceType: asset.resourceType,
        status: result.value.status,
      });
    } else {
      failed.push({
        publicId: asset.publicId,
        resourceType: asset.resourceType,
        error: result.reason?.message || 'Deletion failed.',
        inUse: Boolean(result.reason?.inUse),
      });
    }
  });

  return {
    success: failed.length === 0,
    deleted,
    failed,
    results,
  };
};

// --------------------------------------
// MULTIPLE IMAGE UPLOAD
// --------------------------------------

export const uploadMultipleImages = async (
  files,
  folder = IMAGE_UPLOAD_CONFIG.folder,
  onProgress
) => {
  const selectedFiles = Array.from(files || []);

  if (!selectedFiles.length) return [];

  if (selectedFiles.length > IMAGE_UPLOAD_CONFIG.maxFiles) {
    throw new Error(
      `You can upload a maximum of ${IMAGE_UPLOAD_CONFIG.maxFiles} images.`
    );
  }

  const uploadedImages = [];

  try {
    for (let index = 0; index < selectedFiles.length; index++) {
      const image = await uploadImage(
        selectedFiles[index],
        folder,
        (fileProgress) => {
          onProgress?.({
            current: index + 1,
            total: selectedFiles.length,
            fileProgress,
            percentage: Math.round(
              ((index * 100) + fileProgress) / selectedFiles.length
            ),
          });
        }
      );

      uploadedImages.push({
        ...image,
        order: uploadedImages.length,
        isMain: uploadedImages.length === 0,
      });
    }

    return uploadedImages;
  } catch (error) {
    // মাঝপথে ব্যর্থ হলে আগে upload হওয়া image মুছে ফেলার চেষ্টা।
    const cleanup = await deleteMultipleAssets(
      uploadedImages.map((image) => ({
        publicId: image.publicId,
        resourceType: 'image',
      }))
    );

    // মুছতে না পারা asset হারাতে দেওয়া যাবে না: caller track করতে পারবে।
    error.orphanedAssets = cleanup.failed;

    throw error;
  }
};

// --------------------------------------
// MULTIPLE VIDEO UPLOAD
// --------------------------------------

export const uploadMultipleVideos = async (
  files,
  folder = VIDEO_UPLOAD_CONFIG.folder,
  onProgress
) => {
  const selectedFiles = Array.from(files || []);

  if (!selectedFiles.length) return [];

  if (selectedFiles.length > VIDEO_UPLOAD_CONFIG.maxFiles) {
    throw new Error(
      `You can upload a maximum of ${VIDEO_UPLOAD_CONFIG.maxFiles} videos.`
    );
  }

  const uploadedVideos = [];

  try {
    for (let index = 0; index < selectedFiles.length; index++) {
      const video = await uploadVideo(
        selectedFiles[index],
        folder,
        (fileProgress) => {
          onProgress?.({
            current: index + 1,
            total: selectedFiles.length,
            fileProgress,
            percentage: Math.round(
              ((index * 100) + fileProgress) / selectedFiles.length
            ),
          });
        }
      );

      uploadedVideos.push(video);
    }

    return uploadedVideos;
  } catch (error) {
    const cleanup = await deleteMultipleAssets(
      uploadedVideos.map((video) => ({
        publicId: video.publicId,
        resourceType: 'video',
      }))
    );

    error.orphanedAssets = cleanup.failed;

    throw error;
  }
};