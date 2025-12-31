// src/services/profileService.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      console.error('Unauthorized - Token may be expired');
    }
    return Promise.reject(error);
  }
);

// ============================================
// PROFILE API METHODS
// ============================================

/**
 * Fetch full user profile with orders and wishlist
 */
export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile/full');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch profile');
    }
    return response.data.user;
  } catch (error) {
    console.error('Fetch profile error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.patch('/api/users/profile', profileData);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update profile');
    }
    return response.data.user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user role by email
 */
export const getUserRole = async (email) => {
  try {
    const response = await api.get(`/api/users/role/${email}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch role');
    }
    return response.data.role;
  } catch (error) {
    console.error('Fetch role error:', error);
    throw error.response?.data || error;
  }
};

// ============================================
// CLOUDINARY IMAGE UPLOAD
// ============================================

/**
 * Upload image to Cloudinary
 */
export const uploadImageToCloudinary = async (file, folder = 'user-profiles') => {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    console.log('📤 Uploading to Cloudinary...');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();

    console.log('✅ Upload successful:', data.secure_url);

    return {
      url: data.secure_url,
      publicId: data.public_id,
      thumbnailUrl: data.eager?.[0]?.secure_url || data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      size: data.bytes,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary via backend
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) throw new Error('Public ID is required');

    console.log('🗑️ Deleting image from Cloudinary:', publicId);

    const response = await api.delete('/api/cloudinary/delete/image', {
      data: { publicId },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Delete failed');
    }

    console.log('✅ Image deleted successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Delete image error:', error);
    throw error.response?.data || error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate avatar URL
 */
export const getAvatarUrl = (name, photoURL) => {
  if (photoURL) return photoURL;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=200&background=3b82f6&color=fff&bold=true`;
};

/**
 * Get role configuration
 */
export const getRoleConfig = (role) => {
  const configs = {
    admin: {
      label: 'Administrator',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
    staff: {
      label: 'Staff Member',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    user: {
      label: 'Customer',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
  };

  return configs[role] || configs.user;
};

/**
 * Get order status configuration
 */
export const getOrderStatusConfig = (status) => {
  const configs = {
    delivered: {
      label: 'Delivered',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    pending: {
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    processing: {
      label: 'Processing',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    cancelled: {
      label: 'Cancelled',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    },
  };

  return configs[status] || configs.pending;
};

/**
 * Validate form data
 */
export const validateProfileData = (data) => {
  const errors = {};

  if (!data.displayName || data.displayName.trim().length === 0) {
    errors.displayName = 'Name is required';
  }

  if (data.phoneNumber && !/^\+?[\d\s\-()]+$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  if (data.address?.zipCode && !/^\d{4,6}$/.test(data.address.zipCode)) {
    errors.zipCode = 'Invalid zip code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Show notification (using SweetAlert2 or browser notification)
 */
export const showNotification = (type, title, message) => {
  // If you have SweetAlert2 installed
  if (window.Swal) {
    window.Swal.fire({
      icon: type,
      title: title,
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } else {
    // Fallback to alert
    alert(`${title}: ${message}`);
  }
};

export default {
  fetchUserProfile,
  updateUserProfile,
  getUserRole,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  formatDate,
  formatDateTime,
  getAvatarUrl,
  getRoleConfig,
  getOrderStatusConfig,
  validateProfileData,
  showNotification,
};