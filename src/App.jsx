import { useState } from 'react'
import './App.css'
import Navbar from './NavBar/navbar'
import ProductsShowcase from './Products/Main/MainProducts.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [navigationData, setNavigationData] = useState(null)
  const [isShowingProductPage, setIsShowingProductPage] = useState(false)

  const handleNavigation = (page, data = null) => {
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
      case 'about':
        return <div>About Page</div>
      case 'contact':
        return <div>Contact Page</div>
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