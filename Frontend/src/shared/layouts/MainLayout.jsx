import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, FiShoppingBag, FiMapPin, FiUser, FiMenu, FiChevronDown, FiChevronLeft,
  FiX, FiHome, FiActivity, FiCalendar, FiShoppingCart, FiPercent, FiTrash2, FiUploadCloud,
  FiPlusCircle, FiShield
} from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import AnimatedBanner from '../components/AnimatedBanner';
import PrescriptionUpload from '../components/PrescriptionUpload';
import LocationSelectorModal, { getStateAbbreviation } from '../components/LocationSelectorModal';
import { logout } from '../../modules/auth/store/authSlice';
import { setSelectedLocation, setLocation, setSearchTerm, setPrescriptionFilterActive, fetchDoctors, fetchLabs, fetchProducts, clearCityData } from '../../modules/user/store/productSlice';
import { updateQuantity, removeFromCart, clearCart } from '../../modules/user/store/cartSlice';

const getPageTitle = (pathname) => {
  if (pathname.startsWith('/medicines') || pathname.startsWith('/categories')) return 'Medicines';
  if (pathname.startsWith('/lab-tests')) return 'Lab Tests';
  if (pathname.startsWith('/doctor-appointments')) return 'Consult Doctors';
  if (pathname.startsWith('/cart')) return 'My Cart';
  if (pathname.startsWith('/checkout')) return 'Checkout';
  if (pathname.startsWith('/orders') || pathname.startsWith('/track-orders')) return 'My Orders';
  if (pathname.startsWith('/profile')) return 'My Profile';
  if (pathname.startsWith('/login')) return 'Login';
  if (pathname.startsWith('/rate')) return 'Rate Order';
  if (pathname.includes('/book')) return 'Booking';
  if (pathname.startsWith('/labs/')) return 'Lab Details';
  return 'E-Mediclub';
};

