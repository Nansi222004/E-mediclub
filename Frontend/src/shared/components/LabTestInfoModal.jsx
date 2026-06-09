import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiCheckCircle, FiDroplet } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LabTestInfoModal({ isOpen, test, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth || {});

  if (!test) return null;

  const handleBooking = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      navigate(`/lab-tests/${test.id}/book`);
    } else {
      navigate('/login', { state: { from: `/lab-tests/${test.id}/book` } });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4"
          >
            <div className="relative w-full max-w-md bg-white md:rounded-[32px] rounded-t-[32px] overflow-hidden shadow-premium max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="relative h-34 md:h-40 bg-gradient-to-br from-teal via-emerald-500 to-forest">
                <img
                  src={test.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80'}
                  alt={test.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
                <div className="absolute left-5 right-14 bottom-4 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] opacity-90">
                    {test.labName || 'Verified Diagnostics'}
                  </p>
                  <h2 className="mt-1 text-lg md:text-xl font-extrabold leading-tight">
                    {test.name}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 text-slate-600 hover:text-slate-800 hover:bg-white border-0 shadow-sm flex items-center justify-center cursor-pointer"
                >
                  <FiX className="text-base" />
                </button>
              </div>

              <div className="px-5 md:px-7 pb-6 md:pb-7 pt-4">
                {test.labName && (
                  <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                    <span className="text-[11px] md:text-[10px] font-black text-teal-dark uppercase tracking-wider truncate">
                      {test.labName}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded">
                        NABL
                      </span>
                      <span className="text-[8px] font-black uppercase bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded">
                        ISO
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mb-1">Parameters</p>
                    <p className="text-[12px] md:text-xs font-extrabold text-slate-800">{test.parameters}</p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-3 border border-teal-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FiClock className="text-teal text-xs" />
                      <p className="text-[8px] text-teal-dark font-black uppercase tracking-wider">Report Time</p>
                    </div>
                    <p className="text-[12px] md:text-xs font-extrabold text-teal-dark">{test.timeframe}</p>
                  </div>
                  <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FiDroplet className="text-sky-600 text-xs" />
                      <p className="text-[8px] text-sky-700 font-black uppercase tracking-wider">Sample</p>
                    </div>
                    <p className="text-[12px] md:text-xs font-extrabold text-sky-700">{test.sampleType || 'Blood'}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <p className="text-[8px] text-emerald-700 font-black uppercase tracking-wider mb-1">Fasting</p>
                    <p className="text-[12px] md:text-xs font-extrabold text-emerald-700">{test.fastingRequired}</p>
                  </div>
                </div>

                {test.description && (
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-2">
                      About This Test
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                )}

                {test.homeCollection && (
                  <div className="flex items-center gap-2 mb-5 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <FiCheckCircle className="text-emerald-600 shrink-0" />
                    <span className="text-[10px] md:text-xs font-black text-emerald-700">
                      Home Sample Collection Available
                    </span>
                  </div>
                )}

                {test.price && (
                  <div className="mb-5 pb-5 border-b border-slate-100 flex items-baseline justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Price</span>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {test.discountPrice ? (
                          <>
                            <span className="text-sm line-through text-slate-400 font-semibold">₹{test.price}</span>
                            <span className="text-lg font-black text-slate-900">₹{test.discountPrice}</span>
                              <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                                {test.discountPercent}% OFF
                              </span>
                          </>
                        ) : (
                          <span className="text-lg font-black text-slate-900">₹{test.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  className="w-full bg-teal hover:bg-teal-dark text-white font-black text-sm py-3 rounded-2xl cursor-pointer border-0 transition-all shadow-sm hover:shadow md:py-2.5"
                >
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
