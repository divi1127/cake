import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, Bell, ChevronRight, Clock, Star, Truck, CheckCircle, Loader2, Cake, ShoppingCart, Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';


export default function Dashboard() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'orders';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('bakery_user') || '{}');
  const { wishlist, toggleWishlist, addToCart } = useShop();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [location.search]);

  useEffect(() => {
    // Simulated local loading
    const timer = setTimeout(() => {
      const localOrders = JSON.parse(localStorage.getItem('bakery_orders') || '[]');
      const localPreorders = JSON.parse(localStorage.getItem('bakery_preorders') || '[]');
      setOrders(localOrders);
      setPreorders(localPreorders);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const confirmReceived = (orderId) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o);
    setOrders(updatedOrders);
    localStorage.setItem('bakery_orders', JSON.stringify(updatedOrders));
    alert('Order marked as received! Thank you for shopping with us.');
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'preorders', label: 'Custom Requests', icon: Cake },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[40px] p-8 border border-bakery-pink-50 shadow-sm text-center">
              <div className="w-24 h-24 bg-bakery-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" className="w-full h-full" />
              </div>
              <h2 className="text-xl font-bold text-bakery-chocolate">{user.name}</h2>
              <p className="text-sm text-bakery-chocolate/60">{user.email}</p>
              <button className="mt-6 w-full py-2 bg-bakery-pink-50 text-bakery-pink-600 rounded-full text-sm font-bold hover:bg-bakery-pink-100 transition-colors">Edit Profile</button>
            </div>

            <nav className="bg-white rounded-[40px] p-4 border border-bakery-pink-50 shadow-sm">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-bakery-pink-500 text-white shadow-lg shadow-bakery-pink-200' : 'text-bakery-chocolate/60 hover:bg-bakery-pink-50 hover:text-bakery-chocolate'}`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all mt-4 border-t border-bakery-pink-50 pt-8" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
                <LogOut size={20} />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-bakery-chocolate">My Orders</h3>
                  <p className="text-bakery-chocolate/40 font-bold">{orders.length} total orders</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-bakery-pink-500" size={40} /></div>
                ) : orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[30px] p-8 border border-bakery-pink-50 shadow-sm overflow-hidden relative">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-bakery-pink-50">
                      <div>
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="font-bold text-bakery-chocolate text-lg">#ORD-{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Date</p>
                        <p className="font-bold text-bakery-chocolate">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-bold text-bakery-pink-500 text-lg">₹{order.total_amount}</p>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex -space-x-4 overflow-hidden">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-12 h-12 rounded-full border-4 border-white bg-bakery-pink-50 flex items-center justify-center p-2 shadow-sm">
                            <img src={item.image || chocoTruffle} alt="Item" className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <button className="px-8 py-3 rounded-full bg-bakery-pink-500 text-white font-bold text-sm hover:bg-bakery-chocolate transition-all flex items-center gap-2 shadow-lg shadow-bakery-pink-200">
                           Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-bakery-pink-200">
                    <Package className="mx-auto text-bakery-pink-200 mb-4" size={48} />
                    <p className="text-bakery-chocolate/40 font-bold">You haven't placed any orders yet.</p>
                    <button className="mt-4 text-bakery-pink-500 font-bold" onClick={() => window.location.href='/categories'}>Start Shopping</button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'preorders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-bakery-chocolate">Custom Requests</h3>
                  <p className="text-bakery-chocolate/40 font-bold">{preorders.length} requests</p>
                </div>

                {preorders.map((pre) => (
                  <div key={pre.id} className="bg-white rounded-[30px] p-8 border border-bakery-pink-50 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-bakery-pink-100 text-bakery-pink-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{pre.eventType}</span>
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending Review</span>
                        </div>
                        <h4 className="text-xl font-bold text-bakery-chocolate">{pre.theme || 'Custom Design'}</h4>
                        <p className="text-sm text-bakery-chocolate/60">Date Requested: {new Date(pre.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Estimated Weight</p>
                        <p className="font-bold text-bakery-chocolate">{pre.weight}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 border-t border-bakery-pink-50">
                      <div className="flex items-center gap-2 text-sm text-bakery-chocolate/60">
                         <Star size={16} className="text-bakery-pink-500" />
                         <span>Shape: <strong>{pre.shape}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}

                {preorders.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-bakery-pink-200">
                    <Cake className="mx-auto text-bakery-pink-200 mb-4" size={48} />
                    <p className="text-bakery-chocolate/40 font-bold">No custom requests yet.</p>
                    <button className="mt-4 text-bakery-pink-500 font-bold" onClick={() => window.location.href='/custom-preorder'}>Design a Cake</button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-bakery-chocolate">My Wishlist</h3>
                  <p className="text-bakery-chocolate/40 font-bold">{wishlist.length} saved items</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white rounded-[30px] p-6 border border-bakery-pink-50 shadow-sm flex gap-6 group">
                      <div className="w-24 h-24 bg-bakery-pink-50 rounded-2xl flex items-center justify-center p-3">
                        <img src={item.image || chocoTruffle} alt="Cake" className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-bakery-chocolate text-lg">{item.name}</h4>
                          <p className="text-bakery-pink-600 font-bold">₹{item.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => addToCart({...item, weight: '1 KG'})}
                            className="p-2 bg-bakery-chocolate text-white rounded-lg hover:bg-bakery-pink-500 transition-colors"
                          >
                            <ShoppingCart size={18} />
                          </button>
                          <button 
                            onClick={() => toggleWishlist(item)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {wishlist.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-bakery-pink-200">
                    <Heart className="mx-auto text-bakery-pink-200 mb-4" size={48} />
                    <p className="text-bakery-chocolate/40 font-bold">Your wishlist is empty.</p>
                    <button className="mt-4 text-bakery-pink-500 font-bold" onClick={() => window.location.href='/categories'}>Explore Cakes</button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-serif font-bold text-bakery-chocolate">Account Profile</h3>
                </div>

                <div className="bg-white rounded-[40px] p-8 md:p-12 border border-bakery-pink-50 shadow-sm space-y-10">
                  <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-bakery-pink-50">
                    <div className="w-32 h-32 bg-bakery-pink-100 rounded-full flex items-center justify-center border-8 border-bakery-cream-50 shadow-xl overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="User" className="w-full h-full" />
                    </div>
                    <div className="text-center md:text-left">
                      <h4 className="text-3xl font-bold text-bakery-chocolate mb-2">{user.name}</h4>
                      <p className="text-bakery-chocolate/60 flex items-center justify-center md:justify-start gap-2">
                        <Mail size={16} /> {user.email}
                      </p>
                      <div className="mt-4 flex gap-3 justify-center md:justify-start">
                        <span className="px-4 py-1.5 bg-bakery-pink-500 text-white rounded-full text-xs font-bold uppercase tracking-widest">{user.role}</span>
                        <span className="px-4 py-1.5 bg-bakery-pink-50 text-bakery-pink-600 rounded-full text-xs font-bold uppercase tracking-widest">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h5 className="font-bold text-bakery-chocolate uppercase tracking-widest text-xs opacity-40">Personal Information</h5>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-bakery-cream-50 rounded-xl flex items-center justify-center text-bakery-pink-500"><Phone size={20} /></div>
                          <div>
                            <p className="text-[10px] font-bold text-bakery-chocolate/40 uppercase">Phone Number</p>
                            <p className="font-bold text-bakery-chocolate">{user.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-bakery-cream-50 rounded-xl flex items-center justify-center text-bakery-pink-500"><Calendar size={20} /></div>
                          <div>
                            <p className="text-[10px] font-bold text-bakery-chocolate/40 uppercase">Birthday</p>
                            <p className="font-bold text-bakery-chocolate">{user.birthday || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="font-bold text-bakery-chocolate uppercase tracking-widest text-xs opacity-40">Account Activity</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bakery-cream-50 p-6 rounded-[30px] text-center">
                          <p className="text-2xl font-bold text-bakery-chocolate">{orders.length}</p>
                          <p className="text-[10px] font-bold text-bakery-chocolate/40 uppercase">Orders</p>
                        </div>
                        <div className="bg-bakery-cream-50 p-6 rounded-[30px] text-center">
                          <p className="text-2xl font-bold text-bakery-chocolate">{wishlist.length}</p>
                          <p className="text-[10px] font-bold text-bakery-chocolate/40 uppercase">Wishlist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'addresses' || activeTab === 'settings') && (
              <div className="bg-white rounded-[40px] p-20 text-center text-bakery-chocolate/40 font-bold border border-bakery-pink-50">
                <Settings className="mx-auto mb-4 animate-spin-slow" size={48} />
                The {activeTab} section is under maintenance. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}