// ============================================
// 4. components/UserDashboard/QuickActions.jsx
// ============================================
import { ShoppingBag, Heart, MapPin, CreditCard, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const TONE = {
  blue: { box: 'bg-blue-100', icon: 'text-blue-600' },
  pink: { box: 'bg-pink-100', icon: 'text-pink-600' },
  green: { box: 'bg-green-100', icon: 'text-green-600' },
  purple: { box: 'bg-purple-100', icon: 'text-purple-600' },
};

const QuickActions = () => {
  const actions = [
    { icon: ShoppingBag, label: 'Browse Products', path: '/abaya', color: 'blue' },
    { icon: Heart, label: 'My Wishlist', path: '/wishlist', color: 'pink' },
    { icon: MapPin, label: 'Addresses', path: '/profile', color: 'green' },
    { icon: Package, label: 'My Orders', path: '/orders', color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
            >
              <div className={`w-12 h-12 ${TONE[action.color].box} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${TONE[action.color].icon}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;