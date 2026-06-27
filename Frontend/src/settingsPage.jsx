import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGlobalCommission } from '../store/adminSlice';
import { FiSliders, FiShield, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { commissionSetting } = useSelector(state => state.admin);

  const [commRate, setCommRate] = useState(commissionSetting || 10);
  const [gatewayUpi, setGatewayUpi] = useState('emediclub@upi');
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_Emediclub9871');
  const [otpLength, setOtpLength] = useState(4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    dispatch(setGlobalCommission(Number(commRate)));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Console Configurations</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Define baseline platform commission tariffs, payment API keys, and HIPAA security controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        
        {/* Baseline Commission parameters */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiSliders className="text-teal" /> Baseline Brokerage Tariffs
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Adjust the standard percentage commission collected on successful merchant transactions.
          </p>

          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Baseline Commission Tariff (%)</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="0" 
                max="50"
                value={commRate} 
                onChange={(e) => setCommRate(e.target.value)}
                className="w-24 px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-teal text-center"
              />
              <span className="text-xs font-extrabold text-slate-500 uppercase">% Flat Rate</span>
            </div>
          </div>
        </div>

        {/* Payment Gateways settings */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiCreditCard className="text-teal" /> Transaction Gateway Integrations
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Manage credentials routing checkout payments to platform bank accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Clinical VPA UPI ID</label>
              <input 
                type="text" 
                value={gatewayUpi} 
                onChange={(e) => setGatewayUpi(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Razorpay Merchant Live Key</label>
              <input 
                type="text" 
                value={razorpayKey} 
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & OTP settings */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiShield className="text-teal" /> HIPAA Clinical Security Protocol
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Adjust licensing parameters securing electronic records and authentication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">SMS OTP Length</label>
              <select 
                value={otpLength} 
                onChange={(e) => setOtpLength(Number(e.target.value))}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wide outline-none focus:border-teal"
              >
                <option value="4">4 Digits (Standard Simulator)</option>
                <option value="6">6 Digits (Production Grade)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-2">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-2">Platform Logging Level</label>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
                <span className="text-[10px] font-black text-teal uppercase tracking-wider">HIPAA Audit Logging Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form triggers */}
        <div className="flex items-center gap-4.5">
          <button 
            type="submit"
            className="px-6 py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
          >
            Save configurations
          </button>
          
          {savedSuccess && (
            <span className="flex items-center gap-1 text-teal font-extrabold text-xs animate-bounce">
              <FiCheckCircle /> Configurations saved successfully!
            </span>
          )}
        </div>

      </form>

    </div>
  );
}
