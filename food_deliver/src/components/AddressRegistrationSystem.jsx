import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import api from '../services/api';
import { toast } from 'react-toastify';

const GOOGLE_MAPS_LIBRARIES = ['places'];
const mapContainerStyle = { width: '100%', height: '350px', borderRadius: '32px' };
const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bangalore

const AddressRegistrationSystem = ({ onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // 🌍 Load Google Maps Assets
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // 🛰️ Reverse Geocoding Intelligence
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setFormData(prev => ({
          ...prev,
          address: results[0].formatted_address,
          latitude: lat,
          longitude: lng
        }));
        toast.info('Manifest address auto-resolved', { theme: 'dark' });
      } else {
        console.error('Geocode failure:', status);
        toast.error('Satellite failed to resolve address string');
      }
    });
  }, []);

  // 📍 Capture Current Position
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser does not support geospatial link');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
        setLocating(false);
        toast.success('Coordinates synchronized');
      },
      (error) => {
        setLocating(false);
        toast.error('Position triangulation denied');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/address/add', formData);
      if (res.data.success) {
        toast.success('Location registered in central database');
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Manifest sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <div className="p-10 bg-red-50 text-red-500 rounded-3xl">Map Engine Failed to Initialize</div>;
  if (!isLoaded) return <div className="p-10 bg-gray-50 animate-pulse rounded-3xl text-center font-black">Engaging Satellites...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[48px] p-10 shadow-2xl shadow-gray-100 border border-gray-50 animate-fade-in group">
       <div className="mb-10 flex justify-between items-start">
          <div>
             <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Location Registration</h2>
             <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-1">Satellite Verified Manifest</p>
          </div>
          <button 
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="bg-orange-600 text-white font-black px-6 py-4 rounded-2xl hover:shadow-orange-200 shadow-xl transition-all active:scale-95 text-[10px] uppercase tracking-widest flex items-center gap-3"
          >
             {locating ? 'Triangulating...' : 'Use Current Position'}
             <span>🛰️</span>
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map Engine */}
          <div className="space-y-6">
             <div className="rounded-[32px] overflow-hidden border-4 border-white shadow-xl h-[350px]">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{ lat: formData.latitude, lng: formData.longitude }}
                  zoom={15}
                  onClick={(e) => reverseGeocode(e.latLng.lat(), e.latLng.lng())}
                >
                   <MarkerF 
                     position={{ lat: formData.latitude, lng: formData.longitude }} 
                     draggable 
                     onDragEnd={(e) => reverseGeocode(e.latLng.lat(), e.latLng.lng())} 
                   />
                </GoogleMap>
             </div>
             <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-2">Sync Coordinates</span>
                <span className="text-xs font-mono font-bold text-gray-800 tracking-tighter">
                   LAT: {formData.latitude.toFixed(6)} | LNG: {formData.longitude.toFixed(6)}
                </span>
             </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSave} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Receiver Data</label>
                <input 
                  required 
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Link</label>
                <input 
                  required 
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Physical Address (Auto-resolved)</label>
                <textarea 
                  required 
                  placeholder="Selecting node on map will auto-fill this..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border-0 rounded-2xl p-4 font-bold text-gray-800 h-28 resize-none text-xs"
                />
             </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full py-6 rounded-3xl bg-gray-900 text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all active:scale-95 mt-4"
             >
                {loading ? 'Transacting...' : 'Commit Location Manifest'}
             </button>
          </form>
       </div>

       <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       `}</style>
    </div>
  );
};

export default AddressRegistrationSystem;
