import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSmartphone } from 'react-icons/fi';

export default function LoginForm({ onSendOtp, loading }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
    setPhoneNumber(val);
    
    // Live validation
    if (val && val.length < 10) {
      setError('Mobile number must be 10 digits');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    onSendOtp(phoneNumber);
  };

  return (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">Mobile Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-slate-500 font-bold text-sm border-r border-slate-200 pr-2.5 mr-1 flex items-center gap-1.5">
              <FiSmartphone className="text-slate-400 shrink-0 text-sm" />
              <span>+91</span>
            </span>
          </div>
          <input
            id="customer-login-phone"
            type="tel"
            required
            maxLength={10}
            placeholder="Enter 10-digit number"
            value={phoneNumber}
            onChange={handleChange}
            className={`w-full pl-22 pr-4 py-3 bg-slate-50 border ${error ? 'border-coral focus:border-coral' : 'border-slate-200 focus:border-teal-500'} focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium font-mono`}
          />
        </div>
        {error && (
          <p className="text-coral text-xs font-bold leading-tight px-1 mt-1">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-sm text-sm font-black transition-all border-0 cursor-pointer flex items-center justify-center min-h-[48px]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>CONTINUE</span>
        )}
      </button>
    </motion.form>
  );
}
