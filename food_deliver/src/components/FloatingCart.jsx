import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function FloatingCart() {
  const { cart } = useCart();
  const location = useLocation();
  const totalItems = (cart || []).reduce((acc, item) => acc + (item.quantity || 0), 0);

  if (location.pathname === "/cart" || location.pathname === "/order-tracking") return null;

  return (
    <Link 
      to="/cart"
      className="fixed bottom-10 right-10 lg:bottom-12 lg:right-12 bg-swiggy-primary hover:bg-swiggy-primary-hover text-white w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] shadow-[0_15px_40px_rgba(252,128,25,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 z-[100] flex items-center justify-center group border-4 border-white dark:border-slate-800"
    >
      <div className="relative">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-swiggy-heading dark:bg-white text-white dark:text-swiggy-heading text-[10px] sm:text-xs font-black w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-2xl shadow-xl border-4 border-swiggy-primary transition-all duration-500">
            {totalItems}
          </span>
        )}
      </div>
      
      {/* 🚀 Tactical HUD Label (Hidden on small screens) */}
      <span className="absolute right-full mr-6 bg-swiggy-heading dark:bg-white text-white dark:text-swiggy-heading px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl">
         Intercept Manifest —&gt;
      </span>
    </Link>
  );
}
