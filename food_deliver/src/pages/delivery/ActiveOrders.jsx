import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import OrderTracker from "../../components/common/OrderTracker";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/delivery/orders");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      toast.error("Logistics sync failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on("order:update", fetchOrders);
      socket.on("order:new", fetchOrders);
      socket.emit("join_delivery"); // ✅ Join delivery pool for marketplace orders

      socket.on("order:assigned", (order) => {
        toast.info(`🚀 NEW MISSION ASSIGNED: #${order.id.slice(-6).toUpperCase()}`, {
          position: "top-center",
          theme: "dark"
        });
        fetchOrders();
      });

      return () => {
        socket.off("order:update", fetchOrders);
        socket.off("order:new", fetchOrders);
        socket.off("order:assigned", fetchOrders);
      };
    }
  }, [socket]);

  const handleAction = async (id, action) => {
    try {
      let endpoint = '';
      if (action === 'ACCEPT') endpoint = `/delivery/accept/${id}`;
      else if (action === 'PICKUP') endpoint = `/delivery/pickup/${id}`;
      else if (action === 'ONTHEWAY') endpoint = `/delivery/ontheway/${id}`;
      else if (action === 'DELIVER') endpoint = `/delivery/deliver/${id}`;


      const res = await api.put(endpoint);
      if (res.data.success) {
        toast.success(res.data.message || "Mission updated!");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  if (loading) return (
     <div className="flex justify-center p-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 border-slate-100 shadow-lg"></div>
     </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-40 min-h-screen">
      <div className="flex justify-between items-end mb-12">
         <div>
            <h2 className="text-4xl font-[1000] text-slate-800 tracking-tighter uppercase italic">Live <span className="text-orange-500">Missions</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               Grid Monitoring Active
            </p>
         </div>
         <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">{orders.length} Active Tasks</span>
      </div>

      <div className="space-y-12">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-[56px] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden group transition-all hover:shadow-orange-100/50">
             
             {/* Flow Progress Header */}
             <div className="flex justify-between items-center mb-10">
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-[12px] font-[1000] italic group-hover:scale-110 transition-transform shadow-lg">
                      #{order.id.slice(-6).toUpperCase()}
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-800 tracking-tight uppercase">{order.customer?.name || "Customer Registered"}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString()}</p>
                   </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                   order.orderStatus === 'READY' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                   order.orderStatus === 'ASSIGNED' || order.orderStatus === 'RIDER_CONFIRMED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                   'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                   {order.orderStatus.replace(/_/g, ' ')}
                </span>
             </div>

             {/* Live Tracker Integration */}
             <div className="mb-12 px-2">
                <OrderTracker currentStatus={order.orderStatus} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex items-start gap-4 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 group-hover:bg-white transition-colors">
                   <div className="text-xl">📍</div>
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Drop Location</p>
                      <p className="text-[11px] font-bold text-slate-700 leading-snug">{order.address?.street}, {order.address?.city}</p>
                   </div>
                </div>
                
                <div className="flex items-start gap-4 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 group-hover:bg-white transition-colors">
                   <div className="text-xl">🍱</div>
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payload Content</p>
                      <p className="text-[11px] font-bold text-slate-700 leading-snug">
                         {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                   </div>
                </div>
             </div>

             {/* Action Phase */}
             <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Projected Settlement</p>
                   <p className="text-3xl font-[1000] text-slate-800 tracking-tighter">₹{order.totalAmount}</p>
                </div>

                {['READY', 'ASSIGNED'].includes(order.orderStatus) && (
                   <button 
                     onClick={() => handleAction(order.id, 'ACCEPT')}
                     className="bg-orange-500 text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-100 hover:scale-105 transition-all"
                   >
                     Accept Mission
                   </button>
                )}

                {order.orderStatus === 'RIDER_CONFIRMED' && (
                   <button 
                     onClick={() => handleAction(order.id, 'PICKUP')}
                     className="bg-blue-600 text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.03] transition-all"
                   >
                     Confirm Pickup
                   </button>
                )}

                {order.orderStatus === 'PICKED_UP' && (
                   <button 
                     onClick={() => handleAction(order.id, 'ONTHEWAY')}
                     className="bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
                   >
                     Start Transit
                   </button>
                )}

                {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                   <button 
                     onClick={() => handleAction(order.id, 'DELIVER')}
                     className="bg-emerald-600 text-white px-10 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
                   >
                     Confirm Delivery
                   </button>
                )}


                {order.orderStatus === 'DELIVERED' && (
                   <span className="text-[10px] font-black text-slate-300 uppercase italic">Task Terminated Successfully</span>
                )}
             </div>

          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-40 text-center rounded-[64px] border-2 border-dashed border-slate-100 bg-slate-50/50">
             <div className="text-7xl mb-8 grayscale opacity-20 animate-bounce">🏍️</div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">No Missions Available in Grid</p>
          </div>
        )}
      </div>
    </div>
  );
}
