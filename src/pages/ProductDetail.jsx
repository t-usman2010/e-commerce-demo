import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartOutline,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon
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

  const product = state.products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    actions.addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    actions.addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    actions.toggleWishlist(product);
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

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div>
          <div className="mb-4 rounded-2xl overflow-hidden bg-white p-4 shadow-lg">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {(product.images || [product.image]).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-300'
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
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
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

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {renderStars(product.rating)}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isInCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <TruckIcon className="w-5 h-5 text-green-500 mr-2" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span>2-year warranty</span>
              </div>
              <div className="flex items-center">
                {product.inStock ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                    <span>In stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-red-500 rounded-full mr-2"></div>
                    <span>Out of stock</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Product Details</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center mb-6">
                <div className="text-4xl font-bold mr-4">{product.rating}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {renderStars(product.rating)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {product.reviewCount} reviews
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="font-semibold">John Doe</div>
                    <div className="flex items-center ml-4">
                      {renderStars(5)}
                    </div>
                  </div>
                  <p className="text-gray-700">Excellent product! Highly recommended.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Shipping Information</h4>
                <p className="text-gray-700">Free standard shipping on orders over $50. Express shipping available.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Return Policy</h4>
                <p className="text-gray-700">30-day return policy. Items must be in original condition.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <AdvancedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetail;