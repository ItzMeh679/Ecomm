import React, { useState } from 'react';

const TulipCrochetPage = ({ onBack, product }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);

  // Handle mouse move for zoom effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Add to cart functionality
  const handleAddToCart = () => {
    const orderSpecs = {
      product: 'Tulip Crochet',
      quantity: quantity,
      price: '₹399',
      originalPrice: '₹499',
      discount: '20% OFF',
      timestamp: new Date().toISOString()
    };

    console.log('Adding to cart with specifications:', orderSpecs);
    alert(`Added ${quantity} Tulip Crochet(s) to cart successfully!`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity} Tulip Crochet(s)`);
  };

  const styles = {
    page: {
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3e2 0%, #fde68a 25%, #f59e0b 50%, #dc2626 75%, #be185d 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      margin: '0',
      padding: '0',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      backgroundAttachment: 'fixed',
      boxSizing: 'border-box'
    },
    backButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      color: '#1e293b',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      zIndex: 10
    },
    breadcrumb: {
      color: '#8b5cf6',
      marginBottom: '2rem',
      fontSize: '0.9rem',
      fontWeight: '400',
      maxWidth: '1400px',
      margin: '0 auto 2rem',
      padding: '2rem 2rem 0',
      opacity: '0.8'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '3rem',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)',
      maxWidth: '1400px',
      margin: '0 auto',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    imageContainer: {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(190, 24, 93, 0.05))',
      cursor: 'zoom-in',
      boxShadow: '0 12px 32px rgba(245, 158, 11, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      transform: isZoomed ? 'translateY(-2px)' : 'none'
    },
    productImage: {
      width: '100%',
      height: '500px',
      objectFit: 'cover',
      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
      transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
    },
    zoomIndicator: {
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '0.8rem',
      fontWeight: '500',
      opacity: isZoomed ? 1 : 0,
      zIndex: 3,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'opacity 0.4s ease'
    },
    dimensions: {
      background: 'rgba(245, 158, 11, 0.05)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    sectionTitle: {
      color: '#1e293b',
      marginBottom: '1rem',
      marginTop: '0',
      fontSize: '1.25rem',
      fontWeight: '600',
      letterSpacing: '-0.025em'
    },
    dimensionText: {
      margin: '0.5rem 0',
      color: '#475569',
      fontWeight: '500'
    },
    productDescription: {
      background: 'rgba(245, 158, 11, 0.05)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    featureList: {
      listStyle: 'none',
      padding: '0',
      margin: '0'
    },
    featureItem: {
      padding: '0.5rem 0',
      color: '#475569',
      position: 'relative',
      paddingLeft: '2rem',
      fontWeight: '500'
    },
    rightSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    productHeader: {
      marginBottom: '1rem'
    },
    productTitle: {
      fontSize: '2.75rem',
      color: '#0f172a',
      marginBottom: '0.5rem',
      marginTop: '0',
      fontWeight: '700',
      letterSpacing: '-0.025em',
      lineHeight: '1.1',
      background: 'linear-gradient(135deg, #f59e0b, #be185d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0'
    },
    stars: {
      color: '#f59e0b',
      fontSize: '1.2rem',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    reviewCount: {
      color: '#64748b',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    pricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(245, 158, 11, 0.3)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
    },
    currentPrice: {
      fontSize: '2.25rem',
      color: '#0f172a',
      fontWeight: '800',
      letterSpacing: '-0.025em'
    },
    originalPrice: {
      fontSize: '1.2rem',
      color: '#94a3b8',
      textDecoration: 'line-through',
      fontWeight: '500'
    },
    discountBadge: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      padding: '0.4rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '700',
      letterSpacing: '0.025em',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
    },
    overview: {
      padding: '1.5rem',
      background: 'rgba(245, 158, 11, 0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(245, 158, 11, 0.15)'
    },
    overviewText: {
      color: '#475569',
      lineHeight: '1.7',
      margin: '0',
      fontWeight: '500'
    },
    quantitySection: {
      padding: '1.5rem',
      background: 'rgba(245, 158, 11, 0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(245, 158, 11, 0.15)'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    quantityBtn: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
    },
    quantityDisplay: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1e293b',
      minWidth: '2rem',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    stockInfo: {
      color: '#059669',
      fontWeight: '600',
      margin: '0',
      fontSize: '0.9rem'
    },
    careInstructions: {
      padding: '1.5rem',
      background: 'rgba(245, 158, 11, 0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(245, 158, 11, 0.15)'
    },
    careGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem'
    },
    careItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#475569',
      fontWeight: '500',
      fontSize: '0.9rem'
    },
    careIcon: {
      fontSize: '1.1rem'
    },
    actionButtons: {
      display: 'flex',
      gap: '1rem'
    },
    actionBtn: {
      flex: '1',
      padding: '1.25rem 2rem',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
      letterSpacing: '0.025em'
    },
    addToCartBtn: {
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)'
    },
    buyNowBtn: {
      background: 'linear-gradient(135deg, #be185d, #9d174d)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(190, 24, 93, 0.3)'
    },
    additionalInfo: {
      background: 'rgba(245, 158, 11, 0.05)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 0',
      color: '#475569',
      fontWeight: '500',
      borderBottom: '1px solid rgba(245, 158, 11, 0.1)'
    },
    infoIcon: {
      fontSize: '1.2rem',
      width: '24px',
      textAlign: 'center'
    }
  };

  // Responsive styles for mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    styles.container.gridTemplateColumns = '1fr';
    styles.container.gap = '2rem';
    styles.container.padding = '2rem';
    styles.container.margin = '0 1rem';
    styles.productTitle.fontSize = '2rem';
    styles.currentPrice.fontSize = '1.8rem';
    styles.careGrid.gridTemplateColumns = '1fr';
    styles.actionButtons.flexDirection = 'column';
    styles.productImage.height = '400px';
  }

  return (
    <div style={styles.page}>
      {/* Back Button */}
      {onBack && (
        <button 
          style={styles.backButton}
          onClick={onBack}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }}
        >
          ← Back to Products
        </button>
      )}

      {/* Navigation breadcrumb */}
      <div style={styles.breadcrumb}>
        <span>Home</span> / <span>Crochet</span> / <span style={{ color: '#f59e0b', fontWeight: '600' }}>Tulip Crochet</span>
      </div>

      <div style={styles.container}>
        {/* Left side - Product Image, Dimensions, and Product Details */}
        <div style={styles.leftSection}>
          <div 
            style={styles.imageContainer}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src="/src/Products/Crochet/Images/tulip.png" 
              alt="Tulip Crochet"
              style={styles.productImage}
            />
            {isZoomed && (
              <div style={styles.zoomIndicator}>
                Hover to zoom • Click to view full size
              </div>
            )}
          </div>

          {/* Dimensions below image */}
          <div style={styles.dimensions}>
            <h3 style={styles.sectionTitle}>Dimensions</h3>
            <p style={styles.dimensionText}><strong>Height:</strong> 30cm</p>
            <p style={styles.dimensionText}><strong>Width:</strong> 12cm</p>
            <p style={styles.dimensionText}><strong>Depth:</strong> 12cm</p>
            <p style={styles.dimensionText}><strong>Weight:</strong> 120g</p>
          </div>

          {/* Product Details below dimensions */}
          <div style={styles.productDescription}>
            <h3 style={styles.sectionTitle}>Product Details</h3>
            <ul style={styles.featureList}>
              {[
                '100% hand-crocheted with premium cotton yarn',
                'Beautiful tulip design in vibrant spring colors',
                'Realistic flower petals with intricate detailing',
                'Durable construction with secure stitching',
                'Perfect home decor piece for any season',
                'Long-lasting artificial flower alternative',
                'Unique handmade piece - each one is special',
                'Easy to maintain, no watering required'
              ].map((feature, index) => (
                <li key={index} style={{...styles.featureItem, position: 'relative'}}>
                  <span style={{
                    content: '🌷',
                    position: 'absolute',
                    left: '0',
                    background: 'rgba(245, 158, 11, 0.1)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}>🌷</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right side - Product Info and Purchase Options */}
        <div style={styles.rightSection}>
          <div style={styles.productHeader}>
            <h1 style={styles.productTitle}>Tulip Crochet</h1>
            <div style={styles.rating}>
              <span style={styles.stars}>★★★★★</span>
              <span style={styles.reviewCount}>(72 reviews)</span>
            </div>
          </div>

          <div style={styles.pricing}>
            <span style={styles.currentPrice}>₹399</span>
            <span style={styles.originalPrice}>₹499</span>
            <span style={styles.discountBadge}>20% OFF</span>
          </div>

          {/* Product Description */}
          <div style={styles.overview}>
            <h3 style={styles.sectionTitle}>About This Product</h3>
            <p style={styles.overviewText}>
              Bring the beauty of spring into your home with this exquisite hand-crocheted tulip! 
              Crafted with meticulous attention to detail, this stunning piece features vibrant colors 
              and realistic petal textures that capture the essence of a fresh tulip bloom. Perfect for 
              home decoration, gifts, or adding a touch of nature to any space without the maintenance 
              of real flowers.
            </p>
          </div>

          {/* Quantity Selection */}
          <div style={styles.quantitySection}>
            <h3 style={styles.sectionTitle}>Quantity</h3>
            <div style={styles.quantityControls}>
              <button 
                style={styles.quantityBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                }}
              >
                -
              </button>
              <span style={styles.quantityDisplay}>{quantity}</span>
              <button 
                style={styles.quantityBtn}
                onClick={() => setQuantity(quantity + 1)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                }}
              >
                +
              </button>
            </div>
            <p style={styles.stockInfo}>✅ In Stock - Ready to Ship</p>
          </div>

          {/* Care Instructions */}
          <div style={styles.careInstructions}>
            <h3 style={styles.sectionTitle}>Care Instructions</h3>
            <div style={styles.careGrid}>
              {[
                { icon: '🧼', text: 'Gentle hand wash if needed' },
                { icon: '🌬️', text: 'Air dry completely' },
                { icon: '🧹', text: 'Dust regularly with soft brush' },
                { icon: '☀️', text: 'Keep away from direct sunlight' }
              ].map((care, index) => (
                <div key={index} style={styles.careItem}>
                  <span style={styles.careIcon}>{care.icon}</span>
                  <span>{care.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button 
              style={{...styles.actionBtn, ...styles.addToCartBtn}}
              onClick={handleAddToCart}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 32px rgba(245, 158, 11, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.3)';
              }}
            >
              Add to Cart
            </button>
            <button 
              style={{...styles.actionBtn, ...styles.buyNowBtn}}
              onClick={handleBuyNow}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 32px rgba(190, 24, 93, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(190, 24, 93, 0.3)';
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div style={styles.additionalInfo}>
            {[
              { icon: '🚚', text: 'Free delivery on orders above ₹500' },
              { icon: '↩️', text: 'Easy 7-day returns' },
              { icon: '🧶', text: 'Handmade with premium cotton yarn' },
              { icon: '🌷', text: 'Perfect spring home decoration' }
            ].map((info, index) => (
              <div key={index} style={{...styles.infoItem, borderBottom: index === 3 ? 'none' : styles.infoItem.borderBottom}}>
                <span style={styles.infoIcon}>{info.icon}</span>
                <span>{info.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TulipCrochetPage;