import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ cartCount = 0, products = [], user = null, searchTerm = '', setSearchTerm, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideCategory, setHideCategory] = useState(false);
  const searchRef = useRef(null);
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      setHideCategory(currentScrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (setSearchTerm) setSearchTerm(e.target.value);
    setShowSuggestions(true);
    // Redirect to home page if they search from another page
    if (e.target.value.trim() !== '' && location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSuggestionClick = (product) => {
    if (setSearchTerm) setSearchTerm(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  const suggestions = searchTerm.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : [];

  return (
    <>
      <header className={`w-full z-50 sticky top-0 flex flex-col transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm relative'}`}>
        {/* Top Shelf */}
        <div className={`w-full transition-colors duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0 cursor-pointer group hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="bg-orange-600 text-white p-2 rounded transform rotate-45 flex items-center justify-center w-10 h-10 shadow-sm group-hover:rotate-90 group-hover:shadow-orange-500/50 transition-all duration-500">
                  <span className="font-bold text-lg transform -rotate-45 group-hover:-rotate-90 block mt-0.5 transition-all duration-500">M</span>
                </div>
                <div className="flex flex-col ml-1">
                  <span className="font-bold text-sm leading-tight text-gray-500 uppercase tracking-widest group-hover:text-orange-400 transition-colors">MERN</span>
                  <span className="font-extrabold text-2xl leading-none text-black tracking-tight group-hover:text-orange-600 transition-colors">STORE</span>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                  <svg className="h-5 w-5 text-orange-600 group-focus-within:animate-pulse transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowSuggestions(true)}
                  className="block flex-1 w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md relative z-10"
                  placeholder="Search electronics, clothing, accessories..."
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && searchTerm.trim() !== '' && suggestions.length > 0 && (
                  <div className="absolute top-[100%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden transform translate-y-2">
                    {suggestions.map((product, index) => (
                      <div
                        key={product._id}
                        onClick={() => handleSuggestionClick(product)}
                        className="px-6 py-3 cursor-pointer hover:bg-orange-50 transition-colors group/suggestion flex items-center"
                      >
                        <span className={`text-[15px] ${index === 0 ? 'text-orange-500' : 'text-gray-600 group-hover/suggestion:text-orange-500'} transition-colors`}>
                          {product.name.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                            part.toLowerCase() === searchTerm.toLowerCase()
                              ? <span key={i} className={`font-extrabold ${index === 0 ? 'text-orange-600' : 'text-black group-hover/suggestion:text-orange-600'}`}>{part}</span>
                              : part
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 sm:gap-6">

              {user ? (
                <div className="relative group cursor-pointer z-50">
                  <div className="flex items-center gap-1 font-bold text-black hover:text-orange-600 transition-all uppercase tracking-wide text-sm py-2">
                    <span className="hidden sm:inline">{user.name}'S ACCOUNT</span>
                    <Link to="/account" className="sm:hidden block">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </Link>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute top-[100%] right-0 w-64 pt-2 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 hidden sm:block">
                    {/* Carrot arrow pointing up */}
                    <div className="absolute -top-1 right-8 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
                    <div className="bg-white rounded shadow-xl border border-gray-200 overflow-hidden relative">
                      <ul className="py-2 flex flex-col">
                        <Link to="/account" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-[13px] text-gray-700 font-medium">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Manage My Account
                        </Link>
                        <Link to="/account" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-[13px] text-gray-700 font-medium">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          My Orders
                        </Link>
                        <Link to="/account" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-[13px] text-gray-700 font-medium">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          My Reviews
                        </Link>
                        <Link to="/account" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-[13px] text-gray-700 font-medium">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          My Returns & Cancellations
                        </Link>
                        <button onClick={() => { handleLogout(); navigate('/'); }} className="w-full flex items-center gap-4 px-5 py-3 mt-1 hover:bg-gray-50 transition-colors text-[13px] text-gray-700 font-medium outline-none text-left border-t border-gray-100">
                          <svg className="w-5 h-5 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Logout
                        </button>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="font-bold text-black hover:text-orange-600 transition-colors uppercase tracking-wide text-sm relative group overflow-hidden py-2">
                  <span className="hidden sm:inline relative z-10">Sign In</span>
                  <svg className="w-6 h-6 sm:hidden relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link to="/wishlist" className="relative font-bold text-black hover:text-orange-600 flex items-center gap-1 transition-all hover:scale-105 duration-300" title="Wishlist">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{wishlistCount}</span>
                )}
              </Link>

              <Link to="/cart" className="font-bold text-black hover:text-orange-600 flex items-center gap-1 transition-all hover:scale-105 duration-300 uppercase tracking-wide text-sm group">
                <span className="hidden sm:inline">Cart</span>
                <svg className="w-6 h-6 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className={`text-orange-600 transition-all duration-300 ${cartCount > 0 ? 'inline-block transform scale-110 font-black drop-shadow-sm group-hover:-translate-y-1' : ''}`}>( {cartCount} )</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden w-full px-4 pb-4 bg-white">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="h-5 w-5 text-orange-600 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setShowSuggestions(true)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white text-sm transition-all duration-300 shadow-sm relative z-10"
                placeholder="Search products..."
              />

              {/* Mobile Suggestions */}
              {showSuggestions && searchTerm.trim() !== '' && suggestions.length > 0 && (
                <div className="absolute top-[100%] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden mt-1">
                  {suggestions.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="px-5 py-3 cursor-pointer active:bg-orange-50 transition-colors flex items-center"
                    >
                      <span className={`text-[14px] ${index === 0 ? 'text-orange-500' : 'text-gray-600'} transition-colors`}>
                        {product.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Shelf (Categories) */}
      <div className={`w-full transition-all duration-300 ease-in-out origin-top bg-[#8e8e8e] shadow-lg relative z-40 hide-scrollbar ${hideCategory ? 'overflow-hidden pointer-events-none max-h-0 border-transparent' : 'overflow-x-auto md:overflow-visible pointer-events-auto max-h-[120px] border-t border-b border-gray-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className={`flex justify-start md:justify-center space-x-6 md:space-x-12 py-2 overflow-visible whitespace-nowrap lg:whitespace-normal transition-opacity duration-200 ${hideCategory ? 'opacity-0' : 'opacity-100'}`}>
              {['Electronics', 'Clothing', 'Home & Garden', 'Beauty', 'Sports'].map(category => {
                const categoryProducts = products.filter(p => p.category === category).slice(0, 3);
                return (
                  <div key={category} className="group relative">
                    <Link to="/" onClick={() => setSelectedCategory && setSelectedCategory(category)} className="flex items-center text-sm text-white font-bold hover:text-orange-400 transition-colors whitespace-nowrap tracking-wide py-4 relative z-10 drop-shadow">
                      {category}
                      <svg className="ml-1 w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </Link>

                    {/* Auto-Expanding Dropdown List */}
                    <div className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 hidden md:block w-[240px] z-[9999]">
                      <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden transform origin-top scale-95 group-hover:scale-100 transition-transform duration-300">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
                          <span className="font-extrabold text-black uppercase tracking-wider text-xs">Trending: {category}</span>
                        </div>
                        <ul className="py-2">
                          {categoryProducts.length > 0 ? (
                            categoryProducts.map(prod => (
                              <li key={prod._id}>
                                <Link to={`/product/${prod._id}`} className="block px-4 py-2 hover:bg-orange-50 transition-colors group/item relative">
                                  <span className="text-sm font-semibold text-gray-700 group-hover/item:text-orange-600 block truncate pr-12">{prod.name}</span>
                                  <span className="text-xs font-bold text-black group-hover/item:text-orange-600 absolute right-4 top-2.5">Rs. {(typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price)}</span>
                                </Link>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-4 text-center text-xs text-gray-400 font-bold uppercase tracking-wide">Coming soon</li>
                          )}
                        </ul>
                        <div className="p-3 bg-gray-50 text-center border-t border-gray-200 hover:bg-orange-600 group/btn transition-colors cursor-pointer">
                          <Link to="/" onClick={() => setSelectedCategory(category)} className="text-xs font-black text-black group-hover/btn:text-white uppercase tracking-widest block transition-colors">Shop All {category}</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
