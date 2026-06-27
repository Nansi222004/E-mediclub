import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiVideo,
  FiFilter, FiX, FiMessageSquare, FiMapPin, FiAward, FiMic, FiCameraOff,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorCard from '../../../shared/components/DoctorCard';
import { completeDoctorAppointment, setLocation, normalizeCity } from '../store/productSlice';
import LocationSelectorModal from '../../../shared/components/LocationSelectorModal';
import DoctorGalleryCarousel from '../../../shared/components/DoctorGalleryCarousel';

const cityCoordinates = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Ujjain": { lat: 23.1760, lng: 75.7885 },
  "Dewas": { lat: 22.9623, lng: 76.0508 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 }
};

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Redux Selectors
  const { doctors, appointments, labs = [], location: locationState, isLoading } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth || {});
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

  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchQuery(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  // States
  const [activeCallApt, setActiveCallApt] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [selectedCircleApt, setSelectedCircleApt] = useState(null);

  const getTodayStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDoctorAvatar = (apt) => {
    if (apt.avatar) return apt.avatar;
    const doc = doctors.find(d => d.name === apt.doctorName || d.id === apt.doctorId);
    return doc?.avatar || `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80`;
  };

  const isAppointmentActive = (apt) => {
    if (!apt.date) return false;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    if (apt.date < todayStr) return false;
    if (apt.date > todayStr) return true;
    
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
  const activeAppointments = appointments
    .filter(isAppointmentActive)
    .filter(apt => {
      if (!pincode && !city) return true;
      if (pincode && apt.pincode === pincode) return true;
      if (city && apt.city && normalizeCity(apt.city).toLowerCase() === city.toLowerCase()) return true;
      return false;
    });

  // Trigger active call timer simulation
  useEffect(() => {
    let interval;
    if (activeCallApt) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCallApt]);

  // Filter States
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All'); // 'All', 'Online', 'Offline', 'Both'
  const [filterGender, setFilterGender] = useState('All'); // 'All', 'male', 'female'
  const [filterExperience, setFilterExperience] = useState('All'); // 'All', '10+', '15+'
  const [filterFeeMax, setFilterFeeMax] = useState(1500);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);


  // Scroll to top when doctor specialty changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [selectedSpecialty]);

  // Selected doctor for full profile drawer
  const [selectedProfileDoc, setSelectedProfileDoc] = useState(null);

  // List of all 18 departments with matched emojis
  const departments = [
    { name: 'All', label: 'All Doctors', icon: '👨‍⚕' },
    { name: 'Dermatology', label: 'Dermatology (Skin & Hair)', icon: '🧴' },
    { name: 'Gynaecology & Obstetrics', label: 'Gynaecology & Obstetrics', icon: '🤰' },
    { name: 'Orthopaedics', label: 'Orthopaedics (Bone & Joint)', icon: '🦴' },
    { name: 'Cardiology', label: 'Cardiology (Heart)', icon: '🫀' },
    { name: 'General Physician', label: 'General Physician', icon: '🩺' },
    { name: 'Paediatrics', label: 'Paediatrics (Child Care)', icon: '👶' },
    { name: 'Neurology', label: 'Neurology (Brain & Nerves)', icon: '🧠' },
    { name: 'Psychiatry & Mental Health', label: 'Psychiatry & Mental Health', icon: '🧘' },
    { name: 'ENT', label: 'ENT (Ear, Nose & Throat)', icon: '👃' },
    { name: 'Ophthalmology', label: 'Ophthalmology (Eye Care)', icon: '👁️' },
    { name: 'Gastroenterology', label: 'Gastroenterology (Stomach & Gut)', icon: '🍎' },
    { name: 'Endocrinology', label: 'Endocrinology (Diabetes & Hormones)', icon: '🩸' },
    { name: 'Pulmonology (Lungs & Chest)', label: 'Pulmonology (Lungs & Chest)', icon: '🫁' },
    { name: 'Urology', label: 'Urology', icon: '💦' },
    { name: 'Oncology (Cancer Care)', label: 'Oncology (Cancer Care)', icon: '🎗️' },
    { name: 'Nephrology (Kidney)', label: 'Nephrology (Kidney)', icon: '🫘' },
    { name: 'Dentistry', label: 'Dentistry', icon: '🦷' }
  ];

  // Removed artificial skeleton loader on filter change to stop flickering



  const doctorsInCity = pincode
    ? doctors.filter(doc => doc.pincode === pincode)
    : city
      ? doctors.filter(doc => doc.city && normalizeCity(doc.city).toLowerCase() === city.toLowerCase())
      : doctors;

  const labsInCity = pincode
    ? labs.filter(lab => lab.pincode === pincode)
    : city
      ? labs.filter(lab => lab.city && normalizeCity(lab.city).toLowerCase() === city.toLowerCase())
      : labs;

  const hasNoResultsForCity = (pincode || city) && doctorsInCity.length === 0;

  const rawBaseDoctors = (pincode || city) && doctorsInCity.length > 0
    ? doctorsInCity
    : doctors;

  const baseDoctors = React.useMemo(() => {
    const unique = new Map();
    rawBaseDoctors.forEach(doc => {
      if (!unique.has(doc.name)) {
        unique.set(doc.name, doc);
      }
    });
    return Array.from(unique.values());
  }, [rawBaseDoctors]);

  // Filter Doctors list
  const filteredDoctors = baseDoctors.filter(doc => {
    // Search Query
    const matchesSearch = (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.qualification || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Specialty / Department
    const matchesSpecialty = selectedSpecialty === 'All' ||
      (doc.specialty || '').toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
      (selectedSpecialty === 'Pulmonology (Lungs & Chest)' && (doc.specialty || '').includes('Pulmonology')) ||
      (selectedSpecialty === 'Oncology (Cancer Care)' && (doc.specialty || '').includes('Oncology')) ||
      (selectedSpecialty === 'Nephrology (Kidney)' && (doc.specialty || '').includes('Nephrology'));

    // Mode
    const matchesMode = filterMode === 'All' ||
      doc.consultationMode === filterMode ||
      doc.consultationMode === 'Both';

    // Gender
    const isFemale = (doc.avatar || '').includes('1559839734-2b71ea197ec2') || (doc.name || '').includes('Priya') || (doc.name || '').includes('Sunita') || (doc.name || '').includes('Anita') || (doc.name || '').includes('Pooja') || (doc.name || '').includes('Deepa') || (doc.name || '').includes('Shalini') || (doc.name || '').includes('Smita') || (doc.name || '').includes('Aarti') || (doc.name || '').includes('Anjali') || (doc.name || '').includes('Sneha') || (doc.name || '').includes('Preeti') || (doc.name || '').includes('Meera') || (doc.name || '').includes('Radhika') || (doc.name || '').includes('Neha') || (doc.name || '').includes('Shruti');
    const matchesGender = filterGender === 'All' ||
      (filterGender === 'female' && isFemale) ||
      (filterGender === 'male' && !isFemale);

    // Experience
    const expNum = parseInt(doc.experience) || 0;
    const matchesExperience = filterExperience === 'All' ||
      (filterExperience === '10+' && expNum >= 10) ||
      (filterExperience === '15+' && expNum >= 15);

    // Fee limit
    const matchesFee = doc.fee <= filterFeeMax;

    return matchesSearch && matchesSpecialty && matchesMode && matchesGender && matchesExperience && matchesFee;
  });

  const deptScrollRef = useRef(null);

  const scrollDepts = (direction) => {
    if (deptScrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      deptScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-10 select-none relative font-sans">

      {/* Fallback Notice Banner */}
      {hasNoResultsForCity && (
        <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-xs font-bold text-amber-700 text-left flex items-center justify-between gap-2">
          <span>No doctors found in {city} yet. Showing all available results instead.</span>
          <button
            onClick={handleBrowseAll}
            className="text-xs font-black text-amber-800 hover:text-amber-900 bg-transparent border-0 cursor-pointer outline-none transition-colors shrink-0"
          >
            [Browse All]
          </button>
        </div>
      )}



      {/* 2. Upcoming Active Appointments section */}
      {isAuthenticated && (
        <section className="flex flex-col gap-2.5 bg-white border border-slate-100 p-4 rounded-3xl shadow-premium text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-805 uppercase tracking-wider flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
              </span>
              Upcoming Doctor Appointments
            </h3>
            <span className="text-[8px] text-teal font-black uppercase tracking-wider bg-teal-light/20 px-2 py-0.5 rounded-md">
              {activeAppointments.length} Scheduled
            </span>
          </div>

          {activeAppointments.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 select-none">
              {activeAppointments.map((apt) => {
                const avatar = getDoctorAvatar(apt);
                const isToday = apt.date === todayStr;
                return (
                  <div
                    key={apt.id || apt._id}
                    onClick={() => setSelectedCircleApt(apt)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group transition-all"
                  >
                    <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-teal via-emerald-400 to-forest shadow-md group-hover:scale-105 transition-all duration-300">
                      <div className="w-full h-full rounded-full border border-white overflow-hidden bg-slate-100">
                        <img
                          src={avatar}
                          alt={apt.doctorName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" />
                    </div>

                    <span className="text-[9px] font-black text-slate-700 max-w-[70px] truncate text-center leading-none mt-1 group-hover:text-teal transition-colors">
                      {apt.doctorName.replace('Dr. ', '')}
                    </span>

                    <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isToday ? 'bg-teal-light/25 text-teal border border-teal/10 animate-pulse' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isToday ? 'Today' : apt.date.split('-').slice(1).reverse().join('/')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl text-center">
              <p className="text-[11px] text-slate-700 font-extrabold">No upcoming doctor consultations booked.</p>
              <p className="text-[9px] text-slate-400 font-semibold mt-1">Book your first video call or clinic visit with our expert doctors below.</p>
            </div>
          )}
        </section>
      )}


      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold text-slate-805">Doctor Consultations</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Verified specialists. Instantly book online video appointments or in-clinic visits.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[9px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black tracking-wider uppercase">Practo Assured</span>
          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black tracking-wider uppercase">100% Secure</span>
        </div>
      </div>



      {/* 4. Compact Search + Filters Toggle Row */}
      <div className="flex gap-2.5 w-full items-center">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by doctor name, specialty, degree or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 focus:border-teal rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-teal/20"
          />
        </div>
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-655 rounded-xl border border-slate-150 transition-all cursor-pointer outline-none shrink-0"
        >
          <FiFilter className="text-teal text-xs" />
          <span>⚙ Filters</span>
          {showFiltersMobile ? <FiX className="text-[8px] shrink-0 ml-1 text-red-500" /> : null}
        </button>
      </div>

      {/* Doctor Gallery Carousel */}
      <DoctorGalleryCarousel />

      {/* Expandable Advanced Filters Deck (Accordion style, collapsed by default) */}
      <AnimatePresence>
        {showFiltersMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden shadow-inner text-left"
          >
            {/* Horizontal Scrollable Department Filter Slider */}
            <div className="col-span-full relative w-full bg-white p-3 rounded-2xl border border-slate-150 shadow-sm select-none group">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-[10px] font-black text-slate-455 uppercase tracking-widest">Shop by Clinical Department</h3>
                <span className="text-[8.5px] text-slate-400 font-bold hidden sm:block">Scroll to browse all specialties</span>
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollDepts('left')}
                className="absolute left-1 top-[60%] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-600 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
              >
                <FiChevronLeft className="text-xs" />
              </button>

              {/* Departments Row */}
              <div 
                ref={deptScrollRef}
                className="w-full overflow-x-auto no-scrollbar scroll-smooth flex gap-2 py-0.5 px-6"
              >
                {departments.map((dept) => (
                  <button
                    key={dept.name}
                    type="button"
                    onClick={() => setSelectedSpecialty(dept.name)}
                    className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 text-xs font-black rounded-full transition-all shrink-0 cursor-pointer duration-200 border ${selectedSpecialty === dept.name
                        ? 'bg-forest text-white border-forest shadow-sm'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-forest/20 hover:bg-slate-105'
                      }`}
                  >
                    <span className="text-sm">{dept.icon}</span>
                    <span>{dept.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollDepts('right')}
                className="absolute right-1 top-[60%] -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-655 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
              >
                <FiChevronRight className="text-xs" />
              </button>
            </div>

             {/* Filter: Consultation Mode */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Consultation Mode</label>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30"
              >
                <option value="All">All Consultation Modes</option>
                <option value="Online">📹 Online Video</option>
                <option value="Offline">🏥 In-Clinic Consults</option>
                <option value="Both">✨ Both Modes Available</option>
              </select>
            </div>

            {/* Filter: Doctor Gender */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Doctor Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-slate-655 cursor-pointer outline-none focus:border-teal/30"
              >
                <option value="All">All Genders</option>
                <option value="male">Male Doctor</option>
                <option value="female">Female Doctor</option>
              </select>
            </div>

            {/* Filter: Experience */}
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Experience Level</label>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                className="pl-2.5 pr-8 py-1.5 rounded-lg border border-slate-100 bg-white text-[10px] font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30"
              >
                <option value="All">Any Experience</option>
                <option value="10+">10+ Years of Experience</option>
                <option value="15+">15+ Years of Experience</option>
              </select>
            </div>

            {/* Filter: Max Fee */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400 tracking-wider">
                <span>Max Consultation Fee</span>
                <span className="text-teal font-black">₹{filterFeeMax}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={filterFeeMax}
                onChange={(e) => setFilterFeeMax(parseInt(e.target.value))}
                className="w-full accent-teal mt-1 cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Doctor Directory list grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
          <h2 className="text-sm font-extrabold text-slate-800">
            {selectedSpecialty === 'All' ? 'All' : selectedSpecialty} Specialists
          </h2>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {filteredDoctors.length} doctors found
          </span>
        </div>

        {isLoading ? (
          /* Premium Shimmer Skeleton loading state */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4 select-none animate-pulse-subtle">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 mt-1">
                    <div className="w-1/2 h-4 rounded bg-slate-200" />
                    <div className="w-1/3 h-3 rounded bg-slate-150" />
                    <div className="w-1/4 h-2.5 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-10 rounded-2xl bg-slate-50 border border-slate-100" />
                <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-3">
                  <div className="w-1/3 h-4 bg-slate-200 rounded" />
                  <div className="w-1/4 h-8 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-4.5 select-none">
            <span className="text-5xl animate-pulse font-black">🕐</span>
            <h4 className="font-black text-slate-805 text-sm">No Doctors Found in {locationState?.city || 'this area'}</h4>
            <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto leading-relaxed uppercase">
              We are expanding to your area soon! You can browse all doctors or change your location search.
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
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id || doc._id}
                doctor={doc}
                onViewProfile={() => setSelectedProfileDoc(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl animate-bounce font-black">👨‍⚕️</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Doctor Profiles Match Filters</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
              We have doctors available in all categories. Try adjusting your advanced filter limits or remove search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('All');
                setSearchQuery('');
                setFilterMode('All');
                setFilterGender('All');
                setFilterExperience('All');
                setFilterFeeMax(1500);
              }}
              className="mt-2 py-2 px-6 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. Premium Float Support consultation details bubble */}
      <div className="hidden md:block fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
        <button
          onClick={() => navigate('/lab-tests')}
          className="flex items-center gap-2 p-3.5 bg-teal hover:bg-teal-dark text-white rounded-full shadow-premium-hover hover:scale-105 transition-all duration-300 group cursor-pointer border-0"
        >
          <span className="text-lg">🩸</span>
          <span className="text-[10px] font-black uppercase tracking-wider hidden group-hover:block pr-1">Need a Lab Test?</span>
        </button>
      </div>

      {/* 7. FULL DETAILED PROFILE DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProfileDoc && (
          <motion.div
            key="doctor-profile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
          >
            {/* Drawer Backdrop */}
            <div
              onClick={() => setSelectedProfileDoc(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Profile Drawer Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium z-10 flex flex-col gap-5 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Close helper */}
              <button
                onClick={() => setSelectedProfileDoc(null)}
                className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer border-0 transition-colors"
              >
                <FiX className="text-sm shrink-0" />
              </button>

              {/* Profile Header */}
              <div className="flex gap-4 items-start border-b border-slate-100 pb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                  <img src={selectedProfileDoc.avatar} alt={selectedProfileDoc.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-base font-black text-slate-800 leading-snug">{selectedProfileDoc.name}</h2>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse shrink-0" title="Active Online" />
                  </div>
                  <span className="text-[10px] text-teal font-black uppercase tracking-wider block mt-1">{selectedProfileDoc.specialty} • {selectedProfileDoc.subSpecialty}</span>
                  <p className="text-[10px] text-slate-450 font-bold mt-1 leading-relaxed">{selectedProfileDoc.qualification}</p>

                  <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                    <FiAward className="text-teal" />
                    <span>Reg No: {selectedProfileDoc.registrationNumber}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Hospital Affiliation */}
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">About Doctor</h4>
                  <p className="text-xs text-slate-650 font-medium leading-relaxed italic">"{selectedProfileDoc.bio}"</p>
                </div>

                <div className="bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl flex gap-2.5 items-start">
                  <FiMapPin className="text-teal mt-0.5 shrink-0" />
                  <div className="w-full">
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase">Hospital Affiliation</h5>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{selectedProfileDoc.hospital}</p>
                    
                    {/* Embedded Map */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-50 shadow-inner">
                      <iframe
                        title="Hospital Location Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedProfileDoc.hospital + ", " + selectedProfileDoc.city)}&ll=${cityCoordinates[selectedProfileDoc.city]?.lat || 19.0760},${cityCoordinates[selectedProfileDoc.city]?.lng || 72.8777}&z=12&t=&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation details stats list */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-slate-150/65 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex flex-col gap-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Online Fee</span>
                  <strong className="text-sm font-black text-slate-800">₹{selectedProfileDoc.fee}</strong>
                </div>
                <div className="flex flex-col gap-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">In-Person Fee</span>
                  <strong className="text-sm font-black text-slate-800">₹{selectedProfileDoc.offlineFee}</strong>
                </div>
                <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Experience</span>
                  <strong className="text-[11px] font-extrabold text-slate-800">{selectedProfileDoc.experience}</strong>
                </div>
                <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Languages</span>
                  <strong className="text-[10px] font-extrabold text-slate-800 truncate">{selectedProfileDoc.languages.join(', ')}</strong>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-slate-150/65 pt-4">
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiMessageSquare className="text-teal" /> Patient Reviews ({selectedProfileDoc.reviewsCount})
                </h4>

                <div className="flex flex-col gap-3.5 max-h-52 overflow-y-auto no-scrollbar pr-1">
                  {selectedProfileDoc.testimonials && selectedProfileDoc.testimonials.map((testi, idx) => (
                    <div key={idx} className="bg-slate-50/40 p-3.5 border border-slate-100 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-50">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span className="text-slate-850 font-extrabold">{testi.patientName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500">★ {testi.rating}.0</span>
                          <span className="text-slate-350">•</span>
                          <span className="text-slate-400">{testi.date}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">"{testi.reviewText}"</p>
                      <span className="text-[8px] bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded font-black text-slate-400 uppercase tracking-wide w-fit">{testi.mode} Visit</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                onClick={() => {
                  const docId = selectedProfileDoc.id;
                  setSelectedProfileDoc(null);
                  if (isAuthenticated) {
                    navigate(`/doctors/${docId}/book`);
                  } else {
                    navigate('/login', { state: { from: `/doctors/${docId}/book` } });
                  }
                }}
                className="w-full mt-2 py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm transition-all border-0 cursor-pointer"
              >
                Instant Appointment Booking (₹{selectedProfileDoc.fee})
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. SIMULATED TELEHEALTH VIDEO CALL MODAL OVERLAY */}
      <AnimatePresence>
        {activeCallApt && (
          <motion.div
            key="telehealth-call-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 bg-slate-950"
          >
            {/* Immersive Dark Call Interface */}
            <div className="relative w-full h-full flex flex-col justify-between p-6 select-none max-w-4xl mx-auto">
              
              {/* Top Bar */}
              <div className="flex items-center justify-between text-white z-10 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider">Clinical Live Stream</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{activeCallApt.doctorName} • {activeCallApt.specialty}</p>
                  </div>
                </div>
                
                {/* Timer split */}
                <div className="bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700 text-xs font-black tracking-widest font-mono text-emerald-400">
                  {(() => {
                    const mins = Math.floor(callTimer / 60).toString().padStart(2, '0');
                    const secs = (callTimer % 60).toString().padStart(2, '0');
                    return `${mins}:${secs}`;
                  })()}
                </div>
              </div>

              {/* Main Doctor Feed / Connection Stream */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                {/* Doctor Visual Frame */}
                {callTimer < 2 ? (
                  <div className="flex flex-col items-center gap-3 text-center z-10">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-teal animate-spin" />
                    <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Connecting secure telehealth line...</span>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {/* Simulated Doctor Video image background */}
                    <img 
                      src={activeCallApt.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"} 
                      alt="Doctor feed" 
                      className="w-full h-full object-cover opacity-35 filter blur-sm absolute inset-0"
                    />
                    
                    {/* Centered Profile Avatar card with animated sonar waves */}
                    <div className="relative flex flex-col items-center gap-3 z-10 bg-slate-900/80 border border-slate-850 p-8 rounded-[36px] shadow-2xl max-w-sm">
                      <div className="absolute -inset-1 rounded-[38px] bg-gradient-to-r from-teal to-forest opacity-30 blur animate-pulse" />
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-teal shadow-xl bg-slate-800 shrink-0">
                        <img 
                          src={activeCallApt.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80"} 
                          alt={activeCallApt.doctorName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <h4 className="text-sm font-black text-white">{activeCallApt.doctorName}</h4>
                      <span className="text-[10px] text-teal font-black uppercase tracking-wider bg-teal-light/10 px-3 py-1 rounded-full border border-teal/20">Video Channel Active</span>
                      <p className="text-[10px] text-slate-450 font-bold text-center leading-normal">Pathology records have been loaded. Please start describing your clinical concerns.</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Patient Corner Picture-in-Picture Preview */}
              <div className="absolute bottom-28 right-6 w-24 h-32 md:w-32 md:h-44 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col items-center justify-center text-center">
                {isCamOff ? (
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <FiCameraOff className="text-xl" />
                    <span className="text-[8px] font-black uppercase">CAM OFF</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                    {/* Patient silhouette */}
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-base">👤</div>
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] font-black bg-black/60 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">You (Self)</span>
                    {/* Micro green glowing light */}
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                  </div>
                )}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-center gap-4.5 z-10 w-full bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-3 rounded-full border-0 cursor-pointer text-base transition-colors ${
                    isMicMuted ? 'bg-red-500/25 text-red-500 border border-red-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <FiMic />
                </button>
                
                {/* Hangup Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    dispatch(completeDoctorAppointment(activeCallApt.id));
                    setActiveCallApt(null);
                    alert("Consultation ended. Your prescription notes are syncing to your active profile.");
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg border-0 cursor-pointer transition-colors"
                >
                  📞 HANG UP & COMPLETE
                </button>

                <button
                  type="button"
                  onClick={() => setIsCamOff(!isCamOff)}
                  className={`p-3 rounded-full border-0 cursor-pointer text-base transition-colors ${
                    isCamOff ? 'bg-red-500/25 text-red-500 border border-red-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <FiCameraOff />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active appointment circle detail modal */}
      <AnimatePresence>
        {selectedCircleApt && (
          <motion.div
            key="active-apt-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none"
          >
            {/* Backdrop click close */}
            <div 
              onClick={() => setSelectedCircleApt(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-premium z-10 flex flex-col gap-4.5"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCircleApt(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-450 hover:text-slate-650 rounded-lg cursor-pointer border-0 transition-colors"
              >
                <FiX className="text-sm shrink-0" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] bg-teal-light/20 text-teal font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Active Consultation Details
                </span>
              </div>

              {/* Doctor Details */}
              <div className="flex gap-4 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-150 shrink-0">
                  <img 
                    src={getDoctorAvatar(selectedCircleApt)} 
                    alt={selectedCircleApt.doctorName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="text-sm font-extrabold text-slate-800 leading-tight truncate">{selectedCircleApt.doctorName}</h4>
                  <p className="text-[10px] text-teal font-black uppercase tracking-wider mt-0.5">{selectedCircleApt.specialty}</p>
                </div>
              </div>

              {/* Consultation Details Card */}
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-650 border-t border-b border-slate-100 py-3 mt-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled For:</span>
                  <span className="text-slate-800 font-extrabold">{selectedCircleApt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment Slot:</span>
                  <span className="text-slate-800 font-extrabold">{selectedCircleApt.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation Mode:</span>
                  <span className="text-slate-800 font-extrabold uppercase text-[10px]">{selectedCircleApt.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Status:</span>
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">Confirmed & Verified</span>
                </div>
                {selectedCircleApt.city && (
                  <div className="flex justify-between pt-1 mt-1 border-t border-slate-50">
                    <span className="text-slate-400">Booked City:</span>
                    <span className="text-slate-800 font-extrabold uppercase text-[10px]">{selectedCircleApt.city}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full mt-2">
                {selectedCircleApt.type.includes('Online') ? (
                  <button
                    onClick={() => {
                      const apt = selectedCircleApt;
                      setSelectedCircleApt(null);
                      setActiveCallApt(apt);
                    }}
                    className="w-full py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm border-0 cursor-pointer outline-none flex items-center justify-center gap-1.5 animate-pulse"
                  >
                    <FiVideo className="text-sm shrink-0" />
                    <span>JOIN CLINICAL CALL NOW</span>
                  </button>
                ) : (
                  <div className="bg-amber-50/65 p-3 border border-amber-100 rounded-2xl text-center flex flex-col gap-1">
                    <span className="text-lg">🏥</span>
                    <h5 className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wide">Clinic Location Visit</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      This is an offline consult{selectedCircleApt.city ? ` in ${selectedCircleApt.city}` : ''}. Please visit the doctor's hospital counter 15 minutes before the time slot.
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedCircleApt(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 text-xs font-black uppercase tracking-wider rounded-2xl border-0 cursor-pointer outline-none"
                >
                  Close Window
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationSelectorModal isOpen={showLocationPopup} onClose={() => setShowLocationPopup(false)} />
    </div>
  );
}
