// src/services/productService.js

import axiosInstance from '../utils/axios';
import notify from '../utils/notification';

/**
 * Form values -> API payload
 *
 * Backend (buildProductDocument) নিজে যা হিসাব করে, তা পাঠানো হয় না:
 *   stock, sizes, colors (inventory থেকে derive), slug, timestamps।
 *
 * - inventory      : [{ color, sizes: [{ size, stock }] }]
 * - images/videos  : Cloudinary media
 * - status         : 'active' | 'draft' (Form থেকে আসে)
 */
const buildProductPayload = (productData) => {
  const images = (productData.images || []).map((img, index) => ({
    url: img.url,
    publicId: img.publicId,
    thumbnailUrl: img.thumbnailUrl || img.url,
    isMain: img.isMain === true,
    order: index,
  }));

  const videos = (productData.videos || []).map((video) => ({
    url: video.url,
    publicId: video.publicId,
    thumbnailUrl: video.thumbnailUrl || '',
    duration: video.duration ?? null,
  }));

  const inventory = (productData.inventory || []).map((row) => ({
    color: row.color,
    sizes: (row.sizes || []).map((s) => ({
      size: s.size,
      stock: s.stock === '' || s.stock == null ? 0 : Number(s.stock),
    })),
  }));

  return {
    sku: productData.sku,
    productName: productData.productName,
    mainCategory: productData.mainCategory,
    status: productData.status || 'active',
    newPrice: productData.newPrice,
    oldPrice: productData.oldPrice === '' ? null : productData.oldPrice,
    inventory,
    categories: productData.categories || [],
    tags: productData.tags || [],
    descriptionHtml: productData.descriptionHtml || '',
    additionalInfo: productData.additionalInfo || {},
    images,
    videos,
  };
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(
      '/products',
      buildProductPayload(productData)
    );
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
    const response = await axiosInstance.put(
      `/products/${productId}`,
      buildProductPayload(productData)
    );
    return response.data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Admin: সব product (draft সহ)। Backend: GET /api/admin/products
 */
export const getAdminProducts = async () => {
  try {
    const response = await axiosInstance.get('/admin/products');
    return response.data;
  } catch (error) {
    console.error('Get admin products error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get product by ID (public, draft বাদে)
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
 * Get all public products
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
  getAdminProducts,
  getProductById,
  getProducts,
  deleteProduct,
  updateProductStatus,
};