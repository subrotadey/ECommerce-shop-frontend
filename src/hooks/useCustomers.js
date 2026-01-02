// src/hooks/useCustomers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  sendCustomerMessage,
  exportCustomers,
  batchUpdateCustomerStatus
} from '../services/customerService';
import notify from '../utils/notification';

/**
 * Hook for fetching all customers with filters
 */
export const useCustomers = (filters = {}) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => getCustomers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook for fetching single customer
 */
export const useCustomer = (customerId) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

/**
 * Hook for customer statistics
 */
export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customerStats'],
    queryFn: getCustomerStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * Hook for updating customer status
 */
export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, isActive }) => 
      updateCustomerStatus(customerId, isActive),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customer', variables.customerId]);
      queryClient.invalidateQueries(['customerStats']);
      
      notify.success(
        'Status Updated',
        `Customer ${variables.isActive ? 'activated' : 'deactivated'} successfully`
      );
    },
    onError: (error) => {
      notify.error(
        'Update Failed',
        error.message || 'Failed to update customer status'
      );
    }
  });
};

/**
 * Hook for updating customer details
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, customerData }) => 
      updateCustomer(customerId, customerData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customer', variables.customerId]);
      
      notify.success(
        'Customer Updated',
        'Customer details updated successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Update Failed',
        error.message || 'Failed to update customer'
      );
    }
  });
};

/**
 * Hook for deleting customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
      
      notify.success(
        'Customer Deleted',
        'Customer deleted successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Delete Failed',
        error.message || 'Failed to delete customer'
      );
    }
  });
};

/**
 * Hook for sending message to customer
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({ customerId, messageData }) => 
      sendCustomerMessage(customerId, messageData),
    onSuccess: () => {
      notify.success(
        'Message Sent',
        'Message sent to customer successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Send Failed',
        error.message || 'Failed to send message'
      );
    }
  });
};

/**
 * Hook for exporting customers
 */
export const useExportCustomers = () => {
  return useMutation({
    mutationFn: exportCustomers,
    onSuccess: () => {
      notify.success(
        'Export Successful',
        'Customer data exported successfully'
      );
    },
    onError: (error) => {
      notify.error(
        'Export Failed',
        error.message || 'Failed to export customers'
      );
    }
  });
};

/**
 * Hook for batch updating customer statuses
 */
export const useBatchUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerIds, isActive }) => 
      batchUpdateCustomerStatus(customerIds, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
      
      notify.success(
        'Batch Update Complete',
        data.message
      );
    },
    onError: (error) => {
      notify.error(
        'Batch Update Failed',
        error.message || 'Failed to update customers'
      );
    }
  });
};

/**
 * Main hook with all customer operations
 */
const useCustomerManagement = (filters = {}) => {
  const customersQuery = useCustomers(filters);
  const statsQuery = useCustomerStats();
  const updateStatusMutation = useUpdateCustomerStatus();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const sendMessageMutation = useSendMessage();
  const exportMutation = useExportCustomers();
  const batchUpdateMutation = useBatchUpdateStatus();

  return {
    // Data
    customers: customersQuery.data?.customers || [],
    pagination: customersQuery.data?.pagination || {},
    stats: statsQuery.data?.stats || {},
    
    // Loading states
    isLoading: customersQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isUpdating: updateStatusMutation.isPending || updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isExporting: exportMutation.isPending,
    isBatchUpdating: batchUpdateMutation.isPending,
    
    // Error states
    error: customersQuery.error,
    statsError: statsQuery.error,
    
    // Actions
    updateStatus: (customerId, isActive) => 
      updateStatusMutation.mutate({ customerId, isActive }),
    updateCustomer: (customerId, customerData) => 
      updateCustomerMutation.mutate({ customerId, customerData }),
    deleteCustomer: deleteCustomerMutation.mutate,
    sendMessage: (customerId, messageData) => 
      sendMessageMutation.mutate({ customerId, messageData }),
    exportCustomers: exportMutation.mutate,
    batchUpdateStatus: (customerIds, isActive) => 
      batchUpdateMutation.mutate({ customerIds, isActive }),
    
    // Refetch
    refetch: customersQuery.refetch,
    refetchStats: statsQuery.refetch
  };
};

export default useCustomerManagement;