import { useState } from 'react';
import { FiTag, FiGift, FiImage, FiHeart, FiCreditCard, FiStar } from 'react-icons/fi';

export default function VendorPromotions() {
  const [activeTab, setActiveTab] = useState('Discounts');

  const tabs = [
    { id: 'Discounts', icon: FiTag },
    { id: 'Coupons', icon: FiGift },
    { id: 'Banners', icon: FiImage },
    { id: 'Loyalty Offers', icon: FiHeart },
    { id: 'Wallet Cashback', icon: FiCreditCard },
    { id: 'Festival Campaigns', icon: FiStar },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-slate-800">Promotions & Offers</h1>
        <p className="text-sm font-semibold text-slate-500">Manage discounts, coupons, banners, and cashback campaigns.</p>
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
        {activeTab === 'Festival Campaigns' && (
          <div className="flex flex-col gap-4 max-w-md">
            <h3 className="text-lg font-bold text-slate-800">Active Campaigns</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-sm font-black text-amber-600 block mb-1">Diwali Sale</span>
              <span className="text-xs font-semibold text-slate-500">20% off on wellness products</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-sm font-black text-teal block mb-1">First Order Discount</span>
              <span className="text-xs font-semibold text-slate-500">Flat ₹100 off on first purchase</span>
            </div>
          </div>
        )}
        {activeTab !== 'Festival Campaigns' && (
          <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-sm">
            {activeTab} content will be displayed here.
          </div>
        )}
      </div>
    </div>
  );
}
