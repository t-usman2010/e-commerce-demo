import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  cart: {
    items: [],
    total: 0,
    itemCount: 0
  },
  wishlist: [],
  products: [],
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    onSale: false,
    brands: []
  },
  sort: 'featured',
  searchQuery: '',
  isLoading: false,
  notifications: []
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_WISHLIST: 'TOGGLE_WISHLIST',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_SORT: 'UPDATE_SORT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_USER: 'SET_USER'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTION_TYPES.SET_PRODUCTS:
      return { ...state, products: action.payload };

    case ACTION_TYPES.SET_CATEGORIES:
      return { ...state, categories: action.payload };

    case ACTION_TYPES.ADD_TO_CART:
      const existingCartItem = state.cart.items.find(item => item.id === action.payload.id);
      let newCartItems;
      
      if (existingCartItem) {
        newCartItems = state.cart.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newCartItems = [...state.cart.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }

      return {
        ...state,
        cart: {
          items: newCartItems,
          total: calculateCartTotal(newCartItems),
          itemCount: calculateItemCount(newCartItems)
        }
      };

    case ACTION_TYPES.REMOVE_FROM_CART:
      const filteredItems = state.cart.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        cart: {
          items: filteredItems,
          total: calculateCartTotal(filteredItems),
          itemCount: calculateItemCount(filteredItems)
        }
      };

    case ACTION_TYPES.UPDATE_CART_QUANTITY:
      const updatedItems = state.cart.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        cart: {
          items: updatedItems,
          total: calculateCartTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        }
      };

    case ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
          itemCount: 0
        }
      };

    case ACTION_TYPES.TOGGLE_WISHLIST:
      const isInWishlist = state.wishlist.find(item => item.id === action.payload.id);
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter(item => item.id !== action.payload.id)
          : [...state.wishlist, action.payload]
      };

    case ACTION_TYPES.UPDATE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case ACTION_TYPES.UPDATE_SORT:
      return { ...state, sort: action.payload };

    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, { id: Date.now(), ...action.payload }]
      };

    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };

    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

