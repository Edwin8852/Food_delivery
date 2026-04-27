import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Card, Button, Badge } from './ui';

export default function DeliveryAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const initialFormState = {
    fullName: user?.name || '',
    mobile: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/address/user');
      setAddresses(res.data.data || []);
    } catch (err) { toast.error('Failed to load operational coordinates'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await api.put(`/address/${currentId}`, formData);
        toast.success('Coordinate Update Successful');
      } else {
        await api.post('/address/add', formData);
        toast.success('New Logistic Node established');
      }
      resetForm();
      fetchAddresses();
      setShowForm(false);
    } catch (err) { toast.error(err.userMessage || 'Operational fault during sync'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleEdit = (addr) => {
    setFormData({
      fullName: addr.fullName,
      mobile: addr.mobile,
      address: addr.address,
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: addr.isDefault
    });
    setIsEditing(true);
    setCurrentId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this operational coordinate?')) {
      try {
        await api.delete(`/address/${id}`);
        toast.success('Logistic Node Terminated');
        fetchAddresses();
      } catch (err) { toast.error('Deletion handshake fail'); }
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* 📍 Logistics Spine Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-slate-800 pb-10">
        <div>
          <h2 className="text-4xl font-black text-swiggy-heading dark:text-white uppercase italic tracking-tighter">Operational <span className="text-swiggy-primary">Nodes</span></h2>
          <p className="text-swiggy-secondary text-[10px] font-black uppercase tracking-[0.4em] mt-2">Logistics Infrastructure Registry</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Register New Node</Button>
        )}
      </div>

      {/* 📑 Node Registry Form */}
      {showForm && (
        <Card className="relative overflow-hidden group border-2 border-swiggy-primary/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-swiggy-primary/5 rounded-full -mr-32 -mt-32" />
          
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-swiggy-heading dark:text-white uppercase italic tracking-tighter">{isEditing ? 'Configure' : 'Initialize'} Node</h3>
              <p className="text-swiggy-secondary text-[10px] font-black uppercase tracking-widest mt-1">Establishing strategic delivery coordinates</p>
            </div>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-swiggy-bg dark:bg-slate-800 text-swiggy-secondary hover:text-swiggy-error transition-all">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Terminal Contact</label>
                <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl p-5 font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all outline-none" placeholder="Receiver Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Mobile Interface</label>
                <input required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl p-5 font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all outline-none" placeholder="10 Digit Secure Link" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Coordinate String (Address)</label>
              <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-[32px] p-6 font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all h-28 resize-none outline-none" placeholder="Complete address parameters..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">City Node</label>
                <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl p-4 font-black text-swiggy-heading dark:text-white outline-none" placeholder="City" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">State Sector</label>
                <input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl p-4 font-black text-swiggy-heading dark:text-white outline-none" placeholder="State" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-4">Zip Encryption</label>
                <input required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl p-4 font-black text-swiggy-heading dark:text-white outline-none" placeholder="Zip" />
              </div>
            </div>

            <div className="flex items-center gap-6 py-4">
               <label className="relative inline-flex items-center cursor-pointer group">
                <input type="checkbox" className="sr-only peer" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                <div className="w-14 h-8 bg-swiggy-bg dark:bg-slate-800 rounded-full peer peer-checked:bg-swiggy-primary after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[24px] after:w-[24px] after:transition-all peer-checked:after:translate-x-6"></div>
                <span className="ml-6 text-[10px] font-black uppercase tracking-[0.2em] text-swiggy-secondary peer-checked:text-swiggy-primary transition-colors">Set as Priority Node (Default)</span>
              </label>
            </div>

            <div className="flex gap-4 pt-6 border-t border-swiggy-bg dark:border-slate-800">
              <Button type="submit" disabled={loading} className="flex-1 h-16">{loading ? 'Processing...' : isEditing ? 'Push Updates' : 'Commit Entry'}</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }} className="px-12 h-16">Reject</Button>
            </div>
          </form>
        </Card>
      )}

      {/* 📡 Grid Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {addresses.map((addr) => (
          <Card key={addr.id} className="group relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-swiggy-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-swiggy-bg dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-swiggy-primary group-hover:text-white transition-all duration-500">
                {addr.addressType === 'HOME' ? '🏠' : '🏢'}
              </div>
              <div className="flex gap-2">
                 <button onClick={() => handleEdit(addr)} className="w-11 h-11 flex items-center justify-center bg-swiggy-bg dark:bg-slate-800 rounded-2xl hover:bg-swiggy-primary hover:text-white text-swiggy-secondary transition-all">✎</button>
                 <button onClick={() => handleDelete(addr.id)} className="w-11 h-11 flex items-center justify-center bg-swiggy-bg dark:bg-slate-800 rounded-2xl hover:bg-swiggy-error hover:text-white text-swiggy-secondary transition-all">✕</button>
              </div>
            </div>
            
            <div className="relative z-10 space-y-4">
               <div>
                  <h4 className="text-2xl font-black text-swiggy-heading dark:text-white uppercase italic tracking-tighter mb-1 truncate">{addr.fullName}</h4>
                  <div className="flex gap-3">
                     {addr.isDefault && <Badge status="online" children="PRIMARY NODE" />}
                     <Badge status="away" children={addr.addressType || "NODE"} />
                  </div>
               </div>
               
               <div className="min-h-[60px]">
                  <p className="text-swiggy-secondary text-sm font-bold leading-relaxed">{addr.address}</p>
                  <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest mt-1">{addr.city}, {addr.state} — {addr.pincode}</p>
               </div>

               <div className="pt-6 border-t border-swiggy-bg dark:border-slate-800 flex items-center justify-between">
                  <p className="text-[10px] font-black text-swiggy-heading dark:text-white uppercase tracking-widest flex items-center gap-3">
                    <span className="text-swiggy-primary text-base">📞</span> {addr.mobile}
                  </p>
                  <span className="text-[8px] font-black text-swiggy-secondary opacity-20 uppercase tracking-[0.3em]">SECURE LINK</span>
               </div>
            </div>
          </Card>
        ))}
        
        {addresses.length === 0 && !showForm && (
          <div className="lg:col-span-3 py-48 bg-swiggy-bg/50 dark:bg-slate-800/30 rounded-[64px] border-4 border-dashed border-swiggy-bg dark:border-slate-800 text-center group hover:bg-swiggy-bg transition-all">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl group-hover:scale-110 transition-transform shadow-sm">🛰️</div>
            <p className="text-swiggy-secondary font-black uppercase text-xs tracking-[0.4em] italic mb-10">No Operational Registers Found</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>Initialize Command Protocol</Button>
          </div>
        )}
      </div>
    </div>
  );
}
