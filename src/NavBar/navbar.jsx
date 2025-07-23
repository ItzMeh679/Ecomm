import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .navbar-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 400;
        }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(252, 253, 253, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(141, 172, 243, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
          background: rgba(252, 253, 253, 0.95);
          box-shadow: 0 8px 32px rgba(37, 39, 43, 0.12);
          border-bottom-color: rgba(141, 172, 243, 0.2);
        }

        .navbar-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 72px;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 6px;
          border-radius: 14px;
          position: relative;
        }

        .logo:hover {
          transform: translateY(-2px);
        }

        .logo-image {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(141, 172, 243, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          background: transparent;
        }

        .logo:hover .logo-image {
          transform: scale(1.08);
          box-shadow: 0 12px 32px rgba(141, 172, 243, 0.4);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
          z-index: 1;
          position: relative;
        }

        .logo-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }

        .logo:hover .logo-shine {
          opacity: 1;
          transform: rotate(45deg) translate(100%, 100%);
        }

        .logo-text-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-text {
          font-family: 'Dancing Script', cursive;
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #8dacf3, #1d2b4b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.3px;
          line-height: 1;
        }

        .logo-tagline {
          font-size: 10px;
          color: #8dacf3;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          background: none;
          border: none;
          color: #2d3748;
          font-weight: 500;
          font-size: 15px;
          padding: 12px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          letter-spacing: -0.2px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link.active {
          color: #8dacf3;
          background: rgba(141, 172, 243, 0.08);
        }

        .nav-link.active .nav-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-text {
          position: relative;
          z-index: 1;
        }

        .nav-indicator {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 2px;
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          border-radius: 1px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover {
          color: #8dacf3;
          background: rgba(141, 172, 243, 0.06);
          transform: translateY(-1px);
        }

        .nav-link:hover .nav-indicator {
          transform: translateX(-50%) scaleX(1);
        }

        .dropdown-container {
          position: relative;
        }

        .products-button {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dropdown-icon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dropdown-icon.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 16px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(37, 39, 43, 0.15);
          border: 1px solid rgba(141, 172, 243, 0.15);
          min-width: 720px;
          padding: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateX(-50%) translateY(-16px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          overflow: hidden;
          pointer-events: none;
        }

        .dropdown-menu.visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .dropdown-header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid rgba(141, 172, 243, 0.1);
          background: linear-gradient(135deg, rgba(141, 172, 243, 0.03), rgba(141, 172, 243, 0.01));
        }

        .dropdown-header h3 {
          margin: 0 0 4px;
          color: #1d2b4b;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .dropdown-header p {
          margin: 0;
          color: #8dacf3;
          font-size: 13px;
          opacity: 0.8;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          padding: 20px;
        }

        .category-section {
          padding: 20px;
          border-radius: 16px;
          background: transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          margin: 4px;
        }

        .category-section:hover {
          background: rgba(141, 172, 243, 0.05);
          border-color: rgba(141, 172, 243, 0.1);
          transform: translateY(-2px);
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid rgba(141, 172, 243, 0.2);
        }

        .category-icon {
          font-size: 18px;
          filter: grayscale(0.2);
        }

        .category-title {
          font-weight: 600;
          color: #1d2b4b;
          font-size: 15px;
          letter-spacing: -0.2px;
        }

        .category-items {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .category-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          color: #4a5568;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.1px;
          position: relative;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
        }

        .item-dot {
         width: 4px;
         height: 4px;
         border-radius: 50%;
         background: #8dacf3;
         opacity: 0.6;
         transition: all 0.3s ease;
       }

       .category-item:hover {
         color: #8dacf3;
         background: rgba(141, 172, 243, 0.08);
         transform: translateX(4px);
       }

       .category-item:hover .item-dot {
         opacity: 1;
         transform: scale(1.2);
       }

       .header-actions {
         display: flex;
         align-items: center;
         gap: 8px;
       }

       .icon-button {
         background: none;
         border: none;
         padding: 10px;
         border-radius: 10px;
         cursor: pointer;
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         position: relative;
         color: #4a5568;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       .icon-button:hover {
         background: rgba(141, 172, 243, 0.08);
         transform: translateY(-1px);
       }

       .button-ripple {
         position: absolute;
         top: 50%;
         left: 50%;
         width: 0;
         height: 0;
         border-radius: 50%;
         background: rgba(141, 172, 243, 0.3);
         transform: translate(-50%, -50%);
         transition: width 0.6s, height 0.6s;
         pointer-events: none;
       }

       .icon-button:active .button-ripple {
         width: 40px;
         height: 40px;
       }

       .cart-btn {
         position: relative;
       }

       .cart-count {
         position: absolute;
         top: -6px;
         right: -6px;
         background: linear-gradient(135deg, #ff6b6b, #ff5252);
         color: white;
         font-size: 10px;
         font-weight: 600;
         padding: 2px 6px;
         border-radius: 10px;
         min-width: 18px;
         height: 18px;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
         position: relative;
         z-index: 1;
       }

       .count-pulse {
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         border-radius: 10px;
         background: #ff6b6b;
         animation: pulse 2s infinite;
         z-index: -1;
       }

       @keyframes pulse {
         0% { transform: scale(1); opacity: 1; }
         50% { transform: scale(1.1); opacity: 0.7; }
         100% { transform: scale(1); opacity: 1; }
       }

       .login-btn {
         background: linear-gradient(135deg, #8dacf3, #94B4FF);
         color: white;
         border: none;
         padding: 10px 16px;
         border-radius: 10px;
         font-size: 14px;
         font-weight: 500;
         cursor: pointer;
         display: flex;
         align-items: center;
         gap: 6px;
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         letter-spacing: -0.1px;
         box-shadow: 0 4px 14px rgba(141, 172, 243, 0.3);
         position: relative;
         overflow: hidden;
       }

       .login-btn:hover {
         transform: translateY(-2px);
         box-shadow: 0 8px 20px rgba(141, 172, 243, 0.4);
         background: linear-gradient(135deg, #94B4FF, #a0c0ff);
       }

       .login-shine {
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
         transition: left 0.6s ease;
       }

       .login-btn:hover .login-shine {
         left: 100%;
       }

       .mobile-menu-toggle {
         display: none;
         background: none;
         border: none;
         padding: 8px;
         cursor: pointer;
         border-radius: 8px;
         transition: all 0.3s ease;
       }

       .hamburger {
         width: 20px;
         height: 16px;
         position: relative;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
       }

       .hamburger span {
         width: 100%;
         height: 2px;
         background: #4a5568;
         border-radius: 1px;
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         transform-origin: center;
       }

       .hamburger.active span:nth-child(1) {
         transform: rotate(45deg) translate(6px, 6px);
       }

       .hamburger.active span:nth-child(2) {
         opacity: 0;
       }

       .hamburger.active span:nth-child(3) {
         transform: rotate(-45deg) translate(6px, -6px);
       }

       .mobile-menu {
         position: absolute;
         top: 100%;
         left: 0;
         right: 0;
         background: rgba(255, 255, 255, 0.98);
         backdrop-filter: blur(20px);
         -webkit-backdrop-filter: blur(20px);
         border-bottom: 1px solid rgba(141, 172, 243, 0.1);
         transform: translateY(-100%);
         opacity: 0;
         visibility: hidden;
         transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
         box-shadow: 0 8px 32px rgba(37, 39, 43, 0.1);
       }

       .mobile-menu.open {
         transform: translateY(0);
         opacity: 1;
         visibility: visible;
       }

       .mobile-nav-links {
         padding: 20px 24px;
         border-bottom: 1px solid rgba(141, 172, 243, 0.1);
       }

       .mobile-nav-link {
         display: flex;
         align-items: center;
         gap: 12px;
         width: 100%;
         padding: 16px 0;
         color: #2d3748;
         font-size: 16px;
         font-weight: 500;
         background: none;
         border: none;
         cursor: pointer;
         transition: all 0.3s ease;
         text-align: left;
         border-bottom: 1px solid rgba(141, 172, 243, 0.05);
       }

       .mobile-nav-link:last-child {
         border-bottom: none;
       }

       .mobile-nav-link:hover {
         color: #8dacf3;
         transform: translateX(8px);
       }

       .mobile-actions {
         padding: 20px 24px;
         display: flex;
         flex-direction: column;
         gap: 16px;
       }

       .mobile-action-buttons {
         display: flex;
         justify-content: center;
         gap: 16px;
       }

       .mobile-icon-button {
         background: rgba(141, 172, 243, 0.08);
         border: none;
         padding: 12px;
         border-radius: 12px;
         cursor: pointer;
         transition: all 0.3s ease;
         position: relative;
         display: flex;
         align-items: center;
         justify-content: center;
       }

       .mobile-icon-button:hover {
         background: rgba(141, 172, 243, 0.15);
         transform: translateY(-2px);
       }

       .mobile-login-btn {
         background: linear-gradient(135deg, #8dacf3, #94B4FF);
         color: white;
         border: none;
         padding: 14px 20px;
         border-radius: 12px;
         font-size: 16px;
         font-weight: 500;
         cursor: pointer;
         display: flex;
         align-items: center;
         justify-content: center;
         gap: 8px;
         transition: all 0.3s ease;
         box-shadow: 0 4px 14px rgba(141, 172, 243, 0.3);
       }

       .mobile-login-btn:hover {
         transform: translateY(-2px);
         box-shadow: 0 8px 20px rgba(141, 172, 243, 0.4);
       }

       .search-overlay {
         position: fixed;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: rgba(0, 0, 0, 0.5);
         backdrop-filter: blur(8px);
         -webkit-backdrop-filter: blur(8px);
         z-index: 2000;
         display: flex;
         align-items: center;
         justify-content: center;
         padding: 20px;
         animation: fadeIn 0.3s ease;
       }

       @keyframes fadeIn {
         from { opacity: 0; }
         to { opacity: 1; }
       }

       .search-modal {
         background: white;
         border-radius: 20px;
         width: 100%;
         max-width: 580px;
         max-height: 600px;
         box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
         animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         overflow: hidden;
       }

       @keyframes slideUp {
         from { transform: translateY(40px); opacity: 0; }
         to { transform: translateY(0); opacity: 1; }
       }

       .search-header {
         padding: 24px 24px 20px;
         border-bottom: 1px solid rgba(141, 172, 243, 0.1);
         display: flex;
         align-items: center;
         justify-content: space-between;
         background: linear-gradient(135deg, rgba(141, 172, 243, 0.03), rgba(255, 255, 255, 1));
       }

       .search-title {
         display: flex;
         align-items: center;
         gap: 12px;
       }

       .search-title h3 {
         margin: 0 0 4px;
         color: #1d2b4b;
         font-size: 18px;
         font-weight: 600;
       }

       .search-title p {
         margin: 0;
         color: #8dacf3;
         font-size: 13px;
         opacity: 0.8;
       }

       .close-search {
         background: none;
         border: none;
         padding: 8px;
         border-radius: 8px;
         cursor: pointer;
         color: #4a5568;
         transition: all 0.3s ease;
       }

       .close-search:hover {
         background: rgba(141, 172, 243, 0.1);
         color: #8dacf3;
       }

       .search-form {
         padding: 20px 24px 24px;
       }

       .search-input-container {
         position: relative;
         margin-bottom: 16px;
       }

       .search-input {
         width: 100%;
         padding: 16px 20px 16px 48px;
         border: 2px solid rgba(141, 172, 243, 0.2);
         border-radius: 14px;
         font-size: 16px;
         background: rgba(141, 172, 243, 0.02);
         transition: all 0.3s ease;
         outline: none;
         color: #2d3748;
       }

       .search-input:focus {
         border-color: #8dacf3;
         background: white;
         box-shadow: 0 0 0 3px rgba(141, 172, 243, 0.1);
       }

       .search-input::placeholder {
         color: #a0aec0;
       }

       .input-search-icon {
         position: absolute;
         left: 16px;
         top: 50%;
         transform: translateY(-50%);
         color: #8dacf3;
         pointer-events: none;
       }

       .clear-search {
         position: absolute;
         right: 12px;
         top: 50%;
         transform: translateY(-50%);
         background: none;
         border: none;
         padding: 4px;
         border-radius: 4px;
         cursor: pointer;
         color: #a0aec0;
         transition: all 0.3s ease;
       }

       .clear-search:hover {
         color: #8dacf3;
         background: rgba(141, 172, 243, 0.1);
       }

       .search-suggestions {
         background: white;
         border: 1px solid rgba(141, 172, 243, 0.15);
         border-radius: 12px;
         margin-bottom: 20px;
         overflow: hidden;
         box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
       }

       .suggestion-item {
         display: flex;
         align-items: center;
         gap: 12px;
         width: 100%;
         padding: 12px 16px;
         background: none;
         border: none;
         cursor: pointer;
         transition: all 0.3s ease;
         text-align: left;
         color: #4a5568;
         font-size: 14px;
         border-bottom: 1px solid rgba(141, 172, 243, 0.05);
       }

       .suggestion-item:last-child {
         border-bottom: none;
       }

       .suggestion-item:hover {
         background: rgba(141, 172, 243, 0.05);
         color: #8dacf3;
       }

       .search-actions {
         display: flex;
         gap: 12px;
         justify-content: flex-end;
       }

       .cancel-btn {
         background: none;
         border: 1px solid rgba(141, 172, 243, 0.3);
         color: #8dacf3;
         padding: 12px 24px;
         border-radius: 10px;
         font-size: 14px;
         font-weight: 500;
         cursor: pointer;
         transition: all 0.3s ease;
       }

       .cancel-btn:hover {
         background: rgba(141, 172, 243, 0.05);
         border-color: #8dacf3;
       }

       .search-submit-btn {
         background: linear-gradient(135deg, #8dacf3, #94B4FF);
         color: white;
         border: none;
         padding: 12px 24px;
         border-radius: 10px;
         font-size: 14px;
         font-weight: 500;
         cursor: pointer;
         transition: all 0.3s ease;
         box-shadow: 0 4px 14px rgba(141, 172, 243, 0.3);
       }

       .search-submit-btn:hover:not(:disabled) {
         transform: translateY(-1px);
         box-shadow: 0 6px 18px rgba(141, 172, 243, 0.4);
       }

       .search-submit-btn:disabled {
         opacity: 0.6;
         cursor: not-allowed;
       }

       @media (max-width: 768px) {
         .navbar-content {
           padding: 0 16px;
           height: 64px;
         }

         .logo {
           gap: 10px;
         }

         .logo-image {
           width: 40px;
           height: 40px;
         }

         .logo-text {
           font-size: 18px;
         }

         .logo-tagline {
           font-size: 9px;
         }

         .desktop-nav {
           display: none;
         }

         .mobile-menu-toggle {
           display: flex;
         }

         .header-actions .login-btn {
           display: none;
         }

         .dropdown-menu {
           min-width: 300px;
           left: 0;
           transform: none;
         }

         .dropdown-menu.visible {
           transform: none;
         }

         .categories-grid {
           grid-template-columns: 1fr;
           gap: 8px;
           padding: 16px;
         }

         .category-section {
           margin: 2px;
           padding: 16px;
         }

         .search-modal {
           margin: 20px;
           max-width: none;
         }

         .search-header {
           padding: 20px 20px 16px;
         }

         .search-form {
           padding: 16px 20px 20px;
         }
       }

       @media (max-width: 480px) {
         .navbar-content {
           padding: 0 12px;
         }

         .logo-text-container {
           display: none;
         }

         .header-actions {
           gap: 4px;
         }

         .icon-button {
           padding: 8px;
         }

         .search-modal {
           margin: 16px;
         }

         .search-input {
           padding: 14px 18px 14px 44px;
           font-size: 15px;
         }

         .input-search-icon {
           left: 14px;
         }
       }
     `}</style>
   </div>
 );
};

export default Navbar;