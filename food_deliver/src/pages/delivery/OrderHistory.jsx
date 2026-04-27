import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/delivery/history");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching live history", err);
      toast.error("Failed to sync history with backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-40">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-fade-in pb-40">
      <div className="flex justify-between items-center mb-10 px-2">
         <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Mission History</h2>
         <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
           {orders.length} Completed
         </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border border-gray-50 p-10">
           <div className="text-6xl mb-6 opacity-10 grayscale">🏁</div>
           <h3 className="text-xl font-black text-gray-300 tracking-tight">The record is clear</h3>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Start your first mission to build history</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex justify-between items-center group hover:shadow-xl hover:scale-[1.02] transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-black text-xl group-hover:rotate-12 transition-transform">✓</div>
                 <div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Mission #{order.id.substring(0,8)}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                 </div>
              </div>
              
              <div className="text-right">
                 <p className="text-xl font-black text-green-600">+₹{parseFloat(order.totalAmount || 0).toFixed(2)}</p>
                 <span className="bg-green-50 text-green-500 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">SETTLED</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 p-8 bg-gray-900 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
         <div className="flex justify-between items-start mb-8">
            <h4 className="text-xl font-black italic tracking-tight">Performance Summary</h4>
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest border border-orange-500/30 px-3 py-1 rounded-full">Weekly Report</span>
         </div>
         
         <div className="flex gap-10">
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Lifetime Gross</p>
               <p className="text-3xl font-black text-white">₹{(orders.reduce((acc, o) => acc + parseFloat(o.totalAmount || 0), 0)).toLocaleString()}</p>
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Average Payout</p>
               <p className="text-3xl font-black text-green-400">
                  ₹{orders.length ? (orders.reduce((acc, o) => acc + parseFloat(o.totalAmount || 0), 0) / orders.length).toFixed(0) : "0"}
               </p>
            </div>
         </div>
         
         <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 transform rotate-12">🏁</div>
      </div>
    </div>
  );
}
