// components/UserDashboard/ActivityTimeline.jsx
import { Clock, Package } from 'lucide-react';
import { formatDate } from '../../services/profileService';

const STATUS_TEXT = {
  pending: { text: 'placed', box: 'bg-amber-100', icon: 'text-amber-600' },
  processing: { text: 'is being prepared', box: 'bg-blue-100', icon: 'text-blue-600' },
  shipped: { text: 'has been shipped', box: 'bg-purple-100', icon: 'text-purple-600' },
  delivered: { text: 'was delivered', box: 'bg-green-100', icon: 'text-green-600' },
  cancelled: { text: 'was cancelled', box: 'bg-red-100', icon: 'text-red-600' },
  refunded: { text: 'was refunded', box: 'bg-gray-100', icon: 'text-gray-600' },
};
const FALLBACK = { text: 'updated', box: 'bg-gray-100', icon: 'text-gray-600' };

const ActivityTimeline = ({ userData }) => {
  const orders = (userData?.recentOrders || [])
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="text-blue-500" size={22} />
        Recent Activity
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const s = STATUS_TEXT[o.status] || FALLBACK;
            return (
              <div key={o.orderId} className="flex items-start gap-4">
                <div className={`w-10 h-10 ${s.box} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Package className={`w-5 h-5 ${s.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Order {o.orderId} {s.text}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(o.updatedAt || o.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;