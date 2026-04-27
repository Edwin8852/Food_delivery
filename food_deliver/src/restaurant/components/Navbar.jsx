import React from 'react';

export default function Navbar() {
  const adminName = "Arun (Admin)"; // Hardcoded for now

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
          <span>Admin Panel</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-gray-800">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-xs font-black text-gray-900 uppercase tracking-wider">{adminName}</p>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
