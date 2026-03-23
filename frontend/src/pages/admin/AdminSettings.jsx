import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_BASE_URL } from '../../config';


export default function AdminSettings() {
  const [themeColor, setThemeColor] = useState('#f57224');
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('admin_token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/settings`);
        if (res.data) {
          setThemeColor(res.data.themeColor || '#f57224');
          setSliderImages(res.data.sliderImages || []);
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/settings`, {
        themeColor,
        sliderImages
      }, authHeaders);
      alert('Global settings saved successfully! Note: Hard refresh (CTRL+F5) to see latest global CSS theme overrides apply.');
    } catch (err) {
      console.error('Save settings error', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // Append the new image URL returned from Multer
      setSliderImages([...sliderImages, res.data.image]);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image. Ensure it is a valid format (jpeg/png).');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setSliderImages(sliderImages.filter((_, idx) => idx !== indexToRemove));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    const newImages = [...sliderImages];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setSliderImages(newImages);
  };

  const moveImageDown = (index) => {
    if (index === sliderImages.length - 1) return;
    const newImages = [...sliderImages];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setSliderImages(newImages);
  };

  if (loading) return <div className="p-8 font-bold text-gray-500">Loading Configuration...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Site Settings</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Manage global theme configurations and hero slider assets.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Application Theme</h2>
          <p className="text-xs text-gray-500 font-medium">Controls the primary branding color across all storefront components.</p>
        </div>
        <div className="p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-lg shadow-inner flex items-center justify-center border-4 border-white ring-2 ring-gray-100" style={{ backgroundColor: themeColor }}>
            <span className="text-white font-mono text-xs font-bold bg-black/30 px-2 py-1 rounded mix-blend-screen">{themeColor}</span>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Primary HEX Color</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="h-12 w-20 cursor-pointer rounded border border-gray-300 p-1"
              />
              <input
                type="text"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 uppercase font-mono text-sm tracking-wide focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="#HEXCODE"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">This dynamically injects core CSS classes into the React DOM.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Hero Slider Graphics</h2>
            <p className="text-xs text-gray-500 font-medium">Upload wide landscape banners for the storefront landing page (Recommended 1920x600).</p>
          </div>
          <div>
            <label className="cursor-pointer bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors">
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="p-6">
          {sliderImages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              <p className="text-sm font-bold text-gray-400">No images configured. Upload a banner to activate the slider.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sliderImages.map((src, idx) => (
                <div key={idx} className="relative group border border-gray-200 rounded-lg overflow-hidden flex items-center bg-gray-50 h-32 w-full pr-4">
                  <div className="h-full w-64 bg-gray-200 flex-shrink-0">
                    <img src={src?.startsWith('/uploads') ? API_BASE_URL + src : src} alt="Slider Element" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 px-6">
                    <p className="font-mono text-xs text-gray-500 truncate leading-relaxed">{src}</p>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mt-1">Slide Index: {idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveImageUp(idx)}
                      disabled={idx === 0}
                      className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="Move Up"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      onClick={() => moveImageDown(idx)}
                      disabled={idx === sliderImages.length - 1}
                      className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="Move Down"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" transform="rotate(180 12 12)" /></svg>
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      title="Remove Slide"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg shadow-orange-600/20 active:scale-95 transition-all w-full sm:w-auto"
        >
          {saving ? 'Saving System Core...' : 'Publish Global Settings'}
        </button>
      </div>
    </div>
  );
}
