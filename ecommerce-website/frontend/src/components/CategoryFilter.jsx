/**
 * CategoryFilter Component - Filter products by category
 */

import React from 'react';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys & Games'];

const CategoryFilter = ({ selectedCategory, onChange, count }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>

      <div className="space-y-2">
        <button
          onClick={() => onChange(null)}
          className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Products {count !== undefined && `(${count})`}
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
