import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { Card, Button } from '../../components/ui';

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    can_accept: true,
    can_pickup: true,
    can_deliver: true,
    max_active_orders: 3,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.success) setSettings(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch operational parameters");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', { ...settings, theme });
      toast.success("Grid configuration updated successfully", { icon: '⚙️' });
    } catch (err) {
      toast.error("Handshake fail: Operational desync");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-40 gap-6">
        <div className="w-16 h-16 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
        <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] animate-pulse">Syncing System Config...</span>
     </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-fade-in">
      
      {/* ⚙️ Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-10 px-2">
         <div className="space-y-1">
            <h2 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">System <span className="text-swiggy-primary">Config</span></h2>
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-ping" />
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">Operational Environment: Live Grid V4.0</p>
            </div>
         </div>
         <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Synchronizing...' : 'Commit Changes'}
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* 🛰️ Logistics Control Terminal */}
         <Card className="space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
            
            <div>
               <h3 className="text-2xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic mb-2">Logistics Control</h3>
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-relaxed">Manage global pilot permissions and operational grid limits.</p>
            </div>

            <div className="space-y-10">
               {/* Toggle Set */}
               {[
                 { key: 'can_accept', label: 'Allow Dispatch Acceptance', desc: 'Enable/Disable the "Accept Order" capability for nodes.' },
                 { key: 'can_pickup', label: 'Allow Pickup Execution', desc: 'Controls the "Mark as Picked Up" action at terminals.' },
                 { key: 'can_deliver', label: 'Allow Mission Completion', desc: 'Controls final "Mark as Delivered" confirmation cycles.' },
               ].map((item) => (
                 <div key={item.key} className="flex items-center justify-between group">
                    <div className="space-y-1">
                       <p className="text-[11px] font-black text-swiggy-heading dark:text-slate-200 uppercase tracking-tight group-hover:text-swiggy-primary transition-colors">{item.label}</p>
                       <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest opacity-60">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleToggle(item.key)}
                      className={`w-14 h-8 rounded-full relative transition-all duration-500 ${settings[item.key] ? 'bg-swiggy-primary shadow-[0_0_15px_rgba(252,128,25,0.4)]' : 'bg-swiggy-bg dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-sm ${settings[item.key] ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>
               ))}

               {/* Payload Range */}
               <div className="pt-10 border-t border-swiggy-bg dark:border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                     <p className="text-[11px] font-black text-swiggy-heading dark:text-slate-200 uppercase tracking-tight">Max Concurrent Missions</p>
                     <span className="text-2xl font-black text-swiggy-primary italic tracking-tighter">{settings.max_active_orders} Units</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={settings.max_active_orders}
                    onChange={(e) => setSettings(prev => ({ ...prev, max_active_orders: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-swiggy-bg dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-swiggy-primary transition-all"
                  />
                  <div className="flex justify-between text-[8px] font-black text-swiggy-secondary uppercase tracking-widest px-1 opacity-50">
                     <span>1 Order</span>
                     <span>Optimal Balance</span>
                     <span>10 Orders</span>
                  </div>
               </div>
            </div>
         </Card>

         {/* 🎨 Visual Engine Terminal */}
         <Card className="space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-secondary/5 rounded-full -mr-16 -mt-16" />
            
            <div>
               <h3 className="text-2xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic mb-2">Visual Engine</h3>
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-relaxed">Customize the terminal interface for specific operational focuses.</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <button 
                 onClick={() => theme === 'dark' && toggleTheme()}
                 className={`p-12 rounded-[40px] border-2 transition-all flex flex-col items-center gap-6 group ${theme === 'light' ? 'border-swiggy-primary bg-swiggy-primary/5 shadow-xl' : 'border-swiggy-bg dark:border-slate-800 bg-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
               >
                  <span className="text-5xl group-hover:scale-110 transition-transform">☀️</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-swiggy-heading dark:text-white">Solar Flare</p>
               </button>

               <button 
                 onClick={() => theme === 'light' && toggleTheme()}
                 className={`p-12 rounded-[40px] border-2 transition-all flex flex-col items-center gap-6 group ${theme === 'dark' ? 'border-swiggy-primary bg-swiggy-primary/5 shadow-xl' : 'border-swiggy-bg dark:border-slate-800 bg-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
               >
                  <span className="text-5xl group-hover:scale-110 transition-transform">🌑</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-swiggy-heading dark:text-white">Deep Space</p>
               </button>
            </div>

            <Card border className="bg-swiggy-bg dark:bg-slate-800/30 p-8">
               <p className="text-[10px] font-black text-swiggy-secondary dark:text-slate-400 uppercase leading-relaxed text-center italic tracking-widest">
                  Visual theme synchronization is active. Protocol 0x4F enabled.
               </p>
            </Card>
         </Card>
      </div>

    </div>
  );
}
