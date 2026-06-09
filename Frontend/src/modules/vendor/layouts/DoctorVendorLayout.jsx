import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FiHome, FiCalendar, FiUser, FiGrid, FiUsers, 
  FiMenu, FiBell, FiChevronDown, FiLogOut, FiArrowLeft
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
    dispatch(vendorLogout());
    navigate('/vendor/auth');
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/vendor/doctor/dashboard', icon: FiGrid },
    { name: 'Consultations', path: '/vendor/doctor/schedule', icon: FiCalendar },
    { name: 'Patients', path: '/vendor/doctor/patients', icon: FiUsers },
    { name: 'KYC Profile', path: '/vendor/doctor/profile', icon: FiUser },
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
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-slate-100 shadow-premium flex flex-col justify-between`}
        style={{ width: isSidebarOpen ? '256px' : isMobile ? '0px' : '80px', transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <div>
          {/* Brand Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
            <div className="overflow-hidden">
              <Logo showText={isSidebarOpen} />
            </div>
            <button 
              onClick={toggleSidebar} 
              className="hidden md:flex p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-teal transition-colors border-0 cursor-pointer"
            >
              <FiArrowLeft className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
            </button>
          </div>

          {/* Links */}
          <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-160px)]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 tap-scale
                    ${isActive 
                      ? 'bg-teal/10 text-teal shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
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

        {/* Footer controls */}
        <div className="p-3.5 border-t border-slate-50 flex flex-col gap-1.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 w-full rounded-2xl text-xs font-black tracking-wider uppercase text-coral hover:bg-coral-light/60 transition-all text-left tap-scale cursor-pointer border-0"
          >
            <FiLogOut className="text-lg shrink-0" />
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 3. Main Dashboard Window */}
      <div 
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ paddingLeft: isMobile ? '0px' : isSidebarOpen ? '256px' : '80px' }}
      >
        
        {/* Top Header navbar */}
        <header className="sticky top-0 z-35 h-20 bg-white/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border-0 cursor-pointer"
            >
              <FiMenu className="text-xl" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800 tracking-wide uppercase leading-none">
                  {vendorUser?.name || 'Dr. Ramesh'}
                </h2>
                <span className="flex items-center gap-0.5 text-[8px] bg-teal-light text-teal border border-teal/10 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 leading-none">
                  👨‍⚕️ Medical Practitioner
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                Doctor Console Terminal
              </p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors relative tap-scale border-0 cursor-pointer"
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
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Clinical Alerts</span>
                      </div>
                      <div className="p-4 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-1.5">
                        <FiBell className="text-xl text-teal animate-bounce" />
                        <span>No pending checkups.</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-150 transition-colors tap-scale text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal to-forest text-white flex items-center justify-center text-xs font-black uppercase">
                  DR
                </div>
                <div className="hidden md:block text-left">
                  <h4 className="text-xs font-black text-slate-800 leading-none">Practitioner</h4>
                  <span className="text-[9px] text-teal font-extrabold uppercase mt-0.5 block tracking-wide">MD Verified</span>
                </div>
                <FiChevronDown className="text-slate-400 text-xs hidden sm:block shrink-0" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-premium z-20 overflow-hidden p-3 flex flex-col gap-2"
                    >
                      <div className="px-3 py-2 border-b border-slate-50">
                        <h4 className="text-xs font-black text-slate-850 truncate">{vendorUser?.name || 'Dr. Ramesh'}</h4>
                        <span className="text-[8px] bg-teal-light text-teal border border-teal/10 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 mt-1.5 inline-block">
                          REGISTERED PHYSICIAN
                        </span>
                      </div>
                      <button 
                        onClick={() => { setShowProfileDropdown(false); navigate('/vendor/doctor/profile'); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-650 text-left w-full transition-colors border-0 bg-transparent cursor-pointer"
                      >
                        <FiUser className="text-sm text-teal shrink-0" />
                        <span>My Profile</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-coral-light/20 hover:bg-coral-light/50 text-xs font-black uppercase text-coral text-left w-full transition-colors shrink-0 border-0 cursor-pointer"
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

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 4. Bottom mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around z-30 md:hidden shadow-app-bar px-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
            >
              <Icon className="text-xl" />
              <span>{item.name.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>

    </div>
  );
}
