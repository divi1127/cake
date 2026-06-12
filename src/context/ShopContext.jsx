import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [notification, setNotification] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bakery_cart');
    const savedWishlist = localStorage.getItem('bakery_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to localStorage on change 
  useEffect(() => {
    localStorage.setItem('bakery_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bakery_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.weight === product.weight);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.weight === product.weight 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (id, weight) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.weight === weight)));
    showNotification('Item removed from cart');
  };

  const updateQuantity = (id, weight, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id && item.weight === weight 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`${product.name} removed from wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      }
      showNotification(`${product.name} added to wishlist!`);
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider value={{ 
      cart, 
      wishlist, 
      notification,
      showNotification,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleWishlist,
      isInWishlist,
      clearCart,
      cartCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
}
