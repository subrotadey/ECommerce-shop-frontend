// pages/admin/Orders/Orders.jsx - FIXED VERSION
import { CheckCircle, Clock, Download, Eye, Filter, MapPin, Package, RefreshCw, Search, Truck, X, XCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import Loading from '../../../../components/Shared/Loading/Loading';
import useOrderManagement from '../../../../hooks/useOrders';
import notify from '../../../../utils/notification';

const Orders = () => {
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // API integration
    const {
        orders,
        pagination,
        stats,
        isLoading,
        isUpdating,
        isRefunding,
        isExporting,
        isBatchUpdating,
        error,
        updateStatus,
        refundOrder,
        exportOrders,
        batchUpdateStatus,
        refetch
    } = useOrderManagement({
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        payment: paymentFilter !== 'all' ? paymentFilter : undefined,
        search: searchTerm
    });

    const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['all', 'paid', 'pending', 'refunded'];

    // Handlers
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handlePaymentFilter = (payment) => {
        setPaymentFilter(payment);
        setPage(1);
    };

    const handleSelectOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.orderId));
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        const confirmed = await notify.confirm(
            'Update Order Status?',
            `Change status to "${newStatus}"?`,
            'Yes, Update',
            'Cancel'
        );

        if (confirmed) {
            updateStatus(orderId, newStatus);
            setSelectedOrder(null);
        }
    };

    const handleRefund = async (orderId) => {
        const { value: reason } = await notify.prompt(
            'Refund Order',
            'Please enter refund reason:',
            'text',
            'Customer request'
        );

        if (reason) {
            refundOrder(orderId, reason);
            setSelectedOrder(null);
        }
    };

    const handleBatchUpdate = async () => {
        if (selectedOrders.length === 0) {
            notify.warning('No Orders Selected', 'Please select orders first');
            return;
        }

        const { value: status } = await notify.select(
            'Batch Update Status',
            'Select new status for selected orders:',
            statuses.filter(s => s !== 'all')
        );

        if (status) {
            batchUpdateStatus(selectedOrders, status);
            setSelectedOrders([]);
        }
    };

    const handleExport = () => {
        exportOrders({
            status: statusFilter !== 'all' ? statusFilter : undefined,
            payment: paymentFilter !== 'all' ? paymentFilter : undefined,
            search: searchTerm
        });
    };

    // 🔥 FIXED: Print Invoice Handler
    const handlePrintInvoice = (order) => {
        if (!order) {
            notify.error('Error', 'Order data not found');
            return;
        }

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (!printWindow) {
            notify.error('Error', 'Please allow popups to print invoice');
            return;
        }

        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${order.orderId}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css" rel="stylesheet" type="text/css" />
  <style>
    @media print {
      body { 
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  </style>
</head>
<body class="bg-base-100">
  <div class="max-w-4xl mx-auto p-8">
    <!-- Print Button -->
    <div class="no-print mb-4 flex justify-end gap-2">
      <button onclick="window.print()" class="btn btn-primary btn-sm">
        🖨️ Print Invoice
      </button>
      <button onclick="window.close()" class="btn btn-ghost btn-sm">
        ✕ Close
      </button>
    </div>

    <!-- Invoice Container -->
    <div class="card bg-base-100 shadow-2xl border-2 border-base-300">
      <div class="card-body p-12">
        
        <!-- Header -->
        <div class="text-center mb-8 pb-6 border-b-4 border-primary">
          <h1 class="text-5xl font-bold text-primary mb-2">INVOICE</h1>
          <div class="badge badge-lg badge-outline">Order ID: ${order.orderId}</div>
          <p class="text-sm mt-2 text-base-content/70">
            Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <!-- Customer & Payment Info -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <!-- Bill To -->
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-primary mb-3">Bill To:</h3>
            <div class="bg-base-200 rounded-lg p-4">
              <p class="font-bold text-lg">${order.customer?.name || 'N/A'}</p>
              <p class="text-sm text-base-content/70">${order.customer?.email || 'N/A'}</p>
              <p class="text-sm text-base-content/70">${order.customer?.phone || 'N/A'}</p>
              ${order.customer?.address ? `
                <div class="flex items-start gap-2 mt-2">
                  <svg class="w-4 h-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm">${
                    typeof order.customer.address === 'string' 
                      ? order.customer.address 
                      : JSON.stringify(order.customer.address)
                  }</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Payment Status -->
          <div class="space-y-2 text-right">
            <h3 class="text-lg font-bold text-primary mb-3">Payment Details:</h3>
            <div class="bg-base-200 rounded-lg p-4 space-y-3">
              <div>
                <p class="text-sm text-base-content/70 mb-1">Payment Status:</p>
                <span class="badge ${
                  order.payment?.status === 'paid' ? 'badge-success' :
                  order.payment?.status === 'refunded' ? 'badge-error' :
                  'badge-warning'
                } badge-lg font-bold">
                  ${order.payment?.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div>
                <p class="text-sm text-base-content/70 mb-1">Order Status:</p>
                <span class="badge ${
                  order.status === 'delivered' ? 'badge-success' :
                  order.status === 'cancelled' ? 'badge-error' :
                  order.status === 'shipped' ? 'badge-primary' :
                  order.status === 'processing' ? 'badge-info' :
                  'badge-warning'
                } badge-lg font-bold">
                  ${order.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto mb-8">
          <table class="table table-zebra w-full">
            <thead>
              <tr class="bg-primary text-primary-content">
                <th class="text-left">Item</th>
                <th class="text-left">Details</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td class="font-semibold">${item.name}</td>
                  <td class="text-sm text-base-content/70">
                    ${item.size ? `<span class="badge badge-sm badge-outline mr-1">Size: ${item.size}</span>` : ''} 
                    ${item.color ? `<span class="badge badge-sm badge-outline">Color: ${item.color}</span>` : ''}
                  </td>
                  <td class="text-center font-medium">${item.qty}</td>
                  <td class="text-right">$${item.price.toFixed(2)}</td>
                  <td class="text-right font-semibold">$${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="flex justify-end">
          <div class="w-80">
            <div class="bg-base-200 rounded-lg p-6 space-y-3">
              <div class="flex justify-between text-base-content/70">
                <span>Subtotal:</span>
                <span class="font-semibold">$${order.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="flex justify-between text-base-content/70">
                <span>Shipping:</span>
                <span class="font-semibold">$${order.pricing?.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="flex justify-between text-base-content/70">
                <span>Tax (5%):</span>
                <span class="font-semibold">$${order.pricing?.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div class="divider my-2"></div>
              <div class="flex justify-between text-2xl font-bold text-primary">
                <span>Grand Total:</span>
                <span>$${order.pricing?.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-12 pt-6 border-t-2 border-base-300">
          <div class="alert alert-info shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">Thank you for your business!</h3>
              <div class="text-xs">If you have any questions, please contact us.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <script>
    // Auto-print after page loads (optional)
    // window.onload = function() {
    //   setTimeout(() => {
    //     window.print();
    //   }, 500);
    // };
    
    // Close window after print
    window.onafterprint = function() {
      // Uncomment to auto-close after printing
      // window.close();
    };
  </script>
</body>
</html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    // Utility functions
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

    // Loading state
    if (isLoading && !orders.length) {
        return <Loading />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button onClick={() => refetch()} className="btn btn-primary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage customer orders</p>
                </div>
                <div className="flex gap-2">
                    {selectedOrders.length > 0 && (
                        <button
                            onClick={handleBatchUpdate}
                            disabled={isBatchUpdating}
                            className="btn btn-outline btn-sm gap-2"
                        >
                            <Filter size={16} />
                            Batch Update ({selectedOrders.length})
                        </button>
                    )}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="btn btn-outline btn-sm gap-2"
                    >
                        <Download size={16} />
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                    <button onClick={() => refetch()} className="btn btn-ghost btn-sm gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {pagination.total || 0}
                    </p>
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
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <select
                        className="select select-bordered"
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                    >
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        className="select select-bordered"
                        value={paymentFilter}
                        onChange={(e) => handlePaymentFilter(e.target.value)}
                    >
                        {paymentStatuses.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Payments' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                            <tr className="text-black">
                                <th>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={selectedOrders.length === orders.length && orders.length > 0}
                                        onChange={handleSelectAll}
                                    />
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
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.orderId} className="hover">
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={selectedOrders.includes(order.orderId)}
                                                onChange={() => handleSelectOrder(order.orderId)}
                                            />
                                        </td>
                                        <td className="font-medium text-gray-900">{order.orderId}</td>
                                        <td>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {order.customer?.name || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.customer?.email || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-gray-600">{order.items?.length || 0} items</td>
                                        <td className="font-semibold text-gray-900">
                                            ${order.pricing?.total?.toFixed(2) || '0.00'}
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusColor(order.status)} badge-sm gap-2`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getPaymentColor(order.payment?.status)} badge-sm`}>
                                                {order.payment?.status || 'unknown'}
                                            </span>
                                        </td>
                                        <td className="text-gray-600 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="btn btn-ghost btn-xs gap-1"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handlePrintInvoice(order)}
                                                    className="btn btn-ghost btn-xs gap-1"
                                                    title="Print Invoice"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} orders
                        </div>
                        <div className="join">
                            <button
                                className="join-item btn btn-sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                «
                            </button>
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    className={`join-item btn btn-sm ${page === i + 1 ? 'btn-active' : ''}`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="join-item btn btn-sm"
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onRefund={handleRefund}
                    onPrintInvoice={handlePrintInvoice}
                    isUpdating={isUpdating}
                    isRefunding={isRefunding}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                    getPaymentColor={getPaymentColor}
                    statuses={statuses}
                />
            )}
        </div>
    );
};

// 🔥 FIXED: Order Details Modal Component
const OrderDetailsModal = ({
    order,
    onClose,
    onUpdateStatus,
    onRefund,
    onPrintInvoice,
    isUpdating,
    isRefunding,
    getStatusIcon,
    getStatusColor,
    getPaymentColor,
    statuses
}) => {
    if (!order) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-3xl bg-gray-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">Order Details - {order.orderId}</h3>
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
                        <div className="flex gap-2 flex-wrap">
                            {statuses.filter(s => s !== 'all').map(status => (
                                <button
                                    key={status}
                                    onClick={() => onUpdateStatus(order.orderId, status)}
                                    disabled={isUpdating || order.status === status}
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
                                <span className="font-medium">{order.customer?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium">{order.customer?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{order.customer?.phone || 'N/A'}</span>
                            </div>
                            {order.customer?.address && (
                                <div className="flex items-start justify-between">
                                    <span className="text-gray-600">Address:</span>
                                    <span className="font-medium text-right flex items-center gap-2">
                                        <MapPin size={14} />
                                        {typeof order.customer.address === 'string'
                                            ? order.customer.address
                                            : JSON.stringify(order.customer.address)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
                            {order.items?.map((item, index) => (
                                <div key={index} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={item.image || '/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.size && `Size: ${item.size}`}
                                                {item.size && item.color && ', '}
                                                {item.color && `Color: ${item.color}`}
                                                {` • Qty: ${item.qty}`}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${order.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping:</span>
                                <span>${order.pricing?.shipping?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax:</span>
                                <span>${order.pricing?.tax?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>${order.pricing?.total?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`badge ${getPaymentColor(order.payment?.status)}`}>
                            {order.payment?.status || 'unknown'}
                        </span>
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn">Close</button>
                    {order.payment?.status === 'paid' && (
                        <button
                            onClick={() => onRefund(order.orderId)}
                            disabled={isRefunding}
                            className="btn btn-error"
                        >
                            {isRefunding ? 'Processing...' : 'Refund Order'}
                        </button>
                    )}
                    <button 
                        onClick={() => onPrintInvoice(order)} 
                        className="btn btn-primary gap-2"
                    >
                        <Printer size={16} />
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Orders;