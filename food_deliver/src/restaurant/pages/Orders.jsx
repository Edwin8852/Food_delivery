import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import OrderCard from '../components/OrderCard';
import { toast } from 'react-toastify';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/restaurants/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
      toast.error("Failed to load restaurant orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId, action) => {
    let endpoint = '';
    if (action === 'accept') endpoint = `/restaurants/orders/${orderId}/accept`;
    else if (action === 'kitchen') endpoint = `/restaurants/orders/${orderId}/kitchen`;
    else if (action === 'ready') endpoint = `/restaurants/orders/${orderId}/ready`;
    else if (action === 'delivery') {
      // For assignment, we usually need a partner ID, but for simplicity we'll just move it along
      // or redirect to delivery page
      toast.info("Proceeding to delivery assignment...");
      return; 
    }

    try {
      const response = await api.patch(endpoint);
      if (response.data.success) {
        toast.success(`Order ${action === 'accept' ? 'ACCEPTED' : action.toUpperCase()}!`);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const filteredOrders = orders.filter(o => !['DELIVERED', 'Delivered'].includes(o.orderStatus));

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Live Orders</h2>
          <p className="text-gray-500 font-medium">Manage and process active customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-orange-100 text-orange-600 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-200 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-40 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
             <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
             </svg>
          </div>
          <h3 className="text-xl font-black text-gray-800">No active orders found</h3>
          <p className="text-gray-400 font-medium max-w-xs mt-3">Orders will appear here as soon as customers place them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
}
