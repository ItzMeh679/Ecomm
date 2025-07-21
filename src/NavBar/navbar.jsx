import React, { useState, useEffect, useRef } from 'react';
import { User, Menu, X, ChevronDown } from 'lucide-react';

// Import PNG icons (adjust paths as needed)
const SearchIconPNG = ({ size = 18, className = "" }) => (
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
  />
);

const CartIconPNG = ({ size = 18, className = "" }) => (
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
  />
);

const Navbar = ({ onNavigate, cartCount = 0 }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);

  // Sample search suggestions for enhanced UX
  const allProducts = [
    'Watercolor Letter', 'Vintage Letter', 'Matte Black Letter',
    'Mini Cards', 'Regular Card', 'Tulip', 'Tulip Keychain', 
    'Spiderman', 'Sunflower', 'Floral Bookmarks', 'Inspirational Bookmarks',
    'Glass Bottle', 'Subtle Packaging', 'Birthday ', 'Rakshabandhan ', 'Diwali ', 'Christmass '
  ];

  // Products categories data
  const productCategories = {
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
      items: ['Floral Bookmarks', 'quotes Bookmarks'],
      page: 'bookmarks',
      icon: '🔖'
    },
    'Extras': {
      items: ['Glass Bottle', 'Subtle Packaging'],
      page: 'extras',
      icon: '✨'
    },
    'Hampers': {
      items: ['Birthday ', 'Rakshabandhan ', 'Diwali ', 'Christmass '],
      page: 'hampers',
      icon: '🎁'
    }
  };

  // Handle scroll effect with enhanced animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(product =>
        product.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Enhanced search with suggestions
  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      console.log('Searching for:', query);
      onNavigate?.('search', { query });
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  };

  // Handle navigation
  const handleNavigation = (page, data = null) => {
    setIsMobileMenuOpen(false);
    setIsProductsHovered(false);
    onNavigate?.(page, data);
  };

  // Handle product category click
  const handleProductClick = (categoryPage, item = null) => {
    setIsProductsHovered(false);
    setIsMobileMenuOpen(false);
    onNavigate?.(categoryPage, item ? { product: item } : null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                <button className="nav-link" onClick={() => handleNavigation('home')}>
                  <span className="nav-text">Home</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
              
              <li className="dropdown-container">
                <button 
                  className="nav-link products-button"
                  onMouseEnter={() => setIsProductsHovered(true)}
                  onMouseLeave={() => setIsProductsHovered(false)}
                >
                  <span className="nav-text">Products</span>
                  <ChevronDown size={16} className="dropdown-icon" />
                  <div className="nav-indicator"></div>
                </button>
                
                <div 
                  className={`dropdown-menu ${isProductsHovered ? 'visible' : ''}`}
                  onMouseEnter={() => setIsProductsHovered(true)}
                  onMouseLeave={() => setIsProductsHovered(false)}
                >
                  <div className="dropdown-header">
                    <h3>Our Products</h3>
                    <p>Handcrafted with attention to detail</p>
                  </div>
                  <div className="categories-grid">
                    {Object.entries(productCategories).map(([category, data]) => (
                      <div key={category} className="category-section">
                        <div className="category-header">
                          <span className="category-icon">{data.icon}</span>
                          <div className="category-title">{category}</div>
                        </div>
                        <div className="category-items">
                          {data.items.map((item, index) => (
                            <div
                              key={index}
                              className="category-item"
                              onClick={() => handleProductClick(data.page, item)}
                            >
                              <span className="item-dot"></span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              
              <li>
                <button className="nav-link" onClick={() => handleNavigation('about')}>
                  <span className="nav-text">About</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
              
              <li>
                <button className="nav-link" onClick={() => handleNavigation('contact')}>
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
            >
              <SearchIconPNG size={20} />
              <div className="button-ripple"></div>
            </button>

            {/* Cart with PNG Icon */}
            <button
              className="icon-button cart-btn"
              onClick={() => handleNavigation('cart')}
              title="Shopping Cart"
            >
              <CartIconPNG size={20} />
              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                  <div className="count-pulse"></div>
                </span>
              )}
              <div className="button-ripple"></div>
            </button>

            {/* Enhanced Login */}
            <button
              className="login-btn"
              onClick={() => handleNavigation('login')}
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
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <button className="mobile-nav-link" onClick={() => handleNavigation('home')}>
              <span>🏠</span>
              Home
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavigation('products')}>
              <span>🛍️</span>
              Products
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavigation('about')}>
              <span>ℹ️</span>
              About
            </button>
            <button className="mobile-nav-link" onClick={() => handleNavigation('contact')}>
              <span>📞</span>
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
              >
                <SearchIconPNG size={20} />
              </button>
              <button
                className="mobile-icon-button"
                onClick={() => handleNavigation('cart')}
              >
                <CartIconPNG size={20} />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </button>
            </div>
            <button
              className="mobile-login-btn"
              onClick={() => handleNavigation('login')}
            >
              <User size={16} />
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Search Modal */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}>
          <div className="search-modal">
            <div className="search-header">
              <div className="search-title">
                <SearchIconPNG size={24} className="search-icon" />
                <div>
                  <h3>Search Products</h3>
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
            
            <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="search-input-container">
                <SearchIconPNG size={18} className="input-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search for handcrafted gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchSuggestions([]);
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-item"
                      onClick={() => handleSearch(suggestion)}
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

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
          z-index: 1;
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
          background: transparent; /* Remove the gradient background */
        }

        .logo:hover .logo-image {
          transform: scale(1.08);
          box-shadow: 0 12px 32px rgba(141, 172, 243, 0.4);
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

        .dropdown-container:hover .dropdown-icon {
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
        }

        .dropdown-menu.visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
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
        }

        .item-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #8dacf3;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .category-item:hover {
          color: #8dacf3;
          background: rgba(141, 172, 243, 0.1);
          transform: translateX(6px);
        }

        .category-item:hover .item-dot {
          opacity: 1;
          transform: scale(1.5);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .icon-button {
          position: relative;
          background: rgba(141, 172, 243, 0.08);
          border: 1px solid rgba(141, 172, 243, 0.15);
          border-radius: 12px;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .icon-button:hover {
          background: rgba(141, 172, 243, 0.15);
          border-color: rgba(141, 172, 243, 0.25);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(141, 172, 243, 0.25);
        }

        .icon-button:hover img {
          filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
          transform: scale(1.1);
        }

        .button-ripple {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(141, 172, 243, 0.3) 0%, transparent 70%);
          opacity: 0;
          transform: scale(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: inherit;
        }

        .icon-button:active .button-ripple {
          opacity: 1;
          transform: scale(1);
        }

        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ff4757, #ff6b7a);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          border: 2px solid white;
          box-shadow: 0 3px 12px rgba(255, 71, 87, 0.4);
          animation: bounce 0.5s ease;
        }

        .count-pulse {
          position: absolute;
          inset: -4px;
          border: 2px solid rgba(255, 71, 87, 0.5);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          60% { transform: translateY(-2px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .login-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(141, 172, 243, 0.3);
          letter-spacing: -0.2px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover {
          background: linear-gradient(135deg, #1d2b4b, #8dacf3);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(141, 172, 243, 0.4);
        }

        .login-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-btn:hover .login-shine {
          left: 100%;
        }

        .mobile-menu-toggle {
          display: none;
          background: rgba(141, 172, 243, 0.08);
          border: 1px solid rgba(141, 172, 243, 0.15);
          border-radius: 12px;
          width: 46px;
          height: 46px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .mobile-menu-toggle:hover {
          background: rgba(141, 172, 243, 0.15);
          transform: translateY(-2px);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .hamburger span {
          display: block;
          width: 18px;
          height: 2px;
          background: #8dacf3;
          border-radius: 1px;
          margin: 2px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(141, 172, 243, 0.1);
          box-shadow: 0 8px 32px rgba(37, 39, 43, 0.15);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 999;
        }

        .mobile-menu.open {
          display: block;
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mobile-nav-links {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-bottom: 1px solid rgba(141, 172, 243, 0.1);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: transparent;
          border: none;
          color: #2d3748;
          font-size: 16px;
          font-weight: 500;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          width: 100%;
        }

        .mobile-nav-link:hover {
          background: rgba(141, 172, 243, 0.08);
          color: #8dacf3;
          transform: translateX(8px);
        }

        .mobile-nav-link span {
          font-size: 18px;
          opacity: 0.8;
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
          position: relative;
          background: rgba(141, 172, 243, 0.08);
          border: 1px solid rgba(141, 172, 243, 0.15);
          border-radius: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-icon-button:hover {
          background: rgba(141, 172, 243, 0.15);
          transform: translateY(-2px);
        }

        .mobile-icon-button .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ff4757, #ff6b7a);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          border: 2px solid white;
        }

        .mobile-login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          color: white;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 6px 20px rgba(141, 172, 243, 0.3);
          width: 100%;
        }

        .mobile-login-btn:hover {
          background: linear-gradient(135deg, #1d2b4b, #8dacf3);
          transform: translateY(-2px);
        }

        .search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 20px 20px;
          opacity: 0;
          animation: fadeInOverlay 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .search-modal {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 32px 80px rgba(37, 39, 43, 0.2);
          border: 1px solid rgba(141, 172, 243, 0.1);
          overflow: hidden;
          transform: translateY(-40px);
          animation: slideInModal 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .search-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(141, 172, 243, 0.1);
          background: linear-gradient(135deg, rgba(141, 172, 243, 0.03), rgba(141, 172, 243, 0.01));
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
          letter-spacing: -0.3px;
        }

        .search-title p {
          margin: 0;
          color: #8dacf3;
          font-size: 13px;
          opacity: 0.8;
        }

        .close-search {
          background: rgba(141, 172, 243, 0.08);
          border: 1px solid rgba(141, 172, 243, 0.15);
          border-radius: 10px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #8dacf3;
        }

        .close-search:hover {
          background: rgba(141, 172, 243, 0.15);
          transform: scale(1.1);
        }

        .search-form {
          padding: 28px;
        }

        .search-input-container {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 16px 20px 16px 50px;
          border: 2px solid rgba(141, 172, 243, 0.15);
          border-radius: 12px;
          font-size: 16px;
          color: #2d3748;
          background: rgba(141, 172, 243, 0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .search-input:focus {
          border-color: #8dacf3;
          background: white;
          box-shadow: 0 0 0 4px rgba(141, 172, 243, 0.1);
        }

        .search-input::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .input-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.5;
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(141, 172, 243, 0.08);
          border: none;
          border-radius: 6px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #8dacf3;
        }

        .clear-search:hover {
          background: rgba(141, 172, 243, 0.15);
        }

        .search-suggestions {
          background: white;
          border: 1px solid rgba(141, 172, 243, 0.1);
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(37, 39, 43, 0.08);
          overflow: hidden;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
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
          transform: translateX(4px);
        }

        .search-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-btn {
          padding: 12px 20px;
          background: transparent;
          border: 2px solid rgba(141, 172, 243, 0.2);
          color: #8dacf3;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: rgba(141, 172, 243, 0.08);
          border-color: rgba(141, 172, 243, 0.3);
        }

        .search-submit-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(141, 172, 243, 0.3);
        }

        .search-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d2b4b, #8dacf3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(141, 172, 243, 0.4);
        }

        .search-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInModal {
          from { transform: translateY(-40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .dropdown-menu {
            min-width: 600px;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav,
          .login-btn {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .navbar-content {
            padding: 0 20px;
            height: 68px;
          }

          .logo-text {
            font-size: 20px;
          }

          .logo-tagline {
            font-size: 9px;
          }

          .logo-image {
            width: 44px;
            height: 44px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            padding: 16px;
          }

          .dropdown-menu {
            min-width: 320px;
            left: 20px;
            right: 20px;
            transform: none;
          }

          .dropdown-menu.visible {
            transform: none;
          }

          .search-modal {
            margin: 0 16px;
          }

          .search-header {
            padding: 20px 24px 16px;
          }

          .search-form {
            padding: 24px;
          }

          .search-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .search-submit-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .navbar-content {
            padding: 0 16px;
          }

          .logo-text-container {
            display: none;
          }

          .header-actions {
            gap: 8px;
          }

          .icon-button {
            width: 40px;
            height: 40px;
          }

          .mobile-menu-toggle {
            width: 40px;
            height: 40px;
          }

          .hamburger span {
            width: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;