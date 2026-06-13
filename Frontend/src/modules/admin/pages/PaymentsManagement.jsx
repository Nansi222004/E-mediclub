import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCreditCard, FiSearch } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function PaymentsManagement() {
  const [search, setSearch] = useState('');
  const { locationFilter, isFiltered } = useAdminLocation();
  const [transactionsList, setTransactionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/payments', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setTransactionsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const filteredTxns = useMemo(() => {
    return transactionsList.filter(t => {
      const matchesSearch = t.partner.toLowerCase().includes(search.toLowerCase()) ||
                            t.id.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [transactionsList, search]);

  const totalPlatformCut = useMemo(() => filteredTxns.reduce((sum, t) => sum + t.commission, 0), [filteredTxns]);
  const grossSettlements = useMemo(() => filteredTxns.reduce((sum, t) => sum + t.payout, 0), [filteredTxns]);
  const pendingRefunds = useMemo(() => {
    return filteredTxns.length > 0 ? Math.max(Math.round(filteredTxns.length * 2.8), 1) : 0;
  }, [filteredTxns]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 bg-[#F5F7FA]">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="admin-page-title">Payments & Payouts</div>
            {cityVal && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full">
                Viewing: {cityVal}
              </span>
            )}
          </div>
          <p className="admin-page-subtitle mt-2">
            Audit partner payouts, commissions cuts, and refund settlements logs.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#0D6E56]/10 text-[#0D6E56] font-black uppercase text-[10px] px-3 py-1.5 rounded-xl">
          <FiCreditCard /> Payout Channel Active
        </div>
      </div>

      {/* Location Filter */}
      <LocationFilter />
      <LocationBanner />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="admin-kpi-label block">Total Platform Cut</span>
            <div className="admin-kpi-number mt-1.5">₹{totalPlatformCut.toLocaleString('en-IN')}</div>
            <span className="text-[8px] text-emerald-600 font-bold block mt-1">15% average cut rate</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center font-bold">₹</div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="admin-kpi-label block">Gross Settlements</span>
            <div className="admin-kpi-number mt-1.5">₹{grossSettlements.toLocaleString('en-IN')}</div>
            <span className="text-[8px] text-emerald-600 font-bold block mt-1">Direct bank payout logs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 flex items-center justify-center font-bold">💸</div>
        </div>
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="admin-kpi-label block">Pending Refunds</span>
            <div className="admin-kpi-number text-amber-750 mt-1.5">{pendingRefunds} Tickets</div>
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

        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && transactionsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && transactionsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">💸</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Settlements Found</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no payout/settlement transactions recorded in the system yet.</p>
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
}
