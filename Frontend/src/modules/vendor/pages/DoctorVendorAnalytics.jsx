import { FiTrendingUp, FiDollarSign, FiUsers, FiActivity, FiDownload, FiCalendar } from 'react-icons/fi';

export default function DoctorVendorAnalytics() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Earnings & Analytics</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Track your revenue, consultation volume, and growth.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer">
            <FiCalendar /> This Month
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer border-0">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-teal-light/20 text-teal flex items-center justify-center">
              <FiDollarSign className="text-xl" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
              <FiTrendingUp /> +15%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">₹45,500</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Earnings</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FiUsers className="text-xl" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
              <FiTrendingUp /> +8%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">142</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Consultations</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <FiActivity className="text-xl" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">4.8/5</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Avg Patient Rating</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <span className="font-black">Rx</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">128</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Prescriptions Issued</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Revenue Breakdown */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Revenue Split</h3>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Online Video Calls</span>
                <span className="text-teal font-black">₹28,500</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal rounded-full w-[65%]" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>In-Clinic Visits</span>
                <span className="text-indigo-500 font-black">₹17,000</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[35%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Recent Transactions</h3>
            <button className="text-[10px] text-teal font-black uppercase tracking-wider bg-transparent border-0 cursor-pointer">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { id: 'TXN-0992', type: 'Online Call - Rahul S.', amount: '+₹500', date: 'Today, 10:30 AM', status: 'Credited' },
              { id: 'TXN-0991', type: 'In-Clinic - Priya V.', amount: '+₹800', date: 'Today, 11:45 AM', status: 'Credited' },
              { id: 'TXN-0990', type: 'Bank Withdrawal', amount: '-₹10,000', date: 'Yesterday, 04:00 PM', status: 'Processed' },
            ].map(txn => (
              <div key={txn.id} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${txn.amount.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    <FiDollarSign />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{txn.type}</h4>
                    <span className="text-[9px] font-bold text-slate-400">{txn.date} • {txn.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black block ${txn.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {txn.amount}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">{txn.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
