import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DeliverySidebar from '../../components/delivery/DeliverySidebar';
import DeliveryNavbar from '../../components/delivery/DeliveryNavbar';
import LocationTracker from '../../components/delivery/LocationTracker';

export default function DeliveryLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#121212] flex font-sans transition-colors duration-500">
      <LocationTracker />
      
      {/* 🧭 Dynamic Navigation */}
      <DeliverySidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-72 transition-all duration-500">
        <DeliveryNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* 🏔️ Core Interface */}
        <main className="mt-20 p-8 min-h-[calc(100vh-80px)] overflow-x-hidden">
          <div className="animate-fade-in py-6">
            <Outlet />
          </div>
        </main>

        {/* 🏢 Operational Footer */}
        <footer className="border-t border-slate-100 py-10 px-8 flex justify-between items-center text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
           <span>Logistic Instance P-4.2.0</span>
           <span className="text-slate-200">/</span>
           <span>Fleet Grid Synchronized</span>
           <span className="text-slate-200">/</span>
           <div className="flex gap-4">
              <span className="text-orange-500 cursor-pointer hover:underline">Support</span>
              <span className="cursor-pointer hover:underline">Guidelines</span>
           </div>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
