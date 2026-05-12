// src/services/cloudinaryService.js (FIXED VERSION)

import axios from 'axios';
import {
    CLOUDINARY_CONFIG,
    IMAGE_UPLOAD_CONFIG,
    VIDEO_UPLOAD_CONFIG,
    getVideoThumbnailUrl,
} from '../config/cloudinary';

// Get API base URL (WITHOUT /api suffix)
const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log('🔧 Base API URL:', url);
  return url;
};

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (file, folder = IMAGE_UPLOAD_CONFIG.folder) => {
  console.log('📤 Starting image upload:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    fileType: file.type,
  });

  try {
    // Validate file format
    const fileExtension = file.type.split('/')[1];
    if (!IMAGE_UPLOAD_CONFIG.allowedFormats.includes(fileExtension)) {
      throw new Error(`Invalid file format. Only ${IMAGE_UPLOAD_CONFIG.allowedFormats.join(', ')} allowed.`);
    }

    // Validate file size
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${IMAGE_UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit.`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    console.log('📡 Uploading to Cloudinary...', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      folder: folder,
    });

    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Upload progress: ${percentCompleted}%`);
        },
      }
    );

    console.log('✅ Image uploaded successfully:', {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      format: response.data.format,
    });

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      thumbnailUrl: response.data.eager?.[0]?.secure_url || response.data.secure_url,
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      size: response.data.bytes,
    };
  } catch (error) {
    console.error('❌ Image upload error:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};

/**
 * Upload video to Cloudinary
 */
export const uploadVideo = async (file, folder = VIDEO_UPLOAD_CONFIG.folder) => {
  console.log('🎬 Starting video upload:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    fileType: file.type,
  });

  try {
    // Validate file format
    const fileExtension = file.type.split('/')[1];
    if (!VIDEO_UPLOAD_CONFIG.allowedFormats.includes(fileExtension)) {
      throw new Error(`Invalid file format. Only ${VIDEO_UPLOAD_CONFIG.allowedFormats.join(', ')} allowed.`);
    }

    // Validate file size
    if (file.size > VIDEO_UPLOAD_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${VIDEO_UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit.`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);
    formData.append('resource_type', 'video');

    console.log('📡 Uploading video to Cloudinary...');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Video upload progress: ${percentCompleted}%`);
        },
      }
    );

    console.log('✅ Video uploaded successfully:', {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      duration: response.data.duration,
    });

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      thumbnailUrl: getVideoThumbnailUrl(response.data.public_id),
      duration: response.data.duration,
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      size: response.data.bytes,
    };
  } catch (error) {
    console.error('❌ Video upload error:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};

/**
 * Delete asset from Cloudinary via Backend API (FIXED)
 */
export const deleteAsset = async (publicId, resourceType = 'image') => {
  try {
    console.log('🗑️ Starting deletion process');
    console.log('📦 Public ID:', publicId);
    console.log('📂 Resource Type:', resourceType);

    if (!publicId) {
      throw new Error('Public ID is required for deletion');
    }

    const API_URL = getApiUrl();
    const endpoint = resourceType === 'video' 
      ? `${API_URL}/cloudinary/delete/video`
      : `${API_URL}/cloudinary/delete/image`;

    console.log('📡 DELETE request to:', endpoint);
    console.log('📤 Sending data:', { publicId });

    const response = await axios({
      method: 'DELETE',
      url: endpoint,
      data: { publicId },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    console.log('✅ Delete response:', response.data);

    if (response.data.success) {
      console.log('✅ Asset deleted from Cloudinary successfully');
      return response.data;
    } else {
      throw new Error(response.data.message || 'Delete failed');
    }

  } catch (error) {
    console.error('❌ Asset deletion error:', error);
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server might be slow');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - check if backend is running');
    }

    // Handle server errors
    if (error.response) {
      console.error('Server error response:', error.response.data);
      throw new Error(error.response.data?.message || 'Server error during deletion');
    }

    throw new Error(error.message || 'Failed to delete asset');
  }
};

/**
 * Delete multiple assets from Cloudinary (batch)
 */
export const deleteMultipleAssets = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error('Public IDs array is required');
    }

    console.log(`🗑️ Batch deleting ${publicIds.length} assets from Cloudinary`);

    const API_URL = getApiUrl();
    
    const response = await axios.post(
      `${API_URL}/api/cloudinary/delete/batch`,
      { publicIds },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000, // 30 seconds for batch operations
      }
    );

    console.log('✅ Batch delete complete:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Batch delete error:', error);
    
    if (error.response) {
      throw new Error(error.response.data?.message || 'Batch delete failed');
    }
    
    throw new Error(error.message || 'Failed to batch delete assets');
  }
};

/**
 * Batch upload images
 */
export const uploadMultipleImages = async (files, folder) => {
  console.log(`📤 Starting batch upload of ${files.length} images`);
  
  const uploadPromises = files.map((file, index) => {
    console.log(`📸 Uploading image ${index + 1}/${files.length}`);
    return uploadImage(file, folder);
  });
  
  try {
    const results = await Promise.all(uploadPromises);
    console.log(`✅ Batch upload complete: ${results.length} images uploaded`);
    return results;
  } catch (error) {
    console.error('❌ Batch upload error:', error);
    throw error;
  }
};