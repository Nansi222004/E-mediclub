import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMapPin, FiCalendar, FiClock, FiTrash2, FiPlus, 
  FiLogOut, FiEdit, FiCheck, FiShield, FiHeart, FiFileText, FiActivity, FiCreditCard, FiShoppingBag, FiDownload,
  FiChevronRight, FiBell, FiChevronDown, FiX, FiInfo, FiUploadCloud
} from 'react-icons/fi';
import { logout, addAddress, deleteAddress, setDefaultAddress, updateUserProfile } from '../../auth/store/authSlice';
import { addToCart } from '../store/cartSlice';
import { submitAppointmentFeedback, submitLabFeedback, updateOrderStatus } from '../store/productSlice';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';
import PrescriptionReviewModal from '../../../shared/components/PrescriptionReviewModal';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { user, isAuthenticated, addresses = [] } = useSelector(state => state.auth);
  const { appointments = [], labBookings = [], orders = [], prescriptions = [] } = useSelector(state => state.products);

  // Edit Profile States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState('Male');
  const [editAge, setEditAge] = useState('');

  const handleOpenEditProfile = () => {
    setEditName(user?.name || 'Rishi');
    setEditEmail(user?.email || 'rishi@emediclub.com');
    setEditPhone(user?.phone || '9892989898');
    setEditGender(user?.gender || 'Male');
    setEditAge(user?.age || '25');
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName || !editPhone) {
      alert("Name and Phone are mandatory!");
      return;
    }
    dispatch(updateUserProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      gender: editGender,
      age: editAge
    }));
    setShowEditProfileModal(false);
  };
  const [activeTab, setActiveTab] = useState(null); // 'orders', 'labs', 'consultations', 'prescriptions', 'records', 'payments', 'notifications', 'help'
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');

  // Payment methods states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: 'c-1', bank: 'HDFC Bank Credit Card', last4: '9874', expiry: '12/28' },
    { id: 'c-2', bank: 'ICICI Bank Debit Card', last4: '3412', expiry: '05/29' }
  ]);
  const [cardBank, setCardBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [showGlobalUploadModal, setShowGlobalUploadModal] = useState(false);
  const [selectedRxForReview, setSelectedRxForReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
      expiry: cardExpiry
    };
    setSavedCards(prev => [...prev, newCard]);
    setCardBank('');
    setCardNumber('');
    setCardExpiry('');
    setShowPaymentForm(false);
  };

  const handleDeleteCard = (id) => {
    setSavedCards(prev => prev.filter(c => c.id !== id));
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

  // Filter consultations
  const upcomingAppointments = appointments.filter(apt => {
    if (apt.date && apt.date < getTodayStrGlobal()) return false;
    return apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending';
  });
  const pastAppointments = appointments.filter(apt => {
    if (apt.date && apt.date < getTodayStrGlobal()) return true;
    return apt.status === 'Completed' || apt.status === 'Cancelled';
  });

  // Filter completed lab bookings
  const completedLabBookings = labBookings.filter(b => b.status === 'Completed' || b.status === 'Verified' || new Date(b.date) < new Date());

  const displayName = user?.name === 'Super Admin' ? 'Clinical Admin' : (user?.name || 'User');
  const firstName = displayName.split(' ')[0];

  const menuItems = [
    { key: 'orders', label: 'My Orders', icon: <FiShoppingBag /> },
    { key: 'labs', label: 'My Lab Test Bookings', icon: <FiActivity /> },
    { key: 'consultations', label: 'My Consultations', icon: <FiClock /> },
    { key: 'prescriptions', label: 'My Prescriptions', icon: <FiFileText /> },
    { key: 'records', label: 'Health Records', icon: <FiHeart />, badge: 'BETA' },
    { key: 'addresses', label: 'Manage Delivery Addresses', icon: <FiMapPin /> },
    { key: 'payments', label: 'Manage Payment Methods', icon: <FiCreditCard /> },
    { key: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { key: 'help', label: 'Help & Support', icon: <FiInfo /> },
    { key: 'logout', label: 'Logout', icon: <FiLogOut /> }
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
        const activeOrders = orders.filter(ord => ord.status !== 'Delivered' && !ord.archived);
        const pastOrders = orders.filter(ord => ord.status === 'Delivered' && !ord.archived);
        
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
                        <button
                          type="button"
                          onClick={() => handleSimulateProgress(ord.id, ord.status)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-800 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-150 cursor-pointer outline-none shrink-0"
                        >
                          Next Step ➔
                        </button>
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
                      <button
                        type="button"
                        onClick={() => handleOrderAgain(ord.items)}
                        className="px-4 py-2 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl border-0 cursor-pointer shadow-sm transition-colors outline-none"
                      >
                        Order Again
                      </button>
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
          if (!bk.date) return false;
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const tStr = `${year}-${month}-${day}`;
          
          if (bk.date < tStr) return false;
          if (bk.date > tStr) return true;
          
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
        const upcomingLabs = labBookings.filter(isLabBookingActiveObj);
        const pastLabs = labBookings.filter(bk => !isLabBookingActiveObj(bk));

        return (
          <div className="flex flex-col gap-5">
            {/* Upcoming Diagnostic Bookings */}
            {upcomingLabs.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] text-teal font-black uppercase tracking-wider pl-1">Upcoming Collections</h5>
                <div className="flex flex-col gap-3">
                  {upcomingLabs.map((booking) => (
                    <div key={booking.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex justify-between items-center text-xs shadow-sm gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                          <img
                            src={booking.image || 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80'}
                            alt={booking.packageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-750 truncate">🔬 {booking.packageName}</h4>
                          <p className="text-[9px] text-slate-405 uppercase font-bold tracking-wide mt-0.5 truncate">{booking.date} • {booking.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-teal bg-teal-light/50 border border-teal/10 px-2.5 py-0.5 rounded-full uppercase font-black">{booking.status}</span>
                        <button 
                          onClick={() => navigate('/lab-tests')} 
                          className="px-3 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase rounded-lg border-0 cursor-pointer shadow-sm outline-none"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Diagnostic Bookings */}
            <div className="flex flex-col gap-2.5">
              <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider pl-1">Past Collections History</h5>
              {pastLabs.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {pastLabs.map((booking) => (
                    <div key={booking.id} className="bg-white p-4 border border-slate-100 rounded-2xl flex flex-col gap-3 text-xs shadow-sm">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal/10 shrink-0">
                            <img
                              src={booking.image || 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80'}
                              alt={booking.packageName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-750 truncate">🔬 {booking.packageName}</h4>
                            <p className="text-[9px] text-slate-405 uppercase font-bold tracking-wide mt-0.5 truncate">{booking.date} • {booking.timeSlot}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-405 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full uppercase font-black shrink-0">Completed</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-slate-50 pt-2.5 mt-1 select-none">
                        {booking.isRated ? (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-1">
                              <span className="text-amber-500 text-sm font-bold flex items-center gap-0.5">
                                {"★".repeat(booking.rating)}{"☆".repeat(5 - booking.rating)}
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-extrabold uppercase ml-1">({booking.rating}.0 Rated)</span>
                            </div>
                            {booking.feedback && (
                              <p className="text-[10px] text-slate-450 italic font-semibold">"{booking.feedback}"</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[9.5px] text-slate-400 font-bold uppercase">How was your service?</span>
                            <button
                              onClick={() => handleOpenFeedback('lab', booking.id, booking.packageName)}
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
          if (!apt.date) return false;
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const tStr = `${year}-${month}-${day}`;
          
          if (apt.date < tStr) return false;
          if (apt.date > tStr) return true;
          
          const parts = apt.timeSlot.split(' - ');
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

        const todayStr = getTodayStr();
        const upcomingApts = appointments.filter(isAppointmentActive);
        const pastApts = appointments.filter(apt => !isAppointmentActive(apt));

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
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{apt.date} • {apt.timeSlot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-teal bg-teal-light/50 border border-teal/10 px-2.5 py-0.5 rounded-full uppercase font-black">{apt.status}</span>
                        {apt.type.includes('Online') && (apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending') && (
                          <button 
                            onClick={() => navigate('/doctor-appointments')} 
                            className="px-3 py-1.5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase rounded-lg border-0 cursor-pointer shadow-sm outline-none"
                          >
                            Join Call
                          </button>
                        )}
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
                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{apt.date} • {apt.timeSlot}</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-405 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full uppercase font-black shrink-0">Completed</span>
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

            {prescriptions && prescriptions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {prescriptions.map((rx) => (
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
              {addresses.map((addr) => (
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
              ))}
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
              {savedCards.map((card) => (
                <div key={card.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center text-xs text-slate-600 shadow-sm">
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
              ))}
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="flex flex-col gap-3 select-none">
            <div className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-start gap-3 text-xs shadow-sm">
              <span className="text-base text-teal mt-0.5">🔔</span>
              <div>
                <h5 className="font-black text-slate-700 leading-snug">Prescription Verified</h5>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Our pharmacist team verified your prescription for Order #ORD-89472.</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-start gap-3 text-xs shadow-sm">
              <span className="text-base text-teal mt-0.5">🩸</span>
              <div>
                <h5 className="font-black text-slate-700 leading-snug">Sample Collector Assigned</h5>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Technician Amit Sen is scheduled to collect blood samples tomorrow between 08:00 AM - 10:00 AM.</p>
              </div>
            </div>
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
    <div className="max-w-xl mx-auto pb-16 px-4 bg-white select-none font-sans min-h-screen">
      
      {/* 1. Header Card - Hey, [First Name]! */}
      <div className="p-5 border border-slate-100 shadow-premium rounded-3xl flex items-center justify-between relative overflow-hidden bg-white select-none mt-4">
        {/* Aesthetic background rings */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-light/20 rounded-full filter blur-2xl" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-full bg-teal text-white text-xl font-black flex items-center justify-center shadow-sm shrink-0">
            {firstName[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-805 leading-snug">Hey, {firstName}!</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1 block">
              +91 {user?.phone || '98765 43210'}
            </p>
          </div>
        </div>

        {/* Edit Profile Button (top right) */}
        <button 
          onClick={handleOpenEditProfile}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-teal hover:text-teal-dark rounded-xl transition-all border-0 cursor-pointer outline-none flex items-center gap-1 text-[10px] font-black uppercase tracking-wider z-10"
        >
          <FiEdit className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* 2. Premium Membership Banner */}
      <div className="bg-gradient-to-r from-teal-dark to-teal bg-teal border border-teal/15 p-5 rounded-[24px] text-white flex items-center justify-between gap-4 mt-4 shadow-sm select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        <div className="z-10">
          <span className="text-[7.5px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">E-MEDICLUB PREMIUM</span>
          <h4 className="text-xs font-black mt-2 leading-none">Join Care Premium Plan</h4>
          <p className="text-[9.5px] text-teal-light font-bold mt-1 leading-snug">Save up to ₹500 on drugs & enjoy free physician checkups!</p>
        </div>
        <button 
          onClick={() => alert("Care Premium Activated! Enjoy free consults & medicine cashbacks.")}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-teal text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm border-0 cursor-pointer shrink-0 z-10 outline-none"
        >
          Join Now
        </button>
      </div>

      {/* 3. Menu List with Icons & Right Arrow Chevrons */}
      <div className="mt-6 flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-premium">
        {menuItems.map((item) => (
          <div key={item.key} className="flex flex-col">
            <button
              onClick={() => {
                if (item.key === 'logout') {
                  handleLogout();
                } else {
                  toggleTab(item.key);
                }
              }}
              className="w-full py-4.5 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors border-0 bg-transparent text-left cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-teal text-base shrink-0 flex items-center">
                  {item.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-700">{item.label}</span>
                  {item.badge && (
                    <span className="text-[7.5px] bg-teal text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-slate-350 shrink-0 transition-transform duration-300" style={{ transform: activeTab === item.key ? 'rotate(90deg)' : 'none' }}>
                <FiChevronRight className="w-4 h-4" />
              </div>
            </button>
            
            {/* Collapsible content section */}
            <AnimatePresence initial={false}>
              {activeTab === item.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden bg-slate-50/30 border-t border-slate-50 px-5 py-4"
                >
                  {renderTabContent(item.key)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
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
              <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                </div>

                {/* Contact phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                </div>

                {/* Grid for Gender and Age */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Gender Select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Age (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="e.g. 25"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                    />
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

    </div>
  );
}
