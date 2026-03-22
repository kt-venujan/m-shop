export default function Footer() {
  return (
    <>
      {/* About Us Section */}
      <div data-aos="fade-up" className="bg-white border-t border-gray-200 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image on the left */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-orange-600 rounded-2xl transform rotate-3 scale-105 opacity-10"></div>
              <img 
                src="/about-us.png" 
                alt="Inside Our Premium Store" 
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover border border-gray-100 transform hover:-translate-y-1 transition-transform duration-500" 
              />
            </div>
            
            {/* Description on the right */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight relative inline-block">
                About Our Shop
                <span className="absolute -bottom-2 left-0 w-16 h-1.5 bg-orange-500 rounded-full"></span>
              </h2>
              <div className="prose prose-orange max-w-none text-gray-600">
                <p className="font-semibold text-lg md:text-xl text-gray-800 leading-snug mb-4">
                  Welcome to MERN Shop—your premium destination for curated, high-quality products. We bridge the gap between world-class brands and everyday accessibility.
                </p>
                <p className="leading-relaxed mb-6 font-medium">
                  Our mission is simple: to provide a hyper-secure, seamless, and visually stunning shopping environment. Every single item in our inventory passes rigorous quality assurance checks, ensuring you only receive 100% authentic merchandise. 
                </p>
                <p className="leading-relaxed text-sm text-gray-500">
                  Whether you are upgrading your daily tech, refreshing your wardrobe, or searching for the perfect gift, our dedicated customer service team and rapid nationwide delivery network guarantee unparalleled satisfaction. Thank you for making us your trusted retail partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-aos="fade-up" className="bg-[#f8f9fa] border-t border-gray-200 py-4 w-full md:block z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center gap-4">
          <span className="text-[#0a4275] font-medium text-[16px] tracking-wide">Payment Methods</span>
          
          <div className="flex gap-2 items-center">
            {/* Cash on Delivery */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 w-[52px] h-8 rounded-[3px]">
              <span className="text-[6px] font-black text-[#15803d] leading-none uppercase tracking-tighter">CASH ON</span>
              <span className="text-[6px] font-black text-[#15803d] leading-none uppercase tracking-tighter">DELIVERY</span>
            </div>
            
            {/* Visa */}
            <div className="flex items-center justify-center bg-white border border-gray-200 w-[52px] h-8 rounded-[3px] p-1.5">
              <svg viewBox="0 0 38 12" className="w-full h-auto fill-[#14216a]">
                <path d="M14.654 0l-1.396 8.356h2.24l1.396-8.356h-2.24zm8.212 0c-.546 0-1.428.114-2.268.49l-.42 1.96c.294-.14.882-.28 1.47-.28 1.05 0 1.288.546 1.288 1.12v.112c-1.358.182-3.038.56-3.038 2.142 0 1.344 1.092 2.072 2.45 2.072 1.092 0 1.764-.532 2.226-1.12l.21 1.008h2.128c-.084-.378-.336-1.638-.336-1.638l-1.61-8.512h-2.1zM5.726 0L4.172 5.67C4.06 6.16 3.962 6.37 3.556 6.552 2.758 6.944 1.358 7.21 0 7.336L.14 8.05c2.912.434 6.174 1.568 7.154 3.486l2.366-11.536H5.726zM29.568 0L27.02 8.356h2.296l2.548-8.356h-2.296zm-9.044 5.922c0-.574-.462-.896-1.484-.896-1.022 0-2.002.266-2.506.518l.336-1.848c.504-.252 1.568-.504 2.828-.504 2.016 0 2.982.952 2.982 2.296 0 2.408-2.618 2.604-2.618 3.528 0 .434.462.658 1.274.658.826 0 1.624-.224 2.184-.462l-.336 1.848c-.56.238-1.554.504-2.646.504-2.114 0-3.374-.966-3.374-2.436 0-2.324 2.688-2.548 2.688-3.472z"/>
              </svg>
            </div>
            
            {/* Mastercard */}
            <div className="flex items-center justify-center bg-[#f7f2ed] border border-[#f7f2ed] w-[52px] h-8 rounded-[3px] p-0.5">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#eb001b] z-10 opacity-90 transform translate-x-1.5"></div>
                <div className="w-5 h-5 rounded-full bg-[#f79e1b] z-0 transform -translate-x-1.5"></div>
              </div>
            </div>

            {/* Amex */}
            <div className="flex items-center justify-center bg-white border border-gray-200 w-[52px] h-8 rounded-[3px] p-1">
              <div className="bg-[#0070ce] w-full h-full rounded-[2px] flex items-center justify-center">
                <span className="text-[5px] font-black text-white italic tracking-tighter leading-none mt-0.5">AM<br/>EX</span>
              </div>
            </div>

            {/* Easy Monthly Installments */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 w-[52px] h-8 rounded-[3px]">
              <span className="text-[5px] font-black text-[#5e2d6b] leading-none uppercase tracking-tighter">Easy Monthly</span>
              <span className="text-[5px] font-black text-[#5e2d6b] leading-none uppercase tracking-tighter">Installments</span>
            </div>
            
            {/* ComBank / Local Bank */}
            <div className="flex items-center justify-center bg-white border border-gray-200 w-[52px] h-8 rounded-[3px] gap-[1px]">
              {/* Fake crest */}
              <div className="w-[14px] h-[18px] bg-[#0a4275] rounded-l-[2px] rounded-br-[6px] relative opacity-90"></div>
              <div className="w-[14px] h-[18px] bg-[#00965e] opacity-90 clip-path-polygon-[0_0,100%_50%,0_100%] rounded-r-[2px]"></div>
            </div>

          </div>
        </div>
      </div>
    
    <footer className="bg-black border-t border-gray-900 border-t-4 border-t-orange-600">
      <div data-aos="fade-up" data-aos-offset="50" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Brand & Description */}
          <div className="max-w-sm">
            <span className="text-2xl font-extrabold text-white tracking-widest block mb-4">
              MERN<span className="text-orange-500">STORE</span>
            </span>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Your one-stop destination for premium quality products. We deliver excellence right to your doorstep with guaranteed customer satisfaction and secure payments.
            </p>
          </div>
          
          {/* Quick Links & Contact info wrapper */}
          <div className="flex flex-col sm:flex-row gap-12 md:gap-24">
            
            {/* Quick Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Quick Links</h3>
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm font-bold transition-colors">About Us</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm font-bold transition-colors">Customer Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm font-bold transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm font-bold transition-colors">Terms</a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Contact Us</h3>
              <p className="text-gray-400 text-sm font-medium flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Inuvil Manipay Road,<br/>Suthumalai, Jaffna
              </p>
              <p className="text-gray-400 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                info@mstore.lk
              </p>
              <p className="text-gray-400 text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +94726-671-712
              </p>
            </div>

          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-bold">
            &copy; {new Date().getFullYear()} MERN Store Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholders */}
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
