import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiFileText, FiImage, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import Logo from '../../../shared/components/Logo';

export default function DoctorSignup() {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNameChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('Dr. ') && val.length > 0) val = 'Dr. ' + val.replace(/^Dr\.?\s*/i, '');
    setFormData({...formData, fullName: val});
    
    const namePart = val.replace(/^Dr\.?\s*/i, '');
    if (/[0-9]/.test(namePart)) {
      setErrors(prev => ({ ...prev, fullName: 'Name cannot contain numbers' }));
    } else if (/[^a-zA-Z\s]/.test(namePart)) {
      setErrors(prev => ({ ...prev, fullName: 'Name cannot contain special characters' }));
    } else if (namePart && namePart.trim().length < 2) {
      setErrors(prev => ({ ...prev, fullName: 'Name must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, fullName: '' }));
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

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData({...formData, phone: val});
    if (val && val.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number must be 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/vendor/onboarding-pending', { state: { type: 'doctor' } });
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
            👨‍⚕️
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-md">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">Clinical Partner Portal</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            Join E Mediclub's Healthcare Network
          </h2>
          <p className="text-white/80 text-sm mt-4 leading-relaxed font-medium">
            Reach more patients, manage your schedule easily, and offer digital prescriptions.
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
              <span className="text-sm">👨‍⚕️</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Clinical Partner Portal</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-premium relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Register as Doctor</h3>
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
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name (with Dr. prefix)</label>
                      <input required type="text" value={formData.fullName} onChange={handleNameChange} placeholder="Dr. Full Name" className={`w-full px-4 py-3 bg-white border ${errors.fullName ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
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
                        <input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handlePasswordChange} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.password}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <input required type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleConfirmPasswordChange} className={`w-full pr-10 pl-4 py-3 bg-white border ${errors.confirmPassword ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-teal focus:ring-teal/20'} rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-bold px-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {step === 2 && (
                <div className="flex flex-col gap-5 animate-slideUp">
                  <h4 className="text-lg font-black text-slate-800">Professional Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Medical Registration No.</label>
                      <input required type="text" value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Specialization</label>
                      <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20">
                        <option>General Physician</option>
                        <option>Cardiologist</option>
                        <option>Dermatologist</option>
                        <option>Orthopedist</option>
                        <option>Pediatrician</option>
                        <option>Psychiatrist</option>
                        <option>Gynecologist</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Qualification</label>
                      <input required type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g. MBBS, MD" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Years of Experience</label>
                      <input required type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Consultation Type</label>
                      <select value={formData.consultationType} onChange={e => setFormData({...formData, consultationType: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20">
                        <option>Online Only</option>
                        <option>In-Clinic Only</option>
                        <option>Both</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Consultation Fee (₹)</label>
                      <input required type="number" value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                    </div>
                    
                    {formData.consultationType !== 'Online Only' && (
                      <>
                        <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
                          <h5 className="text-sm font-bold text-slate-800 mb-4">Clinic Address</h5>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Clinic Name</label>
                          <input required type="text" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20" />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Address Line</label>
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
                      </>
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
                      { id: 'regDoc', label: 'Medical License Upload', icon: <FiFileText /> },
                      { id: 'degreeDoc', label: 'Degree Certificate', icon: <FiFileText /> },
                      { id: 'profilePhoto', label: 'Doctor Profile Photo', icon: <FiImage /> },
                      { id: 'idProof', label: 'Government ID Upload', icon: <FiUser /> }
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
                    {formData.consultationType !== 'Online Only' && (
                      <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-colors group cursor-pointer">
                        <input type="file" onChange={(e) => handleFileChange('clinicPhoto', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${formData.clinicPhoto ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-400 group-hover:bg-teal/10 group-hover:text-teal'} transition-colors`}>
                          {formData.clinicPhoto ? <FiCheck /> : <FiImage />}
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center">Clinic Photo (Optional)</span>
                        {formData.clinicPhoto && <span className="text-[10px] font-semibold text-teal mt-1 max-w-[150px] truncate">{formData.clinicPhoto.name}</span>}
                      </div>
                    )}
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
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Professional Details</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                        <div>Specialty: <span className="text-slate-900">{formData.specialization}</span></div>
                        <div>Reg No: <span className="text-slate-900">{formData.regNumber}</span></div>
                        <div>Experience: <span className="text-slate-900">{formData.experience} years</span></div>
                        <div>Fee: <span className="text-slate-900">₹{formData.fee}</span></div>
                        <div className="col-span-2 text-teal">{formData.consultationType} Consultations</div>
                        {formData.consultationType !== 'Online Only' && (
                          <div className="col-span-2">Clinic: <span className="text-slate-900">{formData.clinicName}, {formData.city}</span></div>
                        )}
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
                <Link to="/vendor/doctor/login" className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
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
              <Link to="/vendor/doctor/login" className="text-teal font-black hover:underline">
                Sign In →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
