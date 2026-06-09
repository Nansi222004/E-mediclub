import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import PasswordInput from '../components/PasswordInput';
import LoadingButton from '../components/LoadingButton';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

export default function AdminResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleValidation = () => {
    let isValid = true;
    setPasswordError("");
    setConfirmError("");

    if (!password) {
      setPasswordError("New password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your new password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title branding */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShield className="text-teal" /> Update Admin Password
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Establish a strong, compliant security password.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-teal-light/50 border border-teal/20 rounded-3xl text-center flex flex-col gap-2">
            <span className="text-xl">✅</span>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Password Updated!</h4>
            <p className="text-[10px] text-slate-500">Redirecting to login dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <PasswordInput
              label="Established New Password"
              placeholder="••••••••"
              error={passwordError ? { message: passwordError } : null}
              required
              register={{
                value: password,
                onChange: (e) => setPassword(e.target.value)
              }}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="••••••••"
              error={confirmError ? { message: confirmError } : null}
              required
              register={{
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value)
              }}
            />

            <LoadingButton 
              loading={loading}
              color="primary"
            >
              Establish Password
            </LoadingButton>

            <div className="flex justify-center mt-2 border-t border-slate-50 pt-4">
              <Link 
                to="/admin/login" 
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
