import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, FiCalendar, FiCheckCircle,
  FiUploadCloud, FiTrash2, FiShield, FiUser, FiInfo, FiActivity, FiMapPin
} from 'react-icons/fi';
import { bookLabPackage, normalizeCity } from '../store/productSlice';
import apiClient from "../../../shared/services/apiClient";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientBookingSchema } from '../schemas/booking.schema';

export default function LabTestBookingPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { labTests, labs = [], location: locationState } = useSelector(state => state.products);
  const { addresses = [], isAuthenticated } = useSelector(state => state.auth);
  const test = labTests.find(t => t.id === testId);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/lab-tests/${testId}/book` } });
    }
  }, [isAuthenticated, navigate, testId]);

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
  const supportsHomeCollection = test?.supportsHomeCollection ?? test?.homeCollection ?? true;
  const supportsWalkIn = test?.supportsWalkIn ?? true;

  const [currentStep, setCurrentStep] = useState(1);
  const [collectionMethod, setCollectionMethod] = useState(supportsHomeCollection ? 'home' : 'lab');
  const [expressDelivery, setExpressDelivery] = useState(false);

  // Form states
  const { register: registerPatient, trigger: triggerPatient, getValues: getPatientValues, formState: { errors: patientErrors } } = useForm({
    resolver: zodResolver(patientBookingSchema),
    mode: 'onChange',
    defaultValues: {
      patientName: '',
      patientAge: '',
      patientGender: 'Male',
      patientPhone: ''
    }
  });

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

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      let label = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      dates.push({ label, value: val });
    }
    return dates;
  };
  const upcomingDates = React.useMemo(() => getUpcomingDates(), []);

  // Slot selection states
  const [preferredDate, setPreferredDate] = useState(getTodayStr());
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

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
  const [errors, setErrors] = useState({});

  // Validations handled by Zod Schema

  const groupedTimeSlots = {
    Morning: [
      { label: '07:00 AM - 08:00 AM', endHour: 8 },
      { label: '08:00 AM - 09:00 AM', endHour: 9 },
      { label: '09:00 AM - 10:00 AM', endHour: 10 },
      { label: '10:00 AM - 11:00 AM', endHour: 11 },
    ],
    Afternoon: [
      { label: '12:00 PM - 01:00 PM', endHour: 13 },
      { label: '01:00 PM - 02:00 PM', endHour: 14 },
      { label: '02:00 PM - 03:00 PM', endHour: 15 },
    ],
    Evening: [
      { label: '04:00 PM - 05:00 PM', endHour: 17 },
      { label: '05:00 PM - 06:00 PM', endHour: 18 },
      { label: '06:00 PM - 07:00 PM', endHour: 19 },
    ]
  };

  const isLabSlotAvailable = (endHour, selectedDate) => {
    if (!selectedDate) return true;

    const todayStr = getTodayStr();
    if (selectedDate !== todayStr) return true;

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
  const handleNextStep = async () => {
    setValidationError('');

    if (currentStep === 1) {
      setCurrentStep(2);
    }
    else if (currentStep === 2) {
      const isValid = await triggerPatient();
      if (!isValid) {
        setValidationError('Please fix the errors in patient information.');
        return;
      }
      setCurrentStep(collectionMethod === 'lab' ? 4 : 3);
    }
    else if (currentStep === 3) {
      if (collectionMethod === 'home') {
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
      if (currentStep === 4 && collectionMethod === 'lab') {
        setCurrentStep(2);
      } else {
        setCurrentStep(prev => prev - 1);
      }
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
      const bookingCity = associatedLab?.city || locationState?.city || 'Mumbai';
      const bookingPincode = associatedLab?.pincode || locationState?.pincode || '400001';
      const bookingState = associatedLab?.state || locationState?.state || 'Maharashtra';

      const formData = new FormData();
      formData.append('id', bookingRef);
      formData.append('packageName', test.name);
      formData.append('address', selectedAddrStr);
      const finalPrice = (test.discountPrice || test.price) + (expressDelivery ? 199 : 0);
      formData.append('price', finalPrice);
      formData.append('date', preferredDate);
      formData.append('city', bookingCity);
      formData.append('pincode', bookingPincode);
      formData.append('state', bookingState);
      const pVals = getPatientValues();
      formData.append('patientName', pVals.patientName.trim());
      formData.append('patientAge', pVals.patientAge);
      formData.append('patientGender', pVals.patientGender);
      formData.append('patientPhone', pVals.patientPhone.trim());
      formData.append('timeSlot', preferredTimeSlot);
      formData.append('paymentStatus', 'Paid');
      formData.append('paymentMethod', paymentMethod);
      formData.append('doctorName', doctorName.trim() || 'Self / General Wellness');
      formData.append('doctorRegNo', doctorRegNo.trim() || 'N/A');
      formData.append('labId', test.labId || 'LAB-101');

      if (prescriptionFile) {
        formData.append('file', prescriptionFile);
      }

      const response = await apiClient.post('/api/labs/book', formData, {
        headers: {
          'Content-Type': undefined
        }
      });

      const savedBooking = response.data.data;

      const newBooking = {
        id: bookingRef,
        testId: test.id,
        packageName: test.name,
        patientName: pVals.patientName.trim(),
        patientAge: parseInt(pVals.patientAge),
        patientGender: pVals.patientGender,
        patientPhone: pVals.patientPhone.trim(),
        address: selectedAddrStr,
        date: preferredDate,
        timeSlot: preferredTimeSlot,
        doctorName: doctorName.trim() || 'Self / General Wellness',
        doctorRegNo: doctorRegNo.trim() || 'N/A',
        hasPrescription: !!prescriptionFile,
        prescriptionFileName: prescriptionFile ? prescriptionFile.name : null,
        status: savedBooking.status || 'new_booking',
        otp: savedBooking.otp,
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid',
        amountPaid: finalPrice,
        city: bookingCity,
        pincode: bookingPincode,
        reportUrl: savedBooking.reportUrl || null,
        collectionMethod,
        expressDelivery
      };

      dispatch(bookLabPackage(newBooking));
      setIsPaying(false);
      setCurrentStep(6);
    } catch (error) {
      console.error('Failed to book lab test:', error);
      setIsPaying(false);
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to process booking: ${errMsg}. Please try again.`);
    }
  };

  const renderProgressSteps = () => {
    if (currentStep === 6) return null;
    let stepNames = ['Review', 'Patient', 'Address', 'Schedule', 'Payment'];
    if (collectionMethod === 'lab') {
      stepNames = ['Review', 'Patient', 'Schedule', 'Payment'];
    }
    
    // We map visual step index (0-based) to actual step number
    const getActualStep = (idx) => {
      if (collectionMethod === 'lab') {
        return idx < 2 ? idx + 1 : idx + 2; // [1, 2, 4, 5]
      }
      return idx + 1; // [1, 2, 3, 4, 5]
    };

    return (
      <div className="flex items-center justify-between mb-8 select-none">
        {stepNames.map((name, idx) => {
          const actualStep = getActualStep(idx);
          const isPassed = currentStep > actualStep;
          const isActive = currentStep === actualStep;
          
          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isPassed
                    ? 'bg-forest text-white'
                    : isActive
                      ? 'bg-teal text-white ring-4 ring-teal-light'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                  {idx + 1}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal font-extrabold' : 'text-slate-400'
                  }`}>
                  {name}
                </span>
              </div>
              {idx < stepNames.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${currentStep > getActualStep(idx) ? 'bg-forest' : 'bg-slate-100'
                  }`} />
              )}
            </React.Fragment>
          );
        })}
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
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">Collection Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {supportsHomeCollection && (
                  <button
                    type="button"
                    onClick={() => setCollectionMethod('home')}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${collectionMethod === 'home' ? 'border-teal bg-teal-light/20 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🏠</span>
                      <span className={`text-xs font-black uppercase tracking-wider ${collectionMethod === 'home' ? 'text-teal' : 'text-slate-700'}`}>Home Collection</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed ml-7">Free doorstep sample pickup at your convenience.</p>
                  </button>
                )}
                {supportsWalkIn && (
                  <button
                    type="button"
                    onClick={() => setCollectionMethod('lab')}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${collectionMethod === 'lab' ? 'border-teal bg-teal-light/20 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🏥</span>
                      <span className={`text-xs font-black uppercase tracking-wider ${collectionMethod === 'lab' ? 'text-teal' : 'text-slate-700'}`}>Visit Diagnostic Center</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed ml-7">Visit the lab personally on your scheduled time.</p>
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>Express Report Delivery</span>
                <span className="text-[10px] text-coral bg-coral-light/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">+₹199</span>
              </h3>
              <button
                type="button"
                onClick={() => setExpressDelivery(!expressDelivery)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer w-full flex items-center justify-between ${expressDelivery ? 'border-coral bg-coral-light/10 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${expressDelivery ? 'text-coral' : 'text-slate-700'}`}>Get reports in 6 hours</span>
                    <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Skip the queue and receive your results faster.</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${expressDelivery ? 'bg-coral border-coral' : 'border-slate-300'}`}>
                  {expressDelivery && <FiCheckCircle className="text-white w-3.5 h-3.5" />}
                </div>
              </button>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex flex-col gap-2">
              <h4 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide flex items-center gap-1"><FiInfo className="w-3.5 h-3.5" /> Preparation Instructions</h4>
              <ul className="text-[10px] text-slate-650 font-bold flex flex-col gap-2 leading-normal mt-1">
                <li className="flex items-start gap-1.5"><span className="text-amber-600">✓</span> Fast for {test.fastingRequired !== 'Not Required' ? test.fastingRequired : '10-12 hours'}</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-600">✓</span> Drink only water</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-600">✓</span> Continue prescribed medicines unless advised</li>
                <li className="flex items-start gap-1.5"><span className="text-amber-600">✓</span> Contact support for special conditions</li>
              </ul>
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
                  {...registerPatient('patientName')}
                  placeholder="e.g. Aditi Sharma"
                  className={`px-4 py-3 rounded-xl border ${patientErrors.patientName ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400`}
                />
                {patientErrors.patientName && <p className="text-coral text-[10px] font-bold mt-1">{patientErrors.patientName.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Age (Years) *</label>
                <input
                  type="number"
                  {...registerPatient('patientAge')}
                  placeholder="e.g. 35"
                  className={`px-4 py-3 rounded-xl border ${patientErrors.patientAge ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {patientErrors.patientAge && <p className="text-coral text-[10px] font-bold mt-1">{patientErrors.patientAge.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Gender *</label>
                <select
                  {...registerPatient('patientGender')}
                  className={`px-4 py-3 rounded-xl border ${patientErrors.patientGender ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {patientErrors.patientGender && <p className="text-coral text-[10px] font-bold mt-1">{patientErrors.patientGender.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Contact Phone *</label>
                <input
                  type="tel"
                  {...registerPatient('patientPhone')}
                  placeholder="e.g. 9876543210"
                  className={`px-4 py-3 rounded-xl border ${patientErrors.patientPhone ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal/30'} bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400`}
                />
                {patientErrors.patientPhone && <p className="text-coral text-[10px] font-bold mt-1">{patientErrors.patientPhone.message}</p>}
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
                          className={`text-left p-3.5 border rounded-2xl transition-all cursor-pointer flex items-start gap-2.5 ${selectedAddressId === addr.id
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

            {collectionMethod === 'lab' && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-1.5 mb-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Selected Diagnostic Center</span>
                <div className="flex items-start gap-3 mt-1">
                  <span className="text-2xl mt-0.5">🏥</span>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{test.labName || 'Apex Diagnostics'}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5 max-w-[200px]">123 Medical Hub, {city || 'Indore'}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Open: 7 AM–9 PM</span>
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">NABL Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Select Date *</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
                  {upcomingDates.map((dateObj) => (
                    <button
                      key={dateObj.value}
                      type="button"
                      onClick={() => setPreferredDate(dateObj.value)}
                      className={`shrink-0 py-2.5 px-4 rounded-xl border font-black text-xs transition-all cursor-pointer ${
                        preferredDate === dateObj.value
                          ? 'bg-teal border-teal text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-teal/50 hover:bg-slate-50'
                      }`}
                    >
                      {dateObj.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`shrink-0 py-2.5 px-4 rounded-xl border font-black text-xs transition-all cursor-pointer ${
                      showCalendar ? 'bg-teal border-teal text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    + More
                  </button>
                </div>
                {showCalendar && (
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => { setPreferredDate(e.target.value); setShowCalendar(false); }}
                    min={getTodayStr()}
                    className="mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer max-w-[200px] animate-fade-in"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Select Time Slot *</label>
                <input type="text" required value={preferredTimeSlot} onChange={() => {}} className="absolute opacity-0 w-0 h-0 pointer-events-none" />
                
                {Object.entries(groupedTimeSlots).map(([groupName, slots]) => (
                  <div key={groupName} className="mb-2">
                    <span className="text-[9px] font-bold text-slate-400 block mb-2">{groupName}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slot) => {
                        const available = isLabSlotAvailable(slot.endHour, preferredDate);
                        return (
                          <button
                            key={slot.label}
                            type="button"
                            disabled={!available}
                            onClick={() => setPreferredTimeSlot(slot.label)}
                            className={`py-2 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                              !available 
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60' 
                                : preferredTimeSlot === slot.label 
                                  ? 'bg-teal border-teal text-white shadow-md scale-[1.02]' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal hover:text-teal active:scale-[0.98]'
                            }`}
                          >
                            <span className="text-[10px] font-black tracking-wide">{slot.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Instruction Deck */}
            <div className="bg-amber-50/60 p-4 border border-amber-100 rounded-2xl flex flex-col gap-3 mt-2">
              <h5 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide flex items-center gap-1"><FiInfo /> Clinical Guidelines</h5>
              <ul className="text-[9.5px] text-slate-650 font-bold list-disc pl-3.5 flex flex-col gap-1.5 leading-normal">
                <li>Bring a valid photo Identification proof (Aadhaar, Passport, or DL) at drawing time.</li>
                <li>Report generated automatically inside {test.timeframe.toLowerCase()} and synced to email.</li>
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
                {expressDelivery && (
                  <span className="text-[9px] text-coral font-bold uppercase tracking-wider block mt-1">+ Express Delivery Fee</span>
                )}
              </div>
              <div className="text-right">
                <strong className="text-lg font-black text-forest block">₹{(test.discountPrice || test.price) + (expressDelivery ? 199 : 0)}</strong>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2 mt-2">
              <h4 className="text-[10px] text-slate-800 font-extrabold uppercase tracking-wide">Booking Policies</h4>
              <ul className="text-[10px] text-slate-650 font-bold flex flex-col gap-2 mt-1">
                <li className="flex items-start gap-1.5"><span className="text-emerald-500">✓</span> Free cancellation up to 2 hours before collection</li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-500">✓</span> One free reschedule available</li>
                <li className="flex items-start gap-1.5"><span className="text-emerald-500">✓</span> Refund processed within 3–5 working days</li>
                {collectionMethod === 'home' && (
                  <li className="flex items-start gap-1.5"><span className="text-emerald-500">✓</span> Home collection fee refundable</li>
                )}
              </ul>
            </div>

            <form onSubmit={handleProcessPayment} className="flex flex-col gap-5">

              {/* Payment Methods triggers */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Choose Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${paymentMethod === 'upi' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    <span>📱</span> UPI / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${paymentMethod === 'card' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    <span>💳</span> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-3 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${paymentMethod === 'cash' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
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
                      onChange={(e) => setDummyCardNumber(e.target.value.replace(/\D/g, ''))}
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
                        onChange={(e) => setDummyCardCvv(e.target.value.replace(/\D/g, ''))}
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
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium text-center select-none max-w-md mx-auto"
          >
            {/* Confirmed Animation */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
              <FiCheckCircle className="stroke-[2.5px]" />
            </div>

            <h2 className="text-xl font-black text-slate-800 leading-tight">Lab Test Confirmed</h2>
            
            {/* Booking Top Info */}
            <div className="grid grid-cols-2 gap-3 mt-5 text-left border-y border-slate-100 py-4">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Booking ID</span>
                <span className="text-xs font-black text-slate-800">{generatedRefId}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Collection Type</span>
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  {collectionMethod === 'home' ? '🏠 Home Collection' : '🏥 Lab Visit'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Date & Time</span>
                <span className="text-xs font-black text-slate-800">{preferredDate} • {preferredTimeSlot.split(' ')[0]}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Status</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black tracking-wide inline-block mt-0.5">Payment Successful</span>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="text-left mt-5 mb-6">
              <h4 className="text-[10px] text-slate-800 font-extrabold uppercase tracking-wide mb-3">Booking Journey</h4>
              <div className="flex flex-col gap-3 relative before:absolute before:inset-y-2 before:left-[7px] before:w-0.5 before:bg-slate-100 pl-2">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center"><FiCheckCircle className="text-white w-2 h-2" /></div>
                  <span className="text-[11px] font-black text-slate-800">Request Submitted</span>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300"></div>
                  <span className="text-[11px] font-bold text-slate-500">Collector Assigned</span>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300"></div>
                  <span className="text-[11px] font-bold text-slate-500">Sample Collected</span>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300"></div>
                  <span className="text-[11px] font-bold text-slate-500">Testing In Progress</span>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300"></div>
                  <span className="text-[11px] font-bold text-slate-500">Report Ready</span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => navigate('/profile')}
                  className="py-3 px-2 bg-teal hover:bg-teal-dark text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 w-full"
                >
                  Track Booking
                </button>
                <button
                  onClick={() => alert('Invoice Download Initialized')}
                  className="py-3 px-2 bg-slate-800 hover:bg-slate-900 text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 w-full"
                >
                  Download Invoice
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => navigate('/profile')}
                  className="py-3 px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 w-full"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="py-3 px-2 bg-slate-100 hover:bg-slate-200 text-coral-600 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 w-full"
                >
                  Cancel Booking
                </button>
              </div>
              <button
                onClick={() => navigate('/')}
                className="mt-1 py-3 px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer w-full"
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
