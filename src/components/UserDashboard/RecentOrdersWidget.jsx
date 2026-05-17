// components/UserDashboard/RecentOrdersWidget.jsx
import { ChevronRight, Eye, Package } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getOrderStatusConfig } from '../../services/profileService';
import OrderDetailModal from '../../pages/Dashboard/UserDashboard/OrderDetailModal';

const RecentOrdersWidget = ({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            to="/abaya"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
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
            const firstImage = order.items?.[0]?.image;
            const itemCount = order.items?.length || 0;

            return (
              <div
                key={order._id || order.orderId}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
              >
                {/* Thumbnail */}
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt="order item"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-blue-500" />
                  </div>
                )}

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate font-mono">
                    {order.orderId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Price + Status */}
                <div className="text-right mr-2">
                  <p className="font-bold text-blue-600 text-sm">
                    ${order.pricing?.total?.toFixed(2) || order.total}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Eye Button */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-all flex-shrink-0"
                  title="View order details"
                >
                  <Eye size={18} className="text-blue-600" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default RecentOrdersWidget;