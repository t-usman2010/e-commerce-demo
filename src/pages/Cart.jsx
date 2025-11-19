import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const { state, actions } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      actions.removeFromCart(productId);
    } else {
      actions.updateCartQuantity(productId, newQuantity);
    }
  };

  const calculateTax = (subtotal) => subtotal * 0.1;
  const calculateShipping = (subtotal) => subtotal > 50 ? 0 : 9.99;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const promos = {
      'SAVE10': 0.1,
      'WELCOME15': 0.15,
      'FREESHIP': 'free-shipping'
    };

    const discount = promos[promoCode.toUpperCase()];
    if (discount) {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount });
    } else {
      // Handle invalid promo code
      alert('Invalid promo code');
    }
    setIsApplyingPromo(false);
  };

  const getDiscountAmount = (subtotal) => {
    if (!appliedPromo) return 0;
    
    if (typeof appliedPromo.discount === 'number') {
      return subtotal * appliedPromo.discount;
    }
    return 0;
  };

  const subtotal = state.cart.total;
  const discount = getDiscountAmount(subtotal);
  const tax = calculateTax(subtotal - discount);
  const shipping = appliedPromo?.discount === 'free-shipping' ? 0 : calculateShipping(subtotal - discount);
  const total = subtotal - discount + tax + shipping;

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading your cart..." />
      </div>
    );
  }

  if (state.cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-gray-100"
          >
            <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Your cart is empty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Discover our products and find something you love
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </Link>
            <Link
              to="/categories"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              Browse Categories
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {state.cart.itemCount} {state.cart.itemCount === 1 ? 'item' : 'items'}
            </span>
            <button
              onClick={() => actions.clearCart()}
              className="text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {state.cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: index * 0.1
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 last:mb-0 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-6">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-1">{item.brand}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">${item.price}</p>
                      
                      {/* Stock status */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className={`w-4 h-4 ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-700'}`} />
                        </button>
                        <span className="w-12 text-center py-1 font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => actions.removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 mt-2 transition-colors flex items-center gap-1 text-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.cart.itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isApplyingPromo}
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isApplyingPromo ? <LoadingSpinner size="small" /> : 'Apply'}
                  </button>
                </div>
                {appliedPromo && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm mt-2"
                  >
                    Promo code {appliedPromo.code} applied successfully!
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-center block shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-green-500" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                  <span>Secure checkout & buyer protection</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;