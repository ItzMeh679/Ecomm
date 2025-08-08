import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../Cart/CartPage.jsx'; // Adjust path based on your folder structure

// Letter Products Logic Class
class LetterProducts {
  static backgrounds = {
    matteBlack: {
      name: 'Matte Black Background',
      fonts: ['Normal'],
      pricing: { Normal: 150 }
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
    return 100; // Normal font only
  }

  static validateLetterConfiguration(config) {
    const { font, text } = config;
    const bgConfig = this.backgrounds.matteBlack;
    
    if (!bgConfig.fonts.includes(font)) return { valid: false, error: 'Invalid font for matte black background' };
    if (!text.trim()) return { valid: false, error: 'Message cannot be empty' };
    
    return { valid: true };
  }

  static createLetterProduct(config) {
    const validation = this.validateLetterConfiguration(config);
    if (!validation.valid) throw new Error(validation.error);
    
    const bgConfig = this.backgrounds.matteBlack;
    const basePrice = bgConfig.pricing[config.font];
    const totalPrice = basePrice * config.pages;
    
    return {
      ...config,
      background: 'matteBlack',
      basePrice,
      totalPrice,
      timestamp: new Date().toISOString()
    };
  }
}

const MatteBlackLetterPage = ({ onBack, onNavigate }) => {
  // State variables
  const [font, setFont] = useState('Normal');
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
    const bgConfig = LetterProducts.backgrounds.matteBlack;
    const basePrice = bgConfig.pricing[font];
    return basePrice * pages;
  };

  // Get original price (for discount display if needed)
  const getOriginalPrice = () => {
    const basePrice = 200; // Original higher price
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
    const idealLimit = 90;
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

  // Format occasion name for display
  const formatOccasionName = (occasionKey) => {
    if (!occasionKey) return 'Not selected';
    return occasionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Enhanced Add to cart functionality with proper cart integration
  const handleAddToCart = () => {
    try {
      const config = {
        font,
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
        id: 'matte-black-letter',
        name: 'Matte Black Letter',
        category: 'Letters',
        price: getPrice(),
        totalPrice: getPrice(),
        basePrice: LetterProducts.backgrounds.matteBlack.pricing[font],
        quantity: 1,
        specifications: {
          background: 'Matte Black',
          font: font,
          fontStyle: 'Modern Sans-serif',
          style: 'Sophisticated matte finish',
          specialEffects: 'Premium matte black paper with sleek modern aesthetic',
          messageType: type === 'custom' ? 'Custom Message' : 'Occasion Template',
          occasion: type === 'occasion' ? formatOccasionName(selectedOccasion) : 'Custom',
          pages: pages,
          pagesText: `${pages} page${pages > 1 ? 's' : ''}`,
          wordCount: wordCount,
          wordsPerPage: LetterProducts.getWordsPerPage(font),
          wordStatus: wordStatus === 'good' ? 'Optimal' : wordStatus === 'warning' ? 'Acceptable' : 'Over limit',
          pricePerPage: `₹${LetterProducts.backgrounds.matteBlack.pricing[font]} per page`,
          message: text.trim() ? `${text.substring(0, 100)}${text.length > 100 ? '...' : ''}` : 'No message',
          fullMessage: text.trim() || 'No message provided',
          paperType: 'Premium matte black paper',
          finish: 'Sophisticated matte finish',
          design: 'Sleek modern aesthetic'
        },
        image: 'src/Products/Letters/Images/MatteBlack.png', // Adjust path as needed
        tags: ['Matte Black', 'Letter', 'Custom', 'Personalized', 'Modern', 'Sophisticated'],
        rating: 4.8,
        reviews: 89,
        deliveryTime: '5-7 days'
      };

      // Add to cart using context
      addToCart(cartProduct);
      
      // Show success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
        alert(`Successfully added Matte Black Letter (${pages} page${pages > 1 ? 's' : ''}) to cart!`);
        setErrors({});
      }, 500);
      
    } catch (error) {
      setIsAddingToCart(false);
      setErrors({ general: error.message });
    }
  };

