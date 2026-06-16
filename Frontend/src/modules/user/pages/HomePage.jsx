import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiCheckCircle, FiActivity,
  FiClock, FiTrendingUp, FiBookmark, FiDownload, FiPhoneCall, FiAward,
  FiUploadCloud, FiFilter, FiCalendar, FiHeart
} from 'react-icons/fi';
import ProductCard from '../../../shared/components/ProductCard';
import LabTestCard from '../../../shared/components/LabTestCard';
import DoctorCard from '../../../shared/components/DoctorCard';
import AnimatedBanner from '../../../shared/components/AnimatedBanner';
import Shimmer from '../../../shared/components/Shimmer';
import { setSelectedCategory, setSearchTerm, setPrescriptionFilterActive, normalizeCity } from '../store/productSlice';
import MedicinesFilter from '../../../shared/components/MedicinesFilter';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';
function ImageWithFallback({ src, alt, initials, colorClass }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-tr from-teal/20 to-emerald-100 text-teal-dark font-black text-sm uppercase`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}


export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Selectors from products store
  const { medicines, labTests, doctors, labs = [], location: locationState, selectedLocation, appointments = [], labBookings = [], isLoading } = useSelector(state => state.products);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const city = locationState?.city;

  // States
  const [currentBanner, setCurrentBanner] = useState(0);
  const [filters, setFilters] = useState({
    category: 'All',
    brand: null,
    minPrice: 0,
    maxPrice: Infinity,
    inStock: null,
    hasDiscount: null
  });

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      brand: null,
      minPrice: 0,
      maxPrice: Infinity,
      inStock: null,
      hasDiscount: null
    });
  };


  // Mock Banner Carousel items
  const banners = [
    {
      id: 1,
      title: 'Flat 20% OFF on Medicines',
      subtitle: 'Plus extra 5% cashback on Ayurveda items.',
      code: 'MEDICLUB20',
      bg: 'linear-gradient(135deg, #0A5C36 0%, #0D9488 100%)',
      badge: 'MONSOON SALE'
    },
    {
      id: 2,
      title: 'Full Body Diagnostic Checkups',
      subtitle: 'Complete blood checks with Free Home Sample Collection.',
      code: 'GOLDTEST',
      bg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
      badge: 'LAB PROMO'
    },
    {
      id: 3,
      title: 'Online Video Consultations',
      subtitle: 'Connect with certified specialists inside 15 minutes.',
      code: 'CONSULT100',
      bg: 'linear-gradient(135deg, #1E293B 0%, #0F766E 100%)',
      badge: 'DOCTOR CARE'
    }
  ];

  const featuredCategories = [
    {
      name: 'Medicines',
      route: '/medicines',
      category: 'Medicines',
      accent: 'from-emerald-50 to-white',
      color: 'text-emerald-600',
      icon: '💊',
      bg: 'bg-emerald-50'
    },
    {
      name: 'Labs',
      route: '/lab-tests',
      category: '',
      accent: 'from-cyan-50 to-white',
      color: 'text-cyan-600',
      icon: '🔬',
      bg: 'bg-cyan-50'
    },
    {
      name: 'Doctors',
      route: '/doctor-appointments',
      category: '',
      accent: 'from-teal-50 to-white',
      color: 'text-teal-600',
      icon: '👨‍⚕️',
      bg: 'bg-teal-50'
    },
  ];

  const featuredBrands = React.useMemo(() => {
    const brandColors = [
      'text-slate-900',
      'text-emerald-700',
      'text-teal-700',
      'text-violet-700',
      'text-fuchsia-700',
      'text-blue-700'
    ];
    const seen = new Map();
    medicines.forEach((item) => {
      if (!item?.brand || seen.has(item.brand)) return;
      seen.set(item.brand, {
        name: item.brand,
        image: item.image,
        color: brandColors[seen.size % brandColors.length]
      });
    });
    return Array.from(seen.values()).slice(0, 6);
  }, [medicines]);

  const careQuote = {
    quote: 'Good health is built in the small choices we repeat every day.',
    author: 'E Mediclub Care Desk'
  };

  const homeStory = {
    label: 'E Mediclub Picks',
    title: 'Care that feels fast, friendly, and right where you are.',
    description: 'Find medicines, book doctors, and schedule diagnostics with local offers, responsive pages, and a smoother health journey.',
    cta: 'Explore More',
    route: '/categories'
  };

  const getCityKey = (loc) => {
    if (!loc) return 'Mumbai, Maharashtra';
    const normalized = loc.toLowerCase();
    if (normalized.includes('mumbai')) return 'Mumbai, Maharashtra';
    if (normalized.includes('bengaluru') || normalized.includes('bangalore')) return 'Bengaluru, Karnataka';
    if (normalized.includes('delhi')) return 'New Delhi, Delhi';
    if (normalized.includes('hyderabad')) return 'Hyderabad, Telangana';
    if (normalized.includes('pune')) return 'Pune, Maharashtra';
    if (normalized.includes('chennai')) return 'Chennai, Tamil Nadu';
    if (normalized.includes('kolkata')) return 'Kolkata, West Bengal';
    if (normalized.includes('ahmedabad')) return 'Ahmedabad, Gujarat';
    if (normalized.includes('indore')) return 'Indore, Madhya Pradesh';
    if (normalized.includes('bhopal')) return 'Bhopal, Madhya Pradesh';
    if (normalized.includes('ujjain')) return 'Ujjain, Madhya Pradesh';
    if (normalized.includes('dewas')) return 'Dewas, Madhya Pradesh';
    return 'Mumbai, Maharashtra'; // Default fallback
  };

  const cityKey = getCityKey(selectedLocation);

  const getDynamicCategoryObj = (key) => {
    switch (key) {
      case 'Bengaluru, Karnataka':
        return { name: 'Sports Nutrition', icon: '🏋️‍♂️', desc: 'Sports Nutrition', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'New Delhi, Delhi':
        return { name: 'Respiratory Care', icon: '🫁', desc: 'Breathing Care', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Hyderabad, Telangana':
        return { name: 'Diabetes Care', icon: '🩸', desc: 'Diabetes Care', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Pune, Maharashtra':
        return { name: 'Homeopathy', icon: '🥛', desc: 'Natural Tonics', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Chennai, Tamil Nadu':
        return { name: 'Geriatric Care', icon: '👵', desc: 'Geriatric Care', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Kolkata, West Bengal':
        return { name: 'Herbal Extracts', icon: '🍯', desc: 'Herbal Extracts', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Ahmedabad, Gujarat':
        return { name: 'Cardiac Care', icon: '❤️', desc: 'Cardiac Care', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Indore, Madhya Pradesh':
        return { name: 'Homeopathy', icon: '🥛', desc: 'Natural Tonics', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Bhopal, Madhya Pradesh':
        return { name: 'Respiratory Care', icon: '🫁', desc: 'Breathing Care', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Ujjain, Madhya Pradesh':
        return { name: 'Ayurveda', icon: '🌿', desc: 'Natural Herbs', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      case 'Dewas, Madhya Pradesh':
        return { name: 'Homeopathy', icon: '🥛', desc: 'Natural Tonics', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
      default:
        return { name: 'Devices', icon: '🩸', desc: 'Health Monitors', route: '/categories', color: 'bg-indigo-50 text-indigo-600' };
    }
  };

  const dynamicCategory = getDynamicCategoryObj(cityKey);

  // Quick categories configuration
  const quickCategories = [
    { name: 'Medicines', icon: '💊', desc: 'Prescription Drugs', route: '/medicines', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Lab Tests', icon: '🧪', desc: 'Diagnostic Kits', route: '/lab-tests', color: 'bg-teal-50 text-teal-600' },
    { name: 'Doctors', icon: '👨‍⚕️', desc: 'Expert Doctors', route: '/doctor-appointments', color: 'bg-blue-50 text-blue-600' },
    { name: 'Ayurveda', icon: '🌿', desc: 'Natural Herbs', route: '/ayurveda', color: 'bg-amber-50 text-amber-600' },
    { name: 'Wellness', icon: '🧘', desc: 'Fitness & Care', route: '/wellness', color: 'bg-emerald-50 text-emerald-600' }
  ];

  // Dynamic products priorities by location
  const locationPriorities = {
    'Mumbai, Maharashtra': ['med-4', 'med-1', 'med-10', 'med-2', 'med-6', 'med-9'],
    'Bengaluru, Karnataka': ['med-3', 'med-6', 'med-11', 'med-1', 'med-9', 'med-2'],
    'New Delhi, Delhi': ['med-13', 'med-3', 'med-12', 'med-6', 'med-2', 'med-11'],
    'Hyderabad, Telangana': ['med-5', 'med-2', 'med-9', 'med-12', 'med-1', 'med-10'],
    'Pune, Maharashtra': ['med-8', 'med-1', 'med-4', 'med-3', 'med-6', 'med-11'],
    'Chennai, Tamil Nadu': ['med-6', 'med-9', 'med-12', 'med-2', 'med-1', 'med-10'],
    'Kolkata, West Bengal': ['med-3', 'med-8', 'med-11', 'med-6', 'med-1', 'med-2'],
    'Ahmedabad, Gujarat': ['med-2', 'med-4', 'med-5', 'med-12', 'med-9', 'med-6'],
    'Indore, Madhya Pradesh': ['med-2', 'med-4', 'med-10', 'med-1', 'med-3', 'med-6'],
    'Bhopal, Madhya Pradesh': ['med-13', 'med-3', 'med-2', 'med-1', 'med-6', 'med-9'],
    'Ujjain, Madhya Pradesh': ['med-3', 'med-8', 'med-11', 'med-2', 'med-1', 'med-6'],
    'Dewas, Madhya Pradesh': ['med-2', 'med-1', 'med-3', 'med-6', 'med-8', 'med-11']
  };

  const getPrioritizedMedicines = (list, loc) => {
    if (!list || list.length === 0) return [];
    const normalized = (loc || '').toLowerCase();
    let key = 'Mumbai, Maharashtra';
    if (normalized.includes('mumbai')) key = 'Mumbai, Maharashtra';
    else if (normalized.includes('bengaluru') || normalized.includes('bangalore')) key = 'Bengaluru, Karnataka';
    else if (normalized.includes('delhi')) key = 'New Delhi, Delhi';
    else if (normalized.includes('hyderabad')) key = 'Hyderabad, Telangana';
    else if (normalized.includes('pune')) key = 'Pune, Maharashtra';
    else if (normalized.includes('chennai')) key = 'Chennai, Tamil Nadu';
    else if (normalized.includes('kolkata')) key = 'Kolkata, West Bengal';
    else if (normalized.includes('ahmedabad')) key = 'Ahmedabad, Gujarat';
    else if (normalized.includes('indore')) key = 'Indore, Madhya Pradesh';
    else if (normalized.includes('bhopal')) key = 'Bhopal, Madhya Pradesh';
    else if (normalized.includes('ujjain')) key = 'Ujjain, Madhya Pradesh';
    else if (normalized.includes('dewas')) key = 'Dewas, Madhya Pradesh';

    const priorityIds = locationPriorities[key] || locationPriorities['Mumbai, Maharashtra'];
    return [...list].sort((a, b) => {
      const idxA = priorityIds.indexOf(a.id);
      const idxB = priorityIds.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  };

  const prioritizedMedicines = getPrioritizedMedicines(medicines, selectedLocation);
  const pincode = locationState?.pincode ? locationState.pincode.trim() : '';

  let cityFilteredDoctors = pincode ? doctors.filter(doc => doc.pincode === pincode) : [];
  if (cityFilteredDoctors.length === 0 && city) {
    cityFilteredDoctors = doctors.filter(doc => doc.city && normalizeCity(doc.city).toLowerCase() === city.toLowerCase());
  }
  const homeDoctors = (pincode || city) ? cityFilteredDoctors : doctors;

  let cityFilteredLabs = pincode ? labs.filter(lab => lab.pincode === pincode) : [];
  if (cityFilteredLabs.length === 0 && city) {
    cityFilteredLabs = labs.filter(lab => lab.city && normalizeCity(lab.city).toLowerCase() === city.toLowerCase());
  }
  const homeLabTests = (pincode || city)
    ? labTests.filter(test => cityFilteredLabs.some(l => 
        l.name.toLowerCase().includes(test.labName.toLowerCase()) || 
        test.labName.toLowerCase().includes(l.name.toLowerCase())
      ))
    : labTests;

  let cityFilteredMedicines = pincode ? prioritizedMedicines.filter(med => med.vendorPincode === pincode) : [];
  if (cityFilteredMedicines.length === 0 && city) {
    cityFilteredMedicines = prioritizedMedicines.filter(med => med.vendorCity && normalizeCity(med.vendorCity).toLowerCase() === city.toLowerCase());
  }
  const homeMedicinesRaw = (pincode || city) ? cityFilteredMedicines : prioritizedMedicines;

  // Defensive deduplication to ensure no repeated products on the home page
  const homeMedicines = React.useMemo(() => {
    const unique = new Map();
    homeMedicinesRaw.forEach(med => {
      if (!unique.has(med.name)) {
        unique.set(med.name, med);
      }
    });
    return Array.from(unique.values());
  }, [homeMedicinesRaw]);

  const filteredMedicines = React.useMemo(() => {
    let result = homeMedicines;
    
    if (filters.category !== 'All') {
      result = result.filter(m => m.category === filters.category);
    }
    if (filters.brand) {
      result = result.filter(m => m.brand === filters.brand);
    }
    if (filters.minPrice !== undefined) {
      const min = Number(filters.minPrice);
      result = result.filter(m => (m.discountPrice || m.price) >= min);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== Infinity) {
      const max = Number(filters.maxPrice);
      result = result.filter(m => (m.discountPrice || m.price) <= max);
    }
    if (filters.inStock) {
      result = result.filter(m => m.inStock);
    }
    if (filters.hasDiscount) {
      result = result.filter(m => m.discountPercent > 0 || m.discountPrice);
    }
    
    return result;
  }, [homeMedicines, filters]);

  const doctorsTitle = `Doctors in ${city || 'your area'}`;
  const labsTitle = `Labs in ${city || 'your area'}`;
  const medicinesTitle = `Trending in ${city || 'your area'}`;
  const localCityLabel = city || 'your area';

  // Promo Coupons
  const coupons = [
    { code: 'MEDICLUB20', desc: 'Flat 20% discount on order above ₹499' },
    { code: 'FREECOLLECT', desc: 'Free diagnostic home sample collection' },
    { code: 'WELCOME100', desc: 'Flat ₹100 OFF on your first purchase' }
  ];

  // Blog articles
  const articles = [
    {
      id: 1,
      title: '5 Herbs to Natural Immunity Strengthening',
      tag: 'AYURVEDA',
      readTime: '4 Min Read',
      summary: 'Explore time-tested wellness practices utilizing Neem, Giloy, Ashwagandha, and Turmeric for immune vigor.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&h=200&q=80'
    },
    {
      id: 2,
      title: 'Managing Blood Sugar Levels: Tips & Diet',
      tag: 'DIABETES',
      readTime: '6 Min Read',
      summary: 'A clinical checklist detailing low-glycemic meals, timing guidelines, and activity levels for glucose balance.',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=300&h=200&q=80'
    }
  ];

  // Auto sliding carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickCategoryClick = (cat) => {
    if (cat.route) {
      if (cat.name !== 'Doctors' && cat.name !== 'Lab Tests') {
        dispatch(setSelectedCategory(cat.name));
      }
      navigate(cat.route);
    }
  };

  const cityHasDoctors = homeDoctors.length > 0;
  const cityHasLabs = homeLabTests.length > 0;
  const cityHasMedicines = filteredMedicines.length > 0;
  const showUpcomingSection = false;

  return (
    <div className="pb-10 font-sans">

      {/* ================= UPCOMING BOOKINGS BANNER (Both views) ================= */}
      <AnimatePresence>
        {showUpcomingSection && (
          <motion.section
            key="upcoming-section"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 flex flex-col gap-3"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
                </span>
                <h2 className="text-xs md:text-sm font-black text-slate-800 tracking-tight">
                  {user?.name ? `Hey ${user.name.split(' ')[0]}, ` : ''}Upcoming Bookings
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-[9px] font-bold text-teal uppercase tracking-wider bg-transparent border-0 cursor-pointer hover:underline"
                >
                  View All
                </button>
                <button
                  onClick={() => setDismissedUpcoming(true)}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent text-slate-400"
                  title="Dismiss"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible no-scrollbar gap-3 -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0">

              {/* Doctor Appointment Cards */}
              {upcomingAppointments.slice(0, 2).map((appt, idx) => (
                <motion.div
                  key={appt.id || idx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.07 }}
                  onClick={() => navigate('/profile')}
                  className="shrink-0 w-[270px] md:w-auto cursor-pointer bg-gradient-to-br from-teal/10 to-blue-50 border border-teal/20 rounded-2xl p-4 flex flex-col gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-teal uppercase tracking-wider bg-teal/10 px-2 py-0.5 rounded-full">
                      <FiUser className="w-2.5 h-2.5" /> Doctor
                    </span>
                    <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    {appt.avatar ? (
                      <img src={appt.avatar} alt={appt.doctorName} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                        <FiUser className="text-teal w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 truncate">{appt.doctorName}</p>
                      <p className="text-[9px] text-slate-500 font-semibold truncate">{appt.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold bg-white/60 rounded-lg px-2.5 py-1.5">
                    <FiCalendar className="text-teal shrink-0" />
                    <span className="truncate">{appt.date} • {appt.timeSlot?.split(' - ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[8.5px] text-slate-400 font-bold">
                    <FiClock className="shrink-0" />
                    <span className="truncate">{appt.type || 'Consultation'}</span>
                  </div>
                </motion.div>
              ))}

              {/* Lab Booking Cards */}
              {upcomingLabBookings.slice(0, 2).map((booking, idx) => (
                <motion.div
                  key={booking.id || idx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (upcomingAppointments.slice(0, 2).length + idx) * 0.07 }}
                  onClick={() => navigate('/profile')}
                  className="shrink-0 w-[270px] md:w-auto cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 flex flex-col gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-purple-600 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded-full">
                      🧪 Lab Test
                    </span>
                    <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">{booking.packageName}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Home Collection</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-semibold bg-white/60 rounded-lg px-2.5 py-1.5">
                    <FiCalendar className="text-purple-500 shrink-0" />
                    <span className="truncate">{booking.date} • {booking.timeSlot?.split(' (')[0]}</span>
                  </div>
                  {booking.address && (
                    <div className="text-[8.5px] text-slate-400 font-bold truncate">
                      📍 {booking.address}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-col gap-10">
        {/* 1. Category Rail */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FiActivity className="text-teal" /> Shop by Category
            </h2>
            <button
              onClick={() => navigate('/categories')}
              className="text-[10px] font-black uppercase tracking-wider text-teal bg-transparent border-0 cursor-pointer"
            >
              Browse All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickCategories.map((cat) => (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                key={cat.name}
                onClick={() => {
                  if (cat.name === 'Medicines') {
                    dispatch(setSelectedCategory('Medicines'));
                  }
                  navigate(cat.route);
                }}
                className="bg-white rounded-[22px] p-4 border border-slate-100 shadow-premium hover:shadow-premium-hover flex flex-col items-center justify-center text-center cursor-pointer select-none group transition-all duration-300"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${cat.color.split(' ')[0]} shadow-sm flex items-center justify-center overflow-hidden mb-3`}>
                  <span className="text-2xl md:text-3xl leading-none">{cat.icon}</span>
                </div>
                <h3 className="text-sm md:text-base font-black text-slate-800 leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mt-1">
                  {cat.desc}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 2. Editorial Promo Text */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-100 border border-teal-200 shadow-premium p-5 md:p-6"
        >
          <div className="absolute -top-6 right-0 w-40 h-40 bg-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-forest/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                  {homeStory.label}
                </span>
                <div className="w-20 sm:w-28">
                  <Shimmer type="text" count={1} className="opacity-70" />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-tight">
                {homeStory.title}
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 font-semibold leading-relaxed mt-2 max-w-xl">
                {homeStory.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex flex-col gap-2 w-24">
                <div className="h-2 rounded-full shimmer-element" />
                <div className="h-2 rounded-full shimmer-element w-4/5" />
                <div className="h-2 rounded-full shimmer-element w-2/3" />
              </div>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(homeStory.route)}
                className="px-4.5 py-2.5 min-h-[44px] bg-forest hover:bg-forest-dark text-white font-black text-xs rounded-full shadow-sm border-0 cursor-pointer whitespace-nowrap"
              >
                {homeStory.cta}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* 3. Featured Brands */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FiBookmark className="text-teal" /> Featured Brands
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Medicines in {localCityLabel}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredBrands.map((brand) => (
              <motion.button
                key={brand.name}
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                onClick={() => {
                  dispatch(setSearchTerm(brand.name));
                  dispatch(setSelectedCategory('Medicines'));
                  navigate('/categories');
                }}
                className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-premium flex flex-col items-center justify-center text-center min-h-[126px] hover:shadow-premium-hover transition-all duration-300 outline-none cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 shadow-inner overflow-hidden flex items-center justify-center">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className={`text-sm font-black ${brand.color}`}>
                      {brand.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-3">
                  Used Here
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 4. Quote Card */}
        <section className="bg-gradient-to-r from-teal via-emerald-500 to-forest rounded-[30px] p-6 sm:p-7 text-white shadow-premium overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-white/10 blur-3xl rounded-full translate-x-1/3" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.28em]">
              <FiHeart className="text-white" /> Daily Care Quote
            </div>
            <p className="text-lg sm:text-2xl font-black leading-snug max-w-3xl">
              &ldquo;{careQuote.quote}&rdquo;
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold text-white/80">
                {careQuote.author}
              </span>
              <button
                onClick={() => navigate('/doctor-appointments')}
                className="bg-white text-teal text-xs font-black uppercase tracking-wider px-4 py-2 rounded-2xl border-0 cursor-pointer shadow-sm"
              >
                Book Care
              </button>
            </div>
          </div>
        </section>

        {/* 5. Hero Promo Carousel (Banner) */}
        <section className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden shadow-premium">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white text-left"
              style={{ background: banners[currentBanner].bg }}
            >
              {/* Overlay Grid mimicry */}
              <div className="absolute right-8 bottom-0 top-0 opacity-15 hidden sm:flex items-center text-[120px] font-black pointer-events-none select-none">
                CARE
              </div>

              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase w-fit shadow-sm">
                {banners[currentBanner].badge}
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold mt-3 max-w-lg leading-tight">
                {banners[currentBanner].title}
              </h1>
              <p className="text-[11px] sm:text-sm font-semibold opacity-90 mt-1 max-w-md">
                {banners[currentBanner].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-yellow-400 text-slate-900 px-3.5 py-1.5 rounded-lg">
                  CODE: {banners[currentBanner].code}
                </span>
                <button
                  onClick={() => navigate('/categories')}
                  className="bg-white hover:bg-slate-100 text-forest text-[10px] sm:text-xs font-black px-4.5 py-1.5 rounded-lg shadow-sm min-h-[40px]"
                >
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all ${currentBanner === index ? 'bg-white w-6' : 'bg-white/40'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* 6. Promo Banner Section (Coupon Banner Strip) */}
        <section className="bg-forest-light/60 border border-forest/10 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎟️</div>
            <div className="text-left">
              <h4 className="text-xs md:text-sm font-black text-forest-dark">Flat ₹100 Off on Lab Tests</h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-tight">Book any premium full body checkup package above ₹999.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="border-2 border-dashed border-forest/30 bg-white text-forest text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl">
              WELCOME100
            </span>
            <button
              onClick={() => navigate('/lab-tests')}
              className="bg-forest hover:bg-forest-dark text-white font-bold text-xs px-4 py-2 rounded-xl border-0 cursor-pointer"
            >
              Apply Code
            </button>
          </div>
        </section>

        {/* 7. Desktop Trending Medicines catalog with filters */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 text-left">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <FiTrendingUp className="text-teal" /> {medicinesTitle}
              </h2>
              <p className="text-xs text-slate-400 font-semibold">Browse our premium healthcare essentials</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer duration-300 outline-none
                  ${showFilters 
                    ? 'bg-teal border-teal text-white shadow-md' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
              >
                <FiFilter className={showFilters ? "text-white" : "text-teal"} />
                <span>Filters</span>
                {Object.values(filters).some(v => v !== 'All' && v !== null && v !== 0 && v !== Infinity) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                )}
              </button>
              <button
                onClick={() => { dispatch(setSelectedCategory('Medicines')); navigate('/categories'); }}
                className="px-4.5 py-2 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-2xl text-xs font-black transition-all border border-teal/20 shadow-sm hover:shadow-md cursor-pointer duration-300 outline-none"
              >
                See All Medicines
              </button>
            </div>
          </div>

          {/* Medicines Filter Component (Collapsible) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden w-full"
              >
                <MedicinesFilter
                  medicines={homeMedicines}
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-premium flex flex-col gap-3 animate-pulse-subtle">
                  <div className="w-full h-24 bg-slate-100 rounded-2xl" />
                  <div className="w-2/3 h-4 bg-slate-200 rounded mt-2" />
                  <div className="w-1/2 h-3 bg-slate-150 rounded" />
                  <div className="flex justify-between items-end mt-4">
                    <div className="w-1/3 h-6 bg-slate-200 rounded" />
                    <div className="w-1/4 h-8 bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 animate-fade-in">
              {filteredMedicines.slice(0, 8).map((med) => (
                <ProductCard key={med.id || med._id} product={med} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-2">
              <span className="text-4xl animate-bounce">📦</span>
              <h4 className="font-extrabold text-slate-800 text-xs">No Products Match Your Filters</h4>
              <p className="text-[11px] text-slate-400 font-semibold">Try resetting the filters or adjusting price</p>
            </div>
          )}
        </section>

        {/* 8. Desktop Diagnostic Lab Packages Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-sm md:text-base font-black text-slate-805 flex items-center gap-1.5">
                🧪 {labsTitle}
              </h2>
              <p className="text-[10px] md:text-xs text-slate-450 font-semibold leading-normal">Accurate reports compiled by experienced path labs</p>
            </div>
            <button
              onClick={() => navigate('/lab-tests')}
              className="px-4 py-2 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-xl text-xs font-black transition-all border border-teal/20 shadow-sm hover:shadow-md cursor-pointer duration-300 outline-none"
            >
              See All Lab Tests
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-premium flex flex-col gap-4 animate-pulse-subtle">
                  <div className="flex justify-between items-start">
                    <div className="w-2/3 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-5 bg-slate-200 rounded-full" />
                  </div>
                  <div className="w-1/2 h-3 bg-slate-150 rounded" />
                  <div className="h-10 bg-slate-50 border border-slate-100 rounded-2xl" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="w-1/4 h-6 bg-slate-200 rounded" />
                    <div className="w-1/3 h-8 bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : cityHasLabs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {homeLabTests.slice(0, 6).map((test) => (
                <LabTestCard key={test.id || test._id} test={test} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium text-center">
              <p className="text-sm font-black text-slate-800">No lab tests available in {localCityLabel} yet.</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Try changing your location or browse the full lab list.</p>
            </div>
          )}
        </section>

        {/* 9. Desktop Doctor Consultation Cards Section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-sm md:text-base font-black text-slate-805 flex items-center gap-1.5">
                👨‍⚕️ {doctorsTitle}
              </h2>
              <p className="text-[10px] md:text-xs text-slate-455 font-semibold leading-normal">Connect with certified specialists via secure HD video calls</p>
            </div>
            <button
              onClick={() => navigate('/doctor-appointments')}
              className="px-4 py-2 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-xl text-xs font-black transition-all border border-teal/20 shadow-sm hover:shadow-md cursor-pointer duration-300 outline-none"
            >
              See All Doctors
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-premium flex gap-4 animate-pulse-subtle">
                  <div className="w-20 h-24 bg-slate-200 rounded-[18px]" />
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="w-2/3 h-4 bg-slate-200 rounded" />
                    <div className="w-1/2 h-3 bg-slate-150 rounded" />
                    <div className="w-1/3 h-3 bg-slate-150 rounded" />
                    <div className="w-24 h-6 bg-slate-200 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : cityHasDoctors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {homeDoctors.slice(0, 6).map((doc) => (
                <DoctorCard key={doc.id || doc._id} doctor={doc} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium text-center">
              <p className="text-sm font-black text-slate-800">No doctors available in {localCityLabel} yet.</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Try changing your location or browse all verified specialists.</p>
            </div>
          )}
        </section>
      </div>

      {/* ================= MOBILE VIEW (Mobile-First sections B to H) ================= */}
      <div className="flex md:hidden flex-col gap-6">
        
        {/* C) Hero banner carousel (auto-scroll) */}
        <section className="relative w-full h-36 rounded-2xl overflow-hidden shadow-premium">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center px-6 text-white text-left animate-fade-in"
              style={{ background: banners[currentBanner].bg }}
            >
              <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase w-fit">
                {banners[currentBanner].badge}
              </span>
              <h1 className="text-sm font-extrabold mt-1.5 max-w-[200px] leading-tight">
                {banners[currentBanner].title}
              </h1>
              <p className="text-[9px] font-semibold opacity-95 mt-0.5 max-w-[200px] truncate">
                {banners[currentBanner].subtitle}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[8px] font-black uppercase bg-yellow-400 text-slate-900 px-2 py-1 rounded">
                  {banners[currentBanner].code}
                </span>
                <button
                  onClick={() => navigate('/categories')}
                  className="bg-white hover:bg-slate-100 text-forest text-[8px] font-black px-3 py-1 rounded"
                >
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${currentBanner === index ? 'bg-white w-4' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </section>

        {/* D) Category cards like the reference */}
        <section className="flex flex-col gap-2.5 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <FiActivity className="text-teal w-4 h-4 stroke-[2.5]" />
              <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                Shop by Category
              </h2>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="text-[9.5px] font-black uppercase tracking-wider text-teal bg-transparent border-0 cursor-pointer"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 px-1">
            {featuredCategories.map((cat) => (
              <motion.button
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (cat.category) {
                    dispatch(setSelectedCategory(cat.category));
                  }
                  navigate(cat.route);
                }}
                className="bg-white rounded-[24px] border border-slate-100 shadow-premium hover:shadow-lg p-3 md:p-4 flex flex-col items-center text-center cursor-pointer select-none transition-all w-full"
                >
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className={`w-20 h-20 rounded-full ${cat.bg} border-2 border-white shadow-sm flex items-center justify-center overflow-hidden mb-2.5`}
                >
                  <span className="text-[2.5rem] leading-none">{cat.icon}</span>
                </motion.div>
                <span className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* E) Editorial Promo Text */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-teal-100 via-emerald-50 to-teal-100 border border-teal-200 shadow-premium p-4"
        >
          <motion.div
            className="absolute top-2 right-2 w-14 h-14 rounded-full bg-teal/10 border border-teal/10 flex items-center justify-center"
            animate={{ scale: [0.9, 1.1, 0.92], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-lg">✦</span>
          </motion.div>
          <div className="relative flex items-start gap-3 pr-12">
            <motion.div
              animate={{ scale: [0.95, 1.08, 0.95], rotate: [0, 10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-11 h-11 rounded-full bg-white border border-teal/10 shadow-sm flex items-center justify-center shrink-0"
            >
              <span className="text-base font-black text-teal">ED</span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[8px] font-black uppercase tracking-[0.24em] text-teal bg-teal/10 border border-teal/20 px-2 py-1 rounded-full">
                  {homeStory.label}
                </span>
                <div className="w-16">
                  <Shimmer type="text" count={1} className="opacity-70" />
                </div>
              </div>
              <h3 className="text-[14px] font-black text-slate-800 leading-snug">
                {homeStory.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1.5">
                {homeStory.description}
              </p>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(homeStory.route)}
                className="mt-3 px-4 py-2.5 min-h-[44px] bg-forest hover:bg-forest-dark text-white text-[10px] font-black rounded-full border-0 cursor-pointer"
              >
                {homeStory.cta}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* F) Featured Brands */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
            <div className="text-left">
              <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 shadow-sm">
                <h2 className="text-[12px] font-black text-slate-800 tracking-[0.08em] uppercase">
                  Featured Brands
                </h2>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5">Popular in {localCityLabel}</p>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="text-[9px] font-black text-teal uppercase tracking-[0.18em] bg-white border border-teal/15 rounded-full px-3 py-2 shadow-sm min-h-[36px] cursor-pointer"
            >
              SEE ALL
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3.5 px-1">
            {featuredBrands.slice(0, 6).map((brand, idx) => {
              const brandLogos = {
                'Sun Pharmaceutical Industries Ltd': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=150&h=150&q=80',
                'Sun Pharmaceutical Industries Limited': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=150&h=150&q=80',
                'Micro Labs Ltd': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&h=150&q=80',
                'Dabur India Ltd': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&h=150&q=80',
                'Dabur India Limited': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&h=150&q=80',
                'Roche Diabetes Care': 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=150&h=150&q=80',
                'Koye Pharmaceuticals': 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=150&h=150&q=80',
                'Koye Pharmaceuticals Pvt Ltd': 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=150&h=150&q=80',
                'The Himalaya Drug Company': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&h=150&q=80',
                'Himalaya Drug Company': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&h=150&q=80'
              };
              const brandImg = brandLogos[brand.name] || brand.image;

              // Helper to get initials of brand
              const initials = brand.name
                .split(' ')
                .filter(w => !['Ltd', 'Pvt', 'Company', 'Care', 'Drug', 'Industries'].includes(w))
                .slice(0, 2)
                .map(w => w[0])
                .join('')
                .toUpperCase() || brand.name[0].toUpperCase();

              return (
                <div key={brand.name} className="flex flex-col items-center gap-2 mx-auto text-center w-full">
                  <motion.button
                    whileTap={{ scale: 0.92, rotate: -2 }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    onClick={() => {
                      dispatch(setSearchTerm(brand.name));
                      dispatch(setSelectedCategory('Medicines'));
                      navigate('/categories');
                    }}
                    className="bg-white rounded-full border border-slate-100 hover:border-teal/30 shadow-premium w-20 h-20 flex items-center justify-center cursor-pointer overflow-hidden p-0 outline-none relative group"
                  >
                    <ImageWithFallback
                      src={brandImg}
                      alt={brand.name}
                      initials={initials}
                      colorClass={brand.color}
                    />
                  </motion.button>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug text-center break-words max-w-[85px]">
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* G) Quote Card */}
        <section className="rounded-[28px] bg-gradient-to-r from-teal to-forest p-5 text-white shadow-premium relative overflow-hidden">
          <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-black leading-snug relative z-10">
            &ldquo;{careQuote.quote}&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 relative z-10">
            <span className="text-[9px] font-bold text-white/80">{careQuote.author}</span>
            <button
              onClick={() => navigate('/doctor-appointments')}
              className="bg-white text-teal text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full border-0 cursor-pointer min-h-[38px]"
            >
              Book Care
            </button>
          </div>
        </section>

        {/* H) Medicines section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
            <div className="text-left">
              <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 shadow-sm">
                <h2 className="text-[12px] font-black text-slate-800 tracking-[0.08em] uppercase">
                  Medicines
                </h2>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5">Top products ordered recently</p>
            </div>
            <button
              onClick={() => { dispatch(setSelectedCategory('Medicines')); navigate('/categories'); }}
              className="text-[9px] font-black text-teal uppercase tracking-[0.18em] bg-white border border-teal/15 rounded-full px-3 py-2 shadow-sm min-h-[36px] cursor-pointer"
            >
              SEE ALL
            </button>
          </div>
          {cityHasMedicines ? (
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1 -mx-4 px-4 scroll-smooth">
              {homeMedicines.slice(0, 8).map((med) => (
                <div key={med.id || med._id} className="shrink-0 text-left max-w-[160px] sm:w-[155px] w-[160px]">
                  <ProductCard product={med} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium text-center">
              <p className="text-xs font-black text-slate-800">No medicines found for {localCityLabel} yet.</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Change location or browse the full catalog.</p>
            </div>
          )}
        </section>

        {/* Banner: Generics Discount */}
        <AnimatedBanner type="generics" compact />

        {/* I) Verified Doctor Consultations section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
            <div className="flex-1 min-w-0 text-left">
              <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 shadow-sm">
                <h2 className="text-[12px] font-black text-slate-800 tracking-[0.08em] uppercase truncate">
                  Verified Doctors
                </h2>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold truncate mt-1.5">Verified local specialists</p>
            </div>
            <button
              onClick={() => navigate('/doctor-appointments')}
              className="text-[9px] font-black text-teal uppercase tracking-[0.18em] bg-white border border-teal/15 rounded-full px-3 py-2 shadow-sm min-h-[36px] cursor-pointer shrink-0"
            >
              SEE ALL
            </button>
          </div>
          {cityHasDoctors ? (
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1 -mx-4 px-4 scroll-smooth">
              {homeDoctors.slice(0, 8).map((doc) => (
                <div key={doc.id || doc._id} className="w-[258px] shrink-0 text-left">
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium text-center">
              <p className="text-xs font-black text-slate-800">No doctors found for {localCityLabel} yet.</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Change location or browse all verified specialists.</p>
            </div>
          )}
        </section>

        {/* Banner: Free Doctor Consultation */}
        <AnimatedBanner type="doctors" compact />

        {/* J) Diagnostic Health Packages section */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-2">
            <div className="flex-1 min-w-0 text-left">
              <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 shadow-sm">
                <h2 className="text-[12px] font-black text-slate-800 tracking-[0.08em] uppercase truncate">
                  Lab Tests
                </h2>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold truncate mt-1.5">NABL certified checkups</p>
            </div>
            <button
              onClick={() => navigate('/lab-tests')}
              className="text-[9px] font-black text-teal uppercase tracking-[0.18em] bg-white border border-teal/15 rounded-full px-3 py-2 shadow-sm min-h-[36px] cursor-pointer shrink-0"
            >
              SEE ALL
            </button>
          </div>
          {cityHasLabs ? (
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1 -mx-4 px-4 scroll-smooth">
              {homeLabTests.slice(0, 8).map((test) => (
                <div key={test.id || test._id} className="w-[258px] shrink-0 text-left">
                  <LabTestCard test={test} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium text-center">
              <p className="text-xs font-black text-slate-800">No diagnostic tests found for {localCityLabel} yet.</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Change location or explore the full diagnostics catalog.</p>
            </div>
          )}
        </section>

        {/* Banner: Home Sample Collection */}
        <AnimatedBanner type="labs" compact />

      </div>

      {/* Prescription Upload Modal */}
      <PrescriptionUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={(newRx) => {
          dispatch(setPrescriptionFilterActive(true));
          navigate('/categories');
        }}
      />
    </div>
  );
}
