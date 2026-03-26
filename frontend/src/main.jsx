import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
