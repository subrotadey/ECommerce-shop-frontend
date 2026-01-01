// ============================================
// 7. components/UserDashboard/AccountOverview.jsx
// ============================================
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { formatDate, getRoleConfig } from '../../services/profileService';

const AccountOverview = ({ userData }) => {
  const roleConfig = getRoleConfig(userData.role);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="text-blue-500" size={20} />
        Account Overview
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="text-gray-400 mt-1" size={18} />
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">Email</div>
            <div className="font-medium text-gray-900 text-sm break-all">{userData.email}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="text-gray-400 mt-1" size={18} />
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">Member Since</div>
            <div className="font-medium text-gray-900 text-sm">{formatDate(userData.createdAt)}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="text-gray-400 mt-1" size={18} />
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">Account Type</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleConfig.bgColor} ${roleConfig.textColor}`}>
              {roleConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;