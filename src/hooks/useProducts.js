import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Function to fetch products by category
const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(
    `http://localhost:5000/products?category=${category}`
  );
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

export default useProducts;
