import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../context/ShopContext';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';

export default function Notification() {
  const { notification } = useShop();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[100] min-w-[300px]"
        >
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-green-50/90 border-green-100 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50/90 border-red-100 text-red-800'
              : 'bg-bakery-pink-50/90 border-bakery-pink-100 text-bakery-pink-800'
          }`}>
            {notification.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
            {notification.type === 'error' && <XCircle className="text-red-500" size={24} />}
            {notification.type === 'info' && <Info className="text-bakery-pink-500" size={24} />}
            
            <p className="font-bold pr-8">{notification.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
