/**
 * Navbar Component - Header navigation for the application
 * Features: logo, navigation links, user dropdown, cart icon, search
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    // Handle search input and navigation
    const handleSearchInput = (e) => setSearchQuery(e.target.value);
    const handleSearchKeyDown = (e) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    };
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, getTotals } = useCart();
  const navigate = useNavigate();

  // Calculate cart items count (total quantity, not number of items)
  const { itemsCount } = getTotals();
  const cartCount = itemsCount;

  const handleLogout = () => {
    // Clear auth state and redirect to login as per requirements
    logout();
    navigate('/login', { replace: true });
    setShowUserMenu(false);
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-2xl hover:text-gray-100 transition">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-blue-600">
              🛍️
            </div>
            <span>ShopHub</span>
          </Link>

          {/* Desktop Navigation - show links based on login and role */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <>
                <Link to="/" className="text-white hover:text-gray-100 font-medium transition">
                  Home
                </Link>
                <Link to="/products" className="text-white hover:text-gray-100 font-medium transition">
                  Products
                </Link>
                {user?.role === 'admin' ? (
                  <Link to="/admin/dashboard" className="text-white hover:text-gray-100 font-medium transition">
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/wishlist" className="text-white hover:text-gray-100 font-medium transition">
                      Wishlist
                    </Link>
                    <Link to="/cart" className="text-white hover:text-gray-100 font-medium transition">
                      Cart
                    </Link>
                    <Link to="/orders" className="text-white hover:text-gray-100 font-medium transition">
                      Orders
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-24"
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={handleSearchKeyDown}
              />
            </div>

            {/* Wishlist and Cart only for authenticated non-admin users */}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link
                  to="/wishlist"
                  className="text-white hover:text-gray-100 transition relative"
                  title="Wishlist"
                >
                  <FiHeart size={24} />
                </Link>
                <Link
                  to="/cart"
                  className="text-white hover:text-gray-100 transition relative"
                  title="Shopping Cart"
                >
                  <FiShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-white hover:text-gray-100 transition"
                >
                  <FiUser size={24} />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b text-gray-700 font-semibold">
                      {user?.name}
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      📦 My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <button
                        onClick={handleAdminDashboard}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                      >
                        ⚙️ Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition flex items-center space-x-2"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-white hover:text-gray-100 transition"
            >
              {showMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden bg-blue-700 px-4 py-4 space-y-3 animate-slideInDown">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="block text-white hover:text-gray-100 font-medium transition"
                  onClick={() => setShowMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block text-white hover:text-gray-100 font-medium transition"
                  onClick={() => setShowMenu(false)}
                >
                  Products
                </Link>
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="block text-white hover:text-gray-100 font-medium transition"
                    onClick={() => setShowMenu(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/wishlist"
                      className="block text-white hover:text-gray-100 font-medium transition"
                      onClick={() => setShowMenu(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/cart"
                      className="block text-white hover:text-gray-100 font-medium transition"
                      onClick={() => setShowMenu(false)}
                    >
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="block text-white hover:text-gray-100 font-medium transition"
                      onClick={() => setShowMenu(false)}
                    >
                      Orders
                    </Link>
                  </>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="block text-white hover:text-gray-100 font-medium transition"
                onClick={() => setShowMenu(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
