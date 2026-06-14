import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import SplashScreen from '../components/SplashScreen';

export default function LabLogin() {
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('labToken', 'dummy-token');
      localStorage.setItem('labProfile', JSON.stringify({ name: 'Lab User' }));
      navigate('/vendor/lab/dashboard');
    }, 1500);
  };

  if (showSplash) return <SplashScreen vendorType="lab" />;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-sans vendor-auth-layout">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#082f49] to-teal p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-2xl mb-8">
            🔬
          </div>
          <h1 className="text-4xl font-extrabold mb-4 font-['Plus_Jakarta_Sans']">Emediclub</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-md">
            <span>🔬</span>
            <span className="text-sm font-semibold tracking-wide">Diagnostics Partner Portal</span>
          </div>
          <p className="text-white/80 text-lg leading-relaxed">
            Manage your lab tests, process home sample collections, and upload reports digitally through Emediclub.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full vendor-auth-card shadow-2xl border border-slate-100 bg-white relative">
          
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#082f49] to-teal rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-4">
              <span className="text-white">🔬</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans']">Emediclub</h2>
            <p className="text-sm font-bold text-teal mt-1">🔬 Diagnostics Partner Portal</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back</h3>
            <p className="text-sm text-slate-500 font-medium mt-2">Sign in to manage your lab</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email or Phone</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email or phone number"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs font-bold text-teal hover:text-[#082f49] transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors placeholder:text-slate-400 placeholder:font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-4 bg-teal hover:bg-teal-dark text-white text-sm font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In to Lab Portal'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            type="button"
            className="mt-8 w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl vendor-btn flex items-center justify-center gap-3 transition-colors"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm font-semibold text-slate-500">
            Don't have an account?{' '}
            <Link to="/vendor/lab/signup" className="text-teal font-black hover:underline">
              Register as Diagnostic Lab →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
