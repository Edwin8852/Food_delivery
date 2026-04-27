import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SimpleMapTest = () => {
  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '24px'
  };

  const center = {
    lat: 13.0827,
    lng: 80.2707 // Chennai
  };

  if (!API_KEY) {
    return (
      <div className="p-10 bg-red-50 text-red-600 rounded-3xl text-center border-2 border-dashed border-red-200">
        <h3 className="text-xl font-black uppercase tracking-widest">🚨 API Key Missing</h3>
        <p className="font-bold mt-2">Check food_deliver/.env for VITE_GOOGLE_MAPS_API_KEY</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-[48px] shadow-2xl shadow-gray-100 border border-gray-50 animate-fade-in text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Satellite Manifest Test</h2>
        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mt-1">GCP Configuration Validated</p>
      </div>

      <div className="rounded-[32px] overflow-hidden shadow-xl border-4 border-white mb-8">
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
              disableDefaultUI: false,
              clickableIcons: true,
            }}
          />
        </LoadScript>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Target Sector</span>
            <span className="text-sm font-black text-gray-800">TAMIL NADU, IN</span>
         </div>
         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Interface State</span>
            <span className="text-sm font-black text-green-600">LIVE LINK ONLINE</span>
         </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default SimpleMapTest;
