import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import LiveTrackingMap from '../../components/LiveTrackingMap';
import { toast } from 'react-toastify';

export default function DeliveryTracking() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [currentLoc, setCurrentLoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrders = async () => {
    try {
      const res = await axios.get("/delivery/orders");
      // Filter for orders that are picked up and in transit
      const inTransit = (res.data.data || []).filter(o => ['PICKED_UP', 'ASSIGNED'].includes(o.status));
      setActiveOrders(inTransit);
    } catch (err) {
      console.error("Failed to fetch active orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLoc(coords);
        // Sync with backend
        axios.post("/delivery/location", coords).catch(err => console.error("Loc sync failed", err));
      },
      (err) => toast.error("GPS access denied"),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (loading) return <div className="p-20 text-center font-black animate-pulse">🛰️ Syncing with Satellite...</div>;

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">🛰️</span>
             </div>
             <h1 className="text-3xl font-black text-[#0c0d12] tracking-tight">Real-Time Tracking</h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-100">
             <span className="w-2 h-2 bg-green-600 rounded-full animate-ping"></span>
             <span className="text-xs font-black uppercase tracking-widest">Live Signals Active</span>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-8 h-[700px]">
          <div className="col-span-9 bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl relative border-4 border-white shadow-slate-200">
             <LiveTrackingMap 
                restaurant={activeOrders[0]?.restaurant} 
                userLocation={activeOrders[0]?.address} 
                deliveryPartnerLocation={currentLoc} 
             />
             <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-2xl max-w-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Navigation Intel</p>
                <p className="font-black text-gray-800">Heading towards {activeOrders[0]?.deliveryAddress || 'no active destination'}</p>
                <div className="mt-4 flex gap-2">
                   <div className="flex-1 bg-gray-100 p-3 rounded-2xl text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase">Distance</p>
                      <p className="font-black text-gray-800">1.2 km</p>
                   </div>
                   <div className="flex-1 bg-gray-100 p-3 rounded-2xl text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase">Est. Time</p>
                      <p className="font-black text-gray-800">8 min</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2">Active Targets ({activeOrders.length})</h3>
             {activeOrders.map(order => (
               <div key={order._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:border-orange-500 transition-all group">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase">Order #{order._id.slice(-4).toUpperCase()}</span>
                     <span className="text-[10px] font-black text-gray-400">PICKED UP</span>
                  </div>
                  <p className="font-extrabold text-gray-800 text-xs mb-4">{order.deliveryAddress}</p>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-orange-600 transition-colors">
                     View Details
                  </button>
               </div>
             ))}

             {activeOrders.length === 0 && (
               <div className="bg-orange-50 p-8 rounded-[32px] border border-dashed border-orange-200 text-center">
                  <span className="text-3xl block mb-4">😴</span>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">No Active Missions</p>
               </div>
             )}
          </div>
       </div>

       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
