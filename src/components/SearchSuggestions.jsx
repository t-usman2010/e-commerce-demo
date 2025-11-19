import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClockIcon, FireIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchSuggestions = ({ query, onSuggestionClick, popularSearches, onClose }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const { state } = useApp();

  useEffect(() => {
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

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
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
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 backdrop-blur-sm bg-white/95">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Search Suggestions</h3>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Recent Searches */}
        {recentSearches.length > 0 && query === '' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm font-semibold text-gray-900">
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                Recent Searches
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="flex items-center w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 group"
                >
                  <ClockIcon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {query === '' && (
          <div className="mb-6">
            <div className="flex items-center text-sm font-semibold text-gray-900 mb-3">
              <FireIcon className="h-4 w-4 mr-2 text-orange-500" />
              Trending Now
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-full transition-all duration-200 hover:shadow-sm"
                >
                  <FireIcon className="h-3 w-3 mr-1.5 text-orange-500" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Suggestions */}
        {query.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-gray-900 mb-3">
              Matching Products ({filteredProducts.length})
            </div>
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="flex items-center w-full text-left p-3 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 transition-all duration-200 group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg mr-4 group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                      {product.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">{product.brand}</span>
                      <span className="mx-2">•</span>
                      <span className="font-semibold text-green-600">${product.price}</span>
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    {product.category}
                  </div>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-gray-400 text-lg mb-2">🔍</div>
                  <div className="text-sm text-gray-500">
                    No products found for "<span className="text-gray-900 font-medium">"{query}"</span>"
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Try different keywords</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View All Results */}
        {query.length > 0 && filteredProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <button
              onClick={() => handleSuggestionClick(query)}
              className="w-full text-center py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              View all {filteredProducts.length}+ results for "{query}"
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;