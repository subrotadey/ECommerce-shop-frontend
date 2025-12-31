// src/components/UserProfile/ProfileCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Package, Heart, Star, Shield,
  Award, Crown, CheckCircle, ChevronRight,
  ShoppingBag, Calendar, Clock, Globe
} from 'lucide-react';
import { formatDate, getAvatarUrl, getRoleConfig } from '../../services/profileService';

const ProfileCard = ({ userData, onNavigateToSettings }) => {
  if (!userData) return null;

  const roleConfig = getRoleConfig(userData.role);

  const RoleBadge = () => {
    const IconComponent = userData.role === 'admin' ? Crown : userData.role === 'staff' ? Award : User;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${roleConfig.gradient} text-white rounded-full font-semibold shadow-lg`}>
        <IconComponent size={18} />
        <span className="capitalize">{userData.role}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Content */}
        <div className="relative -mt-16 px-6 pb-6">
          {/* Profile Photo */}
          <div className="relative inline-block">
            <img
              src={getAvatarUrl(userData.displayName, userData.photoURL)}
              alt={userData.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
            />
            {/* Online Status Indicator */}
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>

          {/* User Info */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {userData.displayName || 'User'}
            </h2>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
              <Mail size={14} />
              {userData.email}
            </p>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoleBadge />
              {userData.emailVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                  <CheckCircle size={12} />
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <Package className="mx-auto text-blue-600 mb-1" size={20} />
              <div className="text-xl font-bold text-blue-600">
                {userData.ordersCount || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Orders</div>
            </div>

            <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl border border-pink-100">
              <Heart className="mx-auto text-pink-600 mb-1" size={20} />
              <div className="text-xl font-bold text-pink-600">
                {userData.wishlistCount || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Wishlist</div>
            </div>

            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <Star className="mx-auto text-green-600 mb-1" size={20} />
              <div className="text-xl font-bold text-green-600">
                {userData.recentOrders?.length || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Recent</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-2">
            {(userData.role === 'admin' || userData.role === 'staff') && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 rounded-xl transition-all border border-purple-100 font-medium"
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} />
                  <span>{userData.role === 'admin' ? 'Admin' : 'Staff'} Dashboard</span>
                </div>
                <ChevronRight size={18} />
              </Link>
            )}

            <Link
              to="/wishlist"
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 to-red-50 hover:from-pink-100 hover:to-red-100 text-pink-700 rounded-xl transition-all border border-pink-100 font-medium"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span>My Wishlist</span>
              </div>
              <ChevronRight size={18} />
            </Link>

            <Link
              to="/orders"
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 rounded-xl transition-all border border-blue-100 font-medium"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <span>My Orders</span>
              </div>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          Account Information
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="text-gray-400 mt-0.5" size={18} />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Member Since</div>
              <div className="font-medium text-gray-900 text-sm">
                {formatDate(userData.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="text-gray-400 mt-0.5" size={18} />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Last Login</div>
              <div className="font-medium text-gray-900 text-sm">
                {formatDate(userData.lastLogin)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="text-gray-400 mt-0.5" size={18} />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Login Provider</div>
              <div className="font-medium text-gray-900 text-sm capitalize">
                {userData.provider?.replace('.com', '') || 'Email'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="text-gray-400 mt-0.5" size={18} />
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Account Status</div>
              <div className={`font-medium text-sm ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {userData.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;