import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const GoogleMapComponent = ({ center, onLocationChange }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    borderRadius: '24px'
  };

  const handleAction = (e) => {
    if (onLocationChange) {
      onLocationChange({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  if (!apiKey) {
     return <div className="p-10 bg-gray-100 rounded-3xl text-center">API Key Missing</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={handleAction}
      >
        <MarkerF 
          position={center} 
          draggable 
          onDragEnd={handleAction} 
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
