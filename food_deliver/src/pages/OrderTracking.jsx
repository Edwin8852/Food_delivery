import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../services/api';
import { useSocket } from "../context/SocketContext";
import OrderTracker from "../components/common/OrderTracker";
import LiveTrackingMap from "../components/LiveTrackingMap";
import { Card, Badge, Button } from "../components/ui";

const STAGES = [
  { id: 'PLACED', label: "Order Placed", desc: "We've received your mission packet" },
  { id: 'ACCEPTED', label: "Confirmed", desc: "The merchant has accepted the mission" },
  { id: 'IN_KITCHEN', label: "In Kitchen", desc: "Ingredients are being assembled" },
  { id: 'PREPARING', label: "Active Prep", desc: "Chef is actively preparing your order" },
  { id: 'READY', label: "Ready", desc: "Thermal prep complete, awaiting pickup" },
  { id: 'ASSIGNED', label: "Unit Assigned", desc: "A logistics unit is en route for pickup" },
  { id: 'PICKED_UP', label: "In Transit", desc: "Rider has secured the package" },
  { id: 'DELIVERED', label: "Mission Complete", desc: "Enjoy your meal!" },
];

export default function OrderTracking({ order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [deliveryPartnerLoc, setDeliveryPartnerLoc] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();

  const fetchOrder = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const orderData = response.data.data;
      setOrder(orderData);
      if (orderData?.deliveryPartner?.lat && orderData?.deliveryPartner?.lng) {
        setDeliveryPartnerLoc({ lat: parseFloat(orderData.deliveryPartner.lat), lng: parseFloat(orderData.deliveryPartner.lng) });
      }
    } catch (error) { console.error('Failed to sync order telemetry', error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const orderId = initialOrder?.id || location.state?.orderId;
    if (!orderId) { navigate("/home"); return; }
    fetchOrder(orderId);
    if (socket) {
      socket.emit('join_order', orderId);
      const handleUpdate = (data) => {
        if (data.orderId === orderId || data.id === orderId) {
          fetchOrder(orderId);
          toast.info(`Protocol Update: ${data.status?.replace(/_/g, ' ')}`);
        }
      };
      const handleLocation = (data) => setDeliveryPartnerLoc({ lat: parseFloat(data.lat), lng: parseFloat(data.lng) });
      socket.on('order:update', handleUpdate);
      socket.on('location_update', handleLocation);
      return () => {
        socket.off('order:update', handleUpdate);
        socket.off('location_update', handleLocation);
        socket.emit('leave_order', orderId);
      };
    }
  }, [initialOrder, location.state, socket]);

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-40 gap-6">
        <div className="w-16 h-16 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] animate-pulse">Syncing Telemetry...</span>
     </div>
  );

  if (!order) return null;

  const currentStatus = order?.orderStatus?.toUpperCase() || 'PLACED';
  const currentIndex = STAGES.findIndex(s => s.id === currentStatus);

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-fade-in pb-32">
      
      {/* 📡 Header Module */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-slate-800 pb-10 mb-12">
         <div>
            <h1 className="text-5xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic leading-none">
               Mission <span className="text-swiggy-primary">Telemetry</span>
            </h1>
            <div className="flex items-center gap-3 mt-4">
               <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-ping" />
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">
                  ORDER ID: #{order.id.slice(-8).toUpperCase()} — ACTIVE TRACKING
               </p>
            </div>
         </div>
         <Badge status={currentStatus} className="scale-150 origin-right" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 🗺️ Operational Visualizer (Left) */}
        <div className="flex-1 space-y-10">
          
          <Card className="p-10 space-y-10 shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl">📡</span>
             </div>
             
             <div className="relative z-10">
                <h3 className="text-xs font-black text-swiggy-secondary uppercase tracking-[0.3em] mb-8">Logistics Status Pipeline</h3>
                <OrderTracker currentStatus={currentStatus} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 border-t border-swiggy-bg dark:border-slate-800">
                {STAGES.slice(0, currentIndex + 1).map((stage, idx) => (
                  <div key={stage.id} className={`p-5 rounded-3xl border-2 transition-all duration-500 flex flex-col justify-center ${stage.id === currentStatus ? 'bg-swiggy-primary border-swiggy-primary text-white shadow-xl shadow-swiggy-primary/30' : 'bg-swiggy-bg dark:bg-slate-800 border-transparent text-swiggy-secondary'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-black uppercase tracking-widest">{stage.label}</p>
                       {stage.id === currentStatus && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                    </div>
                    <p className={`text-[9px] font-medium leading-relaxed opacity-70 ${stage.id === currentStatus ? 'text-white' : ''}`}>{stage.desc}</p>
                  </div>
                ))}
             </div>
          </Card>

          <Card noPadding border className="h-[500px] overflow-hidden shadow-2xl group">
             <div className="absolute top-6 left-6 z-10">
                <Badge status="LIVE MAP" className="shadow-xl" />
             </div>
             <LiveTrackingMap
               restaurant={order.restaurant}
               userLocation={order.address}
               deliveryPartnerLocation={deliveryPartnerLoc}
             />
          </Card>
        </div>

        {/* 🛰️ Node Identities (Right) */}
        <aside className="w-full lg:w-[400px] space-y-8">
          
          {/* Pilot ID Card */}
          <Card className="relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
             <h3 className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] mb-8">Designated Logistics Node</h3>

             {order.deliveryPartner ? (
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-swiggy-bg dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner uppercase font-black text-swiggy-primary">
                    {order.deliveryPartner.name[0]}
                  </div>
                  <div className="flex-1">
                     <p className="text-xl font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic">{order.deliveryPartner.name}</p>
                     <p className="text-[9px] font-black text-swiggy-primary uppercase tracking-widest mt-1">Verified Logistics Partner</p>
                     <div className="mt-6">
                        <a href={`tel:${order.deliveryPartner.phone}`}>
                           <Button size="sm" variant="outline" className="w-full">Initialize Contact</Button>
                        </a>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="text-center py-10 opacity-40 animate-pulse">
                  <span className="text-4xl block mb-4">🛵</span>
                  <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest">Awaiting Logistics Handshake...</p>
               </div>
             )}
          </Card>

          {/* Manifest Summary Card */}
          <Card noPadding border className="bg-white dark:bg-[#1E1E1E] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-2xl">
            <div className="p-8 border-b border-gray-100 dark:border-slate-800">
               <h3 className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em]">Payload Verification</h3>
            </div>
            <div className="p-8 space-y-4 max-h-[300px] overflow-y-auto custom-scroll">
               {order.items?.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center group">
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-swiggy-heading dark:text-white uppercase tracking-tight group-hover:text-swiggy-primary transition-colors">{item.menuItem?.name || "Inventory Item"}</span>
                       <span className="text-[9px] font-black text-swiggy-secondary uppercase">Unit: {item.quantity} X ₹{item.price || item.menuItem?.price}</span>
                    </div>
                    <span className="text-sm font-black text-swiggy-heading dark:text-white italic tracking-tighter">₹{(item.price || item.menuItem?.price) * item.quantity}</span>
                 </div>
               ))}
            </div>
            <div className="p-8 bg-swiggy-bg dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800">
               <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-swiggy-primary uppercase tracking-[0.4em] mb-1">Total Valuation</span>
                     <span className="text-4xl font-black text-swiggy-heading dark:text-white italic tracking-tighter">₹{order.totalAmount}</span>
                  </div>
                  <Badge status="delivered" children="PAID" className="mb-1" />
               </div>
            </div>
          </Card>

          {/* Support Node */}
          <div className="px-6 text-center">
             <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-[0.4em] leading-relaxed italic opacity-40">
                Encrypted telemetry link secured via Protocol V7. Operational grid verified.
             </p>
          </div>
        </aside>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}} />
    </div>
  );
}
