import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiCheckCircle } from 'react-icons/fi';

export default function OtpVerification({ onVerify, onResend, loading }) {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setOtpCode(val);
    if (val && val.length !== 4) {
      setError('OTP must be 4 digits');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 4) {
      setError('Please enter the 4-digit code sent to your phone');
      return;
    }
    setError('');
    onVerify(otpCode);
  };

  return (
    <motion.form
      key="otp"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-650 text-center">Enter 4-Digit OTP</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <FiShield className="text-sm" />
          </span>
          <input
            id="customer-login-otp"
            type="text"
            required
            maxLength={4}
            placeholder="••••"
            value={otpCode}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${error ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-850 text-sm outline-none transition-all text-center tracking-[12px] font-black placeholder:text-slate-300`}
          />
        </div>
        <p className="text-[10px] text-slate-400 font-bold text-center mt-1">Use test code '1234' to verify instantly.</p>
        {error && <p className="text-coral text-xs font-bold leading-tight px-1 mt-1 text-center">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-teal hover:bg-teal-dark text-white rounded-2xl shadow-sm text-sm font-black transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <FiCheckCircle />
            <span>VERIFY AND LOGIN</span>
          </>
        )}
      </button>
      
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 px-1">
        <span>Didn't get code?</span>
        <button type="button" onClick={onResend} className="text-teal hover:underline font-extrabold border-0 bg-transparent cursor-pointer">
          Resend OTP
        </button>
      </div>
    </motion.form>
  );
}
