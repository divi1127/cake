import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    image: 'https://i.pinimg.com/1200x/d5/8f/cc/d58fcc4079867dbf841cb40c501a4a64.jpg',
    category: 'Classic'
  },
  {
    id: 4,
    name: 'Berry White Forest',
    price: 550,
    rating: 4.9,
    image: 'https://i.pinimg.com/1200x/cc/95/82/cc958282b61c2d5e98c2a7cc23b60949.jpg',
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
          <Link to="/categories" className="text-bakery-pink-500 font-bold hover:underline">View All Products</Link>
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

                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-center items-center gap-1 mb-2 text-bakery-gold-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-bakery-chocolate">{cake.rating}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-bakery-pink-500 transition-colors">{cake.name}</h3>
                  <p className="text-2xl font-bold text-bakery-chocolate/80">from ₹{cake.price}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
