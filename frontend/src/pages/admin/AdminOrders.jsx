import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

const STATUS_CONFIG = {
  Processing: { bg: 'bg-amber-100 text-amber-800', dot: 'bg-amber-400 animate-pulse' },
  Shipped:    { bg: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-500' },
  Delivered:  { bg: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  Cancelled:  { bg: 'bg-red-100 text-red-800',     dot: 'bg-red-500' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('All');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/orders`, { headers });
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    const toastId = toast.loading(`Updating to ${status}...`);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/orders/${id}/status`, { status }, { headers });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success(`Order marked as ${status}. Customer notified via email! 📧`, { id: toastId });
    } catch (err) {
      toast.error('Failed to update order status.', { id: toastId });
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-gray-900">Orders <span className="text-gray-400 text-lg font-semibold">({orders.length})</span></h1>
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
              {s !== 'All' && (
                <span className="ml-1.5 bg-white/30 text-inherit px-1 rounded">
                  {orders.filter(o => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase w-6"></th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Order</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Shipping</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(o => {
              const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.Processing;
              return (
                <>
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                    <td className="px-4 py-3">
                      <span className={`text-gray-400 transition-transform inline-block ${expanded === o._id ? 'rotate-90' : ''}`}>▶</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600 font-semibold">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[200px] truncate text-xs">{o.shippingAddress || '—'}</td>
                    <td className="px-4 py-3 font-bold text-orange-600">Rs. {o.totalAmount?.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                        {o.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <select
                        value={o.status || 'Processing'}
                        onChange={e => updateStatus(o._id, e.target.value)}
                        disabled={updating === o._id}
                        className="border border-gray-200 rounded-lg text-xs font-bold py-1.5 px-2 focus:ring-2 focus:ring-orange-400 outline-none bg-white disabled:opacity-50 cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expandable row: items detail */}
                  {expanded === o._id && (
                    <tr key={`${o._id}-detail`} className="bg-orange-50/40">
                      <td colSpan={7} className="px-8 py-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Items in this order</p>
                        <div className="flex flex-col gap-2">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white rounded-lg px-4 py-2.5 border border-gray-100 shadow-sm text-sm">
                              <span className="font-semibold text-gray-800 flex-1 pr-4 line-clamp-1">{item.name}</span>
                              <span className="text-gray-500 font-bold mr-6">×{item.quantity}</span>
                              <span className="text-orange-600 font-bold whitespace-nowrap">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 font-medium">📦 {o.shippingAddress}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-medium">No {filter !== 'All' ? filter : ''} orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
