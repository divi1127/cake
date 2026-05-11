import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Users, Cake, DollarSign, 
  TrendingUp, Clock, CheckCircle, XCircle, 
  Search, Filter, Plus, Edit, Trash, MapPin, Phone, User, Package, ChevronDown, ChevronUp, X, Upload, Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    userCount: 0,
    productCount: 0
  });

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: '',
    price: '',
    flavor: '',
    type: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem('bakery_token');

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchCategories();

    // Auto-refresh every 15 seconds to see customer updates
    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category_id', newProduct.category_id);
    formData.append('price', newProduct.price);
    formData.append('flavor', newProduct.flavor);
    formData.append('type', newProduct.type);
    formData.append('description', newProduct.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewProduct({ name: '', category_id: '', price: '', flavor: '', type: '', description: '' });
        setImageFile(null);
        fetchStats();
        alert('Product added successfully!');
      }
    } catch (err) {
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      fetchStats();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-bakery-chocolate">Admin <span className="text-bakery-pink-500">Dashboard</span></h1>
            <p className="text-bakery-chocolate/60">Manage your bakery inventory and live orders.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary py-3 px-6 flex items-center gap-2"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Sales', value: `₹${stats.totalSales}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
            { label: 'Total Orders', value: stats.orderCount, icon: ShoppingBag, color: 'bg-bakery-pink-50 text-bakery-pink-600' },
            { label: 'Total Users', value: stats.userCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Products', value: stats.productCount, icon: Cake, color: 'bg-orange-50 text-orange-600' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-[30px] border border-bakery-pink-50 shadow-sm flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}><stat.icon size={28} /></div>
              <div>
                <p className="text-bakery-chocolate/40 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-bakery-chocolate">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[40px] shadow-sm border border-bakery-pink-50 overflow-hidden">
          <div className="p-8 border-b border-bakery-pink-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-bakery-chocolate">Recent Orders</h3>
            <div className="flex gap-2">
              <button className="p-2 text-bakery-chocolate/40 hover:text-bakery-pink-500"><Search size={20} /></button>
              <button className="p-2 text-bakery-chocolate/40 hover:text-bakery-pink-500"><Filter size={20} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-bakery-chocolate/40 text-xs font-bold uppercase tracking-widest border-b border-bakery-pink-50 bg-bakery-pink-50/20">
                  <th className="py-4 px-8">Order ID</th>
                  <th className="py-4 px-8">Customer</th>
                  <th className="py-4 px-8">Delivery</th>
                  <th className="py-4 px-8">Total</th>
                  <th className="py-4 px-8">Status</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-pink-50">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="group hover:bg-bakery-pink-50/30 transition-colors">
                      <td className="py-6 px-8">
                        <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="flex items-center gap-2 font-bold text-bakery-chocolate hover:text-bakery-pink-500">
                          #ORD-{order.id} {expandedOrder === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td className="py-6 px-8 font-bold text-bakery-chocolate">{order.customer_name}</td>
                      <td className="py-6 px-8"><span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600">{order.delivery_method}</span></td>
                      <td className="py-6 px-8 font-bold text-bakery-pink-600">₹{order.total_amount}</td>
                      <td className="py-6 px-8"><span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-bakery-pink-100 text-bakery-pink-600">{order.status}</span></td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><CheckCircle size={18} /></button>
                          <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><XCircle size={18} /></button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="6" className="bg-bakery-pink-50/30 p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                              <h5 className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-4">Ordered Items</h5>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-bakery-pink-100">
                                    <div><p className="font-bold text-bakery-chocolate">{item.product_name}</p><p className="text-[10px] text-bakery-chocolate/60">{item.weight} • Qty: {item.quantity}</p></div>
                                    <p className="font-bold text-bakery-pink-600">₹{item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest mb-4">Customer Info</h5>
                              <div className="bg-white p-6 rounded-3xl border border-bakery-pink-100 space-y-3">
                                <p className="font-bold text-bakery-chocolate flex items-center gap-2"><MapPin size={14} className="text-bakery-pink-500" /> {order.address}</p>
                                <p className="text-sm text-bakery-chocolate/60 flex items-center gap-2"><Phone size={14} className="text-bakery-pink-500" /> {order.phone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-bakery-chocolate/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-bakery-pink-50 flex justify-between items-center bg-bakery-pink-50/30">
                <h3 className="text-2xl font-serif font-bold text-bakery-chocolate">Add New Product</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="e.g. Vanilla Bean Special" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Category</label>
                    <select required value={newProduct.category_id} onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400">
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Price (₹)</label>
                    <input required type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="450" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Flavor</label>
                    <input required type="text" value={newProduct.flavor} onChange={(e) => setNewProduct({...newProduct, flavor: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="e.g. Strawberry" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Type</label>
                    <input required type="text" value={newProduct.type} onChange={(e) => setNewProduct({...newProduct, type: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="e.g. Premium" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Product Image</label>
                    <div className="relative group cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-bakery-pink-50/50 border-2 border-dashed border-bakery-pink-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group-hover:border-bakery-pink-400 transition-colors">
                        {imageFile ? (
                          <div className="flex items-center gap-3 text-bakery-pink-600 font-bold">
                            <CheckCircle size={20} /> {imageFile.name}
                          </div>
                        ) : (
                          <>
                            <Upload className="text-bakery-pink-400" size={32} />
                            <p className="text-xs font-bold text-bakery-chocolate/40 uppercase tracking-widest">Click to upload photo</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Description</label>
                  <textarea required rows="3" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="Describe the cake..."></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-bakery-chocolate bg-bakery-pink-50 hover:bg-bakery-pink-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-bold text-white bg-bakery-pink-500 hover:bg-bakery-pink-600 transition-colors shadow-lg shadow-bakery-pink-200 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
