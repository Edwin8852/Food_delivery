import React from 'react';

export default function OrderCard({ order, onAction }) {
  const statusColors = {
    'PLACED': 'bg-blue-100 text-blue-700',
    'ACCEPTED': 'bg-orange-100 text-orange-700 font-bold',
    'IN_KITCHEN': 'bg-yellow-100 text-yellow-700 font-bold',
    'READY': 'bg-green-100 text-green-700 font-bold',
    'OUT_FOR_DELIVERY': 'bg-purple-100 text-purple-700 font-bold',
    'DELIVERED': 'bg-gray-100 text-gray-700 font-bold',
    'Pending': 'bg-gray-50 text-gray-500'
  };

  const actionButtons = [];
  const currentStatus = order.orderStatus || 'Pending';

  if (currentStatus === 'Pending' || currentStatus === 'PLACED') {
    actionButtons.push({ label: 'Accept Order', action: 'accept', color: 'bg-orange-500 hover:bg-orange-600' });
  } else if (currentStatus === 'ACCEPTED') {
    actionButtons.push({ label: 'Send to Kitchen', action: 'kitchen', color: 'bg-yellow-500 hover:bg-yellow-600' });
  } else if (currentStatus === 'IN_KITCHEN') {
    actionButtons.push({ label: 'Mark Ready', action: 'ready', color: 'bg-green-500 hover:bg-green-600' });
  } else if (currentStatus === 'READY') {
    actionButtons.push({ label: 'Assign Delivery', action: 'delivery', color: 'bg-purple-500 hover:bg-purple-600' });
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</h3>
          <p className="text-lg font-black text-gray-900 group-hover:text-orange-500 transition-colors">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[currentStatus] || 'bg-gray-50 text-gray-500'}`}>
          {currentStatus.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</h4>
        <div className="space-y-3">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-800">{item.name || item.menuItem?.name || "Item"} × {item.quantity}</span>
              <span className="text-[10px] font-black bg-gray-50 px-2 py-1 rounded text-gray-400">{item.code || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Bill</span>
          <span className="text-lg font-black text-gray-900 tracking-tight">₹{order.totalAmount}</span>
        </div>

        {actionButtons.map((btn) => (
          <button
            key={btn.action}
            onClick={() => onAction(order.id, btn.action)}
            className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg ${btn.color} transition-all active:scale-95`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
