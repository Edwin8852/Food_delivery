import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import OrderTracker from "../../components/common/OrderTracker";
import { Card, Badge, Button } from "../../components/ui";

export default function AdminOrders() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";
  
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRiderModal, setShowRiderModal] = useState(null); 
  const [expandedOrder, setExpandedOrder] = useState(null);
  const socket = useSocket();

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    return (
      order.id.toLowerCase().includes(searchTerm) ||
      order.customer?.name?.toLowerCase().includes(searchTerm)
    );
  });

  const fetchData = async () => {
    try {
      const [orderRes, userRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/users')
      ]);
      if (orderRes.data.success) setOrders(orderRes.data.data);
      if (userRes.data.success) {
        setRiders((userRes.data.data || []).filter(u => u.role === 'DELIVERY' || u.role === 'DELIVERY_PARTNER'));
      }
    } catch (err) {
      toast.error("Network Latency: Mission Grid Desync");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (socket) {
      const handleNewOrder = () => fetchData();
      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleNewOrder);
      return () => {
        socket.off("order:new", handleNewOrder);
        socket.off("order:update", handleNewOrder);
      };
    }
  }, [socket]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.patch('/admin/order/status', { orderId, status });
      toast.success(`Grid Synchronized: ${status.replace(/_/g, ' ')}`);
      fetchData();
    } catch (err) { toast.error("Lifecycle Failure"); }
  };

  const handleAssignRider = async (orderId, riderId) => {
    try {
      await api.patch('/admin/order/status', { orderId, status: 'ASSIGNED', deliveryPartnerId: riderId });
      toast.success("Unit Deployed");
      setShowRiderModal(null);
      fetchData();
    } catch (err) { toast.error("Deployment Failure"); }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-40 gap-6">
        <div className="w-16 h-16 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] animate-pulse">Syncing Mission Grid...</span>
     </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-fade-in">
      
      <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-8 px-2">
         <div className="space-y-1">
            <h2 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Operations <span className="text-swiggy-primary">Terminal</span></h2>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-swiggy-primary rounded-full animate-ping"></span>
                  <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">Grid Status: Synchronized</p>
               </div>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-end">
            <p className="text-[8px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Active Directives</p>
            <p className="text-xl font-black text-swiggy-heading dark:text-white tracking-tighter leading-none">{orders.length}</p>
         </div>
      </div>

      <Card noPadding className="shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-swiggy-bg dark:bg-slate-800/50">
                <th className="px-10 py-7 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Mission Target</th>
                <th className="px-10 py-7 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Payload</th>
                <th className="px-10 py-7 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] text-center">Lifecycle</th>
                <th className="px-10 py-7 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-swiggy-bg dark:divide-slate-800">
              {filteredOrders.map((order) => {
                const isActive = expandedOrder === order.id;
                return (
                <React.Fragment key={order.id}>
                  <tr 
                    onClick={() => setExpandedOrder(isActive ? null : order.id)}
                    className={`cursor-pointer transition-all group ${isActive ? 'bg-swiggy-primary/5' : 'hover:bg-swiggy-bg/50 dark:hover:bg-slate-800/30'}`}
                  >
                    <td className="px-10 py-10">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 bg-swiggy-heading dark:bg-slate-800 rounded-2xl flex items-center justify-center text-white text-[12px] font-black italic">
                            #{order.id.slice(-6).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-black text-swiggy-heading dark:text-white text-sm tracking-tighter uppercase">{order.customer?.name || 'Guest'}</p>
                            <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                       <span className="text-[11px] font-bold text-swiggy-secondary dark:text-slate-400 uppercase tracking-tight">{order.items?.length || 0} Units Locked</span>
                    </td>
                    <td className="px-10 py-10 text-center">
                       <Badge status={order.orderStatus} />
                    </td>
                    <td className="px-10 py-10 text-right">
                       <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                         {(order.orderStatus === 'PLACED' || order.orderStatus === 'PENDING') && (
                           <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}>Accept Mission</Button>
                         )}
                         {order.orderStatus === 'ACCEPTED' && (
                           <div className="flex gap-2">
                             <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(order.id, 'IN_KITCHEN')}>To Kitchen</Button>
                             <Button size="sm" onClick={() => setShowRiderModal(order.id)}>Deploy Pilot</Button>
                           </div>
                         )}
                         {order.orderStatus === 'READY' && (
                           <Button size="sm" onClick={() => setShowRiderModal(order.id)}>Assign Pilot</Button>
                         )}
                         {order.orderStatus === 'PICKED_UP' && (
                            <Button size="sm" variant="success" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>Mission Complete</Button>
                         )}
                       </div>
                    </td>
                  </tr>
                  {isActive && (
                    <tr className="bg-swiggy-bg/20 dark:bg-slate-900/50">
                      <td colSpan="4" className="px-10 py-14">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white/50 dark:bg-slate-800/20" noPadding>
                               <div className="p-8">
                                  <p className="text-[9px] font-black text-swiggy-secondary uppercase mb-4 tracking-widest">📍 Destination</p>
                                  <p className="font-bold text-swiggy-heading dark:text-white text-xs uppercase">{order.address?.street}, {order.address?.city}</p>
                               </div>
                            </Card>
                            <Card className="bg-white/50 dark:bg-slate-800/20" noPadding>
                               <div className="p-8">
                                  <p className="text-[9px] font-black text-swiggy-secondary uppercase mb-4 tracking-widest">🏎️ Logistics Unit</p>
                                  <p className="font-black text-swiggy-primary text-xs uppercase">{order.deliveryPartner?.name || 'Awaiting Unit'}</p>
                               </div>
                            </Card>
                            <Card className="bg-white/50 dark:bg-slate-800/20" noPadding>
                               <div className="p-8">
                                  <p className="text-[9px] font-black text-swiggy-secondary uppercase mb-4 tracking-widest">🛠️ Command Hub</p>
                                  <OrderTracker currentStatus={order.orderStatus} />
                               </div>
                            </Card>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )})}
            </tbody>
          </table>
        </div>
      </Card>

      {showRiderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#282C3F]/80 backdrop-blur-sm" onClick={() => setShowRiderModal(null)}/>
           <Card className="w-full max-w-lg relative z-10 p-12">
              <h3 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic mb-8">Unit <span className="text-swiggy-primary">Deployment</span></h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scroll">
                 {riders.map(rider => (
                    <button 
                      key={rider.id}
                      onClick={() => handleAssignRider(showRiderModal, rider.id)}
                      className="w-full p-6 bg-swiggy-bg dark:bg-slate-800 rounded-3xl flex items-center justify-between hover:bg-swiggy-primary hover:text-white transition-all group"
                    >
                       <span className="font-black uppercase tracking-tight text-sm">{rider.name}</span>
                       <span className="text-[8px] font-black bg-white/20 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-swiggy-primary transition-all">DEPLOY Unit</span>
                    </button>
                 ))}
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
