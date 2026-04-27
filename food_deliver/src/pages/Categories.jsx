import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import FoodCard from "../components/FoodCard";
import foodData from "../data/foodData";
import { Card } from "../components/ui";

const CATEGORIES = ["Starters", "Main Course", "Snacks", "Beverages", "Desserts"];

export default function Categories() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [backendFoods, setBackendFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const restaurantId = location.state?.restaurantId;
  const restaurantName = location.state?.restaurantName;

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchFoods = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/menu-items/restaurant/${restaurantId}`);
        setBackendFoods(response.data?.data || []);
      } catch (error) {
        setBackendFoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [restaurantId]);

  const dataKey = selectedCategory.replace(/\s/g, "");
  const items = restaurantId 
    ? backendFoods.filter(f => f.category === selectedCategory || f.category === dataKey)
    : (foodData[dataKey] || foodData[selectedCategory] || []);

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#121212] transition-colors duration-500">
      
      {/* 🚀 Tactical Navigation Hub */}
      <div className="bg-white dark:bg-[#1E1E1E] shadow-sm border-b border-gray-100 dark:border-slate-800 sticky top-0 z-[40]">
        <div className="container mx-auto px-6 py-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                 <h1 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic leading-none">
                    {restaurantName || "Culinary"} <span className="text-swiggy-primary">Discovery</span>
                 </h1>
                 <div className="flex items-center gap-3 mt-4">
                    <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em] leading-none">
                       {restaurantId ? `Linked Node: ${restaurantId.slice(-8).toUpperCase()}` : "Global Inventory Feed Synchronized"}
                    </p>
                 </div>
              </div>

              {/* 🏷️ Category Selection Bar */}
              <div className="flex flex-wrap gap-3">
                 {CATEGORIES.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setSelectedCategory(cat)}
                     className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border-2 ${
                       selectedCategory === cat 
                         ? "bg-swiggy-primary border-swiggy-primary text-white shadow-lg shadow-swiggy-primary/30 -translate-y-0.5" 
                         : "bg-transparent border-gray-100 dark:border-slate-800 text-swiggy-secondary dark:text-slate-500 hover:border-swiggy-primary/30 hover:text-swiggy-primary"
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🍱 Main Operational Grid */}
      <div className="container mx-auto px-6 py-16">
        {loading && restaurantId ? (
          <div className="flex flex-col items-center justify-center p-40 gap-6">
             <div className="w-16 h-16 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
             <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.4em] animate-pulse">Syncing Culinary Nodes...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-48 text-center opacity-40 animate-pulse">
              <span className="text-8xl block mb-8 grayscale">🍽️</span>
              <p className="text-xl font-black text-swiggy-secondary uppercase tracking-[0.4em] italic">No Protocol Entries Synchronized</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-fade-in">
            {items.map(item => (
              <FoodCard key={item.id || item.name} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* 🚀 Logistics Footer Tip */}
      <div className="container mx-auto px-6 pb-20">
         <Card border className="bg-white/50 dark:bg-[#1E1E1E]/50 flex flex-col md:flex-row items-center justify-between p-10 gap-8 animate-fade-in delay-500">
            <div className="flex items-center gap-6">
               <span className="text-4xl">🛰️</span>
               <div>
                  <p className="text-[10px] font-black text-swiggy-heading dark:text-white uppercase tracking-widest mb-1 italic">Tactical Logistics Monitoring</p>
                  <p className="text-xs font-bold text-swiggy-secondary uppercase tracking-tight leading-relaxed">Fastest Delivery Protocol Active: 25-35 Minutes to your current location.</p>
               </div>
            </div>
            <div className="flex -space-x-4">
               {[1,2,3,4].map(idx => (
                  <div key={idx} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 bg-gray-200 overflow-hidden shadow-xl">
                     <img src={`https://i.pravatar.cc/150?u=user${idx}`} alt="Trust Node" />
                  </div>
               ))}
               <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 bg-swiggy-primary flex items-center justify-center text-white text-[10px] font-black shadow-xl">+1k</div>
            </div>
         </Card>
      </div>

    </div>
  );
}
