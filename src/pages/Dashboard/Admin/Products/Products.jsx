// ============================================
// pages/admin/Products/Products.jsx
// ============================================
import { Download, Edit2, Eye, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductForm from '../../../../components/ProductForm/ProductForm';
import { useAllProducts } from '../../../../hooks/useProducts'; // Assuming this hook exists
import { createProduct } from '../../../../services/productService';
import notify from '../../../../utils/notification';

const Products = () => {
    // 1. Fetching Data using the Hook
    const {
        data: allProducts = [],
        isLoading,
        isError,
        refetch
    } = useAllProducts();

    // State for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // State for Modal & Editing
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Categories & Statuses (You might want to fetch these dynamically later)
    const categories = ['all', 'Abaya', 'Hijab', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];
    const statuses = ['all', 'active', 'low_stock', 'out_of_stock', 'draft'];

    // 2. Filter Logic (Dynamic)
    const filteredProducts = useMemo(() => {
        if (!allProducts) return [];

        return allProducts.filter(product => {
            const nameMatch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            const skuMatch = product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

            // Handle Category Filter (Check mainCategory or categories array)
            const categoryMatch = selectedCategory === 'all' ||
                product.mainCategory?.toLowerCase() === selectedCategory.toLowerCase() ||
                product.categories?.includes(selectedCategory);

            // Handle Status Filter (Logic based on stock if explicit status doesn't exist)
            let currentStatus = product.stock === 0 ? 'out_of_stock' : product.stock < 10 ? 'low_stock' : 'active';
            const statusMatch = selectedStatus === 'all' || currentStatus === selectedStatus;

            return (nameMatch || skuMatch) && categoryMatch && statusMatch;
        });
    }, [allProducts, searchTerm, selectedCategory, selectedStatus]);

    // Helper: Determine Status Color
    const getStatusColor = (stock) => {
        if (stock === 0) return 'badge-error';      // Out of stock
        if (stock < 10) return 'badge-warning';     // Low stock
        return 'badge-success';                     // Active
    };

    const getStatusLabel = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 10) return 'Low Stock';
        return 'Active';
    };

    // 3. Handlers
    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingProduct(null);
    };

    const handleCreateProduct = async (values) => {
        // TODO: Call your API Mutation here (useAddProduct or useUpdateProduct)
        console.log("Form Submitted with values:", values);
        try {
            const result = await createProduct(values);
            refetch(); // Reload table data
            handleCloseModal();
        } catch (error) {
            notify.error('Product deleted successfully');
        }

        

        // Example:
        // if (editingProduct) {
        //    await updateProduct(values);
        // } else {
        //    await createProduct(values);
        // }

        // After success:

    };

    const handleDeleteProduct = async (id) => {
        const confirmed = await notify.confirm(
            'Delete Product?',
            'Are you sure you want to delete this product? This action cannot be undone.',
            'Yes, Delete',
            'Cancel'
        );

        if (confirmed) {
            // TODO: Call your delete API here
            console.log("Deleting product ID:", id);
            // await deleteProduct(id);
            refetch();
            notify.success('Product deleted successfully');
        }
    };

    // Prepare Initial Values for Edit Mode
    // Mapping backend data structure to Formik structure
    const getInitialValues = (product) => {
        if (!product) return null;

        return {
            sku: product.sku || '',
            productName: product.productName || '',
            newPrice: product.newPrice || product.price || '',
            oldPrice: product.oldPrice || '',
            stock: product.stock || 0,
            sizes: product.sizes || [],
            colors: product.colors || [],
            mainCategory: product.mainCategory || 'abaya',
            categories: product.categories || [],
            tags: product.tags || [],
            images: product.images || [],
            video: product.video || null,
            descriptionHtml: product.descriptionHtml || '',
            additionalInfo: product.additionalInfo || {
                fabric: '',
                hijabIncluded: false,
                workType: '',
                washCare: '',
                countryOfOrigin: 'Dubai',
            },
        };
    };

    // 4. Render
    if (isLoading) return <div className="flex justify-center items-center h-96"><span className="loading loading-spinner loading-lg"></span></div>;
    if (isError) return <div className="text-red-500 text-center p-10">Error loading products. Please try again.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline btn-sm gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button className="btn btn-outline btn-sm gap-2">
                        <Upload size={16} /> Import
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setShowAddModal(true);
                        }}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{allProducts.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {allProducts.filter(p => p.stock >= 10).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {allProducts.filter(p => p.stock > 0 && p.stock < 10).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {allProducts.filter(p => p.stock === 0).length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                        {categories.map(cat => (
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
                        {statuses.map(status => (
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
                        <thead className='bg-gray-50'>
                            <tr className='text-gray-600'>
                                <th>
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                </th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
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
                                filteredProducts.map((product) => (
                                    <tr key={product.id || product._id} className="hover">
                                        <td>
                                            <input type="checkbox" className="checkbox checkbox-sm" />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border">
                                                        {/* Check if images exist, use first one, otherwise placeholder */}
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={product.images[0].thumbnailUrl || product.images[0].url}
                                                                alt={product.productName}
                                                            />
                                                        ) : (
                                                            <span className="flex items-center justify-center h-full text-2xl">🧥</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.productName}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                                        {product.colors && product.colors.join(', ')}
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
                                            ৳{product.newPrice}
                                        </td>
                                        <td>
                                            <span className={`font-medium ${product.stock === 0 ? 'text-red-600' :
                                                product.stock < 10 ? 'text-yellow-600' : 'text-gray-900'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusColor(product.stock)} badge-sm`}>
                                                {getStatusLabel(product.stock)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-ghost btn-xs text-gray-500" title="View">
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="btn btn-ghost btn-xs text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id || product._id)}
                                                    className="btn btn-ghost btn-xs text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
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

            {/* Modal for ProductForm */}
            {showAddModal && (
                <div className="modal modal-open z-50">
                    <div className="modal-box w-11/12 max-w-5xl bg-gray-50 p-0 overflow-hidden relative h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 bg-white border-b sticky top-0 z-10">
                            <h3 className="font-bold text-lg">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="overflow-y-auto h-[calc(90vh-60px)]">
                            <ProductForm
                                initialValues={getInitialValues(editingProduct)}
                                isEditing={!!editingProduct}
                                onSubmit={handleCreateProduct}
                            />
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
};

export default Products;