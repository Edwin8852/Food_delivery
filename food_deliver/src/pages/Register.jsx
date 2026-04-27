import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/ui';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('USER');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role, phone);
            if (role === 'DELIVERY' || role === 'DELIVERY_PARTNER') {
                navigate('/delivery/dashboard');
            } else {
                navigate('/home');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fade-in my-10">
      <Card className="w-full max-w-lg p-10 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-swiggy-bg dark:bg-slate-800 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner text-4xl">
             🧬
          </div>
          <h2 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Create <span className="text-swiggy-primary">Node</span></h2>
          <p className="text-[10px] font-black text-swiggy-secondary dark:text-slate-500 mt-2 tracking-[0.2em] uppercase">Join the FoodieExpress Grid</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
                placeholder="name@ nexus.com"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Secure Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10}"
                className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
                placeholder="10-digit link"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Access Token</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Protocol Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all"
            >
              <option value="USER">Customer Segment</option>
              <option value="DELIVERY_PARTNER">Logistics Partner</option>
            </select>
          </div>

          <Button type="submit" className="w-full h-16 text-xs mt-4">Initialize Registration</Button>
        </form>

        <div className="mt-10 pt-8 border-t border-swiggy-bg dark:border-slate-800 text-center">
          <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="text-swiggy-primary font-black hover:underline italic">
              Access Session
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
