import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiDownload, FiFileText, FiCalendar, FiTrendingUp, FiActivity, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function ReportsManagement() {
  const [reportType, setReportType] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const reports = [
    { id: 'REP-2026-001', name: 'Monthly Clinical & Consultations Audit', type: 'Clinical', date: '01 Jun 2026', size: '2.4 MB', period: 'May 2026' },
    { id: 'REP-2026-002', name: 'Vendor Commission & Revenue Settlements', type: 'Financial', date: '01 Jun 2026', size: '1.8 MB', period: 'May 2026' },
    { id: 'REP-2026-003', name: 'Lab Bookings & Diagnostics Growth Report', type: 'Diagnostics', date: '28 May 2026', size: '3.1 MB', period: 'Weeks 20-21 2026' },
    { id: 'REP-2026-004', name: 'Patient Registrations & Vitals Compliance', type: 'Clinical', date: '15 May 2026', size: '1.5 MB', period: 'Apr-May 2026' },
    { id: 'REP-2026-005', name: 'Quarterly E-Mediclub Platform Performance', type: 'Financial', date: '01 May 2026', size: '5.2 MB', period: 'Q1 2026' },
  ];

  const filteredReports = reportType === 'All' 
    ? reports 
    : reports.filter(r => r.type === reportType);

  const startDownload = (id) => {
    setDownloadingId(id);
    setDownloadProgress(0);
  };

  useEffect(() => {
    let interval;
    if (downloadingId) {
      interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setDownloadingId(null);
              setDownloadProgress(0);
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [downloadingId]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 bg-[#F5F7FA]">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <div className="text-xl font-black text-slate-805 uppercase tracking-wide leading-none">Reports & Analytics</div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
            Generate and download comprehensive clinical, financial, and diagnostic analytics reports.
          </p>
        </div>
        <span className="text-[9.5px] text-teal bg-teal-light/20 px-2.5 py-1 rounded font-black tracking-wider uppercase flex items-center gap-1">
          <FiBarChart2 /> Analytics Center Active
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Clinical Reports</span>
          <div className="flex justify-between items-end mt-2">
            <div className="text-xl font-black text-slate-800 leading-none">24 Total</div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0D6E56] flex items-center justify-center"><FiActivity /></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Financial Audit Files</span>
          <div className="flex justify-between items-end mt-2">
            <div className="text-xl font-black text-slate-800 leading-none">18 Total</div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FiDollarSign /></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">User Growth Graphs</span>
          <div className="flex justify-between items-end mt-2">
            <div className="text-xl font-black text-slate-800 leading-none">12 Total</div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><FiUsers /></div>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Growth Rate YTD</span>
          <div className="flex justify-between items-end mt-2">
            <div className="text-xl font-black text-emerald-600 leading-none">+28.4%</div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0D6E56] flex items-center justify-center"><FiTrendingUp /></div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Filters and Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4">
          <div className="text-xs font-black text-slate-800 uppercase tracking-widest">Document Registry</div>
          <div className="flex gap-2">
            {['All', 'Clinical', 'Financial', 'Diagnostics'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider tracking-wider transition-all border-0 cursor-pointer ${
                  reportType === type 
                    ? 'bg-[#0D6E56] text-white' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Reports list */}
        <div className="flex flex-col gap-3">
          {filteredReports.map(report => {
            const isDownloading = downloadingId === report.id;
            return (
              <div 
                key={report.id}
                className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-450 flex items-center justify-center text-lg shrink-0">
                    <FiFileText />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800 leading-none">{report.name}</div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{report.id}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>Period: {report.period}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] font-black text-slate-700 block leading-none">{report.size}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase">Generated: {report.date}</span>
                  </div>

                  {isDownloading ? (
                    <div className="w-28 flex flex-col gap-1.5">
                      <div className="flex justify-between text-[9px] font-black text-teal">
                        <span>DOWNLOADING...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-teal transition-all duration-100" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startDownload(report.id)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all border-0 shadow-sm"
                    >
                      <FiDownload /> Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
