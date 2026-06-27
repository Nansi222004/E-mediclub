import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { requestWithdrawal } from '../store/vendorSlice';
import { 
  getTodayRevenue, 
  getMonthlyRevenue, 
  mockOrders 
} from './pharmacyVendorMockData';
import { 
  FiDollarSign, FiCheckCircle, FiActivity, FiFileText, FiDownload, FiTrendingUp,
  FiList, FiRefreshCw
} from 'react-icons/fi';

export default function VendorEarnings() {
  const dispatch = useDispatch();
  const { withdrawals, analytics, kycDetails } = useSelector(state => state.vendor || { withdrawals: [], analytics: { totalRevenue: 84200, weeklySales: [] }, kycDetails: {} });
  
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  // States
  const [activeTab, setActiveTab] = useState('earnings'); // 'earnings' | 'transactions' | 'settlements' | 'refunds' | 'invoices'
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [timeframe, setTimeframe] = useState("weekly");

  useEffect(() => {
    if (filter === 'today') {
      setTimeframe('daily');
    } else if (filter === 'week') {
      setTimeframe('weekly');
    } else if (filter === 'month') {
      setTimeframe('monthly');
    }
  }, [filter]);

  const transactions = useMemo(() => {
    return mockOrders.map((o, idx) => ({
      txId: `TXN-90${800 + idx}`,
      orderId: o.id,
      customer: o.customerName,
      date: o.orderDate,
      amount: o.totalAmount,
      mode: o.paymentMethod.includes('UPI') ? 'UPI' : 'Card',
      status: o.paymentStatus === 'Paid' ? 'Settled' : (o.paymentStatus === 'Refunded' ? 'Refunded' : 'Pending')
    }));
  }, []);

  const displaySalesData = useMemo(() => {
    if (timeframe === 'daily') {
      const total = getTodayRevenue();
      return [
        { label: '9 AM', sales: Math.round(total * 0.15) },
        { label: '12 PM', sales: Math.round(total * 0.25) },
        { label: '3 PM', sales: Math.round(total * 0.20) },
        { label: '6 PM', sales: Math.round(total * 0.30) },
        { label: '9 PM', sales: Math.round(total * 0.10) }
      ];
    }
    if (timeframe === 'monthly') {
      const total = getMonthlyRevenue();
      return [
        { label: 'Wk 1', sales: Math.round(total * 0.22) },
        { label: 'Wk 2', sales: Math.round(total * 0.28) },
        { label: 'Wk 3', sales: Math.round(total * 0.24) },
        { label: 'Wk 4', sales: Math.round(total * 0.26) }
      ];
    }
    // all time or weekly
    const total = mockOrders.filter(o => o.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
    return [
      { label: 'Mon', sales: Math.round(total * 0.12) },
      { label: 'Tue', sales: Math.round(total * 0.15) },
      { label: 'Wed', sales: Math.round(total * 0.10) },
      { label: 'Thu', sales: Math.round(total * 0.18) },
      { label: 'Fri', sales: Math.round(total * 0.22) },
      { label: 'Sat', sales: Math.round(total * 0.13) },
      { label: 'Sun', sales: Math.round(total * 0.10) }
    ];
  }, [timeframe]);

  const displayTransactions = useMemo(() => {
    if (timeframe === 'daily') {
      const todayStr = new Date().toISOString().substring(0, 10);
      return transactions.filter(t => t.date === todayStr);
    }
    if (timeframe === 'monthly') {
      const currentMonth = new Date().toISOString().substring(0, 7);
      return transactions.filter(t => t.date.startsWith(currentMonth));
    }
    return transactions;
  }, [timeframe, transactions]);

  // Mock data for settlements
  const settlements = [
    { batchId: 'SET-9901', amount: 32000, date: '2026-06-15', status: 'Processed', utr: 'UTR98124091240' },
    { batchId: 'SET-9900', amount: 24500, date: '2026-06-08', status: 'Processed', utr: 'UTR98122394829' },
    { batchId: 'SET-9899', amount: 18400, date: '2026-06-01', status: 'Processed', utr: 'UTR98120923849' },
    { batchId: 'SET-9898', amount: 12900, date: '2026-05-25', status: 'Processed', utr: 'UTR98118239482' }
  ];

  // Mock data for refunds
  const refunds = [
    { refundId: 'RFD-1021', orderId: '#EMC-89207', customer: 'Vikram Sharma', amount: 1100, date: '2026-06-13', status: 'Success', reason: 'Customer cancelled order before dispatch' },
    { refundId: 'RFD-1020', orderId: '#EMC-89192', customer: 'Karan Singh', amount: 450, date: '2026-06-10', status: 'Success', reason: 'Damaged item delivery' }
  ];

  // Mock data for invoices
  const invoices = [
    { invoiceId: 'INV-2026-06', period: 'June 1 - June 15, 2026', totalOrders: 32, taxableAmount: 38400, gst: 4608, totalInvoice: 43008, date: '2026-06-16' },
    { invoiceId: 'INV-2026-05', period: 'May 1 - May 31, 2026', totalOrders: 58, taxableAmount: 64200, gst: 7704, totalInvoice: 71904, date: '2026-06-01' },
    { invoiceId: 'INV-2026-04', period: 'April 1 - April 30, 2026', totalOrders: 44, taxableAmount: 49800, gst: 5976, totalInvoice: 55776, date: '2026-05-01' }
  ];

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

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 flex flex-col gap-5">
      
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-800 leading-none">
            {timeframe === 'daily' ? 'Revenue Today' : timeframe === 'monthly' ? 'Revenue This Month' : 'Total Revenue'}
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor earnings ledger, check order payments, track banking settlements, and retrieve compliance invoices.
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-slate-100 shrink-0">
        {[
          { id: 'earnings', name: 'Earnings', icon: FiDollarSign },
          { id: 'transactions', name: 'Transactions', icon: FiList },
          { id: 'settlements', name: 'Settlements', icon: FiCheckCircle },
          { id: 'refunds', name: 'Refunds', icon: FiRefreshCw },
          { id: 'invoices', name: 'Invoices', icon: FiFileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-0 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-[#135A5A] text-white shadow-sm' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-850'
            }`}
          >
            <tab.icon className="text-sm" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Tab Body */}
      <div className="flex-1 flex flex-col gap-5">
        
        {/* TAB 1: EARNINGS VIEW */}
        {activeTab === 'earnings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Main Stats Left */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Revenue Card */}
                <div className="bg-[#135A5A] text-white rounded-3xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between h-36">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">
                      {timeframe === 'daily' ? 'Revenue Today' : timeframe === 'monthly' ? 'Revenue This Month' : 'Total Net Revenue'}
                    </span>
                    <FiDollarSign className="text-lg text-teal-100" />
                  </div>
                  <div className="relative z-10 mt-auto">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                      ₹{timeframe === 'daily' 
                        ? getTodayRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 }) 
                        : timeframe === 'monthly' 
                          ? getMonthlyRevenue().toLocaleString('en-IN', { minimumFractionDigits: 2 }) 
                          : mockOrders.filter(o => o.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-[9px] font-semibold text-teal-100 mt-1 flex items-center gap-1">
                      <FiTrendingUp className="text-emerald-300" /> 
                      {timeframe === 'daily' 
                        ? '+12.0% growth today' 
                        : timeframe === 'monthly' 
                          ? '+8.4% growth this month' 
                          : '+15.4% growth compared to last month'}
                    </p>
                  </div>
                </div>

                {/* Available for Payout Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Balance</span>
                    <FiCheckCircle className="text-lg text-[#135A5A]" />
                  </div>
                  <div className="mt-auto">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-slate-805">₹24,200.00</h2>
                    <p className="text-[9px] font-semibold text-slate-450 mt-1">Ready for instant bank disburse</p>
                  </div>
                </div>
              </div>

              {/* Performance log */}
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center justify-between gap-1.5 w-full">
                  <span className="flex items-center gap-1.5">
                    <FiActivity className="text-[#135A5A]" /> 
                    {timeframe === 'daily' ? 'Daily Sales Graph' : timeframe === 'monthly' ? 'Monthly Sales Graph' : 'Weekly Sales Graph'}
                  </span>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 shrink-0">
                    {['daily', 'weekly', 'monthly'].map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => setTimeframe(t)}
                        className={`px-2.5 py-1 text-[9px] font-black rounded-md transition-all cursor-pointer border-0 ${timeframe === t ? 'bg-white text-[#135A5A] shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'}`}
                      >
                        {t === 'daily' ? 'Today' : t === 'weekly' ? 'Weekly' : 'Monthly'}
                      </button>
                    ))}
                  </div>
                </h3>
                <div className="h-48 w-full flex items-end justify-between pt-6 px-4 pb-2 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  {displaySalesData.map((data, idx) => {
                    const maxVal = timeframe === 'daily' ? 3000 : 35000;
                    const percentage = (data.sales / maxVal) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="w-6 sm:w-10 bg-slate-200 rounded-t-lg overflow-hidden h-28 flex items-end">
                          <div style={{ height: `${percentage}%` }} className="w-full bg-[#135A5A] rounded-t-lg group-hover:bg-[#0F4A4A] transition-colors" />
                        </div>
                        <span className="text-[9px] text-slate-405 font-black uppercase tracking-wider">{data.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Withdrawals Right */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Disburse Store Revenue</h3>
                <form onSubmit={handleWithdrawRequest} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Amount to Withdraw</label>
                    <input 
                      type="number" 
                      required
                      min="500"
                      max="24200"
                      placeholder="e.g. 5000"
                      value={withdrawAmt}
                      onChange={(e) => setWithdrawAmt(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-[#135A5A]"
                    />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 text-2xs font-semibold text-slate-650">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-bold">Banking Partner</span>
                      <span className="font-extrabold text-slate-800">{kycDetails.bankName || 'HDFC Bank'}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400 font-bold">Remittance Account</span>
                      <span className="font-extrabold text-slate-800">*****{kycDetails.accountNo ? kycDetails.accountNo.slice(-4) : '9876'}</span>
                    </div>
                  </div>
                  <button type="submit" className="py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-premium transition-all">
                    Confirm Disbursement
                  </button>
                  {successMsg && (
                    <span className="flex items-center justify-center gap-1.5 text-teal-700 font-extrabold text-[10px] animate-bounce tracking-wide uppercase">
                      <FiCheckCircle /> Remittance request submitted successfully!
                    </span>
                  )}
                </form>
              </div>

              {/* Withdrawals Logs */}
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest">Remittance Logs</h3>
                <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {withdrawals.map((w, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-slate-800 block">{w.id || `WD-${idx + 100}`}</span>
                        <span className="text-[9.5px] text-slate-400 font-medium block">{w.date} • {w.bankAccount || 'HDFC Bank'}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 block">₹{w.amount.toLocaleString()}</span>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-150 mt-1">{w.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSACTIONS VIEW */}
        {activeTab === 'transactions' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Transaction ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Order ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Details</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Date</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Mode</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Total Amount</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map(txn => (
                    <tr key={txn.txId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500 font-mono">{txn.txId}</td>
                      <td className="p-4 text-xs font-bold text-slate-800 font-mono">{txn.orderId}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-850">{txn.customer}</td>
                      <td className="p-4 text-xs font-semibold text-slate-600">{txn.date}</td>
                      <td className="p-4 text-xs font-bold text-slate-500 uppercase">{txn.mode}</td>
                      <td className="p-4 text-xs font-black text-slate-805">₹{txn.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                          txn.status === 'Settled' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          txn.status === 'Refunded' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTLEMENTS VIEW */}
        {activeTab === 'settlements' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Settlement ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">UTR / Reference No</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Total Net Amount</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Processed Date</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Transfer Status</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map(set => (
                    <tr key={set.batchId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-800 font-mono">{set.batchId}</td>
                      <td className="p-4 text-xs font-bold text-slate-500 font-mono">{set.utr}</td>
                      <td className="p-4 text-xs font-black text-[#135A5A]">₹{set.amount.toLocaleString('en-IN')}.00</td>
                      <td className="p-4 text-xs font-semibold text-slate-600">{set.date}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {set.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REFUNDS VIEW */}
        {activeTab === 'refunds' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Refund ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Order ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Details</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Refund Reason</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Date Issued</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Refund Amount</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Refund Status</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map(ref => (
                    <tr key={ref.refundId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500 font-mono">{ref.refundId}</td>
                      <td className="p-4 text-xs font-bold text-slate-805 font-mono">{ref.orderId}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-850">{ref.customer}</td>
                      <td className="p-4 text-xs font-semibold text-slate-600 truncate max-w-[200px]" title={ref.reason}>{ref.reason}</td>
                      <td className="p-4 text-xs font-semibold text-slate-500">{ref.date}</td>
                      <td className="p-4 text-xs font-black text-rose-600 font-semibold">₹{ref.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES VIEW */}
        {activeTab === 'invoices' && (
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Invoice ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Billing Cycle Period</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Orders Fulfilled</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Taxable value</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">GST (18%)</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Invoice Total</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.invoiceId} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 text-xs font-black text-slate-805">{inv.invoiceId}</td>
                      <td className="p-4 text-xs font-semibold text-slate-650">{inv.period}</td>
                      <td className="p-4 text-xs font-semibold text-slate-600 text-center">{inv.totalOrders} items</td>
                      <td className="p-4 text-xs font-semibold text-slate-700 text-right">₹{inv.taxableAmount.toLocaleString('en-IN')}.00</td>
                      <td className="p-4 text-xs font-semibold text-slate-700 text-right">₹{inv.gst.toLocaleString('en-IN')}.00</td>
                      <td className="p-4 text-xs font-black text-slate-850 text-right">₹{inv.totalInvoice.toLocaleString('en-IN')}.00</td>
                      <td className="p-4 text-center">
                        <button className="px-3 py-1.5 bg-slate-50 hover:bg-[#135A5A] hover:text-white text-slate-650 text-xs font-bold uppercase tracking-wider border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 mx-auto">
                          <FiDownload className="text-xs" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
