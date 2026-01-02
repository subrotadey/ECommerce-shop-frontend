// pages/admin/Customers/Customers.jsx - INDUSTRY LEVEL
import { useState, useMemo } from 'react';
import {
    Search, Mail, Phone, MapPin, ShoppingBag, DollarSign,
    Calendar, Ban, CheckCircle, Eye, X, MessageSquare, Download,
    Loader2, Users, Shield, UserCog, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import notify from '../../../../utils/notification';
import useCustomerManagement, { useCustomer } from '../../../../hooks/useCustomers';
import useDebounce from '../../../../hooks/useDebounce';

const Customers = () => {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    // NEW: Advanced Sorting
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // 🔥 Debounced search - API call হবে user typing থামার 800ms পর
    const debouncedSearchTerm = useDebounce(searchTerm, 800);

    // Custom hook with debounced search
    const {
        customers,
        pagination,
        stats,
        isLoading,
        isLoadingStats,
        updateStatus,
        deleteCustomer,
        sendMessage,
        exportCustomers,
        batchUpdateStatus,
        isUpdating,
        isDeleting,
        isSending,
        isExporting,
        isBatchUpdating,
        refetch
    } = useCustomerManagement({
        page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: debouncedSearchTerm || undefined, // 🔥 Debounced value use করছি
        role: roleFilter !== 'all' ? roleFilter : undefined,
        sortBy, // 🔥 Dynamic sorting
        sortOrder
    });

    // Show typing indicator
    const isTyping = searchTerm !== debouncedSearchTerm;

    // Fetch selected customer details
    const { data: customerDetails, isLoading: isLoadingDetails } = useCustomer(selectedCustomerId);

    const statuses = ['all', 'active', 'inactive'];

    // 🔥 INDUSTRY-LEVEL SORTING OPTIONS
    const sortOptions = [
        {
            value: 'createdAt',
            label: 'Newest First',
            icon: Calendar,
            description: 'Recently joined customers'
        },
        {
            value: 'totalSpent',
            label: 'Top Customers',
            icon: DollarSign,
            description: 'Highest spending first'
        },
        {
            value: 'displayName',
            label: 'Alphabetically (A-Z)',
            icon: ArrowUpDown,
            description: 'Sort by name'
        },
        {
            value: 'orderCount',
            label: 'Most Orders',
            icon: ShoppingBag,
            description: 'Highest order count'
        },
        {
            value: 'lastLogin',
            label: 'Recently Active',
            icon: Users,
            description: 'Last login time'
        }
    ];

    // Role tabs configuration
    const roleTabs = [
        {
            id: 'all',
            label: 'All Users',
            icon: Users,
            count: stats.totalCustomers || 0,
            color: 'text-gray-600'
        },
        {
            id: 'user',
            label: 'Customers',
            icon: Users,
            count: stats.regularUsers || 0,
            color: 'text-blue-600'
        },
        {
            id: 'admin',
            label: 'Admins',
            icon: Shield,
            count: stats.adminCount || 0,
            color: 'text-purple-600'
        },
        {
            id: 'staff',
            label: 'Staff',
            icon: UserCog,
            count: stats.staffCount || 0,
            color: 'text-green-600'
        }
    ];

    const getStatusColor = (status) => {
        return status ? 'badge-success' : 'badge-warning';
    };

    const getStatusLabel = (status) => {
        return status ? 'Active' : 'Inactive';
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: 'badge-error',
            staff: 'badge-warning',
            user: 'badge-info'
        };
        return badges[role] || 'badge-ghost';
    };

    // Toggle customer selection
    const toggleCustomerSelection = (customerId) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    // Select all customers
    const toggleSelectAll = () => {
        if (selectedCustomers.length === customers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(customers.map(c => c._id || c.uid));
        }
    };

    // Handle tab change
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setRoleFilter(tabId);
        setPage(1);
        setSelectedCustomers([]);
    };

    // 🔥 Handle sort change
    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            // Toggle order if same field
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // New field - set appropriate default order
            setSortBy(newSortBy);
            // For name, default to ascending; for others, descending
            setSortOrder(newSortBy === 'displayName' ? 'asc' : 'desc');
        }
        setPage(1);
    };

    // Handle status update
    const handleStatusUpdate = async (customerId, isActive) => {
        const confirmed = await notify.confirm(
            `${isActive ? 'Activate' : 'Deactivate'} Customer?`,
            `Are you sure you want to ${isActive ? 'activate' : 'deactivate'} this customer?`,
            'Yes, proceed',
            'Cancel'
        );

        if (confirmed) {
            updateStatus(customerId, isActive);
        }
    };

    // Handle customer deletion
    const handleDelete = async (customerId) => {
        const confirmed = await notify.confirm(
            'Delete Customer?',
            'This action cannot be undone. Customer with orders cannot be deleted.',
            'Yes, delete',
            'Cancel'
        );

        if (confirmed) {
            deleteCustomer(customerId);
        }
    };

    // Handle batch actions
    const handleBatchAction = async (action) => {
        if (selectedCustomers.length === 0) {
            notify.warning('No Selection', 'Please select customers first');
            return;
        }

        const confirmed = await notify.confirm(
            `Batch ${action}?`,
            `${action} ${selectedCustomers.length} selected customer(s)?`,
            'Yes, proceed',
            'Cancel'
        );

        if (confirmed) {
            if (action === 'activate') {
                await batchUpdateStatus(selectedCustomers, true);
            } else if (action === 'deactivate') {
                await batchUpdateStatus(selectedCustomers, false);
            }
            setSelectedCustomers([]);
        }
    };

    // Export customers
    const handleExport = async () => {
        notify.loading('Exporting...');
        await exportCustomers();
        notify.close();
    };

    // Get current sort option details
    const currentSortOption = sortOptions.find(opt => opt.value === sortBy);

    // Customer Details Modal Component
    const CustomerDetailsModal = () => {
        if (!customerDetails?.customer) return null;

        const customer = customerDetails.customer;

        return (
            <div className="modal modal-open">
                <div className="modal-box max-w-4xl bg-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl">Customer Details</h3>
                        <button
                            onClick={() => setSelectedCustomerId(null)}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {isLoadingDetails ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Customer Info */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4 flex-shrink-0">
                                        {customer?.photoURL ? (
                                            <img
                                                src={customer.photoURL}
                                                alt={customer.displayName || 'User'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-purple-500');
                                                    e.target.parentElement.innerHTML = `
                                                      <span class="text-white text-3xl font-bold">
                                                        ${customer.displayName?.charAt(0).toUpperCase() || 'U'}
                                                      </span>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                                {customer.displayName?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">{customer.displayName || 'Unknown'}</h4>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`badge ${getStatusColor(customer.isActive)}`}>
                                            {getStatusLabel(customer.isActive)}
                                        </span>
                                        <span className={`badge ${getRoleBadge(customer.role)}`}>
                                            {customer.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-gray-700 break-all">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-gray-700">{customer.phoneNumber || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {customer.address?.city || 'Location not set'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowMessageModal(true);
                                            setSelectedCustomerId(null);
                                        }}
                                        className="btn btn-primary btn-sm flex-1 gap-2"
                                    >
                                        <MessageSquare size={16} />
                                        Message
                                    </button>
                                    {customer.isActive ? (
                                        <button
                                            onClick={() => handleStatusUpdate(customer._id || customer.uid, false)}
                                            className="btn btn-warning btn-sm flex-1 gap-2"
                                            disabled={isUpdating}
                                        >
                                            <Ban size={16} />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusUpdate(customer._id || customer.uid, true)}
                                            className="btn btn-success btn-sm flex-1 gap-2"
                                            disabled={isUpdating}
                                        >
                                            <CheckCircle size={16} />
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats and Orders */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {customer.stats?.totalOrders || 0}
                                                </p>
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
                                                    ৳{customer.stats?.totalSpent?.toFixed(2) || '0.00'}
                                                </p>
                                                <p className="text-sm text-gray-600">Total Spent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
                                    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                        {customer.recentOrders && customer.recentOrders.length > 0 ? (
                                            customer.recentOrders.map(order => (
                                                <div key={order.orderId} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{order.orderId}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            ৳{order.pricing?.total?.toFixed(2)}
                                                        </p>
                                                        <span className={`text-xs badge badge-sm ${order.status === 'delivered' ? 'badge-success' : 'badge-info'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="p-4 text-center text-gray-500">No orders yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="modal-action">
                        <button onClick={() => setSelectedCustomerId(null)} className="btn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Loading state
    if (isLoading && !customers.length) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your customer base</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="btn btn-outline btn-sm gap-2"
                >
                    {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download size={16} />
                    )}
                    Export
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.totalCustomers || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {stats.activeCustomers || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {stats.inactiveCustomers || 0}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                        {stats.newUsersThisMonth || 0}
                    </p>
                </div>
            </div>

            {/* Role-based Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        {roleTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} className={activeTab === tab.id ? tab.color : ''} />
                                    <span>{tab.label}</span>
                                    <span className={`badge badge-sm ${activeTab === tab.id ? 'badge-primary' : 'badge-ghost'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 🔥 ADVANCED FILTERS & SORTING */}
                <div className="p-4 space-y-4">
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email or phone..."
                                    className="input input-bordered w-full pl-10 bg-white border-gray-300"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                {/* 🔥 Typing Indicator */}
                                {isTyping && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    </div>
                                )}
                            </div>
                            {/* 🔥 Search hint */}
                            {isTyping && (
                                <p className="text-xs text-gray-500 mt-1 ml-1">
                                    Searching...
                                </p>
                            )}
                        </div>

                        {/* Status Filter */}
                        <select
                            className="select select-bordered bg-white border-gray-300"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Batch Actions */}
                        {selectedCustomers.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBatchAction('activate')}
                                    disabled={isBatchUpdating}
                                    className="btn btn-success btn-sm"
                                >
                                    Activate ({selectedCustomers.length})
                                </button>
                                <button
                                    onClick={() => handleBatchAction('deactivate')}
                                    disabled={isBatchUpdating}
                                    className="btn btn-warning btn-sm"
                                >
                                    Deactivate ({selectedCustomers.length})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 🔥 SORTING OPTIONS */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        {sortOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = sortBy === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`btn btn-sm gap-2 ${isActive ? 'btn-primary' : 'btn-ghost'
                                        }`}
                                    title={option.description}
                                >
                                    <Icon size={14} />
                                    <span>{option.label}</span>
                                    {isActive && (
                                        sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No customers found</p>
                        </div>
                    ) : (
                        <table className="table w-full">
                            <thead>
                                <tr className='text-black'>
                                    <th>
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={selectedCustomers.length === customers.length && customers.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th>Customer</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer._id || customer.uid} className="hover">
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={selectedCustomers.includes(customer._id || customer.uid)}
                                                onChange={() => toggleCustomerSelection(customer._id || customer.uid)}
                                            />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                                    {customer?.photoURL ? (
                                                        <img
                                                            src={customer.photoURL}
                                                            alt={customer.displayName || 'User'}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-purple-500');
                                                                e.target.parentElement.innerHTML = `
                                                                  <span class="text-white font-bold">
                                                                    ${customer.displayName?.charAt(0).toUpperCase() || 'U'}
                                                                  </span>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                            {customer.displayName?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {customer.displayName || 'Unknown'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div className="text-gray-900">{customer.email}</div>
                                                <div className="text-gray-500">{customer.phoneNumber || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getRoleBadge(customer.role)} badge-sm`}>
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td className="text-gray-900 font-medium">
                                            {customer.stats?.orderCount || 0}
                                        </td>
                                        <td className="font-semibold text-gray-900">
                                            ৳{customer.stats?.totalSpent?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="text-gray-600 text-sm">
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusColor(customer.isActive)} badge-sm`}>
                                                {getStatusLabel(customer.isActive)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedCustomerId(customer._id || customer.uid)}
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
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {customers.length} of {pagination.total || 0} customers
                    </div>
                    <div className="join">
                        <button
                            className="join-item btn btn-sm"
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            «
                        </button>
                        <button className="join-item btn btn-sm btn-active">
                            {page}
                        </button>
                        <button
                            className="join-item btn btn-sm"
                            disabled={page >= (pagination.totalPages || 1) || isLoading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedCustomerId && <CustomerDetailsModal />}
        </div>
    );
};

export default Customers;