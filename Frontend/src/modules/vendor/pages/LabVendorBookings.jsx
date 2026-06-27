import { useState } from 'react';
import { FiCheckCircle, FiMapPin, FiPhone, FiFilter } from 'react-icons/fi';

export default function LabVendorBookings() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([
    { id: 'LB-BK-7701', patientName: 'Anoop Singh', phone: '9876543202', testName: 'Complete Blood Count (CBC)', date: '2026-06-04', slot: '08:00 AM - 10:00 AM', status: 'pending', sampleType: 'Blood', address: 'Flat 5B, Skyline Tower, MG Road, Bangalore, KA - 560001' },
    { id: 'LB-BK-7692', patientName: 'Ramesh Kumar', phone: '9876543201', testName: 'Lipid Profile Screen', date: '2026-06-03', slot: '10:00 AM - 12:00 PM', status: 'completed', sampleType: 'Serum', address: '12, Garden View, Link Road, Bandra West, Mumbai, MH - 400050' },
    { id: 'LB-BK-7685', patientName: 'Meera Deshmukh', phone: '9876543212', testName: 'Thyroid Stimulating Hormone (TSH)', date: '2026-06-03', slot: '09:00 AM - 11:00 AM', status: 'completed', sampleType: 'Blood', address: 'Plot 104, Sector 17, Vashi, Navi Mumbai, MH - 400703' },
    { id: 'LB-BK-7674', patientName: 'Sunita Sharma', phone: '9876543203', testName: 'HbA1c Diabetes Control Panel', date: '2026-06-02', slot: '07:30 AM - 09:30 AM', status: 'pending', sampleType: 'Blood', address: 'Shanti Villa, Lane 4, Koregaon Park, Pune, MH - 411001' },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Home Sample Collections</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Track and dispatch home diagnostic collection schedules and reports.
          </p>
        </div>
        
        {/* Filter dropdown */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <FiFilter className="text-slate-400 text-xs" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-black text-slate-650 uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All Schedules</option>
            <option value="pending">Pending Sample Pick-up</option>
            <option value="completed">Completed Collections</option>
          </select>
        </div>
      </div>

      {/* Bookings cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBookings.map((b) => (
          <div key={b.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium flex flex-col justify-between gap-4">
            
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Booking reference</span>
                <h3 className="text-sm font-black text-slate-800 tracking-tight mt-0.5">{b.id}</h3>
              </div>
              <span className={`text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full border
                ${b.status === 'completed' 
                  ? 'bg-teal-light/20 text-teal border-teal/10' 
                  : 'bg-gold-light/25 text-gold-dark border-gold/15'
                }`}
              >
                {b.status === 'completed' ? 'Collected' : 'Pending sample'}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-150/40 text-xs">
              <div className="flex justify-between items-start font-semibold">
                <span className="text-slate-500">Patient:</span>
                <span className="text-slate-800 font-extrabold">{b.patientName}</span>
              </div>
              <div className="flex justify-between items-start font-semibold">
                <span className="text-slate-500">Test Required:</span>
                <span className="text-slate-800 font-bold text-right max-w-[200px] truncate">{b.testName}</span>
              </div>
              <div className="flex justify-between items-start font-semibold">
                <span className="text-slate-500">Sample Tube:</span>
                <span className="text-slate-800 font-black uppercase text-[10px]">{b.sampleType}</span>
              </div>
              <div className="flex justify-between items-start font-semibold">
                <span className="text-slate-500">Scheduled Slot:</span>
                <span className="text-slate-800 font-extrabold">{b.date} | {b.slot}</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[9px] tracking-wide">
                <FiMapPin className="text-teal" />
                <span>Collection Address</span>
              </div>
              <p className="text-slate-700 font-semibold leading-relaxed pl-5">{b.address}</p>
            </div>

            {/* Contact & Actions */}
            <div className="flex justify-between items-center border-t border-slate-50 pt-3.5 mt-1">
              <a 
                href={`tel:${b.phone}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-slate-150 decoration-transparent"
              >
                <FiPhone className="text-xs" /> Call Patient
              </a>

              {b.status === 'pending' ? (
                <button
                  onClick={() => handleUpdateStatus(b.id, 'completed')}
                  className="bg-teal hover:bg-teal-dark text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm tap-scale flex items-center gap-1.5"
                >
                  <FiCheckCircle className="text-sm" /> Complete Collection
                </button>
              ) : (
                <span className="text-teal font-black uppercase text-[10px] flex items-center gap-1 leading-none select-none">
                  <FiCheckCircle /> Sample In Lab
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
