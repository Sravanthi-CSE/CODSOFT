/**
 * ProductCard Component - Displays a single product card
 * Features: product image, name, price, rating, add to cart/wishlist
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProductCard = ({ product, isInWishlist = false, onWishlistChange }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAddingToCart(true);
    try {
      const success = await addToCart(product._id, 1);
      if (success) {
        toast.success('Added to cart!', { position: 'bottom-right' });
      } else {
        toast.error('Failed to add to cart', { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error('Error adding to cart', { position: 'bottom-right' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    setIsAddingToWishlist(true);
    try {
      if (inWishlist) {
        await wishlistAPI.removeFromWishlist(product._id);
        setInWishlist(false);
        toast.info('Removed from wishlist', { position: 'bottom-right' });
      } else {
        await wishlistAPI.addToWishlist(product._id);
        setInWishlist(true);
        toast.success('Added to wishlist!', { position: 'bottom-right' });
      }
      onWishlistChange?.();
    } catch (error) {
      toast.error('Failed to update wishlist', { position: 'bottom-right' });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="card card-hover h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden group">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 text-6xl">📦</div>
          )}

          {/* Category Badge */}
          <div className="absolute top-2 left-2 badge badge-primary">
            {product.category}
          </div>

          {/* Stock Status */}
          <div className="absolute top-2 right-2">
            {product.countInStock > 0 ? (
              <span className="badge bg-green-100 text-green-800">In Stock</span>
            ) : (
              <span className="badge bg-red-100 text-red-800">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Name */}
          <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {product.description || 'Quality product'}
          </p>

          {/* Price */}
          <div className="mb-4">
            <p className="text-2xl font-bold text-gradient">₹{product.price}</p>
            <p className="text-xs text-gray-500">Free shipping available</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.countInStock === 0}
              className="flex-1 flex items-center justify-center gap-2 btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart size={16} />
              {isAddingToCart ? 'Adding...' : 'Add'}
            </button>

            <button
              onClick={handleWishlistToggle}
              disabled={isAddingToWishlist}
              className={`px-3 py-2 btn-sm rounded transition flex items-center justify-center ${
                inWishlist
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
