import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

export const categories = [
  { id: 1, name: 'Regular Cakes', slug: 'regular-cakes', price: 450, desc: 'Simple daily cakes with classic flavors and affordable pricing.', image: chocoTruffle, count: 4, type: 'Classic' },
  { id: 2, name: 'Choco Truffle Cakes', slug: 'choco-truffle-cakes', price: 650, desc: 'Rich chocolate truffle cakes with premium chocolate toppings and layers.', image: chocoTruffle, count: 3, type: 'Premium' },
  { id: 3, name: 'Red Velvet Cakes', slug: 'red-velvet-cakes', price: 750, desc: 'Soft red velvet sponge cakes with cream cheese frosting.', image: redVelvet, count: 2, type: 'Premium' },
  { id: 4, name: 'Jar Cakes', slug: 'jar-cakes', price: 150, desc: 'Layered jar desserts with cream, sponge, and chocolate fillings.', image: chocoTruffle, count: 4, type: 'Mini' },
];

export const products = [
  // Regular Cakes
  { id: 101, name: 'Vanilla Classic', price: 450, rating: 4.5, image: chocoTruffle, flavor: 'Vanilla', type: 'Classic', category: 'regular-cakes', desc: 'A timeless vanilla sponge cake with smooth buttercream frosting.', availableFlavors: ['Vanilla', 'French Vanilla', 'Vanilla Bean'] },
  { id: 102, name: 'Strawberry Delight', price: 480, rating: 4.4, image: redVelvet, flavor: 'Strawberry', type: 'Classic', category: 'regular-cakes', desc: 'Fresh strawberry flavored cake with real fruit bits.', availableFlavors: ['Strawberry', 'Mixed Berry', 'Strawberry Cream'] },
  { id: 103, name: 'Butterscotch Crunch', price: 500, rating: 4.6, image: chocoTruffle, flavor: 'Butterscotch', type: 'Classic', category: 'regular-cakes', desc: 'Rich butterscotch flavor with crunchy caramel bits.', availableFlavors: ['Butterscotch', 'Caramel Crunch', 'Honey Butterscotch'] },
  { id: 104, name: 'Pineapple Fresh', price: 460, rating: 4.3, image: chocoTruffle, flavor: 'Pineapple', type: 'Classic', category: 'regular-cakes', desc: 'Zesty pineapple cake with whipped cream.', availableFlavors: ['Pineapple', 'Tropical Pineapple', 'Pineapple Cream'] },

  // Choco Truffle
  { id: 201, name: 'Dark Truffle Classic', price: 650, rating: 4.9, image: chocoTruffle, flavor: 'Dark Chocolate', type: 'Premium', category: 'choco-truffle-cakes', desc: 'Our signature dark chocolate truffle cake.', availableFlavors: ['Dark Chocolate', 'Extra Dark', 'Belgium Chocolate'] },
  { id: 202, name: 'White Chocolate Truffle', price: 700, rating: 4.8, image: redVelvet, flavor: 'White Chocolate', type: 'Premium', category: 'choco-truffle-cakes', desc: 'Indulgent white chocolate layers.', availableFlavors: ['White Chocolate', 'Creamy White', 'White Raspberry'] },
  { id: 203, name: 'Hazelnut Truffle', price: 850, rating: 5.0, image: chocoTruffle, flavor: 'Hazelnut', type: 'Premium', category: 'choco-truffle-cakes', desc: 'Chocolate truffle with roasted hazelnut crunch.', availableFlavors: ['Hazelnut', 'Nutella Truffle', 'Praline Chocolate'] },

  // Red Velvet
  { id: 301, name: 'Crimson Velvet', price: 750, rating: 4.9, image: redVelvet, flavor: 'Red Velvet', type: 'Premium', category: 'red-velvet-cakes', desc: 'Classic red velvet with silky cream cheese frosting.', availableFlavors: ['Classic Red Velvet', 'Velvet Cheesecake', 'Red Velvet Rose'] },
  { id: 302, name: 'Velvet Rose', price: 800, rating: 4.7, image: redVelvet, flavor: 'Red Velvet', type: 'Premium', category: 'red-velvet-cakes', desc: 'Red velvet cake with a hint of rose essence.', availableFlavors: ['Red Velvet Rose', 'Floral Velvet', 'Rose Cream'] },

  // Jar Cakes
  { id: 701, name: 'Choco Lava Jar', price: 150, rating: 4.8, image: chocoTruffle, flavor: 'Chocolate', type: 'Jar', category: 'jar-cakes', desc: 'Gooey chocolate lava served in a convenient jar.', availableFlavors: ['Chocolate', 'Fudge Chocolate', 'Mocha'] },
  { id: 702, name: 'Red Velvet Jar', price: 180, rating: 4.9, image: redVelvet, flavor: 'Red Velvet', type: 'Jar', category: 'jar-cakes', desc: 'Layers of red velvet and cream cheese in a jar.', availableFlavors: ['Red Velvet', 'Velvet Dream', 'Pink Velvet'] },
  { id: 703, name: 'Blueberry Cheesecake Jar', price: 200, rating: 4.7, image: chocoTruffle, flavor: 'Blueberry', type: 'Jar', category: 'jar-cakes', desc: 'Creamy blueberry cheesecake layers.', availableFlavors: ['Blueberry', 'Mixed Berry', 'Wild Berry'] },
  { id: 704, name: 'Butterscotch Jar', price: 160, rating: 4.6, image: redVelvet, flavor: 'Butterscotch', type: 'Jar', category: 'jar-cakes', desc: 'Crunchy butterscotch layers in a jar.', availableFlavors: ['Butterscotch', 'Caramel', 'Toffee Butter'] },
];

export const getProductsByCategory = (slug) => {
  if (slug === 'all-products') return products;
  return products.filter(p => p.category === slug);
};

export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};
