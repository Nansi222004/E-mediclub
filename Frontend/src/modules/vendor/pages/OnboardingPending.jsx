import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vendorLogout, vendorUpdateKycStatus } from '../../auth/vendor/store/vendorAuthSlice';
import Logo from '../../../shared/components/Logo';
import { FiShield, FiClock, FiCheck, FiRefreshCw, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function OnboardingPending() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorUser } = useSelector(state => state.vendorAuth || { vendorUser: null });

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(vendorLogout());
    navigate('/vendor/auth');
  };

  // Simulate KYC Approval for testing/demonstration convenience
  const handleCheckStatus = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(vendorUpdateKycStatus('verified'));
      navigate('/vendor/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] p-8 border border-slate-100/60 shadow-premium relative overflow-hidden text-center flex flex-col gap-6"
      >
        {/* Decorative highlights */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gold-light/20 rounded-full filter blur-xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-teal-light/20 rounded-full filter blur-xl opacity-60 pointer-events-none" />

        <div className="flex justify-center mb-2">
          <Logo showText={true} />
        </div>

        {/* Dynamic Status indicators */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gold-light/40 text-gold-dark flex items-center justify-center text-3xl shrink-0 select-none animate-pulse-subtle border border-gold/10">
            ⏳
          </div>
          <div>
            <span className="bg-gold-light text-gold-dark border border-gold/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider leading-none">
              KYC Audit Pending
            </span>
            <h3 className="text-lg font-black text-slate-800 tracking-tight mt-3">
              We are auditing your drug license details
            </h3>
            <p className="text-2xs text-slate-400 font-bold uppercase mt-1 tracking-wider leading-relaxed">
              Applicant Store: <strong className="text-slate-700">{vendorUser?.storeName || 'Wellness Store'}</strong>
            </p>
          </div>
        </div>

        {/* Checklist timeline */}
        <div className="text-left bg-slate-50 border border-slate-100/80 rounded-2xl p-4.5 flex flex-col gap-3.5">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 mb-1">
            Store Onboarding Progress
          </h4>

          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-xs shrink-0 select-none">
              <FiCheck />
            </span>
            <span className="text-xs font-semibold text-slate-700">Business registration completed</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-xs shrink-0 select-none">
              <FiCheck />
            </span>
            <span className="text-xs font-semibold text-slate-700">Drug license certificate uploaded</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-gold-light text-gold-dark border border-gold/10 flex items-center justify-center text-xs shrink-0 select-none font-bold">
              <FiClock />
            </span>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              Admin auditing pan & licensing folders
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark animate-ping" />
            </span>
          </div>

          <div className="flex items-center gap-3 opacity-40">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs shrink-0 select-none font-bold">
              4
            </span>
            <span className="text-xs font-semibold text-slate-500">Store activation and dashboard access</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed px-2">
          HIPAA clinical and FDA compliance regulations require manual review of all pharmaceutical registries. The process takes less than 24 hours.
        </p>

        {/* Actions deck */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-5 mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
          >
            <FiLogOut /> Log Out
          </button>
          <button
            onClick={handleCheckStatus}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale min-h-[46px]"
          >
            {loading ? <FiRefreshCw className="animate-spin text-sm" /> : <><FiRefreshCw /> Check status</>}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
