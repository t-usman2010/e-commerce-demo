import React, { useState } from 'react';
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login - in real app, you'd call your API
      onLogin({
        id: 1,
        name: 'John Doe',
        email: formData.email,
        avatar: 'JD',
        joinDate: '2024-01-15'
      });
      
      onClose();
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleForgotPassword = () => {
    // In a real app, this would open a forgot password modal or navigate to forgot password page
    console.log('Forgot password clicked');
  };

  const handleSocialLogin = (provider) => {
    // In a real app, this would handle social login
    console.log(`Social login with ${provider}`);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.75,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: -50,
      transition: {
        duration: 0.2
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Welcome Back</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Sign in to your account to continue
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-1">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Social Login Options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <motion.div
                  whileFocus="focus"
                  variants={inputVariants}
                  className={`relative rounded-xl border-2 transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 focus-within:border-blue-500 focus-within:bg-blue-50'
                  }`}
                >
                  <EnvelopeIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.email ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none focus:ring-0"
                    placeholder="your@email.com"
                  />
                </motion.div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm flex items-center gap-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.div
                  whileFocus="focus"
                  variants={inputVariants}
                  className={`relative rounded-xl border-2 transition-colors ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 focus-within:border-blue-500 focus-within:bg-blue-50'
                  }`}
                >
                  <LockClosedIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.password ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-transparent rounded-xl focus:outline-none focus:ring-0"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm flex items-center gap-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Remember Me & Submit */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-colors ${
                      formData.rememberMe 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {formData.rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-white absolute top-0.5 left-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember me for 30 days
                  </span>
                </label>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                  >
                    {errors.submit}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  } text-white flex items-center justify-center gap-3`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Signing In...
                    </>
                  ) : (
                    'Sign In to Your Account'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Create an account
                </button>
              </p>
              
              {/* Security Note */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheckIcon className="w-3 h-3" />
                  Your data is securely encrypted and protected
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;