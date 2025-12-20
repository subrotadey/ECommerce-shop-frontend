// src/config/cloudinary.js

// Cloudinary Configuration (Vite)
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};


// Debug: Log configuration (remove in production)
console.log('Cloudinary Config:', {
  cloudName: CLOUDINARY_CONFIG.cloudName,
  uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
  isConfigured: !!(CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset),
});

// Image upload settings
export const IMAGE_UPLOAD_CONFIG = {
  folder: 'products',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  transformation: [
    { width: 1200, height: 1600, crop: 'limit', quality: 'auto' },
  ],
  thumbnailTransformation: [
    { width: 300, height: 400, crop: 'fill', quality: 'auto' },
  ],
};

// Video upload settings
export const VIDEO_UPLOAD_CONFIG = {
  folder: 'videos',
  allowedFormats: ['mp4', 'mov', 'avi'],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxDuration: 10, // 10 seconds
  transformation: [
    { width: 1080, height: 1920, crop: 'limit', quality: 'auto' },
  ],
};

// Get Cloudinary URL with transformations
export const getCloudinaryUrl = (publicId, transformations = []) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;
  const transformStr = transformations.map(t => {
    return Object.entries(t).map(([key, value]) => `${key}_${value}`).join(',');
  }).join('/');
  
  return `${baseUrl}/image/upload/${transformStr}/${publicId}`;
};

// Get video thumbnail URL
export const getVideoThumbnailUrl = (publicId) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/so_0,w_400,h_300,c_fill/${publicId}.jpg`;
};