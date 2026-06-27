import { useState } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiSearch, FiVideo, FiFilter } from 'react-icons/fi';

export default function DoctorVendorSchedule() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [schedules, setSchedules] = useState([
    { id: 1, patientName: 'Meera Deshmukh', age: 34, gender: 'Female', slot: '10:30 AM - 11:00 AM', date: '2026-06-04', type: 'Video Consult', status: 'pending' },
    { id: 2, patientName: 'Ramesh Kumar', age: 45, gender: 'Male', slot: '11:15 AM - 11:45 AM', date: '2026-06-04', type: 'Physical Clinic Visit', status: 'pending' },
    { id: 3, patientName: 'Anoop Singh', age: 29, gender: 'Male', slot: '04:00 PM - 04:30 PM', date: '2026-06-03', type: 'Video Consult', status: 'completed' },
    { id: 4, patientName: 'Sunita Sharma', age: 52, gender: 'Female', slot: '05:00 PM - 05:30 PM', date: '2026-06-03', type: 'Video Consult', status: 'completed' },
    { id: 5, patientName: 'Vijay Chawla', age: 60, gender: 'Male', slot: '09:00 AM - 09:30 AM', date: '2026-06-02', type: 'Physical Clinic Visit', status: 'completed' },
  ]);

  const handleComplete = (id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' } : s));
  };

  const filtered = schedules.filter(s => {
    const matchesSearch = s.patientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ? true : s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Consultations Schedule</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review patient appointments, video consult slots, and prescription records.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-2xl max-w-sm flex-1">
            <FiSearch className="text-slate-400 text-sm shrink-0" />
            <input 
              type="text" 
              placeholder="Search patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl shrink-0">
            <FiFilter className="text-slate-400 text-[10px]" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Awaiting Consultation</option>
              <option value="completed">Completed Sessions</option>
            </select>
          </div>
        </div>

        {/* Schedule grid cards */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="p-4 border border-slate-100 hover:border-slate-200 rounded-2xl bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
              
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0
                  ${s.type.includes('Video') ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-650'}`}
                >
                  {s.type.includes('Video') ? <FiVideo /> : <FiCalendar />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-none">{s.patientName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
                    {s.gender}, {s.age} Years • {s.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 text-left sm:text-right">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <FiClock className="text-teal" /> {s.date} | {s.slot}
                </span>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                {s.status === 'pending' ? (
                  <button
                    onClick={() => handleComplete(s.id)}
                    className="bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border-0 tap-scale shadow-sm"
                  >
                    Start Session
                  </button>
                ) : (
                  <span className="text-emerald-600 font-black uppercase text-[10px] flex items-center gap-1 select-none pr-2">
                    <FiCheckCircle /> Session Met
                  </span>
                )}
              </div>

            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-450 font-bold uppercase text-[11px]">
              No consultation slots registered matching criteria.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
