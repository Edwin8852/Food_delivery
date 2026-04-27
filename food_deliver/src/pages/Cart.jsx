import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CartItem from "../components/CartItem";
import { toast } from "react-toastify";
import { Card, Button, Badge } from "../components/ui";

export default function Cart({ setCurrentOrder }) {
  const { cart = [], clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const res = await api.get("/address");
          let data = res.data?.data || [];
          const sorted = [...data].sort((a, b) => new Date(b.lastUsedAt || 0) - new Date(a.lastUsedAt || 0));
          const lastUsed = sorted[0];
          const defaultAddr = data.find(a => a.isDefault);
          const filtered = data.filter(a => a.isDefault || a.id === lastUsed?.id);
          const uniqueFiltered = Array.from(new Set(filtered.map(a => a.id))).map(id => filtered.find(a => a.id === id));
          setAddresses(uniqueFiltered);
          if (defaultAddr) setSelectedAddress(defaultAddr.id);
          else if (lastUsed) setSelectedAddress(lastUsed.id);
        } catch (err) {}
      };
      fetchAddresses();
    }
  }, [user]);

  const selectedAddrData = addresses.find(a => a.id === selectedAddress);
  
  const totalAmount = (cart || []).reduce(
    (total, item) => total + Number(item.menuItem?.price || item.price || 0) * item.quantity,
    0
  );

  useEffect(() => {
    if (appliedCoupon && totalAmount < appliedCoupon.minOrderAmount) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      toast.info("Promo invalidated: Minimum amount not met");
    }
  }, [totalAmount, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    try {
      const res = await api.post("/coupons/validate", { code: couponCode, amount: totalAmount });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setDiscountAmount(res.data.data.discount);
        toast.success("Promo Code Synthesized!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Promo Code");
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally { setIsValidating(false); }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please provide target coordinates for delivery");
      return;
    }
    setShowPayment(true);
  };

  const processPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      try { await api.delete("/cart"); } catch (e) {}
      for (const item of cart || []) {
        await api.post("/cart", { menuItemId: (item.id || item.menuItemId || item._id), quantity: item.quantity });
      }
      const orderRes = await api.post("/orders", { addressId: selectedAddress, paymentMethod: "CARD", couponId: appliedCoupon?.couponId, discountAmount: discountAmount });
      const order = orderRes.data.data;
      await new Promise((res) => setTimeout(res, 1500));
      await api.patch(`/orders/${order.id}/pay`);
      setCurrentOrder(order);
      clearCart();
      navigate("/order-tracking", { state: { orderId: order.id } });
    } catch (err) { toast.error(err.response?.data?.message || "Checkout failed"); }
    finally { setIsProcessing(false); }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-lg text-center animate-fade-in">
        <Card className="p-12 space-y-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-swiggy-bg dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-5xl">👤</div>
          <div>
             <h2 className="text-3xl font-black text-swiggy-heading dark:text-white mb-2 uppercase tracking-tighter italic">Almost <span className="text-swiggy-primary">There</span></h2>
             <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Identity authentication required for terminal access.</p>
          </div>
          <Link to="/login" className="w-full">
            <Button className="w-full h-16">Login to Continue</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-fade-in pb-32">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 🏰 Operational Workspace */}
        <div className="flex-1 space-y-12">
          
          <div className="flex items-center gap-6">
            <Link to="/home" className="w-12 h-12 bg-white dark:bg-[#1E1E1E] rounded-2xl flex items-center justify-center text-swiggy-secondary hover:text-swiggy-primary shadow-sm border border-swiggy-bg dark:border-slate-800 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <h1 className="text-5xl font-black text-swiggy-heading dark:text-white tracking-[ -0.04em] uppercase italic">Checkout <span className="text-swiggy-primary">Manifest</span></h1>
          </div>

          {/* 📍 Delivery Precision Section */}
          <section className="space-y-6">
             <div className="flex justify-between items-end px-2">
                <div>
                   <h2 className="text-xs font-black text-swiggy-secondary uppercase tracking-[0.3em] mb-1">Target Coordinates</h2>
                   <p className="text-lg font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic">Delivery Address</p>
                </div>
                <button onClick={() => setShowAddressForm(true)} className="text-[10px] font-black text-swiggy-primary uppercase tracking-widest hover:underline px-4 py-2 bg-swiggy-primary/5 rounded-xl transition-all">Coordinate Switch</button>
             </div>

             <Card className={`relative overflow-hidden group border-2 ${!selectedAddress ? 'border-swiggy-error/20 bg-swiggy-error/5' : 'border-transparent'}`}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <span className="text-9xl">📍</span>
                </div>
                
                {selectedAddrData ? (
                   <div className="flex items-start gap-8 relative z-10">
                      <div className="w-20 h-20 bg-swiggy-bg dark:bg-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner uppercase font-black text-swiggy-primary select-none">
                        {selectedAddrData.addressType === 'HOME' ? '🏠' : '🏢'}
                      </div>
                      <div className="flex-1">
                        <Badge status={selectedAddrData.addressType === 'HOME' ? 'online' : 'away'} children={selectedAddrData.addressType} className="mb-3" />
                        <p className="text-xl font-black text-swiggy-heading dark:text-white tracking-tighter leading-tight mb-2">
                          {selectedAddrData.houseNumber}, {selectedAddrData.street}
                        </p>
                        <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest leading-relaxed">
                          {selectedAddrData.city}, {selectedAddrData.state} — {selectedAddrData.pincode}
                        </p>
                        {selectedAddrData.deliveryInstructions && (
                           <div className="mt-4 flex items-center gap-3 text-swiggy-primary bg-swiggy-primary/5 p-3 rounded-xl border border-swiggy-primary/10">
                              <span className="text-sm">💬</span>
                              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Instruction: {selectedAddrData.deliveryInstructions}</p>
                           </div>
                        )}
                      </div>
                   </div>
                ) : (
                   <div className="text-center py-10">
                      <p className="text-swiggy-error font-black uppercase tracking-[0.3em] text-xs mb-6 animate-pulse">NO LOGISTICS LINK ESTABLISHED</p>
                      <Link to="/profile"><Button variant="outline">Initialize Address Protocol</Button></Link>
                   </div>
                )}
             </Card>
          </section>

          {/* 📋 Payload Verification Section */}
          <section className="space-y-6">
            <div className="px-2">
               <h2 className="text-xs font-black text-swiggy-secondary uppercase tracking-[0.3em] mb-1">Entity Review</h2>
               <p className="text-lg font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic">Payload Manifest</p>
            </div>

            <Card border className="space-y-4">
              {(cart || []).length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <span className="text-8xl block mb-6 grayscale">📦</span>
                  <p className="text-xl font-black text-swiggy-secondary uppercase tracking-[0.4em] italic">Manifest Empty</p>
                </div>
              ) : (
                <div className="divide-y divide-swiggy-bg dark:divide-slate-800">
                  {(cart || []).map((item, index) => (
                    <div key={item.id || item.menuItemId || index} className="py-2 first:pt-0 last:pb-0">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* 💳 Extraction Terminal / Bill Summary */}
        <aside className="w-full lg:w-[420px] shrink-0">
          <div className="sticky top-28 space-y-8">
             <Card noPadding className="bg-white dark:bg-[#1E1E1E] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 group">
                <div className="h-2 bg-swiggy-primary w-full group-hover:h-3 transition-all duration-500" />
                <div className="p-10 space-y-10">
                   <h2 className="text-3xl font-black tracking-tighter uppercase italic border-b border-gray-100 dark:border-slate-800 pb-8 text-swiggy-heading dark:text-white">Valuation <span className="text-swiggy-primary text-4xl block mt-1">Terminal</span></h2>

                   <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">
                         <span>Base Yield</span>
                         <span className="text-swiggy-heading dark:text-white text-lg font-black tracking-tighter italic">₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">
                         <span>Logistics Fee</span>
                         <span className="text-swiggy-heading dark:text-white text-lg font-black tracking-tighter italic">₹40</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">
                         <span>Grid Tax (5%)</span>
                         <span className="text-swiggy-heading dark:text-white text-lg font-black tracking-tighter italic">₹12</span>
                      </div>
                      {appliedCoupon && (
                         <div className="flex justify-between items-center text-[10px] font-black text-swiggy-success uppercase tracking-[0.3em] bg-swiggy-success/5 p-4 rounded-2xl border border-swiggy-success/20">
                            <span>Promo Salvage</span>
                            <span className="text-xl font-black tracking-tighter italic">-₹{discountAmount}</span>
                         </div>
                      )}
                      
                      <div className="pt-10 border-t border-gray-100 dark:border-slate-800 flex justify-between items-end">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-swiggy-primary uppercase tracking-[0.5em] mb-2 px-1">Total Payload</span>
                           <span className="text-6xl font-black tracking-tighter tabular-nums italic text-swiggy-heading dark:text-white">₹{totalAmount > 0 ? (totalAmount + 52 - discountAmount) : 0}</span>
                         </div>
                      </div>
                   </div>

                   {/* 🏷️ Protocol Code Access */}
                   <div className="pt-10 border-t border-gray-100">
                      {totalAmount >= 500 ? (
                         <div className="space-y-4">
                            <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-[0.3em] mb-4">Tactical Coupon Node</p>
                            {appliedCoupon ? (
                               <div className="bg-swiggy-bg border border-gray-100 p-5 rounded-3xl flex justify-between items-center group">
                                  <div>
                                     <p className="text-xs font-black text-swiggy-primary uppercase tracking-widest">{appliedCoupon.code}</p>
                                     <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mt-1 italic">₹{discountAmount} Discount Verified</p>
                                  </div>
                                  <button onClick={removeCoupon} className="text-[10px] font-black text-swiggy-error hover:text-swiggy-primary uppercase tracking-widest transition-colors px-3 py-1.5 bg-swiggy-error/10 rounded-lg">Terminate</button>
                               </div>
                            ) : (
                               <div className="flex gap-2">
                                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="COUPON_CODE" className="flex-1 bg-swiggy-bg border border-gray-200 rounded-2xl px-5 py-4 text-xs font-black text-swiggy-heading focus:ring-1 focus:ring-swiggy-primary outline-none placeholder:text-swiggy-secondary/40 uppercase tracking-widest transition-all" />
                                  <Button size="sm" onClick={handleApplyCoupon} disabled={isValidating || !couponCode} className="px-6 h-14 min-w-[100px]">{isValidating ? '...' : 'APPLY'}</Button>
                               </div>
                            )}
                         </div>
                      ) : (
                         <div className="opacity-20 group-hover:opacity-100 transition-opacity">
                            <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-[0.3em] mb-2">Promotions Locked</p>
                            <div className="bg-swiggy-bg dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                               <p className="text-[9px] font-black text-swiggy-primary uppercase tracking-widest">Add ₹{500 - totalAmount} more for protocol access</p>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* 🚀 Execution Trigger */}
                   <div className="pt-10">
                      {showPayment ? (
                        <div className="space-y-6">
                           <div className="p-5 bg-swiggy-primary/5 rounded-3xl border border-swiggy-primary/20 text-center">
                              <p className="text-[9px] font-black text-swiggy-primary uppercase tracking-[0.3em] animate-pulse italic">Awaiting Secure Handshake...</p>
                           </div>
                           <Button className="w-full h-20 text-xl" onClick={processPayment} disabled={isProcessing}>
                             {isProcessing ? "Transacting..." : `Confirm Payment: ₹${totalAmount + 52 - discountAmount}`}
                           </Button>
                        </div>
                      ) : (
                        <Button className="w-full h-24 text-2xl group/btn" onClick={handleCheckout} disabled={(cart || []).length === 0}>
                          Launch Delivery
                          <svg className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        </Button>
                      )}
                   </div>
                </div>
             </Card>

             <div className="px-10 text-center">
                <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-[0.4em] italic opacity-40">Tactical Checkout Protocol V4.0.1</p>
             </div>
          </div>
        </aside>
      </div>

      {/* 🧭 Coordinate Selector Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-[#282C3F]/80 animate-fade-in pb-32">
           <Card className="w-full max-w-xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
              <button onClick={() => setShowAddressForm(false)} className="absolute top-10 right-10 text-swiggy-secondary hover:text-swiggy-primary transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="mb-10">
                 <h3 className="text-3xl font-black text-swiggy-heading dark:text-white uppercase tracking-tighter italic">Select <span className="text-swiggy-primary">Coordinate</span></h3>
                 <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest mt-1">Available Delivery Nodes</p>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 mb-10 custom-scroll">
                {addresses.map(addr => (
                  <div 
                    key={addr.id} onClick={() => { setSelectedAddress(addr.id); setShowAddressForm(false); }} 
                    className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center gap-6 group ${selectedAddress === addr.id ? 'border-swiggy-primary bg-swiggy-primary/5 shadow-xl shadow-swiggy-primary/5' : 'border-swiggy-bg dark:border-slate-800 hover:border-swiggy-primary/20'}`}
                  >
                     <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-swiggy-bg dark:border-slate-800 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">{addr.addressType === 'HOME' ? '🏠' : '🏢'}</div>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-black text-swiggy-heading dark:text-white text-sm uppercase italic tracking-tighter">{addr.addressType} {addr.isDefault && <span className="text-[8px] bg-swiggy-primary text-white px-2 py-0.5 rounded-md ml-2 not-italic">Default</span>}</h4>
                        <p className="text-[10px] font-bold text-swiggy-secondary uppercase truncate tracking-widest opacity-60">{addr.street}, {addr.city}</p>
                     </div>
                  </div>
                ))}
                {addresses.length === 0 && <p className="text-center py-10 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">No saved coordinates discovered</p>}
              </div>

              <Link to="/profile" className="block"><Button variant="outline" className="w-full h-16">Manage Operational Nodes</Button></Link>
           </Card>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .dark .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
      `}} />
    </div>
  );
}
