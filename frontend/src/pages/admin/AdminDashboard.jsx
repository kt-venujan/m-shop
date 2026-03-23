import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-shop-tsrf.onrender.com';


export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-600"></div></div>;

  const cards = [
    { label: 'Total Revenue', value: `Rs. ${stats.revenue.toFixed(2)}`, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats.orders, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats.products, color: 'bg-orange-500' },
    { label: 'Total Customers', value: stats.users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-3 h-3 rounded-full ${c.color} mb-3`}></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
