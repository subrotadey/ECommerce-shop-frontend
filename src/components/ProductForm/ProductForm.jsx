// src/components/ProductForm/ProductForm.jsx
import { useFormik } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as Yup from 'yup';
import notify from '../../utils/notification';
import DescriptionEditor from './DescriptionEditor';
import ImageUploadSection from './ImageUploadSection';
import VideoUploadSection from './VideoUploadSection';
import InventoryMatrix from './InventoryMatrix';
import { calculateTotalStock, normalizeInventoryForForm } from './inventoryUtils';
import {
    useMediaLifecycle,
    buildMediaAssets,
    getProductVideos,
} from '../../hooks/useMediaLifecycle';
import { VIDEO_UPLOAD_CONFIG } from '../../config/cloudinary';

// --------------------------------------
// CONSTANTS
// --------------------------------------

const MAIN_CATEGORIES = ['abaya', 'hijab'];

const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').trim();

// Active product-এ কঠোর নিয়ম, Draft-এ শিথিল (Backend-এর buildProductDocument-এর সঙ্গে মিল)
const buildValidationSchema = (status) => {
    const isActive = status === 'active';

    return Yup.object({
        sku: Yup.string().trim().required('SKU is required').max(60, 'SKU is too long'),
        productName: Yup.string()
            .trim()
            .required('Product name is required')
            .min(10, 'Name must be at least 10 characters')
            .max(200, 'Product name is too long'),
        mainCategory: Yup.string()
            .oneOf(MAIN_CATEGORIES, 'Main category must be Abaya or Hijab')
            .required('Main category is required'),
        newPrice: Yup.number()
            .typeError('Wholesale price is required')
            .required('Wholesale price is required')
            .positive('Price must be greater than 0'),
        oldPrice: Yup.number()
            .transform((value, original) =>
                original === '' || original === null ? null : value
            )
            .nullable()
            .typeError('Enter a valid number')
            .test(
                'compare-at',
                'Compare-at price must not be lower than the wholesale price',
                function (value) {
                    if (value === null || value === undefined || value === 0) return true;
                    const price = Number(this.parent.newPrice);
                    return !Number.isFinite(price) || value >= price;
                }
            ),
        inventory: isActive
            ? Yup.array().min(1, 'Add at least one color with stock quantities')
            : Yup.array(),
        categories: isActive
            ? Yup.array().min(1, 'At least one category required')
            : Yup.array(),
        images: isActive
            ? Yup.array()
                  .min(1, 'At least one image is required')
                  .max(10, 'Maximum 10 images allowed')
            : Yup.array().max(10, 'Maximum 10 images allowed'),
        videos: Yup.array().max(
            VIDEO_UPLOAD_CONFIG.maxFiles,
            `Maximum ${VIDEO_UPLOAD_CONFIG.maxFiles} videos allowed`
        ),
        descriptionHtml: isActive
            ? Yup.string().test(
                  'min-length',
                  'Description must be at least 50 characters',
                  (value) => stripHtml(value).length >= 50
              )
            : Yup.string(),
    });
};

const DEFAULT_VALUES = {
    sku: '',
    productName: '',
    mainCategory: 'abaya',
    status: 'active',
    newPrice: '',
    oldPrice: '',
    inventory: [],
    categories: [],
    tags: [],
    images: [],
    videos: [],
    descriptionHtml: '',
    additionalInfo: {
        fabric: '',
        workType: '',
        washCare: '',
        countryOfOrigin: 'UAE',
        hijabIncluded: false,
    },
};

const ALL_TOUCHED = {
    sku: true,
    productName: true,
    mainCategory: true,
    newPrice: true,
    oldPrice: true,
    inventory: true,
    categories: true,
    images: true,
    videos: true,
    descriptionHtml: true,
};

// Legacy `video`, এবং server-derived stock/sizes/colors form-এ রাখা হয় না।
const buildInitialValues = (initialValues) => {
    const source = initialValues || DEFAULT_VALUES;
    // eslint-disable-next-line no-unused-vars
    const { video, stock, sizes, colors, ...rest } = source;

    return {
        ...DEFAULT_VALUES,
        ...rest,
        status: rest.status || 'active',
        mainCategory: MAIN_CATEGORIES.includes(rest.mainCategory)
            ? rest.mainCategory
            : 'abaya',
        oldPrice: rest.oldPrice ?? '',
        inventory: normalizeInventoryForForm(rest.inventory),
        videos: getProductVideos({ videos: source.videos, video }),
        additionalInfo: {
            ...DEFAULT_VALUES.additionalInfo,
            ...(rest.additionalInfo || {}),
            countryOfOrigin: rest.additionalInfo?.countryOfOrigin || 'UAE',
        },
    };
};

