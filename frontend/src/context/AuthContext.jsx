import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('mern_token')}` }
  }), []);

  useEffect(() => {
    const storedUser = localStorage.getItem('mern_user');
    const storedToken = localStorage.getItem('mern_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const handleAuthSuccess = useCallback(async (userData, newToken) => {
    localStorage.setItem('mern_token', newToken);
    localStorage.setItem('mern_user', JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('mern_token');
    localStorage.removeItem('mern_user');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, handleAuthSuccess, handleLogout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
