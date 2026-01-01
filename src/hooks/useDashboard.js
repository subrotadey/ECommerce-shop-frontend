// ============================================
// 2. hooks/useDashboard.js
// ============================================
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/profileService';
import useAuth from './useAuth';

const useDashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserProfile();
      setUserData(data);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [currentUser]);

  return {
    userData,
    loading,
    error,
    refreshDashboard: loadDashboard
  };
};

export default useDashboard;
