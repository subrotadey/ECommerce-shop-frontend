// ============================================
// hooks/useWishlist.js
// ============================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import notify from '../utils/notification';
import useAuth from './useAuth';

const API_URL = '/wishlist'; // ✅ Use relative path

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

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item =>
      item.productId === productId ||
      item.product?._id === productId
    );
  };

  // TanStack Query v5: invalidateQueries e object ({ queryKey }) dite hoy
  const invalidateWishlist = () => {
    queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
    queryClient.invalidateQueries({ queryKey: ['wishlistCount', userId] });
  };

  // Toggle wishlist mutation (toast ekhanei — jate sob jaigay ek rokom kaj kore)
  const toggleMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axiosInstance.post(`${API_URL}/${userId}/toggle`, { productId });
      return data;
    },
    // fallback er jonno: click er somoy product ta wishlist e chilo kina
    onMutate: (productId) => ({ wasInWishlist: isInWishlist(productId) }),
    onSuccess: (data, _productId, context) => {
      invalidateWishlist();
      // server ja bole (data.inWishlist) seta-i sotti; na thakle onMutate er hishab
      const nowInWishlist =
        typeof data?.inWishlist === 'boolean' ? data.inWishlist : !context?.wasInWishlist;
      if (nowInWishlist) {
        notify.success('Added to wishlist');
      } else {
        notify.info('Removed from wishlist');
      }
    },
    onError: () => {
      notify.error('Something went wrong', 'Please try again.');
    },
  });

  // Remove mutation
  // (toast Wishlist page nijei dekhay — onSuccess/onError callback diye)
  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axiosInstance.delete(`${API_URL}/${userId}/remove/${productId}`);
      return data;
    },
    onSuccess: invalidateWishlist,
  });

  // Guest hole login korte bolbe; noile toggle korbe.
  // options (onSuccess/onError) dile mutate er moto kaj kore.
  const toggleWishlist = (productId, options) => {
    if (userId === 'guest') {
      notify.warning('Please login to save items', '', 1800);
      return;
    }
    toggleMutation.mutate(productId, options);
  };

  return {
    wishlist,
    wishlistCount,
    isLoading,
    isError,
    toggleWishlist,
    removeFromWishlist: removeMutation.mutate,
    isInWishlist,
    isToggling: toggleMutation.isPending,
    isRemoving: removeMutation.isPending,
    userId
  };
};

export default useWishlist;