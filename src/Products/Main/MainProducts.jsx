import React, { useState, useEffect } from 'react';
import InspirationalBookmarkPage from '../Bookmarks/Inspirational.jsx';
import FloralBookmarksPage from '../Bookmarks/Floral.jsx';
import RegularCardPage from '../Cards/Regular.jsx';
import MiniCardPage from '../Cards/Mini.jsx';
import SpidermanCrochetPage from '../Crochet/spiderman.jsx'; 
import TulipCrochetPage from '../Crochet/Tuplip.jsx'; 
import TulipKeychainPage from '../Crochet/TulipKeychain.jsx'; 
import SunflowerPage from '../Crochet/sunflower.jsx'; 
import WatercolorLetterPage from '../Letters/Watercolor.jsx'
import VintageLetterPage from '../Letters/Vintage.jsx'

const ProductsShowcase = ({ initialCategory = 'All', searchQuery = '', navigationData = null }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState('showcase');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Updated product categories data - fixed Spiderman entry
  const productCategories = {
    'Letters': {
      items: [
        { name: 'Watercolor Letter', price: '₹299', originalPrice: '₹399', discount: '25% OFF', image: '/src/Products/Letters/Images/Watercolor.png', component: 'WatercolorLetterPage', route: '/products/Letters/Watercolor.jsx' },
        { name: 'Vintage Letter', price: '₹349', originalPrice: '₹449', discount: '22% OFF', image: '/src/Products/Letters/Images/Vintage.png', component: 'VintageLetterPage', route: '/Products/Letters/Vintage.jsx' },
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
        { name: 'Tulip', price: '₹399', originalPrice: '₹499', discount: '20% OFF', image: '/src/Products/Crochet/Images/tulip.png', component: 'TulipCrochetPage', route: '/products/crochet/Tulip.jsx', bestseller: true },
        { name: 'Tulip Keychain', price: '₹199', originalPrice: '₹249', discount: '20% OFF', image: '/src/Products/Crochet/Images/tulip_keychain.png', component: 'TulipKeychainPage', route: '/products/crochet/TulipKeychain.jsx' },
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
        { name: 'Birthday', price: '₹899', originalPrice: '₹1199', discount: '25% OFF', image: '/Hampers/images/birthday.jpg', component: 'BirthdayHamperPage', route: '/products/hampers/birthday' },
        { name: 'Christmas', price: '₹1299', originalPrice: '₹1599', discount: '19% OFF', image: '/Hampers/images/christmass.jpg', component: 'ChristmasHamperPage', route: '/products/hampers/christmas', bestseller: true },
        { name: 'Diwali', price: '₹999', originalPrice: '₹1299', discount: '23% OFF', image: '/Hampers/images/diwali.jpg', component: 'DiwaliHamperPage', route: '/products/hampers/diwali' },
        { name: 'Rakshabandhan', price: '₹799', originalPrice: '₹999', discount: '20% OFF', image: '/Hampers/images/rakshabandhan.jpg', component: 'RakshabandhanHamperPage', route: '/products/hampers/rakshabandhan' }
      ],
      page: 'hampers',
      customizable: true
    },
    'Extras': {
      items: [
        { name: 'Glass Bottle', price: '₹149', originalPrice: '₹199', discount: '25% OFF', image: '/Decorative/images/glassbottle.jpg', component: 'GlassBottleAddonPage', route: '/products/extras/glass-bottle' },
        { name: 'Subtle Packaging', price: '₹99', originalPrice: '₹149', discount: '33% OFF', image: '/src/Products/Decorative/Images/packaging.png', component: 'PackagingAddonPage', route: '/products/extras/packaging' }
      ],
      page: 'extras',
      customizable: true
    }
  };

  // Handle navigation data from navbar (for dropdown clicks)
  useEffect(() => {
    if (navigationData && navigationData.product) {
      // Direct product navigation from navbar dropdown
      const product = findProductByName(navigationData.product);
      if (product) {
        navigateToProductPage(product);
      }
    } else if (navigationData && navigationData.category) {
      // Category navigation from navbar
      setActiveCategory(navigationData.category);
      setCurrentPage('showcase');
    }
  }, [navigationData]);

  // Handle search query from navbar
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      handleSearchFilter(searchQuery);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  // Handle initial category from navbar
  useEffect(() => {
    if (initialCategory && initialCategory !== 'All') {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Find product by name (for search and dropdown navigation)
  const findProductByName = (productName) => {
    for (const [categoryName, category] of Object.entries(productCategories)) {
      const product = category.items.find(item => 
        item.name.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(item.name.toLowerCase())
      );
      if (product) {
        return { ...product, category: categoryName, categoryInfo: category };
      }
    }
    return null;
  };

  // Handle search filtering
  const handleSearchFilter = (query) => {
    const searchResults = [];
    const searchTerm = query.toLowerCase().trim();
    
    Object.entries(productCategories).forEach(([categoryName, category]) => {
      category.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchTerm)) {
          searchResults.push({ 
            ...item, 
            category: categoryName, 
            categoryInfo: category 
          });
        }
      });
    });
    
    setFilteredProducts(searchResults);
    setActiveCategory('Search Results');
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
    // If we have search results, show those
    if (filteredProducts.length > 0 && activeCategory === 'Search Results') {
      return filteredProducts;
    }
    
    // If search query but no results, show empty array
    if (searchQuery && searchQuery.trim() && activeCategory === 'Search Results') {
      return [];
    }
    
    // Regular category filtering
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

  // Updated navigation function with better product matching
  const navigateToProductPage = (product) => {
    console.log(`Viewing product: ${product.name}`);
    setSelectedProduct(product);
    
    // Normalize product name for comparison
    const productName = product.name.toLowerCase();
    
    if (productName.includes('inspirational') && productName.includes('bookmark')) {
      setCurrentPage('inspirational-bookmarks');
    } else if (productName.includes('floral') && productName.includes('bookmark')) {
      setCurrentPage('floral-bookmarks');
    } else if (productName.includes('regular') && productName.includes('card')) {
      setCurrentPage('regular-card');
    } else if (productName.includes('mini') && productName.includes('card')) {
      setCurrentPage('mini-card');
    } else if (productName.includes('spider') || productName.includes('spiderman')) {
      setCurrentPage('spiderman-crochet');
    } else if (productName === 'tulip' || (productName.includes('tulip') && !productName.includes('keychain'))) {
      setCurrentPage('tulip-crochet');
    } else if (productName.includes('tulip') && productName.includes('keychain')) {
      setCurrentPage('tulip-keychain');
    } else if (productName.includes('sunflower')) { 
      setCurrentPage('sunflower-crochet');
    } else if (productName.includes('watercolor') && productName.includes('letter')) { 
      setCurrentPage('watercolor-letter');
    } else if (productName.includes('vintage') && productName.includes('letter')) { 
      setCurrentPage('vintage-letter');
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
    setFilteredProducts([]);
    if (searchQuery) {
      setActiveCategory('All');
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setFilteredProducts([]);
    setCurrentPage('showcase');
  };

  const categories = ['All', 'Best Sellers', ...Object.keys(productCategories)];
  
  // Add search results category if we have search results
  if (searchQuery && searchQuery.trim()) {
    if (!categories.includes('Search Results')) {
      categories.unshift('Search Results');
    }
  }

  // Product page routing
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

  if (currentPage === 'spiderman-crochet') {
    return <SpidermanCrochetPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'tulip-crochet') {
    return <TulipCrochetPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'tulip-keychain') {
    return <TulipKeychainPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'sunflower-crochet') {
    return <SunflowerPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'watercolor-letter') {
    return <WatercolorLetterPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'vintage-letter') {
    return <VintageLetterPage onBack={handleBackToShowcase} product={selectedProduct} />;
  }

  if (currentPage === 'product-detail') {
    return <ProductDetailPage onBack={handleBackToShowcase} product={selectedProduct} onCustomize={handleCustomizeClick} />;
  }

  const displayedProducts = getFilteredProducts();

  return (
    <div className="products-showcase">
      {/* Header */}
      <div className="showcase-header">
        <h1>
          {activeCategory === 'Search Results' ? 
            `Search Results${searchQuery ? ` for "${searchQuery}"` : ''}` : 
            activeCategory === 'All' ? 'Our Products' : activeCategory
          }
        </h1>
        <p>
          {activeCategory === 'Search Results' ? 
            `Found ${displayedProducts.length} product${displayedProducts.length !== 1 ? 's' : ''}` :
            'Discover our handcrafted collection of personalized gifts'
          }
        </p>
      </div>

      {/* Products Section */}
      <section className="products">
        <div className="container">
          {/* Category Navigation - Hide during search */}
          {!searchQuery && (
            <div className="categories-wrapper">
              <div className="product-categories">
                {categories.filter(cat => cat !== 'Search Results').map(category => (
                  <button
                    key={category}
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span className="category-text">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Info */}
          {searchQuery && activeCategory === 'Search Results' && (
            <div className="search-info">
              <div className="search-header">
                <h3>Search Results for "{searchQuery}"</h3>
                <p>{displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''} found</p>
              </div>
              {displayedProducts.length > 0 && (
                <button 
                  className="clear-search-btn"
                  onClick={() => {
                    setFilteredProducts([]);
                    setActiveCategory('All');
                    // Note: searchQuery clearing should be handled by parent component
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Category Info */}
          {!searchQuery && activeCategory !== 'All' && activeCategory !== 'Best Sellers' && productCategories[activeCategory] && (
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
            {displayedProducts.map((product, index) => (
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
                  {searchQuery && (
                    <p className="product-category">from {product.category}</p>
                  )}
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

          {displayedProducts.length === 0 && (
            <div className="no-products">
              {searchQuery ? (
                <>
                  <p>No products found for "{searchQuery}"</p>
                  <p className="sub-text">Try searching with different keywords or browse our categories</p>
                </>
              ) : (
                <>
                  <p>No products found in this category.</p>
                  <p className="sub-text">Check back soon for new arrivals!</p>
                </>
              )}
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
