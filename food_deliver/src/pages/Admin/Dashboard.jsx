import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { Card, Badge, Button } from "../../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalDelivered: 0,
    totalRevenue: 0,
    statusCounts: {
      placed: 0, accepted: 0, kitchen: 0, ready: 0, assigned: 0, picked: 0
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const role = user?.role?.toUpperCase();
      if (role !== "ADMIN" && role !== "RESTAURANT_OWNER") {
        setLoading(false);
        return;
      }
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/orders')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data.slice(0, 5));
    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (socket) {
      const handleNewOrder = () => fetchDashboardData();
      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleNewOrder);
      return () => {
        socket.off("order:new", handleNewOrder);
        socket.off("order:update", handleNewOrder);
      };
    }
  }, [socket]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
       <div className="w-12 h-12 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
       <span className="text-swiggy-secondary font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing Grid...</span>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      
      {/* 📊 Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Cumulative Orders', value: stats.totalOrders, icon: '📊', color: '#FC8019' },
          { label: 'Revenue Generated', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: '#60B246' },
          { label: 'Active Payload', value: stats.statusCounts.placed + stats.statusCounts.accepted + stats.statusCounts.kitchen, icon: '🚀', color: '#FFB800' },
          { label: 'Success Rate', value: `${Math.round((stats.totalDelivered / (stats.totalOrders || 1)) * 100)}%`, icon: '🎯', color: '#282C3F', dark: true },
        ].map((kpi, idx) => (
          <Card key={idx} className="relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" style={{ backgroundColor: `${kpi.color}10` }} />
             <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest mb-2">{kpi.label}</p>
             <h3 className="text-4xl font-black text-[#282C3F] dark:text-white tracking-tighter mb-4">{kpi.value}</h3>
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: kpi.color }} />
                <span className="text-[9px] font-black text-[#686B78] uppercase tracking-[0.2em]">Real-time Sync</span>
             </div>
          </Card>
        ))}
      </div>

      {/* 🚀 Operational Grid */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-black text-[#282C3F] dark:text-white tracking-tighter uppercase">Logistics <span className="text-[#FC8019] italic">Command</span></h2>
               <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest mt-1">Live Operational Visibility</p>
            </div>
            <Button size="sm" variant="ghost">View Reports</Button>
         </div>

         <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Incoming', count: stats.statusCounts.placed, status: 'placed' },
              { label: 'Kitchen', count: stats.statusCounts.kitchen, status: 'kitchen' },
              { label: 'Ready', count: stats.statusCounts.ready, status: 'ready' },
              { label: 'Assigned', count: stats.statusCounts.assigned || 0, status: 'assigned' },
              { label: 'On Road', count: stats.statusCounts.picked, status: 'picked_up' },
              { label: 'Success', count: stats.totalDelivered, status: 'delivered' },
            ].map((node, idx) => (
              <Card key={idx} className="group hover:border-[#FC8019]/30 transition-all cursor-pointer" noPadding>
                 <div className="p-6">
                    <h4 className="text-3xl font-black text-[#282C3F] dark:text-white tracking-tighter mb-2">{node.count}</h4>
                    <Badge status={node.status} />
                    <p className="text-[9px] font-black text-[#686B78] uppercase tracking-widest mt-3">{node.label}</p>
                 </div>
              </Card>
            ))}
         </div>
      </div>

      {/* 📥 Live Orders Monitor */}
      <Card noPadding className="shadow-lg border-none">
        <div className="p-8 border-b border-[#F8F8F8] dark:border-slate-800 flex justify-between items-center">
           <h3 className="text-xs font-black text-[#282C3F] dark:text-white uppercase tracking-[0.2em]">Recent Activity Logs</h3>
           <Link to="/admin/orders">
              <Button size="sm" variant="outline">Full Monitor</Button>
           </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
            <tr className="bg-swiggy-bg dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[9px] font-black text-swiggy-secondary uppercase tracking-widest">Descriptor</th>
                <th className="px-8 py-5 text-[9px] font-black text-swiggy-secondary uppercase tracking-widest">Subject</th>
                <th className="px-8 py-5 text-[9px] font-black text-swiggy-secondary uppercase tracking-widest">Protocol</th>
                <th className="px-8 py-5 text-[9px] font-black text-swiggy-secondary uppercase tracking-widest text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-swiggy-bg dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-swiggy-bg dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6 font-black text-swiggy-heading dark:text-white text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-6">
                     <p className="text-xs font-bold text-swiggy-heading dark:text-slate-200">{order.user?.name || 'Guest'}</p>
                     <p className="text-[9px] font-black text-swiggy-secondary uppercase">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                     <Badge status={order.orderStatus} />
                  </td>
                  <td className="px-8 py-6 text-right font-black text-[#FC8019] text-xs">₹{order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
