import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../../shared/components/Logo';
import { motion } from 'framer-motion';
import { FiAlertOctagon, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';

export default function RejectedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rejectionReason, missingDocs } = location.state || {
    rejectionReason: 'Invalid drug license format or details.',
    missingDocs: ['Drug License Certificate', 'Pharmacist Certificate']
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] p-8 border border-slate-100/60 shadow-premium flex flex-col gap-6 text-center"
      >
        <div className="flex justify-center mb-2">
          <Logo showText={true} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl shrink-0 select-none border border-rose-100">
            <FiAlertOctagon />
          </div>
          <div>
            <span className="bg-rose-50 text-rose-600 border border-rose-100/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider leading-none">
              Application Rejected
            </span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mt-3">
              Your Application Requires Attention
            </h3>
          </div>
        </div>

        {/* Reason Panel */}
        <div className="text-left bg-slate-50 border border-slate-100/80 rounded-2xl p-4.5 flex flex-col gap-3">
          <div>
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 mb-1.5">
              Rejection Reason
            </h4>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {rejectionReason}
            </p>
          </div>

          {missingDocs && missingDocs.length > 0 && (
            <div className="mt-2">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 mb-1.5">
                Missing or Invalid Documents
              </h4>
              <ul className="list-disc list-inside text-xs font-semibold text-rose-600 flex flex-col gap-1 pl-1">
                {missingDocs.map((doc, idx) => (
                  <li key={idx} className="capitalize">{doc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions Deck */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-5 mt-2">
          <button
            onClick={() => navigate('/vendor/pharmacy/signup')}
            className="flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
          >
            <FiUploadCloud /> Re-upload
          </button>
          <button
            onClick={() => navigate('/vendor/pharmacy/signup')}
            className="flex items-center justify-center gap-1.5 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale min-h-[46px]"
          >
            <FiRefreshCw /> Resubmit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
