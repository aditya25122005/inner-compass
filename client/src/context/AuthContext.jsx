import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';
import { demoAuthAPI } from '../services/demoAuth';

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
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.warn('Backend profile verification failed, checking demo auth:', error);
          
          // Check if it's a demo token
          const demoUser = demoAuthAPI.verifyToken(token);
          if (demoUser) {
            setUser(demoUser);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove from storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Try real backend authentication first
      try {
        const response = await authAPI.login(credentials);
        
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: response.message };
        }
      } catch (backendError) {
        console.warn('Backend authentication failed, trying demo auth:', backendError);
        
        // Fallback to demo authentication
        const demoResponse = await demoAuthAPI.login(credentials);
        
        if (demoResponse.success) {
          localStorage.setItem('token', demoResponse.token);
          localStorage.setItem('user', JSON.stringify(demoResponse.user));
          setUser(demoResponse.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: demoResponse.message };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Try real backend registration first
      try {
        const response = await authAPI.register(userData);
        
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: response.message };
        }
      } catch (backendError) {
        console.warn('Backend registration failed, trying demo auth:', backendError);
        
        // Fallback to demo registration
        const demoResponse = await demoAuthAPI.register(userData);
        
        if (demoResponse.success) {
          localStorage.setItem('token', demoResponse.token);
          localStorage.setItem('user', JSON.stringify(demoResponse.user));
          setUser(demoResponse.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, message: demoResponse.message };
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
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
      // Try real backend first
      try {
        const response = await authAPI.updateProfile(profileData);
        if (response.success) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          return { success: true };
        }
        return { success: false, message: response.message };
      } catch (backendError) {
        console.warn('Backend profile update failed, trying demo auth:', backendError);
        
        // Fallback to demo profile update
        const demoResponse = await demoAuthAPI.updateProfile(profileData);
        if (demoResponse.success) {
          setUser(demoResponse.user);
          localStorage.setItem('user', JSON.stringify(demoResponse.user));
          return { success: true };
        }
        return { success: false, message: demoResponse.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: 'Profile update failed.' 
      };
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      // Try real backend first
      try {
        const response = await authAPI.uploadProfilePicture(file);
        if (response.success) {
          const updatedUser = { ...user, profilePicture: `http://localhost:5000${response.profilePicture}` };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return { success: true, profilePicture: `http://localhost:5000${response.profilePicture}` };
        }
        return { success: false, message: response.message };
      } catch (backendError) {
        console.warn('Backend profile picture upload failed, trying demo auth:', backendError);
        
        // Fallback to demo profile picture upload
        const demoResponse = await demoAuthAPI.uploadProfilePicture(file);
        if (demoResponse.success) {
          const updatedUser = { ...user, profilePicture: demoResponse.profilePicture };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return { success: true, profilePicture: demoResponse.profilePicture };
        }
        return { success: false, message: demoResponse.message };
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return { 
        success: false, 
        message: 'Profile picture upload failed.' 
      };
    }
  };

  const demoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Direct demo login starting...');
      
      const demoResponse = await demoAuthAPI.login({ emailOrUsername: 'admin', password: '123456' });
      console.log('Demo response:', demoResponse);
      
      if (demoResponse.success) {
        localStorage.setItem('token', demoResponse.token);
        localStorage.setItem('user', JSON.stringify(demoResponse.user));
        setUser(demoResponse.user);
        setIsAuthenticated(true);
        console.log('Demo login successful!');
        return { success: true };
      } else {
        console.log('Demo login failed:', demoResponse.message);
        return { success: false, message: demoResponse.message };
      }
    } catch (error) {
      console.error('Demo login error:', error);
      return { 
        success: false, 
        message: 'Demo login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
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
