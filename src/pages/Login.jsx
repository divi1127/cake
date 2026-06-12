import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Default admin for testing
    if (email === 'admin@cake.com' && password === 'admin123') {
      const adminUser = { id: 0, name: 'Admin User', email: 'admin@cake.com', role: 'admin' };
      localStorage.setItem('bakery_user', JSON.stringify(adminUser));
      localStorage.setItem('bakery_token', 'simulated_token');
      navigate('/admin');
      return;
    }

    const users = JSON.parse(localStorage.getItem('bakery_all_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('bakery_user', JSON.stringify(user));
      localStorage.setItem('bakery_token', 'simulated_token');
      navigate('/dashboard');
    } else {
      alert('Invalid email or password!');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-bakery-pink-100/50 border border-bakery-pink-50"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-bakery-chocolate mb-2">Welcome Back</h1>
          <p className="text-bakery-chocolate/60">Log in to your BakeryBliss account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-bakery-pink-400" 
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30 hover:text-bakery-chocolate/60 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2">
            Login <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-bakery-pink-50 text-center">
          <p className="text-bakery-chocolate/60 mb-4">Don't have an account?</p>
          <Link to="/register" className="inline-flex items-center gap-2 text-bakery-pink-500 font-bold hover:gap-3 transition-all">
            <UserPlus size={18} /> Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
