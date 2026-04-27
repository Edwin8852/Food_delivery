import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { Card, Badge, Button } from "../../components/ui";

export default function DeliveryManagement() {
  const [riders, setRiders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRiderModal, setShowRiderModal] = useState(null);
  const socket = useSocket();

  const fetchData = async () => {
    try {
      const [userRes, orderRes] = await Promise.all([
        api.get('/users'),
        api.get('/admin/orders')
      ]);
      const usersList = userRes.data.data || [];
      setRiders(usersList.filter(u => u.role === 'DELIVERY' || u.role === 'DELIVERY_PARTNER'));
      setActiveDeliveries((orderRes.data.data || []).filter(o => 
        ['READY', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.orderStatus)
      ));
    } catch (err) {
      toast.error("Logistics sync failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (socket) {
      socket.on("order:update", fetchData);
      socket.on("order:new", fetchData);
      return () => {
        socket.off("order:update", fetchData);
        socket.off("order:new", fetchData);
      };
    }
  }, [socket]);

  const handleAssignRider = async (orderId, riderId) => {
    try {
      await api.patch('/admin/order/status', { orderId, status: 'PICKED_UP', deliveryPartnerId: riderId });
      toast.success("Rider deployed!");
      setShowRiderModal(null);
      fetchData();
    } catch (err) { toast.error("Deployment failed"); }
  };

  const handleVerification = async (riderId, status, isVerified) => {
    try {
      await api.put(`/user/update/${riderId}`, { verificationStatus: status, isVerified });
      toast.success(`Identity State: ${status}`);
      fetchData();
    } catch (err) { toast.error("Handshake Error"); }
  };

  if (loading && activeDeliveries.length === 0) return (
    <div className="flex flex-col items-center justify-center p-40 gap-4">
       <div className="w-12 h-12 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
       <span className="text-swiggy-secondary font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing Logistics Grids...</span>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      
      {/* 🚁 Operational Header */}
      <div className="px-2">
         <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Logistics <span className="text-swiggy-primary">Grid</span></h2>
         <div className="flex items-center gap-3 mt-1">
            <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-ping" />
            <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-none">Global Fleet Intelligence Monitoring</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
          {/* 👥 Pilot Directory */}
          <div className="xl:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-4">
               <h3 className="text-xs font-black text-swiggy-secondary uppercase tracking-widest">Pilot Fleet</h3>
               <span className="bg-swiggy-primary/10 text-swiggy-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{riders.filter(r => r.isVerified).length} Verified</span>
            </div>
            
            <div className="space-y-4">
               {riders.map(rider => (
                  <Card key={rider.id} noPadding className="group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                     <div className="p-6 flex items-center gap-4 relative z-10 border-b border-swiggy-bg dark:border-slate-800">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
                           rider.verificationStatus === 'APPROVED' ? 'bg-swiggy-success/10 text-swiggy-success' : 
                           rider.verificationStatus === 'REJECTED' ? 'bg-swiggy-error/10 text-swiggy-error' : 'bg-swiggy-warning/10 text-swiggy-warning'
                        }`}>
                           {rider.vehicleType === 'BIKE' ? '🏍️' : rider.vehicleType === 'CYCLE' ? '🚲' : '👤'}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <p className="font-black text-swiggy-heading dark:text-white tracking-tight uppercase text-sm">{rider.name}</p>
                              {rider.isVerified && <span className="text-xs" title="Verified Pilot">🛡️</span>}
                           </div>
                           <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mt-1">
                              {rider.vehicleNumber || 'Unassigned Unit'}
                           </p>
                        </div>
                     </div>
                     <div className="p-6 bg-swiggy-bg dark:bg-slate-800/30 flex justify-between items-center">
                        <div className="flex gap-2">
                           <Badge status={rider.verificationStatus || 'offline'} className="scale-90 origin-left" />
                        </div>
                        <div className="flex gap-2">
                           {rider.verificationStatus !== 'APPROVED' && (
                              <Button size="sm" variant="success" onClick={() => handleVerification(rider.id, 'APPROVED', true)}>Pass</Button>
                           )}
                           {rider.verificationStatus !== 'REJECTED' && (
                              <Button size="sm" variant="danger" onClick={() => handleVerification(rider.id, 'REJECTED', false)}>Fail</Button>
                           )}
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
          </div>

          {/* 🛰️ Active Pipeline */}
          <div className="xl:col-span-8 space-y-6">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black text-swiggy-secondary uppercase tracking-widest">In-Transit Directives</h3>
                <span className="bg-swiggy-heading dark:bg-slate-800 text-white dark:text-swiggy-secondary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{activeDeliveries.length} Monitoring</span>
             </div>

             <div className="grid grid-cols-1 gap-6">
                {activeDeliveries.map(dev => (
                   <Card key={dev.id} noPadding className="hover:shadow-2xl transition-all duration-700 overflow-hidden relative group">
                      <div className="flex flex-col md:flex-row p-8 md:p-10 gap-10">
                         <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                               <span className="px-3 py-1 bg-swiggy-heading dark:bg-slate-800 text-white text-[9px] font-black rounded-lg uppercase tracking-widest border border-slate-700">#{dev.id.slice(-6).toUpperCase()}</span>
                               <Badge status={dev.orderStatus} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                               <div className="relative pl-6 border-l-2 border-swiggy-bg dark:border-slate-800">
                                  <p className="text-[9px] font-black text-swiggy-secondary uppercase mb-2 tracking-widest">Objective Destination</p>
                                  <p className="font-black text-swiggy-heading dark:text-white text-sm tracking-tighter uppercase">{dev.customer?.name || 'Authorized Guest'}</p>
                                  <p className="text-[10px] font-black text-swiggy-secondary leading-tight mt-1 uppercase italic">{dev.address?.city}</p>
                               </div>
                               <div className="relative pl-6 border-l-2 border-swiggy-bg dark:border-slate-800">
                                  <p className="text-[9px] font-black text-swiggy-secondary uppercase mb-2 tracking-widest">Assigned Unit</p>
                                  {dev.deliveryPartner ? (
                                     <p className="font-black text-swiggy-primary text-sm tracking-tighter uppercase italic">{dev.deliveryPartner.name}</p>
                                  ) : (
                                     <button 
                                       onClick={() => setShowRiderModal(dev.id)}
                                       className="text-[10px] font-black text-swiggy-primary uppercase bg-swiggy-primary/5 px-4 py-2 rounded-xl animate-pulse border border-swiggy-primary/20"
                                     >
                                        Assign Pilot Now
                                     </button>
                                  )}
                               </div>
                            </div>
                         </div>

                         <div className="w-full md:w-64 bg-swiggy-bg dark:bg-slate-800/30 p-8 rounded-[32px] border border-swiggy-bg dark:border-slate-800 flex flex-col justify-center gap-5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-swiggy-primary/5 rounded-full -mr-8 -mt-8" />
                             <div className="h-2 w-full bg-white dark:bg-slate-900 rounded-full overflow-hidden border border-swiggy-bg dark:border-slate-700 relative z-10">
                                <div 
                                  className="h-full bg-swiggy-primary transition-all duration-1500 ease-out shadow-[0_0_12px_rgba(252,128,25,0.4)]"
                                  style={{
                                     width: dev.orderStatus === 'READY' ? '15%' :
                                            dev.orderStatus === 'ASSIGNED' ? '40%' : 
                                            dev.orderStatus === 'PICKED_UP' ? '75%' : '100%'
                                  }}
                                />
                             </div>
                             <p className="text-[10px] font-black text-swiggy-heading dark:text-swiggy-secondary uppercase text-center tracking-[0.2em] relative z-10">
                                {dev.orderStatus === 'READY' ? 'Awaiting Dispatch' : 
                                 dev.orderStatus === 'ASSIGNED' ? 'Pilot Routing' :
                                 dev.orderStatus === 'PICKED_UP' ? 'Transit Active' : 'Final Approach'}
                             </p>
                         </div>
                      </div>
                   </Card>
                ))}
             </div>
          </div>
      </div>

      {showRiderModal && (
        <div className="fixed inset-0 bg-swiggy-heading/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 pb-20 animate-fade-in">
           <Card className="w-full max-w-lg p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic mb-2">Deploy <span className="text-swiggy-primary">Pilot</span></h3>
              <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest mb-10">Select logistics unit for tactical assignment</p>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scroll">
                 {riders.filter(r => r.isVerified).map(rider => (
                    <button 
                      key={rider.id}
                      onClick={() => handleAssignRider(showRiderModal, rider.id)}
                      className="w-full p-6 bg-swiggy-bg dark:bg-slate-800 rounded-3xl flex items-center justify-between hover:bg-swiggy-primary hover:text-white transition-all group border border-transparent hover:border-swiggy-primary"
                    >
                       <span className="font-black uppercase tracking-tight text-sm">{rider.name}</span>
                       <span className="bg-white/10 text-white font-black text-[9px] px-4 py-2 rounded-xl border border-white/10 group-hover:bg-white group-hover:text-swiggy-primary group-hover:border-white transition-all uppercase italic">Assign Node</span>
                    </button>
                 ))}
              </div>
              <button onClick={() => setShowRiderModal(null)} className="mt-8 text-[10px] font-black text-swiggy-secondary uppercase tracking-widest hover:text-swiggy-error transition-colors w-full">Abort Directive</button>
           </Card>
        </div>
      )}
    </div>
  );
}
