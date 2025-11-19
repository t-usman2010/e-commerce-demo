import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationSystem from './components/NotificationSystem';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const ProductListing = React.lazy(() => import('./pages/ProductListing'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Categories = React.lazy(() => import('./pages/Categories'));

const AppContent = () => {
  const { state } = useApp();
  const location = useLocation();

  const pageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.98,
      y: 8
    },
    in: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    out: { 
      opacity: 0,
      scale: 1.02,
      y: -8
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.3
  };

  return (
    <div className="App min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="large" />
              </div>
            }
          >
            <Routes location={location} key={location.pathname}>
              <Route 
                path="/" 
                element={
                  <motion.div
                    key="home"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <Home />
                  </motion.div>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <motion.div
                    key="products"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <ProductListing />
                  </motion.div>
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <motion.div
                    key="product-detail"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <ProductDetail />
                  </motion.div>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <motion.div
                    key="cart"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <Cart />
                  </motion.div>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <motion.div
                    key="checkout"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <Checkout />
                  </motion.div>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <motion.div
                    key="wishlist"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <Wishlist />
                  </motion.div>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <motion.div
                    key="categories"
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="h-full"
                  >
                    <Categories />
                  </motion.div>
                } 
              />
              
            </Routes>
          </React.Suspense>
        </AnimatePresence>
      </main>

      <Footer />
      <NotificationSystem />
      
      {/* Global Loading Overlay */}
      {state.isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div className="text-center">
            <LoadingSpinner size="large" />
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-600 font-medium"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}

      {/* Mobile Navigation Spacer */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;