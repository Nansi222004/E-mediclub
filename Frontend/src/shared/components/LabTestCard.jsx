import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiInfo, FiActivity } from 'react-icons/fi';
import LabTestInfoModal from './LabTestInfoModal';

export default function LabTestCard({ test }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth || {});
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleBookingRedirect = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      navigate(`/lab-tests/${test.id}/book`);
    } else {
      navigate('/login', { state: { from: `/lab-tests/${test.id}/book` } });
    }
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfoModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-teal/30 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 flex flex-col justify-between select-none relative overflow-hidden transition-all duration-300 group">
        <div className="mb-4 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-slate-50 border border-slate-100 relative">
          <img
            src={test.image || 'https://images.unsplash.com/photo-1579154261908-5f9c1c5f0d6d?auto=format&fit=crop&w=900&q=80'}
            alt={test.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
          {test.tag && (
            <span className="absolute top-3 right-3 bg-white/95 text-teal text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              {test.tag}
            </span>
          )}
        </div>

        <div>
          {test.labName && (
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                type="button"
                onClick={handleInfoClick}
                className="relative z-20 text-[10px] text-teal-dark hover:text-teal hover:underline font-black uppercase tracking-wider bg-transparent border-0 p-0 cursor-pointer text-left"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-sm">🏢</span>
                  <span className="truncate">{test.labName}</span>
                </span>
              </button>
              <div className="flex gap-1.5 shrink-0">
                <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded" title="NABL Certified Clinic">
                  NABL
                </span>
                <span className="text-[8px] font-black uppercase bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded" title="ISO 9001:2015 Approved">
                  ISO
                </span>
              </div>
            </div>
          )}

          <h4 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 max-w-[90%] group-hover:text-teal transition-colors">
            {test.name}
          </h4>

          <span className="text-[10.5px] text-teal font-black uppercase tracking-wider block mt-1.5 flex items-center gap-1.5">
            <FiActivity className="text-teal" />
            {test.parameters}
          </span>

          <div className="flex flex-col gap-1.5 mt-3.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              ⏱️ {test.timeframe}
            </p>
            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              🥣 {test.fastingRequired}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="flex flex-col">
            {test.discountPrice ? (
              <>
                <div className="flex items-center gap-1.5 min-h-[16px]">
                  <span className="text-xs text-slate-400 line-through font-semibold leading-none">
                    ₹{test.price}
                  </span>
                  <span className="text-[10px] text-rose-600 font-black bg-rose-50 px-1.5 py-0.5 rounded">
                    {test.discountPercent}% OFF
                  </span>
                </div>
                <span className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                  ₹{test.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                ₹{test.price}
              </span>
            )}
            {test.homeCollection ? (
              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold mt-1.5 inline-block w-fit uppercase tracking-wider">
                🏠 Home Sample Collection
              </span>
            ) : (
              <span className="text-[9px] text-transparent select-none px-2 py-0.5 rounded-md font-bold mt-1.5 inline-block w-fit uppercase tracking-wider">
                &nbsp;
              </span>
            )}
          </div>

          <div className="flex w-full sm:w-auto items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleInfoClick}
              className="relative z-20 w-full sm:w-auto px-3.5 py-2.5 sm:py-2 bg-slate-50 hover:bg-slate-100 text-[9px] font-black text-slate-650 hover:text-teal rounded-full shadow-sm cursor-pointer border-0 uppercase tracking-wider flex items-center justify-center gap-0.5 min-h-[44px] sm:min-h-[36px] outline-none flex-1 sm:flex-initial"
            >
              <FiInfo className="text-[10px]" />
              Info
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleBookingRedirect}
              className="relative z-20 w-full sm:w-auto bg-forest hover:bg-forest-dark text-white font-bold text-xs px-4 py-2.5 sm:py-2 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer border-0 min-h-[44px] sm:min-h-[36px] outline-none flex-1 sm:flex-initial"
            >
              <FiCalendar className="w-4 h-4 shrink-0" />
              <span>BOOK NOW</span>
            </motion.button>
          </div>
        </div>
      </div>

      <LabTestInfoModal
        isOpen={showInfoModal}
        test={test}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  );
}
