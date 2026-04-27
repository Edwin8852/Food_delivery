import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/user/me');
          if (res.data.success) {
            setUser(res.data.data);
            sessionStorage.setItem('user', JSON.stringify(res.data.data));
            sessionStorage.setItem('role', res.data.data.role); 
          }
        } catch (err) {
          console.error("Auth hydration failed:", err.message);
          logout(); // Use centralized logout
        }
      } else {
        const savedUser = JSON.parse(sessionStorage.getItem('user'));
        if (savedUser) setUser(savedUser);
      }
      setLoading(false);
    };

    syncAuth();
  }, [user?.role]);
  
  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    setUser(null);
  };

  const login = async (email, password) => {
    console.log(`[AUTH] Attempting login: ${email}`);
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;

    // 🔥 SECURITY PROTOCOL: Clear old state before initializing new session
    sessionStorage.clear();

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);
    
    console.log(`[AUTH] Key Rotation Success. New Role: ${user.role}`);
    setUser(user);
    return response.data;
  };

  const register = async (name, email, password, role, phone) => {
    const response = await api.post('/auth/register', { name, email, password, role, phone });
    const { user, token } = response.data.data;
    
    sessionStorage.clear();
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role);
    
    setUser(user);
    return response.data;
  };


  const refreshUser = async () => {
    try {
      const response = await api.get('/user/me');
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Auth sync failed");
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

