/**
 * Cart Context - Manages shopping cart state globally
 * Provides cart items, add/remove/update functions
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import { cartAPI } from '../services/api';

// Create context
const CartContext = createContext();

// Create provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      setCart(response.data.data || { items: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = async (productId, qty = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addToCart({ productId, qty });
      setCart(response.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, qty) => {
    try {
      setError(null);
      const response = await cartAPI.updateCartItem({ productId, qty });
      setCart(response.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart');
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      return false;
    }
  };

  // Clear cart (local only)
  const clearCart = () => {
    setCart({ items: [] });
  };

  // Clean cart via API (remove items with null/deleted products)
  const cleanCartAPI = async () => {
    try {
      const response = await cartAPI.cleanCart();
      setCart(response.data.data);
      return response.data; // Return the response data for immediate use
    } catch (err) {
      console.error('Failed to clean cart:', err);
      return null;
    }
  };

  // Calculate totals
  const getTotals = () => {
    if (!cart?.items || cart.items.length === 0) {
      return { itemsCount: 0, totalPrice: 0 };
    }

    const itemsCount = cart.items.reduce((sum, item) => sum + (item.qty || 0), 0);
    const totalPrice = cart.items.reduce((sum, item) => {
      const price = item.product?.price || item.price || 0;
      return sum + price * (item.qty || 0);
    }, 0);

    return { itemsCount, totalPrice };
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cleanCartAPI,
    getTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
