const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// --- DEFINE APP DB CONNECTIONS (WILL BE ASSIGNED IN INDEX.JS ON BOOT) ---
app.set('db', null); // Reference to connection

// --- AUTOMATION ROUTE REGISTRY ---
const whatsappRoutes = require('./routes/whatsappRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/cart', cartRoutes);

module.exports = app;
