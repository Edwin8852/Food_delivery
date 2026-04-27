import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '32px'
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946 // Bangalore
};

const GMap = ({ center = defaultCenter, onMarkerDragEnd }) => {
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="bg-red-50 p-10 rounded-[40px] border border-red-100 text-center animate-fade-in">
        <span className="text-5xl block mb-6">🛰️</span>
        <h4 className="text-xl font-black text-red-900 uppercase tracking-tight">Signal Interrupted</h4>
        <p className="text-red-600 font-bold mt-2 text-sm leading-relaxed">
          Google Maps failed to load. This usually indicates an invalid API key or disabled Maps JavaScript API.
        </p>
        <div className="mt-8 p-4 bg-white/50 rounded-2xl text-[10px] font-mono text-red-400 font-black tracking-widest uppercase">
          ERRORCODE: {loadError.message?.includes('InvalidKeyMapError') ? 'INVALID_API_KEY' : 'UNEXPECTED_FAILURE'}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[400px] w-full bg-gray-50 rounded-[32px] flex items-center justify-center animate-pulse border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Calibrating Manifest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-1 bg-white rounded-[36px] shadow-2xl shadow-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={map => setMap(map)}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          clickableIcons: true,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [{ "weight": "2.00" }]
            },
            {
              "featureType": "all",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#9c9c9c" }]
            },
            {
              "featureType": "all",
              "elementType": "labels.text",
              "stylers": [{ "visibility": "on" }]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{ "color": "#f2f2f2" }]
            }
          ]
        }}
      >
        <MarkerF 
          position={center} 
          draggable={true}
          onDragEnd={(e) => {
            if (onMarkerDragEnd) {
              onMarkerDragEnd({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              });
            }
          }}
          animation={window.google?.maps.Animation.DROP}
        />
      </GoogleMap>
      
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
         <div className="bg-gray-900/80 backdrop-blur-md text-white p-4 rounded-2xl flex items-center justify-between border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3">
               <span className="text-xl">📍</span>
               <div>
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Target Node</p>
                  <p className="text-[11px] font-bold text-gray-300 tabular-nums">
                    {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
                  </p>
               </div>
            </div>
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] italic">Precise manifest Link</span>
         </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default GMap;
