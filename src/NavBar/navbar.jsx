import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Menu, X, ChevronDown, Search, ShoppingCart, Heart, Bell, ArrowLeft, Star, Sparkles, TrendingUp, Clock, Filter } from 'lucide-react';
import './Navbar.css';
import { useCart } from '/src/Cart/CartPage.jsx'

// Import all product page components
import InspirationalBookmarkPage from '../Products/Bookmarks/Inspirational.jsx';
import FloralBookmarksPage from '../Products/Bookmarks/Floral.jsx';
import RegularCardPage from '../Products/Cards/Regular.jsx';
import MiniCardPage from '../Products/Cards/Mini.jsx';
import SpidermanCrochetPage from '../Products/Crochet/spiderman.jsx'; 
import TulipCrochetPage from '../Products/Crochet/Tuplip.jsx'; 
import TulipKeychainPage from '../Products/Crochet/TulipKeychain.jsx'; 
import SunflowerPage from '../Products/Crochet/sunflower.jsx'; 
import WatercolorLetterPage from '../Products/Letters/Watercolor.jsx';
import VintageLetterPage from '../Products/Letters/Vintage.jsx';

const Navbar = ({ 
  onNavigate, 
  onProductPageState, 
  wishlistCount = 0, 
  notificationCount = 0,
  currentUser = null,
  isAuthenticated = false 
}) => {
  // Get cart count from context
  const { cartCount } = useCart();
  
  // Core navigation state
  const [currentView, setCurrentView] = useState('navbar');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState(['navbar']);
  
  // UI states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchFilter, setSearchFilter] = useState('all');
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Refs
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);
  const productsButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Enhanced product categories with comprehensive information
  const productCategories = useMemo(() => ({
    'Letters': {
      items: [
        { 
          name: 'Watercolor Letter', 
          price: '₹299', 
          originalPrice: '₹399', 
          discount: '25% OFF', 
          image: '/src/Products/Letters/Images/Watercolor.png', 
          component: 'WatercolorLetterPage',
          description: 'Beautiful watercolor-style personalized letters with artistic flair',
          rating: 4.8,
          reviews: 124,
          pageId: 'watercolor-letter',
          tags: ['watercolor', 'artistic', 'personalized', 'handmade'],
          deliveryTime: '3-5 days',
          isNew: false
        },
        { 
          name: 'Vintage Letter', 
          price: '₹349', 
          originalPrice: '₹449', 
          discount: '22% OFF', 
          image: '/src/Products/Letters/Images/Vintage.png', 
          component: 'VintageLetterPage',
          description: 'Classic vintage-style handwritten letters with timeless elegance',
          rating: 4.9,
          reviews: 89,
          pageId: 'vintage-letter',
          tags: ['vintage', 'classic', 'elegant', 'handwritten'],
          deliveryTime: '2-4 days',
          isNew: false
        },
        { 
          name: 'Matte Black Letter', 
          price: '₹279', 
          originalPrice: '₹349', 
          discount: '20% OFF', 
          image: '/src/Products/Letters/images/matteblack.jpg', 
          component: 'MatteBlackPage',
          description: 'Sophisticated matte black personalized letters with modern appeal',
          rating: 4.7,
          reviews: 67,
          pageId: 'matte-black-letter',
          tags: ['modern', 'sophisticated', 'matte', 'contemporary'],
          deliveryTime: '3-5 days',
          isNew: true
        }
      ],
      page: 'letters',
      icon: '✉️',
      customizable: true,
      trending: true,
      description: 'Personalized handwritten letters for special occasions'
    },
    'Cards': {
      items: [
        { 
          name: 'Mini Cards', 
          price: '₹149', 
          originalPrice: '₹199', 
          discount: '25% OFF', 
          image: '/src/Products/Cards/Images/Mini.png', 
          component: 'MiniCardPage',
          bestseller: true,
          description: 'Adorable mini cards perfect for sweet, short messages',
          rating: 4.9,
          reviews: 203,
          pageId: 'mini-card',
          tags: ['mini', 'cute', 'compact', 'sweet'],
          deliveryTime: '1-3 days',
          isNew: false
        },
        { 
          name: 'Regular Card', 
          price: '₹199', 
          originalPrice: '₹249', 
          discount: '20% OFF', 
          image: '/src/Products/Cards/Images/Regular.png', 
          component: 'RegularCardPage',
          description: 'Standard sized cards for heartfelt, detailed messages',
          rating: 4.8,
          reviews: 156,
          pageId: 'regular-card',
          tags: ['standard', 'heartfelt', 'detailed', 'classic'],
          deliveryTime: '1-3 days',
          isNew: false
        }
      ],
      page: 'cards',
      icon: '💌',
      customizable: true,
      description: 'Handcrafted greeting cards for every occasion'
    },
    'Crochet': {
      items: [
        { 
          name: 'Tulip', 
          price: '₹399', 
          originalPrice: '₹499', 
          discount: '20% OFF', 
          image: '/src/Products/Crochet/Images/tulip.png', 
          component: 'TulipCrochetPage',
          bestseller: true,
          description: 'Handcrafted crochet tulip flowers that never wilt',
          rating: 4.9,
          reviews: 178,
          pageId: 'tulip-crochet',
          tags: ['flowers', 'handmade', 'crochet', 'decoration'],
          deliveryTime: '5-7 days',
          isNew: false
        },
        { 
          name: 'Tulip Keychain', 
          price: '₹199', 
          originalPrice: '₹249', 
          discount: '20% OFF', 
          image: '/src/Products/Crochet/Images/tulip_keychain.png', 
          component: 'TulipKeychainPage',
          description: 'Cute tulip keychains to brighten your day',
          rating: 4.7,
          reviews: 92,
          pageId: 'tulip-keychain',
          tags: ['keychain', 'accessories', 'cute', 'portable'],
          deliveryTime: '3-5 days',
          isNew: false
        },
        { 
          name: 'Spider-Man Crochet', 
          price: '₹299', 
          originalPrice: '₹399', 
          discount: '25% OFF', 
          image: '/src/Products/Crochet/Images/Spiderman.png', 
          component: 'SpidermanCrochetPage',
          bestseller: true,
          description: 'Amazing Spider-Man crochet figures for superhero fans',
          rating: 4.8,
          reviews: 145,
          pageId: 'spiderman-crochet',
          tags: ['superhero', 'spiderman', 'collectible', 'gift'],
          deliveryTime: '5-7 days',
          isNew: false
        },
        { 
          name: 'Sunflower', 
          price: '₹449', 
          originalPrice: '₹549', 
          discount: '18% OFF', 
          image: '/Crochet/images/sunflower.jpg', 
          component: 'SunflowerPage',
          description: 'Bright and cheerful crochet sunflowers',
          rating: 4.6,
          reviews: 78,
          pageId: 'sunflower-crochet',
          tags: ['sunflower', 'bright', 'cheerful', 'decoration'],
          deliveryTime: '5-7 days',
          isNew: true
        }
      ],
      page: 'crochet',
      icon: '🧶',
      customizable: false,
      trending: true,
      description: 'Handmade crochet items crafted with love'
    },
    'Bookmarks': {
      items: [
        { 
          name: 'Floral Bookmarks', 
          price: '₹99', 
          originalPrice: '₹149', 
          discount: '33% OFF', 
          image: '/src/Products/Bookmarks/Images/Floral.png', 
          component: 'FloralBookmarksPage',
          bestseller: true,
          description: 'Beautiful floral designed bookmarks for book lovers',
          rating: 4.8,
          reviews: 267,
          pageId: 'floral-bookmarks',
          tags: ['floral', 'books', 'reading', 'elegant'],
          deliveryTime: '1-2 days',
          isNew: false
        },
        { 
          name: 'Inspirational Bookmarks', 
          price: '₹99', 
          originalPrice: '₹149', 
          discount: '33% OFF', 
          image: '/src/Products/Bookmarks/Images/Inspirational.png', 
          component: 'InspirationalBookmarkPage',
          description: 'Motivational quotes on elegant bookmarks',
          rating: 4.7,
          reviews: 198,
          pageId: 'inspirational-bookmarks',
          tags: ['inspirational', 'quotes', 'motivation', 'reading'],
          deliveryTime: '1-2 days',
          isNew: false
        }
      ],
      page: 'bookmarks',
      icon: '🔖',
      customizable: true,
      description: 'Artistic bookmarks for avid readers'
    },
    'Hampers': {
      items: [
        { 
          name: 'Birthday', 
          price: '₹899', 
          originalPrice: '₹1199', 
          discount: '25% OFF', 
          image: '/Hampers/images/birthday.jpg', 
          component: 'BirthdayHamperPage',
          description: 'Complete birthday celebration hamper with surprises',
          rating: 4.9,
          reviews: 89,
          pageId: 'birthday-hamper',
          tags: ['birthday', 'celebration', 'gift', 'hamper'],
          deliveryTime: '2-4 days',
          isNew: false
        },
        { 
          name: 'Christmas', 
          price: '₹1299', 
          originalPrice: '₹1599', 
          discount: '19% OFF', 
          image: '/Hampers/images/christmass.jpg', 
          component: 'ChristmasHamperPage',
          bestseller: true,
          description: 'Festive Christmas celebration hamper with holiday magic',
          rating: 4.9,
          reviews: 123,
          pageId: 'christmas-hamper',
          tags: ['christmas', 'festive', 'holiday', 'seasonal'],
          deliveryTime: '3-5 days',
          isNew: false
        },
        { 
          name: 'Diwali', 
          price: '₹999', 
          originalPrice: '₹1299', 
          discount: '23% OFF', 
          image: '/Hampers/images/diwali.jpg', 
          component: 'DiwaliHamperPage',
          description: 'Traditional Diwali celebration hamper with lights and sweets',
          rating: 4.8,
          reviews: 76,
          pageId: 'diwali-hamper',
          tags: ['diwali', 'traditional', 'festival', 'lights'],
          deliveryTime: '2-4 days',
          isNew: false
        },
        { 
          name: 'Rakshabandhan', 
          price: '₹799', 
          originalPrice: '₹999', 
          discount: '20% OFF', 
          image: '/Hampers/images/rakshabandhan.jpg', 
          component: 'RakshabandhanHamperPage',
          description: 'Special sibling bond celebration hamper',
          rating: 4.7,
          reviews: 54,
          pageId: 'rakshabandhan-hamper',
          tags: ['rakshabandhan', 'siblings', 'bond', 'tradition'],
          deliveryTime: '2-4 days',
          isNew: false
        }
      ],
      page: 'hampers',
      icon: '🎁',
      customizable: true,
      trending: true,
      description: 'Curated gift hampers for special occasions'
    },
    'Extras': {
      items: [
        { 
          name: 'Glass Bottle', 
          price: '₹149', 
          originalPrice: '₹199', 
          discount: '25% OFF', 
          image: '/Decorative/images/glassbottle.jpg', 
          component: 'GlassBottleAddonPage',
          description: 'Elegant glass bottle add-on for special presentations',
          rating: 4.6,
          reviews: 43,
          pageId: 'glass-bottle-addon',
          tags: ['addon', 'elegant', 'presentation', 'glass'],
          deliveryTime: '1-2 days',
          isNew: false
        },
        { 
          name: 'Subtle Packaging', 
          price: '₹99', 
          originalPrice: '₹149', 
          discount: '33% OFF', 
          image: '/src/Products/Decorative/Images/packaging.png', 
          component: 'PackagingAddonPage',
          description: 'Premium subtle packaging option for gifts',
          rating: 4.8,
          reviews: 167,
          pageId: 'packaging-addon',
          tags: ['packaging', 'premium', 'gift', 'presentation'],
          deliveryTime: '1 day',
          isNew: false
        }
      ],
      page: 'extras',
      icon: '✨',
      customizable: true,
      description: 'Add-ons to make your gifts extra special'
    }
  }), []);

  // Memoized all products for search functionality
  const allProducts = useMemo(() => {
    const products = [];
    Object.entries(productCategories).forEach(([categoryName, category]) => {
      category.items.forEach(item => {
        products.push({
          ...item,
          category: categoryName,
          categoryInfo: category
        });
      });
    });
    return products;
  }, [productCategories]);

  // Get featured/trending products
  const featuredProducts = useMemo(() => {
    return allProducts.filter(product => 
      product.bestseller || product.isNew || product.categoryInfo.trending
    ).slice(0, 6);
  }, [allProducts]);

  // Search filters
  const searchFilters = [
    { id: 'all', label: 'All Products', count: allProducts.length },
    { id: 'bestseller', label: 'Bestsellers', count: allProducts.filter(p => p.bestseller).length },
    { id: 'new', label: 'New Arrivals', count: allProducts.filter(p => p.isNew).length },
    { id: 'trending', label: 'Trending', count: allProducts.filter(p => p.categoryInfo.trending).length },
  ];

  // Filter products based on search filter
  const getFilteredProducts = useCallback((products) => {
    switch (searchFilter) {
      case 'bestseller':
        return products.filter(p => p.bestseller);
      case 'new':
        return products.filter(p => p.isNew);
      case 'trending':
        return products.filter(p => p.categoryInfo.trending);
      default:
        return products;
    }
  }, [searchFilter]);

  // Find product by name with fuzzy matching
  const findProductByName = useCallback((productName) => {
    const searchTerm = productName.toLowerCase();
    return allProducts.find(product => {
      const productNameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
      
      return productNameMatch || categoryMatch || tagMatch || descriptionMatch;
    });
  }, [allProducts]);

  // Enhanced navigation function with history tracking
  const navigateToProductPage = useCallback((product) => {
    console.log(`Opening product page: ${product.name}`);
    setIsLoading(true);
    
    // Close search and reset search state completely
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);
    
    // Add to navigation history
    setNavigationHistory(prev => [...prev, product.pageId || product.name]);
    
    setSelectedProduct(product);
    setShowBackButton(true);
    
    // Notify App that we're showing a product page
    onProductPageState?.(true);
    
    // Set the current view to the specific product page using pageId
    if (product.pageId) {
      setCurrentView(product.pageId);
    } else {
      // Fallback to the old naming logic
      const productName = product.name.toLowerCase();
      
      if (productName.includes('inspirational') && productName.includes('bookmark')) {
        setCurrentView('inspirational-bookmarks');
      } else if (productName.includes('floral') && productName.includes('bookmark')) {
        setCurrentView('floral-bookmarks');
      } else if (productName.includes('regular') && productName.includes('card')) {
        setCurrentView('regular-card');
      } else if (productName.includes('mini') && productName.includes('card')) {
        setCurrentView('mini-card');
      } else if (productName.includes('spider') || productName.includes('spiderman')) {
        setCurrentView('spiderman-crochet');
      } else if (productName === 'tulip' || (productName.includes('tulip') && !productName.includes('keychain'))) {
        setCurrentView('tulip-crochet');
      } else if (productName.includes('tulip') && productName.includes('keychain')) {
        setCurrentView('tulip-keychain');
      } else if (productName.includes('sunflower')) { 
        setCurrentView('sunflower-crochet');
      } else if (productName.includes('watercolor') && productName.includes('letter')) { 
        setCurrentView('watercolor-letter');
      } else if (productName.includes('vintage') && productName.includes('letter')) { 
        setCurrentView('vintage-letter');
      } else {
        // For products without specific pages, navigate to products showcase
        console.log(`Specific page for ${product.name} not implemented yet, navigating to products showcase`);
        setCurrentView('navbar');
        setShowBackButton(false);
        onProductPageState?.(false);
        onNavigate?.('products', { product: product.name });
        setIsLoading(false);
        return;
      }
    }
    
    // Close all menus
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate loading time for better UX
    setTimeout(() => setIsLoading(false), 300);
  }, [onNavigate, onProductPageState]);

  // Enhanced back to navbar function with complete state reset
  const handleBackToNavbar = useCallback(() => {
    setIsLoading(true);
    
    // Complete state reset
    setCurrentView('navbar');
    setSelectedProduct(null);
    setShowBackButton(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);
    setSearchFilter('all');
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setHoveredCategory(null);
    
    // Reset navigation history
    setNavigationHistory(['navbar']);
    
    // Notify App that we're no longer showing a product page
    onProductPageState?.(false);
    
    // Navigate back to home
    onNavigate?.('home');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => setIsLoading(false), 200);
  }, [onNavigate, onProductPageState]);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (debounceRef.current) return;
    
    debounceRef.current = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 20);
      debounceRef.current = null;
    });
  }, []);

  // Enhanced search functionality with debouncing and smart filtering
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    searchDebounceRef.current = setTimeout(() => {
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        const filtered = allProducts
          .filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const categoryMatch = product.category.toLowerCase().includes(searchTerm);
            const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
            const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
            
            return nameMatch || categoryMatch || tagMatch || descriptionMatch;
          })
          .sort((a, b) => {
            // Prioritize exact name matches
            const aNameMatch = a.name.toLowerCase().startsWith(searchTerm);
            const bNameMatch = b.name.toLowerCase().startsWith(searchTerm);
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            
            // Then bestsellers
            if (a.bestseller && !b.bestseller) return -1;
            if (!a.bestseller && b.bestseller) return 1;
            
            // Then by rating
            return (b.rating || 0) - (a.rating || 0);
          });
        
        // Apply current filter
        const filteredProducts = getFilteredProducts(filtered).slice(0, 8);
        setSearchSuggestions(filteredProducts);
      } else {
        setSearchSuggestions([]);
      }
    }, 200);
  }, [allProducts, getFilteredProducts]);

  // Handle search item selection
  const handleSearchSelect = useCallback((product) => {
    // Add to search history
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== product.name);
      return [product.name, ...filtered].slice(0, 10);
    });
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.name !== product.name);
      return [product, ...filtered].slice(0, 5);
    });
    
    navigateToProductPage(product);
  }, [navigateToProductPage]);

  // Clear search with complete reset
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setSearchFilter('all');
    
    // Don't close search dropdown immediately, just clear the input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Toggle search with proper state management
  const toggleSearch = useCallback(() => {
    if (isSearchOpen) {
      // Closing search - reset everything
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
      setSearchFilter('all');
    } else {
      // Opening search
      setIsSearchOpen(true);
      // Close other dropdowns
      setIsProductsOpen(false);
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, [isSearchOpen]);

  // Handle keyboard navigation
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && searchSuggestions.length > 0) {
      e.preventDefault();
      handleSearchSelect(searchSuggestions[0]);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  }, [searchSuggestions, handleSearchSelect]);

  // Enhanced click outside handler
  const handleClickOutside = useCallback((event) => {
    // Handle products dropdown
    if (productsDropdownRef.current && 
        !productsDropdownRef.current.contains(event.target) &&
        !productsButtonRef.current?.contains(event.target)) {
      setIsProductsOpen(false);
      setHoveredCategory(null);
    }
    
    // Handle search dropdown
    if (searchDropdownRef.current && 
        !searchDropdownRef.current.contains(event.target) &&
        !event.target.closest('.search-container')) {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
    
    // Handle user menu
    if (userMenuRef.current && 
        !userMenuRef.current.contains(event.target)) {
      setIsUserMenuOpen(false);
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (currentView === 'navbar') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
        if (debounceRef.current) {
          cancelAnimationFrame(debounceRef.current);
        }
      };
    }
  }, [handleScroll, handleClickOutside, currentView]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchOpen]);

  // Cleanup search debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Reset search state when view changes
  useEffect(() => {
    if (currentView !== 'navbar') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  }, [currentView]);

  // Navigation items configuration
  const navItems = [
    { id: 'home', label: 'Home', onClick: () => onNavigate?.('home') },
    { id: 'about', label: 'About', onClick: () => onNavigate?.('about') },
    { id: 'contact', label: 'Contact', onClick: () => onNavigate?.('contact') },
    { id: 'testimonials', label: 'Reviews', onClick: () => onNavigate?.('testimonials') }
  ];

  // Component mappings for product pages
  const componentMap = {
    'inspirational-bookmarks': InspirationalBookmarkPage,
    'floral-bookmarks': FloralBookmarksPage,
    'regular-card': RegularCardPage,
    'mini-card': MiniCardPage,
    'spiderman-crochet': SpidermanCrochetPage,
    'tulip-crochet': TulipCrochetPage,
    'tulip-keychain': TulipKeychainPage,
    'sunflower-crochet': SunflowerPage,
    'watercolor-letter': WatercolorLetterPage,
    'vintage-letter': VintageLetterPage
  };

  // Render current component based on view
  const renderCurrentView = () => {
    if (currentView === 'navbar') {
      return null; // Show main navbar and content
    }
    
    const Component = componentMap[currentView];
    if (Component) {
      return (
        <div className="product-page-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <Component 
            product={selectedProduct} 
            onBack={handleBackToNavbar}
            isLoading={isLoading}
          />
        </div>
      );
    }
    
    return null;
  };

  // If we're showing a product page, render it instead of the navbar
  if (currentView !== 'navbar') {
    return (
      <div className="app-container">
        {/* Fixed back button for product pages */}
        {showBackButton && (
          <button 
            className="back-to-navbar-btn"
            onClick={handleBackToNavbar}
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </button>
        )}
        {renderCurrentView()}
      </div>
    );
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="navbar-container">
        {/* Enhanced Logo Section */}
        <div className="navbar-logo">
  <div className="logo-container" onClick={() => onNavigate?.('home')}>
    <div 
      className="logo-image"
      style={{
        backgroundImage: 'url(/src/NavBar/images/logo.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '60px',
        height: '60px',
        minWidth: '45px',
        minHeight: '45px',
        borderRadius: '50px'
      }}
    >
    </div>
    <div className="logo-text-container">
      <h1 className="logo-text">Just Small Gifts</h1>
      <span className="logo-tagline">Letters and Gifts</span>
    </div>
  </div>
</div>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNavItem === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveNavItem(item.id);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
          
          {/* Enhanced Products Dropdown */}
          <div className="nav-dropdown" ref={productsButtonRef}>
            <button
              className={`nav-item dropdown-trigger ${isProductsOpen ? 'active' : ''}`}
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              Products
              <ChevronDown 
                size={16} 
                className={`dropdown-icon ${isProductsOpen ? 'rotated' : ''}`} 
              />
              {featuredProducts.length > 0 && (
                <span className="featured-indicator">
                  <TrendingUp size={12} />
                </span>
              )}
            </button>
            
            {isProductsOpen && (
              <div className="dropdown-menu products-dropdown enhanced-dropdown" ref={productsDropdownRef}>
                <div className="dropdown-header">
                  <h3>Shop by Category</h3>
                  <p>Discover our handcrafted collections</p>
                  <div className="featured-badge">
                    <Sparkles size={14} />
                    <span>Featured Collection</span>
                  </div>
                </div>
                
                <div className="categories-grid">
                  {Object.entries(productCategories).map(([categoryName, category]) => (
                    <div 
                      key={categoryName}
                      className={`category-section ${hoveredCategory === categoryName ? 'hovered' : ''}`}
                      onMouseEnter={() => setHoveredCategory(categoryName)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="category-header">
                        <div className="category-icon">{category.icon}</div>
                        <div className="category-title-container">
                          <h4 className="category-name">{categoryName}</h4>
                          <p className="category-description">{category.description}</p>
                          <div className="category-badges">
                             {category.trending && (
                              <span className="trending-badge">
                                <TrendingUp size={10} />
                                Trending
                              </span>
                            )}
                            {category.customizable && (
                              <span className="customizable-badge">
                                <Sparkles size={10} />
                                Customizable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="category-items">
                        {category.items.map((item, index) => (
                          <button
                            key={`${categoryName}-${item.name}-${index}`}
                            className="category-item"
                            onClick={() => navigateToProductPage(item)}
                          >
                            <div className="item-image">
                              <img src={item.image} alt={item.name} loading="lazy" className="item-img" />
                              <div className="item-overlay">
                                <div className="item-badges-overlay">
                                  {item.bestseller && (
                                    <span className="bestseller-badge-overlay">
                                      <Star size={10} fill="currentColor" />
                                      Bestseller
                                    </span>
                                  )}
                                  {item.isNew && (
                                    <span className="new-badge-overlay">
                                      <Sparkles size={10} />
                                      New
                                    </span>
                                  )}
                                  {item.discount && (
                                    <span className="discount-badge-overlay">{item.discount}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="item-info">
                              <div className="item-name-container">
                                <span className="item-name">{item.name}</span>
                                <div className="item-badges">
                                  {item.bestseller && (
                                    <span className="bestseller-badge">
                                      <Star size={8} fill="currentColor" />
                                      Bestseller
                                    </span>
                                  )}
                                  {item.isNew && (
                                    <span className="new-badge">
                                      <Sparkles size={8} />
                                      New
                                    </span>
                                  )}
                                  {item.discount && <span className="discount-badge">{item.discount}</span>}
                                </div>
                              </div>
                              <div className="item-description">{item.description}</div>
                              <div className="item-price">
                                <span className="current-price">{item.price}</span>
                                {item.originalPrice && (
                                  <span className="original-price">{item.originalPrice}</span>
                                )}
                              </div>
                              <div className="item-meta">
                                {item.rating && (
                                  <div className="item-rating">
                                    <div className="rating-stars">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          size={10} 
                                          className={i < Math.floor(item.rating) ? 'filled' : 'empty'}
                                          fill={i < Math.floor(item.rating) ? 'currentColor' : 'none'}
                                        />
                                      ))}
                                    </div>
                                    <span className="rating-number">({item.reviews})</span>
                                  </div>
                                )}
                                <div className="delivery-time">
                                  <span className="delivery-icon">🚚</span>
                                  <span>{item.deliveryTime}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className="view-all-btn"
                        onClick={() => onNavigate?.(category.page)}
                      >
                        View All {categoryName}
                        <ChevronDown size={14} className="view-all-icon" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="dropdown-footer">
                  <div className="featured-products-section">
                    <h4>Featured Products</h4>
                    <div className="featured-products-grid">
                      {featuredProducts.slice(0, 3).map((product, index) => (
                        <button
                          key={`featured-${product.name}-${index}`}
                          className="featured-product-item"
                          onClick={() => navigateToProductPage(product)}
                        >
                          <img src={product.image} alt={product.name} loading="lazy" />
                          <div className="featured-product-info">
                            <span className="featured-product-name">{product.name}</span>
                            <span className="featured-product-price">{product.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="view-all-products-btn"
                    onClick={() => onNavigate?.('products')}
                  >
                    <Sparkles size={16} />
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Right Side Actions */}
        <div className="navbar-actions">
          {/* Revolutionary Enhanced Search */}
          <div className="search-container">
            <button 
              className={`action-button search-toggle ${isSearchOpen ? 'active' : ''}`}
              onClick={toggleSearch}
              aria-label="Search Products"
            >
              <Search size={20} />
              <div className="search-pulse-ring"></div>
            </button>
            
            {isSearchOpen && (
              <div className="search-dropdown revolutionary-search" ref={searchDropdownRef}>
                <div className="search-header">
                  <div className="search-input-container">
                    <Search size={18} className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search products, categories, or describe what you're looking for..."
                      className="search-input"
                      onKeyDown={handleSearchKeyDown}
                    />
                    {searchQuery && (
                      <button 
                        onClick={clearSearch}
                        className="search-clear"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <div className="search-shortcut">⌘K</div>
                  </div>
                  
                  {/* Smart Search Filters */}
                  <div className="search-filters">
                    {searchFilters.map((filter) => (
                      <button
                        key={filter.id}
                        className={`search-filter ${searchFilter === filter.id ? 'active' : ''}`}
                        onClick={() => {
                          setSearchFilter(filter.id);
                          if (searchQuery) {
                            handleSearch(searchQuery);
                          }
                        }}
                      >
                        <Filter size={12} />
                        <span>{filter.label}</span>
                        <span className="filter-count">({filter.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Recent searches with smart suggestions */}
                {!searchQuery && searchHistory.length > 0 && (
                  <div className="recent-searches">
                    <div className="recent-searches-header">
                      <Clock size={14} />
                      <span className="recent-searches-title">Recent Searches</span>
                      <button 
                        className="clear-history-btn"
                        onClick={() => setSearchHistory([])}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="recent-searches-grid">
                      {searchHistory.slice(0, 6).map((search, index) => (
                        <button
                          key={`recent-${index}`}
                          className="recent-search-item"
                          onClick={() => handleSearch(search)}
                        >
                          <Clock size={12} />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Enhanced search suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="search-suggestions revolutionary-suggestions">
                    <div className="suggestions-header">
                      <div className="suggestions-title-container">
                        <span className="suggestions-title">Products</span>
                        <span className="suggestions-count">{searchSuggestions.length} found</span>
                      </div>
                      {searchFilter !== 'all' && (
                        <div className="active-filter-indicator">
                          <Filter size={12} />
                          <span>{searchFilters.find(f => f.id === searchFilter)?.label}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="suggestions-grid">
                      {searchSuggestions.map((product, index) => (
                        <button
                          key={`${product.category}-${product.name}-${index}`}
                          className="search-suggestion revolutionary-suggestion"
                          onClick={() => handleSearchSelect(product)}
                        >
                          <div className="suggestion-image">
                            <img src={product.image} alt={product.name} loading="lazy" />
                            <div className="suggestion-overlay">
                              <div className="suggestion-badges">
                                {product.bestseller && (
                                  <span className="suggestion-badge bestseller">
                                    <Star size={8} fill="currentColor" />
                                    Best
                                  </span>
                                )}
                                {product.isNew && (
                                  <span className="suggestion-badge new">
                                    <Sparkles size={8} />
                                    New
                                  </span>
                                )}
                                {product.discount && (
                                  <span className="suggestion-badge discount">{product.discount}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="suggestion-content">
                            <div className="suggestion-main">
                              <div className="suggestion-name">{product.name}</div>
                              <div className="suggestion-category">in {product.category}</div>
                            </div>
                            
                            <div className="suggestion-description">{product.description}</div>
                            
                            <div className="suggestion-footer">
                              <div className="suggestion-price-container">
                                <span className="suggestion-price">{product.price}</span>
                                {product.originalPrice && (
                                  <span className="suggestion-original-price">{product.originalPrice}</span>
                                )}
                              </div>
                              
                              <div className="suggestion-meta">
                                {product.rating && (
                                  <div className="suggestion-rating">
                                    <Star size={10} fill="currentColor" />
                                    <span>{product.rating}</span>
                                    <span className="reviews-count">({product.reviews})</span>
                                  </div>
                                )}
                                <div className="suggestion-delivery">
                                  <span className="delivery-icon">🚚</span>
                                  <span>{product.deliveryTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {searchQuery && (
                      <div className="search-actions">
                        <button 
                          className="search-all-results"
                          onClick={() => onNavigate?.('search', { query: searchQuery, filter: searchFilter })}
                        >
                          <Search size={16} />
                          See all results for "{searchQuery}"
                          <span className="results-count">({searchSuggestions.length}+ products)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Enhanced no results state */}
                {searchQuery && searchSuggestions.length === 0 && searchQuery.length > 2 && (
                  <div className="no-suggestions revolutionary-no-suggestions">
                    <div className="no-suggestions-content">
                      <div className="no-suggestions-icon">
                        <Search size={32} />
                        <div className="search-ripple"></div>
                      </div>
                      <div className="no-suggestions-text">
                        <h4>No products found for "{searchQuery}"</h4>
                        <p>Try different keywords or explore our categories</p>
                      </div>
                      <div className="no-suggestions-actions">
                        <button 
                          className="browse-all-btn"
                          onClick={() => {
                            setIsSearchOpen(false);
                            onNavigate?.('products');
                          }}
                        >
                          <Sparkles size={16} />
                          Browse All Products
                        </button>
                        <button 
                          className="browse-categories-btn"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setIsProductsOpen(true);
                          }}
                        >
                          View Categories
                        </button>
                      </div>
                      
                      {/* Suggested alternatives */}
                      <div className="search-suggestions-alternative">
                        <h5>Popular searches:</h5>
                        <div className="popular-searches">
                          {['cards', 'bookmarks', 'crochet', 'letters', 'hampers'].map((term) => (
                            <button
                              key={term}
                              className="popular-search-tag"
                              onClick={() => handleSearch(term)}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Featured products when no search */}
                {!searchQuery && featuredProducts.length > 0 && (
                  <div className="search-featured-products">
                    <div className="featured-header">
                      <Sparkles size={16} />
                      <span>Trending Now</span>
                      <div className="trending-pulse"></div>
                    </div>
                    <div className="featured-grid">
                      {featuredProducts.slice(0, 6).map((product, index) => (
                        <button
                          key={`search-featured-${product.name}-${index}`}
                          className="featured-item"
                          onClick={() => handleSearchSelect(product)}
                        >
                          <div className="featured-item-image">
                            <img src={product.image} alt={product.name} loading="lazy" />
                            {product.bestseller && (
                              <div className="featured-item-badge">
                                <Star size={8} fill="currentColor" />
                              </div>
                            )}
                          </div>
                          <div className="featured-item-info">
                            <span className="featured-item-name">{product.name}</span>
                            <div className="featured-item-meta">
                              <span className="featured-item-price">{product.price}</span>
                              {product.rating && (
                                <div className="featured-item-rating">
                                  <Star size={8} fill="currentColor" />
                                  <span>{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Search footer with quick actions */}
                <div className="search-footer">
                  <div className="search-tips">
                    <span className="search-tip">💡 Tip: Try searching by occasion, color, or material</span>
                  </div>
                  <div className="search-footer-actions">
                    <button 
                      className="advanced-search-btn"
                      onClick={() => onNavigate?.('advanced-search')}
                    >
                      <Filter size={14} />
                      Advanced Search
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Cart */}
          <button 
            className="action-button cart-button enhanced-action-button"
            onClick={() => onNavigate?.('cart')}
            aria-label={`Shopping Cart (${cartCount} items)`}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge cart-badge enhanced-badge animate-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
            <div className="action-tooltip">
              Cart {cartCount > 0 && `(${cartCount})`}
            </div>
          </button>

          {/* Enhanced Wishlist */}
          <button 
            className="action-button wishlist-button enhanced-action-button"
            onClick={() => onNavigate?.('wishlist')}
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="badge wishlist-badge enhanced-badge">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
            <div className="action-tooltip">
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </div>
          </button>

          {/* Enhanced Notifications */}
          <button 
            className="action-button notifications-button enhanced-action-button"
            onClick={() => onNavigate?.('notifications')}
            aria-label={`Notifications (${notificationCount} new)`}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="badge notifications-badge enhanced-badge pulse">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
            <div className="action-tooltip">
              Notifications {notificationCount > 0 && `(${notificationCount} new)`}
            </div>
          </button>

          {/* Enhanced User Menu */}
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className={`action-button user-button enhanced-action-button ${isUserMenuOpen ? 'active' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User Menu"
            >
              <User size={20} />
              <div className="action-tooltip">
                {isAuthenticated ? `Welcome, ${currentUser?.name || 'User'}` : 'Account'}
              </div>
            </button>
            
            {isUserMenuOpen && (
              <div className="user-dropdown enhanced-user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="User Avatar" className="avatar-image" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {isAuthenticated ? `Hi, ${currentUser?.name || 'User'}!` : 'Welcome!'}
                    </span>
                    <span className="user-email">
                      {isAuthenticated ? currentUser?.email : 'Sign in to continue'}
                    </span>
                  </div>
                </div>
                
                <div className="user-dropdown-menu">
                  <button 
                    className="user-menu-item"
                    onClick={() => onNavigate?.('profile')}
                  >
                    <User size={16} />
                    My Profile
                    {isAuthenticated && <span className="menu-item-badge">Premium</span>}
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={() => onNavigate?.('orders')}
                  >
                    <ShoppingCart size={16} />
                    My Orders
                    {cartCount > 0 && <span className="menu-item-count">{cartCount}</span>}
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={() => onNavigate?.('wishlist')}
                  >
                    <Heart size={16} />
                    My Wishlist
                    {wishlistCount > 0 && <span className="menu-item-count">{wishlistCount}</span>}
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={() => onNavigate?.('notifications')}
                  >
                    <Bell size={16} />
                    Notifications
                    {notificationCount > 0 && <span className="menu-item-count">{notificationCount}</span>}
                  </button>
                  <button 
                    className="user-menu-item"
                    onClick={() => onNavigate?.('settings')}
                  >
                    Settings
                  </button>
                  <hr className="user-menu-divider" />
                  {isAuthenticated ? (
                    <button 
                      className="user-menu-item logout-btn"
                      onClick={() => onNavigate?.('logout')}
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <button 
                        className="user-menu-item login-btn"
                        onClick={() => onNavigate?.('login')}
                      >
                        Sign In
                      </button>
                      <button 
                        className="user-menu-item signup-btn"
                        onClick={() => onNavigate?.('signup')}
                      >
                        Sign Up
                        <span className="signup-benefit">Get 10% off!</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu enhanced-mobile-menu">
          <div className="mobile-menu-content">
            {/* Mobile Search */}
            <div className="mobile-search-container">
              <div className="mobile-search-input-container">
                <Search size={18} className="mobile-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="mobile-search-input"
                  onKeyDown={handleSearchKeyDown}
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="mobile-search-clear"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {/* Mobile search filters */}
              <div className="mobile-search-filters">
                {searchFilters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`mobile-search-filter ${searchFilter === filter.id ? 'active' : ''}`}
                    onClick={() => {
                      setSearchFilter(filter.id);
                      if (searchQuery) {
                        handleSearch(searchQuery);
                      }
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              {searchSuggestions.length > 0 && (
                <div className="mobile-search-suggestions">
                  {searchSuggestions.slice(0, 4).map((product, index) => (
                    <button
                      key={`mobile-${product.category}-${product.name}-${index}`}
                      className="mobile-search-suggestion"
                      onClick={() => handleSearchSelect(product)}
                    >
                      <div className="mobile-suggestion-image">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.bestseller && (
                          <div className="mobile-suggestion-badge">
                            <Star size={8} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="mobile-suggestion-info">
                        <span className="mobile-suggestion-name">{product.name}</span>
                        <div className="mobile-suggestion-meta">
                          <span className="mobile-suggestion-price">{product.price}</span>
                          {product.rating && (
                            <div className="mobile-suggestion-rating">
                              <Star size={10} fill="currentColor" />
                              <span>{product.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <hr className="mobile-menu-divider" />

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <button 
                key={item.id}
                className={`mobile-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveNavItem(item.id);
                  item.onClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            
            <div className="mobile-products-section">
              <button 
                className={`mobile-nav-item mobile-products-toggle ${isProductsOpen ? 'active' : ''}`}
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Products
                <div className="mobile-products-meta">
                  <ChevronDown 
                    size={16} 
                    className={`mobile-dropdown-icon ${isProductsOpen ? 'rotated' : ''}`} 
                  />
                  {featuredProducts.length > 0 && (
                    <span className="mobile-featured-indicator">
                      <TrendingUp size={12} />
                    </span>
                  )}
                </div>
              </button>
              
              {isProductsOpen && (
                <div className="mobile-products-dropdown enhanced-mobile-products">
                  {Object.entries(productCategories).map(([categoryName, category]) => (
                    <div key={categoryName} className="mobile-category-section">
                      <div className="mobile-category-header">
                        <div className="mobile-category-title-container">
                          <span className="mobile-category-icon">{category.icon}</span>
                          <div className="mobile-category-info">
                            <span className="mobile-category-title">{categoryName}</span>
                            <span className="mobile-category-description">{category.description}</span>
                          </div>
                        </div>
                        <div className="mobile-category-badges">
                          {category.trending && (
                            <span className="mobile-trending-badge">
                              <TrendingUp size={10} />
                              Trending
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mobile-category-items">
                        {category.items.map((item, index) => (
                          <button
                            key={`mobile-${categoryName}-${item.name}-${index}`}
                            className="mobile-category-item"
                            onClick={() => {
                              navigateToProductPage(item);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <div className="mobile-item-image">
                              <img src={item.image} alt={item.name} loading="lazy" />
                              {item.bestseller && (
                                <div className="mobile-item-badge">
                                  <Star size={8} fill="currentColor" />
                                </div>
                              )}
                            </div>
                            <div className="mobile-item-info">
                              <div className="mobile-item-header">
                                <span className="mobile-item-name">{item.name}</span>
                                <div className="mobile-item-badges">
                                  {item.bestseller && (
                                    <span className="mobile-bestseller-badge">Bestseller</span>
                                  )}
                                  {item.isNew && (
                                    <span className="mobile-new-badge">New</span>
                                  )}
                                  {item.discount && (
                                    <span className="mobile-discount-badge">{item.discount}</span>
                                  )}
                                </div>
                              </div>
                              <div className="mobile-item-meta">
                                <span className="mobile-item-price">{item.price}</span>
                                {item.rating && (
                                  <div className="mobile-item-rating">
                                    <Star size={10} fill="currentColor" />
                                    <span>{item.rating} ({item.reviews})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className="mobile-view-category-btn"
                        onClick={() => {
                          onNavigate?.(category.page);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        View All {categoryName}
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <hr className="mobile-menu-divider" />
            
            {/* Mobile Action Items */}
            <button 
              className="mobile-nav-item mobile-action-item"
              onClick={() => {
                onNavigate?.('cart');
                setIsMobileMenuOpen(false);
              }}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
            </button>
            
            <button 
              className="mobile-nav-item mobile-action-item"
              onClick={() => {
                onNavigate?.('wishlist');
                setIsMobileMenuOpen(false);
              }}
            >
              <Heart size={18} />
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="mobile-badge">{wishlistCount}</span>}
            </button>
            
            <button 
              className="mobile-nav-item mobile-action-item"
              onClick={() => {
                onNavigate?.('notifications');
                setIsMobileMenuOpen(false);
              }}
            >
              <Bell size={18} />
              <span>Notifications</span>
              {notificationCount > 0 && <span className="mobile-badge pulse">{notificationCount}</span>}
            </button>
            
            <hr className="mobile-menu-divider" />
            
            {/* Mobile User Actions */}
            <button 
              className="mobile-nav-item mobile-user-item"
              onClick={() => {
                onNavigate?.('profile');
                setIsMobileMenuOpen(false);
              }}
            >
              <User size={18} />
              My Profile
              {isAuthenticated && <span className="mobile-premium-badge">Premium</span>}
            </button>
            
            <button 
              className="mobile-nav-item mobile-user-item"
              onClick={() => {
                onNavigate?.('orders');
                setIsMobileMenuOpen(false);
              }}
            >
              My Orders
              {cartCount > 0 && <span className="mobile-order-count">({cartCount})</span>}
            </button>
            
            <button 
              className="mobile-nav-item mobile-user-item"
              onClick={() => {
                onNavigate?.('settings');
                setIsMobileMenuOpen(false);
              }}
            >
              Settings
            </button>
            
            <hr className="mobile-menu-divider" />
            
            {/* Mobile Auth Actions */}
            {isAuthenticated ? (
              <button 
                className="mobile-nav-item mobile-auth-item logout-item"
                onClick={() => {
                  onNavigate?.('logout');
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <button 
                  className="mobile-nav-item mobile-auth-item login-item"
                  onClick={() => {
                    onNavigate?.('login');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
                
                <button 
                  className="mobile-nav-item mobile-auth-item signup-item"
                  onClick={() => {
                    onNavigate?.('signup');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="signup-content">
                    <span>Sign Up</span>
                    <span className="signup-offer">Get 10% off!</span>
                  </div>
                </button>
              </>
            )}
            
            {/* Mobile Footer Info */}
            <div className="mobile-menu-footer">
              <div className="mobile-app-info">
  <div 
    style={{
      backgroundImage: 'url(/src/NavBar/images/logo.jpg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '18px',
      height: '18px',
      minWidth: '18px',
      minHeight: '18px',
      borderRadius: '18px',
      marginRight: '8px'
    }}
  >
  </div>
  <span>Just Small Gifts</span>
</div>
              <div className="mobile-app-tagline">Handmade with Love</div>
              {navigationHistory.length > 1 && (
                <div className="mobile-navigation-info">
                  <span>Navigation: {navigationHistory.join(' → ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;