import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ShoppingBagIcon,
  TagIcon,
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
  const menuRef = useRef(null);

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

  // Close search and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSearchOpen]);

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
  const isLoggedIn = state.user !== null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`bg-white sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-sm'
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="font-medium text-xs sm:text-sm">🎉 Summer Sale: Up to 50% off!</span>
          <Link to="/deals" className="underline font-semibold hover:text-blue-200 transition-colors text-xs sm:text-sm">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-14 sm:h-16 w-full">
          {/* Left Section: Logo and Mobile Menu Button */}
          <div className="flex items-center flex-1 sm:flex-none">
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0 mobile-menu-button mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </motion.button>

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 min-w-0">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-lg">SE</span>
                </div>
                <div className="ml-2 sm:ml-3 min-w-0">
                  <span className="text-lg sm:text-2xl font-bold text-gray-900 block truncate">ShopEase</span>
                  <span className="hidden sm:block text-xs text-gray-500 -mt-1">Premium Shopping</span>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 flex-shrink-0 mx-4">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
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
          <div className="hidden lg:flex flex-1 max-w-lg mx-4 xl:mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
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
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Mobile Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </motion.button>

            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors relative"
              >
                {wishlistCount > 0 ? (
                  <HeartSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px]"
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
                  <ShoppingCartSolid className="h-5 w-5 text-blue-600" />
                ) : (
                  <ShoppingCartIcon className="h-5 w-5" />
                )}
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[10px]"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-14 sm:top-16"
                onClick={() => setIsSearchOpen(false)}
              />
              
              {/* Search Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute right-0 right-0 top-14 sm:top-16 bg-white border-b border-gray-200 shadow-lg z-50 w-full"
                ref={searchRef}
              >
                <div className="p-4 w-full">
                  <form onSubmit={handleSearch} className="relative w-full mb-3">
                    <div className="relative w-full">
                      <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                      >
                        Search
                      </button>
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
            </>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 top-14 sm:top-16"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="lg:hidden fixed right-0 top-14 sm:top-16 bottom-0 bg-white shadow-xl z-50 w-80 max-w-[85vw] overflow-y-auto"
                ref={menuRef}
              >
                <div className="p-4 w-full">
                  {/* User Section */}
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <UserMenu mobile onLinkClick={() => setIsMenuOpen(false)} />
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-2 w-full mb-6">
                    {navigation.map((item) => {
                      const isActive = isActiveLink(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all w-full ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 border border-blue-100'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Link
                      to="/wishlist"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors w-full text-base border border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <HeartIcon className="w-5 h-5 flex-shrink-0" />
                        <span>My Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                          {wishlistCount > 9 ? '9+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                    
                    <Link
                      to="/cart"
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors w-full text-base border border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCartIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Shopping Cart</span>
                      </div>
                      {cartItemCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                          {cartItemCount > 9 ? '9+' : cartItemCount}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Help Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                      to="/help"
                      className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <QuestionMarkCircleIcon className="w-5 h-5" />
                      <span>Help & Support</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;