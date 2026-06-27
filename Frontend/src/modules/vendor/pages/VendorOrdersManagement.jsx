import { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, FiClock, FiActivity, FiCheckCircle, FiXCircle, FiRefreshCw, FiDollarSign, 
  FiSearch, FiSliders, FiCalendar, FiDownload, FiUser, FiPackage, FiFileText, FiEye, FiEdit, FiShield
} from 'react-icons/fi';
import { mockOrders, getTodayOrders, getPendingOrders, getOrderSummary } from './pharmacyVendorMockData';
const getStrength = (name) => {
  const match = name.match(/(\d+\s*(?:mg|mcg|g|ml|tab|caps))/i);
  return match ? match[0] : '500mg';
};

const calculateOrderDetails = (order) => {
  if (!order || !order.products) {
    return { subtotal: 0, discount: 0, deliveryCharge: 0, grandTotal: 0 };
  }
  const subtotal = order.products.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const discount = order.discount || 0;
  const deliveryCharge = order.deliveryCharge !== undefined ? order.deliveryCharge : (subtotal > 500 ? 0 : 50);
  const grandTotal = subtotal + deliveryCharge - discount;
  return { subtotal, discount, deliveryCharge, grandTotal };
};

const isStepCompleted = (stepName, order) => {
  if (!order) return false;
  if (order.status === 'Cancelled') return false;
  
  switch (stepName) {
    case 'Order Placed':
      return true;
      
    case 'Prescription Verified':
      if (!order.prescriptionRequired) return true;
      return order.prescriptionStatus === 'Verified' || order.prescriptionStatus === 'Verified & Approved';
      
    case 'Order Accepted':
      return [
        'Accepted Orders', 'Processing', 'Ready for Dispatch', 'Out for Delivery', 'Delivered'
      ].includes(order.status);
      
    case 'Packed':
      return [
        'Processing', 'Ready for Dispatch', 'Out for Delivery', 'Delivered'
      ].includes(order.status);
      
    case 'Ready for Dispatch':
      return [
        'Ready for Dispatch', 'Out for Delivery', 'Delivered'
      ].includes(order.status);
      
    case 'Out for Delivery':
      return [
        'Out for Delivery', 'Delivered'
      ].includes(order.status);
      
    case 'Delivered':
      return order.status === 'Delivered';
      
    default:
      return false;
  }
};

const FULFILLMENT_STEPS = [
  { name: 'Order Placed', statusKey: 'Order Placed' },
  { name: 'Prescription Verified', statusKey: 'Prescription Verified' },
  { name: 'Order Accepted', statusKey: 'Accepted Orders' },
  { name: 'Packed', statusKey: 'Processing' },
  { name: 'Ready for Dispatch', statusKey: 'Ready for Dispatch' },
  { name: 'Out for Delivery', statusKey: 'Out for Delivery' },
  { name: 'Delivered', statusKey: 'Delivered' }
];

