import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRightIcon,
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const { state } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.6
      }
    }
  };

  // Color palette for categories
  const categoryColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-amber-500'
  ];

  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of products across various categories. 
              Find exactly what you're looking for with our organized shopping experience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
        >
          {state.categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Link 
                to={`/products?category=${category.id}`}
                className="block h-full"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Category Image/Icon Area */}
                  <div className={`${getCategoryColor(index)} h-32 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10 text-white text-4xl">
                      {category.image}
                    </div>
                    <motion.div 
                      className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </motion.div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <ShoppingBagIcon className="w-4 h-4" />
                        {category.count} products
                      </span>
                      <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Shop now
                        <ChevronRightIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section - No Gradient */}
        <motion.div
          variants={statsVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Why Shop With Us
            </h2>
            <p className="text-gray-600">
              Trusted by thousands of customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Products Stat */}
            <motion.div 
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CubeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {state.products.length}+
              </div>
              <div className="text-gray-600 font-medium">
                Quality Products
              </div>
            </motion.div>

            {/* Categories Stat */}
            <motion.div 
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TagIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {state.categories.length}+
              </div>
              <div className="text-gray-600 font-medium">
                Categories
              </div>
            </motion.div>

            {/* Customers Stat */}
            <motion.div 
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                10K+
              </div>
              <div className="text-gray-600 font-medium">
                Happy Customers
              </div>
            </motion.div>

            {/* Satisfaction Stat */}
            <motion.div 
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                99%
              </div>
              <div className="text-gray-600 font-medium">
                Satisfaction
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Browse our complete product catalog or contact our support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              View All Products
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;