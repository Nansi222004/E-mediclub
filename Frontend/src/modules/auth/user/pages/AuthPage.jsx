import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiCheckCircle, FiChevronLeft } from 'react-icons/fi';
import Logo from '../../../../shared/components/Logo';
import { sendOtpStart, sendOtpSuccess, verifyOtpSuccess } from '../../store/authSlice';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import OtpVerification from '../components/OtpVerification';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from || '/';

  // Auth Redux Selectors
  const { loading, otpSent, tempPhone } = useSelector(state => state.auth);

  // Local UI States
  const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Signup
  const [formData, setFormData] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSendOtp = (data) => {
    // data can be just phone number (from Login) or an object (from Signup)
    const phone = typeof data === 'string' ? data : data.phone;
    if (typeof data === 'object') {
      setFormData(data); // store signup details
    }
    
    dispatch(sendOtpStart());

    // Mock network request delay
    setTimeout(() => {
      dispatch(sendOtpSuccess(phone));
    }, 1000);
  };

  const handleVerifyOtp = (otpCode) => {
    dispatch(sendOtpStart()); // triggers loader

    // Mock network request delay for verification
    setTimeout(() => {
      const mockUser = {
        name: tabValue === 0 ? 'Ramesh Kumar' : formData.name || 'Anoop Singh',
        phone: tempPhone,
        email: tabValue === 0 ? 'ramesh@gmail.com' : formData.email || 'anoop@gmail.com',
        joinedDate: new Date().toISOString().split('T')[0],
        role: 'customer' // Defaults to standard client role
      };
      const mockToken = `MOCK-JWT-TOKEN-${Date.now()}`;
      dispatch(verifyOtpSuccess({ user: mockUser, token: mockToken }));
      navigate(fromPath);
    }, 1200);
  };

  const handleResendOtp = () => {
    dispatch(sendOtpStart());
    setTimeout(() => {
      dispatch(sendOtpSuccess(tempPhone));
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white sm:bg-slate-50 font-sans sm:py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full h-screen sm:h-auto sm:rounded-[32px] p-6 sm:p-8 bg-white border-0 sm:border border-slate-100 shadow-none sm:shadow-premium relative overflow-y-auto sm:overflow-hidden flex flex-col justify-center"
      >
        {/* Mobile back button inside login card */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-8 left-5 sm:top-6 sm:left-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 cursor-pointer flex items-center justify-center transition-all z-50 shadow-sm active:scale-95"
          aria-label="Go back"
        >
          <FiChevronLeft className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-light rounded-full filter blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-forest-light rounded-full filter blur-3xl opacity-60 pointer-events-none" />

        <div className="relative z-10">
          {/* Top Logo branding */}
          <div className="flex flex-col items-center justify-center mb-6">
            <Logo layout="stacked" showText={true} />
            <h2 className="text-xl font-extrabold text-slate-800 mt-5">
              {otpSent ? 'Confirm Verification' : tabValue === 0 ? 'Welcome Back!' : 'Create New Account'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1.5 text-center leading-relaxed">
              {otpSent 
                ? `We have texted a 4-digit code to +91 ${tempPhone}`
                : tabValue === 0 ? 'Sign in with OTP to access your health locker' : 'Register in 30 seconds to book clinical tests'}
            </p>
          </div>

          {/* Dynamic Forms */}
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <div className="flex flex-col gap-4">
                {/* Form Switching Tabs */}
                <div className="flex border-b border-slate-100 mb-1 bg-slate-50 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={(e) => handleTabChange(e, 0)}
                    className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                      tabValue === 0
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleTabChange(e, 1)}
                    className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                      tabValue === 1
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {tabValue === 0 ? (
                  <LoginForm onSendOtp={handleSendOtp} loading={loading} />
                ) : (
                  <SignupForm onSendOtp={handleSendOtp} loading={loading} />
                )}
              </div>
            ) : (
              <OtpVerification onVerify={handleVerifyOtp} onResend={handleResendOtp} loading={loading} />
            )}
          </AnimatePresence>

          {/* Health Disclaimer badges */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <FiShield className="text-teal w-3.5 h-3.5" /> 100% SECURE
            </span>
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-teal w-3.5 h-3.5" /> GENUINE CARE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
