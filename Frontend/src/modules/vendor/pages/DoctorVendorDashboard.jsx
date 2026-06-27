import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiCalendar, FiUsers, FiVideo, FiDollarSign, 
  FiChevronDown, FiMoreVertical, FiPaperclip, FiPlus, FiClock, FiFileText,
  FiActivity, FiCheckCircle, FiPhoneCall, FiTrendingUp, FiMessageSquare, FiBell, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorVendorDashboard() {
  const { appointments = [] } = useSelector(state => state.products || {});
  const { vendorUser } = useSelector(state => state.vendorAuth || {});

  // Match actual vendor appointments, fallback if none
  const myActualAppointments = appointments.filter(apt => vendorUser && apt.doctorName === vendorUser.name);
  const displayAppointments = myActualAppointments.length > 0 ? myActualAppointments : appointments;

  const fallbackAppointments = [
    { id: 'f1', patientName: 'Emily Cooper', type: 'Clinic', timeSlot: '10:30 AM', status: 'Pending' },
    { id: 'f2', patientName: 'Robert Fox', type: 'Video', timeSlot: '11:15 AM', status: 'Confirmed' },
    { id: 'f3', patientName: 'David Miller', type: 'Clinic', timeSlot: '12:00 PM', status: 'In Progress' },
    { id: 'f4', patientName: 'Sarah Jenkins', type: 'Video', timeSlot: '02:30 PM', status: 'Pending' },
    { id: 'f5', patientName: 'Michael Chen', type: 'Clinic', timeSlot: '04:15 PM', status: 'Confirmed' },
    { id: 'f6', patientName: 'Jessica Wong', type: 'Video', timeSlot: '05:00 PM', status: 'Pending' }
  ];

  const finalAppointments = [...displayAppointments, ...fallbackAppointments];
  const uniquePatients = new Set(finalAppointments.map(apt => apt.patientName)).size;
  const onlineConsults = finalAppointments.filter(apt => apt.type === 'Video').length;
  
  const todaysAppointmentsCount = finalAppointments.length;
  const completedAppointmentsCount = Math.floor(todaysAppointmentsCount * 0.4);
  const totalPatientsCount = uniquePatients + 1240; 
  const onlineConsultsCount = onlineConsults > 0 ? onlineConsults : 12;
  const monthlyEarnings = 14250 + (finalAppointments.length * 250);
  const pendingCount = todaysAppointmentsCount - completedAppointmentsCount;

  return (
    <div className="flex flex-col gap-4 font-sans animate-fade-in p-2 md:p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      
      {/* 1. Welcome Doctor Card (Premium UI) */}
      <motion.section 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl bg-[#135A5A] shadow-premium p-5 md:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img src={vendorUser?.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"} alt="Doctor" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white/20 shadow-lg object-cover" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                <FiCheckCircle className="text-white text-xs" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Verified Specialist
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white leading-tight">
                Welcome back, {vendorUser?.name || 'Dr. Archana'}
              </h1>
              <p className="text-xs md:text-sm text-teal-50/80 font-semibold mt-1 max-w-md">
                You have <span className="text-white font-black">{todaysAppointmentsCount}</span> appointments today. <span className="text-amber-300 font-bold">{pendingCount}</span> consultations pending.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider rounded-2xl backdrop-blur-sm border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none">
              <FiCalendar className="text-lg" /> Calendar
            </button>
            <button className="flex-1 md:flex-none px-5 py-3 bg-white hover:bg-slate-50 text-[#135A5A] font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm border-0 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none">
              <FiPlus className="text-lg" /> Prescription
            </button>
          </div>
        </div>
      </motion.section>

      {/* 2. Statistics Section (Premium KPI Deck) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { title: "Today's Appts", value: todaysAppointmentsCount, icon: <FiCalendar />, color: "text-teal", bg: "bg-teal-50", trend: "+12%" },
          { title: "Completed", value: completedAppointmentsCount, icon: <FiCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%" },
          { title: "Total Patients", value: totalPatientsCount.toLocaleString(), icon: <FiUsers />, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+8%" },
          { title: "Earnings", value: `₹${monthlyEarnings.toLocaleString()}`, icon: <FiDollarSign />, color: "text-amber-600", bg: "bg-amber-50", trend: "+15%" }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-4 md:p-5 border border-slate-100 shadow-sm flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center text-lg md:text-xl group-hover:scale-110 transition-transform`}>
                {kpi.icon}
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4 md:mt-6">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.title}</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-none">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        
        {/* LEFT COLUMN (Spans 2) */}
        <div className="xl:col-span-2 flex flex-col gap-4 md:gap-6">
          
          {/* Online Consultation Widget */}
          <section className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
                <FiVideo className="text-[#135A5A] text-lg md:text-xl" /> Live Consultations
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> LIVE NOW
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Video Call Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/40 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-slate-200 shadow-sm object-cover" />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-50 rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-slate-800 leading-tight">Sarah Jenkins</h4>
                      <p className="text-[10px] md:text-xs text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                        <FiClock className="text-amber-500" /> Waiting: 4 mins
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors border-0 cursor-pointer flex items-center justify-center gap-2 outline-none">
                    <FiVideo className="text-lg" /> Join Video Call
                  </button>
                </div>
              </div>

              {/* Chat Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/40 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/150?u=mark" alt="Mark" className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-slate-200 shadow-sm object-cover" />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-slate-50 rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-slate-800 leading-tight">Mark Thompson</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-0.5">Follow-up Chat</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="w-full py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 outline-none">
                    <FiMessageSquare className="text-blue-500 text-lg" /> Open Chat
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appointments Widget */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="p-4 md:p-6 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
                <FiActivity className="text-[#135A5A] text-lg md:text-xl" /> Today's Schedule
              </h2>
              <button className="text-[10px] md:text-xs font-black text-[#135A5A] uppercase tracking-wider bg-transparent border-0 cursor-pointer hover:underline">
                View All
              </button>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full p-2">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="py-4 px-4">Patient</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Time</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-50">
                  {finalAppointments.slice(0, 6).map((apt, index) => (
                    <tr key={apt.id || index} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || 'Patient')}&background=random`} alt={apt.patientName} className="w-8 h-8 rounded-full border border-slate-200" />
                          <span className="font-black text-slate-800">{apt.patientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${apt.type === 'Video' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-[#135A5A] bg-[#135A5A]/10 border border-[#135A5A]/20'}`}>
                          {apt.type === 'Video' ? '🎥 Video' : '🏥 Clinic'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-600">{apt.timeSlot || apt.date || '10:30 AM'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                          apt.status === 'Confirmed' ? 'bg-emerald-50 border border-emerald-100 text-emerald-600' : 
                          apt.status === 'In Progress' ? 'bg-amber-50 border border-amber-100 text-amber-600' : 
                          'bg-slate-50 border border-slate-200 text-slate-500'
                        }`}>
                          {apt.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="p-2 rounded-xl text-slate-400 hover:text-[#135A5A] hover:bg-teal-50 transition-colors border-0 bg-transparent cursor-pointer" title="View Details">
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/30">
              {finalAppointments.slice(0, 6).map((apt, index) => (
                <div key={apt.id || index} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || 'Patient')}&background=random`} alt={apt.patientName} className="w-10 h-10 rounded-full border border-slate-200" />
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-xs">{apt.patientName}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{apt.timeSlot || apt.date || '10:30 AM'}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                      apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      apt.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {apt.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${apt.type === 'Video' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-[#135A5A] bg-[#135A5A]/10 border border-[#135A5A]/20'}`}>
                      {apt.type === 'Video' ? '🎥 Video' : '🏥 Clinic'}
                    </span>
                    <button className="text-[10px] font-black text-[#135A5A] uppercase tracking-wider bg-transparent border-0 cursor-pointer flex items-center gap-1">
                      Details <FiChevronRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4 md:gap-6">
          
          {/* Prescription Widget */}
          <section className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2">
              <FiFileText className="text-purple-500 text-lg md:text-xl" /> Prescription Center
            </h2>
            <button className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all border-0 cursor-pointer flex items-center justify-center gap-2">
              <FiPlus className="text-lg" /> Create New
            </button>
            <div className="mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Prescriptions</p>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Atorvastatin 20mg', patient: 'Henry G.', time: '2h' },
                  { name: 'Lisinopril 10mg', patient: 'Maria S.', time: '5h' },
                  { name: 'Amoxicillin 500mg', patient: 'John D.', time: '1d' }
                ].map((px, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 bg-white group-hover:text-purple-500 transition-colors shadow-sm">
                        <FiPaperclip className="text-sm" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{px.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{px.patient} • {px.time}</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-slate-300 w-4 h-4 group-hover:text-[#135A5A]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analytics Widget */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-4 md:p-6 shadow-premium text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-center mb-6">
              <h2 className="text-sm md:text-base font-black flex items-center gap-2 text-white">
                <FiTrendingUp className="text-teal-400 text-lg md:text-xl" /> Analytics
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/5">
                Weekly <FiChevronDown />
              </div>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Revenue</p>
                <p className="text-lg md:text-xl font-black">₹{(monthlyEarnings * 0.3).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Growth</p>
                <p className="text-lg md:text-xl font-black text-emerald-400">+12.4%</p>
              </div>
            </div>

            {/* Faux mini chart */}
            <div className="relative h-16 w-full flex items-end justify-between z-10 mt-2">
              {[40, 70, 45, 90, 60, 100, 80].map((h, i) => {
                const currentDayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                const isToday = i === currentDayIdx;
                return (
                  <div key={i} className="w-[10%] h-full flex items-end relative group cursor-pointer">
                    <div 
                      className={`w-full bg-teal-400 ${isToday ? 'opacity-100 shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'opacity-30 group-hover:opacity-100'} rounded-t-sm transition-all duration-300`} 
                      style={{ height: `${h}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                      ₹{(h * 15).toLocaleString()}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Notifications Widget */}
          <section className="bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm flex flex-col h-full">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2 mb-4">
              <FiBell className="text-amber-500 text-lg md:text-xl" /> Notifications
              <span className="w-2 h-2 bg-coral rounded-full animate-pulse ml-1"></span>
            </h2>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { title: 'New Booking', desc: 'Emily Cooper booked a Video Consult.', time: '10m ago', icon: <FiVideo />, color: 'bg-blue-50 text-blue-500 border-blue-100' },
                { title: 'System Alert', desc: 'Your profile was viewed 45 times today.', time: '1h ago', icon: <FiActivity />, color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
                { title: 'Message', desc: 'David Miller sent a message.', time: '2h ago', icon: <FiMessageSquare />, color: 'bg-amber-50 text-amber-500 border-amber-100' }
              ].map((notif, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black text-slate-800">{notif.title}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{notif.time}</p>
                    </div>
                    <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1 leading-snug">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border border-slate-200 cursor-pointer outline-none">
              View All Notifications
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
