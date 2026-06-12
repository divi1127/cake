import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Plus, Minus, Share2, ShieldCheck, Truck, Clock, Camera } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

import { useParams } from 'react-router-dom';
import { getProductById } from '../utils/productsData';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('1 KG');
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('Classic Chocolate');
  const [isEggless, setIsEggless] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [price, setPrice] = useState(0);

  const weights = ['0.5 KG', '1 KG', '2 KG', '3 KG', 'Custom'];

  useState(() => {
    const foundProduct = getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      setPrice(foundProduct.price);
      setSelectedFlavor(foundProduct.flavor || 'Classic Chocolate');
    }
  }, [id]);

  const updatePrice = (weight) => {
    if (!product) return;
    let multiplier = 1;
    if (weight === '0.5 KG') multiplier = 0.6;
    if (weight === '2 KG') multiplier = 1.8;
    if (weight === '3 KG') multiplier = 2.5;
    setPrice(Math.round(product.price * multiplier));
  };

  const handleWeightSelect = (w) => {
    setSelectedWeight(w);
    updatePrice(w);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      ...product,
      price: price,
      weight: selectedWeight,
      quantity: quantity,
      flavor: selectedFlavor,
      eggless: isEggless
    });
  };

  if (!product) return (
    <div className="pt-32 pb-24 flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-bakery-pink-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-bakery-pink-50 rounded-[50px] overflow-hidden flex items-center justify-center p-12 border border-bakery-pink-100 shadow-2xl shadow-bakery-pink-100/50"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-700 cursor-zoom-in"
              />
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-bakery-pink-100 text-bakery-pink-600 rounded-full text-xs font-bold uppercase tracking-wider">Best Seller</span>
                <div className="flex text-bakery-gold-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill={i <= Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  <span className="ml-2 text-sm font-bold text-bakery-chocolate">({product.rating} Rating)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-bakery-chocolate mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-bakery-pink-600">₹{price}.00</p>
                {selectedWeight !== '1 KG' && <p className="text-sm text-bakery-chocolate/40 line-through">₹{product.price}</p>}
              </div>
            </div>

            <p className="text-bakery-chocolate/60 leading-relaxed">
              {product.desc || 'Experience the ultimate indulgence with our freshly baked delights, crafted with the finest ingredients and love.'}
            </p>

            {/* Selection Options */}
            <div className="space-y-6">
              {/* Weight */}
              <div>
                <h3 className="font-bold text-bakery-chocolate mb-4 flex justify-between">
                  Select Weight <span className="text-bakery-pink-500 text-sm font-medium">Size Guide</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => handleWeightSelect(w)}
                      className={`px-6 py-2.5 rounded-full font-medium transition-all ${selectedWeight === w ? 'bg-bakery-chocolate text-white' : 'bg-bakery-pink-50 text-bakery-chocolate hover:bg-bakery-pink-100'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor */}
              {(product.availableFlavors && product.availableFlavors.length > 0) && (
                <div>
                  <h3 className="font-bold text-bakery-chocolate mb-4">Select Flavor</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.availableFlavors.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFlavor(f)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-left border transition-all ${selectedFlavor === f ? 'border-bakery-pink-500 bg-bakery-pink-50/50' : 'border-bakery-pink-100 hover:border-bakery-pink-300'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${isEggless ? 'bg-bakery-pink-500 border-bakery-pink-500' : 'border-bakery-pink-200 group-hover:border-bakery-pink-400'}`}>
                    {isEggless && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={isEggless} onChange={() => setIsEggless(!isEggless)} />
                  <span className="font-medium text-bakery-chocolate">Eggless Option</span>
                </label>
              </div>
            </div>

            {/* Quantity and Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-bakery-pink-50 rounded-full px-2 py-1 h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-bakery-chocolate transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-bakery-chocolate text-xl">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-bakery-chocolate transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow btn-primary h-14 text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`h-14 w-14 flex items-center justify-center border-2 rounded-full transition-all ${isInWishlist(product.id) ? 'bg-bakery-pink-500 border-bakery-pink-500 text-white' : 'border-bakery-pink-100 text-bakery-chocolate hover:text-bakery-pink-500 hover:border-bakery-pink-500'}`}
              >
                <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-bakery-pink-50">
              <div className="flex flex-col items-center gap-2">
                <Truck className="text-bakery-pink-500" size={24} />
                <span className="text-[10px] font-bold uppercase text-bakery-chocolate/60">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="text-bakery-pink-500" size={24} />
                <span className="text-[10px] font-bold uppercase text-bakery-chocolate/60">100% Quality</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock className="text-bakery-pink-500" size={24} />
                <span className="text-[10px] font-bold uppercase text-bakery-chocolate/60">Freshly Baked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}