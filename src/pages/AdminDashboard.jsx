import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Users, Cake, DollarSign, 
  TrendingUp, Clock, CheckCircle, XCircle, 
  Search, Filter, Plus, Edit, Trash, MapPin, Phone, User, Package, ChevronDown, ChevronUp, X, Upload, Loader2,
  MessageSquare, Send, Calendar, RefreshCw, AlertTriangle, FileText, CheckCircle2, AlertCircle
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

  // WhatsApp Automation States
  const [campaigns, setCampaigns] = useState([]);
  const [whatsappLogs, setWhatsappLogs] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  
  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'festival',
    message: '',
    template_name: 'hello_world',
    scheduled_time: ''
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
    fetchCampaigns();
    fetchWhatsappLogs();
    fetchAbandonedCarts();

    // Auto-refresh every 15 seconds to see customer updates
    const interval = setInterval(() => {
      fetchOrders();
      fetchStats();
      fetchWhatsappLogs();
      fetchAbandonedCarts();
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

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns');
      const data = await response.json();
      if (Array.isArray(data)) setCampaigns(data);
    } catch (err) { console.error(err); }
  };

  const fetchWhatsappLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/whatsapp/logs');
      const data = await response.json();
      if (Array.isArray(data)) setWhatsappLogs(data);
    } catch (err) { console.error(err); }
  };

  const fetchAbandonedCarts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/abandoned');
      const data = await response.json();
      if (Array.isArray(data)) setAbandonedCarts(data);
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

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignForm)
      });
      const data = await response.json();
      if (data.success) {
        setIsCampaignModalOpen(false);
        setCampaignForm({ name: '', type: 'festival', message: '', template_name: 'hello_world', scheduled_time: '' });
        fetchCampaigns();
        alert('Campaign created successfully!');
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      alert('Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  const triggerCampaignBroadcast = async (campaignId) => {
    if (!confirm('Are you sure you want to broadcast this campaign to all registered customers now?')) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}/trigger`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert(`Campaign broadcast completed successfully! Sent to ${data.sent_successfully} customers.`);
        fetchCampaigns();
        fetchWhatsappLogs();
      } else {
        alert(data.error || 'Failed to broadcast campaign');
      }
    } catch (err) {
      alert('Network error broadcasting campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    setSendingTest(true);
    try {
      const response = await fetch('http://localhost:5000/api/whatsapp/test-send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: testPhone })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Test hello_world template message sent successfully!');
        setIsTestModalOpen(false);
        setTestPhone('');
        fetchWhatsappLogs();
      } else {
        alert(data.error || 'Failed to send test message. Check verified developer phone numbers.');
      }
    } catch (err) {
      alert('Error sending test message');
    } finally {
      setSendingTest(false);
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
      fetchWhatsappLogs(); // Refresh logs to see the delivery status log update!
    } catch (err) { console.error(err); }
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-bakery-chocolate">Admin <span className="text-bakery-pink-500">Dashboard</span></h1>
            <p className="text-bakery-chocolate/60">Manage bakery products, orders, and automated WhatsApp CRM.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsTestModalOpen(true)}
              className="btn-secondary py-3 px-6 flex items-center gap-2 border-2 border-bakery-pink-200 text-bakery-pink-600 hover:bg-bakery-pink-50 rounded-2xl font-bold"
            >
              <Send size={18} /> Send Test WhatsApp
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary py-3 px-6 flex items-center gap-2 text-white bg-bakery-pink-500 hover:bg-bakery-pink-600 rounded-2xl font-bold"
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

        {/* Tab Navigation */}
        <div className="flex border-b border-bakery-pink-100 mb-8 overflow-x-auto gap-4 scrollbar-none">
          {[
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag },
            { id: 'campaigns', label: 'Offer & Campaigns', icon: MessageSquare },
            { id: 'abandonment', label: 'Cart Abandonment', icon: Clock },
            { id: 'logs', label: 'WhatsApp Logs', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 flex items-center gap-2 font-bold transition-all relative border-b-2 text-sm md:text-base whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-bakery-pink-500 text-bakery-pink-600' 
                  : 'border-transparent text-bakery-chocolate/55 hover:text-bakery-pink-500'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'abandonment' && abandonedCarts.filter(c => c.is_abandoned).length > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {abandonedCarts.filter(c => c.is_abandoned).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
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
                        <th className="py-4 px-8 text-right">Update Order (Triggers WhatsApp)</th>
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
                            <td className="py-6 px-8 font-bold text-bakery-chocolate">
                              {order.customer_name}
                              <div className="text-[10px] font-normal text-bakery-chocolate/60">{order.phone}</div>
                            </td>
                            <td className="py-6 px-8"><span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600">{order.delivery_method}</span></td>
                            <td className="py-6 px-8 font-bold text-bakery-pink-600">₹{order.total_amount}</td>
                            <td className="py-6 px-8">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                order.status === 'preparing' ? 'bg-orange-50 text-orange-600' :
                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                              }`}>{order.status}</span>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'preparing')} 
                                  title="Prepare Order"
                                  className="px-3 py-1 text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors border border-orange-200"
                                >
                                  Prepare
                                </button>
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'shipped')} 
                                  title="Ship Order"
                                  className="px-3 py-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-blue-200"
                                >
                                  Ship
                                </button>
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'delivered')} 
                                  title="Complete Delivery"
                                  className="px-3 py-1 text-xs font-bold bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors border border-green-200"
                                >
                                  Deliver
                                </button>
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')} 
                                  title="Cancel Order"
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                                >
                                  <XCircle size={15} />
                                </button>
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
            )}

            {/* CAMPAIGNS TAB */}
            {activeTab === 'campaigns' && (
              <div className="space-y-8">
                {/* Campaigns Top Controls */}
                <div className="bg-white rounded-[40px] p-8 border border-bakery-pink-50 shadow-sm flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-bakery-chocolate">Offers & Marketing Campaigns</h3>
                    <p className="text-sm text-bakery-chocolate/60">Broadcast bulk promotions, weekend discounts, and birthday alerts to registered users.</p>
                  </div>
                  <button 
                    onClick={() => setIsCampaignModalOpen(true)}
                    className="py-3 px-6 text-white bg-bakery-pink-500 hover:bg-bakery-pink-600 rounded-2xl font-bold flex items-center gap-2"
                  >
                    <Plus size={20} /> Create New Campaign
                  </button>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaigns.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-12 border border-dashed border-bakery-pink-200 text-center md:col-span-2 space-y-4">
                      <MessageSquare className="mx-auto text-bakery-pink-300" size={48} />
                      <h4 className="font-bold text-bakery-chocolate text-lg">No marketing campaigns yet</h4>
                      <p className="text-sm text-bakery-chocolate/60 max-w-sm mx-auto">Create a campaign to send bulk weekend offers, festival coupon campaigns, or customized WhatsApp alerts to all customers.</p>
                    </div>
                  ) : (
                    campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-white rounded-[40px] border border-bakery-pink-50 p-8 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                              <h4 className="font-bold text-bakery-chocolate text-xl">{campaign.name}</h4>
                              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                campaign.type === 'festival' ? 'bg-red-50 text-red-600' :
                                campaign.type === 'weekend' ? 'bg-orange-50 text-orange-600' :
                                campaign.type === 'birthday' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                              }`}>{campaign.type} Campaign</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              campaign.status === 'sent' ? 'bg-green-50 text-green-600' :
                              campaign.status === 'scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                            }`}>{campaign.status}</span>
                          </div>
                          
                          <p className="text-sm text-bakery-chocolate/70 bg-bakery-cream-50/50 p-4 rounded-2xl border border-bakery-pink-50 mb-6 italic">
                            "{campaign.message}"
                          </p>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-bakery-chocolate/55">
                              <Calendar size={14} /> Created: {new Date(campaign.created_at).toLocaleString()}
                            </div>
                            {campaign.scheduled_time && (
                              <div className="flex items-center gap-2 text-xs text-bakery-chocolate/55">
                                <Clock size={14} /> Scheduled: {new Date(campaign.scheduled_time).toLocaleString()}
                              </div>
                            )}
                            {campaign.status === 'sent' && (
                              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                <CheckCircle size={14} /> Total Broadcasts Delivered: {campaign.sent_count} users
                              </div>
                            )}
                          </div>
                        </div>

                        {campaign.status !== 'sent' && (
                          <button
                            onClick={() => triggerCampaignBroadcast(campaign.id)}
                            className="w-full py-3 bg-bakery-pink-500 hover:bg-bakery-pink-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <Send size={16} /> Broadcast Bulk Now
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CART ABANDONMENT TAB */}
            {activeTab === 'abandonment' && (
              <div className="bg-white rounded-[40px] border border-bakery-pink-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-bakery-pink-50">
                  <h3 className="text-xl font-bold text-bakery-chocolate">Cart Abandonment Automation Dashboard</h3>
                  <p className="text-sm text-bakery-chocolate/60">Automated node-cron checks active carts and sends reminder alerts 1 hour after cart inactivity.</p>
                </div>
                <div className="overflow-x-auto">
                  {abandonedCarts.length === 0 ? (
                    <div className="p-12 text-center text-bakery-chocolate/60">No customer carts found in sync queue.</div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-bakery-chocolate/40 text-xs font-bold uppercase tracking-widest border-b border-bakery-pink-50 bg-bakery-pink-50/20">
                          <th className="py-4 px-8">Customer Name</th>
                          <th className="py-4 px-8">WhatsApp Number</th>
                          <th className="py-4 px-8">Cart Items</th>
                          <th className="py-4 px-8">Potential Total</th>
                          <th className="py-4 px-8">Last Updated</th>
                          <th className="py-4 px-8">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bakery-pink-50">
                        {abandonedCarts.map((cart) => (
                          <tr key={cart.id} className="hover:bg-bakery-pink-50/30 transition-colors">
                            <td className="py-6 px-8 font-bold text-bakery-chocolate">{cart.customer_name || 'Anonymous Guest'}</td>
                            <td className="py-6 px-8 font-semibold text-bakery-chocolate/80">{cart.phone}</td>
                            <td className="py-6 px-8">
                              <div className="flex flex-col gap-1">
                                {(cart.items || []).map((item, idx) => (
                                  <span key={idx} className="text-xs text-bakery-chocolate/70">
                                    • {item.name || item.product_name} (x{item.quantity})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-6 px-8 font-bold text-bakery-pink-600">₹{cart.total_amount}</td>
                            <td className="py-6 px-8 text-xs text-bakery-chocolate/55">{new Date(cart.updated_at).toLocaleString()}</td>
                            <td className="py-6 px-8">
                              {cart.is_abandoned === 0 ? (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-600 flex items-center w-fit gap-1"><CheckCircle2 size={10} /> Converted</span>
                              ) : cart.reminder_sent === 1 ? (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-50 text-yellow-600 flex items-center w-fit gap-1"><Send size={10} /> Reminder Sent</span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-600 flex items-center w-fit gap-1"><Clock size={10} /> Abandoned (Waiting)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* WHATSAPP LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="bg-white rounded-[40px] border border-bakery-pink-50 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-bakery-pink-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-bakery-chocolate">Meta WhatsApp Audit logs</h3>
                    <p className="text-sm text-bakery-chocolate/60">Live audit timeline of automated and manual WhatsApp transmissions.</p>
                  </div>
                  <button onClick={fetchWhatsappLogs} className="p-3 text-bakery-pink-500 hover:bg-bakery-pink-50 rounded-2xl transition-colors border border-bakery-pink-100 flex items-center gap-2 font-bold text-sm">
                    <RefreshCw size={16} /> Refresh logs
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {whatsappLogs.length === 0 ? (
                    <div className="p-12 text-center text-bakery-chocolate/60">No WhatsApp messages dispatched yet. Register users or place orders to test.</div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-bakery-chocolate/40 text-xs font-bold uppercase tracking-widest border-b border-bakery-pink-50 bg-bakery-pink-50/20">
                          <th className="py-4 px-8">Time</th>
                          <th className="py-4 px-8">Recipient</th>
                          <th className="py-4 px-8">Type</th>
                          <th className="py-4 px-8">Template Used</th>
                          <th className="py-4 px-8">Status</th>
                          <th className="py-4 px-8">Meta API Logs / Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bakery-pink-50">
                        {whatsappLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-bakery-pink-50/30 transition-colors">
                            <td className="py-6 px-8 text-xs text-bakery-chocolate/60">{new Date(log.created_at).toLocaleString()}</td>
                            <td className="py-6 px-8 font-bold text-bakery-chocolate">{log.recipient_phone}</td>
                            <td className="py-6 px-8 font-semibold text-bakery-chocolate/85">{log.message_type}</td>
                            <td className="py-6 px-8 text-xs bg-bakery-cream-50/30 rounded-lg p-2 font-mono border border-bakery-pink-50/50 w-fit">{log.template_name}</td>
                            <td className="py-6 px-8">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                                log.status === 'sent' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                              }`}>
                                {log.status === 'sent' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                                {log.status}
                              </span>
                            </td>
                            <td className="py-6 px-8 text-xs text-bakery-chocolate/60">
                              {log.error_message ? (
                                <span className="text-red-500 font-medium flex items-start gap-1">
                                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                                  {log.error_message}
                                </span>
                              ) : (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={12} /> Delivered Successfully
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {isCampaignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCampaignModalOpen(false)} className="absolute inset-0 bg-bakery-chocolate/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-bakery-pink-50 flex justify-between items-center bg-bakery-pink-50/30">
                <h3 className="text-2xl font-serif font-bold text-bakery-chocolate flex items-center gap-2"><MessageSquare className="text-bakery-pink-500" /> Create Campaign</h3>
                <button onClick={() => setIsCampaignModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleAddCampaign} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Campaign Name</label>
                    <input required type="text" value={campaignForm.name} onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="e.g. Diwali Extravaganza Offer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/60">Campaign Type</label>
                      <select required value={campaignForm.type} onChange={(e) => setCampaignForm({...campaignForm, type: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400">
                        <option value="festival">Festival Campaign</option>
                        <option value="weekend">Weekend Discount</option>
                        <option value="coupon">Coupon Promo</option>
                        <option value="birthday">Birthday Campaign</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/60">Meta Template</label>
                      <select required value={campaignForm.template_name} onChange={(e) => setCampaignForm({...campaignForm, template_name: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400 font-mono text-xs">
                        <option value="hello_world">hello_world (Default Test)</option>
                        <option value="campaign_offer">campaign_offer (Production)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Schedule Date & Time (Optional)</label>
                    <input type="datetime-local" value={campaignForm.scheduled_time} onChange={(e) => setCampaignForm({...campaignForm, scheduled_time: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" />
                    <p className="text-[10px] text-bakery-chocolate/50">Leave empty to broadcast manually whenever you choose.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">Message Offer Text</label>
                    <textarea required rows="4" value={campaignForm.message} onChange={(e) => setCampaignForm({...campaignForm, message: e.target.value})} className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400" placeholder="e.g. Celebrate Diwali with 25% off all premium truffle cakes! Use coupon DIWALI25 at checkout. Valid till Sunday!"></textarea>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsCampaignModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-bakery-chocolate bg-bakery-pink-50 hover:bg-bakery-pink-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-bold text-white bg-bakery-pink-500 hover:bg-bakery-pink-600 transition-colors shadow-lg shadow-bakery-pink-200 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : 'Schedule Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Send Test WhatsApp Modal */}
      <AnimatePresence>
        {isTestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTestModalOpen(false)} className="absolute inset-0 bg-bakery-chocolate/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-bakery-pink-50 flex justify-between items-center bg-bakery-pink-50/30">
                <h3 className="text-2xl font-serif font-bold text-bakery-chocolate flex items-center gap-2"><Send className="text-bakery-pink-500" /> Send Test Message</h3>
                <button onClick={() => setIsTestModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSendTestMessage} className="p-8 space-y-6">
                <div className="bg-bakery-pink-50/50 p-4 rounded-2xl border border-bakery-pink-100 text-xs text-bakery-chocolate/70 leading-relaxed space-y-2">
                  <div className="font-bold flex items-center gap-1 text-bakery-pink-600"><AlertTriangle size={14} /> Meta Sandbox Guidelines</div>
                  <p>Meta sandbox accounts can only dispatch WhatsApp messages to **pre-registered verified developer numbers** (configured inside your Facebook App dashboard). Example test number: **916369199664**.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Recipient Phone Number (with Country Code)</label>
                  <input 
                    required 
                    type="tel" 
                    value={testPhone} 
                    onChange={(e) => setTestPhone(e.target.value)} 
                    className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-bakery-pink-400 font-semibold" 
                    placeholder="e.g. 916369199664" 
                  />
                  <p className="text-[10px] text-bakery-chocolate/50">Ensure country code is prefix (do not use + sign or leading zeros).</p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsTestModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-bakery-chocolate bg-bakery-pink-50 hover:bg-bakery-pink-100 transition-colors">Cancel</button>
                  <button type="submit" disabled={sendingTest || !testPhone} className="flex-[2] py-4 rounded-2xl font-bold text-white bg-bakery-pink-500 hover:bg-bakery-pink-600 transition-colors shadow-lg shadow-bakery-pink-200 flex items-center justify-center gap-2">
                    {sendingTest ? <Loader2 className="animate-spin" /> : 'Send hello_world'}
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
