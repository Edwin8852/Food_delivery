import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Card, Badge, Button } from "../../components/ui";

export default function Promotions() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    expiryDate: "",
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      if (res.data.success) setCoupons(res.data.data);
    } catch (err) {
      toast.error("Grid Latency: Could not sync promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await api.patch(`/coupons/${editingCoupon.id}`, formData);
        toast.success("Identity Mutation Successful");
      } else {
        await api.post("/coupons", formData);
        toast.success("Promo Packet Deployed");
      }
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({ code: "", discountType: "PERCENTAGE", discountValue: 0, minOrderAmount: 0, maxDiscount: 0, expiryDate: "", isActive: true });
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || "Execution Failure"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Terminate this promotion?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Promo Terminated");
      fetchCoupons();
    } catch (err) { toast.error("Failed to terminate promo"); }
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate?.split("T")[0],
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 gap-6">
       <div className="w-12 h-12 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
       <span className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest animate-pulse">Syncing Promo Grid...</span>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      
      {/* 🏷️ Marketing Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-10 px-2">
         <div className="space-y-1">
            <h2 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Promo <span className="text-swiggy-primary">Center</span></h2>
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-swiggy-primary rounded-full animate-pulse" />
               <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.3em]">Campaigns Active on Grid: {coupons.length}</p>
            </div>
         </div>
         <Button onClick={() => { setEditingCoupon(null); setShowModal(true); }}>Initialize New Promo</Button>
      </div>

      {/* 🚀 Active Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden relative ${!coupon.isActive ? 'opacity-50 grayscale' : ''}`}>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                <span className="text-9xl">🏷️</span>
             </div>
             
             <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase mb-2">{coupon.code}</h3>
                      <Badge status={coupon.isActive ? 'online' : 'offline'} />
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest mb-1">Yield Value</p>
                      <p className="text-2xl font-black text-swiggy-primary tracking-tighter italic">
                         {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-swiggy-bg dark:bg-slate-800/50 p-5 rounded-3xl border border-swiggy-bg dark:border-slate-800">
                      <p className="text-[9px] font-black text-swiggy-secondary dark:text-slate-500 uppercase tracking-widest mb-1">Threshold</p>
                      <p className="font-black text-swiggy-heading dark:text-white text-sm">₹{coupon.minOrderAmount}</p>
                   </div>
                   <div className="bg-swiggy-bg dark:bg-slate-800/50 p-5 rounded-3xl border border-swiggy-bg dark:border-slate-800">
                      <p className="text-[9px] font-black text-swiggy-secondary dark:text-slate-500 uppercase tracking-widest mb-1">Expiration</p>
                      <p className="font-black text-swiggy-heading dark:text-white text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-swiggy-bg dark:border-slate-800">
                   <div className="flex gap-3">
                      <button onClick={() => openEdit(coupon)} className="w-10 h-10 bg-swiggy-bg dark:bg-slate-800 rounded-xl flex items-center justify-center text-swiggy-secondary hover:text-swiggy-primary transition-all">📝</button>
                      <button onClick={() => handleDelete(coupon.id)} className="w-10 h-10 bg-swiggy-bg dark:bg-slate-800 rounded-xl flex items-center justify-center text-swiggy-secondary hover:text-swiggy-error transition-all">🗑️</button>
                   </div>
                   <span className="text-[8px] font-black uppercase text-swiggy-secondary tracking-widest opacity-40">Tactical Deploy V4</span>
                </div>
             </div>
          </Card>
        ))}
      </div>

      {/* 🔧 Config Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#282C3F]/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in pb-20">
          <Card className="w-full max-w-xl p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
             <h3 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase mb-2 italic">
               Promo <span className="text-swiggy-primary">Config</span>
             </h3>
             <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest mb-10">Define tactical incentive parameters</p>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Promo Identifier</label>
                      <input className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white uppercase focus:ring-2 focus:ring-swiggy-primary/20 transition-all outline-none" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="SAVE50" required />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Yield Logic</label>
                      <select className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all appearance-none" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} >
                         <option value="PERCENTAGE">PERCENTAGE (%)</option>
                         <option value="FIXED">FIXED (₹)</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Value</label>
                      <input type="number" className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} required />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Min Entry</label>
                      <input type="number" className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Max Cap</label>
                      <input type="number" className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: e.target.value})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Terminal Date</label>
                      <input type="date" className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl h-14 px-6 font-black text-swiggy-heading dark:text-white outline-none" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} required />
                   </div>
                   <div className="space-y-2 flex flex-col justify-end">
                      <label className="flex items-center gap-4 cursor-pointer bg-swiggy-bg dark:bg-slate-800/50 h-14 px-6 rounded-2xl group border border-transparent hover:border-swiggy-primary/20 transition-all">
                         <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-swiggy-primary h-5 w-5" />
                         <span className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest">Active Status</span>
                      </label>
                   </div>
                </div>

                <div className="flex gap-4 pt-10">
                   <Button type="submit" className="flex-1 h-16">Deploy Promo Config</Button>
                   <Button variant="ghost" type="button" onClick={() => setShowModal(false)} className="px-10 h-16">Abort</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
}
