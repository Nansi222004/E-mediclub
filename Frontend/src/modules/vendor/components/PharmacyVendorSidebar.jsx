import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import Logo from '../../../shared/components/Logo';
import { 
  FiGrid, FiShoppingBag, FiLayers, FiPackage, FiFolder, 
  FiArchive, FiTag, FiUsers, FiDollarSign, 
  FiPieChart, FiBell, FiUser, 
  FiArrowLeft, FiChevronDown, FiMapPin, FiStar
} from 'react-icons/fi';

export default function PharmacyVendorSidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Keep track of which accordion is open
  const [openAccordion, setOpenAccordion] = useState(null);

  const menuItems = [
    { name: 'Dashboard', path: '/vendor/pharmacy/dashboard', icon: FiGrid },
    { name: 'Orders', path: '/vendor/pharmacy/orders', icon: FiShoppingBag },
    { name: 'Prescription Orders', path: '/vendor/pharmacy/prescriptions', icon: FiLayers },
    { 
      name: 'Medicine Catalog', 
      icon: FiPackage,
      subItems: [
        { name: 'All Medicines', path: '/vendor/pharmacy/medicines' },
        { name: 'Add Medicine', path: '/vendor/pharmacy/medicines/add' },
        { name: 'Prescription Medicines', path: '/vendor/pharmacy/medicines/prescriptions' },
        { name: 'Featured Medicines', path: '/vendor/pharmacy/medicines/featured' },
      ]
    },
    { name: 'Health Devices', path: '/vendor/pharmacy/health-devices', icon: FiFolder },

    { 
      name: 'Inventory', 
      icon: FiArchive,
      subItems: [
        { name: 'Stock Management', path: '/vendor/pharmacy/inventory/stock' },
        { name: 'Low Stock Alerts', path: '/vendor/pharmacy/inventory/alerts' },
        { name: 'Expiry Tracking', path: '/vendor/pharmacy/inventory/expiry' },
      ]
    },
    { 
      name: 'Service Areas', 
      icon: FiMapPin,
      subItems: [
        { name: 'Store Location', path: '/vendor/pharmacy/service/location' },
        { name: 'Coverage Request', path: '/vendor/pharmacy/service/coverage-request' },
      ]
    },
    { 
      name: 'Promotions', 
      icon: FiTag,
      subItems: [
        { name: 'Discounts', path: '/vendor/pharmacy/promotions/discounts' },
        { name: 'Coupons', path: '/vendor/pharmacy/promotions/coupons' },
        { name: 'Banner Management', path: '/vendor/pharmacy/promotions/banners' },
      ]
    },
    { name: 'Customers', path: '/vendor/pharmacy/customers', icon: FiUsers },
    { name: 'Revenue & Payments', path: '/vendor/pharmacy/revenue', icon: FiDollarSign },
    { 
      name: 'Analytics', 
      icon: FiPieChart,
      subItems: [
        { name: 'Sales Analytics', path: '/vendor/pharmacy/analytics/sales' },
        { name: 'Top Medicines', path: '/vendor/pharmacy/analytics/medicines' },
        { name: 'Order Analytics', path: '/vendor/pharmacy/analytics/orders' },
        { name: 'Customer Analytics', path: '/vendor/pharmacy/analytics/customers' },
      ]
    },
    { 
      name: 'Reviews & Ratings', 
      icon: FiStar,
      subItems: [
        { name: 'Product Review', path: '/vendor/pharmacy/reviews/products' },
        { name: 'Customer Feedback', path: '/vendor/pharmacy/reviews/feedback' },
      ]
    },
    { name: 'Notifications', path: '/vendor/pharmacy/notifications', icon: FiBell },
    { name: 'Profile', path: '/vendor/pharmacy/profile', icon: FiUser },
  ];

  const handleLogout = () => {
    localStorage.removeItem('pharmacyToken');
    localStorage.removeItem('pharmacyProfile');
    navigate('/vendor/pharmacy/login');
  };

  const toggleAccordion = (name) => {
    if (!isOpen) {
      toggleSidebar(); // Force open sidebar if they click an accordion while collapsed
      setOpenAccordion(name);
    } else {
      setOpenAccordion(openAccordion === name ? null : name);
    }
  };

  // Determine if a submenu item is active
  const isSubmenuActive = (subItems) => {
    return subItems?.some(sub => location.pathname.includes(sub.path));
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
            const hasSubMenu = !!item.subItems;
            const isActive = item.path ? location.pathname === item.path : isSubmenuActive(item.subItems);
            const isExpanded = openAccordion === item.name;

            return (
              <div key={item.name} className="flex flex-col">
                {hasSubMenu ? (
                  <button
                    onClick={() => toggleAccordion(item.name)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 border-0 cursor-pointer w-full
                      ${isExpanded 
                        ? 'bg-[#0F4A4A] text-white' 
                        : 'text-[#9ADCDA] bg-transparent hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="text-lg shrink-0" />
                      {isOpen && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                          {item.name}
                        </motion.span>
                      )}
                    </div>
                    {isOpen && (
                      <FiChevronDown className={`text-sm transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                ) : (
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
                )}

                {/* Render Accordion Sub-items */}
                {hasSubMenu && isOpen && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1 py-1.5 pl-11 pr-2">
                          {item.subItems.map((subItem) => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              className={({ isActive: isSubActive }) => `
                                py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-colors my-0.5 block truncate
                                ${isSubActive ? 'bg-[#207B7B] text-white' : 'text-[#88D4D3] hover:text-white hover:bg-white/5'}
                              `}
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
