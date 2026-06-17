/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService.js';
import { CONSTANTS } from '../config/constants.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
        if (storedToken) {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data.data;

      // Store tokens and user data
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(userData));

      setUser(userData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || CONSTANTS.ERRORS.SERVER_ERROR;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.register({ name, email, password });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || CONSTANTS.ERRORS.SERVER_ERROR;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear stored data
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(CONSTANTS.STORAGE_KEYS.USER);
      
      setUser(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === CONSTANTS.ROLES.ADMIN;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    setUser,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
