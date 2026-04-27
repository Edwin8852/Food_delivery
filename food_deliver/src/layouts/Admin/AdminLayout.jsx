import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🛡️ Global Lifecycle Guard
  const user = JSON.parse(sessionStorage.getItem('user'));
  const adminRoles = ['ADMIN', 'RESTAURANT_OWNER'];
  const userRole = user?.role?.toUpperCase();

  if (!user || !adminRoles.includes(userRole)) {
    console.warn("🚨 [Critical Sentinel] Unauthorized access to Admin Layout blocked.");
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#121212] flex items-start font-sans transition-colors duration-500">
      
      {/* Dynamic Navigation */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Operational Interface */}
      <div className="flex-1 min-w-0 transition-all duration-500 lg:ml-72">
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Rendering Content */}
        <main className="p-8 mt-20 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
           <div className="animate-fade-in py-10">
              <Outlet />
           </div>
        </main>
        
        {/* Footer Section */}
        <footer className="border-t border-slate-100 py-10 px-8 flex justify-between items-center text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
           <span>Kitchen Instance 24.1.2</span>
           <span className="text-slate-200">/</span>
           <span>Powered by Kitchen Intelligence</span>
           <span className="text-slate-200">/</span>
           <div className="flex gap-4">
              <span className="text-orange-500 cursor-pointer hover:underline">SLA Status</span>
              <span className="cursor-pointer hover:underline">Security</span>
           </div>
        </footer>
      </div>

      {/* Global CSS Inject for Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 0); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(-2px, 0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-shake { animation: shake 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
