import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CurrencyDollarIcon,
  TagIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

const AdvancedFilters = () => {
  const { state, actions } = useApp();
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    rating: true,
    features: true
  });
  const [brandSearch, setBrandSearch] = useState('');

  const priceRanges = [
    { label: 'Under $25', value: [0, 25] },
    { label: '$25 - $50', value: [25, 50] },
    { label: '$50 - $100', value: [50, 100] },
    { label: '$100 - $200', value: [100, 200] },
    { label: '$200 - $500', value: [200, 500] },
    { label: 'Over $500', value: [500, 10000] }
  ];

  const ratings = [
    { value: 4, label: '4★ & Up', count: 0 },
    { value: 3, label: '3★ & Up', count: 0 },
    { value: 2, label: '2★ & Up', count: 0 },
    { value: 1, label: '1★ & Up', count: 0 }
  ];

  // Calculate brand counts and filter based on search
  const brands = useMemo(() => {
    const brandCounts = state.products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .filter(item => 
        item.brand.toLowerCase().includes(brandSearch.toLowerCase())
      );
  }, [state.products, brandSearch]);

  // Calculate rating counts
  const ratingCounts = useMemo(() => {
    return ratings.map(rating => ({
      ...rating,
      count: state.products.filter(product => product.rating >= rating.value).length
    }));
  }, [state.products]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (state.filters.category && state.filters.category !== 'all') count++;
    if (state.filters.rating > 0) count++;
    if (state.filters.inStock) count++;
    if (state.filters.onSale) count++;
    if (state.filters.brands && state.filters.brands.length > 0) count++;
    if (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 10000) count++;
    return count;
  }, [state.filters]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeChange = (range) => {
    actions.updateFilters({ 
      ...state.filters,
      priceRange: range 
    });
  };

  const handleBrandToggle = (brand) => {
    const currentBrands = state.filters.brands || [];
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    actions.updateFilters({ 
      ...state.filters,
      brands: updatedBrands 
    });
  };

  const clearAllFilters = () => {
    actions.updateFilters({
      category: '',
      priceRange: [0, 10000],
      rating: 0,
      inStock: false,
      onSale: false,
      brands: []
    });
    setBrandSearch('');
  };

  const clearPriceFilter = () => {
    actions.updateFilters({
      ...state.filters,
      priceRange: [0, 10000]
    });
  };

  const clearBrandFilter = () => {
    actions.updateFilters({
      ...state.filters,
      brands: []
    });
    setBrandSearch('');
  };

  const clearRatingFilter = () => {
    actions.updateFilters({
      ...state.filters,
      rating: 0
    });
  };

  const isCustomPriceRange = !priceRanges.some(
    range => range.value[0] === state.filters.priceRange[0] && 
             range.value[1] === state.filters.priceRange[1]
  );

  const sectionVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          duration: 0.3
        },
        opacity: {
          duration: 0.2,
          delay: 0.1
        }
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3
        },
        opacity: {
          duration: 0.2
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Filters Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FunnelIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <p className="text-sm text-gray-600">Refine your search</p>
            </div>
          </div>
          
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-700">Active:</span>
              
              {state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 10000 ? (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  ${state.filters.priceRange[0]} - ${state.filters.priceRange[1]}
                  <button onClick={clearPriceFilter} className="hover:text-blue-900">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ) : null}

              {state.filters.rating > 0 && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  {state.filters.rating}+ Stars
                  <button onClick={clearRatingFilter} className="hover:text-orange-900">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}

              {state.filters.brands && state.filters.brands.length > 0 && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {state.filters.brands.length} Brands
                  <button onClick={clearBrandFilter} className="hover:text-purple-900">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}

              {state.filters.inStock && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  In Stock
                </span>
              )}

              {state.filters.onSale && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                  On Sale
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Price Range Section */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900 text-left">Price Range</span>
            </div>
            {openSections.price ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {openSections.price && (
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-4 space-y-4"
              >
                {/* Price Range Presets */}
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePriceRangeChange(range.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        state.filters.priceRange[0] === range.value[0] && 
                        state.filters.priceRange[1] === range.value[1]
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>

                {/* Custom Price Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Custom Range</span>
                    {isCustomPriceRange && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={state.filters.priceRange[0]}
                          onChange={(e) => handlePriceRangeChange([
                            Number(e.target.value) || 0, 
                            state.filters.priceRange[1]
                          ])}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={state.filters.priceRange[1]}
                          onChange={(e) => handlePriceRangeChange([
                            state.filters.priceRange[0], 
                            Number(e.target.value) || 10000
                          ])}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Filter Section */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900 text-left">Brand</span>
            </div>
            {openSections.brand ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {openSections.brand && (
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-4 space-y-3"
              >
                {/* Brand Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Brand List */}
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {brands.length > 0 ? (
                    brands.map(({ brand, count }) => (
                      <label key={brand} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={(state.filters.brands || []).includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{brand}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {count}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">No brands found</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter Section */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <StarIcon className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-900 text-left">Customer Rating</span>
            </div>
            {openSections.rating ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {openSections.rating && (
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-4 space-y-3"
              >
                {ratingCounts.map(({ value, label, count }) => (
                  <label key={value} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="radio"
                        name="rating"
                        checked={state.filters.rating === value}
                        onChange={() => actions.updateFilters({ ...state.filters, rating: value })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg">
                            {star <= value ? (
                              <StarSolid className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <StarIcon className="w-4 h-4 text-gray-300" />
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">& Up</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {count}
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Filter Section */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <CheckBadgeIcon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900 text-left">Features</span>
            </div>
            {openSections.features ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            {openSections.features && (
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-4 space-y-3"
              >
                <label className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.filters.inStock}
                      onChange={(e) => actions.updateFilters({ ...state.filters, inStock: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        In Stock Only
                      </span>
                      <p className="text-xs text-gray-500">Show available items</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {state.products.filter(p => p.inStock).length}
                  </span>
                </label>

                <label className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.filters.onSale}
                      onChange={(e) => actions.updateFilters({ ...state.filters, onSale: e.target.checked })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        On Sale
                      </span>
                      <p className="text-xs text-gray-500">Special offers</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {state.products.filter(p => p.originalPrice > p.price).length}
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;