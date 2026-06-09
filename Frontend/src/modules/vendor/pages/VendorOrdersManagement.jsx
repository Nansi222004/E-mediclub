import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateOrderStatus } from '../store/vendorSlice';
import Logo from '../../../shared/components/Logo';
import { 
  FiShoppingBag, FiFileText, FiPrinter, FiTruck, FiCheckCircle, 
  FiClock, FiSearch, FiSliders, FiMapPin, FiUser, FiPhone, FiPackage, 
  FiChevronDown, FiXCircle, FiTrendingUp, FiCreditCard 
} from 'react-icons/fi';

export default function VendorOrdersManagement() {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.vendor);
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Status list
  const TABS = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

  // Toggle order cards expand/collapse
  const toggleExpandOrder = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(id);
    }
  };

  const handleOpenInvoice = (e, order) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleUpdateStatus = (e, orderId, status) => {
    e.stopPropagation();
    dispatch(updateOrderStatus({ orderId, status }));
  };

  // Filters & Search
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        ord.id.toLowerCase().includes(q) || 
        ord.customerName.toLowerCase().includes(q) ||
        ord.items.toLowerCase().includes(q);

      const matchesTab = statusTab === 'all' || ord.status === statusTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, statusTab]);

  // Color helper for badges
  const getStatusBadgeStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': 
        return 'bg-gold-light/20 text-gold-dark border-gold/10';
      case 'confirmed': 
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'packed': 
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'shipped': 
        return 'bg-teal-light/20 text-teal border-teal/10';
      case 'delivered': 
        return 'bg-teal-light/20 text-teal border-teal/10';
      case 'cancelled': 
        return 'bg-coral-light/20 text-coral border-coral/10';
      default: 
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  // Helper to count medicines in a text list
  const getMedicineCount = (itemsText) => {
    if (!itemsText) return 0;
    return itemsText.split(',').reduce((acc, current) => {
      const parts = current.split('x');
      const qty = parts[1] ? Number(parts[1].trim()) : 1;
      return acc + qty;
    }, 0);
  };

  // Order state tracking sequence
  const trackingSequence = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-5 overflow-hidden">
      
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Store Orders Log</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Verify prescriptions, update dispatches step-by-step, and print receipts.
          </p>
        </div>
      </div>

      {/* Stepper Tabs Bar */}
      <section className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm shrink-0 flex flex-col gap-4">
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Patient, Medicine..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
          />
        </div>

        {/* Horizontal scroll tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setStatusTab(tab); setExpandedOrderId(null); }}
              className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap tap-scale
                ${statusTab === tab 
                  ? 'bg-teal text-white shadow-premium' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </section>

      {/* Expandable Cards List (Internally Scrollable Viewport) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 font-semibold shadow-sm flex flex-col items-center justify-center gap-2">
              <FiShoppingBag className="text-3xl text-slate-350" />
              <span>No orders found matching your search.</span>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const isExpanded = expandedOrderId === ord.id;
              const medCount = getMedicineCount(ord.items);
              const badgeStyle = getStatusBadgeStyles(ord.status);
              
              return (
                <motion.div
                  key={ord.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  onClick={() => toggleExpandOrder(ord.id)}
                  className={`bg-white border rounded-3xl transition-all shadow-sm cursor-pointer overflow-hidden flex flex-col hover:border-slate-300
                    ${isExpanded ? 'border-teal/30 ring-1 ring-teal/5' : 'border-slate-100'}`}
                >
                  
                  {/* Card Header Summary */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Order Id */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Order ID</span>
                        <span className="text-xs font-black text-slate-800 tracking-wide">#{ord.id}</span>
                      </div>

                      {/* Customer Info */}
                      <div className="border-l border-slate-100 pl-3">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Patient</span>
                        <span className="text-xs font-extrabold text-slate-700">{ord.customerName}</span>
                      </div>

                      {/* Items quantity */}
                      <div className="border-l border-slate-100 pl-3">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Medicines</span>
                        <span className="text-xs font-extrabold text-slate-750">{medCount} items</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                      
                      {/* Date & total */}
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{ord.date}</span>
                        <span className="text-xs font-black text-slate-800">₹{ord.totalAmount.toLocaleString()}</span>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border ${badgeStyle}`}>
                          {ord.status}
                        </span>
                        
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400"
                        >
                          <FiChevronDown />
                        </motion.div>
                      </div>

                    </div>

                  </div>

                  {/* Expandable Segment */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 flex flex-col gap-6"
                      >
                        
                        {/* 1. Customer details and medicines grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Column 1: Patient Details */}
                          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3 text-xs">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-2">
                              Patient Coordinates
                            </span>
                            
                            <div className="flex flex-col gap-2">
                              <span className="flex items-center gap-2 text-slate-600 font-medium">
                                <FiUser className="text-teal text-sm shrink-0" />
                                <span>{ord.customerName}</span>
                              </span>
                              <span className="flex items-center gap-2 text-slate-600 font-medium">
                                <FiPhone className="text-teal text-sm shrink-0" />
                                <span>{ord.phone}</span>
                              </span>
                              <span className="flex items-start gap-2 text-slate-600 font-medium leading-relaxed">
                                <FiMapPin className="text-teal text-sm shrink-0 mt-0.5" />
                                <span>{ord.address}</span>
                              </span>
                              <span className="flex items-center gap-2 text-slate-600 font-semibold border-t border-slate-50 pt-2">
                                <FiCreditCard className="text-teal text-sm shrink-0" />
                                <span>Pay Status: <span className="text-teal font-extrabold uppercase text-[10px]">{ord.paymentStatus}</span> ({ord.paymentMethod})</span>
                              </span>
                            </div>
                          </div>

                          {/* Column 2: Prescribed Items */}
                          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3 text-xs lg:col-span-2">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-2">
                              Prescribed Items Breakdown
                            </span>

                            <div className="flex flex-col gap-2.5 divide-y divide-slate-50">
                              {ord.items.split(',').map((it, idx) => {
                                const parts = it.trim().split('x');
                                const name = parts[0].trim();
                                const qty = parts[1] ? parts[1].trim() : '1';
                                return (
                                  <div key={idx} className={`flex justify-between items-center ${idx > 0 && 'pt-2.5'}`}>
                                    <div className="flex items-center gap-2 font-medium">
                                      <FiPackage className="text-slate-400" />
                                      <span className="font-extrabold text-slate-800">{name}</span>
                                    </div>
                                    <div className="text-right text-xs">
                                      <span className="text-slate-500 font-bold">Qty: {qty}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1.5">
                              <button
                                onClick={(e) => handleOpenInvoice(e, ord)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <FiFileText /> View Invoice Receipt
                              </button>
                              <div className="text-right font-black text-slate-800">
                                <span>Total Paid: </span>
                                <span className="text-base text-teal">₹{ord.totalAmount}</span>
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* 2. Timeline Stepper */}
                        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-2 flex items-center gap-1">
                            <FiTrendingUp className="text-teal" /> Chronological Delivery Tracking Stepper
                          </span>

                          <div className="relative pl-6 flex flex-col gap-4 border-l-2 border-slate-100">
                            {/* If order is cancelled, show only cancelled timeline */}
                            {ord.status === 'cancelled' ? (
                              <div className="relative">
                                <span className="absolute -left-[31px] top-0.5 p-1 bg-coral text-white rounded-full"><FiXCircle className="text-2xs" /></span>
                                <div className="text-xs">
                                  <span className="font-extrabold text-coral block text-[10px] uppercase">Cancelled</span>
                                  <span className="text-[9px] text-slate-400 font-semibold">{ord.date}</span>
                                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">This order was cancelled by the merchant due to stock deficits or invalid coordinates.</p>
                                </div>
                              </div>
                            ) : (
                              ord.timeline?.map((step, idx) => (
                                <div key={idx} className="relative">
                                  <span className="absolute -left-[31px] top-0.5 p-1 bg-teal text-white rounded-full"><FiCheckCircle className="text-[10px]" /></span>
                                  <div className="text-xs">
                                    <span className="font-extrabold text-slate-800 block text-[10px] uppercase">{step.status}</span>
                                    <span className="text-[9px] text-slate-400 font-semibold">{step.time}</span>
                                    <p className="text-[10.5px] text-slate-550 mt-1 leading-relaxed">{step.description}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* 3. Quick Actions State Triggers */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-2 shrink-0">
                          <div>
                            {ord.deliveryPartner && (
                              <div className="text-2xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <FiTruck className="text-teal" /> Assigned: <span className="font-extrabold text-slate-700">{ord.deliveryPartner}</span> (Express Logistics)
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2.5">
                            
                            {ord.status === 'pending' && (
                              <>
                                <button 
                                  onClick={(e) => handleUpdateStatus(e, ord.id, 'confirmed')}
                                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer tap-scale"
                                >
                                  Confirm Prescription
                                </button>
                                <button 
                                  onClick={(e) => handleUpdateStatus(e, ord.id, 'cancelled')}
                                  className="px-4 py-2 bg-coral-light/20 hover:bg-coral-light/50 text-coral border border-coral/10 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer tap-scale"
                                >
                                  Cancel Order
                                </button>
                              </>
                            )}

                            {ord.status === 'confirmed' && (
                              <button 
                                onClick={(e) => handleUpdateStatus(e, ord.id, 'packed')}
                                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200/50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer tap-scale"
                              >
                                Mark Packed
                              </button>
                            )}

                            {ord.status === 'packed' && (
                              <button 
                                onClick={(e) => handleUpdateStatus(e, ord.id, 'shipped')}
                                className="px-4 py-2 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-teal-dark shadow-sm transition-colors cursor-pointer tap-scale flex items-center gap-1"
                              >
                                <FiTruck /> Dispatch to Courier (Ship)
                              </button>
                            )}

                            {ord.status === 'shipped' && (
                              <button 
                                onClick={(e) => handleUpdateStatus(e, ord.id, 'delivered')}
                                className="px-4 py-2 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-teal-dark shadow-sm transition-colors cursor-pointer tap-scale flex items-center gap-1"
                              >
                                <FiCheckCircle /> Mark Delivered
                              </button>
                            )}

                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* 4. Invoice Sheet Modal (Styled Printable Receipt) */}
      <AnimatePresence>
        {showInvoiceModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-2xl w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col justify-between"
            >
              
              <div id="invoice-sheet" className="p-4 sm:p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-5">
                
                {/* Header branding */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div className="flex flex-col gap-1">
                    <Logo showText={true} />
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">MedPlus Wellness Pharmacy & Retailers</span>
                  </div>
                  <div className="text-right">
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-wide leading-none">RETAIL INVOICE</h3>
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 block uppercase tracking-wider">OD: #{selectedOrder.id}</span>
                  </div>
                </div>

                {/* Patient metadata */}
                <div className="grid grid-cols-2 gap-4 text-2xs font-semibold text-slate-600">
                  <div className="flex flex-col gap-1 border-r border-slate-200 pr-4">
                    <span className="text-slate-400 font-black uppercase tracking-wider">Billed To</span>
                    <span className="font-extrabold text-slate-800 text-xs mt-0.5">{selectedOrder.customerName}</span>
                    <span className="text-[10px]">{selectedOrder.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <span className="text-slate-400 font-black uppercase tracking-wider">Shipping Address</span>
                    <p className="text-[10px] leading-relaxed mt-0.5 text-slate-600">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Items breakdowns */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-2">
                  <div className="grid grid-cols-12 bg-slate-100 text-[8px] font-black uppercase tracking-widest p-2 border-b border-slate-200 text-slate-400">
                    <span className="col-span-7 pl-2">Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-3 text-right pr-2">Total</span>
                  </div>
                  
                  <div className="flex flex-col text-2xs font-bold text-slate-700 divide-y divide-slate-100">
                    {selectedOrder.items.split(',').map((it, index) => {
                      const parts = it.trim().split('x');
                      const name = parts[0].trim();
                      const qty = parts[1] ? parts[1].trim() : '1';
                      return (
                        <div key={index} className="grid grid-cols-12 p-3 font-medium">
                          <span className="col-span-7 pl-2 font-black text-slate-800">{name}</span>
                          <span className="col-span-2 text-center">{qty}</span>
                          <span className="col-span-3 text-right pr-2">Calculated</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total calculations */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4.5 mt-2 font-black text-xs text-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Order Date: {selectedOrder.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-black uppercase text-[10px]">Net Paid:</span>
                    <span className="text-base text-teal">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-50 pt-5">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                >
                  Close Invoice
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1.5 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                >
                  <FiPrinter /> Print Invoice
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
