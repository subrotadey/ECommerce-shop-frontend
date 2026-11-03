// src/components/ProductForm/ProductForm.jsx
import { useFormik } from 'formik';
import { forwardRef, useImperativeHandle, useState } from 'react';
import * as Yup from 'yup';
import notify from '../../utils/notification';
import DescriptionEditor from './DescriptionEditor';
import ImageUploadSection from './ImageUploadSection';
import VideoUploadSection from './VideoUploadSection';
import {
    useMediaLifecycle,
    buildMediaAssets,
    getProductVideos,
} from '../../hooks/useMediaLifecycle';
import { VIDEO_UPLOAD_CONFIG } from '../../config/cloudinary';

// Validation Schema
const validationSchema = Yup.object({
    sku: Yup.string().required('SKU is required'),
    productName: Yup.string()
        .required('Product name is required')
        .min(10, 'Name must be at least 10 characters'),
    newPrice: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
    oldPrice: Yup.number()
        .min(Yup.ref('newPrice'), 'Old price must be greater than new price')
        .nullable(),
    stock: Yup.number()
        .required('Stock is required')
        .min(0, 'Stock cannot be negative'),
    sizes: Yup.array().min(1, 'At least one size required'),
    colors: Yup.array().min(1, 'At least one color required'),
    mainCategory: Yup.string().required('Main category is required'),
    categories: Yup.array().min(1, 'At least one category required'),
    images: Yup.array()
        .min(1, 'At least one image is required')
        .max(10, 'Maximum 10 images allowed'),
    videos: Yup.array().max(
        VIDEO_UPLOAD_CONFIG.maxFiles,
        `Maximum ${VIDEO_UPLOAD_CONFIG.maxFiles} videos allowed`
    ),
    descriptionHtml: Yup.string()
        .required('Description is required')
        .test('min-length', 'Description must be at least 50 characters', (value) => {
            const textContent = value?.replace(/<[^>]*>/g, '') || '';
            return textContent.length >= 50;
        }),
});

const DEFAULT_VALUES = {
    sku: '',
    productName: '',
    newPrice: '',
    oldPrice: '',
    stock: '',
    sizes: [],
    colors: [],
    mainCategory: 'abaya',
    categories: [],
    tags: [],
    images: [],
    videos: [],
    descriptionHtml: '',
    additionalInfo: {
        fabric: '',
        hijabIncluded: false,
        workType: '',
        washCare: '',
        countryOfOrigin: 'Dubai',
    },
};

// Legacy `video` (single object) ও নতুন `videos[]` দুটোই এখানে videos[] হয়ে যায়।
// Form-এর ভেতরে শুধু `videos` থাকে, `video` আর নয়।
const buildInitialValues = (initialValues) => {
    const source = initialValues || DEFAULT_VALUES;
    const { video, ...rest } = source;

    return {
        ...DEFAULT_VALUES,
        ...rest,
        videos: getProductVideos({ videos: source.videos, video }),
    };
};

