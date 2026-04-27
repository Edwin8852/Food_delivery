import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DeliveryNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => 
    location.pathname === path ? "text-[#ff5200] border-b-2 border-[#ff5200]" : "text-gray-600 hover:text-[#ff5200]";

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 border-b border-gray-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-5 flex justify-between items-center h-full">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/delivery-dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-sm">
              D
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-800 italic">
              Delivery<span className="text-[#ff5200]">Hub</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center h-full">
          <nav className="flex items-center gap-8 h-full mr-8">
            <Link to="/delivery-dashboard" className={`font-bold text-[16px] h-full flex items-center px-1 transition-all whitespace-nowrap ${isActive("/delivery-dashboard")}`}>
              Dashboard
            </Link>
            <Link to="/delivery-orders" className={`font-bold text-[16px] h-full flex items-center px-1 transition-all whitespace-nowrap ${isActive("/delivery-orders")}`}>
              Live Orders
            </Link>
            <Link to="/delivery-earnings" className={`font-bold text-[16px] h-full flex items-center px-1 transition-all whitespace-nowrap ${isActive("/delivery-earnings")}`}>
              Earnings
            </Link>
            <Link to="/delivery-profile" className={`font-bold text-[16px] h-full flex items-center px-1 transition-all whitespace-nowrap ${isActive("/delivery-profile")}`}>
              Profile
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4 border-l pl-6 border-gray-100 h-10">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-xl border border-orange-100">
               <span className="text-sm">💰</span>
               <span className="font-black text-sm">₹{parseFloat(user?.wallet || 0).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={logout}
              className="bg-red-50 text-red-600 font-bold py-2.5 px-5 rounded-xl hover:bg-red-100 transition-all text-sm active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
