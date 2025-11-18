import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Categories = () => {
  const { state } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="text-center mb-12">
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Shop by Category
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Explore our wide range of categories and discover amazing products
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {state.categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/products?category=${category.id}`}>
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center">
                <span className="text-6xl">{category.image}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-blue-100">{category.count} products</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={itemVariants}
        className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold mb-2">{state.products.length}+</div>
            <div className="text-blue-100">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{state.categories.length}+</div>
            <div className="text-blue-100">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Categories;