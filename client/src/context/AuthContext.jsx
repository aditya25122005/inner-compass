import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching user profile
          const response = await authAPI.getProfile();
          // ✅ FIX: Check if response data and user exist before setting state
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.warn('Backend profile verification failed:', error);
          // Token is invalid, remove from storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);
// LOGIN
const login = async (credentials) => {
  setIsLoading(true);
  try {
    const data = await authAPI.login(credentials);
    console.log('Raw login response:', data);

    if (data?.token && data?.user) {  // check if backend returned token & user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true, message: 'Login successful!', user: data.user };
    } else {
      return { success: false, message: data?.msg || 'Login failed.' };
    }
  } catch (error) {
    console.error('Login failed:', error);
    const errorMessage = error?.response?.data?.msg || error.message || 'Login failed. Please try again.';
    return { success: false, message: errorMessage };
  } finally {
    setIsLoading(false);
  }
};



// REGISTER
const register = async (userData) => {
  setIsLoading(true);
  try {
    const data = await authAPI.register(userData); // <-- already data
    console.log('Raw register response:', data);

    if (data?.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true, message: 'Registration successful!' };
    } else {
      return { success: false, message: data?.msg || 'Registration failed.' };
    }
  } catch (error) {
    console.error('Registration failed, please check the backend:', error);
    const errorMessage = error?.response?.data?.msg || error.message || 'Registration failed. Please try again.';
    return { success: false, message: errorMessage };
  } finally {
    setIsLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true };
      } else {
        return { success: false, message: response.data.msg || 'Profile update failed.' };
      }
      
    } catch (error) {
      console.error('Profile update error:', error);
      let errorMessage = 'Profile update failed.';
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const response = await authAPI.uploadProfilePicture(file);
      
      if (response.data && response.data.profilePicture) {
        const updatedUser = { ...user, profilePicture: `http://localhost:5000${response.data.profilePicture}` };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, profilePicture: `http://localhost:5000${response.data.profilePicture}` };
      } else {
        return { success: false, message: response.data.msg || 'Profile picture upload failed.' };
      }
      
    } catch (error) {
      console.error('Profile picture upload error:', error);
      let errorMessage = 'Profile picture upload failed.';
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const demoLogin = async () => {
    // NOTE: This function is for demonstration purposes only.
    // The real login flow should not use a fallback.
    const demoResponse = {
      success: true,
      user: {
        _id: 'demo-user-123',
        name: 'Demo User',
        username: 'demouser',
        email: 'demo@example.com',
        profilePicture: 'https://placehold.co/150x150/png',
      },
      token: 'demo-token-xyz'
    };
    
    localStorage.setItem('token', demoResponse.token);
    localStorage.setItem('user', JSON.stringify(demoResponse.user));
    setUser(demoResponse.user);
    setIsAuthenticated(true);
    return { success: true };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    demoLogin,
    register,
    logout,
    updateProfile,
    uploadProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
