// src/services/categoryService.js
import axiosInstance from "../utils/axios";

export const getCategoryOverview = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/categories/overview");
    return data;
  } catch (error) {
    console.error("Category overview error:", error);
    throw error.response?.data || error;
  }
};