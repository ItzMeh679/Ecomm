import React, { useState, useEffect, createContext, useContext, useMemo, useCallback, memo } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Heart, ArrowLeft, Package, Truck, CreditCard, Gift, Star, AlertCircle, CheckCircle, Sparkles, TrendingUp, Clock, MapPin, Shield, Tag, X, Zap, Award, ThumbsUp } from 'lucide-react';

// Enhanced Cart Context with performance optimizations
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Optimized Cart Provider with memoization
export const CartProvider = memo(({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  // Memoized calculations for better performance
  const cartMetrics = useMemo(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    const uniqueItems = cartItems.length;
    
    return { count, total, uniqueItems };
  }, [cartItems]);

  // Optimized add to cart with debouncing
  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const itemKey = `${product.id}-${JSON.stringify(product.specifications || {})}`;
      const existingIndex = prevItems.findIndex(item => 
        `${item.id}-${JSON.stringify(item.specifications || {})}` === itemKey
      );

      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (product.quantity || 1)
        };
        return updatedItems;
      }

      const newItem = {
        ...product,
        quantity: product.quantity || 1,
        addedAt: Date.now(),
        id: product.id || `item-${Date.now()}`,
        totalPrice: product.totalPrice || product.price || 0,
        specifications: product.specifications || {},
        itemKey
      };

      // Track recently added items
      setRecentlyAdded(prev => [newItem.id, ...prev.slice(0, 2)]);
      setTimeout(() => {
        setRecentlyAdded(prev => prev.filter(id => id !== newItem.id));
      }, 3000);

      return [...prevItems, newItem];
    });
  }, []);

  const updateQuantity = useCallback((itemId, specifications = {}, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, specifications);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && JSON.stringify(item.specifications || {}) === JSON.stringify(specifications)
          ? { ...item, quantity: Math.min(newQuantity, 99) } // Max quantity limit
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId, specifications = {}) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && JSON.stringify(item.specifications || {}) === JSON.stringify(specifications))
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setRecentlyAdded([]);
  }, []);

  const value = useMemo(() => ({
    cartItems,
    cartCount: cartMetrics.count,
    cartTotal: cartMetrics.total,
    uniqueItems: cartMetrics.uniqueItems,
    recentlyAdded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }), [cartItems, cartMetrics, recentlyAdded, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
});

// Enhanced styles with advanced CSS properties
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 20%, rgba(148, 180, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(148, 180, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(148, 180, 255, 0.03) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
    zIndex: 0
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1600px',
    margin: '0 auto',
    padding: '2rem'
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(148, 180, 255, 0.2)',
    boxShadow: `
      0 20px 60px rgba(148, 180, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset
    `
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(148, 180, 255, 0.3)'
  },
  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid #94B4FF',
    color: '#94B4FF',
    borderRadius: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)'
  }
};

