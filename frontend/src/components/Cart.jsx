import { Link } from 'react-router-dom';

export default function Cart({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div data-aos="fade-up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 data-aos="fade-right" data-aos-delay="100" className="text-4xl font-extrabold text-black tracking-tight mb-10">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-24 bg-white shadow-sm border border-gray-200 rounded-xl">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="bg-[#ff5100] hover:bg-[#e64a00] text-white font-bold py-4 px-10 rounded shadow-lg transition-colors inline-block tracking-wide">
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item._id} className="p-8 flex flex-col sm:flex-row gap-8">
                    {/* Placeholder image representation matching app logic */}
                    <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                       <span className="text-5xl drop-shadow-sm">
                         {item.name.toLowerCase().includes('shirt') ? '👕' : 
                          item.name.toLowerCase().includes('shoe') ? '👟' : 
                          item.name.toLowerCase().includes('hat') ? '🧢' : '🛍️'}
                      </span>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-black">{item.name}</h3>
                          <span className="inline-block mt-2 text-xs font-black text-orange-600 uppercase tracking-widest">{item.category}</span>
                        </div>
                        <p className="text-2xl font-black text-black">Rs. {item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-4 py-2 text-xl hover:bg-gray-100 text-black font-bold focus:outline-none transition-colors">-</button>
                          <span className="px-4 py-2 text-black font-extrabold text-lg border-x-2 border-gray-200 min-w-[50px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-4 py-2 text-xl hover:bg-gray-100 text-black font-bold focus:outline-none transition-colors">+</button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item._id)} className="text-sm font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wide">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-black rounded-xl shadow-xl p-8 sticky top-8 border-t-4 border-t-orange-600">
              <h2 className="text-2xl font-extrabold text-white mb-8">Order Summary</h2>
              
              <div className="space-y-4 text-base text-gray-400 mb-8 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="font-bold text-white">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-white">Rs. {tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-800 pt-6 mt-6 flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-black text-orange-500">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 rounded-lg shadow-lg border-2 border-transparent hover:border-orange-500 transition-all flex items-center justify-center gap-2 tracking-wide text-lg">
                Checkout Now <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              
              <div className="mt-6 text-center">
                <Link to="/" className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
