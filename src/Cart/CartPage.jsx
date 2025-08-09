import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Gift,
  Star,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Clock,
  MapPin,
  Shield,
  Tag,
  X,
  User,
  LogIn,
  Loader2
} from 'lucide-react';
import { useAuth } from '../Authentication/Frontend/context/AuthContext';
import SignInSignUp from '../Authentication/Frontend/Auth/SignInSignUp';

// Cart Context for global state management
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // Using in-memory storage instead of localStorage for Claude.ai compatibility
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Update cart count and total whenever items change
  useEffect(() => {
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item =>
        item.id === product.id &&
        JSON.stringify(item.specifications || {}) === JSON.stringify(product.specifications || {})
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity || 1;
        return updatedItems;
      } else {
        return [...prevItems, {
          ...product,
          quantity: product.quantity || 1,
          addedAt: new Date().toISOString(),
          id: product.id || `${product.name}-${Date.now()}`,
          totalPrice: product.totalPrice || product.price || 0,
          specifications: product.specifications || {}
        }];
      }
    });
  };

  const removeFromCart = (itemId, specifications = {}) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.id === itemId &&
          JSON.stringify(item.specifications || {}) === JSON.stringify(specifications))
      )
    );
  };

  const updateQuantity = (itemId, specifications = {}, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, specifications);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId &&
        JSON.stringify(item.specifications || {}) === JSON.stringify(specifications)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Individual Cart Item Component with Premium Design
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateQuantity(item.id, item.specifications, newQuantity);
      setIsUpdating(false);
    }, 300);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      if (window.confirm(`Remove ${item.name} from cart?`)) {
        onRemove(item.id, item.specifications);
      }
      setIsRemoving(false);
    }, 200);
  };

  const renderSpecifications = () => {
    if (!item.specifications || Object.keys(item.specifications).length === 0) return null;

    return (
      <div style={{
        marginTop: '24px',
        padding: '28px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '20px',
        border: '2px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative gradient bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #94b4ff 0%, #ffffff 50%, #94b4ff 100%)'
        }} />
        
        <h4 style={{
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '20px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          letterSpacing: '-0.025em'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: '#94b4ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)'
          }}>
            <AlertCircle size={16} style={{ color: 'white' }} />
          </div>
          Product Specifications
        </h4>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px' 
        }}>
          {Object.entries(item.specifications).map(([key, value], index) => (
            <div key={key} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: `rgba(148, 180, 255, 0.1)`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              
              <span style={{ 
                color: '#64748b', 
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span style={{ 
                fontWeight: '800', 
                color: '#0f172a',
                fontSize: '15px',
                letterSpacing: '-0.025em'
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      style={{
        position: 'relative',
        background: isHovered 
          ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(148, 180, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Animated background decoration */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(148, 180, 255, 0.1)',
        transition: 'all 0.6s ease',
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        pointerEvents: 'none'
      }} />

      {/* Premium Loading Overlay */}
      {(isUpdating || isRemoving) && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#94b4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(148, 180, 255, 0.4)'
            }}>
              <Loader2 size={28} style={{ 
                animation: 'spin 1s linear infinite', 
                color: 'white' 
              }} />
            </div>
            <span style={{
              color: '#475569',
              fontWeight: '700',
              fontSize: '16px',
              letterSpacing: '-0.025em'
            }}>
              {isRemoving ? 'Removing item...' : 'Updating quantity...'}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '28px', alignItems: 'start', position: 'relative', zIndex: 1 }}>
        {/* Enhanced Product Image with Glass Effect */}
        <div style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #e2e8f0',
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
        }}>
          {item.image ? (
            <>
              <img src={item.image} alt={item.name} style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(148, 180, 255, 0.1)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }} />
            </>
          ) : (
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#94b4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)'
            }}>
              <Package size={28} style={{ color: 'white' }} />
            </div>
          )}
          
          {/* Glass overlay effect */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '30%',
            height: '30%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Product Details Section */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header with Title and Remove Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{ flex: 1, marginRight: '16px' }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: '#0f172a',
                margin: '0 0 8px 0',
                lineHeight: 1.3,
                letterSpacing: '-0.025em'
              }}>
                {item.name}
              </h3>
              {item.description && (
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {item.description}
                </p>
              )}
            </div>
            
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '2px solid #fecaca',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '48px',
                height: '48px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
              }}
              onMouseOver={(e) => {
                if (!isRemoving) {
                  e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'scale(1.1) rotate(5deg)';
                  e.target.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!isRemoving) {
                  e.target.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                  e.target.style.color = '#dc2626';
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
                }
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Rating, Category and Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {item.rating && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #f59e0b',
                boxShadow: '0 4px 8px rgba(245, 158, 11, 0.2)'
              }}>
                <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{ fontWeight: '800', color: '#92400e', fontSize: '14px' }}>
                  {item.rating}
                </span>
                {item.reviews && (
                  <span style={{ color: '#a16207', fontSize: '13px', fontWeight: '600' }}>
                    ({item.reviews})
                  </span>
                )}
              </div>
            )}
            
            {item.category && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.1) 0%, rgba(148, 180, 255, 0.2) 100%)',
                color: '#4338ca',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                border: '1px solid rgba(148, 180, 255, 0.3)',
                letterSpacing: '0.025em',
                textTransform: 'uppercase'
              }}>
                {item.category}
              </div>
            )}

            {item.deliveryTime && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid #10b981',
                boxShadow: '0 4px 8px rgba(16, 185, 129, 0.15)'
              }}>
                <Truck size={14} style={{ color: '#059669' }} />
                <span style={{
                  fontSize: '13px',
                  color: '#059669',
                  fontWeight: '700'
                }}>
                  {item.deliveryTime}
                </span>
              </div>
            )}
          </div>

          {/* Specifications Toggle */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              style={{
                background: showSpecs 
                  ? '#94b4ff'
                  : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                color: showSpecs ? 'white' : '#475569',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                marginBottom: '24px',
                fontWeight: '700',
                borderRadius: '14px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: showSpecs 
                  ? '0 8px 24px rgba(148, 180, 255, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
                letterSpacing: '-0.025em'
              }}
              onMouseOver={(e) => {
                if (!showSpecs) {
                  e.target.style.background = 'rgba(148, 180, 255, 0.1)';
                  e.target.style.color = '#4338ca';
                }
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                if (!showSpecs) {
                  e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                  e.target.style.color = '#475569';
                }
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <AlertCircle size={16} />
              {showSpecs ? 'Hide' : 'View'} Details
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: showSpecs ? 'rgba(255, 255, 255, 0.6)' : '#94b4ff',
                marginLeft: '4px'
              }} />
            </button>
          )}

          {/* Specifications */}
          {showSpecs && renderSpecifications()}

          {/* Enhanced Quantity and Price Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            padding: '28px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '20px',
            border: '2px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle animated background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(148, 180, 255, 0.05), transparent)',
              animation: 'shimmer 3s ease-in-out infinite'
            }} />

            {/* Quantity Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ 
                color: '#475569', 
                fontSize: '16px', 
                fontWeight: '800',
                letterSpacing: '-0.025em'
              }}>
                Quantity
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '16px',
                padding: '8px',
                border: '2px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}>
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#475569',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    if (!isUpdating) {
                      e.target.style.background = '#94b4ff';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 8px 16px rgba(148, 180, 255, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isUpdating) {
                      e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                      e.target.style.color = '#475569';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <Minus size={20} />
                </button>
                
                <div style={{
                  fontWeight: '800',
                  color: '#0f172a',
                  minWidth: '48px',
                  textAlign: 'center',
                  fontSize: '18px',
                  padding: '0 12px',
                  letterSpacing: '-0.025em'
                }}>
                  {item.quantity}
                </div>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#475569',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    if (!isUpdating) {
                      e.target.style.background = '#94b4ff';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 8px 16px rgba(148, 180, 255, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isUpdating) {
                      e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                      e.target.style.color = '#475569';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Enhanced Price Display */}
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #94b4ff 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '6px',
                letterSpacing: '-0.025em'
              }}>
                ₹{(item.totalPrice * item.quantity).toLocaleString()}
              </div>
              {item.totalPrice !== item.basePrice && (
                <div style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  ₹{(item.basePrice * item.quantity).toLocaleString()}
                </div>
              )}
              <div style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '600',
                padding: '4px 8px',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                ₹{item.totalPrice.toLocaleString()} per unit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Cart Page Component with Revolutionary Design
const CartPage = ({ onNavigate, onBack }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate estimated delivery date
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (4 * 24 * 60 * 60 * 1000));
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  // Enhanced promo codes system
  const promoCodes = {
    'FIRST10': { discount: 10, type: 'percentage', description: 'First time buyer discount', minOrder: 200 },
    'SAVE50': { discount: 50, type: 'fixed', description: 'Flat ₹50 off', minOrder: 300 },
    'LOVE20': { discount: 20, type: 'percentage', description: 'Love special discount', minOrder: 500 },
    'NEW25': { discount: 25, type: 'percentage', description: 'New customer special', minOrder: 400 },
    'GIFT15': { discount: 15, type: 'percentage', description: 'Gift season discount', minOrder: 250 }
  };

  const handlePromoCode = () => {
    const code = promoCodes[promoCode.toUpperCase()];
    if (code) {
      if (cartTotal >= code.minOrder) {
        setAppliedPromo({ code: promoCode.toUpperCase(), ...code });
        setPromoCode('');
      } else {
        alert(`Minimum order value of ₹${code.minOrder} required for this promo code`);
      }
    } else {
      alert('Invalid promo code. Try FIRST10, SAVE50, or LOVE20');
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percentage') {
      return Math.min((cartTotal * appliedPromo.discount) / 100, cartTotal * 0.5);
    }
    return Math.min(appliedPromo.discount, cartTotal);
  };

  const shippingCost = cartTotal >= 500 ? 0 : 50;
  const finalTotal = Math.max(0, cartTotal - calculateDiscount() + shippingCost);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      alert('Order placed successfully! 🎉');
      clearCart();
      setIsLoading(false);
    }, 1500);
  };

  // Enhanced Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #94b4ff 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, ${0.05 + i * 0.02})`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 20}%`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`
          }} />
        ))}

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: '40px',
          padding: '80px 60px',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Inner glow effect */}
          <div style={{
            position: 'absolute',
            inset: '2px',
            borderRadius: '38px',
            background: 'rgba(148, 180, 255, 0.1)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            width: '200px',
            height: '200px',
            borderRadius: '40px',
            background: '#94b4ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            margin: '0 auto 40px auto',
            boxShadow: '0 24px 48px rgba(148, 180, 255, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: '10%',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <ShoppingCart size={100} style={{ color: 'white', position: 'relative', zIndex: 1 }} />
          </div>
          
          <h2 style={{
            fontSize: '48px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            margin: '0 0 20px 0',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            Your cart is empty
          </h2>
          
          <p style={{
            fontSize: '20px',
            color: '#64748b',
            marginBottom: '48px',
            lineHeight: 1.6,
            margin: '0 0 48px 0',
            fontWeight: '500'
          }}>
            Ready to discover something extraordinary? Let's start your shopping adventure!
          </p>
          
          <button
            onClick={onBack || (() => window.history.back())}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: '#94b4ff',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 12px 24px rgba(148, 180, 255, 0.4)',
              margin: '0 auto',
              letterSpacing: '-0.025em'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px) scale(1.05)';
              e.target.style.boxShadow = '0 20px 40px rgba(148, 180, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 12px 24px rgba(148, 180, 255, 0.4)';
            }}
          >
            <ArrowLeft size={20} />
            Start Shopping
            <Sparkles size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(148, 180, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(148, 180, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Enhanced Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '24px',
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
          transform: `translateY(${scrollY * 0.1}px)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
              onClick={onBack || (() => window.history.back())}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                color: '#475569',
                border: '2px solid #e2e8f0',
                padding: '14px 20px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#94b4ff';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(148, 180, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                e.target.style.color = '#475569';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <ArrowLeft size={18} />
              Back to Shop
            </button>
            
            <div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 8px 0',
                letterSpacing: '-0.025em'
              }}>
                Shopping Cart
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '16px',
                margin: 0,
                fontWeight: '500'
              }}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          {isAuthenticated && user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              padding: '16px 24px',
              borderRadius: '16px',
              border: '2px solid #10b981',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <div style={{ color: '#059669', fontWeight: '800', fontSize: '14px' }}>
                  Welcome back!
                </div>
                <div style={{ color: '#047857', fontSize: '13px', fontWeight: '600' }}>
                  {user.name}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 420px',
          gap: '40px',
          alignItems: 'start'
        }} className="cart-grid">
          
          {/* Cart Items Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${JSON.stringify(item.specifications)}`} style={{
                animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`
              }}>
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Order Summary Section */}
          <div style={{ position: 'sticky', top: '32px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(24px)',
              borderRadius: '28px',
              padding: '36px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(148, 180, 255, 0.2)',
                pointerEvents: 'none'
              }} />

              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #0f172a 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 0 28px 0',
                letterSpacing: '-0.025em'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: '#94b4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)'
                }}>
                  <CreditCard size={18} style={{ color: 'white' }} />
                </div>
                Order Summary
              </h2>

              {/* Price Breakdown with Enhanced Design */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>Subtotal</span>
                      <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px' }}>
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        borderRadius: '12px',
                        border: '1px solid #10b981'
                      }}>
                        <span style={{ color: '#059669', fontWeight: '700', fontSize: '15px' }}>
                          Discount ({appliedPromo.code})
                        </span>
                        <span style={{ color: '#059669', fontWeight: '800', fontSize: '16px' }}>
                          -₹{calculateDiscount().toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                      <span style={{ color: '#64748b', fontWeight: '600' }}>Shipping</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {shippingCost === 0 ? (
                          <>
                            <span style={{
                              color: '#94a3b8',
                              fontSize: '14px',
                              textDecoration: 'line-through'
                            }}>
                              ₹50
                            </span>
                            <div style={{
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '13px'
                            }}>
                              FREE
                            </div>
                          </>
                        ) : (
                          <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px' }}>
                            ₹{shippingCost}
                          </span>
                        )}
                      </div>
                    </div>

                    {cartTotal < 500 && (
                      <div style={{
                        fontSize: '14px',
                        color: '#4338ca',
                        background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.1) 0%, rgba(148, 180, 255, 0.2) 100%)',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: '2px solid rgba(148, 180, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: '700'
                      }}>
                        <Sparkles size={16} />
                        Add ₹{(500 - cartTotal).toLocaleString()} more for free shipping!
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '28px',
                  background: '#94b4ff',
                  borderRadius: '20px',
                  color: 'white',
                  boxShadow: '0 16px 32px rgba(148, 180, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                    animation: 'rotate 20s linear infinite',
                    pointerEvents: 'none'
                  }} />
                  <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.025em' }}>
                    Total Amount
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.025em' }}>
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                {/* Enhanced Promo Code Section */}
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.1) 0%, rgba(148, 180, 255, 0.15) 100%)',
                  borderRadius: '20px',
                  border: '2px solid rgba(148, 180, 255, 0.3)'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#4338ca',
                    marginBottom: '16px',
                    letterSpacing: '-0.025em'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: '#94b4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Tag size={14} style={{ color: 'white' }} />
                    </div>
                    Have a Promo Code?
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter your code"
                      style={{
                        flex: 1,
                        border: '2px solid rgba(148, 180, 255, 0.3)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        background: 'white'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#94b4ff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(148, 180, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(148, 180, 255, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      onClick={handlePromoCode}
                      style={{
                        background: '#94b4ff',
                        color: 'white',
                        border: 'none',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '800',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)',
                        letterSpacing: '-0.025em'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 24px rgba(148, 180, 255, 0.4)';
                        e.target.style.background = '#7c9aff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 16px rgba(148, 180, 255, 0.3)';
                        e.target.style.background = '#94b4ff';
                      }}
                    >
                      Apply Code
                    </button>
                  </div>

                  {appliedPromo && (
                    <div style={{
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '2px solid #10b981',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                      animation: 'slideInRight 0.5s ease-out'
                    }}>
                      <CheckCircle size={20} style={{ color: '#059669' }} />
                      <span style={{ flex: 1, color: '#059669', fontWeight: '700', fontSize: '15px' }}>
                        {appliedPromo.description} applied! 🎉
                      </span>
                      <button
                        onClick={() => setAppliedPromo(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#059669',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#f0fdf4';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Enhanced Delivery Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.08) 0%, rgba(148, 180, 255, 0.12) 100%)',
                  borderRadius: '20px',
                  border: '2px solid rgba(148, 180, 255, 0.2)',
                  boxShadow: '0 8px 16px rgba(148, 180, 255, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#94b4ff'
                  }} />
                  
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#94b4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)',
                    animation: 'bounce 2s ease-in-out infinite'
                  }}>
                    <Truck size={24} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <div style={{ 
                      fontWeight: '800', 
                      color: '#4338ca', 
                      fontSize: '16px', 
                      marginBottom: '4px',
                      letterSpacing: '-0.025em'
                    }}>
                      Estimated Delivery
                    </div>
                    <div style={{ 
                      color: '#5b21b6', 
                      fontSize: '14px', 
                      fontWeight: '600' 
                    }}>
                      {estimatedDelivery}
                    </div>
                  </div>
                </div>

                {/* Enhanced Security Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '16px',
                  border: '2px solid #bbf7d0',
                  boxShadow: '0 4px 12px rgba(187, 247, 208, 0.3)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={16} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <div style={{ 
                      color: '#059669', 
                      fontSize: '14px', 
                      fontWeight: '800',
                      letterSpacing: '-0.025em'
                    }}>
                      Secure Checkout
                    </div>
                    <div style={{ 
                      color: '#047857', 
                      fontSize: '12px', 
                      fontWeight: '600' 
                    }}>
                      SSL encrypted & protected
                    </div>
                  </div>
                </div>

                {/* Enhanced Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: isLoading 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : isAuthenticated 
                        ? '#94b4ff'
                        : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '20px',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: '800',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: '12px',
                    opacity: isLoading ? 0.8 : 1,
                    boxShadow: isLoading 
                      ? '0 8px 16px rgba(156, 163, 175, 0.3)'
                      : isAuthenticated
                        ? '0 12px 24px rgba(148, 180, 255, 0.4)'
                        : '0 12px 24px rgba(220, 38, 38, 0.4)',
                    letterSpacing: '-0.025em',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-3px)';
                      if (isAuthenticated) {
                        e.target.style.boxShadow = '0 16px 32px rgba(148, 180, 255, 0.5)';
                        e.target.style.background = '#7c9aff';
                      } else {
                        e.target.style.boxShadow = '0 16px 32px rgba(220, 38, 38, 0.5)';
                      }
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      if (isAuthenticated) {
                        e.target.style.boxShadow = '0 12px 24px rgba(148, 180, 255, 0.4)';
                        e.target.style.background = '#94b4ff';
                      } else {
                        e.target.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)';
                      }
                    }
                  }}
                >
                  {/* Button shine effect */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: isLoading ? 'none' : 'shine 2s ease-in-out infinite',
                    pointerEvents: 'none'
                  }} />
                  
                  {isLoading ? (
                    <>
                      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                      Processing Order...
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <CreditCard size={24} />
                      Proceed to Checkout
                      <Sparkles size={20} />
                    </>
                  ) : (
                    <>
                      <LogIn size={24} />
                      Sign In to Continue
                    </>
                  )}
                </button>

                {/* Enhanced Auth Info */}
                {!isAuthenticated && (
                  <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(148, 180, 255, 0.08) 0%, rgba(148, 180, 255, 0.12) 100%)',
                    borderRadius: '20px',
                    border: '2px solid rgba(148, 180, 255, 0.2)',
                    marginTop: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(148, 180, 255, 0.15)',
                      pointerEvents: 'none'
                    }} />
                    
                    <div style={{
                      color: '#4338ca',
                      fontWeight: '800',
                      marginBottom: '12px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      letterSpacing: '-0.025em'
                    }}>
                      <User size={20} />
                      Account Required
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#5b21b6',
                      marginBottom: '16px',
                      margin: '0 0 16px 0',
                      fontWeight: '600',
                      lineHeight: 1.5
                    }}>
                      Sign in to save your cart, track orders, and enjoy faster checkout
                    </p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      style={{
                        background: '#94b4ff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '0 auto',
                        boxShadow: '0 8px 16px rgba(148, 180, 255, 0.3)',
                        letterSpacing: '-0.025em'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px) scale(1.05)';
                        e.target.style.boxShadow = '0 12px 24px rgba(148, 180, 255, 0.4)';
                        e.target.style.background = '#7c9aff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0) scale(1)';
                        e.target.style.boxShadow = '0 8px 16px rgba(148, 180, 255, 0.3)';
                        e.target.style.background = '#94b4ff';
                      }}
                    >
                      <LogIn size={16} />
                      Sign In Now
                    </button>
                  </div>
                )}

                {/* Enhanced Payment Methods */}
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '24px',
                  padding: '24px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ 
                    marginBottom: '16px', 
                    fontWeight: '800', 
                    fontSize: '16px', 
                    color: '#475569',
                    margin: '0 0 16px 0',
                    letterSpacing: '-0.025em'
                  }}>
                    We Accept
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '12px'
                  }}>
                    {[
                      { name: 'Visa', color: '#1a1f71' },
                      { name: 'Mastercard', color: '#eb001b' },
                      { name: 'PayPal', color: '#003087' },
                      { name: 'UPI', color: '#ff6600' }
                    ].map((method, index) => (
                      <div key={method.name} style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        fontWeight: '800',
                        fontSize: '14px',
                        color: method.color,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'default',
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                      }}>
                        {method.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Terms */}
                <div style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: 1.6,
                  paddingTop: '20px',
                  fontWeight: '500'
                }}>
                  By placing your order, you agree to our{' '}
                  <a href="/terms" style={{ 
                    color: '#94b4ff', 
                    textDecoration: 'none',
                    fontWeight: '700',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.borderBottomColor = '#94b4ff'}
                  onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}>
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="/privacy" style={{ 
                    color: '#94b4ff', 
                    textDecoration: 'none',
                    fontWeight: '700',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.borderBottomColor = '#94b4ff'}
                  onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}>
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Modal */}
        {showAuthModal && (
          <SignInSignUp
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {/* Enhanced CSS Animations and Styles */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes shine {
            0% { left: -100%; }
            50% { left: 100%; }
            100% { left: 100%; }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            0% { opacity: 0; transform: translateX(30px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @media (max-width: 1024px) {
            .cart-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
          }
          
          @media (max-width: 768px) {
            .cart-grid {
              gap: 24px !important;
            }
          }
          
          /* Enhanced focus transitions */
          input:focus {
            box-shadow: 0 0 0 4px rgba(148, 180, 255, 0.1) !important;
            border-color: #94b4ff !important;
          }
          
          /* Smooth scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #94b4ff;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #7c9aff;
          }
          
          /* Responsive adjustments */
          @media (max-width: 640px) {
            .cart-grid {
              padding: 16px !important;
            }
          }
          
          /* Premium glass effects */
          .glass-effect {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          
          /* Smooth transitions for all interactive elements */
          button, input, select {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Enhanced hover states */
          .hover-lift:hover {
            transform: translateY(-4px);
          }
          
          /* Custom selection colors */
          ::selection {
            background: rgba(148, 180, 255, 0.3);
            color: #0f172a;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CartPage;