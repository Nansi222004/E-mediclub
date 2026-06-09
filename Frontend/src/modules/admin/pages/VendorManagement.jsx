import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  approveVendor, 
  rejectVendor, 
  deleteVendor, 
  updateCommissionRate 
} from '../store/adminSlice';
import { 
  FiCheckCircle, FiXCircle, FiShield, FiFileText, 
  FiPercent, FiEye, FiTrash2, FiClock, FiDownload, 
  FiSearch, FiFilter, FiDollarSign, FiCreditCard, FiAlertTriangle, FiArrowLeft
} from 'react-icons/fi';

export default function VendorManagement() {
  const dispatch = useDispatch();
  const { vendors } = useSelector(state => state.admin);

  // Search & Filter local states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLicense, setFilterLicense] = useState("all");
  const [filterKyc, setFilterKyc] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Selection state for full-page details view
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Confirmation Modals states
  const [vendorToReject, setVendorToReject] = useState(null);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Loading indicator tracker (key: `vendorId-actionType`)
  const [loadingActions, setLoadingActions] = useState({});

  // Commission editing states
  const [editingCommissionId, setEditingCommissionId] = useState(null);
  const [customRate, setCustomRate] = useState(10);

  // Trigger Accept/Approve action (Simulating loading delay of 800ms)
  const handleApprove = (id) => {
    const key = `${id}-accept`;
    setLoadingActions(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      dispatch(approveVendor(id));
      setLoadingActions(prev => ({ ...prev, [key]: false }));
      
      // Keep details view updated if active
      if (selectedVendor && selectedVendor.id === id) {
        setSelectedVendor(prev => ({ ...prev, status: 'approved', kyc: 'verified' }));
      }
    }, 800);
  };

  // Trigger Reject action from Confirm Modal (Simulating loading delay of 800ms)
  const handleRejectConfirm = () => {
    if (!vendorToReject) return;
    const id = vendorToReject.id;
    const key = `${id}-reject`;
    setLoadingActions(prev => ({ ...prev, [key]: true }));
    
    setTimeout(() => {
      dispatch(rejectVendor(id));
      setLoadingActions(prev => ({ ...prev, [key]: false }));
      
      // Close confirmation and update detail view if active
      if (selectedVendor && selectedVendor.id === id) {
        setSelectedVendor(prev => ({ ...prev, status: 'rejected', kyc: 'rejected' }));
      }
      setVendorToReject(null);
      setRejectReason("");
    }, 800);
  };

  // Trigger Delete action from Confirm Modal (Simulating loading delay of 800ms)
  const handleDeleteConfirm = () => {
    if (!vendorToDelete) return;
    const id = vendorToDelete.id;
    const key = `${id}-delete`;
    setLoadingActions(prev => ({ ...prev, [key]: true }));

    setTimeout(() => {
      dispatch(deleteVendor(id));
      setLoadingActions(prev => ({ ...prev, [key]: false }));
      
      // Exit details view if deleted vendor matches
      if (selectedVendor && selectedVendor.id === id) {
        setSelectedVendor(null);
      }
      setVendorToDelete(null);
    }, 800);
  };

  // Save customized Commission Rate
  const handleSaveCommission = (vendorId) => {
    dispatch(updateCommissionRate({ vendorId, rate: Number(customRate) }));
    setEditingCommissionId(null);
    if (selectedVendor && selectedVendor.id === vendorId) {
      setSelectedVendor(prev => ({ ...prev, commissionRate: Number(customRate) }));
    }
  };

  // Export Directory to CSV
  const handleExportCSV = () => {
    if (vendors.length === 0) return;
    const headers = ["Vendor Name", "Vendor Email", "Store Name", "License Status", "KYC Status", "Earnings", "Commission %", "Joined Date"];
    const csvContent = [
      headers.join(','),
      ...vendors.map(v => [
        `"${v.name}"`,
        `"${v.email}"`,
        `"${v.storeName}"`,
        v.status.toUpperCase(),
        v.kyc.toUpperCase(),
        v.earnings,
        v.commissionRate,
        v.joinedDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `emediclub-vendor-directory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process search and status filters
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLicense = filterLicense === "all" ? true : 
                           filterLicense === "awaiting" ? v.status === "pending" : 
                           v.status === filterLicense;
    const matchesKyc = filterKyc === "all" ? true : v.kyc === filterKyc;
    const matchesType = filterType === "all" ? true :
                        filterType === "pharmacy" ? (v.role === "pharmacy_vendor" || v.role === "vendor" || !v.role) :
                        filterType === "lab" ? v.role === "lab_vendor" :
                        filterType === "doctor" ? v.role === "doctor_vendor" : true;
    return matchesSearch && matchesLicense && matchesKyc && matchesType;
  });

  // If details view is active, render the full-page Details View sub-page
  if (selectedVendor) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in font-sans">
        
        {/* Detail Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedVendor(null)}
              className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Back to Directory"
            >
              <FiArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 leading-none">{selectedVendor.storeName}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                Merchant Partner Profile & Compliance Documents
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedVendor(null)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer"
          >
            Back to Directory
          </button>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Partner Profile Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium">
              <h2 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                Partner Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Applicant Partner</span>
                  <span className="text-slate-800 font-extrabold text-sm">{selectedVendor.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Registered Email</span>
                  <span className="text-slate-800 font-extrabold text-sm">{selectedVendor.email}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Contact Mobile</span>
                  <span className="text-slate-800 font-extrabold text-sm">+91 {selectedVendor.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Registry Date</span>
                  <span className="text-slate-800 font-extrabold text-sm">{selectedVendor.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Financial Settlements Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium">
              <h2 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                Financials & Commission
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Bank Partner</span>
                  <span className="text-slate-800 font-extrabold text-sm">{selectedVendor.bankName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Settlement Account</span>
                  <span className="text-slate-800 font-extrabold text-sm">{selectedVendor.accountNo}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Accumulated Earnings</span>
                  <span className="text-slate-800 font-extrabold text-sm">₹{selectedVendor.earnings.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-0.5">Commission Margin</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input 
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-black outline-none"
                    />
                    <span className="font-black text-slate-700 text-sm">%</span>
                    <button 
                      onClick={() => handleSaveCommission(selectedVendor.id)}
                      className="bg-teal hover:bg-teal-dark text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-6">
            
            {/* Status & Compliance Sidebar Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium">
              <h2 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                Compliance Status
              </h2>
              <div className="flex flex-col gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">License State</span>
                  {selectedVendor.status === 'approved' && (
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block">Approved License</span>
                  )}
                  {selectedVendor.status === 'pending' && (
                    <span className="bg-gold-light text-gold-dark px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block">Awaiting Audit</span>
                  )}
                  {selectedVendor.status === 'rejected' && (
                    <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block">Rejected License</span>
                  )}
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block mb-1">KYC Audit</span>
                  <span className="text-slate-750 font-extrabold flex items-center gap-1.5 text-sm">
                    <FiFileText className={selectedVendor.kyc === 'verified' ? 'text-emerald-500' : 'text-slate-400'} />
                    {selectedVendor.kyc.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Previews Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-premium flex-1">
              <h2 className="text-xs font-black text-slate-850 uppercase tracking-widest border-b border-slate-50 pb-3 mb-4">
                Compliance Credentials
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {selectedVendor.role === 'lab_vendor' ? (
                  <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-indigo-50/20">
                    <FiFileText className="text-xl text-indigo-650" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">Lab Accreditation Code</span>
                    <span className="text-[8px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full mt-1.5 uppercase font-mono">
                      {selectedVendor.accreditationCode || 'NABL-MC-5412-A'}
                    </span>
                  </div>
                ) : selectedVendor.role === 'doctor_vendor' ? (
                  <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-blue-50/20">
                    <FiFileText className="text-xl text-blue-650" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">Medical Registration No.</span>
                    <span className="text-[8px] font-bold text-blue-650 bg-blue-50 px-2 py-0.5 rounded-full mt-1.5 uppercase font-mono">
                      {selectedVendor.medicalRegNo || 'MCI-20831/A'}
                    </span>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-teal-light/5">
                    <FiFileText className="text-xl text-teal" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">Retail Drug License</span>
                    <span className="text-[8px] font-bold text-teal bg-teal-light px-2 py-0.5 rounded-full mt-1.5 uppercase font-mono">
                      {selectedVendor.drugLicense || 'DL-20831/15'}
                    </span>
                  </div>
                )}
                <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-teal-light/5">
                  <FiFileText className="text-xl text-teal" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">GST Certificate</span>
                  <span className="text-[8px] font-bold text-teal bg-teal-light px-2 py-0.5 rounded-full mt-1.5 uppercase">27AAAAA1111A1Z1</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="border-t border-slate-100 pt-5 mt-4 flex flex-row items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => setVendorToDelete(selectedVendor)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
          >
            <FiTrash2 /> Delete Partner
          </button>
          
          <button
            disabled={selectedVendor.status === 'rejected'}
            onClick={() => setVendorToReject(selectedVendor)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 border border-rose-200 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
          >
            <FiXCircle /> Reject Partner
          </button>

          <button
            disabled={selectedVendor.status === 'approved' || loadingActions[`${selectedVendor.id}-accept`]}
            onClick={() => handleApprove(selectedVendor.id)}
            className="flex items-center justify-center gap-1.5 px-6 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
          >
            {loadingActions[`${selectedVendor.id}-accept`] ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiCheckCircle />
            )}
            <span>Approve Partner</span>
          </button>
        </div>

        {/* Confirmation Modals */}
        <AnimatePresence>
          {vendorToReject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setVendorToReject(null)}
                className="fixed inset-0 bg-slate-900 z-10"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-20 text-center relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="text-xl" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2">
                  Confirm Rejection
                </h3>
                <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3.5 mb-5 leading-relaxed text-center">
                  You are rejecting the retail drug license request of <strong className="text-slate-600">{vendorToReject.storeName}</strong>.
                </p>
                <div className="flex flex-col gap-1 text-left mb-6">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reason for Rejection (Optional)</label>
                  <textarea
                    placeholder="e.g. Drug license certificate blurry or expired."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal h-20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVendorToReject(null)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectConfirm}
                    disabled={loadingActions[`${vendorToReject.id}-reject`]}
                    className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center min-h-[44px]"
                  >
                    {loadingActions[`${vendorToReject.id}-reject`] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Confirm</span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {vendorToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setVendorToDelete(null)}
                className="fixed inset-0 bg-slate-900 z-10"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-sm w-full p-6 sm:p-8 z-20 text-center relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-xl" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 text-center">
                  Delete Partner?
                </h3>
                <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mb-6 leading-relaxed text-center">
                  Are you sure you want to permanently delete <strong className="text-slate-600">{vendorToDelete.storeName}</strong>?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVendorToDelete(null)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={loadingActions[`${vendorToDelete.id}-delete`]}
                    className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center min-h-[44px]"
                  >
                    {loadingActions[`${vendorToDelete.id}-delete`] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3.5 overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="flex flex-row items-center justify-between gap-2 border-b border-slate-100 pb-2 shrink-0">
        <div>
          <h1 className="text-base font-extrabold text-slate-800 leading-none">Vendor Partner Directory</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-tight">
            Verify retail license credentials and margins.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-teal hover:bg-teal-dark text-white text-[10px] font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer tap-scale shrink-0"
        >
          <FiDownload className="text-xs" />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* 2. Filters Deck */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-premium shrink-0">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex-1 min-w-0">
          <FiSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="text" 
            placeholder="Search vendor name, email, store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>

        {/* License Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-xl shrink-0">
          <FiFilter className="text-slate-400 text-[10px] shrink-0" />
          <select 
            value={filterLicense} 
            onChange={(e) => setFilterLicense(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All License Statuses</option>
            <option value="approved">Approved</option>
            <option value="awaiting">Awaiting Audit</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* KYC Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-xl shrink-0">
          <FiFilter className="text-slate-400 text-[10px] shrink-0" />
          <select 
            value={filterKyc} 
            onChange={(e) => setFilterKyc(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All KYC Statuses</option>
            <option value="verified">Verified</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Vendor Type Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-xl shrink-0">
          <FiFilter className="text-slate-400 text-[10px] shrink-0" />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
          >
            <option value="all">All Vendor Types</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="lab">Laboratory</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

      </div>

      {/* 3. Core Listings Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
        
        {filteredVendors.length > 0 ? (
          <>
            {/* Desktop Table View Layout */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4.5 px-6">Vendor Name</th>
                    <th className="py-4.5 px-6">Vendor Email</th>
                     <th className="py-4.5 px-6">Store Name</th>
                    <th className="py-4.5 px-6">Vendor Type</th>
                    <th className="py-4.5 px-6">License Status</th>
                    <th className="py-4.5 px-6">KYC Status</th>
                    <th className="py-4.5 px-6">Commission</th>
                    <th className="py-4.5 px-6">Earnings</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Vendor Name */}
                      <td className="py-4.5 px-6 font-extrabold text-slate-800">
                        {vendor.name}
                      </td>

                      {/* Vendor Email */}
                      <td className="py-4.5 px-6 text-[11px] text-slate-500 font-bold">
                        {vendor.email}
                      </td>
                      
                      {/* Store Name */}
                      <td className="py-4.5 px-6 font-bold text-slate-700">{vendor.storeName}</td>

                      {/* Vendor Type */}
                      <td className="py-4.5 px-6 font-bold text-slate-750">
                        {vendor.role === 'lab_vendor' ? (
                          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">🔬 Lab</span>
                        ) : vendor.role === 'doctor_vendor' ? (
                          <span className="bg-blue-50 text-blue-650 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">👨‍⚕️ Doctor</span>
                        ) : (
                          <span className="bg-teal-50 text-teal-650 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">🏥 Pharmacy</span>
                        )}
                      </td>
                      
                      {/* License Status Badges */}
                      <td className="py-4.5 px-6">
                        {vendor.status === 'approved' && (
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Approved</span>
                        )}
                        {vendor.status === 'pending' && (
                          <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Audit</span>
                        )}
                        {vendor.status === 'rejected' && (
                          <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Rejected</span>
                        )}
                      </td>
                      
                      {/* KYC Verification Badges */}
                      <td className="py-4.5 px-6">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <FiFileText className={vendor.kyc === 'verified' ? 'text-emerald-500' : 'text-slate-400'} />
                          {vendor.kyc.toUpperCase()}
                        </span>
                      </td>

                      {/* Commission Rates */}
                      <td className="py-4.5 px-6">
                        {editingCommissionId === vendor.id ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="number" 
                              value={customRate} 
                              onChange={(e) => setCustomRate(e.target.value)}
                              className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal"
                            />
                            <button 
                              onClick={() => handleSaveCommission(vendor.id)}
                              className="text-teal hover:underline text-[10px] font-black uppercase tracking-wide cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800">{vendor.commissionRate}%</span>
                            {vendor.status === 'approved' && (
                              <button 
                                onClick={() => { setEditingCommissionId(vendor.id); setCustomRate(vendor.commissionRate); }}
                                className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-teal cursor-pointer"
                              >
                                <FiPercent className="text-2xs" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Earnings */}
                      <td className="py-4.5 px-6 font-black text-slate-800">₹{vendor.earnings.toLocaleString()}</td>

                      {/* Action Buttons */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Detail Button */}
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setCustomRate(vendor.commissionRate);
                            }}
                            title="View KYC & Details"
                            className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale"
                          >
                            <FiEye className="text-sm shrink-0" />
                          </button>

                          {/* Accept Button */}
                          <button
                            disabled={vendor.status === 'approved' || loadingActions[`${vendor.id}-accept`]}
                            onClick={() => handleApprove(vendor.id)}
                            title="Approve Store Partner"
                            className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center min-w-[32px] min-h-[32px]"
                          >
                            {loadingActions[`${vendor.id}-accept`] ? (
                              <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheckCircle className="text-sm shrink-0" />
                            )}
                          </button>

                          {/* Reject Button */}
                          <button
                            disabled={vendor.status === 'rejected'}
                            onClick={() => setVendorToReject(vendor)}
                            title="Reject Partner Request"
                            className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <FiXCircle className="text-sm shrink-0" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setVendorToDelete(vendor)}
                            title="Delete Store Registry"
                            className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer tap-scale"
                          >
                            <FiTrash2 className="text-sm shrink-0" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredVendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  className="bg-white border border-slate-100 p-4.5 rounded-[24px] shadow-premium flex flex-col justify-between gap-4 hover-lift"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{vendor.storeName}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {vendor.role === 'lab_vendor' ? (
                          <span className="bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">🔬 Lab</span>
                        ) : vendor.role === 'doctor_vendor' ? (
                          <span className="bg-blue-50 text-blue-650 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">👨‍⚕️ Doctor</span>
                        ) : (
                          <span className="bg-teal-50 text-teal-650 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">🏥 Pharmacy</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">{vendor.name}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{vendor.email}</p>
                    </div>
                    <div>
                      {vendor.status === 'approved' && (
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Approved</span>
                      )}
                      {vendor.status === 'pending' && (
                        <span className="bg-gold-light text-gold-dark px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Pending</span>
                      )}
                      {vendor.status === 'rejected' && (
                        <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">Rejected</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150/40 grid grid-cols-3 gap-1 text-center items-center text-[10px]">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Commission</span>
                      <span className="font-extrabold text-slate-800 leading-tight truncate text-[9.5px]">{vendor.commissionRate}% rate</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Earnings</span>
                      <span className="font-black text-slate-800 leading-tight truncate text-[9.5px]">₹{vendor.earnings.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-1 min-w-0 items-center justify-center">
                      <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider truncate">Verification</span>
                      <span className="font-black text-emerald-600 uppercase flex items-center gap-0.5 leading-tight text-[9px] truncate">
                        <FiFileText className="text-2xs shrink-0" /> {vendor.kyc}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setCustomRate(vendor.commissionRate);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 hover:bg-blue-600 active:bg-blue-700 text-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
                    >
                      <FiEye className="text-xs" />
                      <span>View Details</span>
                    </button>

                    <button
                      disabled={vendor.status === 'approved' || loadingActions[`${vendor.id}-accept`]}
                      onClick={() => handleApprove(vendor.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 hover:bg-emerald-600 active:bg-emerald-700 text-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {loadingActions[`${vendor.id}-accept`] ? (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiCheckCircle className="text-xs" />
                      )}
                      <span>Approve</span>
                    </button>

                    <button
                      disabled={vendor.status === 'rejected'}
                      onClick={() => setVendorToReject(vendor)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-600 active:bg-rose-700 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <FiXCircle className="text-xs" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => setVendorToDelete(vendor)}
                      className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-600 active:bg-rose-700 text-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-100 p-12 text-center rounded-3xl shadow-premium">
            <p className="text-slate-400 font-bold text-sm uppercase">No merchant registry matching that selection.</p>
          </div>
        )}

      </div>

      {/* Rejection and Delete Modals for List View */}
      <AnimatePresence>
        {vendorToReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setVendorToReject(null)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-20 text-center relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-xl" />
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2">
                Confirm Rejection
              </h3>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3.5 mb-5 leading-relaxed">
                You are rejecting the retail drug license request of <strong className="text-slate-600">{vendorToReject.storeName}</strong>.
              </p>
              <div className="flex flex-col gap-1 text-left mb-6">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reason for Rejection (Optional)</label>
                <textarea
                  placeholder="e.g. Drug license certificate blurry or expired."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVendorToReject(null)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={loadingActions[`${vendorToReject.id}-reject`]}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center min-h-[44px]"
                >
                  {loadingActions[`${vendorToReject.id}-reject`] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {vendorToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setVendorToDelete(null)}
              className="fixed inset-0 bg-slate-900 z-10"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-sm w-full p-6 sm:p-8 z-20 text-center relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-xl" />
              </div>
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2">
                Delete Partner?
              </h3>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mb-6 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-600">{vendorToDelete.storeName}</strong>?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setVendorToDelete(null)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loadingActions[`${vendorToDelete.id}-delete`]}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center min-h-[44px]"
                >
                  {loadingActions[`${vendorToDelete.id}-delete`] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
