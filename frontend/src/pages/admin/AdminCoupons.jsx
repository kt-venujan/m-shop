import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

const EMPTY_FORM = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '',
  maxUses: '',
  expiresAt: '',
  isActive: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null); // coupon _id being edited
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/coupons`, { headers });
      setCoupons(res.data);
    } catch { toast.error('Failed to load coupons.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount ?? '',
      maxUses: c.maxUses ?? '',
      expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '',
      isActive: c.isActive,
    });
    setEditing(c._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      code: form.code.toUpperCase().trim(),
      discountValue: parseFloat(form.discountValue),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };
    const toastId = toast.loading(editing ? 'Updating coupon...' : 'Creating coupon...');
    try {
      if (editing) {
        await axios.put(`${API_BASE_URL}/api/coupons/${editing}`, payload, { headers });
        toast.success('Coupon updated!', { id: toastId });
      } else {
        await axios.post(`${API_BASE_URL}/api/coupons`, payload, { headers });
        toast.success('Coupon created!', { id: toastId });
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving coupon.', { id: toastId });
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    const toastId = toast.loading('Deleting...');
    try {
      await axios.delete(`${API_BASE_URL}/api/coupons/${id}`, { headers });
      toast.success('Coupon deleted.', { id: toastId });
      fetchCoupons();
    } catch {
      toast.error('Failed to delete.', { id: toastId });
    }
  };

  const toggleActive = async (c) => {
    try {
      await axios.put(`${API_BASE_URL}/api/coupons/${c._id}`, { isActive: !c.isActive }, { headers });
      setCoupons(prev => prev.map(x => x._id === c._id ? { ...x, isActive: !x.isActive } : x));
      toast.success(`Coupon ${!c.isActive ? 'activated' : 'deactivated'}.`);
    } catch { toast.error('Failed to toggle coupon.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Coupons</h1>
        <button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> New Coupon
        </button>
      </div>

      {/* Coupon Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">{editing ? 'Edit Coupon' : 'Create New Coupon'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Code *</label>
              <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:ring-2 focus:ring-orange-400 outline-none uppercase"
                placeholder="e.g. SAVE20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Discount Type *</label>
              <select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-400 outline-none bg-white">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                Discount Value * {form.discountType === 'percentage' ? '(%)' : '(Rs.)'}
              </label>
              <input required type="number" min="0" step="0.01" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder={form.discountType === 'percentage' ? '10' : '500'} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Min Order (Rs.)</label>
              <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="0 = no minimum" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Max Uses</label>
              <input type="number" min="1" value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="Leave blank = unlimited" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm font-semibold text-gray-700">Active (can be used at checkout)</span>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors">{editing ? 'Update' : 'Create'} Coupon</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-400 animate-pulse font-medium">Loading coupons...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Min Order</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden md:table-cell">Uses</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase hidden lg:table-cell">Expires</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-black text-gray-900 tracking-wider">{c.code}</td>
                  <td className="px-4 py-3 font-bold text-orange-600">
                    {c.discountType === 'percentage' ? `${c.discountValue}% off` : `Rs. ${c.discountValue} off`}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {c.minOrderAmount > 0 ? `Rs. ${c.minOrderAmount}` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray-700 font-semibold">{c.usedCount}</span>
                    <span className="text-gray-400"> / {c.maxUses ?? '∞'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c)} className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${c.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(c._id, c.code)} className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-medium">No coupons yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
