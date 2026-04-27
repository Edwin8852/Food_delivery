import React, { useState } from 'react';
import { toast } from 'react-toastify';

const LocationPicker = ({ onLocationSelect }) => {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser', { theme: 'dark' });
      return;
    }

    setLocating(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        
        setCoords(newCoords);
        setLocating(false);
        
        if (onLocationSelect) {
          onLocationSelect(newCoords);
        }
        
        toast.success(`Coordinates synchronized: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { theme: 'dark' });
      },
      (error) => {
        setLocating(false);
        let errorMsg = 'Failed to retrieve location matrix';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Position data unavailable from satellite';
            break;
          case error.TIMEOUT:
            errorMsg = 'Signal timeout during triangulation';
            break;
          default:
            errorMsg = error.message;
        }
        
        toast.error(errorMsg, { theme: 'dark' });
      },
      options
    );
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-gray-100 border border-gray-50 max-w-md mx-auto animate-fade-in group">
       <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
             🗺️
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Geospatial Link</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Satellite Triangulation</p>
       </div>

       <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Latitude</span>
                <span className="text-sm font-black text-gray-800 tabular-nums">{coords.lat ? coords.lat.toFixed(6) : '---'}</span>
             </div>
             <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Longitude</span>
                <span className="text-sm font-black text-gray-800 tabular-nums">{coords.lng ? coords.lng.toFixed(6) : '---'}</span>
             </div>
          </div>

          <button 
            onClick={handleGetCurrentLocation}
            disabled={locating}
            className={`w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${locating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-600 text-white hover:shadow-xl hover:shadow-orange-200 active:scale-95'}`}
          >
             {locating ? (
                <>
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   Establishing Link...
                </>
             ) : (
                <>
                   <span>📍</span>
                   Capture Current Position
                </>
             )}
          </button>
       </div>

       <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
       `}</style>
    </div>
  );
};

export default LocationPicker;
