// src/services/orderService.js

import axiosInstance from "../utils/axios";

const API_BASE_URL = '/api/orders';

/**
 * Get all orders with pagination and filters (Admin/Staff)
 */

export const getOrders = async (params = {}) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, { params });
    return data;
  } catch (error) {
    console.error('Get orders error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single order details
 */
export const getOrderById = async (orderId) => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/${orderId}`);
    return data;
  } catch (error) {
    console.error('Get order error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (userId, params = {}) => {
  try {
    const { data } = await axiosInstance.get(`/api/users/${userId}/orders`, { params });
    return data;
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update order status (Staff/Admin)
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data } = await axiosInstance.patch(
      `${API_BASE_URL}/${orderId}/status`,
      { status }
    );
    return data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Refund order (Admin only)
 */
export const refundOrder = async (orderId, reason) => {
  try {
    const { data } = await axiosInstance.post(
      `${API_BASE_URL}/${orderId}/refund`,
      { reason }
    );
    return data;
  } catch (error) {
    console.error('Refund order error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get order statistics (Admin)
 */
export const getOrderStats = async () => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/stats/overview`);
    return data;
  } catch (error) {
    console.error('Get order stats error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Export orders to CSV (Admin)
 */
export const exportOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/export/csv`, {
      params,
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Export orders error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Batch update order statuses (Admin)
 */
export const batchUpdateOrderStatus = async (orderIds, status) => {
  try {
    const updatePromises = orderIds.map(id => 
      updateOrderStatus(id, status)
    );
    
    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: true,
      message: `Updated ${successful} orders. ${failed > 0 ? `${failed} failed.` : ''}`,
      successful,
      failed
    };
  } catch (error) {
    console.error('Batch update error:', error);
    throw error;
  }
};

/**
 * Search orders
 */
export const searchOrders = async (searchTerm) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, {
      params: { search: searchTerm, limit: 50 }
    });
    return data;
  } catch (error) {
    console.error('Search orders error:', error);
    throw error.response?.data || error;
  }
};

export default {
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  refundOrder,
  getOrderStats,
  exportOrders,
  batchUpdateOrderStatus,
  searchOrders
};