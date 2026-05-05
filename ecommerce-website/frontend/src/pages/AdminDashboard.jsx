/**
 * Admin Dashboard - Manage products
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    category: 'Electronics',
    image: '',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getAllProducts({ limit: 100 });
        setProducts(response.data.data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      countInStock: '',
      category: 'Electronics',
      image: '',
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      countInStock: product.countInStock,
      category: product.category,
      image: product.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.countInStock || !formData.category) {
      toast.error('Please fill in all required fields', { position: 'bottom-right' });
      return;
    }

    try {
      if (editingProduct) {
        // Update product
        await productAPI.updateProduct(editingProduct._id, {
          ...formData,
          price: parseFloat(formData.price),
          countInStock: parseInt(formData.countInStock),
        });
        toast.success('Product updated successfully!', { position: 'bottom-right' });
      } else {
        // Create product
        await productAPI.createProduct({
          ...formData,
          price: parseFloat(formData.price),
          countInStock: parseInt(formData.countInStock),
        });
        toast.success('Product created successfully!', { position: 'bottom-right' });
      }

      // Refresh products
      const response = await productAPI.getAllProducts({ limit: 100 });
      setProducts(response.data.data.products || []);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product', {
        position: 'bottom-right',
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully!', { position: 'bottom-right' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product', {
        position: 'bottom-right',
      });
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition"
            >
              <FiArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-800">⚙️ Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your products</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="btn-primary flex items-center gap-2 text-lg py-3 px-6"
          >
            <FiPlus size={20} />
            Add Product
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-red-600 text-center">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No products yet</p>
            <p className="text-gray-600 mb-8">Start by adding your first product!</p>
            <button
              onClick={handleAddProduct}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiPlus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="grid grid-cols-5 gap-4 px-6 py-4 font-bold">
                <div>Product</div>
                <div>Category</div>
                <div>Price</div>
                <div>Stock</div>
                <div className="text-right">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-3">
                    {product.image && !imageErrors.has(product._id) && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={() => handleImageError(product._id)}
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-600">{product._id.substring(0, 8)}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="badge badge-primary">{product.category}</span>
                  </div>

                  {/* Price */}
                  <div className="font-bold text-green-600">₹{product.price}</div>

                  {/* Stock */}
                  <div>
                    <span
                      className={`font-bold ${
                        product.countInStock > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {product.countInStock}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-slideInUp">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Product name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Product description"
                  rows="3"
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Sports</option>
                  <option>Books</option>
                  <option>Toys & Games</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Stock Count *
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
