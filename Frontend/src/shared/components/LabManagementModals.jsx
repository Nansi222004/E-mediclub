import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { cancelLabBooking, rescheduleLabBooking } from '../../modules/user/store/productSlice';

export default function LabManagementModals({
  showDetails, setShowDetails, selectedBooking,
  showCancel, setShowCancel, cancelReason, setCancelReason,
  showReschedule, setShowReschedule, rescheduleDate, setRescheduleDate, rescheduleSlot, setRescheduleSlot,
  locationState, showToast
}) {
  const dispatch = useDispatch();
  const [customCancelReason, setCustomCancelReason] = useState('');

  if (!selectedBooking) return null;

  return (
    <>
      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <div onClick={() => setShowDetails(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-premium z-10 border border-slate-100 flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800">Lab Booking Details</h3>
                <button onClick={() => setShowDetails(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 overflow-y-auto">
                <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-150/40">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                    <img src={selectedBooking.image || 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80'} alt={selectedBooking.packageName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-750 text-xs truncate">🔬 {selectedBooking.packageName}</h4>
                    <span className="text-[10px] text-teal font-black uppercase bg-teal-light/50 px-2 py-0.5 rounded-md mt-1 inline-block">{selectedBooking.status}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Date & Time</span>
                    <span className="font-black text-slate-800">{selectedBooking.date} • {selectedBooking.timeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Patient</span>
                    <span className="font-black text-slate-800">{selectedBooking.patientName || 'Self'} ({selectedBooking.patientAge} Yrs, {selectedBooking.patientGender})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Amount Paid</span>
                    <span className="font-black text-slate-800">₹{selectedBooking.price || selectedBooking.amountPaid || 499}</span>
                  </div>
                  {selectedBooking.otp && (
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-400 uppercase tracking-wider">Collection OTP</span>
                      <span className="font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">{selectedBooking.otp}</span>
                    </div>
                  )}
                </div>

                {['BOOKED', 'Scheduled', 'Confirmed', 'Pending'].includes(selectedBooking.status) && (
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => { setShowDetails(false); setShowReschedule(true); }} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl border-0 cursor-pointer transition-colors shadow-sm outline-none">
                      Reschedule
                    </button>
                    <button onClick={() => { setShowDetails(false); setShowCancel(true); }} className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase rounded-xl border border-rose-200 cursor-pointer transition-colors shadow-sm outline-none">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancel && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <div onClick={() => setShowCancel(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-premium z-10 border border-slate-100 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800">Cancel Lab Booking</h3>
                <button onClick={() => setShowCancel(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Why are you cancelling?</label>
                  <div className="flex flex-col gap-2 mt-1 text-slate-700 font-semibold">
                    {['Changed my mind', 'Not feeling well', 'Booked by mistake', 'Scheduling conflict', 'Doctor Advised Different Test', 'Found Better Price Elsewhere', 'Other'].map(reason => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100">
                        <input type="radio" name="labCancelReason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} className="accent-teal w-4 h-4" />
                        {reason}
                      </label>
                    ))}
                    {cancelReason === 'Other' && (
                      <div className="mt-2 px-2">
                        <textarea
                          placeholder="Please specify your reason"
                          value={customCancelReason}
                          onChange={(e) => setCustomCancelReason(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal resize-none h-20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    if(!cancelReason) { showToast('Please select a reason!', 'error'); return; }
                    if(cancelReason === 'Other' && !customCancelReason.trim()) { showToast('Please specify your reason.', 'error'); return; }
                    dispatch(cancelLabBooking({ id: selectedBooking.id, reason: cancelReason, customReason: customCancelReason.trim() }));
                    showToast('Lab Booking Cancelled Successfully');
                    setShowCancel(false);
                    setCancelReason('');
                    setCustomCancelReason('');
                  }}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer transition-colors shadow-sm outline-none"
                >
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showReschedule && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <div onClick={() => setShowReschedule(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-premium z-10 border border-slate-100 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800">Reschedule Booking</h3>
                <button onClick={() => setShowReschedule(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Select New Date</label>
                  <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Select New Time Slot</label>
                  <select value={rescheduleSlot} onChange={(e) => setRescheduleSlot(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700">
                    <option value="">Choose a slot...</option>
                    <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    if(!rescheduleDate || !rescheduleSlot) { showToast('Please select date and slot!', 'error'); return; }
                    dispatch(rescheduleLabBooking({ id: selectedBooking.id, date: rescheduleDate, timeSlot: rescheduleSlot }));
                    showToast('Booking Rescheduled Successfully');
                    setShowReschedule(false);
                    setRescheduleDate('');
                    setRescheduleSlot('');
                  }}
                  className="w-full py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer transition-colors shadow-sm outline-none"
                >
                  Confirm Reschedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
