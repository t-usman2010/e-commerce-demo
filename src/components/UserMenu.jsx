import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ChevronDownIcon,
  CogIcon,
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon
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

  return (
    <>
      <div className="relative">
        {state.user ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <UserIcon className="h-6 w-6" />
            <span className="hidden sm:block text-sm font-medium">Sign In</span>
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && state.user && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="font-medium text-gray-900">{getUserName()}</div>
              <div className="text-sm text-gray-500">{getUserEmail()}</div>
            </div>

            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-4 w-4 mr-3" />
                My Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBagIcon className="h-4 w-4 mr-3" />
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <HeartIcon className="h-4 w-4 mr-3" />
                My Wishlist
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <CogIcon className="h-4 w-4 mr-3" />
                Settings
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modals */}
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