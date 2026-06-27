import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../admin/components/AuthLayout';
import AuthCard from '../../admin/components/AuthCard';
import OtpInput from '../../admin/components/OtpInput';
import LoadingButton from '../../admin/components/LoadingButton';
import { vendorVerifyOtpSuccess } from '../store/vendorAuthSlice';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

export default function VendorVerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tempPhone, tempVendorData } = useSelector(state => state.vendorAuth || { tempPhone: null, tempVendorData: null });

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
        // Build mock merchant profile
        const mockVendor = tempVendorData || {
          name: 'MedPlus Wellness Manager',
          email: 'vendor@emediclub.com',
          role: 'vendor',
          phone: tempPhone || '8888888888',
          kycStatus: 'verified' // default dummy is already verified
        };

        const mockToken = `MOCK-VENDOR-JWT-${Date.now()}`;
        dispatch(vendorVerifyOtpSuccess({ user: mockVendor, token: mockToken }));
        
        // Dynamic redirect check: if status is pending, go to onboarding, else go to dashboard
        if (mockVendor.kycStatus === 'pending') {
          navigate('/vendor/onboarding-pending');
        } else {
          navigate('/vendor/dashboard');
        }
      } else {
        setError("Invalid 4-digit code. Use test code '1234'.");
      }
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShoppingBag className="text-teal" /> Verify Seller OTP
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            A 4-digit code has been texted to your mobile number +91 {tempPhone || '8888888888'}.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          
          <OtpInput 
            value={otp} 
            onChange={handleOtpChange}
            error={error}
          />

          <p className="text-[10px] text-slate-400 font-extrabold uppercase text-center bg-slate-50 py-2 border border-slate-100 rounded-xl select-none">
            Use test code <strong className="text-teal select-all font-black">1234</strong> to verify instantly.
          </p>

          <LoadingButton 
            loading={loading}
            color="secondary"
          >
            Verify OTP Code
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

      </AuthCard>
    </AuthLayout>
  );
}
