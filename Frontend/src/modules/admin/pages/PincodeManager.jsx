import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMapPin, FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';
import LocationFilter, { CITY_MAPPINGS } from '../components/LocationFilter';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';

const initialPincodes = [
  { pincode: '400001', city: 'Mumbai', pharmacies: 3, labs: 2, doctors: 5, lastOrder: '2026-06-10' },
  { pincode: '400002', city: 'Mumbai', pharmacies: 0, labs: 1, doctors: 2, lastOrder: '2026-06-08' },
  { pincode: '411001', city: 'Pune', pharmacies: 2, labs: 1, doctors: 3, lastOrder: '2026-06-09' },
  { pincode: '411015', city: 'Pune', pharmacies: 0, labs: 0, doctors: 0, lastOrder: '2026-06-05' },
  { pincode: '560001', city: 'Bangalore', pharmacies: 4, labs: 3, doctors: 8, lastOrder: '2026-06-11' },
  { pincode: '560008', city: 'Bangalore', pharmacies: 0, labs: 0, doctors: 0, lastOrder: '2026-06-01' },
  { pincode: '110001', city: 'Delhi', pharmacies: 6, labs: 4, doctors: 10, lastOrder: '2026-06-10' }
];

export default function PincodeManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stateVal = searchParams.get('state') || '';
  const cityVal = searchParams.get('city') || '';
  const pincodeVal = searchParams.get('pincode') || '';
  const { isFiltered } = useAdminLocation();

  const [pincodes, setPincodes] = useState(initialPincodes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetPincode, setTargetPincode] = useState(null);
  
  // Form fields
  const [newPincode, setNewPincode] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');

  // Add Vendor Form
  const [vendorType, setVendorType] = useState('pharmacy');
  const [vendorName, setVendorName] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleCreatePincode = (e) => {
    e.preventDefault();
    if (!newPincode) return;
    setPincodes([
      ...pincodes,
      { pincode: newPincode, city: newCity, pharmacies: 0, labs: 0, doctors: 0, lastOrder: '-' }
    ]);
    setNewPincode('');
    setShowAddModal(false);
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!vendorName) return;

    setPincodes(pincodes.map(p => {
      if (p.pincode === targetPincode.pincode) {
        return {
          ...p,
          pharmacies: vendorType === 'pharmacy' ? p.pharmacies + 1 : p.pharmacies,
          labs: vendorType === 'lab' ? p.labs + 1 : p.labs,
          doctors: vendorType === 'doctor' ? p.doctors + 1 : p.doctors
        };
      }
      return p;
    }));

    setSuccessToast(`Successfully added ${vendorName} (${vendorType}) to ${targetPincode.pincode}!`);
    setTimeout(() => setSuccessToast(''), 4000);
    setVendorName('');
    setTargetPincode(null);
  };

  const filteredPincodes = pincodes.filter(item => {
    const mapping = CITY_MAPPINGS[item.city];
    const itemState = mapping ? mapping.state : (item.city === 'Mumbai' || item.city === 'Pune' ? 'Maharashtra' : item.city === 'Bangalore' ? 'Karnataka' : '');
    
    if (stateVal && itemState !== stateVal) return false;
    if (cityVal && item.city !== cityVal) return false;
    if (pincodeVal && item.pincode !== pincodeVal) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 pr-1 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <div className="admin-page-title">Pincode Manager</div>
          <div className="admin-page-subtitle mt-2">
            Configure local operational bounds, assign service parameters, and flag coverage drops.
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A7A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0 hover:bg-[#1A7A4A]/90 transition-all"
        >
          <FiPlus /> Add Operational Pincode
        </button>
      </div>

      <LocationFilter />

      {/* Location Banner */}
      {(stateVal || cityVal || pincodeVal) && (
        <div className="admin-location-banner">
          <span>📍 Showing data for: {[stateVal, cityVal, pincodeVal].filter(Boolean).join(' → ')}</span>
          <button 
            type="button"
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('state');
              newParams.delete('city');
              newParams.delete('pincode');
              setSearchParams(newParams);
            }}
            className="admin-filter-clear-btn ml-auto"
          >
            Reset Filters
          </button>
        </div>
      )}

      {successToast && (
        <div className="fixed bottom-6 right-6 z-[99] bg-[#0F3D2B] text-white px-4 py-3 rounded-2xl shadow-premium text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
          <FiCheckCircle className="text-[#F5A623] text-sm shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
        <div className="admin-section-heading-wrapper">
          <FiMapPin className="text-[#1A7A4A]" />
          <span>Registered Postal Jurisdictions</span>
        </div>

        {isFiltered && filteredPincodes.length === 0 ? (
          <div className="mt-4">
            <LocationEmptyState 
              locationName={[stateVal, cityVal, pincodeVal].filter(Boolean).join(' → ')}
              hasVendors={false}
              hasOrders={false}
            />
          </div>
        ) : !isFiltered && pincodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
            <span className="text-3xl mb-3">📍</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Operational Pincodes</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no operational pincodes registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar mt-4">
            <table className="w-full text-left border-collapse admin-table">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="py-3 px-4">Pincode</th>
                  <th className="py-3 px-4">Covered City</th>
                  <th className="py-3 px-4">Pharmacies</th>
                  <th className="py-3 px-4">Labs</th>
                  <th className="py-3 px-4">Doctors</th>
                  <th className="py-3 px-4">Last Order</th>
                  <th className="py-3 px-4">Coverage Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPincodes.map((item) => {
                  const totalVendors = item.pharmacies + item.labs + item.doctors;
                  const isZeroCoverage = totalVendors === 0;
                  
                  return (
                    <tr 
                      key={item.pincode} 
                      className={`hover:bg-[#F0FDF4] transition-colors ${
                        isZeroCoverage ? 'bg-rose-50/40 hover:bg-rose-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-4 admin-table-name font-black tracking-wider">{item.pincode}</td>
                      <td className="py-3 px-4">{item.city}</td>
                      <td className="py-3 px-4 font-bold">{item.pharmacies}</td>
                      <td className="py-3 px-4 font-bold">{item.labs}</td>
                      <td className="py-3 px-4 font-bold">{item.doctors}</td>
                      <td className="py-3 px-4 text-slate-500 font-semibold">{item.lastOrder}</td>
                      <td className="py-3 px-4">
                        <span className={`admin-badge uppercase tracking-wider text-[9px] font-black ${
                          isZeroCoverage 
                            ? 'bg-rose-100 text-rose-600 animate-pulse' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isZeroCoverage ? 'Zero Coverage' : 'Active Service'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setTargetPincode(item)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#1A7A4A] text-white hover:bg-[#1A7A4A]/90 transition-all border-0 cursor-pointer"
                        >
                          + Add Vendor
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Pincode Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-premium border border-slate-100 text-left admin-modal">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="admin-modal-title">Register Local Pincode</div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePincode} className="flex flex-col gap-4 text-xs font-bold text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Pincode (6 digits)</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="e.g. 400053"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value.replace(/\D/g,''))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Associated City</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
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
                  Confirm Pincode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vendor to Pincode Modal */}
      {targetPincode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-premium border border-slate-100 text-left admin-modal">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="admin-modal-title">Add Service Node</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Assign provider to {targetPincode.pincode}</div>
              </div>
              <button onClick={() => setTargetPincode(null)} className="text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            
            <form onSubmit={handleAddVendor} className="flex flex-col gap-4 text-xs font-bold text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Vendor Node Category</label>
                <select
                  value={vendorType}
                  onChange={(e) => setVendorType(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="pharmacy">Pharmacy Node</option>
                  <option value="lab">Lab / Diagnostics Center</option>
                  <option value="doctor">Doctor / Clinician</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Vendor / Store Name</label>
                <input
                  type="text"
                  placeholder="e.g. CareMax Pharmacy"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setTargetPincode(null)} 
                  className="px-4 py-2 bg-slate-200 text-slate-750 text-xs font-bold rounded-xl border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#1A7A4A] text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer"
                >
                  Authorize Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
