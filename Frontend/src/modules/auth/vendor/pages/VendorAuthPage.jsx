import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthInput from '../../admin/components/AuthInput';
import PasswordInput from '../../admin/components/PasswordInput';
import LoadingButton from '../../admin/components/LoadingButton';
import { vendorAuthStart, vendorAuthFailure, vendorLoginSuccess } from '../store/vendorAuthSlice';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import apiClient from '../../../../shared/services/apiClient';
import Logo from '../../../../shared/components/Logo';

export default function VendorAuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.vendorAuth || { loading: false, error: null });

  // Tab State: 0 = Login, 1 = Signup
  const [tab, setTab] = useState(0);

  // Common Form States
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vendorType, setVendorType] = useState("pharmacy_vendor"); // Default to Pharmacy

  // Error States
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setValidationErrors({});
    setApiError("");
  };

  const validateForm = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (tab === 0) {
      if (!emailOrPhone) {
        errs.emailOrPhone = "Email or phone number is required";
      }
      if (!password) {
        errs.password = "Password is required";
      }
    } else {
      if (!fullName) errs.fullName = "Full name is required";
      if (!email) {
        errs.email = "Email address is required";
      } else if (!emailRegex.test(email)) {
        errs.email = "Please enter a valid email address";
      }
      if (!phone) {
        errs.phone = "Mobile phone number is required";
      } else if (phone.length !== 10) {
        errs.phone = "Phone number must be exactly 10 digits";
      }
      if (!password) {
        errs.password = "Password is required";
      } else if (password.length < 6) {
        errs.password = "Password must be at least 6 characters long";
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match";
      }
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAuthRedirect = (role) => {
    if (role === 'lab_vendor') {
      navigate('/vendor/lab/dashboard');
    } else if (role === 'doctor_vendor') {
      navigate('/vendor/doctor/dashboard');
    } else {
      // pharmacy_vendor or vendor
      navigate('/vendor/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(vendorAuthStart());
    setApiError("");

    try {
      if (tab === 0) {
        // Login Action
        const response = await apiClient.post('/api/auth/login', {
          emailOrPhone,
          password
        });
        
        const { user, accessToken } = response.data.data;
        dispatch(vendorLoginSuccess({ user, token: accessToken }));
        handleAuthRedirect(user.role);
      } else {
        // Signup Action
        const response = await apiClient.post('/api/auth/register', {
          name: fullName,
          email,
          phone,
          password,
          role: vendorType
        });

        const { user, accessToken } = response.data.data;
        dispatch(vendorLoginSuccess({ user, token: accessToken }));
        handleAuthRedirect(user.role);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Authentication failed";
      dispatch(vendorAuthFailure(errMsg));
      setApiError(errMsg);
    }
  };

  const vendorOptions = [
    { value: 'pharmacy_vendor', label: 'Pharmacy', icon: '💊' },
    { value: 'lab_vendor', label: 'Laboratory', icon: '🔬' },
    { value: 'doctor_vendor', label: 'Doctor', icon: '👨‍⚕️' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden relative">
      
      {/* Left side panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#eef8f6] p-12 flex-col justify-between relative overflow-hidden select-none border-r border-slate-100 shrink-0">
        {/* Animated backdrop glow elements */}
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-teal-light/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-forest-light/20 blur-3xl pointer-events-none" />

        {/* Branding header */}
        <div className="z-10 flex items-center gap-2">
          <Logo showText={true} />
        </div>

        {/* Illustration and Tagline */}
        <div className="z-10 flex flex-col gap-6 items-center text-center max-w-md mx-auto">
          {/* Healthcare SVG Graphic */}
          <svg className="w-56 h-56 text-teal drop-shadow-md animate-pulse-subtle" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="85" fill="#E0F2F1" />
            {/* Stethoscope */}
            <path d="M70 70C70 100 85 120 100 120C115 120 130 100 130 70" stroke="#00897B" strokeWidth="6" strokeLinecap="round" />
            <path d="M100 120V145C100 155 110 160 120 160H135" stroke="#00897B" strokeWidth="6" strokeLinecap="round" />
            {/* Heart symbol */}
            <path d="M100 65C100 65 93 57 85 57C75 57 68 65 68 75C68 90 100 108 100 108C100 108 132 90 132 75C132 65 125 57 115 57C107 57 100 65 100 65Z" fill="#E53935" />
            {/* Doctor/Plus Shield */}
            <rect x="85" y="140" width="30" height="30" rx="6" fill="#00897B" />
            <path d="M100 146V164M91 155H109" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              Manage your practice with E Mediclub
            </h2>
            <p className="text-slate-500 font-semibold text-xs mt-3 leading-relaxed">
              Join thousands of doctors, pharmacies and labs on India's trusted healthcare platform.
            </p>
          </div>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-slate-400 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>
      </div>

      {/* Right side authentication form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto no-scrollbar">
        {/* Glow blobs on background */}
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-teal-light/30 rounded-full filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-forest-light/30 rounded-full filter blur-3xl opacity-50 pointer-events-none" />

        <div className="w-full max-w-md z-10 flex flex-col gap-6">
          
          {/* Logo only on mobile */}
          <div className="lg:hidden flex justify-center mb-2">
            <Logo showText={true} />
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-premium relative">
            {/* Form Headers */}
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                {tab === 0 ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                {tab === 0 ? "Sign in to your vendor account" : "Join E Mediclub healthcare network"}
              </p>
            </div>

            {/* Tab switch controller */}
            <div className="flex border border-slate-100 mb-5 p-1 bg-slate-50/50 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTabChange(0)}
                className={`flex-1 py-2 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                  tab === 0
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleTabChange(1)}
                className={`flex-1 py-2 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                  tab === 1
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Global API error notification */}
            {apiError && (
              <div className="p-3 mb-4 bg-coral-light/50 border border-coral/20 rounded-2xl text-[9px] font-black text-coral uppercase tracking-wide">
                ⚠️ {apiError}
              </div>
            )}

            {/* Core Forms Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {tab === 0 ? (
                /* LOGIN SCREEN */
                <>
                  <AuthInput
                    label="Email address or Phone number"
                    type="text"
                    placeholder="vendor@emediclub.com or 8888888888"
                    icon={FiMail}
                    error={validationErrors.emailOrPhone ? { message: validationErrors.emailOrPhone } : null}
                    required
                    register={{
                      value: emailOrPhone,
                      onChange: (e) => setEmailOrPhone(e.target.value)
                    }}
                  />

                  <PasswordInput
                    label="Account Password"
                    placeholder="••••••••"
                    error={validationErrors.password ? { message: validationErrors.password } : null}
                    required
                    register={{
                      value: password,
                      onChange: (e) => setPassword(e.target.value)
                    }}
                  />
                </>
              ) : (
                /* REGISTRATION SCREEN */
                <>
                  <AuthInput
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    icon={FiUser}
                    error={validationErrors.fullName ? { message: validationErrors.fullName } : null}
                    required
                    register={{
                      value: fullName,
                      onChange: (e) => setFullName(e.target.value)
                    }}
                  />

                  <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="name@emediclub.com"
                    icon={FiMail}
                    error={validationErrors.email ? { message: validationErrors.email } : null}
                    required
                    register={{
                      value: email,
                      onChange: (e) => setEmail(e.target.value)
                    }}
                  />

                  <AuthInput
                    label="Phone Number"
                    type="tel"
                    placeholder="10-digit number"
                    icon={FiPhone}
                    error={validationErrors.phone ? { message: validationErrors.phone } : null}
                    required
                    register={{
                      value: phone,
                      onChange: (e) => setPhone(e.target.value.replace(/\D/g, ''))
                    }}
                  />

                  {/* Vendor Type Selection Cards */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Vendor Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {vendorOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setVendorType(opt.value)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer tap-scale ${
                            vendorType === opt.value
                              ? 'border-teal bg-teal/5 text-teal shadow-sm font-extrabold'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350'
                          }`}
                        >
                          <span className="text-xl mb-1">{opt.icon}</span>
                          <span className="text-[10px] font-black tracking-wide uppercase leading-none block">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <PasswordInput
                    label="Create Password"
                    placeholder="••••••••"
                    error={validationErrors.password ? { message: validationErrors.password } : null}
                    required
                    register={{
                      value: password,
                      onChange: (e) => setPassword(e.target.value)
                    }}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    placeholder="••••••••"
                    error={validationErrors.confirmPassword ? { message: validationErrors.confirmPassword } : null}
                    required
                    register={{
                      value: confirmPassword,
                      onChange: (e) => setConfirmPassword(e.target.value)
                    }}
                  />
                </>
              )}

              {/* Login with Google Button */}
              <button
                type="button"
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 tap-scale shadow-sm"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.5 0-6.35-2.85-6.35-6.35s2.85-6.35 6.35-6.35c1.63 0 3.12.62 4.26 1.73l3.05-3.05C19.24 2.66 15.9 1.2 12.24 1.2 6.03 1.2 1 6.23 1 12.44S6.03 23.68 12.24 23.68c6.12 0 11.13-4.43 11.13-11.24 0-.74-.07-1.45-.19-2.16H12.24z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Action Submit Button */}
              <LoadingButton
                loading={loading}
                color="primary"
              >
                {tab === 0 ? "Login" : "Sign Up"}
              </LoadingButton>

              {/* Switcher Text Link */}
              <p className="text-2xs font-extrabold text-slate-400 text-center uppercase tracking-wider mt-2 border-t border-slate-50 pt-4">
                {tab === 0 ? (
                  <>
                    New to E Mediclub?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange(1)}
                      className="text-teal hover:underline font-black bg-transparent border-0 cursor-pointer p-0 uppercase"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have account?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabChange(0)}
                      className="text-teal hover:underline font-black bg-transparent border-0 cursor-pointer p-0 uppercase"
                    >
                      Login
                    </button>
                  </>
                )}
              </p>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
