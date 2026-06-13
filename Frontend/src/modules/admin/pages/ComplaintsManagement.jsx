import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReusableTable from '../components/ReusableTable';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function ComplaintsManagement() {
  const { locationFilter, isFiltered } = useAdminLocation();
  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/complaints', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setComplaintsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const updateStatus = async (id, newStatus) => {
    // Optimistic Update
    setComplaintsList(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
    }
    triggerToast(`Status updated to ${newStatus}`);

    try {
      await apiClient.patch(`/api/admin/complaints/${id}`, { status: newStatus });
    } catch (err) {
      console.warn("Backend PATCH failed (expected if mock backend):", err);
    }
  };

  const handleResolve = (id) => {
    updateStatus(id, 'Resolved');
  };

  const handleEscalate = (id) => {
    updateStatus(id, 'In Progress');
  };

  // Define table column mappings
  const columns = [
    {
      key: 'id',
      header: 'Complaint ID',
      render: (row) => <span className="font-extrabold text-slate-800">{row.id}</span>
    },
    {
      key: 'patient',
      header: 'Patient',
      render: (row) => <span className="font-semibold text-slate-800">{row.patient}</span>
    },
    {
      key: 'against',
      header: 'Against',
      render: (row) => <span className="font-medium text-slate-605">{row.against}</span>
    },
    {
      key: 'issue',
      header: 'Issue',
      render: (row) => <span className="truncate block max-w-[200px] text-slate-500">{row.issue}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        let badgeClass = 'bg-rose-50 text-rose-600';
        if (row.status === 'In Progress') badgeClass = 'bg-amber-50 text-amber-600';
        if (row.status === 'Resolved') badgeClass = 'bg-emerald-50 text-emerald-600';
        return <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeClass}`}>{row.status}</span>;
      }
    },
    {
      key: 'date',
      header: 'Date Raised',
      render: (row) => <span className="font-bold text-slate-450">{row.date}</span>
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in text-slate-700">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="admin-page-label">Complaints & Disputes</span>
          <div className="admin-page-title mt-1">Patient Complaints & Disputes</div>
          <p className="admin-page-subtitle mt-1">
            Investigate, resolve, and audit complaints lodged by patients against healthcare providers.
          </p>
        </div>
      </div>

      {/* Location Filter Bar */}
      <LocationFilter />
      <LocationBanner />

      {/* Main Table Grid */}
      <div className="flex-1">
        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && complaintsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && complaintsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">⚠️</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Complaints Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no patient complaints registered in the system yet.</p>
          </div>
        ) : (
          <ReusableTable 
            columns={columns}
            data={complaintsList}
            searchPlaceholder="Search complaint by ID or patient name..."
            searchKey="patient"
            filterOptions={{ key: 'status', label: 'Status', options: ['Open', 'In Progress', 'Resolved'] }}
            actions={(row) => (
              <button 
                onClick={() => setSelectedComplaint(row)}
                className="bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider tracking-widest transition-all cursor-pointer tap-scale"
              >
                Investigate
              </button>
            )}
            fileName="emediclub-complaints"
          />
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#1A7A4A] p-5 text-white flex justify-between items-center">
                <div>
                  <div className="admin-modal-title text-white">Complaint Investigation</div>
                  <span className="admin-modal-subtitle text-slate-100">{selectedComplaint.id} • Raised on {selectedComplaint.date}</span>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="text-white hover:opacity-80 border-0 bg-transparent cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Patient:</span>
                  <span className="text-slate-800 font-extrabold">{selectedComplaint.patient}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Accused Vendor:</span>
                  <span className="text-slate-800 font-extrabold">{selectedComplaint.against}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                  <span className="text-slate-400 block mb-1">Issue Details:</span>
                  <span className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 block">
                    {selectedComplaint.issue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Status:</span>
                  <select
                    value={selectedComplaint.status}
                    onChange={(e) => updateStatus(selectedComplaint.id, e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider outline-none text-slate-700 focus:border-[#1A7A4A] cursor-pointer"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-2.5 justify-end">
                <button onClick={() => setSelectedComplaint(null)} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-750 text-xs font-bold rounded-xl border-0 cursor-pointer">
                  Close
                </button>
                {selectedComplaint.status !== 'Resolved' && (
                  <>
                    <button 
                      onClick={() => handleEscalate(selectedComplaint.id)}
                      className="px-4 py-2.5 bg-[#F5A623] hover:bg-[#F5A623]/90 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer"
                    >
                      Escalate
                    </button>
                    <button 
                      onClick={() => handleResolve(selectedComplaint.id)}
                      className="px-4 py-2.5 bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer"
                    >
                      Resolve Issue
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Drawer */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-[99] bg-[#0F3D2B] text-white px-4 py-3 rounded-2xl shadow-premium text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
            <FiCheckCircle className="text-[#F5A623] text-sm shrink-0" />
            <span>{toast.msg}</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
