import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCakes from '../components/home/FeaturedCakes';
import { motion } from 'framer-motion';
import { Cake, Gift, Heart, Clock, Truck, ShieldCheck, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden pb-24 md:pb-0">
      <Hero />
      
      {/* Features Bar */}
      <section className="py-12 bg-bakery-pink-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Same day & Midnight" },
              { icon: ShieldCheck, title: "100% Secure", desc: "Safe payment methods" },
              { icon: Heart, title: "Premium Quality", desc: "Finest fresh ingredients" },
              { icon: Clock, title: "24/7 Support", desc: "Always here for you" },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-white/50 rounded-2xl border border-white"
              >
                <div className="w-12 h-12 rounded-full bg-bakery-pink-100 flex items-center justify-center text-bakery-pink-500">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-bakery-chocolate">{feature.title}</h3>
                  <p className="text-sm text-bakery-chocolate/60">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedCakes />

      {/* Categories Teaser */}
      <section className="py-24 bg-bakery-cream-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore Our <span className="text-bakery-pink-500">Sweet Categories</span></h2>
            <p className="text-bakery-chocolate/60 max-w-2xl mx-auto">
              From classic flavors to exotic creations, find the perfect cake for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Birthday', icon: Cake, color: 'bg-blue-50' },
              { name: 'Wedding', icon: Heart, color: 'bg-rose-50' },
              { name: 'Anniversary', icon: Gift, color: 'bg-purple-50' },
              { name: 'Kids', icon: Star, color: 'bg-yellow-50' },
              { name: 'Festival', icon: Gift, color: 'bg-orange-50' },
              { name: 'Custom', icon: Cake, color: 'bg-emerald-50' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className={`${cat.color} p-8 rounded-[40px] flex flex-col items-center gap-4 cursor-pointer border border-transparent hover:border-bakery-pink-200 transition-all`}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-bakery-pink-400 shadow-sm">
                  <cat.icon size={32} />
                </div>
                <span className="font-bold text-bakery-chocolate">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-[50px] overflow-hidden bg-bakery-chocolate p-12 md:p-20 text-white">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-bakery-pink-500/20 skew-x-12 translate-x-1/2" />
            <div className="relative z-10 max-w-2xl">
              <span className="text-bakery-pink-300 font-bold tracking-widest uppercase mb-4 block">Limited Time Offer</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Get 30% Off on Your <br /> First Wedding Cake</h2>
              <p className="text-white/70 text-lg mb-8">
                Make your special day even sweeter with our premium multi-tier wedding cakes. Use code: <span className="text-white font-bold bg-white/20 px-3 py-1 rounded-lg">WEDDING30</span>
              </p>
              <button className="btn-primary">Claim Offer Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Placeholder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-bakery-pink-50 rounded-2xl hover:border-bakery-pink-200 transition-colors">
                <h3 className="font-bold text-lg mb-2">How do I customize my cake?</h3>
                <p className="text-bakery-chocolate/60">You can use our Custom Cake Preorder system to select flavors, toppings, shapes, and even upload an inspiration image!</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}