const inputClass =
    'w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#123C32] disabled:bg-gray-100';

// --------------------------------------
// SMALL UI PIECES
// --------------------------------------

const Section = ({ number, title, hint, children }) => (
    <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3">
            <h2 className="text-lg font-semibold text-[#123C32] flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#123C32] text-xs text-white">
                    {number}
                </span>
                {title}
            </h2>
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        {children}
    </section>
);

const Field = ({ label, required, error, hint, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const ChipInput = ({ label, placeholder, items, onChange, required, error, disabled }) => {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        const value = input.trim().replace(/\s+/g, ' ');
        if (!value) return;

        if (value.length > 60) {
            notify.warning(`${label} is too long`, 'Maximum 60 characters.', 2000);
            return;
        }

        if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
            notify.warning(`${label} already exists`, '', 1500);
            return;
        }

        onChange([...items, value]);
        setInput('');
    };

    return (
        <Field label={label} required={required} error={error}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    disabled={disabled}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    placeholder={placeholder}
                    className={`flex-1 ${inputClass}`}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={disabled || !input.trim()}
                    className="h-10 px-4 bg-[#123C32] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    Add
                </button>
            </div>

            {items.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span
                            key={item}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F5EF] border border-[#D4AF37]/50 text-sm text-[#1A1A1A]"
                        >
                            {item}
                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onChange(items.filter((i) => i !== item))}
                                aria-label={`Remove ${item}`}
                                className="text-gray-400 hover:text-red-600"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </Field>
    );
};

// --------------------------------------
// FORM
// --------------------------------------
// ref দিয়ে parent (Products.jsx) পায়:
//   hasUnsavedMedia() -> unsaved upload / pending removal আছে কি না
//   isDirty()         -> Formik-এর field বদলেছে কি না
//   discardUnsaved()  -> এই session-এর unsaved upload Cloudinary থেকে মোছে
//   isBusy()          -> delete চলছে কি না
//
// onCancel: Cancel বোতামে parent-এর close/confirm handler চলে।

