import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, Cake, LogOut, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../context/ShopContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const { cartCount, wishlist } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Check for logged in user
    const savedUser = localStorage.getItem('bakery_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('bakery_token');
    localStorage.removeItem('bakery_user');
    setUser(null);
    setIsProfileOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Custom Cake', path: '/custom-preorder' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-10 h-10 bg-bakery-pink-400 rounded-lg flex items-center justify-center text-white"
          >
            <span className="font-serif text-2xl font-bold">B</span>
          </motion.div>
          <span className="font-serif text-2xl font-bold tracking-tight text-bakery-chocolate">
            Bakery<span className="text-bakery-pink-500">Bliss</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`font-medium transition-colors hover:text-bakery-pink-500 ${location.pathname === link.path ? 'text-bakery-pink-500' : 'text-bakery-chocolate'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button className="p-2 text-bakery-chocolate hover:text-bakery-pink-500 transition-colors">
            <Search size={20} />
          </button>
          
          <Link to="/dashboard?tab=wishlist" className="relative p-2 text-bakery-chocolate hover:text-bakery-pink-500 transition-colors">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-bakery-chocolate text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 text-bakery-chocolate hover:text-bakery-pink-500 transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-bakery-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 bg-bakery-pink-50 hover:bg-bakery-pink-100 px-4 py-2 rounded-full transition-all border border-bakery-pink-100"
              >
                <div className="w-8 h-8 bg-bakery-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-bold text-bakery-chocolate">{user.name}</span>
                  <span className="text-[9px] text-bakery-pink-500 uppercase font-bold tracking-wider">{user.role}</span>
                </div>
                <ChevronDown size={14} className={`text-bakery-chocolate transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl shadow-bakery-chocolate/10 border border-bakery-pink-50 overflow-hidden"
                  >
                    <div className="p-4 bg-bakery-pink-50/50 border-b border-bakery-pink-50">
                      <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest">Account</p>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard?tab=profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-bakery-chocolate hover:bg-bakery-pink-50 transition-colors">
                        <User size={18} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-bakery-pink-600 hover:bg-bakery-pink-50 transition-colors">
                          <Settings size={18} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-6 text-sm flex items-center gap-2">
              <User size={16} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-bakery-chocolate" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-bakery-pink-50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-bakery-chocolate py-2 border-b border-bakery-pink-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex justify-between py-4">
                <Link to="/cart" className="flex items-center gap-2 text-bakery-chocolate" onClick={() => setIsOpen(false)}>
                  <ShoppingCart size={20} /> Cart ({cartCount})
                </Link>
                {user ? (
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 text-red-400">
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-bakery-chocolate" onClick={() => setIsOpen(false)}>
                    <User size={20} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-bakery-pink-50 px-6 py-4 flex justify-between items-center z-50">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-bakery-pink-500' : 'text-bakery-chocolate/60'}`}>
          <Cake size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link to="/categories" className={`flex flex-col items-center gap-1 ${location.pathname === '/categories' ? 'text-bakery-pink-500' : 'text-bakery-chocolate/60'}`}>
          <Search size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Shop</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${location.pathname === '/cart' ? 'text-bakery-pink-500' : 'text-bakery-chocolate/60'}`}>
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-bakery-pink-500 text-white text-[10px] flex items-center justify-center rounded-full">{cartCount}</span>}
          <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
        </Link>
        <Link to={user ? "/dashboard" : "/login"} className={`flex flex-col items-center gap-1 relative ${location.pathname === '/dashboard' || location.pathname === '/login' ? 'text-bakery-pink-500' : 'text-bakery-chocolate/60'}`}>
          <User size={20} />
          {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-bakery-chocolate text-white text-[8px] flex items-center justify-center rounded-full">{wishlist.length}</span>}
          <span className="text-[10px] font-bold uppercase tracking-widest">{user ? 'Profile' : 'Login'}</span>
        </Link>
      </div>
    </nav>
  );
}
