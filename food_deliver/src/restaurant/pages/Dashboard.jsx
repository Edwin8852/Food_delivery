import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    cancelledOrders: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/restaurants/orders'); // Reusing the admin orders to count
        if (response.data.success) {
          const orders = response.data.data;
          const active = orders.filter(o => !['DELIVERED', 'Delivered', 'Cancelled'].includes(o.orderStatus)).length;
          const revenue = orders.reduce((acc, o) => acc + parseFloat(o.totalAmount || 0), 0);
          
          setStats({
            totalOrders: orders.length,
            activeOrders: active,
            totalRevenue: revenue,
            cancelledOrders: 0 // Mocked for now
          });
        }
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Active Orders', value: stats.activeOrders, color: 'bg-orange-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'bg-green-500', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Cancelled', value: stats.cancelledOrders, color: 'bg-red-500', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Dashboard Overview</h2>
        <p className="text-gray-500 font-medium">Real-time performance metrics of your restaurant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md group">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6">Order Activity</h3>
          <div className="space-y-6">
             <p className="text-gray-400 italic font-medium">Chart visualization coming soon...</p>
             {/* Placeholder for chart integration */}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6">Top Selling Items</h3>
          <div className="space-y-6">
             <p className="text-gray-400 italic font-medium">Data analytics integration in progress...</p>
             {/* Placeholder for top items */}
          </div>
        </div>
      </div>
    </div>
  );
}
