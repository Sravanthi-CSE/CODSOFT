/**
 * Home Page - Landing page with featured products and categories
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI, wishlistAPI } from '../services/api';
import { FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured products and wishlist on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products
        const productsResponse = await productAPI.getAllProducts({ limit: 8 });
        setProducts(productsResponse.data.data.products || []);

        // Fetch wishlist
        try {
          const wishlistResponse = await wishlistAPI.getWishlist();
          const wishlistIds = wishlistResponse.data.data.map((item) => item._id) || [];
          setWishlistItems(wishlistIds);
        } catch (err) {
          // Not authenticated or wishlist not available
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to ShopHub
              </h1>
              <p className="text-lg mb-6 text-gray-100">
                Discover amazing products at unbeatable prices. Shop from our wide range of categories and get exclusive deals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Shop Now
                  <FiArrowRight />
                </Link>
                <button className="px-6 py-2 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="text-6xl text-center md:text-right">
              🛍️
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Electronics', emoji: '📱', color: 'from-blue-400 to-blue-600' },
            { name: 'Fashion', emoji: '👗', color: 'from-pink-400 to-pink-600' },
            { name: 'Home', emoji: '🏠', color: 'from-orange-400 to-orange-600' },
            { name: 'Sports', emoji: '⚽', color: 'from-green-400 to-green-600' },
            { name: 'Books', emoji: '📚', color: 'from-purple-400 to-purple-600' },
            { name: 'Toys & Games', emoji: '🎮', color: 'from-red-400 to-red-600' },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
            >
              <div
                className={`bg-gradient-to-br ${category.color} rounded-lg p-8 text-white text-center hover:shadow-lg transition transform hover:scale-105 h-40 flex flex-col items-center justify-center`}
              >
                <div className="text-5xl mb-3">{category.emoji}</div>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-lg shadow-lg mx-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          ✨ Featured Products
        </h2>

        {error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No products available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={wishlistItems.includes(product._id)}
                onWishlistChange={async () => {
                  try {
                    const response = await wishlistAPI.getWishlist();
                    const wishlistIds = response.data.data.map((item) => item._id) || [];
                    setWishlistItems(wishlistIds);
                  } catch (err) {
                    console.error('Failed to update wishlist', err);
                  }
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            View All Products
            <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="font-bold text-xl mb-2">Free Shipping</h3>
            <p className="text-gray-600">On all orders over ₹500</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="font-bold text-xl mb-2">Secure Payments</h3>
            <p className="text-gray-600">100% secure & encrypted</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">↩️</div>
            <h3 className="font-bold text-xl mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
