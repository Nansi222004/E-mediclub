import { useNavigate } from 'react-router-dom';
import Logo from '../../../shared/components/Logo';
import { motion } from 'framer-motion';

export default function ApprovedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[32px] p-8 border border-slate-100/60 shadow-premium text-center flex flex-col gap-6"
      >
        <div className="flex justify-center mb-2">
          <Logo showText={true} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-emerald-55/10 text-emerald-600 flex items-center justify-center text-4xl select-none">
            🎉
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-3">
              Pharmacy Approved
            </h3>
            <p className="text-sm font-semibold text-slate-500 mt-2">
              Your pharmacy has been verified successfully.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-5 mt-2">
          <button
            onClick={() => navigate('/vendor/pharmacy/dashboard')}
            className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
          >
            Go To Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
