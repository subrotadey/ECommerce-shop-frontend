// src/services/customerService.js
import axiosInstance from '../utils/axios';

const API_BASE_URL = '/customers';

/**
 * Get all customers with pagination and filters
 */
export const getCustomers = async (params = {}) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, { params });
    return data;
  } catch (error) {
    console.error('Get customers error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single customer details
 */
export const getCustomerById = async (customerId) => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/${customerId}`);
    return data;
  } catch (error) {
    console.error('Get customer error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update customer status (active/inactive)
 */
export const updateCustomerStatus = async (customerId, isActive) => {
  try {
    const { data } = await axiosInstance.patch(
      `${API_BASE_URL}/${customerId}/status`,
      { isActive }
    );
    return data;
  } catch (error) {
    console.error('Update customer status error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update customer details
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const { data } = await axiosInstance.patch(
      `${API_BASE_URL}/${customerId}`,
      customerData
    );
    return data;
  } catch (error) {
    console.error('Update customer error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete customer
 */
export const deleteCustomer = async (customerId) => {
  try {
    const { data } = await axiosInstance.delete(`${API_BASE_URL}/${customerId}`);
    return data;
  } catch (error) {
    console.error('Delete customer error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get customer statistics
 */
export const getCustomerStats = async () => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/stats/overview`);
    return data;
  } catch (error) {
    console.error('Get customer stats error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Send message to customer
 */
export const sendCustomerMessage = async (customerId, messageData) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_BASE_URL}/${customerId}/message`,
      messageData
    );
    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Export customers to CSV
 */
export const exportCustomers = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/export/csv`, {
      params,
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: 'text/csv;charset=utf-8' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Export customers error:', error);
    // blob অবস্থায় error-এর বার্তা পড়া যায় না
    if (error.response?.data instanceof Blob) throw new Error('Export failed');
    throw error.response?.data || error;
  }
};

/**
 * Batch update customer statuses
 */
export const batchUpdateCustomerStatus = async (customerIds, isActive) => {
  const results = await Promise.allSettled(
    customerIds.map((id) => updateCustomerStatus(id, isActive))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - successful;

  // সবগুলো ব্যর্থ হলে "সফল" দেখানো যাবে না
  if (successful === 0) {
    const firstError = results.find((r) => r.status === 'rejected')?.reason;
    throw new Error(firstError?.message || 'No customers were updated');
  }

  return {
    success: true,
    message: `Updated ${successful} customer(s).${failed > 0 ? ` ${failed} failed.` : ''}`,
    successful,
    failed
  };
};

/**
 * Search customers
 */
export const searchCustomers = async (searchTerm) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, {
      params: { search: searchTerm, limit: 50 }
    });
    return data;
  } catch (error) {
    console.error('Search customers error:', error);
    throw error.response?.data || error;
  }
};

export default {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  sendCustomerMessage,
  exportCustomers,
  batchUpdateCustomerStatus,
  searchCustomers
};