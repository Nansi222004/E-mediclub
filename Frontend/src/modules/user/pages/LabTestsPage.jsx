import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar, FiClock, FiShield, FiFileText, FiSearch,
  FiFilter, FiX, FiCheckCircle, FiChevronRight, FiChevronLeft, FiMapPin, FiActivity, FiPhoneCall,
  FiUploadCloud
} from 'react-icons/fi';
import LabTestCard from '../../../shared/components/LabTestCard';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';
import PrescriptionReviewModal from '../../../shared/components/PrescriptionReviewModal';
import { setPrescriptionFilterActive, fetchLabs, setLocation, normalizeCity } from '../store/productSlice';
import LocationSelectorModal, { getStateAbbreviation } from '../../../shared/components/LocationSelectorModal';
import LabGalleryCarousel from '../../../shared/components/LabGalleryCarousel';

export default function LabTestsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { labTests, labBookings, labs = [], doctors = [], location: locationState } = useSelector(state => state.products);
  const { user, isAuthenticated } = useSelector(state => state.auth || {});
  const globalSearchTerm = useSelector(state => state.products.searchTerm);

  const pincode = locationState?.pincode ? locationState.pincode.trim() : '';
  const city = locationState?.city ? normalizeCity(locationState.city) : '';

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [isBrowsingAll, setIsBrowsingAll] = useState(false);

  useEffect(() => {
    setIsBrowsingAll(false);
  }, [locationState?.city, locationState?.pincode]);

  const handleBrowseAll = () => {
    setIsBrowsingAll(true);
    dispatch(setLocation({ pincode: '', city: '', district: '', state: '', fullAddress: '' }));
  };

  // Prescription upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);

  const handleUploadSuccess = (newRx) => {
    dispatch(setPrescriptionFilterActive(true));
    if (newRx) {
      setActivePrescription(newRx);
      setShowReviewModal(true);
    }
  };

  // Sync global search query to local state
  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchQuery(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  // Modal & Detail States
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [isCallingCollector, setIsCallingCollector] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callStatus, setCallStatus] = useState('Calling...');

  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isLabBookingActive = (bk) => {
    if (!bk.date) return false;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    if (bk.date < todayStr) return false;
    if (bk.date > todayStr) return true;

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

  const todayStr = getTodayStr();
  const activeLabBookings = labBookings
    .filter(isLabBookingActive)
    .filter(bk => {
      if (!pincode && !city) return true;
      if (pincode && bk.pincode === pincode) return true;
      if (city && bk.city && normalizeCity(bk.city).toLowerCase() === city.toLowerCase()) return true;
      return false;
    });

  // Live Calling Simulation Timer Hook
  useEffect(() => {
    let interval;
    if (isCallingCollector) {
      const timeout = setTimeout(() => {
        setCallStatus('Connected');
      }, 2000);

      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [isCallingCollector]);

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHomeCollection, setFilterHomeCollection] = useState(false);
  const [filterFastReport, setFilterFastReport] = useState(false); // Reports within 12 Hrs
  const [filterPriceLimit, setFilterPriceLimit] = useState(3000);
  const [filterLab, setFilterLab] = useState('All');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top when lab provider filter changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [filterLab]);

  // Trigger loading skeleton on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filterHomeCollection, filterFastReport, filterPriceLimit, filterLab]);



  const labsInCity = pincode
    ? labs.filter(lab => lab.pincode === pincode)
    : city
      ? labs.filter(lab => lab.city && normalizeCity(lab.city).toLowerCase() === city.toLowerCase())
      : labs;

  const doctorsInCity = pincode
    ? doctors.filter(doc => doc.pincode === pincode)
    : city
      ? doctors.filter(doc => doc.city && normalizeCity(doc.city).toLowerCase() === city.toLowerCase())
      : doctors;

  const hasNoResultsForCity = (pincode || city) && labsInCity.length === 0;

  const baseLabs = (pincode || city) && labsInCity.length > 0
    ? labsInCity
    : labs;

  // Filter tests list
  const filteredTests = labTests.filter(test => {
    // Check if test's lab exists in the current city's labs list
    const isLabInCity = isBrowsingAll || !city || baseLabs.some(l => 
      l.name.toLowerCase().includes(test.labName.toLowerCase()) || 
      test.labName.toLowerCase().includes(l.name.toLowerCase())
    );
    if (!isLabInCity) return false;

    // Search Query
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testsIncluded.toLowerCase().includes(searchQuery.toLowerCase());

    // Home Collection
    const matchesHomeCollection = !filterHomeCollection || test.homeCollection;

    // Fast Report (Report in 6 Hrs, 8 Hrs, 12 Hrs)
    const matchesFastReport = !filterFastReport ||
      test.timeframe.includes('6 Hrs') ||
      test.timeframe.includes('8 Hrs') ||
      test.timeframe.includes('12 Hrs');

    // Price
    const currentPrice = test.discountPrice || test.price;
    const matchesPrice = currentPrice <= filterPriceLimit;

    // Specific Lab
    const matchesLab = filterLab === 'All' || test.labName.includes(filterLab);

    return matchesSearch && matchesHomeCollection && matchesFastReport && matchesPrice && matchesLab;
  });

  const labsScrollRef = useRef(null);

  const scrollLabs = (direction) => {
    if (labsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      labsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10 select-none relative font-sans">

      {/* Fallback Notice Banner */}
      {hasNoResultsForCity && (
        <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-xs font-bold text-amber-700 text-left flex items-center justify-between gap-2">
          <span>No labs found in {city} yet. Showing all available results instead.</span>
          <button
            onClick={handleBrowseAll}
            className="text-xs font-black text-amber-800 hover:text-amber-900 bg-transparent border-0 cursor-pointer outline-none transition-colors shrink-0"
          >
            [Browse All]
          </button>
        </div>
      )}


      {/* My Bookings Section (if logged in) */}
      {isAuthenticated && activeLabBookings.length > 0 && (
        <section className="flex flex-col gap-2.5 bg-white border border-slate-100 p-4 rounded-3xl shadow-premium">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-805 uppercase tracking-wider flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
              </span>
              Upcoming Diagnostics
            </h3>
            <span className="text-[8px] text-teal font-black uppercase tracking-wider bg-teal-light/20 px-2 py-0.5 rounded-md">
              {activeLabBookings.length} Collections
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 select-none">
            {activeLabBookings.map((bk) => {
              const isToday = bk.date === todayStr;
              return (
                <div
                  key={bk.id || bk._id}
                  onClick={() => {
                    if (isAuthenticated) {
                      setSelectedBookingDetails(bk);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group transition-all"
                >
                  <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-teal via-emerald-400 to-forest shadow-md group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full border border-white overflow-hidden bg-teal-light/20 flex items-center justify-center text-xl shadow-inner">
                      🧪
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" />
                  </div>

                  <span className="text-[9px] font-black text-slate-700 max-w-[70px] truncate text-center leading-none mt-1 group-hover:text-teal transition-colors">
                    {bk.packageName.replace('Checkup', '').replace('Profile', '')}
                  </span>

                  <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${isToday ? 'bg-teal-light/25 text-teal border border-teal/10 animate-pulse' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {isToday ? 'Today' : bk.date.split('-').slice(1).reverse().join('/')}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-2.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg md:text-xl font-extrabold text-slate-800">Diagnostic Lab Tests</h1>
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex items-center gap-1.5 py-1 px-3 bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-650 rounded-xl border border-slate-150 transition-all cursor-pointer outline-none shrink-0"
          >
            <FiFilter className="text-teal text-xs" />
            <span>⚙️ Diagnostic Filters</span>
            {showFiltersMobile ? <FiX className="text-[8px] shrink-0 ml-1 text-red-500" /> : null}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Accurate clinical analysis and home collection certified under NABL & ISO 9001 guidelines.
        </p>
      </div>

      {/* 2. Compact Search Row */}
      <div className="relative w-full">
        <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search tests, packages (e.g. CBC, Thyroid, Lipid)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 focus:border-teal rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-teal/20"
        />
      </div>

      {/* Lab Gallery Carousel */}
      <LabGalleryCarousel />

      {/* Expandable Slide-Down Filter Accordion Panel */}
      <AnimatePresence>
        {showFiltersMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden shadow-inner"
          >
            {/* Filter: Home Collection */}
            <div className="flex flex-col justify-center h-full pt-1">
              <label className="relative flex items-center gap-2 cursor-pointer text-[10px] font-black text-slate-650">
                <input
                  type="checkbox"
                  checked={filterHomeCollection}
                  onChange={(e) => setFilterHomeCollection(e.target.checked)}
                  className="w-4 h-4 rounded text-teal accent-teal border-slate-300 focus:ring-teal-light cursor-pointer"
                />
                <span>🏠 FREE HOME COLLECTION</span>
              </label>
            </div>

            {/* Filter: Express Timing */}
            <div className="flex flex-col justify-center h-full pt-1">
              <label className="relative flex items-center gap-2 cursor-pointer text-[10px] font-black text-slate-655">
                <input
                  type="checkbox"
                  checked={filterFastReport}
                  onChange={(e) => setFilterFastReport(e.target.checked)}
                  className="w-4 h-4 rounded text-teal accent-teal border-slate-300 focus:ring-teal-light cursor-pointer"
                />
                <span>⏱️ FAST REPORT (≤12 Hrs)</span>
              </label>
            </div>

            {/* Filter: Lab Provider */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Lab Provider</label>
              <select
                value={filterLab}
                onChange={(e) => setFilterLab(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30"
              >
                <option value="All">All Laboratories</option>
                <option value="E Mediclub">E Mediclub Labs</option>
                <option value="Metropolis">Metropolis Diagnostics</option>
                <option value="Thyrocare">Thyrocare Wellness</option>
              </select>
            </div>

            {/* Filter: Price range */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                <span>Max Package Price</span>
                <span className="text-teal font-black">₹{filterPriceLimit}</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="100"
                value={filterPriceLimit}
                onChange={(e) => setFilterPriceLimit(parseInt(e.target.value))}
                className="w-full accent-teal mt-1 cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* 5. Certified Partner Laboratories Horizontal Row (Height Reduced 50%) */}
      {baseLabs.length > 0 && (
        <section className="flex flex-col gap-2 relative group select-none">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Certified Partner Laboratories</h3>
            <span className="text-[9px] text-slate-400 font-bold hidden sm:block">Scroll to view all labs</span>
          </div>
          
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollLabs('left')}
            className="absolute left-1 top-[60%] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-600 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
          >
            <FiChevronLeft className="text-xs" />
          </button>

          {/* Laboratories Horizontal Row */}
          <div 
            ref={labsScrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-6 -mx-4"
          >
            {baseLabs.map((lab) => (
              <div
                key={lab.id || lab._id}
                onClick={() => navigate(`/labs/${lab.id}`)}
                className="bg-white px-3 py-2.5 rounded-2xl border border-slate-100 hover:border-teal/30 shadow-premium hover:shadow-premium-hover shrink-0 w-64 cursor-pointer transition-all duration-200 flex items-center justify-between gap-2.5 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner border border-slate-100 bg-slate-50">
                    {lab.logo && (lab.logo.startsWith('http://') || lab.logo.startsWith('https://')) ? (
                      <img src={lab.logo} alt={lab.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-2xl font-black text-teal">{lab.logo}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[10.5px] font-black text-slate-805 leading-tight group-hover:text-teal transition-colors truncate w-32">
                      {lab.name}
                    </h4>
                    <span className="text-[8px] text-slate-400 font-extrabold block mt-0.5 uppercase tracking-wide">NABL Accredited</span>
                  </div>
                </div>
                <span className="text-[9px] text-amber-500 font-black flex items-center gap-0.5 bg-amber-50 px-1 py-0.5 rounded shrink-0">
                  ★ {lab.rating}
                </span>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollLabs('right')}
            className="absolute right-1 top-[60%] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-655 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
          >
            <FiChevronRight className="text-xs" />
          </button>
        </section>
      )}

      {/* 6. Compact Safe Lab Guarantee Strip */}
      <div className="w-full mt-6 mb-4 bg-teal-light/20 border border-teal/10 rounded-full py-2.5 px-4 flex items-center justify-center text-[10px] font-extrabold text-teal-dark text-center select-none shadow-sm animate-pulse-subtle">
        🩸 Safe Lab Guarantee • NABL Certified • Verified Reports
      </div>

      {/* 7. Diagnostic Packages Display Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
          <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Available Diagnostic Packages</h3>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{filteredTests.length} tests found</span>
        </div>

        {isLoading ? (
          /* Shimmer skeletons loader grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4 animate-pulse-subtle">
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-3 bg-slate-200 rounded" />
                  <div className="w-1/4 h-3 bg-slate-150 rounded" />
                </div>
                <div className="w-3/4 h-4 bg-slate-200 rounded mt-1" />
                <div className="w-1/2 h-3.5 bg-slate-150 rounded mt-1" />
                <div className="h-10 bg-slate-50 border border-slate-100 rounded-2xl mt-2" />
                <div className="flex justify-between items-center mt-3 border-t border-slate-50 pt-3">
                  <div className="w-1/4 h-5 bg-slate-200 rounded" />
                  <div className="w-1/3 h-8 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : baseLabs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-4.5 select-none">
            <span className="text-5xl animate-pulse font-black">🧪</span>
            <h4 className="font-black text-slate-800 text-sm">No Labs Found in {locationState?.city || 'this area'}</h4>
            <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto leading-relaxed uppercase">
              We are expanding to your area soon! You can browse all labs or change your location search.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleBrowseAll}
                className="py-2.5 px-6 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 transition-colors"
              >
                Browse All
              </button>
              <button
                onClick={() => setShowLocationPopup(true)}
                className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 transition-colors"
              >
                Change Location
              </button>
            </div>
          </div>
        ) : filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTests.map((test) => (
              <LabTestCard key={test.id || test._id} test={test} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl">🧪</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Diagnostic Packages Match Filters</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
              We offer comprehensive blood panels and specialist testing. Try adjusting your price limits or search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterHomeCollection(false);
                setFilterFastReport(false);
                setFilterPriceLimit(3000);
                setFilterLab('All');
              }}
              className="mt-2 py-2 px-6 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>



      {/* Lab Test Booking Details Modal */}
      <AnimatePresence>
        {selectedBookingDetails && (
          <motion.div
            key="lab-booking-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 relative"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal to-teal-dark p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧪</span>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider">Booking Details</h3>
                    <p className="text-[9px] text-teal-light/80 font-black uppercase mt-0.5">
                      Ref No: {selectedBookingDetails.id} • SCHEDULED
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer transition-colors"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto no-scrollbar">

                {/* Package Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2.5">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Diagnostic Package</span>
                  <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{selectedBookingDetails.packageName}</h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mt-1 pt-2 border-t border-slate-150">
                    <span>Lab Partner:</span>
                    <span className="text-teal font-black">E Mediclub Labs (NABL)</span>
                  </div>
                </div>

                {/* Patient & Address Details */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Patient Info</span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Name</span>
                      <span className="font-extrabold text-slate-800">{user?.name || user?.firstName || 'Rishi'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Contact</span>
                      <span className="font-extrabold text-slate-800">{user?.phone || '+91 9892989898'}</span>
                    </div>
                    <div className="col-span-2 flex flex-col gap-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Sample Collection Address</span>
                      <span className="font-semibold text-slate-750">{selectedBookingDetails.address || 'Home (Mumbai)'}</span>
                    </div>
                  </div>
                </div>

                {/* Collector & OTP */}
                <div className="bg-teal-light/20 p-4.5 rounded-2xl border border-teal/10 flex flex-col gap-3">
                  <span className="text-[9px] font-black uppercase text-teal-dark tracking-wider">Home Collector Assigned</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg">
                      👨‍🔬
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-850">Vikram Singh</h5>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        NABL Phlebotomist • Active
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-teal/5 mt-1">
                    <span className="text-[10px] text-slate-500 font-bold">Verification OTP:</span>
                    <span className="text-sm text-teal font-black tracking-wider">5829</span>
                  </div>
                </div>

                {/* Pre-Test Instructions */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Fasting & Pre-Test Instructions</span>
                  <ul className="text-[10px] text-slate-500 font-semibold list-disc pl-4 flex flex-col gap-1">
                    <li>10-12 hours mandatory fasting required before blood draw.</li>
                    <li>Avoid morning caffeinated drinks (coffee, tea, etc.) prior to test.</li>
                    <li>Drink plenty of water to maintain vascular hydration.</li>
                    <li>Phlebotomist will verify your verification OTP before sample drawing.</li>
                  </ul>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-5 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                >
                  Close details
                </button>
                <button
                  onClick={() => {
                    setIsCallingCollector(true);
                    setCallStatus('Calling...');
                    setCallTimer(0);
                  }}
                  className="flex-1 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black text-center uppercase tracking-wider rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0"
                >
                  <FiPhoneCall /> Contact Collector
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Live Calling Phlebotomist Modal */}
      <AnimatePresence>
        {isCallingCollector && (
          <motion.div
            key="phlebotomist-call-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[60] flex flex-col items-center justify-between p-8 text-white select-none"
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                SECURE VOIP CALL
              </span>
              <span>E MEDICLUB COMPLIANT</span>
            </div>

            {/* Profile & Pulse Ring */}
            <div className="flex flex-col items-center gap-6 mt-10">
              <div className="relative flex items-center justify-center">
                {/* Expanding Pulse Rings */}
                <motion.div
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute w-24 h-24 rounded-full bg-teal/30"
                />
                <motion.div
                  animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                  className="absolute w-24 h-24 rounded-full bg-teal/20"
                />

                <div className="w-28 h-28 rounded-full bg-teal text-white flex items-center justify-center text-5xl font-bold border-4 border-white/10 shadow-premium z-10">
                  👨‍🔬
                </div>
              </div>

              <div className="text-center flex flex-col gap-1 mt-2">
                <h3 className="text-xl font-extrabold tracking-wide">Vikram Singh</h3>
                <span className="text-[10px] text-teal font-black uppercase tracking-widest">NABL Phlebotomist Assigned</span>
                <p className="text-sm font-semibold text-slate-300 mt-2">
                  {callStatus === 'Calling...' ? 'Calling...' : `Connected • ${formatCallTime(callTimer)}`}
                </p>
              </div>
            </div>

            {/* Subtitles & Collector Voice Simulation */}
            <div className="max-w-xs w-full text-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl min-h-[70px] flex items-center justify-center text-xs font-semibold text-slate-200 leading-relaxed">
              {callStatus === 'Calling...' ? (
                <span className="text-slate-400 italic">Initiating secure clinical connection...</span>
              ) : callTimer < 5 ? (
                <span className="text-teal-400 font-extrabold">
                  "Hello, E Mediclub Diagnostics here. Vikram Singh speaking. Am I speaking with Rishi?"
                </span>
              ) : callTimer < 10 ? (
                <span>
                  "Great! I have received your blood collection request. I will arrive at your Mumbai address at 9:00 AM."
                </span>
              ) : callTimer < 16 ? (
                <span>
                  "Please ensure you maintain 10-12 hours fasting before my arrival. I will call you once I reach your gate."
                </span>
              ) : (
                <span className="text-teal-400">
                  "Thank you for choosing E Mediclub. Have a great day!"
                </span>
              )}
            </div>

            {/* Calling Controls */}
            <div className="flex flex-col items-center gap-8 w-full max-w-xs mb-10">
              <div className="flex justify-around w-full">
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-0 cursor-pointer text-lg text-white">
                  🔇
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-0 cursor-pointer text-lg text-white">
                  🔢
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-0 cursor-pointer text-lg text-white">
                  🔊
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={() => setIsCallingCollector(false)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center border-0 cursor-pointer shadow-lg transform active:scale-95 transition-all text-xl"
              >
                📞
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prescription Upload Sheet Modal */}
      <PrescriptionUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Prescription Review Details Modal */}
      <PrescriptionReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        prescription={activePrescription}
      />

      <LocationSelectorModal isOpen={showLocationPopup} onClose={() => setShowLocationPopup(false)} />
    </div>
  );
}
