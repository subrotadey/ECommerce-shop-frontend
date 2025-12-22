// src/services/productService.js (IMPROVED)

import axios from 'axios';
import notify from '../utils/notification';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    
    // Show error notification for network errors
    if (!error.response) {
      notify.error('Network Error', 'Please check your internet connection', 3000);
    }
    
    return Promise.reject(error);
  }
);

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
          thumbnailUrl: img.thumbnailUrl,
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

    const response = await api.post('/products', payload);
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
          thumbnailUrl: img.thumbnailUrl,
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

    const response = await api.put(`/products/${productId}`, payload);
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
    const response = await api.get(`/products/${productId}`);
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
    const response = await api.get('/products', { params });
    console.log('✅ Products fetched:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Get products error:', error);
    notify.error('Failed to load products', 'Please refresh the page');
    throw error.response?.data || error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  try {
    // Show confirmation dialog
    const confirmed = await notify.confirm(
      'Delete Product?',
      'This action cannot be undone. The product and its media will be permanently deleted.',
      'Yes, delete it',
      'Cancel'
    );

    if (!confirmed) {
      return { cancelled: true };
    }

    // Show deleting notification
    notify.loading('Deleting product...');

    const response = await api.delete(`/products/${productId}`);
    
    notify.close();
    notify.success(
      'Product deleted successfully!',
      'The product has been removed from your store'
    );

    return response.data;
  } catch (error) {
    notify.close();
    notify.error(
      'Failed to delete product',
      error.response?.data?.message || 'Please try again',
      3000
    );
    throw error.response?.data || error;
  }
};

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

export default {
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
};