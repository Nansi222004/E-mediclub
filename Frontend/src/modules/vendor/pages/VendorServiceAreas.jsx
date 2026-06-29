import { useState } from 'react';
import { FiMapPin, FiTruck, FiMap, FiDollarSign, FiClock } from 'react-icons/fi';

export default function VendorServiceAreas() {
  const [activeTab, setActiveTab] = useState('Store Location');

  const tabs = [
    { id: 'Store Location', icon: FiMapPin },
    { id: 'Delivery Zones', icon: FiMap },
    { id: 'Coverage Requests', icon: FiTruck },
    { id: 'Delivery Charges', icon: FiDollarSign },
    { id: 'Service Timings', icon: FiClock },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800">Service Areas</h1>
        <p className="text-sm font-semibold text-slate-500">Manage store location, delivery zones, and timings.</p>
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
        {activeTab === 'Delivery Charges' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">Delivery Charges Configuration</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">0 - 3 KM</span>
              <span className="text-sm font-black text-emerald-600">Free</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">3 - 7 KM</span>
              <span className="text-sm font-black text-slate-800">₹30</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">7 - 15 KM</span>
              <span className="text-sm font-black text-slate-800">₹50</span>
            </div>
          </div>
        )}
        {activeTab !== 'Delivery Charges' && (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            {activeTab} content will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
}
