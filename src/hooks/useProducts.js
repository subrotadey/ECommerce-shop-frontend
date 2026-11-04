// src/hooks/useProducts.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAdminProducts } from "../services/productService";

// Function to fetch products by category
const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(
    `https://ecommerce-shop-backend-gr7k.onrender.com/products?category=${category}`
  );
  return data;
};

// Fetch all products
const fetchAllProducts = async () => {
  const { data } = await axios.get(`https://ecommerce-shop-backend-gr7k.onrender.com/products`);
  return data;
};

// Custom hook
const useProducts = (category) => {
  return useQuery({
    queryKey: ["products", category], // cache key
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category, // fetch only if category exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// Hook for all products (public, draft/archived বাদে)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });
};

// Admin: সব product (draft সহ)। Backend: GET /api/admin/products (Firebase token + admin)
// queryKey আলাদা, যাতে public cache-এর সঙ্গে মিশে না যায়।
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAdminProducts,
    staleTime: 1000 * 30,
    retry: 1,
  });
};

export default useProducts;