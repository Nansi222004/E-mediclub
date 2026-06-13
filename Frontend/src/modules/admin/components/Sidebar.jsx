import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../auth/admin/store/adminAuthSlice';
import { 
  FiGrid, FiUsers, FiPackage, FiShoppingBag, 
  FiUserCheck, FiActivity, FiLayers, FiSettings, 
  FiLogOut, FiArrowLeft, FiChevronDown, FiHome, FiCalendar, FiCreditCard, FiBarChart2, FiHeart, FiAlertTriangle, FiSliders,
  FiMapPin, FiFileText, FiTruck
} from 'react-icons/fi';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  const [expandedMenus, setExpandedMenus] = useState({
    Orders: true,
    Vendors: false,
    Settings: false,
    Locations: false
  });

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // Menu items list mapping the Complete Menu structure
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', Icon: FiHome },
    { 
      name: 'Orders', 
      Icon: FiShoppingBag,
      children: [
        { name: 'Medicine Orders', path: '/admin/orders/medicines' },
        { name: 'Lab Bookings', path: '/admin/orders/lab-bookings' },
        { name: 'Doctor Appointments', path: '/admin/orders/appointments' }
      ]
    },
    { name: 'Medicines', path: '/admin/medicines', Icon: FiPackage },
    { name: 'Lab Tests', path: '/admin/lab-tests', Icon: FiActivity },
    { name: 'Doctors', path: '/admin/doctors', Icon: FiHeart },
    { 
      name: 'Vendors', 
      Icon: FiUsers,
      children: [
        { name: 'Pharmacies', path: '/admin/vendors?type=pharmacy' },
        { name: 'Labs', path: '/admin/vendors?type=lab' },
        { name: 'Doctors', path: '/admin/vendors?type=doctor' }
      ]
    },
    { name: 'Patients / Users', path: '/admin/patients', Icon: FiUsers },
    {
      name: 'Locations',
      Icon: FiMapPin,
      children: [
        { name: 'City Coverage', path: '/admin/locations/cities' },
        { name: 'Pincode Manager', path: '/admin/locations/pincodes' },
        { name: 'Unserviceable Areas', path: '/admin/locations/gaps' }
      ]
    },
    { name: 'Home Collections', path: '/admin/home-collections', Icon: FiTruck },
    { name: 'Prescriptions', path: '/admin/prescriptions', Icon: FiFileText },
    { name: 'Payments & Revenue', path: '/admin/payments', Icon: FiCreditCard },
    { name: 'Complaints & Disputes', path: '/admin/complaints', Icon: FiAlertTriangle },
    { name: 'Notifications', path: '/admin/notifications', Icon: FiSliders },
    { 
      name: 'Settings', 
      Icon: FiSettings,
      children: [
        { name: 'Admin Users', path: '/admin/settings?tab=users' },
        { name: 'Roles & Permissions', path: '/admin/settings?tab=roles' },
        { name: 'Platform Config', path: '/admin/settings?tab=platform' }
      ]
    }
  ];

  return (
    <motion.aside 
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="fixed top-0 left-0 z-40 h-screen bg-[#0F3D2B] border-r border-[#0A2D1F] shadow-premium flex flex-col justify-between"
    >
      {/* Sidebar Header with Brand */}
      <div className="overflow-hidden flex flex-col flex-1">
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#0A2D1F] shrink-0">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/10 shadow-sm flex items-center justify-center bg-white shrink-0">
              <img
                src="/assets/logo_emblem.png"
                alt="E Mediclub Icon"
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>
            {isOpen && (
              <span 
                style={{ 
                  fontFamily: "'Great Vibes', cursive",
                  color: '#8B2635'
                }} 
                className="text-2xl font-bold shrink-0 tracking-wide pt-1"
              >
                Emediclub
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items list */}
        <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
          {menuItems.map((item) => {
            const hasChildren = !!item.children;
            const isMenuExpanded = expandedMenus[item.name];
            
            // For simple items
            if (!hasChildren) {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-wider uppercase transition-all duration-200 tap-scale
                    ${isActive 
                      ? 'bg-[#F5A623] text-white shadow-md font-extrabold' 
                      : 'text-emerald-100/80 hover:bg-[#1A5C38] hover:text-white'
                    }
                  `}
                >
                  <item.Icon className={`text-lg shrink-0 ${isActive ? 'text-white' : 'text-white/80'}`} />
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
            }

            // For expandable nested items
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-wider uppercase transition-all duration-200 tap-scale cursor-pointer border-0 bg-transparent text-left
                    text-emerald-100/80 hover:bg-[#1A5C38] hover:text-white
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <item.Icon className="text-lg shrink-0 text-white/80" />
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </div>
                  {isOpen && (
                    <FiChevronDown className={`transition-transform duration-250 ${isMenuExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Submenu Children container */}
                <AnimatePresence initial={false}>
                  {isOpen && isMenuExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden flex flex-col gap-1 pl-9 pr-1"
                    >
                      {item.children.map((child) => {
                        const isChildActive = location.pathname + location.search === child.path || location.pathname === child.path;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={`
                              px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-150
                              ${isChildActive
                                ? 'bg-white/10 text-white font-extrabold'
                                : 'text-emerald-250/70 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            {child.name}
                          </NavLink>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with collapse toggle and logout */}
      <div className="p-3.5 border-t border-[#0A2D1F] flex flex-col gap-2 shrink-0">
        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex items-center gap-3.5 px-4 py-2.5 w-full rounded-2xl text-[11px] font-bold tracking-wider uppercase text-emerald-100/80 hover:bg-[#1A5C38] hover:text-white transition-all text-left tap-scale cursor-pointer border-0 bg-transparent"
        >
          <FiArrowLeft className={`text-lg shrink-0 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
          {isOpen && <span>Collapse Menu</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-2.5 w-full rounded-2xl text-[11px] font-bold tracking-wider uppercase text-yellow-300 hover:bg-[#1A5C38] transition-all text-left tap-scale cursor-pointer border-0 bg-transparent"
        >
          <FiLogOut className="text-lg shrink-0 text-yellow-300" />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

