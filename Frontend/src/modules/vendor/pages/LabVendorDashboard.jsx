import React, { useState } from 'react';
import StatsCard from '../../admin/components/StatsCard';
import { 
  FiActivity, FiFileText, FiDollarSign, FiCheckCircle, 
  FiClock, FiTrendingUp, FiFilter, FiUser 
} from 'react-icons/fi';

export default function LabVendorDashboard() {
  const [weeklyHoverIndex, setWeeklyHoverIndex] = useState(null);
  
  // Status filter state: all, pending, completed
  const [statusFilter, setStatusFilter] = useState("all");

  const [bookings, setBookings] = useState([
    { id: 'LB-BK-7701', patientName: 'Anoop Singh', testName: 'Complete Blood Count (CBC)', date: '2026-06-04', status: 'pending', sampleType: 'Blood', amount: 350 },
    { id: 'LB-BK-7692', patientName: 'Ramesh Kumar', testName: 'Lipid Profile Screen', date: '2026-06-03', status: 'completed', sampleType: 'Serum', amount: 800 },
    { id: 'LB-BK-7685', patientName: 'Meera Deshmukh', testName: 'Thyroid Stimulating Hormone (TSH)', date: '2026-06-03', status: 'completed', sampleType: 'Blood', amount: 450 },
    { id: 'LB-BK-7674', patientName: 'Sunita Sharma', testName: 'HbA1c Diabetes Control Panel', date: '2026-06-02', status: 'pending', sampleType: 'Blood', amount: 600 },
    { id: 'LB-BK-7661', patientName: 'Vijay Chawla', testName: 'Urinalysis Basic Screening', date: '2026-06-01', status: 'completed', sampleType: 'Urine', amount: 250 },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  const dailyCollectionsData = [
    { day: 'Mon', samples: 14 },
    { day: 'Tue', samples: 22 },
    { day: 'Wed', samples: 18 },
    { day: 'Thu', samples: 27 },
    { day: 'Fri', samples: 32 },
    { day: 'Sat', samples: 25 },
    { day: 'Sun', samples: 12 }
  ];

  // SVG Bar Chart render helper
  const renderCollectionsChart = () => {
    const data = dailyCollectionsData;
    const width = 500;
    const height = 180;
    const padding = 20;

    const maxVal = Math.max(...data.map(d => d.samples)) || 40;
    const barWidth = 32;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    return (
      <div className="w-full bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Daily Sample Collections</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Clinical sample tubes received overview</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`transition-opacity duration-200 ${weeklyHoverIndex !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-[9px] bg-slate-800 text-white font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-sm">
                {weeklyHoverIndex !== null ? `${data[weeklyHoverIndex].day}: ${data[weeklyHoverIndex].samples} tubes` : ''}
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
              const barHeight = (d.samples / maxVal) * chartHeight;
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
                    {d.samples}
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
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Lab Performance Dashboard</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor clinical diagnostic bookings, sample collections, and lab revenue.
          </p>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl shadow-sm select-none">
          <span className="w-2 h-2 rounded-full bg-teal animate-ping" />
          <span>Realtime Lab Status</span>
        </div>
      </div>

      {/* KPI Deck */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard 
          title="Total Bookings" 
          value="184" 
          change="+12.4%" 
          isPositive={true} 
          icon={FiActivity} 
          color="teal" 
          sparklineData={[12, 14, 15, 18, 16, 22, 24]}
        />
        <StatsCard 
          title="Pending Samples" 
          value={`${bookings.filter(b => b.status === 'pending').length}`} 
          change="-2" 
          isPositive={true} 
          icon={FiClock} 
          color="coral" 
          sparklineData={[8, 7, 5, 4, 3, 3, 2]}
        />
        <StatsCard 
          title="Revenue Generated" 
          value="₹74,500" 
          change="+18.5%" 
          isPositive={true} 
          icon={FiDollarSign} 
          color="forest" 
          sparklineData={[5000, 6200, 7100, 6800, 8400, 9100, 9900]}
        />
        <StatsCard 
          title="Completed Tests" 
          value="172" 
          change="+8.3%" 
          isPositive={true} 
          icon={FiCheckCircle} 
          color="gold" 
          sparklineData={[10, 12, 13, 14, 15, 16, 17]}
        />
      </section>

      {/* Charts & Listings */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Daily chart collections */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {renderCollectionsChart()}

          {/* Recent test bookings table */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3.5 mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recent Test Bookings</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Clinical diagnostics status tracking</p>
              </div>

              {/* Status Filter select */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shrink-0">
                <FiFilter className="text-slate-400 text-[10px]" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending Samples</option>
                  <option value="completed">Completed Tests</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Diagnostic Test</th>
                    <th className="py-3 px-4">Sample</th>
                    <th className="py-3 px-4">Fees</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-650">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-800">{b.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{b.patientName}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{b.testName}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                          {b.sampleType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-850">₹{b.amount}</td>
                      <td className="py-3.5 px-4 text-right">
                        {b.status === 'pending' ? (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'completed')}
                            className="bg-teal hover:bg-teal-dark text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer border-0 tap-scale shadow-sm"
                          >
                            Mark Collected
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
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Accreditation Info</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Certificates & licensing keys</p>
              </div>
              <FiActivity className="text-teal" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 border border-teal/10 bg-teal-light/10 rounded-2xl flex flex-col gap-2">
                <span className="text-[8px] font-black text-teal uppercase tracking-widest block">NABL Verification Code</span>
                <span className="text-sm font-black text-slate-800 tracking-wider">NABL-MC-5412-A</span>
                <span className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                  National Accreditation Board for Testing and Calibration Laboratories certification valid until Dec 2027.
                </span>
              </div>
              
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col gap-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ISO Certification</span>
                <span className="text-xs font-black text-slate-700">ISO 15189:2012</span>
                <span className="text-[9px] text-slate-450 font-semibold leading-relaxed">
                  Medical laboratories — Requirements for quality and competence global standard guidelines check met.
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 mt-5 flex justify-center">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center">
              Clinical Quality Certified Terminals
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}
