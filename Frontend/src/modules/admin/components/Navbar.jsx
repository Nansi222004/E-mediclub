import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiMenu } from 'react-icons/fi';

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

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

      {/* Right side: Notifications bell */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/admin/notifications')}
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-650 transition-colors relative tap-scale border-0 cursor-pointer"
          title="View Notifications"
        >
          <FiBell className="text-lg" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-coral animate-pulse" />
        </button>
      </div>
    </header>
  );
}
