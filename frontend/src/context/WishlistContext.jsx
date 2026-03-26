import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, getAuthHeaders } = useAuth();

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mern_wishlist') || '[]');
    } catch { return []; }
  });

  // Fetch server wishlist on login
  useEffect(() => {
    const token = localStorage.getItem('mern_token');
    if (user && token && token !== 'null') {
      axios.get(`${API_BASE_URL}/api/wishlist`, getAuthHeaders())
        .then(res => setWishlist(res.data))
        .catch(err => {
          if (err.response?.status === 401 || err.response?.status === 400) {
            console.warn('Auth token invalid for wishlist — skipping server sync.');
          }
        });
    } else if (!user) {
      try {
        setWishlist(JSON.parse(localStorage.getItem('mern_wishlist') || '[]'));
      } catch { setWishlist([]); }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist guest wishlist
  useEffect(() => {
    if (!user) {
      localStorage.setItem('mern_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = useCallback(async (product) => {
    const isInList = wishlist.some(item => (item._id || item) === product._id);
    if (isInList) {
      setWishlist(prev => prev.filter(item => (item._id || item) !== product._id));
      if (user) {
        try {
          await axios.delete(`${API_BASE_URL}/api/wishlist/${product._id}`, getAuthHeaders());
        } catch (err) { console.error('Remove wishlist error:', err); }
      }
    } else {
      setWishlist(prev => [...prev, product]);
      if (user) {
        try {
          await axios.post(`${API_BASE_URL}/api/wishlist/${product._id}`, {}, getAuthHeaders());
        } catch (err) { console.error('Add wishlist error:', err); }
      }
    }
  }, [wishlist, user, getAuthHeaders]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
