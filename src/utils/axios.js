// utils/axios.js - FIXED VERSION WITH PROPER TOKEN HANDLING
import axios from 'axios';
import { auth } from '../firebase/firebase.init';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ✅ REQUEST INTERCEPTOR - Token add করা
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get current user from Firebase
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Get fresh token
        const token = await currentUser.getIdToken(false); // false = use cached if available
        
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
          console.log('✅ Token added to request:', config.url);
        }
      } else {
        // Fallback: Try localStorage
        const storedToken = localStorage.getItem('firebaseToken') || localStorage.getItem('accessToken');
        if (storedToken) {
          config.headers.authorization = `Bearer ${storedToken}`;
          console.log('⚠️ Using stored token for:', config.url);
        } else {
          console.warn('⚠️ No token available for:', config.url);
        }
      }
    } catch (error) {
      console.error('❌ Error getting token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ Response error:', error.response?.status, error.config?.url);
    console.error('Error data:', error.response?.data);

    // Token expired handling
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('⚠️ Token expired, refreshing...');

      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Force refresh token
          const newToken = await currentUser.getIdToken(true); // true = force refresh
          
          if (newToken) {
            localStorage.setItem('firebaseToken', newToken);
            
            // Retry original request with new token
            originalRequest.headers.authorization = `Bearer ${newToken}`;
            console.log('✅ Retrying with refreshed token');
            
            return axiosInstance(originalRequest);
          }
        } else {
          console.error('❌ No user found for token refresh');
          localStorage.removeItem('firebaseToken');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;