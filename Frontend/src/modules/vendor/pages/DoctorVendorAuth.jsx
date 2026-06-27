import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthInput from '../../auth/admin/components/AuthInput';
import PasswordInput from '../../auth/admin/components/PasswordInput';
import { vendorAuthStart, vendorLoginSuccess } from '../../auth/vendor/store/vendorAuthSlice';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../../../shared/components/Logo';

export default function DoctorVendorAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-set tab based on the route or state
  const isSignupRoute = location.pathname.includes('signup');
  const [tab, setTab] = useState(isSignupRoute ? 1 : 0);

  const { loading, error } = useSelector(state => state.vendorAuth || { loading: false, error: null });

  // Common Form States
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(vendorAuthStart());
    setApiError("");

    // Mock login for Doctor
    setTimeout(() => {
      dispatch(vendorLoginSuccess({ 
        user: { name: 'Doctor User', email: emailOrPhone }, 
        token: 'dummy-token' 
      }));
      navigate('/vendor/doctor/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden relative">
      
      {/* Left side panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#135A5A] p-12 flex-col justify-between relative overflow-hidden select-none border-r border-[#0F4A4A] shrink-0">
        {/* Animated backdrop glow elements */}
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-[#319C9B]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />

        {/* Branding header */}
        <div className="z-10 flex items-center gap-2 bg-white rounded-xl px-4 py-2 self-start shadow-lg">
          <Logo showText={true} />
        </div>

        {/* Illustration and Tagline */}
        <div className="z-10 flex flex-col gap-6 items-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-5xl shadow-2xl backdrop-blur-sm border border-white/20">
            👨‍⚕️
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#319C9B]/30 rounded-full border border-[#319C9B]/50 mb-4 backdrop-blur-md">
              <span className="text-white text-[10px] font-black tracking-widest uppercase">Clinical Partner Portal</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Manage your practice<br/>with E Mediclub
            </h2>
            <p className="text-white/70 font-medium text-sm mt-4 leading-relaxed">
              Expand your reach. Offer online video consultations, accept in-clinic appointments, and write digital prescriptions instantly.
            </p>
          </div>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-white/50 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>
      </div>

      {/* Right side authentication form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto no-scrollbar">
        {/* Glow blobs on background */}
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-[#319C9B]/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-slate-100/50 rounded-full filter blur-3xl pointer-events-none" />

        <div className="w-full max-w-md z-10 flex flex-col gap-6">
          
          {/* Logo only on mobile */}
          <div className="lg:hidden flex justify-center mb-2">
            <Logo showText={true} />
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 shadow-premium relative">
            {/* Form Headers */}
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-wide">
                {tab === 0 ? "Welcome Back, Doc!" : "Join as a Partner"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                {tab === 0 ? "Sign in to your doctor panel" : "Quickly setup your clinical account"}
              </p>
            </div>

            {/* Tab switch controller */}
            <div className="flex border border-slate-100 mb-5 p-1 bg-slate-50/50 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTabChange(0)}
                className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                  tab === 0
                    ? 'bg-[#135A5A] text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleTabChange(1)}
                className={`flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all border-0 cursor-pointer ${
                  tab === 1
                    ? 'bg-[#135A5A] text-white shadow-sm'
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
                    placeholder="dr.name@example.com or 8888888888"
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
                  <div className="flex justify-end -mt-2">
                    <Link to="/vendor/doctor/forgot-password" className="text-[10px] font-black text-[#319C9B] uppercase hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </>
              ) : (
                /* REGISTRATION SCREEN */
                <>
                  <AuthInput
                    label="Full Name (with Dr. prefix)"
                    type="text"
                    placeholder="e.g. Dr. Ramesh Kumar"
                    icon={FiUser}
                    error={validationErrors.fullName ? { message: validationErrors.fullName } : null}
                    required
                    register={{
                      value: fullName,
                      onChange: (e) => {
                        let val = e.target.value;
                        if (!val.startsWith('Dr. ') && val.length > 0) val = 'Dr. ' + val.replace(/^Dr\.?\s*/i, '');
                        setFullName(val);
                      }
                    }}
                  />

                  <AuthInput
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
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

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm shadow-[#135A5A]/30 border-0 cursor-pointer tap-scale mt-2 flex justify-center items-center h-[46px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  tab === 0 ? "Sign In to Portal" : "Join Network"
                )}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Login with Google Button */}
              <button
                type="button"
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 tap-scale shadow-sm"
              >
                <FcGoogle size={18} />
                <span>Continue with Google</span>
              </button>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
