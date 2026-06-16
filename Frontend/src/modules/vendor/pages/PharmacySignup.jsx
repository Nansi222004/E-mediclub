import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiFileText, FiImage, FiUser } from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';

export default function PharmacySignup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    regNumber: '', specialization: 'General Physician', qualification: '', experience: '',
    consultationType: 'Both', fee: '', clinicName: '', address: '', city: '', state: '', pincode: '',
    regDoc: null, degreeDoc: null, profilePhoto: null, clinicPhoto: null, idProof: null
  });

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


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden relative">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-teal-dark to-teal p-12 flex-col justify-between relative overflow-hidden text-white border-r border-teal-dark shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        {/* Branding header */}
        <div className="z-10 flex items-center gap-2 bg-white rounded-xl px-4 py-2 self-start shadow-lg">
          <Logo showText={true} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-5xl shadow-2xl backdrop-blur-sm border border-white/20 mb-8">
            🏥
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-md">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">Pharmacy Partner Portal</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            Join E Mediclub's Pharmacy Network
          </h2>
          <p className="text-white/80 text-sm mt-4 leading-relaxed font-medium">
            Expand your reach, manage your inventory easily, and process online orders.
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
              <span className="text-sm">🏥</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Pharmacy Partner Portal</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium relative">
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
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pharmacy Owner Name</label>
                      <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Full Name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                      <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                      <input required type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
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
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pharmacy Name</label>
                      <input required type="text" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Drug License Number</label>
                      <input required type="text" value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pharmacist Name</label>
                      <input required type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Street Address</label>
                      <textarea required rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 resize-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">State</label>
                      <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">City</label>
                      <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pincode</label>
                      <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Upload Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'regDoc', label: 'Drug License Certificate', icon: <FiFileText /> },
                      { id: 'degreeDoc', label: 'GST Certificate', icon: <FiFileText /> },
                      { id: 'profilePhoto', label: 'Pharmacy Photo', icon: <FiImage /> },
                      { id: 'idProof', label: 'Owner Government ID', icon: <FiUser /> }
                    ].map((doc) => (
                      <div key={doc.id} className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
                        <input type="file" required onChange={(e) => handleFileChange(doc.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
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
                        <div className="col-span-2">Name: <span className="text-slate-900">{formData.fullName}</span></div>
                        <div>Phone: <span className="text-slate-900">{formData.phone}</span></div>
                        <div>Email: <span className="text-slate-900 truncate">{formData.email}</span></div>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-slate-100" />
                    
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Pharmacy Details</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                        <div>Pharmacy: <span className="text-slate-900">{formData.clinicName}</span></div>
                        <div>License No: <span className="text-slate-900">{formData.regNumber}</span></div>
                        <div className="col-span-2">Location: <span className="text-slate-900">{formData.city}, {formData.state}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-start">
                    <input required type="checkbox" id="terms" className="mt-1 w-4 h-4 text-teal border-slate-300 rounded focus:ring-teal" />
                    <label htmlFor="terms" className="text-xs font-semibold text-slate-600 leading-relaxed cursor-pointer">
                      I hereby declare that the details furnished above are true and correct to the best of my knowledge. I agree to the <a href="#" className="text-teal hover:underline font-bold">Terms & Conditions</a> and <a href="#" className="text-teal hover:underline font-bold">Privacy Policy</a> of E Mediclub.
                    </label>
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
