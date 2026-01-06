// src/components/UserProfile/ProfileInfo.jsx

import { MapPin, Package, User } from 'lucide-react';
import { formatDate, getOrderStatusConfig } from '../../services/profileService';

// ============================================
// INFO FIELD COMPONENT
// ============================================
export const InfoField = ({ label, value, valueClass = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>
    <p className={`text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-lg ${valueClass}`}>
      {value || 'Not set'}
    </p>
  </div>
);

// ============================================
// PERSONAL INFORMATION SECTION
// ============================================
export const PersonalInformation = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="text-blue-500" size={22} />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          label="Full Name"
          value={userData.displayName}
        />

        <InfoField
          label="Email Address"
          value={userData.email}
        />

        <InfoField
          label="Phone Number"
          value={userData.phoneNumber}
        />

        <InfoField
          label="Account Status"
          value={userData.isActive ? 'Active' : 'Inactive'}
          valueClass={userData.isActive ? 'text-green-600' : 'text-red-600'}
        />
      </div>
    </div>
  );
};

// ============================================
// ADDRESS INFORMATION SECTION
// ============================================
export const AddressInformation = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MapPin className="text-blue-500" size={22} />
        Address Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <InfoField
            label="Street Address"
            value={userData.address?.street}
          />
        </div>

        <InfoField
          label="City"
          value={userData.address?.city}
        />

        <InfoField
          label="State/Province"
          value={userData.address?.state}
        />

        <InfoField
          label="Zip Code"
          value={userData.address?.zipCode}
        />

        <InfoField
          label="Country"
          value={userData.address?.country}
        />
      </div>
    </div>
  );
};

// ============================================
// RECENT ORDERS SECTION
// ============================================
export const RecentOrders = ({ userData }) => {
  if (!userData || !userData.recentOrders || userData.recentOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="text-blue-500" size={22} />
        Recent Orders
      </h3>

      <div className="space-y-3">
        {userData.recentOrders.map((order) => {
          const statusConfig = getOrderStatusConfig(order.status);

          return (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
            >
              <div>
                <p className="font-semibold text-gray-900">{order.orderId}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-blue-600">${order.total}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {userData.ordersCount > userData.recentOrders.length && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            View All Orders ({userData.ordersCount})
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMBINED PROFILE INFORMATION
// ============================================
const ProfileInformation = ({ userData }) => {
  return (
    <div className="space-y-6">
      <PersonalInformation userData={userData} />
      <AddressInformation userData={userData} />
      <RecentOrders userData={userData} />
    </div>
  );
};

export default ProfileInformation;