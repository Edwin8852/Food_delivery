import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getFoodImage } from '../utils/imageResolver';
import { Card, Button, Badge } from "../components/ui";


const CATEGORIES = [
  { name: "Starters", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80" },
  { name: "Main Course", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { name: "Snacks", image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400&q=80" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1546890975-7596e98cdbf1?w=400&q=80" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" }
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.role !== "USER") navigate("/");
      } catch (e) { navigate("/"); }
    } else { navigate("/"); }
  }, [navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants');
        setRestaurants(response.data.data);
      } catch (error) {
        setError(`Failed to load restaurants: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="animate-fade-in space-y-16 pb-24">
      
      {/* 🏙️ Hero Terminal */}
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-white dark:bg-[#1E1E1E] rounded-[48px] border border-gray-100 dark:border-slate-800 shadow-sm" />
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 lg:opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}>
           <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-[#1E1E1E] dark:via-[#1E1E1E]/40" />
        </div>
        
        <div className="relative z-10 px-10 py-20 md:p-24 max-w-2xl">
          <Badge status="primary" className="mb-8 scale-125 origin-left">Premium Delivery</Badge>
          <h2 className="text-5xl md:text-7xl font-black text-swiggy-heading dark:text-white mb-6 leading-[0.95] tracking-[ -0.04em] uppercase italic">
            Targeting <span className="text-swiggy-primary block">Your Cravings</span>
          </h2>
          <p className="text-lg text-swiggy-secondary font-bold max-w-md mb-10 leading-relaxed uppercase tracking-tighter">
            Autonomous flavor deployment synchronized for delivery within the 30-minute operational window.
          </p>
          <div className="flex gap-4">
             <Link to="/categories">
                <Button size="lg" className="h-16 px-12">Initialize Discovery</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* 🏷️ Mind Grids */}
      <section>
        <div className="flex items-end gap-3 mb-10 px-2">
           <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Inventory <span className="text-swiggy-primary">Feed</span></h2>
           <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full mb-2 animate-ping" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} to="/categories" state={{ category: cat.name }}
              className="group relative bg-[#1E1E1E] rounded-[32px] overflow-hidden aspect-[4/5] shadow-lg hover:shadow-swiggy-primary/20 transition-all duration-700 hover:-translate-y-2 border-none ring-1 ring-white/5"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                 <p className="text-white font-black text-2xl uppercase tracking-tighter italic">{cat.name}</p>
                 <span className="text-[10px] font-black text-swiggy-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Discover Group</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🚀 Node Directory (Restaurants) */}
      <section>
        <div className="flex items-center justify-between mb-10 px-2 border-b border-gray-100 dark:border-slate-800 pb-6">
          <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Strategic <span className="text-swiggy-primary">Nodes</span></h2>
          <Link to="/categories" className="text-swiggy-secondary text-[10px] font-black uppercase tracking-widest hover:text-swiggy-primary transition-colors">Observe All Handlers —&gt;</Link>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6">
             <div className="w-14 h-14 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
             <p className="text-swiggy-secondary font-black uppercase tracking-[0.3em] text-[10px]">Syncing Node Locations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((res) => (
              <Link 
                key={res.id} 
                to="/categories" 
                state={{ restaurantId: res.id, restaurantName: res.name }}
                className="group flex flex-col h-full bg-white dark:bg-[#1E1E1E] rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border-none ring-1 ring-slate-100 dark:ring-slate-800"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={getFoodImage(res.image_url, res.name)} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-1.5 shadow-xl border border-white/10">
                    <span className="text-swiggy-primary text-xs">★</span> {res.rating}
                  </div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 uppercase italic text-[10px] font-black text-white">
                     🚀 {res.delivery_time} MINS
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-swiggy-heading dark:text-white uppercase tracking-tighter mb-1 leading-none group-hover:text-swiggy-primary transition-colors italic">{res.name}</h3>
                  <p className="text-swiggy-secondary text-[10px] font-black uppercase tracking-widest leading-relaxed">{res.category} • {res.location}</p>
                  
                  <div className="mt-8 pt-8 border-t border-swiggy-bg dark:border-slate-800 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-swiggy-secondary uppercase tracking-[0.2em] mb-0.5">Payload Range</span>
                        <span className="font-black text-swiggy-heading dark:text-slate-300 text-xs italic uppercase">Authentic Grid</span>
                     </div>
                     <span className="w-12 h-12 bg-swiggy-bg dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-swiggy-primary group-hover:text-white transition-all duration-500">
                        <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
