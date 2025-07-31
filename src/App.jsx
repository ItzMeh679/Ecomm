import { useState } from 'react'
import './App.css'
import Navbar from './NavBar/navbar'
import ProductsShowcase from './Products/Main/MainProducts.jsx'
import CartPage from './Cart/CartPage.jsx'


function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [navigationData, setNavigationData] = useState(null)
  const [isShowingProductPage, setIsShowingProductPage] = useState(false)

  const handleNavigation = (page, data = null) => {
    console.log('Navigation:', page, data) // Debug log
    setCurrentPage(page)
    setNavigationData(data)
    setIsShowingProductPage(false) // Reset when navigating from App
  }

  const handleProductPageState = (isShowing) => {
    setIsShowingProductPage(isShowing)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            {/* Your home page content */}
            <ProductsShowcase 
              navigationData={navigationData} 
              onNavigate={handleNavigation}
            />
          </div>
        )
      
      case 'products':
      case 'search':
        return (
          <ProductsShowcase 
            initialCategory={navigationData?.category || 'All'}
            searchQuery={navigationData?.query || ''}
            navigationData={navigationData}
            onNavigate={handleNavigation}
          />
        )
      
      case 'cart':
        return (
          <CartPage 
            onNavigate={handleNavigation}
            onBack={() => handleNavigation('home')}
          />
        )
      
      case 'wishlist':
        return (
          <WishlistPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'notifications':
        return (
          <NotificationsPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'profile':
        return (
          <ProfilePage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'orders':
        return (
          <OrdersPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'settings':
        return (
          <SettingsPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'login':
        return (
          <LoginPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'signup':
        return (
          <SignupPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'about':
        return (
          <AboutPage 
            onNavigate={handleNavigation}
          />
        )
      
      case 'contact':
        return (
          <ContactPage 
            onNavigate={handleNavigation}
          />
        )
      
      default:
        return (
          <ProductsShowcase 
            navigationData={navigationData} 
            onNavigate={handleNavigation}
          />
        )
    }
  }

  return (
    <>
      <Navbar 
        onNavigate={handleNavigation} 
        onProductPageState={handleProductPageState}
      />
      {/* Only render main content when NOT showing a product page */}
      {!isShowingProductPage && renderCurrentPage()}
    </>
  )
}

export default App