import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiVideo, FiMapPin, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';

export default function DoctorVendorAppointments() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'all';

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Dummy Data
    setTimeout(() => {
      setAppointments([
        { id: 'APT-001', patientName: 'Rahul Sharma', age: 32, type: 'Video', time: '10:00 AM', date: '2026-06-28', status: 'upcoming', concern: 'Fever and cold for 3 days' },
        { id: 'APT-002', patientName: 'Priya Verma', age: 28, type: 'In-Clinic', time: '11:30 AM', date: '2026-06-28', status: 'upcoming', concern: 'Routine checkup' },
        { id: 'APT-003', patientName: 'Amit Singh', age: 45, type: 'Video', time: '02:00 PM', date: '2026-06-27', status: 'completed', concern: 'Follow-up on blood reports' },
        { id: 'APT-004', patientName: 'Meera Deshmukh', age: 34, type: 'In-Clinic', time: '04:15 PM', date: '2026-06-27', status: 'cancelled', concern: 'Back pain' },
        { id: 'APT-005', patientName: 'Sanjay Dutt', age: 50, type: 'In-Clinic', time: '10:30 AM', date: '2026-06-27', previousDate: '2026-06-25', previousTime: '04:00 PM', status: 'rescheduled', concern: 'Knee joint pain' }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(search.toLowerCase()) || apt.id.toLowerCase().includes(search.toLowerCase());
    let matchesTab = true;
    if (activeTab === 'online') {
      matchesTab = apt.type === 'Video';
    } else if (activeTab === 'offline') {
      matchesTab = apt.type === 'In-Clinic';
    } else if (activeTab !== 'all') {
      matchesTab = apt.status === activeTab;
    }
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { label: 'All', id: 'all' },
    { label: 'Upcoming', id: 'upcoming' },
    { label: 'Online', id: 'online' },
    { label: 'Offline', id: 'offline' },
    { label: 'Completed', id: 'completed' },
    { label: 'Cancelled', id: 'cancelled' },
    { label: 'Rescheduled', id: 'rescheduled' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Appointments</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage your daily schedule and patient bookings.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col gap-5">
        
        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-slate-50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-100">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/vendor/doctor/appointments/${t.id}`)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer ${
                  activeTab === t.id ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-64">
            <FiSearch className="text-slate-400 text-sm shrink-0" />
            <input 
              type="text" 
              placeholder="Search ID or Patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <FiCalendar className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-sm">No {activeTab} appointments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((apt) => (
              <div key={apt.id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col gap-4 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'upcoming' ? 'bg-teal' : activeTab === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                
                <div className="flex justify-between items-start pl-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-teal flex items-center justify-center font-black text-lg shrink-0">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{apt.patientName} <span className="text-[10px] text-slate-400 font-bold ml-1">({apt.age} yrs)</span></h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                        <FiClock className="text-teal" /> {apt.date} • {apt.time}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 ${apt.type === 'Video' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    {apt.type === 'Video' ? <FiVideo /> : <FiMapPin />} {apt.type}
                  </span>
                </div>

                <div className="pl-2 border-t border-slate-50 pt-3">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Chief Concern</span>
                  <p className="text-xs font-semibold text-slate-700">"{apt.concern}"</p>
                </div>
                
                {apt.status === 'rescheduled' && (
                  <div className="pl-2 border-t border-slate-50 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Previous Slot</span>
                      <span className="text-[10px] font-black text-slate-500 line-through">{apt.previousDate} • {apt.previousTime}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-2 rounded-xl border border-amber-100">
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Current Slot</span>
                      <span className="text-[10px] font-black text-amber-700">{apt.date} • {apt.time}</span>
                    </div>
                  </div>
                )}

                {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                  <div className="flex flex-col gap-2 mt-2 pl-2">
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm">
                        View Details
                      </button>
                      {apt.type === 'Video' && (
                        <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border-0 shadow-sm flex justify-center items-center gap-1.5">
                          <FiVideo className="text-xs" /> Start Call
                        </button>
                      )}
                      <button className="flex-1 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border-0 shadow-sm flex justify-center items-center gap-1.5">
                        <FiCheckCircle className="text-xs" /> Mark Completed
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer">
                        Reschedule
                      </button>
                      <button className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {apt.status === 'completed' && (
                  <div className="flex justify-end mt-2 pl-2">
                    <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer">
                      View Prescription
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
