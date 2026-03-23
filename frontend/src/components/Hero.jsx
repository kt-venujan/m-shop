import { useState, useEffect } from 'react';

export default function Hero({ settings, selectedCategory, setSelectedCategory }) {
  const bgImages = settings?.sliderImages?.length > 0 ? settings.sliderImages : [
    '/hero-bg.png',
    '/hero-bg-2.png',
    '/hero-bg-3.png'
  ];
  
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 5000); // Switch every 5 seconds
    return () => clearInterval(timer);
  }, [bgImages.length]);

  return (
    <div className="flex flex-col w-full">
    <div className="relative bg-black overflow-hidden w-full min-h-[500px] md:min-h-[600px] py-16 flex flex-col justify-center items-center">
      {/* Background Image Slider */}
      <div className="absolute inset-0 bg-black">
        {bgImages.map((src, index) => (
          <img 
            key={src}
            src={src} 
            alt={`E-commerce Background ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-70 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        {/* Dark subtle overlay for text readability and gradient fade */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent mix-blend-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 text-center mt-4">
        <h1 data-aos="zoom-out" data-aos-duration="1000" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight mb-8">
          I'm looking for
        </h1>
        
        {/* Search / Filter inline form */}
        <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col md:flex-row items-center justify-center gap-2">
          
          {/* Dropdown 1 */}
          <div className="relative w-full md:w-52 bg-white rounded flex items-center">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-transparent py-3.5 pl-4 pr-10 text-gray-900 font-bold text-sm focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Dropdown 2 */}
          <div className="relative w-full md:w-52 bg-white rounded flex items-center">
            <select className="w-full appearance-none bg-transparent py-3.5 pl-4 pr-10 text-gray-900 font-bold text-sm focus:outline-none cursor-pointer">
              <option>Brands</option>
              <option>Quantum</option>
              <option>Sonic</option>
              <option>Pro</option>
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Dropdown 3 */}
          <div className="relative w-full md:w-52 bg-white rounded flex items-center">
            <select className="w-full appearance-none bg-transparent py-3.5 pl-4 pr-10 text-gray-900 font-bold text-sm focus:outline-none cursor-pointer">
              <option>Other Products</option>
              <option>Accessories</option>
              <option>Gift Cards</option>
              <option>Clearance</option>
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Action Button */}
          <button onClick={() => setSelectedCategory('All')} className="w-full md:w-auto bg-[#ff5100] hover:bg-[#e64a00] text-white font-bold py-3.5 px-6 rounded transition-colors whitespace-nowrap text-sm">
            See All Products
          </button>
          
        </div>
        
        {/* Slider Indicators */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {bgImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentImage ? 'bg-orange-500 scale-125' : 'bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Vibrant Announcement Banner */}
    <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 py-3.5 overflow-hidden flex w-full shadow-lg border-y border-orange-400/30">
      <div className="whitespace-nowrap animate-marquee flex items-center min-w-max hover:animation-play-state-paused cursor-default">
        {/* 1st Set */}
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">⚡</span> FLASH SALE OFFERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🎉</span> 50% DISCOUNT FOR NEW USERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🏷️</span> BUY 1 GET 1 FREE OFFERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🛡️</span> 100% MONEY BACK GUARANTEE</span>
        {/* 2nd Set for seamless loop */}
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">⚡</span> FLASH SALE OFFERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🎉</span> 50% DISCOUNT FOR NEW USERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🏷️</span> BUY 1 GET 1 FREE OFFERS</span>
        <span className="text-sm font-black text-white mx-12 tracking-widest uppercase flex items-center gap-2"><span className="text-yellow-300 text-xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">🛡️</span> 100% MONEY BACK GUARANTEE</span>
      </div>
    </div>
    </div>
  );
}