// ref দিয়ে parent (Products.jsx) পায়:
//   hasUnsavedMedia() -> Modal Close-এ "Discard?" confirm দেখাতে হবে কি না
//   discardUnsaved()  -> এই session-এর unsaved upload Cloudinary থেকে মোছে
//   isBusy()          -> delete চলছে কি না
const ProductForm = forwardRef(function ProductForm(
    {
        initialValues,
        onSubmit,
        isEditing = false,
        isSubmitting: isParentSubmitting = false,
        onSaveComplete,
    },
    ref
) {
    const [sizeInput, setSizeInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    // Form খোলার সময় একবারই বানানো হয়।
    const [baseValues] = useState(() => buildInitialValues(initialValues));

    const media = useMediaLifecycle({
        initialImages: baseValues.images,
        initialVideos: baseValues.videos,
    });

    useImperativeHandle(
        ref,
        () => ({
            hasUnsavedMedia: media.hasUnsavedMedia,
            discardUnsaved: media.discardUnsaved,
            isBusy: () => media.isDeleting,
        }),
        [media.hasUnsavedMedia, media.discardUnsaved, media.isDeleting]
    );

    const formik = useFormik({
        initialValues: baseValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            let saveSucceeded = false;

            try {
                notify.loading('Saving product...');

                // 1. MongoDB save। ব্যর্থ হলে এখানেই catch-এ যাবে,
                //    Cloudinary-তে কিছুই মোছা হবে না।
                await onSubmit(values);
                saveSucceeded = true;

                // 2. Save সফল। এখন পুরোনো (removed) ও অব্যবহৃত upload মোছা।
                //    এখানে ব্যর্থ হলে save ব্যর্থ ধরা হবে না।
                let cleanupFailedCount = 0;

                try {
                    const cleanup = await media.finalizeSave(
                        buildMediaAssets({
                            images: values.images,
                            videos: values.videos,
                        })
                    );
                    cleanupFailedCount = cleanup.failed.length;
                } catch (cleanupError) {
                    console.error('Media cleanup error:', cleanupError);
                    cleanupFailedCount = 1;
                }

                notify.close();

                notify.success(
                    isEditing
                        ? 'Product updated successfully!'
                        : 'Product created successfully!',
                    'Your changes have been saved'
                );

                if (cleanupFailedCount > 0) {
                    notify.warning(
                        'Product saved, but some old media could not be deleted from Cloudinary.',
                        'They are saved for retry.',
                        5000
                    );
                }
            } catch (error) {
                notify.close();

                notify.error(
                    'Failed to save product',
                    error.message || 'Please try again',
                    4000
                );
            } finally {
                setSubmitting(false);
            }

            // Modal বন্ধ হবে save ও cleanup শেষ হওয়ার পর।
            if (saveSucceeded) {
                onSaveComplete?.();
            }
        },
    });

    // --------------------------------------
    // MEDIA HANDLERS
    // --------------------------------------

    const handleImagesChange = (images) => formik.setFieldValue('images', images);
    const handleVideosChange = (videos) => formik.setFieldValue('videos', videos);

    const handleRetryFailed = async () => {
        const result = await media.retryFailed();

        if (result.failed.length === 0) {
            notify.success(
                `${result.deleted.length} file(s) deleted from Cloudinary.`
            );
        } else {
            notify.warning(
                `${result.failed.length} file(s) still could not be deleted.`,
                'Please try again later.',
                4000
            );
        }
    };

    // --------------------------------------
    // LIST HANDLERS
    // --------------------------------------

    const handleAddSize = () => {
        if (sizeInput.trim() && !formik.values.sizes.includes(sizeInput.trim())) {
            formik.setFieldValue('sizes', [...formik.values.sizes, sizeInput.trim()]);
            setSizeInput('');
            notify.success('Size added!', '', 1000);
        } else if (formik.values.sizes.includes(sizeInput.trim())) {
            notify.warning('Size already exists', '', 1500);
        }
    };

    const handleRemoveSize = (size) => {
        formik.setFieldValue('sizes', formik.values.sizes.filter(s => s !== size));
        notify.info('Size removed', '', 1000);
    };

    const handleAddColor = () => {
        if (colorInput.trim() && !formik.values.colors.includes(colorInput.trim())) {
            formik.setFieldValue('colors', [...formik.values.colors, colorInput.trim()]);
            setColorInput('');
            notify.success('Color added!', '', 1000);
        } else if (formik.values.colors.includes(colorInput.trim())) {
            notify.warning('Color already exists', '', 1500);
        }
    };

    const handleRemoveColor = (color) => {
        formik.setFieldValue('colors', formik.values.colors.filter(c => c !== color));
        notify.info('Color removed', '', 1000);
    };

    const handleAddCategory = () => {
        if (categoryInput.trim() && !formik.values.categories.includes(categoryInput.trim())) {
            formik.setFieldValue('categories', [...formik.values.categories, categoryInput.trim()]);
            setCategoryInput('');
            notify.success('Category added!', '', 1000);
        } else if (formik.values.categories.includes(categoryInput.trim())) {
            notify.warning('Category already exists', '', 1500);
        }
    };

    const handleRemoveCategory = (category) => {
        formik.setFieldValue('categories', formik.values.categories.filter(c => c !== category));
        notify.info('Category removed', '', 1000);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formik.values.tags.includes(tagInput.trim())) {
            formik.setFieldValue('tags', [...formik.values.tags, tagInput.trim()]);
            setTagInput('');
            notify.success('Tag added!', '', 1000);
        } else if (formik.values.tags.includes(tagInput.trim())) {
            notify.warning('Tag already exists', '', 1500);
        }
    };

    const handleRemoveTag = (tag) => {
        formik.setFieldValue('tags', formik.values.tags.filter(t => t !== tag));
        notify.info('Tag removed', '', 1000);
    };

    // --------------------------------------
    // RESET
    // --------------------------------------
    // এই session-এর unsaved upload Cloudinary থেকে মোছে, তারপর form
    // original মানে ফেরে। Original (আগে saved) media কখনো ছোঁয়া হয় না।

    const handleReset = async () => {
        const confirmed = await notify.confirm(
            'Reset form?',
            'All unsaved changes will be lost and files uploaded in this session will be deleted.',
            'Yes, reset',
            'Cancel'
        );

        if (!confirmed) return;

        notify.loading('Resetting form...');

        let failedCount = 0;

        try {
            const result = await media.discardUnsaved();
            failedCount = result.failed.length;
        } catch (error) {
            console.error('Reset cleanup error:', error);
            failedCount = 1;
        }

        notify.close();

        formik.resetForm();

        if (failedCount > 0) {
            notify.warning(
                'Form reset, but some uploaded files could not be deleted.',
                'They are saved for retry.',
                4000
            );
        } else {
            notify.info('Form reset', '', 1500);
        }
    };

    const isBusy = formik.isSubmitting || isParentSubmitting || media.isDeleting;

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-600 mt-1">
                    Fill in the details below to {isEditing ? 'update' : 'create'} a product
                </p>
            </div>

            {/* Failed Cloudinary deletions */}
            {media.failedAssets.length > 0 && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-yellow-800">
                        {media.failedAssets.length} file(s) could not be deleted from
                        Cloudinary and are waiting for retry.
                    </p>
                    <button
                        type="button"
                        onClick={handleRetryFailed}
                        disabled={media.isRetrying || isBusy}
                        className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50 whitespace-nowrap"
                    >
                        {media.isRetrying ? 'Retrying...' : 'Retry deletion'}
                    </button>
                </div>
            )}

            {/* Basic Info Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={formik.values.sku}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="ABY-2025-001"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formik.touched.sku && formik.errors.sku && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.sku}</p>
                        )}
                    </div>

                    {/* Main Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="mainCategory"
                            value={formik.values.mainCategory}
                            onChange={formik.handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="abaya">Abaya</option>
                            <option value="hijab">Hijab</option>
                            <option value="borka">Borka</option>
                            <option value="khimar">Khimar</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>

                    {/* Product Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={formik.values.productName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Mahnoor Crepe Ari Borka"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {formik.touched.productName && formik.errors.productName && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.productName}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Pricing & Stock Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Pricing & Stock
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="newPrice"
                            value={formik.values.newPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                        {formik.touched.newPrice && formik.errors.newPrice && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.newPrice}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Old Price ($)
                        </label>
                        <input
                            type="number"
                            name="oldPrice"
                            value={formik.values.oldPrice}
                            onChange={formik.handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Sizes Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Available Sizes <span className="text-red-500">*</span>
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                        placeholder="Enter size (e.g., 52, M, L)"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddSize}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Size
                    </button>
                </div>

                {formik.touched.sizes && formik.errors.sizes && (
                    <p className="text-sm text-red-600">{formik.errors.sizes}</p>
                )}

                {formik.values.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formik.values.sizes.map((size, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                            >
                                {size}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSize(size)}
                                    className="hover:text-red-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Colors Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Available Colors <span className="text-red-500">*</span>
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                        placeholder="Enter color (e.g., Black, Navy Blue)"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddColor}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Color
                    </button>
                </div>

                {formik.touched.colors && formik.errors.colors && (
                    <p className="text-sm text-red-600">{formik.errors.colors}</p>
                )}

                {formik.values.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formik.values.colors.map((color, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full"
                            >
                                {color}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveColor(color)}
                                    className="hover:text-red-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Categories <span className="text-red-500">*</span>
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                        placeholder="Enter category (e.g., Embroidered Abaya)"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Add Category
                    </button>
                </div>

                {formik.touched.categories && formik.errors.categories && (
                    <p className="text-sm text-red-600">{formik.errors.categories}</p>
                )}

                {formik.values.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formik.values.categories.map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                            >
                                {category}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCategory(category)}
                                    className="hover:text-red-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tags Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Tags <span className="text-gray-500 text-sm">(Optional)</span>
                </h2>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Enter tag (e.g., Eid 2025, Best Seller)"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Add Tag
                    </button>
                </div>

                {formik.values.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formik.values.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-red-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Additional Info Section */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Additional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fabric Type
                        </label>
                        <input
                            type="text"
                            name="additionalInfo.fabric"
                            value={formik.values.additionalInfo.fabric}
                            onChange={formik.handleChange}
                            placeholder="e.g., Cey Crepe Imported"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Work Type
                        </label>
                        <input
                            type="text"
                            name="additionalInfo.workType"
                            value={formik.values.additionalInfo.workType}
                            onChange={formik.handleChange}
                            placeholder="e.g., Ari Embroidery"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Wash Care
                        </label>
                        <input
                            type="text"
                            name="additionalInfo.washCare"
                            value={formik.values.additionalInfo.washCare}
                            onChange={formik.handleChange}
                            placeholder="e.g., Dry Wash Recommended"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country of Origin
                        </label>
                        <input
                            type="text"
                            name="additionalInfo.countryOfOrigin"
                            value={formik.values.additionalInfo.countryOfOrigin}
                            onChange={formik.handleChange}
                            placeholder="e.g., Dubai"
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="additionalInfo.hijabIncluded"
                                checked={formik.values.additionalInfo.hijabIncluded}
                                onChange={formik.handleChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Matching Hijab Included
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                    Product Images
                </h2>
                <ImageUploadSection
                    images={formik.values.images}
                    onChange={handleImagesChange}
                    error={formik.touched.images && formik.errors.images}
                    onAssetsUploaded={media.registerUploads}
                    onAssetsOrphaned={media.trackOrphanedAssets}
                    onRemoveAsset={media.removeAsset}
                />
            </div>

            {/* Video Section */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                    Product Videos
                </h2>
                <VideoUploadSection
                    videos={formik.values.videos}
                    onChange={handleVideosChange}
                    error={formik.touched.videos && formik.errors.videos}
                    onAssetsUploaded={media.registerUploads}
                    onRemoveAsset={media.removeAsset}
                />
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                    Product Description
                </h2>
                <DescriptionEditor
                    value={formik.values.descriptionHtml}
                    onChange={(value) => formik.setFieldValue('descriptionHtml', value)}
                    error={formik.touched.descriptionHtml && formik.errors.descriptionHtml}
                />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                    type="button"
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    onClick={handleReset}
                    disabled={isBusy}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    disabled={isBusy || !formik.isValid}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {formik.isSubmitting
                        ? 'Saving...'
                        : isEditing
                            ? 'Update Product'
                            : 'Create Product'}
                </button>
            </div>
        </form>
    );
});

export default ProductForm;