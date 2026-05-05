/**
 * Signup Page - User registration
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields', { position: 'bottom-right' });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', { position: 'bottom-right' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { position: 'bottom-right' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address', { position: 'bottom-right' });
      return;
    }

    setLoading(true);
    try {
      const success = await signup(formData.name, formData.email, formData.password);
      if (success) {
        toast.success('Account created successfully! Redirecting...', {
          position: 'bottom-right',
        });
        navigate('/', { replace: true });
      }
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
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
            <p className="text-gray-600 mt-2">Join Us Today!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

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
              <p className="text-xs text-gray-600 mt-1">
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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

          {/* Social Login */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => toast.info('Google OAuth coming soon!', { position: 'bottom-right' })}
              className="flex-1 py-2 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              disabled
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.info('GitHub OAuth coming soon!', { position: 'bottom-right' })}
              className="flex-1 py-2 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              disabled
            >
              GitHub
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-bold transition"
            >
              Sign in here
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

export default SignupPage;
