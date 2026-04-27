import React from "react";
import { useCart } from "../context/CartContext";
import { getFoodImage, FALLBACK_IMAGE } from '../utils/imageResolver';

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty } = useCart();

  const menuItem = item?.menuItem || item || {};
  const name = menuItem.name || "Unknown Entity";
  const imageUrl = getFoodImage(menuItem.image || menuItem.image_url || menuItem.imageUrl, name);

  const priceParsed = parseFloat(menuItem.price || 0) || 0;
  const qty = parseInt(item?.quantity || 1, 10);
  const total = priceParsed * qty;

  return (
    <div className="group bg-white dark:bg-slate-900/50 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all hover:shadow-xl hover:shadow-swiggy-primary/5 border border-transparent hover:border-swiggy-bg dark:hover:border-slate-800">

      {/* 🖼️ Visual Context */}
      <div className="flex items-center gap-6 flex-1 w-full">
        <div className="relative shrink-0 w-24 h-24 overflow-hidden rounded-[20px] bg-swiggy-bg dark:bg-slate-800">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-xl font-black text-swiggy-heading dark:text-white line-clamp-1 uppercase tracking-tighter italic mb-1 transition-colors group-hover:text-swiggy-primary">{name}</h3>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest bg-swiggy-bg dark:bg-slate-800 px-2 py-0.5 rounded-md">Protocol Unit</span>
             <p className="text-sm font-bold text-swiggy-secondary">₹{priceParsed}</p>
          </div>
          <p className="font-black text-xl text-swiggy-heading dark:text-white sm:hidden mt-3 tracking-tighter italic">₹{total}</p>
        </div>
      </div>

      {/* 🎮 Tactical Controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0">
        <p className="font-black text-2xl text-swiggy-heading dark:text-white hidden sm:block tracking-tighter italic">₹{total}</p>

        <div className="flex items-center h-11 bg-swiggy-bg dark:bg-slate-800 p-1 rounded-2xl border border-swiggy-bg dark:border-slate-800 hover:border-swiggy-primary/20 transition-all ml-auto sm:ml-0">
          <button 
            onClick={() => decreaseQty(item.id || item.menuItemId)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-swiggy-secondary hover:text-swiggy-primary hover:bg-white dark:hover:bg-slate-700 transition-all font-black text-lg"
          >–</button>
          
          <span className="w-12 text-center font-black text-swiggy-heading dark:text-white text-sm tracking-tighter">
            {qty}
          </span>
          
          <button 
            onClick={() => increaseQty(item.id || item.menuItemId)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-swiggy-primary hover:bg-white dark:hover:bg-slate-700 transition-all font-black text-lg"
          >+</button>
        </div>
      </div>

    </div>
  );
}
