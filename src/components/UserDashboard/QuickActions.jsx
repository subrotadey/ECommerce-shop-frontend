// ============================================
// 4. components/UserDashboard/QuickActions.jsx
// ============================================
import { ShoppingBag, Heart, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    { icon: ShoppingBag, label: 'Browse Products', path: '/shop', color: 'blue' },
    { icon: Heart, label: 'My Wishlist', path: '/wishlist', color: 'pink' },
    { icon: MapPin, label: 'Addresses', path: '/addresses', color: 'green' },
    { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods', color: 'purple' }
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
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${action.color}-600`} />
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