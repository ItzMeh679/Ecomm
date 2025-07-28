import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { User, Menu, X, ChevronDown, Search, ShoppingCart, Heart, Bell, ArrowLeft, Star, Sparkles, TrendingUp } from 'lucide-react';
import './Navbar.css';

// Import all product page components
import InspirationalBookmarkPage from '../Products/Bookmarks/Inspirational.jsx';
import FloralBookmarksPage from '../Products/Bookmarks/Floral.jsx';
import RegularCardPage from '../Products/Cards/Regular.jsx';
import MiniCardPage from '../Products/Cards/Mini.jsx';
import SpidermanCrochetPage from '../Products/Crochet/spiderman.jsx'; 
import TulipCrochetPage from '../Products/Crochet/Tuplip.jsx'; 
import TulipKeychainPage from '../Products/Crochet/TulipKeychain.jsx'; 
import SunflowerPage from '../Products/Crochet/sunflower.jsx'; 
import WatercolorLetterPage from '../Products/Letters/Watercolor.jsx'
import VintageLetterPage from '../Products/Letters/Vintage.jsx'

const Navbar = ({ 
  onNavigate, 
  onProductPageState, 
  cartCount = 0, 
  wishlistCount = 0, 
  notificationCount = 0,
  currentUser = null,
  isAuthenticated = false 
}) => {
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
  
  // Refs
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);
  const productsButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Enhanced product categories with more detailed information
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

  // Memoized all products for search suggestions
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

  // Get featured/trending products
  const featuredProducts = useMemo(() => {
    return allProducts.filter(product => 
      product.bestseller || product.isNew || product.categoryInfo.trending
    ).slice(0, 6);
  }, [allProducts]);

  // Enhanced navigation function with history tracking
  const navigateToProductPage = useCallback((product) => {
    console.log(`Opening product page: ${product.name}`);
    setIsLoading(true);
    
    // Add to navigation history
    setNavigationHistory(prev => [...prev, product.pageId || product.name]);
    
    setSelectedProduct(product);
    setShowBackButton(true);
    
    // Notify App that we're showing a product page
    onProductPageState?.(true);
    
    // Set the current view to the specific product page using pageId if available
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
        // For products without specific pages, navigate to products showcase with product highlighted
        console.log(`Specific page for ${product.name} not implemented yet, navigating to products showcase`);
        setCurrentView('navbar');
        setShowBackButton(false);
        onProductPageState?.(false); // Not showing product page
        onNavigate?.('products', { product: product.name });
        setIsLoading(false);
        return;
      }
    }
    
    // Close all menus
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate loading time for better UX
    setTimeout(() => setIsLoading(false), 300);
  }, [onNavigate, onProductPageState]);

  // Handle back to main navbar view with history support
  const handleBackToNavbar = useCallback(() => {
    setIsLoading(true);
    
    // Remove current page from history
    setNavigationHistory(prev => prev.slice(0, -1));
    
    setCurrentView('navbar');
    setSelectedProduct(null);
    setShowBackButton(false);
    
    // Notify App that we're no longer showing a product page
    onProductPageState?.(false);
    
    // Navigate back to home or previous page
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

  useEffect(() => {
    // Only add scroll listener when showing navbar
    if (currentView === 'navbar') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (debounceRef.current) {
          cancelAnimationFrame(debounceRef.current);
        }
      };
    }
  }, [handleScroll, currentView]);

  // Enhanced search suggestions with advanced filtering and debouncing
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    searchDebounceRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filtered = allProducts
          .filter(product => {
            const nameMatch = product.name.toLowerCase().includes(query);
            const categoryMatch = product.category.toLowerCase().includes(query);
            const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(query));
            const descriptionMatch = product.description?.toLowerCase().includes(query);
            
            return nameMatch || categoryMatch || tagMatch || descriptionMatch;
          })
          .sort((a, b) => {
            // Prioritize exact name matches
            const aNameMatch = a.name.toLowerCase().startsWith(query);
            const bNameMatch = b.name.toLowerCase().startsWith(query);
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            
            // Then bestsellers
            if (a.bestseller && !b.bestseller) return -1;
            if (!a.bestseller && b.bestseller) return 1;
            
            // Then by rating
            return (b.rating || 0) - (a.rating || 0);
          })
          .slice(0, 8);
        setSearchSuggestions(filtered);
      } else {
        setSearchSuggestions([]);
      }
    }, 200);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, allProducts]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchOpen]);

  // Enhanced click outside handlers with improved performance
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Products dropdown
      if (
        productsDropdownRef.current && 
        productsButtonRef.current &&
        !productsDropdownRef.current.contains(event.target) &&
        !productsButtonRef.current.contains(event.target)
      ) {
        setIsProductsOpen(false);
        setHoveredCategory(null);
      }
      
      // User menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isProductsOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProductsOpen, isUserMenuOpen]);

  // Enhanced search function with recent searches tracking
  const handleSearch = useCallback((query = searchQuery) => {
    if (query.trim()) {
      console.log('Searching for:', query);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        // In a real app, you'd save this to localStorage
        return updated;
      });
      
      // First try to find an exact product match
      const exactProduct = findProductByName(query);
      if (exactProduct) {
        navigateToProductPage(exactProduct);
        return;
      }
      
      // If no exact match, navigate to products page with search
      setCurrentView('navbar');
      setShowBackButton(false);
      onProductPageState?.(false);
      onNavigate?.('search', { query });
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  }, [searchQuery, onNavigate, onProductPageState, findProductByName, navigateToProductPage]);

  // Handle search suggestion click
  const handleSuggestionClick = useCallback((product) => {
    navigateToProductPage(product);
    setSearchQuery('');
    setSearchSuggestions([]);
    setIsSearchOpen(false);
  }, [navigateToProductPage]);

  // Enhanced navigation with active state management and loading states
  const handleNavigation = useCallback((page, data = null) => {
    setIsLoading(true);
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setActiveNavItem(page);
    setCurrentView('navbar');
    setShowBackButton(false);
    setSelectedProduct(null);
    setHoveredCategory(null);
    
    // Reset navigation history
    setNavigationHistory(['navbar']);
    
    // Notify App that we're no longer showing a product page
    onProductPageState?.(false);
    
    onNavigate?.(page, data);
    
    setTimeout(() => setIsLoading(false), 200);
  }, [onNavigate, onProductPageState]);

  // Handle product category click from dropdown
  const handleProductClick = useCallback((categoryPage, item = null) => {
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    setHoveredCategory(null);
    
    if (item && typeof item === 'object') {
      // Direct product selection
      navigateToProductPage(item);
    } else if (item && typeof item === 'string') {
      // Product name string
      const product = findProductByName(item);
      if (product) {
        navigateToProductPage(product);
      } else {
        // Navigate to category page
        setCurrentView('navbar');
        setShowBackButton(false);
        setActiveNavItem(categoryPage);
        onProductPageState?.(false);
        onNavigate?.(categoryPage, { product: item });
      }
    } else {
      // Navigate to category page
      setCurrentView('navbar');
      setShowBackButton(false);
      setActiveNavItem(categoryPage);
      onProductPageState?.(false);
      onNavigate?.(categoryPage);
    }
  }, [onNavigate, onProductPageState, navigateToProductPage, findProductByName]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        if (currentView !== 'navbar') {
          handleBackToNavbar();
        } else {
          setIsSearchOpen(false);
          setIsMobileMenuOpen(false);
          setIsProductsOpen(false);
          setIsUserMenuOpen(false);
          setHoveredCategory(null);
        }
        break;
      case 'Enter':
        if (e.target.closest('.search-input-container') && searchQuery.trim()) {
          e.preventDefault();
          handleSearch();
        }
        break;
      case '/':
        if (!isSearchOpen && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
        break;
      default:
        break;
    }
  }, [searchQuery, handleSearch, currentView, handleBackToNavbar, isSearchOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle functions with improved state management
  const toggleProductsDropdown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProductsOpen(!isProductsOpen);
    setIsUserMenuOpen(false);
    setHoveredCategory(null);
  }, [isProductsOpen]);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsProductsOpen(false);
    setHoveredCategory(null);
  }, [isUserMenuOpen]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  }, [isSearchOpen]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setIsSearchOpen(false);
  }, []);

  // Handle category hover for enhanced UX
  const handleCategoryHover = useCallback((categoryName) => {
    setHoveredCategory(categoryName);
  }, []);

  // Product page routing - render ONLY the product component with loading state
  if (currentView !== 'navbar') {
    const renderProductPage = () => {
      const commonProps = {
        onBack: handleBackToNavbar,
        product: selectedProduct,
        isLoading
      };

      if (isLoading) {
        return (
          <div className="product-page-loading">
            <div className="loading-spinner"></div>
            <p>Loading {selectedProduct?.name}...</p>
          </div>
        );
      }

      switch (currentView) {
        case 'inspirational-bookmarks':
          return <InspirationalBookmarkPage {...commonProps} />;
        case 'floral-bookmarks':
          return <FloralBookmarksPage {...commonProps} />;
        case 'regular-card':
          return <RegularCardPage {...commonProps} />;
        case 'mini-card':
          return <MiniCardPage {...commonProps} />;
        case 'spiderman-crochet':
          return <SpidermanCrochetPage {...commonProps} />;
        case 'tulip-crochet':
          return <TulipCrochetPage {...commonProps} />;
        case 'tulip-keychain':
          return <TulipKeychainPage {...commonProps} />;
        case 'sunflower-crochet':
          return <SunflowerPage {...commonProps} />;
        case 'watercolor-letter':
          return <WatercolorLetterPage {...commonProps} />;
        case 'vintage-letter':
          return <VintageLetterPage {...commonProps} />;
        default:
          // Fallback - shouldn't happen but just in case
          console.warn(`Unknown product view: ${currentView}`);
          return (
            <div className="product-page-error">
              <h2>Product page not found</h2>
              <button onClick={handleBackToNavbar} className="back-button">
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          );
      }
    };

    // Return ONLY the product page component - no navbar, no wrapper
    return renderProductPage();
  }

  // Main navbar render - only when currentView is 'navbar'
  return (
    <div className="navbar-container">
      {/* Loading overlay */}
      {isLoading && (
        <div className="navbar-loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isLoading ? 'loading' : ''}`}>
        <div className="navbar-content">
          {/* Logo with enhanced branding */}
          <div className="logo" onClick={() => handleNavigation('home')}>
            <div className="logo-image">
              <img 
                src="/src/assets/logo.jpg" 
                alt="Handwritten Hearts Logo" 
                className="logo-img"
              />
              <div className="logo-sparkle">
                <Sparkles size={16} className="sparkle-icon" />
              </div>
            </div>
            <div className="logo-text-container">
              <div className="logo-text">Handwritten Hearts</div>
              <div className="logo-tagline">Crafted with Love</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavigation('home')}
                  disabled={isLoading}
                >
                  Home
                </button>
              </li>
              
              <li className="dropdown-container">
                <button 
                  ref={productsButtonRef}
                  className={`nav-link products-nav-link ${isProductsOpen || activeNavItem === 'products' ? 'active' : ''}`}
                  onClick={toggleProductsDropdown}
                  disabled={isLoading}
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
                
                <div 
                  ref={productsDropdownRef}
                  className={`dropdown-menu products-dropdown ${isProductsOpen ? 'visible' : ''}`}
                >
                  <div className="dropdown-header">
                    <h3>Our Products</h3>
                    <p>Handcrafted with love, personalized just for you</p>
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
                        onMouseEnter={() => handleCategoryHover(categoryName)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="category-header">
                          <div className="category-icon">{category.icon}</div>
                          <div className="category-title-container">
                            <div className="category-title">{categoryName}</div>
                            <div className="category-description">{category.description}</div>
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
                              onClick={() => handleProductClick(category.page, item)}
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
                          onClick={() => handleProductClick(category.page)}
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
                            onClick={() => handleProductClick(product.categoryInfo.page, product)}
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
                      onClick={() => handleNavigation('products')}
                    >
                      <Sparkles size={16} />
                      View All Products
                    </button>
                  </div>
                </div>
              </li>

              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'about' ? 'active' : ''}`}
                  onClick={() => handleNavigation('about')}
                  disabled={isLoading}
                >
                  About
                </button>
              </li>
              
              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'contact' ? 'active' : ''}`}
                  onClick={() => handleNavigation('contact')}
                  disabled={isLoading}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Enhanced Search */}
            <div className="search-container">
              <button 
                className={`action-button search-toggle ${isSearchOpen ? 'active' : ''}`}
                onClick={toggleSearch}
                aria-label="Search Products"
                disabled={isLoading}
              >
                <Search size={20} />
              </button>
              
              {isSearchOpen && (
                <div className="search-dropdown enhanced-search">
                  <div className="search-input-container">
                    <Search size={18} className="search-icon" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, categories, or tags..."
                      className="search-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                    <div className="search-shortcut">Press / to search</div>
                  </div>
                  
                  {/* Recent searches */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div className="recent-searches">
                      <div className="recent-searches-header">
                        <span className="recent-searches-title">Recent Searches</span>
                      </div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={`recent-${index}`}
                          className="recent-search-item"
                          onClick={() => setSearchQuery(search)}
                        >
                          <Search size={14} />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchSuggestions.length > 0 && (
                    <div className="search-suggestions enhanced-suggestions">
                      <div className="suggestions-header">
                        <span className="suggestions-title">Products</span>
                        <span className="suggestions-count">{searchSuggestions.length} found</span>
                      </div>
                      {searchSuggestions.map((product, index) => (
                        <button
                          key={`${product.category}-${product.name}-${index}`}
                          className="search-suggestion enhanced-suggestion"
                          onClick={() => handleSuggestionClick(product)}
                        >
                          <div className="suggestion-image">
                            <img src={product.image} alt={product.name} loading="lazy" className="suggestion-img" />
                            {product.bestseller && (
                              <div className="suggestion-badge">
                                <Star size={8} fill="currentColor" />
                              </div>
                            )}
                          </div>
                          <div className="suggestion-info">
                            <div className="suggestion-main">
                              <span className="suggestion-name">{product.name}</span>
                              <span className="suggestion-category">in {product.category}</span>
                            </div>
                            <div className="suggestion-description">{product.description}</div>
                            <div className="suggestion-details">
                              <div className="suggestion-price-container">
                                <span className="suggestion-price">{product.price}</span>
                                {product.originalPrice && (
                                  <span className="suggestion-original-price">{product.originalPrice}</span>
                                )}
                              </div>
                              <div className="suggestion-badges">
                                {product.bestseller && <span className="suggestion-bestseller">Bestseller</span>}
                                {product.isNew && <span className="suggestion-new">New</span>}
                                {product.rating && (
                                  <div className="suggestion-rating">
                                    <Star size={10} fill="currentColor" />
                                    <span>{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      {searchQuery && (
                        <button 
                          className="search-all-results"
                          onClick={() => handleSearch()}
                        >
                          <Search size={16} />
                          See all results for "{searchQuery}"
                        </button>
                      )}
                    </div>
                  )}
                  
                  {searchQuery && searchSuggestions.length === 0 && searchQuery.length > 2 && (
                    <div className="no-suggestions enhanced-no-suggestions">
                      <div className="no-suggestions-content">
                        <Search size={32} className="no-suggestions-icon" />
                        <span className="no-suggestions-text">No products found for "{searchQuery}"</span>
                        <p className="no-suggestions-subtext">Try different keywords or browse our categories</p>
                        <div className="no-suggestions-actions">
                          <button 
                            className="browse-all-btn"
                            onClick={() => handleNavigation('products')}
                          >
                            <Sparkles size={16} />
                            Browse All Products
                          </button>
                          <button 
                            className="browse-categories-btn"
                            onClick={() => setIsProductsOpen(true)}
                          >
                            View Categories
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Featured products when no search */}
                  {!searchQuery && featuredProducts.length > 0 && (
                    <div className="search-featured-products">
                      <div className="featured-header">
                        <Sparkles size={16} />
                        <span>Featured Products</span>
                      </div>
                      <div className="featured-grid">
                        {featuredProducts.slice(0, 4).map((product, index) => (
                          <button
                            key={`search-featured-${product.name}-${index}`}
                            className="featured-item"
                            onClick={() => handleSuggestionClick(product)}
                          >
                            <img src={product.image} alt={product.name} loading="lazy" />
                            <div className="featured-item-info">
                              <span className="featured-item-name">{product.name}</span>
                              <span className="featured-item-price">{product.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Cart */}
            <button 
              className="action-button cart-button enhanced-action-button"
              onClick={() => handleNavigation('cart')}
              aria-label={`Shopping Cart (${cartCount} items)`}
              disabled={isLoading}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="badge cart-badge enhanced-badge">
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
              onClick={() => handleNavigation('wishlist')}
              aria-label={`Wishlist (${wishlistCount} items)`}
              disabled={isLoading}
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
              onClick={() => handleNavigation('notifications')}
              aria-label={`Notifications (${notificationCount} new)`}
              disabled={isLoading}
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
                onClick={toggleUserMenu}
                aria-label="User Menu"
                disabled={isLoading}
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
                      onClick={() => handleNavigation('profile')}
                    >
                      <User size={16} />
                      My Profile
                      {isAuthenticated && <span className="menu-item-badge">Premium</span>}
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => handleNavigation('orders')}
                    >
                      <ShoppingCart size={16} />
                      My Orders
                      {cartCount > 0 && <span className="menu-item-count">{cartCount}</span>}
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => handleNavigation('wishlist')}
                    >
                      <Heart size={16} />
                      My Wishlist
                      {wishlistCount > 0 && <span className="menu-item-count">{wishlistCount}</span>}
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => handleNavigation('notifications')}
                    >
                      <Bell size={16} />
                      Notifications
                      {notificationCount > 0 && <span className="menu-item-count">{notificationCount}</span>}
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => handleNavigation('settings')}
                    >
                      Settings
                    </button>
                    <hr className="user-menu-divider" />
                    {isAuthenticated ? (
                      <button 
                        className="user-menu-item logout-btn"
                        onClick={() => handleNavigation('logout')}
                      >
                        Sign Out
                      </button>
                    ) : (
                      <>
                        <button 
                          className="user-menu-item login-btn"
                          onClick={() => handleNavigation('login')}
                        >
                          Sign In
                        </button>
                        <button 
                          className="user-menu-item signup-btn"
                          onClick={() => handleNavigation('signup')}
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
              disabled={isLoading}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="mobile-search-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                
                {searchSuggestions.length > 0 && (
                  <div className="mobile-search-suggestions">
                    {searchSuggestions.slice(0, 4).map((product, index) => (
                      <button
                        key={`mobile-${product.category}-${product.name}-${index}`}
                        className="mobile-search-suggestion"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <div className="mobile-suggestion-image">
                          <img src={product.image} alt={product.name} loading="lazy" />
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
              <button 
                className={`mobile-nav-item ${activeNavItem === 'home' ? 'active' : ''}`}
                onClick={() => handleNavigation('home')}
                disabled={isLoading}
              >
                Home
              </button>
              
              <div className="mobile-products-section">
                <button 
                  className={`mobile-nav-item mobile-products-toggle ${isProductsOpen ? 'active' : ''}`}
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  disabled={isLoading}
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
                              onClick={() => handleProductClick(category.page, item)}
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
                          onClick={() => handleProductClick(category.page)}
                        >
                          View All {categoryName}
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                className={`mobile-nav-item ${activeNavItem === 'about' ? 'active' : ''}`}
                onClick={() => handleNavigation('about')}
                disabled={isLoading}
              >
                About
              </button>
              
              <button 
                className={`mobile-nav-item ${activeNavItem === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavigation('contact')}
                disabled={isLoading}
              >
                Contact
              </button>
              
              <hr className="mobile-menu-divider" />
              
              {/* Mobile Action Items */}
              <button 
                className="mobile-nav-item mobile-action-item"
                onClick={() => handleNavigation('cart')}
                disabled={isLoading}
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
              </button>
              
              <button 
                className="mobile-nav-item mobile-action-item"
                onClick={() => handleNavigation('wishlist')}
                disabled={isLoading}
              >
                <Heart size={18} />
                <span>Wishlist</span>
                {wishlistCount > 0 && <span className="mobile-badge">{wishlistCount}</span>}
              </button>
              
              <button 
                className="mobile-nav-item mobile-action-item"
                onClick={() => handleNavigation('notifications')}
                disabled={isLoading}
              >
                <Bell size={18} />
                <span>Notifications</span>
                {notificationCount > 0 && <span className="mobile-badge pulse">{notificationCount}</span>}
              </button>
              
              <hr className="mobile-menu-divider" />
              
              {/* Mobile User Actions */}
              <button 
                className="mobile-nav-item mobile-user-item"
                onClick={() => handleNavigation('profile')}
                disabled={isLoading}
              >
                <User size={18} />
                My Profile
                {isAuthenticated && <span className="mobile-premium-badge">Premium</span>}
              </button>
              
              <button 
                className="mobile-nav-item mobile-user-item"
                onClick={() => handleNavigation('orders')}
                disabled={isLoading}
              >
                My Orders
                {cartCount > 0 && <span className="mobile-order-count">({cartCount})</span>}
              </button>
              
              <button 
                className="mobile-nav-item mobile-user-item"
                onClick={() => handleNavigation('settings')}
                disabled={isLoading}
              >
                Settings
              </button>
              
              <hr className="mobile-menu-divider" />
              
              {/* Mobile Auth Actions */}
              {isAuthenticated ? (
                <button 
                  className="mobile-nav-item mobile-auth-item logout-item"
                  onClick={() => handleNavigation('logout')}
                  disabled={isLoading}
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button 
                    className="mobile-nav-item mobile-auth-item login-item"
                    onClick={() => handleNavigation('login')}
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                  
                  <button 
                    className="mobile-nav-item mobile-auth-item signup-item"
                    onClick={() => handleNavigation('signup')}
                    disabled={isLoading}
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
                  <Sparkles size={16} />
                  <span>Handwritten Hearts</span>
                </div>
                <div className="mobile-app-tagline">Crafted with Love</div>
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
    </div>
  );
};

export default Navbar;