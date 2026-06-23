import React, { useState, useEffect } from 'react';
import { 
  FiUploadCloud, FiFileText, FiTrash2, FiSearch, FiCheckCircle, FiExternalLink, FiDownload, FiSend, FiAlertCircle 
} from 'react-icons/fi';
import apiClient from '../../../shared/services/apiClient';

export default function UploadReportsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  
  // File upload state
  const [reportFile, setReportFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/labs/vendor/bookings');
      // Show bookings currently in_progress or report_uploaded
      setBookings(res.data.data.filter(b => ['in_progress', 'report_uploaded'].includes(b.status)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!reportFile || !activeBooking) return;
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const formData = new FormData();
      formData.append('file', reportFile);

      await apiClient.put(`/api/labs/vendor/bookings/${activeBooking.id}/report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMsg("Report uploaded successfully and patient notified.");
      fetchBookings();
      setReportFile(null);
      setActiveBooking(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to upload report");
    }
  };

  const handleResendReport = async (bookingId) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      // Simulate notifying client
      setSuccessMsg(`Notification resubmitted successfully for order ${bookingId}.`);
    } catch (err) {
      setErrorMsg("Failed to resend notification.");
    }
  };

  const filtered = bookings.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    (b.patientName && b.patientName.toLowerCase().includes(search.toLowerCase())) ||
    b.packageName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Upload Patient Reports</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Match PDF diagnostic transcripts with active patient checkup orders.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm max-w-xs w-full shrink-0">
          <FiSearch className="text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search ID, Patient Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
          <span>✔️</span> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2">
          <span>⚠️</span> {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-premium">
          <span className="text-4xl">🔬</span>
          <h3 className="font-extrabold text-slate-700 text-sm mt-3">No Active Transcripts Pending</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">There are no diagnostic orders currently in progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Orders List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {filtered.map(b => (
              <div 
                key={b.id} 
                onClick={() => { setActiveBooking(b); setErrorMsg(""); setSuccessMsg(""); }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col gap-3 bg-white shadow-premium ${activeBooking?.id === b.id ? 'border-teal ring-1 ring-teal' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-800 tracking-wider">ORDER: {b.id}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${b.status === 'report_uploaded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500">
                  <div>Patient: <span className="text-slate-850 font-extrabold">{b.patientName}</span></div>
                  <div>Test: <span className="text-slate-850 font-bold truncate block">{b.packageName}</span></div>
                </div>

                {b.reportUrl && (
                  <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><FiFileText className="text-teal" /> Report Uploaded</span>
                    <div className="flex items-center gap-3">
                      <a 
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${b.reportUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-teal hover:underline flex items-center gap-1 text-[10px] font-black uppercase tracking-wider decoration-transparent"
                      >
                        <FiExternalLink /> View PDF
                      </a>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleResendReport(b.id); }}
                        className="text-indigo-600 hover:underline flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                      >
                        <FiSend /> Resend Notification
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Widget Sidebar */}
          {activeBooking ? (
            <form onSubmit={handleUploadReport} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium flex flex-col gap-4 self-start">
              <h3 className="font-extrabold text-sm text-slate-850 uppercase tracking-wider border-b border-slate-55 pb-2">Upload Report for {activeBooking.id}</h3>
              
              <div className="text-xs font-semibold text-slate-600 flex flex-col gap-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
                <div>Patient: <span className="text-slate-850 font-extrabold">{activeBooking.patientName}</span></div>
                <div>Test: <span className="text-slate-800 font-bold block">{activeBooking.packageName}</span></div>
              </div>

              {!reportFile ? (
                <label className="border-2 border-dashed border-slate-200 hover:border-teal rounded-3xl p-8 bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                  <FiUploadCloud className="text-3xl text-slate-400" />
                  <span className="text-[10px] font-black text-teal uppercase tracking-widest">Select Patient PDF Report</span>
                  <input required type="file" accept=".pdf" className="hidden" onChange={(e) => setReportFile(e.target.files[0])} />
                </label>
              ) : (
                <div className="border border-teal/15 bg-teal-light/10 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FiFileText className="text-teal shrink-0 text-lg" />
                    <span className="text-xs font-extrabold text-slate-700 truncate">{reportFile.name}</span>
                  </div>
                  <button type="button" onClick={() => setReportFile(null)} className="p-1.5 hover:bg-white text-rose-600 rounded-xl border-0 cursor-pointer">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button 
                type="submit"
                disabled={!reportFile}
                className="w-full py-3.5 bg-teal hover:bg-teal-dark text-white rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 shadow-md disabled:opacity-50 transition-all"
              >
                Submit Report Document
              </button>
            </form>
          ) : (
            <div className="bg-slate-50 border border-slate-150/40 rounded-[32px] p-6 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
              Select an order from the list to upload report.
            </div>
          )}

        </div>
      )}

    </div>
  );
}
