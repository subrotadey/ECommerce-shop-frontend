// src/utils/siteVideos.js
// Groups and labels for the admin Site Videos page.
// Slot keys must match SITE_VIDEO_SLOTS in the backend.

export const SITE_VIDEO_MAX_MB = 40;
export const SITE_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const SITE_VIDEO_GROUPS = [
  {
    title: "Brand Video Section",
    hint: "Shown below the trust bar, before Categories. If no video is uploaded, this section is hidden on the home page.",
    slots: [{ key: "brandVideo", label: "Brand video" }],
  },
  {
    title: "Collection Video Section",
    hint: "Shown between the Abaya and Hijab sections. If no video is uploaded, this section is hidden on the home page.",
    slots: [{ key: "collectionVideo", label: "Collection video" }],
  },
];

export const SITE_VIDEO_TIPS =
  "Best results: 16:9 (e.g. 1920×1080), 5–15 seconds, MP4, no audio, around 10 MB. Maximum 40 MB.";