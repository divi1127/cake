import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Save, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('bakery_user') || '{}');
    setUser(savedUser);
    setEditedUser(savedUser);
  }, []);

  const handleSave = () => {
    localStorage.setItem('bakery_user', JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-bakery-chocolate/60 hover:text-bakery-chocolate mb-8 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 md:p-12 border border-bakery-pink-50 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-serif font-bold text-bakery-chocolate mb-2">My Profile</h1>
              <p className="text-bakery-chocolate/60">Manage your personal information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-bakery-pink-500 text-white rounded-full font-bold hover:bg-bakery-chocolate transition-all flex items-center gap-2 shadow-lg shadow-bakery-pink-200"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-bakery-pink-50 mb-10">
            <div className="relative">
              <div className="w-32 h-32 bg-bakery-pink-100 rounded-full flex items-center justify-center border-8 border-bakery-cream-50 shadow-xl overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}`} 
                  alt="Profile" 
                  className="w-full h-full" 
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-bakery-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-bakery-chocolate transition-colors">
                  <Camera size={18} />
                </button>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-bakery-chocolate mb-1">{user.name || 'Your Name'}</h2>
              <p className="text-bakery-chocolate/60 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email || 'your.email@example.com'}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-bold text-bakery-chocolate uppercase tracking-widest text-xs opacity-40">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser.name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                      <User size={20} className="text-bakery-pink-500" />
                      <span className="font-bold text-bakery-chocolate">{user.name || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                      <Mail size={20} className="text-bakery-pink-500" />
                      <span className="font-bold text-bakery-chocolate">{user.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                      <Phone size={20} className="text-bakery-pink-500" />
                      <span className="font-bold text-bakery-chocolate">{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Birthday</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={editedUser.birthday || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                      <Calendar size={20} className="text-bakery-pink-500" />
                      <span className="font-bold text-bakery-chocolate">{user.birthday || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-bakery-chocolate uppercase tracking-widest text-xs opacity-40">Address Information</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-bakery-chocolate/60">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedUser.address || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter your street address"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                      <MapPin size={20} className="text-bakery-pink-500" />
                      <span className="font-bold text-bakery-chocolate">{user.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={editedUser.city || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                        placeholder="City"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                        <span className="font-bold text-bakery-chocolate">{user.city || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={editedUser.state || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                        placeholder="State"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                        <span className="font-bold text-bakery-chocolate">{user.state || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-bakery-chocolate/60">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="zipCode"
                        value={editedUser.zipCode || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl border border-bakery-pink-50 focus:border-bakery-pink-500 focus:outline-none transition-colors"
                        placeholder="ZIP Code"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-bakery-cream-50 rounded-2xl">
                        <span className="font-bold text-bakery-chocolate">{user.zipCode || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t border-bakery-pink-50">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-bakery-pink-500 text-white rounded-full font-bold hover:bg-bakery-chocolate transition-all flex items-center justify-center gap-2 shadow-lg shadow-bakery-pink-200"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-bakery-cream-50 text-bakery-chocolate rounded-full font-bold hover:bg-bakery-pink-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
