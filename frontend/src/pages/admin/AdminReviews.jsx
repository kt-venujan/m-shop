import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('admin_token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/admin`, authHeaders);
      setReviews(res.data);
    } catch (err) {
      console.error('Fetch reviews error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproval = async (id, isApproved) => {
    try {
      await axios.put(`${API_BASE_URL}/api/reviews/${id}/approve`, { isApproved }, authHeaders);
      setReviews(reviews.map(r => r._id === id ? { ...r, isApproved } : r));
    } catch (err) {
      console.error('Update approval error', err);
      alert('Failed to update review status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you want to permanently delete this user review?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/reviews/${id}`, authHeaders);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error('Delete review error', err);
      alert('Failed to delete review.');
    }
  };

  if (loading) return <div className="p-8 font-bold text-gray-500">Loading Reviews Data...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Manage and moderate product ratings submitted by shoppers.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg font-bold text-sm border border-orange-100 shadow-sm">
          {reviews.filter(r => !r.isApproved).length} Pending Approvals
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Rating</th>
                <th className="p-4 font-bold">Comment</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {review.product?.image ? (
                        <img src={review.product.image?.startsWith('/') ? API_BASE_URL + review.product.image : review.product.image} className="w-10 h-10 rounded object-cover border border-gray-200" alt="Product" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">NA</div>
                      )}
                      <span className="font-bold text-sm text-gray-900 truncate max-w-[150px]">{review.product?.name || 'Deleted Product'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-gray-700">{review.user?.name || 'Unknown User'}</span>
                    <span className="block text-xs text-gray-400 truncate max-w-[120px]">{review.user?.email}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 relative group">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{review.comment}</p>
                    {/* Tooltip for long comments */}
                    <div className="absolute hidden group-hover:block z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-xl -top-10 left-0">
                      {review.comment}
                    </div>
                  </td>
                  <td className="p-4">
                    {review.isApproved ? (
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-bold border border-green-100">Approved</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold border border-amber-100">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {review.isApproved ? (
                        <button 
                          onClick={() => handleApproval(review._id, false)}
                          className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApproval(review._id, true)}
                          className="px-3 py-1.5 text-xs font-bold bg-green-50 hover:bg-green-100 text-green-700 rounded transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm font-bold text-gray-400">
                    No customer reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
