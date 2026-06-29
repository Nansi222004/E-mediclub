import { useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FiHome, FiActivity, FiUser, FiGrid, FiFileText, 
  FiMenu, FiBell, FiChevronDown, FiArrowLeft,
  FiChevronRight, FiUpload, FiClock, FiLayers, FiUsers, FiDollarSign, FiPieChart, FiSettings, FiStar
} from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';

export default function LabVendorLayout() {
  const { isAuthenticated, vendorUser } = useSelector(state => state.vendorAuth || { isAuthenticated: false, vendorUser: null });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState('Test Orders');

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

  useEffect(() => {
    const activeItem = sidebarItems.find(item => 
      item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.path))
    );
    if (activeItem) {
      setExpandedMenu(activeItem.name);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('labToken');
    localStorage.removeItem('labProfile');
    navigate('/vendor/lab/login');
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/vendor/lab/dashboard', icon: FiGrid },
    { name: 'Test Orders', path: '/vendor/lab/orders', icon: FiFileText },
    { name: 'Home Collection', path: '/vendor/lab/collections', icon: FiHome },
    { name: 'Tests', path: '/vendor/lab/tests', icon: FiActivity },
    { name: 'Packages', path: '/vendor/lab/packages', icon: FiLayers },
    { name: 'Upload Reports', path: '/vendor/lab/reports/upload', icon: FiUpload },
    { name: 'Report History', path: '/vendor/lab/reports/history', icon: FiClock },
    { name: 'Customers', path: '/vendor/lab/customers', icon: FiUsers },
    { name: 'Reviews', path: '/vendor/lab/reviews', icon: FiStar },
    { name: 'Revenue', path: '/vendor/lab/revenue', icon: FiPieChart },
    { name: 'Analytics', path: '/vendor/lab/analytics', icon: FiActivity },
    { name: 'Notifications', path: '/vendor/lab/notifications', icon: FiBell },
    { name: 'Profile', path: '/vendor/lab/profile', icon: FiUser },
    { name: 'Settings', path: '/vendor/lab/settings', icon: FiSettings },
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
        className="fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#135A5A] text-white border-r border-[#0F4A4A] shadow-premium flex flex-col justify-between overflow-hidden"
        style={{ width: isSidebarOpen ? '256px' : isMobile ? '0px' : '80px', transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)' }}
      >
        <div>
          {/* Brand Logo */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-[#0F4A4A] shrink-0 bg-white/10">
            <div className="overflow-hidden flex items-center bg-white rounded-xl px-2 py-1">
              <Logo showText={isSidebarOpen} />
            </div>
            <button 
              onClick={toggleSidebar} 
              className="hidden md:flex p-1.5 rounded-xl hover:bg-white/10 text-[#88D4D3] hover:text-white transition-colors border-0 cursor-pointer"
            >
              <FiArrowLeft className={`transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
            </button>
          </div>

          <div className="px-5 py-5 border-b border-[#0F4A4A] flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=central" alt="Central Lab" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white/20" />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h3 className="text-sm font-medium text-white truncate">Central Lab</h3>
                <p className="text-[10px] text-[#88D4D3] font-medium truncate">Lead Technician</p>
              </div>
            )}
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
                    flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 tap-scale
                    ${isActive || location.pathname.startsWith(item.path + '/') 
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
        <header className="sticky top-0 z-35 h-20 bg-white/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between shadow-sm border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border-0 cursor-pointer"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                <span className="hidden sm:inline">Welcome back, </span>Apex Diagnostics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                Monday, 23 Oct 2023
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
                        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Lab Alerts</span>
                      </div>
                      <div className="p-4 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-1.5">
                        <FiBell className="text-xl text-teal animate-bounce" />
                        <span>No new health panel updates.</span>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-colors tap-scale cursor-pointer border-0"
              >
                <div className="w-7 h-7 rounded-full bg-[#135A5A] text-white flex items-center justify-center text-xs">
                  <FiUser />
                </div>
                <span className="text-xs font-medium text-slate-700 pr-1 hidden sm:block">Admin</span>
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
                        <h4 className="text-xs font-black text-slate-850 truncate">{vendorUser?.name || 'Diagnostics Lab'}</h4>
                        <span className="text-[8px] bg-teal/10 text-teal border border-teal/10 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 mt-1.5 inline-block">
                          NABL ACCREDITED
                        </span>
                      </div>
                      <button 
                        onClick={() => { setShowProfileDropdown(false); navigate('/vendor/lab/profile'); }}
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
        {[
          { name: 'Dashboard', path: '/vendor/lab/dashboard', icon: FiGrid },
          { name: 'Orders', path: '/vendor/lab/orders/new', icon: FiFileText },
          { name: 'Tests', path: '/vendor/lab/tests/all', icon: FiActivity },
          { name: 'Profile', path: '/vendor/lab/profile/basic', icon: FiUser },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-[#1A7A4A]' : 'text-slate-400'}`}
            >
              <Icon className="text-xl" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

    </div>
  );
}
