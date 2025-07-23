import React, { useState } from 'react';
import InspirationalBookmarkPage from '../Bookmarks/Inspirational.jsx';
import FloralBookmarksPage from '../Bookmarks/Floral.jsx';
import RegularCardPage from '../Cards/Regular.jsx';
import MiniCardPage from '../Cards/Mini.jsx';
import SpidermanCrochetPage from '../Crochet/spiderman.jsx'; // Add this import

const ProductsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState('showcase');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Updated product categories data - fixed Spiderman entry
  const productCategories = {
    'Letters': {
      items: [
        { name: 'Watercolor Letter', price: '₹299', originalPrice: '₹399', discount: '25% OFF', image: '/src/Products/Letters/Images/Watercolor.png', component: 'WatercolorPage', route: '/products/letters/watercolor' },
        { name: 'Vintage Letter', price: '₹349', originalPrice: '₹449', discount: '22% OFF', image: '/src/Products/Letters/Images/Vintage.png', component: 'VintagePage', route: '/products/letters/vintage' },
        { name: 'Matte Black Letter', price: '₹279', originalPrice: '₹349', discount: '20% OFF', image: '/src/Products/Letters/images/matteblack.jpg', component: 'MatteBlackPage', route: '/products/letters/matte-black' }
      ],
      page: 'letters',
      customizable: true
    },
    'Cards': {
      items: [
        { name: 'Mini Cards', price: '₹149', originalPrice: '₹199', discount: '25% OFF', image: '/src/Products/Cards/Images/Mini.png', component: 'MiniCardPage', route: '/products/cards/Mini', bestseller: true },
        { name: 'Regular Card', price: '₹199', originalPrice: '₹249', discount: '20% OFF', image: '/src/Products/Cards/Images/Regular.png', component: 'RegularCardPage', route: '/products/cards/regular' }
      ],
      page: 'cards',
      customizable: true
    },
    'Crochet': {
      items: [
        { name: 'Tulip', price: '₹399', originalPrice: '₹499', discount: '20% OFF', image: '/src/Products/Crochet/Images/tulip.png', component: 'TulipPage', route: '/products/crochet/tulip', bestseller: true },
        { name: 'Tulip Keychain', price: '₹199', originalPrice: '₹249', discount: '20% OFF', image: '/src/Products/Crochet/Images/tulip_keychain.png', component: 'TulipKeychainPage', route: '/products/crochet/tulip-keychain' },
        // Fixed Spiderman entry with correct data
        { name: 'Spider-Man Crochet', price: '₹299', originalPrice: '₹399', discount: '25% OFF', image: '/src/Products/Crochet/Images/Spiderman.png', component: 'SpidermanCrochetPage', route: '/products/crochet/spiderman', bestseller: true },
        { name: 'Sunflower', price: '₹449', originalPrice: '₹549', discount: '18% OFF', image: '/Crochet/images/sunflower.jpg', component: 'SunflowerPage', route: '/products/crochet/sunflower' }
      ],
      page: 'crochet',
      customizable: false
    },
    'Bookmarks': {
      items: [
        { name: 'Floral Bookmarks', price: '₹99', originalPrice: '₹149', discount: '33% OFF', image: '/src/Products/Bookmarks/Images/Floral.png', component: 'FloralBookmarksPage', route: '/src/Products/Bookmarks/Floral.jsx', bestseller: true },
        { name: 'Inspirational Bookmarks', price: '₹99', originalPrice: '₹149', discount: '33% OFF', image: '/src/Products/Bookmarks/Images/Inspirational.png', component: 'InspirationalBookmarkPage', route: '/src/Products/Bookmarks/Inspirational.jsx' }
      ],
      page: 'bookmarks',
      customizable: true
    },
    'Hampers': {
      items: [
        { name: 'Birthday Hamper', price: '₹899', originalPrice: '₹1199', discount: '25% OFF', image: '/Hampers/images/birthday.jpg', component: 'BirthdayHamperPage', route: '/products/hampers/birthday' },
        { name: 'Christmas Hamper', price: '₹1299', originalPrice: '₹1599', discount: '19% OFF', image: '/Hampers/images/christmass.jpg', component: 'ChristmasHamperPage', route: '/products/hampers/christmas', bestseller: true },
        { name: 'Diwali Hamper', price: '₹999', originalPrice: '₹1299', discount: '23% OFF', image: '/Hampers/images/diwali.jpg', component: 'DiwaliHamperPage', route: '/products/hampers/diwali' },
        { name: 'Rakshabandhan Hamper', price: '₹799', originalPrice: '₹999', discount: '20% OFF', image: '/Hampers/images/rakshabandhan.jpg', component: 'RakshabandhanHamperPage', route: '/products/hampers/rakshabandhan' }
      ],
      page: 'hampers',
      customizable: true
    },
    'Extras': {
      items: [
        { name: 'Glass Bottle Add-on', price: '₹149', originalPrice: '₹199', discount: '25% OFF', image: '/Decorative/images/glassbottle.jpg', component: 'GlassBottleAddonPage', route: '/products/extras/glass-bottle' },
        { name: 'Packaging Add-on', price: '₹99', originalPrice: '₹149', discount: '33% OFF', image: '/src/Products/Decorative/Images/packaging.png', component: 'PackagingAddonPage', route: '/products/extras/packaging' }
      ],
      page: 'extras',
      customizable: true
    }
  };

  // Get all products or filtered by category
  const getAllProducts = () => {
    const allItems = [];
    Object.entries(productCategories).forEach(([categoryName, category]) => {
      category.items.forEach(item => {
        allItems.push({ ...item, category: categoryName, categoryInfo: category });
      });
    });
    return allItems;
  };

  const getFilteredProducts = () => {
    if (activeCategory === 'All') {
      return getAllProducts();
    }
    if (activeCategory === 'Best Sellers') {
      return getAllProducts().filter(item => item.bestseller);
    }
    return productCategories[activeCategory]?.items.map(item => ({
      ...item,
      category: activeCategory,
      categoryInfo: productCategories[activeCategory]
    })) || [];
  };

  // Updated navigation function with Spiderman support
  const navigateToProductPage = (product) => {
    console.log(`Viewing product: ${product.name}`);
    setSelectedProduct(product);
    
    // Navigate to specific product page based on product name
    if (product.name === 'Inspirational Bookmarks') {
      setCurrentPage('inspirational-bookmarks');
    } else if (product.name === 'Floral Bookmarks') {
      setCurrentPage('floral-bookmarks');
    } else if (product.name === 'Regular Card') {
      setCurrentPage('regular-card');
    } else if (product.name === 'Mini Cards') {
      setCurrentPage('mini-card');
    } else if (product.name === 'Spider-Man Crochet') { // Updated condition
      setCurrentPage('spiderman-crochet');
    } else {
      // For products without specific pages, show generic product detail page
      setCurrentPage('product-detail');
      console.log(`Specific page for ${product.name} not implemented yet, showing generic detail page`);
    }
  };

  const handleProductClick = (product) => {
    navigateToProductPage(product);
  };

  const handleCustomizeClick = (product, e) => {
    e.stopPropagation();
    console.log(`Customizing product: ${product.name}`);
    navigateToProductPage(product);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    console.log(`Adding ${product.name} to cart`);
    alert(`${product.name} added to cart!`);
  };

  const handleBackToShowcase = () => {
    setCurrentPage('showcase');
    setSelectedProduct(null);
  };

  const categories = ['All', 'Best Sellers', ...Object.keys(productCategories)];

  // Render different pages based on currentPage state
  if (currentPage === 'inspirational-bookmarks') {
    return <InspirationalBookmarkPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'floral-bookmarks') {
    return <FloralBookmarksPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'regular-card') {
    return <RegularCardPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'mini-card') {
    return <MiniCardPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  // Added Spiderman crochet page navigation
  if (currentPage === 'spiderman-crochet') {
    return <SpidermanCrochetPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'product-detail') {
    return <ProductDetailPage onBack={handleBackToShowcase} product={selectedProduct} onCustomize={handleCustomizeClick} />;
  }

  return (
    <div className="products-showcase">
      {/* Header */}
      <div className="showcase-header">
        <h1>Our Products</h1>
        <p>Discover our handcrafted collection of personalized gifts</p>
      </div>

      {/* Products Section */}
      <section className="products">
        <div className="container">
          {/* Category Navigation */}
          <div className="categories-wrapper">
            <div className="product-categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  <span className="category-text">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Info */}
          {activeCategory !== 'All' && activeCategory !== 'Best Sellers' && productCategories[activeCategory] && (
            <div className="category-info">
              <div className="category-header">
                <h3>{activeCategory}</h3>
                {productCategories[activeCategory].customizable && (
                  <span className="customizable-badge">Customizable</span>
                )}
              </div>
              <p className="category-description">
                {activeCategory === 'Letters' && 'Beautiful handwritten letters for every occasion'}
                {activeCategory === 'Cards' && 'Personalized cards to express your feelings'}
                {activeCategory === 'Crochet' && 'Adorable handmade crochet creations'}
                {activeCategory === 'Bookmarks' && 'Unique bookmarks for book lovers'}
                {activeCategory === 'Hampers' && 'Thoughtfully curated gift hampers'}
                {activeCategory === 'Extras' && 'Beautiful add-ons to enhance your gifts'}
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div className="product-grid">
            {getFilteredProducts().map((product, index) => (
              <div 
                key={`${product.category}-${product.name}-${index}`}
                className={`product-card ${product.bestseller ? 'bestseller' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                {product.discount && <div className="discount-badge">{product.discount}</div>}
                {product.bestseller && <div className="bestseller-badge">Popular</div>}
                
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-img"
                  />
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">
                    {product.name}
                  </h3>
                  <div className="product-price">
                    <span className="current-price">{product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    {product.categoryInfo?.customizable ? (
                      <button 
                        className="action-btn customize-btn"
                        onClick={(e) => handleCustomizeClick(product, e)}
                      >
                        Customize
                      </button>
                    ) : (
                      <button 
                        className="action-btn add-cart-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getFilteredProducts().length === 0 && (
            <div className="no-products">
              <p>No products found in this category.</p>
              <p className="sub-text">Check back soon for new arrivals!</p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .products-showcase {
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #fcfdfd 0%, #E8E4FF 100%);
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }

        .showcase-header {
          text-align: center;
          padding: 3rem 2rem 2rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
        }

        .showcase-header h1 {
          font-size: 3rem;
          color: #1d2b4b;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .showcase-header p {
          font-size: 1.2rem;
          color: #424446;
          margin: 0;
        }

        /* Products Section */
        .products {
          padding: 2rem 0;
          width: 100%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Categories */
        .categories-wrapper {
          margin-bottom: 3rem;
          padding: 1.5rem 0;
        }

        .product-categories {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-btn {
          background: rgba(252, 253, 253, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(141, 172, 243, 0.2);
          color: #1d2b4b;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          box-shadow: 0 2px 10px rgba(141, 172, 243, 0.1);
          position: relative;
          overflow: hidden;
        }

        .category-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(148, 180, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .category-btn:hover::before {
          left: 100%;
        }

        .category-btn:hover {
          background: rgba(148, 180, 255, 0.1);
          border-color: #94B4FF;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(141, 172, 243, 0.2);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          color: white;
          border-color: #8dacf3;
          box-shadow: 0 4px 15px rgba(141, 172, 243, 0.3);
        }

        .category-btn.active:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(141, 172, 243, 0.4);
        }

        /* Category Info */
        .category-info {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 3rem;
          text-align: center;
          border: 1px solid rgba(141, 172, 243, 0.1);
          box-shadow: 0 5px 20px rgba(141, 172, 243, 0.1);
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .category-header h3 {
          font-size: 1.8rem;
          color: #1d2b4b;
          margin: 0;
          font-weight: 600;
        }

        .customizable-badge {
          background: linear-gradient(135deg, #94B4FF, #8dacf3);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(141, 172, 243, 0.3);
        }

        .category-description {
          color: #424446;
          font-size: 1.1rem;
          margin: 0;
          line-height: 1.6;
        }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2.5rem;
          padding: 1rem 0;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(141, 172, 243, 0.1);
          transition: all 0.4s ease;
          position: relative;
          box-shadow: 0 5px 20px rgba(141, 172, 243, 0.1);
          cursor: pointer;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, transparent, rgba(148, 180, 255, 0.2), transparent);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(141, 172, 243, 0.2);
          border-color: rgba(148, 180, 255, 0.3);
        }

        .product-card:hover::before {
          opacity: 1;
        }

        .product-card.bestseller {
          border-color: rgba(129, 212, 250, 0.3);
          box-shadow: 0 5px 20px rgba(128, 210, 248, 0.1);
        }

        .bestseller-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: linear-gradient(135deg, #94B4FF, #cddbfdff);
          color: #1d2b4b;
          padding: 0.3rem 0.7rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(111, 217, 243, 0.3);
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 0.3rem 0.7rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .product-image {
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, rgba(232, 228, 255, 0.3), rgba(148, 180, 255, 0.1));
          position: relative;
          overflow: hidden;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .product-info {
          padding: 1.8rem;
        }

        .product-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1d2b4b;
          margin-bottom: 1rem;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .product-title:hover {
          color: #8dacf3;
        }

        .product-price {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .current-price {
          font-size: 1.4rem;
          color: #1d2b4b;
          font-weight: 700;
        }

        .original-price {
          text-decoration: line-through;
          color: #9ca3af;
          font-size: 1rem;
        }

        .product-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          width: 100%;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          position: relative;
          overflow: hidden;
        }

        .customize-btn {
          background: linear-gradient(135deg, #8dacf3, #94B4FF);
          color: white;
          box-shadow: 0 4px 15px rgba(141, 172, 243, 0.3);
        }

        .customize-btn:hover {
          background: linear-gradient(135deg, #1d2b4b, #8dacf3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(141, 172, 243, 0.4);
        }

        .add-cart-btn {
          background: linear-gradient(135deg, #1d2b4b, #424446);
          color: white;
          box-shadow: 0 4px 15px rgba(29, 43, 75, 0.3);
        }

        .add-cart-btn:hover {
          background: linear-gradient(135deg, #424446, #1d2b4b);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(29, 43, 75, 0.4);
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
          color: #424446;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          margin-top: 2rem;
        }

        .no-products p {
          font-size: 1.2rem;
          margin: 0.5rem 0;
        }

        .sub-text {
          opacity: 0.7;
          font-size: 1rem !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
          
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
          }
          
          .product-categories {
            gap: 0.5rem;
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .category-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
            flex-shrink: 0;
          }
          
          .category-info {
            padding: 1.5rem;
          }
          
          .category-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .category-header h3 {
            font-size: 1.5rem;
          }

          .showcase-header h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .product-card {
            max-width: 350px;
            margin: 0 auto;
          }
          
          .category-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
          
          .product-info {
            padding: 1.5rem;
          }
        }

        /* Custom scrollbar for category buttons on mobile */
        .product-categories::-webkit-scrollbar {
          height: 4px;
        }

        .product-categories::-webkit-scrollbar-track {
          background: rgba(141, 172, 243, 0.1);
          border-radius: 2px;
        }

        .product-categories::-webkit-scrollbar-thumb {
          background: rgba(141, 172, 243, 0.3);
          border-radius: 2px;
        }

        .product-categories::-webkit-scrollbar-thumb:hover {
          background: rgba(141, 172, 243, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ProductsShowcase;