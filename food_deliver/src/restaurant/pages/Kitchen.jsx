import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import KitchenCard from '../components/KitchenCard';
import { toast } from 'react-toastify';

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKitchenOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/restaurants/orders');
      if (response.data.success) {
        // Only show orders currently in kitchen status
        const inKitchen = response.data.data.filter(o => o.orderStatus === 'IN_KITCHEN');
        setOrders(inKitchen);
      }
    } catch (err) {
      console.error("Kitchen fetch error:", err);
      toast.error("Failed to load kitchen dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  const handleMarkReady = async (orderId) => {
    try {
      const response = await api.patch(`/restaurants/orders/${orderId}/ready`);
      if (response.data.success) {
        toast.success("Order is READY for pickup!");
        fetchKitchenOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase italic tracking-widest">Kitchen View</h2>
          <p className="text-gray-500 font-medium tracking-tight">Active preparation queue - focus on codes and quantity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest min-w-[100px] text-center">
            {orders.length} ACTIVE
          </div>
          <button 
            onClick={fetchKitchenOrders}
            className="bg-black text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
          >
            Update Queue
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-40 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
             </svg>
          </div>
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Kitchen is cold</h3>
          <p className="text-gray-400 font-medium max-w-xs mt-3 uppercase tracking-tight text-xs tracking-widest">Wait for incoming orders to be sent here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {orders.map(order => (
            <KitchenCard key={order.id} order={order} onReady={handleMarkReady} />
          ))}
        </div>
      )}
    </div>
  );
}
