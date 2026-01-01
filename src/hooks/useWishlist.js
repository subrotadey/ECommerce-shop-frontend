// ============================================
// hooks/useWishlist.js - IMPROVED
// ============================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import useAuth from './useAuth';

const API_URL = '/api/wishlist'; // ✅ Use relative path

const useWishlist = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const userId = currentUser?.email || 'guest';

  // Fetch wishlist
  const { data: wishlist = [], isLoading, isError } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/${userId}`);
      return data.success ? data.data : [];
    },
    enabled: !!userId && userId !== 'guest',
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Fetch wishlist count
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ['wishlistCount', userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/${userId}/count`);
      return data.success ? data.count : 0;
    },
    enabled: !!userId && userId !== 'guest',
    staleTime: 1000 * 60 * 2,
    retry: 1
  });

  // Toggle wishlist mutation
  const toggleMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axiosInstance.post(`${API_URL}/${userId}/toggle`, { productId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', userId]);
      queryClient.invalidateQueries(['wishlistCount', userId]);
    }
  });

  // Remove mutation
  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axiosInstance.delete(`${API_URL}/${userId}/remove/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', userId]);
      queryClient.invalidateQueries(['wishlistCount', userId]);
    }
  });

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => 
      item.productId === productId || 
      item.product?._id === productId
    );
  };

  return {
    wishlist,
    wishlistCount,
    isLoading,
    isError,
    toggleWishlist: toggleMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isInWishlist,
    isToggling: toggleMutation.isPending,
    isRemoving: removeMutation.isPending,
    userId
  };
};

export default useWishlist;