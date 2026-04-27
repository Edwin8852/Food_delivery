import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Delivery() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [partners, setPartners] = useState([
    { id: '1', name: 'Ramesh Kumar', phone: '9876543210', isAvailable: true },
    { id: '2', name: 'Suresh Raina', phone: '0123456789', isAvailable: true },
    { id: '3', name: 'MS Dhoni', phone: '7777777777', isAvailable: false },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchReadyOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/restaurants/orders');
      if (response.data.success) {
        const ready = response.data.data.filter(o => o.orderStatus === 'READY');
        setReadyOrders(ready);
      }
    } catch (err) {
      console.error("Delivery orders fetch error:", err);
      toast.error("Failed to load delivery queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadyOrders();
  }, []);

  const handleAssign = async (orderId, partnerId) => {
    try {
      const response = await api.post(`/restaurants/orders/${orderId}/assign-delivery`, { deliveryPartnerId: partnerId });
      if (response.data.success) {
        toast.success("Delivery assigned successfully!");
        fetchReadyOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Delivery Management</h2>
        <p className="text-gray-500 font-medium tracking-tight">Assign ready orders to active delivery partners</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left column: Ready Orders */}
        <div className="flex-1 space-y-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             READY TO DISPATCH
             <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]">{readyOrders.length}</span>
          </h3>

          {loading ? (
             <div className="bg-white p-20 rounded-3xl border border-gray-100 flex justify-center shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
             </div>
          ) : readyOrders.length === 0 ? (
             <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                   </svg>
                </div>
                <h4 className="text-gray-800 font-bold uppercase tracking-widest text-sm">Waiting for Kitchen</h4>
                <p className="text-gray-400 text-xs mt-1 font-medium">Orders will appear here once marked as READY.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {readyOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <div>
                       <p className="text-lg font-black text-gray-900 leading-none mb-1 uppercase italic tracking-tight tracking-widest italic tracking-tighter">ORDER #{order.id.slice(-8).toUpperCase()}</p>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items?.length || 0} TOTAL ITEMS</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                       className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all flex-1 md:w-48 appearance-none cursor-pointer"
                       defaultValue=""
                       onChange={(e) => handleAssign(order.id, e.target.value)}
                    >
                      <option value="" disabled>Select Delivery Partner</option>
                      {partners.filter(p => p.isAvailable).map(partner => (
                        <option key={partner.id} value={partner.id}>{partner.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Delivery Partners */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
             ACTIVE PARTNERS
          </h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            {partners.map(partner => (
               <div key={partner.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 ${partner.isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'} rounded-xl flex items-center justify-center text-sm font-black`}>
                        {partner.name[0]}
                     </div>
                     <div>
                        <p className="text-sm font-black text-gray-800 leading-none mb-1 group-hover:text-orange-500 transition-colors uppercase italic tracking-tight tracking-widest italic tracking-tighter">{partner.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${partner.isAvailable ? 'text-green-500' : 'text-gray-400'}`}>
                           {partner.isAvailable ? 'READY' : 'BUSY'}
                        </p>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
