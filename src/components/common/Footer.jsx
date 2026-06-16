import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, X, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bakery-chocolate text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-bakery-pink-400 rounded-lg flex items-center justify-center text-white">
                <span className="font-serif text-2xl font-bold">B</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Bakery<span className="text-bakery-pink-300">Bliss</span>
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed">
              Crafting premium, luxury cakes for your most special moments. From weddings to birthdays, we bring sweetness to your life.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, X].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bakery-pink-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-white/70">
              {[
                { name: 'Home', path: '/' },
                { name: 'Categories', path: '/categories' },
                { name: 'Custom Cakes', path: '/custom-preorder' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/about' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    onClick={() => {
                      if (window.location.pathname === link.path) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-bakery-pink-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex gap-3">
                <MapPin className="text-bakery-pink-400 shrink-0" size={20} />
                <span>123 Baker Street, Sweet City, SC 45678</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-bakery-pink-400 shrink-0" size={20} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-bakery-pink-400 shrink-0" size={20} />
                <span>hello@bakerybliss.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-white/70 mb-4">Subscribe to get special offers and cake updates.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 focus:outline-none focus:border-bakery-pink-400 text-white placeholder:text-white/40"
              />
              <button className="absolute right-1 top-1 w-10 h-10 bg-bakery-pink-400 rounded-full flex items-center justify-center hover:bg-bakery-pink-500 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} BakeryBliss. All rights reserved. Designed for Luxury.</p>
        </div>
      </div>
    </footer>
  );
}
