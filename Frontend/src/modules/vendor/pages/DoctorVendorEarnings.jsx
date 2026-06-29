import { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiDownloadCloud, FiCreditCard } from 'react-icons/fi';

export default function DoctorVendorEarnings() {
  const { tab } = useParams();
  const activeTab = tab || 'revenue';

  const [transactions] = useState([
    { id: 'TXN-9021', date: '2026-06-25', description: 'Consultation - Rahul Sharma', amount: 500, status: 'Completed' },
    { id: 'TXN-9022', date: '2026-06-26', description: 'Consultation - Priya Verma', amount: 800, status: 'Completed' },
    { id: 'TXN-9023', date: '2026-06-27', description: 'Consultation - Amit Singh', amount: 1000, status: 'Pending' }
  ]);

  const [withdrawals] = useState([
    { id: 'WD-101', date: '2026-06-15', amount: 5000, method: 'Bank Transfer (xxxx-1234)', status: 'Success' },
    { id: 'WD-102', date: '2026-06-25', amount: 3500, method: 'Bank Transfer (xxxx-1234)', status: 'Processing' }
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Earnings</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Track your revenue, view transactions, and manage withdrawals.
          </p>
        </div>
      </div>

      <div className="flex bg-slate-50 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar border border-slate-100">
        {[
          { id: 'revenue', label: 'Revenue' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'withdrawals', label: 'Withdrawals' }
        ].map(t => (
          <NavLink
            key={t.id}
            to={`/vendor/doctor/earnings/${t.id}`}
            className={({ isActive }) => `flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap tap-scale border-0 cursor-pointer text-center ${
              isActive || (activeTab === t.id) ? 'bg-teal text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 bg-transparent'
            }`}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
        
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-5 rounded-2xl">
              <div className="flex items-center gap-3 text-teal-600 mb-2">
                <FiDollarSign className="text-xl" />
                <span className="text-xs font-black uppercase tracking-wider">Available Balance</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800">₹12,450</h2>
              <button className="mt-4 w-full py-2 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border-0 hover:bg-teal-dark transition-colors">
                Request Withdrawal
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <FiTrendingUp className="text-xl" />
                <span className="text-xs font-black uppercase tracking-wider">This Month</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800">₹45,800</h2>
              <span className="text-[10px] font-bold text-emerald-500 mt-1 block">+12.5% from last month</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <FiCreditCard className="text-xl" />
                <span className="text-xs font-black uppercase tracking-wider">Total Lifetime</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800">₹3,42,000</h2>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-600">{txn.id}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{txn.date}</td>
                    <td className="p-4 text-xs font-semibold text-slate-700">{txn.description}</td>
                    <td className="p-4 text-xs font-black text-teal text-right">₹{txn.amount}</td>
                    <td className="p-4 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto animate-fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="p-4 rounded-tl-xl">Withdrawal ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(wd => (
                  <tr key={wd.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-slate-600">{wd.id}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{wd.date}</td>
                    <td className="p-4 text-xs font-semibold text-slate-700">{wd.method}</td>
                    <td className="p-4 text-xs font-black text-slate-800 text-right">₹{wd.amount}</td>
                    <td className="p-4 text-right">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        wd.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {wd.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
