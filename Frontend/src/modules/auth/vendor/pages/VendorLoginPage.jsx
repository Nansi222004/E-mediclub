import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../admin/components/AuthLayout';
import AuthCard from '../../admin/components/AuthCard';
import AuthInput from '../../admin/components/AuthInput';
import PasswordInput from '../../admin/components/PasswordInput';
import LoadingButton from '../../admin/components/LoadingButton';
import { vendorAuthStart, vendorAuthFailure, vendorSendOtpSuccess } from '../store/vendorAuthSlice';
import { FiMail, FiShoppingBag } from 'react-icons/fi';

export default function VendorLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(state => state.vendorAuth || { loading: false, error: null });

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleValidation = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid store email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    dispatch(vendorAuthStart());

    // Simulate API delay
    setTimeout(() => {
      // Check dummy seller credentials
      if (email === "vendor@emediclub.com" && password === "Vendor@123") {
        const dummyPhone = "8888888888";
        dispatch(vendorSendOtpSuccess({ 
          phone: dummyPhone, 
          vendorData: { name: 'MedPlus Wellness Manager', email, role: 'vendor' } 
        }));
        navigate('/vendor/verify-otp');
      } else {
        dispatch(vendorAuthFailure("Invalid seller credentials"));
        setGeneralError("Invalid credentials (Email: vendor@emediclub.com, Pass: Vendor@123)");
      }
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShoppingBag className="text-teal" /> Seller Store Login
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Sign in to disburse orders and manage pharmacy stocks.
          </p>
        </div>

        {generalError && (
          <div className="p-3.5 bg-coral-light/50 border border-coral/20 rounded-2xl text-[10px] font-bold text-coral uppercase tracking-wide">
            {generalError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          <AuthInput
            label="Registered Store Email"
            type="email"
            placeholder="vendor@emediclub.com"
            icon={FiMail}
            error={emailError ? { message: emailError } : null}
            required
            register={{
              value: email,
              onChange: (e) => setEmail(e.target.value)
            }}
          />

          <PasswordInput
            label="Store Manager Password"
            placeholder="••••••••"
            error={passwordError ? { message: passwordError } : null}
            required
            register={{
              value: password,
              onChange: (e) => setPassword(e.target.value)
            }}
          />

          {/* Remember me and Signup path links */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal border-slate-200 rounded-lg focus:ring-teal-light cursor-pointer"
              />
              <span>Remember store</span>
            </label>
            <Link 
              to="/vendor/forgot-password" 
              className="text-teal hover:underline font-extrabold"
            >
              Forgot Password?
            </Link>
          </div>

          <LoadingButton 
            loading={loading}
            color="primary"
          >
            Authenticate Merchant
          </LoadingButton>

          <p className="text-2xs font-extrabold text-slate-400 text-center uppercase tracking-wider mt-2 border-t border-slate-50 pt-4">
            Become a merchant partner?{" "}
            <Link to="/vendor/signup" className="text-teal hover:underline font-black">
              Register Store
            </Link>
          </p>

        </form>

      </AuthCard>
    </AuthLayout>
  );
}
