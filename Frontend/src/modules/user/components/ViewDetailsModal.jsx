import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiClock, FiXCircle, FiInfo } from 'react-icons/fi';
import { 
  cancelDoctorAppointmentThunk, 
  rescheduleDoctorAppointmentThunk, 
  cancelLabBookingThunk, 
  rescheduleLabBookingThunk, 
  returnOrderThunk,
  cancelOrderThunk
} from '../store/productSlice';

export default function ViewDetailsModal({ isOpen, onClose, type, data }) {
  const dispatch = useDispatch();
  const [activeAction, setActiveAction] = useState(null); // 'cancel', 'reschedule', 'return'
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [refundStep, setRefundStep] = useState(false);
  const [refundMethod, setRefundMethod] = useState(''); // 'Wallet', 'BankAccount'
  const [bankDetails, setBankDetails] = useState({ name: '', account: '', ifsc: '' });

  if (!isOpen || !data) return null;

  const resetState = () => {
    setActiveAction(null);
    setReason('');
    setCustomReason('');
    setNewDate('');
    setNewTime('');
    setRefundStep(false);
    setRefundMethod('');
    setBankDetails({ name: '', account: '', ifsc: '' });
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmitAction = async () => {
    if (activeAction !== 'reschedule' && reason === 'OTHER' && !customReason.trim()) {
      alert("Please specify the custom reason.");
      return;
    }
    if (activeAction === 'reschedule' && (!newDate || !newTime)) {
      alert("Please select a new date and time.");
      return;
    }

    let refundData = null;
    if (refundStep) {
      if (!refundMethod) {
        alert("Please select a refund method.");
        return;
      }
      if (refundMethod === 'BankAccount' && (!bankDetails.name || !bankDetails.account || !bankDetails.ifsc)) {
        alert("Please fill in all bank details.");
        return;
      }
      const amount = type === 'order' ? data.total : type === 'consultation' ? data.fee : data.totalAmount || data.price || 0;
      refundData = {
        amount,
        method: refundMethod,
        title: type === 'order' ? `Refund for Order ${data.id}` : type === 'consultation' ? `Refund for Consultation ${data.id}` : `Refund for Lab Booking ${data.id}`,
        bankDetails: refundMethod === 'BankAccount' ? bankDetails : null
      };
    }

    setIsLoading(true);
    try {
      if (type === 'consultation') {
        if (activeAction === 'cancel') {
          await dispatch(cancelDoctorAppointmentThunk({ id: data.id, reason, customReason, refundData })).unwrap();
        } else if (activeAction === 'reschedule') {
          await dispatch(rescheduleDoctorAppointmentThunk({ id: data.id, newDate, newTimeSlot: newTime })).unwrap();
        }
      } else if (type === 'lab') {
        if (activeAction === 'cancel') {
          await dispatch(cancelLabBookingThunk({ id: data.id, reason, customReason, refundData })).unwrap();
        } else if (activeAction === 'reschedule') {
          await dispatch(rescheduleLabBookingThunk({ id: data.id, newDate, newTimeSlot: newTime })).unwrap();
        }
      } else if (type === 'order') {
        if (activeAction === 'return') {
          await dispatch(returnOrderThunk({ id: data.id, reason, customReason, refundData })).unwrap();
        } else if (activeAction === 'cancel') {
          await dispatch(cancelOrderThunk({ id: data.id, reason, customReason, refundData })).unwrap();
        }
      }
      alert("Request processed successfully.");
      handleClose();
    } catch (err) {
      alert(err || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToRefund = () => {
    if (reason === 'OTHER' && !customReason.trim()) {
      alert("Please specify the custom reason.");
      return;
    }
    // For COD orders cancelled before delivery, no refund needed
    if (type === 'order' && data?.paymentMethod === 'COD' && activeAction === 'cancel') {
      handleSubmitAction();
    } else {
      setRefundStep(true);
    }
  };

  const renderActionForm = () => {
    if (!activeAction) return null;

    if (activeAction === 'reschedule') {
      return (
        <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-200">
          <h4 className="text-xs font-black uppercase text-slate-800 mb-3">Select New Slot</h4>
          <div className="flex flex-col gap-3">
            <input 
              type="date" 
              value={newDate} 
              onChange={(e) => setNewDate(e.target.value)} 
              className="p-2 text-xs border border-slate-200 rounded-lg outline-none" 
            />
            <select 
              value={newTime} 
              onChange={(e) => setNewTime(e.target.value)} 
              className="p-2 text-xs border border-slate-200 rounded-lg outline-none"
            >
              <option value="">Select Time Slot</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setActiveAction(null)} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg">Back</button>
              <button onClick={handleSubmitAction} disabled={isLoading} className="flex-1 py-2 text-xs font-bold text-white bg-teal rounded-lg">{isLoading ? 'Processing...' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      );
    }

    const reasons = type === 'consultation' ? [
      { id: 'FEELING_BETTER', label: 'Feeling Better' },
      { id: 'SCHEDULING_CONFLICT', label: 'Scheduling Conflict' },
      { id: 'BOOKED_BY_MISTAKE', label: 'Booked By Mistake' },
      { id: 'DOCTOR_UNAVAILABLE', label: 'Doctor Unavailable' },
      { id: 'OTHER', label: 'Other' }
    ] : type === 'lab' ? [
      { id: 'WRONG_TEST_BOOKED', label: 'Wrong Test Booked' },
      { id: 'DOCTOR_ADVICE_CHANGED', label: 'Doctor Advice Changed' },
      { id: 'NO_LONGER_NEEDED', label: 'No Longer Needed' },
      { id: 'OTHER', label: 'Other' }
    ] : [
      { id: 'WRONG_MEDICINE', label: 'Wrong Medicine' },
      { id: 'DAMAGED_PRODUCT', label: 'Damaged Product' },
      { id: 'EXPIRED_PRODUCT', label: 'Expired Product' },
      { id: 'MISSING_ITEMS', label: 'Missing Items' },
      { id: 'OTHER', label: 'Other' }
    ];

    if (refundStep) {
      const refundAmount = type === 'order' ? data.total : type === 'consultation' ? data.fee : data.totalAmount || data.price || 0;
      return (
        <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-200">
          <h4 className="text-xs font-black uppercase text-slate-800 mb-3">How would you like your refund?</h4>
          <p className="text-[10px] text-slate-500 font-bold mb-4">Refund Amount: <span className="text-slate-800">₹{refundAmount}</span></p>
          
          <div className="flex flex-col gap-3">
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${refundMethod === 'Wallet' ? 'border-teal bg-teal-50/50' : 'border-slate-200 bg-white'}`}>
              <input type="radio" name="refundMethod" value="Wallet" checked={refundMethod === 'Wallet'} onChange={() => setRefundMethod('Wallet')} className="accent-teal" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">E-Mediclub Wallet ⚡</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Instant refund. Use for future bookings.</span>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${refundMethod === 'BankAccount' ? 'border-teal bg-teal-50/50' : 'border-slate-200 bg-white'}`}>
              <input type="radio" name="refundMethod" value="BankAccount" checked={refundMethod === 'BankAccount'} onChange={() => setRefundMethod('BankAccount')} className="accent-teal" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Bank Account Transfer 🏦</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Takes 3-5 business days.</span>
              </div>
            </label>

            {refundMethod === 'BankAccount' && (
              <div className="flex flex-col gap-2 mt-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <input type="text" placeholder="Account Holder Name" value={bankDetails.name} onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})} className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none" />
                <input type="text" placeholder="Account Number" value={bankDetails.account} onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})} className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none" />
                <input type="text" placeholder="IFSC Code" value={bankDetails.ifsc} onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})} className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none" />
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={() => setRefundStep(false)} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg">Back</button>
              <button onClick={handleSubmitAction} disabled={isLoading || !refundMethod} className="flex-1 py-2 text-xs font-bold text-white bg-teal rounded-lg disabled:opacity-50">{isLoading ? 'Processing...' : 'Confirm Refund'}</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-200">
        <h4 className="text-xs font-black uppercase text-slate-800 mb-3">Why are you {activeAction === 'return' ? 'returning' : 'cancelling'}?</h4>
        <div className="flex flex-col gap-2">
          {reasons.map((r) => (
            <label key={r.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input 
                type="radio" 
                name="reason" 
                value={r.id} 
                checked={reason === r.id} 
                onChange={() => setReason(r.id)} 
                className="accent-teal"
              />
              {r.label}
            </label>
          ))}
          {reason === 'OTHER' && (
            <div className="mt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Please Specify</span>
              <textarea 
                rows="2" 
                value={customReason} 
                onChange={(e) => setCustomReason(e.target.value)} 
                placeholder="E.g. Travel plans changed" 
                className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none"
              />
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button onClick={() => setActiveAction(null)} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg">Back</button>
            <button onClick={handleProceedToRefund} disabled={isLoading || !reason} className="flex-1 py-2 text-xs font-bold text-white bg-rose-500 rounded-lg disabled:opacity-50">Proceed</button>
          </div>
        </div>
      </div>
    );
  };

  const getVisibility = () => {
    if (!data) return { showCancel: false, showReschedule: false, showReturn: false };
    const now = new Date();
    
    let showCancel = false;
    let showReschedule = false;
    let showReturn = false;

    if (type === 'consultation') {
      const status = data.bookingStatus || data.status;
      showCancel = status !== 'Completed' && status !== 'Cancelled' && status !== 'IN_PROGRESS';
      showReschedule = status === 'Scheduled' || status === 'Confirmed' || status === 'Pending';
    } else if (type === 'lab') {
      showCancel = data.status === 'new_booking' || data.status === 'confirmed' || data.status === 'collector_assigned';
      showReschedule = showCancel;
    } else if (type === 'order') {
      const isDelivered = data.status === 'Delivered';
      const delDate = data.deliveryDate ? new Date(data.deliveryDate) : new Date(); // fallback
      const daysDiff = (now - delDate) / (1000 * 60 * 60 * 24);
      showReturn = isDelivered && daysDiff <= 7;
      showCancel = !isDelivered && data.status !== 'Cancelled' && data.status !== 'RETURN_REQUESTED';
    }
    
    return { showCancel, showReschedule, showReturn };
  };

  const vis = getVisibility();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                {type === 'order' ? 'Order Details' : type === 'consultation' ? 'Appointment Details' : 'Booking Details'}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">{data.id}</span>
            </div>
            <button onClick={handleClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer outline-none transition-colors border-0">
              <FiX className="text-lg" />
            </button>
          </div>
          
          <div className="p-5 overflow-y-auto">
            {!activeAction ? (
              <div className="flex flex-col gap-4">
                {type === 'consultation' && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Doctor</span>
                      <strong className="text-slate-800">{data.doctorName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Patient</span>
                      <strong className="text-slate-800">{data.patientName || 'Self'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Consultation Mode</span>
                      <strong className="text-slate-800">{data.type || 'In-Clinic'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Date & Time</span>
                      <strong className="text-slate-800">{data.date || data.appointmentDate} • {data.timeSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                      <strong className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">{data.status || data.bookingStatus}</strong>
                    </div>
                    {data.previousSlots && data.previousSlots.length > 0 && (
                       <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Previous Slots (Rescheduled)</span>
                          {data.previousSlots.map((ps, i) => (
                             <div key={i} className="text-[10px] text-slate-500 font-semibold">• {ps.date} {ps.time}</div>
                          ))}
                       </div>
                    )}
                  </div>
                )}
                
                {type === 'lab' && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Test Package</span>
                      <strong className="text-slate-800">{data.packageName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Collection Date</span>
                      <strong className="text-slate-800">{data.date} • {data.timeSlot}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                      <strong className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">{data.status}</strong>
                    </div>
                  </div>
                )}
                
                {type === 'order' && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Total Items</span>
                      <strong className="text-slate-800">{data.items?.length || 0} items</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Total Amount</span>
                      <strong className="text-slate-800">₹{data.total}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                      <strong className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">{data.status}</strong>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-2">
                  {vis.showReschedule && (
                    <button onClick={() => setActiveAction('reschedule')} className="py-2.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 border border-amber-200 text-[10px] font-black uppercase rounded-xl transition-colors outline-none cursor-pointer">
                      Reschedule
                    </button>
                  )}
                  {vis.showCancel && (
                    <button onClick={() => setActiveAction('cancel')} className="py-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-200 text-[10px] font-black uppercase rounded-xl transition-colors outline-none cursor-pointer">
                      {type === 'order' ? 'Cancel Order' : 'Cancel Booking'}
                    </button>
                  )}
                  {vis.showReturn && (
                    <button onClick={() => setActiveAction('return')} className="py-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-200 text-[10px] font-black uppercase rounded-xl transition-colors outline-none cursor-pointer">
                      Request Return
                    </button>
                  )}
                  {type === 'order' && (
                    <button className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-xl transition-colors outline-none cursor-pointer">
                      Download Invoice
                    </button>
                  )}
                  {type === 'lab' && data.reportUrl && (
                    <a href={data.reportUrl.startsWith('http') ? data.reportUrl : `http://localhost:5000/${data.reportUrl.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="py-2.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase rounded-xl text-center decoration-transparent outline-none flex items-center justify-center">
                      Download Report
                    </a>
                  )}
                </div>
              </div>
            ) : renderActionForm()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
