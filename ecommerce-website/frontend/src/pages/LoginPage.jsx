/**
 * Login Page - User and Admin login
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || (isAdmin ? '/admin/dashboard' : '/');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', { position: 'bottom-right' });
      return;
    }

    // Frontend guard: only allow the specific admin email when admin toggle is on
    if (formData.isAdmin && formData.email.trim().toLowerCase() !== 'admin@shophub.com') {
      toast.error('Only admin@shophub.com is allowed to login as admin', { position: 'bottom-right' });
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password, formData.isAdmin);
      if (success) {
        // Notify success and route based on role
        toast.success('Login successful!', { position: 'bottom-right' });
        if (formData.isAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      toast.error(errorMessage, { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🛍️</div>
            <h1 className="text-3xl font-bold text-gray-800">ShopHub</h1>
            <p className="text-gray-600 mt-2">Welcome back!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Admin Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isAdmin" className="ml-2 text-sm font-medium text-gray-700">
                Login as Admin
              </label>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          
          {/* Signup Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/home"
              className="text-blue-600 hover:text-blue-700 font-bold transition"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm">🔒 Your data is safe and secure with us</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
