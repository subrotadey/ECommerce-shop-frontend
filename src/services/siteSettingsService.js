import axiosInstance from "../utils/axios";

// notificationService যেভাবে path লেখে সেভাবে মিলান (কোথায় /api লাগে দেখে)
const BASE = "/site-settings";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

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