import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiArrowLeft, FiArrowRight, FiCheck, FiFileText, FiImage, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';
import apiClient from '../../../shared/services/apiClient';
import { vendorLoginSuccess } from '../../auth/vendor/store/vendorAuthSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { labSignupSchema } from '../schemas/vendor.schema';

export default function LabSignup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit: formHandleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(labSignupSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '', email: '', phone: '', password: '', confirmPassword: '',
      labName: '', nablNumber: '', regNumber: '', address: '', city: '', state: '', pincode: '', serviceablePincodes: '',
      homeCollection: false, homeCollectionRadius: ''
    }
  });

  const formData = watch();

  const [files, setFiles] = useState({
    nablDoc: null, regDoc: null, labPhoto: null, idProof: null
  });

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['fullName', 'email', 'phone', 'password', 'confirmPassword']);
    } else if (step === 2) {
      isValid = await trigger(['labName', 'nablNumber', 'regNumber', 'address', 'city', 'state', 'pincode', 'serviceablePincodes', 'homeCollection', 'homeCollectionRadius']);
    } else if (step === 3) {
      if (!files.regDoc || !files.labPhoto || !files.idProof) {
        setError("Please upload all mandatory documents");
        return;
      }
      isValid = true;
    }
    
    if (isValid) {
      setError("");
      setStep(prev => Math.min(prev + 1, 4));
    }
  };
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
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
      setFiles({ ...files, [field]: e.target.files[0] });
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

          <form onSubmit={step === 4 ? formHandleSubmit(onSubmit) : (e) => { e.preventDefault(); handleNext(); }} className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                      <input type="text" {...register('fullName')} className={`w-full px-4 py-3 bg-white border ${errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.fullName && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                      <input type="email" {...register('email')} className={`w-full px-4 py-3 bg-white border ${errors.email ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.email && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" {...register('phone')} className={`w-full px-4 py-3 bg-white border ${errors.phone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.phone && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} {...register('password')} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.password.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} {...register('confirmPassword')} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.confirmPassword ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.confirmPassword.message}</p>}
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
                      <input type="text" {...register('labName')} className={`w-full px-4 py-3 bg-white border ${errors.labName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.labName && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.labName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">NABL Accreditation No. (Optional)</label>
                      <input type="text" {...register('nablNumber')} className={`w-full px-4 py-3 bg-white border ${errors.nablNumber ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.nablNumber && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.nablNumber.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lab Registration No. *</label>
                      <input type="text" {...register('regNumber')} className={`w-full px-4 py-3 bg-white border ${errors.regNumber ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.regNumber && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.regNumber.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lab Address</label>
                      <textarea rows="2" {...register('address')} className={`w-full px-4 py-3 bg-white border ${errors.address ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 resize-none`} />
                      {errors.address && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.address.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
                      <input type="text" {...register('city')} className={`w-full px-4 py-3 bg-white border ${errors.city ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.city && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.city.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">State</label>
                      <input type="text" {...register('state')} className={`w-full px-4 py-3 bg-white border ${errors.state ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.state && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.state.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pincode</label>
                      <input type="text" {...register('pincode')} className={`w-full px-4 py-3 bg-white border ${errors.pincode ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.pincode && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.pincode.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Serviceable Pincodes</label>
                      <input type="text" {...register('serviceablePincodes')} placeholder="e.g. 400001, 400002" className={`w-full px-4 py-3 bg-white border ${errors.serviceablePincodes ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                      {errors.serviceablePincodes && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.serviceablePincodes.message}</p>}
                    </div>
                    <div className="flex items-center justify-between sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Home Sample Collection</p>
                        <p className="text-xs text-slate-500">Do you offer home collection services?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" {...register('homeCollection')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                      </label>
                    </div>
                    {formData.homeCollection && (
                      <div className="flex flex-col gap-1.5 sm:col-span-2 animate-fadeIn">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Home Collection Radius (in km)</label>
                        <input type="number" {...register('homeCollectionRadius')} className={`w-full px-4 py-3 bg-white border ${errors.homeCollectionRadius ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        {errors.homeCollectionRadius && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.homeCollectionRadius.message}</p>}
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
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${files[doc.id] ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-400 group-hover:bg-teal/10 group-hover:text-teal'} transition-colors`}>
                          {files[doc.id] ? <FiCheck /> : doc.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center">{doc.label}</span>
                        {files[doc.id] && <span className="text-[10px] font-semibold text-teal mt-1 max-w-[150px] truncate">{files[doc.id].name}</span>}
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
