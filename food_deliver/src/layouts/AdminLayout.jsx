import React, { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Operations', path: '/admin/dashboard', icon: 'M13 10V3L4 14h7v7l9-11h-7z', sub: true },

    { name: 'Analytics', path: '/admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Order Fulfillment', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Driver Management', path: '/admin/drivers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Menu & Catalog', path: '/admin/menu', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Promotions', path: '/admin/promotions', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans">
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff5200] rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-[0_8px_20px_-6px_rgba(255,82,0,0.5)]">!</div>
            <h1 className="text-xl font-[1000] tracking-tighter text-slate-800 uppercase italic">Op<span className="text-[#ff5200]">Com</span></h1>
          </Link>

          <div className="hidden lg:flex items-center gap-6 ml-8 border-l border-slate-200 pl-8">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Real Time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">HQ / SYNCED</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-12 hidden md:block">
           <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-300 group-focus-within:text-orange-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search operational logs..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-500 placeholder:text-slate-300 focus:ring-4 focus:ring-orange-500/5 focus:bg-white transition-all outline-none"
              />
           </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#ff5200] transition-colors relative">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff5200] border-[3px] border-white rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
             <div className="flex flex-col items-end">
               <span className="text-[11px] font-[1000] text-slate-800 tracking-tighter uppercase whitespace-nowrap">Super Admin</span>
               <span className="text-[9px] font-black text-slate-400 tracking-[0.15em] uppercase whitespace-nowrap">System Level Auth</span>
             </div>
             <div className="w-10 h-10 bg-slate-900 rounded-[12px] flex items-center justify-center text-white font-black text-sm shadow-xl">S</div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR --- */}
      <aside className={`fixed top-20 left-0 bottom-0 bg-white border-r border-slate-200 transition-all duration-300 z-40 overflow-y-auto
        ${isSidebarOpen ? 'w-72 shadow-xl shadow-slate-200/50' : 'w-0 lg:w-20'} 
        ${!isSidebarOpen && 'lg:block hidden'}`}
      >
        <div className="p-6 flex flex-col h-full">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.name === 'Operations' && <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 px-4">Operations</p>}
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all group mb-1
                    ${isActive 
                      ? 'bg-orange-50/50 text-[#ff5200] border border-orange-100/50' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 transition-transform group-hover:scale-110`}>
                       <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                    </div>
                    <span className={`text-[13px] tracking-tight whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                       {item.name}
                    </span>
                  </div>
                  {item.sub && <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
                  {item.name === 'Analytics' && <div className="w-1.5 h-1.5 bg-[#ff5200] rounded-full"></div>}
                </NavLink>
              </div>
            ))}
          </nav>

          <div className="pt-6 mt-auto border-t border-slate-100 flex flex-col gap-2">
             <NavLink to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-slate-400 font-black tracking-tight hover:text-slate-900 transition-colors group">
                <svg className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:rotate-45 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                <div className="flex flex-col">
                  <span className="text-xs">System Settings</span>
                  <span className="text-[9px] text-slate-400 font-bold opacity-0 group-hover:opacity-100">System Settings</span>
                </div>
             </NavLink>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`transition-all duration-300 pt-20 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
