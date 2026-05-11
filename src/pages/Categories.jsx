import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingCart, Heart, Star, Eye, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

const categoryData = [
  { id: 1, name: 'Regular Cakes', price: 450, desc: 'Simple daily cakes with classic flavors and affordable pricing.', image: chocoTruffle, count: 24, type: 'Classic' },
  { id: 2, name: 'Choco Truffle Cakes', price: 650, desc: 'Rich chocolate truffle cakes with premium chocolate toppings and layers.', image: chocoTruffle, count: 12, type: 'Premium' },
  { id: 3, name: 'Red Velvet Cakes', price: 750, desc: 'Soft red velvet sponge cakes with cream cheese frosting.', image: redVelvet, count: 8, type: 'Premium' },
  { id: 4, name: 'Black Forest Cakes', price: 550, desc: 'Classic black forest cakes with cherries, whipped cream, and chocolate flakes.', image: chocoTruffle, count: 15, type: 'Classic' },
  { id: 5, name: 'Fruit Cakes', price: 600, desc: 'Fresh fruit-loaded cakes with colorful toppings and mixed fruit flavors.', image: redVelvet, count: 11, type: 'Specialty' },
  { id: 6, name: 'Ice Cream Cakes', price: 850, desc: 'Frozen ice cream cakes with creamy textures and premium decorations.', image: chocoTruffle, count: 6, type: 'Specialty' },
  { id: 7, name: 'Cupcakes', price: 120, desc: 'Mini designer cupcakes available in multiple flavors and toppings.', image: redVelvet, count: 32, type: 'Mini' },
  { id: 8, name: 'Jar Cakes', price: 150, desc: 'Layered jar desserts with cream, sponge, and chocolate fillings.', image: chocoTruffle, count: 14, type: 'Mini' },
  { id: 9, name: 'Theme Cakes', price: 1200, desc: 'Customized cakes for birthdays, parties, and special celebrations.', image: redVelvet, count: 20, type: 'Specialty' },
  { id: 10, name: 'Wedding Cakes', price: 1500, desc: 'Luxury multi-layer wedding cakes with elegant decorations and floral themes.', image: chocoTruffle, count: 10, type: 'Premium' },
  { id: 11, name: 'Kids Cakes', price: 1100, desc: 'Cartoon-themed cakes with colorful and playful designs for children.', image: redVelvet, count: 18, type: 'Specialty' },
  { id: 12, name: 'Photo Cakes', price: 950, desc: 'Customized edible photo cakes with image upload functionality.', image: chocoTruffle, count: 7, type: 'Specialty' },
  { id: 13, name: 'Pastry Cakes', price: 100, desc: 'Single-serve pastry cakes with premium cream layers and toppings.', image: redVelvet, count: 25, type: 'Mini' },
  { id: 14, name: 'Cheesecakes', price: 800, desc: 'Creamy baked and non-baked cheesecakes with rich textures.', image: chocoTruffle, count: 9, type: 'Premium' },
  { id: 15, name: 'Brownies', price: 200, desc: 'Chocolate brownies with nuts, choco chips, caramel, and fudge fillings.', image: redVelvet, count: 12, type: 'Mini' },
  { id: 16, name: 'Cookies Tins', price: 350, desc: 'Premium assorted cookies packed in luxury gift tins.', image: chocoTruffle, count: 5, type: 'Classic' },
];

const staticCategories = [
  { id: 1, name: 'Regular Cakes', price: 450, desc: 'Simple daily cakes with classic flavors.', image: chocoTruffle, count: 24, type: 'Classic' },
  { id: 2, name: 'Choco Truffle Cakes', price: 650, desc: 'Rich chocolate truffle cakes.', image: chocoTruffle, count: 12, type: 'Premium' },
  { id: 3, name: 'Red Velvet Cakes', price: 750, desc: 'Soft red velvet sponge cakes.', image: redVelvet, count: 8, type: 'Premium' },
  { id: 4, name: 'Jar Cakes', price: 150, desc: 'Layered jar desserts in glass.', image: chocoTruffle, count: 14, type: 'Mini' },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setCategories(data);
        else setCategories(staticCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories, using fallback:', err);
        setCategories(staticCategories);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || cat.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Cake <span className="text-bakery-pink-500">Categories</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-bakery-chocolate/60 max-w-2xl mx-auto"
          >
            Discover our extensive range of handcrafted delights. From daily treats to grand wedding cakes.
          </motion.p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-chocolate/40" size={20} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-bakery-pink-100 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-bakery-pink-400 shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Premium', 'Classic', 'Specialty', 'Mini'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${selectedFilter === filter ? 'bg-bakery-pink-500 text-white shadow-lg shadow-bakery-pink-200' : 'bg-white text-bakery-chocolate border border-bakery-pink-100 hover:border-bakery-pink-300'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative"
              >
                <div className="bg-white rounded-[40px] p-6 border border-bakery-pink-50 shadow-xl shadow-bakery-pink-100/20 card-hover overflow-hidden h-full flex flex-col">
                  {/* Image and Badge */}
                  <div className="relative aspect-square rounded-[30px] overflow-hidden mb-6 bg-bakery-pink-50 flex items-center justify-center p-6">
                    <img 
                      src={
                        cat.image_url || 
                        (cat.name.toLowerCase().includes('velvet') ? redVelvet : chocoTruffle)
                      } 
                      alt={cat.name} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-bakery-pink-500 shadow-sm">
                      {cat.count || 0} Products
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-bakery-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist(cat); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform translate-y-4 group-hover:translate-y-0 ${isInWishlist(cat.id) ? 'bg-bakery-pink-500 text-white' : 'bg-white text-bakery-chocolate hover:bg-bakery-pink-500 hover:text-white'}`}
                      >
                        <Heart size={20} fill={isInWishlist(cat.id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); addToCart({...cat, weight: '1 KG'}); }}
                        className="w-12 h-12 rounded-full bg-white text-bakery-chocolate flex items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 delay-75"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif font-bold text-bakery-chocolate group-hover:text-bakery-pink-500 transition-colors">
                        {cat.name}
                      </h3>
                      <div className="flex text-bakery-gold-500">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-xs font-bold text-bakery-chocolate">4.9</span>
                      </div>
                    </div>
                    <p className="text-bakery-pink-600 font-bold text-lg">₹{cat.price}</p>
                    <p className="text-bakery-chocolate/60 text-sm leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Button */}
                  <Link 
                    to={`/products/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="mt-8 w-full py-4 bg-bakery-pink-50 group-hover:bg-bakery-pink-500 group-hover:text-white text-bakery-chocolate font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    View Products <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-bakery-chocolate/40">No categories found matching "{searchQuery}"</h3>
          </div>
        )}
      </div>
    </div>
  );
}