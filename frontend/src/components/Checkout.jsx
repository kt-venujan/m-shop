import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';


export default function Checkout({ cart, user, clearCart }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    label: 'HOME'
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [couponId, setCouponId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 360 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) { toast.error('Please enter a promo code.'); return; }
    setPromoLoading(true);
    try {
      const token = localStorage.getItem('mern_token');
      const res = await axios.post(`${API_BASE_URL}/api/coupons/validate`,
        { code: promoCode.trim(), cartTotal: subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscount(res.data.discount);
      setCouponId(res.data.couponId);
      const label = res.data.discountType === 'percentage'
        ? `${res.data.discountValue}% off`
        : `Rs. ${res.data.discountValue} off`;
      setDiscountLabel(`${res.data.code} — ${label}`);
      toast.success(`Coupon applied! You saved Rs. ${res.data.discount.toFixed(0)}`);
    } catch (err) {
      setDiscount(0); setCouponId(null); setDiscountLabel('');
      toast.error(err.response?.data?.message || 'Invalid coupon code.');
    } finally { setPromoLoading(false); }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to place an order.');
      navigate('/auth');
      return;
    }
    if (!customer.address.trim()) {
      toast.error('Please enter a shipping address.');
      setShowAddressModal(true);
      return;
    }

    setIsPlacing(true);
    const toastId = toast.loading('Placing your order...');
    try {
      const token = localStorage.getItem('mern_token');
      const orderData = {
        items: cart,
        totalAmount: total,
        shippingAddress: `${customer.name} (${customer.phone}) - ${customer.label}: ${customer.address}`,
        couponId: couponId || undefined,
      };

      await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order placed successfully! 🎉', { id: toastId });
      setIsSuccess(true);
      if (clearCart) clearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      const msg = err.response?.data?.message || 'There was an error processing your order. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsPlacing(false);
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
          <p className="text-gray-500 mb-8 font-medium">Thank you for your purchase. Your order is being processed and will be shipped shortly.</p>
          <button onClick={() => navigate('/')} className="bg-[#f57224] hover:bg-[#d85e1b] text-white font-bold py-4 px-8 rounded-md w-full shadow text-sm tracking-wide uppercase transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-aos="fade-up" className="bg-[#f5f5f5] min-h-screen py-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">

          {/* Shipping & Billing Box */}
          <div className="bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-gray-800 font-bold text-[15px]">Shipping & Billing</h2>
              <button onClick={() => setShowAddressModal(true)} className="text-[#1a9cb7] font-bold text-xs uppercase hover:underline focus:outline-none">EDIT</button>
            </div>

            {customer.address ? (
              <div className="text-[13px] text-gray-800 font-medium">
                <div className="flex gap-4 mb-2">
                  <span className="text-gray-900">{customer.name}</span>
                  <span>{customer.phone}</span>
                </div>
                <div className="flex gap-2 items-start mb-3">
                  <span className="bg-[#f57224] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm mt-0.5">{customer.label}</span>
                  <span className="leading-relaxed">{customer.address}</span>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddressModal(true)} className="w-full border-2 border-dashed border-[#1a9cb7] rounded-lg p-6 text-center text-[#1a9cb7] font-semibold text-sm hover:bg-[#f3f9fb] transition-colors">
                + Add Shipping Address
              </button>
            )}
          </div>

          {/* Package details */}
          <div className="bg-white shadow-sm border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-black font-extrabold text-[15px]">Package 1 of 1</h2>
              <p className="text-[11px] text-gray-500 font-semibold tracking-wide">Shipped by <span className="text-black font-bold ml-1">MERN Store</span></p>
            </div>

            <div className="p-6 border-b border-gray-100">
              <p className="text-[11px] text-gray-600 mb-3 uppercase font-semibold">Delivery or Pickup</p>
              <div className="border border-[#1a9cb7] rounded p-4 w-full sm:w-[280px] bg-white relative cursor-pointer overflow-hidden shadow-sm ring-1 ring-[#1a9cb7] ring-opacity-20">
                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-[#1a9cb7] flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-[14px]">Rs. {deliveryFee}</p>
                    <p className="text-[12px] text-gray-600 mb-5 font-semibold">Standard</p>
                    <p className="text-[11px] text-gray-500 font-medium">Guaranteed by 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-2">
              {cart.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-4xl mb-4 block opacity-50">🛒</span>
                  <p className="text-sm font-bold text-gray-500">Your cart is empty.</p>
                </div>
              ) : cart.map((item) => {
                const imgSrc = item.image?.startsWith('/uploads') ? API_BASE_URL + item.image : item.image;
                return (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-4 py-5 border-b border-gray-50 last:border-0 relative">
                    {/* Real product image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-200 shadow-sm shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>

                    <div className="flex-1 flex justify-between pr-0 sm:pr-8 items-start">
                      <div className="max-w-[100%] sm:max-w-[70%]">
                        <h3 className="text-[14px] text-gray-800 line-clamp-2 leading-snug">{item.name}</h3>
                        <p className="text-[11px] text-gray-400 mt-1 font-medium">{item.category}</p>
                      </div>
                      <div className="text-right sm:ml-4 whitespace-nowrap mt-2 sm:mt-0">
                        <p className="text-[16px] font-semibold text-[#f57224] tracking-tight">Rs. {typeof item.price === 'number' ? item.price : parseFloat(item.price)}</p>
                        <p className="text-[11px] text-gray-400 line-through mt-0.5">Rs. {typeof item.price === 'number' ? (item.price * 2).toFixed(0) : parseFloat(item.price) * 2}</p>
                        <p className="text-[11px] text-gray-800 font-bold mb-4">-50%</p>
                      </div>
                    </div>
                    <div className="text-gray-600 text-[12px] font-medium absolute right-0 top-5 sm:relative sm:top-0 h-fit">
                      Qty: <span className="font-bold text-[13px]">{item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Promotion / Voucher */}
          <div className="bg-white px-5 py-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-gray-800 font-semibold mb-4 text-[13px]">Promotion</h2>
            <div className="flex gap-0 h-10 shadow-sm border border-gray-200 rounded-sm mb-4">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter promo code" className="flex-1 px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1a9cb7] rounded-l-sm font-mono font-bold uppercase" />
              <button onClick={handleApplyPromo} disabled={promoLoading} className="bg-[#1a9cb7] text-white font-bold text-[12px] px-8 hover:bg-[#128198] transition-colors h-full rounded-r-sm border border-[#1a9cb7] disabled:opacity-60">{promoLoading ? '...' : 'APPLY'}</button>
            </div>
            {discountLabel && <p className="text-green-600 text-xs font-bold mb-4">✓ {discountLabel} applied!</p>}

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
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
                  <span>{discountLabel || 'Promo Discount'}</span>
                  <span className="font-bold text-[14px]">- Rs. {discount.toFixed(0)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-1 pt-1 border-t border-gray-50 mt-4">
              <span className="text-[14px] text-gray-800 font-medium">Total:</span>
              <span className="text-[20px] font-medium text-[#f57224]">Rs. {total.toFixed(0)}</span>
            </div>
            <div className="text-right text-[10px] text-gray-500 mb-6 font-medium mt-1">VAT included, where applicable</div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || isPlacing}
              className="w-full bg-[#f57224] hover:bg-[#d85e1b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-sm transition-colors text-sm shadow-md active:scale-[0.99] uppercase tracking-wide mt-2 flex items-center justify-center gap-2"
            >
              {isPlacing ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Placing order...</>
              ) : 'Proceed to Pay'}
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-[authFade_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Edit Shipping Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Full Name</label>
                <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Phone Number</label>
                <input type="text" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Address Label</label>
                <div className="flex gap-2">
                  {['HOME', 'OFFICE', 'OTHER'].map(l => (
                    <button key={l} type="button" onClick={() => setCustomer({ ...customer, label: l })}
                      className={`px-4 py-1.5 rounded text-xs font-bold border transition-colors ${customer.label === l ? 'bg-[#f57224] text-white border-[#f57224]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Delivery Address</label>
                <textarea rows="3" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-[#1a9cb7] focus:outline-none"></textarea>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddressModal(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded shadow-sm text-sm border border-gray-200 hover:bg-gray-200 transition-colors focus:outline-none">CANCEL</button>
                <button onClick={() => { setShowAddressModal(false); toast.success('Shipping address saved!'); }} className="flex-1 bg-[#1a9cb7] text-white font-bold py-2 rounded shadow-sm text-sm border border-[#1a9cb7] hover:bg-[#128198] transition-colors focus:outline-none">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
