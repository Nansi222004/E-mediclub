import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { vendorLoginSuccess } from '../../auth/vendor/store/vendorAuthSlice';
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheck, 
  FiFileText, 
  FiImage, 
  FiUser, 
  FiUploadCloud, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiTrash2, 
  FiCheckCircle 
} from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';
import apiClient from '../../../shared/services/apiClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pharmacySignupSchema } from '../schemas/vendor.schema';

export default function PharmacySignup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit: formHandleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(pharmacySignupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '', email: '', phone: '', password: '', confirmPassword: '',
      storeName: '', gstNumber: '', drugLicenseNumber: '', pharmacistRegistrationNumber: '',
      landmark: '', googleMapsLocation: '', openingHour: '09', openingMinute: '00', openingAmpm: 'AM',
      closingHour: '09', closingMinute: '00', closingAmpm: 'PM', deliveryRadius: 5, homeDelivery: true,
      address: '', city: '', state: '', pincode: ''
    }
  });

  const formData = watch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Step 3: Documents
  const [files, setFiles] = useState({
    drugLicense: null,
    gstCertificate: null,
    pharmacistCertificate: null,
    panCard: null,
    logo: null,
    storeFrontImage: null,
    governmentId: null,
    pharmacyPhoto: null
  });

  const [uploadProgress, setUploadProgress] = useState({
    drugLicense: 0, gstCertificate: 0, pharmacistCertificate: 0, panCard: 0, logo: 0, storeFrontImage: 0, governmentId: 0, pharmacyPhoto: 0
  });

  const [fileErrors, setFileErrors] = useState({});

  // Declaration
  const [declared, setDeclared] = useState(false);

  // OTP countdown timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  // Simulated OTP Send
  const handleSendOTP = () => {
    if (!formData.phone || formData.phone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpError('');
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
      setOtpTimer(60);
    }, 1000);
  };

  // Simulated OTP Verify
  const handleVerifyOTP = () => {
    if (!otpCode || otpCode.length < 4) {
      setOtpError('Please enter a valid 4-digit code.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    setTimeout(() => {
      setOtpLoading(false);
      if (otpCode === '1234' || otpCode.length === 4) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError('Invalid OTP code. Try entering 1234.');
      }
    }, 1000);
  };

  // File Upload Helper
  const handleFileChange = (field, file) => {
    if (!file) return;

    // Validate size (< 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileErrors(prev => ({ ...prev, [field]: 'File size exceeds 5MB limit.' }));
      return;
    }

    // Validate type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFileErrors(prev => ({ ...prev, [field]: 'Only PDF, JPG, JPEG, and PNG are allowed.' }));
      return;
    }

    // Clear file error if valid
    setFileErrors(prev => ({ ...prev, [field]: null }));

    setFiles(prev => ({ ...prev, [field]: file }));
    setUploadProgress(prev => ({ ...prev, [field]: 10 }));

    // Simulate upload progress animation
    let prog = 10;
    const interval = setInterval(() => {
      prog += 20;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [field]: prog }));
    }, 100);
  };

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['name', 'email', 'phone', 'password', 'confirmPassword']);
      if (isValid && !otpVerified) {
        setApiError('Please complete mobile OTP verification.');
        return;
      }
    } else if (step === 2) {
      isValid = await trigger(['storeName', 'gstNumber', 'drugLicenseNumber', 'pharmacistRegistrationNumber', 'address', 'city', 'state', 'pincode', 'deliveryRadius']);
    } else if (step === 3) {
      const requiredDocs = ['drugLicense', 'gstCertificate', 'pharmacistCertificate', 'panCard', 'governmentId'];
      const missing = requiredDocs.filter(doc => !files[doc]);
      if (missing.length > 0) {
        setApiError('Please upload all mandatory documents (Drug License, GST, Pharmacist Cert, PAN, Government ID).');
        return;
      }
      isValid = true;
    }

    if (isValid) {
      setApiError('');
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setApiError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    if (!declared) {
      setApiError('You must agree to the declaration check.');
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('email', data.email);
      formDataToSend.append('phone', data.phone);
      formDataToSend.append('password', data.password);
      formDataToSend.append('storeName', data.storeName);
      formDataToSend.append('landmark', data.landmark);
      formDataToSend.append('googleMapsLocation', data.googleMapsLocation);
      formDataToSend.append('openingTime', `${data.openingHour}:${data.openingMinute} ${data.openingAmpm}`);
      formDataToSend.append('closingTime', `${data.closingHour}:${data.closingMinute} ${data.closingAmpm}`);
      formDataToSend.append('deliveryRadius', data.deliveryRadius);
      formDataToSend.append('homeDelivery', data.homeDelivery);
      formDataToSend.append('address', data.address);
      formDataToSend.append('city', data.city);
      formDataToSend.append('state', data.state);
      formDataToSend.append('pincode', data.pincode);
      formDataToSend.append('drugLicenseNumber', data.drugLicenseNumber);
      formDataToSend.append('gstNumber', data.gstNumber);
      formDataToSend.append('pharmacistRegistrationNumber', data.pharmacistRegistrationNumber);

      // Append files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });

      const res = await apiClient.post('/api/auth/register-pharmacy', formDataToSend, {
        headers: { 'Content-Type': undefined }
      });

      if (res.data.success) {
        const { user, accessToken } = res.data.data;
        dispatch(vendorLoginSuccess({ user, token: accessToken }));
        navigate('/vendor/onboarding-pending');
      } else {
        setApiError(res.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Error occurred while registering. Please verify input fields.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden relative">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-teal-dark to-teal p-12 flex-col justify-between relative overflow-hidden text-white border-r border-teal-dark shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        {/* Branding header */}
        <div className="z-10 flex items-center gap-2 bg-white rounded-xl px-4 py-2 self-start shadow-lg">
          <Logo showText={true} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl backdrop-blur-sm border border-white/20 mb-8">
            🏥
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-md">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">Pharmacy Partner Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
            Join E Mediclub's Pharmacy Network
          </h2>
          <p className="text-white/80 text-xs mt-4 leading-relaxed font-medium">
            Expand your healthcare reach, manage your medical supplies easily, and process online prescription orders with verified compliance.
          </p>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-white/50 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-4 sm:p-8 relative bg-white overflow-y-auto no-scrollbar">
        <div className="w-full max-w-2xl z-10 flex flex-col gap-4">
          
          <div className="flex flex-col items-center justify-center w-full mb-2">
            <Logo layout="stacked" />
            <div className="flex items-center gap-1.5 mt-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full shadow-sm">
              <span className="text-sm">🏥</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pharmacy Registration Flow</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-premium relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Register Pharmacy</h3>
              <span className="text-xs font-black text-teal bg-teal/10 px-3 py-1 rounded-full">
                Step {step} of 4
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex gap-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-full flex-1 transition-all duration-500 ${step >= i ? 'bg-teal' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>

          {apiError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse-subtle">
              <FiAlertCircle className="text-sm shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={step === 4 ? formHandleSubmit(onSubmit) : (e) => { e.preventDefault(); handleNext(); }} className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="flex flex-col gap-4 animate-slideUp">
                  <h4 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">Step 1: Account & Owner Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Owner Full Name *</label>
                      <input type="text" {...register('name')} placeholder="Enter full name" className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.name && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address *</label>
                      <input type="email" {...register('email')} placeholder="owner@store.com" className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.email && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.email.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mobile Number *</label>
                      <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1.5">
                          <input type="tel" disabled={otpVerified} {...register('phone')} placeholder="10-digit mobile number" className={`w-full px-4 py-2.5 bg-white border ${errors.phone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500`} />
                          {errors.phone && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.phone.message}</p>}
                        </div>
                        {!otpVerified && (
                          <button type="button" onClick={handleSendOTP} disabled={otpLoading || otpTimer > 0} className="px-4 py-2.5 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-black shrink-0 transition-colors disabled:bg-slate-200 disabled:text-slate-400 self-start">
                            {otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Send OTP'}
                          </button>
                        )}
                        {otpVerified && (
                          <span className="px-3 py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-black flex items-center gap-1">
                            <FiCheckCircle /> Verified
                          </span>
                        )}
                      </div>
                      {otpSent && !otpVerified && (
                        <div className="mt-2 p-3 bg-teal/5 border border-teal/10 rounded-xl flex flex-col gap-2">
                          <span className="text-[10px] text-teal-dark font-semibold">Enter verification code sent to your phone (Enter <strong className="text-teal font-black">1234</strong> to quick test)</span>
                          <div className="flex gap-2">
                            <input type="text" maxLength={4} value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} placeholder="4-digit code" className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-center font-black tracking-widest text-xs" />
                            <button type="button" onClick={handleVerifyOTP} disabled={otpLoading} className="px-4 py-2 bg-teal text-white rounded-lg text-xs font-bold hover:bg-teal-dark transition-colors">
                              Verify OTP
                            </button>
                          </div>
                          {otpError && <span className="text-rose-500 text-[10px] font-bold">{otpError}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password *</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Minimum 6 characters" className={`w-full pl-4 pr-10 py-2.5 bg-white border ${errors.password ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && <span className="text-rose-500 text-[9px] font-bold px-1">{errors.password.message}</span>}
                      {formData.password && (
                        <div className="mt-1 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">Strength:</span>
                            <span className={strength.textColor}>{strength.label}</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Confirm Password *</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="Confirm your password" className={`w-full pl-4 pr-10 py-2.5 bg-white border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-rose-500 text-[9px] font-bold px-1">{errors.confirmPassword.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pharmacy Details */}
              {step === 2 && (
                <div className="flex flex-col gap-4 animate-slideUp">
                  <h4 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">Step 2: Store Information</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pharmacy / Store Name *</label>
                      <input type="text" {...register('storeName')} placeholder="e.g. Apollo Pharmacy Store" className={`w-full px-4 py-2.5 bg-white border ${errors.storeName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.storeName && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.storeName.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Drug License Number *</label>
                      <input type="text" {...register('drugLicenseNumber')} placeholder="e.g. DL-20831/15" className={`w-full px-4 py-2.5 bg-white border ${errors.drugLicenseNumber ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20`} />
                      {errors.drugLicenseNumber && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.drugLicenseNumber.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">GST Number *</label>
                      <input type="text" {...register('gstNumber')} placeholder="27AAAAA1111A1Z1" className={`w-full px-4 py-2.5 bg-white border ${errors.gstNumber ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.gstNumber && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.gstNumber.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pharmacist Registration Number *</label>
                      <input type="text" {...register('pharmacistRegistrationNumber')} placeholder="e.g. REG-12345/MH" className={`w-full px-4 py-2.5 bg-white border ${errors.pharmacistRegistrationNumber ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20`} />
                      {errors.pharmacistRegistrationNumber && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.pharmacistRegistrationNumber.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Street Address *</label>
                      <textarea rows="2" {...register('address')} placeholder="Detailed store layout address details..." className={`w-full px-4 py-2 bg-white border ${errors.address ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 resize-none`} />
                      {errors.address && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.address.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Landmark</label>
                      <input type="text" {...register('landmark')} placeholder="e.g. Near City Hospital" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Google Maps Link</label>
                      <input type="url" {...register('googleMapsLocation')} placeholder="https://maps.google.com/?q=..." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">City *</label>
                      <input type="text" {...register('city')} placeholder="e.g. Mumbai" className={`w-full px-4 py-2.5 bg-white border ${errors.city ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.city && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.city.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">State *</label>
                      <input type="text" {...register('state')} placeholder="e.g. Maharashtra" className={`w-full px-4 py-2.5 bg-white border ${errors.state ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.state && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.state.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pincode *</label>
                      <input type="text" maxLength={6} {...register('pincode')} placeholder="400001" className={`w-full px-4 py-2.5 bg-white border ${errors.pincode ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.pincode && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.pincode.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Delivery Radius (KM) *</label>
                      <input type="number" min="1" max="100" {...register('deliveryRadius')} className={`w-full px-4 py-2.5 bg-white border ${errors.deliveryRadius ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20`} />
                      {errors.deliveryRadius && <p className="text-rose-500 text-[9px] font-bold px-1">{errors.deliveryRadius.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Store Opening & Closing Timings *</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Opening Time */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex-1 w-full justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-400 pl-1.5">Open:</span>
                          <div className="flex items-center gap-1">
                            <select {...register('openingHour')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer">
                              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className="text-slate-400 font-bold">:</span>
                            <select {...register('openingMinute')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer">
                              {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select {...register('openingAmpm')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer ml-1">
                              {['AM','PM'].map(ap => <option key={ap} value={ap}>{ap}</option>)}
                            </select>
                          </div>
                        </div>

                        <span className="text-slate-400 text-xs self-center hidden sm:inline">to</span>

                        {/* Closing Time */}
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex-1 w-full justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-400 pl-1.5">Close:</span>
                          <div className="flex items-center gap-1">
                            <select {...register('closingHour')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer">
                              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className="text-slate-400 font-bold">:</span>
                            <select {...register('closingMinute')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer">
                              {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select {...register('closingAmpm')} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer ml-1">
                              {['AM','PM'].map(ap => <option key={ap} value={ap}>{ap}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">Home Delivery Available</span>
                        <span className="text-[10px] text-slate-400">Tick if your pharmacy provides doorstep delivery to nearby customers</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" {...register('homeDelivery')} className="sr-only peer" />
                        <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents Upload */}
              {step === 3 && (
                <div className="flex flex-col gap-4 animate-slideUp">
                  <h4 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">Step 3: Document Verification (Drug Reg. Compliance)</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Please upload clear scan copies of registration/license documents to speed up verification. Max file size: 5MB. Formats: PDF, JPG, PNG.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'drugLicense', label: 'Drug License Certificate *', required: true, icon: <FiFileText /> },
                      { id: 'gstCertificate', label: 'GST Certificate *', required: true, icon: <FiFileText /> },
                      { id: 'pharmacistCertificate', label: 'Pharmacist Certificate *', required: true, icon: <FiFileText /> },
                      { id: 'panCard', label: 'PAN Card Certificate *', required: true, icon: <FiFileText /> },
                      { id: 'governmentId', label: 'Owner Government ID *', required: true, icon: <FiUser /> },
                      { id: 'logo', label: 'Store Logo (Optional)', required: false, icon: <FiImage /> },
                      { id: 'storeFrontImage', label: 'Store Front Image (Optional)', required: false, icon: <FiImage /> },
                      { id: 'pharmacyPhoto', label: 'Pharmacy Inside Photo (Optional)', required: false, icon: <FiImage /> }
                    ].map((doc) => {
                      const file = files[doc.id];
                      const progress = uploadProgress[doc.id];
                      const fileError = fileErrors[doc.id];

                      return (
                        <div key={doc.id} className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{doc.label}</label>
                          <div 
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                              e.preventDefault();
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                handleFileChange(doc.id, e.dataTransfer.files[0]);
                              }
                            }}
                            className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all group cursor-pointer ${file ? 'border-teal/30' : 'border-slate-200'}`}
                          >
                            <input type="file" onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileChange(doc.id, e.target.files[0]);
                              }
                            }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            
                            {file ? (
                              <div className="w-full flex items-center justify-between z-20">
                                <div className="flex items-center gap-2 truncate">
                                  {file.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center"><FiFileText /></div>
                                  )}
                                  <div className="flex flex-col truncate">
                                    <span className="text-[10px] font-bold text-slate-800 truncate max-w-[120px]">{file.name}</span>
                                    <span className="text-[8px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {progress < 100 ? (
                                    <div className="w-8 h-1 bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-teal" style={{ width: `${progress}%` }} />
                                    </div>
                                  ) : (
                                    <span className="text-teal text-xs"><FiCheck /></span>
                                  )}
                                  <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(doc.id); }} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200 transition-colors z-20">
                                    <FiTrash2 className="text-xs" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-center py-2">
                                <FiUploadCloud className="text-slate-400 text-lg group-hover:text-teal transition-colors" />
                                <span className="text-[10px] font-bold text-slate-500">Drag & drop or <strong className="text-teal font-extrabold">browse</strong></span>
                              </div>
                            )}
                          </div>
                          {fileError && <span className="text-rose-500 text-[9px] font-bold">{fileError}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Review Details */}
              {step === 4 && (
                <div className="flex flex-col gap-4 animate-slideUp">
                  <h4 className="text-base font-black text-slate-800 border-b border-slate-100 pb-2">Step 4: Review Registration Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account & Owner</span>
                      <div className="text-xs text-slate-700 flex flex-col gap-1">
                        <div>Name: <strong className="text-slate-800">{formData.name}</strong></div>
                        <div>Email: <strong className="text-slate-800">{formData.email}</strong></div>
                        <div>Mobile: <strong className="text-slate-800">{formData.phone}</strong></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pharmacy Details</span>
                      <div className="text-xs text-slate-700 flex flex-col gap-1">
                        <div>Store: <strong className="text-slate-800">{formData.storeName}</strong></div>
                        <div>Drug License: <strong className="text-slate-800">{formData.drugLicenseNumber}</strong></div>
                        <div>GST Number: <strong className="text-slate-800">{formData.gstNumber}</strong></div>
                        <div>Pharmacist Reg: <strong className="text-slate-800">{formData.pharmacistRegistrationNumber}</strong></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 sm:col-span-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Operations & Address</span>
                      <div className="text-xs text-slate-700 grid grid-cols-2 gap-2">
                        <div className="col-span-2">Address: <strong className="text-slate-800">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</strong></div>
                        {formData.landmark && <div>Landmark: <strong className="text-slate-800">{formData.landmark}</strong></div>}
                        <div>Radius: <strong className="text-slate-800">{formData.deliveryRadius} KM</strong></div>
                        <div>Timings: <strong className="text-slate-800">{formData.openingHour}:{formData.openingMinute} {formData.openingAmpm} to {formData.closingHour}:{formData.closingMinute} {formData.closingAmpm}</strong></div>
                        <div>Home Delivery: <strong className="text-slate-800">{formData.homeDelivery ? 'Yes' : 'No'}</strong></div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 sm:col-span-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Documents Checklist</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'drugLicense', label: 'Drug License Scan' },
                          { id: 'gstCertificate', label: 'GST Reg. Scan' },
                          { id: 'pharmacistCertificate', label: 'Pharmacist License Scan' },
                          { id: 'panCard', label: 'PAN Card Scan' },
                          { id: 'governmentId', label: 'Govt. ID Scan' }
                        ].map(doc => (
                          <div key={doc.id} className="flex items-center gap-1.5 font-bold text-slate-700">
                            <span className="text-emerald-500 text-sm"><FiCheck /></span>
                            <span>{doc.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-2xl flex gap-3 items-start bg-slate-50 mt-2">
                    <input required type="checkbox" id="terms" checked={declared} onChange={e => setDeclared(e.target.checked)} className="mt-1 w-4 h-4 text-teal border-slate-300 rounded focus:ring-teal cursor-pointer" />
                    <label htmlFor="terms" className="text-xs font-semibold text-slate-600 leading-relaxed cursor-pointer select-none">
                      I hereby declare that the drug licenses, pharmacist certificates, and pharmacy details furnished above are true and compliant with standard CDSCO and FDA regulations. E-Mediclub holds the right to block the account if any discrepancy is found.
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 pb-4">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <FiArrowLeft /> Back
                </button>
              ) : (
                <Link to="/vendor/pharmacy/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Cancel
                </Link>
              )}

              {step === 4 ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center gap-2 ml-auto"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Submit for Review'
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center gap-2 ml-auto"
                >
                  Next Step <FiArrowRight />
                </button>
              )}
            </div>
          </form>

          {step === 1 && (
            <p className="text-center text-xs font-bold text-slate-500 pb-4">
              Already have an account?{' '}
              <Link to="/vendor/pharmacy/login" className="text-teal font-black hover:underline">
                Login instead →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
