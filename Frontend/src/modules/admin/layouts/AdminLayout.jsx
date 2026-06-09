import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FiHome, FiUsers, FiPackage, FiShoppingBag, FiLayers, FiActivity } from 'react-icons/fi';

export default function AdminLayout() {
  const { isAuthenticated, adminUser } = useSelector(state => state.adminAuth || { isAuthenticated: false, adminUser: null });
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileCatalogPopup, setShowMobileCatalogPopup] = useState(false);

  // Automatically monitor viewport width for collapsibility
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

  // Secure Guard: Ensure user has 'admin' role, otherwise redirect to AdminLoginPage (Temporarily bypassed for development)
  // if (!isAuthenticated || !adminUser || adminUser.role !== 'admin') {
  //   return <Navigate to="/admin/login" replace state={{ from: location }} />;
  // }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Backdrop Overlay on mobile viewports when sidebar drawer slides in */}
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
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* 3. Main Dashboard Window */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden transition-all duration-300"
           style={{ paddingLeft: isMobile ? '0px' : isSidebarOpen ? '256px' : '80px' }}>
        
        {/* Top Header navbar bar */}
        {(!['/admin/vendors', '/admin/doctors', '/admin/lab-tests', '/admin/medicines', '/admin/products'].includes(location.pathname) || isMobile) && (
          <Navbar 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
          />
        )}

        {/* Content canvas window */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar pb-24 md:pb-8 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* 4. Sleek bottom bar navigation matching user native-app patterns on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around z-30 md:hidden shadow-app-bar px-2">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiHome className="text-xl" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/admin/vendors" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiUsers className="text-xl" />
          <span>Vendors</span>
        </NavLink>
        
        {/* Dropdown toggle button for Catalog on Mobile */}
        <button 
          onClick={() => setShowMobileCatalogPopup(!showMobileCatalogPopup)}
          className={`flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all duration-200 tap-scale cursor-pointer ${
            ['/admin/products', '/admin/doctors', '/admin/lab-tests'].includes(location.pathname) || showMobileCatalogPopup
              ? 'text-teal' 
              : 'text-slate-400'
          }`}
        >
          <FiPackage className="text-xl" />
          <span>Catalog</span>
        </button>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiShoppingBag className="text-xl" />
          <span>Orders</span>
        </NavLink>
        <NavLink 
          to="/admin/cms" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiLayers className="text-xl" />
          <span>CMS</span>
        </NavLink>
      </div>

      {/* 5. Mobile Catalog Selector Popover Dialog */}
      <AnimatePresence>
        {showMobileCatalogPopup && (
          <div className="fixed inset-x-4 bottom-20 z-50 md:hidden">
            
            {/* Backdrop overlay to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileCatalogPopup(false)}
              className="fixed inset-0 bg-slate-900/60 z-10"
            />

            {/* Popup Bubble */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white rounded-[24px] border border-slate-100 shadow-premium p-4.5 z-20 relative overflow-hidden flex flex-col gap-2.5 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-1">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Catalog Selector</span>
                <button 
                  onClick={() => setShowMobileCatalogPopup(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {/* Medicines Section */}
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Medicines Module</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/medicines'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/medicines' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      List Directory
                    </button>
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/products'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/products' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      Categories tag
                    </button>
                  </div>
                </div>

                {/* Doctors Section */}
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Doctors Module</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/doctors'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/doctors' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      List Directory
                    </button>
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/doctors-categories'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/doctors-categories' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      Specialities
                    </button>
                  </div>
                </div>

                {/* Lab Tests Section */}
                <div className="flex flex-col gap-1 pb-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Lab Tests Module</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/lab-tests'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/lab-tests' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      List Directory
                    </button>
                    <button
                      onClick={() => { setShowMobileCatalogPopup(false); navigate('/admin/lab-categories'); }}
                      className={`py-2 px-3 rounded-xl text-left transition-all text-[10px] font-black uppercase tracking-wider ${
                        location.pathname === '/admin/lab-categories' ? 'bg-teal-light text-teal border border-teal-light' : 'bg-slate-50 border border-slate-100 text-slate-650'
                      }`}
                    >
                      Categories tag
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
