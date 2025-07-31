import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Heart, ArrowLeft, Package, Truck, CreditCard, Gift, Star, AlertCircle, CheckCircle } from 'lucide-react';

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
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('justSmallGiftsCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('justSmallGiftsCart', JSON.stringify(cartItems));
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item with same configuration already exists
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.specifications) === JSON.stringify(product.specifications)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if same configuration exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item with unique configuration
        return [...prevItems, { ...product, quantity: 1, addedAt: new Date().toISOString() }];
      }
    });
  };

  const removeFromCart = (itemId, specifications) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === itemId && JSON.stringify(item.specifications) === JSON.stringify(specifications))
      )
    );
  };

  const updateQuantity = (itemId, specifications, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, specifications);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && JSON.stringify(item.specifications) === JSON.stringify(specifications)
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

  // Promo codes system
  const promoCodes = {
    'FIRST10': { discount: 10, type: 'percentage', description: 'First time buyer discount' },
    'SAVE50': { discount: 50, type: 'fixed', description: 'Flat ₹50 off' },
    'LOVE20': { discount: 20, type: 'percentage', description: 'Love special discount' }
  };

  const handlePromoCode = () => {
    const code = promoCodes[promoCode.toUpperCase()];
    if (code) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...code });
    } else {
      alert('Invalid promo code');
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percentage') {
      return (cartTotal * appliedPromo.discount) / 100;
    }
    return appliedPromo.discount;
  };

  const finalTotal = cartTotal - calculateDiscount();

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
      alert('Redirecting to payment gateway...');
      onNavigate?.('checkout', { items: cartItems, total: finalTotal });
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate?.('home')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Shopping
              </button>
              <button 
                onClick={() => onNavigate?.('products')}
                className="border border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Products
              </button>
            </div>

            {/* Featured Products Suggestion */}
            <div className="mt-12 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Vintage Letter', price: '₹299', image: '/src/Products/Letters/Images/Vintage.png' },
                  { name: 'Floral Bookmarks', price: '₹99', image: '/src/Products/Bookmarks/Images/Floral.png' },
                  { name: 'Mini Cards', price: '₹149', image: '/src/Products/Cards/Images/Mini.png' }
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-amber-600 font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <button 
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <CartItem 
                key={`${item.id}-${index}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button 
                    onClick={handlePromoCode}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                
                {appliedPromo && (
                  <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    <span>{appliedPromo.description} applied!</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-₹{calculateDiscount()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Payment Methods */}
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>We accept:</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded">Cards</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">UPI</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">COD</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Truck size={20} className="text-amber-600" />
                  <span className="font-medium text-gray-800">Free Delivery</span>
                </div>
                <p className="text-sm text-gray-600">
                  Expected delivery in 3-5 working days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [showSpecs, setShowSpecs] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    onUpdateQuantity(item.id, item.specifications, newQuantity);
  };

  const handleRemove = () => {
    onRemove(item.id, item.specifications);
  };

  const renderSpecifications = () => {
    if (!item.specifications) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Specifications:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(item.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="font-medium">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.category}</p>
              
              {/* Product Tags */}
              {item.tags && (
                <div className="flex gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Specs Preview */}
              {item.specifications && (
                <button 
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="text-amber-600 hover:text-amber-700 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle size={14} />
                  {showSpecs ? 'Hide' : 'Show'} Specifications
                </button>
              )}
            </div>

            {/* Remove Button */}
            <button 
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Specifications */}
          {showSpecs && renderSpecifications()}

          {/* Quantity and Price */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                ₹{item.totalPrice * item.quantity}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-600">
                  ₹{item.totalPrice} each
                </div>
              )}
            </div>
          </div>

          {/* Rating and Reviews (if available) */}
          {item.rating && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < Math.floor(item.rating) ? 'fill-current' : ''} 
                  />
                ))}
              </div>
              <span className="text-gray-600">({item.reviews} reviews)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Updated Add to Cart Hook for Product Pages
export const useAddToCart = () => {
  const { addToCart } = useCart();

  const addProductToCart = (productData) => {
    // Create standardized product object
    const cartProduct = {
      id: productData.id || `${productData.name}-${Date.now()}`,
      name: productData.name,
      category: productData.category || 'Product',
      basePrice: productData.basePrice || 0,
      totalPrice: productData.totalPrice || productData.price || 0,
      image: productData.image,
      specifications: productData.specifications || {},
      tags: productData.tags || [],
      rating: productData.rating,
      reviews: productData.reviews,
      deliveryTime: productData.deliveryTime,
      timestamp: new Date().toISOString()
    };

    addToCart(cartProduct);
    return true;
  };

  return { addProductToCart };
};

export default CartPage;