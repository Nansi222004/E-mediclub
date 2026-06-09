import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { requestWithdrawal } from '../store/vendorSlice';
import { 
  FiDollarSign, FiPlus, FiCheckCircle, FiClock, FiActivity, FiFileText, 
  FiCalendar, FiDownload, FiTrendingUp, FiArrowUpRight, FiAward, FiInfo 
} from 'react-icons/fi';

export default function VendorEarnings() {
  const dispatch = useDispatch();
  const { withdrawals, analytics, kycDetails, products } = useSelector(state => state.vendor);
  
  // States
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [timeframe, setTimeframe] = useState("weekly"); // 'daily' | 'weekly' | 'monthly'
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-28");
  const [chartHoverIndex, setChartHoverIndex] = useState(null);

  // Timeframe stats mock calculation
  const timeframeStats = useMemo(() => {
    switch (timeframe) {
      case 'daily':
        return {
          totalSales: 12000,
          profit: 4800,
          orders: 6,
          topCategory: 'Allopathy',
          chartData: [
            { label: '09 AM', value: 800 },
            { label: '11 AM', value: 1600 },
            { label: '01 PM', value: 2400 },
            { label: '03 PM', value: 1200 },
            { label: '05 PM', value: 3100 },
            { label: '07 PM', value: 1900 },
            { label: '09 PM', value: 1000 }
          ]
        };
      case 'monthly':
        return {
          totalSales: 345000,
          profit: 138000,
          orders: 194,
          topCategory: 'Ayurveda',
          chartData: [
            { label: 'Week 1', value: 78000 },
            { label: 'Week 2', value: 92000 },
            { label: 'Week 3', value: 105000 },
            { label: 'Week 4', value: 70000 }
          ]
        };
      case 'weekly':
      default:
        return {
          totalSales: analytics.totalRevenue, // 84200
          profit: Math.round(analytics.totalRevenue * 0.4), // 40% margin estimate
          orders: analytics.ordersCount, // 48
          topCategory: 'Allopathy',
          chartData: analytics.weeklySales.map(s => ({
            label: s.day,
            value: s.sales
          }))
        };
    }
  }, [timeframe, analytics]);

  // Top-selling medicines list derivation
  const topSellingMedicines = useMemo(() => {
    return [
      { name: 'Paracetamol 650mg Tablets', category: 'Allopathy', unitsSold: 142, revenue: 4544, margin: '42%' },
      { name: 'Organic Ashvagandha Daily Tablets', category: 'Ayurveda', unitsSold: 98, revenue: 29302, margin: '50%' },
      { name: 'Amoxicillin 500mg Capsules', category: 'Allopathy', unitsSold: 64, revenue: 7168, margin: '38%' },
      { name: 'Chyawanprash Awaleha Immune', category: 'Ayurveda', unitsSold: 55, revenue: 20900, margin: '45%' },
    ];
  }, []);

  const handleWithdrawRequest = (e) => {
    e.preventDefault();
    if (!withdrawAmt || Number(withdrawAmt) <= 0) return;
    
    dispatch(requestWithdrawal(Number(withdrawAmt)));
    setWithdrawAmt("");
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2500);
  };

  // Mock report downloader
  const triggerReportExport = (format) => {
    let mimeType = "application/json";
    let dataContent = "";
    
    if (format === 'csv') {
      mimeType = "text/csv;charset=utf-8;";
      const headers = ["Label", "Sales Revenue (₹)"];
      const rows = timeframeStats.chartData.map(d => [d.label, d.value]);
      
      dataContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');
    } else {
      dataContent = JSON.stringify({
        storeName: kycDetails.storeName || 'MedPlus Wellness Pharmacy',
        timeframe,
        salesAnalytics: timeframeStats,
        withdrawalsLogs: withdrawals
      }, null, 2);
    }
    
    const blob = new Blob([dataContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `emediclub-sales-statement-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  // Find max chart value to scale height relatively
  const maxChartValue = useMemo(() => {
    const vals = timeframeStats.chartData.map(d => d.value);
    return Math.max(...vals, 1000);
  }, [timeframeStats]);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-5 overflow-hidden">
      
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Sales Report & Analytics</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review store transaction summaries, estimate profit margins, and export payout ledger statements.
          </p>
        </div>

        {/* Dynamic export deck */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => triggerReportExport('csv')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer tap-scale"
          >
            <FiDownload /> Export CSV
          </button>
          <button 
            onClick={() => triggerReportExport('json')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-teal text-white text-xs font-black tracking-wider uppercase rounded-xl hover:bg-teal-dark shadow-sm transition-all cursor-pointer tap-scale"
          >
            <FiFileText /> Export Statement
          </button>
        </div>
      </div>

      {/* Main layout divided into left scrollable dashboard & right quick withdrawals */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Columns: Interactive charts and catalog leaderboards */}
        <div className="lg:col-span-2 overflow-y-auto pr-1 flex flex-col gap-5 custom-scrollbar pb-8">
          
          {/* Filters and time tabs */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Timeframe switch */}
            <div className="flex p-1 bg-slate-50 border border-slate-150/50 rounded-2xl w-full sm:w-auto">
              {['daily', 'weekly', 'monthly'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 sm:flex-initial px-4.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer
                    ${timeframe === t 
                      ? 'bg-teal text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Date range inputs */}
            <div className="flex items-center gap-2 text-2xs font-semibold text-slate-400 uppercase w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-2 py-1">
                <FiCalendar className="text-teal" />
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent outline-none text-slate-600 font-bold"
                />
              </div>
              <span>to</span>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-2 py-1">
                <FiCalendar className="text-teal" />
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent outline-none text-slate-600 font-bold"
                />
              </div>
            </div>

          </div>

          {/* KPI Dashboard cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Sales KPI */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Net Billing</span>
              <span className="text-base font-black text-slate-800 block mt-2">₹{timeframeStats.totalSales.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-[8.5px] font-black text-teal uppercase mt-1">
                <FiArrowUpRight /> +14.8%
              </div>
            </div>

            {/* Profit KPI */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Est. Profit (40%)</span>
              <span className="text-base font-black text-slate-800 block mt-2">₹{timeframeStats.profit.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-[8.5px] font-black text-teal uppercase mt-1">
                <FiTrendingUp /> Margin secured
              </div>
            </div>

            {/* Orders KPI */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Orders Count</span>
              <span className="text-base font-black text-slate-800 block mt-2">{timeframeStats.orders} dispatches</span>
              <div className="flex items-center gap-1 text-[8.5px] font-black text-slate-400 uppercase mt-1">
                Fulfillment: 100%
              </div>
            </div>

            {/* Top Therapy class KPI */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Top Therapy</span>
              <span className="text-base font-black text-slate-800 block mt-2 truncate">{timeframeStats.topCategory}</span>
              <div className="flex items-center gap-1 text-[8.5px] font-black text-teal uppercase mt-1">
                <FiAward /> Best Selling
              </div>
            </div>

          </div>

          {/* Premium Interactive Revenue Charts (HTML/SVG Custom bars uploader) */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <FiActivity className="text-teal" /> Revenue Projection Chart
              </h3>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <FiInfo className="text-teal" /> Hover nodes to inspect earnings
              </span>
            </div>

            {/* SVG Interactive Bars uploader */}
            <div className="h-60 w-full flex items-end justify-between pt-6 px-4 pb-2 bg-slate-50/50 border border-slate-100 rounded-2xl">
              {timeframeStats.chartData.map((data, idx) => {
                const percentage = (data.value / maxChartValue) * 100;
                const isHovered = chartHoverIndex === idx;
                
                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center gap-2 flex-1 group"
                    onMouseEnter={() => setChartHoverIndex(idx)}
                    onMouseLeave={() => setChartHoverIndex(null)}
                  >
                    
                    {/* Tooltip on hover */}
                    <div className={`relative h-6 flex justify-center transition-all duration-200 ${isHovered ? 'opacity-100 -translate-y-1' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      <span className="absolute bottom-1 bg-slate-800 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-premium whitespace-nowrap">
                        ₹{data.value.toLocaleString()}
                      </span>
                    </div>

                    {/* Bar Pillar */}
                    <div className="w-8 sm:w-12 bg-slate-200 rounded-t-xl overflow-hidden h-40 flex items-end cursor-pointer transition-all hover:bg-slate-250">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-t-xl transition-all duration-250
                          ${isHovered ? 'bg-teal-dark' : 'bg-teal'}`}
                      />
                    </div>

                    {/* Node label */}
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-1">{data.label}</span>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Top-Selling Medicines Leaderboard */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4 animate-fade-in">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <FiAward className="text-teal" /> Top Selling Formulations Leaderboard
            </h3>
            
            {/* Desktop Table View */}
            <div className="hidden md:block border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="py-3 px-4">Medicine Formulation</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Units Sold</th>
                    <th className="py-3 px-4 text-right">Net Sales (₹)</th>
                    <th className="py-3 px-4 text-center">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-650 divide-y divide-slate-50">
                  {topSellingMedicines.map((med, index) => (
                    <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-slate-850 font-extrabold">{med.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-500 uppercase text-[10px]">{med.category}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600">{med.unitsSold} units</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-800">₹{med.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center text-teal font-black">{med.margin} OFF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="block md:hidden flex flex-col gap-3">
              {topSellingMedicines.map((med, index) => (
                <div key={index} className="bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-col gap-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-extrabold text-slate-800 leading-snug">{med.name}</span>
                      <span className="w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200/50">
                        {med.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-0.5 border-t border-slate-150/50 pt-2">
                    <span>Sold: <span className="font-extrabold text-slate-800">{med.unitsSold} u</span></span>
                    <span>Sales: <span className="font-black text-slate-800">₹{med.revenue}</span></span>
                    <span className="text-teal font-black text-[9px] uppercase tracking-wider">{med.margin}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column: Banking payouts and withdrawal form */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-5 custom-scrollbar pb-8">
          
          {/* Withdrawal trigger form */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <FiPlus className="text-teal" /> Disburse Store Revenue
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1">
              Transfer available balances immediately to your verified coordinates.
            </p>

            <form onSubmit={handleWithdrawRequest} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Amount to Withdraw</label>
                  <span className="text-[10px] text-teal font-extrabold uppercase">Max: ₹24,200</span>
                </div>
                <input 
                  type="number" 
                  required
                  min="500"
                  max="24200"
                  placeholder="e.g. 5000"
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-teal"
                />
                <span className="text-[8.5px] text-slate-400 font-semibold uppercase mt-0.5">Disbursal limit thresholds: ₹500 - ₹24,200</span>
              </div>

              {/* Remittance coordinates details */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 text-2xs font-semibold text-slate-600">
                <span className="text-slate-400 font-black uppercase tracking-wider block border-b border-slate-150/50 pb-1.5">remittance details</span>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500 font-bold">Banking Partner</span>
                  <span className="font-extrabold text-slate-700">{kycDetails.bankName || 'HDFC Bank'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500 font-bold">Remittance Account</span>
                  <span className="font-extrabold text-slate-700">*****{kycDetails.accountNo ? kycDetails.accountNo.slice(-4) : '6543'}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-premium transition-all cursor-pointer tap-scale"
              >
                Confirm Disbursement
              </button>

              {successMsg && (
                <span className="flex items-center justify-center gap-1 text-teal font-extrabold text-[10px] animate-bounce mt-1 uppercase tracking-wider">
                  <FiCheckCircle /> Remittance request submitted successfully!
                </span>
              )}
            </form>

          </div>

          {/* Withdrawal Logs */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <FiClock className="text-teal" /> Remittance ledger logs
            </h3>
            
            <div className="flex flex-col gap-3">
              {withdrawals.map((w) => (
                <div key={w.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-slate-850 block">{w.id}</span>
                    <span className="text-[9.5px] text-slate-450 mt-0.5 block font-medium">{w.date} • {w.bankAccount}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-850 block">₹{w.amount.toLocaleString()}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider mt-1 border
                      ${w.status === 'approved' 
                        ? 'bg-teal-light/20 text-teal border-teal/10' 
                        : 'bg-gold-light/25 text-gold-dark border-gold/15'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
