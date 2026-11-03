
// src/utils/tokenHelper.js

import { auth } from '../firebase/firebase.init';
import axiosInstance from './axios';

/**
 * Get Firebase ID Token.
 *
 * @param {boolean} forceRefresh
 * @returns {Promise<string|null>}
 */
export const getFirebaseToken = async (forceRefresh = false) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    const token = await currentUser.getIdToken(forceRefresh);

    return token || null;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};

/**
 * Verify current user's authentication through backend.
 *
 * @returns {Promise<boolean>}
 */
export const verifyToken = async () => {
  try {
    if (!auth.currentUser) {
      return false;
    }

    const response = await axiosInstance.get('/users/profile/full');

    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

/**
 * Clear legacy tokens from localStorage.
 *
 * Firebase logout must be handled separately
 * using signOut(auth).
 */
export const clearToken = () => {
  localStorage.removeItem('firebaseToken');
  localStorage.removeItem('accessToken');
};

/**
 * Force refresh Firebase ID Token.
 *
 * @returns {Promise<string|null>}
 */
export const refreshToken = async () => {
  return await getFirebaseToken(true);
};

/**
 * Make authenticated API request using fetch.
 *
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = await getFirebaseToken();

  if (!token) {
    throw new Error('No authenticated Firebase user found.');
  }

  const makeRequest = (accessToken) => {
    const headers = new Headers(options.headers || {});

    headers.set('Authorization', `Bearer ${accessToken}`);

    if (
      !headers.has('Content-Type') &&
      !(options.body instanceof FormData)
    ) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(token);

  // Retry once if token expires.
  if (response.status === 401 && auth.currentUser) {
    const newToken = await refreshToken();

    if (newToken) {
      response = await makeRequest(newToken);
    }
  }

  return response;
};

export default {
  getFirebaseToken,
  verifyToken,
  clearToken,
  refreshToken,
  authenticatedFetch,
};
