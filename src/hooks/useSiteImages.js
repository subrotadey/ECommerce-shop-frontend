// src/hooks/useSiteImages.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";
import { SITE_IMAGE_DEFAULTS } from "../utils/siteImages";

const CACHE_KEY = "siteImages:v1";

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || undefined;
  } catch {
    return undefined;
  }
};

// Cloudinary ছবি হলে ছোট ও দ্রুত ভার্সন চায়; অন্য URL অপরিবর্তিত
export const optimizeImage = (url, width) => {
  if (
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/image/upload/")
  ) {
    return url;
  }
  const transform = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
};

const useSiteImages = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["siteImages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/site-settings"); // /api prefix নিয়ে নিচের নোট দেখুন
      const images = res.data?.images || {};
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(images));
      } catch {
        /* ignore */
      }
      return images;
    },
    placeholderData: readCache, // আগের ভিজিটের ছবি দিয়ে ঝলকানি কমায়
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const images = data || {};

  const getImage = (slot, width) =>
    optimizeImage(images[slot] || SITE_IMAGE_DEFAULTS[slot], width);

  const isCustom = (slot) => Boolean(images[slot]);

  return { getImage, isCustom, isLoading };
};

export default useSiteImages;