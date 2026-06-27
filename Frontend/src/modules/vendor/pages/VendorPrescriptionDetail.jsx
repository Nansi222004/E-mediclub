import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCheck, FiAlertCircle,
  FiDownload, FiZoomIn, FiZoomOut, FiMaximize2, FiPhone, FiMapPin, FiClock
} from 'react-icons/fi';

const STORE_CATALOG = [
  { id: 'cat-1', name: 'Augmentin 625 Duo Tablet', variants: ['10 Tablets', '15 Tablets'], price: 164, stock: 45, expiry: '12/2027', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=120&q=80' },
  { id: 'cat-2', name: 'Dolo 650 Tablet', variants: ['15 Tablets', '30 Tablets'], price: 120, stock: 8, expiry: '09/2028', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=120&q=80' },
  { id: 'cat-3', name: 'Pan 40 Tablet', variants: ['15 Tablets'], price: 139, stock: 120, expiry: '05/2028', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=120&q=80' },
  { id: 'cat-4', name: 'Shelcal 500 Tablet', variants: ['15 Tablets', '30 Tablets'], price: 101, stock: 35, expiry: '10/2027', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=120&q=80' }
];

const PRESCRIPTION_DATA = {
  'RX10294': {
    prescriptionId: 'RX10294',
    customerId: 'cust-101',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    address: 'H-45, Sector 62, Noida, UP - 201301',
    uploadedTime: '17 June 2026',
    prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    status: 'AI_PROCESSING', // UPLOADED, AI_PROCESSING, REVIEW_REQUIRED, MEDICINE_MATCHED, CUSTOMER_CART_UPDATED, ORDER_CREATED, REJECTED
    extractedMedicines: [
      { name: 'Augmentin 625', quantity: 10, confidenceScore: 98, matched: false, matchedMedicineId: 'cat-1', variantId: '10 Tablets', price: 164, stock: 45, expiry: '12/2027' },
      { name: 'Dolo 650', quantity: 15, confidenceScore: 95, matched: false, matchedMedicineId: 'cat-2', variantId: '15 Tablets', price: 120, stock: 8, expiry: '09/2028' }
    ]
  }
};

export default function VendorPrescriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rxId = id || 'RX10294';

  const [prescription, setPrescription] = useState(
    PRESCRIPTION_DATA[rxId] || {
      prescriptionId: rxId,
      customerId: 'cust-999',
      customerName: 'Unknown Customer',
      phone: '+91 90000 00000',
      address: 'Not available',
      uploadedTime: 'Today',
      prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      status: 'AI_PROCESSING',
      extractedMedicines: []
    }
  );

  // Interaction States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMedIndex, setSelectedMedIndex] = useState(0);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Invalid prescription');
  const [customRejectReason, setCustomRejectReason] = useState('');
  
  // Matching selectors per extracted item
  const [matches, setMatches] = useState(
    prescription.extractedMedicines.map(med => ({
      matchedMedicineId: med.matchedMedicineId || STORE_CATALOG[0].id,
      variantId: med.variantId || STORE_CATALOG[0].variants[0],
      confirmed: med.matched
    }))
  );

  const handleMatchSelectorChange = (idx, field, value) => {
    setMatches(prev => prev.map((item, i) => {
      if (i === idx) {
        const updated = { ...item, [field]: value };
        if (field === 'matchedMedicineId') {
          const matchedItem = STORE_CATALOG.find(cat => cat.id === value);
          updated.variantId = matchedItem ? matchedItem.variants[0] : '';
        }
        return updated;
      }
      return item;
    }));
  };

  const handleConfirmMatch = (idx) => {
    setMatches(prev => prev.map((item, i) => i === idx ? { ...item, confirmed: true } : item));
    // Move to next unmatched if exists
    const nextUnconfirmed = matches.findIndex((item, i) => !item.confirmed && i !== idx);
    if (nextUnconfirmed !== -1) {
      setSelectedMedIndex(nextUnconfirmed);
    }
    
    // If all matched, upgrade prescription status to MEDICINE_MATCHED
    const allMatched = matches.every((item, i) => i === idx ? true : item.confirmed);
    if (allMatched && prescription.status !== 'CUSTOMER_CART_UPDATED' && prescription.status !== 'ORDER_CREATED') {
      setPrescription(prev => ({ ...prev, status: 'MEDICINE_MATCHED' }));
    }
  };

  const handleResetMatch = (idx) => {
    setMatches(prev => prev.map((item, i) => i === idx ? { ...item, confirmed: false } : item));
    setSelectedMedIndex(idx);
    if (prescription.status === 'MEDICINE_MATCHED') {
      setPrescription(prev => ({ ...prev, status: 'REVIEW_REQUIRED' }));
    }
  };

  // Cart Preview Calculation
  const cartSummary = useMemo(() => {
    let total = 0;
    const items = prescription.extractedMedicines.map((med, idx) => {
      const match = matches[idx];
      if (!match || !match.confirmed) return null;
      const catItem = STORE_CATALOG.find(item => item.id === match.matchedMedicineId);
      const price = catItem ? catItem.price : 0;
      const subtotal = price;
      total += subtotal;
      return {
        name: catItem ? catItem.name : med.name,
        variant: match.variantId,
        quantity: med.quantity,
        price: price,
        image: catItem ? catItem.image : 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=120&q=80'
      };
    }).filter(Boolean);

    return { items, total };
  }, [prescription, matches]);

  const handleAddToCart = () => {
    // Check if at least one medicine matches
    if (cartSummary.items.length === 0) {
      alert("Please match and confirm at least one medicine before updating customer cart.");
      return;
    }
    setPrescription(prev => ({ ...prev, status: 'CUSTOMER_CART_UPDATED' }));
  };

  const handleProcessPrescription = () => {
    if (prescription.status !== 'CUSTOMER_CART_UPDATED') {
      alert("Please add matched medicines to the customer cart first.");
      return;
    }
    setPrescription(prev => ({ ...prev, status: 'ORDER_CREATED' }));
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    const reason = rejectReason === 'Other' ? customRejectReason : rejectReason;
    setPrescription(prev => ({
      ...prev,
      status: 'REJECTED',
      rejectionReason: reason
    }));
    setIsRejectModalOpen(false);
  };

  // Zoom controls
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));

  // Human Readable Status
  const getStatusLabel = (status) => {
    switch(status) {
      case 'UPLOADED': return 'Uploaded';
      case 'AI_PROCESSING': return 'AI Parsed';
      case 'REVIEW_REQUIRED': return 'Need Review';
      case 'MEDICINE_MATCHED': return 'Medicine Matched';
      case 'CUSTOMER_CART_UPDATED': return 'Cart Updated';
      case 'ORDER_CREATED': return 'Order Created';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'UPLOADED': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'AI_PROCESSING': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'REVIEW_REQUIRED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDICINE_MATCHED': return 'bg-teal-55 bg-teal-50 text-teal-800 border-teal-100';
      case 'CUSTOMER_CART_UPDATED': return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'ORDER_CREATED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-250';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-110px)] p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-150 pb-5 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Prescription #{prescription.prescriptionId}</h1>
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.75 border rounded-lg tracking-wider ${getStatusClass(prescription.status)}`}>
              {getStatusLabel(prescription.status)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-semibold">
            <span>Customer: <strong className="text-slate-800 font-extrabold">{prescription.customerName}</strong></span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Uploaded: <strong className="text-slate-700 font-bold">{prescription.uploadedTime}</strong></span>
          </div>
        </div>

        {prescription.status !== 'ORDER_CREATED' && prescription.status !== 'REJECTED' && (
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              onClick={handleReject}
              className="px-4.5 py-2.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              Reject Prescription
            </button>
            <button 
              onClick={handleProcessPrescription}
              disabled={prescription.status !== 'CUSTOMER_CART_UPDATED'}
              className="px-5 py-2.5 bg-[#135A5A] hover:bg-[#0F4A4A] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm border-0"
            >
              Process Prescription
            </button>
          </div>
        )}
      </div>

      {prescription.status === 'ORDER_CREATED' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-center justify-between shadow-2xs animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">
              <FiCheckCircle className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Prescription Completed</h4>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">Medicines successfully matched and added to the customer cart.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/vendor/pharmacy/orders')}
            className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition-all shadow-sm"
          >
            View Order
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left Side: 70% width (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card 1: Original Prescription Image */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-4">
              Original Prescription
            </h3>
            
            <div className="w-full border border-slate-100 bg-slate-50 rounded-2xl p-4 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[500px] relative">
              <div 
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
                className="max-h-full max-w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <img 
                  src={prescription.prescriptionImage} 
                  alt="Prescription" 
                  className="max-h-[400px] object-contain rounded-lg shadow-sm" 
                />
              </div>

              {/* Float Toolbar controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-[1px] border border-slate-150 px-4 py-2 rounded-xl flex items-center gap-3.5 shadow-md">
                <button onClick={zoomOut} className="p-1 hover:bg-slate-100 rounded text-slate-600 border-0 bg-transparent cursor-pointer" title="Zoom Out">
                  <FiZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold text-slate-500 font-mono w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={zoomIn} className="p-1 hover:bg-slate-100 rounded text-slate-600 border-0 bg-transparent cursor-pointer" title="Zoom In">
                  <FiZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200" />
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 border-0 bg-transparent cursor-pointer" 
                  title="Full Screen Preview"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </button>
                <a 
                  href={prescription.prescriptionImage} 
                  download={`Prescription_${prescription.prescriptionId}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 border-0 bg-transparent cursor-pointer flex items-center" 
                  title="Download Image"
                >
                  <FiDownload className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: AI Extracted Medicines Table */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-4">
              AI Medicine Extraction
            </h3>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-450">
                    <th className="p-3.5">Medicine Name</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Confidence</th>
                    <th className="p-3.5">Matching Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {prescription.extractedMedicines.map((med, idx) => {
                    const match = matches[idx];
                    const isSelected = selectedMedIndex === idx;
                    return (
                      <tr 
                        key={idx} 
                        className={`transition-colors ${isSelected ? 'bg-teal-50/20' : 'hover:bg-slate-50/20'}`}
                      >
                        <td className="p-3.5">
                          <span className="font-extrabold text-slate-850 block">{med.name}</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-500">{med.quantity} tablets</td>
                        <td className="p-3.5 font-mono">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            med.confidenceScore >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {med.confidenceScore}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          {match?.confirmed ? (
                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10.5px]">
                              <FiCheckCircle className="shrink-0" /> Matched
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600 font-bold text-[10.5px]">
                              <FiAlertCircle className="shrink-0 animate-pulse" /> Pending Match
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedMedIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#135A5A] border-[#135A5A] text-white'
                                : 'bg-white border-slate-200 text-[#135A5A] hover:bg-slate-50'
                            }`}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Medicine Matching Panel */}
          {prescription.extractedMedicines.length > 0 && (
            <div className="bg-white border border-[#135A5A]/10 rounded-3xl p-5 shadow-sm border-l-4 border-l-[#135A5A]">
              <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-4 flex items-center justify-between">
                <span>Medicine Matching</span>
                <span className="text-[10px] bg-teal-50 text-[#135A5A] font-bold px-2.5 py-0.5 rounded-lg">
                  Item {selectedMedIndex + 1} of {prescription.extractedMedicines.length}
                </span>
              </h3>

              {(() => {
                const med = prescription.extractedMedicines[selectedMedIndex];
                const match = matches[selectedMedIndex] || {};
                const matchedItem = STORE_CATALOG.find(cat => cat.id === match.matchedMedicineId);
                
                return (
                  <div className="flex flex-col gap-4">
                    
                    {/* Visual Flow Indicator */}
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      <div className="md:col-span-5 flex flex-col">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">AI Detected Name</span>
                        <strong className="text-sm font-black text-slate-800 mt-1">{med.name}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold font-mono mt-0.5">Quantity: {med.quantity}</span>
                      </div>
                      
                      <div className="md:col-span-1 flex justify-center text-slate-350 text-xl font-bold">
                        <span className="md:rotate-0 rotate-90 my-1">→</span>
                      </div>

                      <div className="md:col-span-5 flex flex-col gap-1.5">
                        <span className="text-[8px] font-black uppercase text-[#135A5A] tracking-wider">Match With Catalog Medicine</span>
                        <select
                          value={match.matchedMedicineId}
                          onChange={(e) => handleMatchSelectorChange(selectedMedIndex, 'matchedMedicineId', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-205 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#135A5A]"
                        >
                          {STORE_CATALOG.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Variant Card info */}
                    {matchedItem && (
                      <div className="bg-white border border-slate-100 p-4.5 rounded-2xl flex flex-col md:flex-row justify-between gap-4 shadow-2xs">
                        <div className="flex gap-4">
                          <img 
                            src={matchedItem.image} 
                            alt={matchedItem.name}
                            className="w-16 h-16 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Selected Catalog Item</span>
                            <h4 className="text-xs font-black text-slate-800">{matchedItem.name}</h4>
                            
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Select Variant</span>
                              <select
                                value={match.variantId}
                                onChange={(e) => handleMatchSelectorChange(selectedMedIndex, 'variantId', e.target.value)}
                                className="px-2 py-1 bg-slate-50 border border-slate-150 rounded-lg text-2xs font-extrabold text-slate-700 outline-none"
                              >
                                {matchedItem.variants.map(v => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3.5 md:pt-0 md:pl-5 text-xs shrink-0 leading-none">
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Price</span>
                            <span className="font-mono font-black text-[#135A5A] text-sm">₹{matchedItem.price}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Stock</span>
                            <span className={`font-black uppercase text-[10px] ${
                              matchedItem.stock === 0 ? 'text-rose-500' : 'text-emerald-700'
                            }`}>
                              {matchedItem.stock > 0 ? `${matchedItem.stock} Avail` : 'Out of Stock'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Expiry</span>
                            <span className="font-bold text-slate-600 font-mono">{matchedItem.expiry}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 border-t border-slate-50 pt-4 justify-end">
                      {match.confirmed ? (
                        <>
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 mr-auto">
                            <FiCheck className="stroke-[3]" /> Confirmed Match Added
                          </span>
                          <button
                            onClick={() => handleResetMatch(selectedMedIndex)}
                            className="px-4.5 py-2.5 bg-slate-55 bg-slate-100 hover:bg-slate-150 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all border-0"
                          >
                            Change Medicine
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConfirmMatch(selectedMedIndex)}
                          className="px-6 py-2.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 transition-all shadow-sm"
                        >
                          Confirm Match
                        </button>
                      )}
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* Right Side: 30% width (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Card 1: Customer Information */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-4">
              Customer Information
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-[#135A5A] rounded-2xl flex items-center justify-center font-black text-sm uppercase">
                  {prescription.customerName.charAt(0)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-black text-slate-800">{prescription.customerName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patient Profile</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-650">
                <div className="flex items-start gap-2.5">
                  <FiPhone className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Mobile Number</span>
                    <span className="font-bold text-slate-800">{prescription.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Delivery Address</span>
                    <span className="font-bold text-slate-700 leading-normal">{prescription.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FiClock className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Previous Orders</span>
                    <span className="font-bold text-slate-800">4 Completed Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Cart Preview */}
          <div className="bg-white border border-[#135A5A]/10 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-[#135A5A] uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-4">
              Customer Cart Preview
            </h3>

            <div className="flex flex-col gap-3">
              {cartSummary.items.length > 0 ? (
                <>
                  <div className="flex flex-col gap-2.5">
                    {cartSummary.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 justify-between items-center text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200/50 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-slate-800 block truncate">{item.name}</span>
                          <span className="text-[9px] text-slate-450 font-bold block">{item.variant} • Qty: {item.quantity}</span>
                        </div>
                        <span className="font-mono font-black text-slate-800 shrink-0">₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-1.5 flex justify-between items-center text-xs">
                    <span className="font-black text-slate-900 uppercase">Total Amount</span>
                    <span className="font-mono font-black text-[#135A5A] text-sm">₹{cartSummary.total}</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={prescription.status === 'CUSTOMER_CART_UPDATED' || prescription.status === 'ORDER_CREATED'}
                    className="w-full py-3 bg-[#135A5A] hover:bg-[#0F4A4A] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all border-0 shadow-sm mt-2"
                  >
                    {prescription.status === 'CUSTOMER_CART_UPDATED' || prescription.status === 'ORDER_CREATED' 
                      ? 'Added To Customer Cart' 
                      : 'Add To Customer Cart'
                    }
                  </button>
                </>
              ) : (
                <div className="text-center py-6 text-slate-400 font-bold uppercase text-2xs leading-normal">
                  No medicines matched yet. Match catalog items to build cart preview.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Prescription Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest border-b border-slate-50 pb-3.5 mb-5">
          Prescription Timeline
        </h3>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          
          {/* Node 1: Prescription Uploaded */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-sm font-black shrink-0">✓</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 1</span>
              <strong className="text-xs font-extrabold text-slate-800">Prescription Uploaded</strong>
            </div>
          </div>
          
          <div className="h-px bg-slate-100 flex-1 hidden md:block" />

          {/* Node 2: AI Processing Completed */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-sm font-black shrink-0">✓</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 2</span>
              <strong className="text-xs font-extrabold text-slate-800">AI Processing Completed</strong>
            </div>
          </div>

          <div className="h-px bg-slate-100 flex-1 hidden md:block" />

          {/* Node 3: Medicines Extracted */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-sm font-black shrink-0">✓</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 3</span>
              <strong className="text-xs font-extrabold text-slate-800">Medicines Extracted</strong>
            </div>
          </div>

          <div className="h-px bg-slate-100 flex-1 hidden md:block" />

          {/* Node 4: Vendor Reviewed */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
              ['MEDICINE_MATCHED', 'CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(prescription.status)
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-teal-50 text-[#135A5A] border-teal-200 font-bold'
            }`}>
              {['MEDICINE_MATCHED', 'CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(prescription.status) ? '✓' : '●'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 4</span>
              <strong className="text-xs font-extrabold text-slate-800">Vendor Reviewed</strong>
            </div>
          </div>

          <div className="h-px bg-slate-100 flex-1 hidden md:block" />

          {/* Node 5: Cart Updated */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
              ['CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(prescription.status)
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-white text-slate-300 border-slate-205'
            }`}>
              {['CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(prescription.status) ? '✓' : '○'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 5</span>
              <strong className="text-xs font-extrabold text-slate-800">Cart Updated</strong>
            </div>
          </div>

          <div className="h-px bg-slate-100 flex-1 hidden md:block" />

          {/* Node 6: Order Created */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
              prescription.status === 'ORDER_CREATED'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 font-bold'
                : 'bg-white text-slate-300 border-slate-205'
            }`}>
              {prescription.status === 'ORDER_CREATED' ? '✓' : '○'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-black uppercase">Step 6</span>
              <strong className="text-xs font-extrabold text-slate-800">Order Created</strong>
            </div>
          </div>

        </div>
      </div>

      {/* FULL SCREEN IMAGE PREVIEW MODAL */}
      {isFullscreen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/90 backdrop-blur-[2px]">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white text-3xl font-black bg-transparent border-0 cursor-pointer"
          >
            ✕
          </button>
          <img 
            src={prescription.prescriptionImage} 
            alt="Prescription Full Screen" 
            className="max-w-[90%] max-h-[90%] object-contain rounded-xl shadow-2xl" 
          />
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 max-w-sm w-full mx-4 shadow-premium flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-sm font-black text-slate-850 uppercase tracking-wider">Reject Prescription</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Provide a reason for patient feedback.</p>
            </div>

            <div className="flex flex-col gap-3">
              {['Invalid prescription', 'Image unclear', 'Medicine unavailable', 'Expired prescription', 'Other'].map(reason => (
                <label key={reason} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100/50">
                  <input 
                    type="radio" 
                    name="rejectReason" 
                    value={reason} 
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-[#135A5A] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700">{reason}</span>
                </label>
              ))}

              {rejectReason === 'Other' && (
                <textarea 
                  rows="2"
                  placeholder="Type custom reason details..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none resize-none focus:border-[#135A5A]"
                />
              )}
            </div>

            <div className="flex gap-2.5 border-t border-slate-50 pt-4 mt-2">
              <button 
                type="button" 
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-650 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmReject}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-sm"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
