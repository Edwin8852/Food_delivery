import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CartAddressSelector = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showFullList, setShowFullList] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/address/user');
      const data = res.data.data;
      
      // Filter for Default and Last Used
      const sorted = [...data].sort((a, b) => new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0));
      const lastUsed = sorted[0];
      const defaultAddr = data.find(a => a.is_default || a.isDefault);
      
      const filtered = data.filter(a => (a.is_default || a.isDefault) || a.id === lastUsed?.id);
      
      // Remove duplicates
      const unique = Array.from(new Set(filtered.map(a => a.id))).map(id => filtered.find(a => a.id === id));
      
      setAddresses(unique);
      
      const initial = defaultAddr || lastUsed;
      if (initial) {
        setSelectedId(initial.id);
        onSelect(initial);
      }
    } catch (error) {
       console.error('Cart Address Error:', error);
    }
  };

  const handleSelect = (addr) => {
    setSelectedId(addr.id);
    onSelect(addr);
    setShowFullList(false);
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-100 border border-gray-50 flex flex-col gap-6 animate-fade-in group">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Delivery manifest</h3>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1">Verification Required</p>
            </div>
            <button 
                onClick={() => setShowFullList(true)}
                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
            >
                Change Address
            </button>
        </div>

        <div className="space-y-4">
            {addresses.map(addr => (
                <div 
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden flex items-center gap-6 ${selectedId === addr.id ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100' : 'border-gray-50 hover:bg-gray-50'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${selectedId === addr.id ? 'bg-white border-orange-100 text-orange-500' : 'bg-white border-gray-100 text-gray-300'}`}>
                        {addr.is_default || addr.isDefault ? '🏠' : '📍'}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">
                              {addr.is_default || addr.isDefault ? 'Default' : 'Recently Used'}
                           </h4>
                        </div>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed truncate w-48 italic">
                           {addr.address}
                        </p>
                    </div>

                    {selectedId === addr.id && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
                           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Change Address Modal */}
        {showFullList && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-gray-900/40">
                <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl p-10 animate-scale-in relative">
                    <button 
                        onClick={() => setShowFullList(false)}
                        className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="mb-10 text-center">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Search coordinates</h3>
                        <p className="text-gray-400 font-bold mt-1 tracking-widest uppercase text-[9px]">All Registered Locations</p>
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide mb-8">
                       <p className="text-center text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse italic">Connecting to manifest terminal...</p>
                       {/* This could be another API call or just passing full data */}
                       <div className="bg-gray-50 p-10 rounded-[32px] text-center border-2 border-dashed border-gray-200">
                          <p className="text-gray-400 font-bold italic">Full list access restricted to Profile terminal.</p>
                          <a href="/profile" className="mt-4 inline-block bg-gray-900 text-white font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest">Manage All</a>
                       </div>
                    </div>
                </div>
            </div>
        )}

        <style>{`
            @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
    </div>
  );
};

export default CartAddressSelector;
