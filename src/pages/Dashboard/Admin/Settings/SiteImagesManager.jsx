import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Upload } from "lucide-react";

import useSiteImages from "../../../../hooks/useSiteImages";
import { SITE_IMAGE_GROUPS } from "../../../../utils/siteImages";
import {
  resetSiteImage,
  uploadSiteImage,
} from "../../../../services/siteSettingsService";
import notify from "../../../../utils/notification";

const SiteImagesManager = () => {
  const queryClient = useQueryClient();
  const { getImage, isCustom } = useSiteImages();
  const [busySlot, setBusySlot] = useState(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["siteImages"] });

  const handleFile = async (slot, event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // একই ফাইল আবার বাছা যাবে
    if (!file) return;

    setBusySlot(slot);
    try {
      await uploadSiteImage(slot, file);
      await refresh();
      notify.success("Image updated", "The website now shows the new image.");
    } catch (err) {
      notify.error(
        "Upload failed",
        err?.response?.data?.message || err.message || "Please try again."
      );
    } finally {
      setBusySlot(null);
    }
  };

  const handleReset = async (slot) => {
    if (!window.confirm("Go back to the default image?")) return;

    setBusySlot(slot);
    try {
      await resetSiteImage(slot);
      await refresh();
      notify.success("Reset done", "The default image is shown again.");
    } catch (err) {
      notify.error(
        "Reset failed",
        err?.response?.data?.message || err.message || "Please try again."
      );
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Site Images</h2>
        <p className="mt-1 text-sm text-gray-600">
          Changes go live immediately. No Save button needed.
        </p>
      </div>

      {SITE_IMAGE_GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="font-semibold">{group.title}</h3>
          <p className="mb-3 text-xs text-gray-500">{group.hint}</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {group.slots.map(({ key, label }) => {
              const busy = busySlot === key;

              return (
                <div
                  key={key}
                  className="rounded-lg border border-gray-300 bg-white p-2"
                >
                  <div
                    className={`relative overflow-hidden rounded-md bg-gray-200 ${
                      group.logo ? "h-24" : "aspect-[3/4]"
                    }`}
                  >
                    <img
                      src={getImage(key, 400)}
                      alt={label}
                      className={`h-full w-full ${
                        group.logo ? "object-contain p-2" : "object-cover"
                      }`}
                    />
                    {busy && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="animate-spin" size={22} />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 truncate text-xs font-medium">{label}</p>
                  <p className="text-[10px] text-gray-500">
                    {isCustom(key) ? "Custom image" : "Default image"}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <label
                      className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 ${
                        busy ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Upload size={13} />
                      Change
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => handleFile(key, e)}
                      />
                    </label>

                    {isCustom(key) && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleReset(key)}
                        title="Use default"
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

export default SiteImagesManager;