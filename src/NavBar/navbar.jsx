import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Navbar.css'
import { User, Menu, X, ChevronDown } from 'lucide-react';


// Optimized PNG Icon Components with better error handling
const SearchIconPNG = React.memo(({ size = 18, className = "" }) => (
  <img 
    src="./src/NavBar/images/search.png" 
    alt="Search"
    width={size} 
    height={size} 
    className={className}
    style={{ 
      filter: 'brightness(0) saturate(100%) invert(64%) sepia(23%) saturate(1847%) hue-rotate(194deg) brightness(94%) contrast(93%)',
      transition: 'all 0.3s ease'
    }}
    onError={(e) => {
      console.warn('Search icon failed to load');
      e.target.style.display = 'none';
    }}
  />
));

const CartIconPNG = React.memo(({ size = 18, className = "" }) => (
  <img 
    src="./src/NavBar/images/cart.png" 
    alt="Cart"
    width={size} 
    height={size} 
    className={className}
    style={{ 
      filter: 'brightness(0) saturate(100%) invert(64%) sepia(23%) saturate(1847%) hue-rotate(194deg) brightness(94%) contrast(93%)',
      transition: 'all 0.3s ease'
    }}
    onError={(e) => {
      console.warn('Cart icon failed to load');
      e.target.style.display = 'none';
    }}
  />
));

