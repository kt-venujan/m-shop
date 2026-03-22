import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}`;


export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-600"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Customers</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Joined</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-right">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-gray-900">{u.name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  {u.isAdmin
                    ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">Admin</span>
                    : <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Customer</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
