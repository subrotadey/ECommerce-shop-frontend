// src/hooks/useCustomers.js
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  batchUpdateCustomerStatus,
  deleteCustomer,
  exportCustomers,
  getCustomerById,
  getCustomerStats,
  getCustomers,
  sendCustomerMessage,
  updateCustomer,
  updateCustomerStatus
} from '../services/customerService';
import notify from '../utils/notification';

// তালিকা: filter/sort/পেজ বদলালে আগের ডেটা দেখিয়ে রাখে, পুরো পেজ খালি হয় না
export const useCustomers = (filters = {}) =>
  useQuery({
    queryKey: ['customers', filters],
    queryFn: () => getCustomers(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    retry: 1
  });

export const useCustomer = (customerId) =>
  useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 30,
    retry: 1
  });

export const useCustomerStats = () =>
  useQuery({
    queryKey: ['customerStats'],
    queryFn: getCustomerStats,
    staleTime: 1000 * 60,
    retry: 1
  });

// TanStack v5: invalidateQueries-এ অবশ্যই { queryKey }
const useInvalidateCustomers = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    queryClient.invalidateQueries({ queryKey: ['customer'] });
    queryClient.invalidateQueries({ queryKey: ['customerStats'] });
  };
};

export const useUpdateCustomerStatus = () => {
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: ({ customerId, isActive }) => updateCustomerStatus(customerId, isActive),
    onSuccess: (data, variables) => {
      invalidate();

      if (data?.firebaseSynced === false) {
        notify.warning(
          'Saved, but login not changed',
          'Status was saved, but the sign-in block could not be applied. Orders are still blocked.'
        );
        return;
      }

      notify.success(
        'Status Updated',
        `Customer ${variables.isActive ? 'activated' : 'deactivated'} successfully`
      );
    },
    onError: (error) => {
      notify.error('Update Failed', error.message || 'Failed to update customer status');
    }
  });
};

export const useUpdateCustomer = () => {
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: ({ customerId, customerData }) => updateCustomer(customerId, customerData),
    onSuccess: () => {
      invalidate();
      notify.success('Customer Updated', 'Customer details updated successfully');
    },
    onError: (error) => {
      notify.error('Update Failed', error.message || 'Failed to update customer');
    }
  });
};

export const useDeleteCustomer = () => {
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      invalidate();
      notify.success('Customer Deleted', 'Customer deleted successfully');
    },
    onError: (error) => {
      notify.error('Delete Failed', error.message || 'Failed to delete customer');
    }
  });
};

export const useSendMessage = () =>
  useMutation({
    mutationFn: ({ customerId, messageData }) => sendCustomerMessage(customerId, messageData),
    onSuccess: () => {
      notify.success('Message Sent', 'The customer will see it in their notification bell');
    },
    onError: (error) => {
      notify.error('Send Failed', error.message || 'Failed to send message');
    }
  });

export const useExportCustomers = () =>
  useMutation({
    mutationFn: (params) => exportCustomers(params),
    onSuccess: () => {
      notify.success('Export Ready', 'The CSV file has been downloaded');
    },
    onError: (error) => {
      notify.error('Export Failed', error.message || 'Failed to export customers');
    }
  });

export const useBatchUpdateStatus = () => {
  const invalidate = useInvalidateCustomers();

  return useMutation({
    mutationFn: ({ customerIds, isActive }) => batchUpdateCustomerStatus(customerIds, isActive),
    onSuccess: (data) => {
      invalidate();
      notify.success('Batch Update Complete', data.message);
    },
    onError: (error) => {
      notify.error('Batch Update Failed', error.message || 'Failed to update customers');
    }
  });
};

// সব operation এক জায়গায়। options দিলে (যেমন onSuccess) পেজ থেকে modal বন্ধ ইত্যাদি করা যায়।
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

    // States
    isLoading: customersQuery.isPending, // শুধু একদম প্রথম লোড
    isFetching: customersQuery.isFetching, // প্রতিটি refetch
    isLoadingStats: statsQuery.isLoading,
    isUpdating: updateStatusMutation.isPending || updateCustomerMutation.isPending,
    isDeleting: deleteCustomerMutation.isPending,
    isSending: sendMessageMutation.isPending,
    isExporting: exportMutation.isPending,
    isBatchUpdating: batchUpdateMutation.isPending,

    // Errors
    error: customersQuery.error,
    statsError: statsQuery.error,

    // Actions
    updateStatus: (customerId, isActive, options) =>
      updateStatusMutation.mutate({ customerId, isActive }, options),
    updateCustomer: (customerId, customerData, options) =>
      updateCustomerMutation.mutate({ customerId, customerData }, options),
    deleteCustomer: (customerId, options) => deleteCustomerMutation.mutate(customerId, options),
    sendMessage: (customerId, messageData, options) =>
      sendMessageMutation.mutate({ customerId, messageData }, options),
    exportCustomers: (params) => exportMutation.mutate(params),
    batchUpdateStatus: (customerIds, isActive, options) =>
      batchUpdateMutation.mutate({ customerIds, isActive }, options),

    // Refetch
    refetch: customersQuery.refetch,
    refetchStats: statsQuery.refetch
  };
};

export default useCustomerManagement;