  const handleBuyNow = () => {
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
      id: 'matte-black-letter',
      name: 'Matte Black Letter',
      category: 'Letters',
      price: getPrice(),
      totalPrice: getPrice(),
      basePrice: LetterProducts.backgrounds.matteBlack.pricing[font],
      quantity: 1,
      specifications: {
        background: 'Matte Black',
        font: font,
        fontStyle: 'Modern Sans-serif',
        style: 'Sophisticated matte finish',
        specialEffects: 'Premium matte black paper with sleek modern aesthetic',
        messageType: type === 'custom' ? 'Custom Message' : 'Occasion Template',
        occasion: type === 'occasion' ? formatOccasionName(selectedOccasion) : 'Custom',
        pages: pages,
        pagesText: `${pages} page${pages > 1 ? 's' : ''}`,
        wordCount: wordCount,
        wordsPerPage: LetterProducts.getWordsPerPage(font),
        wordStatus: wordStatus === 'good' ? 'Optimal' : wordStatus === 'warning' ? 'Acceptable' : 'Over limit',
        pricePerPage: `₹${LetterProducts.backgrounds.matteBlack.pricing[font]} per page`,
        message: text.trim() ? `${text.substring(0, 100)}${text.length > 100 ? '...' : ''}` : 'No message',
        fullMessage: text.trim() || 'No message provided',
        paperType: 'Premium matte black paper',
        finish: 'Sophisticated matte finish',
        design: 'Sleek modern aesthetic'
      },
      image: 'src/Products/Letters/Images/MatteBlack.png',
      tags: ['Matte Black', 'Letter', 'Custom', 'Personalized', 'Modern', 'Sophisticated'],
      rating: 4.8,
      reviews: 89,
      deliveryTime: '5-7 days'
    };

    addToCart(cartProduct);
    
