import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiBell, FiActivity, FiCheckCircle, FiUser, FiChevronDown } from 'react-icons/fi';
import { vendorLogout } from '../../auth/vendor/store/vendorAuthSlice';

export default function VendorNavbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { kycDetails } = useSelector(state => state.vendor);

  return (
    <header className="sticky top-0 z-30 h-20 glass-navbar px-4 sm:px-6 flex items-center justify-between shadow-sm">
      
      {/* Left side store trigger */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-800 tracking-wide uppercase leading-none">
              {kycDetails.storeName}
            </h2>
            {kycDetails.status === 'verified' ? (
              <span className="flex items-center gap-0.5 text-[8px] bg-teal-light text-teal border border-teal/10 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 leading-none">
                <FiCheckCircle className="text-[10px]" /> Verified Seller
              </span>
            ) : (
              <span className="text-[8px] bg-gold-light text-gold-dark border border-gold/10 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 leading-none">
                KYC Pending
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
            Store Manager Terminal
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        
        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative tap-scale"
          >
            <FiBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-premium z-20 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Store Alerts</span>
                  </div>

                  <div className="p-4 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-1.5">
                    <FiBell className="text-xl text-teal animate-bounce" />
                    <span>No pending alerts. All delivery shipments are dispatched!</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar info */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100/50 transition-colors tap-scale text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal to-forest text-white flex items-center justify-center text-xs font-black uppercase">
              WR
            </div>
            <div className="hidden md:block text-left">
              <h4 className="text-xs font-black text-slate-800 leading-none">Store Operator</h4>
              <span className="text-[9px] text-teal font-extrabold uppercase mt-0.5 block tracking-wide">License verified</span>
            </div>
            <FiChevronDown className="text-slate-400 text-xs hidden sm:block shrink-0" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                {/* Backdrop overlay */}
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-premium z-20 overflow-hidden p-3 flex flex-col gap-2"
                >
                  <div className="px-3 py-2 border-b border-slate-50 text-left">
                    <h4 className="text-xs font-black text-slate-850 truncate">{kycDetails.storeName || 'MedPlus Wellness Pharmacy'}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-slate-500 font-semibold">Store Operator</span>
                      <span className="text-[7.5px] bg-teal-light text-teal border border-teal/10 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 leading-none">
                        Verified Seller
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowProfileDropdown(false); navigate('/vendor/profile'); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-650 text-left w-full transition-colors"
                  >
                    <FiUser className="text-sm text-teal shrink-0" />
                    <span>My Profile</span>
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      dispatch(vendorLogout());
                      navigate('/vendor/auth');
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-coral-light/20 hover:bg-coral-light/50 text-xs font-black uppercase text-coral text-left w-full transition-colors shrink-0"
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
}
