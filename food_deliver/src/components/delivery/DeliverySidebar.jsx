import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/delivery/dashboard', label: 'Mission Grid', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  )},
  { path: '/delivery/orders', label: 'Directives', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  )},
  { path: '/delivery/earnings', label: 'Capital Hub', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { path: '/delivery/history', label: 'Past Cycles', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
];

export default function DeliverySidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#282C3F] text-white z-50 flex flex-col p-8 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Pilot Branding */}
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 bg-[#FC8019] rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-[#FC8019]/20 italic font-black">
            F
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white flex flex-col leading-none">
              Foodie <span className="text-[#FC8019]">Express</span>
            </h1>
            <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase mt-1">Pilot Interface</span>
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
                    ? 'bg-white text-[#282C3F]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'scale-110 text-[#FC8019]' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#FC8019]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Session Control */}
        <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
           <button 
             onClick={handleLogout}
             className="w-full h-14 flex items-center justify-center gap-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-[#FF5252]/10 hover:text-[#FF5252] hover:border-[#FF5252]/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-transparent group"
           >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Terminate Shift</span>
           </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

    </>
  );
}
