// ============================================
// 10. components/UserDashboard/SupportCard.jsx
// ============================================
import { Package, AlertCircle, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TONE = {
  blue: { row: 'bg-blue-50 hover:bg-blue-100', box: 'bg-blue-100 group-hover:bg-blue-200', icon: 'text-blue-600' },
  green: { row: 'bg-green-50 hover:bg-green-100', box: 'bg-green-100 group-hover:bg-green-200', icon: 'text-green-600' },
  purple: { row: 'bg-purple-50 hover:bg-purple-100', box: 'bg-purple-100 group-hover:bg-purple-200', icon: 'text-purple-600' },
};

const SupportCard = () => {
  const supportLinks = [
    { icon: Package, title: 'My Orders', desc: 'Check order status', path: '/orders', color: 'blue' },
    { icon: AlertCircle, title: 'FAQs', desc: 'Find quick answers', path: '/faq', color: 'green' },
    { icon: Bell, title: 'Contact Support', desc: "We're here to help", path: '/contact', color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
      
      <div className="space-y-3">
        {supportLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 p-3 ${TONE[link.color].row} rounded-xl transition-all group`}
            >
              <div className={`w-10 h-10 ${TONE[link.color].box} rounded-lg flex items-center justify-center transition-all`}>
                <Icon size={20} className={TONE[link.color].icon} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{link.title}</p>
                <p className="text-xs text-gray-600">{link.desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SupportCard;