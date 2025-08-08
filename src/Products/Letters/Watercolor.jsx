import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../Cart/CartPage.jsx'; // Adjust path based on your folder structure

// Letter Products Logic Class
class LetterProducts {
  static backgrounds = {
    watercolor: {
      name: 'Watercolor Background',
      fonts: ['Normal', 'Calligraphy'],
      colors: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
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
    const { font, color, text } = config;
    const bgConfig = this.backgrounds.watercolor;
    
    if (!bgConfig.fonts.includes(font)) return { valid: false, error: 'Invalid font for watercolor background' };
    if (!bgConfig.colors.includes(color)) return { valid: false, error: 'Please select a color for watercolor background' };
    if (!text.trim()) return { valid: false, error: 'Message cannot be empty' };
    
    return { valid: true };
  }

  static createLetterProduct(config) {
    const validation = this.validateLetterConfiguration(config);
    if (!validation.valid) throw new Error(validation.error);
    
    const bgConfig = this.backgrounds.watercolor;
    const basePrice = bgConfig.pricing[config.font];
    const totalPrice = basePrice * config.pages;
    
    return {
      ...config,
      background: 'watercolor',
      basePrice,
      totalPrice,
      timestamp: new Date().toISOString()
    };
  }
}

const WatercolorLetterPage = ({ onBack, onNavigate }) => {
  // State variables
  const [font, setFont] = useState('Normal');
  const [color, setColor] = useState('');
  const [type, setType] = useState('custom');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [wordStatus, setWordStatus] = useState('good');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const textareaRef = useRef(null);

  // Get cart functions from context
  const { addToCart, cartCount } = useCart();

  // Helper function to count words
  const countWords = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Get price calculation
  const getPrice = () => {
    const bgConfig = LetterProducts.backgrounds.watercolor;
    const basePrice = bgConfig.pricing[font] * pages;
    return basePrice;
  };

  // Get original price (for discount display)
  const getOriginalPrice = () => {
    const basePrice = font === 'Normal' ? 150 : 180; // Original higher prices
    return basePrice * pages;
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

  // Effect: When font or color not valid for watercolor
  useEffect(() => {
    const bgConfig = LetterProducts.backgrounds.watercolor;
    
    // Validate font
    if (!bgConfig.fonts.includes(font)) {
      setFont(bgConfig.fonts[0]);
    }
  }, [font]);

  // Format occasion name for display
  const formatOccasionName = (occasionKey) => {
    if (!occasionKey) return 'Not selected';
    return occasionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Enhanced Add to cart functionality with proper cart integration
  const handleAddToCart = () => {
    try {
      if (!color) {
        setErrors({ color: 'Please select a color for your watercolor letter' });
        return;
      }

      const config = {
        font,
        color,
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

      setIsAddingToCart(true);

      // Create standardized product object for cart with comprehensive specifications
      const cartProduct = {
        id: 'watercolor-letter',
        name: 'Watercolor Letter',
        category: 'Letters',
        price: getPrice(),
        totalPrice: getPrice(),
        basePrice: LetterProducts.backgrounds.watercolor.pricing[font],
        quantity: 1,
        specifications: {
          background: 'Watercolor',
          font: font,
          fontStyle: font === 'Calligraphy' ? 'Italic Serif' : 'Sans-serif',
          color: color,
          colorTheme: `${color} watercolor theme`,
          messageType: type === 'custom' ? 'Custom Message' : 'Occasion Template',
          occasion: type === 'occasion' ? formatOccasionName(selectedOccasion) : 'Custom',
          pages: pages,
          pagesText: `${pages} page${pages > 1 ? 's' : ''}`,
          wordCount: wordCount,
          wordsPerPage: LetterProducts.getWordsPerPage(font),
          wordStatus: wordStatus === 'good' ? 'Optimal' : wordStatus === 'warning' ? 'Acceptable' : 'Over limit',
          pricePerPage: `₹${LetterProducts.backgrounds.watercolor.pricing[font]} per page`,
          message: text.trim() ? `${text.substring(0, 100)}${text.length > 100 ? '...' : ''}` : 'No message',
          fullMessage: text.trim() || 'No message provided'
        },
        image: 'src/Products/Letters/Images/Watercolor.png', // Adjust path as needed
        tags: ['Watercolor', 'Letter', 'Custom', 'Personalized', font],
        rating: 4.8,
        reviews: 127,
        deliveryTime: '5-7 days'
      };

      // Add to cart using context
      addToCart(cartProduct);
      
      // Show success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
        alert(`Successfully added Watercolor Letter (${pages} page${pages > 1 ? 's' : ''}, ${color} theme) to cart!`);
        setErrors({});
      }, 500);
      
    } catch (error) {
      setIsAddingToCart(false);
      setErrors({ general: error.message });
    }
  };

  const handleBuyNow = () => {
    if (!color) {
      setErrors({ color: 'Please select a color for your watercolor letter' });
      return;
    }

    if (!text.trim()) {
      setErrors({ general: 'Please enter your message' });
      return;
    }

    const wordsPerPage = LetterProducts.getWordsPerPage(font);
    if (wordCount > wordsPerPage * pages) {
      setErrors({ words: `Text exceeds ${wordsPerPage * pages} words limit for ${pages} page(s)` });
      return;
    }

    // First add to cart, then navigate to cart page
    const cartProduct = {
      id: 'watercolor-letter',
      name: 'Watercolor Letter',
      category: 'Letters',
      price: getPrice(),
      totalPrice: getPrice(),
      basePrice: LetterProducts.backgrounds.watercolor.pricing[font],
      quantity: 1,
      specifications: {
        background: 'Watercolor',
        font: font,
        fontStyle: font === 'Calligraphy' ? 'Italic Serif' : 'Sans-serif',
        color: color,
        colorTheme: `${color} watercolor theme`,
        messageType: type === 'custom' ? 'Custom Message' : 'Occasion Template',
        occasion: type === 'occasion' ? formatOccasionName(selectedOccasion) : 'Custom',
        pages: pages,
        pagesText: `${pages} page${pages > 1 ? 's' : ''}`,
        wordCount: wordCount,
        wordsPerPage: LetterProducts.getWordsPerPage(font),
        wordStatus: wordStatus === 'good' ? 'Optimal' : wordStatus === 'warning' ? 'Acceptable' : 'Over limit',
        pricePerPage: `₹${LetterProducts.backgrounds.watercolor.pricing[font]} per page`,
        message: text.trim() ? `${text.substring(0, 100)}${text.length > 100 ? '...' : ''}` : 'No message',
        fullMessage: text.trim() || 'No message provided'
      },
      image: 'src/Products/Letters/Images/Watercolor.png',
      tags: ['Watercolor', 'Letter', 'Custom', 'Personalized', font],
      rating: 4.8,
      reviews: 127,
      deliveryTime: '5-7 days'
    };

    addToCart(cartProduct);
    
    // Navigate to cart page if onNavigate function is available
    if (onNavigate) {
      onNavigate('cart');
    } else {
      alert('Added Watercolor Letter to cart! Please go to cart to checkout.');
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

  const getColorHex = (colorName) => {
    const colorMap = {
      'Red': '#ef4444',
      'Orange': '#f97316',
      'Yellow': '#eab308',
      'Green': '#22c55e',
      'Blue': '#3b82f6',
      'Indigo': '#6366f1',
      'Violet': '#8b5cf6'
    };
    return colorMap[colorName] || '#64748b';
  };

  // Styles object
  const styles = {
    page: {
      width: '100vw',
      minHeight: '100vh',
      margin: '0',
      padding: '2rem',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      background: 'linear-gradient(135deg, rgb(239 246 255), rgb(250 245 255))',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
      zIndex: '10'
    },
    cartIndicator: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      fontWeight: '600',
      color: '#1e293b',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: '10',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    breadcrumb: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px',
      maxWidth: '1400px',
      margin: '0 auto 24px',
      paddingTop: '60px'
    },
    breadcrumbLink: {
      color: '#3b82f6',
      fontWeight: '600'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px',
      maxWidth: '1400px',
      margin: '0 auto'
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
      background: 'linear-gradient(135deg, rgb(219 234 254), rgb(243 232 255))',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    imageInner: {
      aspectRatio: '3/4',
      background: 'white',
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },
    watercolorBg: {
      position: 'absolute',
      inset: '0',
      opacity: '0.2',
      borderRadius: '12px'
    },
    sampleText: {
      position: 'relative',
      zIndex: '10',
      color: '#374151',
      lineHeight: '1.625',
      fontSize: '14px'
    },
    placeholderText: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    brushStroke1: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '64px',
      height: '12px',
      borderRadius: '9999px',
      opacity: '0.3'
    },
    brushStroke2: {
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      width: '48px',
      height: '8px',
      borderRadius: '9999px',
      opacity: '0.2'
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
    colorDot: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
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
    colorValue: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    featuresList: {
      background: 'linear-gradient(90deg, rgb(239 246 255), rgb(250 245 255))',
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
      background: '#dcfce7',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkIcon: {
      width: '12px',
      height: '12px',
      color: '#16a34a'
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
      color: '#fbbf24'
    },
    reviewCount: {
      fontSize: '14px',
      color: '#6b7280'
    },
    pricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(226, 232, 240, 0.5)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
    },
    currentPrice: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827'
    },
    originalPrice: {
      fontSize: '20px',
      color: '#94a3b8',
      textDecoration: 'line-through',
      fontWeight: '500'
    },
    discountBadge: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      padding: '0.4rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '700',
      letterSpacing: '0.025em',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
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
      borderColor: '#3b82f6',
      background: '#eff6ff'
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
    colorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '12px'
    },
    colorOption: {
      aspectRatio: '1',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '4px solid'
    },
    colorSelected: {
      borderColor: '#111827',
      transform: 'scale(1.1)'
    },
    colorUnselected: {
      borderColor: 'white'
    },
    colorOptionInner: {
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    colorCheckIcon: {
      width: '24px',
      height: '24px',
      color: 'white',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    },
    colorLabel: {
      marginTop: '8px',
      textAlign: 'center'
    },
    colorLabelText: {
      fontSize: '14px',
      color: '#6b7280'
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
      background: '#3b82f6',
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
      background: 'white',
      borderRadius: '8px',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    },
    previewBg: {
      position: 'absolute',
      inset: '0',
      opacity: '0.1',
      borderRadius: '8px'
    },
    previewText: {
      position: 'relative',
      zIndex: '10',
      color: '#1f2937',
      lineHeight: '1.625',
      fontSize: '14px'
    },
    previewStroke1: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '48px',
      height: '8px',
      borderRadius: '9999px',
      opacity: '0.2'
    },
    previewStroke2: {
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      width: '32px',
      height: '4px',
      borderRadius: '9999px',
      opacity: '0.15'
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
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    addToCartEnabled: {
      background: '#3b82f6',
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
    loadingSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    infoSection: {
      background: 'linear-gradient(90deg, rgb(239 246 255), rgb(250 245 255))',
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
    styles.page.padding = '1rem';
  }

  // Validation function
  const isFormValid = () => {
    return color && text.trim() && wordStatus !== 'error';
  };

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

      {/* Cart Indicator */}
      <div 
        style={styles.cartIndicator}
        onClick={onNavigate ? () => onNavigate('cart') : undefined}
        onMouseEnter={(e) => {
          if (onNavigate) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (onNavigate) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        🛒 Cart ({cartCount})
      </div>

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <span>Home</span> / <span>Letters</span> / <span style={styles.breadcrumbLink}>Watercolor Letters</span>
      </div>

      <div style={styles.container}>
        {/* Left Side - Product Image and Details */}
        <div style={styles.leftSection}>
          {/* Product Image */}
          <div style={styles.imageContainer}>
            <div style={styles.productImage}>
              <div style={styles.imageInner}>
                {/* Watercolor background effect */}
                <div 
                  style={{
                    ...styles.watercolorBg,
                    background: color ? `linear-gradient(135deg, ${getColorHex(color)}22, ${getColorHex(color)}44, ${getColorHex(color)}22)` : 'linear-gradient(135deg, #e0f2fe, #f3e5f5)'
                  }}
                />
                
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
                      Your personalized message will appear here in beautiful watercolor style...
                    </div>
                  )}
                </div>

                {/* Watercolor brush strokes */}
                {color && (
                  <>
                    <div 
                      style={{
                        ...styles.brushStroke1,
                        backgroundColor: getColorHex(color)
                      }}
                    />
                    <div 
                      style={{
                        ...styles.brushStroke2,
                        backgroundColor: getColorHex(color)
                      }}
                    />
                  </>
                )}
              </div>
              
              {/* Configuration indicator */}
              <div style={styles.configIndicator}>
                <div style={styles.configContent}>
                  <span style={styles.configFont}>{font}</span>
                  {color && (
                    <div 
                      style={{
                        ...styles.colorDot,
                        backgroundColor: getColorHex(color)
                      }}
                    />
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
              {color && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Color theme:</span>
                  <div style={styles.colorValue}>
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1px solid #d1d5db',
                        backgroundColor: getColorHex(color)
                      }}
                    />
                    <span style={styles.detailValue}>{color}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div style={styles.featuresList}>
            <h3 style={styles.sectionTitle}>What's Included</h3>
            <ul style={styles.featuresUl}>
              {[
                'Premium watercolor-style letter',
                'High-quality archival paper',
                'Fade-resistant inks',
                'Professional envelope',
                'Protective sleeve',
                'Personalized message content'
              ].map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  <div style={styles.featureIcon}>
                    <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span style={styles.featureText}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Customization */}
        <div style={styles.rightSection}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Watercolor Letters</h1>
            <div style={styles.ratingSection}>
              <div style={styles.stars}>
                {'★'.repeat(5)}
              </div>
              <span style={styles.reviewCount}>(127 reviews)</span>
            </div>
            <div style={styles.pricing}>
              <span style={styles.currentPrice}>₹{getPrice()}</span>
              <span style={styles.originalPrice}>₹{getOriginalPrice()}</span>
              <span style={styles.discountBadge}>
                {Math.round((1 - getPrice() / getOriginalPrice()) * 100)}% OFF
              </span>
            </div>
          </div>

          {/* Font Selection */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>1. Choose Font Style</h3>
            <div style={styles.fontGrid}>
              {LetterProducts.backgrounds.watercolor.fonts.map((fontOption) => (
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
                    Sample Text
                  </div>
                  <div style={styles.fontName}>{fontOption}</div>
                  <div style={styles.fontPrice}>
                    ₹{LetterProducts.backgrounds.watercolor.pricing[fontOption]}/page
                  </div>
                  <div style={styles.fontWords}>
                    {LetterProducts.getWordsPerPage(fontOption)} words/page
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>2. Select Color Theme</h3>
            {errors.color && (
              <div style={styles.errorSection}>
                <div style={styles.errorText}>{errors.color}</div>
              </div>
            )}
            <div style={styles.colorGrid}>
              {LetterProducts.backgrounds.watercolor.colors.map((colorOption) => (
                <div key={colorOption}>
                  <div 
                    style={{
                      ...styles.colorOption,
                      backgroundColor: getColorHex(colorOption),
                      ...(color === colorOption ? styles.colorSelected : styles.colorUnselected)
                    }}
                    onClick={() => setColor(colorOption)}
                    title={colorOption}
                  >
                    <div style={styles.colorOptionInner}>
                      {color === colorOption && (
                        <svg style={styles.colorCheckIcon} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div style={styles.colorLabel}>
                    <span style={styles.colorLabelText}>{colorOption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Type */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>3. Message Type</h3>
            <div style={styles.typeGrid}>
              <div 
                style={{
                  ...styles.typeOption,
                  ...(type === 'custom' ? styles.fontSelected : styles.fontUnselected)
                }}
                onClick={() => setType('custom')}
              >
                <div style={styles.typeEmoji}>✏️</div>
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
                <div style={styles.typeName}>Occasion Message</div>
                <div style={styles.typeDesc}>Choose from pre-written templates</div>
              </div>
            </div>
          </div>

          {/* Occasion Selection */}
          {type === 'occasion' && (
            <div style={styles.optionSection}>
              <h3 style={styles.sectionTitle}>4. Select Occasion</h3>
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
                      {occasion.replace(/([A-Z])/g, ' $1')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>
              {type === 'occasion' ? '5' : '4'}. Your Message
            </h3>
            <div style={styles.messageSection}>
              <div style={styles.textareaContainer}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={type === 'custom' ? "Enter your heartfelt message..." : "Select an occasion above to see the template message. You can edit it as needed."}
                  style={{
                    ...styles.textarea,
                    ...(wordStatus === 'error' ? styles.textareaError : styles.textareaDefault)
                  }}
                  rows="6"
                />
                <div 
                  style={{
                    ...styles.wordCounter,
                    color: getWordCountColor(),
                    backgroundColor: `${getWordCountColor()}15`
                  }}
                >
                  {wordCount}/{LetterProducts.getWordsPerPage(font) * pages} words
                </div>
              </div>
              
              <div style={styles.statusRow}>
                <div 
                  style={{
                    ...styles.statusMessage,
                    color: getWordCountColor()
                  }}
                >
                  {getWordStatusMessage()}
                </div>
                <div style={styles.pageCount}>
                  {pages} page{pages > 1 ? 's' : ''} needed
                </div>
              </div>
            </div>
          </div>

          {/* Preview Toggle */}
          <div style={styles.previewSection}>
            <div style={styles.previewHeader}>
              <h3 style={styles.sectionTitle}>Preview Your Letter</h3>
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
                  {/* Watercolor background effect */}
                  <div 
                    style={{
                      ...styles.previewBg,
                      background: color ? `linear-gradient(135deg, ${getColorHex(color)}33, ${getColorHex(color)}66, ${getColorHex(color)}33)` : 'linear-gradient(135deg, #e0f2fe, #f3e5f5)'
                    }}
                  />
                  
                  {/* Text content */}
                  <div style={{
                    ...styles.previewText,
                    fontFamily: font === 'Calligraphy' ? 'serif' : 'sans-serif',
                    fontStyle: font === 'Calligraphy' ? 'italic' : 'normal'
                  }}>
                    {text || 'Your personalized message will appear here...'}
                  </div>

                  {/* Decorative elements */}
                  {color && (
                    <>
                      <div 
                        style={{
                          ...styles.previewStroke1,
                          backgroundColor: getColorHex(color)
                        }}
                      />
                      <div 
                        style={{
                          ...styles.previewStroke2,
                          backgroundColor: getColorHex(color)
                        }}
                      />
                    </>
                  )}
                </div>
                
                <div style={styles.previewNote}>
                  This is a preview. Actual letter will have enhanced watercolor effects.
                </div>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div style={styles.errorSection}>
              {Object.values(errors).map((error, index) => (
                <div key={index} style={styles.errorText}>
                  {error}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button 
              style={{
                ...styles.addToCartBtn,
                ...(!isFormValid() || isAddingToCart
                  ? styles.addToCartDisabled
                  : styles.addToCartEnabled)
              }}
              onClick={handleAddToCart}
              disabled={!isFormValid() || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <div style={styles.loadingSpinner} />
                  Adding...
                </>
              ) : (
                <>
                  🛒 Add to Cart - ₹{getPrice()}
                </>
              )}
            </button>
            
            <button 
              style={{
                ...styles.buyNowBtn,
                opacity: !isFormValid() ? 0.6 : 1,
                cursor: !isFormValid() ? 'not-allowed' : 'pointer'
              }}
              onClick={handleBuyNow}
              disabled={!isFormValid()}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div style={styles.infoSection}>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🚚</span>
                <span style={styles.infoText}>Free delivery on ₹500+</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>✍️</span>
                <span style={styles.infoText}>Handwritten-style</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>💝</span>
                <span style={styles.infoText}>Beautiful envelope</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🎨</span>
                <span style={styles.infoText}>Premium watercolor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WatercolorLetterPage;