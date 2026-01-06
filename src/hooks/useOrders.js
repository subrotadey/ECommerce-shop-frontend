// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  refundOrder,
  getOrderStats,
  exportOrders,
  batchUpdateOrderStatus
} from '../services/orderService';
import notify from '../utils/notification';

/**
 * Hook for fetching all orders with filters
 */
export const useOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

/**
 * Hook for fetching single order
 */
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60,
    retry: 1,
  });
};

/**
 * Hook for order statistics
 */
export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: getOrderStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * Hook for updating order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => 
      updateOrderStatus(orderId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', variables.orderId]);
      queryClient.invalidateQueries(['orderStats']);
      
      notify.success(
        'Status Updated',
        `Order status changed to ${variables.status}`
      );
    },
    onError: (error) => {
      notify.error(
        'Update Failed',
        error.message || 'Failed to update order status'
      );
    }
  });
};

/**
 * Hook for refunding order
 */
export const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) => 
      refundOrder(orderId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', variables.orderId]);
      queryClient.invalidateQueries(['orderStats']);
      
      notify.success(
        'Refund Processed',
        'Order has been refunded successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Refund Failed',
        error.message || 'Failed to process refund'
      );
    }
  });
};

/**
 * Hook for exporting orders
 */
export const useExportOrders = () => {
  return useMutation({
    mutationFn: exportOrders,
    onSuccess: () => {
      notify.success(
        'Export Successful',
        'Orders exported successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Export Failed',
        error.message || 'Failed to export orders'
      );
    }
  });
};

/**
 * Hook for batch updating order statuses
 */
export const useBatchUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderIds, status }) => 
      batchUpdateOrderStatus(orderIds, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orderStats']);
      
      notify.success(
        'Batch Update Complete',
        data.message
      );
    },
    onError: (error) => {
      notify.error(
        'Batch Update Failed',
        error.message || 'Failed to update orders'
      );
    }
  });
};

/**
 * Main hook with all order operations
 */
const useOrderManagement = (filters = {}) => {
  const ordersQuery = useOrders(filters);
  const statsQuery = useOrderStats();
  const updateStatusMutation = useUpdateOrderStatus();
  const refundMutation = useRefundOrder();
  const exportMutation = useExportOrders();
  const batchUpdateMutation = useBatchUpdateStatus();

  return {
    // Data
    orders: ordersQuery.data?.orders || [],
    pagination: ordersQuery.data?.pagination || {},
    stats: statsQuery.data?.stats || {},
    
    // Loading states
    isLoading: ordersQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isUpdating: updateStatusMutation.isPending,
    isRefunding: refundMutation.isPending,
    isExporting: exportMutation.isPending,
    isBatchUpdating: batchUpdateMutation.isPending,
    
    // Error states
    error: ordersQuery.error,
    statsError: statsQuery.error,
    
    // Actions
    updateStatus: (orderId, status) => 
      updateStatusMutation.mutate({ orderId, status }),
    refundOrder: (orderId, reason) => 
      refundMutation.mutate({ orderId, reason }),
    exportOrders: exportMutation.mutate,
    batchUpdateStatus: (orderIds, status) => 
      batchUpdateMutation.mutate({ orderIds, status }),
    
    // Refetch
    refetch: ordersQuery.refetch,
    refetchStats: statsQuery.refetch
  };
};

export default useOrderManagement;