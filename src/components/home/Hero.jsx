import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import heroImage from '../../assets/hero-cake.png';
import floatingCupcake from '../../assets/floating-cupcake.png';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bakery-cream-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bakery-pink-100/30 rounded-l-[100px] -z-10" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-64 h-64 border-[30px] border-bakery-pink-100 rounded-full opacity-20 -z-10"
      />

      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-bakery-pink-100 text-bakery-pink-600 rounded-full text-sm font-bold tracking-wider mb-4 uppercase">
              Handcrafted with Love
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Taste the Magic of <br />
              <span className="text-gradient">Premium Cakes</span>
            </h1>
            <p className="text-lg text-bakery-chocolate/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Elevate your celebrations with our exquisitely designed and deliciously crafted cakes. From classic favorites to custom masterpieces, we bring your sweet dreams to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link to="/categories" className="btn-primary flex items-center justify-center gap-2">
              Order Now <ArrowRight size={20} />
            </Link>
            <Link to="/custom-preorder" className="btn-secondary flex items-center justify-center gap-2">
              Customize Cake
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 flex items-center justify-center lg:justify-start gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-bakery-pink-200" />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex text-bakery-gold-500 mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-bakery-chocolate/60"><span className="font-bold text-bakery-chocolate">10k+</span> Happy Customers</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <img 
              src={heroImage} 
              alt="Premium Cake" 
              className="w-150 h-140 drop-shadow-2xl rounded-3xl"
            />
          </motion.div>

          {/* Discount Badge */}
          {/* <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 w-24 h-24 bg-white p-4 rounded-2xl shadow-xl z-20 flex flex-col items-center justify-center text-center"
          >
            <span className="text-2xl font-bold text-bakery-pink-500">20%</span>
            <span className="text-[10px] font-bold uppercase text-bakery-chocolate/40">Off Today</span>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
