import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, getAuthHeaders } = useAuth();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mern_cart') || '[]');
    } catch { return []; }
  });

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('mern_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Fetch server cart whenever user changes (login/logout)
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/cart`, getAuthHeaders())
        .then(res => setCart(res.data))
        .catch(err => console.error('Error fetching cart:', err));
    } else {
      // Restore guest cart from localStorage when logged out
      try {
        setCart(JSON.parse(localStorage.getItem('mern_cart') || '[]'));
      } catch { setCart([]); }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const syncCart = useCallback(async (newToken) => {
    const localCart = JSON.parse(localStorage.getItem('mern_cart') || '[]');
    try {
      if (localCart.length > 0) {
        await axios.post(`${API_BASE_URL}/api/cart/sync`,
          { items: localCart.map(i => ({ productId: i._id, quantity: i.quantity })) },
          { headers: { Authorization: `Bearer ${newToken}` } }
        );
        localStorage.removeItem('mern_cart');
      }
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, []);

  const addToCart = useCallback(async (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      return existing
        ? prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { ...product, quantity }];
    });
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/api/cart/add`, { productId: product._id, quantity }, getAuthHeaders());
      } catch (err) { console.error('Add cart error:', err); }
    }
  }, [user, getAuthHeaders]);

  const updateCartQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQuantity } : item));
    if (user) {
      try {
        await axios.put(`${API_BASE_URL}/api/cart/update`, { productId, quantity: newQuantity }, getAuthHeaders());
      } catch (err) { console.error('Update cart error:', err); }
    }
  }, [user, getAuthHeaders]);

  const removeFromCart = useCallback(async (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
    if (user) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, getAuthHeaders());
      } catch (err) { console.error('Remove cart error:', err); }
    }
  }, [user, getAuthHeaders]);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (user) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/clear`, getAuthHeaders());
      } catch (err) { console.error('Clear cart error:', err); }
    } else {
      localStorage.removeItem('mern_cart');
    }
  }, [user, getAuthHeaders]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCartQuantity, removeFromCart, clearCart, syncCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
