import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: '600' },
              success: { iconTheme: { primary: '#f57224', secondary: '#fff' } },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
