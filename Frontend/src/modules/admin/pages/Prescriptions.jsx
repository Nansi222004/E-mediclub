import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFileText, FiEye, FiCheck, FiX, FiFlag, FiCheckCircle } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function Prescriptions() {
  const { locationFilter, isFiltered } = useAdminLocation();
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPres, setSelectedPres] = useState(null);
  const [toast, setToast] = useState('');
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/prescriptions', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setPrescriptionsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const handleAction = async (id, actionType) => {
    try {
      let newStatus = 'Pending Review';
      if (actionType === 'approve') newStatus = 'Approved';
      if (actionType === 'reject') newStatus = 'Rejected';
      if (actionType === 'flag') newStatus = 'Flagged';

      // Mock status update call or update local list directly
      setPrescriptionsList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      if (selectedPres && selectedPres.id === id) {
        setSelectedPres({ ...selectedPres, status: newStatus });
      }
      
      setToast(`Prescription ${id} status updated to ${newStatus}`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Error updating prescription status:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 pr-1 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <div className="admin-page-title">Prescription Verification</div>
          <div className="admin-page-subtitle mt-2">
            Verify uploaded doctor prescriptions, cross-reference scheduled drugs, and audit pharmacist approvals.
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[99] bg-[#0F3D2B] text-white px-4 py-3 rounded-2xl shadow-premium text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
          <FiCheckCircle className="text-[#F5A623] text-sm shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Location Filter */}
      <LocationFilter />
      <LocationBanner />

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
        <div className="admin-section-heading-wrapper">
          <FiFileText className="text-[#1A7A4A]" />
          <span>Verification Audit Ledger</span>
        </div>

        {loading ? (
          <div className="admin-skeleton-grid mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && prescriptionsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && prescriptionsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">📄</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Prescriptions Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no patient prescription uploads registered in the system yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar mt-4">
            <table className="w-full text-left border-collapse admin-table">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="py-3 px-4">Prescription ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Pharmacy / Vendor</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {prescriptionsList.map((pres) => (
                  <tr key={pres.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 admin-table-name font-black">{pres.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{pres.patient}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-655">{pres.pharmacy}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{pres.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`admin-badge uppercase tracking-wider text-[9px] font-black ${
                        pres.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                        pres.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                        pres.status === 'Flagged' ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {pres.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => setSelectedPres(pres)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-650 hover:bg-slate-200 transition-all border-0 cursor-pointer flex items-center justify-center"
                          title="View Document"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleAction(pres.id, 'approve')}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border-0 cursor-pointer flex items-center justify-center"
                          title="Approve"
                        >
                          <FiCheck className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleAction(pres.id, 'reject')}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border-0 cursor-pointer flex items-center justify-center"
                          title="Reject"
                        >
                          <FiX className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleAction(pres.id, 'flag')}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all border-0 cursor-pointer flex items-center justify-center"
                          title="Flag"
                        >
                          <FiFlag className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Prescription View Modal */}
      {selectedPres && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-lg w-full shadow-premium border border-slate-100 text-left admin-modal">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="admin-modal-title">Review Prescription Upload</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{selectedPres.id} • {selectedPres.patient}</div>
              </div>
              <button onClick={() => setSelectedPres(null)} className="text-slate-400 hover:text-slate-650 border-0 bg-transparent cursor-pointer">
                <FiX className="text-lg" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-700">
              {/* Document Image */}
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-150 bg-slate-50 flex items-center justify-center">
                <img
                  src={selectedPres.img}
                  alt="Doctor Prescription Document"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Verification Status:</span>
                <span className={`admin-badge uppercase tracking-wider text-[9px] font-black ${
                  selectedPres.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                  selectedPres.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                  selectedPres.status === 'Flagged' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {selectedPres.status}
                </span>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedPres(null)} 
                  className="px-4 py-2 bg-slate-200 text-slate-750 text-xs font-bold rounded-xl border-0 cursor-pointer"
                >
                  Close View
                </button>
                <button 
                  onClick={() => handleAction(selectedPres.id, 'flag')}
                  className="px-4 py-2 bg-[#F5A623] text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer flex items-center gap-1"
                >
                  <FiFlag /> Flag Document
                </button>
                <button 
                  onClick={() => handleAction(selectedPres.id, 'reject')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer flex items-center gap-1"
                >
                  <FiX /> Reject Entry
                </button>
                <button 
                  onClick={() => handleAction(selectedPres.id, 'approve')}
                  className="px-5 py-2 bg-[#1A7A4A] hover:bg-[#1A7A4A]/95 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer flex items-center gap-1"
                >
                  <FiCheck /> Approve Drug Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
