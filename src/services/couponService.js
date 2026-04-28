// src/services/couponService.js

import axiosInstance from '../utils/axios';

const API_BASE_URL = '/api/coupons';

/**
 * Get all coupons (Admin/Staff)
 */
export const getCoupons = async (params = {}) => {
  try {
    const { data } = await axiosInstance.get(API_BASE_URL, { params });
    return data;
  } catch (error) {
    console.error('Get coupons error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single coupon by ID
 */
export const getCouponById = async (couponId) => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/${couponId}`);
    return data;
  } catch (error) {
    console.error('Get coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create new coupon (Admin only)
 */
export const createCoupon = async (couponData) => {
  try {
    const { data } = await axiosInstance.post(API_BASE_URL, couponData);
    return data;
  } catch (error) {
    console.error('Create coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update coupon (Admin only)
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const { data } = await axiosInstance.put(`${API_BASE_URL}/${couponId}`, couponData);
    return data;
  } catch (error) {
    console.error('Update coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete coupon (Admin only)
 */
export const deleteCoupon = async (couponId) => {
  try {
    const { data } = await axiosInstance.delete(`${API_BASE_URL}/${couponId}`);
    return data;
  } catch (error) {
    console.error('Delete coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Validate coupon (Public - for users during checkout)
 */
export const validateCoupon = async (code, cartTotal) => {
  try {
    const { data } = await axiosInstance.post(`${API_BASE_URL}/validate`, {
      code,
      cartTotal
    });
    return data;
  } catch (error) {
    console.error('Validate coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Use coupon (increment usage after successful order)
 */
export const useCoupon = async (code) => {
  try {
    const { data } = await axiosInstance.post(`${API_BASE_URL}/use/${code}`);
    return data;
  } catch (error) {
    console.error('Use coupon error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get coupon statistics (Admin)
 */
export const getCouponStats = async () => {
  try {
    const { data } = await axiosInstance.get(`${API_BASE_URL}/stats/overview`);
    return data;
  } catch (error) {
    console.error('Get coupon stats error:', error);
    throw error.response?.data || error;
  }
};

export default {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  useCoupon,
  getCouponStats
};