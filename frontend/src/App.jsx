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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

function MainLayout({ children, cartCount, products, user, searchTerm, setSearchTerm, handleLogout, setSelectedCategory }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-200 flex flex-col">
      {!isAdmin && <Navbar cartCount={cartCount} products={products} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleLogout={handleLogout} setSelectedCategory={setSelectedCategory} />}
      
      <main className="flex-grow relative z-0">
        {children}
      </main>
      
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Cart state 
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mern_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('mern_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);
  useEffect(() => {
    // Attempt to load user from local storage
    const storedUser = localStorage.getItem('mern_user');
    const token = localStorage.getItem('mern_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Fetch server cart
      axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setCart(res.data)).catch(err => console.error('Error fetching cart:', err));
    }
  }, []);

  const getAuthHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('mern_token')}` } };
  };

  const handleAuthSuccess = async (userData, token) => {
    localStorage.setItem('mern_token', token);
    localStorage.setItem('mern_user', JSON.stringify(userData));
    setUser(userData);
    
    // Sync local cart to backend if items exist
    const localCart = JSON.parse(localStorage.getItem('mern_cart')) || [];
    try {
      if (localCart.length > 0) {
        await axios.post(`${API_BASE_URL}/api/cart/sync`, 
          { items: localCart.map(i => ({ productId: i._id, quantity: i.quantity })) }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.removeItem('mern_cart');
      }
      
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mern_token');
    localStorage.removeItem('mern_user');
    setUser(null);
    setCart([]); // Clear cart entirely on logout
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/clear`, getAuthHeaders());
      } catch (err) { console.error('Clear cart error:', err); }
    } else {
      localStorage.removeItem('mern_cart');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`),
          axios.get(`${API_BASE_URL}/api/settings`)
        ]);
        setSettings(settingsRes.data);
        setTimeout(() => {
          setProducts(productsRes.data);
          setGlobalLoading(false);
        }, 1800);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGlobalLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    
    if (user) {
      try {
        await axios.post(`${API_BASE_URL}/api/cart/add`, { productId: product._id, quantity }, getAuthHeaders());
      } catch (err) { console.error('Add cart error:', err); }
    }
  };

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQuantity } : item));
    
    if (user) {
      try {
        await axios.put(`${API_BASE_URL}/api/cart/update`, { productId, quantity: newQuantity }, getAuthHeaders());
      } catch (err) { console.error('Update cart error:', err); }
    }
  };
  
  const removeFromCart = async (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
    
    if (user) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, getAuthHeaders());
      } catch (err) { console.error('Remove cart error:', err); }
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Initial Full Screen App Load Sequence
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
      {/* Activates the full-page loader on every navigation routing link clicked */}
      <RouteTransitionLoader />
      
      <MainLayout cartCount={cartCount} products={products} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleLogout={handleLogout} setSelectedCategory={setSelectedCategory}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero 
                settings={settings}
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
              />
              <ProductList 
                products={displayedProducts} 
                addToCart={addToCart}
              />
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
          <Route path="/auth" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
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

export default App;