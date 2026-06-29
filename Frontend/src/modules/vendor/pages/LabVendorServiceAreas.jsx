import { useState, useEffect } from 'react';
import { FiMapPin, FiPlusCircle, FiTrash2, FiMap, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function LabVendorServiceAreas() {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newArea, setNewArea] = useState({ city: '', pincode: '', radius: '5', isActive: true });

  useEffect(() => {
    // Dummy areas data
    setTimeout(() => {
      setAreas([
        { id: 'AREA-1', city: 'Bangalore', pincode: '560038', radius: 10, isActive: true, agents: 4 },
        { id: 'AREA-2', city: 'Bangalore', pincode: '560001', radius: 5, isActive: true, agents: 2 },
        { id: 'AREA-3', city: 'Mysore', pincode: '570001', radius: 15, isActive: false, agents: 0 }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddArea = (e) => {
    e.preventDefault();
    const area = {
      id: `AREA-${areas.length + 1}`,
      city: newArea.city,
      pincode: newArea.pincode,
      radius: Number(newArea.radius),
      isActive: true,
      agents: 0
    };
    setAreas([...areas, area]);
    setShowAdd(false);
    setNewArea({ city: '', pincode: '', radius: '5', isActive: true });
  };

  const toggleStatus = (id) => {
    setAreas(areas.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteArea = (id) => {
    setAreas(areas.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Service Areas</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Manage your active home collection zones and operating radius.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale shrink-0"
        >
          <FiPlusCircle className="text-sm" /> Add Service Area
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddArea} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-premium flex flex-col gap-4 animate-slideUp">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Configure New Zone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">City / District</label>
              <input 
                type="text" 
                value={newArea.city}
                onChange={(e) => setNewArea({...newArea, city: e.target.value})}
                required
                placeholder="e.g. Bangalore"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Pincode (Base)</label>
              <input 
                type="text" 
                value={newArea.pincode}
                onChange={(e) => setNewArea({...newArea, pincode: e.target.value})}
                required
                placeholder="e.g. 560038"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-455 tracking-wide">Operating Radius (km)</label>
              <select
                value={newArea.radius}
                onChange={(e) => setNewArea({...newArea, radius: e.target.value})}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal w-full cursor-pointer"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="15">15 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km (City Wide)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider bg-transparent cursor-pointer border-0">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-sm">Save Area</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area.id} className={`bg-white border rounded-3xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${!area.isActive ? 'border-rose-100 bg-rose-50/20 opacity-80' : 'border-slate-100 hover:shadow-md'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border ${area.isActive ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  <FiMapPin />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">{area.city}</h3>
                  <span className="text-xs text-slate-400 font-bold tracking-wide">Pincode: {area.pincode}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-1 pt-4 border-t border-slate-50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Status:</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${area.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                  {area.isActive ? 'Active Zone' : 'Suspended'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Agents Assigned:</span>
                <span className="text-slate-700 font-bold">{area.agents} Agents</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-50/50 px-3.5 py-2.5 rounded-xl mt-1 border border-indigo-100/50">
                <span className="flex items-center gap-1.5 text-indigo-700 font-extrabold uppercase text-xs tracking-wider"><FiMap /> Coverage Radius:</span>
                <span className="text-indigo-700 font-black text-lg leading-none">{area.radius} km</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 mt-auto">
              <button 
                onClick={() => toggleStatus(area.id)}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 tap-scale ${
                  area.isActive ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-100' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'
                }`}
              >
                {area.isActive ? <><FiXCircle className="text-sm" /> Suspend</> : <><FiCheckCircle className="text-sm" /> Activate</>}
              </button>
              <button onClick={() => deleteArea(area.id)} className="flex-none w-10 h-10 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer border border-slate-200 hover:border-rose-200 flex items-center justify-center tap-scale" title="Delete Zone">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