    // Navigate to cart page if onNavigate function is available
    if (onNavigate) {
      onNavigate('cart');
    } else {
      alert('Added Matte Black Letter to cart! Please go to cart to checkout.');
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

  // Validation function
  const isFormValid = () => {
    return text.trim() && wordStatus !== 'error';
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
      background: 'linear-gradient(135deg, rgb(15, 15, 15), rgb(25, 25, 25))',
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
      color: '#9ca3af',
      marginBottom: '24px',
      maxWidth: '1400px',
      margin: '0 auto 24px',
      paddingTop: '60px'
    },
    breadcrumbLink: {
      color: '#ffffff',
      fontWeight: '600'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      background: '#1a1a1a',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      padding: '32px',
      border: '1px solid #333',
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
      background: 'linear-gradient(135deg, rgb(10, 10, 10), rgb(20, 20, 20))',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    },
    imageInner: {
      aspectRatio: '3/4',
      background: '#000000',
      borderRadius: '12px',
      boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      border: '2px solid #333'
    },
    matteBlackBg: {
      position: 'absolute',
      inset: '0',
      background: 'radial-gradient(circle at 30% 40%, rgba(64, 64, 64, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(96, 96, 96, 0.2) 0%, transparent 50%)',
      borderRadius: '12px'
    },
    sampleText: {
      position: 'relative',
      zIndex: '10',
      color: '#ffffff',
      lineHeight: '1.625',
      fontSize: '14px',
      fontFamily: 'sans-serif'
    },
    placeholderText: {
      color: '#6b7280',
      fontSize: '14px'
    },
    matteElement1: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '64px',
      height: '12px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
      borderRadius: '2px',
      transform: 'rotate(-5deg)'
    },
    matteElement2: {
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      width: '48px',
      height: '8px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
      borderRadius: '2px',
      transform: 'rotate(3deg)'
    },
    configIndicator: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      border: '1px solid #333',
      color: '#ffffff'
    },
    configContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    configFont: {
      fontWeight: '500'
    },
    detailsSection: {
      background: '#1f1f1f',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #333'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffffff',
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
      color: '#9ca3af'
    },
    detailValue: {
      fontWeight: '500',
      color: '#ffffff'
    },
    featuresList: {
      background: 'linear-gradient(90deg, rgb(10, 10, 10), rgb(20, 20, 20))',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #333'
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
      background: '#333',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkIcon: {
      width: '12px',
      height: '12px',
      color: '#ffffff'
    },
    featureText: {
      fontSize: '14px',
      color: '#e5e7eb'
    },
    header: {
      marginBottom: '16px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff',
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
      color: '#ffffff'
    },
    reviewCount: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    pricing: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '1.5rem 0',
      borderTop: '1px solid rgba(51, 51, 51, 0.5)',
      borderBottom: '1px solid rgba(51, 51, 51, 0.5)'
    },
    currentPrice: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#ffffff'
    },
    originalPrice: {
      fontSize: '20px',
      color: '#6b7280',
      textDecoration: 'line-through',
      fontWeight: '500'
    },
    discountBadge: {
      background: 'linear-gradient(135deg, #ffffff, #e5e7eb)',
      color: '#000000',
      padding: '0.4rem 0.8rem',
      borderRadius: '8px',
      fontSize: '0.8rem',
      fontWeight: '700',
      letterSpacing: '0.025em',
      boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)'
    },
    priceDetail: {
      fontSize: '14px',
      color: '#9ca3af'
    },
    optionSection: {
      background: '#1f1f1f',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #333'
    },
    fontGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px'
    },
    fontOption: {
      padding: '16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
      background: '#1a1a1a'
    },
    fontSelected: {
      borderColor: '#ffffff',
      background: '#333'
    },
    fontUnselected: {
      borderColor: '#444'
    },
    fontSample: {
      fontSize: '18px',
      marginBottom: '8px',
      color: '#ffffff'
    },
    fontName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffffff'
    },
    fontPrice: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    fontWords: {
      fontSize: '12px',
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
      textAlign: 'center',
      background: '#1a1a1a'
    },
    typeEmoji: {
      fontSize: '32px',
      marginBottom: '8px'
    },
    typeName: {
      fontWeight: '500',
      color: '#ffffff'
    },
    typeDesc: {
      fontSize: '12px',
      color: '#9ca3af',
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
      textAlign: 'center',
      background: '#1a1a1a'
    },
    occasionName: {
      fontSize: '14px',
      fontWeight: '500',
      textTransform: 'capitalize',
      color: '#ffffff'
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
      fontFamily: 'inherit',
      background: '#1a1a1a',
      color: '#ffffff'
    },
    textareaError: {
      borderColor: '#ef4444'
    },
    textareaDefault: {
      borderColor: '#444'
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
      color: '#9ca3af'
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
      background: '#ffffff',
      color: '#000000',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.2s',
      fontWeight: '600'
    },
    previewContainer: {
      background: '#1a1a1a',
      border: '2px solid #333',
      borderRadius: '12px',
      padding: '24px'
    },
    previewInner: {
      aspectRatio: '3/4',
      background: '#000000',
      borderRadius: '8px',
      boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #333'
    },
    previewBg: {
      position: 'absolute',
      inset: '0',
      background: 'radial-gradient(circle at 30% 40%, rgba(64, 64, 64, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(96, 96, 96, 0.15) 0%, transparent 50%)',
      borderRadius: '8px'
    },
    previewText: {
      position: 'relative',
      zIndex: '10',
      color: '#ffffff',
      lineHeight: '1.625',
      fontSize: '14px'
    },
    previewElement1: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '48px',
      height: '8px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))',
      borderRadius: '2px',
      transform: 'rotate(-5deg)'
    },
    previewElement2: {
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      width: '32px',
      height: '4px',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.15))',
      borderRadius: '2px',
      transform: 'rotate(3deg)'
    },
    previewNote: {
      marginTop: '16px',
      fontSize: '12px',
      color: '#9ca3af',
      textAlign: 'center'
    },
    errorSection: {
      background: '#2d1b1b',
      border: '1px solid #ef4444',
      borderRadius: '16px',
      padding: '16px'
    },
    errorText: {
      color: '#ef4444',
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
      background: '#ffffff',
      color: '#000000',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    },
    addToCartDisabled: {
      background: '#444',
      color: '#888',
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
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
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
      background: 'linear-gradient(90deg, rgb(10, 10, 10), rgb(20, 20, 20))',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #333'
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
      color: '#e5e7eb'
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
        <span>Home</span> / <span>Letters</span> / <span style={styles.breadcrumbLink}>Matte Black Letters</span>
      </div>

      <div style={styles.container}>
        {/* Left Side - Product Image and Details */}
        <div style={styles.leftSection}>
          {/* Product Image */}
          <div style={styles.imageContainer}>
            <div style={styles.productImage}>
              <div style={styles.imageInner}>
                {/* Matte black background effect */}
                <div style={styles.matteBlackBg} />
                
                {/* Sample text preview */}
                <div style={styles.sampleText}>
                  {text ? (
                    <div>
                      {text.substring(0, 150)}
                      {text.length > 150 && '...'}
                    </div>
                  ) : (
                    <div style={styles.placeholderText}>
                      Your personalized message will appear here in sleek matte black style...
                    </div>
                  )}
                </div>

                {/* Matte decorative elements */}
                <div style={styles.matteElement1} />
                <div style={styles.matteElement2} />
              </div>
              
              {/* Configuration indicator */}
              <div style={styles.configIndicator}>
                <div style={styles.configContent}>
                  <span style={styles.configFont}>{font}</span>
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
                <span style={styles.detailLabel}>Style:</span>
                <span style={styles.detailValue}>Matte Black Premium</span>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div style={styles.featuresList}>
            <h3 style={styles.sectionTitle}>Features</h3>
            <ul style={styles.featuresUl}>
              {[
                'Premium matte black paper',
                'Sleek modern aesthetic design',
                'Customizable message and content',
                'Sophisticated matte finish',
                'Professional presentation',
                'High-quality materials'
              ].map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  <div style={styles.featureIcon}>
                    <svg style={styles.checkIcon} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <span style={styles.featureText}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Configuration Options */}
        <div style={styles.rightSection}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Matte Black Letter</h1>
            
            {/* Rating */}
            <div style={styles.ratingSection}>
              <div style={styles.stars}>
                ★★★★★
              </div>
              <span style={styles.reviewCount}>(89 reviews)</span>
            </div>

            {/* Pricing */}
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
            <h3 style={styles.sectionTitle}>1. Font Style</h3>
            <div style={styles.fontGrid}>
              {LetterProducts.backgrounds.matteBlack.fonts.map((fontOption) => (
                <div
                  key={fontOption}
                  style={{
                    ...styles.fontOption,
                    ...(font === fontOption ? styles.fontSelected : styles.fontUnselected)
                  }}
                  onClick={() => setFont(fontOption)}
                >
                  <div style={styles.fontSample}>
                    Hello World
                  </div>
                  <div style={styles.fontName}>{fontOption}</div>
                  <div style={styles.fontPrice}>₹{LetterProducts.backgrounds.matteBlack.pricing[fontOption]}/page</div>
                  <div style={styles.fontWords}>{LetterProducts.getWordsPerPage(fontOption)} words/page</div>
                </div>
              ))}
            </div>
          </div>

          {/* Letter Type Selection */}
          <div style={styles.optionSection}>
            <h3 style={styles.sectionTitle}>2. Letter Type</h3>
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
              <h3 style={styles.sectionTitle}>3. Choose Occasion</h3>
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
            <h3 style={styles.sectionTitle}>
              {type === 'occasion' ? '4' : '3'}. Your Message
            </h3>
            <div style={styles.messageSection}>
              <div style={styles.textareaContainer}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={type === 'custom' ? 
                    "Write your personalized message here..." : 
                    "Select an occasion above to see the template message. You can edit it as needed."
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
                  {wordCount}/{LetterProducts.getWordsPerPage(font) * pages} words
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
                  
                  <div style={styles.previewText}>
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
            <h3 style={styles.sectionTitle}>Why Choose Matte Black Letters?</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🖤</span>
                <span style={styles.infoText}>Sophisticated matte finish</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}>🎨</span>
                <span style={styles.infoText}>Modern sleek design</span>
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

export default MatteBlackLetterPage;