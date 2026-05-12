// src/hooks/useSingleProduct.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProductById = async (id) => {
  const { data } = await axios.get(`http://localhost:5000/products/${id}`);
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
