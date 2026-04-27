import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryNavbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-[#E9E9EB] dark:border-slate-800 z-40 transition-all duration-300">
      <div className="h-full flex items-center justify-between px-10">
        
        {/* Left: Mobile Toggle */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden w-11 h-11 flex items-center justify-center bg-[#F8F8F8] dark:bg-slate-800 rounded-2xl text-[#282C3F] dark:text-slate-400 active:scale-90 transition-all border border-[#E9E9EB] dark:border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          
          <div className="hidden md:flex flex-col">
            <h2 className="text-[9px] font-black text-[#686B78] uppercase tracking-[0.2em] mb-1">Node Context</h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#60B246] shadow-[0_0_8px_rgba(96,178,70,0.4)]" />
               <span className="text-[10px] font-black text-[#282C3F] dark:text-slate-300 uppercase tracking-tight">Active Logistic Node</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 pr-6 border-r border-[#E9E9EB] dark:border-slate-800">
            <Link to="/delivery/tracking" className="flex items-center gap-3 text-[#686B78] hover:text-[#282C3F] dark:hover:text-white transition-all group">
              <svg className="w-5 h-5 group-hover:text-[#FC8019]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-widest">Tracking</span>
            </Link>
            
            <Link to="/delivery/earnings" className="flex items-center gap-3 text-[#686B78] hover:text-[#282C3F] dark:hover:text-white transition-all group">
              <svg className="w-5 h-5 group-hover:text-[#60B246]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-widest">Extraction</span>
            </Link>
          </div>

          {/* Pilot Identity */}
          <div className="flex items-center gap-3 pl-2">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black text-[#282C3F] dark:text-white uppercase tracking-tighter truncate max-w-[120px]">{user?.name || 'Pilot'}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                   <span className="w-1.5 h-1.5 bg-[#FC8019] rounded-full" />
                   <p className="text-[8px] font-black text-[#FC8019] uppercase tracking-widest leading-none">Partner</p>
                </div>
             </div>
             <div className="w-10 h-10 rounded-xl bg-[#282C3F] dark:bg-slate-800 flex items-center justify-center text-white text-[10px] font-black border-2 border-white dark:border-slate-800 shadow-xl">
                {user?.name?.[0]?.toUpperCase() || 'P'}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
