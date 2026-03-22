import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}`;


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(false);
  const [current, setCurrent] = useState({ name: '', price: '', category: '', description: '', stock: '', image: '' });

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${API_BASE_URL}/api/upload`, formData, config);
      
      // We prepend the backend URL because the backend returns a relative path like `/uploads/file.png`
      setCurrent({...current, image: `${API_BASE_URL}${data.image}`});
    } catch (err) {
      console.error(err);
      alert('Error uploading image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current._id) {
        await axios.put(`${API_BASE_URL}/api/admin/products/${current._id}`, current, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/products`, current, { headers });
      }
      setModal(false);
      fetchProducts();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/products/${id}`, { headers });
      fetchProducts();
    } catch (err) { alert('Error deleting product'); }
  };

  const openModal = (p = { name: '', price: '', category: '', description: '', stock: '', image: '' }) => {
    setCurrent(p);
    setModal(true);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-4 border-orange-600"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">Products</h1>
        <button onClick={() => openModal()} className="bg-orange-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm">+ Add Product</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Stock</th>
              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-gray-900 flex items-center gap-3">
                  {p.image ? <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">No IMG</div>}
                  {p.name}
                </td>
                <td className="px-5 py-3"><span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">{p.category}</span></td>
                <td className="px-5 py-3 text-sm font-bold text-gray-900">Rs. {typeof p.price === 'number' ? p.price.toFixed(2) : p.price}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{p.stock ?? '—'}</td>
                <td className="px-5 py-3 text-right space-x-2">
                  <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-800 text-sm font-bold">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 text-sm font-bold">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-400">No products</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-black">{current._id ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <input required placeholder="Product Name" value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              
              <div className="flex gap-2 items-center">
                <input placeholder="Image URL (or select file)" value={current.image || ''} onChange={e => setCurrent({...current, image: e.target.value})} className="flex-1 border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                <label className="bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 text-sm font-bold py-2.5 px-3 rounded-lg cursor-pointer whitespace-nowrap transition-colors">
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input type="file" className="hidden" onChange={uploadFileHandler} disabled={uploading} accept="image/*" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="0" step="0.01" placeholder="Price" value={current.price} onChange={e => setCurrent({...current, price: parseFloat(e.target.value) || ''})} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                <input type="number" min="0" placeholder="Stock" value={current.stock} onChange={e => setCurrent({...current, stock: parseInt(e.target.value) || ''})} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <select required value={current.category} onChange={e => setCurrent({...current, category: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
              </select>
              <textarea rows="2" placeholder="Description" value={current.description} onChange={e => setCurrent({...current, description: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
