// src/components/UserProfile/ProfileInfo.jsx

import { MapPin, Package, User } from 'lucide-react';
import { formatDate, getOrderStatusConfig } from '../../services/profileService';
import AddressForm from '../Address/AddressForm';
import AddressList from '../Address/AddressList';

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
// COMBINED PROFILE INFORMATION
// ============================================
const ProfileInformation = ({ userData }) => {
  return (
    <div className="space-y-6">
      <PersonalInformation userData={userData} />
      {/* <AddressInformation userData={userData} /> */}
      {/* <AddressForm></AddressForm> */}
      <AddressList></AddressList>
    </div>
  );
};

export default ProfileInformation;