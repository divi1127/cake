import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import CustomPreorder from './pages/CustomPreorder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/common/ScrollToTop';
import Notification from './components/common/Notification';

import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <Notification />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products/:categorySlug" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/custom-preorder" element={<CustomPreorder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ShopProvider>
  );
}

export default App;
