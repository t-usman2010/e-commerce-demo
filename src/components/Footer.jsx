import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // Simulate API call
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

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

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const customerService = [
    { name: 'Shipping Information', path: '/shipping' },
    { name: 'Returns & Exchanges', path: '/returns' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Care Instructions', path: '/care' },
    { name: 'Track Your Order', path: '/track-order' }
  ];

  const company = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Affiliate Program', path: '/affiliate' }
  ];

  const policies = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Accessibility', path: '/accessibility' },
    { name: 'Sitemap', path: '/sitemap' }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PayPal', icon: '🔵' },
    { name: 'Apple Pay', icon: '' },
    { name: 'Google Pay', icon: 'G' },
    { name: 'Amazon Pay', icon: '⎈' }
  ];

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-gray-900 text-white"
    >
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Free Shipping</div>
                <div className="text-xs text-gray-400">On orders over $50</div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <ArrowPathIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Easy Returns</div>
                <div className="text-xs text-gray-400">30-day policy</div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Secure Payment</div>
                <div className="text-xs text-gray-400">Protected by encryption</div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">24/7 Support</div>
                <div className="text-xs text-gray-400">Customer service</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SE</span>
              </div>
              <span className="ml-3 text-2xl font-bold">ShopEase</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for quality products and exceptional shopping experiences. 
              We're committed to bringing you the best prices with outstanding customer service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm">123 Commerce Street, City, State 12345</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <PhoneIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <EnvelopeIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm">support@shopease.com</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Shop</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Subscribe to get special offers, free giveaways, and exclusive deals delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
                  required
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubscribed}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isSubscribed
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubscribed ? 'Subscribed! 🎉' : 'Subscribe'}
              </motion.button>
            </form>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Follow Us</h4>
              <div className="flex space-x-3">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <motion.a
                    key={social}
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                    aria-label={social}
                  >
                    <span className="text-sm font-medium">{social[0]}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-sm text-center md:text-left"
            >
              © 2024 ShopEase. All rights reserved.
            </motion.p>

            {/* Policy Links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              {policies.map((policy) => (
                <Link
                  key={policy.name}
                  to={policy.path}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {policy.name}
                </Link>
              ))}
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-3"
            >
              <span className="text-sm text-gray-400 mr-2">We accept:</span>
              <div className="flex space-x-2">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-8 h-6 bg-gray-800 rounded text-xs flex items-center justify-center"
                    title={method.name}
                  >
                    {method.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;