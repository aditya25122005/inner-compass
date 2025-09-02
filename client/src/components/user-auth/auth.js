import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken, signOut } from 'firebase/auth';
import { initializeFirebase, getFirebaseAuth } from '../services/firebase';

export const useAuth = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const { auth } = initializeFirebase();
    
    if (auth) {
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        setIsAuthReady(true);
      });

      if (initialAuthToken) {
        signInWithCustomToken(auth, initialAuthToken).catch(console.error);
      } else {
        signInAnonymously(auth).catch(console.error);
      }

      return () => unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { isAuthReady, userId, handleSignOut };
};