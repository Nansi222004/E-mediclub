import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUploadCloud, FiFileText, FiImage, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';
import apiClient from '../../../shared/services/apiClient';
import { vendorLoginSuccess } from '../../auth/vendor/store/vendorAuthSlice';

export default function LabSignup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    labName: '', nablNumber: '', regNumber: '', address: '', city: '', state: '', pincode: '', serviceablePincodes: '',
    homeCollection: false, homeCollectionRadius: '',
    nablDoc: null, regDoc: null, labPhoto: null, idProof: null
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, fullName: val});
    if (/[0-9]/.test(val)) {
      setErrors(prev => ({ ...prev, fullName: 'Name cannot contain numbers' }));
    } else if (/[^a-zA-Z\s]/.test(val)) {
      setErrors(prev => ({ ...prev, fullName: 'Name cannot contain special characters' }));
    } else if (val && val.trim().length < 2) {
      setErrors(prev => ({ ...prev, fullName: 'Name must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, phone: val});
    if (val && val.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number must be 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, email: val});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, password: val});
    if (val && val.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, confirmPassword: val});
    if (val && val !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleLabNameChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, labName: val});
    if (val && val.trim().length < 2) {
      setErrors(prev => ({ ...prev, labName: 'Lab Name must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, labName: '' }));
    }
  };

  const handleNablNumberChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, nablNumber: val});
    setErrors(prev => ({ ...prev, nablNumber: '' }));
  };

  const handleRegNumberChange = (e) => {
    const val = e.target.value.toUpperCase();
    setFormData({...formData, regNumber: val});
    if (/[^A-Z0-9]/.test(val)) {
      setErrors(prev => ({ ...prev, regNumber: 'Registration No. can only contain letters and numbers' }));
    } else {
      setErrors(prev => ({ ...prev, regNumber: '' }));
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, address: val});
    if (val && val.trim().length < 5) {
      setErrors(prev => ({ ...prev, address: 'Address is too short' }));
    } else {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, city: val});
    if (/[^a-zA-Z\s]/.test(val)) {
      setErrors(prev => ({ ...prev, city: 'City can only contain letters and spaces' }));
    } else {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, state: val});
    if (/[^a-zA-Z\s]/.test(val)) {
      setErrors(prev => ({ ...prev, state: 'State can only contain letters and spaces' }));
    } else {
      setErrors(prev => ({ ...prev, state: '' }));
    }
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, pincode: val});
    if (val && val.length !== 6) {
      setErrors(prev => ({ ...prev, pincode: 'Pincode must be 6 digits' }));
    } else {
      setErrors(prev => ({ ...prev, pincode: '' }));
    }
  };

  const handleServiceablePincodesChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, serviceablePincodes: val});
    if (val && !/^(\d{6})(,\s*\d{6})*$/.test(val)) {
      setErrors(prev => ({ ...prev, serviceablePincodes: 'Enter valid 6-digit pincodes separated by commas' }));
    } else {
      setErrors(prev => ({ ...prev, serviceablePincodes: '' }));
    }
  };

  const handleRadiusChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, homeCollectionRadius: val});
    if (val && parseInt(val) <= 0) {
      setErrors(prev => ({ ...prev, homeCollectionRadius: 'Radius must be greater than 0' }));
    } else {
      setErrors(prev => ({ ...prev, homeCollectionRadius: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.post('/api/auth/register', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'lab_vendor'
      });
      const { user, accessToken } = response.data.data;
      
      localStorage.setItem('labToken', accessToken);
      localStorage.setItem('labProfile', JSON.stringify(user));
      dispatch(vendorLoginSuccess({ user, token: accessToken }));

      // Save lab details to profile
      await apiClient.put('/api/labs/vendor/profile', {
        name: formData.labName,
        city: formData.city,
        pincode: formData.pincode,
        state: formData.state,
        address: formData.address,
        mobileNumber: formData.phone,
        emailAddress: formData.email,
        ownerName: formData.fullName,
        facilitiesList: {
          nablCertified: formData.nablNumber ? true : false,
          homeCollection: formData.homeCollection,
          digitalReports: true,
          sameDayReports: true,
          parkingAvailable: false,
          wheelchairAccess: false,
          emergencyTesting: false,
          onlinePayments: true
        }
      });

      navigate('/vendor/lab/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
      setIsLoading(false);
    }
  };

  const handleFileChange = (field, e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
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
            Join E Mediclub's Lab Network
          </h2>
          <p className="text-white/80 text-sm mt-4 leading-relaxed font-medium">
            Reach more patients, manage your lab bookings easily, and offer digital reports.
          </p>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-white/50 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto no-scrollbar">
        <div className="w-full max-w-xl z-10 flex flex-col gap-4">
          
          <div className="flex flex-col items-center justify-center w-full mb-4">
            <Logo layout="stacked" />
            <div className="flex items-center gap-1.5 mt-3 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
              <span className="text-sm">🔬</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Diagnostics Partner Portal</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Register Lab</h3>
              <span className="text-sm font-black text-teal bg-teal/10 px-3 py-1 rounded-full">
                Step {step} of 4
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex gap-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-full flex-1 transition-all duration-500 ${step >= i ? 'bg-teal' : 'bg-transparent'}`} />
              ))}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold">
                ⚠️ {error}
              </div>
            )}
          </div>

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                      <input required type="text" value={formData.fullName} onChange={handleNameChange} className={`w-full px-4 py-3 bg-white border ${errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.fullName && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.fullName}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                      <input required type="email" value={formData.email} onChange={handleEmailChange} className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.email && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                      <input required type="tel" value={formData.phone} onChange={handlePhoneChange} className={`w-full px-4 py-3 bg-white border ${errors.phone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.phone && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={handlePasswordChange} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.password}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <input required type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleConfirmPasswordChange} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.confirmPassword ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Lab Details */}
              {step === 2 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Diagnostic Center Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lab / Diagnostic Center Name</label>
                      <input required type="text" value={formData.labName} onChange={handleLabNameChange} className={`w-full px-4 py-3 bg-white border ${errors.labName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.labName && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.labName}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">NABL Accreditation No. (Optional)</label>
                      <input type="text" value={formData.nablNumber} onChange={handleNablNumberChange} className={`w-full px-4 py-3 bg-white border ${errors.nablNumber ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lab Registration No. *</label>
                      <input required type="text" value={formData.regNumber} onChange={handleRegNumberChange} className={`w-full px-4 py-3 bg-white border ${errors.regNumber ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.regNumber && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.regNumber}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lab Address</label>
                      <textarea required rows="2" value={formData.address} onChange={handleAddressChange} className={`w-full px-4 py-3 bg-white border ${errors.address ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 resize-none`} />
                      {errors.address && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.address}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
                      <input required type="text" value={formData.city} onChange={handleCityChange} className={`w-full px-4 py-3 bg-white border ${errors.city ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.city && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.city}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">State</label>
                      <input required type="text" value={formData.state} onChange={handleStateChange} className={`w-full px-4 py-3 bg-white border ${errors.state ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.state && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.state}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pincode</label>
                      <input required type="text" value={formData.pincode} onChange={handlePincodeChange} className={`w-full px-4 py-3 bg-white border ${errors.pincode ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.pincode && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.pincode}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Serviceable Pincodes</label>
                      <input required type="text" value={formData.serviceablePincodes} onChange={handleServiceablePincodesChange} placeholder="e.g. 400001, 400002" className={`w-full px-4 py-3 bg-white border ${errors.serviceablePincodes ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.serviceablePincodes && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.serviceablePincodes}</p>}
                    </div>
                    <div className="flex items-center justify-between sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Home Sample Collection</p>
                        <p className="text-xs text-slate-500">Do you offer home collection services?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.homeCollection} onChange={e => setFormData({...formData, homeCollection: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                      </label>
                    </div>
                    {formData.homeCollection && (
                      <div className="flex flex-col gap-1.5 sm:col-span-2 animate-fadeIn">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Home Collection Radius (in km)</label>
                        <input type="number" required value={formData.homeCollectionRadius} onChange={handleRadiusChange} className={`w-full px-4 py-3 bg-white border ${errors.homeCollectionRadius ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        {errors.homeCollectionRadius && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.homeCollectionRadius}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Upload Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'nablDoc', label: 'NABL Certificate (Optional)', icon: <FiFileText /> },
                      { id: 'regDoc', label: 'Lab Registration Cert.', icon: <FiFileText /> },
                      { id: 'labPhoto', label: 'Diagnostic Center Photo', icon: <FiImage /> },
                      { id: 'idProof', label: 'Owner ID Proof', icon: <FiUser /> }
                    ].map((doc) => (
                      <div key={doc.id} className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
                        <input type="file" required={doc.id !== 'nablDoc'} onChange={(e) => handleFileChange(doc.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${formData[doc.id] ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-400 group-hover:bg-teal/10 group-hover:text-teal'} transition-colors`}>
                          {formData[doc.id] ? <FiCheck /> : doc.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center">{doc.label}</span>
                        {formData[doc.id] && <span className="text-[10px] font-semibold text-teal mt-1 max-w-[150px] truncate">{formData[doc.id].name}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Review & Submit</h4>
                  
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Basic Info</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                        <div>Name: <span className="text-slate-900">{formData.fullName}</span></div>
                        <div>Phone: <span className="text-slate-900">{formData.phone}</span></div>
                        <div className="col-span-2">Email: <span className="text-slate-900">{formData.email}</span></div>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-slate-100" />
                    
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Lab Details</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                        <div className="col-span-2">Lab: <span className="text-slate-900">{formData.labName}</span></div>
                        <div>Reg No: <span className="text-slate-900">{formData.regNumber}</span></div>
                        <div>NABL: <span className="text-slate-900">{formData.nablNumber || 'N/A'}</span></div>
                        <div className="col-span-2">Address: <span className="text-slate-900">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</span></div>
                        {formData.homeCollection && <div className="col-span-2 text-teal">Provides Home Collection ({formData.homeCollectionRadius} km radius)</div>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal/10 border border-teal/20 rounded-2xl p-4 flex gap-3">
                    <FiCheck className="text-teal text-xl shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-[#082f49] leading-relaxed">
                      By submitting, you agree to our Vendor Terms & Conditions. Your application will be reviewed within 24-48 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 pb-8">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-650 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <FiArrowLeft /> Back
                </button>
              ) : (
                <Link to="/vendor/lab/login" className="text-sm font-bold text-slate-505 hover:text-slate-800 transition-colors">
                  Cancel
                </Link>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-teal hover:bg-teal-dark text-white text-sm font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center gap-2 ml-auto"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : step === 4 ? (
                  'Submit for Approval'
                ) : (
                  <>Next Step <FiArrowRight /></>
                )}
              </button>
            </div>
          </form>

          {step === 1 && (
            <p className="text-center text-sm font-semibold text-slate-500 pb-8">
              Already have an account?{' '}
              <Link to="/vendor/lab/login" className="text-teal font-black hover:underline">
                Sign In →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
