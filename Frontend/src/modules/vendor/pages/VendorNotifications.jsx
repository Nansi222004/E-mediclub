import { useState } from 'react';
import { 
  FiBell, FiShoppingBag, FiFileText, FiDollarSign, FiAlertTriangle, FiSettings, FiCheck 
} from 'react-icons/fi';

export default function VendorNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  
  // Real-looking notification mock data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: 'Orders',
      title: 'New Order Received',
      message: 'You have received a new order #EMC-89212 from Rahul Mehta for ₹1,240.00.',
      time: '2 mins ago',
      read: false,
      icon: FiShoppingBag,
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
    {
      id: 2,
      category: 'Prescription',
      title: 'Rx Verification Request',
      message: 'Amit K. uploaded a prescription for Amoxicillin 500mg. Action required.',
      time: '15 mins ago',
      read: false,
      icon: FiFileText,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      id: 3,
      category: 'Stock Alerts',
      title: 'Critical Low Stock Alert',
      message: 'Organic Ashvagandha Daily Tablets is down to 12 items. Reorder soon.',
      time: '1 hour ago',
      read: false,
      icon: FiAlertTriangle,
      color: 'bg-orange-50 text-orange-600 border-orange-100'
    },
    {
      id: 4,
      category: 'Payments',
      title: 'Settlement Successful',
      message: 'Payout of ₹45,000.00 has been processed to your registered HDFC bank account.',
      time: '5 hours ago',
      read: true,
      icon: FiDollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 5,
      category: 'System',
      title: 'Platform Maintenance Scheduled',
      message: 'E Mediclub vendor services will undergo routine upgrades on Sunday between 2 AM - 4 AM.',
      time: '1 day ago',
      read: true,
      icon: FiSettings,
      color: 'bg-slate-50 text-slate-600 border-slate-100'
    },
    {
      id: 6,
      category: 'Orders',
      title: 'Order Delivered Successfully',
      message: 'Order #EMC-89201 has been successfully delivered to Megha Patel.',
      time: '1 day ago',
      read: true,
      icon: FiShoppingBag,
      color: 'bg-teal-50 text-teal-600 border-teal-100'
    },
    {
      id: 7,
      category: 'Stock Alerts',
      title: 'Item Out of Stock',
      message: 'Baidyanath Shankhapushpi Syrup is completely out of stock.',
      time: '2 days ago',
      read: true,
      icon: FiAlertTriangle,
      color: 'bg-rose-50 text-rose-600 border-rose-100'
    }
  ]);

  const tabs = ['All', 'Orders', 'Prescription', 'Payments', 'Stock Alerts', 'System'];

  const filteredNotifications = activeTab === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 flex flex-col gap-5">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 leading-none">Notifications Hub</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review pharmacy operations, incoming prescriptions, stock alerts, payouts, and platform notifications.
          </p>
        </div>
        <button 
          onClick={markAllRead}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-650 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <FiCheck className="text-sm text-teal-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-slate-100 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-0 cursor-pointer whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#135A5A] text-white shadow-sm' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-850'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 pb-12">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => {
            const IconComponent = notification.icon;
            return (
              <div 
                key={notification.id} 
                className={`bg-white border rounded-2xl p-4 flex gap-4 items-start shadow-sm transition-all relative group hover:shadow-md ${
                  notification.read ? 'border-slate-100 opacity-80' : 'border-teal-100 bg-teal-50/10'
                }`}
              >
                {/* Unread status dot */}
                {!notification.read && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
                )}

                {/* Category Icon */}
                <div className={`p-2.5 rounded-xl border shrink-0 ${notification.color}`}>
                  <IconComponent className="text-lg" />
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1 pr-4">
                    <h3 className="text-sm font-extrabold text-slate-850 truncate">{notification.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">{notification.message}</p>
                </div>

                {/* Mark as read toggle overlay button */}
                <button 
                  onClick={() => toggleReadStatus(notification.id)}
                  title={notification.read ? 'Mark as Unread' : 'Mark as Read'}
                  className="absolute bottom-4 right-4 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#135A5A] hover:border-[#135A5A] hover:text-white cursor-pointer"
                >
                  <FiCheck className="text-xs" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
            <FiBell className="text-4xl text-slate-300 animate-bounce mb-3" />
            <h3 className="text-sm font-extrabold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">No alerts found under {activeTab} category.</p>
          </div>
        )}
      </div>

    </div>
  );
}
