// ============================================
// pages/admin/Coupons.jsx
// ============================================
import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Check, X, Percent, DollarSign } from 'lucide-react';

const Coupons = () => {
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            code: 'WELCOME20',
            type: 'percentage',
            value: 20,
            minOrder: 50,
            maxDiscount: 100,
            usage: 145,
            limit: 500,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'active'
        },
        {
            id: 2,
            code: 'SAVE10',
            type: 'fixed',
            value: 10,
            minOrder: 30,
            maxDiscount: null,
            usage: 89,
            limit: 200,
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            status: 'active'
        },
        {
            id: 3,
            code: 'SUMMER50',
            type: 'percentage',
            value: 50,
            minOrder: 100,
            maxDiscount: 200,
            usage: 234,
            limit: 300,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            status: 'expired'
        },
        {
            id: 4,
            code: 'FREESHIP',
            type: 'free_shipping',
            value: 0,
            minOrder: 50,
            maxDiscount: null,
            usage: 67,
            limit: 1000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'active'
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'badge-success',
            expired: 'badge-error',
            disabled: 'badge-ghost',
        };
        return colors[status];
    };

    const CouponModal = ({ coupon, onClose }) => {
        const [formData, setFormData] = useState(coupon || {
            code: '',
            type: 'percentage',
            value: 0,
            minOrder: 0,
            maxDiscount: null,
            limit: 100,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active'
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (coupon) {
                setCoupons(coupons.map(c => c.id === coupon.id ? { ...formData, id: coupon.id, usage: coupon.usage } : c));
            } else {
                setCoupons([...coupons, { ...formData, id: Date.now(), usage: 0 }]);
            }
            onClose();
        };

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">
                            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control col-span-2">
                                <label className="label">
                                    <span className="label-text font-medium">Coupon Code</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Discount Type</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                    <option value="free_shipping">Free Shipping</option>
                                </select>
                            </div>

                            {formData.type !== 'free_shipping' && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            {formData.type === 'percentage' ? 'Discount (%)' : 'Amount ($)'}
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        value={formData.value}
                                        onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Min Order ($)</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.minOrder}
                                    onChange={(e) => setFormData({...formData, minOrder: parseFloat(e.target.value)})}
                                />
                            </div>

                            {formData.type === 'percentage' && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Max Discount ($)</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        value={formData.maxDiscount || ''}
                                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value ? parseFloat(e.target.value) : null})}
                                    />
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Usage Limit</span>
                                </label>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={formData.limit}
                                    onChange={(e) => setFormData({...formData, limit: parseInt(e.target.value)})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">End Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    required
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
                                    <option value="disabled">Disabled</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="button" onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {coupon ? 'Update' : 'Create'} Coupon
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
                    <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
                    <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setShowModal(true);
                    }}
                    className="btn btn-primary btn-sm gap-2"
                >
                    <Plus size={16} />
                    Create Coupon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Coupons</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active Coupons</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {coupons.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Usage</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {coupons.reduce((sum, c) => sum + c.usage, 0)}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Expired</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {coupons.filter(c => c.status === 'expired').length}
                    </p>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {coupon.type === 'percentage' ? (
                                        <Percent className="w-5 h-5 text-white" />
                                    ) : coupon.type === 'fixed' ? (
                                        <DollarSign className="w-5 h-5 text-white" />
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    )}
                                    <span className={`badge ${getStatusColor(coupon.status)} badge-sm`}>
                                        {coupon.status}
                                    </span>
                                </div>
                                <div className="dropdown dropdown-end">
                                    <button className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-box w-40 border border-gray-200">
                                        <li>
                                            <a onClick={() => {
                                                setEditingCoupon(coupon);
                                                setShowModal(true);
                                            }}>
                                                <Edit2 size={14} /> Edit
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={() => handleDelete(coupon.id)} className="text-red-600">
                                                <Trash2 size={14} /> Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-2xl font-bold">{coupon.code}</p>
                                    <p className="text-white/80 text-sm mt-1">
                                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` :
                                         coupon.type === 'fixed' ? `$${coupon.value} OFF` :
                                         'FREE SHIPPING'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopy(coupon.code)}
                                    className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none"
                                >
                                    {copiedCode === coupon.code ? (
                                        <Check size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Min Order:</span>
                                <span className="font-medium text-gray-900">${coupon.minOrder}</span>
                            </div>
                            {coupon.maxDiscount && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Max Discount:</span>
                                    <span className="font-medium text-gray-900">${coupon.maxDiscount}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Usage:</span>
                                <span className="font-medium text-gray-900">{coupon.usage} / {coupon.limit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(coupon.usage / coupon.limit) * 100}%` }}
                                ></div>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                    Valid: {coupon.startDate} to {coupon.endDate}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coupon Modal */}
            {showModal && (
                <CouponModal
                    coupon={editingCoupon}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCoupon(null);
                    }}
                />
            )}
        </div>
    );
};

export default Coupons;