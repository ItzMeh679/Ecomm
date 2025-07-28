import React, { useState, useEffect, useRef } from 'react';

// Letter Products Logic Class
class LetterProducts {
  static backgrounds = {
    vintage: {
      name: 'Vintage Background',
      fonts: ['Normal', 'Calligraphy'],
      pricing: { Normal: 100, Calligraphy: 120 }
    }
  };

  static occasions = {
    birthday: "Happy Birthday! Wishing you a day filled with happiness and a year filled with joy. May all your dreams come true and may you have a wonderful celebration surrounded by those who love you most.",
    anniversary: "Happy Anniversary! Today marks another year of your beautiful journey together. May your love continue to grow stronger with each passing day and may you create many more precious memories together.",
    wedding: "Congratulations on your wedding day! May your marriage be filled with love, laughter, and endless happiness. Wishing you both a lifetime of beautiful moments and unconditional love.",
    graduation: "Congratulations on your graduation! Your hard work and dedication have paid off. As you embark on this new chapter, may you find success and fulfillment in all your future endeavors.",
    valentine: "Happy Valentine's Day! You fill my heart with joy and my life with love. Thank you for being the most wonderful person in my life. I love you more than words can express.",
    mothersDay: "Happy Mother's Day! Thank you for your endless love, support, and guidance. You are the heart of our family and we are so grateful for everything you do. You are truly amazing.",
    fathersDay: "Happy Father's Day! Thank you for being our hero, our guide, and our biggest supporter. Your strength and wisdom inspire us every day. We are so lucky to have you as our father.",
    christmas: "Merry Christmas! May this festive season bring you joy, peace, and happiness. Wishing you and your loved ones a magical holiday filled with warmth, love, and beautiful memories."
  };

  static getWordsPerPage(font) {
    return font === 'Calligraphy' ? 55 : 100;
  }

  static validateLetterConfiguration(config) {
    const { font, text } = config;
    const bgConfig = this.backgrounds.vintage;
    
    if (!bgConfig.fonts.includes(font)) return { valid: false, error: 'Invalid font for vintage background' };
    if (!text.trim()) return { valid: false, error: 'Message cannot be empty' };
    
    return { valid: true };
  }

  static createLetterProduct(config) {
    const validation = this.validateLetterConfiguration(config);
    if (!validation.valid) throw new Error(validation.error);
    
    const bgConfig = this.backgrounds.vintage;
    const basePrice = bgConfig.pricing[config.font];
    const burntEdgesPrice = config.burntEdges ? 50 : 0;
    const totalPrice = (basePrice + burntEdgesPrice) * config.pages;
    
    return {
      ...config,
      background: 'vintage',
      basePrice,
      burntEdgesPrice,
      totalPrice,
      timestamp: new Date().toISOString()
    };
  }
}

