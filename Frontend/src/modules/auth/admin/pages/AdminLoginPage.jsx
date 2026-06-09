import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import AuthInput from '../components/AuthInput';
import PasswordInput from '../components/PasswordInput';
import LoadingButton from '../components/LoadingButton';
import { adminLoginStart, adminLoginFailure, adminSendOtpSuccess } from '../store/adminAuthSlice';
import { FiMail, FiCheckCircle, FiShield } from 'react-icons/fi';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.adminAuth || { loading: false, error: null });

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleValidation = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid clinical email address");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    dispatch(adminLoginStart());

    // Simulate API delay
    setTimeout(() => {
      // Check dummy admin credentials
      if (email === "admin@emediclub.com" && password === "Admin@123") {
        // Redirection to OTP two-factor verification
        dispatch(adminSendOtpSuccess(email));
        navigate('/admin/verify-otp');
      } else {
        dispatch(adminLoginFailure("Invalid administrator email or password"));
        setGeneralError("Invalid administrator credentials (Email: admin@emediclub.com, Pass: Admin@123)");
      }
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title branding */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShield className="text-teal" /> Super Admin Portal
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Sign in to access your administrative workspace.
          </p>
        </div>

        {generalError && (
          <div className="p-3.5 bg-coral-light/50 border border-coral/20 rounded-2xl text-[10px] font-bold text-coral uppercase tracking-wide">
            {generalError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          {/* Email field */}
          <AuthInput
            label="Administrator Email"
            type="email"
            placeholder="admin@emediclub.com"
            icon={FiMail}
            error={emailError ? { message: emailError } : null}
            required
            register={{
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }}
          />

          {/* Password field */}
          <PasswordInput
            label="Secure Password"
            placeholder="••••••••"
            error={passwordError ? { message: passwordError } : null}
            required
            register={{
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }}
          />

          {/* Remember me & forgot password parameters */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal border-slate-200 rounded-lg focus:ring-teal-light cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link 
              to="/admin/forgot-password" 
              className="text-teal hover:underline font-extrabold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Action button */}
          <LoadingButton 
            loading={loading}
            color="primary"
          >
            Authenticate Admin
          </LoadingButton>

        </form>

        <div className="border-t border-slate-50 pt-4 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          <FiShield className="text-teal" /> Dual-Factor 2FA Securing Enabled
        </div>

      </AuthCard>
    </AuthLayout>
  );
}
