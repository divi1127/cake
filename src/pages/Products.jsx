import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, Filter, Search, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

const productsData = {
  'jar-cakes': [
    { id: 701, name: 'Choco Lava Jar', price: 150, rating: 4.8, image: chocoTruffle, flavor: 'Chocolate', type: 'Jar' },
    { id: 702, name: 'Red Velvet Jar', price: 180, rating: 4.9, image: redVelvet, flavor: 'Red Velvet', type: 'Jar' },
    { id: 703, name: 'Blueberry Cheesecake Jar', price: 200, rating: 4.7, image: chocoTruffle, flavor: 'Blueberry', type: 'Jar' },
    { id: 704, name: 'Butterscotch Jar', price: 160, rating: 4.6, image: redVelvet, flavor: 'Butterscotch', type: 'Jar' },
  ],
  'choco-truffle-cakes': [
    { id: 201, name: 'Dark Truffle Classic', price: 650, rating: 4.9, image: chocoTruffle, flavor: 'Dark Chocolate', type: 'Premium' },
    { id: 202, name: 'White Chocolate Truffle', price: 700, rating: 4.8, image: redVelvet, flavor: 'White Chocolate', type: 'Premium' },
    { id: 203, name: 'Hazelnut Truffle', price: 850, rating: 5.0, image: chocoTruffle, flavor: 'Hazelnut', type: 'Premium' },
  ],
  'wedding-cakes': [
    { id: 1001, name: 'Ethereal White 3-Tier', price: 1500, rating: 5.0, image: chocoTruffle, flavor: 'Vanilla & Rose', type: 'Tiered' },
    { id: 1002, name: 'Golden Royale Wedding', price: 2500, rating: 4.9, image: redVelvet, flavor: 'Rich Fruit', type: 'Tiered' },
  ],
};

import { getProductsByCategory } from '../utils/productsData';

export default function Products() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  useEffect(() => {
    // Using static data helper instead of API
    const data = getProductsByCategory(categorySlug);
    setProducts(data);
    setLoading(false);
  }, [categorySlug]);

  const categoryName = categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-bakery-chocolate/40 mb-8">
          <Link to="/categories" className="hover:text-bakery-pink-500 transition-colors">Categories</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-bakery-chocolate font-bold">{categoryName}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName} <span className="text-bakery-pink-500">Collection</span></h1>
            <p className="text-bakery-chocolate/60 max-w-xl">
              Browse our variety of {categoryName} with different flavors and styles tailored for your taste.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-bakery-pink-100 rounded-xl hover:border-bakery-pink-400 transition-colors">
              <Filter size={20} />
            </button>
            <button className="p-3 bg-white border border-bakery-pink-100 rounded-xl hover:border-bakery-pink-400 transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-bakery-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-[40px] p-6 shadow-xl shadow-bakery-pink-100/20 card-hover flex flex-col h-full border border-bakery-pink-50">
                  <div className="relative aspect-square rounded-[30px] overflow-hidden bg-bakery-pink-50 flex items-center justify-center p-6 mb-6">
                    <img src={product.image_url || product.image || (product.name.toLowerCase().includes('velvet') ? redVelvet : chocoTruffle)} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="absolute inset-0 bg-bakery-chocolate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 md:opacity-0 sm:items-end sm:justify-end sm:p-4 sm:bg-transparent sm:opacity-100">
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all shadow-lg ${isInWishlist(product.id) ? 'bg-bakery-pink-500 text-white' : 'bg-white text-bakery-chocolate hover:bg-bakery-pink-500 hover:text-white'}`}
                      >
                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Wish</span>
                      </button>
                      <Link to={`/product/${product.id}`} className="w-12 h-12 rounded-full bg-white text-bakery-chocolate flex flex-col items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-all group/eye shadow-lg">
                        <Eye size={20} />
                        <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">View</span>
                      </Link>
                      <button 
                        onClick={() => addToCart({...product, weight: '1 KG'})}
                        className="w-12 h-12 rounded-full bg-white text-bakery-chocolate flex flex-col items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-all group/cart shadow-lg"
                      >
                        <ShoppingCart size={20} />
                        <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Cart</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-bakery-pink-500">
                      <span>{product.flavor || 'Premium'}</span>
                      <div className="flex items-center gap-1 text-bakery-gold-500">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-bakery-chocolate">{product.name}</h3>
                    <p className="text-2xl font-bold text-bakery-pink-600">₹{product.price}</p>
                  </div>

                  <button 
                    onClick={() => addToCart({...product, weight: '1 KG'})}
                    className="mt-8 w-full py-4 bg-bakery-chocolate text-white rounded-2xl font-bold hover:bg-bakery-pink-500 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-bakery-pink-200">
            <h3 className="text-2xl font-bold text-bakery-chocolate/40 mb-2">No Products Found</h3>
            <p className="text-bakery-chocolate/30">We are currently updating our collection for {categoryName}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
