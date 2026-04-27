import { useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const LocationTracker = () => {
  const { user } = useAuth();

  useEffect(() => {
    let watchId;

    const sendLocation = async (position) => {
      const { latitude, longitude } = position.coords;

      console.log("[GRID] Telemetry Updated:", latitude, longitude);

      try {
        await api.post("/delivery/location", {
          lat: latitude,
          lng: longitude,
        });
      } catch (err) {
        console.error("Location Sync Error:", err);
      }
    };

    const errorHandler = (err) => {
      console.error("Location Error:", err);
    };

    if (navigator.geolocation && user?.role === 'DELIVERY_PARTNER' && user?.isOnline) {
      watchId = navigator.geolocation.watchPosition(
        sendLocation,
        errorHandler,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      if (watchId) {
        console.log("🛑 Terminating Location Watcher");
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [user?.isOnline, user?.role]); // ✅ Adjust based on online status

  return null;
};

export default LocationTracker;
