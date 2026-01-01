// ============================================
// 10. components/UserDashboard/SupportCard.jsx
// ============================================
import { Package, AlertCircle, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SupportCard = () => {
  const supportLinks = [
    { icon: Package, title: 'Track Order', desc: 'Check delivery status', path: '/track', color: 'blue' },
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
              className={`flex items-center gap-3 p-3 bg-${link.color}-50 hover:bg-${link.color}-100 rounded-xl transition-all group`}
            >
              <div className={`w-10 h-10 bg-${link.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${link.color}-200 transition-all`}>
                <Icon size={20} className={`text-${link.color}-600`} />
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