const Navbar = ({ onNavigate, cartCount = 0 }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState('home');
  
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);
  const productsButtonRef = useRef(null);
  const debounceRef = useRef(null);

  // Memoized sample search suggestions for better performance
  const allProducts = useMemo(() => [
    'Watercolor Letter', 'Vintage Letter', 'Matte Black Letter',
    'Mini Cards', 'Regular Card', 'Tulip', 'Tulip Keychain', 
    'Spiderman', 'Sunflower', 'Floral Bookmarks', 'Inspirational Bookmarks',
    'Glass Bottle', 'Subtle Packaging', 'Birthday', 'Rakshabandhan', 'Diwali', 'Christmas'
  ], []);

  // Memoized products categories data
  const productCategories = useMemo(() => ({
    'Letters': {
      items: ['Watercolor Letter', 'Vintage Letter', 'Matte Black Letter'],
      page: 'letters',
      icon: '✉️'
    },
    'Cards': {
      items: ['Mini Cards', 'Regular Card'],
      page: 'cards',
      icon: '💌'
    },
    'Crochet': {
      items: ['Tulip', 'Tulip Keychain', 'Spiderman', 'Sunflower'],
      page: 'crochet',
      icon: '🧶'
    },
    'Bookmarks': {
      items: ['Floral Bookmarks', 'Quotes Bookmarks'],
      page: 'bookmarks',
      icon: '🔖'
    },
    'Extras': {
      items: ['Glass Bottle', 'Subtle Packaging'],
      page: 'extras',
      icon: '✨'
    },
    'Hampers': {
      items: ['Birthday', 'Rakshabandhan', 'Diwali', 'Christmas'],
      page: 'hampers',
      icon: '🎁'
    }
  }), []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (debounceRef.current) return;
    
    debounceRef.current = setTimeout(() => {
      setIsScrolled(window.scrollY > 20);
      debounceRef.current = null;
    }, 16); // ~60fps
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [handleScroll]);

  // Enhanced search suggestions with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = allProducts.filter(product =>
          product.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setSearchSuggestions(filtered);
      } else {
        setSearchSuggestions([]);
      }
    }, 150); // Debounce for better performance

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allProducts]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isSearchOpen]);

  // Enhanced click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productsDropdownRef.current && 
        productsButtonRef.current &&
        !productsDropdownRef.current.contains(event.target) &&
        !productsButtonRef.current.contains(event.target)
      ) {
        setIsProductsOpen(false);
      }
    };

    if (isProductsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProductsOpen]);

  // Enhanced search with analytics potential
  const handleSearch = useCallback((query = searchQuery) => {
    if (query.trim()) {
      console.log('Searching for:', query);
      onNavigate?.('search', { query });
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
      
      // Analytics could be added here
      // analytics.track('search', { query });
    }
  }, [searchQuery, onNavigate]);

  // Enhanced navigation with active state management
  const handleNavigation = useCallback((page, data = null) => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    setActiveNavItem(page);
    onNavigate?.(page, data);
  }, [onNavigate]);

  // Handle product category click
  const handleProductClick = useCallback((categoryPage, item = null) => {
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    setActiveNavItem(categoryPage);
    onNavigate?.(categoryPage, item ? { product: item } : null);
  }, [onNavigate]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsProductsOpen(false);
        break;
      case 'Enter':
        if (e.target.closest('.search-input-container') && searchQuery.trim()) {
          e.preventDefault();
          handleSearch();
        }
        break;
      default:
        break;
    }
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle products dropdown
  const toggleProductsDropdown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProductsOpen(!isProductsOpen);
  }, [isProductsOpen]);

  return (
    <div className="navbar-container">
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-content">
          {/* Enhanced Logo */}
          <div className="logo" onClick={() => handleNavigation('home')}>
            <div className="logo-image">
              <img
                src="/src/NavBar/images/logo.jpg"
                alt="Just Small Gifts Logo"
                className="logo-img"
                onError={(e) => {
                  console.warn('Logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
              <div className="logo-shine"></div>
            </div>
            <div className="logo-text-container">
              <span className="logo-text">Just Small Gifts</span>
              <span className="logo-tagline">Letters and Gifts</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavigation('home')}
                >
                  <span className="nav-text">Home</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
              
              <li className="dropdown-container">
                <button 
                  ref={productsButtonRef}
                  className={`nav-link products-button ${activeNavItem === 'products' || isProductsOpen ? 'active' : ''}`}
                  onClick={toggleProductsDropdown}
                  aria-expanded={isProductsOpen}
                  aria-haspopup="true"
                >
                  <span className="nav-text">Products</span>
                  <ChevronDown 
                    size={16} 
                    className={`dropdown-icon ${isProductsOpen ? 'rotated' : ''}`} 
                  />
                  <div className="nav-indicator"></div>
                </button>
                
                <div 
                  ref={productsDropdownRef}
                  className={`dropdown-menu ${isProductsOpen ? 'visible' : ''}`}
                  role="menu"
                  aria-labelledby="products-button"
                >
                  <div className="dropdown-header">
                    <h3>Our Products</h3>
                    <p>Handcrafted with attention to detail</p>
                  </div>
                  <div className="categories-grid">
                    {Object.entries(productCategories).map(([category, data]) => (
                      <div key={category} className="category-section">
                        <div className="category-header">
                          <span className="category-icon" role="img" aria-label={category}>
                            {data.icon}
                          </span>
                          <div className="category-title">{category}</div>
                        </div>
                        <div className="category-items">
                          {data.items.map((item, index) => (
                            <button
                              key={index}
                              className="category-item"
                              onClick={() => handleProductClick(data.page, item)}
                              role="menuitem"
                            >
                              <span className="item-dot"></span>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              
              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'about' ? 'active' : ''}`}
                  onClick={() => handleNavigation('about')}
                >
                  <span className="nav-text">About</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
              
              <li>
                <button 
                  className={`nav-link ${activeNavItem === 'contact' ? 'active' : ''}`}
                  onClick={() => handleNavigation('contact')}
                >
                  <span className="nav-text">Contact</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Enhanced Header Actions */}
          <div className="header-actions">
            {/* Search Button with PNG Icon */}
            <button
              className="icon-button search-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Search Products"
              aria-label="Search Products"
            >
              <SearchIconPNG size={20} />
              <div className="button-ripple"></div>
            </button>

            {/* Cart with PNG Icon */}
            <button
              className="icon-button cart-btn"
              onClick={() => handleNavigation('cart')}
              title="Shopping Cart"
              aria-label={`Shopping Cart ${cartCount > 0 ? `(${cartCount} items)` : ''}`}
            >
              <CartIconPNG size={20} />
              {cartCount > 0 && (
                <span className="cart-count" aria-label={`${cartCount} items in cart`}>
                  {cartCount > 99 ? '99+' : cartCount}
                  <div className="count-pulse"></div>
                </span>
              )}
              <div className="button-ripple"></div>
            </button>

            {/* Enhanced Login */}
            <button
              className="login-btn"
              onClick={() => handleNavigation('login')}
              aria-label="Login"
            >
              <User size={16} />
              <span>Login</span>
              <div className="login-shine"></div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} role="menu">
          <div className="mobile-nav-links">
            <button 
              className="mobile-nav-link" 
              onClick={() => handleNavigation('home')}
              role="menuitem"
            >
              <span role="img" aria-label="Home">🏠</span>
              Home
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => handleNavigation('products')}
              role="menuitem"
            >
              <span role="img" aria-label="Products">🛍️</span>
              Products
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => handleNavigation('about')}
              role="menuitem"
            >
              <span role="img" aria-label="About">ℹ️</span>
              About
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => handleNavigation('contact')}
              role="menuitem"
            >
              <span role="img" aria-label="Contact">📞</span>
              Contact
            </button>
          </div>
          
          <div className="mobile-actions">
            <div className="mobile-action-buttons">
              <button
                className="mobile-icon-button"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Search"
              >
                <SearchIconPNG size={20} />
              </button>
              <button
                className="mobile-icon-button"
                onClick={() => handleNavigation('cart')}
                aria-label={`Cart ${cartCount > 0 ? `(${cartCount} items)` : ''}`}
              >
                <CartIconPNG size={20} />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>
            </div>
            <button
              className="mobile-login-btn"
              onClick={() => handleNavigation('login')}
              aria-label="Login"
            >
              <User size={16} />
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Search Modal */}
      {isSearchOpen && (
        <div 
          className="search-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSearchOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
        >
          <div className="search-modal">
            <div className="search-header">
              <div className="search-title">
                <SearchIconPNG size={24} className="search-icon" />
                <div>
                  <h3 id="search-title">Search Products</h3>
                  <p>Find your perfect gift</p>
                </div>
              </div>
              <button 
                className="close-search"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            
            <form 
              className="search-form" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                handleSearch(); 
              }}
            >
              <div className="search-input-container">
                <SearchIconPNG size={18} className="input-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search for handcrafted gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchSuggestions([]);
                    }}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions" role="listbox">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-item"
                      onClick={() => handleSearch(suggestion)}
                      role="option"
                    >
                      <SearchIconPNG size={14} />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="search-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="search-submit-btn"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
   </div>
 );
};

export default Navbar;
