import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSmartphone, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { sendOtpStart, sendOtpSuccess, verifyOtpSuccess } from '../../modules/auth/store/authSlice';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();

  // Local States
  const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Signup
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentLocal, setOtpSentLocal] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (tabValue === 1 && (!password || password.length < 6)) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    dispatch(sendOtpStart());

    // Mock network request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSentLocal(true);
      dispatch(sendOtpSuccess(phoneNumber));
    }, 1000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 4) {
      setValidationError('Please enter the 4-digit code sent to your phone');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);
    dispatch(sendOtpStart());

    setTimeout(() => {
      const mockUser = {
        name: tabValue === 0 ? 'Ramesh Kumar' : userName || 'Anoop Singh',
        phone: phoneNumber,
        email: tabValue === 0 ? 'ramesh@gmail.com' : emailAddress || 'anoop@gmail.com',
        joinedDate: new Date().toISOString().split('T')[0],
        role: 'customer'
      };
      const mockToken = `MOCK-JWT-TOKEN-${Date.now()}`;
      dispatch(verifyOtpSuccess({ user: mockUser, token: mockToken }));
      setIsSubmitting(false);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-premium z-10 flex flex-col gap-4 font-sans select-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer border-0 transition-colors outline-none"
          >
            <FiX className="text-sm shrink-0" />
          </button>

          {/* Heading */}
          <div className="text-center mt-2 flex flex-col items-center">
            <span className="text-xl">🛡️</span>
            <h3 className="text-sm font-extrabold text-slate-805 uppercase tracking-wider mt-1.5">
              {otpSentLocal ? 'Enter OTP' : tabValue === 0 ? 'Quick Login' : 'Create Account'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-[200px]">
              {otpSentLocal 
                ? `Enter 4-digit code sent to +91 ${phoneNumber}` 
                : tabValue === 0 ? 'Login with mobile OTP to continue booking' : 'Register in seconds to book tests & doctors'}
            </p>
          </div>

          {validationError && (
            <div className="text-[9px] text-red-500 font-bold bg-red-50 border border-red-100 p-2 rounded-lg text-center leading-snug">
              ⚠️ {validationError}
            </div>
          )}

          {!otpSentLocal ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
              {/* Tab Selector */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 mb-1">
                <button
                  type="button"
                  onClick={() => { setTabValue(0); setValidationError(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border-0 cursor-pointer ${
                    tabValue === 0 ? 'bg-teal text-white shadow-sm' : 'bg-transparent text-slate-550'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setTabValue(1); setValidationError(''); }}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border-0 cursor-pointer ${
                    tabValue === 1 ? 'bg-teal text-white shadow-sm' : 'bg-transparent text-slate-550'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {tabValue === 1 && (
                <>
                  {/* Name Input */}
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-teal"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-teal"
                    />
                  </div>
                </>
              )}

              {/* Phone Input */}
              <div className="relative">
                <FiSmartphone className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                <input
                  type="tel"
                  maxLength="10"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-teal"
                />
              </div>

              {tabValue === 1 && (
                /* Password Input */
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-teal"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 mt-2 flex items-center justify-center gap-1.5 animate-fade-in"
              >
                {isSubmitting ? 'Sending...' : 'SEND OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                <input
                  type="text"
                  maxLength="4"
                  placeholder="Enter 4-Digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-extrabold text-center tracking-widest outline-none focus:bg-white focus:border-teal"
                />
              </div>

              <div className="flex justify-between items-center text-[8.5px] font-extrabold text-slate-450 px-1 mt-1">
                <span>Didn't receive OTP?</span>
                <button
                  type="button"
                  onClick={() => setOtpSentLocal(false)}
                  className="text-teal hover:underline border-0 bg-transparent cursor-pointer font-black"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 mt-2 flex items-center justify-center"
              >
                {isSubmitting ? 'Verifying...' : 'VERIFY & PROCEED'}
              </button>
            </form>
          )}

          {/* Quick Sandbox Selector (Mock login easily) */}
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5 text-center select-none">
            <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wide">Developer Sandbox</span>
            <button
              onClick={() => {
                const mockUser = {
                  name: 'Ramesh Kumar',
                  phone: '9876543201',
                  email: 'ramesh@gmail.com',
                  joinedDate: new Date().toISOString().split('T')[0],
                  role: 'customer'
                };
                const mockToken = 'MOCK-JWT-TOKEN-SANDBOX';
                dispatch(verifyOtpSuccess({ user: mockUser, token: mockToken }));
                onClose();
                if (onSuccess) onSuccess();
              }}
              className="py-1 px-3 bg-slate-100 hover:bg-slate-150 text-[8.5px] font-black text-slate-600 rounded-lg border border-slate-200 transition-colors cursor-pointer outline-none"
            >
              ⚡ Bypass (Mock Customer Login)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
