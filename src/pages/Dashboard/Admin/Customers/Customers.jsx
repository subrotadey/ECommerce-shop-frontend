// ============================================
// pages/admin/Customers/Customers.jsx
// ============================================
import { useState } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag, DollarSign, Calendar, Ban, CheckCircle, Eye, X, MessageSquare } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, USA',
            orders: 24,
            totalSpent: 3456.80,
            joinDate: '2023-03-15',
            status: 'active',
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Michael Chen',
            email: 'michael@email.com',
            phone: '+1 (555) 234-5678',
            location: 'Los Angeles, USA',
            orders: 18,
            totalSpent: 2890.50,
            joinDate: '2023-05-22',
            status: 'active',
            avatar: 'MC'
        },
        {
            id: 3,
            name: 'Emma Wilson',
            email: 'emma@email.com',
            phone: '+1 (555) 345-6789',
            location: 'Chicago, USA',
            orders: 32,
            totalSpent: 5234.90,
            joinDate: '2023-01-10',
            status: 'active',
            avatar: 'EW'
        },
        {
            id: 4,
            name: 'James Brown',
            email: 'james@email.com',
            phone: '+1 (555) 456-7890',
            location: 'Houston, USA',
            orders: 5,
            totalSpent: 789.25,
            joinDate: '2023-11-08',
            status: 'inactive',
            avatar: 'JB'
        },
        {
            id: 5,
            name: 'Lisa Anderson',
            email: 'lisa@email.com',
            phone: '+1 (555) 567-8901',
            location: 'Phoenix, USA',
            orders: 12,
            totalSpent: 1567.40,
            joinDate: '2023-07-19',
            status: 'blocked',
            avatar: 'LA'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const statuses = ['all', 'active', 'inactive', 'blocked'];

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            active: 'badge-success',
            inactive: 'badge-warning',
            blocked: 'badge-error',
        };
        return colors[status] || 'badge-ghost';
    };

    const toggleCustomerStatus = (customerId, newStatus) => {
        setCustomers(customers.map(customer =>
            customer.id === customerId ? { ...customer, status: newStatus } : customer
        ));
    };

    const CustomerDetailsModal = ({ customer, onClose }) => {
        if (!customer) return null;

        const recentOrders = [
            { id: '#ORD-1001', date: '2024-01-15', amount: 234.50, status: 'delivered' },
            { id: '#ORD-1002', date: '2024-01-10', amount: 189.99, status: 'shipped' },
            { id: '#ORD-1003', date: '2024-01-05', amount: 456.00, status: 'delivered' },
        ];

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl">Customer Details</h3>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                                    {customer.avatar}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{customer.name}</h4>
                                <span className={`badge ${getStatusColor(customer.status)} mt-2`}>
                                    {customer.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="text-gray-700">{customer.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-gray-700">Joined {customer.joinDate}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="btn btn-primary btn-sm flex-1 gap-2">
                                    <MessageSquare size={16} />
                                    Message
                                </button>
                                {customer.status === 'blocked' ? (
                                    <button
                                        onClick={() => toggleCustomerStatus(customer.id, 'active')}
                                        className="btn btn-success btn-sm flex-1 gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Unblock
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => toggleCustomerStatus(customer.id, 'blocked')}
                                        className="btn btn-error btn-sm flex-1 gap-2"
                                    >
                                        <Ban size={16} />
                                        Block
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Stats and Orders */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{customer.orders}</p>
                                            <p className="text-sm text-gray-600">Total Orders</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">
                                                ${customer.totalSpent.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-600">Total Spent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
                                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                                    {recentOrders.map(order => (
                                        <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.id}</p>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">${order.amount}</p>
                                                <span className="text-xs badge badge-success badge-sm">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Activity Timeline</h4>
                                <div className="space-y-3">
                                    {[
                                        { action: 'Placed an order', time: '2 hours ago', type: 'order' },
                                        { action: 'Left a review', time: '1 day ago', type: 'review' },
                                        { action: 'Updated profile', time: '3 days ago', type: 'profile' },
                                        { action: 'Made a purchase', time: '1 week ago', type: 'order' },
                                    ].map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button onClick={onClose} className="btn">Close</button>
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
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your customer base</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {customers.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {customers.filter(c => c.status === 'inactive').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Blocked</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {customers.filter(c => c.status === 'blocked').length}
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
                                placeholder="Search by name, email or phone..."
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
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                </th>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Location</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover">
                                    <td>
                                        <input type="checkbox" className="checkbox checkbox-sm" />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {customer.avatar}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{customer.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="text-gray-900">{customer.email}</div>
                                            <div className="text-gray-500">{customer.phone}</div>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">{customer.location}</td>
                                    <td className="text-gray-900 font-medium">{customer.orders}</td>
                                    <td className="font-semibold text-gray-900">
                                        ${customer.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="text-gray-600 text-sm">{customer.joinDate}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(customer.status)} badge-sm`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedCustomer(customer)}
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
                        Showing {filteredCustomers.length} of {customers.length} customers
                    </div>
                    <div className="join">
                        <button className="join-item btn btn-sm">«</button>
                        <button className="join-item btn btn-sm btn-active">1</button>
                        <button className="join-item btn btn-sm">2</button>
                        <button className="join-item btn btn-sm">»</button>
                    </div>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}
        </div>
    );
};

export default Customers;