import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '',
  variant = 'primary',
  text = '',
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'border-gray-200 border-t-blue-600',
    secondary: 'border-gray-200 border-t-gray-600',
    accent: 'border-gray-200 border-t-orange-500',
    success: 'border-gray-200 border-t-green-500',
    error: 'border-gray-200 border-t-red-500',
    white: 'border-gray-300 border-t-white'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
    xl: 'text-lg'
  };

  const spinner = (
    <motion.div
      className={`inline-flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`${sizeClasses[size]} border-4 ${variantClasses[variant]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          borderTopColor: 'currentColor'
        }}
      />
      {text && (
        <motion.span 
          className={`mt-2 ${textSizes[size]} text-gray-600 font-medium`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <motion.div
        className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          {spinner}
        </div>
      </motion.div>
    );
  }

  return spinner;
};

// Additional specialized loading components
export const PageLoader = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="large" variant="primary" text={text} />
  </div>
);

export const SectionLoader = ({ text = "Loading content..." }) => (
  <div className="py-12 flex items-center justify-center">
    <LoadingSpinner size="medium" variant="primary" text={text} />
  </div>
);

export const InlineLoader = () => (
  <LoadingSpinner size="small" variant="primary" />
);

export default LoadingSpinner;