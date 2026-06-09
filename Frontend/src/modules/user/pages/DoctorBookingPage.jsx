import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiClock, FiActivity, FiArrowLeft, FiCheckCircle, 
  FiFileText, FiUploadCloud, FiTrash2, FiShield, FiHeart 
} from 'react-icons/fi';
import { bookDoctorAppointment } from '../store/productSlice';

export default function DoctorBookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get doctors from store to fetch selected doctor details
  const { doctors } = useSelector(state => state.products);
  const selectedDoctor = doctors.find(doc => doc.id === doctorId);

  // Form input states
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [consultationType, setConsultationType] = useState('Online Consultation'); // 'Online Consultation' or 'Offline / In-Person Consultation'
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  
  // UI Flow States
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');
  const [validationError, setValidationError] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'cash'
  const [dummyCardNumber, setDummyCardNumber] = useState('');
  const [dummyCardExpiry, setDummyCardExpiry] = useState('');
  const [dummyCardCvv, setDummyCardCvv] = useState('');
  const [dummyUpiId, setDummyUpiId] = useState('user@okaxis');
  const [isPaying, setIsPaying] = useState(false);

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '04:00 PM - 04:30 PM',
    '04:30 PM - 05:00 PM',
    '05:00 PM - 05:30 PM',
    '05:30 PM - 06:00 PM'
  ];

  const isDoctorSlotAvailable = (slot) => {
    const parts = slot.split(' - ');
    if (parts.length < 2) return true;
    const endTimeStr = parts[1].trim(); // e.g. '09:30 AM' or '12:00 PM'
    
    const timeMatch = endTimeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return true;
    
    let hour = parseInt(timeMatch[1]);
    const min = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    if (currentHour > hour || (currentHour === hour && currentMin >= min)) {
      return false; // Slot has already passed for today
    }
    return true;
  };

  if (!selectedDoctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <FiHeart className="text-coral text-5xl mb-4 animate-bounce" />
        <h2 className="text-base font-extrabold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold mt-2">The requested consultation profile could not be retrieved.</p>
        <button 
          onClick={() => navigate('/doctor-appointments')}
          className="mt-5 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm border-0 cursor-pointer"
        >
          Return to Directory
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

  // Pre-payment validation submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!patientName.trim()) {
      setValidationError('Patient Full Name is required.');
      return;
    }
    if (!patientAge || isNaN(patientAge) || parseInt(patientAge) <= 0) {
      setValidationError('Please enter a valid Patient Age.');
      return;
    }
    if (!preferredTime) {
      setValidationError('Please select a preferred appointment time slot.');
      return;
    }

    // Toggle payment review step
    setShowPaymentStep(true);
  };

  // Dispatch booking after dummy payment verification completes
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setValidationError('');
    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);

      const bookingRef = `APT-${Date.now().toString().slice(-6)}`;
      setGeneratedRefId(bookingRef);

      const now = new Date();
      const localDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const newAppointment = {
        id: bookingRef,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        avatar: selectedDoctor.avatar,
        date: localDateStr,
        timeSlot: preferredTime,
        type: consultationType,
        status: 'Scheduled',
        patientName: patientName,
        patientAge: patientAge,
        notes: additionalNotes,
        hasPrescription: !!prescriptionFile,
        amountPaid: selectedDoctor.fee,
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod
      };

      dispatch(bookDoctorAppointment(newAppointment));
      setShowPaymentStep(false);
      setBookingSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/doctor-appointments')}
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-teal transition-colors mb-5 uppercase tracking-wider"
      >
        <FiArrowLeft /> Back to Doctors
      </button>

      <AnimatePresence mode="wait">
        {bookingSuccess ? (
          /* 3. SUCCESS / CONFIRMED SHEET */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 border border-teal/20 shadow-premium flex flex-col items-center text-center gap-4 animate-fade-in relative overflow-hidden"
          >
            {/* Background glowing blob */}
            <div className="absolute top-0 w-36 h-36 bg-teal-light rounded-full filter blur-3xl opacity-60 animate-pulse" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm animate-bounce z-10">
              <FiCheckCircle className="stroke-[2.5]" />
            </div>
            
            <div className="z-10">
              <span className="text-[9px] bg-teal-light text-teal font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Booking Reference: {generatedRefId}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-4 leading-none">Consultation Scheduled!</h2>
              <p className="text-xs text-slate-405 font-bold mt-2 max-w-sm">
                Your medical consultation is verified and active. The practitioner's clinic assistant will reach out shortly.
              </p>
            </div>

            {/* Appointment summary details card */}
            <div className="w-full bg-slate-50 border border-slate-100/60 rounded-3xl p-4.5 text-xs text-slate-650 font-semibold mt-2.5 text-left flex flex-col gap-2.5 z-10 shadow-inner">
              <div className="flex justify-between border-b border-slate-200/40 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Physician</span>
                <span className="text-slate-800 font-extrabold">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Scheduled Slot</span>
                <span className="text-teal font-black">{preferredTime} (Today)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/40 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Patient Details</span>
                <span className="text-slate-800 font-extrabold">{patientName} (Age: {patientAge})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Consultation Mode</span>
                <span className="text-slate-800 font-extrabold uppercase text-[9.5px]">{consultationType.split(' ')[0]} Mode</span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4 z-10">
              <button
                onClick={() => navigate('/doctor-appointments')}
                className="py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer border-0"
              >
                Find Doctors
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer border-0"
              >
                Go to Profile
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3 z-10">
              <FiShield className="text-teal" /> Protected Under HIPAA Privacy Guidelines
            </div>
          </motion.div>
        ) : showPaymentStep ? (
          /* 2. CHECKOUT & PAYMENT SUMMARY SHEET */
          <motion.div
            key="payment-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Razorpay checkout header */}
            <div className="bg-slate-900 text-white p-4.5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal text-white flex items-center justify-center font-black text-sm">R</span>
                <span className="text-xs font-black tracking-wider uppercase">Razorpay Secure Checkout</span>
              </div>
              <span className="text-[9px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black tracking-widest">PCI-DSS</span>
            </div>

            <div className="border-b border-slate-100 pb-3 mt-1.5">
              <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider">Appointment Summary</span>
              <h3 className="text-sm font-extrabold text-slate-800 leading-tight mt-1">{selectedDoctor.name} • {selectedDoctor.specialty}</h3>
              <p className="text-[10px] text-slate-450 font-semibold mt-1">Patient: <strong className="text-slate-650">{patientName} (Age: {patientAge})</strong> • Mode: <strong className="text-slate-650">{consultationType}</strong></p>
            </div>

            {/* Fee break down list */}
            <div className="flex flex-col gap-2.5 text-xs text-slate-500 font-semibold border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Physician Consultation Tariff</span>
                <span className="text-slate-800">₹{selectedDoctor.fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Clinical Booking Surcharge & Taxes</span>
                <span className="text-slate-800">₹50</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-800 pt-2">
                <span>Grand Total</span>
                <span className="text-forest text-base">₹{selectedDoctor.fee + 50}</span>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="flex flex-col gap-5">
              {/* Payment Methods */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Choose Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3.5 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'upi' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>📱</span> UPI / Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3.5 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'card' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>💳</span> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-3.5 border rounded-xl font-black text-xs uppercase flex flex-col items-center gap-1 cursor-pointer transition-all border-0 ${
                      paymentMethod === 'cash' ? 'bg-teal/10 border-teal text-teal' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>🏥</span> Cash
                  </button>
                </div>
              </div>

              {/* Conditional UPI */}
              {paymentMethod === 'upi' && (
                <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fade-in">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Enter UPI Address</label>
                  <input
                    type="text"
                    value={dummyUpiId}
                    onChange={(e) => setDummyUpiId(e.target.value)}
                    placeholder="e.g. user@okicici"
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                    required
                  />
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
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Expiry</label>
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
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">CVV</label>
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
                  <span className="text-xl">🏥</span>
                  <div>
                    <h5 className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide">Pay at Clinic Counter</h5>
                    <p className="text-[9.5px] text-slate-650 font-bold mt-1">Cash booking active. Please pay your consultation fee ₹{selectedDoctor.fee + 50} directly at the hospital clinic reception desk prior to call.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  className="text-xs font-black text-slate-450 hover:text-slate-700 uppercase bg-transparent border-0 cursor-pointer outline-none"
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-6 py-3.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm border-0 cursor-pointer outline-none flex items-center gap-1.5"
                >
                  {isPaying ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>PROCESSING PAYMENT...</span>
                    </>
                  ) : (
                    <span>CONFIRM APPOINTMENT</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* 1. INITIAL BOOKING PARAMETERS FORM */
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 leading-tight">{selectedDoctor.name}</h2>
                  <p className="text-[10px] text-teal font-black uppercase tracking-wider mt-1">{selectedDoctor.specialty} • {selectedDoctor.experience}</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-right sm:self-auto self-start">
                <span className="text-[9px] text-slate-450 font-bold uppercase block">Consultation Fee</span>
                <span className="text-base font-black text-slate-800">₹{selectedDoctor.fee}</span>
              </div>
            </div>

            {/* Error alerts */}
            {validationError && (
              <div className="p-3.5 bg-coral-light/50 border border-coral/20 rounded-2xl text-[10px] font-bold text-coral uppercase tracking-wide mb-5">
                {validationError}
              </div>
            )}

            {/* Booking parameters Form */}
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
              
              {/* Form Input: Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Patient Full Name <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Form Input: Patient Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Patient Age (Years) <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 pointer-events-none">
                    <FiActivity />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 45"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Form Input: Preferred Time Slot Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Preferred Appointment TimeSlot <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none">
                    <FiClock />
                  </span>
                  <select
                    required
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all cursor-pointer text-slate-700 uppercase"
                  >
                    <option value="" disabled>-- Select Preferred Time Slot --</option>
                    {timeSlots.map(slot => {
                      const available = isDoctorSlotAvailable(slot);
                      return (
                        <option key={slot} value={slot} disabled={!available}>
                          {slot} {!available && ' (Passed)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Form Input: Consultation Type Toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Consultation Mode Type <span className="text-coral">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('Online Consultation')}
                    className={`py-3.5 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 tap-scale flex items-center justify-center gap-1.5 ${
                      consultationType === 'Online Consultation'
                        ? 'bg-teal/10 border-teal text-teal shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>📹</span> Online Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Offline / In-Person Consultation')}
                    className={`py-3.5 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 tap-scale flex items-center justify-center gap-1.5 ${
                      consultationType === 'Offline / In-Person Consultation'
                        ? 'bg-teal/10 border-teal text-teal shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏥</span> In-Clinic Visit
                  </button>
                </div>
              </div>

              {/* Form Input: Optional Prescription Attachment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Upload Previous Prescription (Optional)
                </label>
                {!prescriptionFile ? (
                  <label className="border border-dashed border-slate-200 hover:border-teal rounded-2xl p-4 bg-slate-50/60 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors">
                    <FiUploadCloud className="text-xl text-slate-400" />
                    <span className="text-[10px] font-black text-teal uppercase tracking-wider">Attach medical records</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="border border-slate-100 bg-slate-50 p-3 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FiFileText className="text-teal text-lg shrink-0" />
                      <span className="text-xs font-extrabold text-slate-700 truncate block">{prescriptionFile.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemoveFile} 
                      className="p-1.5 text-coral hover:bg-coral-light/50 rounded-lg shrink-0"
                    >
                      <FiTrash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Input: Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Additional Notes (Symptoms, history, etc.)
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your active clinical symptoms or current condition here..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Confirm Submit Action Button */}
              <button
                type="submit"
                className="mt-2 py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md transition-all duration-200 tap-scale flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                PROCEED TO PAY & BOOK
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
