import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiUploadCloud, FiFileText, FiImage, FiUser } from 'react-icons/fi';
import SplashScreen from '../components/SplashScreen';

export default function PharmacySignup() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    storeName: '', dlNumber: '', gstNumber: '', address: '', city: '', state: '', pincode: '', serviceablePincodes: '',
    dlDoc: null, gstDoc: null, storePhoto: null, idProof: null
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/vendor/onboarding-pending', { state: { type: 'pharmacy' } });
    }, 2000);
  };

  const handleFileChange = (field, e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  if (showSplash) return <SplashScreen vendorType="pharmacy" />;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-sans vendor-auth-layout">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#135A5A] to-teal p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-2xl mb-8">🏥</div>
          <h1 className="text-4xl font-extrabold mb-4 font-['Plus_Jakarta_Sans']">Join Emediclub</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-md">
            <span>💊</span>
            <span className="text-sm font-semibold tracking-wide">Pharmacy Partner Network</span>
          </div>
          <p className="text-white/80 text-lg leading-relaxed">
            Expand your pharmacy's reach. Receive online orders and manage prescriptions digitally with zero hassle.
          </p>
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto flex-1 flex flex-col pt-8">
          
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#135A5A] to-teal rounded-xl flex items-center justify-center text-xl shadow-lg">
              <span className="text-white">🏥</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-['Plus_Jakarta_Sans']">Emediclub</h2>
              <p className="text-xs font-bold text-teal">Pharmacy Partner Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Register Pharmacy</h3>
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
                      <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                      <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                      <input required type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pharmacy Details */}
              {step === 2 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Pharmacy Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pharmacy / Store Name</label>
                      <input required type="text" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Drug License Number *</label>
                      <input required type="text" value={formData.dlNumber} onChange={e => setFormData({...formData, dlNumber: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">GST Number</label>
                      <input type="text" value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Store Address</label>
                      <textarea required rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input resize-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
                      <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">State</label>
                      <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pincode</label>
                      <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Serviceable Pincodes (comma separated)</label>
                      <input required type="text" value={formData.serviceablePincodes} onChange={e => setFormData({...formData, serviceablePincodes: e.target.value})} placeholder="e.g. 400001, 400002" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none vendor-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Upload Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* File Upload Helper */}
                    {[
                      { id: 'dlDoc', label: 'Drug License Certificate', icon: <FiFileText /> },
                      { id: 'gstDoc', label: 'GST Certificate (Optional)', icon: <FiFileText /> },
                      { id: 'storePhoto', label: 'Store Front Photo', icon: <FiImage /> },
                      { id: 'idProof', label: 'Owner ID Proof', icon: <FiUser /> }
                    ].map((doc) => (
                      <div key={doc.id} className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
                        <input type="file" required={doc.id !== 'gstDoc'} onChange={(e) => handleFileChange(doc.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${formData[doc.id] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-teal/10 group-hover:text-teal'} transition-colors`}>
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
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Pharmacy Details</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                        <div className="col-span-2">Store: <span className="text-slate-900">{formData.storeName}</span></div>
                        <div>DL No: <span className="text-slate-900">{formData.dlNumber}</span></div>
                        <div>GST No: <span className="text-slate-900">{formData.gstNumber || 'N/A'}</span></div>
                        <div className="col-span-2">Address: <span className="text-slate-900">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal/10 border border-teal/20 rounded-2xl p-4 flex gap-3">
                    <FiCheck className="text-teal text-xl shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-[#135A5A] leading-relaxed">
                      By submitting, you agree to our Vendor Terms & Conditions. Your application will be reviewed within 24-48 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 pb-8">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <FiArrowLeft /> Back
                </button>
              ) : (
                <Link to="/vendor/pharmacy/login" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Cancel
                </Link>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-teal hover:bg-[#135A5A] text-white text-sm font-black rounded-xl shadow-lg shadow-teal/25 vendor-btn flex items-center gap-2 ml-auto"
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
              <Link to="/vendor/pharmacy/login" className="text-teal font-black hover:underline">
                Sign In →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
