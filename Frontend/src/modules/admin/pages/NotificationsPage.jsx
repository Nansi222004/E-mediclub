import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiActivity, FiUsers, FiShoppingBag, FiCreditCard } from 'react-icons/fi';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { recentActivities } = useSelector(state => state.admin);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 rounded-xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors tap-scale shadow-sm"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <div>
          <div className="text-xl font-extrabold text-slate-800 leading-none">Notifications Center</div>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Monitor real-time system alerts, transactions, and audit logs.
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden p-6 max-w-4xl">
        {recentActivities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {recentActivities.map((act) => {
              // Custom badge and icon mapping based on activity type
              let badgeColor = 'bg-teal-light text-teal';
              let Icon = FiActivity;
              
              if (act.type === 'vendor') {
                badgeColor = 'bg-gold-light text-gold-dark';
                Icon = FiUsers;
              } else if (act.type === 'order') {
                badgeColor = 'bg-emerald-50 text-emerald-600';
                Icon = FiShoppingBag;
              } else if (act.type === 'payout') {
                badgeColor = 'bg-coral-light text-coral';
                Icon = FiCreditCard;
              }

              return (
                <div 
                  key={act.id} 
                  className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-all flex items-start gap-4"
                >
                  {/* Icon Wrapper */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeColor}`}>
                    <Icon className="text-lg" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {act.text}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {act.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {act.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FiBell className="text-2xl text-slate-350" />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase">No system notifications found.</p>
          </div>
        )}
      </div>

    </div>
  );
}
