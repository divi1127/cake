import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Camera, Heart, Star, Palette, Layers, Cake, MapPin, Send, ChevronRight, Plus, CheckCircle } from 'lucide-react';

export default function CustomPreorder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    shape: 'Round',
    flavor: '',
    weight: '1 KG',
    theme: '',
    instructions: ''
  });

  const eventTypes = ['Birthday', 'Wedding', 'Anniversary', 'Baby Shower', 'Corporate', 'Engagement'];
  const shapes = ['Round', 'Square', 'Heart', 'Tier Cake'];
  const colors = ['#fbcfe8', '#fecdd3', '#fff3cc', '#dfd3cc', '#c7d2fe', '#d1fae5'];

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const preorders = JSON.parse(localStorage.getItem('bakery_preorders') || '[]');
    const newPreorder = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('bakery_preorders', JSON.stringify([...preorders, newPreorder]));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[50px] p-12 text-center max-w-lg shadow-2xl shadow-bakery-pink-100/50 w-full"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={64} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-bakery-chocolate mb-4">Request Sent!</h1>
          <p className="text-bakery-chocolate/60 mb-8 leading-relaxed">
            Your custom cake request has been sent to our master chefs. We'll review the details and get back to you within 24 hours.
          </p>
          <button className="btn-primary w-full py-4 text-lg" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-bakery-cream-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Your <span className="text-bakery-pink-500">Masterpiece</span></h1>
          <p className="text-bakery-chocolate/60">Tell us about your dream cake, and our master chefs will bring it to life.</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-12 relative px-4 md:px-20">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-bakery-pink-100 -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= i ? 'bg-bakery-pink-500 text-white shadow-lg' : 'bg-white text-bakery-chocolate border border-bakery-pink-100'}`}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-bakery-pink-100/50 p-8 md:p-12 overflow-hidden relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-bakery-chocolate mb-6 flex items-center gap-2">
                    <Star className="text-bakery-pink-500" size={24} /> Basic Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/70">Event Type</label>
                      <select 
                        className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-bakery-pink-400"
                        value={formData.eventType}
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                      >
                        <option value="">Select Event</option>
                        {eventTypes.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/70">Delivery Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-bakery-pink-500" size={20} />
                        <input 
                          type="date" 
                          className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-bakery-pink-400"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-bakery-chocolate mb-4">Select Shape</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shapes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setFormData({...formData, shape: s})}
                        className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${formData.shape === s ? 'border-bakery-pink-500 bg-bakery-pink-50 text-bakery-pink-600' : 'border-bakery-pink-50 hover:border-bakery-pink-200'}`}
                      >
                        <Cake size={32} />
                        <span className="font-bold text-sm">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button onClick={nextStep} className="btn-primary flex items-center gap-2 px-10">
                    Next Step <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-bakery-chocolate mb-6 flex items-center gap-2">
                    <Palette className="text-bakery-pink-500" size={24} /> Design & Flavors
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/70">Theme Selection</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Unicorn, Space, Minimalist"
                        className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-bakery-pink-400"
                        value={formData.theme}
                        onChange={(e) => setFormData({...formData, theme: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/70">Weight (KG)</label>
                      <select 
                        className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-bakery-pink-400"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      >
                        <option>1 KG</option>
                        <option>2 KG</option>
                        <option>3 KG</option>
                        <option>5+ KG</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-bakery-chocolate mb-4">Base Color Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((c) => (
                      <button 
                        key={c}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <button className="w-12 h-12 rounded-full border-2 border-dashed border-bakery-pink-200 flex items-center justify-center text-bakery-pink-500 hover:bg-bakery-pink-50 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-secondary px-10">Back</button>
                  <button onClick={nextStep} className="btn-primary flex items-center gap-2 px-10">
                    Next Step <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-bakery-chocolate mb-6 flex items-center gap-2">
                    <Layers className="text-bakery-pink-500" size={24} /> Final Touches
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-bakery-chocolate/70">Special Instructions</label>
                      <textarea 
                        rows="4"
                        placeholder="Tell us any specific details, names to be written, etc."
                        className="w-full bg-bakery-cream-50 border border-bakery-pink-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-bakery-pink-400"
                        value={formData.instructions}
                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      ></textarea>
                    </div>
                    
                    <div className="p-10 bg-bakery-pink-50 rounded-[30px] border-2 border-dashed border-bakery-pink-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-bakery-pink-100 transition-colors">
                      <Camera className="text-bakery-pink-500 mb-4 group-hover:scale-110 transition-transform" size={48} />
                      <h3 className="text-lg font-bold text-bakery-chocolate">Upload Inspiration Image</h3>
                      <p className="text-bakery-chocolate/60 max-w-xs mt-2">Have a photo of a cake you love? Upload it here and we'll recreate it for you.</p>
                      <button className="mt-4 px-6 py-2 bg-white rounded-full text-sm font-bold text-bakery-pink-600 shadow-sm">Browse Files</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="btn-secondary px-10">Back</button>
                  <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 px-10">
                    Submit Request <Send size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[30px] border border-bakery-pink-50">
            <h4 className="font-bold text-bakery-chocolate mb-2">Estimated Delivery</h4>
            <p className="text-bakery-chocolate/60 text-sm">Custom orders require at least 2-3 days notice for preparation.</p>
          </div>
          <div className="bg-white p-8 rounded-[30px] border border-bakery-pink-50">
            <h4 className="font-bold text-bakery-chocolate mb-2">Payment Terms</h4>
            <p className="text-bakery-chocolate/60 text-sm">50% advance payment is required to confirm custom orders.</p>
          </div>
          <div className="bg-white p-8 rounded-[30px] border border-bakery-pink-50">
            <h4 className="font-bold text-bakery-chocolate mb-2">Quality Assurance</h4>
            <p className="text-bakery-chocolate/60 text-sm">All our custom cakes are baked fresh using premium ingredients.</p>
          </div>
        </div>
      </div>
    </div>
  );
}