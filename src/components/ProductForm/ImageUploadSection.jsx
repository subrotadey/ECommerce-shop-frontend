// src/components/ProductForm/ImageUploadSection.jsx (CLEAN VERSION)

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, deleteAsset } from '../../services/cloudinaryService';
import { IMAGE_UPLOAD_CONFIG } from '../../config/cloudinary';
import notify from '../../utils/notification';

const ImageUploadSection = ({ images = [], onChange, error }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [deleting, setDeleting] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      notify.info(`Uploading ${acceptedFiles.length} image(s)...`, '', 1000);

      // Check maximum files limit
      if (images.length + acceptedFiles.length > IMAGE_UPLOAD_CONFIG.maxFiles) {
        notify.error(`Maximum ${IMAGE_UPLOAD_CONFIG.maxFiles} images allowed!`);
        return;
      }

      setUploading(true);

      try {
        const uploadedImages = [];

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          setUploadProgress({ current: i + 1, total: acceptedFiles.length });

          const result = await uploadImage(file);

          uploadedImages.push({
            url: result.url,
            publicId: result.publicId,
            thumbnailUrl: result.thumbnailUrl,
            isMain: images.length === 0 && i === 0,
            order: images.length + i,
          });
        }

        const updatedImages = [...images, ...uploadedImages];
        onChange(updatedImages);
        
        notify.success(
          `${acceptedFiles.length} image(s) uploaded successfully!`,
          `Total: ${updatedImages.length} images`
        );

      } catch (error) {
        notify.error('Upload failed', error.message, 3000);
      } finally {
        setUploading(false);
        setUploadProgress({});
      }
    },
    [images, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: IMAGE_UPLOAD_CONFIG.maxFileSize,
    disabled: uploading,
  });

  // Remove image
  const handleRemove = async (index) => {
    const imageToRemove = images[index];

    // Confirm deletion
    const confirmed = await notify.confirm(
      'Delete this image?',
      `This will permanently remove it from Cloudinary.\n`,
      'Yes, delete it!',
      'Cancel'
    );

    if (!confirmed) return;

    setDeleting(index);

    try {
      await deleteAsset(imageToRemove.publicId, 'image');

      const updatedImages = images.filter((_, i) => i !== index);

      // Re-assign isMain if we deleted the main image
      if (imageToRemove.isMain && updatedImages.length > 0) {
        updatedImages[0].isMain = true;
        notify.info('Main image deleted. Set image #1 as new main.');
      }

      onChange(updatedImages);
      notify.success('Image deleted!', `Remaining: ${updatedImages.length} images`);

    } catch (error) {
      notify.error('Failed to delete image', error.message, 4000);
    } finally {
      setDeleting(null);
    }
  };

  // Set as main image
  const handleSetMain = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(updatedImages);
    notify.success(`Image #${index + 1} set as main image!`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images <span className="text-red-500">*</span>
          <span className="text-gray-500 text-xs ml-2">
            (Minimum 1, Maximum {IMAGE_UPLOAD_CONFIG.maxFiles})
          </span>
        </label>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div>
              <div className="text-lg font-medium text-gray-700">
                Uploading... {uploadProgress.current}/{uploadProgress.total}
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? 'Drop images here...'
                  : 'Drag & drop images, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, WebP up to 5MB each
              </p>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden"
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-48 object-cover"
              />

              {/* Main Badge */}
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}

              {/* Deleting Overlay */}
              {deleting === index && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Deleting...</p>
                  </div>
                </div>
              )}

              {/* Actions Overlay */}
              {deleting !== index && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => handleSetMain(index)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      Set Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={deleting !== null}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Order Number */}
              <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;