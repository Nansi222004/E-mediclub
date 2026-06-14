import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { vendorLogout } from '../../auth/vendor/store/vendorAuthSlice';
import Logo from '../../../shared/components/Logo';
import { 
  FiGrid, FiPackage, FiShoppingBag, FiLayers, FiTrendingUp, 
  FiDollarSign, FiUser, FiHome, FiLogOut, FiArrowLeft
} from 'react-icons/fi';

export default function VendorSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/vendor/pharmacy/dashboard', icon: FiGrid },
    { name: 'Orders', path: '/vendor/pharmacy/orders', icon: FiShoppingBag },
    { name: 'My Medicines', path: '/vendor/pharmacy/medicines', icon: FiPackage },
    { name: 'Prescriptions', path: '/vendor/pharmacy/prescriptions', icon: FiLayers },
    { name: 'Earnings', path: '/vendor/pharmacy/earnings', icon: FiTrendingUp },
    { name: 'My Profile', path: '/vendor/pharmacy/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    localStorage.removeItem('pharmacyToken');
    localStorage.removeItem('pharmacyProfile');
    navigate('/vendor/pharmacy/login');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
        isOpen ? 'w-64 translate-x-0' : 'w-20 md:translate-x-0 -translate-x-full'
      } bg-white border-r border-slate-100 shadow-premium flex flex-col justify-between`}
    >
      {/* Brand area */}
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
          <div className="overflow-hidden">
            <Logo showText={isOpen} />
          </div>
          <button 
            onClick={toggleSidebar} 
            className="hidden md:flex p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-teal transition-colors"
          >
            <FiArrowLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Links list */}
        <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 tap-scale
                  ${isActive 
                    ? 'bg-[#1A7A4A]/10 text-[#1A7A4A] shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
                  }
                `}
              >
                <Icon className="text-lg shrink-0" />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-3.5 border-t border-slate-50 flex flex-col gap-1.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-2xl text-xs font-black tracking-wider uppercase text-coral hover:bg-coral-light/60 transition-all text-left tap-scale cursor-pointer"
        >
          <FiLogOut className="text-lg shrink-0" />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
