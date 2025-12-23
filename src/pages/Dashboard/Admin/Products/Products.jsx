// ============================================
// pages/admin/Products/Products.jsx
// ============================================
import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, Upload, MoreVertical, X } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Premium Abaya - Black', sku: 'ABY-001', category: 'Abayas', price: 149.99, stock: 45, status: 'active', image: '🧥', sales: 156 },
        { id: 2, name: 'Embroidered Hijab Set', sku: 'HIJ-002', category: 'Hijabs', price: 34.99, stock: 120, status: 'active', image: '🧕', sales: 243 },
        { id: 3, name: 'Modest Dress - Navy', sku: 'DRS-003', category: 'Dresses', price: 89.99, stock: 23, status: 'active', image: '👗', sales: 128 },
        { id: 4, name: 'Prayer Mat Deluxe', sku: 'PRM-004', category: 'Accessories', price: 45.99, stock: 0, status: 'out_of_stock', image: '🕌', sales: 95 },
        { id: 5, name: 'Silk Scarf - Burgundy', sku: 'SCF-005', category: 'Hijabs', price: 24.99, stock: 67, status: 'active', image: '🧣', sales: 189 },
        { id: 6, name: 'Long Sleeve Tunic', sku: 'TNC-006', category: 'Tops', price: 54.99, stock: 34, status: 'active', image: '👚', sales: 78 },
        { id: 7, name: 'Wide Leg Pants', sku: 'PNT-007', category: 'Bottoms', price: 64.99, stock: 12, status: 'low_stock', image: '👖', sales: 56 },
        { id: 8, name: 'Embellished Abaya', sku: 'ABY-008', category: 'Abayas', price: 199.99, stock: 18, status: 'active', image: '👘', sales: 92 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const categories = ['all', 'Abayas', 'Hijabs', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];
    const statuses = ['all', 'active', 'low_stock', 'out_of_stock', 'draft'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            active: 'badge-success',
            low_stock: 'badge-warning',
            out_of_stock: 'badge-error',
            draft: 'badge-ghost',
        };
        return colors[status] || 'badge-ghost';
    };

    const handleDeleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const AddEditProductModal = ({ product, onClose, onSave }) => {
        const [formData, setFormData] = useState(product || {
            name: '',
            sku: '',
            category: 'Abayas',
            price: '',
            stock: '',
            status: 'active',
            description: '',
            image: '🧥'
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (product) {
                setProducts(products.map(p => p.id === product.id ? { ...formData, id: product.id } : p));
            } else {
                setProducts([...products, { ...formData, id: Date.now(), sales: 0 }]);
            }
            onClose();
        };

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Product Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">SKU</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Category</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    {categories.filter(c => c !== 'all').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    {statuses.filter(s => s !== 'all').map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Price ($)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input input-bordered"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Stock</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {product ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline btn-sm gap-2">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="btn btn-outline btn-sm gap-2">
                        <Upload size={16} />
                        Import
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {products.filter(p => p.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {products.filter(p => p.status === 'low_stock').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {products.filter(p => p.status === 'out_of_stock').length}
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products by name or SKU..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="select select-bordered"
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
                        className="select select-bordered"
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
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                </th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Sales</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover">
                                    <td>
                                        <input type="checkbox" className="checkbox checkbox-sm" />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                                {product.image}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">{product.sku}</td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm">{product.category}</span>
                                    </td>
                                    <td className="font-semibold text-gray-900">${product.price}</td>
                                    <td>
                                        <span className={`font-medium ${
                                            product.stock === 0 ? 'text-red-600' :
                                            product.stock < 20 ? 'text-yellow-600' :
                                            'text-gray-900'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="text-gray-600">{product.sales}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(product.status)} badge-sm`}>
                                            {product.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button 
                                                className="btn btn-ghost btn-xs"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowAddModal(true);
                                                }}
                                                className="btn btn-ghost btn-xs"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="btn btn-ghost btn-xs text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </div>
                    <div className="join">
                        <button className="join-item btn btn-sm">«</button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">2</button>
                        <button className="join-item btn btn-sm">3</button>
                        <button className="join-item btn btn-sm">»</button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <AddEditProductModal
                    product={editingProduct}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
};

export default Products;