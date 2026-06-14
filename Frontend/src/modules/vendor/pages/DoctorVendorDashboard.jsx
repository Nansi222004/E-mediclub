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
    <div className="flex flex-col gap-6 font-sans pb-10 animate-fade-in">
      
      {/* 1. Welcome Doctor Card (Matching User Panel Promo Banner Style) */}
      <motion.section 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-white via-teal-50 to-emerald-50 border border-teal-100 shadow-premium p-6 md:p-8"
      >
        <div className="absolute -top-6 right-0 w-40 h-40 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#135A5A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img src={vendorUser?.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"} alt="Doctor" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md object-cover" />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-white text-[10px]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#135A5A] bg-[#135A5A]/10 px-2 py-0.5 rounded-full">
                  Verified Specialist
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                Welcome back, {vendorUser?.name || 'Dr. Archana'}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
                You have <span className="text-[#135A5A] font-black">{todaysAppointmentsCount}</span> appointments today. <span className="text-amber-600 font-bold">{pendingCount}</span> consultations pending.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 font-black text-xs rounded-full shadow-sm border border-slate-200 transition-all cursor-pointer flex items-center gap-2">
              <FiCalendar /> View Calendar
            </button>
            <button className="px-5 py-2.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white font-black text-xs rounded-full shadow-sm border-0 transition-all cursor-pointer flex items-center gap-2">
              <FiPlus /> New Prescription
            </button>
          </div>
        </div>
      </motion.section>

      {/* 2. Statistics Section (KPI Deck) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Today's Appointments", value: todaysAppointmentsCount, icon: <FiCalendar />, color: "text-teal-600", bg: "bg-teal-50", trend: "+12%" },
          { title: "Completed Appointments", value: completedAppointmentsCount, icon: <FiCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%" },
          { title: "Total Patients", value: totalPatientsCount.toLocaleString(), icon: <FiUsers />, color: "text-blue-600", bg: "bg-blue-50", trend: "+8%" },
          { title: "Monthly Earnings", value: `$${monthlyEarnings.toLocaleString()}`, icon: <FiDollarSign />, color: "text-amber-600", bg: "bg-amber-50", trend: "+15%" }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -2 }}
            className="bg-white rounded-[22px] p-5 border border-slate-100 shadow-premium flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center text-xl`}>
                {kpi.icon}
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {kpi.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Online Consultation Widget */}
          <section className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100 shadow-premium">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FiVideo className="text-[#135A5A]" /> Live Consultations
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-coral bg-coral-light/20 px-3 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-coral rounded-full"></span> LIVE
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Video Call Card */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Sarah Jenkins</h4>
                      <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <FiClock className="text-amber-500" /> Waiting: 4 mins
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="flex-1 py-2 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black shadow-sm transition-colors border-0 cursor-pointer flex items-center justify-center gap-2">
                    <FiVideo /> Join Video Call
                  </button>
                </div>
              </div>

              {/* Chat Card */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/150?u=mark" alt="Mark" className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Mark Thompson</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Follow-up Chat Request</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-black shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FiMessageSquare className="text-blue-500" /> Open Chat
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Appointments Widget */}
          <section className="bg-white rounded-[22px] border border-slate-100 shadow-premium overflow-hidden flex flex-col flex-1">
            <div className="p-5 sm:p-6 flex justify-between items-center border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FiActivity className="text-[#135A5A]" /> Today's Schedule
              </h2>
              <button className="text-[10px] font-black text-[#135A5A] uppercase tracking-wider bg-transparent border-0 cursor-pointer hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto w-full p-2 sm:p-4">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-50">
                  {finalAppointments.slice(0, 6).map((apt, index) => (
                    <tr key={apt.id || index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patientName || 'Patient')}&background=random`} alt={apt.patientName} className="w-8 h-8 rounded-full border border-slate-200" />
                          <span className="font-bold text-slate-800">{apt.patientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${apt.type === 'Video' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-[#135A5A] bg-[#135A5A]/10 border border-[#135A5A]/20'}`}>
                          {apt.type === 'Video' ? '🎥 Video' : '🏥 Clinic'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-600">{apt.timeSlot || apt.date || '10:30 AM'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                          apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                          apt.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {apt.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#135A5A] hover:bg-teal-50 transition-colors border-0 bg-transparent cursor-pointer" title="View Details">
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* Prescription Widget */}
          <section className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100 shadow-premium flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FiFileText className="text-purple-500" /> Prescription Center
            </h2>
            <button className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all border-0 cursor-pointer">
              <FiPlus className="text-lg" /> Create New Prescription
            </button>
            <div className="mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Prescriptions</p>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Atorvastatin 20mg', patient: 'Henry G.', time: '2h ago' },
                  { name: 'Lisinopril 10mg', patient: 'Maria S.', time: '5h ago' }
                ].map((px, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-purple-500 transition-colors">
                        <FiPaperclip className="text-xs" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{px.name}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold">{px.patient} • {px.time}</p>
                      </div>
                    </div>
                    <FiChevronRight className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analytics Widget */}
          <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[22px] p-5 sm:p-6 shadow-premium text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl" />
            <div className="relative z-10 flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold flex items-center gap-2 text-white">
                <FiTrendingUp className="text-teal-400" /> Analytics
              </h2>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 bg-white/10 px-2 py-1 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                Weekly <FiChevronDown />
              </div>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Revenue</p>
                <p className="text-lg font-black">${(monthlyEarnings * 0.3).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Growth</p>
                <p className="text-lg font-black text-emerald-400">+12.4%</p>
              </div>
            </div>

            {/* Faux mini chart */}
            <div className="relative h-12 w-full mt-2 flex items-end justify-between z-10">
              {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                <div key={i} className="w-1/12 bg-teal-400/30 rounded-t-sm hover:bg-teal-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </section>

          {/* Notifications Widget */}
          <section className="bg-white rounded-[22px] p-5 sm:p-6 border border-slate-100 shadow-premium">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mb-4">
              <FiBell className="text-amber-500" /> Notifications
              <span className="w-2 h-2 bg-coral rounded-full animate-pulse ml-1"></span>
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { title: 'New Booking', desc: 'Emily Cooper booked a Video Consult.', time: '10m ago', icon: <FiVideo />, color: 'bg-blue-50 text-blue-500' },
                { title: 'System Alert', desc: 'Your profile was viewed 45 times today.', time: '1h ago', icon: <FiActivity />, color: 'bg-emerald-50 text-emerald-500' },
                { title: 'Message', desc: 'David Miller sent a message.', time: '2h ago', icon: <FiMessageSquare />, color: 'bg-amber-50 text-amber-500' }
              ].map((notif, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                    {notif.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{notif.desc}</p>
                    <p className="text-[9px] font-black text-slate-400 mt-1 uppercase">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black transition-colors border-0 cursor-pointer">
              View All Notifications
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
