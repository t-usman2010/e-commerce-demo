import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  EyeIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartOutline,
  EyeIcon as EyeOutline
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

const AdvancedProductCard = ({ product, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { state, actions } = useApp();

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.items.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.addNotification({
      type: 'info',
      title: 'Quick View',
      message: `Quick view for ${product.name} would open here.`
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      >
        <Link to={`/product/${product.id}`} className="flex">
          <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden rounded-l-xl">
            <img
              src={product.images?.[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  New
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <button
                onClick={handleWishlistToggle}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isInWishlist ? (
                  <HeartIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {renderStars(product.rating)}
                <span className="ml-1 text-sm text-gray-600">({product.reviewCount})</span>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {product.brand}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleQuickView}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isInCart ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.images?.[currentImageIndex] || product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Image Navigation */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
            >
              {isInWishlist ? (
                <HeartIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOutline className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
            >
              <EyeOutline className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                New
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Quick Add to Cart */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3"
            >
              <button
                onClick={handleAddToCart}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isInCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } shadow-lg`}
              >
                {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {product.brand}
            </span>
            {!product.inStock && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
              <span className="ml-1 text-sm text-gray-600">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            {product.inStock && (
              <button
                onClick={handleAddToCart}
                className="lg:hidden px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AdvancedProductCard;