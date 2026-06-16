import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TextField, Button, CircularProgress, InputAdornment, 
  Tabs, Tab, Box 
} from '@mui/material';
import { FiSmartphone, FiUser, FiMail, FiCheckCircle, FiShield, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiChevronLeft } from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';
import { sendOtpStart, sendOtpSuccess, verifyOtpSuccess } from '../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from || '/';

  // Auth Redux Selectors
  const { loading, otpSent, tempPhone } = useSelector(state => state.auth);

  // Local UI States
  const [tabValue, setTabValue] = useState(0); // 0: Login, 1: Signup
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setValidationError('');
  };

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
    dispatch(sendOtpStart());

    // Mock network request delay
    setTimeout(() => {
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
    dispatch(sendOtpStart()); // triggers loader

    // Mock network request delay for verification
    setTimeout(() => {
      const mockUser = {
        name: tabValue === 0 ? 'Ramesh Kumar' : userName || 'Anoop Singh',
        phone: tempPhone || phoneNumber,
        email: tabValue === 0 ? 'ramesh@gmail.com' : emailAddress || 'anoop@gmail.com',
        joinedDate: new Date().toISOString().split('T')[0],
        role: 'customer' // Defaults to standard client role
      };
      const mockToken = `MOCK-JWT-TOKEN-${Date.now()}`;
      dispatch(verifyOtpSuccess({ user: mockUser, token: mockToken }));
      navigate(fromPath);
    }, 1200);
  };

  const handleQuickLogin = (role) => {
    dispatch(sendOtpStart());
    setTimeout(() => {
      let mockUser = {
        joinedDate: new Date().toISOString().split('T')[0]
      };
      if (role === 'admin') {
        mockUser = {
          ...mockUser,
          name: 'Super Admin',
          phone: '9999999999',
          email: 'admin@emediclub.com',
          role: 'admin'
        };
      } else if (role === 'vendor') {
        mockUser = {
          ...mockUser,
          name: 'MedPlus Wellness Manager',
          phone: '8888888888',
          email: 'vendor@emediclub.com',
          role: 'vendor'
        };
      } else {
        mockUser = {
          ...mockUser,
          name: 'Ramesh Kumar',
          phone: '9876543201',
          email: 'ramesh@gmail.com',
          role: 'customer'
        };
      }
      const mockToken = `MOCK-JWT-TOKEN-${role}-${Date.now()}`;
      dispatch(verifyOtpSuccess({ user: mockUser, token: mockToken }));
      
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else navigate(fromPath);
    }, 800);
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
            <motion.form
              key={tabValue === 0 ? 'login' : 'signup'}
              initial={{ opacity: 0, x: tabValue === 0 ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tabValue === 0 ? 15 : -15 }}
              onSubmit={handleSendOtp}
              className="flex flex-col gap-4"
            >
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

              {/* Sign up details */}
              {tabValue === 1 && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiUser className="text-sm" />
                      </span>
                      <input
                        id="customer-signup-fullname"
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiMail className="text-sm" />
                      </span>
                      <input
                        id="customer-signup-email"
                        type="email"
                        placeholder="name@example.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <FiLock className="text-sm" />
                      </span>
                      <input
                        id="customer-signup-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Phone number field */}
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
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-22 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-sm outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-medium font-mono"
                  />
                </div>
              </div>

              {validationError && (
                <p className="text-coral text-xs font-bold leading-tight px-1">{validationError}</p>
              )}

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-sm text-sm font-black transition-all border-0 cursor-pointer flex items-center justify-center min-h-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{tabValue === 0 ? 'CONTINUE' : 'REGISTER'}</span>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleVerifyOtp}
              className="flex flex-col gap-4"
            >
              {/* OTP Input */}
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
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-850 text-sm outline-none transition-all text-center tracking-[12px] font-black placeholder:text-slate-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold text-center mt-1">Use test code '1234' to verify instantly.</p>
              </div>

              {validationError && (
                <p className="text-coral text-xs font-bold leading-tight px-1">{validationError}</p>
              )}

              {/* Submit code */}
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
                <button type="button" onClick={handleSendOtp} className="text-teal hover:underline font-extrabold border-0 bg-transparent cursor-pointer">
                  Resend OTP
                </button>
              </div>
            </motion.form>
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
