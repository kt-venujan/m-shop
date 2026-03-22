import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Account({ user, handleLogout }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('mern_token');
          const res = await axios.get('http://localhost:5000/api/orders', {
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
  }, [user]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 border-b border-gray-200 pb-10">
        <div className="w-24 h-24 bg-orange-100 flex items-center justify-center rounded-full text-orange-600 text-4xl font-black shadow-inner">
          {initials}
        </div>
        <div className="text-center md:text-left mt-2">
          <h1 className="text-4xl font-extrabold text-black tracking-tight">{user.name}</h1>
          <p className="text-gray-500 font-medium mt-1 text-lg">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
            <nav className="flex flex-col">
              <a href="#" className="px-6 py-5 bg-gray-50 border-l-4 border-orange-600 text-black font-extrabold text-sm uppercase tracking-wider">Account Overview</a>
              <a href="#" className="px-6 py-5 border-t border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-orange-600 font-bold text-sm uppercase tracking-wider transition-colors">Order History</a>
              <a href="#" className="px-6 py-5 border-t border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-orange-600 font-bold text-sm uppercase tracking-wider transition-colors">Payment Methods</a>
              <a href="#" className="px-6 py-5 border-t border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-orange-600 font-bold text-sm uppercase tracking-wider transition-colors">Addresses</a>
              <button onClick={handleLogout} className="text-left px-6 py-5 border-t border-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 font-bold text-sm uppercase tracking-wider transition-colors mt-4">Sign Out</button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-10">
          <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-extrabold text-black mb-6">Recent Orders</h2>
            
            {loadingOrders ? (
              <div className="py-12 text-center text-gray-400 font-bold animate-pulse">Loading secure order history...</div>
            ) : orders.length === 0 ? (
              <div className="border border-gray-100 rounded-lg flex flex-col items-center justify-center py-16 bg-gray-50 text-center">
                <span className="text-5xl mb-4 drop-shadow-sm">📦</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 max-w-sm mb-6 font-medium">When you place an order, it will appear here so you can easily track its status.</p>
                <a href="/" className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded shadow-lg font-bold transition-colors border border-transparent hover:border-orange-500">Start Browsing</a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 pb-4 gap-2">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                        <p className="text-sm text-gray-800 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-extrabold text-[#f57224]">Rs. {order.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mt-1 uppercase">{order.status}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600 items-center">
                          <span className="truncate border-r pr-3 mr-3 border-gray-200 font-medium flex-1">{item.name}</span>
                          <span className="whitespace-nowrap font-bold text-gray-900">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-extrabold text-black mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                <input type="text" disabled value={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-medium focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                <input type="email" disabled value={user.email} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-medium focus:outline-none" />
              </div>
            </div>
            <button className="mt-8 border-2 border-gray-900 text-black font-bold px-8 py-3 rounded-lg hover:border-orange-600 hover:text-orange-600 transition-colors">Edit Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}
