import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const DetailsModal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
          className="relative bg-white rounded-3xl shadow-premium max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 tracking-wide uppercase">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer border border-slate-200 shadow-sm"
            >
              <FiX className="text-lg" />
            </button>
          </div>
          
          {/* Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {children}
          </div>

          {/* Footer Actions */}
          {actions && (
            <div className="p-5 border-t border-slate-100 shrink-0 bg-slate-50/50 flex justify-end gap-3">
              {actions}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DetailsModal;
