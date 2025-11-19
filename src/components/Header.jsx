import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  TagIcon,
  PhoneIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { 
  ShoppingCartIcon as ShoppingCartSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SearchSuggestions from './SearchSuggestions';
import UserMenu from './UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const navigation = [
    { name: 'Home', href: '/', icon: ShoppingBagIcon },
    { name: 'Products', href: '/products', icon: TagIcon },
    { name: 'Categories', href: '/categories', icon: ShoppingBagIcon },
    { name: 'Deals', href: '/deals', icon: TagIcon },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      actions.setSearchQuery(searchQuery);
      navigate('/products');
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    actions.setSearchQuery(suggestion);
    navigate('/products');
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    actions.setSearchQuery('');
    setShowSuggestions(false);
  };

  const popularSearches = ['Wireless Headphones', 'Smart Watch', 'Gaming Laptop', 'DSLR Camera', 'Running Shoes', 'Smartphone'];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const cartItemCount = state.cart.items.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-sm'
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <span className="font-medium">🎉 Summer Sale: Up to 50% off on selected items!</span>
          <Link to="/deals" className="underline font-semibold hover:text-blue-200 transition-colors">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SE</span>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold text-gray-900">ShopEase</span>
                <span className="block text-xs text-gray-500 -mt-1">Premium Shopping</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products, brands, and categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Search
                </motion.button>
              </div>
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <SearchSuggestions
                  query={searchQuery}
                  onSuggestionClick={handleSuggestionClick}
                  popularSearches={popularSearches}
                  onClose={() => setShowSuggestions(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </motion.button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors relative"
              >
                {wishlistCount > 0 ? (
                  <HeartSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Shopping Cart */}
            <Link to="/cart" className="relative flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors relative"
              >
                {cartItemCount > 0 ? (
                  <ShoppingCartSolid className="h-6 w-6 text-blue-600" />
                ) : (
                  <ShoppingCartIcon className="h-6 w-6" />
                )}
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-lg z-40"
              ref={searchRef}
            >
              <div className="p-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobile Search Suggestions */}
                <AnimatePresence>
                  {showSuggestions && (
                    <SearchSuggestions
                      query={searchQuery}
                      onSuggestionClick={handleSuggestionClick}
                      popularSearches={popularSearches}
                      onClose={() => {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }}
                      mobile
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden absolute left-0 right-0 top-16 bg-white border-b border-gray-200 shadow-lg z-30"
            >
              <div className="p-4">
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => {
                    const isActive = isActiveLink(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  {/* Mobile Account Links */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <Link
                      to="/wishlist"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <HeartIcon className="w-5 h-5" />
                        <span>Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    
                    <Link
                      to="/cart"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Shopping Cart</span>
                      </div>
                      {cartItemCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;