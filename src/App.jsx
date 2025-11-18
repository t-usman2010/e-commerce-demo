import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <React.Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Home />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/products" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductListing />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/product/:id" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductDetail />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/cart" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Cart />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Checkout />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/wishlist" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Wishlist />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/categories" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="large" />
          </div>
        )}
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;