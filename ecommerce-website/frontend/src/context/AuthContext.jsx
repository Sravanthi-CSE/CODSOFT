/**
 * Auth Context - Manages authentication state globally
 * Provides user info, token, login/logout functions
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Signup function
  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.signup({ name, email, password });
      const { token: newToken, user: userData } = response.data.data;

      // Store in localStorage and state
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      // Propagate the error to the calling component
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password, isAdmin = false) => {
    try {
      setLoading(true);
      setError(null);
      const apiCall = isAdmin ? authAPI.adminLogin : authAPI.login;
      const response = await apiCall({ email, password });
      const { token: newToken, user: userData } = response.data.data;

      // Store in localStorage and state
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);

      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      // Propagate the error to the calling component
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};