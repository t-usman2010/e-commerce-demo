import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  TagIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import AdvancedProductCard from '../components/AdvancedProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { state } = useApp();

  const featuredProducts = state.products.slice(0, 4);
  const trendingProducts = state.products.slice(2, 6);
  const newArrivals = state.products.slice(4, 8);

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      count: "245 products",
      href: "/products?category=electronics",
      icon: "💻"
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      count: "189 products",
      href: "/products?category=fashion",
      icon: "👕"
    },
    {
      name: "Home & Garden",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      count: "156 products",
      href: "/products?category=home",
      icon: "🏠"
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      count: "98 products",
      href: "/products?category=sports",
      icon: "⚽"
    },
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Brand Partners' },
    { value: '24/7', label: 'Customer Support' },
    { value: '99%', label: 'Satisfaction Rate' }
  ];

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

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading home..." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Summer Collection 2024
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Discover Your
                <motion.span 
                  className="block text-blue-600"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  Perfect Style
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed"
              >
                Explore our curated collection of premium products. From fashion to electronics, 
                find everything you need with quality you can trust.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Shop Now
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Browse Categories
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop"
                  alt="Fashion"
                  className="rounded-2xl shadow-lg"
                />
                <motion.img
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
                  alt="Electronics"
                  className="rounded-2xl shadow-lg mt-8"
                />
              </div>
              
              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TagIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Summer Sale</div>
                    <div className="text-sm text-gray-600">Up to 50% off</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our carefully curated categories and find exactly what you're looking for
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Link to={category.href}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group-hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                        {category.icon}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.count}</p>
                      <div className="flex items-center text-blue-600 mt-3 group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Featured Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Handpicked selection of our most popular and high-quality products
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {featuredProducts.map((product) => (
              <AdvancedProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              View All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-4">
              <FireIcon className="w-4 h-4 mr-2" />
              Trending Now
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hot & Trending
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover what everyone's talking about this season
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingProducts.map((product) => (
              <AdvancedProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We're committed to providing the best shopping experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TruckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Free Shipping</h3>
              <p className="text-gray-600">
                Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ArrowPathIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Returns</h3>
              <p className="text-gray-600">
                30-day hassle-free return policy. Your satisfaction is our priority.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payment</h3>
              <p className="text-gray-600">
                Your payment information is encrypted and secure. Shop with confidence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover why we're the preferred choice for online shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Start Shopping
                <ShoppingBagIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;