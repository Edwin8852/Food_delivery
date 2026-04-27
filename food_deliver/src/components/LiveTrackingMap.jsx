import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for User, Restaurant, and Delivery Partner
const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1239/1239525.png', // Home Icon
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const restaurantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1996/1996068.png', // Restaurant Icon
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const bikeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png', // Delivery Bike Icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Component to handle map centering and bounds
function MapViewUpdater({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
}

const LiveTrackingMap = ({ restaurant, userLocation, deliveryPartnerLocation }) => {
    const positions = useMemo(() => {
        const newPositions = [];
        if (restaurant?.lat && restaurant?.lng) newPositions.push([restaurant.lat, restaurant.lng]);
        if (userLocation?.lat && userLocation?.lng) newPositions.push([userLocation.lat, userLocation.lng]);
        if (deliveryPartnerLocation?.lat && deliveryPartnerLocation?.lng) newPositions.push([deliveryPartnerLocation.lat, deliveryPartnerLocation.lng]);
        return newPositions;
    }, [restaurant, userLocation, deliveryPartnerLocation]);

    // Default center if no coordinates
    const defaultCenter = [11.0168, 76.9558]; // Coimbatore center

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <MapContainer 
                center={positions.length > 0 ? positions[0] : defaultCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {restaurant?.lat && (
                    <Marker position={[restaurant.lat, restaurant.lng]} icon={restaurantIcon}>
                        <Popup>
                            <strong>{restaurant.name}</strong><br />Restaurant
                        </Popup>
                    </Marker>
                )}

                {userLocation?.lat && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <strong>Delivery Address</strong>
                        </Popup>
                    </Marker>
                )}

                {deliveryPartnerLocation?.lat && (
                    <Marker position={[deliveryPartnerLocation.lat, deliveryPartnerLocation.lng]} icon={bikeIcon}>
                        <Popup>
                            <strong>Delivery Partner</strong><br />Live Location
                        </Popup>
                    </Marker>
                )}

                <MapViewUpdater positions={positions} />
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;
