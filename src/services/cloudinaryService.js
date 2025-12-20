// src/services/cloudinaryService.js

import axios from 'axios';
import {
  CLOUDINARY_CONFIG,
  IMAGE_UPLOAD_CONFIG,
  VIDEO_UPLOAD_CONFIG,
  getVideoThumbnailUrl,
} from '../config/cloudinary';

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<Object>} Upload result
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

    // Return structured data
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
 * @param {File} file - Video file
 * @param {string} folder - Folder path in Cloudinary
 * @returns {Promise<Object>} Upload result
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

    // Upload to Cloudinary
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

    // Return structured data
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
 * Delete asset from Cloudinary via Backend API
 * @param {string} publicId - Public ID of the asset
 * @param {string} resourceType - 'image' or 'video'
 */
export const deleteAsset = async (publicId, resourceType = 'image') => {
  try {
    console.log('🗑️ Deleting asset from Cloudinary:', { publicId, resourceType });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const endpoint = resourceType === 'video' 
      ? `${API_URL}/cloudinary/delete/video`
      : `${API_URL}/cloudinary/delete/image`;

    const response = await axios.delete(endpoint, {
      data: { publicId }
    });

    console.log('✅ Asset deleted from Cloudinary:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Asset deletion error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Delete multiple images from Cloudinary (batch)
 * @param {string[]} publicIds - Array of public IDs
 */
export const deleteMultipleAssets = async (publicIds) => {
  try {
    console.log(`🗑️ Batch deleting ${publicIds.length} assets from Cloudinary`);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await axios.post(`${API_URL}/cloudinary/delete/batch`, {
      publicIds
    });

    console.log('✅ Batch delete complete:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Batch delete error:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Batch upload images
 * @param {File[]} files - Array of image files
 * @param {string} folder - Folder path
 * @returns {Promise<Object[]>} Array of upload results
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