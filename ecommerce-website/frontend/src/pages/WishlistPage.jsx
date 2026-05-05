/**
 * Wishlist Page - View and manage saved products
 * - Displays wishlist items in a responsive grid of cards
 * - Actions: Move to Cart (adds to cart and removes from wishlist), Remove
 * - Uses CartContext for cart updates and wishlistAPI for wishlist ops
 * - Tailwind UI: bold headings, shadows, hover effects, responsive
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await wishlistAPI.getWishlist();
        setWishlistProducts(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load wishlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Helper to refresh wishlist
  const refreshWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlistProducts(response.data.data || []);
    } catch (err) {
      console.error('Failed to refresh wishlist', err);
    }
  };

  // Move product to cart then remove from wishlist
  const handleMoveToCart = async (product) => {
    setUpdatingId(product._id);
    try {
      const added = await addToCart(product._id, 1); // POST /api/cart
      if (!added) throw new Error('Failed to add to cart');

      // Remove from wishlist after successful add
      await wishlistAPI.removeFromWishlist(product._id);

      // Update local list
      setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));

      // Success notification
      toast.success('Moved to cart!', { position: 'bottom-right' });
    } catch (err) {
      console.error('Move to cart error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to move to cart';
      toast.error(msg, { position: 'bottom-right' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove from wishlist
  const handleRemove = async (product) => {
    setUpdatingId(product._id);
    try {
      await wishlistAPI.removeFromWishlist(product._id);
      setWishlistProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.info('Removed from wishlist', { position: 'bottom-right' });
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      const msg = err.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(msg, { position: 'bottom-right' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link
          to="/products"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
          <FiArrowLeft size={20} />
          Back to Products
        </Link>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">❤️ My Wishlist</h1>
        <p className="text-gray-600 mb-8">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
        </p>

        {error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-red-600 text-center">
            {error}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</p>
            <p className="text-gray-600 mb-8">Start adding products to your wishlist!</p>
            <Link to="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="card card-hover h-full flex flex-col">
                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden group">
                  {product.image && !imageErrors.has(product._id) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={() => handleImageError(product._id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-gray-400 text-6xl">📦</div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 badge badge-primary">
                    {product.category}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Name */}
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 hover:text-blue-600 transition"
                  >
                    {product.name}
                  </Link>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gradient">₹{product.price}</p>
                    <p className="text-xs text-gray-500">Free shipping available</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={updatingId === product._id}
                      className="flex-1 flex items-center justify-center gap-2 btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart size={16} />
                      {updatingId === product._id ? 'Moving...' : 'Move to Cart'}
                    </button>

                    <button
                      onClick={() => handleRemove(product)}
                      disabled={updatingId === product._id}
                      className="px-3 py-2 btn-sm rounded bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
