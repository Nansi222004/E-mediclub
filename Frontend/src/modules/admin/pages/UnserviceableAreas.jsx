import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import LocationFilter, { CITY_MAPPINGS } from '../components/LocationFilter';

const initialGaps = [
  { pincode: '400089', city: 'Mumbai', attempts: 42, reason: 'No registered Pharmacy vendor in range', status: 'Pending Review' },
  { pincode: '411033', city: 'Pune', attempts: 28, reason: 'No active Labs for blood sample pickup', status: 'Coming Soon' },
  { pincode: '560067', city: 'Bangalore', attempts: 56, reason: 'No Pediatricians available for telehealth slots', status: 'Pending Review' },
  { pincode: '110024', city: 'Delhi', attempts: 19, reason: 'No registered vendors in radius', status: 'Coming Soon' }
];

export default function UnserviceableAreas() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stateVal = searchParams.get('state') || '';
  const cityVal = searchParams.get('city') || '';
  const pincodeVal = searchParams.get('pincode') || '';

  const [gaps, setGaps] = useState(initialGaps);
  const [successToast, setSuccessToast] = useState('');

  const markComingSoon = (pincode) => {
    setGaps(gaps.map(g => g.pincode === pincode ? { ...g, status: 'Coming Soon' } : g));
    setSuccessToast(`Pincode ${pincode} marked as "Coming Soon". Notification scheduled for subscribers.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const filteredGaps = gaps.filter(item => {
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
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <div className="admin-page-title">Unserviceable Areas (Gaps)</div>
          <div className="admin-page-subtitle mt-2">
            Audit lost coverage metrics, identify serviceability leaks, and track failed checkout checkout attempts.
          </div>
        </div>
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
          <FiAlertTriangle className="text-amber-500" />
          <span>Coverage Void Log & Failed Checkouts</span>
        </div>

        <div className="overflow-x-auto no-scrollbar mt-4">
          <table className="w-full text-left border-collapse admin-table">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100">
                <th className="py-3 px-4">Pincode</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Failed Checkout Attempts</th>
                <th className="py-3 px-4">Primary Category Gap</th>
                <th className="py-3 px-4">Resolution Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-550/20">
              {filteredGaps.map((gap) => (
                <tr key={gap.pincode} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 admin-table-name text-rose-600 font-extrabold">{gap.pincode}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{gap.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-rose-50 text-rose-600 font-black px-2.5 py-0.5 rounded-full text-[10px]">
                      {gap.attempts} attempts
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{gap.reason}</td>
                  <td className="py-3.5 px-4">
                    <span className={`admin-badge uppercase tracking-wider text-[9px] font-black ${
                      gap.status === 'Coming Soon' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {gap.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => navigate('/admin/locations/pincodes')}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-[#1A7A4A] text-white hover:bg-[#1A7A4A]/90 transition-all border-0 cursor-pointer uppercase"
                      >
                        Add Vendor Here
                      </button>
                      {gap.status !== 'Coming Soon' && (
                        <button
                          onClick={() => markComingSoon(gap.pincode)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-slate-100 hover:bg-slate-200 text-slate-650 transition-all border-0 cursor-pointer uppercase"
                        >
                          Coming Soon
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
