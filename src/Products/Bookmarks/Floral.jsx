import React, { useState } from 'react';
import { useCart } from '../../Cart/CartPage.jsx'; // Adjust path based on your folder structure

const FloralBookmarksPage = ({ onBack, onNavigate }) => {
  const [selectedDesign, setSelectedDesign] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get cart functions from context
  const { addToCart, cartCount } = useCart();

  // Floral design options
  const floralDesigns = [
    { 
      id: 0, 
      name: 'Rose Garden', 
      preview: '/api/placeholder/80/120', 
      description: 'Classic red roses with green foliage',
      pattern: 'Elegant roses arranged in a cascading pattern'
    },
    { 
      id: 1, 
      name: 'Sunflower Bright', 
      preview: '/api/placeholder/80/120', 
      description: 'Vibrant sunflowers with sunny yellow petals',
      pattern: 'Large sunflower blooms with detailed centers'
    },
    { 
      id: 2, 
      name: 'Tulip Fields', 
      preview: '/api/placeholder/80/120', 
      description: 'Delicate tulips in spring colors',
      pattern: 'Mixed tulips in pink, purple, and white'
    },
    { 
      id: 3, 
      name: 'Cherry Blossom', 
      preview: '/api/placeholder/80/120', 
      description: 'Soft pink cherry blossoms on branches',
      pattern: 'Delicate sakura petals with brown branches'
    },
    { 
      id: 4, 
      name: 'Lavender Dreams', 
      preview: '/api/placeholder/80/120', 
      description: 'Peaceful purple lavender sprigs',
      pattern: 'Vertical lavender stems with tiny purple flowers'
    },
    { 
      id: 5, 
      name: 'Wildflower Mix', 
      preview: '/api/placeholder/80/120', 
      description: 'Assorted wildflowers in natural arrangement',
      pattern: 'Daisies, poppies, and grass in meadow style'
    },
    { 
      id: 6, 
      name: 'Lotus Serenity', 
      preview: '/api/placeholder/80/120', 
      description: 'Peaceful lotus flowers on water',
      pattern: 'Pink and white lotus with lily pads'
    },
    { 
      id: 7, 
      name: 'Hibiscus Tropical', 
      preview: '/api/placeholder/80/120', 
      description: 'Bold tropical hibiscus flowers',
      pattern: 'Large red and orange hibiscus with green leaves'
    }
  ];

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Enhanced Add to cart functionality with proper cart integration
  const handleAddToCart = () => {
    setIsAddingToCart(true);

    // Create standardized product object for cart with specifications
    const cartProduct = {
      id: 'floral-bookmark',
      name: 'Floral Bookmark',
      category: 'Bookmarks',
      price: 89,
      totalPrice: 89,
      basePrice: 89,
      quantity: 1,
      specifications: {
        design: floralDesigns[selectedDesign].name,
        pattern: floralDesigns[selectedDesign].pattern,
        description: floralDesigns[selectedDesign].description
      },
      image: 'src/Products/Bookmarks/Images/Floral.png',
      tags: ['Floral', 'Bookmark', 'Nature', 'Handmade'],
      rating: 4.9,
      reviews: 62,
      deliveryTime: '3-5 days'
    };

    // Add to cart using context
    addToCart(cartProduct);
    
    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      alert(`Successfully added ${floralDesigns[selectedDesign].name} Floral Bookmark to cart!`);
    }, 500);
  };

  const handleBuyNow = () => {
    // First add to cart, then navigate to cart page
    const cartProduct = {
      id: 'floral-bookmark',
      name: 'Floral Bookmark',
      category: 'Bookmarks',
      price: 89,
      totalPrice: 89,
      basePrice: 89,
      quantity: 1,
      specifications: {
        design: floralDesigns[selectedDesign].name,
        pattern: floralDesigns[selectedDesign].pattern,
        description: floralDesigns[selectedDesign].description
      },
      image: 'src/Products/Bookmarks/Images/Floral.png',
      tags: ['Floral', 'Bookmark', 'Nature', 'Handmade'],
      rating: 4.9,
      reviews: 62,
      deliveryTime: '3-5 days'
    };

    addToCart(cartProduct);
    
    // Navigate to cart page if onNavigate function is available
    if (onNavigate) {
      onNavigate('cart');
    } else {
      alert('Added Floral Bookmark to cart! Please go to cart to checkout.');
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
        <span>Home</span> / <span>Bookmarks</span> / <span>Floral Bookmarks</span>
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
              src="src/Products/Bookmarks/Images/Floral.png" 
              alt="Floral Bookmark"
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
              <li>High-resolution floral prints</li>
              <li>Waterproof and fade-resistant finish</li>
              <li>Perfect for daily use and gifting</li>
              <li>Botanically inspired designs</li>
              <li>Ideal for nature and flower lovers</li>
            </ul>
          </div>
        </div>

        {/* Right side - Product Info and Customization */}
        <div className="product-right-section">
          <div className="product-header">
            <h1>Floral Bookmarks</h1>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="review-count">(62 reviews)</span>
            </div>
          </div>

          <div className="pricing">
            <span className="current-price">₹89</span>
            <span className="original-price">₹129</span>
            <span className="discount-badge">31% OFF</span>
          </div>

          {/* Floral Design Selection */}
          <div className="customization-section">
            <h3>Choose Your Floral Design</h3>
            <p className="section-description">Select from our beautiful collection of floral patterns</p>
            <div className="design-options">
              {floralDesigns.map((design) => (
                <div 
                  key={design.id}
                  className={`design-option ${selectedDesign === design.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDesign(design.id)}
                >
                  <img src={design.preview} alt={design.name} />
                  <div className="design-info">
                    <p className="design-name">{design.name}</p>
                    <p className="design-desc">{design.description}</p>
                    <p className="design-pattern">{design.pattern}</p>
                  </div>
                </div>
              ))}
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
                <div className="preview-bookmark floral-preview">
                  <div className="preview-design">
                    <div className="floral-icon">🌸</div>
                    <strong>{floralDesigns[selectedDesign].name}</strong>
                  </div>
                  <div className="preview-pattern">
                    <em>{floralDesigns[selectedDesign].pattern}</em>
                  </div>
                  <div className="preview-description">
                    {floralDesigns[selectedDesign].description}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`add-to-cart-btn ${isAddingToCart ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
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
              disabled={isAddingToCart}
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
              <span className="info-icon">🌺</span>
              <span>Hand-selected floral designs</span>
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
          background: linear-gradient(135deg, #fdf2f8 0%, #ecfdf5 25%, #f0fdf4 50%, #fef3e2 75%, #fdf2f8 100%);
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
          color: #ec4899;
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
          background: linear-gradient(135deg, rgba(253, 242, 248, 0.9), rgba(236, 253, 245, 0.6));
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
          background: linear-gradient(135deg, transparent 0%, rgba(236, 72, 153, 0.03) 50%, transparent 100%);
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
          background: rgba(253, 242, 248, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(251, 207, 232, 0.3);
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
          content: '🌸';
          position: absolute;
          left: 0;
          background: rgba(236, 72, 153, 0.1);
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
          border-top: 1px solid rgba(251, 207, 232, 0.5);
          border-bottom: 1px solid rgba(251, 207, 232, 0.5);
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
          background: linear-gradient(135deg, #ec4899, #db2777);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }

        /* Customization Sections */
        .customization-section {
          padding: 1.5rem;
          background: rgba(253, 242, 248, 0.3);
          border-radius: 16px;
          border: 1px solid rgba(251, 207, 232, 0.2);
          transition: all 0.3s ease;
        }

        .customization-section:hover {
          background: rgba(253, 242, 248, 0.5);
          border-color: rgba(236, 72, 153, 0.2);
        }

        .customization-section h3 {
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          margin-top: 0;
        }

        .section-description {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          margin-top: 0;
          font-weight: 500;
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
          border: 2px solid rgba(251, 207, 232, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
        }

        .design-option:hover {
          border-color: #ec4899;
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
        }

        .design-option.selected {
          border-color: #ec4899;
          background: rgba(236, 72, 153, 0.05);
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.15);
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
          margin: 0 0 0.3rem 0;
          font-weight: 500;
        }

        .design-pattern {
          font-size: 0.8rem;
          color: #ec4899;
          margin: 0;
          font-weight: 600;
          font-style: italic;
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
          background: linear-gradient(135deg, #ec4899, #be185d);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          margin-bottom: 1rem;
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
          font-size: 0.95rem;
        }

        .preview-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
        }

        .bookmark-preview {
          margin-top: 1rem;
        }

        .preview-bookmark {
          padding: 2rem;
          border: 2px dashed #ec4899;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .floral-preview {
          background: linear-gradient(135deg, rgba(253, 242, 248, 0.8), rgba(255, 255, 255, 0.9));
        }

        .preview-design {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .floral-icon {
          font-size: 1.3rem;
        }

        .preview-pattern {
          margin-bottom: 1rem;
          color: #ec4899;
          font-weight: 500;
          font-size: 1rem;
        }

        .preview-description {
          color: #475569;
          font-weight: 500;
          min-height: 1.5rem;
          font-size: 0.95rem;
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
          background: linear-gradient(135deg, #ec4899, #be185d);
          color: white;
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
        }

        .add-to-cart-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(236, 72, 153, 0.4);
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
          background: rgba(253, 242, 248, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(251, 207, 232, 0.3);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          color: #475569;
          font-weight: 500;
          border-bottom: 1px solid rgba(251, 207, 232, 0.2);
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

export default FloralBookmarksPage;