import React, { useState } from 'react';
import StatsCard from '../../admin/components/StatsCard';
import { 
  FiCalendar, FiUser, FiDollarSign, FiUsers, 
  FiCheckCircle, FiClock, FiActivity, FiFilter 
} from 'react-icons/fi';

export default function DoctorVendorDashboard() {
  const [weeklyHoverIndex, setWeeklyHoverIndex] = useState(null);
  
  // Status filter: all, pending, completed
  const [statusFilter, setStatusFilter] = useState("all");

  const [appointments, setAppointments] = useState([
    { id: 'DR-AP-9901', patientName: 'Meera Deshmukh', type: 'Video Consult', slot: '10:30 AM - 11:00 AM', date: '2026-06-04', status: 'pending', age: 34, gender: 'Female' },
    { id: 'DR-AP-9892', patientName: 'Ramesh Kumar', type: 'Physical Clinic Visit', slot: '11:15 AM - 11:45 AM', date: '2026-06-04', status: 'pending', age: 45, gender: 'Male' },
    { id: 'DR-AP-9885', patientName: 'Anoop Singh', type: 'Video Consult', slot: '04:00 PM - 04:30 PM', date: '2026-06-03', status: 'completed', age: 29, gender: 'Male' },
    { id: 'DR-AP-9874', patientName: 'Sunita Sharma', type: 'Video Consult', slot: '05:00 PM - 05:30 PM', date: '2026-06-03', status: 'completed', age: 52, gender: 'Female' },
    { id: 'DR-AP-9861', patientName: 'Vijay Chawla', type: 'Physical Clinic Visit', slot: '09:00 AM - 09:30 AM', date: '2026-06-02', status: 'completed', age: 60, gender: 'Male' },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === "all") return true;
    return a.status === statusFilter;
  });

  const dailyBookingsData = [
    { day: 'Mon', count: 8 },
    { day: 'Tue', count: 12 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 10 },
    { day: 'Fri', count: 18 },
    { day: 'Sat', count: 20 },
    { day: 'Sun', count: 6 }
  ];

  // SVG Bar Chart render helper
  const renderBookingsChart = () => {
    const data = dailyBookingsData;
    const width = 500;
    const height = 180;
    const padding = 20;

    const maxVal = Math.max(...data.map(d => d.count)) || 25;
    const barWidth = 32;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    return (
      <div className="w-full bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Daily Appointment Gages</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Consultation appointments booked overview</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`transition-opacity duration-200 ${weeklyHoverIndex !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-[9px] bg-slate-800 text-white font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-sm">
                {weeklyHoverIndex !== null ? `${data[weeklyHoverIndex].day}: ${data[weeklyHoverIndex].count} slots` : ''}
              </span>
            </div>
            <span className="text-[10px] bg-teal-light text-teal font-black uppercase px-2 py-0.5 rounded-full">Target Met</span>
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
            {/* Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding + ratio * chartHeight;
              return (
                <line 
                  key={idx} 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="#F8FAFC" 
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Drawing Bars */}
            {data.map((d, i) => {
              const x = padding + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth) / 2;
              const barHeight = (d.count / maxVal) * chartHeight;
              const y = height - padding - barHeight;
              const isHovered = weeklyHoverIndex === i;

              return (
                <g 
                  key={i} 
                  className="group cursor-pointer"
                  onMouseEnter={() => setWeeklyHoverIndex(i)}
                  onMouseLeave={() => setWeeklyHoverIndex(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isHovered ? "var(--color-teal-dark)" : "var(--color-teal)"}
                    rx="8"
                    className="transition-colors duration-200"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fill="var(--color-teal)"
                    className={`text-[8px] font-black uppercase tracking-wider transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {d.count}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between px-6 mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          {data.map((d, i) => <span key={i}>{d.day}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Doctor Practitioner Console</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor clinical sessions, patient records, and consultation billings.
          </p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl shadow-sm select-none">
          <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
          <span>Clinical Terminal Live</span>
        </div>
      </div>

      {/* KPI Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Consultations" 
          value="312" 
          change="+18%" 
          isPositive={true} 
          icon={FiCalendar} 
          color="teal" 
          sparklineData={[15, 18, 22, 25, 20, 28, 30]}
        />
        <StatsCard 
          title="Pending Reviews" 
          value={`${appointments.filter(a => a.status === 'pending').length}`} 
          change="-1" 
          isPositive={true} 
          icon={FiClock} 
          color="coral" 
          sparklineData={[5, 4, 3, 3, 2, 2, 2]}
        />
        <StatsCard 
          title="Earnings" 
          value="₹1,24,000" 
          change="+24.5%" 
          isPositive={true} 
          icon={FiDollarSign} 
          color="forest" 
          sparklineData={[12000, 15000, 16000, 18000, 20000, 21000, 22000]}
        />
        <StatsCard 
          title="Total Patients" 
          value="198" 
          change="+8.3%" 
          isPositive={true} 
          icon={FiUsers} 
          color="gold" 
          sparklineData={[8, 12, 14, 15, 15, 16, 17]}
        />
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* SVG chart and appointment bookings list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {renderBookingsChart()}

          {/* Appointments table */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3.5 mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Appointments Schedule</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Clinical diagnostics status tracking</p>
              </div>

              {/* Status filter dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shrink-0">
                <FiFilter className="text-slate-400 text-[10px]" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
                >
                  <option value="all">All Appointments</option>
                  <option value="pending">Awaiting Consultation</option>
                  <option value="completed">Completed Consults</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                    <th className="py-3 px-4">Appt ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Gender/Age</th>
                    <th className="py-3 px-4">Consultation Mode</th>
                    <th className="py-3 px-4">Time Slot</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-650">
                  {filteredAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-800">{a.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{a.patientName}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{a.gender}, {a.age}y</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider
                          ${a.type.includes('Video') 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                            : 'bg-indigo-50 text-indigo-650 border border-indigo-100/50'
                          }`}
                        >
                          {a.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-500">{a.slot}</td>
                      <td className="py-3.5 px-4 text-right">
                        {a.status === 'pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(a.id, 'completed')}
                            className="bg-teal hover:bg-teal-dark text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer border-0 tap-scale shadow-sm"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-black uppercase text-[9px] flex items-center justify-end gap-1 select-none">
                            <FiCheckCircle /> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Right side widgets */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-5">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Medical Licensing</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Certificates & clinic credentials</p>
              </div>
              <FiActivity className="text-teal" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 border border-teal/10 bg-teal-light/10 rounded-2xl flex flex-col gap-2">
                <span className="text-[8px] font-black text-teal uppercase tracking-widest block">Medical Council Reg Number</span>
                <span className="text-sm font-black text-slate-800 tracking-wider">MCI-20831/A</span>
                <span className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                  Medical Council of India practitioner license code is fully verified and active.
                </span>
              </div>
              
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col gap-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Clinic Location</span>
                <span className="text-xs font-black text-slate-700">Metro Wellness Clinic</span>
                <span className="text-[9px] text-slate-450 font-semibold leading-relaxed">
                  Bandra Main Clinic center. Linked to telemedicine video consult pipelines.
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 mt-5 flex justify-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center">
              MCI Verified Practitioner Terminals
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}
