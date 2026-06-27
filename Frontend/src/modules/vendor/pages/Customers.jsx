import { useState, useEffect } from 'react';
import { 
  FiSearch, FiClock, FiFileText, FiPhone 
} from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';

export default function Customers() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/labs/vendor/bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Deduplicate bookings into unique patients based on name and phone
  const patientMap = new Map();
  bookings.forEach(b => {
    if (b.patientName && b.patientPhone) {
      const key = `${b.patientName.trim().toLowerCase()}-${b.patientPhone.trim()}`;
      if (!patientMap.has(key)) {
        patientMap.set(key, {
          name: b.patientName,
          age: b.patientAge,
          gender: b.patientGender,
          phone: b.patientPhone,
          bookings: []
        });
      }
      patientMap.get(key).bookings.push(b);
    }
  });

  const patientsList = Array.from(patientMap.values());

  const filteredPatients = patientsList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Patient Directory</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review patient checkup files, clinical histories, and uploaded reports.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm max-w-xs w-full shrink-0">
          <FiSearch className="text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search patient name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-premium">
          <span className="text-4xl">👥</span>
          <h3 className="font-extrabold text-slate-700 text-sm mt-3">No Patients Found</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">There are no patient files matching this query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patients List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {filteredPatients.map(p => (
              <div 
                key={p.phone}
                onClick={() => setSelectedPatient(p)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between bg-white shadow-premium ${selectedPatient?.phone === p.phone ? 'border-teal ring-1 ring-teal' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal/10 text-teal flex items-center justify-center text-lg font-black shrink-0">
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-snug">{p.name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">{p.age || 'N/A'} yrs • {p.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Total Bookings</span>
                    <span className="text-xs font-black text-slate-700">{p.bookings.length} Checkups</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Patient Detail Profile Sidebar */}
          {selectedPatient ? (
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium flex flex-col gap-5 self-start">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center text-xl font-black shrink-0">
                  {selectedPatient.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-tight">{selectedPatient.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-1">{selectedPatient.age || 'N/A'} yrs • {selectedPatient.gender}</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Mobile Phone:</span>
                  <a href={`tel:${selectedPatient.phone}`} className="text-teal hover:underline font-extrabold flex items-center gap-1 decoration-transparent">
                    <FiPhone /> {selectedPatient.phone}
                  </a>
                </div>
              </div>

              {/* Checkups logs */}
              <div>
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2.5 flex items-center gap-1"><FiClock /> Medical Checkup Log</h4>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto no-scrollbar">
                  {selectedPatient.bookings.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 border border-slate-150/40 rounded-2xl text-[11px] font-bold text-slate-600 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span className="font-black text-slate-800">{b.id}</span>
                        <span className="text-slate-400">{b.date}</span>
                      </div>
                      <div className="text-slate-800 leading-snug">{b.packageName}</div>
                      {b.reportUrl && (
                        <a 
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${b.reportUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-teal hover:underline self-start flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider decoration-transparent"
                        >
                          <FiFileText /> Download Transcript
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-150/40 rounded-[32px] p-6 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
              Select a patient from the directory list to view profile details.
            </div>
          )}

        </div>
      )}

    </div>
  );
}
