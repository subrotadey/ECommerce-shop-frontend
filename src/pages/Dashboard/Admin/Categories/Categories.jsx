// ============================================
// pages/admin/Categories/Categories.jsx
// ============================================
import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Image as ImageIcon } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Abayas', slug: 'abayas', description: 'Traditional modest wear', products: 45, icon: '🧥', status: 'active' },
        { id: 2, name: 'Hijabs', slug: 'hijabs', description: 'Headscarves and wraps', products: 67, icon: '🧕', status: 'active' },
        { id: 3, name: 'Dresses', slug: 'dresses', description: 'Modest dresses collection', products: 34, icon: '👗', status: 'active' },
        { id: 4, name: 'Tops', slug: 'tops', description: 'Modest tops and tunics', products: 28, icon: '👚', status: 'active' },
        { id: 5, name: 'Bottoms', slug: 'bottoms', description: 'Pants and skirts', products: 19, icon: '👖', status: 'active' },
        { id: 6, name: 'Accessories', slug: 'accessories', description: 'Prayer mats, scarves', products: 52, icon: '🕌', status: 'active' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    const CategoryModal = ({ category, onClose }) => {
        const [formData, setFormData] = useState(category || {
            name: '',
            slug: '',
            description: '',
            icon: '📦',
            status: 'active'
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (category) {
                setCategories(categories.map(c => c.id === category.id ? { ...formData, id: category.id, products: category.products } : c));
            } else {
                setCategories([...categories, { ...formData, id: Date.now(), products: 0 }]);
            }
            onClose();
        };

        return (
            <div className="modal modal-open">
                <div className="modal-box">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                            {category ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Category Name</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Slug</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={formData.slug}
                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Icon (Emoji)</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered text-2xl"
                                value={formData.icon}
                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                maxLength={2}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-20"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {category ? 'Update' : 'Create'} Category
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
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Organize your products into categories</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary btn-sm gap-2"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active Categories</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {categories.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {categories.reduce((sum, c) => sum + c.products, 0)}
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl">
                                {category.icon}
                            </div>
                            <div className="dropdown dropdown-end">
                                <button className="btn btn-ghost btn-sm btn-circle">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>
                                <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-40 border border-gray-200">
                                    <li>
                                        <a onClick={() => {
                                            setEditingCategory(category);
                                            setShowModal(true);
                                        }}>
                                            <Edit2 size={14} /> Edit
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => handleDelete(category.id)} className="text-red-600">
                                            <Trash2 size={14} /> Delete
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{category.products}</p>
                                <p className="text-xs text-gray-500">Products</p>
                            </div>
                            <span className={`badge ${category.status === 'active' ? 'badge-success' : 'badge-ghost'} badge-sm`}>
                                {category.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Modal */}
            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                    }}
                />
            )}
        </div>
    );
};

export default Categories;