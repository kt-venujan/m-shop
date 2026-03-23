import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-shop-tsrf.onrender.com';


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/orders`, { headers });
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/status`, { status }, { headers });
      fetchOrders();
    } catch (err) { alert('Error updating status'); }
  };

  const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-600"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Orders</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Order ID</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-sm font-mono text-gray-600">...{o._id.slice(-6)}</td>
                <td className="px-5 py-3 text-sm font-semibold text-gray-900">{o.shippingAddress || '—'}</td>
                <td className="px-5 py-3 text-sm font-bold text-orange-600">Rs. {o.totalAmount?.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[o.status] || statusColors.Processing}`}>
                    {o.status || 'Processing'}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <select
                    value={o.status || 'Processing'}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="border rounded-lg text-sm font-bold py-1.5 px-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-400">No orders yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
