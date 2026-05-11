import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone, Mail, User, ShieldCheck, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const { cart, clearCart } = useShop();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 1500 || deliveryMethod === 'pickup' ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all shipping details.');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('bakery_user') || '{}');
      const orderData = {
        user_id: user.id || null,
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        delivery_method: deliveryMethod,
        total_amount: total,
        items: cart
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.success) {
        setOrderPlaced(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[50px] p-12 text-center max-w-lg shadow-2xl shadow-bakery-pink-100/50 w-full"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={64} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-bakery-chocolate mb-4">Order Placed!</h1>
          <p className="text-bakery-chocolate/60 mb-8 leading-relaxed">
            Thank you for your order. We've received your request and our chefs are getting ready to bake your delicious treat.
          </p>
          <div className="bg-bakery-pink-50 p-6 rounded-3xl mb-8 flex justify-between items-center text-sm">
            <div className="text-left">
              <p className="text-bakery-chocolate/40 font-bold uppercase tracking-widest text-[10px]">Status</p>
              <p className="font-bold text-bakery-chocolate">Pending Approval</p>
            </div>
            <div className="text-right">
              <p className="text-bakery-chocolate/40 font-bold uppercase tracking-widest text-[10px]">Estimated Delivery</p>
              <p className="font-bold text-bakery-chocolate">Today, 6:00 PM</p>
            </div>
          </div>
          <button className="btn-primary w-full py-4 text-lg" onClick={() => window.location.href = '/'}>Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-serif font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-bakery-pink-50">
              <h3 className="text-2xl font-bold text-bakery-chocolate mb-8 flex items-center gap-3">
                <MapPin className="text-bakery-pink-500" size={24} /> Shipping Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name" 
                      className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/30" size={18} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 00000 00000" 
                      className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-bakery-chocolate/30" size={18} />
                    <textarea 
                      rows="3" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="House No, Street, Landmark, City" 
                      className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-bakery-pink-50">
              <h3 className="text-2xl font-bold text-bakery-chocolate mb-8 flex items-center gap-3">
                <Truck className="text-bakery-pink-500" size={24} /> Delivery Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeliveryMethod('home')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${deliveryMethod === 'home' ? 'border-bakery-pink-500 bg-bakery-pink-50' : 'border-bakery-pink-50 hover:border-bakery-pink-200'}`}
                >
                  <h4 className={`font-bold ${deliveryMethod === 'home' ? 'text-bakery-pink-600' : 'text-bakery-chocolate'}`}>Home Delivery</h4>
                  <p className="text-sm text-bakery-chocolate/60 mt-1">Safe & fast delivery to your doorstep.</p>
                </button>
                <button 
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${deliveryMethod === 'pickup' ? 'border-bakery-pink-500 bg-bakery-pink-50' : 'border-bakery-pink-50 hover:border-bakery-pink-200'}`}
                >
                  <h4 className={`font-bold ${deliveryMethod === 'pickup' ? 'text-bakery-pink-600' : 'text-bakery-chocolate'}`}>Store Pickup</h4>
                  <p className="text-sm text-bakery-chocolate/60 mt-1">Pick up your order from our bakery.</p>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-bakery-pink-50">
              <h3 className="text-2xl font-bold text-bakery-chocolate mb-8 flex items-center gap-3">
                <CreditCard className="text-bakery-pink-500" size={24} /> Payment Method
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-6 rounded-2xl border-2 border-bakery-pink-50 hover:border-bakery-pink-200 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <CreditCard className="text-bakery-pink-500" size={24} />
                    <span className="font-bold text-bakery-chocolate">Cash on Delivery</span>
                  </div>
                  <input type="radio" name="payment" className="w-5 h-5 accent-bakery-pink-500" defaultChecked />
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="space-y-6">
            <div className="bg-bakery-chocolate text-white rounded-[40px] p-8 shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery</span>
                  <span className="font-bold">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>GST (5%)</span>
                  <span className="font-bold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-bakery-pink-300">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                disabled={loading || cart.length === 0}
                className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Place Order <ChevronRight size={20} /></>}
              </button>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-bakery-pink-50 text-center">
              <div className="w-16 h-16 bg-bakery-pink-50 text-bakery-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-bold text-bakery-chocolate mb-2">Secure Checkout</h4>
              <p className="text-sm text-bakery-chocolate/60">Your order details will be stored securely in our database.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}