const VintageLetterPage = () => {
  // State variables
  const [font, setFont] = useState('Normal');
  const [burntEdges, setBurntEdges] = useState(false);
  const [type, setType] = useState('custom');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [wordStatus, setWordStatus] = useState('good');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const textareaRef = useRef(null);

  // Helper function to count words
  const countWords = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Get price calculation
  const getPrice = () => {
    const bgConfig = LetterProducts.backgrounds.vintage;
    const basePrice = bgConfig.pricing[font];
    const burntEdgesPrice = burntEdges ? 50 : 0;
    return (basePrice + burntEdgesPrice) * pages;
  };

  // Effect: When text or font changes
  useEffect(() => {
    const words = countWords(text);
    setWordCount(words);
    
    const wordsPerPage = LetterProducts.getWordsPerPage(font);
    const calculatedPages = Math.max(1, Math.ceil(words / wordsPerPage));
    setPages(calculatedPages);
    
    // Word status logic
    const idealLimit = font === 'Calligraphy' ? 50 : 90;
    if (words <= idealLimit) {
      setWordStatus('good');
    } else if (words <= wordsPerPage * calculatedPages) {
      setWordStatus('warning');
    } else {
      setWordStatus('error');
    }
  }, [text, font]);

  // Effect: When type is occasion and occasion changes
  useEffect(() => {
    if (type === 'occasion' && selectedOccasion && LetterProducts.occasions[selectedOccasion]) {
      setText(LetterProducts.occasions[selectedOccasion]);
    }
  }, [type, selectedOccasion]);

  // Effect: When font not valid for vintage
  useEffect(() => {
    const bgConfig = LetterProducts.backgrounds.vintage;
    
    // Validate font
    if (!bgConfig.fonts.includes(font)) {
      setFont(bgConfig.fonts[0]);
    }
  }, [font]);

  // Handle add to cart
  const handleAddToCart = () => {
    try {
      const config = {
        font,
        burntEdges,
        type,
        text: text.trim(),
        pages,
        occasion: type === 'occasion' ? selectedOccasion : null
      };

      const validation = LetterProducts.validateLetterConfiguration(config);
      if (!validation.valid) {
        setErrors({ general: validation.error });
        return;
      }

      // Check word limits
      const wordsPerPage = LetterProducts.getWordsPerPage(font);
      if (wordCount > wordsPerPage * pages) {
        setErrors({ words: `Text exceeds ${wordsPerPage * pages} words limit for ${pages} page(s)` });
        return;
      }

      const product = LetterProducts.createLetterProduct(config);
      console.log('Adding vintage letter to cart:', product);
      alert('Vintage Letter added to cart successfully!');
      setErrors({});
      
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const getWordCountColor = () => {
    switch (wordStatus) {
      case 'good': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getWordStatusMessage = () => {
    const wordsPerPage = LetterProducts.getWordsPerPage(font);
    const maxWords = wordsPerPage * pages;
    
    if (wordStatus === 'error') {
      return `Reduce words or add another page. Current: ${wordCount}, Max: ${maxWords}`;
    }
    if (wordStatus === 'warning') {
      return `Consider reducing words for optimal formatting. Current: ${wordCount}`;
    }
    return `Perfect word count! Current: ${wordCount}`;
  };

  // Styles object
  const styles = {
    page: {
      width: '100vw',
      minHeight: '100vh',
      margin: '0',
      padding: '0',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      background: 'linear-gradient(135deg, rgb(245 243 237), rgb(250 248 244))',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundAttachment: 'fixed',
      boxSizing: 'border-box'
    },
    breadcrumb: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    breadcrumbLink: {
      color: '#a16207',
      fontWeight: '600'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    rightSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    imageContainer: {
      position: 'relative'
    },
    productImage: {
      background: 'linear-gradient(135deg, rgb(245 243 237), rgb(250 248 244))',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    imageInner: {
      aspectRatio: '3/4',
      background: '#f7f3e9',
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },
    vintageBg: {
      position: 'absolute',
      inset: '0',
      background: 'radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.1) 0%, transparent 50%)',
      borderRadius: '12px'
    },
    sampleText: {
      position: 'relative',
      zIndex: '10',
      color: '#4a4a4a',
      lineHeight: '1.625',
      fontSize: '14px'
    },
    placeholderText: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    vintageElement1: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '64px',
      height: '12px',
      background: 'linear-gradient(90deg, rgba(139, 69, 19, 0.3), rgba(160, 82, 45, 0.2))',
      borderRadius: '2px',
      transform: 'rotate(-5deg)'
    },
    vintageElement2: {
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      width: '48px',
      height: '8px',
      background: 'linear-gradient(90deg, rgba(160, 82, 45, 0.2), rgba(139, 69, 19, 0.3))',
      borderRadius: '2px',
      transform: 'rotate(3deg)'
    },
    burntEdgeEffect: {
      position: 'absolute',
      inset: '0',
      borderRadius: '12px',
      background: `
        radial-gradient(ellipse at top left, rgba(101, 67, 33, 0.3) 0%, transparent 20%),
        radial-gradient(ellipse at top right, rgba(101, 67, 33, 0.2) 0%, transparent 15%),
        radial-gradient(ellipse at bottom left, rgba(101, 67, 33, 0.25) 0%, transparent 18%),
        radial-gradient(ellipse at bottom right, rgba(101, 67, 33, 0.35) 0%, transparent 22%)
      `,
      pointerEvents: 'none'
    },
    configIndicator: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px'
    },
    configContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    configFont: {
      fontWeight: '500'
    },
    burntIcon: {
      width: '16px',
      height: '16px',
      color: '#8b4513'
    },
    detailsSection: {
      background: '#f9fafb',
      borderRadius: '16px',
      padding: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '16px',
      marginTop: '0'
    },
    detailsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    detailLabel: {
      color: '#6b7280'
    },
    detailValue: {
      fontWeight: '500'
    },
    featuresList: {
      background: 'linear-gradient(90deg, rgb(245 243 237), rgb(250 248 244))',
      borderRadius: '16px',
      padding: '24px'
    },
    featuresUl: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    featureIcon: {
      width: '20px',
      height: '20px',
      background: '#fef3c7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkIcon: {
      width: '12px',
      height: '12px',
      color: '#d97706'
    },
    featureText: {
      fontSize: '14px',
      color: '#374151'
    },
    header: {
      marginBottom: '16px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '8px',
      marginTop: '0'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px'
    },
    stars: {
      color: '#d97706'
    },
    reviewCount: {
      fontSize: '14px',
      color: '#6b7280'
    },
    pricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    currentPrice: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827'
    },
    priceDetail: {
      fontSize: '14px',
      color: '#6b7280'
    },
    optionSection: {
      background: '#f9fafb',
      borderRadius: '16px',
      padding: '24px'
    },
    fontGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    fontOption: {
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    fontSelected: {
      borderColor: '#a16207',
      background: '#fef3c7'
    },
    fontUnselected: {
      borderColor: '#e5e7eb'
    },
    fontSample: {
      fontSize: '18px',
      marginBottom: '8px'
    },
    fontName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827'
    },
    fontPrice: {
      fontSize: '12px',
      color: '#6b7280'
    },
    fontWords: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    burntEdgesToggle: {
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    burntEdgesSelected: {
      borderColor: '#a16207',
      background: '#fef3c7'
    },
    burntEdgesContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    burntEdgesIcon: {
      fontSize: '24px'
    },
    burntEdgesInfo: {
      flex: '1'
    },
    burntEdgesTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#111827'
    },
    burntEdgesDesc: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '2px'
    },
    burntEdgesPrice: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#a16207'
    },
    typeGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    typeOption: {
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    typeEmoji: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    typeName: {
      fontWeight: '500',
      color: '#111827'
    },
    typeDesc: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    occasionGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    occasionOption: {
      padding: '12px',
      border: '2px solid',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    occasionName: {
      fontSize: '14px',
      fontWeight: '500',
      textTransform: 'capitalize'
    },
    messageSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    textareaContainer: {
      position: 'relative'
    },
    textarea: {
      width: '100%',
      height: '128px',
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      resize: 'none',
      outline: 'none',
      fontFamily: 'inherit'
    },
    textareaError: {
      borderColor: '#ef4444'
    },
    textareaDefault: {
      borderColor: '#d1d5db'
    },
    wordCounter: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontWeight: '500'
    },
    statusRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px'
    },
    statusMessage: {
      fontWeight: '500'
    },
    pageCount: {
      color: '#6b7280'
    },
    previewSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    previewHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    previewButton: {
      padding: '8px 16px',
      background: '#a16207',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    previewContainer: {
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px'
    },
    previewInner: {
      aspectRatio: '3/4',
      background: '#f7f3e9',
      borderRadius: '8px',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    previewBg: {
      position: 'absolute',
      inset: '0',
      background: 'radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.08) 0%, transparent 50%)',
      borderRadius: '8px'
    },
    previewText: {
      position: 'relative',
      zIndex: '10',
      color: '#4a4a4a',
      lineHeight: '1.625',
      fontSize: '14px'
    },
    previewElement1: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '48px',
      height: '8px',
      background: 'linear-gradient(90deg, rgba(139, 69, 19, 0.2), rgba(160, 82, 45, 0.15))',
      borderRadius: '2px',
      transform: 'rotate(-5deg)'
    },
    previewElement2: {
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      width: '32px',
      height: '4px',
      background: 'linear-gradient(90deg, rgba(160, 82, 45, 0.15), rgba(139, 69, 19, 0.2))',
      borderRadius: '2px',
      transform: 'rotate(3deg)'
    },
    previewBurntEdge: {
      position: 'absolute',
      inset: '0',
      borderRadius: '8px',
      background: `
        radial-gradient(ellipse at top left, rgba(101, 67, 33, 0.2) 0%, transparent 15%),
        radial-gradient(ellipse at top right, rgba(101, 67, 33, 0.15) 0%, transparent 12%),
        radial-gradient(ellipse at bottom left, rgba(101, 67, 33, 0.18) 0%, transparent 14%),
        radial-gradient(ellipse at bottom right, rgba(101, 67, 33, 0.25) 0%, transparent 17%)
      `,
      pointerEvents: 'none'
    },
    previewNote: {
      marginTop: '16px',
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center'
    },
    errorSection: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '16px',
      padding: '16px'
    },
    errorText: {
      color: '#dc2626',
      fontSize: '14px'
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    addToCartBtn: {
      width: '100%',
      padding: '16px 24px',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '18px',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer'
    },
    addToCartEnabled: {
      background: '#a16207',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    addToCartDisabled: {
      background: '#d1d5db',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    buyNowBtn: {
      width: '100%',
      padding: '16px 24px',
      background: '#16a34a',
      color: 'white',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '18px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.2s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    infoSection: {
      background: 'linear-gradient(90deg, rgb(245 243 237), rgb(250 248 244))',
      borderRadius: '16px',
      padding: '24px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      fontSize: '14px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoIcon: {
      fontSize: '18px'
    },
    infoText: {
      color: '#374151'
    }
  };

  // Mobile responsive adjustments
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    styles.container.gridTemplateColumns = '1fr';
    styles.container.gap = '24px';
    styles.container.padding = '24px';
    styles.title.fontSize = '24px';
    styles.currentPrice.fontSize = '24px';
    styles.fontGrid.gridTemplateColumns = '1fr';
    styles.typeGrid.gridTemplateColumns = '1fr';
    styles.occasionGrid.gridTemplateColumns = '1fr';
    styles.infoGrid.gridTemplateColumns = '1fr';
  }

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span>Home</span> / <span>Letters</span> / <span style={styles.breadcrumbLink}>Vintage Letters</span>
      </div>

      <div style={styles.container}>
        {/* Left Side - Product Image and Details */}
        <div style={styles.leftSection}>
          {/* Product Image */}
          <div style={styles.imageContainer}>
            <div style={styles.productImage}>
              <div style={styles.imageInner}>
                {/* Vintage background effect */}
                <div style={styles.vintageBg} />
                
                {/* Burnt edges effect if enabled */}
                {burntEdges && <div style={styles.burntEdgeEffect} />}
                
                {/* Sample text preview */}
                <div style={{
                  ...styles.sampleText,
                  fontFamily: font === 'Calligraphy' ? 'serif' : 'sans-serif',
                  fontStyle: font === 'Calligraphy' ? 'italic' : 'normal'
                }}>
                  {text ? (
                    <div>
                      {text.substring(0, 150)}
                      {text.length > 150 && '...'}
                    </div>
                  ) : (
                    <div style={styles.placeholderText}>
                      Your personalized message will appear here in beautiful vintage style...
                    </div>
                  )}
                </div>

                {/* Vintage decorative elements */}
                <div style={styles.vintageElement1} />
                <div style={styles.vintageElement2} />
              </div>
              
              {/* Configuration indicator */}
              <div style={styles.configIndicator}>
                <div style={styles.configContent}>
                  <span style={styles.configFont}>{font}</span>
                  {burntEdges && (
                    <svg style={styles.burntIcon} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div style={styles.detailsSection}>
            <h3 style={styles.sectionTitle}>Product Details</h3>
            <div style={styles.detailsGrid}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Size:</span>
                <span style={styles.detailValue}>21cm × 29.7cm (A4)</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Pages:</span>
                <span style={styles.detailValue}>{pages} page{pages > 1 ? 's' : ''}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Font:</span>
                <span style={styles.detailValue}>{font}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Words per page:</span>
                <span style={styles.detailValue}>{LetterProducts.getWordsPerPage(font)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Burnt edges:</span>
                <span style={styles.detailValue}>{burntEdges ? 'Yes (+₹50)' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div style={styles.featuresList}>
            <h3 style={styles.sectionTitle}>Features</h3>
            <ul style={styles.featuresUl}>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span style={styles.featureText}>Premium vintage-style paper</span>
              </li>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span style={styles.featureText}>Hand-crafted aesthetic design</span>
              </li>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span style={styles.featureText}>Customizable message and font</span>
              </li>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span style={styles.featureText}>Optional burnt edge effects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Configuration Options */}
        <div style={styles.rightSection}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Vintage Letter</h1>
            
            {/* Rating */}
            <div style={styles.ratingSection}>
              <div style={styles.stars}>
                ★★★★★
              </div>
              <span style={styles.reviewCount}>(127 reviews)</span>
            </div>

            {/* Pricing */}
            <div style={styles.pricing}>
              <span style={styles.currentPrice}>₹{getPrice()}</span>
              <span style={styles.priceDetail}>for {pages} page{pages > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Font Selection */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>Choose Font Style</h3>
            <div style={styles.fontGrid}>
              {LetterProducts.backgrounds.vintage.fonts.map((fontOption) => (
                <div
                  key={fontOption}
                  style={{
                    ...styles.fontOption,
                    ...(font === fontOption ? styles.fontSelected : styles.fontUnselected)
                  }}
                  onClick={() => setFont(fontOption)}
                >
                  <div style={{
                    ...styles.fontSample,
                    fontFamily: fontOption === 'Calligraphy' ? 'serif' : 'sans-serif',
                    fontStyle: fontOption === 'Calligraphy' ? 'italic' : 'normal'
                  }}>
                    Hello World
                  </div>
                  <div style={styles.fontName}>{fontOption}</div>
                  <div style={styles.fontPrice}>₹{LetterProducts.backgrounds.vintage.pricing[fontOption]}</div>
                  <div style={styles.fontWords}>{LetterProducts.getWordsPerPage(fontOption)} words/page</div>
                </div>
              ))}
            </div>
          </div>

          {/* Burnt Edges Option */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>Special Effects</h3>
            <div
              style={{
                ...styles.burntEdgesToggle,
                ...(burntEdges ? styles.burntEdgesSelected : {})
              }}
              onClick={() => setBurntEdges(!burntEdges)}
            >
              <div style={styles.burntEdgesContent}>
                <span style={styles.burntEdgesIcon}>🔥</span>
                <div style={styles.burntEdgesInfo}>
                  <div style={styles.burntEdgesTitle}>Burnt Edges</div>
                  <div style={styles.burntEdgesDesc}>Adds authentic vintage weathered look</div>
                </div>
              </div>
              <span style={styles.burntEdgesPrice}>+₹50</span>
            </div>
          </div>

          {/* Letter Type Selection */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>Letter Type</h3>
            <div style={styles.typeGrid}>
              <div
                style={{
                  ...styles.typeOption,
                  ...(type === 'custom' ? styles.fontSelected : styles.fontUnselected)
                }}
                onClick={() => setType('custom')}
              >
                <div style={styles.typeEmoji}>✍️</div>
                <div style={styles.typeName}>Custom Message</div>
                <div style={styles.typeDesc}>Write your own personal message</div>
              </div>
              <div
                style={{
                  ...styles.typeOption,
                  ...(type === 'occasion' ? styles.fontSelected : styles.fontUnselected)
                }}
                onClick={() => setType('occasion')}
              >
                <div style={styles.typeEmoji}>🎉</div>
                <div style={styles.typeName}>Occasion Templates</div>
                <div style={styles.typeDesc}>Pre-written messages for special events</div>
              </div>
            </div>
          </div>

          {/* Occasion Selection (only if occasion type is selected) */}
          {type === 'occasion' && (
            <div style={styles.optionSection}>
              <h3 style={styles.sectionTitle}>Choose Occasion</h3>
              <div style={styles.occasionGrid}>
                {Object.keys(LetterProducts.occasions).map((occasion) => (
                  <div
                    key={occasion}
                    style={{
                      ...styles.occasionOption,
                      ...(selectedOccasion === occasion ? styles.fontSelected : styles.fontUnselected)
                    }}
                    onClick={() => setSelectedOccasion(occasion)}
                  >
                    <div style={styles.occasionName}>
                      {occasion.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>Your Message</h3>
            <div style={styles.messageSection}>
              <div style={styles.textareaContainer}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={type === 'custom' ? 
                    "Write your personalized message here..." : 
                    "Select an occasion above to see the template message"
                  }
                  style={{
                    ...styles.textarea,
                    ...(wordStatus === 'error' ? styles.textareaError : styles.textareaDefault)
                  }}
                  disabled={type === 'occasion' && !selectedOccasion}
                />
                <div 
                  style={{
                    ...styles.wordCounter,
                    color: getWordCountColor(),
                    background: `${getWordCountColor()}20`
                  }}
                >
                  {wordCount} words
                </div>
              </div>
              
              <div style={styles.statusRow}>
                <span style={{...styles.statusMessage, color: getWordCountColor()}}>
                  {getWordStatusMessage()}
                </span>
                <span style={styles.pageCount}>
                  {pages} page{pages > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div style={styles.previewSection}>
            <div style={styles.previewHeader}>
              <h3 style={styles.sectionTitle}>Preview</h3>
              <button 
                style={styles.previewButton}
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            
            {showPreview && (
              <div style={styles.previewContainer}>
                <div style={styles.previewInner}>
                  <div style={styles.previewBg} />
                  {burntEdges && <div style={styles.previewBurntEdge} />}
                  
                  <div style={{
                    ...styles.previewText,
                    fontFamily: font === 'Calligraphy' ? 'serif' : 'sans-serif',
                    fontStyle: font === 'Calligraphy' ? 'italic' : 'normal'
                  }}>
                    {text ? text.substring(0, 200) : 'Your message will appear here...'}
                    {text && text.length > 200 && '...'}
                  </div>
                  
                  <div style={styles.previewElement1} />
                  <div style={styles.previewElement2} />
                </div>
                <div style={styles.previewNote}>
                  This is a simplified preview. Actual product may vary.
                </div>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {(errors.general || errors.words) && (
            <div style={styles.errorSection}>
              <div style={styles.errorText}>
                {errors.general || errors.words}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={{
                ...styles.addToCartBtn,
                ...(wordStatus === 'error' || !text.trim() ? styles.addToCartDisabled : styles.addToCartEnabled)
              }}
              onClick={handleAddToCart}
              disabled={wordStatus === 'error' || !text.trim()}
            >
              Add to Cart - ₹{getPrice()}
            </button>
            
            <button style={styles.buyNowBtn}>
              Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>Why Choose Vintage Letters?</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>📜</span>
                <span style={styles.infoText}>Authentic vintage feel</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🎨</span>
                <span style={styles.infoText}>Customizable design</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>💝</span>
                <span style={styles.infoText}>Perfect for gifting</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>⚡</span>
                <span style={styles.infoText}>Fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VintageLetterPage;