import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiClock, FiBox, FiTruck, FiMapPin } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { cancelOrder, returnOrder } from '../../modules/user/store/productSlice';

export default function OrderManagementModals({
  showDetails, setShowDetails, selectedOrder,
  showCancel, setShowCancel, cancelReason, setCancelReason,
  showReturn, setShowReturn, returnReason, setReturnReason,
  showToast
}) {
  const dispatch = useDispatch();

  if (!selectedOrder) return null;

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
                <h3 className="text-sm font-black text-slate-800">Order Details: {selectedOrder.id}</h3>
                <button onClick={() => setShowDetails(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 overflow-y-auto">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-150/40">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-teal/10 text-teal rounded-xl flex items-center justify-center">
                      <FiBox className="text-lg" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-xs">Total Items: {selectedOrder.items.length}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-teal-light/50 text-teal text-[10px] font-black uppercase tracking-wider rounded-md border border-teal/10">
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Items in Order</span>
                  <div className="flex flex-col gap-2 p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-xs font-semibold text-slate-700">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="flex-1 truncate pr-2">{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                        <span className="text-slate-800">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-forest">₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Delivery Details</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs font-semibold text-slate-700">
                    <FiMapPin className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Returned' && (
                    <button onClick={() => { setShowDetails(false); setShowCancel(true); }} className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black uppercase rounded-xl border border-rose-200 cursor-pointer transition-colors shadow-sm outline-none">
                      Cancel Order
                    </button>
                  )}
                  {selectedOrder.status === 'Delivered' && (
                    <button onClick={() => { setShowDetails(false); setShowReturn(true); }} className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-black uppercase rounded-xl border border-amber-200 cursor-pointer transition-colors shadow-sm outline-none">
                      Return Order
                    </button>
                  )}
                  {selectedOrder.status === 'Returned' && (
                    <span className="flex-1 py-3 bg-slate-100 text-slate-500 text-xs font-black uppercase rounded-xl border-0 text-center shadow-sm">
                      Order Returned
                    </span>
                  )}
                  {selectedOrder.status === 'Cancelled' && (
                    <span className="flex-1 py-3 bg-slate-100 text-slate-500 text-xs font-black uppercase rounded-xl border-0 text-center shadow-sm">
                      Order Cancelled
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancel && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <div onClick={() => setShowCancel(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-premium z-10 border border-slate-100 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800">Cancel Order</h3>
                <button onClick={() => setShowCancel(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Why are you cancelling?</label>
                  <div className="flex flex-col gap-2 mt-1 text-slate-700 font-semibold">
                    {['Changed my mind', 'Expected delivery too late', 'Found cheaper alternative', 'Ordered by mistake', 'Other'].map(reason => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100">
                        <input type="radio" name="orderCancelReason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} className="accent-teal w-4 h-4" />
                        {reason}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    if(!cancelReason) { showToast('Please select a reason!', 'error'); return; }
                    dispatch(cancelOrder({ orderId: selectedOrder.id, reason: cancelReason }));
                    showToast('Order Cancelled Successfully');
                    setShowCancel(false);
                    setCancelReason('');
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

      {/* Return Order Modal */}
      <AnimatePresence>
        {showReturn && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <div onClick={() => setShowReturn(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-premium z-10 border border-slate-100 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-800">Return Order</h3>
                <button onClick={() => setShowReturn(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors outline-none">
                  <FiX className="text-slate-500" />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Why are you returning?</label>
                  <div className="flex flex-col gap-2 mt-1 text-slate-700 font-semibold">
                    {['Defective / Damaged product', 'Incorrect item received', 'Past expiry date', 'Item missing', 'Other'].map(reason => (
                      <label key={reason} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100">
                        <input type="radio" name="orderReturnReason" value={reason} checked={returnReason === reason} onChange={(e) => setReturnReason(e.target.value)} className="accent-teal w-4 h-4" />
                        {reason}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-2">
                  <FiTruck className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                    A pickup agent will arrive within 24-48 hours. Refund will be initiated after item inspection.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    if(!returnReason) { showToast('Please select a reason!', 'error'); return; }
                    dispatch(returnOrder({ orderId: selectedOrder.id, reason: returnReason }));
                    showToast('Return Initiated Successfully');
                    setShowReturn(false);
                    setReturnReason('');
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer transition-colors shadow-sm outline-none"
                >
                  Initiate Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
