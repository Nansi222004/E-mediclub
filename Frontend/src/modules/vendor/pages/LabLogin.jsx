import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../../../shared/components/Logo';
import apiClient from '../../../shared/services/apiClient';
import { vendorLoginSuccess } from '../../auth/vendor/store/vendorAuthSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendorLoginSchema } from '../schemas/vendor.schema';

export default function LabLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(vendorLoginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await apiClient.post('/api/auth/login', {
        emailOrPhone: data.email,
        password: data.password
      });
      const { user, accessToken } = response.data.data;
      if (user.role !== 'lab_vendor') {
        setErrorMsg("Access denied. This portal is for Lab Vendors only.");
        setIsLoading(false);
        return;
      }
      localStorage.setItem('labToken', accessToken);
      localStorage.setItem('labProfile', JSON.stringify(user));
      dispatch(vendorLoginSuccess({ user, token: accessToken }));
      navigate('/vendor/lab/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Invalid login credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden relative">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#082f49] to-teal p-12 flex-col justify-between relative overflow-hidden text-white border-r border-[#082f49] shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        {/* Branding header */}
        <div className="z-10 flex items-center gap-2 bg-white rounded-xl px-4 py-2 self-start shadow-lg">
          <Logo showText={true} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-5xl shadow-2xl backdrop-blur-sm border border-white/20 mb-8">
            🔬
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-md">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">Diagnostics Partner Portal</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            Manage your diagnostics lab with E Mediclub
          </h2>
          <p className="text-white/80 text-sm mt-4 leading-relaxed font-medium">
            Manage your tests, process online bookings, and upload test reports seamlessly.
          </p>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-white/50 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 relative bg-white overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md z-10 flex flex-col gap-4">
          
          <div className="flex flex-col items-center justify-center w-full mb-4">
            <Logo layout="stacked" />
            <div className="flex items-center gap-1.5 mt-3 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-sm">🔬</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Diagnostics Partner Portal</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium relative">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back</h3>
            <p className="text-sm text-slate-500 font-medium mt-1 mb-5">Sign in to manage your lab</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-550/10 border border-rose-500/10 text-rose-600 rounded-xl text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email or Phone</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...register('email')}
                    placeholder="Enter email or phone number"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-coral focus:border-coral focus:ring-coral/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-400 placeholder:font-medium`}
                  />
                </div>
                {errors.email && <p className="text-coral text-[10px] font-bold px-1">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                  <button type="button" className="text-xs font-bold text-teal hover:text-[#164E4D] transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errors.password ? 'border-coral focus:border-coral focus:ring-coral/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-colors placeholder:text-slate-400 placeholder:font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-coral text-[10px] font-bold px-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 bg-teal hover:bg-teal-dark text-white text-sm font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In to Diagnostics Portal'
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <button
              type="button"
              className="mt-5 w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl vendor-btn flex items-center justify-center gap-3 transition-colors"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm font-semibold text-slate-500">
              Don't have an account?{' '}
              <Link to="/vendor/lab/signup" className="text-teal font-black hover:underline">
                Register as Lab →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
