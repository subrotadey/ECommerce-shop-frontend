// ============================================
// pages/admin/Orders/Orders.jsx
// ============================================
import { useState } from 'react';
import { Search, Filter, Download, Eye, Truck, CheckCircle, XCircle, Clock, Package, X, MapPin } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([
        {
            id: '#ORD-1001',
            customer: 'Sarah Johnson',
            email: 'sarah@email.com',
            items: 3,
            total: 234.50,
            status: 'delivered',
            payment: 'paid',
            date: '2024-01-15',
            address: '123 Main St, New York, NY 10001'
        },
        {
            id: '#ORD-1002',
            customer: 'Michael Chen',
            email: 'michael@email.com',
            items: 2,
            total: 456.00,
            status: 'shipped',
            payment: 'paid',
            date: '2024-01-14',
            address: '456 Oak Ave, Los Angeles, CA 90001'
        },
        {
            id: '#ORD-1003',
            customer: 'Emma Wilson',
            email: 'emma@email.com',
            items: 1,
            total: 189.99,
            status: 'processing',
            payment: 'paid',
            date: '2024-01-14',
            address: '789 Pine Rd, Chicago, IL 60601'
        },
        {
            id: '#ORD-1004',
            customer: 'James Brown',
            email: 'james@email.com',
            items: 4,
            total: 567.25,
            status: 'pending',
            payment: 'pending',
            date: '2024-01-13',
            address: '321 Elm St, Houston, TX 77001'
        },
        {
            id: '#ORD-1005',
            customer: 'Lisa Anderson',
            email: 'lisa@email.com',
            items: 2,
            total: 345.80,
            status: 'cancelled',
            payment: 'refunded',
            date: '2024-01-12',
            address: '654 Maple Dr, Phoenix, AZ 85001'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['all', 'paid', 'pending', 'refunded'];

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || order.payment === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-4 h-4" />,
            processing: <Package className="w-4 h-4" />,
            shipped: <Truck className="w-4 h-4" />,
            delivered: <CheckCircle className="w-4 h-4" />,
            cancelled: <XCircle className="w-4 h-4" />,
        };
        return icons[status];
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'badge-warning',
            processing: 'badge-info',
            shipped: 'badge-primary',
            delivered: 'badge-success',
            cancelled: 'badge-error',
        };
        return colors[status] || 'badge-ghost';
    };

    const getPaymentColor = (payment) => {
        const colors = {
            paid: 'badge-success',
            pending: 'badge-warning',
            refunded: 'badge-error',
        };
        return colors[payment] || 'badge-ghost';
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setSelectedOrder(null);
    };

    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-3xl bg-gray-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl">Order Details - {order.id}</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Order Status */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-900">Order Status</h4>
                                <span className={`badge ${getStatusColor(order.status)} gap-2`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {statuses.filter(s => s !== 'all').map(status => (
                                    <button
                                        key={status}
                                        onClick={() => updateOrderStatus(order.id, status)}
                                        className={`btn btn-xs ${order.status === status ? 'btn-primary' : 'btn-ghost'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{order.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{order.email}</span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-600">Address:</span>
                                    <span className="font-medium text-right flex items-center gap-2">
                                        <MapPin size={14} />
                                        {order.address}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                            🧥
                                        </div>
                                        <div>
                                            <p className="font-medium">Premium Abaya - Black</p>
                                            <p className="text-sm text-gray-600">Size: M, Qty: 1</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold">$149.99</span>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                            🧕
                                        </div>
                                        <div>
                                            <p className="font-medium">Embroidered Hijab Set</p>
                                            <p className="text-sm text-gray-600">Color: Beige, Qty: 2</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold">$69.98</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>${(order.total * 0.85).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span>${(order.total * 0.10).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax:</span>
                                    <span>${(order.total * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`badge ${getPaymentColor(order.payment)}`}>
                                {order.payment}
                            </span>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button onClick={onClose} className="btn">Close</button>
                        <button className="btn btn-primary">Print Invoice</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">Manage and track customer orders</p>
                </div>
                <button className="btn btn-outline btn-sm gap-2">
                    <Download size={16} />
                    Export Orders
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {orders.filter(o => o.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Processing</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        {orders.filter(o => o.status === 'processing').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Shipped</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                        {orders.filter(o => o.status === 'shipped').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {orders.filter(o => o.status === 'delivered').length}
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
                                placeholder="Search by order ID, customer name or email..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="select select-bordered"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status}
                            </option>
                        ))}
                    </select>
                    <select
                        className="select select-bordered"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        {paymentStatuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Payments' : status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className='text-black'>
                                <th>
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                </th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover">
                                    <td>
                                        <input type="checkbox" className="checkbox checkbox-sm" />
                                    </td>
                                    <td className="font-medium text-gray-900">{order.id}</td>
                                    <td>
                                        <div>
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-sm text-gray-500">{order.email}</div>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">{order.items} items</td>
                                    <td className="font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(order.status)} badge-sm gap-2`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getPaymentColor(order.payment)} badge-sm`}>
                                            {order.payment}
                                        </span>
                                    </td>
                                    <td className="text-gray-600 text-sm">{order.date}</td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="btn btn-ghost btn-xs gap-1"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                    <div className="join">
                        <button className="join-item btn btn-sm">«</button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">2</button>
                        <button className="join-item btn btn-sm">»</button>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default Orders;