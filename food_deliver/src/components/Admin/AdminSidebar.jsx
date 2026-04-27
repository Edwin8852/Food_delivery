import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/admin/dashboard', label: 'Overview', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )},
  { path: '/admin/orders', label: 'Monitor Grid', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { path: '/admin/kitchen', label: 'Kitchen Hub', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
  )},
  { path: '/admin/menu', label: 'Catalog', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
  )},
  { path: '/admin/drivers', label: 'Fleet Grid', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  )},
  { path: '/admin/settings', label: 'Global Config', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
];

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#282C3F] text-white z-50 flex flex-col p-8 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Swiggy-inspired Brand */}
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-12 h-12 bg-[#FC8019] rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-[#FC8019]/20 italic font-black">
            F
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white flex flex-col leading-none">
              Foodie <span className="text-[#FC8019]">Express</span>
            </h1>
            <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase mt-1">Admin Dashboard</span>
          </div>
        </div>

        {/* Tactical Nav */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scroll pr-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'bg-[#FC8019] text-white shadow-lg shadow-[#FC8019]/30' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/20" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="mt-8 pt-8 border-t border-slate-800">
           <div className="flex items-center gap-3 opacity-40">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Grid Instance Live</p>
           </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </>
  );
}
