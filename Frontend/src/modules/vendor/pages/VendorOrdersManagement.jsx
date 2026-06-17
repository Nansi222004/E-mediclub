import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, FiClock, FiActivity, FiCheckCircle, FiXCircle, FiRefreshCw, FiDollarSign, 
  FiSearch, FiSliders, FiCalendar, FiDownload, FiUser, FiPhone, FiMapPin, FiPackage, 
  FiPrinter, FiTruck, FiChevronRight, FiFileText, FiEye, FiPaperclip, FiEdit, FiShield
} from 'react-icons/fi';

export default function VendorOrdersManagement() {
  const location = useLocation();
  // 1. Comprehensive Lifecycle Orders Mock Data
  const [orders, setOrders] = useState([
    {
      id: 'OD-89212',
      customerName: 'Rahul Mehta',
      phone: '+91 98765 43210',
      address: '402, Shiv Shakti Apartments, Link Road, Andheri West, Mumbai - 400053',
      products: [
        { name: 'Amoxicillin 500mg Capsules', qty: 2, price: 180, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=80&q=80' },
        { name: 'Paracetamol 650mg Tablets', qty: 1, price: 40, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'UPI (Paytm)',
      paymentStatus: 'Paid',
      prescriptionRequired: true,
      prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      prescriptionStatus: 'Pending Verification',
      orderDate: '2026-06-17',
      orderTime: '11:45 AM',
      status: 'New Orders',
      totalAmount: 400,
      discount: 20,
      deliveryPartner: '',
      deliveryStatus: '',
      expectedDelivery: '',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: 'Patient mentioned urgent requirement. Please process faster.',
      timeline: [
        { time: '11:45 AM', status: 'Order Placed', description: 'Customer initiated order verification.' }
      ]
    },
    {
      id: 'OD-89211',
      customerName: 'Sara Jacob',
      phone: '+91 87654 32109',
      address: 'Flat 10B, Green Glen Layout, Outer Ring Road, Bengaluru - 560103',
      products: [
        { name: 'Metformin 1000mg Sustained Release', qty: 3, price: 120, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      prescriptionRequired: true,
      prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      prescriptionStatus: 'Verified & Approved',
      productAvailability: 'In Stock',
      orderDate: '2026-06-17',
      orderTime: '10:30 AM',
      status: 'Accepted Orders',
      totalAmount: 360,
      discount: 0,
      deliveryPartner: '',
      deliveryStatus: '',
      expectedDelivery: '',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: '',
      timeline: [
        { time: '10:30 AM', status: 'Order Placed', description: 'Order placed by patient.' },
        { time: '10:50 AM', status: 'Order Accepted', description: 'Store accepted order and verified prescription.' }
      ]
    },
    {
      id: 'OD-89210',
      customerName: 'Karan Singh',
      phone: '+91 76543 21098',
      address: 'C-22, Sector 15, Vasundhara, Noida, Delhi NCR - 201012',
      products: [
        { name: 'Multivitamins Gold Health Pack', qty: 1, price: 950, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=80&q=80' },
        { name: 'Ayush Cough Syrup 100ml', qty: 2, price: 110, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'UPI (GPay)',
      paymentStatus: 'Paid',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      packingProgress: 60,
      productAvailability: 'In Stock',
      orderDate: '2026-06-16',
      orderTime: '08:15 PM',
      status: 'Processing',
      totalAmount: 1170,
      discount: 50,
      deliveryPartner: '',
      deliveryStatus: '',
      expectedDelivery: '',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: 'Packing multivitamin box inside a secure box.',
      timeline: [
        { time: '08:15 PM', status: 'Order Placed', description: 'Order placed by patient.' },
        { time: '08:30 PM', status: 'Order Accepted', description: 'Store accepted order.' },
        { time: '09:00 PM', status: 'Processing Starter', description: 'Warehouse initiated packing workflow.' }
      ]
    },
    {
      id: 'OD-89209',
      customerName: 'Anita Desai',
      phone: '+91 65432 10987',
      address: 'Lane 5, Kalyani Nagar, Pune - 411006',
      products: [
        { name: 'Omron BP Monitor Device HEM-7120', qty: 1, price: 2400, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'NetBanking',
      paymentStatus: 'Paid',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      packedDate: '2026-06-16',
      invoiceNumber: 'EMC-INV-89209',
      orderDate: '2026-06-16',
      orderTime: '02:30 PM',
      status: 'Ready for Dispatch',
      totalAmount: 2400,
      discount: 100,
      deliveryPartner: 'Shadowfax Express',
      deliveryStatus: 'Awaiting Pickup',
      expectedDelivery: 'Today Evening',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: '',
      timeline: [
        { time: '02:30 PM', status: 'Order Placed', description: 'Order placed by patient.' },
        { time: '02:45 PM', status: 'Order Accepted', description: 'Store accepted order.' },
        { time: '03:15 PM', status: 'Packed', description: 'Packed securely. Invoice generated.' }
      ]
    },
    {
      id: 'OD-89208',
      customerName: 'Vikram Sharma',
      phone: '+91 99887 76655',
      address: 'Villa 12, Jubilee Hills, Hyderabad - 500033',
      products: [
        { name: 'Lantus Solostar Insulin Pen', qty: 2, price: 1650, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      prescriptionRequired: true,
      prescriptionImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      prescriptionStatus: 'Verified',
      orderDate: '2026-06-16',
      orderTime: '11:00 AM',
      status: 'Out for Delivery',
      totalAmount: 3300,
      discount: 150,
      deliveryPartner: 'Delivery Express',
      deliveryStatus: 'In Transit',
      expectedDelivery: 'Today 3:00 PM',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: 'Needs temperature controlled packaging.',
      timeline: [
        { time: '11:00 AM', status: 'Order Placed', description: 'Placed.' },
        { time: '11:15 AM', status: 'Accepted', description: 'Accepted.' },
        { time: '12:00 PM', status: 'Packed', description: 'Packed in thermal bag.' },
        { time: '01:00 PM', status: 'Dispatched', description: 'Handed over to courier driver.' }
      ]
    },
    {
      id: 'OD-89207',
      customerName: 'Megha Patel',
      phone: '+91 66554 43322',
      address: 'Flat 503, Tulip Towers, Baner, Pune - 411045',
      products: [
        { name: 'Vaporizer Steam Inhaler 3-in-1', qty: 1, price: 450, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      orderDate: '2026-06-15',
      orderTime: '03:30 PM',
      status: 'Delivered',
      totalAmount: 450,
      discount: 0,
      deliveryDate: '2026-06-16',
      customerRating: 5,
      customerFeedback: 'Extremely fast delivery and device works perfectly!',
      cancellationReason: '',
      cancelledBy: '',
      returnRequestDate: '',
      returnReason: '',
      returnStatus: '',
      refundAmount: 0,
      refundMethod: '',
      refundStatus: '',
      internalNotes: '',
      timeline: [
        { time: '03:30 PM', status: 'Order Placed', description: 'Placed.' },
        { time: '04:00 PM', status: 'Packed', description: 'Packed.' },
        { time: '05:00 PM', status: 'Dispatched', description: 'Dispatched.' },
        { time: '10:30 AM (Next Day)', status: 'Delivered', description: 'Delivered safely.' }
      ]
    },
    {
      id: 'OD-89206',
      customerName: 'Amit Kumar',
      phone: '+91 77665 54433',
      address: 'Sec-4, Dwarka, New Delhi - 110075',
      products: [
        { name: 'Cough Syrups Allopathic Special', qty: 3, price: 150, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'COD',
      paymentStatus: 'Unpaid',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      orderDate: '2026-06-15',
      orderTime: '01:00 PM',
      status: 'Cancelled',
      totalAmount: 450,
      discount: 0,
      cancellationReason: 'Out of stock formulation',
      cancelledBy: 'Merchant',
      refundStatus: 'No Refund Needed',
      internalNotes: 'We were out of stock on this syrup.',
      timeline: [
        { time: '01:00 PM', status: 'Order Placed', description: 'Placed.' },
        { time: '02:00 PM', status: 'Cancelled', description: 'Cancelled by Merchant. Reason: Out of stock.' }
      ]
    },
    {
      id: 'OD-89205',
      customerName: 'Sneha Kapoor',
      phone: '+91 88776 65544',
      address: '702, Sea Breeze Heights, Worli, Mumbai - 400018',
      products: [
        { name: 'Accu-Chek Active Test Strips 50s', qty: 1, price: 975, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      orderDate: '2026-06-14',
      orderTime: '10:00 AM',
      status: 'Returns',
      totalAmount: 975,
      discount: 75,
      returnRequestDate: '2026-06-16',
      returnReason: 'Ordered wrong size strips for my device model',
      returnStatus: 'Awaiting Approval',
      internalNotes: 'Strips container must be sealed for approval.',
      timeline: [
        { time: '10:00 AM', status: 'Placed', description: 'Placed.' },
        { time: '11:00 AM (Next Day)', status: 'Delivered', description: 'Delivered.' },
        { time: '02:00 PM (Yesterday)', status: 'Return Filed', description: 'Return request submitted by customer.' }
      ]
    },
    {
      id: 'OD-89204',
      customerName: 'Rohit Verma',
      phone: '+91 99001 12233',
      address: '14, Mall Road, Shimla - 171001',
      products: [
        { name: 'Vaporizer Steam Inhaler 3-in-1', qty: 1, price: 450, image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=80&q=80' }
      ],
      paymentMethod: 'Card',
      paymentStatus: 'Refunded',
      prescriptionRequired: false,
      prescriptionImage: '',
      prescriptionStatus: 'N/A',
      orderDate: '2026-06-13',
      orderTime: '04:00 PM',
      status: 'Refund Requests',
      totalAmount: 450,
      discount: 0,
      refundAmount: 450,
      refundMethod: 'Original Source (Visa Card)',
      refundStatus: 'Processing',
      requestDate: '2026-06-15',
      internalNotes: 'Approved return. Refunding complete order amount.',
      timeline: [
        { time: '04:00 PM', status: 'Placed', description: 'Placed.' },
        { time: '11:00 AM (June 15)', status: 'Return Approved', description: 'Merchant approved return. Initiating refund.' }
      ]
    }
  ]);

  // 2. Active States
  const [activeTab, setActiveTab] = useState('New Orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [internalNoteInput, setInternalNoteInput] = useState('');

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
    'Refund Requests'
  ];

  // 3. Compute Metrics Dashboard counts dynamically
  const metrics = useMemo(() => {
    const todayStr = '2026-06-17';
    return {
      today: orders.filter(o => o.orderDate === todayStr).length,
      pending: orders.filter(o => o.status === 'New Orders' || o.status === 'Accepted Orders').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      returns: orders.filter(o => o.status === 'Returns').length,
      refunds: orders.filter(o => o.status === 'Refund Requests').length,
      revenue: orders.filter(o => o.status === 'Delivered' || o.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0)
    };
  }, [orders]);

  // 4. Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab matching
      if (order.status !== activeTab) return false;

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
  }, [orders, activeTab, searchQuery, dateFilter, paymentFilter, rxFilter]);

  // 5. Actions / State mutations
  const handleUpdateStatus = (id, newStatus, extraData = {}) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = [
          ...o.timeline,
          { time: timeNow, status: newStatus, description: `Status changed to ${newStatus}` }
        ];
        return {
          ...o,
          status: newStatus,
          timeline: updatedTimeline,
          ...extraData
        };
      }
      return o;
    }));
    // Synchronize selected order if drawer is open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => ({
        ...prev,
        status: newStatus,
        ...extraData
      }));
    }
  };

  const handleSaveInternalNote = (id) => {
    if (!internalNoteInput.trim()) return;
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          internalNotes: internalNoteInput
        };
      }
      return o;
    }));
    setSelectedOrder(prev => ({
      ...prev,
      internalNotes: internalNoteInput
    }));
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 shrink-0">
        {[
          { label: "Today's Orders", val: metrics.today, icon: FiShoppingBag, color: 'text-teal bg-teal-50 border-teal-100' },
          { label: "Pending Orders", val: metrics.pending, icon: FiClock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { label: "Processing", val: metrics.processing, icon: FiActivity, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: "Delivered", val: metrics.delivered, icon: FiCheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: "Cancelled", val: metrics.cancelled, icon: FiXCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { label: "Returns", val: metrics.returns, icon: FiRefreshCw, color: 'text-violet-600 bg-violet-50 border-violet-100' },
          { label: "Refunds", val: metrics.refunds, icon: FiDollarSign, color: 'text-orange-600 bg-orange-50 border-orange-100' },
          { label: "Total Revenue", val: `₹${metrics.revenue.toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'text-white bg-[#135A5A] border-[#0F4A4A]' }
        ].map((m, idx) => (
          <div key={idx} className={`border p-3 rounded-2xl flex flex-col justify-between h-20 shadow-sm relative overflow-hidden transition-transform hover:scale-[1.02] ${m.color}`}>
            <span className={`text-[8.5px] font-black uppercase tracking-wider ${idx === 7 ? 'text-teal-100' : 'text-slate-400'}`}>{m.label}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm sm:text-base font-black tracking-tight">{m.val}</span>
              <m.icon className={`text-lg shrink-0 ${idx === 7 ? 'text-teal-150' : 'opacity-80'}`} />
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
          const count = orders.filter(o => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
                    {filteredOrders.map(order => (
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
                          {activeTab === 'Refund Requests' && (
                            <span className="text-xs font-bold text-slate-600">{order.refundMethod}</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-805">₹{order.totalAmount}</span>
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
                                  onClick={() => handleUpdateStatus(order.id, 'Cancelled', { cancellationReason: 'Rejected by Store', cancelledBy: 'Store' })}
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
                                  onClick={() => handleUpdateStatus(order.id, 'Refund Requests', { returnStatus: 'Approved', refundAmount: order.totalAmount, refundMethod: 'UPI Wallet', refundStatus: 'Pending Approval' })}
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
                                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
              {filteredOrders.map(order => (
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

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/50 flex flex-col gap-1 text-[11px] font-bold text-slate-650">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{p.name}</span>
                        <span>x{p.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-0.5">
                    <span className="text-xs font-black text-slate-800">Total: ₹{order.totalAmount}</span>
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
          </>
        )}

      </div>

      {/* 6. Side Drawer / Bottom Sheet for Order Details */}
      <AnimatePresence>
        {isDrawerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
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
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between z-10"
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
                
                {/* Section A: Customer Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-150/50 pb-1.5 flex items-center gap-1">
                    <FiUser className="text-[#135A5A]" /> Patient Coordinates
                  </span>
                  <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-650">
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Full Name</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-405 font-bold">Contact Number</span>
                      <span className="font-extrabold text-slate-800">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-405 font-bold">Shipping Address</span>
                      <span className="leading-relaxed bg-white border border-slate-100 p-2.5 rounded-xl text-slate-700">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                {/* Section B: Products list with images */}
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
                          <div className="flex items-center justify-between mt-1 text-[11px] font-semibold text-slate-405">
                            <span>₹{prod.price} x {prod.qty}</span>
                            <span className="font-black text-slate-700">₹{prod.price * prod.qty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: Price calculation details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 text-xs font-semibold text-slate-650">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Subtotal</span>
                    <span className="text-slate-700">₹{selectedOrder.totalAmount + selectedOrder.discount}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>Discount Applied</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-800 text-sm">
                    <span>Grand Total Paid</span>
                    <span className="text-[#135A5A]">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Section D: Prescription Verification (If applicable) */}
                {selectedOrder.prescriptionRequired && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col gap-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5 flex items-center gap-1.5">
                      <FiShield className="text-[#135A5A]" /> Prescription Verification Vault
                    </span>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">Verification Status</span>
                      <span className="px-2 py-0.5 rounded bg-amber-55 text-amber-700 font-bold uppercase tracking-wider text-[9px] border border-amber-200">
                        {selectedOrder.prescriptionStatus}
                      </span>
                    </div>
                    {selectedOrder.prescriptionImage && (
                      <div className="border border-slate-100 rounded-xl overflow-hidden mt-1 relative group">
                        <img 
                          src={selectedOrder.prescriptionImage} 
                          alt="Rx Prescription File" 
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                            href={selectedOrder.prescriptionImage} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-white text-slate-800 rounded-full font-black uppercase tracking-wider text-[10px] shadow flex items-center gap-1 cursor-pointer no-underline"
                          >
                            <FiEye /> View Rx File
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Section E: Order Timeline Stepper */}
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5">Fulfillment Timeline</span>
                  <div className="relative pl-5 border-l border-slate-200 flex flex-col gap-3 text-xs">
                    {selectedOrder.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[25px] top-0.5 w-2.5 h-2.5 bg-[#135A5A] rounded-full" />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-800">{step.status}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{step.time}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section F: Internal Notes */}
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    <FiEdit className="text-[#135A5A]" /> Internal Staff Notes
                  </span>
                  
                  {selectedOrder.internalNotes && (
                    <p className="text-xs text-slate-650 bg-slate-50 p-2.5 border border-slate-100 rounded-xl leading-relaxed italic">
                      "{selectedOrder.internalNotes}"
                    </p>
                  )}
                  
                  <div className="flex gap-2">
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
              <div className="p-4 border-t border-slate-150 bg-slate-50 shrink-0 flex gap-2.5">
                <button 
                  onClick={closeDrawer}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
                
                {selectedOrder.status === 'New Orders' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Accepted Orders')}
                    className="flex-1 py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] transition-colors border-0 cursor-pointer shadow-premium"
                  >
                    Accept Order
                  </button>
                )}

                {selectedOrder.status === 'Accepted Orders' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')}
                    className="flex-1 py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] border-0 cursor-pointer shadow-premium"
                  >
                    Start Processing
                  </button>
                )}

                {selectedOrder.status === 'Processing' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Ready for Dispatch', { invoiceNumber: `EMC-INV-${selectedOrder.id.split('-')[1]}`, deliveryPartner: 'Shadowfax Express', deliveryStatus: 'Pending Pickup' })}
                    className="flex-1 py-3 bg-[#135A5A] text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#0F4A4A] border-0 cursor-pointer shadow-premium"
                  >
                    Ready to Ship
                  </button>
                )}
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
