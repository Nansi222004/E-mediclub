import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiUploadCloud, FiSearch, FiCheckCircle, FiShoppingCart, FiCpu, FiAlertCircle
} from 'react-icons/fi';
import { mockPrescriptions, getPrescriptionOrders } from './pharmacyVendorMockData';

// Pharmacy Catalog items for matching
const STORE_CATALOG = [
  { id: 'cat-1', name: 'Augmentin 625 Duo Tablet', variants: ['10 tablets', '15 tablets'], price: 164, stock: 45 },
  { id: 'cat-2', name: 'Dolo 650 Tablet', variants: ['15 tablets', '30 tablets'], price: 28, stock: 8 },
  { id: 'cat-3', name: 'Pan 40 Tablet', variants: ['15 tablets'], price: 139.5, stock: 120 },
  { id: 'cat-4', name: 'Shelcal 500 Tablet', variants: ['15 tablets', '30 tablets'], price: 101.5, stock: 0 }
];

export default function VendorPrescriptionManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const initialPrescriptions = useMemo(() => {
    return mockPrescriptions;
  }, []);

  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [activeTab, setActiveTab] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer & Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' | 'review'
  const [currentRx, setCurrentRx] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectRxId, setRejectRxId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Invalid prescription');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Image Viewer States
  const [imgZoom, setImgZoom] = useState(1);
  const [imgRotation, setImgRotation] = useState(0);

  // Quote Builder States
  const [deliveryCharge, setDeliveryCharge] = useState(30);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Selected matches state inside drawer
  const [matchingDraft, setMatchingDraft] = useState({});

  // Stats Calculations
  const stats = useMemo(() => {
    const todayUploads = prescriptions.filter(p => p.uploadedDate === new Date().toISOString().substring(0, 10)).length || prescriptions.length;
    const converted = prescriptions.filter(p => p.status === 'ORDER_CREATED').length;
    const rejected = prescriptions.filter(p => p.status === 'REJECTED').length;
    
    // Calculate mock revenue based on converted orders
    const revenue = converted * 240; 
    
    return {
      todayUploads,
      convertedCount: converted,
      revenue,
      rejectedCount: rejected,
      avgProcessingTime: '18 mins',
      mostPrescribed: 'Paracetamol'
    };
  }, [prescriptions]);

  // Tab Count Calculations
  const tabCounts = useMemo(() => {
    return {
      All: prescriptions.length,
      New: prescriptions.filter(p => p.status === 'NEW').length,
      Review: prescriptions.filter(p => p.status === 'AI_PROCESSED' || p.status === 'UNDER_REVIEW').length,
      QuoteSent: prescriptions.filter(p => p.status === 'QUOTE_SENT').length,
      Approved: prescriptions.filter(p => p.status === 'CUSTOMER_APPROVED').length,
      Orders: prescriptions.filter(p => p.status === 'ORDER_CREATED').length,
      Rejected: prescriptions.filter(p => p.status === 'REJECTED').length
    };
  }, [prescriptions]);

  // Filter Logic
  const filteredPrescriptions = useMemo(() => {
    let result = prescriptions.filter(rx => {
      // Search filter
      const matchesSearch = 
      rx.prescriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      // Status Tab filter
      let matchesTab = true;
      if (activeTab === 'New') matchesTab = rx.status === 'NEW';
      else if (activeTab === 'Review') matchesTab = ['AI_PROCESSED', 'UNDER_REVIEW'].includes(rx.status);
      else if (activeTab === 'Quote Sent') matchesTab = rx.status === 'QUOTE_SENT';
      else if (activeTab === 'Approved') matchesTab = rx.status === 'CUSTOMER_APPROVED';
      else if (activeTab === 'Orders') matchesTab = rx.status === 'ORDER_CREATED';
      else if (activeTab === 'Rejected') matchesTab = rx.status === 'REJECTED';

      if (statusParam === 'pending') {
        const pendingList = getPrescriptionOrders(prescriptions);
        if (!pendingList.some(p => p.prescriptionId === rx.prescriptionId)) {
          return false;
        }
      }

      return matchesSearch && matchesTab;
    });

    // Priority Sorting (Emergency always on top)
    result.sort((a, b) => {
      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;
      return 0;
    });

    return result;
  }, [prescriptions, activeTab, searchTerm, statusParam]);

  // Drawer Controls
  const handleOpenDrawer = (rx, mode = 'view') => {
    setCurrentRx(rx);
    setDrawerMode(mode);
    setIsDrawerOpen(true);
    
    // Initialize matches drafting
    const initialDraft = {};
    rx.extractedMedicines.forEach((med, idx) => {
      initialDraft[idx] = {
        matchedMedicineId: med.matchedMedicineId || STORE_CATALOG[0].id,
        variantId: med.variantId || STORE_CATALOG[0].variants[0],
        quantity: med.quantity || 10,
        confirmed: !!med.matched
      };
    });
    setMatchingDraft(initialDraft);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentRx(null);
    setImgZoom(1);
    setImgRotation(0);
    setDeliveryCharge(30);
    setDiscountAmount(0);
  };

  // Matching Logic
  const handleDraftMatchChange = (idx, field, value) => {
    setMatchingDraft(prev => {
      const updated = { ...prev[idx], [field]: value };
      if (field === 'matchedMedicineId') {
        const catItem = STORE_CATALOG.find(item => item.id === value);
        updated.variantId = catItem ? catItem.variants[0] : '';
      }
      return { ...prev, [idx]: updated };
    });
  };

  const handleConfirmMatch = (idx) => {
    setMatchingDraft(prev => ({
      ...prev,
      [idx]: { ...prev[idx], confirmed: true }
    }));
  };

  const handleChangeMedicine = (idx) => {
    setMatchingDraft(prev => ({
      ...prev,
      [idx]: { ...prev[idx], confirmed: false }
    }));
  };

  // Send Matched Medicines to Customer
  const handleSendToCustomer = () => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.prescriptionId === currentRx.prescriptionId) {
        // Build matched list
        const updatedExtracted = rx.extractedMedicines.map((med, idx) => {
          const draft = matchingDraft[idx];
          const catItem = STORE_CATALOG.find(item => item.id === draft.matchedMedicineId);
          return {
            ...med,
            matchedMedicineId: draft.matchedMedicineId,
            variantId: draft.variantId,
            quantity: draft.quantity,
            price: catItem ? catItem.price : 0,
            stock: catItem ? catItem.stock : 0,
            matched: true
          };
        });
        return {
          ...rx,
          status: 'CUSTOMER_CART_UPDATED',
          extractedMedicines: updatedExtracted
        };
      }
      return rx;
    }));
    alert("Matched medicines sent! Customer cart updated successfully.");
    handleCloseDrawer();
  };

  // Rejection Logic
  const handleTriggerReject = (id) => {
    setRejectRxId(id);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    const finalReason = rejectReason === 'Other' ? customRejectReason : rejectReason;
    setPrescriptions(prev => prev.map(rx => {
      if (rx.prescriptionId === rejectRxId) {
        return {
          ...rx,
          status: 'REJECTED',
          rejectionReason: finalReason
        };
      }
      return rx;
    }));
    setIsRejectModalOpen(false);
    setCustomRejectReason('');
    alert("Prescription rejected.");
  };

  // Calculate cart preview total inside drawer
  const cartSummary = useMemo(() => {
    if (!currentRx) return { items: [], subtotal: 0, total: 0 };
    let subtotal = 0;
    const items = currentRx.extractedMedicines.map((med, idx) => {
      const draft = matchingDraft[idx];
      if (!draft || !draft.confirmed) return null;
      const catItem = STORE_CATALOG.find(item => item.id === draft.matchedMedicineId);
      const itemPrice = catItem ? catItem.price : 0;
      const itemTotal = itemPrice * Number(draft.quantity || 1);
      subtotal += itemTotal;
      return {
        name: catItem ? catItem.name : med.name,
        qty: draft.quantity,
        variant: draft.variantId,
        price: itemPrice,
        totalPrice: itemTotal
      };
    }).filter(Boolean);

    const total = subtotal + Number(deliveryCharge) - Number(discountAmount);
    return { items, subtotal, total: total > 0 ? total : 0 };
  }, [currentRx, matchingDraft, deliveryCharge, discountAmount]);

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-110px)] p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* 1. Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Prescription Orders</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Manage uploaded prescriptions, AI medicine extraction, matching and customer cart conversion.
        </p>
      </div>

      {/* 2. Top Statistics Section (Analytics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Today's Uploads */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Today's Uploads</span>
          <span className="text-xl font-black text-slate-850 mt-0.5">{stats.todayUploads}</span>
        </div>

        {/* Converted To Orders */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Converted Orders</span>
          <span className="text-xl font-black text-teal-600 mt-0.5">{stats.convertedCount}</span>
        </div>

        {/* Revenue From Prescriptions */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Revenue</span>
          <span className="text-xl font-black text-slate-850 mt-0.5 font-mono">₹{stats.revenue.toLocaleString()}</span>
        </div>

        {/* Rejected Prescriptions */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Rejected</span>
          <span className="text-xl font-black text-rose-500 mt-0.5">{stats.rejectedCount}</span>
        </div>
        
        {/* Average Processing Time */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Avg Process Time</span>
          <span className="text-xl font-black text-slate-850 mt-0.5">{stats.avgProcessingTime}</span>
        </div>

        {/* Most Prescribed Medicines */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-center">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Most Prescribed</span>
          <span className="text-sm font-black text-[#135A5A] mt-1 line-clamp-1">{stats.mostPrescribed}</span>
        </div>

      </div>

      {/* 3. Search & Tabs Bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input 
            type="text" 
            placeholder="Search prescriptions by Rx ID or patient name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#135A5A] outline-none transition-all shadow-inner"
          />
        </div>

        {/* Priority Filters */}
        <div className="flex flex-wrap gap-2 mb-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center mr-2">Quick Filters:</span>
          {['Urgent', 'Today', 'Pending Review', 'Prescription Expiring'].map(f => (
            <button key={f} className="px-2.5 py-1 text-[9px] font-bold uppercase rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              {f}
            </button>
          ))}
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 border-t border-slate-50 pt-3">
          {[
            { key: 'All', label: 'All', count: tabCounts.All },
            { key: 'New', label: 'New', count: tabCounts.New },
            { key: 'Review', label: 'Review', count: tabCounts.Review },
            { key: 'Quote Sent', label: 'Quote Sent', count: tabCounts.QuoteSent },
            { key: 'Approved', label: 'Approved', count: tabCounts.Approved },
            { key: 'Orders', label: 'Orders', count: tabCounts.Orders },
            { key: 'Rejected', label: 'Rejected', count: tabCounts.Rejected }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchParams({});
              }}
              className={`px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border
                ${activeTab === tab.key 
                  ? 'bg-[#135A5A] border-[#135A5A] text-white shadow-sm' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
            >
              <span>{tab.label}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.25 rounded-md
                ${activeTab === tab.key ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* 4. Converted Orders Table Tab View */}
      {activeTab === 'Orders' ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-450">
                <th className="p-3">Prescription ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
              {filteredPrescriptions.map(rx => (
                <tr key={rx.prescriptionId} className="hover:bg-slate-50/20">
                  <td className="p-3 font-bold text-slate-900">{rx.prescriptionId}</td>
                  <td className="p-3">{rx.customerName}</td>
                  <td className="p-3 text-[#135A5A] font-bold">{rx.orderId}</td>
                  <td className="p-3 font-mono font-bold">₹{rx.amount}</td>
                  <td className="p-3">
                    <span className="bg-emerald-55 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                      {rx.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase">
                      {rx.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPrescriptions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400 font-semibold">No converted prescription orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* 5. Prescription Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map(rx => {
            let statusStyle = "bg-amber-50 text-amber-700 border-amber-250";
            if (rx.status === 'NEW') statusStyle = "bg-slate-50 text-slate-500 border-slate-250";
            if (rx.status === 'QUOTE_SENT') statusStyle = "bg-indigo-50 text-indigo-700 border-indigo-250";
            if (rx.status === 'CUSTOMER_APPROVED') statusStyle = "bg-teal-50 text-teal-700 border-teal-250";
            if (rx.status === 'REJECTED') statusStyle = "bg-rose-50 text-rose-700 border-rose-250";

            return (
              <div key={rx.prescriptionId} className={`bg-white border rounded-3xl p-5 shadow-sm hover:shadow-premium flex flex-col justify-between transition-all duration-300 relative ${rx.isEmergency ? 'border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-100'}`}>
                
                {/* Emergency Badge */}
                {rx.isEmergency && (
                  <div className="absolute -top-3 -right-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md animate-pulse">
                    Urgent Delivery
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Prescription ID</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-800">{rx.prescriptionId}</span>
                        {rx.isEmergency && <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Urgent</span>}
                      </div>
                    </div>
                    <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 border rounded-lg tracking-wider ${statusStyle}`}>
                      {rx.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer Meta */}
                  <div className="grid grid-cols-2 gap-3 text-xs leading-none">
                    <div className="flex flex-col gap-1">
                      <span className="font-extrabold text-slate-800">{rx.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{rx.patientAge} Years</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="font-bold text-slate-800">{rx.doctorName}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{rx.uploadedDate} • {rx.uploadedTime}</span>
                    </div>
                  </div>

                  {/* Detected Medicines List */}
                  {rx.extractedMedicines && rx.extractedMedicines.length > 0 ? (
                    <div className="flex flex-col gap-2 border-t border-slate-50 pt-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        {rx.extractedMedicines.length} Medicines Found
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {rx.extractedMedicines.slice(0, 3).map((med, i) => (
                          <div key={i} className="flex justify-between items-center text-xs font-semibold text-slate-650">
                            <span className="flex items-center gap-1.5 truncate pr-2">
                              {med.confidenceScore > 80 ? (
                                <FiCheckCircle className="text-emerald-500 shrink-0" />
                              ) : (
                                <FiAlertCircle className="text-amber-500 shrink-0" />
                              )}
                              <span className="truncate">{med.name}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">Conf: {med.confidenceScore}%</span>
                          </div>
                        ))}
                        {rx.extractedMedicines.length > 3 && (
                          <div className="text-[10px] text-[#135A5A] font-bold mt-1 text-center">+{rx.extractedMedicines.length - 3} more medicines</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xs text-slate-405 font-bold uppercase text-center border-t border-slate-50 pt-4">
                      {rx.status === 'NEW' ? 'AI Extraction Pending' : 'No medicines extracted'}
                    </div>
                  )}

                </div>

                {/* Card Actions Bottom Row */}
                <div className="grid grid-cols-4 gap-2 border-t border-slate-50 pt-4 mt-4">
                  <button 
                    onClick={() => handleOpenDrawer(rx, 'view')}
                    className="col-span-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-150 transition-all cursor-pointer"
                  >
                    View RX
                  </button>
                  <button 
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                    className="col-span-1 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    WhatsApp
                  </button>
                  
                  {rx.status === 'NEW' && (
                    <button 
                      onClick={() => handleOpenDrawer(rx, 'review')}
                      className="col-span-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Process AI
                    </button>
                  )}

                  {['AI_PROCESSED', 'UNDER_REVIEW'].includes(rx.status) && (
                    <button 
                      onClick={() => handleOpenDrawer(rx, 'review')}
                      className="col-span-2 py-2.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-premium"
                    >
                      Review Medicines
                    </button>
                  )}

                  {rx.status === 'QUOTE_SENT' && (
                    <button 
                      className="col-span-2 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-default"
                    >
                      Waiting Approval
                    </button>
                  )}

                  {rx.status === 'CUSTOMER_APPROVED' && (
                    <button 
                      className="col-span-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border border-emerald-200"
                    >
                      Generate Order
                    </button>
                  )}

                  {['ORDER_CREATED', 'REJECTED'].includes(rx.status) && (
                    <button 
                      disabled
                      className="col-span-2 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-not-allowed opacity-60"
                    >
                      Closed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredPrescriptions.length === 0 && (
            <div className="col-span-full bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 font-semibold shadow-sm">
              No prescriptions in this tab matching your search.
            </div>
          )}
        </div>
      )}

      {/* 6. RIGHT SIDE DRAWER: PRESCRIPTION DETAILS & MATCHING */}
      {isDrawerOpen && currentRx && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={handleCloseDrawer}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-premium flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  {drawerMode === 'review' ? 'Review & Match Medicine' : 'Prescription Details'}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold">Rx ID: {currentRx.prescriptionId} • Customer: {currentRx.customerName}</span>
              </div>
              <button 
                onClick={handleCloseDrawer}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-450 transition-colors border-0 bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              
              {/* Section 1: Prescription Preview & Validation */}
              <div className="flex flex-col gap-4">
                
                {/* Image Viewer */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Original Prescription</span>
                    <div className="flex gap-1">
                      <button onClick={() => setImgZoom(z => Math.max(0.5, z - 0.25))} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 text-xs font-black cursor-pointer">-</button>
                      <button onClick={() => setImgZoom(z => Math.min(3, z + 0.25))} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 text-xs font-black cursor-pointer">+</button>
                      <button onClick={() => setImgRotation(r => r + 90)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 text-[9px] uppercase font-black cursor-pointer ml-1">Rotate</button>
                    </div>
                  </div>
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-1.5 h-[220px] relative">
                    <div className="overflow-auto w-full h-full flex items-center justify-center">
                      <img 
                        src={currentRx.prescriptionImage} 
                        alt="Prescription" 
                        style={{ transform: `scale(${imgZoom}) rotate(${imgRotation}deg)`, transition: 'transform 0.2s ease-in-out' }}
                        className="max-w-full max-h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                  <button className="w-full py-1.5 text-[9px] font-black uppercase tracking-wider text-[#135A5A] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer text-center">
                    Download PDF
                  </button>
                </div>

                {/* Validation System */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-1.5">System Validation Checks</span>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-1.5">
                      {currentRx.validation?.doctorSignature ? <FiCheckCircle className="text-emerald-500 text-[10px]" /> : <FiAlertCircle className="text-rose-500 text-[10px]" />}
                      <span className="text-[10px] font-bold text-slate-700">Doctor Signature</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {currentRx.validation?.doctorRegNo ? <FiCheckCircle className="text-emerald-500 text-[10px]" /> : <FiAlertCircle className="text-rose-500 text-[10px]" />}
                      <span className="text-[10px] font-bold text-slate-700 truncate" title={currentRx.validation?.doctorRegNo}>Reg: {currentRx.validation?.doctorRegNo || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {currentRx.validation?.imageQuality === 'Good' ? <FiCheckCircle className="text-emerald-500 text-[10px]" /> : <FiAlertCircle className="text-rose-500 text-[10px]" />}
                      <span className="text-[10px] font-bold text-slate-700">Quality: {currentRx.validation?.imageQuality || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-emerald-500 text-[10px]" />
                      <span className="text-[10px] font-bold text-slate-700">Age: {currentRx.validation?.prescriptionAge || 'N/A'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section 2: AI Extraction Results */}
              {currentRx.extractedMedicines.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">AI Extraction Result & Catalog Matching</span>
                  
                  <div className="flex flex-col gap-4">
                    {currentRx.extractedMedicines.map((med, idx) => {
                      const draft = matchingDraft[idx] || {};
                      const matchedItem = STORE_CATALOG.find(item => item.id === draft.matchedMedicineId);
                      
                      return (
                        <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col gap-3">
                          
                          {/* AI Detection Info Row */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8.5px] text-slate-400 font-black uppercase">AI Detected</span>
                              <h4 className="text-xs font-black text-slate-805 mt-0.5">{med.name}</h4>
                              <span className="text-[10px] text-slate-400 font-semibold">Qty Detected: {med.quantity || 10}</span>
                            </div>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md font-bold font-mono">
                              Conf: {med.confidenceScore || 98}%
                            </span>
                          </div>

                          {/* Medicine Matching system layout */}
                          {draft.confirmed ? (
                            <div className="bg-white border border-teal-200/50 p-3 rounded-xl flex justify-between items-center">
                              <div className="flex items-center gap-2.5">
                                <FiCheckCircle className="text-emerald-500 text-lg" />
                                <div>
                                  <span className="text-[8px] text-slate-400 font-black uppercase">Catalog Match</span>
                                  <h5 className="text-[11px] font-extrabold text-slate-850">{matchedItem?.name}</h5>
                                  <span className="text-[9px] text-[#135A5A] font-bold font-mono">{draft.variantId} • ₹{matchedItem ? matchedItem.price : 0}</span>
                                </div>
                              </div>
                              {drawerMode === 'review' && (
                                <button 
                                  onClick={() => handleChangeMedicine(idx)}
                                  className="text-[9px] font-black uppercase text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent"
                                >
                                  Change
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 mt-1.5 border-t border-slate-200/60 pt-3">
                              {med.confidenceScore < 80 && (
                                <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg mb-1">
                                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5 mb-1">
                                    <FiAlertCircle /> Low Confidence Match
                                  </span>
                                  <p className="text-[9.5px] font-semibold text-amber-900 leading-tight">
                                    The AI is unsure about '{med.name}'. Please verify manually.
                                  </p>
                                  {med.alternatives?.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-1.5">
                                      <span className="text-[8.5px] font-bold uppercase text-amber-700">Suggested Alternatives:</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {med.alternatives.map(altId => {
                                          const altItem = STORE_CATALOG.find(c => c.id === altId);
                                          return altItem ? (
                                            <button 
                                              key={altId}
                                              onClick={() => handleDraftMatchChange(idx, 'matchedMedicineId', altId)}
                                              className="px-2 py-1 bg-white border border-amber-200 hover:border-amber-400 text-amber-800 text-[9px] font-bold rounded cursor-pointer transition-colors"
                                            >
                                              {altItem.name}
                                            </button>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <span className="text-[8.5px] font-black uppercase text-[#135A5A] tracking-wider">Match With Catalog Medicine</span>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-bold text-slate-400 uppercase">Catalog Dropdown</label>
                                  <select 
                                    value={draft.matchedMedicineId} 
                                    onChange={(e) => handleDraftMatchChange(idx, 'matchedMedicineId', e.target.value)}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none"
                                  >
                                    {STORE_CATALOG.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                                  </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-bold text-slate-400 uppercase">Select Variant</label>
                                  <select 
                                    value={draft.variantId} 
                                    onChange={(e) => handleDraftMatchChange(idx, 'variantId', e.target.value)}
                                    className="p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none"
                                  >
                                    {matchedItem?.variants.map(v => <option key={v} value={v}>{v}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-1 text-[10px] bg-slate-100 p-2 rounded-lg">
                                <span className="text-slate-500 font-semibold">
                                  Inventory: <strong className={matchedItem?.stock === 0 ? 'text-rose-500' : 'text-emerald-600'}>{matchedItem ? `${matchedItem.stock} Units Available` : 'N/A'}</strong>
                                </span>
                                <div className="flex gap-2">
                                  <span className="text-slate-400 font-bold">MRP: ₹{matchedItem?.price || 0}</span>
                                  <span className="text-slate-400 font-bold">Exp: Oct 2026</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleConfirmMatch(idx)}
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer mt-1"
                              >
                                Confirm Match
                              </button>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Quote Builder & Cart Preview */}
              {cartSummary.items.length > 0 && (
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-150 pb-1.5">Quote Builder</span>
                  
                  <div className="flex flex-col gap-2">
                    {cartSummary.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-extrabold block text-slate-800">{item.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono font-bold">Qty: {item.qty} • {item.variant}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 border-t border-slate-200/60 pt-3 mt-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>Items Subtotal</span>
                      <span className="font-mono text-slate-700">₹{cartSummary.subtotal}</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-2">
                        Delivery Charge
                        {drawerMode === 'review' && (
                          <input 
                            type="number" 
                            value={deliveryCharge} 
                            onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                            className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right bg-white text-slate-800 outline-none" 
                            min="0"
                          />
                        )}
                      </span>
                      {drawerMode !== 'review' && <span className="font-mono text-slate-700">₹{deliveryCharge}</span>}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-2">
                        Discount Amount
                        {drawerMode === 'review' && (
                          <input 
                            type="number" 
                            value={discountAmount} 
                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                            className="w-16 px-2 py-0.5 border border-slate-200 rounded text-right bg-white text-rose-600 outline-none" 
                            min="0"
                          />
                        )}
                      </span>
                      {drawerMode !== 'review' && <span className="font-mono text-rose-500">-₹{discountAmount}</span>}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-2.5 mt-1 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-900 uppercase">Total Quote</span>
                    <span className="text-sm font-black text-[#135A5A] font-mono">₹{cartSummary.total}</span>
                  </div>
                </div>
              )}

              {/* Section 4: Customer Flow Pipeline */}
              {currentRx.status !== 'REJECTED' && (
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Customer Flow Status</span>
                  
                  <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-wider gap-1">
                    <div className="flex flex-col items-center flex-1 text-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 text-xs border ${
                        ['AI_PARSED', 'REVIEW_REQUIRED', 'MEDICINE_MATCHED', 'CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(currentRx.status)
                          ? 'bg-[#135A5A] text-white border-[#135A5A]' : 'bg-white text-slate-400 border-slate-200'
                      }`}>✓</div>
                      <span>Matched</span>
                    </div>
                    <div className="h-0.5 bg-slate-200 flex-1 mb-4" />
                    <div className="flex flex-col items-center flex-1 text-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 text-xs border ${
                        ['CUSTOMER_CART_UPDATED', 'ORDER_CREATED'].includes(currentRx.status)
                          ? 'bg-[#135A5A] text-white border-[#135A5A]' : 'bg-white text-slate-400 border-slate-200'
                      }`}>✓</div>
                      <span>Cart Updated</span>
                    </div>
                    <div className="h-0.5 bg-slate-200 flex-1 mb-4" />
                    <div className="flex flex-col items-center flex-1 text-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 text-xs border ${
                        ['ORDER_CREATED'].includes(currentRx.status)
                          ? 'bg-[#135A5A] text-white border-[#135A5A]' : 'bg-white text-slate-400 border-slate-200'
                      }`}>✓</div>
                      <span>Ordered</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            {drawerMode === 'review' && cartSummary.items.length > 0 && (
              <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
                <button 
                  onClick={handleCloseDrawer}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-100 text-slate-650 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendToCustomer}
                  className="flex-1 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-premium border-0"
                >
                  Send Matched Medicines
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 7. REJECT PRESCRIPTION MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1.5px]">
          <div className="bg-white border border-slate-105 rounded-[32px] p-6 max-w-sm w-full mx-4 shadow-premium flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-sm font-black text-slate-850 uppercase tracking-wider">Reject Prescription Upload</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Provide a clear rejection reason for patient feedback.</p>
            </div>

            <div className="flex flex-col gap-3">
              {['Invalid prescription format', 'Image is too blurry', 'Medicine out of stock', 'Prescription expired (>6 months)', 'Requires doctor consultation', 'Other'].map(reason => (
                <label key={reason} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100/50">
                  <input 
                    type="radio" 
                    name="rejectReason" 
                    value={reason} 
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-[#135A5A] focus:ring-[#135A5A]/20 cursor-pointer"
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
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0"
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
