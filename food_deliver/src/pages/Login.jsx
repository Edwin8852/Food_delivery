import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/roleRedirect';
import { Card, Button } from '../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(getDashboardRoute());
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(getDashboardRoute());
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-md p-10 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-swiggy-bg dark:bg-slate-800 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner text-4xl">
             🔐
          </div>
          <h2 className="text-4xl font-black text-swiggy-heading dark:text-white tracking-tighter uppercase italic">Welcome <span className="text-swiggy-primary">Back</span></h2>
          <p className="text-[10px] font-black text-swiggy-secondary dark:text-slate-500 mt-2 tracking-[0.2em] uppercase">Authenticated Identity Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Email Terminal</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
              placeholder="name@nexus.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-swiggy-secondary uppercase tracking-[0.2em] ml-2">Secure Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-swiggy-bg dark:bg-slate-800 border-none rounded-2xl text-sm font-black text-swiggy-heading dark:text-white focus:ring-2 focus:ring-swiggy-primary/20 outline-none transition-all placeholder-swiggy-secondary/30"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full h-16 text-xs mt-4">Initialize Session</Button>
        </form>

        <div className="mt-10 pt-8 border-t border-swiggy-bg dark:border-slate-800 text-center">
          <p className="text-[10px] font-black text-swiggy-secondary uppercase tracking-widest">
            Identity missing?{' '}
            <Link to="/register" className="text-swiggy-primary hover:underline italic font-black">
              Create New Node
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
