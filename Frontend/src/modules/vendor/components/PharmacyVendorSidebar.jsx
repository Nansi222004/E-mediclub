import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import Logo from '../../../shared/components/Logo';
import { 
  FiGrid, FiShoppingBag, FiLayers, FiPackage, FiFolder, 
  FiArchive, FiTag, FiUsers, FiDollarSign, 
  FiPieChart, FiBell, FiUser, 
  FiArrowLeft, FiChevronDown, FiMapPin, FiStar, FiSettings
} from 'react-icons/fi';

export default function PharmacyVendorSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/vendor/pharmacy/dashboard', icon: FiGrid },
    { name: 'Orders', path: '/vendor/pharmacy/orders', icon: FiShoppingBag },
    { name: 'Prescription Orders', path: '/vendor/pharmacy/prescriptions', icon: FiLayers },
    { name: 'Medicines', path: '/vendor/pharmacy/medicines', icon: FiPackage },
    { name: 'Health Devices', path: '/vendor/pharmacy/devices', icon: FiFolder },
    { name: 'Inventory', path: '/vendor/pharmacy/inventory', icon: FiArchive },
    { name: 'Service Areas', path: '/vendor/pharmacy/service-areas', icon: FiMapPin },
    { name: 'Promotions', path: '/vendor/pharmacy/promotions', icon: FiTag },
    { name: 'Customers', path: '/vendor/pharmacy/customers', icon: FiUsers },
    { name: 'Revenue', path: '/vendor/pharmacy/revenue', icon: FiDollarSign },
    { name: 'Analytics', path: '/vendor/pharmacy/analytics', icon: FiPieChart },
    { name: 'Reviews', path: '/vendor/pharmacy/reviews', icon: FiStar },
    { name: 'Notifications', path: '/vendor/pharmacy/notifications', icon: FiBell },
    { name: 'Profile', path: '/vendor/pharmacy/profile', icon: FiUser },
    { name: 'Settings', path: '/vendor/pharmacy/settings', icon: FiSettings },
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
      } bg-[#135A5A] border-r border-[#0F4A4A] shadow-premium flex flex-col justify-between`}
    >
      {/* Brand area */}
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#0F4A4A] shrink-0">
          <div className="overflow-hidden bg-white px-2 py-1.5 rounded-lg shadow-sm">
            <Logo showText={isOpen} />
          </div>
          <button 
            onClick={toggleSidebar} 
            className="hidden md:flex p-1.5 rounded-xl hover:bg-[#0F4A4A] text-teal-100 transition-colors shrink-0"
          >
            <FiArrowLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Links list */}
        <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 150px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex flex-col">
                  <NavLink
                    to={item.path}
                    className={({ isActive: isLinkActive }) => `
                      flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 tap-scale
                      ${isLinkActive 
                        ? 'bg-teal text-white shadow-md' 
                        : 'text-[#9ADCDA] hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="text-lg shrink-0" />
                    {isOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                        {item.name}
                      </motion.span>
                    )}
                  </NavLink>
              </div>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
