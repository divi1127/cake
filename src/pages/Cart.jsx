import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useShop();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 1500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl font-serif font-bold mb-12">Your <span className="text-bakery-pink-500">Shopping Cart</span></h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.weight}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-bakery-pink-50"
                  >
                    <div className="w-24 h-24 bg-bakery-pink-50 rounded-2xl flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-lg font-bold text-bakery-chocolate">{item.name}</h3>
                      <p className="text-sm text-bakery-chocolate/60">{item.weight}</p>
                      <p className="text-bakery-pink-600 font-bold mt-1">₹{item.price}</p>
                    </div>

                    <div className="flex items-center bg-bakery-pink-50 rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.weight, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-bakery-chocolate transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-bakery-chocolate">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.weight, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-bakery-chocolate transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-bakery-chocolate text-lg">₹{item.price * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id, item.weight)}
                        className="text-red-400 hover:text-red-600 transition-colors mt-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Link to="/categories" className="inline-flex items-center gap-2 text-bakery-pink-500 font-bold hover:gap-3 transition-all">
                <ShoppingBag size={20} /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-[40px] p-8 border border-bakery-pink-50 shadow-xl shadow-bakery-pink-100/30">
                <h3 className="text-2xl font-serif font-bold mb-6 text-bakery-chocolate">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-bakery-chocolate/60">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-bakery-chocolate/60">
                    <span>Delivery Charge</span>
                    <span className="font-bold">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-bakery-chocolate/60">
                    <span>GST (5%)</span>
                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-bakery-pink-50 flex justify-between text-xl font-bold text-bakery-chocolate">
                    <span>Total</span>
                    <span className="text-bakery-pink-500">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="relative mb-8">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/40" size={18} />
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-bakery-pink-400"
                  />
                  <button className="absolute right-2 top-2 px-4 py-1 bg-bakery-chocolate text-white text-xs font-bold rounded-lg hover:bg-bakery-pink-500 transition-colors">Apply</button>
                </div>

                <Link to="/checkout" className="w-full btn-primary h-14 flex items-center justify-center gap-2 text-lg">
                  Checkout Now <ArrowRight size={20} />
                </Link>
              </div>

              {subtotal < 1500 && (
                <div className="p-6 bg-bakery-pink-50 rounded-[30px] border border-bakery-pink-100">
                  <h4 className="font-bold text-bakery-chocolate mb-2">Free Delivery</h4>
                  <p className="text-sm text-bakery-chocolate/60">Add items worth <span className="font-bold">₹{(1500 - subtotal).toFixed(2)}</span> more to get free delivery!</p>
                  <div className="w-full bg-white h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-bakery-pink-500 h-full" style={{ width: `${(subtotal / 1500) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-bakery-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-bakery-pink-500">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-2xl font-bold text-bakery-chocolate mb-4">Your cart is empty</h3>
            <p className="text-bakery-chocolate/60 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/categories" className="btn-primary">Browse Cakes</Link>
          </div>
        )}
      </div>
    </div>
  );
}