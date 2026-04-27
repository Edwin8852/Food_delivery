import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { Card, Badge, Button } from "../../components/ui";

export default function KitchenMonitor() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data.success) {
        const kitchenQueue = res.data.data.filter(o => 
          ['IN_KITCHEN', 'PREPARING'].includes(o.orderStatus?.toUpperCase())
        );
        setOrders(kitchenQueue);
      }
    } catch (err) {
      toast.error("Kitchen sync failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    if (socket) {
      socket.on("order:new", fetchKitchenOrders);
      socket.on("order:update", fetchKitchenOrders);
      return () => {
        socket.off("order:new", fetchKitchenOrders);
        socket.off("order:update", fetchKitchenOrders);
      };
    }
  }, [socket]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.patch('/admin/order/status', { orderId, status });
      toast.success(status === 'PREPARING' ? "Oven ignited: Preparing..." : "Prep complete: Ready!");
      fetchKitchenOrders();
    } catch (err) {
      toast.error("Workflow error");
    }
  };

  if (loading && orders.length === 0) return (
    <div className="flex flex-col items-center justify-center p-40 gap-4">
      <div className="w-12 h-12 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
      <span className="text-swiggy-secondary font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing Kitchen State...</span>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      
      {/* ♨️ Production Header */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Kitchen <span className="text-swiggy-primary">Monitor</span></h2>
        <div className="flex items-center gap-3 mt-1">
           <div className="w-1.5 h-1.5 bg-swiggy-success rounded-full animate-ping" />
           <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-none">Live Production Pipeline Synchronized</p>
        </div>
      </div>

      {/* 🚀 Prep Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {orders.map((order) => (
          <Card key={order.id} noPadding className="group hover:shadow-xl transition-all duration-500 overflow-hidden">
             
            <div className="px-8 py-6 bg-swiggy-bg dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="w-11 h-11 bg-swiggy-heading dark:bg-slate-800 rounded-xl flex items-center justify-center text-white text-[11px] font-black italic">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
                <div>
                   <Badge status={order.orderStatus} />
                   <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mt-1">
                      Received: {new Date(order.createdAt).toLocaleTimeString()}
                   </p>
                </div>
              </div>

              {order.orderStatus === 'PREPARING' && (
                <div className="flex items-center gap-2 text-swiggy-primary animate-pulse">
                   <span className="text-xs">♨️</span>
                   <span className="text-[9px] font-black uppercase tracking-widest">Active Prep</span>
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                 <p className="text-[8px] font-black text-swiggy-secondary uppercase tracking-widest">Inventory List</p>
                 {order.items?.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center p-5 bg-swiggy-bg dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-4">
                       <span className="w-8 h-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-swiggy-primary shadow-sm">
                         {item.quantity}x
                       </span>
                       <span className="text-xs font-bold text-swiggy-heading dark:text-slate-200 uppercase tracking-tight">{item.name}</span>
                     </div>
                   </div>
                 ))}
              </div>

              <div className="pt-4">
                {order.orderStatus === 'IN_KITCHEN' ? (
                  <Button onClick={() => handleUpdateStatus(order.id, 'PREPARING')} className="w-full h-16">Start Preparing Order</Button>
                ) : (
                  <Button variant="secondary" onClick={() => handleUpdateStatus(order.id, 'READY')} className="w-full h-16">Mark Ready for Dispatch</Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-2 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
             <div className="text-5xl mb-6 grayscale opacity-20">🍳</div>
             <p className="text-swiggy-secondary font-black uppercase tracking-[0.3em] text-[10px]">Kitchen Hub Synchronized: Queue Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
