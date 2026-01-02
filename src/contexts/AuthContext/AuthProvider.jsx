// contexts/AuthContext/AuthProvider.jsx - IMPROVED VERSION
import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase.init';
import { clearToken } from '../../utils/tokenHelper';
import { AuthContext } from './AuthContext';

const googleProvider = new GoogleAuthProvider();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthProvider = ({ children }) => {
  // ✅ IMPROVED: Single source of truth for user
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ✅ Sign in
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Update user profile
  const updateUser = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };

  // ✅ IMPROVED: Clean logout
  const logOut = async () => {
    setLoading(true);

    // Clear local data
    localStorage.removeItem("guest_cart");
    clearToken(); // ✅ Use centralized token helper

    try {
      // Backend logout
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Backend logout error:', error);
    }

    return signOut(auth);
  };

  // ✅ Google sign in
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ✅ Email verification
  const verifyEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  // ✅ Password reset
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // ✅ IMPROVED: Register user in backend
  const registerUserInBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();

      const response = await axios.post(
        `${API_URL}/users/register`,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          provider: firebaseUser.providerData[0]?.providerId || 'password'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data.user;
    } catch (error) {
      console.error('Backend registration error:', error);
      throw error;
    }
  };

  // ✅ IMPROVED: Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get and store token
          const token = await firebaseUser.getIdToken(true);
          localStorage.setItem('firebaseToken', token);

          // Register/update user in backend
          const backendUser = await registerUserInBackend(firebaseUser);

          // Set complete user data
          setCurrentUser({
            ...firebaseUser,
            ...backendUser,
            // Ensure we have all Firebase methods
            getIdToken: firebaseUser.getIdToken.bind(firebaseUser)
          });

        } catch (error) {
          console.error('Error loading user data:', error);
          setCurrentUser(null);
          clearToken();
        }
      } else {
        setCurrentUser(null);
        clearToken();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auth context value
  const authInfo = {
    signInWithGoogle,
    createUser,
    signIn,
    updateUser,
    verifyEmail,
    resetPassword,
    logOut,
    currentUser,  // ✅ Single user object
    loading
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;