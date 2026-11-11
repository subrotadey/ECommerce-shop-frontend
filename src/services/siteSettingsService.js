// src/services/siteSettingsService.js
import axios from "axios";
import axiosInstance from "../utils/axios";
import { SITE_VIDEO_MAX_MB, SITE_VIDEO_TYPES } from "../utils/siteVideos";

// notificationService যেভাবে path লেখে সেভাবে মিলান (কোথায় /api লাগে দেখে)
const BASE = "/site-settings";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

// ─── Images ──────────────────────────────────────────────────────────────────
export const uploadSiteImage = async (slot, file) => {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Only PNG, JPG or WebP images are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller");
  }

  const { data: sig } = await axiosInstance.get(`${BASE}/upload-signature`);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const uploaded = await response.json();

  if (!response.ok) {
    throw new Error(uploaded?.error?.message || "Cloudinary upload failed");
  }

  const { data } = await axiosInstance.put(`${BASE}/images/${slot}`, {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });

  return data;
};

export const resetSiteImage = async (slot) => {
  const { data } = await axiosInstance.delete(`${BASE}/images/${slot}`);
  return data;
};

// ─── Videos ──────────────────────────────────────────────────────────────────
// onProgress(0-100) দেওয়া থাকলে আপলোডের অগ্রগতি জানায়
export const uploadSiteVideo = async (slot, file, onProgress) => {
  if (!SITE_VIDEO_TYPES.includes(file.type)) {
    throw new Error("Only MP4, WebM or MOV videos are allowed");
  }
  if (file.size > SITE_VIDEO_MAX_MB * 1024 * 1024) {
    throw new Error(`Video must be ${SITE_VIDEO_MAX_MB} MB or smaller`);
  }

  const { data: sig } = await axiosInstance.get(`${BASE}/video-upload-signature`);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  let uploaded;
  try {
    // সাধারণ axios (token ছাড়া): Cloudinary-তে সরাসরি যায়
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
      form,
      {
        onUploadProgress: (e) => {
          if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
        },
      }
    );
    uploaded = res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.error?.message || "Cloudinary upload failed");
  }

  const { data } = await axiosInstance.put(`${BASE}/videos/${slot}`, {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });

  return data;
};

export const resetSiteVideo = async (slot) => {
  const { data } = await axiosInstance.delete(`${BASE}/videos/${slot}`);
  return data;
};