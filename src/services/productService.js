// src/services/productService.js - FIXED VERSION

import axiosInstance from '../utils/axios'; // ✅ Use centralized axios instance
import notify from '../utils/notification';

/**
 * Generate SEO-friendly slug
 */
const generateSlug = (name) => {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  console.log('🔗 Generated slug:', slug);
  return slug;
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
  try {
    console.log('📤 Creating product:', productData.productName);
    
    const payload = {
      ...productData,
      slug: generateSlug(productData.productName),
      media: {
        images: productData.images.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          thumbnailUrl: img.thumbnailUrl || img.url,
          isMain: img.isMain || index === 0,
          order: index,
        })),
        ...(productData.video && {
          video: {
            url: productData.video.url,
            publicId: productData.video.publicId,
            thumbnailUrl: productData.video.thumbnailUrl,
            duration: productData.video.duration,
          },
        }),
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await axiosInstance.post('/api/products', payload);
    
    console.log('✅ Product created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Create product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (productId, productData) => {
  try {
    console.log('📤 Updating product:', productId);
    
    const payload = {
      ...productData,
      slug: generateSlug(productData.productName),
      media: {
        images: productData.images.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          thumbnailUrl: img.thumbnailUrl || img.url,
          isMain: img.isMain || index === 0,
          order: index,
        })),
        ...(productData.video && {
          video: {
            url: productData.video.url,
            publicId: productData.video.publicId,
            thumbnailUrl: productData.video.thumbnailUrl,
            duration: productData.video.duration,
          },
        }),
      },
      updatedAt: new Date().toISOString(),
    };

    console.log('📦 Update Payload:', JSON.stringify(payload, null, 2));

    const response = await axiosInstance.put(`/api/products/${productId}`, payload);
    
    console.log('✅ Product updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  try {
    console.log('📥 Fetching product:', productId);
    const response = await axiosInstance.get(`/products/${productId}`);
    console.log('✅ Product fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get product error:', error);
    notify.error('Failed to load product', 'Product not found or network error');
    throw error.response?.data || error;
  }
};

/**
 * Get all products with pagination
 */
export const getProducts = async (params = {}) => {
  try {
    console.log('📥 Fetching products with params:', params);
    const response = await axiosInstance.get('/products', { params });
    console.log('✅ Products fetched:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Get products error:', error);
    notify.error('Failed to load products', 'Please refresh the page');
    throw error.response?.data || error;
  }
};

/**
 * Delete product - WITH PROPER CONFIRMATION
 */
export const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ Deleting product:', productId);

    // Show deleting notification
    notify.loading('Deleting product and associated media...');

    const response = await axiosInstance.delete(`/api/products/${productId}`);
    
    notify.close();
    
    if (response.data.success) {
      console.log('✅ Product deleted successfully');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Delete failed');
    }
  } catch (error) {
    notify.close();
    console.error('❌ Delete error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update product status
 */
export const updateProductStatus = async (productId, status) => {
  try {
    console.log('📤 Updating product status:', productId, status);
    
    const response = await axiosInstance.patch(`/api/products/${productId}/status`, { status });
    
    console.log('✅ Status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update status error:', error);
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