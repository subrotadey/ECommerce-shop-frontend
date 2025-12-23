// utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Cookies এর জন্য
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// REQUEST INTERCEPTOR - প্রতিটা request এ token add হবে
axiosInstance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
      
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired handling
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('⚠️ Token expired, trying to refresh...');

      try {
        // Firebase fresh token
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../firebase/firebase.init');
        
        return new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            
            if (user) {
              try {
                const newToken = await user.getIdToken(true); // Force refresh
                localStorage.setItem('accessToken', newToken);
                
                // Retry original request with new token
                originalRequest.headers.authorization = `Bearer ${newToken}`;
                resolve(axiosInstance(originalRequest));
              } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                reject(refreshError);
              }
            } else {
              console.error('❌ No user found');
              localStorage.removeItem('accessToken');
              window.location.href = '/login';
              reject(new Error('No user'));
            }
          });
        });
      } catch (refreshError) {
        console.error('❌ Error in token refresh:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;