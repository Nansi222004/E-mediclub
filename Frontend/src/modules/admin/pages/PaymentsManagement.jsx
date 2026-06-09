import React, { useState } from 'react';
import { FiCreditCard, FiSearch, FiDollarSign, FiClock, FiCheck } from 'react-icons/fi';

export default function PaymentsManagement() {
  const [search, setSearch] = useState('');
  
  const transactions = [
    { id: 'TXN-93821', partner: 'HealthRx Pharmacy', rev: 12500, payout: 10625, commission: 1875, status: 'Settled', date: '03 Jun 2026' },
    { id: 'TXN-93822', partner: 'Medlife Labs', rev: 8900, payout: 7300, commission: 1600, status: 'Settled', date: '03 Jun 2026' },
    { id: 'TXN-93823', partner: 'CureWell Clinic', rev: 4900, payout: 3920, commission: 980, status: 'Pending', date: '02 Jun 2026' },
    { id: 'TXN-93824', partner: 'Apollo Diagnostics', rev: 15000, payout: 13200, commission: 1800, status: 'Settled', date: '01 Jun 2026' },
    { id: 'TXN-93825', partner: 'DocPrime', rev: 3100, payout: 2635, commission: 465, status: 'Settled', date: '01 Jun 2026' }
  ];

  const filteredTxns = transactions.filter(t => 
    t.partner.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 bg-[#F5F7FA]">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-805 uppercase tracking-wide leading-none">Payments & Payouts</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
            Audit partner payouts, commissions cuts, and refund settlements logs.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#0D6E56]/10 text-[#0D6E56] font-black uppercase text-[10px] px-3 py-1.5 rounded-xl">
          <FiCreditCard /> Payout Channel Active
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Total Platform Cut</span>
            <h3 className="text-xl font-black text-slate-800 mt-1.5">₹1,86,870</h3>
            <span className="text-[8px] text-emerald-600 font-bold block mt-1">15% average cut rate</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center font-bold">₹</div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Gross Settlements</span>
            <h3 className="text-xl font-black text-slate-800 mt-1.5">₹10,58,930</h3>
            <span className="text-[8px] text-emerald-600 font-bold block mt-1">Direct bank payout logs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 flex items-center justify-center font-bold">💸</div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Pending Refunds</span>
            <h3 className="text-xl font-black text-amber-750 mt-1.5">14 Tickets</h3>
            <span className="text-[8px] text-amber-600 font-bold block mt-1">Awaiting audit approval</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-650 flex items-center justify-center font-bold">⚠️</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-1">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Settlements Log</span>
          <div className="relative w-60">
            <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search partner or txn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 focus:border-teal rounded-xl text-xs font-semibold outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Fulfillment Partner</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Partner Payout</th>
                <th className="py-3 px-4">Commission (Cut)</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Settlement</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-slate-650 divide-y divide-slate-50/50">
              {filteredTxns.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 font-extrabold text-slate-800">{t.id}</td>
                  <td className="py-3 px-4 text-slate-850 font-extrabold">{t.partner}</td>
                  <td className="py-3 px-4 text-slate-700">₹{t.rev.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-700 font-extrabold">₹{t.payout.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-teal font-black">₹{t.commission.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-400 text-[10.5px]">{t.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                      t.status === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {t.status}
                    </span>
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
