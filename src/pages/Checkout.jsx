import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon,
  TruckIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveInfo: false,
    shippingMethod: 'standard'
  });

  const calculateTax = (subtotal) => subtotal * 0.1;
  const calculateShipping = (method) => {
    const methods = {
      standard: 4.99,
      express: 9.99,
      overnight: 19.99
    };
    return state.cart.total > 50 && method === 'standard' ? 0 : methods[method];
  };

  const subtotal = state.cart.total;
  const shipping = calculateShipping(formData.shippingMethod);
  const tax = calculateTax(subtotal);
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    actions.addNotification({
      type: 'success',
      title: 'Order Confirmed!',
      message: 'Your order has been placed successfully. You will receive a confirmation email shortly.'
    });
    actions.clearCart();
    navigate('/order-confirmation');
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => setActiveStep(activeStep - 1);

  const validateStep = (step) => {
    // Basic validation for each step
    switch (step) {
      case 1:
        return formData.email && formData.firstName && formData.lastName && formData.address && formData.city && formData.zipCode;
      case 2:
        return formData.cardNumber && formData.expiryDate && formData.cvv && formData.nameOnCard;
      default:
        return true;
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: TruckIcon },
    { id: 2, name: 'Payment', icon: CreditCardIcon },
    { id: 3, name: 'Review', icon: CheckBadgeIcon }
  ];

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading checkout..." />
      </div>
    );
  }

  if (state.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TruckIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/cart"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-2 text-gray-600">
              <LockClosedIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    activeStep > step.id 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : activeStep === step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {activeStep > step.id ? (
                      <CheckBadgeIcon className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    activeStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
                    activeStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {activeStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <UserIcon className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPinIcon className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', name: 'Standard Shipping', price: 4.99, freeThreshold: 50, days: '3-5 business days' },
                        { id: 'express', name: 'Express Shipping', price: 9.99, days: '2-3 business days' },
                        { id: 'overnight', name: 'Overnight Shipping', price: 19.99, days: '1 business day' }
                      ].map((method) => (
                        <label key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={formData.shippingMethod === method.id}
                              onChange={handleInputChange}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.days}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              {state.cart.total > method.freeThreshold ? 'FREE' : `$${method.price}`}
                            </div>
                            {method.freeThreshold && (
                              <div className="text-sm text-gray-600">
                                Free on orders over ${method.freeThreshold}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {activeStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCardIcon className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <label className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Save payment information for next time</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {activeStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckBadgeIcon className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            {formData.firstName} {formData.lastName}<br />
                            {formData.address}<br />
                            {formData.apartment && `${formData.apartment}<br />`}
                            {formData.city}, {formData.state} {formData.zipCode}<br />
                            {formData.country}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">{formData.email}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">
                            **** **** **** {formData.cardNumber.slice(-4)}<br />
                            Expires: {formData.expiryDate}<br />
                            {formData.nameOnCard}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Shipping Method</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 capitalize">
                            {formData.shippingMethod} Shipping
                            {formData.shippingMethod === 'standard' && state.cart.total > 50 && ' (FREE)'}
                          </p>
                        </div>
                      </div>

                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          required
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I agree to the{' '}
                          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                            Terms of Service
                          </button>{' '}
                          and{' '}
                          <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                            Privacy Policy
                          </button>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back to Payment
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <LoadingSpinner size="small" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.cart.itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-sm">Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LockClosedIcon className="w-5 h-5" />
                    <span className="text-sm">Encrypted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;