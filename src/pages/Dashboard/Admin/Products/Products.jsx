// pages/admin/Products/Products.jsx
import { Download, Edit2, Eye, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProductForm from '../../../../components/ProductForm/ProductForm';
import { SIZE_CHART } from '../../../../components/ProductForm/inventoryUtils';
import { useAdminProducts } from '../../../../hooks/useProducts';
import { getProductVideos } from '../../../../hooks/useMediaLifecycle';
import { createProduct, updateProduct, deleteProduct } from '../../../../services/productService';
import notify from '../../../../utils/notification';
import { formatMoney } from '../../../../utils/currency';
import { optimizedVideoUrl } from '../../../../config/cloudinary';

const LOW_STOCK_THRESHOLD = 10;

const CATEGORIES = ['all', 'Abaya', 'Hijab'];
const STATUSES = ['all', 'active', 'draft', 'archived', 'low_stock', 'out_of_stock'];

// Product-এর দেখানো অবস্থা: status আগে, তারপর stock।
// status না থাকলে (পুরোনো data) active ধরা হয়।
const getDisplayStatus = (product) => {
    if (product.status === 'draft') return 'draft';
    if (product.status === 'archived') return 'archived';

    const stock = Number(product.stock) || 0;
    if (stock === 0) return 'out_of_stock';
    if (stock < LOW_STOCK_THRESHOLD) return 'low_stock';
    return 'active';
};

const STATUS_BADGE = {
    active: { className: 'badge-success', label: 'Active' },
    low_stock: { className: 'badge-warning', label: 'Low Stock' },
    out_of_stock: { className: 'badge-error', label: 'Out of Stock' },
    draft: { className: 'badge-ghost border-gray-300', label: 'Draft' },
    archived: { className: 'badge-neutral', label: 'Archived' },
};

const formatUsd = (value) => formatMoney(value);

const getProductImages = (product) => product.media?.images || product.images || [];

const Products = () => {
    const queryClient = useQueryClient();

    // 1. Fetching Data (admin: draft সহ সব)
    const {
        data: allProducts = [],
        isLoading,
        isError,
        refetch,
    } = useAdminProducts();

    // State for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [viewingProduct, setViewingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // ProductForm-এর unsaved media ও dirty state নিয়ন্ত্রণ
    const formRef = useRef(null);

    // 2. Filter Logic
    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return allProducts.filter((product) => {
            const nameMatch = product.productName?.toLowerCase().includes(term);
            const skuMatch = product.sku?.toLowerCase().includes(term);

            const categoryMatch =
                selectedCategory === 'all' ||
                product.mainCategory?.toLowerCase() === selectedCategory.toLowerCase() ||
                product.categories?.includes(selectedCategory);

            const statusMatch =
                selectedStatus === 'all' || getDisplayStatus(product) === selectedStatus;

            return (nameMatch || skuMatch) && categoryMatch && statusMatch;
        });
    }, [allProducts, searchTerm, selectedCategory, selectedStatus]);

    const stats = useMemo(() => {
        const counts = { active: 0, draft: 0, low_stock: 0, out_of_stock: 0 };
        allProducts.forEach((product) => {
            const status = getDisplayStatus(product);
            if (status in counts) counts[status] += 1;
        });
        return counts;
    }, [allProducts]);

    // 3. Handlers

    // Save-এর পর admin তালিকা ও public (Storefront) cache দুটোই নতুন করা।
    const refreshProducts = async () => {
        await Promise.all([
            refetch(),
            queryClient.invalidateQueries({ queryKey: ['products'] }),
        ]);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingProduct(null);
    };

    // Modal Close ও Cancel: field বদলেছে বা unsaved media থাকলে confirm।
    // Original (আগে saved) media কখনো ছোঁয়া হয় না।
    const handleCloseModal = async () => {
        if (isSubmitting || isClosing) return;

        const form = formRef.current;

        if (form?.isBusy?.()) return;

        const hasChanges = form?.isDirty?.() || form?.hasUnsavedMedia?.();

        if (!hasChanges) {
            closeModal();
            return;
        }

        const confirmed = await notify.confirm(
            'Discard product changes?',
            'Unsaved changes will be lost. Files uploaded in this session will be deleted from Cloudinary.',
            'Discard',
            'Continue Editing'
        );

        if (!confirmed) return;

        setIsClosing(true);
        notify.loading('Cleaning up uploads...');

        let failedCount = 0;

        try {
            const result = await form.discardUnsaved();
            failedCount = result.failed.length;
        } catch (error) {
            console.error('Cloudinary cleanup error:', error);
            failedCount = 1;
        } finally {
            notify.close();
            setIsClosing(false);
        }

        // ব্যর্থ asset failed queue-তে (localStorage) আছে, retry করা যাবে।
        closeModal();

        if (failedCount > 0) {
            notify.warning(
                'Closed, but some uploaded files could not be deleted.',
                'They are saved for retry. Open the product form and press "Retry deletion".',
                5000
            );
        }
    };

    const handleCloseViewModal = () => setViewingProduct(null);

    // Create/Update Product Handler
    const handleCreateProduct = async (values) => {
        setIsSubmitting(true);

        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, values);
            } else {
                await createProduct(values);
            }

            // Refresh failure should not turn a successful save into an error.
            try {
                await refreshProducts();
            } catch (refreshError) {
                console.error('Product refresh failed:', refreshError);
            }

            // isSubmitting ProductForm cleanup শেষ না হওয়া পর্যন্ত true থাকে।
        } catch (error) {
            console.error('Product save error:', error);
            setIsSubmitting(false);
            throw error;
        }
    };

    const handleSaveComplete = () => {
        setIsSubmitting(false);
        closeModal();
    };

    // Delete Handler
    const handleDeleteProduct = async (productId) => {
        try {
            const confirmed = await notify.confirm(
                'Delete Product?',
                'Are you sure you want to delete this product? This action cannot be undone.',
                'Yes, Delete',
                'Cancel'
            );

            if (!confirmed) return;

            const result = await deleteProduct(productId);

            if (result.cancelled) return;

            notify.success('Product deleted successfully!');

            await refreshProducts();
        } catch (error) {
            notify.close();
            notify.error('Delete Failed', error.message || 'Failed to delete product');
            console.error('Delete error:', error);
        }
    };

    const handleViewProduct = (product) => setViewingProduct(product);

    const handleEditProduct = (product) => {
        if (isSubmitting || isClosing) return;
        setEditingProduct(product);
        setShowAddModal(true);
    };

    const handleAddProduct = () => {
        if (isSubmitting || isClosing) return;
        setEditingProduct(null);
        setShowAddModal(true);
    };

    const handleExport = () => notify.info('Export feature coming soon!');
    const handleImport = () => notify.info('Import feature coming soon!');

    // Get Initial Values for Edit
    // stock/sizes/colors পাঠানো হয় না: backend inventory থেকে নিজে হিসাব করে।
    const getInitialValues = (product) => {
        if (!product) return null;

        return {
            sku: product.sku || '',
            productName: product.productName || '',
            status: product.status || 'active',
            mainCategory: product.mainCategory || 'abaya',
            newPrice: product.newPrice ?? '',
            oldPrice: product.oldPrice ?? '',
            inventory: product.inventory || [],
            categories: product.categories || [],
            tags: product.tags || [],
            images: getProductImages(product),
            videos: getProductVideos(product),
            descriptionHtml: product.descriptionHtml || '',
            additionalInfo: product.additionalInfo || {},
        };
    };

    // View modal-এর জন্য
    const viewingVideos = viewingProduct ? getProductVideos(viewingProduct) : [];
    const viewingImages = viewingProduct ? getProductImages(viewingProduct) : [];

    // 4. Render
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-500 text-center p-10">
                <p className="text-xl font-semibold mb-2">Error loading products</p>
                <p className="text-sm">Please try refreshing the page</p>
                <button onClick={() => refetch()} className="btn btn-primary btn-sm mt-4">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn btn-outline btn-sm gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handleImport} className="btn btn-outline btn-sm gap-2">
                        <Upload size={16} /> Import
                    </button>
                    <button onClick={handleAddProduct} className="btn btn-primary btn-sm gap-2">
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{allProducts.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-gray-500 mt-1">{stats.draft}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.low_stock}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{stats.out_of_stock}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search products by name or SKU..."
                                className="input bg-gray-100 input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="select bg-gray-100 select-bordered"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                    <select
                        className="select bg-gray-100 select-bordered"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        {STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-600">
                                <th>
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                </th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price (USD)</th>
                                <th>Total Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const displayStatus = getDisplayStatus(product);
                                    const badge = STATUS_BADGE[displayStatus];
                                    const stock = Number(product.stock) || 0;
                                    const firstImage = getProductImages(product)[0];
                                    const colorNames = (product.inventory?.length
                                        ? product.inventory.map((row) => row.color)
                                        : product.colors || []
                                    ).join(', ');

                                    return (
                                        <tr key={product._id} className="hover">
                                            <td>
                                                <input type="checkbox" className="checkbox checkbox-sm" />
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border">
                                                            {firstImage ? (
                                                                <img
                                                                    src={firstImage.thumbnailUrl || firstImage.url}
                                                                    alt={product.productName}
                                                                />
                                                            ) : (
                                                                <span className="flex items-center justify-center h-full text-2xl">
                                                                    🧥
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {product.productName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                                            {colorNames}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-gray-600 font-mono text-xs">{product.sku}</td>
                                            <td>
                                                <span className="badge badge-ghost badge-sm capitalize">
                                                    {product.mainCategory}
                                                </span>
                                            </td>
                                            <td className="font-semibold text-gray-900">
                                                {formatUsd(product.newPrice)}
                                            </td>
                                            <td>
                                                <span
                                                    className={`font-medium ${
                                                        stock === 0
                                                            ? 'text-red-600'
                                                            : stock < LOW_STOCK_THRESHOLD
                                                                ? 'text-yellow-600'
                                                                : 'text-gray-900'
                                                    }`}
                                                >
                                                    {stock}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${badge.className} badge-sm`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewProduct(product)}
                                                        className="btn btn-ghost btn-xs text-gray-500"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="btn btn-ghost btn-xs text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="btn btn-ghost btn-xs text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {filteredProducts.length} of {allProducts.length} products
                    </div>
                    <div className="join">
                        <button className="join-item btn btn-sm">«</button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">»</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div className="modal modal-open z-50">
                    <div className="modal-box w-11/12 max-w-5xl bg-gray-50 p-0 overflow-hidden relative h-[90vh]">
                        <div className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-10">
                            <h3 className="font-bold text-lg">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="btn btn-sm btn-circle btn-ghost"
                                disabled={isSubmitting || isClosing}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto h-[calc(90vh-60px)]">
                            <ProductForm
                                ref={formRef}
                                key={editingProduct?._id || 'new'}
                                initialValues={getInitialValues(editingProduct)}
                                isEditing={!!editingProduct}
                                onSubmit={handleCreateProduct}
                                isSubmitting={isSubmitting}
                                onSaveComplete={handleSaveComplete}
                                onCancel={handleCloseModal}
                            />
                        </div>
                    </div>
                    {!isSubmitting && !isClosing && (
                        <div className="modal-backdrop" onClick={handleCloseModal} />
                    )}
                </div>
            )}

            {/* View Product Modal */}
            {viewingProduct && (
                <div className="modal modal-open z-50">
                    <div className="modal-box w-11/12 max-w-4xl bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-2xl">{viewingProduct.productName}</h3>
                                <span
                                    className={`badge ${
                                        STATUS_BADGE[getDisplayStatus(viewingProduct)].className
                                    }`}
                                >
                                    {STATUS_BADGE[getDisplayStatus(viewingProduct)].label}
                                </span>
                            </div>
                            <button
                                onClick={handleCloseViewModal}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Images */}
                            <div>
                                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-3">
                                    {viewingImages[0] ? (
                                        <img
                                            src={(viewingImages.find((i) => i.isMain) || viewingImages[0]).url}
                                            alt={viewingProduct.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-6xl">🧥</div>
                                    )}
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {viewingImages.slice(1, 5).map((img, idx) => (
                                        <div key={img.publicId || idx} className="w-full h-20 bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={img.thumbnailUrl || img.url}
                                                alt={`Product ${idx + 2}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Videos */}
                                {viewingVideos.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm text-gray-500">Videos</p>
                                        {viewingVideos.map((video) => (
                                            <video
                                                key={video.publicId}
                                                src={optimizedVideoUrl(video.url)}
                                                poster={video.thumbnailUrl}
                                                controls
                                                preload="metadata"
                                                className="w-full max-h-48 bg-black rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">SKU</p>
                                        <p className="font-mono text-lg">{viewingProduct.sku}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Wholesale Price</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatUsd(viewingProduct.newPrice)}
                                        </p>
                                        {viewingProduct.oldPrice && (
                                            <p className="text-sm text-gray-500 line-through">
                                                {formatUsd(viewingProduct.oldPrice)}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Stock</p>
                                        <p className="text-lg font-semibold">{viewingProduct.stock || 0} pcs</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <span className="badge badge-ghost capitalize">
                                            {viewingProduct.mainCategory}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => {
                                            handleCloseViewModal();
                                            handleEditProduct(viewingProduct);
                                        }}
                                        className="btn btn-primary btn-sm"
                                    >
                                        <Edit2 size={16} /> Edit Product
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCloseViewModal();
                                            handleDeleteProduct(viewingProduct._id);
                                        }}
                                        className="btn btn-error btn-sm"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        {viewingProduct.inventory?.length > 0 && (
                            <div className="mt-6 border-t pt-6">
                                <h4 className="font-semibold mb-3">Inventory by Color & Size</h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm w-full">
                                        <thead>
                                            <tr>
                                                <th>Color</th>
                                                {SIZE_CHART.map(({ size, length }) => (
                                                    <th key={size} className="text-center">
                                                        {size} ({length})
                                                    </th>
                                                ))}
                                                <th className="text-center">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewingProduct.inventory.map((row) => (
                                                <tr key={row.color}>
                                                    <td className="font-medium">{row.color}</td>
                                                    {SIZE_CHART.map(({ size }) => (
                                                        <td key={size} className="text-center">
                                                            {row.sizes?.find((s) => s.size === size)?.stock ?? 0}
                                                        </td>
                                                    ))}
                                                    <td className="text-center font-semibold">
                                                        {(row.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {viewingProduct.descriptionHtml && (
                            <div className="mt-6 border-t pt-6">
                                <h4 className="font-semibold mb-3">Description</h4>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: viewingProduct.descriptionHtml }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseViewModal}></div>
                </div>
            )}
        </div>
    );
};

export default Products;