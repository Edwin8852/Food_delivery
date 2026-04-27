import { useCart } from "../context/CartContext";
import { getFoodImage, FALLBACK_IMAGE } from "../utils/imageResolver";
import { Card, Button } from "./ui";

export default function FoodCard({ item }) {
  const { addToCart, decreaseQty, getQuantity } = useCart();
  const itemId = item.id || item._id || item.name;
  const qty = getQuantity(itemId);

  const imageSrc = item.image?.trim()
    ? getFoodImage(item.image)
    : FALLBACK_IMAGE;

  return (
    <Card noPadding className="group hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden border-none ring-1 ring-slate-100 dark:ring-slate-800">
      
      {/* 🖼️ Visual Node */}
      <div className="relative aspect-[4/3] overflow-hidden bg-swiggy-bg dark:bg-slate-800">
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        
        {/* State Badge (Veg/Non-Veg) */}
        {item.isVeg !== undefined && (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
            <div className={`w-3.5 h-3.5 border-2 ${item.isVeg ? "border-[#60B246]" : "border-[#FF5252]"} flex items-center justify-center rounded-sm`}>
               <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-[#60B246]" : "bg-[#FF5252]"}`} />
            </div>
          </div>
        )}

        {/* Promo Overlay (Mock) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <p className="text-white text-[10px] font-black uppercase tracking-widest italic">Node Sync Active</p>
        </div>
      </div>

      {/* 📜 Entity Data */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
           <h3 className="text-lg font-black text-swiggy-heading dark:text-white leading-tight uppercase tracking-tight group-hover:text-swiggy-primary transition-colors">{item.name}</h3>
           <p className="text-[10px] font-bold text-swiggy-secondary uppercase tracking-widest mt-1 italic">
             {item.category || "Culinary Node"}
           </p>
        </div>

        <p className="text-xs text-swiggy-secondary leading-relaxed mb-6 line-clamp-2">
          {item.description || "Authentic flavor configuration synchronized for optimal satisfaction."}
        </p>

        {/* 💳 Tactical Footer (Circled by User) */}
        <div className="mt-auto flex justify-between items-center bg-swiggy-bg/50 dark:bg-slate-800/30 -mx-6 -mb-6 p-6 border-t border-swiggy-bg dark:border-slate-800">
          <div className="flex flex-col">
             <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mb-0.5">Valuation</p>
             <p className="text-2xl font-black text-swiggy-heading dark:text-white tracking-tighter italic">₹{item.price}</p>
          </div>

          <div className="relative">
             {qty === 0 ? (
               <button
                 onClick={() => addToCart(item)}
                 className="h-12 px-10 bg-white dark:bg-slate-900 border-2 border-swiggy-primary/20 hover:border-swiggy-primary text-swiggy-primary font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-swiggy-primary/10 hover:shadow-swiggy-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
               >
                 ADD
               </button>
             ) : (
               <div className="h-12 flex items-center bg-swiggy-primary text-white rounded-2xl shadow-xl shadow-swiggy-primary/30 overflow-hidden min-w-[120px]">
                 <button 
                    onClick={() => decreaseQty(itemId)}
                    className="flex-1 h-full flex items-center justify-center font-black text-lg hover:bg-black/10 transition-colors"
                 >–</button>
                 <span className="px-2 font-black text-sm tracking-tighter">{qty}</span>
                 <button 
                    onClick={() => addToCart(item)}
                    className="flex-1 h-full flex items-center justify-center font-black text-lg hover:bg-black/10 transition-colors"
                 >+</button>
               </div>
             )}
          </div>
        </div>
      </div>
    </Card>
  );
}
