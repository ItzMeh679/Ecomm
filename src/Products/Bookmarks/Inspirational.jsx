import React, { useState, useEffect } from 'react';
import { useCart } from '../../Cart/CartPage.jsx'; // Adjust path based on your folder structure

const InspirationalBookmarkPage = ({ onBack, onNavigate }) => {
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [selectedColor, setSelectedColor] = useState('blue');  
  const [quote, setQuote] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [wordError, setWordError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get cart functions from context
  const { addToCart, cartCount } = useCart();

  // Design options
  const designs = [
    { id: 0, name: 'Minimalist', preview: '/api/placeholder/80/120', description: 'Clean and simple design' },
    { id: 1, name: 'Ornate Border', preview: '/api/placeholder/80/120', description: 'Decorative border design' },
    { id: 2, name: 'Vintage Style', preview: '/api/placeholder/80/120', description: 'Classic vintage look' },
    { id: 3, name: 'Modern Geometric', preview: '/api/placeholder/80/120', description: 'Contemporary patterns' },
    { id: 4, name: 'Floral Accent', preview: '/api/placeholder/80/120', description: 'Subtle floral elements' }
  ];

  // Color options
  const colors = [
    { name: 'blue', hex: '#3B82F6', label: 'Ocean Blue' },
    { name: 'orange', hex: '#F97316', label: 'Sunset Orange' },
    { name: 'red', hex: '#EF4444', label: 'Ruby Red' },
    { name: 'yellow', hex: '#EAB308', label: 'Golden Yellow' },
    { name: 'green', hex: '#22C55E', label: 'Forest Green' },
    { name: 'violet', hex: '#8B5CF6', label: 'Royal Violet' },
    { name: 'indigo', hex: '#6366F1', label: 'Deep Indigo' }
  ];

  // Handle quote input and word count
  useEffect(() => {
    const words = quote.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    if (words.length > 10 && quote.trim() !== '') {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
    } else {
      setWordError(false);
    }
  }, [quote]);

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Enhanced Add to cart functionality with proper cart integration
  const handleAddToCart = () => {
    if (wordCount > 10) {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
      return;
    }

    setIsAddingToCart(true);

    // Create standardized product object for cart with specifications
    const cartProduct = {
      id: 'inspirational-bookmark',
      name: 'Inspirational Bookmark',
      category: 'Bookmarks',
      price: 99,
      totalPrice: 99,
      basePrice: 99,
      quantity: 1,
      specifications: {
        design: designs[selectedDesign].name,
        color: colors.find(c => c.name === selectedColor).label,
        quote: quote.trim() || 'No custom quote',
        wordCount: wordCount
      },
      image: 'src/Products/Bookmarks/Images/Inspirational.png',
      tags: ['Inspirational', 'Bookmark', 'Custom', 'Handmade'],
      rating: 4.8,
      reviews: 47,
      deliveryTime: '3-5 days'
    };

    // Add to cart using context
    addToCart(cartProduct);
    
    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      alert('Successfully added Inspirational Bookmark to cart with your customizations!');
    }, 500);
  };

  const handleBuyNow = () => {
    if (wordCount > 10) {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
      return;
    }

    // First add to cart, then navigate to cart page
    const cartProduct = {
      id: 'inspirational-bookmark',
      name: 'Inspirational Bookmark',
      category: 'Bookmarks',
      price: 99,
      totalPrice: 99,
      basePrice: 99,
      quantity: 1,
      specifications: {
        design: designs[selectedDesign].name,
        color: colors.find(c => c.name === selectedColor).label,
        quote: quote.trim() || 'No custom quote',
        wordCount: wordCount
      },
      image: 'src/Products/Bookmarks/Images/Inspirational.png',
      tags: ['Inspirational', 'Bookmark', 'Custom', 'Handmade'],
      rating: 4.8,
      reviews: 47,
      deliveryTime: '3-5 days'
    };

    addToCart(cartProduct);
    
    // Navigate to cart page if onNavigate function is available
    if (onNavigate) {
      onNavigate('cart');
    } else {
      alert('Added Inspirational Bookmark to cart! Please go to cart to checkout.');
    }
  };

  return (
    <div className="bookmark-product-page">
      {/* Back Button */}
      {onBack && (
        <button 
          className="back-button"
          onClick={onBack}
        >
          ← Back to Products
        </button>
      )}

      {/* Cart Indicator */}
      <div 
        className="cart-indicator"
        onClick={onNavigate ? () => onNavigate('cart') : undefined}
        style={{ cursor: onNavigate ? 'pointer' : 'default' }}
      >
        🛒 Cart ({cartCount})
      </div>

      {/* Navigation breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span> / <span>Bookmarks</span> / <span>Inspirational Bookmarks</span>
      </div>

      <div className="product-container">
        {/* Left side - Product Image, Dimensions, and Product Details */}
        <div className="product-left-section">
          <div 
            className={`product-image-container ${isZoomed ? 'zoomed' : ''}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src="src/Products/Bookmarks/Images/Inspirational.png" 
              alt="Inspirational Bookmark"
              className="product-image"
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              }}
            />
            {isZoomed && (
              <div className="zoom-indicator">
                Hover to zoom • Click to view full size
              </div>
            )}
          </div>

          {/* Dimensions below image */}
          <div className="dimensions">
            <h3>Dimensions</h3>
            <p><strong>Size:</strong> 15cm × 5cm</p>
            <p><strong>Thickness:</strong> 0.3mm</p>
            <p><strong>Weight:</strong> 5g</p>
          </div>

          {/* Product Details below dimensions */}
          <div className="product-description">
            <h3>Product Details</h3>
            <ul>
              <li>Premium quality cardstock material</li>
              <li>Waterproof and durable finish</li>
              <li>Perfect for daily use</li>
              <li>Thoughtfully designed with inspirational quotes</li>
              <li>Ideal gift for book lovers</li>
            </ul>
          </div>
        </div>

        {/* Right side - Product Info and Customization */}
        <div className="product-right-section">
          <div className="product-header">
            <h1>Inspirational Bookmarks</h1>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="review-count">(47 reviews)</span>
            </div>
          </div>

          <div className="pricing">
            <span className="current-price">₹99</span>
            <span className="original-price">₹149</span>
            <span className="discount-badge">33% OFF</span>
          </div>

          {/* Design Selection */}
          <div className="customization-section">
            <h3>Choose Your Design</h3>
            <div className="design-options">
              {designs.map((design) => (
                <div 
                  key={design.id}
                  className={`design-option ${selectedDesign === design.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDesign(design.id)}
                >
                  <img src={design.preview} alt={design.name} />
                  <div className="design-info">
                    <p className="design-name">{design.name}</p>
                    <p className="design-desc">{design.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="customization-section">
            <h3>Select Color</h3>
            <div className="color-options">
              {colors.map((color) => (
                <div 
                  key={color.name}
                  className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color.name)}
                >
                  <div 
                    className="color-swatch" 
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="color-label">{color.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Input */}
          <div className="customization-section">
            <h3>Add Your Inspirational Quote</h3>
            <div className="quote-input-container">
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter your favorite inspirational quote (max 10 words)"
                className={`quote-input ${wordError ? 'error' : ''}`}
                rows="3"
              />
              <div className={`word-counter ${wordCount > 10 ? 'error' : ''}`}>
                {wordCount}/10 words
              </div>
              {wordError && (
                <div className="error-message shake">
                  Please keep your quote within 10 words. Current: {wordCount} words.
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <h3>Preview Your Bookmark</h3>
            <button 
              className="preview-toggle"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            {showPreview && (
              <div className="bookmark-preview">
                <div 
                  className="preview-bookmark"
                  style={{ 
                    backgroundColor: colors.find(c => c.name === selectedColor)?.hex + '20',
                    borderColor: colors.find(c => c.name === selectedColor)?.hex
                  }}
                >
                  <div className="preview-design">
                    <strong>{designs[selectedDesign].name}</strong>
                  </div>
                  <div className="preview-color">
                    <div 
                      className="color-indicator"
                      style={{ backgroundColor: colors.find(c => c.name === selectedColor)?.hex }}
                    ></div>
                    {colors.find(c => c.name === selectedColor)?.label}
                  </div>
                  <div className="preview-quote">
                    {quote.trim() || 'Your quote will appear here...'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`add-to-cart-btn ${(wordCount > 10 || isAddingToCart) ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={wordCount > 10 || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div className="loading-spinner" />
                  Adding...
                </>
              ) : (
                '🛒 Add to Cart'
              )}
            </button>
            <button 
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={wordCount > 10 || isAddingToCart}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <span className="info-icon">🚚</span>
              <span>Free delivery on orders above ₹500</span>
            </div>
            <div className="info-item">
              <span className="info-icon">↩️</span>
              <span>Easy 7-day returns</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎨</span>
              <span>100% customizable</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .bookmark-product-page {
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e8e4ff 75%, #f8fafc 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          background-attachment: fixed;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 600;
          color: #1e293b;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .cart-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 600;
          color: #1e293b;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .cart-indicator:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .breadcrumb {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          font-weight: 400;
          max-width: 1400px;
          margin: 0 auto 2rem;
          padding: 2rem 2rem 0;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .breadcrumb:hover {
          opacity: 1;
        }

        .breadcrumb span:last-child {
          color: #3b82f6;
          font-weight: 600;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          max-width: 1400px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Left Section - Image, Dimensions, Product Details */
        .product-left-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .product-image-container {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(226, 232, 240, 0.6));
          cursor: zoom-in;
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .product-image-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.03) 50%, transparent 100%);
          z-index: 1;
          border-radius: 20px;
        }

        .product-image-container:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.12),
            0 8px 24px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .product-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          z-index: 2;
        }

        .product-image-container.zoomed .product-image {
          transform: scale(1.5);
        }

        .zoom-indicator {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(12px);
          color: white;
          padding: 0.75rem;
          border-radius: 12px;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
          z-index: 3;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dimensions, .product-description {
          background: rgba(248, 250, 252, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .dimensions h3, .product-description h3 {
          color: #1e293b;
          margin-bottom: 1rem;
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .dimensions p {
          margin: 0.5rem 0;
          color: #475569;
          font-weight: 500;
        }

        .product-description ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .product-description li {
          padding: 0.5rem 0;
          color: #475569;
          position: relative;
          padding-left: 2rem;
          font-weight: 500;
        }

        .product-description li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #22c55e;
          font-weight: bold;
          background: rgba(34, 197, 94, 0.1);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        /* Right Section - Product Info and Customization */
        .product-right-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .product-header h1 {
          font-size: 2.75rem;
          color: #0f172a;
          margin-bottom: 0.5rem;
          margin-top: 0;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0;
        }

        .stars {
          color: #f59e0b;
          font-size: 1.2rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .review-count {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .pricing {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(226, 232, 240, 0.5);
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .current-price {
          font-size: 2.25rem;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .original-price {
          font-size: 1.2rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        /* Customization Sections */
        .customization-section {
          padding: 1.5rem;
          background: rgba(248, 250, 252, 0.3);
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.2);
          transition: all 0.3s ease;
        }

        .customization-section:hover {
          background: rgba(248, 250, 252, 0.5);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .customization-section h3 {
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          margin-top: 0;
        }

        .design-options {
          display: grid;
          gap: 1rem;
        }

        .design-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
        }

        .design-option:hover {
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
        }

        .design-option.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
        }

        .design-option img {
          width: 50px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .design-name {
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.2rem 0;
        }

        .design-desc {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .color-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .color-option {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
        }

        .color-option:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);
        }

        .color-option.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
        }

        .color-swatch {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .color-label {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 600;
        }

        /* Quote Input */
        .quote-input-container {
          position: relative;
        }

        .quote-input {
          width: 100%;
          padding: 1.25rem 1.25rem 3rem 1.25rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          color: #1e293b;
        }

        .quote-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .quote-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .word-counter {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          pointer-events: none;
          z-index: 2;
        }

        .word-counter.error {
          color: #ef4444;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.95);
        }

        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          margin-top: 0.75rem;
          font-weight: 600;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.05);
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .shake {
          animation: shake 0.6s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }

        /* Preview Section */
        .preview-section h3 {
          color: #1e293b;
          margin-bottom: 1rem;
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.025em;
        }

        .preview-toggle {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
          font-size: 0.95rem;
        }

        .preview-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .bookmark-preview {
          margin-top: 1rem;
        }

        .preview-bookmark {
          padding: 2rem;
          border: 2px dashed;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .preview-design {
          margin-bottom: 1rem;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .preview-color {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #475569;
          font-weight: 500;
        }

        .color-indicator {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .preview-quote {
          font-style: italic;
          color: #1e293b;
          font-weight: 500;
          min-height: 1.5rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .add-to-cart-btn, .buy-now-btn {
          flex: 1;
          padding: 1.25rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .add-to-cart-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(59, 130, 246, 0.4);
        }

        .add-to-cart-btn.disabled {
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
          cursor: not-allowed;
          opacity: 0.6;
          transform: none !important;
          box-shadow: none;
        }

        .buy-now-btn {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);
        }

        .buy-now-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(15, 23, 42, 0.4);
        }

        .buy-now-btn:disabled {
          background: linear-gradient(135deg, #cbd5e1, #94a3b8);
          cursor: not-allowed;
          opacity: 0.6;
          transform: none !important;
          box-shadow: none;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Additional Info */
        .additional-info {
          background: rgba(248, 250, 252, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          color: #475569;
          font-weight: 500;
          border-bottom: 1px solid rgba(226, 232, 240, 0.2);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
            margin: 0 1rem;
          }

          .product-header h1 {
            font-size: 2.25rem;
          }

          .current-price {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 768px) {
          .bookmark-product-page {
            padding: 1rem 0;
          }

          .breadcrumb {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .product-container {
            padding: 1.5rem;
            border-radius: 16px;
            margin: 0 0.5rem;
          }

          .product-header h1 {
            font-size: 1.8rem;
          }

          .current-price {
            font-size: 1.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .color-options {
            grid-template-columns: repeat(2, 1fr);
          }

          .product-image {
            height: 400px;
          }

          .back-button, .cart-indicator {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            margin: 1rem;
            display: inline-block;
          }
        }

        @media (max-width: 480px) {
          .product-container {
            margin: 0 0.25rem;
            padding: 1rem;
          }

          .product-header h1 {
            font-size: 1.5rem;
          }

          .pricing {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .color-options {
            grid-template-columns: 1fr;
          }

          .design-option {
            padding: 1rem;
          }

          .product-image {
            height: 300px;
          }
        }

        /* Animation for smooth transitions */
        * {
          transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default InspirationalBookmarkPage;