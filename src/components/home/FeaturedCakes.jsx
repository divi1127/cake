import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import chocoTruffle from '../../assets/choco-truffle.png';
import redVelvet from '../../assets/red-velvet.png';

const cakes = [
  {
    id: 1,
    name: 'Royal Chocolate Truffle',
    price: 650,
    rating: 4.9,
    image: chocoTruffle,
    category: 'Premium'
  },
  {
    id: 2,
    name: 'Velvet Dream Cake',
    price: 750,
    rating: 4.8,
    image: redVelvet,
    category: 'Best Seller'
  },
  {
    id: 3,
    name: 'Golden Vanilla Bliss',
    price: 450,
    rating: 4.7,
    image: chocoTruffle, // Placeholder
    category: 'Classic'
  },
  {
    id: 4,
    name: 'Berry White Forest',
    price: 550,
    rating: 4.9,
    image: redVelvet, // Placeholder
    category: 'Trending'
  }
];

export default function FeaturedCakes() {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Featured <span className="text-bakery-pink-500">Cakes</span></h2>
            <p className="text-bakery-chocolate/60 max-w-xl">
              Explore our hand-picked selection of the most loved cakes, crafted with precision and passion to make your moments unforgettable.
            </p>
          </div>
          <button className="text-bakery-pink-500 font-bold hover:underline">View All Products</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cakes.map((cake, index) => (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="glass-dark rounded-[40px] p-6 text-center card-hover overflow-hidden h-full flex flex-col">
                {/* Image Container */}
                <div className="relative mb-6 aspect-square rounded-[30px] overflow-hidden bg-bakery-pink-50 flex items-center justify-center p-4">
                  <img 
                    src={cake.image} 
                    alt={cake.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-bakery-chocolate">
                    {cake.category}
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-bakery-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                      onClick={() => toggleWishlist(cake)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 ${isInWishlist(cake.id) ? 'bg-bakery-pink-500 text-white' : 'bg-white text-bakery-chocolate hover:bg-bakery-pink-400 hover:text-white'}`}
                    >
                      <Heart size={18} fill={isInWishlist(cake.id) ? "currentColor" : "none"} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white text-bakery-chocolate flex items-center justify-center hover:bg-bakery-pink-400 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-center items-center gap-1 mb-2 text-bakery-gold-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-bakery-chocolate">{cake.rating}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-bakery-pink-500 transition-colors">{cake.name}</h3>
                  <p className="text-2xl font-bold text-bakery-chocolate/80">₹{cake.price}</p>
                </div>

                <button 
                  onClick={() => addToCart({...cake, weight: '1 KG'})}
                  className="mt-6 w-full btn-secondary py-3 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-bakery-pink-500 group-hover:text-white group-hover:border-bakery-pink-500 transition-all"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
