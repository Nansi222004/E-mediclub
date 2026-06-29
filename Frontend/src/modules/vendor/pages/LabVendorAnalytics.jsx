import { useState, useEffect } from 'react';
import { FiPieChart, FiTrendingUp, FiUsers, FiDollarSign, FiActivity, FiFileText } from 'react-icons/fi';

export default function LabVendorAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Dummy analytics data
    setTimeout(() => {
      setStats({
        revenue: '₹ 1,45,000',
        revenueGrowth: '+12.5%',
        totalBookings: 342,
        bookingsGrowth: '+5.2%',
        pendingReports: 24,
        activeAgents: 8,
        topPackages: [
          { name: 'Comprehensive Full Body Checkup', count: 120, revenue: '₹ 2,40,000' },
          { name: 'Basic Lipid Profile', count: 85, revenue: '₹ 42,500' },
          { name: 'Diabetes Screening', count: 65, revenue: '₹ 32,500' }
        ],
        recentFeedback: [
          { user: 'Rahul S.', rating: 5, comment: 'Home collection was very prompt and hygienic.' },
          { user: 'Priya K.', rating: 4, comment: 'Good service, reports came on time.' }
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

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
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Lab Analytics</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor your lab's performance and growth metrics.
          </p>
        </div>
        <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 tap-scale">
          <FiFileText className="text-sm" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-100">
            <FiDollarSign className="text-xl" />
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monthly Revenue</span>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.revenue}</h3>
              <span className="text-xs font-bold text-emerald-500 mb-0.5">{stats.revenueGrowth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner border border-blue-100">
            <FiActivity className="text-xl" />
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Bookings</span>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.totalBookings}</h3>
              <span className="text-xs font-bold text-emerald-500 mb-0.5">{stats.bookingsGrowth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner border border-amber-100">
            <FiPieChart className="text-xl" />
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pending Reports</span>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.pendingReports}</h3>
              <span className="text-xs font-bold text-slate-400 mb-0.5">To Upload</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner border border-purple-100">
            <FiUsers className="text-xl" />
          </div>
          <div className="mt-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Agents</span>
            <div className="flex items-end gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800 leading-none">{stats.activeAgents}</h3>
              <span className="text-xs font-bold text-slate-400 mb-0.5">On Duty</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Top Performing Packages</h3>
            <FiTrendingUp className="text-teal-500" />
          </div>
          <div className="flex flex-col gap-4">
            {stats.topPackages.map((pkg, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-slate-600 shadow-sm border border-slate-200">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{pkg.name}</h4>
                    <span className="text-[10px] font-bold text-slate-500">{pkg.count} bookings</span>
                  </div>
                </div>
                <span className="text-sm font-black text-teal-700">{pkg.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Recent Customer Feedback</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">Live</span>
          </div>
          <div className="flex flex-col gap-4">
            {stats.recentFeedback.map((fb, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">{fb.user}</span>
                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-500 italic">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
