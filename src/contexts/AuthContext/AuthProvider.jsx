// ============================================
// contexts/AuthContext/AuthProvider.jsx
// Authentication Provider
// ============================================
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
import { AuthContext } from './AuthContext';

const googleProvider = new GoogleAuthProvider();

// API base URL - use environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Axios interceptor for automatic token refresh
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            async (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If token expired, refresh it
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const firebaseUser = auth.currentUser;
                        if (firebaseUser) {
                            const token = await firebaseUser.getIdToken(true);
                            localStorage.setItem('accessToken', token);
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        // Token refresh failed, logout user
                        await logOut();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // Create user with email and password
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUser = async (userInfo) => {
        try {
            await updateProfile(auth.currentUser, userInfo);

            // Update in backend as well
            const token = localStorage.getItem('accessToken');
            if (token) {
                await axios.patch(
                    `${API_BASE_URL}/users/profile`,
                    { displayName: userInfo.displayName, photoURL: userInfo.photoURL },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Verify email
    const verifyEmail = async () => {
        try {
            await sendEmailVerification(auth.currentUser);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    };

    // Logout
    const logOut = async () => {
        setLoading(true);
        try {
            // Clear local storage
            localStorage.removeItem("abaya_shop_cart_v1");
            localStorage.removeItem("accessToken");

            // Backend logout (optional - clear server-side session)
            try {
                await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                    withCredentials: true,
                });
            } catch (error) {
                console.error('Backend logout error:', error);
            }

            // Firebase logout
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Save or update user in database
    const saveUserToDatabase = async (firebaseUser) => {
        try {
            const token = await firebaseUser.getIdToken();

            const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                emailVerified: firebaseUser.emailVerified,
                provider: firebaseUser.providerData[0]?.providerId || 'password',
            };

            const response = await axios.post(
                `${API_BASE_URL}/users/register`,
                userData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error saving user to database:', error);
            throw error;
        }
    };

    // Fetch user data from database
    const fetchUserFromDatabase = async (firebaseUser) => {
        try {
            const token = await firebaseUser.getIdToken();

            const response = await axios.get(
                `${API_BASE_URL}/users/profile`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            return response.data.user;
        } catch (error) {
            if (error.response?.status === 404) {
                // User not found in database, save them
                return await saveUserToDatabase(firebaseUser);
            }
            console.error('Error fetching user from database:', error);
            throw error;
        }
    };

    // Firebase auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Get Firebase ID token
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem('accessToken', token);

                    // Fetch or create user in database
                    const dbUser = await fetchUserFromDatabase(firebaseUser);

                    setCurrentUser({
                        _id: dbUser._id,
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName || dbUser.displayName,
                        photoURL: firebaseUser.photoURL || dbUser.photoURL,
                        role: dbUser.role,
                        emailVerified: firebaseUser.emailVerified,
                        createdAt: dbUser.createdAt,
                    });

                } catch (error) {
                    console.error('Error loading user data:', error);
                    setCurrentUser(null);
                    localStorage.removeItem('accessToken');
                }
            } else {
                setCurrentUser(null);
                localStorage.removeItem('accessToken');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        signInWithGoogle,
        createUser,
        signIn,
        updateUser,
        verifyEmail,
        resetPassword,
        logOut,
        user,
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;