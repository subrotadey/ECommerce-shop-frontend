import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAuth from './useAuth';

const API_URL = 'http://localhost:5000/api/wishlist';

const useWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get current user
  const userId = user?.email || user?.uid || 'guest'; // Use email or uid as userId

  // Fetch wishlist
  const { data: wishlist = [], isLoading, isError } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${userId}`);
      return data;
    },
    enabled: !!userId && userId !== 'guest', // Only fetch if user is logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 👇 Fetch wishlist count (for navbar)
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ['wishlistCount', userId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${userId}/count`);
      return data.count;
    },
    enabled: !!userId && userId !== 'guest',
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Toggle wishlist mutation
  const toggleMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axios.post(`${API_URL}/${userId}/toggle`, { productId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', userId]);
        queryClient.invalidateQueries(['wishlistCount', userId]);
    },
    onError: (error) => {
      console.error('Toggle wishlist error:', error);
    }
  });

  // Remove mutation
  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axios.delete(`${API_URL}/${userId}/remove/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', userId]);
    },
    onError: (error) => {
      console.error('Remove from wishlist error:', error);
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