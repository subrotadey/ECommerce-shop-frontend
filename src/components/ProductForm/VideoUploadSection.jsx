// src/components/ProductForm/VideoUploadSection.jsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadVideo, deleteAsset } from '../../services/cloudinaryService';
import { VIDEO_UPLOAD_CONFIG } from '../../config/cloudinary';

const VideoUploadSection = ({ video, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      console.log('🎬 Video file dropped:', {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
      });

      setUploading(true);
      setUploadProgress(0);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 500);

        console.log('📤 Starting video upload...');
        const result = await uploadVideo(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        console.log('✅ Video uploaded successfully:', result);

        // Update parent component
        onChange({
          url: result.url,
          publicId: result.publicId,
          thumbnailUrl: result.thumbnailUrl,
          duration: result.duration,
        });

        alert('Video uploaded successfully!');
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (error) {
        console.error('❌ Video upload failed:', error);
        alert(`Video upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
    },
    maxSize: VIDEO_UPLOAD_CONFIG.maxFileSize,
    maxFiles: 1,
    disabled: uploading || !!video,
  });

  // Remove video
  const handleRemove = async () => {
    if (!video) return;
    
    console.log('🗑️ Removing video:', video.publicId);
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this video? This will also remove it from Cloudinary.')) {
      return;
    }

    try {
      // Delete from Cloudinary first
      console.log('🔄 Deleting video from Cloudinary...');
      await deleteAsset(video.publicId, 'video');
      console.log('✅ Video deleted from Cloudinary');
      
      // Then remove from UI
      onChange(null);
      alert('Video deleted successfully from Cloudinary');
    } catch (error) {
      console.error('❌ Failed to delete video from Cloudinary:', error);
      alert(`Failed to delete video: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Video
          <span className="text-gray-500 text-xs ml-2">(Optional, Max 10 seconds)</span>
        </label>

        {!video ? (
          /* Dropzone */
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
                  Uploading video... {uploadProgress}%
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This may take a few moments...
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop video here...'
                    : 'Drag & drop video, or click to select'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  MP4, MOV, AVI up to 50MB
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Video Preview */
          <div className="relative border rounded-lg overflow-hidden">
            <video
              src={video.url}
              controls
              className="w-full max-h-96"
              poster={video.thumbnailUrl}
            >
              Your browser does not support the video tag.
            </video>

            {/* Video Info */}
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Duration: {Math.round(video.duration)}s
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Remove Video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadSection;