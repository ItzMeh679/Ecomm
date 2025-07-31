import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Heart, ArrowLeft, Package, Truck, CreditCard, Gift, Star, AlertCircle, CheckCircle, Sparkles, TrendingUp, Clock, MapPin, Shield, Tag, X } from 'lucide-react';

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
  const [cartItems, setCartItems] = useState(() => {
    // Note: In Claude artifacts, we use memory storage instead of localStorage
    // In your actual implementation, you can use localStorage
    return [];
  });

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Update cart count and total whenever items change
  useEffect(() => {
    // In your actual app, save to localStorage here:
    // localStorage.setItem('justSmallGiftsCart', JSON.stringify(cartItems));
    
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item with same configuration already exists
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.specifications || {}) === JSON.stringify(product.specifications || {})
      );

      if (existingItemIndex !== -1) {
        // Update quantity if same configuration exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity || 1;
        return updatedItems;
      } else {
        // Add new item with unique configuration
        return [...prevItems, { 
          ...product, 
          quantity: product.quantity || 1, 
          addedAt: new Date().toISOString(),
          // Ensure required fields exist
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
        !(item.id === itemId && JSON.stringify(item.specifications || {}) === JSON.stringify(specifications))
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
        item.id === itemId && JSON.stringify(item.specifications || {}) === JSON.stringify(specifications)
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

// Main Cart Page Component
const CartPage = ({ onNavigate, onBack }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Calculate estimated delivery date (3-5 days from now)
  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (4 * 24 * 60 * 60 * 1000)); // 4 days from now
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
      return Math.min((cartTotal * appliedPromo.discount) / 100, cartTotal * 0.5); // Max 50% discount
    }
    return Math.min(appliedPromo.discount, cartTotal); // Can't discount more than total
  };

  const shippingCost = cartTotal >= 500 ? 0 : 50;
  const finalTotal = Math.max(0, cartTotal - calculateDiscount() + shippingCost);

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
      alert('Redirecting to payment gateway...');
      onNavigate?.('checkout', { items: cartItems, total: finalTotal, appliedPromo });
    }, 2000);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      clearCart();
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        padding: '2rem 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginBottom: '3rem',
            paddingTop: '1rem'
          }}>
            <button 
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#94B4FF',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f0f4ff';
                e.target.style.transform = 'translateX(-4px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft size={22} />
              <span>Continue Shopping</span>
            </button>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1a1a1a',
              margin: 0
            }}>
              Shopping Cart
            </h1>
          </div>

          {/* Empty Cart Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(148, 180, 255, 0.15)',
            border: '1px solid #f0f4ff',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: `radial-gradient(circle, rgba(148, 180, 255, 0.1) 0%, transparent 70%)`,
              borderRadius: '50%'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '150px',
                height: '150px',
                background: `linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                position: 'relative',
                border: '3px solid #94B4FF'
              }}>
                <ShoppingCart size={60} style={{ color: '#94B4FF' }} />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#94B4FF',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  0
                </div>
              </div>
              
              <h2 style={{ 
                fontSize: '2.25rem', 
                fontWeight: '600', 
                color: '#1a1a1a', 
                marginBottom: '1rem' 
              }}>
                Your cart is empty
              </h2>
              
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '3rem', 
                fontSize: '1.2rem',
                lineHeight: '1.6',
                maxWidth: '500px',
                margin: '0 auto 3rem'
              }}>
                Looks like you haven't added any beautiful handcrafted items yet.<br />
                Start exploring our amazing collection of unique gifts!
              </p>
              
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
                    backgroundColor: '#94B4FF',
                    color: 'white',
                    padding: '1rem 2.5rem',
                    borderRadius: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 24px rgba(148, 180, 255, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#7da3ff';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#94B4FF';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(148, 180, 255, 0.3)';
                  }}
                >
                  <Sparkles size={20} />
                  Start Shopping
                </button>
                
                <button 
                  onClick={() => onNavigate?.('products')}
                  style={{
                    border: '2px solid #94B4FF',
                    color: '#94B4FF',
                    backgroundColor: 'white',
                    padding: '1rem 2.5rem',
                    borderRadius: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8faff';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(148, 180, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <TrendingUp size={20} />
                  Browse Products
                </button>
              </div>

              {/* Featured Products Grid */}
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#1a1a1a', 
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <Star size={24} style={{ color: '#94B4FF' }} />
                  Popular Items You Might Love
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '2rem'
                }}>
                  {[
                    { 
                      name: 'Vintage Letter Collection', 
                      price: '₹299', 
                      originalPrice: '₹399',
                      image: '/src/Products/Letters/Images/Vintage.png',
                      rating: 4.9,
                      discount: '25% OFF'
                    },
                    { 
                      name: 'Floral Bookmarks Set', 
                      price: '₹99', 
                      originalPrice: '₹149',
                      image: '/src/Products/Bookmarks/Images/Floral.png',
                      rating: 4.8,
                      discount: '33% OFF'
                    },
                    { 
                      name: 'Mini Greeting Cards', 
                      price: '₹149', 
                      originalPrice: '₹199',
                      image: '/src/Products/Cards/Images/Mini.png',
                      rating: 4.9,
                      discount: '25% OFF'
                    }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        border: '1px solid #f0f4ff',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        backgroundColor: 'white'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.borderColor = '#94B4FF';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#f0f4ff';
                      }}
                    >
                      {item.discount && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: '#ff6b85',
                          color: 'white',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {item.discount}
                        </div>
                      )}
                      
                      <div style={{
                        aspectRatio: '1',
                        backgroundColor: '#f8faff',
                        borderRadius: '12px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #f0f4ff'
                      }}>
                        <Package size={32} style={{ color: '#94B4FF' }} />
                      </div>
                      
                      <h4 style={{ 
                        fontWeight: '600', 
                        color: '#1a1a1a', 
                        marginBottom: '0.75rem',
                        fontSize: '1.1rem'
                      }}>
                        {item.name}
                      </h4>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#94B4FF', fontWeight: '700', fontSize: '1.1rem' }}>{item.price}</span>
                          {item.originalPrice && (
                            <span style={{ 
                              color: '#9ca3af', 
                              textDecoration: 'line-through',
                              fontSize: '0.9rem'
                            }}>
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items - Full screen layout
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Enhanced Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '3rem',
          paddingTop: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#94B4FF',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f0f4ff';
                e.target.style.transform = 'translateX(-4px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <ArrowLeft size={22} />
              <span>Continue Shopping</span>
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: '#1a1a1a',
                margin: 0
              }}>
                Shopping Cart
              </h1>
              
              <div style={{
                backgroundColor: '#f0f4ff',
                color: '#94B4FF',
                padding: '0.75rem 1.5rem',
                borderRadius: '16px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '2px solid #94B4FF'
              }}>
                <ShoppingCart size={18} />
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleClearCart}
            style={{
              color: '#ff6b85',
              background: 'white',
              border: '2px solid #ff6b85',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#fff5f7';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Trash2 size={18} />
            Clear Cart
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Cart Items - Left Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item, index) => (
              <CartItem 
                key={`${item.id}-${index}-${JSON.stringify(item.specifications)}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Enhanced Order Summary - Right Side */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(148, 180, 255, 0.15)',
            border: '2px solid #f0f4ff',
            padding: '2rem',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1a1a1a', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Package size={24} style={{ color: '#94B4FF' }} />
              Order Summary
            </h2>
            
            {/* Promo Code Section */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#1a1a1a', 
                marginBottom: '0.75rem' 
              }}>
                <Tag size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#94B4FF' }} />
                Promo Code
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (e.g., FIRST10)"
                  style={{
                    flex: 1,
                    border: '2px solid #f0f4ff',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#94B4FF'}
                  onBlur={(e) => e.target.style.borderColor = '#f0f4ff'}
                />
                <button 
                  onClick={handlePromoCode}
                  style={{
                    backgroundColor: '#94B4FF',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#7da3ff';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#94B4FF';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Apply
                </button>
              </div>
              
              {appliedPromo && (
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#22c55e',
                  fontSize: '1rem',
                  backgroundColor: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #bbf7d0',
                  fontWeight: '500'
                }}>
                  <CheckCircle size={18} />
                  <span>{appliedPromo.description} applied!</span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>
                  Subtotal ({cartItems.length} items)
                </span>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>₹{cartTotal}</span>
              </div>
              
              {appliedPromo && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  color: '#22c55e',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-₹{calculateDiscount()}</span>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                <span style={{ color: '#6b7280', fontWeight: '500' }}>Shipping</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {shippingCost === 0 ? (
                    <>
                      <span style={{ 
                        color: '#6b7280', 
                        fontWeight: '500',
                        textDecoration: 'line-through',
                        fontSize: '1rem'
                      }}>
                        ₹50
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: '700' }}>Free</span>
                    </>
                  ) : (
                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>₹{shippingCost}</span>
                  )}
                </div>
              </div>
              
              {cartTotal < 500 && (
                <div style={{
                  fontSize: '0.95rem',
                  color: '#94B4FF',
                  backgroundColor: '#f0f4ff',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  border: '2px solid #e0e9ff'
                }}>
                  Add ₹{500 - cartTotal} more for free shipping!
                </div>
              )}
              
              <div style={{
                borderTop: '2px solid #f0f4ff',
                paddingTop: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  color: '#1a1a1a'
                }}>
                  <span>Total</span>
                  <span style={{ color: '#94B4FF' }}>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#94B4FF',
                color: 'white',
                border: 'none',
                padding: '1.25rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 24px rgba(148, 180, 255, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#7da3ff';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(148, 180, 255, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#94B4FF';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(148, 180, 255, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={22} />
                  Proceed to Checkout
                </>
              )}
            </button>

            {/* Payment Methods */}
            <div style={{ textAlign: 'center', fontSize: '1rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', fontWeight: '500' }}>We accept:</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Credit Cards', 'UPI', 'Net Banking', 'COD'].map((method) => (
                  <span key={method} style={{
                    backgroundColor: '#f8faff',
                    color: '#94B4FF',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '1px solid #e0e9ff'
                  }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0f4ff',
              borderRadius: '16px',
              marginBottom: '1.5rem',
              border: '2px solid #e0e9ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <Truck size={24} style={{ color: '#94B4FF' }} />
                <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '1.1rem' }}>Free Delivery</span>
              </div>
              <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0, fontWeight: '500' }}>
                Expected delivery: <strong style={{ color: '#1a1a1a' }}>{estimatedDelivery}</strong>
              </p>
            </div>

            {/* Security Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: '#6b7280',
              fontSize: '0.9rem',
              padding: '1rem',
              backgroundColor: '#f8faff',
              borderRadius: '12px',
              fontWeight: '500',
              border: '1px solid #f0f4ff'
            }}>
              <Shield size={16} style={{ color: '#22c55e' }} />
              <span>Secure checkout protected by SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframes for loading animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Enhanced Individual Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    setIsUpdating(true);
    // Simulate network delay for better UX
    setTimeout(() => {
      onUpdateQuantity(item.id, item.specifications, newQuantity);
      setIsUpdating(false);
    }, 300);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      onRemove(item.id, item.specifications);
    }
  };

  const renderSpecifications = () => {
    if (!item.specifications || Object.keys(item.specifications).length === 0) return null;

    return (
      <div style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: '#f8faff',
        borderRadius: '16px',
        border: '2px solid #f0f4ff'
      }}>
        <h4 style={{ 
          fontWeight: '600', 
          color: '#1a1a1a', 
          marginBottom: '1rem',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={16} style={{ color: '#94B4FF' }} />
          Customizations:
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          fontSize: '1rem'
        }}>
          {Object.entries(item.specifications).map(([key, value]) => (
            <div key={key} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.5rem 0'
            }}>
              <span style={{ color: '#6b7280', textTransform: 'capitalize', fontWeight: '500' }}>
                {key.replace(/([A-Z])/g, ' $1')}:
              </span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(148, 180, 255, 0.12)',
      border: '2px solid #f0f4ff',
      padding: '2rem',
      transition: 'all 0.3s ease',
      position: 'relative'
    }}>
      {isUpdating && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f0f4ff',
            borderTop: '4px solid #94B4FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
        {/* Product Image */}
        <div style={{
          width: '160px',
          height: '160px',
          backgroundColor: '#f8faff',
          borderRadius: '16px',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid #f0f4ff'
        }}>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={40} style={{ color: '#94B4FF' }} />
            </div>
          )}
          
          {/* Quantity badge on image */}
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: '#94B4FF',
            color: 'white',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(148, 180, 255, 0.4)'
          }}>
            {item.quantity}
          </div>
        </div>

        {/* Product Details */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontWeight: '700', 
                color: '#1a1a1a', 
                fontSize: '1.4rem',
                marginBottom: '0.5rem',
                lineHeight: '1.3'
              }}>
                {item.name}
              </h3>
              
              <p style={{ 
                color: '#6b7280', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                fontWeight: '500'
              }}>
                {item.category || 'Handcrafted Item'}
              </p>
              
              {/* Product Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} style={{
                      backgroundColor: '#f0f4ff',
                      color: '#94B4FF',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      border: '1px solid #e0e9ff'
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
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    marginBottom: '1rem',
                    fontWeight: '600'
                  }}
                >
                  <AlertCircle size={16} />
                  {showSpecs ? 'Hide' : 'Show'} Customizations
                </button>
              )}
            </div>

            {/* Remove Button */}
            <button 
              onClick={handleRemove}
              style={{
                color: '#ff6b85',
                backgroundColor: 'white',
                border: '2px solid #ff6b85',
                padding: '0.75rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#fff5f7';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Specifications */}
          {showSpecs && renderSpecifications()}

          {/* Quantity and Price */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginTop: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>Quantity:</span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                backgroundColor: '#f8faff',
                borderRadius: '16px',
                padding: '0.5rem',
                border: '2px solid #f0f4ff'
              }}>
                <button 
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: '2px solid #e0e9ff',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#94B4FF'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f0f4ff';
                    e.target.style.borderColor = '#94B4FF';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#e0e9ff';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Minus size={16} />
                </button>
                
                <span style={{ 
                  minWidth: '40px', 
                  textAlign: 'center', 
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  color: '#1a1a1a'
                }}>
                  {item.quantity}
                </span>
                
                <button 
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: '2px solid #e0e9ff',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#94B4FF'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f0f4ff';
                    e.target.style.borderColor = '#94B4FF';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#e0e9ff';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#1a1a1a',
                marginBottom: '0.25rem'
              }}>
                ₹{(item.totalPrice * item.quantity).toLocaleString()}
              </div>
              {item.quantity > 1 && (
                <div style={{ 
                  fontSize: '1rem', 
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  ₹{item.totalPrice} each
                </div>
              )}
            </div>
          </div>

          {/* Rating and Reviews (if available) */}
          {item.rating && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              marginTop: '1rem',
              fontSize: '1rem'
            }}>
              <div style={{ display: 'flex', color: '#fbbf24' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    style={{ 
                      fill: i < Math.floor(item.rating) ? 'currentColor' : 'none',
                      color: i < Math.floor(item.rating) ? '#fbbf24' : '#d1d5db'
                    }} 
                  />
                ))}
              </div>
              <span style={{ color: '#6b7280', fontWeight: '500' }}>
                {item.rating} ({item.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Delivery Time */}
          {item.deliveryTime && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '0.75rem',
              fontSize: '1rem',
              color: '#22c55e',
              fontWeight: '600'
            }}>
              <Clock size={16} />
              <span>Delivery in {item.deliveryTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Add to Cart Hook for Product Pages
export const useAddToCart = () => {
  const { addToCart } = useCart();

  const addProductToCart = (productData) => {
    // Create standardized product object
    const cartProduct = {
      id: productData.id || `${productData.name}-${Date.now()}`,
      name: productData.name,
      category: productData.category || 'Handcrafted Item',
      basePrice: productData.basePrice || productData.price || 0,
      totalPrice: productData.totalPrice || productData.price || 0,
      image: productData.image,
      specifications: productData.specifications || {},
      tags: productData.tags || [],
      rating: productData.rating,
      reviews: productData.reviews,
      deliveryTime: productData.deliveryTime || '3-5 days',
      quantity: productData.quantity || 1,
      timestamp: new Date().toISOString()
    };

    addToCart(cartProduct);
    return true;
  };

  return { addProductToCart };
};

export default CartPage;