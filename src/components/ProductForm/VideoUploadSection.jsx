// src/components/ProductForm/VideoUploadSection.jsx
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadVideo } from '../../services/cloudinaryService';
import { VIDEO_UPLOAD_CONFIG } from '../../config/cloudinary';
import notify from '../../utils/notification';

// Props:
//   videos             -> বর্তমান form-এর video তালিকা (array)
//   onChange(videos)   -> form state বদলানোর জন্য
//   error              -> validation error
//   onAssetsUploaded   -> (assets) নতুন upload সফল হলে, media lifecycle-এ track করার জন্য
//   onRemoveAsset      -> async (asset) -> { status, ... }  (useMediaLifecycle.removeAsset)
//                         status: deleted | deferred | failed | in_use | ignored
const VideoUploadSection = ({
    videos = [],
    onChange,
    error,
    onAssetsUploaded,
    onRemoveAsset,
}) => {
    const [uploading, setUploading] = useState(false);
    const [removingKeys, setRemovingKeys] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({
        current: 0,
        total: 0,
        percentage: 0,
    });

    const uploadLock = useRef(false);

    // Async কাজের পরে সবসময় সর্বশেষ videos ব্যবহার করার জন্য।
    const videosRef = useRef(videos);
    videosRef.current = videos;

    const maxFiles = VIDEO_UPLOAD_CONFIG.maxFiles;
    const isRemoving = removingKeys.length > 0;
    const isBusy = uploading || isRemoving;
    const remainingSlots = Math.max(0, maxFiles - videos.length);

    // --------------------------------------
    // VIDEO UPLOAD
    // --------------------------------------

    const onDrop = useCallback(
        async (acceptedFiles, fileRejections) => {
            if (uploadLock.current) return;

            if (fileRejections.length > 0) {
                const firstError = fileRejections[0].errors[0];

                notify.error(
                    firstError?.message || 'Some selected videos were rejected.'
                );
            }

            if (!acceptedFiles.length) return;

            if (videosRef.current.length + acceptedFiles.length > maxFiles) {
                notify.error(`Maximum ${maxFiles} videos allowed.`);
                return;
            }

            uploadLock.current = true;
            setUploading(true);
            setUploadProgress({
                current: 0,
                total: acceptedFiles.length,
                percentage: 0,
            });

            // এই batch-এ সফল upload। মাঝপথে ব্যর্থ হলেও আগেরগুলো রাখা হবে।
            const uploaded = [];
            let failureMessage = '';

            for (let index = 0; index < acceptedFiles.length; index++) {
                try {
                    const result = await uploadVideo(
                        acceptedFiles[index],
                        VIDEO_UPLOAD_CONFIG.folder,
                        (fileProgress) => {
                            setUploadProgress({
                                current: index + 1,
                                total: acceptedFiles.length,
                                percentage: Math.round(
                                    (index * 100 + fileProgress) / acceptedFiles.length
                                ),
                            });
                        }
                    );

                    // Upload হওয়ার সঙ্গে সঙ্গে track শুরু।
                    onAssetsUploaded?.([
                        { publicId: result.publicId, resourceType: 'video' },
                    ]);

                    uploaded.push({
                        url: result.url,
                        publicId: result.publicId,
                        thumbnailUrl: result.thumbnailUrl,
                        duration: result.duration,
                    });
                } catch (uploadError) {
                    failureMessage = uploadError.message || 'Please try again.';
                    break;
                }
            }

            if (uploaded.length > 0) {
                onChange([...videosRef.current, ...uploaded]);

                notify.success(
                    `${uploaded.length} video(s) uploaded successfully!`,
                    `Total: ${videosRef.current.length + uploaded.length} videos`
                );
            }

            if (failureMessage) {
                notify.error('Video upload failed', failureMessage, 4000);
            }

            uploadLock.current = false;
            setUploading(false);
            setUploadProgress({ current: 0, total: 0, percentage: 0 });
        },
        [onChange, onAssetsUploaded, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/x-msvideo': ['.avi'],
        },
        maxSize: VIDEO_UPLOAD_CONFIG.maxFileSize,
        maxFiles: remainingSlots,
        disabled: isBusy || remainingSlots === 0,
        multiple: true,
    });

    // --------------------------------------
    // REMOVE VIDEO
    // --------------------------------------

    const handleRemove = async (index) => {
        if (isBusy) return;

        const videoToRemove = videos[index];

        if (!videoToRemove) return;

        const confirmed = await notify.confirm(
            'Remove this video?',
            'Videos uploaded in this session are deleted from Cloudinary right away. Previously saved videos are deleted only after you save the product.',
            'Yes, remove',
            'Cancel'
        );

        if (!confirmed) return;

        const key = videoToRemove.publicId || videoToRemove.url || String(index);
        setRemovingKeys((keys) => [...keys, key]);

        let result = { status: 'ignored' };

        try {
            if (videoToRemove.publicId && onRemoveAsset) {
                result = await onRemoveAsset({
                    publicId: videoToRemove.publicId,
                    resourceType: 'video',
                });
            }

            const remainingVideos = videosRef.current.filter(
                (video) =>
                    !(
                        video.publicId === videoToRemove.publicId &&
                        video.url === videoToRemove.url
                    )
            );

            onChange(remainingVideos);

            // Notification শুধু আসল ফলাফল অনুযায়ী।
            switch (result.status) {
                case 'deleted':
                    notify.success(
                        'Video deleted from Cloudinary.',
                        `Remaining: ${remainingVideos.length} videos`
                    );
                    break;

                case 'deferred':
                    notify.info(
                        'Video removed from the form.',
                        'It will be deleted from Cloudinary after you save the product.',
                        3500
                    );
                    break;

                case 'failed':
                    notify.warning(
                        'Removed from the form, but Cloudinary deletion failed.',
                        'It is saved for retry.',
                        4000
                    );
                    break;

                case 'in_use':
                    notify.warning(
                        'Removed from the form.',
                        'This video is still used by a saved product, so Cloudinary kept it.',
                        4000
                    );
                    break;

                default:
                    notify.info('Video removed from the form.');
            }
        } finally {
            setRemovingKeys((keys) => keys.filter((item) => item !== key));
        }
    };

    // --------------------------------------
    // UI
    // --------------------------------------

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Videos
                    <span className="text-gray-500 text-xs ml-2">
                        (Optional, Maximum {maxFiles})
                    </span>
                </label>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${
                            isDragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }
                        ${
                            isBusy || remainingSlots === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                        }
                    `}
                >
                    <input {...getInputProps()} />

                    {uploading ? (
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                Uploading video {uploadProgress.current} of {uploadProgress.total}
                            </p>

                            <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress.percentage}%` }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                {uploadProgress.percentage}% completed
                            </p>
                        </div>
                    ) : isRemoving ? (
                        <p className="text-sm font-medium text-gray-700">
                            Removing video...
                        </p>
                    ) : remainingSlots === 0 ? (
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Maximum video limit reached.
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Remove a video to upload another one.
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
                                    ? 'Drop videos here...'
                                    : 'Drag & drop videos, or click to select'}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                MP4, MOV, AVI | Maximum 50MB each
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {remainingSlots} upload slot(s) remaining
                            </p>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>

            {/* Video Preview Grid */}
            {videos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {videos.map((video, index) => {
                        const key = video.publicId || video.url || String(index);
                        const isBeingRemoved = removingKeys.includes(key);

                        return (
                            <div
                                key={video.publicId || video.url || index}
                                className={`border rounded-lg overflow-hidden ${
                                    isBeingRemoved ? 'opacity-50' : ''
                                }`}
                            >
                                <video
                                    src={video.url}
                                    controls
                                    preload="metadata"
                                    className="w-full max-h-64 bg-black"
                                    poster={video.thumbnailUrl}
                                >
                                    Your browser does not support the video tag.
                                </video>

                                <div className="p-3 bg-gray-50 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        #{index + 1}
                                        {video.duration
                                            ? ` | ${Math.round(video.duration)}s`
                                            : ''}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        disabled={isBusy}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        {isBeingRemoved ? 'Removing...' : 'Remove'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VideoUploadSection;