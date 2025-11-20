import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ChevronDownIcon,
  CogIcon,
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { state, actions } = useApp();

  const handleLogin = (userData) => {
    actions.setUser(userData);
    setShowLogin(false);
    actions.addNotification({
      type: 'success',
      title: 'Welcome back!',
      message: `Hello ${userData.name}, you've successfully logged in.`
    });
  };

  const handleRegister = (userData) => {
    actions.setUser(userData);
    setShowRegister(false);
    actions.addNotification({
      type: 'success',
      title: 'Account created!',
      message: `Welcome ${userData.name}, your account has been created successfully.`
    });
  };

  const handleLogout = () => {
    actions.setUser(null);
    setIsOpen(false);
    actions.addNotification({
      type: 'info',
      title: 'Logged out',
      message: 'You have been successfully logged out.'
    });
  };

  // Safe user data access
  const getUserInitials = () => {
    if (!state.user || !state.user.name) return 'U';
    return state.user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserName = () => {
    return state.user?.name || 'User';
  };

  const getUserEmail = () => {
    return state.user?.email || '';
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="relative user-menu-container">
        {state.user ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={isOpen}
          >
            {/* Mobile: Show only avatar on very small screens */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
            
            {/* Show name on medium screens and up */}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {getUserName()}
            </span>
            
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-600`} 
            />
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Sign in"
          >
            <UserIcon className="h-6 w-6" />
            <span className="hidden sm:block text-sm font-medium">Sign In</span>
          </button>
        )}

        {/* Dropdown Menu - Responsive */}
        {isOpen && state.user && (
          <>
            {/* Mobile Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Container */}
            <div className="
              absolute right-0 top-full mt-2 
              w-80 max-w-[90vw] 
              bg-white rounded-lg shadow-xl border border-gray-200 
              z-50
              md:w-64
              animate-in slide-in-from-top-2 duration-200
            ">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
                <h3 className="font-semibold text-gray-900">Account Menu</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="font-medium text-gray-900 truncate">{getUserName()}</div>
                <div className="text-sm text-gray-500 truncate">{getUserEmail()}</div>
              </div>

              {/* Menu Items */}
              <div className="py-2 max-h-96 overflow-y-auto">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">My Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <HeartIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">My Wishlist</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <CogIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">Settings</span>
                </Link>
              </div>

              {/* Logout Section */}
              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Auth Modals - Ensure they're mobile responsive too */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
};

export default UserMenu;