import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, Bell, ChevronRight, Clock, Star, Truck, CheckCircle, Loader2 } from 'lucide-react';
import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('bakery_user') || '{}');

  useEffect(() => {
    if (user.id) {
      fetchOrders();
    }
  }, [user.id]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmReceived = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/receive`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
        alert('Order marked as received! Thank you for shopping with us.');
      }
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
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
                    {order.status === 'delivered' && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-6 py-1.5 rounded-bl-3xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={12} /> Delivered
                      </div>
                    )}
                    
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
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Status</p>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-bakery-pink-50 text-bakery-pink-600 animate-pulse'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-bold text-bakery-pink-500 text-lg">₹{order.total_amount}</p>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-bakery-pink-50 rounded-xl flex items-center justify-center p-2">
                          <img src={chocoTruffle} alt="Cake" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-bakery-chocolate">{order.items[0]?.product_name || 'Bakery Items'}</p>
                          <p className="text-xs text-bakery-chocolate/60">and {order.items.length - 1} other items</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {order.status !== 'delivered' && (
                          <button 
                            onClick={() => confirmReceived(order.id)}
                            className="px-8 py-3 rounded-full bg-bakery-chocolate text-white font-bold text-sm hover:bg-bakery-pink-500 transition-all flex items-center gap-2 shadow-lg shadow-bakery-chocolate/20"
                          >
                            <CheckCircle size={18} /> I Received Order
                          </button>
                        )}
                        <button className="px-6 py-3 rounded-full border border-bakery-pink-100 font-bold text-sm text-bakery-chocolate hover:bg-bakery-pink-50 transition-colors">Track</button>
                      </div>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-bakery-pink-200">
                    <p className="text-bakery-chocolate/40 font-bold">You haven't placed any orders yet.</p>
                    <button className="mt-4 text-bakery-pink-500 font-bold" onClick={() => window.location.href='/categories'}>Start Shopping</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== 'orders' && (
              <div className="bg-white rounded-[40px] p-20 text-center text-bakery-chocolate/40 font-bold border border-bakery-pink-50">
                This section is coming soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}