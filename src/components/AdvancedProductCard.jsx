import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  EyeIcon,
  ShoppingCartIcon,
  CheckIcon,
  BoltIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartOutline,
  EyeIcon as EyeOutline,
  ShoppingCartIcon as ShoppingCartOutline
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

const AdvancedProductCard = ({ product, viewMode = 'grid', showWishlistButton = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { state, actions } = useApp();

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.items.some(item => item.id === product.id);
  const cartQuantity = state.cart.items.find(item => item.id === product.id)?.quantity || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.addToCart(product);
    actions.addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    actions.toggleWishlist(product);
    actions.addNotification({
      type: 'success',
      title: isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      message: isInWishlist ? 
        `${product.name} removed from your wishlist.` :
        `${product.name} added to your wishlist.`
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would open a modal with quick product details
    actions.addNotification({
      type: 'info',
      title: 'Quick View',
      message: `Quick view for ${product.name} would open here.`
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % (product.images?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      y: -8,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <Link to={`/product/${product.id}`} className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="sm:w-48 sm:h-48 w-full h-56 flex-shrink-0 relative overflow-hidden bg-gray-100">
            <motion.img
              key={currentImageIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              src={product.images?.[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                  New
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                    {product.brand}
                  </span>
                  {!product.inStock && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {showWishlistButton && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                    isInWishlist 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {isInWishlist ? (
                    <HeartIcon className="w-5 h-5" />
                  ) : (
                    <HeartOutline className="w-5 h-5" />
                  )}
                </motion.button>
              )}
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center gap-1 mr-4">
                {renderStars(product.rating)}
                <span className="ml-1 text-sm text-gray-600">({product.reviewCount})</span>
              </div>
              
              {product.fastShipping && (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <BoltIcon className="w-3 h-3" />
                  Fast Shipping
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                {cartQuantity > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                    {cartQuantity} in cart
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickView}
                  className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {isInCart ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-2xl bg-gray-100">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden">
            <motion.img
              key={currentImageIndex}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              src={product.images?.[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Image Navigation Arrows */}
            {product.images && product.images.length > 1 && isHovered && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="text-gray-700 text-lg">‹</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="text-gray-700 text-lg">›</span>
                </button>
              </>
            )}

            {/* Image Dots */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {showWishlistButton && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-xl shadow-lg transition-colors ${
                    isInWishlist 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {isInWishlist ? (
                    <HeartIcon className="w-4 h-4" />
                  ) : (
                    <HeartOutline className="w-4 h-4" />
                  )}
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickView}
                className="p-2 bg-white rounded-xl shadow-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <EyeOutline className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                  New
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
              {!product.inStock && (
                <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quick Add to Cart - Hover Overlay */}
            <AnimatePresence>
              {isHovered && product.inStock && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                >
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={handleAddToCart}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors flex items-center gap-2 ${
                      isInCart
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCartOutline className="w-4 h-4" />
                        Quick Add
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
              {product.brand}
            </span>
            
            {product.fastShipping && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <BoltIcon className="w-3 h-3" />
                Fast Ship
              </div>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="ml-1 text-xs text-gray-600">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            {cartQuantity > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                {cartQuantity} in cart
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Button */}
          {product.inStock && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`w-full mt-3 py-2 px-4 rounded-xl font-medium transition-colors lg:hidden flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isInCart ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </motion.button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default AdvancedProductCard;