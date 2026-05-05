/**
 * Cart Page - Shopping cart management
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, loading, updateCartItem, removeFromCart, getTotals } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const { itemsCount, totalPrice } = getTotals();

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    const success = await removeFromCart(productId);
    if (success) {
      toast.info('Item removed from cart', { position: 'bottom-right' });
      // Refresh cart to ensure state is updated
      await fetchCart();
    }
  };

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.warning('Cart is empty', { position: 'bottom-right' });
      return;
    }
    setIsCheckingOut(true);
    navigate('/checkout');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <FiArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FiShoppingBag size={36} />
          Shopping Cart
        </h1>

        {!cart?.items || cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</p>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              to="/products"
              className="btn-primary inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 font-bold flex justify-between items-center">
                  <span>Product</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {cart.items.filter(item => item.product && item.product._id).map((item) => (
                    <div key={item.product._id} className="p-6 flex gap-6 hover:bg-gray-50 transition">
                      {/* Product Image */}
                      <Link to={`/product/${item.product._id}`}>
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 hover:shadow-md transition">
                          {item.product.image && !imageErrors.has(item.product._id) ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={() => handleImageError(item.product._id)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-3xl">📦</div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="font-bold text-gray-800 hover:text-blue-600 transition"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          Price: <span className="font-bold">₹{item.product.price}</span>
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center mt-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.qty - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border border-gray-300 mx-1 px-2 py-1 outline-none focus:border-blue-600"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.qty + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="text-right flex flex-col justify-between items-end">
                        <p className="font-bold text-lg text-gradient">
                          ₹{(item.product.price * item.qty).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                          title="Remove item"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h3 className="font-bold text-2xl mb-6 text-gray-800">Order Summary</h3>

                {/* Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemsCount} items)</span>
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

                {/* Total */}
                <div className="mb-6 pb-6 border-b flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Total</span>
                  <span className="font-bold text-2xl text-gradient">
                    ₹{(totalPrice + 0).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="w-full btn-secondary mt-3 block py-3 font-bold text-lg text-center"
                >
                  Continue Shopping
                </Link>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    ✓ Free shipping on all orders
                    <br />
                    ✓ Secure checkout
                    <br />
                    ✓ Easy returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
