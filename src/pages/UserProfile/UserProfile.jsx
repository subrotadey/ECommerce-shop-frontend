// src/pages/UserProfile/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Home, Loader, AlertCircle } from 'lucide-react';
import { fetchUserProfile } from '../../services/profileService';
import ProfileCard from '../../components/UserProfile/ProfileCard';
import ProfileInformation from '../../components/UserProfile/ProfileInfo';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const { role } = useRole(currentUser?.email);
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg">Loading your profile...</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Profile Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'Unable to load your profile data.'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            <Home size={18} />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                  <User className="text-white" size={32} />
                </div>
                My Profile
              </h1>
              <p className="text-gray-600">Welcome back, {userData.displayName}!</p>
            </div>
            
            <div className="flex gap-3">
              <Link 
                to="/" 
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg border border-gray-200 flex items-center gap-2"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link 
                to="/settings" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Settings size={20} />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard userData={userData} />
          </div>

          {/* Right Side - Profile Information */}
          <div className="lg:col-span-2">
            <ProfileInformation userData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;