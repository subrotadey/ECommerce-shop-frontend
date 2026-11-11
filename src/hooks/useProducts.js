// src/hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAdminProducts } from "../services/productService";

// Backend base URL is read from the .env file
const API_URL = import.meta.env.VITE_API_URL;

// Fetch products filtered by category
const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(`${API_URL}/products`, {
    params: { category },
  });
  return data;
};

// Fetch all products
const fetchAllProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`);
  return data;
};

// Custom hook: products by category
const useProducts = (category) => {
  return useQuery({
    queryKey: ["products", category], // cache key
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category, // fetch only if category exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// Hook for all products (public, excludes draft/archived)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });
};

// Admin: all products (including drafts)
// Backend: GET /api/admin/products (Firebase token + admin role required)
// Separate queryKey so it does not mix with the public cache
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAdminProducts,
    staleTime: 1000 * 30,
    retry: 1,
  });
};

export default useProducts;