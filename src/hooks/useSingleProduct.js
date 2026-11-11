// src/hooks/useSingleProduct.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Backend base URL is read from the .env file
const API_URL = import.meta.env.VITE_API_URL;

const fetchProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};

export default function useSingleProduct(productId) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}