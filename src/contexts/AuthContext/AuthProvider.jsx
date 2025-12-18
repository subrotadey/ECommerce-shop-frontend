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

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem("abaya_shop_cart_v1");
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
            // console.log('🔥 Firebase user state changed:', firebaseUser?.email);
            setUser(firebaseUser);

            if (firebaseUser) {
                // Backend থেকে user data fetch
                try {

                    // Firebase user
                    setCurrentUser({
                        _id: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    });
                } catch (error) {
                    console.error(' Error loading user data:', error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
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
        user,           // Firebase user
        currentUser,    // Backend user with _id
        loading
    };

    return (
        <AuthContext.Provider value={authInfo}>  {/* ⭐ .Provider যোগ করতে হবে */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;