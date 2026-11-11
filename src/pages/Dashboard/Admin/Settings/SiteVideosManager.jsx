// Settings/SiteVideosManager.jsx
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Upload } from "lucide-react";

import useSiteVideos from "../../../../hooks/useSiteVideos";
import {
  SITE_VIDEO_GROUPS,
  SITE_VIDEO_MAX_MB,
  SITE_VIDEO_TIPS,
} from "../../../../utils/siteVideos";
import {
  resetSiteVideo,
  uploadSiteVideo,
} from "../../../../services/siteSettingsService";
import notify from "../../../../utils/notification";

const SiteVideosManager = () => {
  const queryClient = useQueryClient();
  const { getVideo, isCustom } = useSiteVideos();
  const [busySlot, setBusySlot] = useState(null);
  const [progress, setProgress] = useState(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["siteVideos"] });

  const handleFile = async (slot, event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // একই ফাইল আবার বাছা যাবে
    if (!file) return;

    setBusySlot(slot);
    setProgress(0);
    try {
      await uploadSiteVideo(slot, file, setProgress);
      await refresh();
      notify.success("Video updated", "The website now shows the new video.");
    } catch (err) {
      notify.error(
        "Upload failed",
        err?.response?.data?.message || err.message || "Please try again."
      );
    } finally {
      setBusySlot(null);
      setProgress(null);
    }
  };

  const handleRemove = async (slot) => {
    if (!window.confirm("Remove this video? The section will be hidden on the home page.")) return;

    setBusySlot(slot);
    try {
      await resetSiteVideo(slot);
      await refresh();
      notify.success("Video removed", "This section is now hidden on the home page.");
    } catch (err) {
      notify.error(
        "Remove failed",
        err?.response?.data?.message || err.message || "Please try again."
      );
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Site Videos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Changes go live immediately. No Save button needed.
        </p>
        <p className="mt-1 text-xs text-gray-500">{SITE_VIDEO_TIPS}</p>
      </div>

      {SITE_VIDEO_GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="font-semibold">{group.title}</h3>
          <p className="mb-3 text-xs text-gray-500">{group.hint}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {group.slots.map(({ key, label }) => {
              const busy = busySlot === key;
              const url = getVideo(key);

              return (
                <div
                  key={key}
                  className="rounded-lg border border-gray-300 bg-white p-2"
                >
                  <div className="relative aspect-video overflow-hidden rounded-md bg-gray-200">
                    {url ? (
                      <video
                        src={url}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full bg-black object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No video yet. Section is hidden.
                      </div>
                    )}

                    {busy && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80">
                        <Loader2 className="animate-spin" size={22} />
                        <span className="text-xs font-medium text-gray-700">
                          {progress !== null && progress < 100
                            ? `Uploading ${progress}%`
                            : "Saving…"}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 truncate text-xs font-medium">{label}</p>
                  <p className="text-[10px] text-gray-500">
                    {isCustom(key) ? "Video uploaded" : "No video"} · max {SITE_VIDEO_MAX_MB} MB
                  </p>

                  <div className="mt-2 flex gap-2">
                    <label
                      className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 ${
                        busy ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Upload size={13} />
                      {isCustom(key) ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => handleFile(key, e)}
                      />
                    </label>

                    {isCustom(key) && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRemove(key)}
                        title="Remove video"
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default SiteVideosManager;