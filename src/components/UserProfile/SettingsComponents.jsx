// src/components/UserProfile/SettingsComponents.jsx

import React, { useState } from 'react';
import { Camera, Loader, Save, Eye, EyeOff, Bell, Mail, Info } from 'lucide-react';
import {
  uploadImageToCloudinary,
  updateUserProfile,
  validateProfileData,
  showNotification,
  getAvatarUrl
} from '../../services/profileService';
import AddressList from '../Address/AddressList';
import {
  getAuth,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Navbar Firebase user থেকে নাম/ছবি পড়ে, তাই Firebase-এও sync রাখি।
// ব্যর্থ হলে মূল কাজ থামে না।
const syncFirebaseProfile = async (fields) => {
  try {
    const user = getAuth().currentUser;
    if (user) await updateProfile(user, fields);
  } catch (error) {
    console.warn('Firebase profile sync failed:', error.message);
  }
};

// ============================================
// PHOTO UPLOAD SECTION
// ============================================
export const PhotoUploadSection = ({ userData, onPhotoUpdated }) => {
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // একই ফাইল আবার বাছা যাবে
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      showNotification('error', 'Invalid file', 'Only JPG, PNG or WebP images are allowed');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      showNotification('error', 'File too large', 'Image must be 5MB or smaller');
      return;
    }

    try {
      setUploading(true);

      const result = await uploadImageToCloudinary(file);
      await updateUserProfile({ photoURL: result.url });
      await syncFirebaseProfile({ photoURL: result.url });

      showNotification('success', 'Success!', 'Profile photo updated successfully');

      if (onPhotoUpdated) onPhotoUpdated(result.url);
    } catch (error) {
      console.error('Photo upload error:', error);
      showNotification('error', 'Upload Failed', error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Photo</h3>
      <div className="flex items-center gap-6">
        <img
          src={getAvatarUrl(userData.displayName, userData.photoURL)}
          alt={userData.displayName}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
        />
        <div>
          <label
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              <>
                <Camera size={18} />
                Change Photo
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            JPG, PNG or WebP. Max size 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PROFILE EDIT FORM (name + phone). Address আলাদা, AddressList নিজে সংরক্ষণ করে।
// ============================================
export const ProfileEditForm = ({ userData, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData.displayName || '',
    phoneNumber: userData.phoneNumber || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        displayName: formData.displayName.trim(),
        phoneNumber: formData.phoneNumber.trim()
      };

      const validation = validateProfileData(payload);
      if (!validation.isValid) {
        showNotification('error', 'Validation Error', Object.values(validation.errors)[0]);
        return;
      }

      setSaving(true);

      await updateUserProfile(payload);
      await syncFirebaseProfile({ displayName: payload.displayName });

      showNotification('success', 'Success!', 'Profile updated successfully');

      if (onSaved) onSaved();
    } catch (error) {
      console.error('Save error:', error);
      showNotification('error', 'Update Failed', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+971 5X XXX XXXX"
              autoComplete="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Addresses (নিজস্ব add/edit/delete আছে) */}
      <AddressList />
    </div>
  );
};

// ============================================
// PASSWORD CHANGE FORM
// ============================================
const mapPasswordError = (code, fallback) => {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect';
    case 'auth/weak-password':
      return 'New password is too weak';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/requires-recent-login':
      return 'Please log out, log in again and retry';
    default:
      return fallback || 'Failed to change password';
  }
};

export const PasswordChangeForm = () => {
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const hasPasswordLogin = getAuth().currentUser?.providerData?.some(
    (p) => p.providerId === 'password'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('error', 'Error', 'Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      showNotification('error', 'Error', 'New password must be different from the current one');
      return;
    }

    try {
      setSaving(true);

      const user = getAuth().currentUser;
      if (!user) throw new Error('Please log in again');

      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);

      showNotification('success', 'Success!', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      showNotification('error', 'Error', mapPasswordError(error.code, error.message));
    } finally {
      setSaving(false);
    }
  };

  // Google ইত্যাদি দিয়ে লগইন করা অ্যাকাউন্টে পাসওয়ার্ড নেই
  if (!hasPasswordLogin) {
    return (
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
        <div>
          <div className="font-medium text-gray-900">No password to change</div>
          <div className="text-sm text-gray-600 mt-1">
            You signed in with Google, so your password is managed by your Google account.
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'current', name: 'currentPassword', label: 'Current Password', autoComplete: 'current-password' },
    { key: 'new', name: 'newPassword', label: 'New Password', autoComplete: 'new-password' },
    { key: 'confirm', name: 'confirmPassword', label: 'Confirm New Password', autoComplete: 'new-password' }
  ];

  return (
    <form onSubmit={handleChangePassword} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          {fields.map(({ key, name, label, autoComplete }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[key] ? 'text' : 'password'}
                  name={name}
                  value={passwordData[name]}
                  onChange={handleInputChange}
                  autoComplete={autoComplete}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword(key)}
                  aria-label={showPasswords[key] ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords[key] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saving ? (
            <>
              <Loader className="animate-spin" size={18} />
              Changing...
            </>
          ) : (
            <>
              <Save size={18} />
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// ============================================
// PREFERENCES FORM
// ============================================
export const PreferencesForm = ({ userData, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: userData.preferences?.newsletter ?? false,
    notifications: userData.preferences?.notifications ?? true
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile({ preferences });
      showNotification('success', 'Success!', 'Preferences updated successfully');
      if (onSaved) onSaved();
    } catch (error) {
      console.error('Save preferences error:', error);
      showNotification('error', 'Error', 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Communication Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <Bell className="text-blue-500 mt-1" size={20} />
              <div>
                <div className="font-medium text-gray-900">Order Update Notifications</div>
                <div className="text-sm text-gray-600 mt-1">
                  Show payment, shipping and delivery updates in the notification bell
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={preferences.notifications}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <Mail className="text-blue-500 mt-1" size={20} />
              <div>
                <div className="font-medium text-gray-900">Newsletter Subscription</div>
                <div className="text-sm text-gray-600 mt-1">
                  Get exclusive deals, new arrivals, and special offers
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              name="newsletter"
              checked={preferences.newsletter}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saving ? (
            <>
              <Loader className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};