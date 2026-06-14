import React from 'react';
import { 
  FiEye, FiTrendingUp, FiShoppingBag, FiClock, FiCheckCircle, FiFileText, FiPlus
} from 'react-icons/fi';

export default function VendorDashboard() {
  return (
    <div className="pb-12 font-sans bg-[#F8FAF9] min-h-screen">
      
      {/* Container - Compact Desktop Responsive Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 pt-4 lg:pt-5">
        
        {/* Header Greeting */}
        <div className="flex flex-col">
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">Good Morning,</h1>
          <p className="text-[10px] lg:text-xs font-semibold text-slate-500 mt-0.5">Central Park Pharmacy Vendor Panel</p>
        </div>

        {/* Responsive Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* LEFT COLUMN: Main Metrics (Takes up 7 columns on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Revenue Today Card */}
            <div className="bg-[#135A5A] rounded-[20px] p-5 lg:p-6 text-white shadow-xl shadow-[#135A5A]/10 relative overflow-hidden flex flex-col justify-between min-h-[120px] lg:min-h-[140px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-teal-100">Revenue Today</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <span className="text-sm">💵</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight">$4,280.50</h2>
                <p className="text-[10px] lg:text-xs font-semibold text-teal-100 mt-1 flex items-center gap-1">
                  <FiTrendingUp className="text-emerald-300" /> <span className="text-white">+12%</span> from yesterday
                </p>
              </div>
            </div>

            {/* 6 KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 lg:gap-3">
              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Medicines</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-[#135A5A] leading-none">1,248</span>
                  <FiPlus className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Medicines</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-emerald-600 leading-none">1,120</span>
                  <FiCheckCircle className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prescriptions</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-[#135A5A] leading-none">42</span>
                  <FiFileText className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-[#9A3D4A] leading-none">18</span>
                  <FiEye className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-amber-500 leading-none">35</span>
                  <FiClock className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-[16px] p-3 lg:p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Delivery</span>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xl lg:text-2xl font-black text-indigo-500 leading-none">12</span>
                  <FiShoppingBag className="text-slate-200 text-xl mb-0.5" />
                </div>
              </div>
            </div>

            {/* Monthly Revenue Strip */}
            <div className="bg-slate-100 rounded-[16px] p-4 lg:p-5 flex items-center justify-between border border-slate-200/60 shadow-inner">
              <div className="flex flex-col">
                <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Monthly Revenue</span>
                <span className="text-xl lg:text-2xl font-black text-slate-800">$102,450.00</span>
              </div>
              <span className="text-[10px] font-black text-[#135A5A] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">+8.4%</span>
            </div>

            {/* Weekly Performance */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm lg:text-base font-extrabold text-slate-800">Weekly Performance</h3>
                <button className="text-[10px] font-black text-[#135A5A] hover:underline bg-transparent border-0 cursor-pointer">
                  View Report
                </button>
              </div>
              <div className="bg-white border border-slate-100 rounded-[20px] p-4 lg:p-6 h-40 lg:h-48 shadow-sm flex flex-col justify-end relative">
                {/* Mock Chart Area */}
                <div className="absolute inset-0 p-4 lg:p-6 flex items-end justify-between px-6 lg:px-10 pb-8 lg:pb-12">
                  {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
                    <div 
                      key={i} 
                      className={`w-4 lg:w-8 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer ${i === 3 ? 'bg-[#135A5A] shadow-md' : 'bg-slate-100'}`} 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                
                {/* X-axis Labels */}
                <div className="flex justify-between w-full text-[9px] lg:text-xs font-black text-slate-400 uppercase tracking-widest z-10 border-t border-slate-50 pt-3">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span className="text-[#135A5A]">Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Alerts and Feed (Takes up 5 columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Stock Alerts */}
            <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
              <div className="bg-[#9A3D4A]/5 border border-[#9A3D4A]/20 rounded-[16px] p-4 flex flex-col justify-center items-center text-center hover:bg-[#9A3D4A]/10 transition-colors cursor-pointer">
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-[#9A3D4A]">Out of Stock</span>
                <span className="text-2xl lg:text-3xl font-black text-[#9A3D4A] my-1">12</span>
                <span className="text-[9px] lg:text-[10px] font-semibold text-[#9A3D4A]/80">Medicines</span>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-[16px] p-4 flex flex-col justify-center items-center text-center hover:bg-orange-100 transition-colors cursor-pointer">
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-orange-600">Low Stock</span>
                <span className="text-2xl lg:text-3xl font-black text-orange-600 my-1">45</span>
                <span className="text-[9px] lg:text-[10px] font-semibold text-orange-600/80">Critical Level</span>
              </div>
            </div>

            {/* Prescription Requests */}
            <div className="bg-white border border-slate-100 rounded-[24px] p-5 lg:p-6 shadow-sm flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
                <h3 className="text-base lg:text-lg font-extrabold text-slate-800">Prescription Requests</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#9A3D4A] px-3 py-1 rounded-full shadow-sm">
                  5 New
                </span>
              </div>
              
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                {[
                  { name: 'Johnathan Doe', medicine: 'Augmentin 625mg', time: '2 mins ago', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
                  { name: 'Sarah Miller', medicine: 'Metformin 500mg', time: '15 mins ago', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
                  { name: 'Robert Wilson', medicine: 'Lisinopril 10mg', time: '1 hour ago', color: 'bg-slate-100 text-slate-600 border-slate-200' },
                  { name: 'Emily Davis', medicine: 'Amoxicillin 250mg', time: '3 hours ago', color: 'bg-teal-100 text-[#135A5A] border-teal-200' },
                  { name: 'Michael Brown', medicine: 'Ibuprofen 400mg', time: '5 hours ago', color: 'bg-orange-100 text-orange-600 border-orange-200' },
                ].map((req, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-[16px] p-3 lg:p-4 flex items-center justify-between hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center shrink-0 border ${req.color}`}>
                        <span className="font-black text-sm lg:text-base">{req.name.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm lg:text-base font-bold text-slate-800 leading-tight group-hover:text-[#135A5A] transition-colors">{req.name}</h4>
                        <p className="text-[10px] lg:text-xs text-slate-500 font-semibold mt-0.5">
                          {req.medicine} • {req.time}
                        </p>
                      </div>
                    </div>
                    <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:bg-[#135A5A] group-hover:border-[#135A5A] group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0 cursor-pointer">
                      <FiEye className="text-sm lg:text-base" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl transition-colors border-0 cursor-pointer">
                View All Requests
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
