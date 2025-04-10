import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase.config';
import { createUserDocument, checkFirebaseConnection } from '../services/firestoreService';

// Create the context
const AuthContext = createContext();

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect for auth state listener - SIMPLIFIED VERSION
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      
      try {
        if (user) {
          // Check Firebase connection first
          console.log('Checking Firebase connection...');
          const isConnected = await checkFirebaseConnection();
          console.log('Firebase connection status:', isConnected);

          if (!isConnected) {
            throw new Error('Failed to connect to Firebase');
          }

          // Only proceed with user document creation if connection is successful
          console.log('Creating/updating user document...');
          await createUserDocument(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || ''
          });
        }
        
        setCurrentUser(user);
        setError(null);
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign up function
  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check Firebase connection before creating user document
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to Firebase');
      }

      await createUserDocument(userCredential.user.uid, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || ''
      });
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message);
      throw error;
    }
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .catch(error => {
        console.error('Login error:', error);
        setError(error.message);
        throw error;
      });
  }

  // Logout function
  function logout() {
    return signOut(auth)
      .catch(error => {
        console.error('Logout error:', error);
        setError(error.message);
        throw error;
      });
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
      .catch(error => {
        console.error('Password reset error:', error);
        setError(error.message);
        throw error;
      });
  }

  // Log state changes
  useEffect(() => {
    console.log('Auth state updated:', { currentUser: !!currentUser, loading, error });
  }, [currentUser, loading, error]);

  // Context value
  const value = {
    currentUser,
    error,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  // Always render children, but pass loading state so components can handle it
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 