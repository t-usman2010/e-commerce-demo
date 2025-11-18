import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';

const SearchSuggestions = ({ query, onSuggestionClick, popularSearches, onClose }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const { state } = useApp();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveToRecentSearches = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSuggestionClick = (suggestion) => {
    saveToRecentSearches(suggestion);
    onSuggestionClick(suggestion);
  };

  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && query === '' && (
          <div className="mb-4">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="h-4 w-4 mr-1" />
              Recent Searches
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {query === '' && (
          <div className="mb-4">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FireIcon className="h-4 w-4 mr-1" />
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Suggestions */}
        {query.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Products
            </div>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">${product.price}</div>
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-sm text-gray-500 py-2 text-center">
                  No products found for "{query}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* View All Results */}
        {query.length > 0 && filteredProducts.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <button
              onClick={() => handleSuggestionClick(query)}
              className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 py-2"
            >
              View all results for "{query}"
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;