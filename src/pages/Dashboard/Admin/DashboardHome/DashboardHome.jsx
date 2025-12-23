// ============================================
// pages/admin/Dashboard.jsx
// ============================================
import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalRevenue: 125430.50,
        totalOrders: 1245,
        totalCustomers: 8562,
        totalProducts: 324,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        customersGrowth: 15.3,
        productsGrowth: 5.1,
    });

    const [recentOrders, setRecentOrders] = useState([
        { id: '#ORD-1001', customer: 'Sarah Johnson', amount: 234.50, status: 'completed', date: '2 min ago' },
        { id: '#ORD-1002', customer: 'Michael Chen', amount: 456.00, status: 'processing', date: '15 min ago' },
        { id: '#ORD-1003', customer: 'Emma Wilson', amount: 189.99, status: 'pending', date: '1 hour ago' },
        { id: '#ORD-1004', customer: 'James Brown', amount: 567.25, status: 'completed', date: '2 hours ago' },
        { id: '#ORD-1005', customer: 'Lisa Anderson', amount: 345.80, status: 'shipped', date: '3 hours ago' },
    ]);

    const [topProducts, setTopProducts] = useState([
        { id: 1, name: 'Premium Abaya - Black', sales: 156, revenue: 23400, image: '🧥' },
        { id: 2, name: 'Embroidered Hijab Set', sales: 143, revenue: 21450, image: '🧕' },
        { id: 3, name: 'Modest Dress - Navy', sales: 128, revenue: 19200, image: '👗' },
        { id: 4, name: 'Prayer Mat Deluxe', sales: 95, revenue: 14250, image: '🕌' },
    ]);

    const [revenueData] = useState([
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 68000 },
        { month: 'Jul', revenue: 72000 },
        { month: 'Aug', revenue: 65000 },
        { month: 'Sep', revenue: 78000 },
        { month: 'Oct', revenue: 82000 },
        { month: 'Nov', revenue: 88000 },
        { month: 'Dec', revenue: 95000 },
    ]);

    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-700',
            processing: 'bg-blue-100 text-blue-700',
            pending: 'bg-yellow-100 text-yellow-700',
            shipped: 'bg-purple-100 text-purple-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline btn-sm">
                        <TrendingUp size={16} />
                        View Report
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <Package size={16} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                ${stats.totalRevenue.toLocaleString()}
                            </p>
                            <div className="flex items-center mt-2">
                                {stats.revenueGrowth > 0 ? (
                                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ml-1 ${
                                    stats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {Math.abs(stats.revenueGrowth)}%
                                </span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.totalOrders.toLocaleString()}
                            </p>
                            <div className="flex items-center mt-2">
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">
                                    {stats.ordersGrowth}%
                                </span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Customers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.totalCustomers.toLocaleString()}
                            </p>
                            <div className="flex items-center mt-2">
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">
                                    {stats.customersGrowth}%
                                </span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Total Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats.totalProducts}
                            </p>
                            <div className="flex items-center mt-2">
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">
                                    {stats.productsGrowth}%
                                </span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                        <div className="flex gap-2">
                            <button className="btn btn-xs btn-ghost">Week</button>
                            <button className="btn btn-xs btn-ghost">Month</button>
                            <button className="btn btn-xs btn-primary">Year</button>
                        </div>
                    </div>
                    <div className="h-72">
                        <div className="h-full flex items-end justify-between gap-2">
                            {revenueData.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer"
                                            style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: '40px' }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                                ${(data.revenue / 1000).toFixed(0)}k
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
                        <Link to="/admin/products" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                            <div key={product.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                        {product.image}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${product.revenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                    <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All Orders
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover">
                                    <td className="font-medium text-gray-900">{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td className="font-semibold">${order.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(order.status)} badge-sm`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="text-gray-500 text-sm">{order.date}</td>
                                    <td>
                                        <button className="btn btn-ghost btn-xs">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;