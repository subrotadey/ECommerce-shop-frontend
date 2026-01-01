// ============================================
// 8. components/UserDashboard/ActivityTimeline.jsx
// ============================================
import { Clock, Package, Heart, User } from 'lucide-react';

const ActivityTimeline = ({ userData }) => {
  const activities = [
    { icon: Package, text: 'Order placed', time: '2 hours ago', color: 'blue' },
    { icon: Heart, text: 'Added item to wishlist', time: '1 day ago', color: 'pink' },
    { icon: User, text: 'Profile updated', time: '3 days ago', color: 'green' },
    { icon: Package, text: 'Order delivered', time: '1 week ago', color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="text-blue-500" size={22} />
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 text-${activity.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;