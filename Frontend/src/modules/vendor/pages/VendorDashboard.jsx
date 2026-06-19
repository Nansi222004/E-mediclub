import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiEye, FiTrendingUp, FiShoppingBag, FiClock, FiCheckCircle, FiFileText, FiPlus,
  FiMapPin, FiMap, FiStar, FiUsers, FiDollarSign
} from 'react-icons/fi';
import { 
  getTodayRevenue, 
  getMonthlyRevenue, 
  getTodayOrders, 
  getPendingOrders, 
  getPrescriptionOrders, 
  getOutOfStockItems, 
  getLowStockItems, 
  getAverageRating, 
  getTotalCustomers,
  getOrderSummary
} from './pharmacyVendorMockData';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { kycDetails, orders } = useSelector(state => state.vendor || { kycDetails: {}, orders: [] });
  const storeName = kycDetails?.storeName || 'MedPlus Wellness Pharmacy';

  const [analyticsTab, setAnalyticsTab] = useState('Daily');
  const summary = getOrderSummary();

  // Map Redux orders to Dashboard Recent Orders format
  const mappedRecentOrders = orders.map(order => ({
    id: order.id,
    customer: order.customerName,
    status: order.status === 'pending' ? 'PROCESSING' : order.status === 'shipped' ? 'READY' : 'DELIVERED',
    amount: `₹${order.totalAmount.toLocaleString('en-IN')}.00`
  }));

  // Fallback default list from reference screenshot if Redux is empty
  const defaultRecentOrders = [
    { id: '#EMC-89212', customer: 'Rahul Mehta', status: 'PROCESSING', amount: '₹1,240.00' },
    { id: '#EMC-89211', customer: 'Sara Jacob', status: 'READY', amount: '₹450.50' },
    { id: '#EMC-89210', customer: 'Karan Singh', status: 'PROCESSING', amount: '₹2,800.00' }
  ];

  // Combine Redux orders with default orders
  const displayOrders = [...mappedRecentOrders, ...defaultRecentOrders].slice(0, 5);

  // Mapped unique customers from Redux orders
  const mappedCustomers = orders.map((order, index) => ({
    name: order.customerName,
    email: `${order.customerName.toLowerCase().replace(' ', '.')}@gmail.com`,
    badge: index === 0 ? 'NEW' : '1 Order'
  }));

  const defaultCustomers = [
    { name: 'Anita Desai', email: 'anita.d@gmail.com', badge: 'NEW' },
    { name: 'Vikram Sharma', email: 'v.sharma@outlook.com', badge: '3 Orders' },
    { name: 'Sneha Kapoor', email: 'sneha.k@yahoo.com', badge: '1 Order' }
  ];

  // Combine Redux customers with default ones
  const displayCustomers = [...mappedCustomers, ...defaultCustomers].filter(
    (c, i, self) => self.findIndex(t => t.name === c.name) === i
  ).slice(0, 4);

  // Pharmacy Vendor Dashboard KPIs
  const kpis = [
    { 
      name: "Today's Orders", 
      value: String(getTodayOrders().length), 
      icon: FiShoppingBag, 
      color: "text-teal-600 bg-teal-50 border-teal-100", 
      subtext: "12 completed",
      path: "/vendor/pharmacy/orders?filter=today"
    },
    { 
      name: "Pending Orders", 
      value: String(getPendingOrders().length), 
      icon: FiClock, 
      color: "text-amber-600 bg-amber-50 border-amber-100", 
      subtext: "Awaiting dispatch",
      path: "/vendor/pharmacy/orders?status=pending"
    },
    { 
      name: "Prescription Orders", 
      value: String(getPrescriptionOrders().length), 
      icon: FiFileText, 
      color: "text-indigo-600 bg-indigo-50 border-indigo-100", 
      subtext: "8 verified",
      path: "/vendor/pharmacy/prescriptions?status=pending"
    },
    { 
      name: "Active Medicines", 
      value: "1,120", 
      icon: FiCheckCircle, 
      color: "text-emerald-600 bg-emerald-50 border-emerald-100", 
      subtext: "Listed in catalog",
      path: "/vendor/pharmacy/medicines"
    },
    { 
      name: "Out of Stock", 
      value: String(getOutOfStockItems().length), 
      icon: FiEye, 
      color: "text-rose-600 bg-rose-50 border-rose-100", 
      subtext: "Needs reorder",
      path: "/vendor/pharmacy/inventory?filter=out-of-stock"
    },
    { 
      name: "Low Stock", 
      value: String(getLowStockItems().length), 
      icon: FiClock, 
      color: "text-orange-600 bg-orange-50 border-orange-100", 
      subtext: "Critical inventory",
      path: "/vendor/pharmacy/inventory?filter=low-stock"
    },
    { 
      name: "Average Rating", 
      value: String(getAverageRating()), 
      icon: FiStar, 
      color: "text-yellow-600 bg-yellow-50 border-yellow-100", 
      subtext: "Based on 320 reviews",
      path: "/vendor/pharmacy/profile"
    },
    { 
      name: "Total Customers", 
      value: String(getTotalCustomers().toLocaleString()), 
      icon: FiUsers, 
      color: "text-violet-600 bg-violet-50 border-violet-100", 
      subtext: "Repeat purchasers",
      path: "/vendor/pharmacy/customers"
    }
  ];

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-screen">
      
      {/* Container - Compact Desktop Responsive Layout */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col gap-3 pt-1 lg:pt-2">
        
        {/* Header Greeting */}
        <div className="flex flex-col mt-1">
          <h1 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">Good Morning,</h1>
          <p className="text-[9px] lg:text-[10px] font-semibold text-slate-500 mt-0.5">{storeName} Vendor Panel</p>
        </div>

        {/* Responsive Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          
          {/* LEFT COLUMN: Main Metrics (Takes up 7 columns on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            
            {/* Sales & Revenue Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Revenue Today Card */}
              <div onClick={() => navigate('/vendor/pharmacy/revenue?filter=today')} className="bg-[#135A5A] rounded-xl p-3 lg:p-4 text-white shadow-md shadow-[#135A5A]/10 relative overflow-hidden flex flex-col justify-between min-h-[90px] lg:min-h-[110px] cursor-pointer select-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-teal-100">Revenue Today</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <FiDollarSign className="text-xs text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 flex items-end justify-between">
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-none">₹{getTodayRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                  <p className="text-[9px] font-semibold text-teal-100 flex items-center gap-1">
                    <FiTrendingUp className="text-emerald-300 animate-pulse" /> <span className="text-white">+12%</span> today
                  </p>
                </div>
              </div>

              {/* Monthly Revenue Strip */}
              <div onClick={() => navigate('/vendor/pharmacy/revenue?filter=month')} className="bg-white border border-slate-100 rounded-xl p-3 lg:p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[90px] lg:min-h-[110px] cursor-pointer select-none">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Revenue This Month</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/40">
                    <FiTrendingUp className="text-xs text-[#135A5A]" />
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-none text-slate-800">₹{getMonthlyRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                  <span className="text-[9px] font-black text-[#135A5A] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">+8.4%</span>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {kpis.map((kpi, index) => {
                const IconComponent = kpi.icon;
                return (
                  <div key={index} onClick={() => navigate(kpi.path)} className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{kpi.name}</span>
                      <div className={`p-1.5 rounded-lg border ${kpi.color} shrink-0`}>
                        <IconComponent className="text-sm" />
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="text-xl lg:text-2xl font-black text-slate-850 leading-none">{kpi.value}</h3>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1 truncate">{kpi.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Alerts and Feed (Takes up 5 columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            
            {/* Stock Alerts */}
            <div className="grid grid-cols-2 gap-1.5">
              <div onClick={() => navigate('/vendor/pharmacy/inventory?filter=out-of-stock')} className="bg-[#9A3D4A]/5 border border-[#9A3D4A]/20 rounded-lg p-2 flex flex-col justify-center items-center text-center cursor-pointer select-none">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#9A3D4A]">Out of Stock</span>
                <span className="text-xl lg:text-2xl font-black text-[#9A3D4A] my-0.5">{getOutOfStockItems().length}</span>
                <span className="text-[8px] font-semibold text-[#9A3D4A]/80">Medicines</span>
              </div>
              <div onClick={() => navigate('/vendor/pharmacy/inventory?filter=low-stock')} className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex flex-col justify-center items-center text-center cursor-pointer select-none">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-orange-600">Low Stock</span>
                <span className="text-xl lg:text-2xl font-black text-orange-600 my-0.5">{getLowStockItems().length}</span>
                <span className="text-[8px] font-semibold text-orange-600/80">Critical Level</span>
              </div>
            </div>

            {/* Prescription Requests */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 lg:p-4 shadow-sm flex flex-col flex-1 min-h-[300px]">
              <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-2">
                <h3 className="text-xs lg:text-sm font-extrabold text-slate-800">Prescriptions</h3>
                <span className="text-[8px] font-black uppercase tracking-wider text-white bg-[#9A3D4A] px-1.5 py-0.5 rounded shadow-sm">
                  {getPrescriptionOrders().length} New
                </span>
              </div>
              
              <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
                {[
                  { name: 'Johnathan Doe', medicine: 'Augmentin 625mg', time: '2 mins', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
                  { name: 'Sarah Miller', medicine: 'Metformin 500mg', time: '15 mins', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
                  { name: 'Robert Wilson', medicine: 'Lisinopril 10mg', time: '1 hr', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                  { name: 'Emily Davis', medicine: 'Amoxicillin 250mg', time: '3 hrs', color: 'bg-teal-100 text-[#135A5A] border-teal-200' },
                  { name: 'Michael Brown', medicine: 'Ibuprofen 400mg', time: '5 hrs', color: 'bg-orange-100 text-orange-600 border-orange-200' },
                ].map((req, idx) => (
                  <div key={idx} onClick={() => navigate('/vendor/pharmacy/prescriptions')} className="bg-slate-50/50 border border-slate-100 rounded-lg p-2 flex items-center justify-between hover:bg-white transition-all group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${req.color}`}>
                        <span className="font-black text-xs">{req.name.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{req.name}</h4>
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                          {req.medicine} • {req.time}
                        </p>
                      </div>
                    </div>
                    <button className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-400 group-hover:bg-[#135A5A] group-hover:border-[#135A5A] group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0 cursor-pointer">
                      <FiEye className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button onClick={() => navigate('/vendor/pharmacy/prescriptions')} className="w-full mt-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-md transition-colors border-0 cursor-pointer">
                View All
              </button>
            </div>

          </div>

        </div>

        {/* REVENUE & ORDER SUMMARY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-1">
          
          {/* Revenue Analytics Card */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-2">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Revenue Analytics</h3>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`px-3 py-1 text-[9px] font-black rounded-md transition-all cursor-pointer border-0 ${
                      analyticsTab === tab 
                        ? 'bg-white text-[#135A5A] shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 bg-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Multi-layered Revenue Chart Visual */}
            <div className="flex-1 flex flex-col justify-end pt-4 min-h-[180px]">
              <div className="flex justify-between items-end h-[160px] px-1 sm:px-2 lg:px-4">
                {[
                  { label: 'Mon', h1: 45, h2: 30 },
                  { label: 'Tue', h1: 65, h2: 40 },
                  { label: 'Wed', h1: 85, h2: 85 },
                  { label: 'Thu', h1: 50, h2: 35 },
                  { label: 'Fri', h1: 75, h2: 55 },
                  { label: 'Sat', h1: 90, h2: 75 },
                  { label: 'Sun', h1: 70, h2: 45 },
                ].map((item, idx) => (
                  <div key={idx} className="h-full flex flex-col justify-end items-center w-6 sm:w-8 lg:w-14 group relative cursor-pointer">
                    
                    {/* Multi-layered Stacked Bar Container */}
                    <div className="w-3.5 sm:w-5 lg:w-9 h-full flex items-end relative rounded-t-md overflow-hidden bg-slate-50">
                      {/* Background lighter layer */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#85BDBA]/35 transition-all duration-300 rounded-t-md"
                        style={{ height: `${item.h1}%` }}
                      />
                      {/* Foreground darker layer */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#135A5A] transition-all duration-300 rounded-t-md"
                        style={{ height: `${item.h2}%` }}
                      />
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-20 pointer-events-none shadow-md">
                      <div>Potential: ₹{(item.h1 * 60).toLocaleString()}</div>
                      <div className="text-emerald-300">Revenue: ₹{(item.h2 * 60).toLocaleString()}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between w-full text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 mt-3 pt-2 px-1 sm:px-2 lg:px-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <span key={i} className="w-6 sm:w-8 lg:w-14 text-center">{day}</span>
                ))}
              </div>
            </div>
          </div>
            {/* Order Summary & Fulfillment Card */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[320px] select-none">
            <div className="border-b border-slate-50 pb-3 mb-2">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Order Summary</h3>
            </div>

            {/* List of Order States */}
            <div className="flex flex-col gap-2 my-2">
              {[
                { label: 'New Orders', count: summary.newOrders, dotColor: 'bg-blue-300', path: '/vendor/pharmacy/orders?status=new' },
                { label: 'Processing', count: summary.processing, dotColor: 'bg-emerald-600', path: '/vendor/pharmacy/orders?status=processing' },
                { label: 'Ready to Ship', count: summary.readyToShip, dotColor: 'bg-[#135A5A]', path: '/vendor/pharmacy/orders?status=ready-dispatch' },
                { label: 'Delivered', count: summary.delivered, dotColor: 'bg-teal-500', path: '/vendor/pharmacy/orders?status=delivered' },
                { label: 'Cancelled', count: summary.cancelled, dotColor: 'bg-rose-600', path: '/vendor/pharmacy/orders?status=cancelled' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(item.path)}
                  title={`${item.count} orders in ${item.label}`}
                  className="flex justify-between items-center text-xs cursor-pointer hover:bg-slate-50 hover:px-1.5 active:scale-[0.98] transition-all py-1.5 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-black text-slate-855 text-[13px]">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Fulfillment circular donut gauge */}
            <div className="flex justify-center items-center pt-2 relative">
              <div className="relative flex items-center justify-center">
                {/* SVG circular donut */}
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#135A5A" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 * (1 - summary.fulfillmentPercent / 100)} 
                    strokeLinecap="round" 
                  />
                </svg>
                {/* Centered percentage text inside donut */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-base font-black text-slate-855 leading-none">{summary.fulfillmentPercent}%</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Fulfillment</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RX REQUESTS & INVENTORY HEALTH SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-1">
          
          {/* Rx Requests */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[190px]">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Rx Requests</h3>
              <button onClick={() => navigate('/vendor/pharmacy/prescriptions')} className="text-[10px] font-black uppercase text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent">View All</button>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              {[
                { name: 'Amit K.', desc: 'Amoxicillin 500mg • Uploaded 2m ago' },
                { name: 'Priya S.', desc: 'Lipitor 10mg • Uploaded 15m ago' }
              ].map((rx, idx) => (
                <div key={idx} onClick={() => navigate('/vendor/pharmacy/prescriptions')} className="flex justify-between items-center py-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                      <FiFileText className="text-base" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{rx.name}</h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">{rx.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); alert('Prescription Verified and Approved!'); }} className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 flex items-center justify-center cursor-pointer transition-colors border-0">
                      <span className="text-xs font-bold">✓</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); alert('Prescription Rejected.'); }} className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 flex items-center justify-center cursor-pointer transition-colors border-0">
                      <span className="text-xs font-bold">✗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Health */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[190px]">
            <div className="border-b border-slate-50 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Inventory Health</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              <div onClick={() => navigate('/vendor/pharmacy/inventory')} className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-3 flex flex-col justify-center cursor-pointer hover:bg-blue-50 transition-colors select-none">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-blue-500">Expiring Soon</span>
                <span className="text-lg font-black text-slate-855 my-0.5">112 Items</span>
                <span className="text-[7.5px] font-bold text-slate-450">Action required within 30 days</span>
              </div>
              <div onClick={() => navigate('/vendor/pharmacy/inventory')} className="bg-rose-50/40 border border-rose-100/50 rounded-xl p-3 flex flex-col justify-center cursor-pointer hover:bg-rose-50 transition-colors select-none">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-rose-600">Out of Stock</span>
                <span className="text-lg font-black text-rose-600 my-0.5">12 Items</span>
                <span className="text-[7.5px] font-bold text-slate-450">Losing potential revenue</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#135A5A] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[8.5px] font-black text-slate-400 uppercase tracking-widest mt-2">
                <span>Overall Health: <span className="text-[#135A5A]">Good (75%)</span></span>
                <span>Goal: 95%</span>
              </div>
            </div>
          </div>

        </div>

        {/* HEALTH DEVICES & TOP SELLING MEDICINES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-1">
          
          {/* Health Devices Card */}
{/* Health Devices Card */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[260px]">
            <div className="border-b border-slate-50 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Health Devices</h3>
            </div>

            <div className="flex-1 flex flex-col gap-3 justify-center">
              {[
                { name: 'Accu-Chek Blood Glucose Monitor', stock: '45 Units', price: '₹975', status: 'In Stock', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { name: 'Omron Automatic BP Monitor', stock: '18 Units', price: '₹2,499', status: 'Low Stock', badgeColor: 'text-orange-600 bg-orange-50 border-orange-100' },
                { name: 'Dr Trust Pulse Oximeter', stock: '120 Units', price: '₹1,199', status: 'In Stock', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { name: 'Digital Infrared Thermometer', stock: '0 Units', price: '₹850', status: 'Out of Stock', badgeColor: 'text-rose-600 bg-rose-50 border-rose-100' }
              ].map((device, idx) => (
                <div key={idx} onClick={() => navigate('/vendor/pharmacy/products')} className="flex justify-between items-center py-1 px-2 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#135A5A]/5 text-[#135A5A] border border-teal-50 flex items-center justify-center shrink-0">
                      <span className="text-sm">🩺</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{device.name}</h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">{device.stock} • {device.price}</p>
                    </div>
                  </div>
                  <span className={`text-[8.5px] font-black px-2 py-0.5 rounded border shrink-0 ${device.badgeColor}`}>
                    {device.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Medicines */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[260px]">
            <div className="border-b border-[#0F4A4A]/10 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Top Selling Medicines</h3>
            </div>

            {/* Medicines List Table */}
            <div className="flex-1 overflow-x-auto w-full">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine Name</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Sales</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Paracetamol 500mg', cat: 'Pain Relief', sales: '1,240', trend: 'up' },
                    { name: 'Vitamin C 1000mg', cat: 'Supplements', sales: '890', trend: 'up' },
                    { name: 'Metformin 500mg', cat: 'Diabetes', sales: '750', trend: 'neutral' }
                  ].map((med, idx) => (
                    <tr key={idx} onClick={() => navigate('/vendor/pharmacy/medicines')} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                      <td className="py-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#135A5A]/10 flex items-center justify-center text-[#135A5A]">
                          <span className="text-xs">💊</span>
                        </div>
                        <span className="text-[12.5px] font-extrabold text-slate-800">{med.name}</span>
                      </td>
                      <td className="py-2.5 text-xs text-slate-500 font-semibold">{med.cat}</td>
                      <td className="py-2.5 text-xs text-slate-800 font-black text-right">{med.sales}</td>
                      <td className="py-2.5 text-center">
                        <div className="flex justify-center">
                          {med.trend === 'up' ? (
                            <span className="text-emerald-500 font-bold">↗</span>
                          ) : (
                            <span className="text-slate-400 font-bold">→</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RECENT ORDERS & RECENT CUSTOMERS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-1 pb-8">
          
          {/* Recent Orders (Takes 8 columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[265px]">
            <div className="flex justify-between items-center border-b border-[#0F4A4A]/10 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-805">Recent Orders</h3>
              <button onClick={() => alert('Orders CSV report exported successfully!')} className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded transition-colors cursor-pointer border-0">Export CSV</button>
            </div>
            
            <div className="flex-1 overflow-x-auto w-full">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 text-[12.5px] font-black text-teal-700">#{order.id.replace('#', '')}</td>
                      <td className="py-2.5 text-xs text-slate-700 font-semibold">{order.customer}</td>
                      <td className="py-2.5">
                        <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border ${
                          order.status === 'PROCESSING' 
                            ? 'text-amber-600 bg-amber-50 border-amber-100' 
                            : order.status === 'READY' 
                              ? 'text-teal-700 bg-teal-50 border-teal-100' 
                              : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-slate-800 font-black text-right">{order.amount}</td>
                      <td className="py-2.5 text-center">
                        <button onClick={() => navigate('/vendor/pharmacy/orders')} className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors border-0 cursor-pointer">
                          <FiEye className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Customers (Takes 4 columns) */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-4 lg:p-5 shadow-sm flex flex-col justify-between min-h-[265px]">
            <div className="border-b border-slate-50 pb-2.5 mb-2.5">
              <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Recent Customers</h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 justify-center">
              {displayCustomers.map((customer, idx) => (
                <div key={idx} onClick={() => navigate('/vendor/pharmacy/customers')} className="flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-xl p-1 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <FiUsers className="text-xs" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-none">{customer.name}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold truncate mt-0.5 block">{customer.email}</span>
                    </div>
                  </div>
                  <span className={`text-[8.5px] font-black px-2 py-0.5 rounded shrink-0 ${
                    customer.badge === 'NEW' 
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                      : 'text-slate-500 bg-slate-50 border border-slate-100'
                  }`}>
                    {customer.badge}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/vendor/pharmacy/customers')} className="w-full mt-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#135A5A] text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors border border-teal-100/50 cursor-pointer">
              View Customer CRM
            </button>
          </div>

        </div>

      </div>

      {/* Floating Action Button */}
      <button onClick={() => navigate('/vendor/pharmacy/medicines/add')} className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#135A5A]/40 transition-transform hover:scale-105 border-0 cursor-pointer z-50">
        <FiPlus className="text-2xl lg:text-3xl" />
      </button>

    </div>
  );
}
