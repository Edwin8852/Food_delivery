import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 rounded-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-swiggy-primary text-white hover:bg-swiggy-primary-hover shadow-lg shadow-swiggy-primary/20',
    secondary: 'bg-swiggy-heading text-white hover:opacity-90',
    outline: 'border-2 border-swiggy-primary text-swiggy-primary hover:bg-swiggy-primary hover:text-white',
    ghost: 'text-swiggy-secondary hover:text-swiggy-heading hover:bg-swiggy-bg dark:hover:bg-slate-800',
    danger: 'bg-swiggy-error text-white hover:opacity-90 shadow-lg shadow-swiggy-error/20',
    success: 'bg-swiggy-success text-white hover:opacity-90 shadow-lg shadow-swiggy-success/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[8px]',
    md: 'px-8 py-3 text-[10px]',
    lg: 'px-10 py-4 text-xs',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-swiggy-card dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-[32px] overflow-hidden ${noPadding ? '' : 'p-8 md:p-10'} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ status, className = '' }) => {
  const statusMap = {
    placed: 'bg-swiggy-warning/10 text-swiggy-warning border-swiggy-warning/20',
    accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    kitchen: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    ready: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    assigned: 'bg-swiggy-primary/10 text-swiggy-primary border-swiggy-primary/20',
    picked_up: 'bg-slate-900/10 text-slate-900 dark:text-white border-slate-900/20',
    delivered: 'bg-swiggy-success/10 text-swiggy-success border-swiggy-success/20',
    cancelled: 'bg-swiggy-error/10 text-swiggy-error border-swiggy-error/20',
    online: 'bg-swiggy-success/10 text-swiggy-success border-swiggy-success/20',
    offline: 'bg-slate-300/10 text-slate-400 border-slate-300/20',
  };

  // Default fallback
  const style = statusMap[status.toLowerCase()] || 'bg-slate-100 text-slate-500 border-slate-200';

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style} ${className}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