// Enhanced Empty Cart Component
const EmptyCartState = memo(({ onNavigate, onBack }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const featuredProducts = useMemo(() => [
    {
      id: 'vintage-letters',
      name: 'Vintage Letter Collection',
      price: '₹299',
      originalPrice: '₹399',
      rating: 4.9,
      reviews: 124,
      discount: '25% OFF',
      badge: 'Bestseller',
      color: '#ff6b85'
    },
    {
      id: 'floral-bookmarks',
      name: 'Floral Bookmarks Set',
      price: '₹99',
      originalPrice: '₹149',
      rating: 4.8,
      reviews: 89,
      discount: '33% OFF',
      badge: 'Popular',
      color: '#22c55e'
    },
    {
      id: 'mini-cards',
      name: 'Mini Greeting Cards',
      price: '₹149',
      originalPrice: '₹199',
      rating: 4.9,
      reviews: 156,
      discount: '25% OFF',
      badge: 'Trending',
      color: '#f59e0b'
    }
  ], []);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <div style={styles.contentWrapper}>
        {/* Floating Header */}
        <div className="header-animation" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '3rem',
          paddingTop: '1rem'
        }}>
          <button 
            onClick={onBack}
            style={{
              ...styles.secondaryButton,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-8px) scale(1.02)';
              e.target.style.background = 'rgba(148, 180, 255, 0.1)';
              e.target.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(0) scale(1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <ArrowLeft size={22} />
            Continue Shopping
          </button>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Shopping Cart
          </h1>
        </div>

        {/* Enhanced Empty State */}
        <div style={{
          ...styles.glassCard,
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Animated Background Elements */}
          <div className="floating-element-1" style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, rgba(148, 180, 255, 0.1), rgba(148, 180, 255, 0.05))',
            borderRadius: '50%'
          }} />
          
          <div className="floating-element-2" style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'linear-gradient(-45deg, rgba(148, 180, 255, 0.08), rgba(148, 180, 255, 0.03))',
            borderRadius: '50%'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Enhanced Cart Icon */}
            <div style={{
              width: '180px',
              height: '180px',
              background: 'linear-gradient(135deg, #f8faff 0%, #e0e9ff 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2.5rem',
              position: 'relative',
              border: '4px solid #94B4FF'
            }}>
              <ShoppingCart size={70} style={{ color: '#94B4FF' }} />
              
              {/* Floating Counter */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'white',
                boxShadow: '0 8px 24px rgba(148, 180, 255, 0.4)'
              }}>
                0
              </div>
              
              {/* Sparkle Effects */}
              {[...Array(3)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={24}
                  style={{
                    position: 'absolute',
                    color: '#94B4FF',
                    opacity: 0.6,
                    top: `${20 + i * 30}%`,
                    right: `${10 + i * 20}%`
                  }}
                />
              ))}
            </div>
            
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #374151 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em'
            }}>
              Your cart is waiting for magic ✨
            </h2>
            
            <p style={{
              color: '#6b7280',
              fontSize: '1.25rem',
              lineHeight: '1.7',
              maxWidth: '500px',
              margin: '0 auto 3rem',
              fontWeight: '500'
            }}>
              Ready to discover amazing handcrafted treasures? Let's fill this cart with beautiful memories!
            </p>
            
            {/* Enhanced Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              marginBottom: '4rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => onNavigate?.('home')}
                style={{
                  ...styles.primaryButton,
                  padding: '1.25rem 3rem',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px) scale(1.02)';
                  e.target.style.boxShadow = '0 16px 40px rgba(148, 180, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 8px 24px rgba(148, 180, 255, 0.3)';
                }}
              >
                <Sparkles size={24} />
                Start Your Journey
              </button>
              
              <button 
                onClick={() => onNavigate?.('products')}
                style={{
                  ...styles.secondaryButton,
                  padding: '1.25rem 3rem',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px) scale(1.02)';
                  e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                  e.target.style.boxShadow = '0 16px 40px rgba(148, 180, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <TrendingUp size={24} />
                Browse Collection
              </button>
            </div>

            {/* Featured Products Showcase */}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <Award size={28} style={{ color: '#94B4FF' }} />
                Handpicked Just For You
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '2rem'
              }}>
                {featuredProducts.map((item, index) => (
                  <div 
                    key={item.id}
                    style={{
                      ...styles.glassCard,
                      padding: '2rem',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(148, 180, 255, 0.25)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(148, 180, 255, 0.15)';
                    }}
                  >
                    {/* Product Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                      color: 'white',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      zIndex: 2,
                      boxShadow: `0 4px 12px ${item.color}40`
                    }}>
                      {item.discount}
                    </div>

                    {/* Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1.5rem',
                      left: '1.5rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: item.color,
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      zIndex: 2,
                      backdropFilter: 'blur(10px)'
                    }}>
                      {item.badge}
                    </div>
                    
                    {/* Product Image Placeholder */}
                    <div style={{
                      aspectRatio: '1',
                      background: 'linear-gradient(135deg, #f8faff 0%, #e0e9ff 100%)',
                      borderRadius: '16px',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #f0f4ff',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Package size={40} style={{ color: '#94B4FF', zIndex: 2 }} />
                      
                      {/* Animated background */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '120%',
                        height: '120%',
                        background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                        transform: 'translate(-50%, -50%)'
                      }} />
                    </div>
                    
                    <h4 style={{
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      lineHeight: '1.3'
                    }}>
                      {item.name}
                    </h4>
                    
                    {/* Price and Rating Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <span style={{
                          color: '#94B4FF',
                          fontWeight: '800',
                          fontSize: '1.3rem'
                        }}>
                          {item.price}
                        </span>
                        <span style={{
                          color: '#9ca3af',
                          textDecoration: 'line-through',
                          fontSize: '1rem',
                          fontWeight: '500'
                        }}>
                          {item.originalPrice}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(251, 191, 36, 0.1)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '12px'
                      }}>
                        <Star size={16} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                        <span style={{
                          fontSize: '0.9rem',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {item.rating}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: '#6b7280'
                        }}>
                          ({item.reviews})
                        </span>
                      </div>
                    </div>
                    
                    {/* Quick Add Button */}
                    <button style={{
                      width: '100%',
                      ...styles.primaryButton,
                      padding: '1rem',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      opacity: hoveredCard === index ? 1 : 0.8,
                      transform: hoveredCard === index ? 'scale(1)' : 'scale(0.98)'
                    }}>
                      <Plus size={18} />
                      Quick Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Cart Item Component with advanced interactions
const CartItem = memo(({ item, onUpdateQuantity, onRemove }) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isHovered, setIsHovered] = useState(false);

  // Debounced quantity update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuantity !== item.quantity && localQuantity > 0) {
        setIsUpdating(true);
        setTimeout(() => {
          onUpdateQuantity(item.id, item.specifications, localQuantity);
          setIsUpdating(false);
        }, 300);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localQuantity, item.quantity, item.id, item.specifications, onUpdateQuantity]);

  const handleQuantityChange = useCallback((newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setLocalQuantity(newQuantity);
    }
  }, []);

  const handleRemove = useCallback(() => {
    if (window.confirm(`Remove ${item.name} from your cart?`)) {
      onRemove(item.id, item.specifications);
    }
  }, [item.id, item.name, item.specifications, onRemove]);

  const itemTotal = useMemo(() => 
    (item.totalPrice * localQuantity).toLocaleString(), 
    [item.totalPrice, localQuantity]
  );

  return (
    <div 
      style={{
        ...styles.glassCard,
        padding: '2rem',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(148, 180, 255, 0.2)' 
          : '0 20px 60px rgba(148, 180, 255, 0.15)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading Overlay */}
      {isUpdating && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div className="loading-spinner" style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f0f4ff',
            borderTop: '4px solid #94B4FF',
            borderRadius: '50%'
          }} />
        </div>
      )}

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '200px 1fr auto',
        gap: '2rem',
        alignItems: 'start',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Enhanced Product Image */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8faff 0%, #e0e9ff 100%)',
          border: '3px solid #f0f4ff',
          aspectRatio: '1',
          transition: 'all 0.3s ease'
        }}>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Package size={48} style={{ color: '#94B4FF', zIndex: 2 }} />
            </div>
          )}
          
          {/* Floating Quantity Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: '800',
            boxShadow: '0 6px 18px rgba(148, 180, 255, 0.4)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            {localQuantity}
          </div>

          {/* Premium Badge */}
          {item.isPremium && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Award size={12} />
              Premium
            </div>
          )}
        </div>

        {/* Enhanced Product Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{
              fontWeight: '800',
              color: '#1a1a1a',
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              lineHeight: '1.3',
              background: isHovered 
                ? 'linear-gradient(135deg, #1a1a1a, #94B4FF)' 
                : '#1a1a1a',
              WebkitBackgroundClip: isHovered ? 'text' : 'unset',
              WebkitTextFillColor: isHovered ? 'transparent' : 'unset',
              transition: 'all 0.3s ease'
            }}>
              {item.name}
            </h3>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <span style={{
                color: '#6b7280',
                fontSize: '1rem',
                fontWeight: '600',
                padding: '0.4rem 0.8rem',
                background: 'rgba(148, 180, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(148, 180, 255, 0.2)'
              }}>
                {item.category || 'Handcrafted Item'}
              </span>
              
              {item.rating && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(251, 191, 36, 0.1)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.2)'
                }}>
                  <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: '#1a1a1a', 
                    fontWeight: '600' 
                  }}>
                    {item.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Tags */}
          {item.tags && item.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginBottom: '1.5rem', 
              flexWrap: 'wrap' 
            }}>
              {item.tags.slice(0, 4).map((tag, index) => (
                <span key={index} style={{
                  background: 'linear-gradient(135deg, #f0f4ff, #e0e9ff)',
                  color: '#94B4FF',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: '1px solid #e0e9ff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Specifications Toggle */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <button 
              onClick={() => setShowSpecs(!showSpecs)}
              style={{
                color: '#94B4FF',
                background: 'rgba(148, 180, 255, 0.1)',
                border: '2px solid rgba(148, 180, 255, 0.2)',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontWeight: '600',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(148, 180, 255, 0.15)';
                e.target.style.borderColor = '#94B4FF';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                e.target.style.borderColor = 'rgba(148, 180, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <AlertCircle size={16} />
              {showSpecs ? 'Hide' : 'Show'} Customizations
              <div style={{
                transform: showSpecs ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}>
                ⌄
              </div>
            </button>
          )}

          {/* Enhanced Specifications */}
          {showSpecs && item.specifications && Object.keys(item.specifications).length > 0 && (
            <div className="specs-animation" style={{
              marginTop: '1rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
              borderRadius: '16px',
              border: '2px solid #e0e9ff'
            }}>
              <h4 style={{
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Zap size={18} style={{ color: '#94B4FF' }} />
                Your Customizations:
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {Object.entries(item.specifications).map(([key, value]) => (
                  <div key={key} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e0e9ff'
                  }}>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{
                      fontWeight: '700',
                      color: '#1a1a1a',
                      fontSize: '1rem'
                    }}>
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Information */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.9rem' }}>
                Free Delivery
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: '#94B4FF' }} />
              <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '0.9rem' }}>
                {item.deliveryTime || '3-5 days'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: '#94B4FF' }} />
              <span style={{ color: '#6b7280', fontWeight: '500', fontSize: '0.9rem' }}>
                Protected
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Quantity and Price Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '1.5rem',
          minWidth: '200px'
        }}>
          {/* Remove Button */}
          <button 
            onClick={handleRemove}
            style={{
              color: '#ff6b85',
              background: 'rgba(255, 107, 133, 0.1)',
              border: '2px solid rgba(255, 107, 133, 0.2)',
              padding: '0.75rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 107, 133, 0.15)';
              e.target.style.borderColor = '#ff6b85';
              e.target.style.transform = 'scale(1.05) rotate(5deg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 107, 133, 0.1)';
              e.target.style.borderColor = 'rgba(255, 107, 133, 0.2)';
              e.target.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <Trash2 size={20} />
          </button>

          {/* Price Display */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #94B4FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              ₹{itemTotal}
            </div>
            {localQuantity > 1 && (
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                fontWeight: '600'
              }}>
                ₹{item.totalPrice.toLocaleString()} each
              </div>
            )}
          </div>

          {/* Enhanced Quantity Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <label style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Quantity
            </label>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
              borderRadius: '16px',
              padding: '0.5rem',
              border: '2px solid #e0e9ff'
            }}>
              <button 
                onClick={() => handleQuantityChange(localQuantity - 1)}
                disabled={isUpdating || localQuantity <= 1}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: '2px solid #e0e9ff',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: localQuantity > 1 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  color: localQuantity > 1 ? '#94B4FF' : '#d1d5db',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (localQuantity > 1) {
                    e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                    e.target.style.borderColor = '#94B4FF';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.borderColor = '#e0e9ff';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Minus size={18} />
              </button>
              
              <div style={{
                minWidth: '50px',
                textAlign: 'center',
                fontWeight: '800',
                fontSize: '1.5rem',
                color: '#1a1a1a',
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #e0e9ff'
              }}>
                {localQuantity}
              </div>
              
              <button 
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={isUpdating || localQuantity >= 99}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: '2px solid #e0e9ff',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: localQuantity < 99 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  color: localQuantity < 99 ? '#94B4FF' : '#d1d5db',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (localQuantity < 99) {
                    e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                    e.target.style.borderColor = '#94B4FF';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.borderColor = '#e0e9ff';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '0.5rem'
          }}>
            <button style={{
              padding: '0.6rem',
              borderRadius: '10px',
              border: '2px solid rgba(148, 180, 255, 0.2)',
              background: 'rgba(148, 180, 255, 0.1)',
              color: '#94B4FF',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <Heart size={16} />
            </button>
            <button style={{
              padding: '0.6rem',
              borderRadius: '10px',
              border: '2px solid rgba(148, 180, 255, 0.2)',
              background: 'rgba(148, 180, 255, 0.1)',
              color: '#94B4FF',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <Gift size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Enhanced Order Summary Component
const OrderSummary = memo(({ 
  cartItems, 
  cartTotal, 
  promoCode, 
  setPromoCode, 
  appliedPromo, 
  handlePromoCode, 
  setAppliedPromo, 
  calculateDiscount, 
  shippingCost, 
  finalTotal, 
  handleCheckout, 
  isLoading, 
  estimatedDelivery 
}) => {
  const [hoveredPromo, setHoveredPromo] = useState(null);
  const [promoSuggestions] = useState(['FIRST10', 'SAVE50', 'LOVE20', 'PREMIUM30']);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '2px solid rgba(148, 180, 255, 0.2)',
      boxShadow: '0 25px 60px rgba(148, 180, 255, 0.15)',
      padding: '2.5rem',
      position: 'sticky',
      top: '2rem',
      transition: 'all 0.3s ease'
    }}>
      {/* Enhanced Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '2px solid rgba(148, 180, 255, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(148, 180, 255, 0.3)'
        }}>
          <Package size={24} style={{ color: 'white' }} />
        </div>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Order Summary
        </h2>
      </div>
      
      {/* Enhanced Promo Code Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }}>
          <Tag size={18} style={{ color: '#94B4FF' }} />
          Promo Code
        </label>
        
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              style={{
                flex: 1,
                border: '2px solid rgba(148, 180, 255, 0.2)',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#94B4FF';
                e.target.style.boxShadow = '0 0 0 4px rgba(148, 180, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(148, 180, 255, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button 
              onClick={handlePromoCode}
              style={{
                background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(148, 180, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 28px rgba(148, 180, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 20px rgba(148, 180, 255, 0.3)';
              }}
            >
              Apply
            </button>
          </div>
          
          {/* Promo Suggestions */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            {promoSuggestions.map((code, index) => (
              <button
                key={code}
                onClick={() => setPromoCode(code)}
                onMouseEnter={() => setHoveredPromo(index)}
                onMouseLeave={() => setHoveredPromo(null)}
                style={{
                  background: hoveredPromo === index 
                    ? 'linear-gradient(135deg, #94B4FF, #7da3ff)' 
                    : 'rgba(148, 180, 255, 0.1)',
                  color: hoveredPromo === index ? 'white' : '#94B4FF',
                  border: '1px solid rgba(148, 180, 255, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredPromo === index ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
        
        {/* Applied Promo Display */}
        {appliedPromo && (
          <div className="promo-success" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#22c55e',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '2px solid rgba(34, 197, 94, 0.2)',
            fontWeight: '600'
          }}>
            <CheckCircle size={20} />
            <span>{appliedPromo.description} applied!</span>
            <button
              onClick={() => setAppliedPromo(null)}
              style={{
                marginLeft: 'auto',
                background: 'rgba(107, 114, 128, 0.1)',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Price Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          fontSize: '1.1rem',
          padding: '0.75rem 0'
        }}>
          <span style={{ color: '#6b7280', fontWeight: '600' }}>
            Subtotal ({cartItems.length} items)
          </span>
          <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '1.2rem' }}>
            ₹{cartTotal.toLocaleString()}
          </span>
        </div>
        
        {appliedPromo && (
          <div className="discount-slide" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#22c55e',
            marginBottom: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            padding: '0.75rem 0'
          }}>
            <span>Discount ({appliedPromo.code})</span>
            <span>-₹{calculateDiscount().toLocaleString()}</span>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          fontSize: '1.1rem',
          padding: '0.75rem 0'
        }}>
          <span style={{ color: '#6b7280', fontWeight: '600' }}>Shipping</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {shippingCost === 0 ? (
              <>
                <span style={{
                  color: '#9ca3af',
                  fontWeight: '500',
                  textDecoration: 'line-through',
                  fontSize: '1rem'
                }}>
                  ₹50
                </span>
                <span style={{
                  color: '#22c55e',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Truck size={16} />
                  Free
                </span>
              </>
            ) : (
              <span style={{ fontWeight: '700', color: '#1a1a1a' }}>
                ₹{shippingCost}
              </span>
            )}
          </div>
        </div>
        
        {/* Free Shipping Progress */}
        {cartTotal < 500 && (
          <div style={{
            fontSize: '1rem',
            color: '#94B4FF',
            background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.1), rgba(148, 180, 255, 0.05))',
            padding: '1.25rem',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            fontWeight: '700',
            textAlign: 'center',
            border: '2px solid rgba(148, 180, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${(cartTotal / 500) * 100}%`,
              background: 'linear-gradient(90deg, rgba(148, 180, 255, 0.2), rgba(148, 180, 255, 0.1))',
              transition: 'width 0.5s ease',
              borderRadius: '16px'
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Truck size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Add ₹{(500 - cartTotal).toLocaleString()} more for free shipping!
            </div>
          </div>
        )}
        
        {/* Total Section */}
        <div style={{
          borderTop: '3px solid rgba(148, 180, 255, 0.2)',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.05), rgba(148, 180, 255, 0.02))',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(148, 180, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#1a1a1a'
          }}>
            <span>Total</span>
            <span style={{
              background: 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.75rem'
            }}>
              ₹{finalTotal.toLocaleString()}
            </span>
          </div>
          
          {appliedPromo && (
            <div style={{
              fontSize: '1rem',
              color: '#22c55e',
              marginTop: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ThumbsUp size={16} />
              You saved ₹{calculateDiscount().toLocaleString()}!
            </div>
          )}
        </div>
      </div>

      {/* Delivery Information */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        border: '2px solid rgba(34, 197, 94, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <MapPin size={18} style={{ color: '#22c55e' }} />
          <span style={{ color: '#1a1a1a', fontWeight: '700', fontSize: '1.1rem' }}>
            Estimated Delivery
          </span>
        </div>
        <div style={{
          color: '#6b7280',
          fontSize: '1rem',
          fontWeight: '600',
          marginLeft: '2rem'
        }}>
          {estimatedDelivery || 'July 15-18, 2025'}
        </div>
      </div>

      {/* Enhanced Checkout Button */}
      <button 
        onClick={handleCheckout}
        disabled={isLoading}
        style={{
          width: '100%',
          background: isLoading 
            ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' 
            : 'linear-gradient(135deg, #94B4FF 0%, #7da3ff 100%)',
          color: 'white',
          border: 'none',
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          fontSize: '1.25rem',
          fontWeight: '800',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          boxShadow: isLoading 
            ? '0 8px 20px rgba(209, 213, 219, 0.3)' 
            : '0 12px 32px rgba(148, 180, 255, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-4px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 40px rgba(148, 180, 255, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.4)';
          }
        }}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner" style={{
              width: '24px',
              height: '24px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%'
            }} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={24} />
            Proceed to Checkout
          </>
        )}
      </button>

      {/* Security Badges */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(148, 180, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(148, 180, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#6b7280',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <Shield size={16} style={{ color: '#22c55e' }} />
          Secure Payment
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#6b7280',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <CheckCircle size={16} style={{ color: '#22c55e' }} />
          Protected Order
        </div>
      </div>
    </div>
  );
});

// Main Cart Component
const ShoppingCartPage = memo(() => {
  const { 
    cartItems, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('cart');

  // Available promo codes
  const promoCodes = useMemo(() => ({
    'FIRST10': { description: '10% off first order', discount: 0.10 },
    'SAVE50': { description: '₹50 off orders above ₹300', discount: 50, minOrder: 300 },
    'LOVE20': { description: '20% off everything', discount: 0.20 },
    'PREMIUM30': { description: '30% off premium items', discount: 0.30, itemType: 'premium' }
  }), []);

  // Calculate shipping cost
  const shippingCost = useMemo(() => {
    return cartTotal >= 500 ? 0 : 50;
  }, [cartTotal]);

  // Calculate discount
  const calculateDiscount = useCallback(() => {
    if (!appliedPromo) return 0;
    
    const promo = promoCodes[appliedPromo.code];
    if (!promo) return 0;
    
    if (promo.minOrder && cartTotal < promo.minOrder) return 0;
    
    if (typeof promo.discount === 'number' && promo.discount < 1) {
      // Percentage discount
      return Math.round(cartTotal * promo.discount);
    } else {
      // Fixed amount discount
      return Math.min(promo.discount, cartTotal);
    }
  }, [appliedPromo, cartTotal, promoCodes]);

  // Calculate final total
  const finalTotal = useMemo(() => {
    const subtotal = cartTotal;
    const discount = calculateDiscount();
    const shipping = shippingCost;
    return Math.max(0, subtotal - discount + shipping);
  }, [cartTotal, calculateDiscount, shippingCost]);

  // Handle promo code application
  const handlePromoCode = useCallback(() => {
    const trimmedCode = promoCode.trim().toUpperCase();
    if (!trimmedCode) return;
    
    if (promoCodes[trimmedCode]) {
      const promo = promoCodes[trimmedCode];
      if (promo.minOrder && cartTotal < promo.minOrder) {
        alert(`This promo code requires a minimum order of ₹${promo.minOrder}`);
        return;
      }
      
      setAppliedPromo({ code: trimmedCode, ...promo });
      setPromoCode('');
    } else {
      alert('Invalid promo code. Please try again.');
    }
  }, [promoCode, promoCodes, cartTotal]);

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Order placed successfully! Total: ₹${finalTotal.toLocaleString()}`);
    clearCart();
    setAppliedPromo(null);
    setPromoCode('');
    setIsLoading(false);
  }, [finalTotal, clearCart]);

  // Navigation handlers
  const handleNavigation = useCallback((view) => {
    setCurrentView(view);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView('home');
  }, []);

  // Show empty cart if no items
  if (cartItems.length === 0) {
    return (
      <EmptyCartState 
        onNavigate={handleNavigation}
        onBack={handleBack}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <div style={styles.contentWrapper}>
        {/* Enhanced Header */}
        <div className="header-animation" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '3rem',
          paddingTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={handleBack}
              style={{
                ...styles.secondaryButton,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                fontSize: '1.1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(-8px) scale(1.02)';
                e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                e.target.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateX(0) scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <ArrowLeft size={22} />
              Continue Shopping
            </button>
            
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              Shopping Cart ({cartItems.length})
            </h1>
          </div>

          {/* Clear Cart Button */}
          {cartItems.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              style={{
                color: '#ff6b85',
                background: 'rgba(255, 107, 133, 0.1)',
                border: '2px solid rgba(255, 107, 133, 0.2)',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 107, 133, 0.15)';
                e.target.style.borderColor = '#ff6b85';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 107, 133, 0.1)';
                e.target.style.borderColor = 'rgba(255, 107, 133, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          )}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map((item) => (
              <CartItem
                key={`${item.id}-${JSON.stringify(item.specifications || {})}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            appliedPromo={appliedPromo}
            handlePromoCode={handlePromoCode}
            setAppliedPromo={setAppliedPromo}
            calculateDiscount={calculateDiscount}
            shippingCost={shippingCost}
            finalTotal={finalTotal}
            handleCheckout={handleCheckout}
            isLoading={isLoading}
            estimatedDelivery="August 5-8, 2025"
          />
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .floating-element-1 {
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-element-2 {
          animation: float 8s ease-in-out infinite reverse;
        }
        
        .header-animation {
          animation: slideInUp 0.8s ease-out;
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
        
        .promo-success {
          animation: slideInUp 0.5s ease-out;
        }
        
        .discount-slide {
          animation: slideInUp 0.6s ease-out;
        }
        
        .specs-animation {
          animation: slideInUp 0.4s ease-out;
        }
        
        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 1rem !important;
          }
          
          .cart-item {
            grid-template-columns: 120px 1fr !important;
            gap: 1rem !important;
          }
          
          .cart-item .quantity-controls {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
});

// Export the main component
export default function App() {
  return (
    <CartProvider>
      <ShoppingCartPage />
    </CartProvider>
  );
}