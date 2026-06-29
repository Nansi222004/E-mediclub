import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiEye, FiTrendingUp, FiShoppingBag, FiClock, FiCheckCircle, FiFileText, FiPlus, FiStar, FiUsers, FiDollarSign
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

  // Combine Redux orders with Mock Orders (if Redux is empty, mock is shown)
  const combinedOrders = orders.length > 0 ? orders : getTodayOrders();
  const displayOrders = combinedOrders.slice(0, 5).map(order => ({
    id: order.id,
    customer: order.customerName,
    status: order.status === 'New Orders' || order.status === 'Accepted Orders' || order.status === 'Processing' ? 'PROCESSING' : order.status === 'Ready for Dispatch' ? 'READY' : 'DELIVERED',
    amount: `₹${(order.totalAmount || 0).toLocaleString('en-IN')}.00`
  }));

  // Map unique customers from Mock Orders
  const uniqueCustomers = Array.from(new Set(combinedOrders.map(o => o.customerName)))
    .map((name, index) => ({
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      badge: index === 0 ? 'NEW' : `${(index % 3) + 1} Orders`
    }));

  const displayCustomers = uniqueCustomers.slice(0, 4);

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
      <div className="w-full mx-auto p-3 md:p-5 lg:p-6 flex flex-col gap-4 md:gap-6 pt-2 lg:pt-4">
        
        {/* Header Greeting */}
        <div className="flex flex-col mt-1 px-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Good Morning,</h1>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">{storeName} Vendor Panel</p>
        </div>

        {/* Responsive Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          
          {/* LEFT COLUMN: Main Metrics (Takes up 7 columns on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
            
            {/* Sales & Revenue Header Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              
              {/* Revenue Today Card */}
              <div onClick={() => navigate('/vendor/pharmacy/revenue?filter=today')} className="bg-[#135A5A] rounded-3xl p-5 lg:p-6 text-white shadow-premium shadow-[#135A5A]/20 relative overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer select-none group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110 duration-700" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10 mb-2">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-teal-100">Revenue Today</span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm">
                    <FiDollarSign className="text-xl text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 flex items-end justify-between mt-4">
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none">₹{getTodayRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                  <p className="text-[10px] md:text-xs font-black text-teal-100 flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <FiTrendingUp className="text-emerald-300 animate-pulse text-sm" /> <span className="text-white">+12%</span>
                  </p>
                </div>
              </div>

              {/* Monthly Revenue Strip */}
              <div onClick={() => navigate('/vendor/pharmacy/revenue?filter=month')} className="bg-white border border-slate-100 rounded-3xl p-5 lg:p-6 shadow-premium relative overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer select-none group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110 duration-700" />
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500">Revenue This Month</span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    <FiTrendingUp className="text-xl text-[#135A5A]" />
                  </div>
                </div>
                
                <div className="flex items-end justify-between relative z-10 mt-4">
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none text-slate-800">₹{getMonthlyRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                  <span className="text-[10px] md:text-xs font-black text-[#135A5A] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">+8.4%</span>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {kpis.map((kpi, index) => {
                const IconComponent = kpi.icon;
                return (
                  <div key={index} onClick={() => navigate(kpi.path)} className="bg-white border border-slate-100 rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-premium hover:shadow-lg transition-all cursor-pointer select-none group">
                    <div className="flex justify-between items-start gap-2">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center ${kpi.color} shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                        <IconComponent className="text-lg md:text-xl" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight block mb-1 truncate">{kpi.name}</span>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{kpi.value}</h3>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Operational Widgets (Takes up 5 columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            
            {/* Quick Actions */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { name: 'Add Medicine', path: '/vendor/pharmacy/medicines/add', icon: FiPlus },
                  { name: 'Bulk Upload', path: '/vendor/pharmacy/medicines?tab=Bulk Upload', icon: FiFileText },
                  { name: 'Create Coupon', path: '/vendor/pharmacy/promotions', icon: FiStar },
                  { name: 'Upload Banner', path: '/vendor/pharmacy/promotions', icon: FiEye },
                  { name: 'Manage Inventory', path: '/vendor/pharmacy/inventory', icon: FiShoppingBag },
                  { name: 'Add Health Device', path: '/vendor/pharmacy/devices', icon: FiPlus },
                ].map((action, idx) => (
                  <button key={idx} onClick={() => navigate(action.path)} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-[#135A5A] transition-colors cursor-pointer text-center">
                    <action.icon className="text-lg" />
                    <span className="text-[9px] font-black uppercase tracking-wider">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Return Requests Widget */}
            <div className="grid grid-cols-3 gap-3">
              <div onClick={() => navigate('/vendor/pharmacy/orders?tab=Returns')} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:border-slate-200">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Returns</span>
                <span className="text-xl font-black text-slate-800">{summary.returns}</span>
                <span className="text-[8px] font-black uppercase tracking-wider text-amber-500 mt-1">Pending</span>
              </div>
              <div onClick={() => navigate('/vendor/pharmacy/orders?tab=Returns')} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:border-slate-200">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Returns</span>
                <span className="text-xl font-black text-slate-800">{summary.returnApproved}</span>
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-500 mt-1">Approved</span>
              </div>
              <div onClick={() => navigate('/vendor/pharmacy/orders?tab=Refunds')} className="bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:border-slate-200">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Refunds</span>
                <span className="text-xl font-black text-slate-800">{summary.refunds}</span>
                <span className="text-[8px] font-black uppercase tracking-wider text-blue-500 mt-1">Processed</span>
              </div>
            </div>

            {/* Critical Stock & Expiry Alerts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-rose-700 uppercase tracking-widest mb-3">Critical Stock</h3>
                <div className="flex flex-col gap-2">
                  {getOutOfStockItems().slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-rose-100/50">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{item.name}</span>
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">0 Units</span>
                    </div>
                  ))}
                  {getLowStockItems().slice(0, Math.max(0, 3 - getOutOfStockItems().length)).map((item, idx) => (
                    <div key={`low-${idx}`} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{item.name}</span>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">{item.stock} Units</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-3">Expiring Soon</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Crocin 500', days: '10 Days' },
                    { name: 'Insulin Glargine', days: '7 Days' },
                    { name: 'Vitamin C Forte', days: '15 Days' }
                  ].map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-amber-100/50">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{exp.name}</span>
                      <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">{exp.days}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Overview */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Delivery Overview</h3>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-lg font-black text-[#135A5A]">5</span>
                  <span className="text-[9px] font-black uppercase text-slate-500 mt-1 text-center">Available Riders</span>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-lg font-black text-indigo-600">{summary.readyToShip}</span>
                  <span className="text-[9px] font-black uppercase text-slate-500 mt-1 text-center">Orders Out</span>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center">
                  <span className="text-lg font-black text-emerald-600">{summary.delivered}</span>
                  <span className="text-[9px] font-black uppercase text-slate-500 mt-1 text-center">Delivered Today</span>
                </div>
              </div>
            </div>

            {/* Pending Prescription Approvals */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Pending Prescriptions</h3>
                <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
                  {getPrescriptionOrders().length} New
                </span>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 max-h-[300px]">
                {getPrescriptionOrders().slice(0, 3).map((req, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-xs font-black text-slate-800">{req.customerName}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{req.extractedMedicines && req.extractedMedicines[0] ? req.extractedMedicines[0].name : 'Unknown Rx'}</p>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{req.uploadedTime || '2 mins ago'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-100 transition-colors">Approve</button>
                      <button className="py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[9px] font-black uppercase hover:bg-rose-100 transition-colors">Reject</button>
                      <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-slate-100 transition-colors">Request Info</button>
                      <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase hover:bg-slate-100 transition-colors">Call Cust</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button onClick={() => navigate('/vendor/pharmacy/prescriptions')} className="w-full mt-4 py-3 bg-white hover:bg-slate-50 text-[#135A5A] text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-colors border border-[#135A5A]/20 cursor-pointer outline-none">
                View All Prescriptions
              </button>
            </div>

          </div>

        </div>

        {/* REVENUE & ORDER SUMMARY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-2">
          
          {/* Revenue Analytics Card */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Revenue Analytics</h3>
              <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setAnalyticsTab(tab)}
                    className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 outline-none ${
                      analyticsTab === tab 
                        ? 'bg-white text-[#135A5A] shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600 bg-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Multi-layered Revenue Chart Visual */}
            <div className="flex-1 flex flex-col justify-end pt-4 min-h-[200px]">
              <div className="flex justify-between items-end h-[180px] px-2 sm:px-4 lg:px-8">
                {[
                  { label: 'Mon', h1: 45, h2: 30 },
                  { label: 'Tue', h1: 65, h2: 40 },
                  { label: 'Wed', h1: 85, h2: 85 },
                  { label: 'Thu', h1: 50, h2: 35 },
                  { label: 'Fri', h1: 75, h2: 55 },
                  { label: 'Sat', h1: 90, h2: 75 },
                  { label: 'Sun', h1: 70, h2: 45 },
                ].map((item, idx) => (
                  <div key={idx} className="h-full flex flex-col justify-end items-center w-8 sm:w-10 lg:w-16 group relative cursor-pointer">
                    
                    {/* Multi-layered Stacked Bar Container */}
                    <div className="w-5 sm:w-6 lg:w-10 h-full flex items-end relative rounded-t-xl overflow-hidden bg-slate-50">
                      {/* Background lighter layer */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-teal-100 transition-all duration-500 rounded-t-xl"
                        style={{ height: `${item.h1}%` }}
                      />
                      {/* Foreground darker layer */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#135A5A] transition-all duration-500 rounded-t-xl"
                        style={{ height: `${item.h2}%` }}
                      />
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] md:text-xs font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20 pointer-events-none shadow-xl">
                      <div className="text-slate-300 mb-1 font-bold text-[9px] uppercase tracking-wider">Potential: ₹{(item.h1 * 60).toLocaleString()}</div>
                      <div className="text-emerald-400">Revenue: ₹{(item.h2 * 60).toLocaleString()}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between w-full text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 mt-4 pt-3 px-2 sm:px-4 lg:px-8">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <span key={i} className="w-8 sm:w-10 lg:w-16 text-center">{day}</span>
                ))}
              </div>
            </div>
          </div>
            {/* Order Summary & Fulfillment Card */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[350px] select-none">
            <div className="border-b border-slate-50 pb-4 mb-2">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Order Summary</h3>
            </div>

            {/* List of Order States */}
            <div className="flex flex-col gap-3 my-2 flex-1">
              {[
                { label: 'New Orders', count: summary.newOrders, dotColor: 'bg-blue-400', path: '/vendor/pharmacy/orders?status=new' },
                { label: 'Processing', count: summary.processing, dotColor: 'bg-emerald-500', path: '/vendor/pharmacy/orders?status=processing' },
                { label: 'Ready to Ship', count: summary.readyToShip, dotColor: 'bg-[#135A5A]', path: '/vendor/pharmacy/orders?status=ready-dispatch' },
                { label: 'Delivered', count: summary.delivered, dotColor: 'bg-teal-400', path: '/vendor/pharmacy/orders?status=delivered' },
                { label: 'Cancelled', count: summary.cancelled, dotColor: 'bg-rose-500', path: '/vendor/pharmacy/orders?status=cancelled' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate(item.path)}
                  title={`${item.count} orders in ${item.label}`}
                  className="flex justify-between items-center cursor-pointer hover:bg-slate-50 hover:px-3 active:scale-[0.98] transition-all py-2 rounded-xl"
                >
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-xs md:text-sm">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor} shadow-sm`} />
                    <span className="uppercase tracking-wider text-[10px] md:text-xs">{item.label}</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm md:text-base">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Fulfillment circular donut gauge */}
            <div className="flex justify-center items-center pt-4 border-t border-slate-50 mt-2 relative">
              <div className="relative flex items-center justify-center">
                {/* SVG circular donut */}
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#135A5A" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 * (1 - summary.fulfillmentPercent / 100)} 
                    strokeLinecap="round" 
                  />
                </svg>
                {/* Centered percentage text inside donut */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg md:text-xl font-black text-slate-800 leading-none">{summary.fulfillmentPercent}%</span>
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Fulfill Rate</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* HEALTH DEVICES & TOP SELLING MEDICINES SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-2">
          
          {/* Health Devices Card */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[300px]">
            <div className="border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Health Devices</h3>
            </div>

            <div className="flex-1 flex flex-col gap-3 justify-center">
              {[
                { name: 'Accu-Chek Blood Glucose Monitor', stock: '45 Units', price: '₹975', status: 'In Stock', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { name: 'Omron Automatic BP Monitor', stock: '18 Units', price: '₹2,499', status: 'Low Stock', badgeColor: 'text-amber-600 bg-amber-50 border-amber-100' },
                { name: 'Dr Trust Pulse Oximeter', stock: '120 Units', price: '₹1,199', status: 'In Stock', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { name: 'Digital Infrared Thermometer', stock: '0 Units', price: '₹850', status: 'Out of Stock', badgeColor: 'text-rose-600 bg-rose-50 border-rose-100' }
              ].map((device, idx) => (
                <div key={idx} onClick={() => navigate('/vendor/pharmacy/products')} className="flex justify-between items-center py-2 px-3 cursor-pointer hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#135A5A] border border-teal-100 flex items-center justify-center shrink-0">
                      <span className="text-lg">🩺</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-black text-slate-800 truncate leading-tight">{device.name}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 tracking-wider">{device.stock} • {device.price}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border shrink-0 ${device.badgeColor}`}>
                    {device.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Medicines */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[300px]">
            <div className="border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Top Selling Medicines</h3>
            </div>

            {/* Medicines List Table - Responsive */}
            <div className="flex-1 overflow-x-auto w-full pb-2">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Medicine Name</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Sales</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Paracetamol 500mg', cat: 'Pain Relief', sales: '1,240', trend: 'up' },
                    { name: 'Vitamin C 1000mg', cat: 'Supplements', sales: '890', trend: 'up' },
                    { name: 'Metformin 500mg', cat: 'Diabetes', sales: '750', trend: 'neutral' },
                    { name: 'Amoxicillin 250mg', cat: 'Antibiotics', sales: '640', trend: 'up' }
                  ].map((med, idx) => (
                    <tr key={idx} onClick={() => navigate('/vendor/pharmacy/medicines')} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                      <td className="py-3 md:py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#135A5A]/10 flex items-center justify-center text-[#135A5A] group-hover:bg-[#135A5A] group-hover:text-white transition-colors">
                          <span className="text-sm">💊</span>
                        </div>
                        <span className="text-xs md:text-sm font-black text-slate-800">{med.name}</span>
                      </td>
                      <td className="py-3 md:py-4 text-xs md:text-sm text-slate-500 font-bold">{med.cat}</td>
                      <td className="py-3 md:py-4 text-xs md:text-sm text-slate-800 font-black text-right">{med.sales}</td>
                      <td className="py-3 md:py-4 text-center">
                        <div className="flex justify-center">
                          {med.trend === 'up' ? (
                            <span className="text-emerald-500 font-black text-lg">↗</span>
                          ) : (
                            <span className="text-slate-400 font-black text-lg">→</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-2 pb-8">
          
          {/* Recent Orders (Takes 8 columns) */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[300px]">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Recent Orders</h3>
              <button onClick={() => alert('Orders CSV report exported successfully!')} className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 hover:bg-teal-100/80 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-teal-100 outline-none">Export CSV</button>
            </div>
            
            <div className="hidden md:block flex-1 overflow-x-auto w-full">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    <th className="py-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate('/vendor/pharmacy/orders')}>
                      <td className="py-3.5 text-xs md:text-sm font-black text-[#135A5A]">#{order.id.replace('#', '')}</td>
                      <td className="py-3.5 text-xs md:text-sm text-slate-800 font-black">{order.customer}</td>
                      <td className="py-3.5">
                        <span className={`text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                          order.status === 'PROCESSING' 
                            ? 'text-amber-600 bg-amber-50 border-amber-100' 
                            : order.status === 'READY' 
                              ? 'text-teal-700 bg-teal-50 border-teal-100' 
                              : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs md:text-sm text-slate-800 font-black text-right">{order.amount}</td>
                      <td className="py-3.5 text-center">
                        <button className="p-2 rounded-xl bg-slate-50 hover:bg-[#135A5A] text-slate-500 hover:text-white transition-colors border-0 cursor-pointer outline-none">
                          <FiEye className="text-sm md:text-base" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-3">
              {displayOrders.map((order, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3" onClick={() => navigate('/vendor/pharmacy/orders')}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#135A5A]">#{order.id.replace('#', '')}</span>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                          order.status === 'PROCESSING' 
                            ? 'text-amber-600 bg-amber-50 border-amber-100' 
                            : order.status === 'READY' 
                              ? 'text-teal-700 bg-teal-50 border-teal-100' 
                              : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                        }`}>
                          {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/50 pt-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800">{order.customer}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider mt-1">{order.amount}</span>
                    </div>
                    <button className="text-[10px] font-black text-[#135A5A] uppercase tracking-wider bg-transparent border-0 flex items-center gap-1 cursor-pointer">
                      Details <FiEye />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers (Takes 4 columns) */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-premium flex flex-col justify-between min-h-[300px]">
            <div className="border-b border-slate-50 pb-4 mb-4">
              <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">Recent Customers</h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 justify-center">
              {displayCustomers.map((customer, idx) => (
                <div key={idx} onClick={() => navigate('/vendor/pharmacy/customers')} className="flex justify-between items-center cursor-pointer hover:bg-slate-50 rounded-2xl p-2 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                      <FiUsers className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-black text-slate-800 truncate leading-none">{customer.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold truncate mt-1 block tracking-wider">{customer.email}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${
                    customer.badge === 'NEW' 
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                      : 'text-slate-600 bg-slate-50 border border-slate-200'
                  }`}>
                    {customer.badge}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/vendor/pharmacy/customers')} className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-[#135A5A] text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl transition-colors border border-teal-100/50 cursor-pointer outline-none">
              View Customer CRM
            </button>
          </div>

        </div>

      </div>



    </div>
  );
}
