import { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FiSearch, FiFileText, FiFolder } from 'react-icons/fi';

export default function DoctorVendorPatients() {
  const { tab } = useParams();
  const activeTab = tab || 'list';
  const [search, setSearch] = useState("");

  const [patients, setPatients] = useState([
    { id: 1, name: 'Meera Deshmukh', age: 34, gender: 'Female', phone: '9876543212', lastVisit: '2026-06-04', diagnoses: 'Chronic lower back pain, spinal stiffness' },
    { id: 2, name: 'Ramesh Kumar', age: 45, gender: 'Male', phone: '9876543201', lastVisit: '2026-06-04', diagnoses: 'Essential hypertension checkup' },
    { id: 3, name: 'Anoop Singh', age: 29, gender: 'Male', phone: '9876543202', lastVisit: '2026-06-03', diagnoses: 'Post-op clinical recovery follow-up' },
    { id: 4, name: 'Sunita Sharma', age: 52, gender: 'Female', phone: '9876543203', lastVisit: '2026-06-03', diagnoses: 'Diabetes type-2 review' },
    { id: 5, name: 'Vijay Chawla', age: 60, gender: 'Male', phone: '9876543204', lastVisit: '2026-06-02', diagnoses: 'Mild seasonal bronchitis bronchial support' },
  ]);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnoses.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Patient Directory</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Access records, consultation notes, and health timelines of your patients.
          </p>
        </div>
      </div>

      <div className="flex bg-slate-50 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar border border-slate-100">
        {[
          { id: 'list', label: 'Patient List' },
          { id: 'records', label: 'Medical Records' },
          { id: 'prescriptions', label: 'Prescriptions' }
        ].map(t => (
          <NavLink
            key={t.id}
            to={`/vendor/doctor/patients/${t.id}`}
            className={({ isActive }) => `flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer text-center ${
              isActive || (activeTab === t.id) ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
            }`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-150 rounded-2xl mb-5 max-w-sm">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search patient name or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>

        {/* Patients grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-light/25 text-teal flex items-center justify-center font-black">
                    {p.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-none">{p.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      {p.gender}, {p.age} years • +91 {p.phone}
                    </span>
                  </div>
                </div>
                <span className="text-[8px] bg-slate-100 text-slate-500 font-black uppercase px-2 py-0.5 rounded-full border border-slate-200">
                  Last visit: {p.lastVisit}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex flex-col gap-1 text-xs">
                <span className="text-[9px] text-teal font-black uppercase tracking-wider flex items-center gap-1">
                  <FiFileText className="text-2xs" /> Diagnosis & Clinical Notes
                </span>
                <p className="text-slate-650 font-semibold leading-relaxed mt-0.5">{p.diagnoses}</p>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={() => alert(`Opening full digital health locker folders for ${p.name}`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-150 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all tap-scale text-slate-600"
                >
                  <FiFolder className="text-xs text-teal" /> Medical Locker
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-450 font-bold uppercase text-[11px] col-span-2">
              No patients matched the query.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
