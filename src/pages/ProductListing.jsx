import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import AdvancedFilters from '../components/AdvancedFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  AdjustmentsHorizontalIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const ProductListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { state, actions } = useApp();

  const productsPerPage = 12;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = state.products;

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (state.filters.category && state.filters.category !== 'all') {
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
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // featured
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }, [state.products, state.filters, state.sort, state.searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    actions.updateFilters({
      category: '',
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      onSale: false,
      brands: []
    });
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (state.filters.category && state.filters.category !== 'all') count++;
    if (state.filters.rating > 0) count++;
    if (state.filters.inStock) count++;
    if (state.filters.onSale) count++;
    if (state.filters.brands && state.filters.brands.length > 0) count++;
    if (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 1000) count++;
    return count;
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <AdvancedFilters />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {state.searchQuery ? (
                  <>
                    Search Results for "<span className="text-blue-600">"{state.searchQuery}"</span>"
                  </>
                ) : (
                  'All Products'
                )}
              </h1>
              <p className="text-gray-600">
                Showing {filteredAndSortedProducts.length} of {state.products.length} products
                {state.searchQuery && (
                  <button
                    onClick={() => actions.setSearchQuery('')}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Clear search
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Active filters:</span>
                  
                  {state.filters.category && state.filters.category !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Category: {state.filters.category}
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, category: '' })}
                        className="hover:text-blue-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {state.filters.rating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      Rating: {state.filters.rating}+ stars
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, rating: 0 })}
                        className="hover:text-orange-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {state.filters.inStock && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      In Stock Only
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, inStock: false })}
                        className="hover:text-green-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {state.filters.onSale && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      On Sale
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, onSale: false })}
                        className="hover:text-red-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 1000) && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      Price: ${state.filters.priceRange[0]} - ${state.filters.priceRange[1]}
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, priceRange: [0, 1000] })}
                        className="hover:text-purple-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {state.filters.brands && state.filters.brands.length > 0 && (
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      Brands: {state.filters.brands.length} selected
                      <button
                        onClick={() => actions.updateFilters({ ...state.filters, brands: [] })}
                        className="hover:text-indigo-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <AdvancedFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
                  {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={state.sort}
                      onChange={(e) => {
                        actions.updateSort(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }>
                  {paginatedProducts.map((product) => (
                    <AdvancedProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <ChevronUpIcon className="w-4 h-4 rotate-90" />
                        Previous
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        Next
                        <ChevronUpIcon className="w-4 h-4 -rotate-90" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {state.searchQuery 
                    ? "We couldn't find any products matching your search. Try adjusting your keywords or filters."
                    : "Try adjusting your filters or search criteria to find what you're looking for."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                  {state.searchQuery && (
                    <button
                      onClick={() => actions.setSearchQuery('')}
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;