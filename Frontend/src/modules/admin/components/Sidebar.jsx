import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../auth/admin/store/adminAuthSlice';
import Logo from '../../../shared/components/Logo';
import { 
  FiHome, FiShoppingBag, FiPackage, FiActivity, FiHeart, 
  FiUsers, FiUserCheck, FiMapPin, FiTruck, FiFileText, 
  FiCreditCard, FiRefreshCw, FiStar, FiBarChart2, FiAlertTriangle, 
  FiInbox, FiSliders, FiSettings, FiChevronDown
} from 'react-icons/fi';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  // Keep track of which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState({
    Dashboard: false,
    Orders: false,
    Medicines: false,
    'Lab Tests': false,
    Doctors: false,
    Users: false,
    Vendors: false,
    'KYC & Verification': false,
    Locations: false,
    'Home Collections': false,
    Prescriptions: false,
    'Payments & Revenue': false,
    'Returns & Refunds': false,
    'Reviews & Ratings': false,
    Analytics: false,
    'Complaints & Disputes': false,
    'Support Center': false,
    Notifications: false,
    Settings: false
  });

  const [expandedSubMenus, setExpandedSubMenus] = useState({
    Pharmacies: false,
    Laboratories: false,
    DoctorsSub: false
  });

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const toggleSubSubmenu = (subMenuName) => {
    setExpandedSubMenus(prev => ({ ...prev, [subMenuName]: !prev[subMenuName] }));
  };

  // Structured menu matching PAN India Multi-Vendor Marketplace requirements
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', Icon: FiHome },
    { 
      name: 'Orders', 
      Icon: FiShoppingBag,
      children: [
        { name: 'Medicine Orders', path: '/admin/orders/medicines' },
        { name: 'Lab Bookings', path: '/admin/orders/lab-bookings' },
        { name: 'Doctor Appointments', path: '/admin/orders/appointments' },
        { name: 'Cancelled Orders', path: '/admin/orders/cancelled' },
        { name: 'Refund Requests', path: '/admin/orders/refund-requests' }
      ]
    },
    { 
      name: 'Medicines', 
      Icon: FiPackage,
      children: [
        { name: 'All Medicines', path: '/admin/medicines' },
        { name: 'Categories', path: '/admin/medicines/categories' },
        { name: 'Prescription Medicines', path: '/admin/medicines/prescriptions' },
        { name: 'Inventory Monitoring', path: '/admin/medicines/inventory' },
        { name: 'Medicine Reports', path: '/admin/medicines/reports' }
      ]
    },
    { 
      name: 'Lab Tests', 
      Icon: FiActivity,
      children: [
        { name: 'All Tests', path: '/admin/lab-tests' },
        { name: 'Test Categories', path: '/admin/lab-categories' },
        { name: 'Health Packages', path: '/admin/lab-tests/packages' },
        { name: 'Lab Reports', path: '/admin/lab-tests/reports' }
      ]
    },
    { 
      name: 'Doctors', 
      Icon: FiHeart,
      children: [
        { name: 'All Doctors', path: '/admin/doctors' },
        { name: 'Online Doctors', path: '/admin/doctors/online' },
        { name: 'In-Clinic Doctors', path: '/admin/doctors/in-clinic' },
        { name: 'Specializations', path: '/admin/doctors-categories' },
        { name: 'Doctor Performance', path: '/admin/doctors/performance' }
      ]
    },
    { 
      name: 'Users', 
      Icon: FiUsers,
      children: [
        { name: 'All Users', path: '/admin/users' },
        { name: 'Active Users', path: '/admin/users/active' },
        { name: 'Blocked Users', path: '/admin/users/blocked' },
        { name: 'User Analytics', path: '/admin/users/analytics' }
      ]
    },
    { 
      name: 'Vendors', 
      Icon: FiUsers,
      children: [
        { name: 'Pending Approvals', path: '/admin/vendors?status=pending' },
        { name: 'Approved Vendors', path: '/admin/vendors?status=approved' },
        { name: 'Suspended Vendors', path: '/admin/vendors?status=suspended' },
        { name: 'Rejected Vendors', path: '/admin/vendors?status=rejected' },
        {
          name: 'Pharmacies',
          subKey: 'Pharmacies',
          children: [
            { name: 'All Pharmacies', path: '/admin/vendors?type=pharmacy' },
            { name: 'Active Pharmacies', path: '/admin/vendors?type=pharmacy&status=active' },
            { name: 'Suspended Pharmacies', path: '/admin/vendors?type=pharmacy&status=suspended' }
          ]
        },
        {
          name: 'Laboratories',
          subKey: 'Laboratories',
          children: [
            { name: 'All Labs', path: '/admin/vendors?type=lab' },
            { name: 'Active Labs', path: '/admin/vendors?type=lab&status=active' },
            { name: 'Suspended Labs', path: '/admin/vendors?type=lab&status=suspended' }
          ]
        },
        {
          name: 'Doctors',
          subKey: 'DoctorsSub',
          children: [
            { name: 'All Doctors', path: '/admin/vendors?type=doctor' },
            { name: 'Active Doctors', path: '/admin/vendors?type=doctor&status=active' },
            { name: 'Suspended Doctors', path: '/admin/vendors?type=doctor&status=suspended' }
          ]
        }
      ]
    },
    { 
      name: 'KYC & Verification', 
      Icon: FiUserCheck,
      children: [
        { name: 'Doctor Verification', path: '/admin/kyc/doctor' },
        { name: 'Lab Verification', path: '/admin/kyc/lab' },
        { name: 'Pharmacy Verification', path: '/admin/kyc/pharmacy' },
        { name: 'Pending KYC', path: '/admin/kyc?status=pending' },
        { name: 'Approved KYC', path: '/admin/kyc?status=approved' },
        { name: 'Rejected KYC', path: '/admin/kyc?status=rejected' }
      ]
    },
    { 
      name: 'Locations', 
      Icon: FiMapPin,
      children: [
        { name: 'States', path: '/admin/locations/states' },
        { name: 'Cities', path: '/admin/locations/cities' },
        { name: 'Pincode Manager', path: '/admin/locations/pincodes' },
        { name: 'Serviceable Areas', path: '/admin/locations/serviceable' },
        { name: 'Unserviceable Areas', path: '/admin/locations/gaps' },
        { name: 'Location Analytics', path: '/admin/locations/analytics' }
      ]
    },
    { 
      name: 'Home Collections', 
      Icon: FiTruck,
      children: [
        { name: 'Pending Collections', path: '/admin/home-collections?status=pending' },
        { name: 'Assigned Collections', path: '/admin/home-collections?status=assigned' },
        { name: 'Completed Collections', path: '/admin/home-collections?status=completed' }
      ]
    },
    { 
      name: 'Prescriptions', 
      Icon: FiFileText,
      children: [
        { name: 'Uploaded Prescriptions', path: '/admin/prescriptions' },
        { name: 'Pending Verification', path: '/admin/prescriptions?status=pending' },
        { name: 'Approved Prescriptions', path: '/admin/prescriptions?status=approved' },
        { name: 'Rejected Prescriptions', path: '/admin/prescriptions?status=rejected' }
      ]
    },
    { 
      name: 'Payments & Revenue', 
      Icon: FiCreditCard,
      children: [
        { name: 'Transactions', path: '/admin/payments?tab=transactions' },
        { name: 'Vendor Payouts', path: '/admin/payments?tab=payouts' },
        { name: 'Commissions', path: '/admin/payments?tab=commissions' },
        { name: 'Revenue Reports', path: '/admin/payments?tab=reports' },
        { name: 'Refund Transactions', path: '/admin/payments?tab=refunds' }
      ]
    },
    { 
      name: 'Returns & Refunds', 
      Icon: FiRefreshCw,
      children: [
        { name: 'Medicine Returns', path: '/admin/returns/medicines' },
        { name: 'Replacement Requests', path: '/admin/returns/replacements' },
        { name: 'Refund Requests', path: '/admin/returns/refunds' },
        { name: 'Appointment Refunds', path: '/admin/returns/appointments' },
        { name: 'Lab Refunds', path: '/admin/returns/labs' }
      ]
    },
    { 
      name: 'Reviews & Ratings', 
      Icon: FiStar,
      children: [
        { name: 'Doctor Reviews', path: '/admin/reviews/doctors' },
        { name: 'Lab Reviews', path: '/admin/reviews/labs' },
        { name: 'Pharmacy Reviews', path: '/admin/reviews/pharmacies' },
        { name: 'Reported Reviews', path: '/admin/reviews/reported' }
      ]
    },
    { 
      name: 'Analytics', 
      Icon: FiBarChart2,
      children: [
        { name: 'Platform Analytics', path: '/admin/reports?tab=platform' },
        { name: 'User Analytics', path: '/admin/reports?tab=users' },
        { name: 'Vendor Analytics', path: '/admin/reports?tab=vendors' },
        { name: 'State Analytics', path: '/admin/reports?tab=states' },
        { name: 'City Analytics', path: '/admin/reports?tab=cities' },
        { name: 'Revenue Analytics', path: '/admin/reports?tab=revenue' }
      ]
    },
    { 
      name: 'Complaints & Disputes', 
      Icon: FiAlertTriangle,
      children: [
        { name: 'User Complaints', path: '/admin/complaints?type=user' },
        { name: 'Vendor Complaints', path: '/admin/complaints?type=vendor' },
        { name: 'Order Disputes', path: '/admin/complaints?type=order' },
        { name: 'Refund Disputes', path: '/admin/complaints?type=refund' }
      ]
    },
    { 
      name: 'Support Center', 
      Icon: FiInbox,
      children: [
        { name: 'User Tickets', path: '/admin/support/user' },
        { name: 'Vendor Tickets', path: '/admin/support/vendor' },
        { name: 'Escalations', path: '/admin/support/escalated' },
        { name: 'Resolution Center', path: '/admin/support/resolution' }
      ]
    },
    { 
      name: 'Notifications', 
      Icon: FiSliders,
      children: [
        { name: 'Push Notifications', path: '/admin/notifications?type=push' },
        { name: 'SMS Notifications', path: '/admin/notifications?type=sms' },
        { name: 'Email Notifications', path: '/admin/notifications?type=email' },
        { name: 'Broadcast Notifications', path: '/admin/notifications?type=broadcast' }
      ]
    },
    { 
      name: 'Settings', 
      Icon: FiSettings,
      children: [
        { name: 'Admin Users', path: '/admin/settings?tab=users' },
        { name: 'Roles & Permissions', path: '/admin/settings?tab=roles' },
        { name: 'Platform Settings', path: '/admin/settings?tab=platform' },
        { name: 'Commission Settings', path: '/admin/settings?tab=commission' },
        { name: 'Notification Settings', path: '/admin/settings?tab=notifications' },
        { name: 'Security Settings', path: '/admin/settings?tab=security' }
      ]
    }
  ];

  return (
    <motion.aside 
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="fixed top-0 left-0 z-40 h-screen bg-white border-r border-[#E8F5EE] shadow-premium flex flex-col justify-between"
    >
      {/* Brand Header */}
      <div className="overflow-hidden flex flex-col flex-1">
        <div className="h-20 flex items-center justify-between px-5 border-b border-[#E8F5EE] shrink-0">
          <div className="flex items-center whitespace-nowrap pt-2 bg-transparent rounded-xl px-2.5 py-1 select-none">
            <Logo showText={isOpen} layout="horizontal" />
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
          {menuItems.map((item) => {
            const hasChildren = !!item.children;
            const isMenuExpanded = expandedMenus[item.name];
            
            // Render single top-level route item
            if (!hasChildren) {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-black tracking-wider uppercase transition-all duration-200 tap-scale no-underline
                    ${isActive 
                      ? 'bg-[#1A7A4A]/10 !text-[#1A7A4A] shadow-sm' 
                      : '!text-slate-500 hover:bg-[#F8FAF9] hover:!text-[#1A7A4A]'
                    }
                  `}
                >
                  <item.Icon className={`text-lg shrink-0 ${isActive ? 'text-[#1A7A4A]' : 'text-slate-400'}`} />
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

            // Render expandable nested menu item
            return (
              <div key={item.name} className="flex flex-col gap-1">
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black tracking-wider uppercase transition-all duration-200 tap-scale cursor-pointer border-0 bg-transparent text-left
                    text-slate-500 hover:bg-[#F8FAF9] hover:text-[#1A7A4A]
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <item.Icon className="text-lg shrink-0 text-slate-400" />
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
                    <FiChevronDown className={`transition-transform duration-250 text-slate-400 ${isMenuExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Submenu Item container */}
                <AnimatePresence initial={false}>
                  {isOpen && isMenuExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden flex flex-col gap-1 pl-8 pr-1 border-l-2 border-[#E8F5EE] ml-6"
                    >
                      {item.children.map((child) => {
                        const hasSubChildren = !!child.children;
                        
                        if (!hasSubChildren) {
                           const isChildActive = location.pathname + location.search === child.path || location.pathname === child.path;
                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) => `
                                px-3.5 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-150 no-underline block
                                ${isActive || isChildActive
                                  ? 'bg-[#1A7A4A]/10 !text-[#1A7A4A] font-black border-l-2 border-[#1A7A4A] pl-2.5 shadow-sm'
                                  : '!text-slate-500 hover:!text-[#1A7A4A] hover:bg-[#F8FAF9]'
                                }
                              `}
                            >
                              {child.name}
                            </NavLink>
                          );
                        }

                        // Render 3rd Level Sub-sub-menu group (e.g. Vendors -> Pharmacies -> Active Pharmacies)
                        const isSubSubExpanded = expandedSubMenus[child.subKey];
                        return (
                          <div key={child.name} className="flex flex-col gap-1 mt-1">
                            <button
                              onClick={() => toggleSubmenu(child.subKey || child.name)}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all border-0 bg-transparent text-slate-500 hover:text-[#1A7A4A] hover:bg-[#F8FAF9] text-left cursor-pointer"
                            >
                              <span>{child.name}</span>
                              <FiChevronDown className={`transition-transform duration-200 text-slate-400 ${isSubSubExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence initial={false}>
                              {isSubSubExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden flex flex-col gap-0.5 pl-3 border-l-2 border-slate-100 ml-3"
                                >
                                  {child.children.map((subChild) => {
                                    const isSubChildActive = location.pathname + location.search === subChild.path || location.pathname === subChild.path;
                                    return (
                                      <NavLink
                                        key={subChild.path}
                                        to={subChild.path}
                                        className={({ isActive }) => `
                                          px-2.5 py-2 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-150 no-underline block
                                          ${isActive || isSubChildActive
                                            ? 'bg-slate-100 !text-[#1A7A4A] font-black border-l-2 border-[#1A7A4A] pl-2'
                                            : '!text-slate-400 hover:!text-[#1A7A4A] hover:bg-[#F8FAF9]'
                                          }
                                        `}
                                      >
                                        {subChild.name}
                                      </NavLink>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
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

    </motion.aside>
  );
}
