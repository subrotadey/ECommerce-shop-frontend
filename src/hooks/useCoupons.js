// src/hooks/useCoupons.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
  validateCoupon
} from '../services/couponService';
import notify from '../utils/notification';

/**
 * Hook for fetching all coupons
 */
export const useCoupons = (filters = {}) => {
  return useQuery({
    queryKey: ['coupons', filters],
    queryFn: () => getCoupons(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook for fetching single coupon
 */
export const useCoupon = (couponId) => {
  return useQuery({
    queryKey: ['coupon', couponId],
    queryFn: () => getCouponById(couponId),
    enabled: !!couponId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

/**
 * Hook for coupon statistics
 */
export const useCouponStats = () => {
  return useQuery({
    queryKey: ['couponStats'],
    queryFn: getCouponStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * Hook for creating coupon
 */
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['couponStats']);
      
      notify.success(
        'Coupon Created',
        `Coupon "${data.coupon.code}" created successfully`
      );
    },
    onError: (error) => {
      notify.error(
        'Create Failed',
        error.message || 'Failed to create coupon'
      );
    }
  });
};

/**
 * Hook for updating coupon
 */
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ couponId, couponData }) => 
      updateCoupon(couponId, couponData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['coupon', variables.couponId]);
      queryClient.invalidateQueries(['couponStats']);
      
      notify.success(
        'Coupon Updated',
        'Coupon updated successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Update Failed',
        error.message || 'Failed to update coupon'
      );
    }
  });
};

/**
 * Hook for deleting coupon
 */
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons']);
      queryClient.invalidateQueries(['couponStats']);
      
      notify.success(
        'Coupon Deleted',
        'Coupon deleted successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Delete Failed',
        error.message || 'Failed to delete coupon'
      );
    }
  });
};

/**
 * Hook for validating coupon (for users during checkout)
 */
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ code, cartTotal }) => validateCoupon(code, cartTotal),
    onSuccess: (data) => {
      notify.success(
        'Coupon Applied',
        `${data.coupon.code} applied! You saved $${data.coupon.discount.toFixed(2)}`
      );
    },
    onError: (error) => {
      notify.error(
        'Invalid Coupon',
        error.message || 'Failed to apply coupon'
      );
    }
  });
};

/**
 * Main hook with all coupon operations
 */
const useCouponManagement = (filters = {}) => {
  const couponsQuery = useCoupons(filters);
  const statsQuery = useCouponStats();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();
  const validateMutation = useValidateCoupon();

  return {
    // Data
    coupons: couponsQuery.data?.coupons || [],
    stats: statsQuery.data?.stats || {},
    
    // Loading states
    isLoading: couponsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isValidating: validateMutation.isPending,
    
    // Error states
    error: couponsQuery.error,
    statsError: statsQuery.error,
    
    // Actions
    createCoupon: createMutation.mutate,
    updateCoupon: (couponId, couponData) => 
      updateMutation.mutate({ couponId, couponData }),
    deleteCoupon: deleteMutation.mutate,
    validateCoupon: (code, cartTotal) =>
      validateMutation.mutate({ code, cartTotal }),
    
    // Refetch
    refetch: couponsQuery.refetch,
    refetchStats: statsQuery.refetch
  };
};

export default useCouponManagement;