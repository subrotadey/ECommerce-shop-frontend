// src/components/ProductForm/ImageUploadSection.jsx
import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadMultipleImages } from '../../services/cloudinaryService';
import { IMAGE_UPLOAD_CONFIG } from '../../config/cloudinary';
import notify from '../../utils/notification';

// Props:
//   images             -> বর্তমান form-এর image তালিকা
//   onChange(images)   -> form state বদলানোর জন্য
//   error              -> validation error
//   onAssetsUploaded   -> (assets) নতুন upload সফল হলে, media lifecycle-এ track করার জন্য
//   onAssetsOrphaned   -> (assets) upload মাঝপথে ব্যর্থ হয়ে cleanup-ও ব্যর্থ হলে
//   onRemoveAsset      -> async (asset) -> { status, ... }  (useMediaLifecycle.removeAsset)
//                         status: deleted | deferred | failed | in_use | ignored
const ImageUploadSection = ({
    images = [],
    onChange,
    error,
    onAssetsUploaded,
    onAssetsOrphaned,
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

    // Async কাজের পরে সবসময় সর্বশেষ images ব্যবহার করার জন্য।
    const imagesRef = useRef(images);
    imagesRef.current = images;

    const isRemoving = removingKeys.length > 0;
    const isBusy = uploading || isRemoving;

    const remainingSlots = Math.max(
        0,
        IMAGE_UPLOAD_CONFIG.maxFiles - images.length
    );

    // Exactly one Main image + order ঠিক রাখে।
    const normalizeImages = (list) => {
        let mainIndex = list.findIndex((image) => image.isMain === true);

        if (mainIndex === -1 && list.length > 0) {
            mainIndex = 0;
        }

        return list.map((image, index) => ({
            ...image,
            isMain: index === mainIndex,
            order: index,
        }));
    };

    // --------------------------------------
    // IMAGE UPLOAD
    // --------------------------------------

    const onDrop = useCallback(
        async (acceptedFiles, fileRejections) => {
            if (uploadLock.current) return;

            if (fileRejections.length > 0) {
                const firstError = fileRejections[0].errors[0];

                notify.error(
                    firstError?.message || 'Some selected images were rejected.'
                );
            }

            if (!acceptedFiles.length) return;

            if (
                imagesRef.current.length + acceptedFiles.length >
                IMAGE_UPLOAD_CONFIG.maxFiles
            ) {
                notify.error(
                    `Maximum ${IMAGE_UPLOAD_CONFIG.maxFiles} images allowed.`
                );
                return;
            }

            uploadLock.current = true;
            setUploading(true);

            setUploadProgress({
                current: 0,
                total: acceptedFiles.length,
                percentage: 0,
            });

            try {
                const uploadedImages = await uploadMultipleImages(
                    acceptedFiles,
                    IMAGE_UPLOAD_CONFIG.folder,
                    (progress) => {
                        setUploadProgress({
                            current: progress.current,
                            total: progress.total,
                            percentage: progress.percentage,
                        });
                    }
                );

                // Upload হওয়ার সঙ্গে সঙ্গে track শুরু, form state-এর আগে।
                // এতে পরে যা-ই হোক, asset হারাবে না।
                onAssetsUploaded?.(
                    uploadedImages.map((image) => ({
                        publicId: image.publicId,
                        resourceType: 'image',
                    }))
                );

                const newImages = uploadedImages.map((image) => ({
                    url: image.url,
                    publicId: image.publicId,
                    thumbnailUrl: image.thumbnailUrl,
                    isMain: false,
                }));

                const normalizedImages = normalizeImages([
                    ...imagesRef.current.map((image) => ({ ...image })),
                    ...newImages,
                ]);

                onChange(normalizedImages);

                notify.success(
                    `${uploadedImages.length} image(s) uploaded successfully!`,
                    `Total: ${normalizedImages.length} images`
                );
            } catch (uploadError) {
                // Cleanup ব্যর্থ হওয়া asset failed queue-তে যাবে।
                if (uploadError.orphanedAssets?.length) {
                    onAssetsOrphaned?.(uploadError.orphanedAssets);
                }

                notify.error(
                    'Image upload failed',
                    uploadError.message || 'Please try again.',
                    4000
                );
            } finally {
                uploadLock.current = false;
                setUploading(false);

                setUploadProgress({
                    current: 0,
                    total: 0,
                    percentage: 0,
                });
            }
        },
        [onChange, onAssetsUploaded, onAssetsOrphaned]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
        },
        maxSize: IMAGE_UPLOAD_CONFIG.maxFileSize,
        maxFiles: remainingSlots,
        disabled: isBusy || remainingSlots === 0,
        multiple: true,
    });

    // --------------------------------------
    // REMOVE IMAGE
    // --------------------------------------

    const handleRemove = async (index) => {
        if (isBusy) return;

        const imageToRemove = images[index];

        if (!imageToRemove) return;

        const confirmed = await notify.confirm(
            'Remove this image?',
            'Images uploaded in this session are deleted from Cloudinary right away. Previously saved images are deleted only after you save the product.',
            'Yes, remove',
            'Cancel'
        );

        if (!confirmed) return;

        const key = imageToRemove.publicId || imageToRemove.url || String(index);
        setRemovingKeys((keys) => [...keys, key]);

        let result = { status: 'ignored' };

        try {
            if (imageToRemove.publicId && onRemoveAsset) {
                result = await onRemoveAsset({
                    publicId: imageToRemove.publicId,
                    resourceType: 'image',
                });
            }

            // Delete চলার সময় যা-ই বদলাক, সর্বশেষ list থেকে সরাই।
            const remainingImages = imagesRef.current.filter(
                (image) =>
                    !(
                        image.publicId === imageToRemove.publicId &&
                        image.url === imageToRemove.url
                    )
            );

            const updatedImages = normalizeImages(remainingImages);

            onChange(updatedImages);

            // Notification শুধু আসল ফলাফল অনুযায়ী।
            switch (result.status) {
                case 'deleted':
                    notify.success(
                        'Image deleted from Cloudinary.',
                        `Remaining: ${updatedImages.length} images`
                    );
                    break;

                case 'deferred':
                    notify.info(
                        'Image removed from the form.',
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
                        'This image is still used by a saved product, so Cloudinary kept it.',
                        4000
                    );
                    break;

                default:
                    notify.info('Image removed from the form.');
            }

            if (imageToRemove.isMain && updatedImages.length > 0) {
                notify.info('The first remaining image is now the Main image.');
            }
        } finally {
            setRemovingKeys((keys) => keys.filter((item) => item !== key));
        }
    };

    // --------------------------------------
    // SET MAIN IMAGE
    // --------------------------------------

    const handleSetMain = (index) => {
        if (isBusy) return;

        const updatedImages = images.map((image, imageIndex) => ({
            ...image,
            isMain: imageIndex === index,
            order: imageIndex,
        }));

        onChange(updatedImages);

        notify.success(`Image #${index + 1} set as Main image!`);
    };

    // --------------------------------------
    // UI
    // --------------------------------------

    return (
        <div className="space-y-4">
            {/* Section Header */}
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
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                        ${
                            isDragActive
                                ? 'border-emerald-500 bg-emerald-50'
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
                                Uploading {uploadProgress.current} of {uploadProgress.total}
                            </p>

                            <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-emerald-600 h-2 rounded-full transition-all duration-200"
                                    style={{
                                        width: `${uploadProgress.percentage}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                {uploadProgress.percentage}% completed
                            </p>
                        </div>
                    ) : isRemoving ? (
                        <p className="text-sm font-medium text-gray-700">
                            Removing image...
                        </p>
                    ) : remainingSlots === 0 ? (
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Maximum image limit reached.
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Remove an image to upload another one.
                            </p>
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
                                JPG, JPEG, PNG, WebP | Maximum 5MB each
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {remainingSlots} upload slot(s) remaining
                            </p>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => {
                        const key = image.publicId || image.url || String(index);
                        const isBeingRemoved = removingKeys.includes(key);

                        return (
                            <div
                                key={image.publicId || image.url || index}
                                className={`relative group border rounded-lg overflow-hidden ${
                                    isBeingRemoved ? 'opacity-50' : ''
                                }`}
                            >
                                <img
                                    src={image.thumbnailUrl || image.url}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />

                                {/* Main Badge */}
                                {image.isMain && (
                                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                                        Main Image
                                    </div>
                                )}

                                {/* Image Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {isBeingRemoved ? (
                                        <span className="text-white text-xs">Removing...</span>
                                    ) : (
                                        <>
                                            {!image.isMain && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMain(index)}
                                                    disabled={isBusy}
                                                    className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 disabled:opacity-50"
                                                >
                                                    Set Main
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                disabled={isBusy}
                                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Remove
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Order Number */}
                                <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    #{index + 1}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ImageUploadSection;