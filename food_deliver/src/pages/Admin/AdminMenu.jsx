import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Card, Button } from "../../components/ui";

export default function AdminMenu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Main Course',
    is_available: true
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await api.get('/food');
      setFoods(response.data.data);
    } catch (err) {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingId) {
        await api.put(`/food/${editingId}`, formData);
        toast.success("Item updated successfully!");
      } else {
        await api.post('/food', formData);
        toast.success("New item added to menu!");
      }
      resetForm();
      fetchMenu();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category: 'Main Course', is_available: true });
  };

  const handleEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      image_url: food.image_url,
      category: food.category,
      is_available: food.is_available
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm deletion of this menu item?")) {
      try {
        await api.delete(`/food/${id}`);
        toast.success("Item removed from menu");
        fetchMenu();
      } catch {
        toast.error("Failed to delete item");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
       <div className="w-12 h-12 border-4 border-swiggy-bg border-t-swiggy-primary rounded-full animate-spin"></div>
       <span className="text-swiggy-secondary font-black uppercase text-[10px] tracking-widest animate-pulse">Syncing Catalog...</span>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      
      {/* 🍱 Tactical Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Culinary <span className="text-swiggy-primary">Catalog</span></h2>
          <p className="text-swiggy-secondary font-black text-[10px] uppercase tracking-widest mt-1">Manage flavor definitions, valuation, and node availability.</p>
        </div>
        <Button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          variant={showForm ? 'ghost' : 'primary'}
        >
          {showForm ? 'Discard Draft' : 'Register New Item'}
        </Button>
      </div>

      {/* 📝 Entity Form */}
      {showForm && (
        <Card className="shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-swiggy-primary/5 rounded-full -mr-16 -mt-16" />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-1">Entity Identity</label>
                   <input type="text" placeholder="e.g. Classic Truffle Pasta" className="w-full h-14 px-6 rounded-2xl bg-swiggy-bg dark:bg-slate-800 border-none outline-none font-bold text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all placeholder:text-swiggy-secondary/40" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-1">Valuation (₹)</label>
                   <input type="number" placeholder="Enter Price" className="w-full h-14 px-6 rounded-2xl bg-swiggy-bg dark:bg-slate-800 border-none outline-none font-bold text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all placeholder:text-swiggy-secondary/40" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-1">Grid Categorization</label>
                   <select className="w-full h-14 px-6 rounded-2xl bg-swiggy-bg dark:bg-slate-800 border-none outline-none font-bold text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} >
                     <option value="Main Course">Main Course</option>
                     <option value="Starters">Starters</option>
                     <option value="Snacks">Snacks</option>
                     <option value="Desserts">Desserts</option>
                     <option value="Beverages">Beverages</option>
                   </select>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-1">Visual Synchronizer (URL)</label>
                   <input type="text" placeholder="https://image-node.com/source.jpg" className="w-full h-14 px-6 rounded-2xl bg-swiggy-bg dark:bg-slate-800 border-none outline-none font-bold text-swiggy-secondary text-xs focus:ring-2 focus:ring-swiggy-primary/20 transition-all" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-swiggy-secondary uppercase tracking-widest ml-1">Payload Intel</label>
                   <textarea placeholder="Describe the culinary entity..." className="w-full px-6 py-4 rounded-2xl bg-swiggy-bg dark:bg-slate-800 border-none outline-none font-bold text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 transition-all min-h-[148px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
            </div>

            <Button type="submit" disabled={actionLoading} className="h-16 col-span-1 md:col-span-2">
               {actionLoading ? 'Synchronizing Node...' : (editingId ? 'Push Updates to Grid' : 'Initialize Culinary Entity')}
            </Button>
          </form>
        </Card>
      )}

      {/* 📊 Inventory Stream */}
      <Card noPadding className="shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-swiggy-bg dark:bg-slate-800/50">
                 <th className="p-8 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Culinary Entity</th>
                 <th className="p-8 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Group</th>
                 <th className="p-8 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Valuation</th>
                 <th className="p-8 text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">State</th>
                 <th className="p-8 text-right text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em]">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-swiggy-bg dark:divide-slate-800">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-swiggy-bg/30 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="p-8">
                     <div>
                        <p className="font-black text-swiggy-heading dark:text-white tracking-tight">{food.name}</p>
                        <p className="text-[9px] text-swiggy-secondary font-black uppercase tracking-widest mt-1 max-w-[250px] truncate">{food.description}</p>
                     </div>
                  </td>
                  <td className="p-8">
                     <span className="text-[9px] font-black text-swiggy-secondary bg-swiggy-bg dark:bg-slate-800 px-3 py-1 rounded-lg italic uppercase">{food.category}</span>
                  </td>
                  <td className="p-8 text-lg font-black text-swiggy-heading dark:text-white tracking-tighter">₹{food.price}</td>
                  <td className="p-8">
                     <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${food.is_available ? 'bg-swiggy-success/10 text-swiggy-success border-swiggy-success/20' : 'bg-swiggy-error/10 text-swiggy-error border-swiggy-error/20'}`}>
                        {food.is_available ? 'In Active Grid' : 'Passive State'}
                     </span>
                  </td>
                  <td className="p-8 text-right">
                     <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(food)} className="w-10 h-10 rounded-xl bg-swiggy-bg dark:bg-slate-800 text-swiggy-secondary hover:text-swiggy-primary transition-all flex items-center justify-center">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(food.id)} className="w-10 h-10 rounded-xl bg-swiggy-bg dark:bg-slate-800 text-swiggy-secondary hover:text-swiggy-error transition-all flex items-center justify-center">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                   <td colSpan="5" className="p-20 text-center">
                      <p className="text-swiggy-secondary font-black uppercase tracking-[0.3em] text-[10px]">Culinary Vault Empty</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
