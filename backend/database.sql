-- Create Database
CREATE DATABASE IF NOT EXISTS bakery_bliss;
USE bakery_bliss;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    type VARCHAR(50)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    flavor VARCHAR(100),
    type VARCHAR(100),
    image_url VARCHAR(255),
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    delivery_method ENUM('home', 'pickup') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_name VARCHAR(255),
    quantity INT,
    price DECIMAL(10, 2),
    weight VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Insert Initial Categories
INSERT INTO categories (name, description, price, type) VALUES
('Regular Cakes', 'Simple daily cakes with classic flavors and affordable pricing.', 450, 'Classic'),
('Choco Truffle Cakes', 'Rich chocolate truffle cakes with premium chocolate toppings and layers.', 650, 'Premium'),
('Red Velvet Cakes', 'Soft red velvet sponge cakes with cream cheese frosting.', 750, 'Premium'),
('Black Forest Cakes', 'Classic black forest cakes with cherries, whipped cream, and chocolate flakes.', 550, 'Classic'),
('Jar Cakes', 'Layered jar desserts with cream, sponge, and chocolate fillings.', 150, 'Mini'),
('Wedding Cakes', 'Luxury multi-layer wedding cakes with elegant decorations and floral themes.', 1500, 'Premium');

-- Insert Initial Products (Jar Cakes)
INSERT INTO products (category_id, name, price, flavor, type) VALUES
(5, 'Choco Lava Jar', 150, 'Chocolate', 'Jar'),
(5, 'Red Velvet Jar', 180, 'Red Velvet', 'Jar'),
(5, 'Blueberry Cheesecake Jar', 200, 'Blueberry', 'Jar');
