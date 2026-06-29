import { useState } from 'react';
import { FiTrendingUp, FiPackage, FiShoppingBag, FiUsers, FiFileText, FiRefreshCw } from 'react-icons/fi';

export default function VendorAnalytics() {
  const [activeTab, setActiveTab] = useState('Sales');

  const tabs = [
    { id: 'Sales', icon: FiTrendingUp },
    { id: 'Medicines', icon: FiPackage },
    { id: 'Orders', icon: FiShoppingBag },
    { id: 'Customers', icon: FiUsers },
    { id: 'Prescriptions', icon: FiFileText },
    { id: 'Returns', icon: FiRefreshCw },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800">Analytics Dashboard</h1>
        <p className="text-sm font-semibold text-slate-500">View detailed reports and insights about your pharmacy.</p>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 pb-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-[#135A5A] border-b-2 border-[#135A5A]'
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="text-sm" />
            {tab.id}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm min-h-[400px]">
        {activeTab === 'Returns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-xs font-black uppercase text-slate-500">Return Rate</span>
              <span className="text-2xl font-black text-rose-500">4.2%</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-xs font-black uppercase text-slate-500">Refund Amount</span>
              <span className="text-2xl font-black text-slate-800">₹12,450</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-black uppercase text-slate-500 mb-2">Most Returned Medicines</span>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>Dolo 650 (Damage in transit)</span>
                <span>12 Returns</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold mt-1">
                <span>Volini Spray (Wrong item sent)</span>
                <span>8 Returns</span>
              </div>
            </div>
          </div>
        )}
        {activeTab !== 'Returns' && (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            {activeTab} analytics will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
}
