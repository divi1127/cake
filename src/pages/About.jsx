import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShieldCheck, Users, Award, Clock, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Bakery Kitchen" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-bakery-pink-400 rounded-[50px] -z-10 animate-float" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-bakery-pink-100/50 rounded-full blur-3xl -z-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-bakery-pink-500 font-bold uppercase tracking-widest text-sm mb-4 block">Our Heritage</span>
              <h1 className="text-4xl md:text-6xl font-bold text-bakery-chocolate mb-6">A Legacy of <br /> <span className="text-gradient">Sweetness & Love</span></h1>
              <p className="text-bakery-chocolate/70 leading-relaxed text-lg">
                Founded in 2010, BakeryBliss started as a small family kitchen with a big dream: to create the most exquisite cakes that don't just look beautiful but taste like a slice of heaven.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="text-4xl font-serif font-bold text-bakery-pink-500">15+</h4>
                <p className="font-bold text-bakery-chocolate">Years of Experience</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-serif font-bold text-bakery-pink-500">100k+</h4>
                <p className="font-bold text-bakery-chocolate">Cakes Delivered</p>
              </div>
            </div>

            <button className="btn-primary">Learn More About Us</button>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-bakery-pink-500">BakeryBliss</span>?</h2>
            <p className="text-bakery-chocolate/60 max-w-2xl mx-auto">We take pride in our commitment to quality, hygiene, and the art of fine baking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Premium Quality", desc: "We use only the finest imported chocolate and farm-fresh ingredients." },
              { icon: UtensilsCrossed, title: "Expert Chefs", desc: "Our master bakers have years of international experience." },
              { icon: Sparkles, title: "Custom Designs", desc: "Every cake is a unique masterpiece tailored to your vision." },
              { icon: Heart, title: "Baked with Love", desc: "No preservatives, just pure home-baked goodness." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[40px] shadow-sm border border-bakery-pink-50 text-center hover:shadow-xl hover:shadow-bakery-pink-100/50 transition-all card-hover"
              >
                <div className="w-16 h-16 bg-bakery-pink-50 rounded-2xl flex items-center justify-center text-bakery-pink-500 mx-auto mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-bakery-chocolate mb-4">{item.title}</h3>
                <p className="text-sm text-bakery-chocolate/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Chef Introduction */}
        <div className="bg-bakery-chocolate rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <span className="px-4 py-1.5 bg-bakery-pink-500 text-white rounded-full text-xs font-bold uppercase tracking-widest">Master Chef</span>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Meet the Artist Behind <br /> the Flavors</h2>
              <p className="text-white/70 leading-relaxed text-lg">
                "Baking is more than just following a recipe; it's a symphony of flavors and a labor of love. Every cake we create at BakeryBliss is a piece of my heart delivered to yours."
              </p>
              <div>
                <p className="text-2xl font-serif font-bold text-bakery-pink-300">Chef Isabella Rossi</p>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-1">Founding Pastry Chef</p>
              </div>
              <div className="flex gap-4">
                <Award className="text-bakery-pink-400" size={32} />
                <Award className="text-bakery-pink-400" size={32} />
                <Award className="text-bakery-pink-400" size={32} />
              </div>
            </div>
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden border-4 border-white/10 relative">
              <img 
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Chef" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-bakery-pink-500/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}