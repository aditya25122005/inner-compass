import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthReady, setIsAuthReady] = useState(true); // For demo purposes, always ready
  const [userId, setUserId] = useState('demo-user-123');

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      setIsAuthReady(true);
      setUserId('demo-user-123');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    // Demo sign out - in real app this would handle Firebase auth
    console.log('Signing out...');
    setUserId(null);
    setIsAuthReady(false);
    
    // Simulate sign out delay
    setTimeout(() => {
      setIsAuthReady(true);
      setUserId('demo-user-123');
    }, 1000);
  };

  return {
    isAuthReady,
    userId,
    handleSignOut
  };
};
