import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../admin/components/AuthLayout';
import AuthCard from '../../admin/components/AuthCard';
import AuthInput from '../../admin/components/AuthInput';
import PasswordInput from '../../admin/components/PasswordInput';
import LoadingButton from '../../admin/components/LoadingButton';
import { vendorAuthStart, vendorSendOtpSuccess } from '../store/vendorAuthSlice';
import { FiUser, FiShoppingBag, FiMapPin, FiShield, FiUploadCloud, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export default function VendorSignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(state => state.vendorAuth || { loading: false });

  // Signup step state
  const [step, setStep] = useState(0); // 0: Business, 1: Details & Address, 2: Uploads & Security

  // Form states
  const [fullName, setFullName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [gstNo, setGstNo] = useState("");
  const [drugLicense, setDrugLicense] = useState("");
  const [panNo, setPanNo] = useState("");
  const [aadhaarNo, setAadhaarNo] = useState("");
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Simulated uploads state
  const [licenseFile, setLicenseFile] = useState(null);
  const [storeFile, setStoreFile] = useState(null);

  // Errors state
  const [errors, setErrors] = useState({});

  // Live validation handlers
  const handleFullNameChange = (e) => {
    const val = e.target.value;
    setFullName(val);
    
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
    setPhone(val);
    
    if (val && val.length < 10) {
      setErrors(prev => ({ ...prev, phone: 'Mobile number must be 10 digits' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase();
    setPanNo(val);
    
    if (/[^A-Z0-9]/.test(val)) {
      setErrors(prev => ({ ...prev, panNo: 'PAN can only contain letters and numbers' }));
    } else if (val && val.length !== 10) {
      setErrors(prev => ({ ...prev, panNo: '10-digit corporate PAN ID is required' }));
    } else {
      setErrors(prev => ({ ...prev, panNo: '' }));
    }
  };

  const handleAadhaarChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAadhaarNo(val);
    
    if (val && val.length !== 12) {
      setErrors(prev => ({ ...prev, aadhaarNo: '12-digit Aadhaar UID is required' }));
    } else {
      setErrors(prev => ({ ...prev, aadhaarNo: '' }));
    }
  };

  const handleGstChange = (e) => {
    const val = e.target.value.toUpperCase();
    setGstNo(val);
    
    if (/[^A-Z0-9]/.test(val)) {
      setErrors(prev => ({ ...prev, gstNo: 'GST can only contain letters and numbers' }));
    } else if (val && val.length !== 15) {
      setErrors(prev => ({ ...prev, gstNo: '15-character GST number is required' }));
    } else {
      setErrors(prev => ({ ...prev, gstNo: '' }));
    }
  };

  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setPincode(val);
    
    if (val && val.length !== 6) {
      setErrors(prev => ({ ...prev, pincode: '6-digit area pincode is required' }));
    } else {
      setErrors(prev => ({ ...prev, pincode: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0 && val.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val && val !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleValidation = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 0) {
      if (!fullName) errs.fullName = "Full name is required";
      if (!storeName) errs.storeName = "Store name is required";
      if (!pharmacyName) errs.pharmacyName = "Pharmacy or Lab Name is required";
      if (!gstNo) errs.gstNo = "GST Identification number is required";
      if (!drugLicense) errs.drugLicense = "Drug license authorization number is required";
    }

    if (step === 1) {
      if (!email) errs.email = "Email address is required";
      else if (!emailRegex.test(email)) errs.email = "Please enter a valid clinical email address";
      if (!phone || phone.length !== 10) errs.phone = "10-digit mobile number is required";
      if (!panNo || panNo.length !== 10) errs.panNo = "10-digit corporate PAN ID is required";
      if (!aadhaarNo || aadhaarNo.length !== 12) errs.aadhaarNo = "12-digit Aadhaar UID is required";
      if (!address) errs.address = "Store billing coordinates are required";
      if (!city) errs.city = "City is required";
      if (!pincode) errs.pincode = "6-digit area pincode is required";
    }

    if (step === 2) {
      if (!licenseFile) errs.licenseFile = "Drug authorization license file is required";
      if (!password || password.length < 8) errs.password = "Password must be at least 8 characters";
      if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (handleValidation()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmitSignup = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    dispatch(vendorAuthStart());

    // Simulated signup success
    setTimeout(() => {
      dispatch(vendorSendOtpSuccess({
        phone,
        vendorData: {
          name: fullName,
          storeName,
          pharmacyName,
          email,
          phone,
          gstNumber: gstNo,
          drugLicense,
          panNumber: panNo,
          aadhaarNumber: aadhaarNo,
          address,
          city,
          state,
          pincode,
          kycStatus: 'pending' // Enforces KYC Pending onboarding status
        }
      }));
      navigate('/vendor/verify-otp');
    }, 1200);
  };

  return (
    <AuthLayout>
      <AuthCard>
        
        {/* Title */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FiShoppingBag className="text-teal" /> Register Seller Store
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Step {step + 1} of 3: {step === 0 ? 'Business details' : step === 1 ? 'Contact & Address' : 'Security & Uploads'}
          </p>
        </div>

        {/* Dynamic Forms wizard */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          
          {/* Step 0: Business parameters */}
          {step === 0 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <AuthInput
                label="Authorized Owner Name"
                placeholder="e.g. Anish Gupta"
                icon={FiUser}
                error={errors.fullName ? { message: errors.fullName } : null}
                required
                register={{ value: fullName, onChange: handleFullNameChange }}
              />
              <AuthInput
                label="Pharmacy / Clinic Designation"
                placeholder="e.g. Wellness Rx Lab Services"
                icon={FiShoppingBag}
                error={errors.pharmacyName ? { message: errors.pharmacyName } : null}
                required
                register={{ value: pharmacyName, onChange: (e) => setPharmacyName(e.target.value) }}
              />
              <AuthInput
                label="Store Branding Name"
                placeholder="e.g. Wellness Rx Main Outlet"
                icon={FiShoppingBag}
                error={errors.storeName ? { message: errors.storeName } : null}
                required
                register={{ value: storeName, onChange: (e) => setStoreName(e.target.value) }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput
                  label="Drug License Number"
                  placeholder="DL-20831/15"
                  icon={FiShield}
                  error={errors.drugLicense ? { message: errors.drugLicense } : null}
                  required
                  register={{ value: drugLicense, onChange: (e) => setDrugLicense(e.target.value) }}
                />
                <AuthInput
                  label="GST Identification"
                  placeholder="27AAAAA1111A1Z1"
                  icon={FiShield}
                  error={errors.gstNo ? { message: errors.gstNo } : null}
                  required
                  register={{ value: gstNo, onChange: handleGstChange }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Address parameters */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput
                  label="Seller Email"
                  type="email"
                  placeholder="store@domain.com"
                  icon={FiUser}
                  error={errors.email ? { message: errors.email } : null}
                  required
                  register={{ value: email, onChange: handleEmailChange }}
                />
                <AuthInput
                  label="Owner Phone Number"
                  placeholder="9876543210"
                  icon={FiUser}
                  error={errors.phone ? { message: errors.phone } : null}
                  required
                  register={{ value: phone, onChange: handlePhoneChange }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AuthInput
                  label="Corporate PAN ID"
                  placeholder="ABCDE1234F"
                  icon={FiShield}
                  error={errors.panNo ? { message: errors.panNo } : null}
                  required
                  register={{ value: panNo, onChange: handlePanChange }}
                />
                <AuthInput
                  label="Aadhaar UID Number"
                  placeholder="123456789012"
                  icon={FiShield}
                  error={errors.aadhaarNo ? { message: errors.aadhaarNo } : null}
                  required
                  register={{ value: aadhaarNo, onChange: handleAadhaarChange }}
                />
              </div>
              <AuthInput
                label="Outlet Address Line"
                placeholder="Store 12, Link Tech Road"
                icon={FiMapPin}
                error={errors.address ? { message: errors.address } : null}
                required
                register={{ value: address, onChange: (e) => setAddress(e.target.value) }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AuthInput
                  label="City"
                  placeholder="Mumbai"
                  error={errors.city ? { message: errors.city } : null}
                  required
                  register={{ value: city, onChange: (e) => setCity(e.target.value) }}
                />
                <AuthInput
                  label="State"
                  placeholder="MH"
                  register={{ value: state, onChange: (e) => setState(e.target.value) }}
                />
                <AuthInput
                  label="Pincode"
                  placeholder="400001"
                  error={errors.pincode ? { message: errors.pincode } : null}
                  required
                  register={{ value: pincode, onChange: handlePincodeChange }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Security & Uploads */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              
              {/* Dynamic simulated file uploads */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Pharmacy / Drug License File</label>
                <div 
                  onClick={() => setLicenseFile({ name: 'drug-license-scan.pdf' })}
                  className="border-2 border-dashed border-slate-200 hover:border-teal rounded-2xl py-4 px-3 bg-slate-50 flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                >
                  <FiUploadCloud className="text-slate-400 shrink-0 text-lg" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">
                    {licenseFile ? licenseFile.name : 'Upload License scan (PDF/JPG)'}
                  </span>
                </div>
                {errors.licenseFile && <span className="text-coral text-[10px] font-black pl-1">{errors.licenseFile}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Store Entrance / Header Image</label>
                <div 
                  onClick={() => setStoreFile({ name: 'store-image.jpg' })}
                  className="border-2 border-dashed border-slate-200 hover:border-teal rounded-2xl py-4 px-3 bg-slate-50 flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                >
                  <FiUploadCloud className="text-slate-400 shrink-0 text-lg" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">
                    {storeFile ? storeFile.name : 'Upload Store Image (Optional)'}
                  </span>
                </div>
              </div>

              <PasswordInput
                label="Manager Password"
                placeholder="••••••••"
                error={errors.password ? { message: errors.password } : null}
                required
                register={{ value: password, onChange: handlePasswordChange }}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword ? { message: errors.confirmPassword } : null}
                required
                register={{ value: confirmPassword, onChange: handleConfirmPasswordChange }}
              />

            </div>
          )}

          {/* Action buttons wizard controls */}
          <div className="grid grid-cols-2 gap-3.5 mt-3 border-t border-slate-50 pt-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 tap-scale"
              >
                <FiArrowLeft /> Back
              </button>
            ) : (
              <Link
                to="/vendor/login"
                className="py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 tap-scale"
              >
                Cancel
              </Link>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 tap-scale"
              >
                Continue <FiArrowRight />
              </button>
            ) : (
              <LoadingButton 
                loading={loading}
                onClick={handleSubmitSignup}
                color="primary"
              >
                Complete Signup
              </LoadingButton>
            )}
          </div>

          <p className="text-2xs font-extrabold text-slate-400 text-center uppercase tracking-wider mt-2">
            Already registered?{" "}
            <Link to="/vendor/login" className="text-teal hover:underline font-black">
              Sign In
            </Link>
          </p>

        </form>

      </AuthCard>
    </AuthLayout>
  );
}
