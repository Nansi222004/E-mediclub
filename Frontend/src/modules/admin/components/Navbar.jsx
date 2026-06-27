import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiBell, FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { adminLogout } from '../../auth/admin/store/adminAuthSlice';

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 shadow-sm">
      {/* Left side: Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors md:hidden cursor-pointer border-0 flex items-center justify-center"
          title="Open Menu"
        >
          <FiMenu className="text-lg" />
        </button>
        <div className="admin-header-page-title leading-none">
          E Mediclub Administration
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/admin/notifications')}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-650 transition-colors relative tap-scale border-0 cursor-pointer"
          title="View Notifications"
        >
          <FiBell className="text-lg" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral animate-pulse" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors tap-scale cursor-pointer border-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#1A7A4A] text-white flex items-center justify-center text-xs">
              <FiUser />
            </div>
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-[#E8F5EE] rounded-2xl shadow-premium z-20 overflow-hidden p-2 flex flex-col gap-1"
                >
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-coral-light/10 hover:bg-coral-light/30 text-xs font-black uppercase text-coral text-left w-full transition-colors shrink-0 border-0 cursor-pointer"
                  >
                    <FiLogOut className="text-sm shrink-0" />
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
