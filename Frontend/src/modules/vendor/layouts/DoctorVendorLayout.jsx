import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FiHome, FiCalendar, FiUser, FiGrid, FiUsers, 
  FiMenu, FiBell, FiChevronDown, FiChevronRight, FiLogOut, FiArrowLeft, FiFileText, FiActivity,
  FiClock, FiVideo, FiDollarSign, FiStar, FiSettings
} from 'react-icons/fi';
import { vendorLogout } from '../../auth/vendor/store/vendorAuthSlice';
import Logo from '../../../shared/components/Logo';

export default function DoctorVendorLayout() {
  const { isAuthenticated, vendorUser } = useSelector(state => state.vendorAuth || { isAuthenticated: false, vendorUser: null });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State to manage expanded accordions
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
      if (isMobileScreen) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    localStorage.removeItem('doctorProfile');
    navigate('/vendor/doctor/login');
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/vendor/doctor/dashboard', icon: FiGrid },
    { 
      name: 'Appointments', icon: FiCalendar, 
      subItems: [
        { name: 'Upcoming', path: '/vendor/doctor/appointments/upcoming' },
        { name: 'Completed', path: '/vendor/doctor/appointments/completed' },
        { name: 'Cancelled', path: '/vendor/doctor/appointments/cancelled' }
      ]
    },
    { 
      name: 'Patients', icon: FiUsers,
      subItems: [
        { name: 'Patient List', path: '/vendor/doctor/patients/list' },
        { name: 'Medical Records', path: '/vendor/doctor/patients/records' },
        { name: 'Prescriptions', path: '/vendor/doctor/patients/prescriptions' }
      ]
    },
    { 
      name: 'Schedule Management', icon: FiClock,
      subItems: [
        { name: 'Availability', path: '/vendor/doctor/schedule/availability' },
        { name: 'Time Slots', path: '/vendor/doctor/schedule/slots' },
        { name: 'Leave Management', path: '/vendor/doctor/schedule/leave' }
      ]
    },
    { 
      name: 'Online Consultation', icon: FiVideo,
      subItems: [
        { name: 'Video Calls', path: '/vendor/doctor/consultations/video' },
        { name: 'Chat Consultations', path: '/vendor/doctor/consultations/chat' }
      ]
    },
    { 
      name: 'Prescription Center', icon: FiFileText,
      subItems: [
        { name: 'Create Prescription', path: '/vendor/doctor/prescriptions/create' },
        { name: 'Prescription History', path: '/vendor/doctor/prescriptions/history' }
      ]
    },
    { 
      name: 'Earnings', icon: FiDollarSign,
      subItems: [
        { name: 'Revenue', path: '/vendor/doctor/earnings/revenue' },
        { name: 'Transactions', path: '/vendor/doctor/earnings/transactions' },
        { name: 'Withdrawals', path: '/vendor/doctor/earnings/withdrawals' }
      ]
    },
    { name: 'Reviews & Ratings', path: '/vendor/doctor/reviews', icon: FiStar },
    { name: 'Notifications', path: '/vendor/doctor/notifications', icon: FiBell },
    { name: 'Reports & Analytics', path: '/vendor/doctor/reports', icon: FiActivity },
    { name: 'Profile', path: '/vendor/doctor/profile', icon: FiUser },
    { name: 'Settings', path: '/vendor/doctor/settings', icon: FiSettings }
  ];

  const mobileNavItems = [
    { name: 'Dashboard', path: '/vendor/doctor/dashboard', icon: FiGrid },
    { name: 'Appointments', path: '/vendor/doctor/appointments/upcoming', icon: FiCalendar },
    { name: 'Consults', path: '/vendor/doctor/consultations/video', icon: FiVideo },
    { name: 'Profile', path: '/vendor/doctor/profile', icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Backdrop Overlay on mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black"
          />
        )}
      </AnimatePresence>

      {/* 2. Sidebar Navigation */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#135A5A] text-white border-r border-[#0F4A4A] shadow-premium flex flex-col justify-between overflow-hidden`}
        style={{ width: isSidebarOpen ? '256px' : isMobile ? '0px' : '80px', transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <div className="flex flex-col h-[calc(100%-80px)]">
          {/* Brand Logo */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-[#0F4A4A] shrink-0 bg-white/10">
            <div className="overflow-hidden flex items-center whitespace-nowrap pt-2 bg-white rounded-xl px-2 py-1">
              <Logo showText={isSidebarOpen} layout="horizontal" />
            </div>
            <button 
              onClick={toggleSidebar} 
              className="hidden md:flex p-1.5 rounded-xl hover:bg-white/10 text-[#88D4D3] hover:text-white transition-colors border-0 cursor-pointer"
            >
              <FiArrowLeft className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
            </button>
          </div>

          {/* Links */}
          <nav className="p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pb-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.name];
              const isParentActive = hasSubItems && item.subItems.some(sub => location.pathname.startsWith(sub.path));
              
              if (hasSubItems) {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => {
                        if (!isSidebarOpen) toggleSidebar();
                        toggleMenu(item.name);
                      }}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 border-0 cursor-pointer
                        ${isParentActive 
                          ? 'bg-[#0F4A4A] text-white' 
                          : 'text-[#9ADCDA] bg-transparent hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className="text-lg shrink-0" />
                        {isSidebarOpen && <span className="truncate">{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <FiChevronDown className={`transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    <AnimatePresence>
                      {isSidebarOpen && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col mt-1 ml-2 pl-4 border-l-2 border-[#207B7B]"
                        >
                          {item.subItems.map(subItem => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              className={({ isActive }) => `
                                py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-colors my-0.5
                                ${isActive ? 'bg-[#207B7B] text-white' : 'text-[#88D4D3] hover:text-white hover:bg-white/5'}
                              `}
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Normal single item
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 tap-scale
                    ${isActive 
                      ? 'bg-teal text-white shadow-md' 
                      : 'text-[#9ADCDA] hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="text-lg shrink-0" />
                  {isSidebarOpen && (
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

      </aside>

      {/* 3. Main Dashboard Window */}
      <div 
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ paddingLeft: isMobile ? '0px' : isSidebarOpen ? '256px' : '80px' }}
      >
        
        {/* Top Header navbar */}
        <header className="sticky top-0 z-35 h-20 bg-white/90 backdrop-blur px-6 lg:px-8 flex items-center justify-between shadow-sm border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border-0 cursor-pointer md:hidden"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                <span className="hidden sm:inline">Welcome back, </span>Dr. John Smith
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                Monday, June 12, 2026
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 w-64">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search patients..." 
                className="bg-transparent border-none outline-none w-full ml-2 text-sm text-slate-600 placeholder:text-slate-400"
              />
            </div>

            {/* Online Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 border border-emerald-100 px-2 sm:px-3 py-1.5 rounded-full select-none cursor-pointer hover:bg-emerald-100 transition-colors">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 hidden sm:block">Online</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors border-0 bg-transparent cursor-pointer">
              <FiBell className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral"></span>
            </button>

          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 bg-slate-50 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>

      {/* 4. Bottom mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around z-30 md:hidden shadow-app-bar px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
            >
              <Icon className="text-xl" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}} />

    </div>
  );
}
