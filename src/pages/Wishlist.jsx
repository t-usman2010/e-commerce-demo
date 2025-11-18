import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { state, actions } = useApp();

  const handleAddToCart = (product) => {
    actions.addToCart(product);
  };

  const handleRemoveFromWishlist = (product) => {
    actions.toggleWishlist(product);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (state.wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {state.wishlist.length} {state.wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              state.wishlist.forEach(product => actions.addToCart(product));
              actions.addNotification({
                type: 'success',
                title: 'Items Added',
                message: 'All wishlist items have been added to your cart.'
              });
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5 mr-2" />
            Add All to Cart
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {state.wishlist.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AdvancedProductCard product={product} />
              
              {/* Additional Actions */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Recently Viewed */}
      {state.wishlist.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
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
    </motion.div>
  );
};

export default Wishlist;