const getPromoBanners = (pathname) => {
  if (pathname.startsWith('/doctor-appointments') || pathname.startsWith('/doctors/')) {
    return [
      {
        title: 'First consultation FREE on select doctors',
        subtitle: 'Book trusted specialists with fast online slots and easy follow-ups.',
        bgGradient: 'linear-gradient(135deg, #0EA5A4 0%, #0F766E 100%)',
        icon: '🩺',
        discount: 'FREE CONSULT',
        eyebrow: 'Doctor Offer',
        cta: 'Book Now',
        route: '/doctor-appointments'
      },
      {
        title: 'Save on repeat visits and follow-ups',
        subtitle: 'Quick booking, verified doctors, and responsive support on every appointment.',
        bgGradient: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
        icon: '✨',
        discount: 'FAST BOOKING',
        eyebrow: 'Best for You',
        cta: 'View Doctors',
        route: '/doctor-appointments'
      }
    ];
  }

  if (pathname.startsWith('/lab-tests') || pathname.startsWith('/labs/')) {
    return [
      {
        title: 'Flat 20% OFF on diagnostic packages',
        subtitle: 'Book tests, compare packages, and enjoy home sample collection in your area.',
        bgGradient: 'linear-gradient(135deg, #14B8A6 0%, #0F9D8A 100%)',
        icon: '🧪',
        discount: '20% OFF',
        eyebrow: 'Lab Deal',
        cta: 'Book Test',
        route: '/lab-tests'
      },
      {
        title: 'Home sample collection made easy',
        subtitle: 'Interactive offers, fast reports, and verified labs near your city.',
        bgGradient: 'linear-gradient(135deg, #0F9D8A 0%, #0F766E 100%)',
        icon: '🚚',
        discount: 'HOME PICKUP',
        eyebrow: 'Fast Reports',
        cta: 'Explore Labs',
        route: '/lab-tests'
      }
    ];
  }

  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    return [
      {
        title: 'Extra savings on your cart today',
        subtitle: 'Apply offers, review your items, and check out with secure payment flow.',
        bgGradient: 'linear-gradient(135deg, #0F9D8A 0%, #115E59 100%)',
        icon: '🛒',
        discount: 'SAVE MORE',
        eyebrow: 'Checkout Deal',
        cta: 'Go to Checkout',
        route: '/checkout'
      },
      {
        title: 'Free delivery on eligible orders',
        subtitle: 'A cleaner checkout journey with smooth order tracking and quick reordering.',
        bgGradient: 'linear-gradient(135deg, #0EA5A4 0%, #0F766E 100%)',
        icon: '🚚',
        discount: 'FREE DELIVERY',
        eyebrow: 'Limited Offer',
        cta: 'Review Cart',
        route: '/cart'
      }
    ];
  }

  if (pathname.startsWith('/orders') || pathname.startsWith('/track-orders')) {
    return [
      {
        title: 'Reorder your essentials in one tap',
        subtitle: 'Quick access to previous orders and discounted repeat purchases.',
        bgGradient: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
        icon: '📦',
        discount: 'REORDER',
        eyebrow: 'Smart Save',
        cta: 'Track Orders',
        route: '/orders'
      },
      {
        title: 'Keep your favorites ready for next time',
        subtitle: 'Faster reordering, less searching, and a more interactive shopping experience.',
        bgGradient: 'linear-gradient(135deg, #14B8A6 0%, #0F9D8A 100%)',
        icon: '💚',
        discount: 'LOYALTY SAVE',
        eyebrow: 'Member Benefits',
        cta: 'Shop Again',
        route: '/medicines'
      }
    ];
  }

  if (pathname.startsWith('/profile')) {
    return [];
  }

  return [
    {
      title: 'Save up to 30% on medicines and essentials',
      subtitle: 'Interactive offers across pharmacy, doctors, and diagnostics.',
      bgGradient: 'linear-gradient(135deg, #0F9D8A 0%, #157A6E 100%)',
      icon: '💊',
      discount: 'UP TO 30% OFF',
      eyebrow: 'Daily Offer',
      cta: 'Shop Now',
      route: '/categories'
    },
    {
      title: 'More discounts on labs and doctor bookings',
      subtitle: 'Fast, responsive, and made to feel like a modern healthcare app.',
      bgGradient: 'linear-gradient(135deg, #0EA5A4 0%, #0F766E 100%)',
      icon: '🧪',
      discount: 'LIMITED TIME',
      eyebrow: 'Best Value',
      cta: 'Explore',
      route: '/lab-tests'
    }
  ];
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isProfileOrOrders = location.pathname === '/profile' || location.pathname === '/orders' || location.pathname === '/track-orders';
  const isHomeOrMedicines = location.pathname === '/' || location.pathname.startsWith('/medicines') || location.pathname.startsWith('/categories') || location.pathname.startsWith('/search');

  // Redux Selectors
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items, total } = useSelector(state => state.cart);
  const { selectedLocation, location: locationState, searchTerm, medicines = [], doctors = [], labs = [], labTests = [] } = useSelector(state => state.products);
  const promoBanners = getPromoBanners(location.pathname);
 
  // Component UI States
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [showGlobalUploadModal, setShowGlobalUploadModal] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Collapse search bar on navigation
  useEffect(() => {
    setShowMobileSearch(false);
  }, [location.pathname]);

  // Live intelligent suggestions dropdown
  const [suggestions, setSuggestions] = useState({ medicines: [], doctors: [], labs: [], packages: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGlobalUploadSuccess = () => {
    dispatch(setPrescriptionFilterActive(true));
    navigate('/medicines');
  };

  // Monitor scroll for premium visual indicators
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update input when Redux search query changes
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  // Fetch doctors, labs, and products on mount or when location changes
  useEffect(() => {
    dispatch(clearCityData());
    dispatch(clearCart());
    const params = {};
    if (locationState?.pincode) {
      params.pincode = locationState.pincode;
    }
    if (locationState?.city) {
      params.city = locationState.city;
    }
    dispatch(fetchDoctors(params));
    dispatch(fetchLabs(params));
    dispatch(fetchProducts(params));
  }, [locationState?.city, locationState?.pincode, dispatch]);

  // Compute live intelligent suggestions
  useEffect(() => {
    if (!searchInput || searchInput.trim().length < 2) {
      setSuggestions({ medicines: [], doctors: [], labs: [], packages: [] });
      return;
    }
    const query = searchInput.toLowerCase();

    // 1. Matches Medicines
    const matchedMedicines = medicines.filter(m => 
      m.name.toLowerCase().includes(query) || 
      (m.category && m.category.toLowerCase().includes(query))
    ).slice(0, 3);

    // 2. Matches Doctors
    const matchedDoctors = doctors.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.specialty.toLowerCase().includes(query) || 
      d.qualification.toLowerCase().includes(query)
    ).slice(0, 3);

    // 3. Matches Labs
    const matchedLabs = labs.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.address.toLowerCase().includes(query)
    ).slice(0, 3);

    // 4. Matches Packages (labTests)
    const matchedPackages = labTests.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.testsIncluded.toLowerCase().includes(query)
    ).slice(0, 3);

    setSuggestions({
      medicines: matchedMedicines,
      doctors: matchedDoctors,
      labs: matchedLabs,
      packages: matchedPackages
    });
  }, [searchInput, medicines, doctors, labs, labTests]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput || !searchInput.trim()) return;

    const originalQuery = searchInput.trim();
    const query = originalQuery.toLowerCase();

    // 1. General keywords list
    const generalDocKeywords = [
      'doctor', 'doctors', 'doc', 'docs', 'consult', 'consultation', 
      'consultations', 'appointment', 'appointments', 'physician', 
      'physicians', 'specialist', 'specialists', 'clinic', 'clinics'
    ];

    const generalLabKeywords = [
      'lab', 'labs', 'test', 'tests', 'package', 'packages', 
      'checkup', 'checkups', 'diagnostic', 'diagnostics', 
      'lab test', 'lab tests', 'pathology'
    ];

    const generalMedKeywords = [
      'medicine', 'medicines', 'pill', 'pills', 'drug', 'drugs', 
      'pharma', 'pharmacy', 'catalog', 'medical catalog'
    ];

    const isGeneralDoc = generalDocKeywords.includes(query);
    const isGeneralLab = generalLabKeywords.includes(query);
    const isGeneralMed = generalMedKeywords.includes(query);

    // 2. Map clinical specialties / synonyms
    const docSpecialtySynonyms = {
      'heart': 'Cardiology',
      'cardiologist': 'Cardiology',
      'cardiology': 'Cardiology',
      'skin': 'Dermatology',
      'hair': 'Dermatology',
      'dermatologist': 'Dermatology',
      'dermatology': 'Dermatology',
      'child': 'Paediatrics',
      'paediatrics': 'Paediatrics',
      'pediatrician': 'Paediatrics',
      'pediatric': 'Paediatrics',
      'bone': 'Orthopaedics',
      'joint': 'Orthopaedics',
      'orthopedic': 'Orthopaedics',
      'orthopaedics': 'Orthopaedics',
      'brain': 'Neurology',
      'nerve': 'Neurology',
      'neurologist': 'Neurology',
      'neurology': 'Neurology',
      'kidney': 'Nephrology',
      'renal': 'Nephrology',
      'nephrologist': 'Nephrology',
      'nephrology': 'Nephrology',
      'dental': 'Dentistry',
      'dentist': 'Dentistry',
      'dentistry': 'Dentistry',
      'tooth': 'Dentistry',
      'gynaecology': 'Gynaecology & Obstetrics',
      'obgyn': 'Gynaecology & Obstetrics',
      'pregnancy': 'Gynaecology & Obstetrics',
      'stomach': 'Gastroenterology',
      'gut': 'Gastroenterology',
      'gastro': 'Gastroenterology',
      'gastroenterology': 'Gastroenterology',
      'diabetes': 'Endocrinology',
      'endocrinology': 'Endocrinology',
      'hormone': 'Endocrinology',
      'lung': 'Pulmonology (Lungs & Chest)',
      'chest': 'Pulmonology (Lungs & Chest)',
      'pulmonology': 'Pulmonology (Lungs & Chest)',
      'cancer': 'Oncology (Cancer Care)',
      'tumor': 'Oncology (Cancer Care)',
      'oncology': 'Oncology (Cancer Care)',
      'urology': 'Urology',
      'urinary': 'Urology',
      'eye': 'Ophthalmology',
      'vision': 'Ophthalmology',
      'ophthalmology': 'Ophthalmology',
      'ent': 'ENT',
      'throat': 'ENT',
      'psychiatry': 'Psychiatry & Mental Health',
      'mental': 'Psychiatry & Mental Health'
    };

    let matchedSpecialty = null;
    for (const [key, val] of Object.entries(docSpecialtySynonyms)) {
      if (query.includes(key)) {
        matchedSpecialty = val;
        break;
      }
    }

    // 3. Routing decision tree
    if (isGeneralDoc) {
      dispatch(setSearchTerm(''));
      navigate('/doctor-appointments');
    } else if (isGeneralLab) {
      dispatch(setSearchTerm(''));
      navigate('/lab-tests');
    } else if (isGeneralMed) {
      dispatch(setSearchTerm(''));
      navigate('/search');
    } else if (matchedSpecialty) {
      dispatch(setSearchTerm(matchedSpecialty));
      navigate('/doctor-appointments');
    } else {
      // Check if it's a specific doctor name
      const isDocMatch = doctors.some(d => 
        d.name.toLowerCase().includes(query) || 
        d.specialty.toLowerCase().includes(query) ||
        (d.subSpecialty && d.subSpecialty.toLowerCase().includes(query)) ||
        (d.qualification && d.qualification.toLowerCase().includes(query))
      );

      // Check if it's a specific lab package
      const isLabMatch = labTests.some(t => 
        t.name.toLowerCase().includes(query) || 
        (t.testsIncluded && t.testsIncluded.toLowerCase().includes(query))
      );

      if (isDocMatch) {
        dispatch(setSearchTerm(originalQuery));
        navigate('/doctor-appointments');
      } else if (isLabMatch) {
        dispatch(setSearchTerm(originalQuery));
        navigate('/lab-tests');
      } else {
        // Fallback to medicines search
        dispatch(setSearchTerm(originalQuery));
        navigate('/search');
      }
    }
  };

  const popularCitiesData = [
    { name: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { name: 'New Delhi', state: 'Delhi', pincode: '110001' },
    { name: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    { name: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    { name: 'Pune', state: 'Maharashtra', pincode: '411001' },
    { name: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
    { name: 'Kolkata', state: 'West Bengal', pincode: '700001' },
    { name: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }
  ];

  const formatLocationForNavbar = (locStr) => {
    if (!locStr) return '';
    const match = locStr.match(/^(.*?),\s*(.*?)\s*-\s*(\d{6})$/);
    if (match) {
      return `${match[1]} - ${match[3]}`;
    }
    return locStr;
  };

  // Sync inputs with selectedLocation when modal opens
  useEffect(() => {
    if (showLocationPopup) {
      const match = selectedLocation.match(/^(.*?),\s*(.*?)\s*-\s*(\d{6})$/);
      if (match) {
        setCityInput(match[1]);
        setPincodeInput(match[3]);
      } else {
        setCityInput(selectedLocation || '');
        setPincodeInput('');
      }
    }
  }, [showLocationPopup, selectedLocation]);

  // If pincode matches one of our popular cities, auto-fill the city
  useEffect(() => {
    if (pincodeInput && pincodeInput.trim().length === 6) {
      const matchedCity = popularCitiesData.find(c => c.pincode === pincodeInput.trim());
      if (matchedCity && cityInput.toLowerCase() !== matchedCity.name.toLowerCase()) {
        setCityInput(matchedCity.name);
      }
    }
  }, [pincodeInput]);

  const handleLocationSelect = (cityStr) => {
    dispatch(setSelectedLocation(cityStr));
    setShowLocationPopup(false);
  };

  const handleConfirmLocation = () => {
    let finalCity = cityInput.trim() || 'Mumbai';
    let finalState = 'Maharashtra';
    let finalPincode = pincodeInput.trim() || '400001';

    const matchPincode = popularCitiesData.find(c => c.pincode === finalPincode);
    if (matchPincode) {
      finalCity = matchPincode.name;
      finalState = matchPincode.state;
    } else {
      const matchCity = popularCitiesData.find(c => c.name.toLowerCase() === finalCity.toLowerCase());
      if (matchCity) {
        finalState = matchCity.state;
        if (!pincodeInput.trim()) {
          finalPincode = matchCity.pincode;
        }
      }
    }

    const formatted = `${finalCity}, ${finalState} - ${finalPincode}`;
    dispatch(setSelectedLocation(formatted));
    setShowLocationPopup(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowMobileSidebar(false);
    navigate('/');
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.qty, 0);

  // Determine active path for bottom navigation
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-transparent font-sans">
      
      {/* 1. Header / Navbar */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-white shadow-premium py-2' : 'bg-white border-b border-slate-100 py-3'
      }`}>
        {/* Desktop Header Container */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 items-center justify-between gap-4 w-full">
          {/* Left Side: Brand Logo & Back Button */}
          <div className="flex items-center gap-2">
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
                aria-label="Go back"
              >
                <FiChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
            <div className="cursor-pointer" onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}>
              <Logo showText={true} />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          {!isProfileOrOrders && (
            <div className="flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="flex w-full relative">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <FiSearch className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search medicines, wellness items, doctor specialties..."
                    value={searchInput}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 rounded-full text-slate-800 text-sm outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-5 bg-forest hover:bg-forest-dark text-white font-medium rounded-full text-xs transition-colors border-0 cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown menu */}
              {showSuggestions && (suggestions.medicines.length > 0 || suggestions.doctors.length > 0 || suggestions.labs.length > 0 || suggestions.packages.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-4 max-h-96 overflow-y-auto no-scrollbar font-sans select-none flex flex-col gap-3 animate-fade-in text-left">
                  {/* Doctors */}
                  {suggestions.doctors.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1 mb-1 flex items-center gap-1 select-none">
                        👨‍⚕️ Doctors
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.doctors.map(doc => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(''));
                              navigate(`/doctors/${doc.id}/book`);
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-xs font-bold text-slate-700 flex flex-col items-start transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span className="truncate w-full">{doc.name}</span>
                            <span className="text-[8px] text-slate-400 font-semibold">{doc.specialty} • {doc.experience}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medicines */}
                  {suggestions.medicines.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1 mb-1 flex items-center gap-1 select-none">
                        💊 Medicines
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.medicines.map(med => (
                          <button
                            key={med.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(med.name));
                              navigate('/medicines');
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-xs font-bold text-slate-700 flex flex-col items-start transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span className="truncate w-full">{med.name}</span>
                            <span className="text-[8px] text-slate-400 font-semibold">{med.brand} • {med.packSize}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnostic Labs */}
                  {suggestions.labs.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1 mb-1 flex items-center gap-1 select-none">
                        🏢 Partner Labs
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.labs.map(lab => (
                          <button
                            key={lab.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(''));
                              navigate(`/labs/${lab.id}`);
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-xs font-bold text-slate-700 flex flex-col items-start transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span className="truncate w-full">{lab.name}</span>
                            <span className="text-[8px] text-slate-400 font-semibold">★ {lab.rating} • NABL Certified</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Packages */}
                  {suggestions.packages.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1 mb-1 flex items-center gap-1 select-none">
                        🧪 Lab Packages
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.packages.map(pkg => (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(pkg.name));
                              navigate('/lab-tests');
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-xs font-bold text-slate-700 flex flex-col items-start transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span className="truncate w-full">{pkg.name}</span>
                            <span className="text-[8px] text-slate-400 font-semibold">{pkg.parameters} checked</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center gap-5">
            {/* Location Selector Trigger */}
            <button 
              onClick={() => setShowLocationPopup(true)} 
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-forest-light/60 hover:bg-forest-light text-forest text-xs font-semibold rounded-full transition-all cursor-pointer border-0 outline-none"
            >
              <span className="truncate max-w-[220px]">
                📍 {locationState?.city 
                  ? (locationState.pincode 
                      ? `${locationState.city}, ${getStateAbbreviation(locationState.state)} - ${locationState.pincode}` 
                      : locationState.city) 
                  : 'Select Location'} ▾
              </span>
            </button>

            {/* Login / Auth */}
            {isAuthenticated ? (
              <button 
                onClick={() => navigate('/profile')} 
                className="flex items-center gap-2 hover:text-forest text-slate-600 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-forest-light/60 text-forest flex items-center justify-center shadow-sm border border-forest/10">
                  <FiUser className="w-4 h-4 text-teal" />
                </div>
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Hi, {user?.name === 'Super Admin' ? 'User' : user?.name}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2.5 min-h-[44px] bg-forest text-white hover:bg-forest-dark font-extrabold text-xs rounded-full transition-all duration-300 shadow-sm border-0 cursor-pointer"
              >
                Login / Sign Up
              </button>
            )}

            {/* Shopping Cart Badge */}
            <button 
              onClick={() => navigate('/cart')} 
              className="relative p-2 text-slate-650 hover:text-forest hover:bg-slate-50 rounded-full transition-colors border-0 bg-transparent cursor-pointer"
            >
              <FiShoppingBag className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-coral text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse-subtle">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Header Container */}
        <div className="flex md:hidden flex-col gap-2 px-4 w-full">
          {/* Row 1: Back, Logo, Search Toggle, User, Cart */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {location.pathname !== '/' && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-707 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
                  aria-label="Go back"
                >
                  <FiChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
              )}
              <div className="cursor-pointer" onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}>
                <Logo showText={true} />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`p-1.5 rounded-full border-0 bg-transparent cursor-pointer transition-colors ${showMobileSearch ? 'text-teal bg-slate-50' : 'text-slate-650'}`}
              >
                <FiSearch className="w-5.5 h-5.5 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                className="p-1.5 text-slate-600 hover:text-forest rounded-full border-0 bg-transparent cursor-pointer"
              >
                <FiUser className="w-5.5 h-5.5" />
              </button>
              <button 
                onClick={() => navigate('/cart')} 
                className="relative p-1.5 text-slate-650 hover:text-forest rounded-full border-0 bg-transparent cursor-pointer"
              >
                <FiShoppingBag className="w-5.5 h-5.5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-coral text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white animate-pulse-subtle">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Selected City */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-2 pb-1">
            <button 
              onClick={() => setShowLocationPopup(true)} 
              className="flex items-center gap-1 text-slate-800 text-[13px] font-black cursor-pointer border-0 bg-transparent outline-none"
            >
              <FiMapPin className="text-teal text-sm shrink-0" />
              <span>{locationState?.city ? locationState.city : 'Select Location'}</span>
              <span className="text-[9px] text-slate-400 ml-0.5">▼</span>
            </button>
          </div>

          {/* Mobile Search Bar - Collapsible */}
          {showMobileSearch && (
            <div className="relative flex flex-col w-full pb-1 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative flex w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <FiSearch className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search medicines, wellness, lab tests..."
                  value={searchInput}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-xs outline-none transition-all font-semibold"
                />
              </form>

              {/* Mobile suggestions dropdown menu */}
              {showSuggestions && (suggestions.medicines.length > 0 || suggestions.doctors.length > 0 || suggestions.labs.length > 0 || suggestions.packages.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-3 max-h-72 overflow-y-auto no-scrollbar font-sans select-none flex flex-col gap-2.5 text-left">
                  {/* Doctors */}
                  {suggestions.doctors.length > 0 && (
                    <div>
                      <h4 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-0.5 mb-1 select-none">
                        👨‍⚕️ Doctors
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.doctors.map(doc => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(doc.name));
                              navigate('/doctor-appointments');
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-[11px] font-bold text-slate-700 flex justify-between items-center transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span>{doc.name}</span>
                            <span className="text-[7.5px] bg-teal-light/20 text-teal px-1.5 py-0.5 rounded-full uppercase tracking-wider">{doc.specialty}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Labs */}
                  {suggestions.labs.length > 0 && (
                    <div>
                      <h4 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-0.5 mb-1 select-none">
                        🏢 Labs
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.labs.map(lab => (
                          <button
                            key={lab.id}
                            type="button"
                            onClick={() => {
                              navigate(`/labs/${lab.id}`);
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-[11px] font-bold text-slate-700 flex justify-between items-center transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span>{lab.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medicines */}
                  {suggestions.medicines.length > 0 && (
                    <div>
                      <h4 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-0.5 mb-1 select-none">
                        💊 Medicines
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.medicines.map(med => (
                          <button
                            key={med.id}
                            type="button"
                            onClick={() => {
                              navigate(`/product/${med.id}`);
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-[11px] font-bold text-slate-700 flex justify-between items-center transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span>{med.name}</span>
                            <span className="text-[8px] text-slate-400">{med.category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Packages */}
                  {suggestions.packages.length > 0 && (
                    <div>
                      <h4 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-0.5 mb-1 select-none">
                        🧪 Packages
                      </h4>
                      <div className="flex flex-col gap-0.5">
                        {suggestions.packages.map(pkg => (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => {
                              dispatch(setSearchTerm(pkg.name));
                              navigate('/lab-tests');
                              setShowSuggestions(false);
                            }}
                            className="text-left w-full hover:bg-slate-50 p-1 rounded-lg text-[11px] font-bold text-slate-700 flex flex-col items-start transition-colors border-0 bg-transparent cursor-pointer"
                          >
                            <span className="truncate w-full">{pkg.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Page Content wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {location.pathname !== '/login' && promoBanners && promoBanners.length > 0 && (
          <div className="mb-4 md:mb-6">
            <AnimatedBanner banners={promoBanners} compact className="border border-white/60" />
          </div>
        )}
        <Outlet />
      </main>

      {/* Global Footer (Pure Black #000000 background) - Hidden on Mobile */}
      {location.pathname !== '/login' && (
        <footer className="hidden md:block w-full bg-[#000000] mt-16 py-12 px-6 border-t border-slate-900 text-slate-450 font-sans select-none animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 text-xs font-semibold text-slate-400">
            {/* Upper footer features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
                <span className="text-teal mb-2 text-base">✔️</span>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">100% Genuine</h5>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Sourced from certified clinical partners.</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
                <span className="text-teal mb-2 text-base">🕒</span>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">Express Delivery</h5>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Medicines delivered inside 4-6 hours.</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
                <span className="text-teal mb-2 text-base">🏆</span>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">FDA Certified</h5>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Strict clinical pharmacy controls.</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
                <span className="text-teal mb-2 text-base">📞</span>
                <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">Expert Support</h5>
                <p className="text-[10px] text-slate-400 font-bold mt-1">24/7 dedicated pharmacy consultation help.</p>
              </div>
            </div>

            {/* Brand details and links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">About Mediclub</h5>
                <a href="#about" className="text-slate-400 hover:text-white transition-colors">Who We Are</a>
                <a href="#careers" className="text-slate-400 hover:text-white transition-colors">Careers</a>
                <a href="#press" className="text-slate-400 hover:text-white transition-colors">Press Releases</a>
                <a href="#blog" className="text-slate-400 hover:text-white transition-colors">Healthy Life Blog</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Our Policies</h5>
                <a href="#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#editorial" className="text-slate-400 hover:text-white transition-colors">Editorial Policy</a>
                <a href="#security" className="text-slate-400 hover:text-white transition-colors">Vulnerability Disclosure</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Customer Support</h5>
                <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact Helpdesk</a>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">Fulfillment FAQs</a>
                <a href="#return" className="text-slate-400 hover:text-white transition-colors">Medicine Return Policy</a>
                <a href="#refund" className="text-slate-400 hover:text-white transition-colors">Refund Status Tracker</a>
              </div>
              <div className="flex flex-col gap-3">
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Download Our Mobile App</h5>
                <p className="text-[10px] text-slate-400 font-bold leading-snug">Get exclusive health tip blogs and 20% discount coupon banners instantly inside the app.</p>
                <div className="flex flex-col gap-2.5">
                  {/* Google Play Store Pill Button */}
                  <button className="flex items-center gap-3 bg-[#111314] text-white px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-teal/30 hover:bg-slate-950 hover:scale-[1.03] hover:shadow-premium-hover transition-all duration-300 select-none group text-left cursor-pointer w-full max-w-[175px]">
                    <svg className="w-5.5 h-5.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.25 2.5C3.08 2.66 3 2.92 3 3.25V20.75C3 21.08 3.08 21.34 3.25 21.5L3.34 21.58L12.56 12.36V11.64L3.34 2.42L3.25 2.5Z" fill="url(#gp_a)" />
                      <path d="M15.63 15.43L12.56 12.36V11.64L15.63 8.57L15.71 8.62L19.35 10.69C20.39 11.28 20.39 12.24 19.35 12.83L15.71 14.9L15.63 15.43Z" fill="url(#gp_b)" />
                      <path d="M15.71 14.9L12.56 11.75L3.25 21.06C3.59 21.42 4.14 21.44 4.77 21.08L15.71 14.9Z" fill="url(#gp_c)" />
                      <path d="M15.71 8.62L4.77 2.42C4.14 2.06 3.59 2.08 3.25 2.44L12.56 11.75L15.71 8.62Z" fill="url(#gp_d)" />
                      <defs>
                        <linearGradient id="gp_a" x1="11.45" y1="21.11" x2="3" y2="12.66" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#00A0FF" />
                          <stop offset="0.007" stopColor="#00A0FF" />
                          <stop offset="1" stopColor="#00EAFF" />
                        </linearGradient>
                        <linearGradient id="gp_b" x1="20.38" y1="12.36" x2="13.2" y2="12.36" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#FFC700" />
                          <stop offset="1" stopColor="#FFEB00" />
                        </linearGradient>
                        <linearGradient id="gp_c" x1="12.44" y1="12.44" x2="5.19" y2="19.69" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#FF2A00" />
                          <stop offset="1" stopColor="#FF007A" />
                        </linearGradient>
                        <linearGradient id="gp_d" x1="5.19" y1="5.03" x2="12.44" y2="12.28" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#37A600" />
                          <stop offset="1" stopColor="#10BA00" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-left leading-tight">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">GET IT ON</span>
                      <span className="text-[12px] text-white font-bold block mt-0.5 font-sans">Google Play</span>
                    </div>
                  </button>

                  {/* Apple App Store Pill Button */}
                  <button className="flex items-center gap-3 bg-[#111314] text-white px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-teal/30 hover:bg-slate-950 hover:scale-[1.03] hover:shadow-premium-hover transition-all duration-300 select-none group text-left cursor-pointer w-full max-w-[175px]">
                    <svg className="w-5.5 h-5.5 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
                    </svg>
                    <div className="text-left leading-tight">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Download on the</span>
                      <span className="text-[12px] text-white font-bold block mt-0.5 font-sans">App Store</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Final Copyright */}
            <div className="border-t border-slate-800 pt-6 text-center text-[10px] text-slate-500 font-bold">
              <p>© 2026 E Mediclub India Inc. All rights reserved. Registered Clinical E-Pharmacy Lic. No. DL-392819-A.</p>
            </div>
          </div>
        </footer>
      )}

      {/* 3. Sticky Mobile Bottom Navigation ( Tata 1mg inspired) */}
      {location.pathname !== '/login' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 py-1.5 px-3 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.03)] rounded-t-2xl">
          <button 
            onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}
            className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-forest font-bold' : 'text-slate-400'}`}
          >
            <FiHome className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          <button 
            onClick={() => navigate('/medicines')}
            className={`flex flex-col items-center gap-1 ${isActive('/medicines') || isActive('/categories') ? 'text-forest font-bold' : 'text-slate-400'}`}
          >
            <FiPlusCircle className="w-5 h-5" />
            <span className="text-[10px]">Medicines</span>
          </button>
          <button 
            onClick={() => navigate('/lab-tests')}
            className={`flex flex-col items-center gap-1 ${isActive('/lab-tests') ? 'text-forest font-bold' : 'text-slate-400'}`}
          >
            <FiCalendar className="w-5 h-5" />
            <span className="text-[10px]">Lab Tests</span>
          </button>
          <button 
            onClick={() => navigate('/doctor-appointments')}
            className={`flex flex-col items-center gap-1 ${isActive('/doctor-appointments') ? 'text-forest font-bold' : 'text-slate-400'}`}
          >
            <FiActivity className="w-5 h-5" />
            <span className="text-[10px]">Doctors</span>
          </button>
          <button 
            onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
            className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-forest font-bold' : 'text-slate-400'}`}
          >
            <FiUser className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      )}



      {/* 5. Location Popup Drawer (Tata 1mg Style) */}
      <LocationSelectorModal 
        isOpen={showLocationPopup} 
        onClose={() => setShowLocationPopup(false)} 
      />


      {/* 6. Mobile Slide-in Drawer Menu */}
      <AnimatePresence>
        {showMobileSidebar && (
          <motion.div 
            key="mobile-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileSidebar(false)}
            className="fixed inset-0 z-50 bg-black bg-opacity-40"
          />
        )}
        {showMobileSidebar && (
          <motion.div 
            key="mobile-sidebar-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-white flex flex-col shadow-premium"
          >
              {/* Header inside drawer */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-forest text-white">
                <Logo showText={true} />
                <button onClick={() => setShowMobileSidebar(false)} className="text-white hover:opacity-85">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Profiles details in drawer */}
              <div className="p-4 bg-forest-light/40 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                  {isAuthenticated ? (user?.name === 'Super Admin' ? 'U' : user?.name?.[0]?.toUpperCase()) : '?'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    {isAuthenticated ? `Hi, ${user?.name === 'Super Admin' ? 'User' : user?.name}` : 'Welcome Guest'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isAuthenticated ? user?.phone : 'Log in to book tests'}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                <button 
                  onClick={() => { setShowGlobalUploadModal(true); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-teal-light/50 border border-teal/20 text-teal-dark text-xs font-black uppercase tracking-wider rounded-xl hover:bg-teal-light shadow-sm transition-all"
                >
                  <FiUploadCloud className="text-teal w-5 h-5 shrink-0" />
                  <span>Upload Prescription</span>
                </button>
                <button 
                  onClick={() => { navigate('/'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiHome className="text-teal" /> Home
                </button>
                <button 
                  onClick={() => { navigate('/medicines'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiActivity className="text-teal" /> Buy Medicines
                </button>
                <button 
                  onClick={() => { navigate('/lab-tests'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiCalendar className="text-teal" /> Diagnostic Lab Tests
                </button>
                <button 
                  onClick={() => { navigate('/doctor-appointments'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiUser className="text-teal" /> Consult Doctors
                </button>
                <button 
                  onClick={() => { navigate('/orders'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiShoppingBag className="text-teal" /> My Orders
                </button>
                <button 
                  onClick={() => { navigate(isAuthenticated ? '/profile' : '/login'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiUser className="text-teal" /> My Profile
                </button>
              </div>

              {/* Footer action inside drawer */}
              <div className="p-4 border-t border-slate-100">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout} 
                    className="w-full py-2.5 min-h-[44px] bg-coral text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Log Out
                  </button>
                ) : (
                  <button 
                    onClick={() => { navigate('/login'); setShowMobileSidebar(false); }}
                    className="w-full py-2.5 min-h-[44px] bg-forest text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Log In / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>


      {/* Global Prescription Upload Modal */}
      <PrescriptionUpload 
        isOpen={showGlobalUploadModal} 
        onClose={() => setShowGlobalUploadModal(false)} 
        onUploadSuccess={handleGlobalUploadSuccess}
      />
   </div>
  );
}
