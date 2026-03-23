import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function Account({ user, handleLogout }) {
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Reviews State
  const [myReviews, setMyReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dob, setDob] = useState(user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '');
  const [username, setUsername] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  // Password Reset States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpAction, setOtpAction] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // General Status
  const [message, setMessage] = useState('');
  
  // File Upload Ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('mern_token');
          const res = await axios.get(`${API_BASE_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to load orders");
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === 'reviews') {
      const fetchReviews = async () => {
        try {
          const token = localStorage.getItem('mern_token');
          const res = await axios.get(`${API_BASE_URL}/api/reviews/my`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMyReviews(res.data);
        } catch (err) {
          console.error("Failed to load reviews");
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [user, activeTab]);

  const getAuthHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('mern_token')}` } };
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, {
        firstName, lastName, dob, name: username
      }, getAuthHeaders());
      // Update local storage user state
      localStorage.setItem('mern_user', JSON.stringify(res.data.user));
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      window.location.reload(); // Quick refresh to update top navbar states
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordMessage('Old and new password are required.');
      return;
    }
    
    try {
      setPasswordMessage('Requesting OTP...');
      await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {}, getAuthHeaders());
      setOtpAction('password');
      setOtpCode('');
      setOtpMessage('A 6-digit OTP has been sent to your email to authorize this password change.');
      setShowOtpModal(true);
      setPasswordMessage('');
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'Failed to request OTP');
    }
  };

  const handleAccountDeleteRequest = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your account? This action cannot be reversed.")) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {}, getAuthHeaders());
      setOtpAction('delete');
      setOtpCode('');
      setOtpMessage('A 6-digit OTP has been sent to your email to confirm account deletion.');
      setShowOtpModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request OTP');
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return setOtpMessage('Please enter the OTP');
    
    setOtpLoading(true);
    try {
      if (otpAction === 'password') {
        await axios.put(`${API_BASE_URL}/api/auth/password`, {
          oldPassword, newPassword, otpCode
        }, getAuthHeaders());
        
        setShowOtpModal(false);
        setOldPassword('');
        setNewPassword('');
        setPasswordMessage('Password updated successfully!');
        setTimeout(() => setPasswordMessage(''), 3000);
      } else if (otpAction === 'delete') {
        await axios.delete(`${API_BASE_URL}/api/auth/delete-account`, {
          headers: getAuthHeaders().headers,
          data: { otpCode } // axios delete payload uses 'data' key
        });
        
        setShowOtpModal(false);
        handleLogout();
        window.location.href = '/';
      }
    } catch (err) {
      setOtpMessage(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put(`${API_BASE_URL}/api/auth/profile-picture`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('mern_token')}` 
        }
      });
      setProfilePicture(res.data.user.profilePicture);
      localStorage.setItem('mern_user', JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      console.error("Error uploading image");
    }
  };

  const updateOrderAddress = async (orderId, newAddress) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/orders/${orderId}`, {
        shippingAddress: newAddress
      }, getAuthHeaders());
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
      alert("Address updated successfully!");
    } catch (err) {
      alert("Failed to update address. Ensure the order is still Processing.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h2 className="text-3xl font-extrabold text-black mb-4">Please log in to view your account.</h2>
        <a href="/auth" className="text-orange-600 font-bold hover:underline">Go to Sign In</a>
      </div>
    );
  }

  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'US';

  return (
    <div data-aos="fade-up" className="max-w-6xl mx-auto md:my-10 bg-white md:shadow-xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[800px] border border-gray-100 relative">
      
      {/* Sidebar Panel */}
      <div className="w-full md:w-[280px] bg-white flex-shrink-0 border-b md:border-b-0 md:border-r border-[#eaedf3] p-4 md:p-6 flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Settings</h2>
        
        <div className="relative mb-8 pt-1">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search Settings" className="w-full bg-white border border-gray-200 shadow-sm rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-gray-700 placeholder-gray-400" />
        </div>

        <nav className="flex-none flex md:flex-col overflow-x-auto hide-scrollbar space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0">
          <button onClick={() => setActiveTab('account')} className={`flex-none md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-[13px] md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'account' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Account
          </button>
          
          <button onClick={() => setActiveTab('orders')} className={`flex-none md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-[13px] md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            My Orders
          </button>

          <button onClick={() => setActiveTab('reviews')} className={`flex-none md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-[13px] md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`}>
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            My Reviews
          </button>

          <button className="flex-none md:w-full flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-[13px] md:text-sm font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all whitespace-nowrap">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Returns & Cancels
          </button>
        </nav>

        <div className="mt-auto pb-4">
          <button onClick={() => { handleLogout(); window.location.href = '/'; }} className="w-max flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-orange-200 transition-colors">
            <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 w-full md:w-auto bg-white overflow-y-auto">
        
        {/* Account Settings View */}
        {activeTab === 'account' && (
          <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-4 md:px-10">
            {message && <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium border border-green-200">{message}</div>}
            
            {/* Basic Information Section */}
            <form onSubmit={handleProfileUpdate}>
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-[22px] font-bold text-gray-900">Basic Information</h3>
                <svg className="w-4 h-4 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>

              <div className="flex flex-col md:flex-row gap-12 border-b border-gray-100 pb-12 mb-10">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-300 mb-4 bg-cover bg-center" style={{ backgroundImage: profilePicture ? `url(${API_BASE_URL}${profilePicture})` : 'none' }}>
                    {!profilePicture && initials}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-1">Upload new picture</button>
                  <button type="button" className="text-sm font-semibold text-[#ff6b6b] hover:text-red-600 transition-colors">Remove</button>
                </div>

                {/* Form Fields Section */}
                <div className="flex-1 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">First name</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all font-medium" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of birth</label>
                    <div className="relative">
                      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all font-medium appearance-none" />
                      <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                    <input type="email" value={user.email} disabled className="w-full border border-gray-200 bg-[#e3e7ee] rounded-md px-3 py-2.5 text-sm text-gray-500 font-medium cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[22px] font-bold text-gray-900">Account Information</h3>
                <svg className="w-4 h-4 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>

              <div className="space-y-5 md:w-2/3 ml-auto md:ml-36 pl-0 md:pl-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all font-medium" />
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors w-full sm:w-auto">Save Basic & Account Changes</button>
                </div>
              </div>
            </form>

            <div className="border-t border-gray-100 my-8"></div>
            
            {/* Password Change Sub-section */}
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-5 md:w-2/3 ml-auto md:ml-36 pl-0 md:pl-2">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Change Password</h4>
                {passwordMessage && <div className="text-xs font-semibold text-orange-600 mb-2">{passwordMessage}</div>}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all" placeholder="•••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-200 bg-[#eef1f6] rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all" placeholder="•••••••••" />
                </div>
                
                <div className="pt-2">
                  <button type="submit" className="border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 px-6 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto">Request Password Change</button>
                </div>
              </div>
            </form>
            
            {/* Delete Account Sub-section */}
            <div className="border-t border-gray-100 my-8"></div>
            <div className="space-y-3 md:w-2/3 ml-auto md:ml-36 pl-0 md:pl-2">
              <h4 className="text-sm font-bold text-red-600 mb-1">Danger Zone</h4>
              <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button type="button" onClick={handleAccountDeleteRequest} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto">Delete Account</button>
            </div>

          </div>
        )}

        {/* Orders View */}
        {activeTab === 'orders' && (
          <div className="max-w-4xl mx-auto py-12 px-10">
            <h2 className="text-[24px] font-bold text-gray-900 mb-8">My Orders</h2>
            
            {loadingOrders ? (
              <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Loading order history...</div>
            ) : orders.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-24 bg-gray-50 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No active orders</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">Any purchases you make will automatically appear here so you can easily track them.</p>
                <a href="/" className="bg-orange-600 text-white px-6 py-2.5 rounded-lg shadow-sm font-bold text-sm tracking-wide hover:bg-orange-700 transition-colors">Start Shopping</a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-xl p-6 bg-white overflow-hidden relative group shadow-sm hover:shadow-md transition-all">
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                       <span className={`h-2.5 w-2.5 rounded-full ${order.status === 'Processing' ? 'bg-orange-400 animate-pulse' : order.status === 'Shipped' ? 'bg-blue-500' : order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                       <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{order.status}</span>
                    </div>

                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-lg font-extrabold text-[#212121] mb-6">#{order._id.substring(order._id.length - 10).toUpperCase()}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Items Purchased</p>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm items-center">
                              <span className="font-semibold text-gray-800 line-clamp-1 flex-1 pr-4">{item.name}</span>
                              <span className="text-gray-500 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-between items-end border-t border-gray-100 pt-4">
                           <span className="text-sm font-bold text-gray-500 tracking-wide uppercase">Order Total</span>
                           <span className="text-xl font-extrabold text-[#f57224]">Rs. {order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Shipping Destination</p>
                        <div className="bg-orange-50/30 p-4 rounded-lg flex-1 border border-orange-100 relative">
                          <p className="text-[13px] text-gray-700 leading-relaxed font-medium pr-10">{order.shippingAddress}</p>
                          
                          {/* Restricting Edit Functionality to Processing Orders Only */}
                          {order.status === 'Processing' && (
                            <button 
                              onClick={() => {
                                const newAddr = prompt("Update Shipping Address:", order.shippingAddress);
                                if (newAddr && newAddr !== order.shippingAddress) {
                                  updateOrderAddress(order._id, newAddr);
                                }
                              }}
                              className="absolute top-4 right-4 text-orange-600 hover:text-orange-800 p-1.5 rounded-full hover:bg-white transition-colors border border-transparent shadow-sm hover:border-orange-200 hover:shadow-md"
                              title="Edit Address"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews View */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto py-12 px-10">
            <h2 className="text-[24px] font-bold text-gray-900 mb-8">My Reviews</h2>
            
            {loadingReviews ? (
              <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Loading reviews...</div>
            ) : myReviews.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-24 bg-gray-50 text-center">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">Share your thoughts on products you've purchased.</p>
                <a href="/" className="bg-orange-600 text-white px-6 py-2.5 rounded-lg shadow-sm font-bold text-sm tracking-wide hover:bg-orange-700 transition-colors">Start Shopping</a>
              </div>
            ) : (
              <div className="space-y-6">
                {myReviews.map(review => (
                  <div key={review._id} className="border border-gray-200 rounded-xl p-6 bg-white overflow-hidden relative group shadow-sm hover:shadow-md transition-all">
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                       <span className={`h-2.5 w-2.5 rounded-full ${review.isApproved ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`}></span>
                       <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{review.isApproved ? 'Published' : 'Pending Approval'}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {review.product?.image ? (
                        <img src={review.product.image?.startsWith('/uploads') ? API_BASE_URL + review.product.image : review.product.image} className="w-16 h-16 rounded object-cover border border-gray-100 shadow-sm" alt="Product" />
                      ) : (
                        <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">NA</div>
                      )}
                      <div>
                        <a href={`/product/${review.product?._id}`} className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">{review.product?.name || 'Unknown Product'}</a>
                        <div className="flex text-amber-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 relative">
                       <svg className="w-6 h-6 text-gray-300 absolute top-2 left-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                       <p className="text-sm text-gray-700 italic pl-6 leading-relaxed">{review.comment}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-[authFade_0.3s_ease-out]">
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Security Verification</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{otpMessage}</p>
            
            <form onSubmit={submitOtp}>
              <div className="mb-5">
                <input 
                  type="text" 
                  required
                  placeholder="Enter 6-digit OTP" 
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full text-center text-2xl tracking-[0.5em] font-black border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength="6"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowOtpModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={otpLoading} className={`px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors ${otpAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  {otpLoading ? 'Verifying...' : 'Verify & Proceed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