const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function VendorOrdersManagement() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const statusParam = searchParams.get('status');

  const initialOrders = useMemo(() => {
    return mockOrders;
  }, []);

  // 2. Active States
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('New Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState('');

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Medicine unavailable');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset pagination on filter or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filterParam, statusParam]);

  // Sync activeTab with sidebar sub-routes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/orders/new')) {
      setActiveTab('New Orders');
    } else if (path.includes('/orders/processing')) {
      setActiveTab('Processing');
    } else if (path.includes('/orders/ready')) {
      setActiveTab('Ready for Dispatch');
    } else if (path.includes('/orders/delivered')) {
      setActiveTab('Delivered');
    } else if (path.includes('/orders/cancelled')) {
      setActiveTab('Cancelled');
    } else if (path.includes('/orders/returns')) {
      setActiveTab('Returns');
    } else if (path.includes('/orders/refunds')) {
      setActiveTab('Refund Requests');
    }
  }, [location]);

  // Sync activeTab with status query parameter (from dashboard Order Summary click)
  useEffect(() => {
    if (statusParam === 'new') {
      setActiveTab('New Orders');
    } else if (statusParam === 'processing') {
      setActiveTab('Processing');
    } else if (statusParam === 'ready-dispatch') {
      setActiveTab('Ready for Dispatch');
    } else if (statusParam === 'delivered') {
      setActiveTab('Delivered');
    } else if (statusParam === 'cancelled') {
      setActiveTab('Cancelled');
    } else if (statusParam === 'returns') {
      setActiveTab('Returns');
    } else if (statusParam === 'refunds') {
      setActiveTab('Refund Requests');
    }
  }, [statusParam]);

  // Filters state
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [rxFilter, setRxFilter] = useState('All');

  // Lifecycles categories
  const tabs = [
    'New Orders',
    'Accepted Orders',
    'Processing',
    'Ready for Dispatch',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returns',
    'Replacement Requests',
    'Refund Requests'
  ];

  // 3. Compute Metrics Dashboard counts dynamically
  const metrics = useMemo(() => {
    return {
      today: getTodayOrders(orders).length,
      pending: getPendingOrders(orders).length,
      processing: orders.filter(o => o.status === 'Processing').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      returns: orders.filter(o => o.status === 'Returns').length,
      replacements: orders.filter(o => o.status === 'Replacement Requests').length,
      refunds: orders.filter(o => o.status === 'Refund Requests').length,
      revenue: orders.filter(o => o.status === 'Delivered' || o.paymentStatus === 'Paid').reduce((acc, curr) => acc + calculateOrderDetails(curr).grandTotal, 0)
    };
  }, [orders]); // If a status parameter or date parameter is passed, we check using the helpers.

  // 4. Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // If statusParam is 'pending', we filter for pending orders
      if (statusParam === 'pending') {
        const pendingList = getPendingOrders(orders);
        if (!pendingList.some(o => o.id === order.id)) return false;
      } else {
        // Tab matching
        if (order.status !== activeTab) return false;
      }

      // If filterParam is 'today', we filter for today's orders
      if (filterParam === 'today') {
        const todayList = getTodayOrders(orders);
        if (!todayList.some(o => o.id === order.id)) return false;
      }

      // Search matching
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      // Date matching
      const matchesDate = !dateFilter || order.orderDate === dateFilter;

      // Payment matching
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;

      // Rx matching
      const matchesRx = rxFilter === 'All' || 
        (rxFilter === 'Required' && order.prescriptionRequired) || 
        (rxFilter === 'Not Required' && !order.prescriptionRequired);

      return matchesSearch && matchesDate && matchesPayment && matchesRx;
    });
  }, [orders, activeTab, searchQuery, dateFilter, paymentFilter, rxFilter, filterParam, statusParam]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  // 5. Actions / State mutations
  const handleUpdateStatus = (id, newStatus, extraData = {}) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const updatedTimeline = [
          ...o.timeline,
          { time: timeNow, status: newStatus, description: `Status changed to ${newStatus}` }
        ];
        const updatedOrder = {
          ...o,
          status: newStatus,
          timeline: updatedTimeline,
          ...extraData
        };
        // Synchronize selected order if drawer is open
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return o;
    }));
  };

  const triggerRejectModal = (id) => {
    setRejectOrderId(id);
    setRejectReason('Medicine unavailable');
    setCustomRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    const finalReason = rejectReason === 'Other' ? (customRejectReason.trim() || 'Other') : rejectReason;
    handleUpdateStatus(rejectOrderId, 'Cancelled', { cancellationReason: finalReason, cancelledBy: 'Store' });
    setShowRejectModal(false);
    setRejectOrderId(null);
    setCustomRejectReason('');
    if (selectedOrder && selectedOrder.id === rejectOrderId) {
      closeDrawer();
    }
  };

  const handleSaveInternalNote = (id) => {
    if (!internalNoteInput.trim()) return;
    const newNote = {
      text: internalNoteInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const notes = Array.isArray(o.internalNotes) ? o.internalNotes : (o.internalNotes ? [{ text: o.internalNotes, timestamp: 'Older' }] : []);
        return {
          ...o,
          internalNotes: [...notes, newNote]
        };
      }
      return o;
    }));

    setSelectedOrder(prev => {
      const notes = Array.isArray(prev.internalNotes) ? prev.internalNotes : (prev.internalNotes ? [{ text: prev.internalNotes, timestamp: 'Older' }] : []);
      return {
        ...prev,
        internalNotes: [...notes, newNote]
      };
    });

    setInternalNoteInput('');
  };

  const handleExportOrders = () => {
    const dataString = JSON.stringify(orders.filter(o => o.status === activeTab), null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${activeTab.toLowerCase().replace(' ', '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 flex flex-col gap-6 overflow-x-hidden">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-150 pb-4 gap-4 shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-805 leading-none">Orders Control Tower</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Pan-India Healthcare Seller Portal • Fulfillment, Prescriptions & Customer Support.
          </p>
        </div>
        <button 
          onClick={handleExportOrders}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm self-start md:self-auto"
        >
          <FiDownload />
          <span>Export {activeTab}</span>
        </button>
      </div>

      {/* 2. Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3 shrink-0">
        {[
          { label: "Today's Orders", val: metrics.today, icon: FiShoppingBag, color: 'text-teal bg-teal-50 border-teal-100', tab: 'New Orders', params: { filter: 'today' } },
          { label: "Pending Orders", val: metrics.pending, icon: FiClock, color: 'text-amber-600 bg-amber-50 border-amber-100', tab: 'New Orders', params: { status: 'pending' } },
          { label: "Processing", val: metrics.processing, icon: FiActivity, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', tab: 'Processing' },
          { label: "Delivered", val: metrics.delivered, icon: FiCheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', tab: 'Delivered' },
          { label: "Cancelled", val: metrics.cancelled, icon: FiXCircle, color: 'text-rose-600 bg-rose-50 border-rose-100', tab: 'Cancelled' },
          { label: "Returns", val: metrics.returns, icon: FiRefreshCw, color: 'text-violet-600 bg-violet-50 border-violet-100', tab: 'Returns' },
          { label: "Replacements", val: metrics.replacements, icon: FiRefreshCw, color: 'text-blue-600 bg-blue-50 border-blue-100', tab: 'Replacement Requests' },
          { label: "Refunds", val: metrics.refunds, icon: FiDollarSign, color: 'text-orange-600 bg-orange-50 border-orange-100', tab: 'Refund Requests' },
          { label: "Total Revenue", val: `₹${metrics.revenue.toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'text-white bg-[#135A5A] border-[#0F4A4A]' }
        ].map((m, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (m.tab) {
                setActiveTab(m.tab);
                setSearchParams(m.params || {});
              }
            }}
            className={`border p-3 rounded-2xl flex flex-col justify-between h-20 shadow-sm relative overflow-hidden transition-transform hover:scale-[1.02] ${m.tab ? 'cursor-pointer' : ''} select-none ${m.color}`}
          >
            <span className={`text-[8.5px] font-black uppercase tracking-wider ${idx === 8 ? 'text-teal-100' : 'text-slate-400'}`}>{m.label}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm sm:text-base font-black tracking-tight">{m.val}</span>
              <m.icon className={`text-lg shrink-0 ${idx === 8 ? 'text-teal-150' : 'opacity-80'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Global Filters Panel */}
      <div className="bg-white border border-slate-100 p-4.5 rounded-3xl shadow-sm flex flex-col gap-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-50 pb-2.5 gap-2">
          <span className="text-xs font-black text-slate-805 uppercase tracking-widest flex items-center gap-1.5">
            <FiSliders className="text-[#135A5A]" /> Advanced Filters
          </span>
          <button 
            onClick={() => {
              setSearchQuery('');
              setDateFilter('');
              setPaymentFilter('All');
              setRxFilter('All');
            }}
            className="text-[9.5px] font-black text-rose-500 hover:underline cursor-pointer border-0 bg-transparent uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Search bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search ID, Customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
          </div>

          {/* Date range filter */}
          <div className="relative">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] transition-colors"
            />
            <FiCalendar className="absolute left-3 top-3 text-slate-400" />
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] appearance-none"
            >
              <option value="All">Payment Status: All</option>
              <option value="Paid">Paid Only</option>
              <option value="Unpaid">Unpaid Only</option>
              <option value="Refunded">Refunded Only</option>
            </select>
          </div>

          {/* Prescription Required Filter */}
          <div className="relative">
            <select
              value={rxFilter}
              onChange={(e) => setRxFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] appearance-none"
            >
              <option value="All">Rx Prescription: All</option>
              <option value="Required">Rx Required</option>
              <option value="Not Required">Rx Not Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tab selection strip */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1.5 border-b border-slate-100 shrink-0">
        {tabs.map(tab => {
          const summary = getOrderSummary(orders);
          let count = orders.filter(o => o.status === tab).length;
          if (tab === 'New Orders') count = summary.newOrders;
          else if (tab === 'Processing') count = summary.processing;
          else if (tab === 'Ready for Dispatch') count = summary.readyToShip;
          else if (tab === 'Delivered') count = summary.delivered;
          else if (tab === 'Cancelled') count = summary.cancelled;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchParams({});
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-0 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab 
                  ? 'bg-[#135A5A] text-white shadow-sm' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-850'
              }`}
            >
              <span>{tab}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                activeTab === tab ? 'bg-white text-[#135A5A]' : 'bg-slate-100 text-slate-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Content Area: Desktop Table vs Mobile Cards */}
      <div className="flex-1 min-h-0">
        
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 font-semibold shadow-sm flex flex-col items-center justify-center gap-2">
            <FiShoppingBag className="text-3xl text-slate-305" />
            <span>No orders listed under {activeTab} matching your filters.</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Order Info</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Details</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Products Ordered</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Prescription Status</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Fulfillment Context</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Total Billing</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Fulfillment Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map(order => (
                      <tr 
                        key={order.id} 
                        onClick={() => openDrawer(order)}
                        className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-[#135A5A] group-hover:underline">#{order.id}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">{order.orderDate} • {order.orderTime}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-slate-800">{order.customerName}</span>
                            <span className="text-[10px] text-slate-450 font-semibold">{order.phone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-semibold text-slate-650 max-w-[200px] truncate">
                            {order.products.map(p => `${p.name} (x${p.qty})`).join(', ')}
                          </div>
                        </td>
                        <td className="p-4">
                          {order.prescriptionRequired ? (
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              order.prescriptionStatus === 'Verified' || order.prescriptionStatus === 'Verified & Approved'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              Rx: {order.prescriptionStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Not Required</span>
                          )}
                        </td>
                        <td className="p-4">
                          {/* Render context based on tab */}
                          {activeTab === 'New Orders' && (
                            <span className="text-xs font-bold text-slate-500 uppercase">{order.paymentMethod}</span>
                          )}
                          {activeTab === 'Accepted Orders' && (
                            <span className="text-xs font-bold text-emerald-600 uppercase">Availability: In Stock</span>
                          )}
                          {activeTab === 'Processing' && (
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#135A5A] h-full" style={{ width: `${order.packingProgress || 50}%` }} />
                            </div>
                          )}
                          {activeTab === 'Ready for Dispatch' && (
                            <div className="flex flex-col text-[10px]">
                              <span className="font-extrabold text-slate-700">Inv: {order.invoiceNumber}</span>
                              <span className="text-slate-400 font-semibold">{order.deliveryPartner}</span>
                            </div>
                          )}
                          {activeTab === 'Out for Delivery' && (
                            <div className="flex flex-col text-[10px]">
                              <span className="font-extrabold text-indigo-600">{order.deliveryStatus}</span>
                              <span className="text-slate-400 font-semibold">ETA: {order.expectedDelivery}</span>
                            </div>
                          )}
                          {activeTab === 'Delivered' && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < (order.customerRating || 5) ? 'text-amber-500' : 'text-slate-200'}`}>★</span>
                              ))}
                            </div>
                          )}
                          {activeTab === 'Cancelled' && (
                            <span className="text-xs font-bold text-rose-500" title={order.cancellationReason}>{order.cancellationReason}</span>
                          )}
                          {activeTab === 'Returns' && (
                            <span className="text-xs font-bold text-slate-600" title={order.returnReason}>{order.returnReason}</span>
                          )}
                          {activeTab === 'Replacement Requests' && (
                            <span className="text-xs font-bold text-slate-600" title={order.replacementReason || 'Item damaged on arrival'}>{order.replacementReason || 'Item damaged on arrival'}</span>
                          )}
                          {activeTab === 'Refund Requests' && (
                            <span className="text-xs font-bold text-slate-600">{order.refundMethod}</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-805">₹{calculateOrderDetails(order).grandTotal.toFixed(2)}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{order.paymentStatus}</span>
                          </div>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center gap-1.5">
                            {activeTab === 'New Orders' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Accepted Orders')}
                                  className="px-2.5 py-1.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer shadow-sm"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => triggerRejectModal(order.id)}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {activeTab === 'Accepted Orders' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Processing')}
                                className="px-3 py-1.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                              >
                                Pack Order
                              </button>
                            )}
                            {activeTab === 'Processing' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Ready for Dispatch', { invoiceNumber: `EMC-INV-${order.id.split('-')[1]}`, deliveryPartner: 'Shadowfax Express', deliveryStatus: 'Pending Pickup' })}
                                className="px-3 py-1.5 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                              >
                                Mark Ready
                              </button>
                            )}
                            {activeTab === 'Ready for Dispatch' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Out for Delivery', { deliveryStatus: 'In Transit', expectedDelivery: '1 Hour' })}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                              >
                                Ship Out
                              </button>
                            )}
                            {activeTab === 'Out for Delivery' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'Delivered', { deliveryDate: '2026-06-17', customerRating: 5 })}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                            {activeTab === 'Returns' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Refund Requests', { returnStatus: 'Approved', refundAmount: calculateOrderDetails(order).grandTotal, refundMethod: 'UPI Wallet', refundStatus: 'Pending Approval' })}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Delivered', { returnStatus: 'Rejected' })}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {activeTab === 'Replacement Requests' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Processing', { replacementStatus: 'Approved' })}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Delivered', { replacementStatus: 'Rejected' })}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {activeTab === 'Refund Requests' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Delivered', { refundStatus: 'Settled', paymentStatus: 'Refunded' })}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors border-0 cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(order.id, 'Delivered', { refundStatus: 'Rejected' })}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  Deny
                                </button>
                              </>
                            )}
                            {['Delivered', 'Cancelled'].includes(activeTab) && (
                              <button 
                                onClick={() => openDrawer(order)}
                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-655 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              >
                                View File
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile App Card-based Layout */}
            <div className="block md:hidden flex flex-col gap-3.5 pb-12">
              {paginatedOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => openDrawer(order)}
                  className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#135A5A]">#{order.id}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{order.orderDate} • {order.orderTime}</span>
                    </div>
                    <span className="bg-teal-50 text-teal border border-teal-100 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-extrabold">
                      <FiUser className="text-[#135A5A] shrink-0" />
                      <span>{order.customerName}</span>
                    </div>
                    <p className="text-slate-500 font-semibold line-clamp-1 pl-5">{order.address}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/50 flex flex-col gap-1 text-[11px] font-bold text-slate-655">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{p.name}</span>
                        <span>x{p.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-0.5">
                    <span className="text-xs font-black text-slate-800">Total: ₹{calculateOrderDetails(order).grandTotal.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(order);
                      }}
                      className="text-[10px] font-black uppercase tracking-wider text-[#135A5A] hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Process Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Pagination Footer */}
            <footer className="border-t border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-b-3xl">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Page {currentPage} of {totalPages} ({filteredOrders.length} items)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={`px-2.5 py-1.5 border border-slate-250/50 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer
                    ${currentPage === 1
                      ? 'bg-slate-50 text-slate-305 pointer-events-none'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={`px-2.5 py-1.5 border border-slate-250/50 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer
                    ${currentPage === totalPages
                      ? 'bg-slate-50 text-slate-305 pointer-events-none'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  Next
                </button>
              </div>
            </footer>
          </>
        )}

      </div>

      {/* 6. Side Drawer / Bottom Sheet for Order Details */}
      <AnimatePresence>
        {isDrawerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end md:items-stretch items-end">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Content Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full md:max-w-lg bg-white h-[92vh] md:h-full rounded-t-3xl md:rounded-t-none shadow-2xl flex flex-col justify-between z-10"
            >
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-150 flex justify-between items-center shrink-0">
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-slate-805">Order details #{selectedOrder.id}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedOrder.status}</span>
                </div>
                <button onClick={closeDrawer} className="text-slate-400 hover:text-slate-600 text-lg p-1 border-0 bg-transparent cursor-pointer">✕</button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 custom-scrollbar pb-12">
                
                {/* Section A: Order Metadata */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-150/50 pb-1.5 flex items-center gap-1">
                    <FiFileText className="text-[#135A5A]" /> Order Metadata
                  </span>
                  <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Order ID</span>
                      <span className="font-extrabold text-slate-800">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Order Status</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-700">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Order Date & Time</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.orderDate} • {selectedOrder.orderTime || '10:00 AM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Payment Mode</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.paymentMethod || 'UPI (Paytm)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Payment Status</span>
                      <span className="font-extrabold text-slate-800 uppercase tracking-wider">{selectedOrder.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Section B: Patient Coordinates */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-150/50 pb-1.5 flex items-center gap-1">
                    <FiUser className="text-[#135A5A]" /> Patient Coordinates
                  </span>
                  <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-655">
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Customer Name</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Contact Number</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-405 font-bold">Delivery Address</span>
                      <span className="leading-relaxed bg-white border border-slate-100 p-2.5 rounded-xl text-slate-705">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                {/* Section C: Products list with images */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    <FiPackage className="text-[#135A5A]" /> Items Breakdown
                  </span>
                  
                  <div className="flex flex-col gap-3">
                    {selectedOrder.products.map((prod, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center gap-3 shadow-2xs">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-850 truncate">{prod.name}</h4>
                          <span className="text-[9.5px] font-black text-[#135A5A] uppercase tracking-wider block mt-0.5">
                            Strength: {getStrength(prod.name)}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-[11px] font-semibold text-slate-405">
                            <span>₹{prod.price} x {prod.qty}</span>
                            <span className="font-black text-slate-700">₹{prod.price * prod.qty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section D: Price calculation details */}
                {(() => {
                  const details = calculateOrderDetails(selectedOrder);
                  return (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 text-xs font-semibold text-slate-650">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Subtotal</span>
                        <span className="text-slate-700">₹{details.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Delivery Charges</span>
                        <span className="text-slate-700">₹{details.deliveryCharge.toFixed(2)}</span>
                      </div>
                      {details.discount > 0 && (
                        <div className="flex justify-between text-rose-500">
                          <span>Discount Applied</span>
                          <span>-₹{details.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-800 text-sm">
                        <span>Total Billing</span>
                        <span className="text-[#135A5A]">₹{details.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Section E: Prescription Verification (If applicable) */}
                {selectedOrder.prescriptionRequired && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5 flex items-center gap-1.5">
                      <FiShield className="text-[#135A5A]" /> Prescription Verification Vault
                    </span>
                    
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 font-bold">Verification Status</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        selectedOrder.prescriptionStatus === 'Verified' || selectedOrder.prescriptionStatus === 'Verified & Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                          : 'bg-amber-50 text-amber-700 border border-amber-250'
                      }`}>
                        {selectedOrder.prescriptionStatus || 'Pending Verification'}
                      </span>
                    </div>

                    {selectedOrder.prescriptionImage ? (
                      <div className="border border-slate-100 rounded-xl overflow-hidden mt-1 relative group">
                        <img 
                          src={selectedOrder.prescriptionImage} 
                          alt="Rx Prescription File" 
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => window.open(selectedOrder.prescriptionImage, '_blank')}
                            className="p-2 bg-white text-slate-800 rounded-full font-black uppercase tracking-wider text-[10px] shadow flex items-center gap-1 cursor-pointer border-0"
                          >
                            <FiEye /> View Full
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-205 rounded-xl p-6 text-center text-xs text-slate-400 font-bold">
                        No prescription uploaded
                      </div>
                    )}

                    {selectedOrder.prescriptionImage && (
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => window.open(selectedOrder.prescriptionImage, '_blank')}
                            className="flex-1 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FiEye /> View Full Prescription
                          </button>
                          <button 
                            onClick={() => downloadFile(selectedOrder.prescriptionImage, `Prescription-${selectedOrder.id}.jpg`)}
                            className="flex-1 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FiDownload /> Download Prescription
                          </button>
                        </div>
                        
                        {selectedOrder.prescriptionStatus !== 'Verified & Approved' && (
                          <div className="flex gap-2 border-t border-slate-100 pt-2.5">
                            <button 
                              onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, { prescriptionStatus: 'Verified & Approved' })}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                            >
                              Approve Prescription
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, { prescriptionStatus: 'Rejected' })}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                            >
                              Reject Prescription
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Section F: Order Timeline Stepper */}
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-4">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5">Fulfillment Timeline</span>
                  <div className="relative pl-5 border-l border-slate-205 flex flex-col gap-4 text-xs">
                    {FULFILLMENT_STEPS.map((step, idx) => {
                      const completed = isStepCompleted(step.name, selectedOrder);
                      const timelineEntry = selectedOrder.timeline.find(t => t.status === step.statusKey);
                      
                      return (
                        <div key={idx} className="relative">
                          <span className={`absolute -left-[25px] top-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                            completed 
                              ? 'bg-[#135A5A] border-[#135A5A]' 
                              : 'bg-white border-slate-300'
                          }`} />
                          <div className="flex flex-col">
                            <span className={`font-extrabold ${completed ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.name} 
                              {!completed && step.name === 'Prescription Verified' && !selectedOrder.prescriptionRequired && ' (Not Required)'}
                            </span>
                            {completed && (
                              <>
                                <span className="text-[9px] text-slate-400 font-semibold">
                                  {timelineEntry ? timelineEntry.time : 'System Done'}
                                </span>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {timelineEntry ? timelineEntry.description : `${step.name} step completed.`}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section G: Internal Notes */}
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    <FiEdit className="text-[#135A5A]" /> Internal Staff Notes
                  </span>
                  
                  <div className="flex flex-col gap-2.5 mt-1 max-h-40 overflow-y-auto pr-1">
                    {(() => {
                      const notesList = Array.isArray(selectedOrder.internalNotes) 
                        ? selectedOrder.internalNotes 
                        : (selectedOrder.internalNotes ? [{ text: selectedOrder.internalNotes, timestamp: 'Older' }] : []);
                      
                      if (notesList.length === 0) {
                        return <span className="text-[11px] text-slate-400 italic">No staff notes added yet.</span>;
                      }
                      
                      return notesList.map((n, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100/70 p-2.5 rounded-xl flex flex-col gap-1 shadow-2xs">
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">{n.text}</p>
                          <span className="text-[9px] text-slate-400 font-bold self-end">{n.timestamp}</span>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  <div className="flex gap-2 border-t border-slate-50 pt-3">
                    <input 
                      type="text" 
                      placeholder="Add internal verification notes..." 
                      value={internalNoteInput}
                      onChange={(e) => setInternalNoteInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#135A5A]"
                    />
                    <button 
                      onClick={() => handleSaveInternalNote(selectedOrder.id)}
                      className="px-3 bg-[#135A5A] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

              </div>

              {/* Drawer Sticky Footer Actions */}
              <div className="p-4 border-t border-slate-150 bg-slate-50 shrink-0 flex flex-col gap-2.5">
                
                <div className="flex flex-col md:flex-row gap-2.5 w-full">
                  {selectedOrder.status === 'New Orders' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'Accepted Orders')}
                        className="flex-1 py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] transition-colors border-0 cursor-pointer shadow-premium"
                      >
                        Accept Order
                      </button>
                      <button 
                        onClick={() => triggerRejectModal(selectedOrder.id)}
                        className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-colors border-0 cursor-pointer shadow-premium"
                      >
                        Reject Order
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'Accepted Orders' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')}
                      className="w-full py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] border-0 cursor-pointer shadow-premium"
                    >
                      Mark as Processing
                    </button>
                  )}

                  {selectedOrder.status === 'Processing' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Ready for Dispatch', { invoiceNumber: `EMC-INV-${selectedOrder.id.split('-')[1]}`, deliveryPartner: 'Shadowfax Express', deliveryStatus: 'Pending Pickup' })}
                      className="w-full py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] border-0 cursor-pointer shadow-premium"
                    >
                      Mark as Ready for Dispatch
                    </button>
                  )}

                  {selectedOrder.status === 'Ready for Dispatch' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Out for Delivery', { deliveryStatus: 'In Transit', expectedDelivery: '1 Hour' })}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                    >
                      Assign Delivery / Mark Out for Delivery
                    </button>
                  )}

                  {selectedOrder.status === 'Out for Delivery' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered', { deliveryDate: '2026-06-17', customerRating: 5 })}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                    >
                      Mark as Delivered
                    </button>
                  )}

                  {selectedOrder.status === 'Delivered' && (
                    <div className="w-full py-3 bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-wider text-center select-none font-bold">
                      ✓ Order Delivered
                    </div>
                  )}

                  {selectedOrder.status === 'Cancelled' && (
                    <div className="w-full py-3 bg-rose-50 border border-rose-250 text-rose-705 rounded-2xl text-xs font-black uppercase tracking-wider text-center select-none font-bold">
                      ✕ Order Cancelled
                    </div>
                  )}

                  {selectedOrder.status === 'Returns' && (
                    <>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Refund Requests', { returnStatus: 'Approved', refundAmount: calculateOrderDetails(selectedOrder).grandTotal, refundMethod: 'UPI Wallet', refundStatus: 'Pending Approval' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Approve Return
                      </button>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Delivered', { returnStatus: 'Rejected' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Reject Return
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'Replacement Requests' && (
                    <>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Processing', { replacementStatus: 'Approved' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Approve Replacement
                      </button>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Delivered', { replacementStatus: 'Rejected' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Reject Replacement
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'Refund Requests' && (
                    <>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Delivered', { refundStatus: 'Settled', paymentStatus: 'Refunded' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Confirm Refund
                      </button>
                      <button 
                        onClick={() => { handleUpdateStatus(selectedOrder.id, 'Delivered', { refundStatus: 'Rejected' }); closeDrawer(); }}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer shadow-premium"
                      >
                        Deny Refund
                      </button>
                    </>
                  )}
                </div>

                <button 
                  onClick={closeDrawer}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-900"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl z-10 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-805">Reject Order</h3>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">Please select a reason for rejecting this order</p>
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                {[
                  'Medicine unavailable',
                  'Prescription invalid',
                  'Delivery not serviceable',
                  'Payment issue',
                  'Other'
                ].map(reason => (
                  <label 
                    key={reason} 
                    className={`flex items-center gap-3 p-3 border rounded-2xl cursor-pointer transition-colors ${
                      rejectReason === reason 
                        ? 'border-[#135A5A] bg-[#135A5A]/5 text-[#135A5A]' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-705'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="rejectReason" 
                      value={reason} 
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                      className="accent-[#135A5A] cursor-pointer"
                    />
                    <span className="text-xs font-bold">{reason}</span>
                  </label>
                ))}
              </div>

              {rejectReason === 'Other' && (
                <textarea 
                  placeholder="Type rejection reason here..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-[#135A5A] h-20 resize-none"
                />
              )}

              <div className="flex gap-2.5 mt-2">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-white border border-slate-250 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmReject}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-colors border-0 cursor-pointer shadow-premium"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
