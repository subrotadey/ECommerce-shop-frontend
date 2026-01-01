// ============================================
// 5. components/UserDashboard/RecentOrdersWidget.jsx
// ============================================
import { Package, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, getOrderStatusConfig } from '../../services/profileService';

const RecentOrdersWidget = ({ orders = [] }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="text-blue-500" size={22} />
          Recent Orders
        </h2>
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="text-blue-500" size={22} />
          Recent Orders
        </h2>
        <Link
          to="/orders"
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => {
          const statusConfig = getOrderStatusConfig(order.status);
          return (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{order.orderId}</p>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              
              <div className="text-right mr-4">
                <p className="font-bold text-blue-600">৳{order.total}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="p-2 hover:bg-blue-100 rounded-lg transition-all"
              >
                <Eye size={18} className="text-blue-600" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrdersWidget;