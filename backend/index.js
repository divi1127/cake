const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const connection = mysql.createConnection(dbConfig);

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) return;
        
        connection.query(`USE ${process.env.DB_NAME}`, (err) => {
            if (err) return;

            // Helper to add columns
            const addColumnIfMissing = (table, column, definition) => {
                connection.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`, (err, results) => {
                    if (results && results.length === 0) {
                        connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (err) => {
                            if (!err) console.log(`Added missing column ${column} to ${table}`);
                        });
                    }
                });
            };

            // Create Tables
            const tables = [
                `CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('customer', 'admin') DEFAULT 'customer',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`,
                `CREATE TABLE IF NOT EXISTS categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    image_url VARCHAR(255),
                    type VARCHAR(50)
                )`,
                `CREATE TABLE IF NOT EXISTS products (
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
                )`,
                `CREATE TABLE IF NOT EXISTS orders (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    customer_name VARCHAR(255) NOT NULL,
                    phone VARCHAR(20) NOT NULL,
                    address TEXT NOT NULL,
                    delivery_method ENUM('home', 'pickup') NOT NULL,
                    total_amount DECIMAL(10, 2) NOT NULL,
                    status ENUM('pending', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )`,
                `CREATE TABLE IF NOT EXISTS order_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id INT,
                    product_name VARCHAR(255),
                    quantity INT,
                    price DECIMAL(10, 2),
                    weight VARCHAR(50),
                    FOREIGN KEY (order_id) REFERENCES orders(id)
                )`
            ];

            tables.forEach(table => {
                connection.query(table, (err) => {
                    if (err) console.error('Error creating table:', err);
                });
            });

            addColumnIfMissing('orders', 'user_id', 'INT AFTER id');
            addColumnIfMissing('products', 'description', 'TEXT');
            addColumnIfMissing('products', 'image_url', 'VARCHAR(255)');
            addColumnIfMissing('products', 'flavor', 'VARCHAR(100)');
            addColumnIfMissing('products', 'type', 'VARCHAR(100)');

            // Seeders
            const seedAdmin = async () => {
                const adminEmail = 'admin@bakery.com';
                connection.query('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, results) => {
                    if (err || results.length > 0) return;
                    const hashedPassword = await bcrypt.hash('admin123', 10);
                    connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', ['System Admin', adminEmail, hashedPassword, 'admin']);
                });
            };

            const seedCategories = () => {
                connection.query('SELECT COUNT(*) as count FROM categories', (err, results) => {
                    if (err || results[0].count > 0) return;
                    const categories = [
                        ['Regular Cakes', 'Simple daily cakes.', 450, 'Classic'],
                        ['Choco Truffle Cakes', 'Rich chocolate truffle cakes.', 650, 'Premium'],
                        ['Red Velvet Cakes', 'Soft red velvet sponge cakes.', 750, 'Premium'],
                        ['Jar Cakes', 'Layered jar desserts in glass.', 150, 'Mini'],
                        ['Cupcakes', 'Mini designer cupcakes.', 120, 'Mini'],
                        ['Wedding Cakes', 'Luxury multi-layer cakes.', 1500, 'Premium']
                    ];
                    const query = 'INSERT INTO categories (name, description, price, type) VALUES ?';
                    connection.query(query, [categories], (err, result) => {
                        if (!err) seedProducts(result.insertId);
                    });
                });
            };

            const seedProducts = (startId) => {
                connection.query('SELECT COUNT(*) as count FROM products', (err, results) => {
                    if (err || results[0].count > 0) return;
                    const products = [
                        [startId, 'Vanilla Classic', 450, 4.8, 'Vanilla', 'Standard'],
                        [startId + 1, 'Dark Truffle', 650, 4.9, 'Dark', 'Premium'],
                        [startId + 2, 'Red Velvet Cream', 750, 4.9, 'Red Velvet', 'Premium'],
                        [startId + 3, 'Choco Lava Jar', 150, 4.8, 'Choco', 'Jar']
                    ];
                    connection.query('INSERT INTO products (category_id, name, price, rating, flavor, type) VALUES ?', [products]);
                });
            };

            seedAdmin();
            seedCategories();
            console.log('Database initialized');
        });
    });
});

// --- ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
        if (err) return res.status(400).json({ error: 'Email already exists' });
        res.json({ message: 'Success' });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Invalid' });
        const user = results[0];
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } else res.status(401).json({ error: 'Invalid' });
    });
});

app.get('/api/categories', (req, res) => {
    connection.query('SELECT * FROM categories', (err, results) => {
        res.json(results || []);
    });
});

app.get('/api/products/:categorySlug', (req, res) => {
    const slug = req.params.categorySlug.replace(/-/g, ' ');
    connection.query('SELECT p.* FROM products p JOIN categories c ON p.category_id = c.id WHERE LOWER(c.name) = LOWER(?)', [slug], (err, results) => {
        res.json(results || []);
    });
});

app.get('/api/orders/user/:userId', (req, res) => {
    connection.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId], (err, orders) => {
        if (err) return res.status(500).json(err);
        if (!orders || orders.length === 0) return res.json([]);
        const orderIds = orders.map(o => o.id);
        connection.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds], (err, items) => {
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: (items || []).filter(item => item.order_id === order.id)
            }));
            res.json(ordersWithItems);
        });
    });
});

app.post('/api/orders', (req, res) => {
    const { user_id, customer_name, phone, address, delivery_method, total_amount, items } = req.body;
    connection.query('INSERT INTO orders (user_id, customer_name, phone, address, delivery_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)', 
    [user_id || null, customer_name, phone, address, delivery_method, total_amount], (err, result) => {
        if (err) return res.status(500).json(err);
        const orderId = result.insertId;
        const itemValues = items.map(item => [orderId, item.name || item.product_name, item.quantity, item.price, item.weight || '1 KG']);
        connection.query('INSERT INTO order_items (order_id, product_name, quantity, price, weight) VALUES ?', [itemValues], (err) => {
            res.json({ success: true, orderId });
        });
    });
});

app.put('/api/orders/:id/receive', (req, res) => {
    connection.query('UPDATE orders SET status = "delivered" WHERE id = ?', [req.params.id], (err) => {
        res.json({ success: true });
    });
});

// --- ADMIN ---
const authAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') return res.status(403).json({ error: 'Denied' });
        next();
    });
};

app.get('/api/admin/stats', authAdmin, (req, res) => {
    const queries = {
        totalSales: 'SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"',
        orderCount: 'SELECT COUNT(*) as count FROM orders',
        userCount: 'SELECT COUNT(*) as count FROM users WHERE role = "customer"',
        productCount: 'SELECT COUNT(*) as count FROM products'
    };
    const stats = {}; let completed = 0; const keys = Object.keys(queries);
    keys.forEach(key => {
        connection.query(queries[key], (err, results) => {
            stats[key] = results ? (results[0].total || results[0].count || 0) : 0;
            if (++completed === keys.length) res.json(stats);
        });
    });
});

app.get('/api/admin/orders', authAdmin, (req, res) => {
    connection.query('SELECT * FROM orders ORDER BY created_at DESC', (err, orders) => {
        if (!orders || orders.length === 0) return res.json([]);
        const orderIds = orders.map(o => o.id);
        connection.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds], (err, items) => {
            res.json(orders.map(order => ({ ...order, items: (items || []).filter(item => item.order_id === order.id) })));
        });
    });
});

// Admin Product Upload with Image
app.post('/api/admin/products', authAdmin, upload.single('image'), (req, res) => {
    const { category_id, name, price, flavor, type, description } = req.body;
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    
    connection.query('INSERT INTO products (category_id, name, price, flavor, type, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [category_id, name, price, flavor, type, description, image_url], (err) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ success: true });
    });
});

app.put('/api/admin/orders/:id', authAdmin, (req, res) => {
    connection.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id], (err) => {
        res.json({ message: 'Updated' });
    });
});

app.listen(5000, () => console.log('Server on 5000'));
