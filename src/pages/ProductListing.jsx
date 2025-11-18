import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import AdvancedFilters from '../components/AdvancedFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { AdjustmentsHorizontalIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

const ProductListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const { state, actions } = useApp();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = state.products;

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= state.filters.priceRange[0] &&
      product.price <= state.filters.priceRange[1]
    );

    // Apply rating filter
    if (state.filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= state.filters.rating);
    }

    // Apply in stock filter
    if (state.filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply on sale filter
    if (state.filters.onSale) {
      filtered = filtered.filter(product => product.originalPrice > product.price);
    }

    // Apply brand filter
    if (state.filters.brands && state.filters.brands.length > 0) {
      filtered = filtered.filter(product => state.filters.brands.includes(product.brand));
    }

    // Apply sorting
    switch (state.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // featured
        filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [state.products, state.filters, state.sort, state.searchQuery]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {state.searchQuery ? `Search Results for "${state.searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          Showing {filteredAndSortedProducts.length} of {state.products.length} products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <AdvancedFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} products found
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={state.sort}
                  onChange={(e) => actions.updateSort(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredAndSortedProducts.map((product) => (
                <AdvancedProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => actions.updateFilters({
                  category: '',
                  priceRange: [0, 1000],
                  rating: 0,
                  inStock: false,
                  onSale: false,
                  brands: []
                })}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredAndSortedProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 rounded-lg border ${
                      page === 1
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                </button>
                ))}
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;