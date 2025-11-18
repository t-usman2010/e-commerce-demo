import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdvancedFilters = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { state, actions } = useApp();

  const priceRanges = [
    { label: 'Under $25', value: [0, 25] },
    { label: '$25 to $50', value: [25, 50] },
    { label: '$50 to $100', value: [50, 100] },
    { label: '$100 to $200', value: [100, 200] },
    { label: 'Over $200', value: [200, 1000] }
  ];

  const ratings = [4, 3, 2, 1];

  const brands = useMemo(() => {
    const brandSet = new Set(state.products.map(p => p.brand));
    return Array.from(brandSet);
  }, [state.products]);

  const activeFilterCount = Object.values(state.filters).filter(value => {
    if (Array.isArray(value)) {
      return value[0] > 0 || value[1] < 1000;
    }
    if (Array.isArray(value) && value.length > 0) {
      return true;
    }
    return Boolean(value);
  }).length;

  const handlePriceRangeChange = (range) => {
    actions.updateFilters({ priceRange: range });
  };

  const handleBrandToggle = (brand) => {
    const currentBrands = state.filters.brands || [];
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    actions.updateFilters({ brands: updatedBrands });
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
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Filters Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={state.filters.priceRange[0] === range.value[0] && state.filters.priceRange[1] === range.value[1]}
                  onChange={() => handlePriceRangeChange(range.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="number"
                placeholder="Min"
                value={state.filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange([Number(e.target.value), state.filters.priceRange[1]])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={state.filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange([state.filters.priceRange[0], Number(e.target.value)])}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <h4 className="font-medium mb-3">Brand</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(state.filters.brands || []).includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-3">Customer Rating</h4>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  checked={state.filters.rating === rating}
                  onChange={() => actions.updateFilters({ rating })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1">& up</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={state.filters.inStock}
              onChange={(e) => actions.updateFilters({ inStock: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={state.filters.onSale}
              onChange={(e) => actions.updateFilters({ onSale: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">On Sale</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;