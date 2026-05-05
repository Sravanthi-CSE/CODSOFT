/**
 * Orders Page - View order history
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const { orderId } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderAPI.getUserOrders();
        setOrders(response.data.data || []);
        if ((response.data.data || []).length > 0) {
          toast.success('Orders loaded', { position: 'bottom-right', autoClose: 1500 });
        }

        // If orderId is provided, select that order
        if (orderId) {
          const order = response.data.data.find((o) => o._id === orderId);
          if (order) {
            setSelectedOrder(order);
          }
        } else if (response.data.data.length > 0) {
          setSelectedOrder(response.data.data[0]);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load orders';
        setError(message);
        toast.error(message, { position: 'bottom-right' });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition"
        >
          <FiArrowLeft size={20} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">📦 My Orders</h1>

        {error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-red-600 text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No orders yet</p>
            <p className="text-gray-600 mb-8">Start shopping to place your first order!</p>
            <Link to="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 font-bold">
                  Order History
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <button
                      key={order._id}
                      onClick={() => {
                        setSelectedOrder(order);
                        toast.info(`Viewing order #${order._id.substring(0, 8).toUpperCase()}` , { position: 'bottom-right', autoClose: 1200 });
                      }}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition flex justify-between items-center ${
                        selectedOrder?._id === order._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            order.isPaid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder ? (
              <div className="lg:col-span-2 space-y-6">
                {/* Status */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Order Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                        <FiCheck size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Order Placed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 opacity-${selectedOrder.isPaid ? '100' : '50'}`}>
                      <div className={`w-8 h-8 ${selectedOrder.isPaid ? 'bg-green-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white`}>
                        <FiCheck size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Payment Confirmed</p>
                        {selectedOrder.isPaid && (
                          <p className="text-sm text-gray-600">
                            {new Date(selectedOrder.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 opacity-${selectedOrder.isDelivered ? '100' : '50'}`}>
                      <div className={`w-8 h-8 ${selectedOrder.isDelivered ? 'bg-green-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-white`}>
                        <FiCheck size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Delivered</p>
                        {selectedOrder.isDelivered && (
                          <p className="text-sm text-gray-600">
                            {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Items</h2>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b last:pb-0 last:border-b-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            ₹{item.price} × {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Shipping Address</h2>
                  <div className="text-gray-700 space-y-1">
                    <p className="font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city} -{' '}
                      {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p className="mt-3 font-bold">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-800">Order Summary</h2>
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-bold">₹{selectedOrder.taxPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 pt-4 text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gradient">
                      ₹{selectedOrder.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
