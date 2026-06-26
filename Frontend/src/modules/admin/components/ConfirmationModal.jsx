import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-3xl shadow-premium max-w-md w-full p-6 overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border-0"
          >
            <FiX className="text-lg" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
              <FiAlertTriangle className="text-3xl" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-wide">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">{message}</p>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border-0 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white transition-colors border-0 cursor-pointer shadow-sm ${
                isDanger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#1A7A4A] hover:bg-[#135A5A]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
