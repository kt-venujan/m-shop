import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Account from './components/Account';
import Loader from './components/Loader';
import Auth from './components/Auth';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReviews from './pages/admin/AdminReviews';
import WhatsAppButton from './components/WhatsAppButton';
import Wishlist from './pages/Wishlist';

import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { API_BASE_URL } from './config';

// Component responsible for rendering the full-screen loader between route transitions
function RouteTransitionLoader() {
  const { pathname } = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => AOS.refresh(), 100);
    }, 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Loader />
    </div>
  );
}

function MainLayout({ children, products, searchTerm, setSearchTerm, setSelectedCategory }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const { cartCount } = useCart();
  const { user, handleLogout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-200 flex flex-col">
      {!isAdmin && (
        <Navbar
          cartCount={cartCount}
          products={products}
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLogout={handleLogout}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      <main className="flex-grow relative z-0">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
}

function AppRoutes() {
  const { user, handleAuthSuccess, handleLogout } = useAuth();
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, syncCart } = useCart();

  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`),
          axios.get(`${API_BASE_URL}/api/settings`)
        ]);
        setSettings(settingsRes.data);
        setProducts(productsRes.data);
        setTimeout(() => setGlobalLoading(false), 400);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGlobalLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (globalLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {settings && (
        <style>{`
          .bg-orange-600, .bg-[#ff5100], .bg-orange-500, .bg-[#f57224] { background-color: ${settings.themeColor} !important; }
          .text-orange-600, .text-[#ff5100], .text-orange-500, .text-[#f57224] { color: ${settings.themeColor} !important; }
          .border-orange-600, .border-[#ff5100], .border-orange-500, .border-[#f57224] { border-color: ${settings.themeColor} !important; }
          .ring-orange-600, .ring-[#ff5100], .ring-orange-500 { --tw-ring-color: ${settings.themeColor} !important; }
          .shadow-orange-200 { --tw-shadow-color: ${settings.themeColor}55 !important; }
        `}</style>
      )}
      <RouteTransitionLoader />
      <MainLayout
        products={products}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedCategory={setSelectedCategory}
      >
        <Routes>
          <Route path="/" element={
            <>
              <Hero settings={settings} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              <ProductList products={displayedProducts} addToCart={addToCart} />
            </>
          } />
          <Route path="/cart" element={
            <Cart cart={cart} updateQuantity={updateCartQuantity} removeFromCart={removeFromCart} />
          } />
          <Route path="/product/:id" element={
            <ProductDetails products={products} addToCart={addToCart} />
          } />
          <Route path="/checkout" element={
            <Checkout cart={cart} user={user} clearCart={clearCart} />
          } />
          <Route path="/account" element={<Account user={user} handleLogout={handleLogout} />} />
          <Route path="/auth" element={
            <Auth onAuthSuccess={async (userData, token) => {
              await handleAuthSuccess(userData, token);
              await syncCart(token);
            }} />
          } />
          <Route path="/wishlist" element={<Wishlist addToCart={addToCart} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;