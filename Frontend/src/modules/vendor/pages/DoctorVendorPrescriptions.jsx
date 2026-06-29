import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FiPlus, FiFileText, FiSearch, FiPrinter, FiDownload, FiTrash2 } from 'react-icons/fi';

export default function DoctorVendorPrescriptions() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'create';

  const [patients] = useState(['Rahul Sharma', 'Priya Verma', 'Amit Singh', 'Meera Deshmukh']);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', duration: '', instructions: '' });
  const [notes, setNotes] = useState('');

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (newMed.name && newMed.dosage) {
      setMedicines([...medicines, { ...newMed, id: Date.now() }]);
      setNewMed({ name: '', dosage: '', duration: '', instructions: '' });
    }
  };

  const removeMedicine = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'history') {
      setTimeout(() => {
        setHistory([
          { id: 'RX-1042', patient: 'Anoop Singh', date: '2026-06-25', status: 'Sent', meds: 3 },
          { id: 'RX-1041', patient: 'Sunita Sharma', date: '2026-06-24', status: 'Sent', meds: 5 }
        ]);
        setLoading(false);
      }, 500);
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Prescription Center</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Issue digital prescriptions and manage clinical notes.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col gap-6">
        
        {/* Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar border border-slate-100">
          {[
            { id: 'create', label: 'Create' },
            { id: 'history', label: 'History' }
          ].map(t => (
            <NavLink
              key={t.id}
              to={`/vendor/doctor/prescriptions/${t.id}`}
              className={({ isActive }) => `flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer text-center ${
                isActive || (activeTab === t.id) ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
              }`}
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        {activeTab === 'create' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Patient Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Patient</label>
              <select 
                value={selectedPatient} 
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full md:w-1/2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-teal"
              >
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Add Medicine Form */}
            <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <input type="text" placeholder="Medicine Name" required value={newMed.name} onChange={e=>setNewMed({...newMed, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-teal" />
              </div>
              <div>
                <input type="text" placeholder="Dosage (e.g. 1-0-1)" required value={newMed.dosage} onChange={e=>setNewMed({...newMed, dosage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-teal" />
              </div>
              <div>
                <input type="text" placeholder="Duration (e.g. 5 days)" required value={newMed.duration} onChange={e=>setNewMed({...newMed, duration: e.target.value})} className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold outline-none focus:border-teal" />
              </div>
              <div>
                <button type="submit" className="w-full bg-slate-800 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border-0 transition-colors">
                  <FiPlus /> Add
                </button>
              </div>
            </form>

            {/* Medicine List */}
            {medicines.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="p-3">Medicine</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((m, i) => (
                      <tr key={m.id} className="border-b border-slate-100 last:border-0 text-xs font-semibold text-slate-700">
                        <td className="p-3">{i+1}. {m.name}</td>
                        <td className="p-3">{m.dosage}</td>
                        <td className="p-3">{m.duration}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => removeMedicine(m.id)} className="text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer p-1">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Clinical Notes / Advice</label>
              <textarea 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. Drink plenty of water, avoid cold food..."
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-50 cursor-pointer">
                Clear Form
              </button>
              <button className="px-8 py-3 bg-teal hover:bg-teal-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 cursor-pointer border-0">
                <FiFileText /> Generate & Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map(rx => (
                  <div key={rx.id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{rx.patient}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{rx.id} • {rx.date}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-black uppercase tracking-wider px-2 py-1 rounded-md">
                        {rx.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Prescribed {rx.meds} medicines
                    </div>
                    <div className="flex gap-2 mt-2 pt-3 border-t border-slate-200">
                      <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 hover:text-teal hover:border-teal rounded-lg text-[10px] font-black uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors cursor-pointer">
                        <FiPrinter /> Print
                      </button>
                      <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 hover:text-teal hover:border-teal rounded-lg text-[10px] font-black uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors cursor-pointer">
                        <FiDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
