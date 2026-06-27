import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import OtpInput from '../components/OtpInput';
import LoadingButton from '../components/LoadingButton';
import { adminVerifyOtpSuccess } from '../store/adminAuthSlice';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

export default function AdminVerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tempUser, tempToken } = useSelector(state => state.adminAuth || {});

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
    setError("");
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 4) {
      setError("Please complete the 4-digit verification code");
      return;
    }

    setLoading(true);

    // Simulate OTP verification delay
    setTimeout(() => {
      setLoading(false);
      
      if (code === "1234") {
        const adminUser = tempUser || {
          name: 'Super Admin',
          email: 'admin@emediclub.com',
          role: 'admin',
          phone: '9999999999'
        };
        const token = tempToken || `MOCK-ADMIN-JWT-${Date.now()}`;
        
        dispatch(adminVerifyOtpSuccess({ user: adminUser, token }));

        localStorage.setItem("em_admin_user", JSON.stringify(adminUser));
        localStorage.setItem("em_admin_token", token);
        
        // Dynamic route check: if they have a tempEmail, they might be in recovery, otherwise dashboard
        navigate('/admin/dashboard');
      } else {
        setError("Invalid 4-digit code. Use test code '1234'.");
      }
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title branding */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShield className="text-teal" /> Dual-Factor Authentication
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            A 4-digit code has been texted to your administrator profile.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          
          <OtpInput 
            value={otp} 
            onChange={handleOtpChange}
            error={error}
          />

          <p className="text-[10px] text-slate-400 font-extrabold uppercase text-center bg-slate-50 py-2 border border-slate-100 rounded-xl">
            Use test code <strong className="text-teal select-all font-black">1234</strong> to verify instantly.
          </p>

          <LoadingButton 
            loading={loading}
            color="secondary"
          >
            Verify Security Code
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

      </AuthCard>
    </AuthLayout>
  );
}
