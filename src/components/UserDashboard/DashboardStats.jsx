// ============================================
// 3. components/UserDashboard/DashboardStats.jsx
// ============================================
import { ShoppingBag, Heart, Package, DollarSign } from 'lucide-react';

const DashboardStats = ({ userData }) => {
  const stats = [
    {
      id: 1,
      title: 'Total Orders',
      value: userData?.ordersCount || 0,
      icon: ShoppingBag,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Wishlist Items',
      value: userData?.wishlistCount || 0,
      icon: Heart,
      color: 'pink',
      bgGradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 3,
      title: 'Pending Orders',
      value: userData?.recentOrders?.filter(o => o.status === 'pending').length || 0,
      icon: Package,
      color: 'purple',
      bgGradient: 'from-purple-500 to-indigo-500'
    },
    {
      id: 4,
      title: 'Total Spent',
      value: `৳${userData?.totalSpent || 0}`,
      icon: DollarSign,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;