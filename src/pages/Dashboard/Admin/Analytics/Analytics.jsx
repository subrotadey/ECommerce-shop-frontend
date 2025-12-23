// ============================================
// pages/admin/Analytics.jsx
// ============================================
import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Calendar, Download } from 'lucide-react';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('month');

    const salesData = [
        { day: 'Mon', sales: 12500, orders: 45, customers: 38 },
        { day: 'Tue', sales: 15200, orders: 52, customers: 45 },
        { day: 'Wed', sales: 18900, orders: 68, customers: 56 },
        { day: 'Thu', sales: 14300, orders: 49, customers: 42 },
        { day: 'Fri', sales: 22100, orders: 78, customers: 67 },
        { day: 'Sat', sales: 28500, orders: 95, customers: 82 },
        { day: 'Sun', sales: 19800, orders: 71, customers: 61 },
    ];

    const topProducts = [
        { name: 'Premium Abaya', sales: 245, revenue: 36750, growth: 12.5 },
        { name: 'Hijab Set', sales: 189, revenue: 6615, growth: 8.3 },
        { name: 'Prayer Mat', sales: 156, revenue: 7176, growth: -2.1 },
        { name: 'Modest Dress', sales: 134, revenue: 12060, growth: 15.7 },
        { name: 'Silk Scarf', sales: 98, revenue: 2450, growth: 5.2 },
    ];

    const categoryPerformance = [
        { category: 'Abayas', sales: 45, color: 'bg-blue-500' },
        { category: 'Hijabs', sales: 30, color: 'bg-purple-500' },
        { category: 'Dresses', sales: 15, color: 'bg-pink-500' },
        { category: 'Accessories', sales: 10, color: 'bg-green-500' },
    ];

    const recentActivity = [
        { action: 'New order placed', user: 'Sarah Johnson', time: '2 min ago', type: 'order' },
        { action: 'Product review posted', user: 'Michael Chen', time: '15 min ago', type: 'review' },
        { action: 'New customer registered', user: 'Emma Wilson', time: '1 hour ago', type: 'customer' },
        { action: 'Order shipped', user: 'James Brown', time: '2 hours ago', type: 'shipping' },
        { action: 'Payment received', user: 'Lisa Anderson', time: '3 hours ago', type: 'payment' },
    ];

    const maxSales = Math.max(...salesData.map(d => d.sales));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-1">Track your business performance</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="select select-bordered select-sm"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last 12 Months</option>
                    </select>
                    <button className="btn btn-outline btn-sm gap-2">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">$131.3k</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">+12.5%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">458</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">+8.2%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">New Customers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">391</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600 ml-1">+15.3%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Avg Order Value</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">$286</p>
                            <div className="flex items-center mt-2">
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600 ml-1">-3.1%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
                        <div className="flex gap-2">
                            <button className="btn btn-xs btn-ghost">Sales</button>
                            <button className="btn btn-xs btn-ghost">Orders</button>
                            <button className="btn btn-xs btn-primary">Revenue</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <div className="h-full flex items-end justify-between gap-3">
                            {salesData.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer"
                                            style={{ height: `${(data.sales / maxSales) * 100}%`, minHeight: '40px' }}
                                        >
                                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-2 px-3 rounded whitespace-nowrap">
                                                <div className="font-semibold">${(data.sales / 1000).toFixed(1)}k</div>
                                                <div className="text-gray-300">{data.orders} orders</div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 mt-2 font-medium">{data.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Category Performance</h3>
                    <div className="space-y-4">
                        {categoryPerformance.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                                    <span className="text-sm font-semibold text-gray-900">{cat.sales}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${cat.sales}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Categories</span>
                            <span className="font-semibold text-gray-900">8</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                                    <div className="flex items-center justify-end">
                                        {product.growth > 0 ? (
                                            <TrendingUp className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-red-600" />
                                        )}
                                        <span className={`text-xs ml-1 ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {Math.abs(product.growth)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                    activity.type === 'order' ? 'bg-blue-500' :
                                    activity.type === 'review' ? 'bg-purple-500' :
                                    activity.type === 'customer' ? 'bg-green-500' :
                                    activity.type === 'shipping' ? 'bg-orange-500' :
                                    'bg-pink-500'
                                }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-600">{activity.user}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Performance Insights</h3>
                        <p className="text-blue-100 mb-4">Your sales increased by 23% this month compared to last month</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                Premium Abayas are your best selling category
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                Weekend sales are 40% higher than weekdays
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                Average order value increased by $24 this week
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-sm bg-white text-blue-600 hover:bg-blue-50 border-none">
                        View Full Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;