// Helper functions
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// Context Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedUser = localStorage.getItem('user');

    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      dispatch({ type: ACTION_TYPES.ADD_TO_CART, payload: { items: cartData } });
    }

    if (savedWishlist) {
      dispatch({ type: ACTION_TYPES.TOGGLE_WISHLIST, payload: { items: JSON.parse(savedWishlist) } });
    }

    if (savedUser) {
      dispatch({ type: ACTION_TYPES.SET_USER, payload: JSON.parse(savedUser) });
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart.items));
  }, [state.cart.items]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setProducts: (products) => dispatch({ type: ACTION_TYPES.SET_PRODUCTS, payload: products }),
    setCategories: (categories) => dispatch({ type: ACTION_TYPES.SET_CATEGORIES, payload: categories }),
    addToCart: (product, quantity = 1) => {
      dispatch({ type: ACTION_TYPES.ADD_TO_CART, payload: { ...product, quantity } });
      actions.addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} has been added to your cart.`
      });
    },
    removeFromCart: (productId) => {
      dispatch({ type: ACTION_TYPES.REMOVE_FROM_CART, payload: productId });
      actions.addNotification({
        type: 'info',
        title: 'Removed from Cart',
        message: 'Item has been removed from your cart.'
      });
    },
    updateCartQuantity: (productId, quantity) => 
      dispatch({ type: ACTION_TYPES.UPDATE_CART_QUANTITY, payload: { id: productId, quantity } }),
    clearCart: () => dispatch({ type: ACTION_TYPES.CLEAR_CART }),
    toggleWishlist: (product) => {
      const isAdding = !state.wishlist.find(item => item.id === product.id);
      dispatch({ type: ACTION_TYPES.TOGGLE_WISHLIST, payload: product });
      actions.addNotification({
        type: 'success',
        title: isAdding ? 'Added to Wishlist' : 'Removed from Wishlist',
        message: isAdding 
          ? `${product.name} has been added to your wishlist.`
          : `${product.name} has been removed from your wishlist.`
      });
    },
    updateFilters: (filters) => dispatch({ type: ACTION_TYPES.UPDATE_FILTERS, payload: filters }),
    updateSort: (sort) => dispatch({ type: ACTION_TYPES.UPDATE_SORT, payload: sort }),
    setSearchQuery: (query) => dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query }),
    addNotification: (notification) => dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification }),
    removeNotification: (id) => dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id }),
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user })
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      actions.setLoading(true);
      try {
        // Simulate API calls
        const products = await mockProductsAPI();
        const categories = await mockCategoriesAPI();
        actions.setProducts(products);
        actions.setCategories(categories);
      } catch (error) {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load products.'
        });
      } finally {
        actions.setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (notification.autoHide !== false) {
        setTimeout(() => {
          actions.removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Mock APIs
const mockProductsAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Wireless Bluetooth Headphones with Noise Cancellation",
          price: 129.99,
          originalPrice: 199.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
          ],
          rating: 4.5,
          reviewCount: 128,
          category: "electronics",
          brand: "AudioTech",
          inStock: true,
          isNew: true,
          features: ["Noise Cancellation", "30hr Battery", "Quick Charge", "Voice Assistant"],
          description: "Premium wireless headphones with active noise cancellation for immersive sound experience.",
          specifications: {
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.0",
            "Weight": "250g",
            "Color": "Black"
          },
          tags: ["wireless", "noise-cancelling", "premium", "bluetooth"]
        },
        {
          id: 2,
          name: "Smart Fitness Watch with Heart Rate Monitor",
          price: 249.99,
          originalPrice: 299.99,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=800&fit=crop",
          ],
          rating: 4.8,
          reviewCount: 89,
          category: "electronics",
          brand: "FitTech",
          inStock: true,
          isNew: false,
          features: ["Heart Rate Monitor", "GPS", "Water Resistant", "Sleep Tracking"],
          description: "Advanced smartwatch with comprehensive health and fitness tracking features.",
          specifications: {
            "Battery Life": "7 days",
            "Display": "1.4\" AMOLED",
            "Water Resistance": "50m",
            "Connectivity": "Bluetooth 5.2"
          },
          tags: ["fitness", "smartwatch", "health", "tracking"]
        },
        {
          id: 3,
          name: "Premium Coffee Maker with Grinder",
          price: 179.99,
          originalPrice: 229.99,
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop",
          ],
          rating: 4.3,
          reviewCount: 64,
          category: "home",
          brand: "BrewMaster",
          inStock: true,
          isNew: true,
          features: ["Built-in Grinder", "Programmable", "Thermal Carafe", "Strength Control"],
          description: "Professional-grade coffee maker with integrated grinder for the freshest coffee experience.",
          specifications: {
            "Capacity": "12 cups",
            "Grinder Type": "Burr",
            "Programmable": "Yes",
            "Warranty": "2 years"
          },
          tags: ["coffee", "kitchen", "appliance", "premium"]
        },
        {
          id: 4,
          name: "Wireless Charging Pad - Fast Charge",
          price: 39.99,
          originalPrice: 59.99,
          image: "https://images.unsplash.com/photo-1609592810794-1c0d49c81c6c?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1609592810794-1c0d49c81c6c?w=800&h=800&fit=crop",
          ],
          rating: 4.2,
          reviewCount: 156,
          category: "electronics",
          brand: "ChargeTech",
          inStock: false,
          isNew: false,
          features: ["Fast Charging", "Multi-Device", "LED Indicator", "Non-slip Surface"],
          description: "High-speed wireless charging pad compatible with all Qi-enabled devices.",
          specifications: {
            "Output": "15W",
            "Compatibility": "Qi-enabled",
            "Cable Length": "1.5m",
            "Color": "White"
          },
          tags: ["charging", "wireless", "fast-charge", "accessory"]
        },
        {
          id: 5,
          name: "Professional DSLR Camera Bundle",
          price: 899.99,
          originalPrice: 1199.99,
          image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop",
          ],
          rating: 4.7,
          reviewCount: 203,
          category: "electronics",
          brand: "PhotoPro",
          inStock: true,
          isNew: false,
          features: ["24MP Sensor", "4K Video", "Wi-Fi Connectivity", "Kit Lens Included"],
          description: "Professional DSLR camera perfect for photography enthusiasts and professionals.",
          specifications: {
            "Sensor": "24.2MP APS-C",
            "Video": "4K UHD",
            "ISO Range": "100-25600",
            "Display": "3.0\" Vari-angle"
          },
          tags: ["camera", "photography", "dslr", "professional"]
        },
        {
          id: 6,
          name: "Ergonomic Office Chair",
          price: 299.99,
          originalPrice: 399.99,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
          ],
          rating: 4.4,
          reviewCount: 87,
          category: "home",
          brand: "ComfortSeat",
          inStock: true,
          isNew: true,
          features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh", "Swivel Base"],
          description: "Ergonomic office chair designed for maximum comfort during long working hours.",
          specifications: {
            "Weight Capacity": "300 lbs",
            "Adjustments": "Seat height, armrests, tilt",
            "Material": "Mesh & Nylon",
            "Warranty": "5 years"
          },
          tags: ["office", "chair", "ergonomic", "comfort"]
        }
      ]);
    }, 1000);
  });
};

const mockCategoriesAPI = () => {
  return Promise.resolve([
    { id: 'electronics', name: 'Electronics', count: 45, image: '📱' },
    { id: 'fashion', name: 'Fashion', count: 89, image: '👕' },
    { id: 'home', name: 'Home & Garden', count: 67, image: '🏠' },
    { id: 'sports', name: 'Sports', count: 34, image: '⚽' },
    { id: 'beauty', name: 'Beauty', count: 56, image: '💄' },
  ]);
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};