// src/services/customerService.js
import axiosInstance from '../utils/axios';

const API_BASE_URL = '/api/customers';

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
export const exportCustomers = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/export/csv`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customers-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Export customers error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Batch update customer statuses
 */
export const batchUpdateCustomerStatus = async (customerIds, isActive) => {
  try {
    const updatePromises = customerIds.map(id => 
      updateCustomerStatus(id, isActive)
    );
    
    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: true,
      message: `Updated ${successful} customers. ${failed > 0 ? `${failed} failed.` : ''}`,
      successful,
      failed
    };
  } catch (error) {
    console.error('Batch update error:', error);
    throw error;
  }
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