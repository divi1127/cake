import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, LogIn, Phone, Calendar, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', birthday: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('bakery_all_users') || '[]');
    if (users.find(u => u.email === formData.email)) {
      alert('Email already registered! Please login.');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      role: 'user'
    };

    localStorage.setItem('bakery_all_users', JSON.stringify([...users, newUser]));
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-bakery-pink-100/50 border border-bakery-pink-50"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-bakery-chocolate mb-2">Join Us</h1>
          <p className="text-bakery-chocolate/60">Create your BakeryBliss account today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe" 
                className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">WhatsApp Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 00000 00000" 
                className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-bakery-chocolate/70">Birthday (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
              <input 
                type="date" 
                value={formData.birthday}
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2">
            Register <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-bakery-pink-50 text-center">
          <p className="text-bakery-chocolate/60 mb-4">Already have an account?</p>
          <Link to="/login" className="inline-flex items-center gap-2 text-bakery-pink-500 font-bold hover:gap-3 transition-all">
            <LogIn size={18} /> Login Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

