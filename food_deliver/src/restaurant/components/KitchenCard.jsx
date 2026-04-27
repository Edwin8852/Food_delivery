import React from 'react';

export default function KitchenCard({ order, onReady }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 transition-all hover:bg-white hover:shadow-lg group">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Order ID</h3>
        <p className="text-xl font-black text-gray-900 leading-none">#{order.id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex flex-col gap-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 group/item">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-800 border-2 border-transparent group-hover/item:border-orange-500 transition-colors">
                {item.quantity}
              </div>
              <div className="flex-1">
                <p className="text-3xl font-black text-gray-800 tracking-tight leading-none mb-1 uppercase italic">{item.code || '???'}</p>
                <p className="text-xs font-bold text-gray-400 truncate max-w-[150px]">{item.name || item.menuItem?.name || 'Item'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onReady(order.id)}
        className="w-full py-4 bg-orange-600 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg group-hover:bg-orange-700"
      >
        Mark Ready
      </button>
    </div>
  );
}
