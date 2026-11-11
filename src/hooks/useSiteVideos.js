// src/hooks/useSiteVideos.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

const useSiteVideos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["siteVideos"],
    queryFn: async () => {
      const res = await axiosInstance.get("/site-settings/videos");
      return res.data?.videos || {};
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const videos = data || {};

  const getVideo = (slot) => videos[slot] || null;
  const isCustom = (slot) => Boolean(videos[slot]);

  return { getVideo, isCustom, isLoading };
};

export default useSiteVideos;