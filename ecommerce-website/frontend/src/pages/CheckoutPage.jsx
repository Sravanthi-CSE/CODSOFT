/**
 * Checkout Page - Process order and handle Razorpay payment
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI, paymentAPI } from '../services/api';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotals, clearCart, cleanCartAPI } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'COD', // Default to COD
    // UPI payment fields
    upiId: '',
    // Card payment fields (simulated)
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const { itemsCount, totalPrice } = getTotals();



  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary mt-6 inline-block"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Please fill in all fields', { position: 'bottom-right' });
      return;
    }

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number', { position: 'bottom-right' });
      return;
    }


    // Validate UPI payment details
    if (formData.paymentMethod === 'UPI') {
      if (!formData.upiId) {
        toast.error('Please enter your UPI ID', { position: 'bottom-right' });
        return;
      }
      if (!formData.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (must contain @)', { position: 'bottom-right' });
        return;
      }
    }

    // Validate Card payment details (Simulated)
    if (formData.paymentMethod === 'CARD') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
        toast.error('Please fill in all card details', { position: 'bottom-right' });
        return;
      }
      // Simple card number validation (16 digits)
      const cardNum = formData.cardNumber.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cardNum)) {
        toast.error('Card number must be 16 digits', { position: 'bottom-right' });
        return;
      }
      // Expiry MM/YY format
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        toast.error('Expiry must be in MM/YY format', { position: 'bottom-right' });
        return;
      }
      // CVV 3 or 4 digits
      if (!/^\d{3,4}$/.test(formData.cardCVV)) {
        toast.error('CVV must be 3 or 4 digits', { position: 'bottom-right' });
        return;
      }
    }

    setLoading(true);

    try {
      // Use current cart items directly (they should be valid)
      const validItems = (cart?.items || []).filter(item => item.product && item.product._id);
      if (validItems.length === 0) {
        toast.error('Your cart is empty. Please add items before checkout.', { position: 'bottom-right' });
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        useCart: true,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        upiId: formData.paymentMethod === 'UPI' ? formData.upiId : undefined,
        // Simulate sending card details (not secure, just for demo)
        cardDetails:
          formData.paymentMethod === 'CARD'
            ? {
                cardNumber: formData.cardNumber,
                cardExpiry: formData.cardExpiry,
                cardCVV: formData.cardCVV,
              }
            : undefined,
        status:
          formData.paymentMethod === 'COD'
            ? 'Pending'
            : 'Paid',
      };

      // Place order via API
      const response = await orderAPI.createOrder(orderData);
      toast.success('Order placed successfully!', { position: 'bottom-right' });
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || 'Checkout failed. Please try again.';
      toast.error(errorMessage, { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        {loading && <LoadingSpinner fullScreen />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
                                          {/* Payment Method Selection */}
                                          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                            <h2 className="font-bold text-xl mb-4 text-gray-800">Payment Method</h2>
                                            <div className="flex flex-col gap-3">
                                              <label className="flex items-center gap-2">
                                                <input
                                                  type="radio"
                                                  name="paymentMethod"
                                                  value="COD"
                                                  checked={formData.paymentMethod === 'COD'}
                                                  onChange={handleInputChange}
                                                />
                                                Cash on Delivery
                                              </label>
                                              <label className="flex items-center gap-2">
                                                <input
                                                  type="radio"
                                                  name="paymentMethod"
                                                  value="UPI"
                                                  checked={formData.paymentMethod === 'UPI'}
                                                  onChange={handleInputChange}
                                                />
                                                UPI Payment
                                              </label>
                                              <label className="flex items-center gap-2">
                                                <input
                                                  type="radio"
                                                  name="paymentMethod"
                                                  value="CARD"
                                                  checked={formData.paymentMethod === 'CARD'}
                                                  onChange={handleInputChange}
                                                />
                                                Card Payment (Simulated)
                                              </label>
                                            </div>
                                          </div>
                            {/* User Details */}
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                              <h2 className="font-bold text-xl mb-4 text-gray-800">Shipping & Contact Details</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                                  <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="Full Name"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">Email</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="Email"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">Phone</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="10-digit Phone Number"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">Address</label>
                                  <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="Address"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">City</label>
                                  <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="City"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block font-medium text-gray-700 mb-1">Postal Code</label>
                                  <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    placeholder="Postal Code"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
              {/* UPI Payment Details */}

              {/* UPI Payment Details */}
              {formData.paymentMethod === 'UPI' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">UPI Payment Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="yourname@upi"
                        required={formData.paymentMethod === 'UPI'}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter your UPI ID (e.g., yourname@paytm, yourname@okaxis)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Payment Details (Simulated) */}
              {formData.paymentMethod === 'CARD' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Card Payment Details (Simulated)</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber || ''}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required={formData.paymentMethod === 'CARD'}
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block font-medium text-gray-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="MM/YY"
                          maxLength={5}
                          required={formData.paymentMethod === 'CARD'}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="password"
                          name="cardCVV"
                          value={formData.cardCVV || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="123"
                          maxLength={4}
                          required={formData.paymentMethod === 'CARD'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `🛒 Place Order`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="font-bold text-xl mb-4 text-gray-800">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b max-h-48 overflow-y-auto">
                {Array.isArray(cart.items) && cart.items.filter(item => item.product && item.product._id).map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.qty}
                    </span>
                    <span className="font-bold">
                      ₹{(item.product.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pb-4 mb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-bold">₹0.00</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-bold text-xl text-gradient">
                  ₹{(totalPrice).toFixed(2)}
                </span>
              </div>

              {/* Info */}
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-bold mb-2">✓ Secure Payment</p>
                <p>Your payment information is processed securely. No card details are stored or shared.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
