import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddAddressForm = ({ onAddressAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.latitude || !formData.longitude) {
      toast.warning('Please confirm coordinates on the map before saving', { theme: 'dark' });
      return;
    }

    try {
      setLoading(true);
      
      // Axios call to POST /api/address/add
      // JWT is automatically added by the interceptor in api.js
      const response = await api.post('/address/add', formData);

      if (response.data.success) {
        toast.success('Location manifesto synchronized successfully!', { theme: 'dark' });
        
        // Reset Form
        setFormData({
          fullName: '',
          mobile: '',
          address: '',
          latitude: 0,
          longitude: 0,
        });

        // Trigger refresh in parent component
        if (onAddressAdded) {
          onAddressAdded();
        }
      }
    } catch (error) {
      console.error('Save Address Error:', error);
      toast.error(error.response?.data?.message || 'Failed to establish delivery link');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-gray-100 border border-gray-50 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Register New Node</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Delivery Manifest Entry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
            <input
              required
              type="text"
              name="fullName"
              placeholder="Receiver Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Number</label>
            <input
              required
              type="tel"
              name="mobile"
              placeholder="+91 XXXXX XXXXX"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Street / Building Address</label>
          <textarea
            required
            name="address"
            placeholder="Detailed physical landmarks..."
            value={formData.address}
            onChange={handleInputChange}
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 focus:ring-4 focus:ring-orange-500/10 transition-all h-32 resize-none placeholder:text-gray-300"
          />
        </div>

        <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-3xl border border-orange-100 italic">
          <span className="text-2xl">📡</span>
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
            Note: Coordinates are captured automatically from your map marker selection.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
            loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-orange-600 hover:shadow-orange-200'
          }`}
        >
          {loading ? 'Transacting Manifest...' : 'Establish Delivery Link'}
        </button>
      </form>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AddAddressForm;
