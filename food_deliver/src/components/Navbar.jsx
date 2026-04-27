import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getDashboardRoute } from "../utils/roleRedirect";
import { Button } from "./ui";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const totalItems = (cart || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
  const role = user?.role;

  const isActive = (path) => 
    location.pathname === path ? "text-swiggy-primary border-b-2 border-swiggy-primary" : "text-swiggy-secondary dark:text-slate-400 hover:text-swiggy-primary pb-0.5";

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-[#1E1E1E] shadow-sm z-50 border-b border-gray-100 dark:border-slate-800 h-20 flex items-center transition-colors">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center h-full">
        
        {/* 🦊 Logo Infrastructure */}
        <div className="flex items-center">
          <Link to={getDashboardRoute()} className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-swiggy-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-105 transition-transform shadow-lg shadow-swiggy-primary/20">
              F
            </div>
            <h1 className="text-2xl font-black tracking-tight text-swiggy-heading dark:text-white uppercase italic">
              Foodie<span className="text-swiggy-primary">Express</span>
            </h1>
          </Link>
        </div>

        {/* 🧭 Navigation Nodes */}
        <div className="flex items-center h-full">
          <nav className="hidden lg:flex items-center gap-8 h-full mr-8">
            
            {/* 👤 USER PERIMETER */}
            {(!role || role === "USER") && (
              <>
                <Link to="/home" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/home")}`}>Home</Link>
                <Link to="/categories" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/categories")}`}>Browse</Link>
                {role === "USER" && (
                  <>
                    <Link to="/orders" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/orders")}`}>My Orders</Link>
                    <Link to="/profile" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/profile")}`}>Profile</Link>
                  </>
                )}
              </>
            )}

            {/* 🚴 DELIVERY PILOT PERIMETER */}
            {(role === "DELIVERY_PARTNER" || role === "DELIVERY") && (
              <>
                <Link to="/delivery/dashboard" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all whitespace-nowrap ${isActive("/delivery/dashboard")}`}>Pilot Hub</Link>
                <Link to="/delivery/orders" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all whitespace-nowrap ${isActive("/delivery/orders")}`}>Directives</Link>
                <Link to="/delivery/history" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all whitespace-nowrap ${isActive("/delivery/history")}`}>Logs</Link>
                <Link to="/delivery/profile" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all whitespace-nowrap ${isActive("/delivery/profile")}`}>Identity</Link>
                
                <div className="flex items-center gap-2 bg-swiggy-primary/10 text-swiggy-primary px-4 py-2 rounded-xl border border-swiggy-primary/20 shadow-sm">
                  <span className="text-sm">💰</span>
                  <span className="font-black text-xs tracking-widest uppercase">₹{parseFloat(user?.wallet || 0).toFixed(0)}</span>
                </div>
              </>
            )}

            {/* 🛒 SHARED UTILITIES */}
            {(!role || role === "USER" || role === "DELIVERY_PARTNER" || role === "DELIVERY") && (
              <>
                <Link to="/order-tracking" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all whitespace-nowrap ${isActive("/order-tracking")}`}>Tracking</Link>
                <Link to="/cart" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all gap-3 relative group ${isActive("/cart")}`}>
                  <div className="relative">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-3 -right-3 bg-swiggy-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 animate-bounce">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>
              </>
            )}

            {/* 📊 ADMIN CONSOLE */}
            {(role === "ADMIN" || role === "RESTAURANT_OWNER") && (
              <>
                <Link to="/admin" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/admin")}`}>Console</Link>
                <Link to="/admin/menu" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/admin/menu")}`}>Catalog</Link>
                <Link to="/admin/orders" className={`text-xs font-black uppercase tracking-widest h-full flex items-center transition-all ${isActive("/admin/orders")}`}>Mission Grid</Link>
              </>
            )}
          </nav>

          {/* 🔐 Auth Terminal */}
          <div className="flex items-center gap-6 border-l pl-8 border-gray-100 dark:border-slate-800 h-10">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end justify-center">
                  <span className="text-swiggy-heading dark:text-white font-black text-sm uppercase tracking-tighter">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mt-0.5">
                    {role?.replace("_", " ")} Node
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="bg-swiggy-bg dark:bg-slate-800 text-swiggy-secondary hover:text-swiggy-error font-black px-5 py-2.5 rounded-xl transition-all text-[10px] uppercase tracking-widest border border-transparent hover:border-swiggy-error/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
