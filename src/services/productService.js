// src/services/productService.js

import axiosInstance from '../utils/axios';
import notify from '../utils/notification';

/**
 * Generate SEO-friendly slug
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Form values -> API payload
 *
 * - media.images : আগের structure
 * - media.videos : নতুন canonical (সর্বোচ্চ 3টি)
 * - media.video / video : legacy mirror (প্রথম video বা null),
 *   যাতে ProductDetails আগের মতো চলে।
 * Form-এর `images`, `videos` top-level field-ও backend-এ যায় (backend নিজে normalize করে)।
 */
const buildProductPayload = (productData) => {
  const images = (productData.images || []).map((img, index) => ({
    url: img.url,
    publicId: img.publicId,
    thumbnailUrl: img.thumbnailUrl || img.url,
    isMain: img.isMain || index === 0,
    order: index,
  }));

  const videos = (productData.videos || []).map((video) => ({
    url: video.url,
    publicId: video.publicId,
    thumbnailUrl: video.thumbnailUrl || '',
    duration: video.duration ?? null,
  }));

  const { video: _legacyVideo, ...rest } = productData;

  return {
    ...rest,
    slug: generateSlug(productData.productName),
    images,
    videos,
    video: videos[0] || null,
    media: {
      images,
      videos,
      video: videos[0] || null,
    },
  };
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
  try {
    const payload = {
      ...buildProductPayload(productData),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await axiosInstance.post('/products', payload);
    return response.data;
  } catch (error) {
    console.error('Create product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const payload = {
      ...buildProductPayload(productData),
      updatedAt: new Date().toISOString(),
    };

    const response = await axiosInstance.put(`/products/${productId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Get product error:', error);
    notify.error('Failed to load product', 'Product not found or network error');
    throw error.response?.data || error;
  }
};

/**
 * Get all products with pagination
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Get products error:', error);
    notify.error('Failed to load products', 'Please refresh the page');
    throw error.response?.data || error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  try {
    notify.loading('Deleting product and associated media...');

    const response = await axiosInstance.delete(`/products/${productId}`);

    notify.close();

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Delete failed');
  } catch (error) {
    notify.close();
    console.error('Delete error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update product status
 */
export const updateProductStatus = async (productId, status) => {
  try {
    const response = await axiosInstance.patch(`/products/${productId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update status error:', error);
    throw error.response?.data || error;
  }
};

export default {
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProductStatus,
};