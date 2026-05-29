import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authService
        .getCurrentUser()
        .then((res) => {
          setUser(res.data.user);
          setError(null);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authService.login(email, password);
      localStorage.setItem('authToken', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    try {
      setError(null);
      const res = await authService.signup(email, password, name);
      localStorage.setItem('authToken', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
      throw err;
    }
  };

  const updateProfile = async (name, avatarUrl) => {
    try {
      setError(null);
      const res = await authService.updateProfile(name, avatarUrl);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Profile update failed';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
