import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { Card, Badge, Button } from "../components/ui";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data);
    } catch (error) { console.error('Failed to fetch orders', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const submitRating = async (id) => {
    try {
      if (!rating || !review.trim()) {
        toast.warning("Complete feedback manifest required.");
        return;
      }
      const res = await api.post(`/orders/${id}/rating`, { rating, review });
      if (res.data.success) {
        toast.success("Feedback Telemetry Synchronized! 🌟");
        setShowRating(null);
        setRating(5);
        setReview("");
        fetchOrders();
      }
    } catch (err) { toast.error("Telemetry Sync Failure"); }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-40 gap-6">
        <div className="w-16 h-16 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] animate-pulse">Syncing History Ledger...</span>
     </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl animate-fade-in pb-40">
      
      {/* 📜 Ledger Header */}
      <div className="mb-14 border-b border-gray-100 dark:border-slate-800 pb-10">
         <h1 className="text-5xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic leading-none">
            Feast <span className="text-swiggy-primary">Ledger</span>
         </h1>
         <div className="flex items-center gap-3 mt-4">
            <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-pulse" />
            <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">Historical Archive of Operational Missions</p>
         </div>
      </div>
      
      {orders.length === 0 ? (
        <Card className="text-center py-24 flex flex-col items-center space-y-8">
          <div className="text-7xl opacity-20">📜</div>
          <h3 className="text-2xl font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic">Ledger Entries Void</h3>
          <Link to="/home"><Button>Initialize First Mission</Button></Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
             const status = (order.orderStatus || order.status || '').toUpperCase();
             return (
              <Card key={order.id} className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-swiggy-primary/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                   <div className="flex items-center gap-8 flex-1 w-full">
                      <div className="w-20 h-20 bg-swiggy-bg dark:bg-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">🍱</div>
                      <div className="flex-1 min-w-0">
                         <h3 className="text-2xl font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic truncate group-hover:text-swiggy-primary transition-colors">{order.restaurant_name || "Merchant Node"}</h3>
                         <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-[10px] font-black text-swiggy-secondary dark:text-slate-500 uppercase tracking-widest bg-swiggy-bg dark:bg-slate-800 px-3 py-1 rounded-full">ID: #{order.id.substring(0,8).toUpperCase()}</span>
                            <span className="text-[10px] font-black text-swiggy-secondary dark:text-slate-500 uppercase tracking-widest bg-swiggy-bg dark:bg-slate-800 px-3 py-1 rounded-full">{new Date(order.createdAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                      <Badge status={status} />
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] mb-0.5">Payload Value</span>
                         <span className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter italic leading-none">₹{order.totalAmount || order.total_price}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-swiggy-bg dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between relative z-10">
                   <div className="flex gap-3 overflow-x-auto custom-scroll pb-2 max-w-full md:max-w-[60%]">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="whitespace-nowrap text-[9px] font-black text-swiggy-secondary dark:text-slate-500 uppercase tracking-widest bg-swiggy-bg/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-swiggy-bg dark:border-slate-700/50">{item.quantity}x {item.menuItem?.name || item.name}</span>
                      ))}
                   </div>
                   
                   <div className="flex gap-4 items-center ml-auto">
                      {status === 'DELIVERED' && !order.rating && (
                        <Button size="sm" onClick={() => setShowRating(order.id)}>🌟 Provide Feedback</Button>
                      )}
                      <Link to="/order-tracking" state={{ orderId: order.id }}>
                         <button className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest hover:text-swiggy-primary transition-colors flex items-center gap-2">Details —&gt;</button>
                      </Link>
                   </div>
                </div>

                {/* Feedback Overlay */}
                {showRating === order.id && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-swiggy-heading/95 backdrop-blur-md z-[100] p-10 flex flex-col justify-center items-center animate-fade-in">
                     <button onClick={() => { setShowRating(null); setRating(5); setReview(""); }} className="absolute top-10 right-10 text-swiggy-secondary hover:text-swiggy-primary transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                     
                     <div className="text-center mb-10">
                        <h4 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter italic uppercase">Mission <span className="text-swiggy-primary">Feedback</span></h4>
                        <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest mt-1">Calibrate future deployments</p>
                     </div>
                     
                     <div className="flex gap-4 mb-10">
                       {[1, 2, 3, 4, 5].map(num => (
                         <button key={num} onClick={() => setRating(num)} className={`w-14 h-14 rounded-3xl text-2xl transition-all ${rating >= num ? 'bg-swiggy-primary text-white shadow-xl shadow-swiggy-primary/30 scale-110' : 'bg-swiggy-bg dark:bg-slate-800 text-swiggy-secondary opacity-40 hover:opacity-100'}`}>★</button>
                       ))}
                     </div>

                     <textarea 
                       placeholder="Enter operational feedback packet..." 
                       className="w-full max-w-md bg-swiggy-bg dark:bg-slate-800 border-none rounded-[32px] p-6 mb-8 focus:ring-2 focus:ring-swiggy-primary/20 outline-none font-bold text-swiggy-heading dark:text-white text-sm"
                       rows="3" value={review} onChange={(e) => setReview(e.target.value)}
                     />

                     <Button className="w-full max-w-sm h-16 text-xs" onClick={() => submitRating(order.id)}>Synchronize Telemetry</Button>
                  </div>
                )}
              </Card>
             );
          })}
        </div>
      )}
    </div>
  );
}
