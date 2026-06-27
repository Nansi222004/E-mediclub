import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../admin/components/AuthLayout';
import AuthCard from '../../admin/components/AuthCard';
import AuthInput from '../../admin/components/AuthInput';
import LoadingButton from '../../admin/components/LoadingButton';
import { FiMail, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default function VendorForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email address is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid store email address");
      return;
    }

    setLoading(true);

    // Simulate OTP dispatch
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/vendor/verify-otp');
      }, 1500);
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShoppingBag className="text-teal" /> Reset Seller Password
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Enter your merchant email to verify store credential ownership.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-teal-light/50 border border-teal/20 rounded-3xl text-center flex flex-col gap-2">
            <span className="text-xl">📧</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Verification OTP Sent!</h4>
            <p className="text-[10px] text-slate-500">Redirecting to store verify-otp page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <AuthInput
              label="Registered Store Email Address"
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

            <LoadingButton 
              loading={loading}
              color="primary"
            >
              Send Verification OTP
            </LoadingButton>

            <div className="flex justify-center mt-2 border-t border-slate-50 pt-4">
              <Link 
                to="/vendor/login" 
                className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-teal transition-colors"
              >
                <FiArrowLeft /> Back to Login
              </Link>
            </div>

          </form>
        )}

      </AuthCard>
    </AuthLayout>
  );
}
