/**
 * Products Page - Browse all products with filtering and sorting
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI, wishlistAPI } from '../services/api';
import { FiSliders } from 'react-icons/fi';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Get filter values from URL
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('q');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await productAPI.getAllProducts({
          category,
          sort,
          q: search,
          page: currentPage,
          limit: 12,
        });

        setProducts(response.data.data.products || []);
        setTotalProducts(response.data.data.total || 0);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort, search, currentPage]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await wishlistAPI.getWishlist();
        const wishlistIds = response.data.data.map((item) => item._id) || [];
        setWishlistItems(wishlistIds);
      } catch (err) {
        // User not authenticated or no wishlist
      }
    };

    fetchWishlist();
  }, []);

  const handleCategoryChange = (newCategory) => {
    setCurrentPage(1);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (newSort) => {
    setCurrentPage(1);
    setSearchParams({
      ...(category && { category }),
      ...(search && { q: search }),
      sort: newSort,
    });
  };

  const totalPages = Math.ceil(totalProducts / 12);

  if (loading && currentPage === 1) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-2">
            {totalProducts} products found {category && `in ${category}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div>
            <CategoryFilter
              selectedCategory={category}
              onChange={handleCategoryChange}
              count={totalProducts}
            />

            {/* Sort Options */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FiSliders /> Sort By
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: '✨ Newest' },
                  { value: 'price_asc', label: '💰 Price: Low to High' },
                  { value: 'price_desc', label: '💸 Price: High to Low' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                      sort === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="text-center bg-red-50 border-2 border-red-200 rounded-lg p-8 text-red-600">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center bg-gray-100 rounded-lg p-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
