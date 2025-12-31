// src/pages/Settings/Settings.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, User, Lock, Bell, Loader, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { fetchUserProfile } from '../../services/profileService';
import {
  PhotoUploadSection,
  ProfileEditForm,
  PasswordChangeForm,
  PreferencesForm
} from '../../components/UserProfile/SettingsComponents';

const Settings = () => {
  const { currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (currentUser?.uid) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserProfile();
      setUserData(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdated = (newPhotoURL) => {
    setUserData(prev => ({ ...prev, photoURL: newPhotoURL }));
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Error Loading Settings</h2>
          <p className="text-gray-600 mb-8">{error || 'Unable to load settings.'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Tab Configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                  <SettingsIcon className="text-white" size={32} />
                </div>
                Account Settings
              </h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            
            <Link 
              to="/profile" 
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg border border-gray-200 flex items-center gap-2"
            >
              <User size={20} />
              <span className="hidden sm:inline">View Profile</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="inline mr-2" size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.charAt(0)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <PhotoUploadSection 
                userData={userData} 
                onPhotoUpdated={handlePhotoUpdated}
              />
              <hr className="border-gray-200" />
              <ProfileEditForm 
                userData={userData}
                onSaved={loadProfile}
              />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <PasswordChangeForm />
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <PreferencesForm 
                userData={userData}
                onSaved={loadProfile}
              />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All changes are saved immediately and will be reflected across your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;