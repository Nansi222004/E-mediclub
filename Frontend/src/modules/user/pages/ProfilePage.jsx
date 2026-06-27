import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock, FiTrash2, FiPlus, 
  FiLogOut, FiEdit, FiCheck, FiHeart, FiFileText, FiActivity, FiCreditCard, FiShoppingBag, FiDownload,
  FiChevronRight, FiBell, FiX, FiInfo, FiUploadCloud, FiCopy, FiRefreshCw, FiStar
} from 'react-icons/fi';
import { logout, addAddress, deleteAddress, setDefaultAddress, updateUserProfile, addSavedCard, deleteSavedCard } from '../../auth/store/authSlice';
import { addToCart } from '../store/cartSlice';
import { submitAppointmentFeedback, submitLabFeedback, updateOrderStatus, cancelDoctorAppointment, cancelLabBooking, syncLabBookings, normalizeCity, returnOrderThunk, cancelDoctorAppointmentThunk, rescheduleDoctorAppointmentThunk, cancelLabBookingThunk, rescheduleLabBookingThunk } from '../store/productSlice';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';
import PrescriptionReviewModal from '../../../shared/components/PrescriptionReviewModal';
import apiClient from '../../../shared/services/apiClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '../../auth/user/schemas/auth.schema';
import ViewDetailsModal from '../components/ViewDetailsModal';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { user, isAuthenticated, addresses = [], savedCards = [] } = useSelector(state => state.auth);
  const { appointments = [], labBookings = [], orders = [], prescriptions = [], location: locationState } = useSelector(state => state.products);
  
  const normalizedSelectedCityForAddresses = locationState?.city ? normalizeCity(locationState.city).toLowerCase() : '';
  const filteredAddresses = normalizedSelectedCityForAddresses
    ? addresses.filter(addr => addr.city && normalizeCity(addr.city).toLowerCase() === normalizedSelectedCityForAddresses)
    : addresses;

  // Edit Profile States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange'
  });

  const handleOpenEditProfile = () => {
    resetProfile({
      name: user?.name || 'Rishi',
      email: user?.email || 'rishi@emediclub.com',
      phone: user?.phone || '9892989898',
      gender: user?.gender || 'Male',
      age: user?.age || 25
    });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (data) => {
    dispatch(updateUserProfile({
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      age: data.age
    }));
    setShowEditProfileModal(false);
  };
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'labs', 'consultations', 'prescriptions', 'records', 'payments', 'notifications', 'help'
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');

  // Payment methods states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardBank, setCardBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [showGlobalUploadModal, setShowGlobalUploadModal] = useState(false);
  const [selectedRxForReview, setSelectedRxForReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // View Details / Action Modal States
  const [actionModal, setActionModal] = useState({ isOpen: false, type: '', action: '', data: null });
  const [actionReason, setActionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [replacements, setReplacements] = useState(() => {
    const saved = localStorage.getItem('em_replacements');
    return saved ? JSON.parse(saved) : [
      {
        id: 'EM-29471',
        itemName: 'Paracetamol 500mg x2',
        date: '12 Jun',
        status: 'In transit',
        steps: [
          { title: 'Request approved', date: '12 Jun, 10:30 AM', status: 'done' },
          { title: 'Item picked up', date: '13 Jun, 2:00 PM', status: 'done' },
          { title: 'Replacement in transit', date: 'Expected 15 Jun', status: 'active', icon: 'truck' },
          { title: 'Delivered', date: 'Pending', status: 'pending', icon: 'home' }
        ]
      }
    ];
  });

  const [refunds, setRefunds] = useState(() => {
    const saved = localStorage.getItem('em_refunds_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'LB-8812',
        itemName: 'Lab test — CBC Full body',
        amount: 799,
        date: '10 Jun',
        status: 'Credited',
        city: 'mumbai',
        pincode: '400001',
        rrn: '103460748988',
        billDetails: { mrp: 999, discount: 200, itemTotal: 799 },
        steps: [
          { title: 'Cancellation confirmed', date: '10 Jun, 9:00 AM', status: 'done' },
          { title: 'Refund initiated', date: '10 Jun, 9:05 AM', status: 'done' },
          { title: '₹799 credited to UPI', date: '12 Jun, 11:20 AM', status: 'done' }
        ]
      },
      {
        id: 'DC-3301',
        itemName: 'Dr. Sharma consultation',
        amount: 499,
        date: '11 Jun',
        status: 'Processing',
        city: 'bangalore',
        pincode: '560001',
        rrn: '103460748989',
        billDetails: { mrp: 599, discount: 100, itemTotal: 499 },
        steps: [
          { title: 'Cancellation confirmed', date: '11 Jun, 3:00 PM', status: 'done' },
          { title: 'Refund processing', date: '3–5 business days', status: 'active', icon: 'refresh' },
          { title: '₹499 credited', date: 'Pending', status: 'pending', icon: 'check' }
        ]
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('em_replacements', JSON.stringify(replacements));
  }, [replacements]);

  React.useEffect(() => {
    localStorage.setItem('em_refunds_v2', JSON.stringify(refunds));
  }, [refunds]);

  React.useEffect(() => {
    if (activeTab === 'labs' && labBookings && labBookings.length > 0) {
      const syncBookings = async () => {
        try {
          const ids = labBookings.map(b => b.id).join(',');
          const response = await apiClient.get(`/api/labs/my-bookings?ids=${ids}`);
          if (response.data && response.data.data) {
            dispatch(syncLabBookings(response.data.data));
          }
        } catch (error) {
          console.error('Failed to sync lab bookings:', error);
        }
      };
      syncBookings();
    }
  }, [activeTab, labBookings, dispatch]);

  // Customer Feedback States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState(''); // 'lab' or 'consultation'
  const [feedbackId, setFeedbackId] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleOpenFeedback = (type, id, name) => {
    setFeedbackType(type);
    setFeedbackId(id);
    setFeedbackName(name);
    setRatingVal(5);
    setFeedbackText('');
    setHoveredStar(0);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedbackType === 'lab') {
      dispatch(submitLabFeedback({
        id: feedbackId,
        rating: ratingVal,
        feedback: feedbackText
      }));
    } else {
      dispatch(submitAppointmentFeedback({
        id: feedbackId,
        rating: ratingVal,
        feedback: feedbackText
      }));
    }
    setShowFeedbackModal(false);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    const newAddressObj = {
      id: `addr-${Date.now()}`,
      name: newAddrName,
      phone: newAddrPhone,
      pincode: newAddrPin,
      addressLine: newAddrLine,
      city: newAddrCity,
      state: newAddrState,
      isDefault: addresses.length === 0
    };
    dispatch(addAddress(newAddressObj));
    setShowAddressForm(false);
    // Reset inputs
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrPin('');
    setNewAddrLine('');
    setNewAddrCity('');
    setNewAddrState('');
  };

  const handleAddNewCard = (e) => {
    e.preventDefault();
    if (!cardBank || !cardNumber || !cardExpiry) return;
    const newCard = {
      id: `c-${Date.now()}`,
      bank: cardBank,
      last4: cardNumber.slice(-4),
      expiry: cardExpiry,
      city: locationState?.city || 'Mumbai',
      pincode: locationState?.pincode || '400001'
    };
    dispatch(addSavedCard(newCard));
    setCardBank('');
    setCardNumber('');
    setCardExpiry('');
    setShowPaymentForm(false);
  };

  const handleDeleteCard = (id) => {
    dispatch(deleteSavedCard(id));
  };

  const handleOrderAgain = (itemsList) => {
    itemsList.forEach(item => {
      dispatch(addToCart({
        id: item.id || `med-2`, // Fallback Dolo
        name: item.name,
        type: 'medicine',
        price: item.price || 28,
        discountPrice: item.price || 28,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
        packSize: 'Strip of 15 tablets',
        brand: 'Prescribed Care'
      }));
    });
    alert("Products re-added to your active cart drawer!");
    navigate('/cart');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // GUEST VIEW
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center select-none flex flex-col items-center gap-6 bg-white border border-slate-100 shadow-premium rounded-[32px] animate-fade-in relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-light rounded-full filter blur-2xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-light rounded-full filter blur-2xl opacity-60" />
        
        <div className="w-16 h-16 rounded-3xl bg-teal-light/50 text-teal text-3xl flex items-center justify-center shrink-0">
          👤
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">My Active Health Profile</h2>
          <p className="text-xs text-slate-400 font-semibold mt-2.5 leading-relaxed">
            Please log in or register to access your personal address book, order tracking dashboard, and doctor consultation calendars.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full border-t border-slate-50 pt-5 mt-1">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm border-0 cursor-pointer outline-none"
          >
            Login to Profile
          </button>
        </div>
      </div>
    );
  }

  const getTodayStrGlobal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter by location city and pincode
  const selectedCity = locationState?.city?.toLowerCase() || '';
  const selectedPin = locationState?.pincode || '';

  const filterByLocation = (item) => {
    if (!selectedCity) return true;
    const itemCity = item.city ? item.city.toLowerCase() : '';
    const itemPin = item.pincode || '';
    const itemAddress = item.address ? item.address.toLowerCase() : (item.deliveryAddress ? item.deliveryAddress.toLowerCase() : '');

    const matchesCity = itemCity === selectedCity || itemAddress.includes(selectedCity);
    const matchesPin = selectedPin ? (itemPin === selectedPin || itemAddress.includes(selectedPin)) : true;
    return matchesCity && matchesPin;
  };

  const filteredAppointments = appointments.filter(filterByLocation);
  const upcomingAppointments = filteredAppointments.filter(apt => {
    if (apt.date && apt.date < getTodayStrGlobal()) return false;
    return apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending';
  });
  const pastAppointments = filteredAppointments.filter(apt => {
    if (apt.date && apt.date < getTodayStrGlobal()) return true;
    return apt.status === 'Completed' || apt.status === 'Cancelled';
  });

  // Filter completed lab bookings
  const filteredLabBookings = labBookings.filter(filterByLocation);
  const completedLabBookings = filteredLabBookings.filter(b => b.status === 'Completed' || b.status === 'Verified' || new Date(b.date) < new Date());

  // Filter replacements & refunds
  const filteredReplacements = replacements.filter(filterByLocation);
  const filteredRefunds = refunds.filter(filterByLocation);
  const filteredPrescriptions = prescriptions.filter(filterByLocation);

  const displayName = user?.name === 'Super Admin' ? 'Clinical Admin' : (user?.name || 'User');
  const firstName = displayName.split(' ')[0];

  const menuSections = [
    {
      title: 'My Activity',
      items: [
        { key: 'orders', label: 'My Orders', icon: <FiShoppingBag className="text-[#0f6e56]" /> },
        { key: 'labs', label: 'My Lab Test Bookings', icon: <FiActivity className="text-[#0f6e56]" /> },
        { key: 'consultations', label: 'My Consultations', icon: <FiClock className="text-[#0f6e56]" /> },
        { key: 'prescriptions', label: 'My Prescriptions', icon: <FiFileText className="text-[#0f6e56]" /> },
        { key: 'records', label: 'Health Records', icon: <FiHeart className="text-[#0f6e56]" />, badge: 'BETA' }
      ]
    },
    {
      title: 'Cancellations & Refunds',
      items: [
        { key: 'lab_cancellations', label: 'Lab Test Cancellations', subLabel: 'Cancel & track refund', icon: <FiActivity className="text-[#ba7517]" /> },
        { key: 'doctor_refunds', label: 'Doctor Appt. Refunds', subLabel: 'Cancelled consultations', icon: <FiCalendar className="text-[#ba7517]" /> },
        { key: 'medicine_returns', label: 'Medicine Returns', subLabel: 'Return or replace medicines', icon: <FiShoppingBag className="text-[#ba7517]" /> }
      ]
    },
    {
      title: 'Track Status',
      titleBadge: 'NEW',
      items: [
        { 
          key: 'replacement_status', 
          label: 'Replacement Status', 
          subLabel: 'Track your replacement items', 
          icon: <FiClock className="text-[#185fa5]" />,
          activeBadge: filteredReplacements.length > 0 ? `${filteredReplacements.length} active` : null 
        },
        { 
          key: 'refund_status', 
          label: 'Refund Status', 
          subLabel: 'Track money back to your account', 
          icon: <FiCreditCard className="text-[#185fa5]" />,
          activeBadge: filteredRefunds.length > 0 ? `${filteredRefunds.length} active` : null 
        }
      ]
    },
    {
      title: 'Address & Payments',
      items: [
        { key: 'addresses', label: 'Manage Delivery Addresses', icon: <FiMapPin className="text-[#0f6e56]" /> },
        { key: 'payments', label: 'Manage Payment Methods', icon: <FiCreditCard className="text-[#0f6e56]" /> }
      ]
    },
    {
      title: 'Settings & Account',
      items: [
        { key: 'notifications', label: 'Notifications', icon: <FiBell className="text-[#0f6e56]" /> },
        { key: 'help', label: 'Help & Support', icon: <FiInfo className="text-[#0f6e56]" /> },
        { key: 'logout', label: 'Logout', icon: <FiLogOut className="text-[#a32d2d]" />, isDestructive: true }
      ]
    }
  ];

  const toggleTab = (tab) => {
    setActiveTab(prev => {
      const next = prev === tab ? null : tab;
      if (next) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      return next;
    });
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case 'orders':
        const filteredProfileOrders = orders.filter(filterByLocation);
        const activeOrders = filteredProfileOrders.filter(ord => ord.status !== 'Delivered' && !ord.archived);
        const pastOrders = filteredProfileOrders.filter(ord => ord.status === 'Delivered' && !ord.archived);
        
        const steps = [
          { label: 'Order Placed', desc: 'Received & verified' },
          { label: 'Confirmed', desc: 'Approved by pharmacist' },
          { label: 'Packed', desc: 'Sterile sealed package' },
          { label: 'Out for Delivery', desc: 'Dispatched with courier' },
          { label: 'Delivered', desc: 'Doorstep handover' }
        ];

        const getStepIndex = (status) => {
          const s = status ? status.toLowerCase() : '';
          if (s === 'delivered') return 4;
          if (s === 'out for delivery' || s === 'dispatched' || s === 'shipped') return 3;
          if (s === 'packed') return 2;
          if (s === 'confirmed') return 1;
          return 1;
        };

        const getStatusIcon = (status) => {
          switch (status) {
            case 'Delivered':
              return <FiCheck className="text-emerald-500 w-3 h-3 shrink-0" />;
            case 'Shipped':
            case 'Dispatched':
            case 'Out for Delivery':
              return <FiClock className="text-teal w-3 h-3 shrink-0" />;
            case 'Packed':
              return <FiCheck className="text-forest w-3 h-3 shrink-0" />;
            default:
              return <FiClock className="text-forest w-3 h-3 shrink-0" />;
          }
        };

        const getStatusColor = (status) => {
          switch (status) {
            case 'Delivered':
              return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'Shipped':
            case 'Dispatched':
            case 'Out for Delivery':
              return 'bg-teal-light/50 text-teal border border-teal/10';
            case 'Packed':
              return 'bg-amber-50 text-amber-605 border border-amber-100';
            default:
              return 'bg-forest-light/40 text-forest border border-forest/10';
          }
        };

        const handleSimulateProgress = (orderId, currentStatus) => {
          let nextStatus = 'Ordered';
          if (currentStatus === 'Ordered' || currentStatus === 'pending') {
            nextStatus = 'Packed';
          } else if (currentStatus === 'Packed') {
            nextStatus = 'Dispatched';
          } else if (currentStatus === 'Dispatched' || currentStatus === 'Shipped') {
            nextStatus = 'Delivered';
          }
          dispatch(updateOrderStatus({ orderId, status: nextStatus }));
        };

        return (
          <div className="flex flex-col gap-6 text-left">
            {/* Active/Tracking Shipments */}
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] text-teal font-black uppercase tracking-wider pl-1">Active Shipments Pipeline</h5>
              {activeOrders.length > 0 ? (
                activeOrders.map((ord) => {
                  const currentStepIndex = getStepIndex(ord.status);
                  return (
                    <div key={ord.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-4 shadow-sm text-xs">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                        <div className="min-w-0">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block">Reference ID</span>
                          <strong className="text-slate-800 truncate block mt-0.5">{ord.id}</strong>
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${getStatusColor(ord.status)}`}>
                          <span>{ord.status}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-slate-605 font-bold pl-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name} x{item.qty}</span>
                            <span className="text-slate-805">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      {/* Micro-stepper inside Profile tab */}
                      <div className="flex justify-between items-center gap-1.5 px-1 pt-1.5 border-t border-slate-50/60 mt-1 select-none">
                        {steps.map((step, idx) => {
                          const isDone = idx <= currentStepIndex;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1 flex-1 relative">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${isDone ? 'bg-forest text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[7.5px] font-extrabold tracking-tight text-center leading-tight hidden xs:block ${isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                                {step.label.split(' ')[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 mt-1">
                        <span className="text-slate-400 font-bold">Total charged: <strong className="text-slate-750">₹{ord.total}</strong></span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setActionModal({ isOpen: true, type: 'order', action: '', data: ord })}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-200 cursor-pointer shadow-sm transition-colors outline-none shrink-0"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateProgress(ord.id, ord.status)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-800 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-150 cursor-pointer outline-none shrink-0"
                          >
                            Next Step ➔
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 font-bold py-2 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No active shipments in transit.</p>
              )}
            </div>

            {/* Completed Orders History */}
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-1">Delivered Orders History</h5>
              {pastOrders.length > 0 ? (
                pastOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-3 shadow-sm text-xs">
                    <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Reference ID</span>
                        <strong className="text-slate-800">{ord.id}</strong>
                      </div>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase tracking-wider">{ord.status}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-slate-605 font-bold pl-1">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name} x{item.qty}</span>
                          <span className="text-slate-850">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-1">
                      <span className="text-slate-400 font-bold">Total: <strong className="text-slate-700">₹{ord.total}</strong></span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActionModal({ isOpen: true, type: 'order', action: '', data: ord })}
                          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-slate-200 cursor-pointer shadow-sm transition-colors outline-none"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOrderAgain(ord.items)}
                          className="px-4 py-2 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer shadow-sm transition-colors outline-none"
                        >
                          Order Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold py-2 text-center uppercase tracking-wide">No past order history available.</p>
              )}
            </div>

            <button 
              onClick={() => navigate('/orders')} 
              className="w-full py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border-0 mt-2 cursor-pointer outline-none text-center"
            >
              Go to Full Screen Order Stepper ➔
            </button>
          </div>
        );
      case 'labs':
        const getTodayStrLabs = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const isLabBookingActiveObj = (bk) => {
          const bkDate = bk.date || bk.bookingDate;
          if (!bkDate) return false;
          if (bk.status === 'cancelled' || bk.status === 'completed') return false;
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const tStr = `${year}-${month}-${day}`;
          
          if (bkDate < tStr) return false;
          if (bkDate > tStr) return true;
          
          if (!bk.timeSlot) return true;
          const parts = bk.timeSlot.split(' - ');
          if (parts.length < 2) return true;
          const endTimeStr = parts[1].trim();
          
          const timeMatch = endTimeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
          if (!timeMatch) return true;
          
          let hour = parseInt(timeMatch[1]);
          const min = parseInt(timeMatch[2]);
          const ampm = timeMatch[3].toUpperCase();
          
          if (ampm === 'PM' && hour !== 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          
          const currentHour = now.getHours();
          const currentMin = now.getMinutes();
          
          if (currentHour > hour || (currentHour === hour && currentMin >= min)) {
            return false;
          }
          return true;
        };

        const todayStrLabs = getTodayStrLabs();
        const upcomingLabs = filteredLabBookings.filter(isLabBookingActiveObj);
        const pastLabs = filteredLabBookings.filter(bk => !isLabBookingActiveObj(bk));

        const labSteps = [
          { label: 'Booked', status: 'new_booking' },
          { label: 'Confirmed', status: 'confirmed' },
          { label: 'Agent Assigned', status: 'collector_assigned' },
          { label: 'Collected', status: 'sample_collected' },
          { label: 'In Lab', status: 'in_progress' },
          { label: 'Report Ready', status: 'report_uploaded' },
          { label: 'Completed', status: 'completed' }
        ];

        const getLabStepIndex = (status) => {
          switch (status) {
            case 'new_booking': return 0;
            case 'confirmed': return 1;
            case 'collector_assigned': return 2;
            case 'sample_collected': return 3;
            case 'in_progress': return 4;
            case 'report_uploaded': return 5;
            case 'completed': return 6;
            default: return -1;
          }
        };

        const renderLabBookingCard = (booking) => {
          const currentStepIndex = getLabStepIndex(booking.status);
          const isCancelled = booking.status === 'cancelled';
          const reportDownloadUrl = booking.reportUrl
            ? (booking.reportUrl.startsWith('http') ? booking.reportUrl : `http://localhost:5000/${booking.reportUrl.replace(/\\/g, '/')}`)
            : null;

          return (
            <div key={booking.id} className="bg-white p-5 border border-slate-100 rounded-3xl flex flex-col gap-4 shadow-sm text-xs relative overflow-hidden transition-all hover:shadow-md">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">Booking Reference</span>
                  <strong className="text-slate-800 text-[10px] truncate block mt-0.5">{booking.id}</strong>
                </div>
                <span className={`text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isCancelled ? 'bg-rose-55 text-rose-600 border-rose-100/50' :
                  booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                  'bg-teal/10 text-teal border-teal/20'
                }`}>
                  {(booking.status || 'new_booking').replace('_', ' ')}
                </span>
              </div>

              {/* Package and Schedule */}
              <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-150/40">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                  <img
                    src={booking.image || 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80'}
                    alt={booking.packageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-750 text-xs truncate">🔬 {booking.packageName}</h4>
                  <p className="text-[9px] text-slate-450 uppercase font-bold tracking-wide mt-0.5 truncate">
                    {booking.date || booking.bookingDate} • {booking.timeSlot}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-405 font-bold block uppercase">Price</span>
                  <strong className="text-slate-800 font-black">₹{booking.price || booking.amountPaid || 499}</strong>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-200/50">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Patient Name</span>
                  <span className="font-extrabold text-slate-700">{booking.patientName || 'Self'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Age / Gender</span>
                  <span className="font-extrabold text-slate-700">{booking.patientAge ? `${booking.patientAge} Yrs` : 'N/A'} ({booking.patientGender || 'N/A'})</span>
                </div>
                {booking.doctorName && (
                  <div className="col-span-2 mt-1 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-bold block uppercase text-[8px]">Prescribing Doctor</span>
                    <span className="font-extrabold text-slate-700">🩺 {booking.doctorName}</span>
                  </div>
                )}
              </div>

              {/* Collector Details */}
              {booking.collectorName && (
                <div className="bg-teal/5 border border-teal/10 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[8px] text-teal font-black uppercase tracking-wider block">Assigned Collector Agent</span>
                    <span className="font-extrabold text-slate-800 text-[10.5px] block mt-0.5">👤 {booking.collectorName}</span>
                    <a href={`tel:${booking.collectorPhone}`} className="text-[9px] text-teal font-extrabold hover:underline block mt-0.5">📞 {booking.collectorPhone}</a>
                  </div>
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase border border-emerald-100/50 shrink-0">Dispatched</span>
                </div>
              )}

              {/* OTP Box */}
              {booking.otp && !['sample_collected', 'in_progress', 'report_uploaded', 'completed', 'cancelled'].includes(booking.status) && (
                <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-2xl flex justify-between items-center gap-3">
                  <div>
                    <span className="text-[8.5px] text-amber-600 font-black uppercase tracking-wider block">Collection verification OTP</span>
                    <p className="text-[9px] text-slate-450 font-semibold mt-0.5">Provide this code to the agent during sample collection.</p>
                  </div>
                  <span className="bg-white border border-amber-300 text-amber-600 px-3 py-1 rounded-xl font-black text-sm tracking-wider shadow-sm select-all">
                    {booking.otp}
                  </span>
                </div>
              )}

              {/* Timeline Stepper */}
              {!isCancelled && currentStepIndex !== -1 && (
                <div className="flex justify-between items-center gap-1 px-1 pt-2 border-t border-slate-50 mt-1 select-none">
                  {labSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1 relative">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black transition-all ${
                          isDone ? 'bg-teal text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[6.5px] font-extrabold tracking-tight text-center leading-tight hidden xs:block ${
                          isDone ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-1">
                {reportDownloadUrl ? (
                  <a
                    href={reportDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase rounded-lg shadow-sm border-0 cursor-pointer transition-all decoration-transparent"
                  >
                    <FiDownload className="text-xs" /> Download Report
                  </a>
                ) : (
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {isCancelled ? '❌ Booking Cancelled' : '⏳ Waiting for laboratory report'}
                  </span>
                )}

                {!isCancelled && booking.status !== 'completed' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActionModal({ isOpen: true, type: 'lab', action: '', data: booking })}
                      className="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-slate-200 cursor-pointer transition-all shadow-sm outline-none"
                    >
                      View Details
                    </button>
                  </div>
                )}

                {booking.status === 'completed' && (
                  booking.isRated ? (
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                        {"★".repeat(booking.rating)}{"☆".repeat(5 - booking.rating)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenFeedback('lab', booking.id, booking.packageName)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 text-[10px] font-black uppercase tracking-wider rounded-xl border border-amber-200/50 cursor-pointer transition-all shadow-sm outline-none"
                    >
                      Rate Visit
                    </button>
                  )
                )}
              </div>
            </div>
          );
        };

        return (
          <div className="flex flex-col gap-5">
            {/* Upcoming Diagnostic Bookings */}
            {upcomingLabs.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] text-teal font-black uppercase tracking-wider pl-1">Active Diagnostic Bookings</h5>
                <div className="flex flex-col gap-3">
                  {upcomingLabs.map(renderLabBookingCard)}
                </div>
              </div>
            )}

            {/* Past Diagnostic Bookings */}
            <div className="flex flex-col gap-2.5">
              <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-1">Past Collections & Completed Reports</h5>
              {pastLabs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {pastLabs.map(renderLabBookingCard)}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-bold py-2 text-center uppercase tracking-wide">No past pathology tests in history.</p>
              )}
            </div>
          </div>
        );
      case 'consultations':
        const getTodayStr = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const isAppointmentActive = (apt) => {
          const aptDate = apt.date || apt.appointmentDate;
          if (!aptDate) return false;
          if (apt.bookingStatus === 'Cancelled' || apt.status === 'Cancelled') return false;
          if (apt.bookingStatus === 'Completed' || apt.status === 'Completed') return false;

          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const tStr = `${year}-${month}-${day}`;
          
          if (aptDate < tStr) return false;
          return true; // Keep today's appointments active all day
        };

        const todayStr = getTodayStr();
        const upcomingApts = filteredAppointments.filter(isAppointmentActive);
        const pastApts = filteredAppointments.filter(apt => !isAppointmentActive(apt));

        return (
          <div className="flex flex-col gap-5">
            {/* Upcoming Consultations */}
            {upcomingApts.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] text-teal font-black uppercase tracking-wider pl-1">Upcoming Consultations</h5>
                <div className="flex flex-col gap-3">
                  {upcomingApts.map((apt) => (
                    <div key={apt.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                          <img
                            src={apt.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80'}
                            alt={apt.doctorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-750 truncate">👨‍⚕️ {apt.doctorName}</h4>
                          <p className="text-[9px] text-slate-450 font-bold mt-1 uppercase tracking-wide truncate">{apt.specialty} • {apt.type}</p>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{apt.date || apt.appointmentDate} • {apt.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                        {(apt.type || '').includes('Online') && (apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending') && (
                          <button 
                            onClick={() => navigate('/doctor-appointments')} 
                            className="w-full sm:w-auto px-3 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase rounded-lg border-0 cursor-pointer shadow-sm outline-none"
                          >
                            Join Call
                          </button>
                        )}
                        <button
                          onClick={() => setActionModal({ isOpen: true, type: 'consultation', action: '', data: apt })}
                          className="w-full sm:w-auto px-4 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-black uppercase rounded-lg border border-slate-200 cursor-pointer shadow-sm outline-none"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Consultations */}
            <div className="flex flex-col gap-2.5">
              <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-1">Past Consultations</h5>
              {pastApts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {pastApts.map((apt) => (
                    <div key={apt.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-3 text-xs shadow-sm">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                            <img
                              src={apt.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80'}
                              alt={apt.doctorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-750 truncate">👨‍⚕️ {apt.doctorName}</h4>
                            <p className="text-[9px] text-slate-450 font-bold mt-1 uppercase tracking-wide truncate">{apt.specialty} • {apt.type}</p>
                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{apt.date || apt.appointmentDate} • {apt.timeSlot}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-405 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full uppercase font-black shrink-0">{apt.status || apt.bookingStatus || 'Completed'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-1 select-none">
                        {apt.isRated ? (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-1">
                              <span className="text-amber-500 text-sm font-bold flex items-center gap-0.5">
                                {"★".repeat(apt.rating)}{"☆".repeat(5 - apt.rating)}
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-extrabold uppercase ml-1">({apt.rating}.0 Rated)</span>
                            </div>
                            {apt.feedback && (
                              <p className="text-[10px] text-slate-450 italic font-semibold">"{apt.feedback}"</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[9.5px] text-slate-400 font-bold uppercase">How was your checkup?</span>
                            <button
                              onClick={() => handleOpenFeedback('consultation', apt.id, apt.doctorName)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 text-[10px] font-black uppercase tracking-wider rounded-xl border border-amber-200/50 cursor-pointer transition-all shadow-sm outline-none"
                            >
                              Rate Visit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-bold py-2 text-center uppercase tracking-wide">No past consultations in history.</p>
              )}
            </div>
          </div>
        );
      case 'prescriptions':
        return (
          <div className="flex flex-col gap-3">
            
            {/* Upload Button Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-1">
              <h4 className="font-black text-slate-800 text-xs">My Prescription Vault</h4>
              <button 
                onClick={() => setShowGlobalUploadModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer border-0 outline-none"
              >
                <FiUploadCloud className="text-xs shrink-0" /> Upload Rx
              </button>
            </div>

            {filteredPrescriptions && filteredPrescriptions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredPrescriptions.map((rx) => (
                  <div 
                    key={rx.id} 
                    onClick={() => {
                      setSelectedRxForReview(rx);
                      setShowReviewModal(true);
                    }}
                    className="bg-white p-4 border border-slate-100 hover:border-teal/30 rounded-2xl flex items-center justify-between gap-4 shadow-sm text-xs cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-light/50 text-teal flex items-center justify-center shrink-0">
                        <FiFileText className="text-lg" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">ID: {rx.id}</span>
                        <strong className="text-slate-800 truncate block mt-0.5">{rx.fileName}</strong>
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Uploaded: {new Date(rx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                        Verified
                      </span>
                      <FiChevronRight className="text-slate-400 w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-teal-light/20 border border-teal/10 rounded-2xl p-6 flex flex-col gap-3.5 text-center items-center my-2">
                <span className="text-3xl">📋</span>
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">No Prescriptions Uploaded</h4>
                  <p className="text-[10px] text-slate-450 font-semibold mt-1 leading-relaxed">
                    You haven't uploaded any prescriptions yet. Upload to dynamically parse medicines and add them to your cart.
                  </p>
                </div>
                <button 
                  onClick={() => setShowGlobalUploadModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black tracking-wider uppercase rounded-xl shadow-sm transition-all cursor-pointer border-0 outline-none"
                >
                  <FiUploadCloud className="text-xs shrink-0" /> Upload Prescription
                </button>
              </div>
            )}
          </div>
        );
      case 'records':
        return (
          <div className="flex flex-col gap-3">
            {completedLabBookings.length > 0 ? (
              completedLabBookings.map((booking) => (
                <div key={`rep-${booking.id}`} className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl text-teal shrink-0">📄</span>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-700 truncate">{booking.packageName}</h4>
                      <span className="text-[9.5px] text-slate-450 font-bold uppercase block mt-0.5 truncate">Approved Pathology PDF</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Downloading secure clinical report PDF: ${booking.packageName.replace(/\s+/g, '_')}_Report.pdf`)}
                    className="p-2 bg-slate-50 text-teal hover:bg-teal hover:text-white rounded-xl border border-teal/20 cursor-pointer transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-wider outline-none shrink-0"
                  >
                    <FiDownload className="shrink-0" /> Report
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold py-2 text-center uppercase tracking-wide">Pathology reports will auto-appear after sample verified.</p>
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="font-black text-slate-805 text-xs">Saved Delivery Addresses</h4>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-[10px] font-black text-teal hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer uppercase tracking-wider outline-none"
              >
                <FiPlus /> Add New
              </button>
            </div>

            <AnimatePresence>
              {showAddressForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddNewAddress}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Receiver Name"
                      required
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Receiver Phone"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    required
                    value={newAddrPin}
                    onChange={(e) => setNewAddrPin(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address Line"
                    required
                    value={newAddrLine}
                    onChange={(e) => setNewAddrLine(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-sm cursor-pointer border-0 outline-none"
                  >
                    SAVE NEW ADDRESS
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-3">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((addr) => (
                  <div 
                    key={addr.id}
                    className={`p-4 bg-white border rounded-2xl flex items-start justify-between gap-3 text-xs shadow-sm ${
                      addr.isDefault ? 'border-teal/30 bg-teal-light/10' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800">{addr.name}</h4>
                        {addr.isDefault && (
                          <span className="text-[8px] font-black uppercase bg-teal text-white px-2 py-0.5 rounded">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 font-semibold mt-1">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[9.5px] text-slate-400 font-bold mt-1">PHONE: +91 {addr.phone}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => dispatch(deleteAddress(addr.id))}
                        className="p-1.5 hover:bg-slate-100 text-slate-350 hover:text-coral rounded-lg cursor-pointer border-0 bg-transparent outline-none"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      {!addr.isDefault && (
                        <button 
                          onClick={() => dispatch(setDefaultAddress(addr.id))}
                          className="p-1.5 hover:bg-slate-100 text-teal hover:underline text-[9.5px] font-black rounded cursor-pointer border-0 bg-transparent outline-none"
                        >
                          DEFAULT
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl select-none font-bold text-xs uppercase tracking-wider">
                  No saved addresses found in {locationState?.city || 'this area'}.
                </div>
              )}
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <h4 className="font-black text-slate-805 text-xs">Saved Payment Methods</h4>
              <button 
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="text-[10px] font-black text-teal hover:underline flex items-center gap-0.5 border-0 bg-transparent cursor-pointer uppercase tracking-wider outline-none"
              >
                <FiPlus /> Add New
              </button>
            </div>

            <AnimatePresence>
              {showPaymentForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddNewCard}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3"
                >
                  <input
                    type="text"
                    placeholder="Bank Name (e.g. HDFC Bank)"
                    required
                    value={cardBank}
                    onChange={(e) => setCardBank(e.target.value)}
                    className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      maxLength="16"
                      placeholder="Card Number"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g,''))}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                    <input
                      type="text"
                      maxLength="5"
                      placeholder="Expiry (MM/YY)"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black rounded-xl shadow-sm cursor-pointer border-0 outline-none"
                  >
                    SAVE PAYMENT CARD
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2.5">
              {savedCards.filter(filterByLocation).length > 0 ? (
                savedCards.filter(filterByLocation).map((card) => (
                  <div key={card.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs text-slate-655 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">💳</span>
                      <div>
                        <h4 className="font-extrabold text-slate-800">{card.bank}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">•••• •••• •••• {card.last4} • Exp {card.expiry}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1 hover:bg-slate-100 text-slate-350 hover:text-coral rounded-lg border-0 bg-transparent cursor-pointer outline-none"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl select-none font-bold text-xs uppercase tracking-wider">
                  No saved payment methods found in {locationState?.city || 'this area'}.
                </div>
              )}
            </div>
          </div>
        );
      case 'notifications':
        const mockNotifications = [
          {
            id: 'n-1',
            title: 'Prescription Verified',
            desc: 'Our pharmacist team verified your prescription for Order #ORD-89472.',
            icon: '🔔',
            city: 'Mumbai',
            pincode: '400001'
          },
          {
            id: 'n-2',
            title: 'Sample Collector Assigned',
            desc: 'Technician Amit Sen is scheduled to collect blood samples tomorrow between 08:00 AM - 10:00 AM.',
            icon: '🩸',
            city: 'Delhi',
            pincode: '110001'
          },
          {
            id: 'n-3',
            title: 'Express Delivery Partner Near You',
            desc: 'E Mediclub delivery partners are now active in your neighborhood for faster doorstep delivery.',
            icon: '🚚',
            city: 'Indore',
            pincode: '452010'
          },
          {
            id: 'n-4',
            title: 'Doctor Consultation Reminder',
            desc: 'Your scheduled session with Dr. Priya Sharma starts in 30 minutes.',
            icon: '🩺',
            city: 'Pune',
            pincode: '411001'
          },
          {
            id: 'n-5',
            title: 'Lab Collection Scheduled',
            desc: 'Home sample collector will reach your address tomorrow morning.',
            icon: '🔬',
            city: 'Chennai',
            pincode: '600001'
          }
        ];
        const filteredNotifications = mockNotifications.filter(filterByLocation);

        return (
          <div className="flex flex-col gap-3 select-none">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div key={notif.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-start gap-3 text-xs shadow-sm animate-fade-in">
                  <span className="text-base text-teal mt-0.5">{notif.icon}</span>
                  <div>
                    <h5 className="font-black text-slate-700 leading-snug">{notif.title}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">{notif.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4 text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl select-none font-bold text-xs uppercase tracking-wider">
                No notifications in {locationState?.city || 'this area'}.
              </div>
            )}
          </div>
        );
      case 'lab_cancellations':
        const cancelableLabs = filteredLabBookings.filter(b => b.status === 'Scheduled' || b.status === 'Confirmed' || b.status === 'Pending');
        return (
          <div className="flex flex-col gap-3 text-left">
            {cancelableLabs.length > 0 ? (
              cancelableLabs.map(booking => (
                <div key={booking.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex justify-between items-center text-xs shadow-sm gap-3 animate-fade-in">
                  <div>
                    <h4 className="font-extrabold text-slate-750">🔬 {booking.packageName}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1">{booking.date || booking.bookingDate} • {booking.timeSlot}</p>
                    <p className="text-[10px] text-slate-500 font-extrabold mt-1">Amount: ₹{booking.price || 799}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to cancel this booking for ${booking.packageName}?`)) {
                        dispatch(cancelLabBooking(booking.id));
                        const newRefund = {
                          id: booking.id,
                          itemName: `Lab test — ${booking.packageName}`,
                          amount: booking.price || 799,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                          status: 'Processing',
                          city: locationState?.city || 'Mumbai',
                          pincode: locationState?.pincode || '400001',
                          steps: [
                            { title: 'Cancellation confirmed', date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), status: 'done' },
                            { title: 'Refund processing', date: '3–5 business days', status: 'active', icon: 'refresh' },
                            { title: `₹${booking.price || 799} credited`, date: 'Pending', status: 'pending', icon: 'check' }
                          ]
                        };
                        setRefunds(prev => [newRefund, ...prev]);
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-black text-[10px] uppercase rounded-xl transition-all border border-rose-200/50 cursor-pointer outline-none shrink-0"
                  >
                    Cancel Booking
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold py-4 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No active lab test bookings eligible for cancellation.</p>
            )}
          </div>
        );
      case 'doctor_refunds':
        const cancelableApts = filteredAppointments.filter(apt => apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending');
        return (
          <div className="flex flex-col gap-3 text-left">
            {cancelableApts.length > 0 ? (
              cancelableApts.map(apt => (
                <div key={apt.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex justify-between items-center text-xs shadow-sm gap-3 animate-fade-in">
                  <div>
                    <h4 className="font-extrabold text-slate-750">👨‍⚕️ {apt.doctorName}</h4>
                    <p className="text-[9px] text-slate-455 font-bold uppercase tracking-wide mt-1">{apt.specialty} • {apt.type}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{apt.date || apt.appointmentDate} • {apt.timeSlot}</p>
                    <p className="text-[10px] text-slate-500 font-extrabold mt-1">Fee paid: ₹{apt.fee || 499}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to cancel your appointment with ${apt.doctorName}?`)) {
                        dispatch(cancelDoctorAppointment(apt.id));
                        const newRefund = {
                          id: apt.id,
                          itemName: `${apt.doctorName} consultation`,
                          amount: apt.fee || 499,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                          status: 'Processing',
                          city: locationState?.city || 'Mumbai',
                          pincode: locationState?.pincode || '400001',
                          steps: [
                            { title: 'Cancellation confirmed', date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), status: 'done' },
                            { title: 'Refund processing', date: '3–5 business days', status: 'active', icon: 'refresh' },
                            { title: `₹${apt.fee || 499} credited`, date: 'Pending', status: 'pending', icon: 'check' }
                          ]
                        };
                        setRefunds(prev => [newRefund, ...prev]);
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-black text-[10px] uppercase rounded-xl transition-all border border-rose-200/50 cursor-pointer outline-none shrink-0"
                  >
                    Cancel Consult
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold py-4 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No active doctor consultations eligible for cancellation.</p>
            )}
          </div>
        );
      case 'medicine_returns':
        const returnableOrders = orders.filter(filterByLocation).filter(ord => ord.status === 'Delivered');
        return (
          <div className="flex flex-col gap-3 text-left">
            {returnableOrders.length > 0 ? (
              returnableOrders.map(ord => (
                <div key={ord.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-3.5 shadow-sm text-xs animate-fade-in">
                  <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block font-mono">Order {ord.id}</span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">Delivered on standard timelines</span>
                    </div>
                    <span className="text-[10px] text-slate-700 font-extrabold">Total: ₹{ord.total}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-slate-605 font-bold pl-1 bg-slate-50 p-2.5 rounded-xl">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.name} x{item.qty}</span>
                        <span className="text-slate-800">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 select-none border-t border-slate-50 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const alreadyExists = refunds.some(r => r.id === `RF-${ord.id}`);
                        if (alreadyExists) {
                          alert("A return request has already been raised for this order.");
                          return;
                        }
                        const newRefund = {
                          id: `RF-${ord.id}`,
                          itemName: `Return: ${ord.items[0]?.name || 'Medicines'}${ord.items.length > 1 ? ' + ' + (ord.items.length - 1) + ' more' : ''}`,
                          amount: ord.total || 250,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                          status: 'Processing',
                          city: locationState?.city || 'Mumbai',
                          pincode: locationState?.pincode || '400001',
                          steps: [
                            { title: 'Return request approved', date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), status: 'done' },
                            { title: 'Item pick-up scheduled', date: 'Expected tomorrow', status: 'active', icon: 'truck' },
                            { title: 'Refund processing', date: '3-5 business days after inspection', status: 'pending', icon: 'refresh' },
                            { title: `₹${ord.total} credited`, date: 'Pending', status: 'pending', icon: 'check' }
                          ]
                        };
                        setRefunds(prev => [newRefund, ...prev]);
                        alert('Return request raised. Refund will be processed after item pick-up!');
                      }}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 font-black text-[10px] uppercase rounded-xl transition-all border border-rose-200/50 cursor-pointer outline-none"
                    >
                      Return & Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const alreadyExists = replacements.some(r => r.id === `RP-${ord.id}`);
                        if (alreadyExists) {
                          alert("A replacement request has already been raised for this order.");
                          return;
                        }
                        const newReplacement = {
                          id: `RP-${ord.id}`,
                          itemName: `Replace: ${ord.items[0]?.name || 'Medicines'}${ord.items.length > 1 ? ' + ' + (ord.items.length - 1) + ' more' : ''}`,
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                          status: 'Processing',
                          city: locationState?.city || 'Mumbai',
                          pincode: locationState?.pincode || '400001',
                          steps: [
                            { title: 'Replacement request approved', date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), status: 'done' },
                            { title: 'Item picked up', date: 'Expected tomorrow', status: 'active', icon: 'refresh' },
                            { title: 'Replacement in transit', date: 'Pending', status: 'pending', icon: 'truck' },
                            { title: 'Delivered', date: 'Pending', status: 'pending', icon: 'home' }
                          ]
                        };
                        setReplacements(prev => [newReplacement, ...prev]);
                        alert('Replacement request raised. Courier will pick up and replace the item!');
                      }}
                      className="flex-1 py-2 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-600 font-black text-[10px] uppercase rounded-xl transition-all border border-amber-200/50 cursor-pointer outline-none"
                    >
                      Replace Item
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold py-4 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No delivered orders eligible for return or replacement.</p>
            )}
          </div>
        );
      case 'replacement_status':
        return (
          <div className="flex flex-col gap-4 text-left select-none">
            {filteredReplacements.length > 0 ? (
              filteredReplacements.map(rep => (
                <div key={rep.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col animate-fade-in">
                  {/* Header */}
                  <div className="flex justify-between items-center p-3.5 border-b border-slate-50 bg-slate-50/50">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="font-extrabold text-slate-800 text-[12px] truncate">{rep.itemName}</h4>
                      <p className="text-[10px] text-slate-405 font-bold tracking-wide mt-0.5">Ticket #{rep.id} • Raised {rep.date}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      rep.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  {/* Stepper Body */}
                  <div className="p-4 flex flex-col">
                    {rep.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0 w-5">
                          {step.status === 'done' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-100 shrink-0">✓</div>
                          ) : step.status === 'active' ? (
                            <div className="w-5 h-5 rounded-full bg-[#0f6e56] text-white flex items-center justify-center text-[9px] animate-pulse border border-[#0f6e56] shrink-0">
                              {step.icon === 'truck' ? '🚚' : '⏳'}
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 text-slate-350 flex items-center justify-center text-[9px] shrink-0">○</div>
                          )}
                          {idx < rep.steps.length - 1 && (
                            <div className={`w-[1px] h-7 my-1 ${step.status === 'done' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-3.5">
                          <h5 className={`text-[12px] font-extrabold leading-tight ${step.status === 'active' ? 'text-[#0f6e56]' : step.status === 'done' ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold py-4 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No replacement tickets found.</p>
            )}
          </div>
        );
      case 'refund_status':
        return (
          <div className="flex flex-col gap-4 text-left select-none">
            {filteredRefunds.length > 0 ? (
              filteredRefunds.map(ref => {
                const isCompleted = ref.status === 'Credited';
                const displayTitle = isCompleted 
                  ? `Refund of ₹${ref.amount} sent to your upi` 
                  : `Refund processing for ₹${ref.amount}`;
                const displaySubtitle = isCompleted 
                  ? `Refund completed on ${ref.date}, 2026` 
                  : `Refund initiated on ${ref.date}, 2026`;

                return (
                  <div key={ref.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col p-4 gap-4 animate-fade-in">
                    
                    {/* Top status block */}
                    <div className="bg-[#ebf8f6] p-4 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-light/60 flex items-center justify-center text-teal shrink-0">
                        <FiRefreshCw className="w-5 h-5 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-slate-805 text-[13px] leading-snug">
                          {displayTitle}
                        </h4>
                        <p className="text-[10.5px] text-slate-500 font-medium mt-0.5">
                          {displaySubtitle}
                        </p>
                      </div>
                    </div>

                    {/* Timeline stepper */}
                    <div className="flex flex-col gap-4 pl-2 pr-2">
                      {ref.steps.map((step, idx) => {
                        const isStepDone = step.status === 'done';
                        const isStepActive = step.status === 'active';
                        return (
                          <div key={idx} className="flex gap-4 relative">
                            {/* Vertical Line */}
                            {idx < ref.steps.length - 1 && (
                              <div className={`absolute left-2.5 top-5 bottom-0 w-[2px] -translate-x-1/2 ${
                                isStepDone ? 'bg-teal' : 'bg-slate-100'
                              }`} />
                            )}
                            
                            {/* Step Icon */}
                            <div className="relative z-10">
                              {isStepDone ? (
                                <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold">
                                  ✓
                                </div>
                              ) : isStepActive ? (
                                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                                  •
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
                                  ○
                                </div>
                              )}
                            </div>

                            {/* Step Details */}
                            <div className="flex-1 min-w-0 pb-1">
                              <h5 className={`text-xs font-bold ${
                                isStepActive ? 'text-teal font-extrabold' : isStepDone ? 'text-slate-805' : 'text-slate-400'
                              }`}>
                                {step.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{step.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* RRN copy section */}
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                      <div className="min-w-0">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Refund reference number (RRN)</span>
                        <span className="text-xs font-mono font-bold text-slate-700 block mt-0.5 truncate">
                          {ref.rrn || '103460748988'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ref.rrn || '103460748988');
                          alert('RRN copied to clipboard!');
                        }}
                        className="p-2 bg-white hover:bg-slate-100 border border-slate-205 rounded-lg text-teal cursor-pointer shrink-0 transition-all active:scale-95 flex items-center justify-center"
                        title="Copy RRN"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Feedback Rating Card */}
                    <div className="flex justify-between items-center bg-slate-50/50 border border-slate-100/80 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                          <FiStar className="w-4 h-4 fill-amber-500 text-amber-505" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">How were your ordered items?</span>
                      </div>
                      <button
                        onClick={() => alert('Thank you for rating your items!')}
                        className="px-3.5 py-1.5 bg-[#1e7e34] hover:bg-[#155a24] text-white text-[10px] font-black uppercase rounded-lg border-0 cursor-pointer transition-colors shadow-sm outline-none"
                      >
                        Rate now
                      </button>
                    </div>

                    {/* Bill details */}
                    <div className="border-t border-slate-100 pt-3">
                      <h5 className="text-[11px] font-extrabold text-slate-805 uppercase tracking-wider mb-2.5">Bill details</h5>
                      <div className="flex flex-col gap-2 text-[11px] text-slate-500 font-semibold">
                        <div className="flex justify-between">
                          <span>MRP</span>
                          <span>₹{ref.billDetails?.mrp || (ref.amount + 104)}</span>
                        </div>
                        <div className="flex justify-between text-teal">
                          <span>Product discount</span>
                          <span>-₹{ref.billDetails?.discount || 56}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>Item total</span>
                          <span>₹{ref.billDetails?.itemTotal || (ref.amount + 48)}</span>
                        </div>
                        <div className="flex justify-between text-teal">
                          <span>Flat ₹50 OFF</span>
                          <span>-₹50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Handling charge</span>
                          <span>+₹2</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery charges</span>
                          <span className="text-emerald-600 font-extrabold uppercase text-[9.5px]">FREE</span>
                        </div>
                        <div className="flex justify-between font-black text-slate-805 border-t border-dashed border-slate-100 pt-2 text-xs">
                          <span>Bill total</span>
                          <span>₹{ref.amount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Repeat Order Action */}
                    <button
                      onClick={() => {
                        alert('Items re-added to cart!');
                        navigate('/cart');
                      }}
                      className="w-full py-3 bg-[#1e7e34] hover:bg-[#155a24] text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer shadow-sm transition-all active:scale-[0.99] flex flex-col items-center justify-center leading-tight mt-1 outline-none"
                    >
                      <span>Repeat Order</span>
                      <span className="text-[8px] font-bold text-emerald-200 mt-0.5 tracking-wider">VIEW CART ON NEXT STEP</span>
                    </button>

                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 font-bold py-4 text-center uppercase tracking-wide bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">No active refund tracking records.</p>
            )}
          </div>
        );
      case 'help':
        return (
          <div className="flex flex-col gap-3 text-xs select-none">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 shadow-sm">
              <h5 className="font-black text-slate-800 uppercase tracking-wide">Dedicated Support Helpdesk</h5>
              <p className="text-[10px] text-slate-505 font-semibold leading-relaxed">
                Our support agents and clinical pharmacists are available 24/7.
              </p>
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-50 text-[10px] font-bold text-slate-655">
                <div className="flex justify-between">
                  <span>Toll-Free Hotline:</span>
                  <span className="text-teal font-black">1800 200 3000</span>
                </div>
                <div className="flex justify-between">
                  <span>Support Email:</span>
                  <span className="text-teal font-black">helpdesk@emediclub.com</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-transparent select-none font-sans min-h-screen">
      
      <div className="flex flex-col gap-6 sm:grid sm:grid-cols-[250px_1fr] md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] sm:gap-6 md:gap-8">
        
        {/* Left Side: Sidebar */}
        <div className="flex flex-col gap-4">
          
          {/* 1. Header Card - Hey, [First Name]! */}
          <div className="p-3.5 border border-slate-100 shadow-premium rounded-2xl flex items-center justify-between relative overflow-hidden bg-white select-none">
            {/* Aesthetic background rings */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-light/20 rounded-full filter blur-2xl" />
            
            <div className="flex items-center gap-3 z-10">
              <div className="w-11 h-11 rounded-full bg-teal text-white text-sm font-black flex items-center justify-center shadow-sm shrink-0">
                {firstName[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-805 leading-none">Hey, {firstName}!</h2>
                <p className="text-[11px] text-slate-400 font-bold mt-1 block">
                  +91 {user?.phone || '98765 43210'}
                </p>
              </div>
            </div>

            {/* Edit Profile Button (top right) */}
            <button 
              onClick={handleOpenEditProfile}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-teal hover:text-teal-dark rounded-xl transition-all border-0 cursor-pointer outline-none flex items-center gap-1 text-[9px] font-black uppercase tracking-wider z-10"
            >
              <FiEdit className="w-3 h-3" /> Edit Profile
            </button>
          </div>

          {/* 2. Premium Membership Banner */}
          <div className="bg-gradient-to-r from-teal-dark to-teal bg-teal border border-teal/15 p-3.5 rounded-2xl text-white flex items-center justify-between gap-3 shadow-sm select-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
            <div className="z-10 text-left">
              <span className="text-[7px] bg-white/20 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">PREMIUM CARE</span>
              <h4 className="text-xs font-black mt-1 leading-none">Join Care Premium Plan</h4>
              <p className="text-[9px] text-teal-light font-bold mt-0.5 leading-snug">Save up to ₹500 on drugs & enjoy free physician checkups!</p>
            </div>
            <button 
              onClick={() => alert("Care Premium Activated! Enjoy free consults & medicine cashbacks.")}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-teal text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm border-0 cursor-pointer shrink-0 z-10 outline-none"
            >
              Join Now
            </button>
          </div>

          {/* 3. Menu List grouped in styled card decks */}
          <div className="flex flex-col gap-3.5 mt-0.5 select-none">
            {menuSections.map((section, secIdx) => (
              <div key={secIdx} className="flex flex-col text-left">
                {/* Section label */}
                <div className="text-[9px] text-slate-405 font-black uppercase tracking-widest pl-3.5 mb-1.5 mt-2 flex items-center gap-1.5">
                  <span>{section.title}</span>
                  {section.titleBadge && (
                    <span className="text-[7px] bg-blue-50 text-blue-600 border border-blue-100/50 font-black px-1 py-0.5 rounded tracking-wider uppercase">
                      {section.titleBadge}
                    </span>
                  )}
                </div>

                {/* Section card group container */}
                <div className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-premium">
                  {section.items.map((item) => {
                    const isTabActive = activeTab === item.key;
                    return (
                      <div key={item.key} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.key === 'logout') {
                              handleLogout();
                            } else {
                              toggleTab(item.key);
                            }
                          }}
                          className={`w-full py-2.5 px-3.5 flex items-center justify-between transition-colors border-0 bg-transparent text-left cursor-pointer outline-none ${
                            isTabActive ? 'sm:bg-teal-light/20' : 'hover:bg-slate-55/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                            <div className="text-sm text-teal shrink-0 flex items-center">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center flex-wrap gap-1.5">
                                <span className={`text-[11.5px] font-black truncate leading-tight ${
                                  item.isDestructive ? 'text-rose-600' : isTabActive ? 'text-teal font-extrabold' : 'text-slate-705'
                                }`}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="text-[7px] bg-teal text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subLabel && (
                                <span className="text-[9px] text-slate-400 font-bold block mt-0.5 truncate leading-none">
                                  {item.subLabel}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.activeBadge && (
                              <span className="text-[8px] bg-blue-50 text-blue-600 border border-blue-100/50 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
                                {item.activeBadge}
                              </span>
                            )}
                            <div 
                              className="text-slate-350 shrink-0 transition-transform duration-300 sm:hidden" 
                              style={{ transform: isTabActive ? 'rotate(90deg)' : 'none' }}
                            >
                              <FiChevronRight className="w-3.5 h-3.5" />
                            </div>
                            <FiChevronRight className="w-3.5 h-3.5 text-teal hidden sm:block shrink-0" />
                          </div>
                        </button>
                        
                        {/* Collapsible content section - Mobile Only */}
                        <div className="sm:hidden">
                          <AnimatePresence initial={false}>
                            {isTabActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-slate-50/45 border-t border-slate-50 px-4 py-3"
                              >
                                {renderTabContent(item.key)}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active content details - Desktop Only */}
        <div className="hidden sm:flex flex-col bg-white border border-slate-100 rounded-3xl p-6 min-h-[500px] shadow-premium">
          {activeTab ? (
            <div>
              <div className="border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">
                  {menuSections.flatMap(s => s.items).find(i => i.key === activeTab)?.label}
                </h3>
              </div>
              <div className="animate-fade-in">
                {renderTabContent(activeTab)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-20 text-slate-400 gap-4 select-none">
              <span className="text-4xl">👤</span>
              <div>
                <h4 className="font-black text-slate-700 text-sm uppercase tracking-wide">Please select an activity tab</h4>
                <p className="text-[10.5px] font-semibold text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Choose from orders, lab bookings, consultations, or settings on the left sidebar to manage your care.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Global Prescription Upload Drawer Overlay */}
      <PrescriptionUpload 
        isOpen={showGlobalUploadModal} 
        onClose={() => setShowGlobalUploadModal(false)} 
        onUploadSuccess={() => {
          alert("Prescription submitted. Our clinical support team is processing your records.");
          setActiveTab('prescriptions');
        }}
      />

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div
            key="edit-profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 relative select-none"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal to-teal-dark p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Edit Profile Details</h3>
                    <p className="text-[9px] text-teal-light/80 font-black uppercase mt-0.5">
                      Verify and edit your personal information
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleProfileSubmit(handleSaveProfile)} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...registerProfile('name')}
                    className={`w-full px-4 py-3 bg-slate-50 border ${profileErrors.name ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white`}
                  />
                  {profileErrors.name && <p className="text-coral text-[9px] font-bold px-1 mt-0.5">{profileErrors.name.message}</p>}
                </div>

                {/* Contact phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      maxLength="10"
                      placeholder="10-digit mobile number"
                      {...registerProfile('phone')}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${profileErrors.phone ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white`}
                    />
                  </div>
                  {profileErrors.phone && <p className="text-coral text-[9px] font-bold px-1 mt-0.5">{profileErrors.phone.message}</p>}
                </div>

                {/* Email address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...registerProfile('email')}
                    className={`w-full px-4 py-3 bg-slate-50 border ${profileErrors.email ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white`}
                  />
                  {profileErrors.email && <p className="text-coral text-[9px] font-bold px-1 mt-0.5">{profileErrors.email.message}</p>}
                </div>

                {/* Grid for Gender and Age */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Gender Select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Gender</label>
                    <select
                      {...registerProfile('gender')}
                      className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {profileErrors.gender && <p className="text-coral text-[9px] font-bold px-1 mt-0.5">{profileErrors.gender.message}</p>}
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Age (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g. 25"
                      {...registerProfile('age')}
                      className={`w-full px-4 py-3 bg-slate-50 border ${profileErrors.age ? 'border-coral focus:border-coral' : 'border-slate-100 focus:border-teal'} rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white`}
                    />
                    {profileErrors.age && <p className="text-coral text-[9px] font-bold px-1 mt-0.5">{profileErrors.age.message}</p>}
                  </div>
                </div>

                {/* Notification Check */}
                <div className="bg-teal-light/20 p-4 rounded-2xl border border-teal/10 mt-2 flex items-start gap-3">
                  <span className="text-base text-teal leading-none">🛡️</span>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Secure Verified Account</h4>
                    <p className="text-[9.5px] text-slate-500 font-semibold leading-relaxed mt-1">
                      Edits will update your active clinical records instantly, maintaining absolute safety and sync with your local orders.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 border-t border-slate-50 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm cursor-pointer transition-colors border-0"
                  >
                    Save Changes
                  </button>
                </div>

              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Customer Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            key="feedback-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 relative select-none"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Share Your Feedback</h3>
                    <p className="text-[9px] text-amber-100 font-black uppercase mt-0.5">
                      Help us improve our clinical services
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFeedbackSubmit} className="p-6 flex flex-col gap-5">
                <div className="text-center flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {feedbackType === 'lab' ? 'Pathology Test Service' : 'Consultation Service'}
                  </span>
                  <h4 className="text-base font-black text-slate-805">
                    {feedbackType === 'lab' ? `🔬 ${feedbackName}` : `👨‍⚕️ ${feedbackName}`}
                  </h4>
                </div>

                {/* Stars container */}
                <div className="flex flex-col items-center gap-2 border-y border-slate-50 py-4 my-1">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((starIdx) => (
                      <button
                        key={starIdx}
                        type="button"
                        onClick={() => setRatingVal(starIdx)}
                        onMouseEnter={() => setHoveredStar(starIdx)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="text-3xl focus:outline-none transition-transform hover:scale-110 cursor-pointer bg-transparent border-0"
                      >
                        <span 
                          className={`transition-colors duration-150 ${
                            starIdx <= (hoveredStar || ratingVal) 
                              ? 'text-amber-500' 
                              : 'text-slate-200'
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Text representation of ratings */}
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/40">
                    {ratingVal === 1 && '⭐ Poor'}
                    {ratingVal === 2 && '⭐⭐ Fair'}
                    {ratingVal === 3 && '⭐⭐⭐ Good'}
                    {ratingVal === 4 && '⭐⭐⭐⭐ Very Good'}
                    {ratingVal === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
                  </span>
                </div>

                {/* Review comment field */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Review Comments</label>
                  <textarea
                    rows="3"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write a brief comment about your overall experience..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-amber-500 rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white resize-none"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-2 border-t border-slate-50 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm cursor-pointer transition-colors border-0"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global Prescription Upload Modal */}
      <PrescriptionUpload 
        isOpen={showGlobalUploadModal} 
        onClose={() => setShowGlobalUploadModal(false)} 
        onUploadSuccess={(newRx) => {
          if (newRx) {
            setSelectedRxForReview(newRx);
            setShowReviewModal(true);
          }
        }}
      />

      {/* Prescription Review Details Modal */}
      <PrescriptionReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        prescription={selectedRxForReview}
      />

      {/* Action / View Details Modal */}
      <ViewDetailsModal 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        type={actionModal.type}
        data={actionModal.data}
      />

    </div>
  );
}
