import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiShoppingCart, FiAlertCircle, FiPlus, FiMinus, FiFileText } from 'react-icons/fi';
import { addToCart } from '../../modules/user/store/cartSlice';

export default function PrescriptionReviewModal({ isOpen, onClose, prescription }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // State to manage quantities of each medicine
  const [quantities, setQuantities] = useState({});
  // State to manage whether we substitute out-of-stock medicines with their alternatives
  const [useAlternatives, setUseAlternatives] = useState({});
  // Track individual add-to-cart actions
  const [addedStatus, setAddedStatus] = useState({});
  // General feedback notification
  const [toastMessage, setToastMessage] = useState('');
  // Active tab on mobile view: 'matcher' or 'rx'
  const [activeMobileTab, setActiveMobileTab] = useState('matcher');

  useEffect(() => {
    if (prescription && prescription.medicines) {
      const initialQty = {};
      const initialAlt = {};
      prescription.medicines.forEach(med => {
        initialQty[med.id] = 1;
        if (!med.inStock && med.alternative) {
          initialAlt[med.id] = true; // Use alternative by default
        }
      });
      setQuantities(initialQty);
      setUseAlternatives(initialAlt);
      setAddedStatus({});
      setActiveMobileTab('matcher'); // Reset mobile tab
    }
  }, [prescription]);

  if (!isOpen || !prescription) return null;

  const { id, date, fileName, medicines = [] } = prescription;

  const handleQtyChange = (medId, change) => {
    setQuantities(prev => ({
      ...prev,
      [medId]: Math.max(1, (prev[medId] || 1) + change)
    }));
  };

  const toggleAlternative = (medId) => {
    setUseAlternatives(prev => ({
      ...prev,
      [medId]: !prev[medId]
    }));
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Add individual item to cart
  const handleAddToCart = (med) => {
    const isOutOfStock = !med.inStock;
    const shouldUseAlt = isOutOfStock && useAlternatives[med.id] && med.alternative;
    const qty = quantities[med.id] || 1;

    let itemToAdd;
    if (shouldUseAlt) {
      itemToAdd = {
        id: `${med.id}-alt`,
        name: med.alternative.name,
        type: 'medicine',
        price: med.alternative.price,
        discountPrice: med.alternative.discountPrice,
        qty: qty,
        image: med.alternative.image || med.image,
        subtitle: med.alternative.packSize,
        details: med.composition
      };
    } else if (!isOutOfStock) {
      itemToAdd = {
        id: med.id,
        name: med.name,
        type: 'medicine',
        price: med.price,
        discountPrice: med.discountPrice,
        qty: qty,
        image: med.image,
        subtitle: med.packSize,
        details: med.dosage
      };
    } else {
      triggerToast(`${med.name} is out of stock!`);
      return;
    }

    dispatch(addToCart(itemToAdd));
    setAddedStatus(prev => ({ ...prev, [med.id]: true }));
    triggerToast(`Added ${itemToAdd.name} to cart!`);
  };

  // Add all available items (in-stock or checked alternatives) to cart
  const handleAddAllAvailable = () => {
    let addedCount = 0;
    medicines.forEach(med => {
      const isOutOfStock = !med.inStock;
      const shouldUseAlt = isOutOfStock && useAlternatives[med.id] && med.alternative;
      const qty = quantities[med.id] || 1;

      if (!isOutOfStock || shouldUseAlt) {
        let itemToAdd;
        if (shouldUseAlt) {
          itemToAdd = {
            id: `${med.id}-alt`,
            name: med.alternative.name,
            type: 'medicine',
            price: med.alternative.price,
            discountPrice: med.alternative.discountPrice,
            qty: qty,
            image: med.alternative.image || med.image,
            subtitle: med.alternative.packSize,
            details: med.composition
          };
        } else {
          itemToAdd = {
            id: med.id,
            name: med.name,
            type: 'medicine',
            price: med.price,
            discountPrice: med.discountPrice,
            qty: qty,
            image: med.image,
            subtitle: med.packSize,
            details: med.dosage
          };
        }
        dispatch(addToCart(itemToAdd));
        setAddedStatus(prev => ({ ...prev, [med.id]: true }));
        addedCount++;
      }
    });

    if (addedCount > 0) {
      triggerToast(`Added ${addedCount} prescribed medicines to cart!`);
    } else {
      triggerToast('No available medicines to add.');
    }
  };

  const formattedDate = new Date(date || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
        
        {/* Toast Notification */}
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2"
          >
            <FiCheck className="text-teal w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] max-h-[90vh]"
        >
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors border-0 cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Mobile Navigation Tab Bar */}
          <div className="flex md:hidden border-b border-slate-100 bg-slate-50 p-3 pr-14 gap-2 shrink-0 select-none">
            <button
              type="button"
              onClick={() => setActiveMobileTab('matcher')}
              className={`flex-grow py-2 px-3 text-xs font-black rounded-xl border transition-all ${
                activeMobileTab === 'matcher'
                  ? 'bg-forest border-forest text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              💊 Match Medicines
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('rx')}
              className={`flex-grow py-2 px-3 text-xs font-black rounded-xl border transition-all ${
                activeMobileTab === 'rx'
                  ? 'bg-forest border-forest text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              📄 View Rx Receipt
            </button>
          </div>

          {/* Left Panel: Clinical Prescription Card Preview */}
          <div className={`w-full md:w-5/12 bg-slate-50 p-6 md:p-8 flex flex-col border-r border-slate-100 overflow-y-auto h-full ${activeMobileTab === 'rx' ? 'flex-1 min-h-0' : 'hidden md:flex'}`}>
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-light/40 text-teal text-[10px] font-black uppercase tracking-wider rounded-full">
                <FiFileText className="w-3.5 h-3.5" /> Rx Verification Active
              </span>
            </div>

            {/* Scanned Paper clinical chart */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-inner relative flex flex-col gap-4 min-h-[360px] justify-between">
              {/* Decorative watermark / clinical seal */}
              <div className="absolute right-6 top-16 opacity-[0.05] pointer-events-none select-none text-9xl text-teal">
                Rx
              </div>

              {/* Clinic / Dr Header */}
              <div className="border-b-2 border-slate-100 pb-3">
                <h4 className="font-serif font-black text-slate-800 text-sm tracking-wide">E MEDICLUB CLINICAL SUITE</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Dr. Arvind Patel, MD (General Medicine)</p>
                <p className="text-[9px] text-slate-400">Reg No: 49204-B | Mumbai Central</p>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium block">PATIENT NAME</span>
                  <span className="text-slate-800 font-extrabold">{user?.name || 'Guest User'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">DATE OF RX</span>
                  <span className="text-slate-800 font-extrabold">{formattedDate}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-slate-400 font-medium block">FILE PARSED</span>
                  <span className="text-slate-700 font-mono truncate block">{fileName || 'prescription.pdf'}</span>
                </div>
              </div>

              {/* Cursive Handwriting Mock List */}
              <div className="flex-1 flex flex-col gap-3 my-4 pl-3 select-none">
                <div className="text-xl font-serif text-teal/90 italic font-black mb-1">Rx</div>
                {medicines.map((med, idx) => (
                  <div key={med.id} className="font-serif italic text-sm text-slate-700 pl-3 relative flex items-baseline gap-1">
                    <span className="text-slate-300 font-sans text-xs shrink-0 select-none">{idx + 1}.</span>
                    <span className="underline decoration-slate-200 underline-offset-4">{med.name}</span>
                    <span className="text-xs text-slate-400 italic">({med.packSize.split(' ')[0]})</span>
                  </div>
                ))}
              </div>

              {/* Stamp and signature */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                <div className="text-left">
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Digital Receipt ID</p>
                  <p className="text-[9px] font-mono text-slate-500">{id}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block text-center border border-teal/20 bg-teal-light/10 text-teal text-[8.5px] font-black uppercase px-2 py-0.5 rounded tracking-wider mb-1">
                    VERIFIED RX
                  </div>
                  <p className="text-[9px] font-serif italic text-slate-500">Dr. A. Patel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Parsed Medicines, Alternatives, Action controls */}
          <div className={`w-full md:w-7/12 p-6 md:p-8 flex flex-col overflow-y-auto h-full ${activeMobileTab === 'matcher' ? 'flex-1 min-h-0' : 'hidden md:flex'}`}>
            
            {/* Modal title */}
            <div className="mb-5">
              <h3 className="font-bold text-slate-800 text-lg">Prescription Cart Matcher</h3>
              <p className="text-xs text-slate-500 mt-1">We parsed your clinical receipt. Adjust quantities and select alternatives for out-of-stock items.</p>
            </div>

            {/* Medicine Listing */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 mb-6 max-h-[360px] md:max-h-none">
              {medicines.map((med) => {
                const isOutOfStock = !med.inStock;
                const qty = quantities[med.id] || 1;
                const isAdded = addedStatus[med.id];
                const shouldUseAlt = isOutOfStock && useAlternatives[med.id] && med.alternative;

                // Compute price display
                const originalPrice = shouldUseAlt ? med.alternative.price : med.price;
                const discountPrice = shouldUseAlt ? med.alternative.discountPrice : med.discountPrice;
                const totalItemCost = (discountPrice || originalPrice) * qty;

                return (
                  <div 
                    key={med.id}
                    className={`p-5 border rounded-2xl flex flex-col gap-3.5 transition-all shadow-sm ${
                      isOutOfStock 
                        ? (shouldUseAlt ? 'border-teal/30 bg-teal-light/5' : 'border-red-200 bg-red-50/10')
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    
                    {/* Upper row: Med Image + Details & availability badge & Rx Badge */}
                    <div className="flex gap-4">
                      {/* Medicine Image */}
                      <img 
                        src={shouldUseAlt ? (med.alternative.image || med.image) : med.image} 
                        alt={shouldUseAlt ? med.alternative.name : med.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-800 text-sm truncate">
                              {shouldUseAlt ? med.alternative.name : med.name}
                            </h5>
                            {shouldUseAlt && (
                              <span className="inline-block text-[9px] font-black text-teal bg-teal-light/35 px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5">
                                Substituted Alternative
                              </span>
                            )}
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">Composition: {med.composition}</p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {isOutOfStock ? (
                              <span className="text-[9px] bg-red-100 text-red-600 font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <FiAlertCircle className="w-3 h-3" /> Out of stock
                              </span>
                            ) : (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Available
                              </span>
                            )}

                            {med.rxRequired && (
                              <span className="text-[8.5px] border border-coral text-coral px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">
                                Rx Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle details: Instructions and price per pack */}
                    <div className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-xl">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Dosage Instruction</p>
                        <p className="text-slate-700 font-semibold mt-0.5">{med.dosage}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10.5px] text-slate-400 line-through">₹{originalPrice}</span>
                        <span className="text-sm font-black text-slate-800 ml-1.5">₹{discountPrice}</span>
                        <span className="text-[9.5px] text-slate-400 block font-bold mt-0.5">{med.packSize}</span>
                      </div>
                    </div>

                    {/* Out of Stock Alternative Section */}
                    {isOutOfStock && med.alternative && (
                      <div className="border border-teal-light bg-teal-light/20 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                        <div>
                          <p className="text-[9.5px] text-teal-dark font-black uppercase tracking-wider">Smart Alternative Suggestion</p>
                          <h6 className="font-extrabold text-slate-800 text-xs mt-0.5">{med.alternative.name}</h6>
                          <p className="text-[10px] text-slate-500">Pack: {med.alternative.packSize} | Price: <strong className="text-teal">₹{med.alternative.discountPrice}</strong></p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAlternative(med.id)}
                          className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all border shrink-0 cursor-pointer ${
                            shouldUseAlt 
                              ? 'bg-teal border-teal text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-teal'
                          }`}
                        >
                          {shouldUseAlt ? '✓ Using Alternative' : 'Use Alternative'}
                        </button>
                      </div>
                    )}

                    {/* Lower Row: Qty Controller & Add to Cart button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 border-t border-slate-100 pt-3">
                      {/* Qty Adjustment */}
                      {(!isOutOfStock || shouldUseAlt) ? (
                        <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl p-1 shrink-0">
                          <button 
                            type="button"
                            onClick={() => handleQtyChange(med.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all border-0 bg-transparent cursor-pointer"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-800 w-4 text-center select-none">{qty}</span>
                          <button 
                            type="button"
                            onClick={() => handleQtyChange(med.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-all border-0 bg-transparent cursor-pointer"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-red-500 font-bold select-none">
                          Item unavailable
                        </div>
                      )}

                      {/* Add button */}
                      {(!isOutOfStock || shouldUseAlt) ? (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(med)}
                          disabled={isAdded}
                          className={`flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-black rounded-xl transition-all border flex items-center justify-center gap-1.5 cursor-pointer min-h-[36px] ${
                            isAdded 
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-forest hover:bg-forest-dark border-forest text-white shadow-sm'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <FiCheck className="w-4 h-4 shrink-0" /> Added
                            </>
                          ) : (
                            <>
                              <FiShoppingCart className="w-4 h-4 shrink-0" /> Add ₹{totalItemCost}
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-black bg-slate-100 border border-slate-200 text-slate-350 rounded-xl cursor-not-allowed min-h-[36px]"
                        >
                          Out of stock
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Area */}
            <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddAllAvailable}
                className="flex-1 py-3 bg-forest hover:bg-forest-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-colors border-0 cursor-pointer flex items-center justify-center gap-2"
              >
                <FiCheck className="w-4 h-4" /> Add All Available to Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiShoppingCart className="w-4 h-4" /> Go to Cart
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
