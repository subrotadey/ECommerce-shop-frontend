// utils/tokenHelper.js
import { auth } from "../firebase/firebase.init";

/**
 * Get Firebase ID Token with multiple fallback methods
 * @returns {Promise<string|null>} Firebase ID token or null
 */
export const getFirebaseToken = async () => {
  try {
    // Method 1: Get from current user (most reliable)
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      console.log("✅ Getting token from auth.currentUser");
      const token = await currentUser.getIdToken(true); // Force refresh
      
      // Store in localStorage for backup
      if (token) {
        localStorage.setItem("firebaseToken", token);
        console.log("✅ Token retrieved and stored");
        return token;
      }
    }

    // Method 2: Try localStorage backup
    const storedToken = localStorage.getItem("firebaseToken");
    if (storedToken) {
      console.log("⚠️ Using token from localStorage (backup)");
      return storedToken;
    }

    console.error("❌ No authentication token available");
    return null;

  } catch (error) {
    console.error("❌ Error getting Firebase token:", error);
    
    // Last resort: try localStorage
    const backupToken = localStorage.getItem("firebaseToken");
    if (backupToken) {
      console.log("⚠️ Using backup token after error");
      return backupToken;
    }
    
    return null;
  }
};

/**
 * Verify if token is still valid
 * @returns {Promise<boolean>}
 */
export const verifyToken = async () => {
  try {
    const token = await getFirebaseToken();
    if (!token) return false;

    // Make a test API call to verify token
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/full`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

/**
 * Clear token from storage (for logout)
 */
export const clearToken = () => {
  localStorage.removeItem("firebaseToken");
  console.log("✅ Token cleared from storage");
};

/**
 * Refresh token manually
 * @returns {Promise<string|null>}
 */
export const refreshToken = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error("❌ No user logged in");
      return null;
    }

    console.log("🔄 Refreshing token...");
    const token = await currentUser.getIdToken(true); // Force refresh
    
    if (token) {
      localStorage.setItem("firebaseToken", token);
      console.log("✅ Token refreshed successfully");
      return token;
    }

    return null;
  } catch (error) {
    console.error("❌ Error refreshing token:", error);
    return null;
  }
};

/**
 * Make authenticated API request with automatic token handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const token = await getFirebaseToken();
    
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // If token expired (401), try to refresh and retry once
    if (response.status === 401) {
      console.log("⚠️ Token expired, attempting refresh...");
      
      const newToken = await refreshToken();
      
      if (newToken) {
        console.log("✅ Retrying with new token...");
        
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    }

    return response;
  } catch (error) {
    console.error("Authenticated fetch error:", error);
    throw error;
  }
};

export default {
  getFirebaseToken,
  verifyToken,
  clearToken,
  refreshToken,
  authenticatedFetch
};