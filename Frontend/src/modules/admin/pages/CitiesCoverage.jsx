import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import LocationFilter, { CITY_MAPPINGS } from '../components/LocationFilter';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';

const initialCities = [
  { name: 'Mumbai', pharmacies: 12, labs: 8, doctors: 15, orders: 480, status: 'Active', state: 'Maharashtra' },
  { name: 'Pune', pharmacies: 8, labs: 5, doctors: 10, orders: 250, status: 'Active', state: 'Maharashtra' },
  { name: 'Bangalore', pharmacies: 15, labs: 10, doctors: 20, orders: 610, status: 'Active', state: 'Karnataka' },
  { name: 'Delhi', pharmacies: 20, labs: 12, doctors: 25, orders: 840, status: 'Active', state: 'Delhi' },
  { name: 'Hyderabad', pharmacies: 6, labs: 4, doctors: 8, orders: 180, status: 'Inactive', state: 'Telangana' }
];

export default function CitiesCoverage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState(initialCities);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cityName, setCityName] = useState('');
  const [status, setStatus] = useState('Active');
  const [searchParams] = useSearchParams();
  const { isFiltered } = useAdminLocation();

  const stateVal = searchParams.get('state') || '';
  const searchName = searchParams.get('search') || '';

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!cityName) return;
    const info = CITY_MAPPINGS[cityName] || { state: 'Maharashtra' };
    setCities([
      ...cities,
      { name: cityName, pharmacies: 0, labs: 0, doctors: 0, orders: 0, status, state: info.state }
    ]);
    setCityName('');
    setShowAddModal(false);
  };

  const toggleStatus = (name) => {
    setCities(cities.map(c => c.name === name ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const filteredCities = useMemo(() => {
    return cities.filter(c => {
      if (stateVal && c.state !== stateVal) return false;
      return true;
    });
  }, [cities, stateVal]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 pr-1 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <div className="admin-page-title">City Coverage</div>
          <div className="admin-page-subtitle mt-2">
            Manage geographical operational centers, serviceability status, and resource distribution.
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A7A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0 hover:bg-[#1A7A4A]/90 transition-all"
        >
          <FiPlus /> Add New City
        </button>
      </div>

      {/* Location Filter */}
      <LocationFilter />

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
        <div className="admin-section-heading-wrapper">
          <FiMapPin className="text-[#1A7A4A]" />
          <span>Active Operations Directory</span>
        </div>

        {isFiltered && filteredCities.length === 0 ? (
          <div className="mt-4">
            <LocationEmptyState 
              locationName={stateVal}
              hasVendors={false}
              hasOrders={false}
            />
          </div>
        ) : !isFiltered && cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
            <span className="text-3xl mb-3">📍</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Cities Covered Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no operational cities registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar mt-4">
            <table className="w-full text-left border-collapse admin-table">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="py-3 px-4">City Name</th>
                  <th className="py-3 px-4">Pharmacies</th>
                  <th className="py-3 px-4">Labs</th>
                  <th className="py-3 px-4">Doctors</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCities.map((city) => (
                  <tr 
                    key={city.name} 
                    onClick={() => navigate(`/admin/vendors?city=${city.name}`)}
                    className="hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 admin-table-name">{city.name}</td>
                    <td className="py-3 px-4">{city.pharmacies} nodes</td>
                    <td className="py-3 px-4">{city.labs} centers</td>
                    <td className="py-3 px-4">{city.doctors} clinicians</td>
                    <td className="py-3 px-4 font-black">{city.orders} bookings</td>
                    <td className="py-3 px-4">
                      <span className={`admin-badge uppercase tracking-wider text-[9px] font-bold ${
                        city.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {city.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleStatus(city.name)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border-0 cursor-pointer ${
                          city.status === 'Active' 
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {city.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-premium border border-slate-100 text-left admin-modal">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="admin-modal-title">Add Operations City</div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            
            <form onSubmit={handleAddCity} className="flex flex-col gap-4 text-xs font-bold text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">City Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Chennai"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Initial Launch Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="Active">Active / Live</option>
                  <option value="Inactive">Inactive / Under Maintenance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-4 py-2 bg-slate-200 text-slate-750 text-xs font-bold rounded-xl border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#1A7A4A] text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer"
                >
                  Register City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