const ProductForm = forwardRef(function ProductForm(
    {
        initialValues,
        onSubmit,
        isEditing = false,
        isSubmitting: isParentSubmitting = false,
        onSaveComplete,
        onCancel,
    },
    ref
) {
    const [baseValues] = useState(() => buildInitialValues(initialValues));

    const media = useMediaLifecycle({
        initialImages: baseValues.images,
        initialVideos: baseValues.videos,
    });

    // Save বোতামের status Formik state-এর আগেই validation-এ লাগে, তাই ref।
    const intendedStatusRef = useRef(null);
    const valuesStatusRef = useRef(baseValues.status);

    const formik = useFormik({
        initialValues: baseValues,
        validationSchema: () =>
            buildValidationSchema(intendedStatusRef.current ?? valuesStatusRef.current),
        // Save বোতামগুলো handleSave দিয়ে নিজেই চালায়। Enter চাপলে submit হয় না।
        onSubmit: () => {},
    });

        useEffect(() => {
            valuesStatusRef.current = formik.values.status;
    }, [formik.values.status]);

    useImperativeHandle(
        ref,
        () => ({
            hasUnsavedMedia: media.hasUnsavedMedia,
            isDirty: () => formik.dirty,
            discardUnsaved: media.discardUnsaved,
            isBusy: () => media.isDeleting,
        }),
        [media.hasUnsavedMedia, media.discardUnsaved, media.isDeleting, formik.dirty]
    );

    const isBusy = formik.isSubmitting || isParentSubmitting || media.isDeleting;

    // --------------------------------------
    // SAVE
    // --------------------------------------

    const save = async (values) => {
        let saveSucceeded = false;
        formik.setSubmitting(true);

        try {
            notify.loading('Saving product...');

            // 1. MongoDB save। ব্যর্থ হলে Cloudinary-তে কিছুই মোছা হয় না।
            await onSubmit(values);
            saveSucceeded = true;

            // 2. Save সফল: removed ও অব্যবহৃত upload মোছা।
            let cleanupFailedCount = 0;

            try {
                const cleanup = await media.finalizeSave(
                    buildMediaAssets({ images: values.images, videos: values.videos })
                );
                cleanupFailedCount = cleanup.failed.length;
            } catch (cleanupError) {
                console.error('Media cleanup error:', cleanupError);
                cleanupFailedCount = 1;
            }

            notify.close();

            notify.success(
                values.status === 'draft'
                    ? 'Draft saved!'
                    : isEditing
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
            notify.error('Failed to save product', error.message || 'Please try again', 4000);
        } finally {
            formik.setSubmitting(false);
            intendedStatusRef.current = null;
        }

        if (saveSucceeded) {
            onSaveComplete?.();
        }
    };

    // target: 'draft' | 'active'
    //   Save as Draft -> সবসময় draft
    //   Save Product  -> active (archived product archived-ই থাকে)
    const handleSave = async (target) => {
        if (isBusy) return;

        const nextStatus =
            target === 'draft'
                ? 'draft'
                : formik.values.status === 'draft'
                    ? 'active'
                    : formik.values.status;

        const values = { ...formik.values, status: nextStatus };

        intendedStatusRef.current = nextStatus;
        formik.setFieldValue('status', nextStatus, false);

        const errors = await formik.validateForm(values);

        if (Object.keys(errors).length > 0) {
            intendedStatusRef.current = null;
            formik.setTouched(ALL_TOUCHED, false);

            const first = Object.values(errors).find((e) => typeof e === 'string');
            notify.warning(
                'Please fix the highlighted fields',
                first || 'Some required fields are missing.',
                3500
            );
            return;
        }

        await save(values);
    };

    // --------------------------------------
    // RESET / RETRY
    // --------------------------------------

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

    const handleRetryFailed = async () => {
        const result = await media.retryFailed();

        if (result.failed.length === 0) {
            notify.success(`${result.deleted.length} file(s) deleted from Cloudinary.`);
        } else {
            notify.warning(
                `${result.failed.length} file(s) still could not be deleted.`,
                'Please try again later.',
                4000
            );
        }
    };

    // --------------------------------------
    // HELPERS
    // --------------------------------------

    const { values, touched, errors } = formik;
    const fieldError = (name) => (touched[name] && errors[name]) || '';
    const inventoryError =
        touched.inventory && typeof errors.inventory === 'string' ? errors.inventory : '';
    const totalStock = calculateTotalStock(values.inventory);

    const setInfo = (key, value) =>
        formik.setFieldValue('additionalInfo', { ...values.additionalInfo, [key]: value });

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 bg-[#F7F5EF]"
        >
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                    Active products need an image, stock and a description. Drafts can be incomplete.
                </p>
            </div>

            {/* Failed Cloudinary deletions */}
            {media.failedAssets.length > 0 && (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-center justify-between gap-4">
                    <p className="text-sm text-yellow-800">
                        {media.failedAssets.length} file(s) could not be deleted from Cloudinary
                        and are waiting for retry.
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

            {/* 1. Basic Information */}
            <Section number={1} title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="SKU" required error={fieldError('sku')}>
                        <input
                            type="text"
                            name="sku"
                            value={values.sku}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={isBusy}
                            placeholder="ABY-2026-001"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Main Category" required error={fieldError('mainCategory')}>
                        <select
                            name="mainCategory"
                            value={values.mainCategory}
                            onChange={formik.handleChange}
                            disabled={isBusy}
                            className={inputClass}
                        >
                            <option value="abaya">Abaya</option>
                            <option value="hijab">Hijab</option>
                        </select>
                    </Field>

                    <div className="md:col-span-2">
                        <Field label="Product Name" required error={fieldError('productName')}>
                            <input
                                type="text"
                                name="productName"
                                value={values.productName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isBusy}
                                placeholder="Mahnoor Crepe Ari Abaya"
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Product Status"
                        hint="Draft products are hidden from the storefront."
                    >
                        <select
                            name="status"
                            value={values.status}
                            onChange={formik.handleChange}
                            disabled={isBusy}
                            className={inputClass}
                        >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            {baseValues.status === 'archived' && (
                                <option value="archived">Archived</option>
                            )}
                        </select>
                    </Field>
                </div>
            </Section>

            {/* 2. Pricing */}
            <Section
                number={2}
                title="Pricing"
                hint="Enter prices in AED. Delivery charges are not included in the product price."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Wholesale Price (AED)" required error={fieldError('newPrice')}>
                        <input
                            type="number"
                            name="newPrice"
                            min="0"
                            step="0.01"
                            value={values.newPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={isBusy}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Compare-at Price (AED)" error={fieldError('oldPrice')}>
                        <input
                            type="number"
                            name="oldPrice"
                            min="0"
                            step="0.01"
                            value={values.oldPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={isBusy}
                            className={inputClass}
                        />
                    </Field>
                </div>
            </Section>

            {/* 3. Inventory */}
            <Section
                number={3}
                title="Inventory by Color & Size"
                hint="Size chart: S=52, M=54, L=56, XL=58, XXL=60, 3XL=62. Total stock is calculated automatically."
            >
                <InventoryMatrix
                    value={values.inventory}
                    onChange={(inventory) => formik.setFieldValue('inventory', inventory)}
                    error={inventoryError}
                    disabled={isBusy}
                />
                <p className="text-xs text-gray-500">Current total: {totalStock} pcs</p>
            </Section>

            {/* 4. Categories & Tags */}
            <Section number={4} title="Categories & Tags">
                <ChipInput
                    label="Categories"
                    required={values.status === 'active'}
                    placeholder="e.g., Embroidered Abaya"
                    items={values.categories}
                    onChange={(items) => formik.setFieldValue('categories', items)}
                    error={fieldError('categories')}
                    disabled={isBusy}
                />
                <ChipInput
                    label="Tags"
                    placeholder="e.g., Eid 2026, Best Seller"
                    items={values.tags}
                    onChange={(items) => formik.setFieldValue('tags', items)}
                    disabled={isBusy}
                />
            </Section>

            {/* 5. Additional Information */}
            <Section number={5} title="Additional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Fabric Type">
                        <input
                            type="text"
                            value={values.additionalInfo.fabric}
                            onChange={(e) => setInfo('fabric', e.target.value)}
                            disabled={isBusy}
                            placeholder="e.g., Cey Crepe Imported"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Work Type">
                        <input
                            type="text"
                            value={values.additionalInfo.workType}
                            onChange={(e) => setInfo('workType', e.target.value)}
                            disabled={isBusy}
                            placeholder="e.g., Ari Embroidery"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Country of Origin">
                        <input
                            type="text"
                            value={values.additionalInfo.countryOfOrigin}
                            onChange={(e) => setInfo('countryOfOrigin', e.target.value)}
                            disabled={isBusy}
                            placeholder="UAE"
                            className={inputClass}
                        />
                    </Field>

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer h-10">
                            <input
                                type="checkbox"
                                checked={values.additionalInfo.hijabIncluded}
                                onChange={(e) => setInfo('hijabIncluded', e.target.checked)}
                                disabled={isBusy}
                                className="w-5 h-5 accent-[#123C32]"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Matching Hijab Included
                            </span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <Field label="Wash & Care">
                            <textarea
                                rows={3}
                                value={values.additionalInfo.washCare}
                                onChange={(e) => setInfo('washCare', e.target.value)}
                                disabled={isBusy}
                                maxLength={1000}
                                placeholder="e.g., Dry wash recommended. Do not bleach."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#123C32] disabled:bg-gray-100"
                            />
                        </Field>
                    </div>
                </div>
            </Section>

            {/* 6. Images */}
            <Section number={6} title="Product Images" hint="Up to 10 images. Choose one Main image.">
                <ImageUploadSection
                    images={values.images}
                    onChange={(images) => formik.setFieldValue('images', images)}
                    error={fieldError('images')}
                    onAssetsUploaded={media.registerUploads}
                    onAssetsOrphaned={media.trackOrphanedAssets}
                    onRemoveAsset={media.removeAsset}
                />
            </Section>

            {/* 7. Videos */}
            <Section number={7} title="Product Videos" hint="Up to 3 videos (optional).">
                <VideoUploadSection
                    videos={values.videos}
                    onChange={(videos) => formik.setFieldValue('videos', videos)}
                    error={fieldError('videos')}
                    onAssetsUploaded={media.registerUploads}
                    onRemoveAsset={media.removeAsset}
                />
            </Section>

            {/* 8. Description */}
            <Section number={8} title="Product Description">
                <DescriptionEditor
                    value={values.descriptionHtml}
                    onChange={(value) => formik.setFieldValue('descriptionHtml', value)}
                    error={fieldError('descriptionHtml')}
                />
            </Section>

            {/* Actions */}
            <div className="sticky bottom-0 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-white/95 backdrop-blur border-t border-gray-200 flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    onClick={() => onCancel?.()}
                    disabled={isBusy}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isBusy}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={() => handleSave('draft')}
                    disabled={isBusy}
                    className="px-5 py-2 border border-[#123C32] text-[#123C32] rounded-lg hover:bg-[#123C32]/5 disabled:opacity-50"
                >
                    Save as Draft
                </button>
                <button
                    type="button"
                    onClick={() => handleSave('active')}
                    disabled={isBusy}
                    className="px-6 py-2 bg-[#123C32] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {formik.isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
});

export default ProductForm;