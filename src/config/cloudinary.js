
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const videoUploadPreset =
  import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_PRESET || uploadPreset;

export const CLOUDINARY_CONFIG = {
  cloudName,
  uploadPreset,
  videoUploadPreset,
};

export const isCloudinaryConfigured = () => {
  return Boolean(cloudName && uploadPreset);
};

// Convert transformation object into Cloudinary URL syntax.
export const formatTransformations = (transformations = []) => {
  if (!Array.isArray(transformations) || transformations.length === 0) {
    return '';
  }

  const keyMap = {
    width: 'w',
    height: 'h',
    crop: 'c',
    quality: 'q',
    format: 'f',
    gravity: 'g',
    aspectRatio: 'ar',
    x: 'x',
    y: 'y',
  };

  return transformations
    .map((transformation) =>
      Object.entries(transformation)
        .map(([key, value]) => {
          const cloudinaryKey = keyMap[key] || key;
          return `${cloudinaryKey}_${value}`;
        })
        .join(',')
    )
    .filter(Boolean)
    .join('/');
};

export const IMAGE_UPLOAD_CONFIG = {
  folder: 'products',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize: 5 * 1024 * 1024, // 5 MB
  maxFiles: 10,

  transformation: [
    {
      width: 1200,
      height: 1600,
      crop: 'limit',
      quality: 'auto',
    },
  ],

  thumbnailTransformation: [
    {
      width: 300,
      height: 400,
      crop: 'fill',
      quality: 'auto',
    },
  ],
};

export const VIDEO_UPLOAD_CONFIG = {
  folder: 'videos',
  allowedFormats: ['mp4', 'mov', 'avi'],
  maxFileSize: 50 * 1024 * 1024, // 50 MB
  maxFiles: 3,

  transformation: [
    {
      width: 1080,
      height: 1920,
      crop: 'limit',
      quality: 'auto',
    },
  ],
};

const getCloudinaryBaseUrl = (resourceType = 'image') => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary configuration is missing.');
  }

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;
};

export const getCloudinaryUrl = (
  publicId,
  transformations = IMAGE_UPLOAD_CONFIG.transformation
) => {
  if (!publicId) {
    throw new Error('Cloudinary public ID is required.');
  }

  const transformationString = formatTransformations(transformations);
  const baseUrl = getCloudinaryBaseUrl('image');

  return transformationString
    ? `${baseUrl}/${transformationString}/${publicId}`
    : `${baseUrl}/${publicId}`;
};

export const getVideoThumbnailUrl = (publicId) => {
  if (!publicId) {
    throw new Error('Video public ID is required.');
  }

  return `${getCloudinaryBaseUrl('video')}/so_0,w_400,h_300,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};
