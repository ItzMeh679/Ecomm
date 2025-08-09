import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './Cart/CartPage.jsx' // Add this import
import { AuthProvider } from './Authentication/Frontend/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider>
       <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)