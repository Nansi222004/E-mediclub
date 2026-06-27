import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSmartphone, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { sendOtpStart, sendOtpSuccess, verifyOtpSuccess } from '../../modules/auth/store/authSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSignupSchema, modalLoginSchema, modalOtpSchema } from '../../modules/auth/user/schemas/auth.schema';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Signup
  const [otpSentLocal, setOtpSentLocal] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register: registerAuth, handleSubmit: handleAuthSubmit, formState: { errors: authErrors }, reset: resetAuth, getValues: getAuthValues } = useForm({
    resolver: (data, context, options) => {
      const schema = tabValue === 1 ? userSignupSchema : modalLoginSchema;
      return zodResolver(schema)(data, context, options);
    },
    mode: 'onChange'
  });

  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm({
    resolver: zodResolver(modalOtpSchema),
    mode: 'onChange'
  });

  if (!isOpen) return null;

  const handleSendOtp = (data) => {
    setValidationError('');
    setIsSubmitting(true);
    dispatch(sendOtpStart());

    // Mock network request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSentLocal(true);
      dispatch(sendOtpSuccess(data.phone));
    }, 1000);
  };

  const handleVerifyOtp = (data) => {
    setValidationError('');
    setIsSubmitting(true);
    dispatch(sendOtpStart());

    setTimeout(() => {
      const authData = getAuthValues();
      const mockUser = {
        name: tabValue === 0 ? 'Ramesh Kumar' : authData.name || 'Anoop Singh',
        phone: authData.phone,
        email: tabValue === 0 ? 'ramesh@gmail.com' : authData.email || 'anoop@gmail.com',
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
                ? `Enter 4-digit code sent to +91 ${getAuthValues('phone')}` 
                : tabValue === 0 ? 'Login with mobile OTP to continue booking' : 'Register in seconds to book tests & doctors'}
            </p>
          </div>

          {validationError && (
            <div className="text-[9px] text-red-500 font-bold bg-red-50 border border-red-100 p-2 rounded-lg text-center leading-snug">
              ⚠️ {validationError}
            </div>
          )}

          {!otpSentLocal ? (
            <form onSubmit={handleAuthSubmit(handleSendOtp)} className="flex flex-col gap-3">
              {/* Tab Selector */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 mb-1">
                <button
                  type="button"
                  onClick={() => { setTabValue(0); setValidationError(''); resetAuth(); }}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border-0 cursor-pointer ${
                    tabValue === 0 ? 'bg-teal text-white shadow-sm' : 'bg-transparent text-slate-550'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setTabValue(1); setValidationError(''); resetAuth(); }}
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
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        {...registerAuth('name')}
                        className={`w-full pl-9 pr-4 py-2 bg-slate-50 border ${authErrors.name ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-xl text-xs font-semibold outline-none focus:bg-white`}
                      />
                    </div>
                    {authErrors.name && <p className="text-coral text-[9px] font-bold px-1">{authErrors.name.message}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        {...registerAuth('email')}
                        className={`w-full pl-9 pr-4 py-2 bg-slate-50 border ${authErrors.email ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-xl text-xs font-semibold outline-none focus:bg-white`}
                      />
                    </div>
                    {authErrors.email && <p className="text-coral text-[9px] font-bold px-1">{authErrors.email.message}</p>}
                  </div>
                </>
              )}

              {/* Phone Input */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <FiSmartphone className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Mobile Number"
                    {...registerAuth('phone')}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border ${authErrors.phone ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-xl text-xs font-semibold outline-none focus:bg-white`}
                  />
                </div>
                {authErrors.phone && <p className="text-coral text-[9px] font-bold px-1">{authErrors.phone.message}</p>}
              </div>

              {tabValue === 1 && (
                /* Password Input */
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                    <input
                      type="password"
                      placeholder="Create Password"
                      {...registerAuth('password')}
                      className={`w-full pl-9 pr-4 py-2 bg-slate-50 border ${authErrors.password ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-xl text-xs font-semibold outline-none focus:bg-white`}
                    />
                  </div>
                  {authErrors.password && <p className="text-coral text-[9px] font-bold px-1">{authErrors.password.message}</p>}
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
            <form onSubmit={handleOtpSubmit(handleVerifyOtp)} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="Enter 4-Digit OTP"
                    {...registerOtp('otp')}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border ${otpErrors.otp ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-xl text-xs font-extrabold text-center tracking-widest outline-none focus:bg-white`}
                  />
                </div>
                {otpErrors.otp && <p className="text-coral text-[9px] font-bold px-1">{otpErrors.otp.message}</p>}
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
