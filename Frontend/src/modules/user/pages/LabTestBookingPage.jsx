import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiUploadCloud, FiTrash2, FiShield, FiUser, FiInfo, FiActivity, FiMapPin, FiCreditCard, FiAlertCircle
} from 'react-icons/fi';
import { bookLabPackage, normalizeCity } from '../store/productSlice';
import apiClient from '../../shared/services/apiClient';

export default function LabTestBookingPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const { labTests, labs = [], location: locationState } = useSelector(state => state.products);
  const { addresses = [], isAuthenticated } = useSelector(state => state.auth);
  const test = labTests.find(t => t.id === testId);

  const city = locationState?.city ? normalizeCity(locationState.city) : '';

  const localAddresses = React.useMemo(() => {
    if (!city) return addresses;
    return addresses.filter(addr => {
      const addrCity = normalizeCity(addr.city).toLowerCase();
      const currentCityLower = city.toLowerCase();
      return addrCity === currentCityLower || addrCity.includes(currentCityLower.split(',')[0]) || currentCityLower.includes(addrCity.split(',')[0]);
    });
  }, [addresses, city]);

  // Booking Flow Steps: 
  // 1: Review Test details
  // 2: Patient Info
  // 3: Address Selection
  // 4: Slot Selection
  // 5: Razorpay Payment UI (Dummy)
  // 6: Success Animation / Summary
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('');
  
  // Address selection states
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  
  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Slot selection states
  const [preferredDate, setPreferredDate] = useState(getTodayStr());
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  
  // Referring Doctor states
  const [doctorName, setDoctorName] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Dummy Payment Gateway states
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cash'
  const [dummyCardNumber, setDummyCardNumber] = useState('');
  const [dummyCardExpiry, setDummyCardExpiry] = useState('');
  const [dummyCardCvv, setDummyCardCvv] = useState('');
  const [dummyUpiId, setDummyUpiId] = useState('user@okaxis');
  const [isPaying, setIsPaying] = useState(false);

  // Booking result details
  const [generatedRefId, setGeneratedRefId] = useState('');
  const [validationError, setValidationError] = useState('');

  const timeSlots = [
    '06:00 AM - 09:00 AM (Early Bird)',
    '09:00 AM - 12:00 PM (Morning Slot)',
    '12:00 PM - 03:00 PM (Afternoon Slot)',
    '03:00 PM - 06:00 PM (Evening Slot)'
  ];

  const isLabSlotAvailable = (slot, selectedDate) => {
    if (!selectedDate) return true;
    
    const todayStr = getTodayStr();
    if (selectedDate !== todayStr) return true;
    
    // Determine the end hour of the slot in 24h format:
    // '06:00 AM - 09:00 AM (Early Bird)' -> ends at 9:00 (9)
    // '09:00 AM - 12:00 PM (Morning Slot)' -> ends at 12:00 (12)
    // '12:00 PM - 03:00 PM (Afternoon Slot)' -> ends at 15:00 (15)
    // '03:00 PM - 06:00 PM (Evening Slot)' -> ends at 18:00 (18)
    let endHour = 9;
    
    if (slot.includes('09:00 AM')) {
      endHour = 9;
    } else if (slot.includes('12:00 PM (Morning Slot)')) {
      endHour = 12;
    } else if (slot.includes('03:00 PM')) {
      endHour = 15;
    } else if (slot.includes('06:00 PM')) {
      endHour = 18;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour > endHour || (currentHour === endHour && currentMinute >= 0)) {
      return false;
    }
    return true;
  };

  if (!test) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <FiActivity className="text-coral text-5xl mb-4 animate-pulse" />
        <h2 className="text-base font-extrabold text-slate-800">Lab Test Profile Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold mt-2">The requested diagnostic package could not be retrieved.</p>
        <button 
          onClick={() => navigate('/lab-tests')}
          className="mt-5 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm border-0 cursor-pointer"
        >
          Return to Lab Catalog
        </button>
      </div>
    );
  }

  // Handle mock file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setPrescriptionFile(null);
  };

  // Step Navigations
  const handleNextStep = () => {
    setValidationError('');
    
    if (currentStep === 1) {
      setCurrentStep(2);
    } 
    else if (currentStep === 2) {
      if (!patientName.trim()) {
        setValidationError('Patient Full Name is required.');
        return;
      }
      if (!patientAge || isNaN(patientAge) || parseInt(patientAge) <= 0) {
        setValidationError('Please enter a valid Patient Age.');
        return;
      }
      if (!patientPhone.trim()) {
        setValidationError('Phone Number is required.');
        return;
      }
      setCurrentStep(3);
    } 
    else if (currentStep === 3) {
      if (test.homeCollection) {
        const hasSelectedAddress = selectedAddressId && addresses.some(a => a.id === selectedAddressId);
        if (!hasSelectedAddress && !customAddress.trim()) {
          setValidationError('Please select a saved address or enter a home collection address.');
          return;
        }
      }
      setCurrentStep(4);
    } 
    else if (currentStep === 4) {
      if (!preferredDate) {
        setValidationError('Please select a preferred date.');
        return;
      }
      if (!preferredTimeSlot) {
        setValidationError('Please select a time slot.');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handleBackStep = () => {
    setValidationError('');
    if (currentStep > 1 && currentStep < 6) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Commit booking *after* payment success
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setValidationError('');
    setIsPaying(true);

    try {
      const bookingRef = `LBB-${Date.now().toString().slice(-5)}`;
      setGeneratedRefId(bookingRef);

      // Get address string
      let selectedAddrStr = 'Walk-in Diagnostic Center';
      if (test.homeCollection) {
        const found = addresses.find(a => a.id === selectedAddressId);
        selectedAddrStr = found 
          ? `${found.addressLine}, ${found.city}, ${found.state} - ${found.pincode}` 
          : customAddress;
      }

      const associatedLab = labs.find(l => l.id === test.labId || l.name === test.labName);
      
      const formData = new FormData();
      formData.append('id', bookingRef);
      formData.append('packageName', test.name);
      formData.append('address', selectedAddrStr);
      formData.append('price', test.discountPrice || test.price);
      formData.append('date', preferredDate);
      formData.append('city', associatedLab ? associatedLab.city : '');
      formData.append('pincode', associatedLab ? associatedLab.pincode : '');
      formData.append('state', associatedLab ? associatedLab.state : '');

      if (prescriptionFile) {
        formData.append('file', prescriptionFile);
      }

      // We still update Redux for optimistic local state or other components relying on it
      const newBooking = {
        id: bookingRef,
        testId: test.id,
        packageName: test.name,
        patientName: patientName.trim(),
        patientAge: parseInt(patientAge),
        patientGender: patientGender,
        patientPhone: patientPhone.trim(),
        address: selectedAddrStr,
        date: preferredDate,
        timeSlot: preferredTimeSlot,
        doctorName: doctorName.trim() || 'Self / General Wellness',
        doctorRegNo: doctorRegNo.trim() || 'N/A',
        hasPrescription: !!prescriptionFile,
        prescriptionFileName: prescriptionFile ? prescriptionFile.name : null,
        status: 'Scheduled',
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid',
        amountPaid: test.discountPrice || test.price,
        city: associatedLab ? associatedLab.city : '',
        pincode: associatedLab ? associatedLab.pincode : ''
      };

      const response = await apiClient.post('/api/labs/book', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // If the backend returns a reportUrl, we can add it to the Redux state
      if (response.data?.data?.reportUrl) {
        newBooking.reportUrl = response.data.data.reportUrl;
      }

      dispatch(bookLabPackage(newBooking));
      setIsPaying(false);
      setCurrentStep(6);
    } catch (error) {
      console.error('Failed to book lab test:', error);
      setIsPaying(false);
      alert('Failed to process booking. Please try again.');
    }
  };

  const renderProgressSteps = () => {
    if (currentStep === 6) return null;
    const stepNames = ['Review', 'Patient', 'Address', 'Schedule', 'Payment'];
    return (
      <div className="flex items-center justify-between mb-8 select-none">
        {stepNames.map((name, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep > idx + 1 
                  ? 'bg-forest text-white' 
                  : currentStep === idx + 1 
                  ? 'bg-teal text-white ring-4 ring-teal-light' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${
                currentStep === idx + 1 ? 'text-teal font-extrabold' : 'text-slate-400'
              }`}>
                {name}
              </span>
            </div>
            {idx < stepNames.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                currentStep > idx + 1 ? 'bg-forest' : 'bg-slate-100'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 font-sans select-none">
      
      {/* Back button */}
      {currentStep < 6 && (
        <button 
          onClick={currentStep === 1 ? () => navigate('/lab-tests') : handleBackStep}
          className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-teal transition-colors mb-5 uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
        >
          <FiArrowLeft className="w-4 h-4" /> {currentStep === 1 ? 'Back to Lab Tests' : 'Back Step'}
        </button>
      )}

      {renderProgressSteps()}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-5 bg-coral-light/35 border border-coral/15 text-coral text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
          <span>⚠️</span> {validationError}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: REVIEW TEST & CLINICAL SPECIFICATIONS */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] text-teal font-black uppercase tracking-wider block">DIAGNOSTIC TEST SUMMARY</span>
                <h2 className="text-base md:text-lg font-black text-slate-800 leading-tight mt-1">{test.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[10px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{test.parameters}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{test.timeframe}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-right shrink-0 self-start sm:self-auto">
                <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Diagnostic Charge</span>
                <span className="text-base font-black text-slate-800 mt-1 block">₹{test.discountPrice || test.price}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">Package Specifications</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">{test.description}</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex items-start gap-2.5">
              <span className="text-lg">🕒</span>
              <div>
                <h4 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide">Fasting requirement</h4>
                <p className="text-[11px] text-slate-650 font-bold mt-0.5">{test.fastingRequired}</p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none mt-2"
            >
              PROCEED TO PATIENT DETAILS
            </button>
          </motion.div>
        )}

        {/* STEP 2: PATIENT DETAILS */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6"
          >
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <FiUser className="text-teal" /> Patient Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Age (Years) *</label>
                <input 
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 35"
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Gender *</label>
                <select 
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Contact Phone *</label>
                <input 
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Optional prescriptions */}
            <div className="border-t border-slate-50 pt-5 flex flex-col gap-4">
              <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Referring Doctor & Prescriptions (Optional)</h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text"
                  placeholder="Doctor Name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs font-bold"
                />
                <input 
                  type="text"
                  placeholder="Doctor Registration No."
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs font-bold"
                />
              </div>

              {/* Prescription Attachment */}
              {!prescriptionFile ? (
                <label className="border border-dashed border-slate-200 hover:border-teal rounded-2xl p-4 bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors">
                  <FiUploadCloud className="text-xl text-slate-400" />
                  <span className="text-[10px] font-black text-teal uppercase tracking-wider">Upload prescription photo/PDF</span>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="border border-teal/15 bg-teal-light/10 p-3 rounded-xl flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 truncate">{prescriptionFile.name}</span>
                  <button type="button" onClick={handleRemoveFile} className="p-1 hover:bg-white text-coral rounded-lg border-0 cursor-pointer">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none mt-2"
            >
              PROCEED TO ADDRESS SELECTION
            </button>
          </motion.div>
        )}

        {/* STEP 3: ADDRESS SELECTION */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6"
          >
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <FiMapPin className="text-teal" /> Home Sample Collection Address
              </h3>
            </div>

            {test.homeCollection ? (
              <div className="flex flex-col gap-4">
                {/* 1. Saved Addresses (Active if authenticated) */}
                {isAuthenticated && localAddresses.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Select Saved Address</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {localAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => { setSelectedAddressId(addr.id); setCustomAddress(''); }}
                          className={`text-left p-3.5 border rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 ${
                            selectedAddressId === addr.id
                              ? 'border-teal bg-teal-light/20 shadow-sm'
                              : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                          }`}
                        >
                          <FiMapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedAddressId === addr.id ? 'text-teal' : 'text-slate-400'}`} />
                          <div className="text-xs">
                            <span className="font-extrabold text-slate-800">{addr.name}</span>
                            <p className="text-slate-500 font-semibold mt-0.5 leading-normal">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* 2. Custom Address Textbox */}
                <div className="flex flex-col gap-2 border-t border-slate-50 pt-4">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    {isAuthenticated && localAddresses.length > 0 ? 'Or Enter New Address' : 'Enter Collection Address'}
                  </label>
                  <textarea
                    rows="3"
                    value={customAddress}
                    onChange={(e) => { setCustomAddress(e.target.value); setSelectedAddressId(''); }}
                    placeholder="Enter full flat number, street coordinates, landmarks, pincode, and city"
                    className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all resize-none placeholder:text-slate-350"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-teal-light/20 p-4 border border-teal/15 rounded-2xl text-center flex flex-col items-center gap-2">
                <span className="text-3xl">🏥</span>
                <h4 className="text-xs font-black text-teal-dark uppercase tracking-wider">Walk-in Center Checkup</h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-normal">This lab test does not require home collection. Please walk into our certified diagnostic center at Andheri East on your booked slot.</p>
              </div>
            )}

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none mt-2"
            >
              PROCEED TO SCHEDULING
            </button>
          </motion.div>
        )}

        {/* STEP 4: SCHEDULE & PRE-TEST RULES */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6"
          >
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <FiCalendar className="text-teal" /> Collection Schedule
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Preferred Date *</label>
                <input 
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={getTodayStr()}
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Preferred Time Slot *</label>
                <select 
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select collection time slot</option>
                  {timeSlots.map((slot) => {
                    const available = isLabSlotAvailable(slot, preferredDate);
                    return (
                      <option key={slot} value={slot} disabled={!available}>
                        {slot} {!available && ' (Passed)'}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Mandatory Instruction Deck */}
            <div className="bg-amber-50/60 p-4 border border-amber-100 rounded-2xl flex flex-col gap-3">
              <h5 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide flex items-center gap-1"><FiInfo /> Clinical Guidelines</h5>
              <ul className="text-[9.5px] text-slate-650 font-bold list-disc pl-3.5 flex flex-col gap-1.5 leading-normal">
                <li>Bring a valid photo Identification proof (Aadhaar, Passport, or DL) at drawing time.</li>
                <li>Report generated automatically inside {test.timeframe.toLowerCase()} and synced to email.</li>
                {test.fastingRequired !== 'Not Required' && (
                  <li className="text-amber-800 font-extrabold">Fasting required: {test.fastingRequired}</li>
                )}
              </ul>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none mt-2"
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          </motion.div>
        )}

        {/* STEP 5: SECURE PAYMENT GATEWAY (DUMMY RAZORPAY) */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Razorpay Banner mimic */}
            <div className="bg-slate-900 text-white p-4.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 flex justify-between items-center select-none shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal text-white flex items-center justify-center font-black text-sm">R</span>
                <span className="text-xs font-black tracking-wider uppercase">Razorpay Secure Checkout</span>
              </div>
              <span className="text-[9px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black tracking-widest">PCI-DSS</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase">Order Amount</span>
                <h4 className="text-base font-black text-slate-800 mt-0.5">{test.name}</h4>
              </div>
              <strong className="text-lg font-black text-forest">₹{test.discountPrice || test.price}</strong>
            </div>

            <form onSubmit={handleProcessPayment} className="flex flex-col gap-5">
              
              {/* Payment Methods triggers */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Choose Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'upi' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>📱</span> UPI / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'card' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>💳</span> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'cash' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>💵</span> Cash
                  </button>
                </div>
              </div>

              {/* Conditional payment screens */}
              {paymentMethod === 'upi' && (
                <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fade-in">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Enter UPI ID</label>
                  <input
                    type="text"
                    value={dummyUpiId}
                    onChange={(e) => setDummyUpiId(e.target.value)}
                    placeholder="e.g. username@okhdfcbank"
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                    required
                  />
                  <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Collect request will be dispatched to your UPI app.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Card Number</label>
                    <input
                      type="text"
                      maxLength="16"
                      value={dummyCardNumber}
                      onChange={(e) => setDummyCardNumber(e.target.value.replace(/\D/g,''))}
                      placeholder="4111 2222 3333 4444"
                      className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        maxLength="5"
                        placeholder="MM/YY"
                        value={dummyCardExpiry}
                        onChange={(e) => setDummyCardExpiry(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none text-center"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">CVV Code</label>
                      <input
                        type="password"
                        maxLength="3"
                        placeholder="123"
                        value={dummyCardCvv}
                        onChange={(e) => setDummyCardCvv(e.target.value.replace(/\D/g,''))}
                        className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none text-center"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="bg-emerald-50/60 p-4 border border-emerald-100 rounded-2xl flex items-start gap-2.5 animate-fade-in">
                  <span className="text-xl">💵</span>
                  <div>
                    <h5 className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide">Cash Collection on Draw</h5>
                    <p className="text-[9.5px] text-slate-600 font-bold mt-1">Please pay exact amount ₹{test.discountPrice || test.price} to the clinical lab technician in cash after drawing sample samples.</p>
                  </div>
                </div>
              )}

              {/* Secure Checkout details */}
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider my-1">
                <FiShield className="text-teal text-sm" /> 256-Bit SSL Encrypted checkout
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none transition-all flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>PROCESS SECURE TRANSACTION...</span>
                  </>
                ) : (
                  <span>PAY NOW (₹{test.discountPrice || test.price})</span>
                )}
              </button>

            </form>
          </motion.div>
        )}

        {/* STEP 6: BOOKING SUCCESSFUL & TICKET */}
        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium text-center select-none"
          >
            {/* Confirmed Animation */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-sm animate-bounce">
              <FiCheckCircle className="stroke-[2.5px]" />
            </div>

            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full font-black uppercase tracking-wider">Payment Verified</span>
            <h2 className="text-base md:text-lg font-black text-slate-800 leading-tight mt-4">Lab Test Confirmed Successfully!</h2>
            <p className="text-xs text-slate-500 font-bold mt-2 max-w-sm mx-auto leading-relaxed">
              Your diagnostic request is registered. A sterile sample dispatch technician will connect with you via SMS for live collection coordinates.
            </p>

            {/* Reference Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 my-6 max-w-sm mx-auto text-left flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="text-[9px] text-slate-400 font-black uppercase">Booking Reference</span>
                <span className="text-xs font-black text-forest">{generatedRefId}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Patient Name:</span>
                <span className="text-slate-700 font-extrabold truncate max-w-[180px]">{patientName}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Diagnostic Package:</span>
                <span className="text-slate-700 font-extrabold truncate max-w-[180px]">{test.name}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Scheduled Drawing:</span>
                <span className="text-slate-700 font-extrabold">{preferredDate} • {preferredTimeSlot.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold">Draw Coordinates:</span>
                <span className="text-slate-750 font-extrabold truncate max-w-[180px]">
                  {test.homeCollection ? (addresses.find(a => a.id === selectedAddressId)?.addressLine || customAddress) : 'Diagnostic Center'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10.5px] border-t border-slate-200/50 pt-2.5 mt-1">
                <span className="text-slate-400 font-semibold">Payment Status:</span>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">Paid ₹{test.discountPrice || test.price}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button 
                onClick={() => navigate('/profile')}
                className="flex-1 py-3 px-5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
              >
                Go to Profile
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-655 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
