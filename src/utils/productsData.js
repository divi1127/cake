import chocoTruffle from '../assets/choco-truffle.png';
import redVelvet from '../assets/red-velvet.png';

export const categories = [
  { id: 1, name: 'Regular Cakes', slug: 'regular-cakes', price: 450, desc: 'Simple daily cakes with classic flavors and affordable pricing.', image_url: 'https://i.pinimg.com/736x/10/12/e9/1012e9f819579bab5a1fd8b338a03235.jpg', count: 4, type: 'Classic' },
  { id: 2, name: 'Choco Truffle Cakes', slug: 'choco-truffle-cakes', price: 650, desc: 'Rich chocolate truffle cakes with premium chocolate toppings and layers.', image: chocoTruffle, count: 3, type: 'Premium' },
  { id: 3, name: 'Red Velvet Cakes', slug: 'red-velvet-cakes', price: 750, desc: 'Soft red velvet sponge cakes with cream cheese frosting.', image: redVelvet, count: 2, type: 'Premium' },
  { id: 4, name: 'Jar Cakes', slug: 'jar-cakes', price: 150, desc: 'Layered jar desserts with cream, sponge, and chocolate fillings.', image_url: 'https://i.pinimg.com/1200x/10/e1/e3/10e1e3acb5cfaf151bdb52b821293b55.jpg', count: 4, type: 'Mini' },
  { id: 5, name: 'Bulberry Cakes', slug: 'bulberry-cakes', price: 850, desc: 'Delicious bulberry cakes with fresh berries and creamy layers.', image_url: 'https://i.pinimg.com/736x/a5/43/11/a54311d5f238d47c82c471a0b2e9f7ff.jpg', count: 3, type: 'Premium' },
  { id: 6, name: 'Chocolate Birthday Cakes', slug: 'chocolate-birthday-cakes', price: 950, desc: 'Celebration chocolate birthday cakes with premium decorations.', image_url: 'https://i.pinimg.com/736x/65/71/39/657139f577366dfb1699b9d90c0b2841.jpg', count: 5, type: 'Premium' },
  { id: 7, name: 'Anniversary Cakes', slug: 'anniversary-cakes', price: 1200, desc: 'Elegant anniversary cakes for special celebrations.', image_url: 'https://i.pinimg.com/1200x/3a/de/0a/3ade0a9606bdae637a44959ebc866635.jpg', count: 4, type: 'Premium' },
  { id: 8, name: 'Biscoff Cakes', slug: 'biscoff-cakes', price: 800, desc: 'Rich biscoff flavored cakes with cookie butter layers.', image_url: 'https://i.pinimg.com/1200x/70/34/82/70348211157b0fe85d6b8f7718499d43.jpg', count: 3, type: 'Premium' },
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

  // Bulberry Cakes
  { id: 801, name: 'Fresh Bulberry Delight', price: 850, rating: 4.8, image_url: 'https://i.pinimg.com/736x/83/af/af/83afaf9d959e90d2ca6ab06ec124fd4e.jpg', flavor: 'Bulberry', type: 'Premium', category: 'bulberry-cakes', desc: 'Fresh bulberry cake with creamy layers.', availableFlavors: ['Bulberry', 'Mixed Berry', 'Berry Bliss'] },
  { id: 802, name: 'Bulberry Cheesecake', price: 900, rating: 4.7, image_url: 'https://i.pinimg.com/736x/19/53/90/195390ea6ebecfd32af338e56e818e3d.jpg', flavor: 'Bulberry', type: 'Premium', category: 'bulberry-cakes', desc: 'Creamy bulberry cheesecake with fresh toppings.', availableFlavors: ['Bulberry', 'Berry Cheesecake', 'Fruit Cheesecake'] },
  { id: 803, name: 'Bulberry Truffle', price: 950, rating: 4.9, image_url: 'https://i.pinimg.com/736x/a5/43/11/a54311d5f238d47c82c471a0b2e9f7ff.jpg', flavor: 'Bulberry', type: 'Premium', category: 'bulberry-cakes', desc: 'Rich bulberry truffle cake with chocolate layers.', availableFlavors: ['Bulberry', 'Berry Truffle', 'Chocolate Berry'] },

  // Chocolate Birthday Cakes
  { id: 901, name: 'Birthday Chocolate Blast', price: 950, rating: 4.9, image_url: 'https://i.pinimg.com/736x/65/71/39/657139f577366dfb1699b9d90c0b2841.jpg', flavor: 'Chocolate', type: 'Premium', category: 'chocolate-birthday-cakes', desc: 'Ultimate chocolate birthday cake with decorations.', availableFlavors: ['Chocolate', 'Dark Chocolate', 'Milk Chocolate'] },
  { id: 902, name: 'Celebration Chocolate', price: 1000, rating: 4.8, image_url: 'https://i.pinimg.com/736x/65/71/39/657139f577366dfb1699b9d90c0b2841.jpg', flavor: 'Chocolate', type: 'Premium', category: 'chocolate-birthday-cakes', desc: 'Festive chocolate cake for birthday celebrations.', availableFlavors: ['Chocolate', 'Chocolate Fudge', 'Chocolate Ganache'] },
  { id: 903, name: 'Kids Chocolate Party', price: 880, rating: 4.7, image_url: 'https://i.pinimg.com/736x/0c/e1/8f/0ce18f11688c951b27031df852018ebd.jpg', flavor: 'Chocolate', type: 'Premium', category: 'chocolate-birthday-cakes', desc: 'Fun chocolate cake with colorful decorations.', availableFlavors: ['Chocolate', 'Chocolate Sprinkle', 'Chocolate Rainbow'] },
  { id: 904, name: 'Premium Birthday Chocolate', price: 1100, rating: 5.0, image_url: 'https://i.pinimg.com/736x/65/71/39/657139f577366dfb1699b9d90c0b2841.jpg', flavor: 'Chocolate', type: 'Premium', category: 'chocolate-birthday-cakes', desc: 'Luxury chocolate birthday cake with premium toppings.', availableFlavors: ['Chocolate', 'Belgian Chocolate', 'Swiss Chocolate'] },
  { id: 905, name: 'Chocolate Birthday Tower', price: 1200, rating: 4.9, image_url: 'https://i.pinimg.com/736x/98/d8/a2/98d8a2f7eca417d16e36f07155e4e190.jpg', flavor: 'Chocolate', type: 'Premium', category: 'chocolate-birthday-cakes', desc: 'Multi-tier chocolate birthday cake.', availableFlavors: ['Chocolate', 'Chocolate Tower', 'Chocolate Layer'] },

  // Anniversary Cakes
  { id: 1001, name: 'Romantic Anniversary', price: 1200, rating: 4.9, image_url: 'https://i.pinimg.com/1200x/3a/de/0a/3ade0a9606bdae637a44959ebc866635.jpg', flavor: 'Vanilla', type: 'Premium', category: 'anniversary-cakes', desc: 'Elegant anniversary cake with romantic design.', availableFlavors: ['Vanilla', 'Rose', 'Strawberry'] },
  { id: 1002, name: 'Golden Anniversary', price: 1500, rating: 5.0, image_url: 'https://i.pinimg.com/1200x/3a/de/0a/3ade0a9606bdae637a44959ebc866635.jpg', flavor: 'Gold', type: 'Premium', category: 'anniversary-cakes', desc: 'Luxury golden anniversary celebration cake.', availableFlavors: ['Vanilla', 'Champagne', 'Golden'] },
  { id: 1003, name: 'Heart Anniversary', price: 1300, rating: 4.8, image_url: 'https://i.pinimg.com/1200x/3a/de/0a/3ade0a9606bdae637a44959ebc866635.jpg', flavor: 'Red Velvet', type: 'Premium', category: 'anniversary-cakes', desc: 'Heart-shaped anniversary cake with love theme.', availableFlavors: ['Red Velvet', 'Strawberry', 'Raspberry'] },
  { id: 1004, name: 'Elegant Anniversary Tier', price: 1800, rating: 4.9, image_url: 'https://i.pinimg.com/1200x/3a/de/0a/3ade0a9606bdae637a44959ebc866635.jpg', flavor: 'Vanilla', type: 'Premium', category: 'anniversary-cakes', desc: 'Two-tier elegant anniversary cake.', availableFlavors: ['Vanilla', 'Buttercream', 'Fondant'] },

  // Biscoff Cakes
  { id: 1101, name: 'Classic Biscoff', price: 800, rating: 4.8, image_url: 'https://i.pinimg.com/1200x/70/34/82/70348211157b0fe85d6b8f7718499d43.jpg', flavor: 'Biscoff', type: 'Premium', category: 'biscoff-cakes', desc: 'Classic biscoff cake with cookie butter layers.', availableFlavors: ['Biscoff', 'Cookie Butter', 'Speculoos'] },
  { id: 1102, name: 'Biscoff Cheesecake', price: 850, rating: 4.9, image_url: 'https://i.pinimg.com/1200x/70/34/82/70348211157b0fe85d6b8f7718499d43.jpg', flavor: 'Biscoff', type: 'Premium', category: 'biscoff-cakes', desc: 'Creamy biscoff cheesecake with cookie crust.', availableFlavors: ['Biscoff', 'Biscoff Cheesecake', 'Cookie Cheesecake'] },
  { id: 1103, name: 'Biscoff Truffle', price: 900, rating: 4.7, image_url: 'https://i.pinimg.com/1200x/70/34/82/70348211157b0fe85d6b8f7718499d43.jpg', flavor: 'Biscoff', type: 'Premium', category: 'biscoff-cakes', desc: 'Rich biscoff truffle with chocolate.', availableFlavors: ['Biscoff', 'Chocolate Biscoff', 'Biscoff Fudge'] },
];

export const getProductsByCategory = (slug) => {
  if (slug === 'all-products') return products;
  return products.filter(p => p.category === slug);
};

export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};
