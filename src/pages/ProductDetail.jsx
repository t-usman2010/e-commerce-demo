import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  CheckIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  BoltIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartOutline,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageLoading, setIsImageLoading] = useState(true);

  const product = state.products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    actions.addToCart(product, quantity);
    actions.addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart.`
    });
  };

  const handleBuyNow = () => {
    actions.addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    actions.toggleWishlist(product);
    actions.addNotification({
      type: 'success',
      title: isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      message: isInWishlist ? 
        `${product.name} removed from your wishlist.` :
        `${product.name} added to your wishlist.`
    });
  };

  const relatedProducts = state.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const nextImage = () => {
    setSelectedImage((prev) => 
      (prev + 1) % (product.images?.length || 1)
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? (product.images?.length || 1) - 1 : prev - 1
    );
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading product..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-4 text-sm text-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <span>/</span>
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.img
                    key={selectedImage}
                    custom={1}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    src={product.images?.[selectedImage] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onLoad={() => setIsImageLoading(false)}
                  />
                </AnimatePresence>
                
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="medium" />
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-2">
                {(product.images || [product.image]).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {product.category}
                  </span>
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      New Arrival
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{product.reviewCount} reviews</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`p-3 rounded-xl transition-colors ${
                  isInWishlist 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {isInWishlist ? (
                  <HeartIcon className="w-6 h-6" />
                ) : (
                  <HeartOutline className="w-6 h-6" />
                )}
              </motion.button>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-green-600 font-medium flex items-center gap-2">
                <BoltIcon className="w-5 h-5" />
                Free shipping on orders over $50
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="font-semibold text-gray-900 text-lg">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors rounded-l-xl"
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className={`w-5 h-5 ${quantity <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                  </button>
                  <span className="px-6 py-3 min-w-12 text-center font-semibold text-gray-900 text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors rounded-r-xl"
                  >
                    <PlusIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                    product.inStock
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <BoltIcon className="w-6 h-6" />
                  Buy Now
                </motion.button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <TruckIcon className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div>On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div>30-day policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium text-gray-900">2-Year Warranty</div>
                  <div>Full coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {[
                  { id: 'description', label: 'Description', icon: ChatBubbleLeftRightIcon },
                  { id: 'specifications', label: 'Specifications', icon: BoltIcon },
                  { id: 'reviews', label: 'Reviews', icon: StarIcon },
                  { id: 'shipping', label: 'Shipping & Returns', icon: TruckIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">{product.description}</p>
                      {product.features && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 text-xl">Product Features</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-3 text-gray-700">
                                <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications || {
                        'Brand': product.brand,
                        'Category': product.category,
                        'SKU': product.sku || 'N/A',
                        'Weight': product.weight || 'N/A',
                        'Dimensions': product.dimensions || 'N/A',
                        'Material': product.material || 'N/A'
                      }).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                          <span className="font-medium text-gray-700">{key}</span>
                          <span className="text-gray-600 text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                          <div className="flex items-center justify-center mb-2">
                            {renderStars(product.rating)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Based on {product.reviewCount} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Write a Review
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Sample Reviews */}
                        {[
                          { name: 'Sarah Johnson', rating: 5, comment: 'Absolutely love this product! Exceeded my expectations.', date: '2 days ago' },
                          { name: 'Mike Chen', rating: 4, comment: 'Great quality and fast shipping. Would recommend!', date: '1 week ago' },
                          { name: 'Emily Davis', rating: 5, comment: 'Perfect for my needs. The quality is outstanding.', date: '2 weeks ago' }
                        ].map((review, index) => (
                          <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-semibold text-gray-900">{review.name}</div>
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg">Shipping Information</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <TruckIcon className="w-5 h-5 text-blue-500" />
                            Free standard shipping on orders over $50
                          </li>
                          <li className="flex items-center gap-2">
                            <BoltIcon className="w-5 h-5 text-blue-500" />
                            Express shipping available for $9.99
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckIcon className="w-5 h-5 text-blue-500" />
                            Usually ships within 1-2 business days
                          </li>
                        </ul>
                      </div>
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg">Return Policy</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <ArrowPathIcon className="w-5 h-5 text-green-500" />
                            30-day hassle-free return policy
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckIcon className="w-5 h-5 text-green-500" />
                            Items must be in original condition
                          </li>
                          <li className="flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                            Free return shipping on defective items
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <AdvancedProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;