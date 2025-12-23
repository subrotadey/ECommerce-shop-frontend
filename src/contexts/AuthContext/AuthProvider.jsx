// ============================================
// contexts/AuthContext/AuthProvider.jsx - FIXED
// ============================================
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
import axios from 'axios';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null); // Backend user data

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUser = (userInfo) => {
        return updateProfile(auth.currentUser, userInfo);
    }

    const logOut = async () => {
        setLoading(true);
        localStorage.removeItem("abaya_shop_cart_v1");
        localStorage.removeItem("accessToken"); // Token remove

        // Backend logout
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        return signOut(auth);
    }

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const verifyEmail = () => {
        return sendEmailVerification(auth.currentUser);
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    // Firebase auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Token
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem('accessToken', token);

                    setCurrentUser({
                        _id: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    });
                    // Backend JWT cookie set করুন
                    // const userData = { email: firebaseUser.email };
                    // axios.post('http://localhost:5000/jwt', userData, {
                    //     withCredentials: true,
                    // })
                    //     .then(response => {
                    //         console.log('✅ JWT cookie set:', response.data);
                    //     })
                    //     .catch(error => {
                    //         console.error('Error setting JWT cookie:', error);
                    //     });

                } catch (error) {
                    console.error(' Error loading user data:', error);
                    setCurrentUser(null);
                    localStorage.removeItem('accessToken');
                }
            } else {
                setCurrentUser(null);
                localStorage.removeItem('accessToken');
            }

            setLoading(false);

            if (firebaseUser?.email) {
                const userData = { email: firebaseUser.email };

                axios.post('http://localhost:5000/jwt', userData, {
                    withCredentials: true,
                })
                    .then(response => {
                        
                    })
                    .catch(error => {
                        console.error('Error fetching JWT token:', error);
                    });
            }
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
        user,           // Firebase user
        currentUser,    // Backend user with _id
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;