import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductsShowcase from './Products/Main/MainProducts.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsShowcase />
    <App />
  </StrictMode>,
)
