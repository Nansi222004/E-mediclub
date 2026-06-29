import { useState } from 'react';
import { FiHome, FiFileText, FiCalendar, FiCreditCard, FiBell, FiDownload } from 'react-icons/fi';

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState('Store Details');

  const tabs = [
    { id: 'Store Details', icon: FiHome },
    { id: 'GST Reports', icon: FiFileText },
    { id: 'Holiday Management', icon: FiCalendar },
    { id: 'Bank & Payouts', icon: FiCreditCard },
    { id: 'Notification Preferences', icon: FiBell },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800">Settings</h1>
        <p className="text-sm font-semibold text-slate-500">Manage store details, reports, holidays, and payouts.</p>
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
        {activeTab === 'GST Reports' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">GST Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-bold text-sm">
                <FiDownload /> Monthly Report
              </button>
              <button className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors font-bold text-sm">
                <FiDownload /> Quarterly Report
              </button>
              <button className="flex items-center justify-center gap-2 bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 hover:bg-red-100 transition-colors font-bold text-sm col-span-2">
                <FiFileText /> Download PDF
              </button>
              <button className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-colors font-bold text-sm col-span-2">
                <FiFileText /> Download Excel
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'Holiday Management' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">Store Holidays</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-sm font-black text-slate-700 mb-2">Operating Hours</h4>
              <p className="text-xs font-semibold text-slate-500">Mon-Sat: 9:00 AM - 10:00 PM</p>
              <p className="text-xs font-semibold text-slate-500">Sunday: 10:00 AM - 5:00 PM</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 cursor-pointer hover:bg-rose-100 transition-colors">
              <h4 className="text-sm font-black text-rose-600 mb-1">Emergency Closure</h4>
              <p className="text-xs font-semibold text-rose-400">Temporarily close store for today</p>
            </div>
          </div>
        )}

        {activeTab === 'Bank & Payouts' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">Bank Details</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">Bank Account</span>
                <span className="text-xs font-black text-slate-700">XXXX-XXXX-1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-slate-500">UPI ID</span>
                <span className="text-xs font-black text-slate-700">store@upi</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Commission Breakdown</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-slate-600">Platform Fee: 5% per order</span>
            </div>
          </div>
        )}

        {activeTab === 'Notification Preferences' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">Preferences</h3>
            <div className="flex flex-col gap-2">
              {['SMS Notifications', 'Email Notifications', 'Push Notifications', 'Order Alerts', 'Prescription Alerts'].map(pref => (
                <label key={pref} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-teal rounded focus:ring-teal" />
                  <span className="text-sm font-bold text-slate-700">{pref}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Store Details' && (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            Store Profile Information...
          </div>
        )}
      </div>
    </div>
  );
}
