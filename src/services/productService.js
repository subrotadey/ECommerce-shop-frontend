// src/services/productService.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Base URL:', API_BASE_URL);

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
    console.log('🔑 Auth token added to request');
  }
  console.log('📡 API Request:', config.method.toUpperCase(), config.url);
  return config;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

/**
 * Create new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    console.log('📤 Creating product:', productData.productName);
    
    // Transform data to match backend schema
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

    console.log('📦 Payload:', payload);

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
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Updated product
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
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProductById = async (productId) => {
  try {
    console.log('📥 Fetching product:', productId);
    const response = await api.get(`/products/${productId}`);
    console.log('✅ Product fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all products with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Products list
 */
export const getProducts = async (params = {}) => {
  try {
    console.log('📥 Fetching products with params:', params);
    const response = await api.get('/products', { params });
    console.log('✅ Products fetched:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Get products error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ Deleting product:', productId);
    const response = await api.delete(`/products/${productId}`);
    console.log('✅ Product deleted');
    return response.data;
  } catch (error) {
    console.error('❌ Delete product error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Generate SEO-friendly slug from product name
 * @param {string} name - Product name
 * @returns {string} Slug
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