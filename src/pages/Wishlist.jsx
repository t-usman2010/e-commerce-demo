import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TrashIcon,
  ArrowRightIcon,
  EyeIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { state, actions } = useApp();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAddToCart = (product) => {
    actions.addToCart(product);
    actions.addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`
    });
  };

  const handleRemoveFromWishlist = (product) => {
    actions.toggleWishlist(product);
    actions.addNotification({
      type: 'info',
      title: 'Removed from Wishlist',
      message: `${product.name} has been removed from your wishlist.`
    });
  };

  const handleAddAllToCart = () => {
    const itemsToAdd = selectedItems.size > 0 
      ? state.wishlist.filter(product => selectedItems.has(product.id))
      : state.wishlist;

    itemsToAdd.forEach(product => actions.addToCart(product));
    
    actions.addNotification({
      type: 'success',
      title: 'Items Added to Cart',
      message: `${itemsToAdd.length} item${itemsToAdd.length === 1 ? '' : 's'} added to your cart.`
    });

    setSelectedItems(new Set());
  };

  const handleSelectAll = () => {
    if (selectedItems.size === state.wishlist.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(state.wishlist.map(product => product.id)));
    }
  };

  const handleSelectItem = (productId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      state.wishlist.forEach(product => actions.toggleWishlist(product));
      actions.addNotification({
        type: 'info',
        title: 'Wishlist Cleared',
        message: 'All items have been removed from your wishlist.'
      });
    }
  };

  const calculateTotalPrice = () => {
    const items = selectedItems.size > 0 
      ? state.wishlist.filter(product => selectedItems.has(product.id))
      : state.wishlist;
    
    return items.reduce((total, product) => total + product.price, 0);
  };

  const shareWishlist = () => {
    setShowShareModal(true);
    // In a real app, this would generate a shareable link
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading your wishlist..." />
      </div>
    );
  }

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-200"
          >
            <HeartIcon className="w-16 h-16 text-gray-400" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Your wishlist is empty
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 text-lg max-w-md mx-auto"
          >
            Save your favorite items here to keep track of products you love and want to purchase later.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Browse Categories
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <HeartSolid className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save Favorites</h3>
              <p className="text-gray-600 text-sm">Click the heart icon on any product to add it to your wishlist.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <EyeIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Items</h3>
              <p className="text-gray-600 text-sm">Monitor price changes and availability of your saved items.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCartIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quick Purchase</h3>
              <p className="text-gray-600 text-sm">Add multiple items to your cart with one click when you're ready to buy.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Wishlist</h3>
              <p className="text-gray-600 mb-6">
                Share your wishlist with friends and family so they know exactly what you want!
              </p>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Copy Shareable Link
                </button>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {state.wishlist.length} {state.wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareWishlist}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share
            </button>
            
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedItems.size} selected • ${calculateTotalPrice().toFixed(2)}
                </span>
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Add Selected ({selectedItems.size})
                </button>
              </div>
            )}
            
            <button
              onClick={handleAddAllToCart}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Add All to Cart
            </button>
            
            <button
              onClick={handleClearWishlist}
              className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-5 h-5 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.size === state.wishlist.length && state.wishlist.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">
                Select all {state.wishlist.length} items
              </span>
            </label>
            
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedItems.size} items selected
                </span>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {state.wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.1
                }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Selection Checkbox */}
                <div className="p-4 border-b border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(product.id)}
                      onChange={() => handleSelectItem(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Select item</span>
                  </label>
                </div>

                {/* Product Card */}
                <div className="p-4">
                  <AdvancedProductCard 
                    product={product} 
                    showWishlistButton={false}
                  />
                </div>

                {/* Additional Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </button>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </Link>
                      
                      <button
                        onClick={() => handleRemoveFromWishlist(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        Added recently
                      </div>
                      {product.inStock ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircleIcon className="w-3 h-3" />
                          In Stock
                        </div>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{state.wishlist.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ${state.wishlist.reduce((total, product) => total + product.price, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {state.wishlist.filter(product => product.inStock).length}
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {state.wishlist.filter(product => product.originalPrice > product.price).length}
              </div>
              <div className="text-sm text-gray-600">On Sale</div>
            </div>
          </div>
        </motion.div>

        {/* Recommended Products */}
        {state.wishlist.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {state.products
                .filter(p => !state.wishlist.some(w => w.id === p.id))
                .slice(0, 4)
                .map((product) => (
                  <AdvancedProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;