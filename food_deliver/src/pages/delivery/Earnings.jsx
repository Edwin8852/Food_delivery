import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Card, Button } from "../../components/ui";

export default function Earnings() {
  const [data, setData] = useState({ total: 0, count: 0, today: 0, wallet: 0 });
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      const res = await api.get("/delivery/earnings");
      if (res.data.success) {
        setData({
          total: res.data.total || 0,
          count: res.data.count || 0,
          today: res.data.today || 0,
          wallet: res.data.wallet || 0
        });
      }
    } catch (err) {
      toast.error("Failed to sync wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40">
       <div className="w-12 h-12 border-4 border-[#F8F8F8] border-t-[#FC8019] rounded-full animate-spin"></div>
       <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest mt-4">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-fade-in">
      
      {/* 💳 Extraction Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black text-[#282C3F] dark:text-white tracking-tighter uppercase italic">
          Capital <span className="text-[#FC8019]">Extraction</span>
        </h1>
        <p className="text-[10px] font-black text-[#686B78] uppercase tracking-[0.3em] mt-2">Live Ledger & Yield Synchronizer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Settlement Core */}
        <Card className="relative group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#60B246]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
           <p className="text-[10px] font-black text-[#686B78] uppercase tracking-widest mb-4">Settlable Balance</p>
           <h3 className="text-6xl font-black text-[#282C3F] dark:text-white tracking-tighter flex items-start gap-2">
              <span className="text-2xl text-[#686B78] mt-2 font-bold">₹</span>
              {data.wallet?.toLocaleString() || 0}
           </h3>
           
           <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-[#F8F8F8] dark:bg-slate-800/50 p-6 rounded-3xl border border-[#E9E9EB] dark:border-slate-800">
                 <p className="text-[9px] font-black text-[#686B78] uppercase mb-1">Today's Yield</p>
                 <p className="text-2xl font-black text-[#FC8019] tracking-tight">₹{data.today || 0}</p>
              </div>
              <div className="bg-[#F8F8F8] dark:bg-slate-800/50 p-6 rounded-3xl border border-[#E9E9EB] dark:border-slate-800">
                 <p className="text-[9px] font-black text-[#686B78] uppercase mb-1">Lifetime Stats</p>
                 <p className="text-2xl font-black text-[#282C3F] dark:text-white tracking-tight">{data.count} Missions</p>
              </div>
           </div>
        </Card>

        {/* Transfer Interface */}
        <Card className="bg-[#282C3F] dark:bg-[#1E1E1E] text-white border-none shadow-2xl relative">
           <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-br from-[#FC8019]/20 to-transparent pointer-events-none" />
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">🏦</div>
                 <h4 className="text-xl font-black uppercase italic tracking-tight">Node Payout</h4>
              </div>
              
              <div className="space-y-6 flex-1">
                 <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <span className="text-[#686B78] text-[11px] font-black uppercase tracking-widest">Available Extraction</span>
                    <span className="text-3xl font-black tracking-tighter text-white">₹{data.wallet || 0}</span>
                 </div>
                 
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-bold text-[#686B78] uppercase mb-1">Registered Node</p>
                    <p className="text-xs font-black tracking-[0.2em] opacity-80 uppercase">HDFC BANK - UNPL_09</p>
                 </div>
              </div>

              <Button variant="primary" className="w-full mt-10 h-16">Initialize Instant Payout</Button>
           </div>
        </Card>
      </div>
      
      {/* Protocol Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="flex items-start gap-6 hover:border-[#FC8019]/20 transition-all">
            <span className="text-3xl">📜</span>
            <div>
               <p className="text-[10px] font-black text-[#282C3F] dark:text-white uppercase tracking-widest mb-2 italic">Extraction Grid</p>
               <p className="text-xs font-bold text-[#686B78] leading-relaxed uppercase">
                  Payouts are calculated upon <span className="text-[#282C3F] dark:text-white">Secure Objective Completion</span>. Failed handshakes or purged missions do not contribute to live yield.
               </p>
            </div>
         </Card>
         <Card className="flex items-start gap-6 hover:border-[#60B246]/20 transition-all">
            <span className="text-3xl">🛡️</span>
            <div>
               <p className="text-[10px] font-black text-[#282C3F] dark:text-white uppercase tracking-widest mb-2 italic">Fraud Detection</p>
               <p className="text-xs font-bold text-[#686B78] leading-relaxed uppercase">
                  All extraction cycles are subject to <span className="text-[#60B246]">Protocol Monitoring</span>. Any grid anomalies will lead to immediate asset freezing.
               </p>
            </div>
         </Card>
      </div>

    </div>
  );
}
