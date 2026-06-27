import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import VendorSidebar from '../components/VendorSidebar';
import VendorNavbar from '../components/VendorNavbar';
import { FiHome, FiPackage, FiShoppingBag, FiLayers, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export default function VendorLayout() {
  const { isAuthenticated, vendorUser } = useSelector(state => state.vendorAuth || { isAuthenticated: false, vendorUser: null });
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  // Secure Guard: Ensure user has 'vendor' role, otherwise redirect to VendorLoginPage (Temporarily bypassed for development)
  // if (!isAuthenticated || !vendorUser) {
  //   return <Navigate to="/vendor/login" replace state={{ from: location }} />;
  // }

  // Onboarding Guard: If KYC is pending and user is trying to access dashboard pages, redirect to pending screen (Temporarily bypassed for development)
  // if (vendorUser.kycStatus === 'pending' && location.pathname !== '/vendor/onboarding-pending') {
  //   return <Navigate to="/vendor/onboarding-pending" replace />;
  // }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Backdrop Overlay on mobile viewports */}
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

      {/* 2. Side Navigation Sidebar */}
      <div className={`shrink-0 z-40 ${isMobile && !isSidebarOpen ? 'pointer-events-none' : ''}`}>
        <VendorSidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* 3. Main Dashboard Window */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300"
           style={{ paddingLeft: isMobile ? '0px' : isSidebarOpen ? '256px' : '80px' }}>
        
        {/* Top Header navbar bar */}
        <VendorNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />

        {/* Content canvas window */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 4. Bottom mobile navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around z-30 md:hidden shadow-app-bar px-2 vendor-bottom-nav">
        <NavLink 
          to="/vendor/pharmacy/dashboard" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiHome className="text-xl" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/vendor/pharmacy/orders" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiShoppingBag className="text-xl" />
          <span>Orders</span>
        </NavLink>
        <NavLink 
          to="/vendor/pharmacy/medicines" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiPackage className="text-xl" />
          <span>Medicines</span>
        </NavLink>
        <NavLink 
          to="/vendor/pharmacy/prescriptions" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiLayers className="text-xl" />
          <span>Scripts</span>
        </NavLink>
        <NavLink 
          to="/vendor/pharmacy/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiUser className="text-xl" />
          <span>Profile</span>
        </NavLink>
      </div>

    </div>
  );
}
