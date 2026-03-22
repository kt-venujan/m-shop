import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Checkout({ cart, user, clearCart }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: user?.name || 'T.VENUJAN',
    phone: '0774152457',
    address: 'Eenjadi vairavar front road, suthumalai south, invuvil manipay road, jaffna, Jaffna Town, Jaffna, Northern',
    label: 'HOME'
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 360 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim().length > 0) {
      setDiscount(subtotal * 0.1); // Dynamic mock 10% off
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      navigate('/auth');
      return;
    }
    
    try {
      const token = localStorage.getItem('mern_token');
      const orderData = {
        items: cart,
        totalAmount: total,
        shippingAddress: `${customer.name} (${customer.phone}) - ${customer.label}: ${customer.address}`
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsSuccess(true);
      if (clearCart) clearCart();
      window.scrollTo(0,0);
    } catch (err) {
      console.error("Order failed:", err);
      alert("There was an error processing your order. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-lg w-full border-t-4 border-[#f57224] animate-[authFade_0.5s_ease-out_forwards]">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 font-medium">Thank you for your purchase. Your order is actively being processed and will be shipped natively.</p>
          <button onClick={() => navigate('/')} className="bg-[#f57224] hover:bg-[#d85e1b] text-white font-bold py-4 px-8 rounded-md w-full shadow text-sm tracking-wide uppercase transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (Width 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Shipping & Billing Box */}
          <div className="bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-gray-800 font-bold text-[15px]">Shipping & Billing</h2>
              <button onClick={() => setShowAddressModal(true)} className="text-[#1a9cb7] font-bold text-xs uppercase hover:underline focus:outline-none">EDIT</button>
            </div>
            
            <div className="text-[13px] text-gray-800 font-medium">
              <div className="flex gap-4 mb-2 bg-white">
                <span className="text-gray-900">{customer.name}</span>
                <span>{customer.phone}</span>
              </div>
              <div className="flex gap-2 items-start mb-5">
                <span className="bg-[#f57224] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm mt-0.5">{customer.label}</span>
                <span className="leading-relaxed">
                  {customer.address}
                </span>
              </div>
            </div>
            
            {/* Collect Info */}
            <div className="border border-[#1a9cb7] border-dashed rounded p-3 bg-[#f3f9fb] flex justify-between items-center w-full lg:w-[80%]">
               <div>
                 <p className="text-[#1a9cb7] text-[13px] font-semibold hover:underline cursor-pointer flex items-center">Collect your parcels from a nearby location at a minimal delivery fee. <span className="ml-1 mt-0.5 text-lg leading-none">&rsaquo;</span></p>
                 <div className="flex items-center gap-1 mt-1 text-[12px] text-gray-400 font-medium">
                   <span>1 suggested collection point(s) nearby</span>
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
               </div>
            </div>
          </div>

          {/* Package details */}
          <div className="bg-white shadow-sm border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-black font-extrabold text-[15px]">Package 1 of 1</h2>
              <p className="text-[11px] text-gray-500 font-semibold tracking-wide">Shipped by <span className="text-black font-bold ml-1">shopme</span></p>
            </div>

            <div className="p-6 border-b border-gray-100">
              <p className="text-[11px] text-gray-600 mb-3 uppercase font-semibold">Delivery or Pickup</p>
              
              <div className="border border-[#1a9cb7] rounded p-4 w-full sm:w-[280px] bg-white relative cursor-pointer relative overflow-hidden transition-shadow shadow-sm ring-1 ring-[#1a9cb7] ring-opacity-20">
                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#1a9cb7] flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-[14px]">Rs. {deliveryFee}</p>
                    <p className="text-[12px] text-gray-600 mb-5 font-semibold">Standard</p>
                    <p className="text-[11px] text-gray-500 font-medium">Guaranteed by 25-29 Mar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-2">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-4xl mb-4 block opacity-50">🛒</span>
                  <p className="text-sm text-gray-400 font-medium hidden">Proceed empty? Adding a placeholder check just in case.</p>
                  <p className="text-sm font-bold text-gray-500">Your invoice queue is empty.</p>
                </div>
              ) : cart.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row gap-4 py-5 border-b border-gray-50 last:border-0 relative">
                  <div className="w-20 h-20 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-200 shadow-sm shrink-0">
                    <span className="text-4xl drop-shadow-sm">
                      {item.name.toLowerCase().includes('shirt') ? '👕' : 
                       item.name.toLowerCase().includes('shoe') ? '👟' : 
                       item.name.toLowerCase().includes('hat') ? '🧢' :
                       item.category === 'Electronics' ? '📱' : '🔌'}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex justify-between pr-0 sm:pr-8 items-start">
                    <div className="max-w-[100%] sm:max-w-[70%]">
                      <h3 className="text-[14px] text-gray-800 line-clamp-2 leading-snug">{item.name}</h3>
                      <p className="text-[11px] text-gray-400 mt-2 truncate font-medium">No Brand, Color Family:4 Port 3.1A</p>
                    </div>
                    
                    <div className="text-right sm:ml-4 whitespace-nowrap mt-2 sm:mt-0 relative right-0 top-0">
                      <p className="text-[16px] font-semibold text-[#f57224] tracking-tight">Rs. {typeof item.price === 'number' ? item.price : parseFloat(item.price)}</p>
                      <p className="text-[11px] text-gray-400 line-through mt-0.5">Rs. {typeof item.price === 'number' ? (item.price * 2).toFixed(0) : parseFloat(item.price) * 2}</p>
                      <p className="text-[11px] text-gray-800 font-bold mb-4">-50%</p>
                    </div>
                  </div>
                  <div className="text-gray-600 text-[12px] font-medium absolute right-0 top-5 sm:relative sm:top-0 h-fit">
                    Qty: <span className="font-bold text-[13px]">{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Width 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Promotion / Voucher */}
          <div className="bg-white px-5 py-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-gray-800 font-semibold mb-4 text-[13px]">Promotion</h2>
            <div className="flex gap-0 h-10 shadow-sm border border-gray-200 rounded-sm mb-6">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter Store/Daraz Code" className="flex-1 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1a9cb7] rounded-l-sm font-medium" />
              <button onClick={handleApplyPromo} className="bg-[#1a9cb7] text-white font-bold text-[12px] px-8 hover:bg-[#128198] transition-colors h-full rounded-r-sm border border-[#1a9cb7]">APPLY</button>
            </div>
            {discount > 0 && <p className="text-green-600 text-xs font-bold mt-[-16px] mb-6">Code saved you Rs. {discount.toFixed(0)}!</p>}
            
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center group">
              <h2 className="text-gray-600 font-medium text-[13px]">Invoice and Contact Info</h2>
              <button onClick={() => setShowAddressModal(true)} className="text-[#1a9cb7] font-bold text-xs hover:underline focus:outline-none">Edit</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white px-5 py-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-6 tracking-tighter border-b border-gray-50 pb-2">Order Summary</h2>
            
            <div className="space-y-4 text-[13px] text-gray-500 font-medium mb-8">
              <div className="flex justify-between items-end">
                <span>Items Total ({cart.reduce((t, i) => t + i.quantity, 0)} Items)</span>
                <span className="text-gray-800 font-semibold text-[14px]">Rs. {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span>Delivery Fee</span>
                <span className="text-gray-800 font-semibold text-[14px]">Rs. {deliveryFee}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-end mt-3 text-green-600">
                  <span>Promo Discount (-10%)</span>
                  <span className="font-bold text-[14px]">- Rs. {discount.toFixed(0)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-1 pt-1 border-t border-gray-50 mt-4">
              <span className="text-[14px] text-gray-800 font-medium">Total:</span>
              <span className="text-[20px] font-medium text-[#f57224]">Rs. {total.toFixed(0)}</span>
            </div>
            <div className="text-right text-[10px] text-gray-500 mb-6 font-medium mt-1">
              VAT included, where applicable
            </div>

            <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-[#f57224] hover:bg-[#d85e1b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-sm transition-colors text-sm shadow-md active:scale-[0.99] uppercase tracking-wide mt-2">
              Proceed to Pay
            </button>
          </div>
          
        </div>
      </div>

      {/* Dynamic Native Modal Element for Address Edits */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-[authFade_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Edit Shipping Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                <input type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
                <input type="text" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Delivery Address</label>
                <textarea rows="3" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none"></textarea>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddressModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded shadow-sm text-sm border border-gray-200 hover:bg-gray-200 transition-colors focus:outline-none">CANCEL</button>
                <button onClick={() => setShowAddressModal(false)} className="flex-1 bg-[#1a9cb7] text-white font-bold py-2 rounded shadow-sm text-sm border border-[#1a9cb7] hover:bg-[#128198] transition-colors focus:outline-none">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
