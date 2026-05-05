/**
 * Product Detail Page - Shows detailed information about a product
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiChevronLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getProductById(id);
        setProduct(response.data.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkWishlist = async () => {
      try {
        const response = await wishlistAPI.getWishlist();
        const wishlistIds = response.data.data.map((item) => item._id) || [];
        setInWishlist(wishlistIds.includes(id));
      } catch (err) {
        console.error('Failed to check wishlist', err);
      }
    };

    checkWishlist();
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart', { position: 'bottom-right' });
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product._id, quantity);
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

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to use wishlist', { position: 'bottom-right' });
      navigate('/login');
      return;
    }

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
    } catch (error) {
      toast.error('Failed to update wishlist', { position: 'bottom-right' });
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 text-lg">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary mt-6 inline-block"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
          <FiChevronLeft size={20} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-96"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="text-gray-400 text-8xl">📦</div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <div className="badge badge-primary mb-4 w-fit">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="mb-4">
              {product.countInStock > 0 ? (
                <span className="badge bg-green-100 text-green-800 text-base py-2 px-3">
                  ✓ In Stock ({product.countInStock} available)
                </span>
              ) : (
                <span className="badge bg-red-100 text-red-800 text-base py-2 px-3">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-gradient mb-2">
                ₹{product.price}
              </p>
              <p className="text-gray-600">Free shipping on orders above ₹500</p>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="mb-8">
                <label className="font-bold text-lg text-gray-800 mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.countInStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center py-2 border-l-2 border-r-2 border-gray-300 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    className="px-4 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.countInStock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
              >
                <FiShoppingCart size={20} />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 ${
                  inWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiHeart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Safe & Secure</p>
                <p className="font-bold">100% Authentic</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivery</p>
                <p className="font-bold">Free Shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
