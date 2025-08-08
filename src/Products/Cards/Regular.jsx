import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../Cart/CartPage.jsx'; // Adjust path based on your folder structure

const RegularCardPage = ({ onBack, onNavigate }) => {
  const [message, setMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [wordError, setWordError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarAddon, setCalendarAddon] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const fileInputRef = useRef(null);

  // Get cart functions from context
  const { addToCart, cartCount } = useCart();

  // Occasion options
  const occasions = [
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'anniversary', name: 'Anniversary', icon: '💕' },
    { id: 'wedding', name: 'Wedding', icon: '💍' },
    { id: 'graduation', name: 'Graduation', icon: '🎓' },
    { id: 'valentine', name: 'Valentine\'s Day', icon: '❤️' },
    { id: 'mothers-day', name: 'Mother\'s Day', icon: '🌸' },
    { id: 'fathers-day', name: 'Father\'s Day', icon: '👔' },
    { id: 'christmas', name: 'Christmas', icon: '🎄' },
    { id: 'other', name: 'Other', icon: '🎁' }
  ];

  // Handle message input and word count
  useEffect(() => {
    const words = message.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    if (words.length > 30 && message.trim() !== '') {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
    } else {
      setWordError(false);
    }
  }, [message]);

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB');
      return;
    }

    setImageError('');
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate total price
  const getPrice = () => {
    const basePrice = 299;
    const calendarPrice = calendarAddon ? 149 : 0;
    return basePrice + calendarPrice;
  };

  const getOriginalPrice = () => {
    const basePrice = 449;
    const calendarPrice = calendarAddon ? 199 : 0;
    return basePrice + calendarPrice;
  };

  // Enhanced Add to cart functionality with proper cart integration
  const handleAddToCart = () => {
    if (wordCount > 30) {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
      return;
    }

    if (!uploadedImage) {
      alert('Please upload an image for your card');
      return;
    }

    if (!selectedOccasion) {
      alert('Please select an occasion');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    setIsAddingToCart(true);

    // Create standardized product object for cart with specifications
    const cartProduct = {
      id: 'regular-card',
      name: 'Regular Card',
      category: 'Cards',
      price: getPrice(),
      totalPrice: getPrice(),
      basePrice: getPrice(),
      quantity: 1,
      specifications: {
        message: message.trim() || 'No message',
        wordCount: wordCount,
        occasion: occasions.find(o => o.id === selectedOccasion)?.name || 'Not selected',
        date: selectedDate,
        formattedDate: formatDate(selectedDate),
        calendarAddon: calendarAddon ? 'Yes' : 'No',
        hasImage: !!uploadedImage,
        imageName: uploadedImage?.name || 'No image',
        imageSize: uploadedImage ? `${(uploadedImage.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'
      },
      image: 'src/Products/Cards/Images/Regular.png',
      tags: ['Regular', 'Card', 'Custom', 'Personalized'],
      rating: 4.9,
      reviews: 124,
      deliveryTime: '3-5 days'
    };

    // Add to cart using context
    addToCart(cartProduct);
    
    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      alert('Successfully added Regular Card to cart with your customizations!');
    }, 500);
  };

  const handleBuyNow = () => {
    if (wordCount > 30) {
      setWordError(true);
      setTimeout(() => setWordError(false), 600);
      return;
    }

    if (!uploadedImage) {
      alert('Please upload an image for your card');
      return;
    }

    if (!selectedOccasion) {
      alert('Please select an occasion');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    // First add to cart, then navigate to cart page
    const cartProduct = {
      id: 'regular-card',
      name: 'Regular Card',
      category: 'Cards',
      price: getPrice(),
      totalPrice: getPrice(),
      basePrice: getPrice(),
      quantity: 1,
      specifications: {
        message: message.trim() || 'No message',
        wordCount: wordCount,
        occasion: occasions.find(o => o.id === selectedOccasion)?.name || 'Not selected',
        date: selectedDate,
        formattedDate: formatDate(selectedDate),
        calendarAddon: calendarAddon ? 'Yes' : 'No',
        hasImage: !!uploadedImage,
        imageName: uploadedImage?.name || 'No image',
        imageSize: uploadedImage ? `${(uploadedImage.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'
      },
      image: 'src/Products/Cards/Images/Regular.png',
      tags: ['Regular', 'Card', 'Custom', 'Personalized'],
      rating: 4.9,
      reviews: 124,
      deliveryTime: '3-5 days'
    };

    addToCart(cartProduct);
    
    // Navigate to cart page if onNavigate function is available
    if (onNavigate) {
      onNavigate('cart');
    } else {
      alert('Added Regular Card to cart! Please go to cart to checkout.');
    }
  };

  return (
    <div className="card-product-page">
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
        <span>Home</span> / <span>Cards</span> / <span>Regular Cards</span>
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
              src="src/Products/Cards/Images/Regular.png" 
              alt="Regular Card"
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
            <p><strong>Size:</strong> 21cm × 29.7cm (A4 Size)</p>
            <p><strong>Thickness:</strong> 300gsm Premium Cardstock</p>
            <p><strong>Weight:</strong> 45g</p>
          </div>

          {/* Product Details below dimensions */}
          <div className="product-description">
            <h3>Product Details</h3>
            <ul>
              <li>Premium A4 sized greeting card</li>
              <li>High-quality photo printing on cardstock</li>
              <li>Personalized message inside</li>
              <li>Includes matching envelope</li>
              <li>Professional matte or gloss finish</li>
              <li>Perfect for special occasions</li>
            </ul>
          </div>
        </div>

        {/* Right side - Product Info and Customization */}
        <div className="product-right-section">
          <div className="product-header">
            <h1>Regular Cards</h1>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="review-count">(124 reviews)</span>
            </div>
          </div>

          <div className="pricing">
            <span className="current-price">₹{getPrice()}</span>
            <span className="original-price">₹{getOriginalPrice()}</span>
            <span className="discount-badge">33% OFF</span>
          </div>

          {/* Image Upload Section */}
          <div className="customization-section">
            <h3>Upload Your Image</h3>
            <div className="image-upload-container">
              {!imagePreview ? (
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                  <div className="upload-icon">📸</div>
                  <p className="upload-text">Click to upload your photo</p>
                  <p className="upload-subtext">JPEG, PNG, or GIF • Max 5MB</p>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Uploaded preview" className="image-preview" />
                  <div className="image-actions">
                    <button 
                      className="change-image-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Image
                    </button>
                    <button className="remove-image-btn" onClick={removeImage}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden-file-input"
              />
              {imageError && (
                <div className="error-message">
                  {imageError}
                </div>
              )}
            </div>
          </div>

          {/* Occasion Selection */}
          <div className="customization-section">
            <h3>Select Occasion</h3>
            <div className="occasion-options">
              {occasions.map((occasion) => (
                <div 
                  key={occasion.id}
                  className={`occasion-option ${selectedOccasion === occasion.id ? 'selected' : ''}`}
                  onClick={() => setSelectedOccasion(occasion.id)}
                >
                  <span className="occasion-icon">{occasion.icon}</span>
                  <span className="occasion-name">{occasion.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="customization-section">
            <h3>Select Date</h3>
            <div className="date-input-container">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              {selectedDate && (
                <div className="selected-date-display">
                  Selected: {formatDate(selectedDate)}
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="customization-section">
            <h3>Add Your Personal Message</h3>
            <div className="message-input-container">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your heartfelt message (25-30 words recommended)"
                className={`message-input ${wordError ? 'error' : ''}`}
                rows="4"
              />
              <div className={`word-counter ${wordCount > 30 ? 'error' : ''}`}>
                {wordCount}/30 words
              </div>
              {wordError && (
                <div className="error-message shake">
                  Please keep your message within 30 words. Current: {wordCount} words.
                </div>
              )}
              {wordCount >= 25 && wordCount <= 30 && (
                <div className="success-message">
                  Perfect message length! ✨
                </div>
              )}
            </div>
          </div>

          {/* Calendar Add-on */}
          <div className="customization-section">
            <h3>Calendar Add-on</h3>
            <div className="addon-container">
              <label className="addon-option">
                <input
                  type="checkbox"
                  checked={calendarAddon}
                  onChange={(e) => setCalendarAddon(e.target.checked)}
                />
                <div className="addon-content">
                  <div className="addon-icon">📅</div>
                  <div className="addon-details">
                    <h4>Personalized Calendar</h4>
                    <p>Get a beautiful calendar with your special date highlighted with a heart</p>
                    <span className="addon-price">+₹149 (Was ₹199)</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <h3>Preview Your Card</h3>
            <button 
              className="preview-toggle"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            {showPreview && (
              <div className="card-preview">
                <div className="preview-card">
                  <div className="preview-header">Your Custom Card</div>
                  
                  {imagePreview && (
                    <div className="preview-image-container">
                      <img src={imagePreview} alt="Card preview" className="preview-image" />
                    </div>
                  )}
                  
                  <div className="preview-details">
                    <div className="preview-occasion">
                      {selectedOccasion && (
                        <span>
                          {occasions.find(o => o.id === selectedOccasion)?.icon} 
                          {occasions.find(o => o.id === selectedOccasion)?.name}
                        </span>
                      )}
                    </div>
                    
                    {selectedDate && (
                      <div className="preview-date">
                        📅 {formatDate(selectedDate)}
                      </div>
                    )}
                    
                    <div className="preview-message">
                      {message.trim() || 'Your personal message will appear here...'}
                    </div>
                    
                    {calendarAddon && (
                      <div className="preview-addon">
                        ✨ Includes personalized calendar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`add-to-cart-btn ${(wordCount > 30 || !uploadedImage || !selectedOccasion || !selectedDate || isAddingToCart) ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={wordCount > 30 || !uploadedImage || !selectedOccasion || !selectedDate || isAddingToCart}
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
              disabled={wordCount > 30 || !uploadedImage || !selectedOccasion || !selectedDate || isAddingToCart}
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
            <div className="info-item">
              <span className="info-icon">📦</span>
              <span>Carefully packaged with envelope</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .card-product-page {
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

        /* Left Section */
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

        /* Right Section */
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

        /* Image Upload */
        .image-upload-container {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.5);
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .upload-subtext {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .image-preview-container {
          text-align: center;
        }

        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        .image-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .change-image-btn, .remove-image-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .change-image-btn {
          background: #3b82f6;
          color: white;
        }

        .remove-image-btn {
          background: #ef4444;
          color: white;
        }

        .change-image-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .remove-image-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .hidden-file-input {
          display: none;
        }

        /* Occasion Options */
        .occasion-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        .occasion-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
        }

        .occasion-option:hover {
          border-color: #3b82f6;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);
        }

        .occasion-option.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
        }

        .occasion-icon {
          font-size: 1.5rem;
        }

        .occasion-name {
          font-weight: 600;
          color: #1e293b;
        }

        /* Date Input */
        .date-input-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .date-input {
          padding: 1rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          transition: border-color 0.3s ease;
        }

        .date-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .selected-date-display {
          color: #059669;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1rem;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        /* Message Input */
        .message-input-container {
          position: relative;
        }

        .message-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          resize: vertical;
          min-height: 120px;
        }

        .message-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .message-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
        }

        .word-counter {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #64748b;
          border: 1px solid rgba(226, 232, 240, 0.3);
        }

        .word-counter.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .error-message {
          color: #ef4444;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.1);
        }

        .error-message.shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .success-message {
          color: #059669;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.1);
        }

        /* Calendar Add-on */
        .addon-container {
          width: 100%;
        }

        .addon-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 2px solid rgba(226, 232, 240, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.7);
        }

        .addon-option:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.02);
        }

        .addon-option input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #3b82f6;
        }

        .addon-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .addon-icon {
          font-size: 2rem;
        }

        .addon-details h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .addon-details p {
          margin: 0 0 0.5rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .addon-price {
          color: #059669;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Preview Section */
        .preview-toggle {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
        }

        .preview-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .card-preview {
          margin-top: 1.5rem;
          animation: slideDown 0.4s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .preview-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(226, 232, 240, 0.3);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .preview-header {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(226, 232, 240, 0.3);
        }

        .preview-image-container {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .preview-image {
          max-width: 200px;
          max-height: 150px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .preview-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-occasion, .preview-date, .preview-addon {
          font-weight: 600;
          color: #475569;
          font-size: 0.95rem;
        }

        .preview-message {
          font-style: italic;
          color: #1e293b;
          font-size: 1rem;
          line-height: 1.6;
          padding: 1rem;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .add-to-cart-btn, .buy-now-btn {
          flex: 1;
          padding: 1.25rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          box-shadow: 0 6px 20px rgba(30, 41, 59, 0.3);
        }

        .add-to-cart-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(30, 41, 59, 0.4);
        }

        .add-to-cart-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .buy-now-btn {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
        }

        .buy-now-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(5, 150, 105, 0.4);
        }

        .buy-now-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
          padding: 2rem;
          background: rgba(248, 250, 252, 0.3);
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.2);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #475569;
          font-weight: 500;
        }

        .info-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 2rem;
            margin: 1rem;
          }

          .product-header h1 {
            font-size: 2.25rem;
          }

          .occasion-options {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .card-product-page {
            background-attachment: scroll;
          }

          .breadcrumb {
            padding: 1rem;
            font-size: 0.8rem;
          }

          .product-container {
            padding: 1.5rem;
            margin: 0.5rem;
            gap: 2rem;
          }

          .product-header h1 {
            font-size: 1.875rem;
          }

          .current-price {
            font-size: 1.875rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .occasion-options {
            grid-template-columns: 1fr;
          }

          .additional-info {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .customization-section {
            padding: 1rem;
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
            padding: 1rem;
          }

          .product-header h1 {
            font-size: 1.5rem;
          }

          .current-price {
            font-size: 1.5rem;
          }

          .upload-area {
            padding: 1.5rem;
          }

          .upload-icon {
            font-size: 2rem;
          }

          .message-input {
            min-height: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegularCardPage;