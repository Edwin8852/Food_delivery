import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Card, Badge, Button } from "../../components/ui";

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DeliveryDashboard() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const [earnings, setEarnings] = useState({ today: 0, total: 0, wallet: 0 });
  const [globalSettings, setGlobalSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
    const fetchSettings = async () => {
       const res = await axios.get("/admin/settings");
       if (res.data.success) setGlobalSettings(res.data.data);
    };
    fetchSettings();

    const socket = io(BACKEND_URL);
    socket.on('connect', () => socket.emit("join_delivery"));
    socket.on('new_delivery_order', () => {
      toast.info("🚨 New Mission Available!", { position: "top-center" });
      fetchOrders();
    });

    return () => socket.disconnect();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/delivery/orders");
      setOrders(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchEarnings = async () => {
    try {
      const res = await axios.get("/delivery/earnings");
      if (res.data.success) setEarnings({ today: res.data.today, total: res.data.total, wallet: res.data.wallet });
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async () => {
    try {
      const res = await axios.put("/delivery/status", { isOnline: !isOnline });
      if (res.data.success) {
        setIsOnline(!isOnline);
        toast.info(`Grid Status: ${!isOnline ? 'Online' : 'Offline'}`, { icon: !isOnline ? '🟢' : '⚪' });
      }
    } catch (err) { toast.error("Handshake failed"); }
  };

  const handleAction = async (id, endpoint, message) => {
    try {
      const res = await axios.put(`/delivery/${endpoint}/${id}`);
      if (res.data.success) {
        toast.success(message);
        fetchOrders();
        fetchEarnings();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Operation Failed"); }
  };

  if (!user?.isVerified) return (
    <div className="max-w-xl mx-auto py-32 px-6">
       <Card className="text-center">
          <div className="text-5xl mb-8">🔐</div>
          <h2 className="text-3xl font-black text-[#282C3F] dark:text-white mb-4">Awaiting Clearance</h2>
          <p className="text-[#686B78] text-sm mb-8 italic">Your credentials are currently being synchronized with the master node.</p>
          <Button onClick={() => refreshUser()} className="w-full">Check Identity Status</Button>
       </Card>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10 animate-fade-in">
      
      {/* 📡 Grid Controller */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-[#282C3F] dark:text-white tracking-tighter uppercase italic">
              Logistics <span className="text-[#FC8019]">Grid</span>
            </h1>
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#60B246] animate-pulse' : 'bg-[#686B78]'}`} />
               <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest leading-none">
                  Status: {isOnline ? 'Broadcasting Active' : 'Passive Monitoring'}
               </p>
            </div>
         </div>
         <Button 
           variant={isOnline ? 'danger' : 'primary'}
           onClick={toggleStatus}
         >
            {isOnline ? 'Terminate Session' : 'Initialize Shift'}
         </Button>
      </div>

      {/* 📊 KPI Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Today Extraction', val: `₹${earnings.today}`, icon: '💰', color: '#FC8019' },
           { label: 'Active Directives', val: orders.length, icon: '🛰️', color: '#282C3F' },
           { label: 'Grid Compliance', val: '100%', icon: '🎯', color: '#60B246' },
         ].map((kpi, idx) => (
           <Card key={idx} className="group relative">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: `${kpi.color}05` }} />
              <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest mb-2">{kpi.label}</p>
              <h3 className="text-4xl font-black text-[#282C3F] dark:text-white tracking-tighter">{kpi.val}</h3>
           </Card>
         ))}
      </div>

      {/* 📦 Live Mission Stream */}
      <div className="space-y-6">
         <div className="flex items-center gap-4">
            <h3 className="text-xs font-black text-[#686B78] uppercase tracking-[0.2em] whitespace-nowrap">Active Transmission</h3>
            <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
         </div>

         {orders.length > 0 ? (
           <div className="grid grid-cols-1 gap-6">
             {orders.map((order) => (
               <Card key={order.id} noPadding className="group hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#F8F8F8] dark:divide-slate-800">
                     
                     {/* Identifier */}
                     <div className="p-10 bg-swiggy-bg dark:bg-slate-800/50 flex flex-col items-center justify-center min-w-[180px] group-hover:bg-swiggy-primary group-hover:text-white transition-colors duration-500">
                        <p className="text-[8px] font-black text-swiggy-secondary group-hover:text-white/50 uppercase tracking-widest mb-1">Directive ID</p>
                        <p className="text-xl font-black italic tracking-tighter">#{order.id?.slice(-6).toUpperCase()}</p>
                        <div className="mt-4">
                           <Badge status={order.orderStatus} />
                        </div>
                     </div>

                     {/* Intelligence */}
                     <div className="flex-1 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                           <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mb-4">Target Destination</p>
                           <div className="flex gap-4">
                              <span className="text-2xl">🏢</span>
                              <div>
                                 <h4 className="text-lg font-black text-swiggy-heading dark:text-white uppercase tracking-tight leading-none mb-1">{order.customer?.name}</h4>
                                 <p className="text-xs font-bold text-swiggy-secondary leading-relaxed uppercase">{order.address?.street}, {order.address?.city}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col justify-end">
                           <div className="flex justify-between items-end border-b border-swiggy-bg dark:border-slate-800 pb-4">
                              <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest">Yield Projection</p>
                              <span className="text-2xl font-black text-swiggy-success tracking-tighter">₹50.00</span>
                           </div>
                        </div>
                     </div>

                     {/* Tactics */}
                     <div className="p-10 flex flex-col justify-center gap-3 min-w-[240px]">
                        {order.orderStatus === 'READY' && !order.deliveryPartnerId && (
                           <Button 
                             onClick={() => handleAction(order.id, 'accept', 'Directive Accepted 🚀')}
                             disabled={!globalSettings?.can_accept}
                             className="w-full"
                           >Accept Mission</Button>
                        )}
                        {order.deliveryPartnerId === user?.id && (
                           <>
                              {(order.orderStatus === 'ACCEPTED' || order.orderStatus === 'READY' || order.orderStatus === 'ASSIGNED') && (
                                 <Button 
                                   variant="secondary"
                                   onClick={() => handleAction(order.id, 'pickup', 'Payload Secured 📦')}
                                   disabled={!globalSettings?.can_pickup}
                                   className="w-full"
                                 >Secure Pickup</Button>
                              )}
                              {(order.orderStatus === 'PICKED_UP' || order.orderStatus === 'OUT_FOR_DELIVERY') && (
                                 <Button 
                                   variant="success"
                                   onClick={() => handleAction(order.id, 'deliver', 'Directive Complete ✅')}
                                   disabled={!globalSettings?.can_deliver}
                                   className="w-full"
                                 >Confirm Delivery</Button>
                              )}
                           </>
                        )}
                     </div>
                  </div>
               </Card>
             ))}
           </div>
         ) : (
           <Card className="text-center py-24 bg-transparent border-dashed border-2 border-slate-200">
              <div className="text-6xl mb-6 grayscale opacity-20">📡</div>
              <h3 className="text-xl font-black text-[#686B78] uppercase tracking-widest">Awaiting Grid Transmissions...</h3>
           </Card>
         )}
      </div>

    </div>
  );
}
