import React from 'react';
import { useAuth } from '../context/AuthContext';
import DeliveryAddress from '../components/DeliveryAddress';
import { Card, Badge } from '../components/ui';

export default function UserProfile() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-fade-in pb-32">
      
      {/* 👤 Identity Hub Header */}
      <div className="mb-16 border-b border-gray-100 dark:border-slate-800 pb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
          <div className="w-32 h-32 bg-swiggy-primary rounded-[40px] flex items-center justify-center text-6xl shadow-2xl shadow-swiggy-primary/30 text-white font-black italic relative group">
            {user?.name?.charAt(0).toUpperCase() || '👤'}
            <div className="absolute inset-0 border-4 border-white/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-center md:text-left flex-1">
             <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h1 className="text-6xl font-black text-swiggy-heading dark:text-white tracking-[ -0.04em] uppercase italic leading-none">{user?.name}</h1>
                <Badge status="VERIFIED" className="scale-125" />
             </div>
             <p className="text-swiggy-primary font-black uppercase tracking-[0.4em] text-[10px] italic">Authenticated System Node — Identity Sequence Verified</p>
          </div>
        </div>

        {/* 📊 Tactical Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="flex flex-col gap-2 group hover:shadow-xl transition-all">
             <p className="text-swiggy-secondary text-[9px] font-black uppercase tracking-[0.3em] mb-1">Transmission Address</p>
             <p className="font-black text-swiggy-heading dark:text-white text-lg tracking-tight group-hover:text-swiggy-primary transition-colors">{user?.email}</p>
          </Card>
          <Card className="flex flex-col gap-2 group hover:shadow-xl transition-all">
             <p className="text-swiggy-secondary text-[9px] font-black uppercase tracking-[0.3em] mb-1">Secure Contact Terminal</p>
             <p className="font-black text-swiggy-heading dark:text-white text-lg tracking-tight group-hover:text-swiggy-primary transition-colors">{user?.phone || 'Coordinate Link Pending'}</p>
          </Card>
          <Card className="flex flex-col gap-2 group hover:shadow-xl transition-all">
             <p className="text-swiggy-secondary text-[9px] font-black uppercase tracking-[0.3em] mb-1">Node Initialization Date</p>
             <p className="font-black text-swiggy-heading dark:text-white text-lg tracking-tight group-hover:text-swiggy-primary transition-colors">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Command'}</p>
          </Card>
        </div>
      </div>

      {/* 📍 Logistics Infrastructure Section */}
      <div className="w-full">
        <DeliveryAddress />
      </div>

    </div>
  );
}
