import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Instagram, X, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in <span className="text-bakery-pink-500">Touch</span></h1>
          <p className="text-bakery-chocolate/60 max-w-2xl mx-auto">
            Have questions about our cakes or want to place a custom order? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-bakery-pink-100/30 border border-bakery-pink-50">
              <h2 className="text-2xl font-bold text-bakery-chocolate mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-bakery-pink-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-bakery-chocolate mb-1">Phone</h3>
                    <p className="text-bakery-chocolate/60">+1 (234) 567-890</p>
                    
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-bakery-pink-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-bakery-chocolate mb-1">Email</h3>
                    <p className="text-bakery-chocolate/60">hello@bakerybliss.com</p>
                    <p className="text-bakery-chocolate/60">orders@bakerybliss.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-bakery-pink-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-bakery-chocolate mb-1">Address</h3>
                    <p className="text-bakery-chocolate/60">123 Sweet Street</p>
                    <p className="text-bakery-chocolate/60">Cake Town, CT 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-bakery-pink-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-bakery-chocolate mb-1">Working Hours</h3>
                    <p className="text-bakery-chocolate/60">Mon - Sat: 9:00 AM - 9:00 PM</p>
                    <p className="text-bakery-chocolate/60">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-bakery-pink-100/30 border border-bakery-pink-50">
              <h2 className="text-2xl font-bold text-bakery-chocolate mb-6">Follow Us</h2>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-bakery-pink-100 rounded-full flex items-center justify-center hover:bg-bakery-pink-500 hover:text-white transition-colors">
                  <X size={20} />
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-bakery-pink-100/30 border border-bakery-pink-50">
              <h2 className="text-2xl font-bold text-bakery-chocolate mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/70">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 px-4 focus:outline-none focus:border-bakery-pink-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/70">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 px-4 focus:outline-none focus:border-bakery-pink-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 px-4 focus:outline-none focus:border-bakery-pink-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 px-4 focus:outline-none focus:border-bakery-pink-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/70">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-xl py-3 px-4 focus:outline-none focus:border-bakery-pink-400 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-2"
                >
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-bakery-pink-100/30 border border-bakery-pink-50">
            <h2 className="text-2xl font-bold text-bakery-chocolate mb-6">Find Us on Map</h2>
            <div className="rounded-[30px] overflow-hidden bg-bakery-pink-50 h-80 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-bakery-pink-300 mx-auto mb-4" />
                <p className="text-bakery-chocolate/60">Map integration coming soon</p>
                <p className="text-sm text-bakery-chocolate/40 mt-2">123 Sweet Street, Cake Town, CT 12345</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
