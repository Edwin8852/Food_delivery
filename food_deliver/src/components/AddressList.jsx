import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/address/user');
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (error) {
      console.error('Fetch Address Error:', error);
      toast.error(error.response?.data?.message || 'Failed to sync location manifesto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Stored Coordinates</h2>
        <p className="text-gray-400 font-bold mt-1 tracking-widest uppercase text-[10px]">Verified Delivery Nodes</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`bg-white rounded-[32px] p-8 shadow-xl shadow-gray-100 border transition-all relative overflow-hidden group ${addr.is_default ? 'border-orange-500 ring-4 ring-orange-500/5' : 'border-gray-50'}`}
              >
                {addr.is_default && (
                  <span className="absolute top-6 right-8 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Default</span>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-orange-50 transition-colors">
                    📍
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">{addr.full_name}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{addr.mobile}</p>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                    {addr.address}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                   <div className="flex flex-col">
                     <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">LAT / LNG Matrix</span>
                     <span className="text-[10px] font-mono font-bold text-gray-400 tabular-nums">
                        {addr.latitude.toFixed(4)}° / {addr.longitude.toFixed(4)}°
                     </span>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-gray-50 rounded-[40px] p-24 text-center border-2 border-dashed border-gray-200">
               <span className="text-6xl block mb-6 grayscale opacity-20">📡</span>
               <h4 className="text-2xl font-black text-gray-300 uppercase tracking-tight text-center">No Delivery Manifest Found</h4>
               <p className="text-gray-400 font-bold mt-2">Add your first address to begin operations</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AddressList;
