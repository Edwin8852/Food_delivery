import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { Card, Button } from "../../components/ui";

export default function LiveFeed() {
  const [logs, setLogs] = useState([]);
  const socket = useSocket();
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (socket) {
      const addLog = (msg, type = "info") => {
        const newLog = {
          id: Date.now(),
          message: msg,
          type: type,
          timestamp: new Date().toLocaleTimeString()
        };
        setLogs(prev => [newLog, ...prev].slice(0, 100));
      };

      const handleNewOrder = (order) => {
        addLog(`🚀 NEW ORDER RECEIVED: #${order.id.slice(-6).toUpperCase()} - ₹${order.totalAmount}`, "success");
      };

      const handleStatusUpdate = (data) => {
        const { orderId, status } = data;
        addLog(`⚡ STATUS UPDATE: #${orderId.slice(-6).toUpperCase()} is now ${status.replace(/_/g, ' ')}`, "warn");
      };

      socket.on("order:new", handleNewOrder);
      socket.on("order:update", handleStatusUpdate);

      addLog("📡 SYSTEM: Live Terminal Synchronized", "system");

      return () => {
        socket.off("order:new", handleNewOrder);
        socket.off("order:update", handleStatusUpdate);
      };
    }
  }, [socket]);

  return (
    <div className="animate-fade-in space-y-8 pb-10 h-[calc(100vh-120px)] flex flex-col">
      
      {/* 🚀 Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 flex-none">
         <div>
            <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Operational <span className="text-swiggy-primary">Live Feed</span></h2>
            <div className="flex items-center gap-3 mt-1">
               <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-pulse" />
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-none">Terminal 01: Global Transmission Stream Active</p>
            </div>
         </div>
         <Button variant="ghost" size="sm" onClick={() => setLogs([])}>Clear Buffer</Button>
      </div>

      {/* 💻 Terminal Interface */}
      <div className="flex-1 bg-swiggy-heading dark:bg-[#0e1421] rounded-[48px] shadow-2xl overflow-hidden border border-white/[0.05] relative flex flex-col">
         <div className="h-14 bg-white/[0.03] border-b border-white/[0.05] flex items-center px-10 justify-between flex-none">
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-swiggy-error opacity-40"></div>
               <div className="w-3 h-3 rounded-full bg-swiggy-warning opacity-40"></div>
               <div className="w-3 h-3 rounded-full bg-swiggy-success opacity-40"></div>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Live Intelligence Stream</span>
         </div>

         <div 
           ref={logContainerRef}
           className="flex-1 overflow-y-auto p-10 space-y-5 custom-terminal-scroll"
         >
            {logs.map((log) => (
               <div key={log.id} className="group animate-in slide-in-from-left-4 duration-300">
                  <div className="flex gap-8 items-start font-mono">
                     <span className="text-slate-600 border-r border-white/5 pr-6 min-w-[110px] text-[10px] group-hover:text-slate-400 transition-colors">[{log.timestamp}]</span>
                     <div className="flex-1 flex items-start gap-4">
                        <span className={`
                           px-3 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                           ${log.type === 'success' ? 'bg-swiggy-success/10 text-swiggy-success border-swiggy-success/20' : ''}
                           ${log.type === 'warn' ? 'bg-swiggy-warning/10 text-swiggy-warning border-swiggy-warning/20' : ''}
                           ${log.type === 'system' ? 'bg-swiggy-primary/10 text-swiggy-primary border-swiggy-primary/20' : ''}
                           ${log.type === 'info' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                        `}>
                           {log.type}
                        </span>
                        <span className={`
                           text-sm font-medium tracking-tight leading-relaxed
                           ${log.type === 'success' ? 'text-white' : 'text-slate-300'}
                        `}>
                           {log.message}
                        </span>
                     </div>
                  </div>
                  <div className="h-[1px] w-full bg-white/[0.03] mt-5"></div>
               </div>
            ))}

            {logs.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center opacity-20 gap-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl animate-pulse">📡</div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Waiting for transmission handshakes...</p>
               </div>
            )}
         </div>

         {/* 📊 Metrics Bar */}
         <div className="h-12 bg-white/[0.03] border-t border-white/[0.05] flex items-center px-10 text-[9px] font-black text-slate-500 uppercase tracking-widest flex-none justify-between">
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-swiggy-success rounded-full"></span>
                  Connection: SECURE
               </span>
               <span className="opacity-10">|</span>
               <span>Cache Size: {logs.length}/100</span>
            </div>
            <span className="italic opacity-40">Tactical Grid Protocol V4.0</span>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-terminal-scroll::-webkit-scrollbar { width: 4px; }
        .custom-terminal-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-terminal-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-terminal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}} />
    </div>
  );
}
