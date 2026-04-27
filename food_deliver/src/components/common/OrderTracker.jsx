import React from 'react';

const STAGES = [
  'PLACED',
  'ACCEPTED',
  'IN_KITCHEN',
  'PREPARING',
  'READY',
  'ASSIGNED',
  'RIDER_CONFIRMED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export default function OrderTracker({ currentStatus = 'PLACED' }) {
  const currentIndex = STAGES.indexOf(currentStatus?.toUpperCase());

  return (
    <div className="w-full pt-6 pb-12 overflow-x-auto custom-scroll">
      <div className="relative flex items-center justify-between min-w-[800px] px-4">
        
        {/* 🧬 Logistics Spine */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-swiggy-bg dark:bg-slate-800 rounded-full z-0" />
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-swiggy-primary rounded-full z-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(252,128,25,0.4)]" 
          style={{ width: `calc(${Math.max(0, (currentIndex / (STAGES.length - 1)) * 100)}% - 32px)` }}
        />

        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center group">
              {/* Node Marker */}
              <div className={`
                w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 font-black
                ${isCompleted ? 'bg-swiggy-primary border-swiggy-primary text-white shadow-xl shadow-swiggy-primary/20 rotate-45' : ''}
                ${isActive ? 'bg-white dark:bg-slate-900 border-swiggy-primary text-swiggy-primary scale-125 shadow-2xl shadow-swiggy-primary/30 animate-in zoom-in duration-500' : ''}
                ${isUpcoming ? 'bg-swiggy-bg dark:bg-slate-800 border-transparent text-swiggy-secondary' : ''}
              `}>
                <div className={isCompleted ? "-rotate-45" : ""}>
                   {isCompleted ? (
                      <span className="text-sm">✓</span>
                   ) : (
                      <span className={`text-[9px] ${isActive ? 'animate-pulse' : 'opacity-40'}`}>
                         {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>
                   )}
                </div>
              </div>
              
              {/* Label Terminal */}
              <div className="absolute top-14 whitespace-nowrap">
                 <p className={`
                    text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full transition-all duration-500 border
                    ${isActive ? 'bg-swiggy-heading dark:bg-white text-white dark:text-swiggy-heading border-transparent' : 'text-swiggy-secondary dark:text-slate-500 border-transparent'}
                    ${isCompleted ? 'opacity-40' : 'opacity-100'}
                 `}>
                    {stage.replace(/_/g, ' ')}
                 </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
