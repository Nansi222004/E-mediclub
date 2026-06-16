import React from 'react';
import { useSelector } from 'react-redux';
import { 
  FiEye, FiTrendingUp, FiShoppingBag, FiClock, FiCheckCircle, FiFileText, FiPlus
} from 'react-icons/fi';

export default function VendorDashboard() {
  const { kycDetails } = useSelector(state => state.vendor || { kycDetails: {} });
  const storeName = kycDetails?.storeName || 'MedPlus Wellness Pharmacy';

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-screen">
      
      {/* Container - Compact Desktop Responsive Layout */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col gap-1.5 pt-1 lg:pt-2">
        
        {/* Header Greeting */}
        <div className="flex flex-col mt-1">
          <h1 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">Good Morning,</h1>
          <p className="text-[9px] lg:text-[10px] font-semibold text-slate-500 mt-0.5">{storeName} Vendor Panel</p>
        </div>

        {/* Responsive Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
          
          {/* LEFT COLUMN: Main Metrics (Takes up 7 columns on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            
            {/* Revenue Today Card */}
            <div className="bg-[#135A5A] rounded-xl p-3 lg:p-4 text-white shadow-md shadow-[#135A5A]/10 relative overflow-hidden flex flex-col justify-between min-h-[80px] lg:min-h-[100px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10 mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-teal-100">Revenue Today</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="text-xs">💵</span>
                </div>
              </div>
              
              <div className="relative z-10 flex items-end justify-between">
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight leading-none">₹4,280.50</h2>
                <p className="text-[9px] font-semibold text-teal-100 flex items-center gap-1">
                  <FiTrendingUp className="text-emerald-300" /> <span className="text-white">+12%</span> today
                </p>
              </div>
            </div>

            {/* 6 KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Meds</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-[#135A5A] leading-none">1,248</span>
                  <FiPlus className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active Meds</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-emerald-600 leading-none">1,120</span>
                  <FiCheckCircle className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Scripts</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-[#135A5A] leading-none">42</span>
                  <FiFileText className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-[#9A3D4A] leading-none">18</span>
                  <FiEye className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-amber-500 leading-none">35</span>
                  <FiClock className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-lg p-2 flex flex-col justify-between shadow-sm">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-wider">Pending Deliv</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg lg:text-xl font-black text-indigo-500 leading-none">12</span>
                  <FiShoppingBag className="text-slate-200 text-sm mb-0.5" />
                </div>
              </div>
            </div>

            {/* Monthly Revenue Strip */}
            <div className="bg-slate-100 rounded-lg p-2 lg:p-3 flex items-center justify-between border border-slate-200/60 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[8px] lg:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Monthly Revenue</span>
                <span className="text-lg lg:text-xl font-black text-slate-800">₹102,450.00</span>
              </div>
              <span className="text-[9px] font-black text-[#135A5A] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">+8.4%</span>
            </div>

            {/* Weekly Performance */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs lg:text-sm font-extrabold text-slate-800">Performance</h3>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button className="px-2 lg:px-3 py-1 text-[8px] lg:text-[9px] font-black rounded-md bg-white shadow-sm text-[#135A5A] cursor-pointer border-0">Weekly</button>
                  <button className="px-2 lg:px-3 py-1 text-[8px] lg:text-[9px] font-bold rounded-md text-slate-500 hover:text-slate-700 bg-transparent cursor-pointer border-0 transition-colors">Monthly</button>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-2 lg:p-3 h-24 lg:h-32 shadow-sm flex flex-col justify-end relative pt-6 lg:pt-8">
                {/* Mock Chart Area */}
                <div className="absolute inset-0 p-2 lg:p-3 flex items-end justify-between px-3 lg:px-5 pb-5 lg:pb-7 pt-6 lg:pt-8">
                  {[40, 60, 30, 80, 50, 70, 90].map((h, i) => {
                    const currentDayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                    const isToday = i === currentDayIdx;
                    return (
                      <div key={i} className="h-full flex items-end relative group cursor-pointer w-3 lg:w-6">
                        <div 
                          className={`w-full rounded-t-md transition-all duration-300 bg-[#135A5A] ${isToday ? 'opacity-100 shadow-md' : 'opacity-20 group-hover:opacity-100 group-hover:shadow-md'}`} 
                          style={{ height: `${h}%` }}
                        ></div>
                        {/* Tooltip */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-20 pointer-events-none shadow-md">
                          ₹{(h * 42).toLocaleString()}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* X-axis Labels */}
                <div className="flex justify-between w-full text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest z-10 border-t border-slate-50 pt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span className="text-[#135A5A]">Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Alerts and Feed (Takes up 5 columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            
            {/* Stock Alerts */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-[#9A3D4A]/5 border border-[#9A3D4A]/20 rounded-lg p-2 flex flex-col justify-center items-center text-center cursor-pointer">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#9A3D4A]">Out of Stock</span>
                <span className="text-xl lg:text-2xl font-black text-[#9A3D4A] my-0.5">12</span>
                <span className="text-[8px] font-semibold text-[#9A3D4A]/80">Medicines</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex flex-col justify-center items-center text-center cursor-pointer">
                <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-orange-600">Low Stock</span>
                <span className="text-xl lg:text-2xl font-black text-orange-600 my-0.5">45</span>
                <span className="text-[8px] font-semibold text-orange-600/80">Critical Level</span>
              </div>
            </div>

            {/* Prescription Requests */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 lg:p-4 shadow-sm flex flex-col flex-1 min-h-[300px]">
              <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-2">
                <h3 className="text-xs lg:text-sm font-extrabold text-slate-800">Prescriptions</h3>
                <span className="text-[8px] font-black uppercase tracking-wider text-white bg-[#9A3D4A] px-1.5 py-0.5 rounded shadow-sm">
                  5 New
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
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-lg p-2 flex items-center justify-between hover:bg-white transition-all group cursor-pointer">
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
              
              <button className="w-full mt-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-md transition-colors border-0 cursor-pointer">
                View All
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#135A5A]/40 transition-transform hover:scale-105 border-0 cursor-pointer z-50">
        <FiPlus className="text-2xl lg:text-3xl" />
      </button>

    </div>
  );
}
