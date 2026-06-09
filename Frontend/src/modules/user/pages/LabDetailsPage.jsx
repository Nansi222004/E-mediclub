import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiArrowLeft, FiMapPin, FiClock, FiPhone, FiCheckCircle, FiShield, 
  FiStar, FiActivity, FiImage, FiAward, FiMessageSquare, FiCalendar,
  FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function LabDetailsPage() {
  const { labId } = useParams();
  const navigate = useNavigate();

  // Redux Selectors
  const { labs = [], labTests = [] } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth || {});
  const lab = labs.find(l => l.id === labId) || labs.find(l => labId === 'em-lab-2' && (l.id === 'lab-mum-2' || l.name?.toLowerCase().includes('metropolis')));

  // Active gallery slide index
  const [activeSlide, setActiveSlide] = useState(0);

  // Expandable reviews state
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Auto sliding facility gallery carousel timer
  useEffect(() => {
    if (!lab || !lab.gallery || lab.gallery.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % lab.gallery.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [lab]);

  if (!lab) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <FiActivity className="text-coral text-5xl mb-4 animate-pulse" />
        <h2 className="text-base font-extrabold text-slate-800">Laboratory Center Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold mt-2">The requested laboratory details could not be retrieved.</p>
        <button 
          onClick={() => navigate('/lab-tests')}
          className="mt-5 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer border-0"
        >
          Return to Lab Directory
        </button>
      </div>
    );
  }

  // Get all packages offered by this lab
  const offeredTests = labTests.filter(t => t.labId === lab.id);

  // Reviews selection (show 2 reviews initially)
  const displayedReviews = showAllReviews ? lab.reviews : lab.reviews.slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 font-sans select-none">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/lab-tests')}
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-450 hover:text-teal transition-colors mb-4 uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
      >
        <FiArrowLeft /> Back to Lab Tests
      </button>

      {/* Main Container */}
      <div className="flex flex-col gap-4">
        
        {/* 1. Lab Cover / Header Block */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-light/20 rounded-full filter blur-3xl opacity-60" />
          
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner border border-slate-100 bg-slate-50">
              {lab.logo && (lab.logo.startsWith('http://') || lab.logo.startsWith('https://')) ? (
                <img src={lab.logo} alt={lab.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-teal">{lab.logo}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base md:text-lg font-black text-slate-805 leading-snug">{lab.name}</h1>
                <span className="flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  <FiCheckCircle className="text-[9px]" /> NABL Accredited
                </span>
              </div>
              <p className="text-[10px] text-slate-450 font-bold mt-0.5">Registration No: <strong className="text-slate-650 font-extrabold">{lab.regNumber}</strong></p>
              
              <div className="flex items-center gap-3 mt-2 flex-wrap text-[9px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <FiAward className="text-teal" />
                  {lab.experience} in Service
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-teal" />
                  {lab.timings}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl md:self-auto self-start">
            <div className="flex items-center gap-1 text-xs font-black text-slate-850">
              <FiStar className="fill-amber-500 text-amber-500 stroke-0 text-sm" />
              <span>{lab.rating}</span>
              <span className="text-slate-350 text-[9px] font-bold">/ 5</span>
            </div>
            <span className="text-[8.5px] text-slate-450 font-bold uppercase tracking-wider">{lab.reviewsCount} Patient Reviews</span>
          </div>
        </div>

        {/* 2. Side-by-Side: Lab Details & Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Left Column: Details & Accreditations (2/3 width on desktop) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            
            {/* Lab Gallery Carousel */}
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiImage className="text-teal" /> Lab Facility Gallery
              </h3>
              
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-inner bg-slate-150 group">
                <img 
                  src={lab.gallery[activeSlide]} 
                  alt={`${lab.name} facility`} 
                  className="w-full h-full object-cover transition-all duration-350"
                />

                {/* Left Arrow Button */}
                <button
                  onClick={() => setActiveSlide(prev => (prev - 1 + lab.gallery.length) % lab.gallery.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-650 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
                >
                  <FiChevronLeft className="text-xs" />
                </button>

                {/* Right Arrow Button */}
                <button
                  onClick={() => setActiveSlide(prev => (prev + 1) % lab.gallery.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-slate-100 shadow-md hover:bg-slate-50 flex items-center justify-center cursor-pointer text-slate-650 transition-opacity opacity-0 group-hover:opacity-100 border-0 outline-none"
                >
                  <FiChevronRight className="text-xs" />
                </button>
              </div>

              {/* Click-through Thumbnail Navigation */}
              <div className="flex gap-2 justify-center select-none">
                {lab.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition-all p-0 cursor-pointer ${
                      activeSlide === idx ? 'border-teal scale-105 shadow-sm' : 'border-slate-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Badges Row */}
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiShield className="text-teal" /> Safety & Quality Badges
              </h3>
              
              <div className="flex flex-wrap gap-2 text-center items-center justify-start text-[9.5px] font-bold text-slate-650">
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full select-none">
                  ✓ Sterile Sample Collection
                </span>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full select-none">
                  ✓ Cold Chain Transport (2-8°C)
                </span>
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full select-none">
                  ✓ MD Pathologist Approved Reports
                </span>
              </div>

              {/* Home Collection Information */}
              <div className="bg-teal-light/20 border border-teal/10 p-3.5 rounded-2xl flex items-start gap-2.5 mt-1">
                <span className="text-xl">🏠</span>
                <div>
                  <h4 className="text-[11px] font-black text-teal-dark uppercase tracking-wide">Express Home Sample Collection</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    Certified phlebotomist dispatched at your selected time slot in professional sterile protective kit. Reports verified by MD pathologist.
                  </p>
                </div>
              </div>
            </div>

            {/* Test Packages Offered by Lab */}
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiActivity className="text-teal" /> Diagnostic Packages ({offeredTests.length})
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {offeredTests.map(test => (
                  <div 
                    key={test.id}
                    className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50 transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-snug">{test.name}</h4>
                      <p className="text-[9.5px] text-teal font-black uppercase tracking-wider mt-0.5">{test.parameters} Checked • {test.timeframe}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 sm:self-auto self-end">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 line-through font-semibold block leading-none">₹{test.price}</span>
                        <strong className="text-xs font-black text-slate-900 block mt-0.5">₹{test.discountPrice || test.price}</strong>
                      </div>
                      <button 
                        onClick={() => {
                          if (isAuthenticated) {
                            navigate(`/lab-tests/${test.id}/book`);
                          } else {
                            navigate('/login', { state: { from: `/lab-tests/${test.id}/book` } });
                          }
                        }}
                        className="py-2 px-3.5 bg-forest hover:bg-forest-dark text-white text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-sm transition-colors outline-none"
                      >
                        BOOK TEST
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contacts, Map & Reviews (1/3 width) */}
          <div className="flex flex-col gap-4">
            
            {/* Contact details Card */}
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-2.5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                🏢 Lab Coordinates
              </h3>
              
              <div className="flex flex-col gap-2 text-[11px] font-semibold text-slate-600 pt-0.5">
                <div className="flex items-start gap-2">
                  <FiMapPin className="text-teal mt-0.5 shrink-0" />
                  <span className="text-slate-800 leading-normal font-bold">{lab.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-teal shrink-0" />
                  <span className="text-slate-800 font-bold">+91 22 8937 1928</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-teal shrink-0" />
                  <span className="text-slate-800 font-bold">{lab.timings}</span>
                </div>
              </div>

              {/* Real Embedded Google Map Preview */}
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mt-1.5 bg-slate-50 shadow-inner flex flex-col group select-none">
                <iframe
                  title="Laboratory Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(lab.name + ", " + (lab.address || lab.city))}&ll=${cityCoordinates[lab.city]?.lat || 19.0760},${cityCoordinates[lab.city]?.lng || 72.8777}&z=12&t=&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-transparent flex flex-col justify-end p-2 bg-gradient-to-t from-black/40 to-transparent">
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(lab.name + ", " + (lab.address || lab.city))}`, "_blank")}
                    className="w-full py-1.5 bg-teal hover:bg-teal-dark text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md border-0 cursor-pointer transition-colors outline-none"
                  >
                    📍 Open in Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Reviews Feed */}
            <div className="bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-2.5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiMessageSquare className="text-teal" /> Customer Feedback
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {displayedReviews.map((rev, idx) => (
                  <div key={idx} className="bg-slate-50/40 p-3 border border-slate-100 rounded-xl flex flex-col gap-1 transition-all hover:bg-slate-50">
                    <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-450">
                      <span className="text-slate-700 font-black">{rev.patientName}</span>
                      <span className="text-slate-450">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-amber-500 font-extrabold leading-none">
                      ★ {rev.rating}.0 Verified
                    </div>
                    <p className="text-[10px] text-slate-550 font-medium leading-normal italic">"{rev.reviewText}"</p>
                  </div>
                ))}
              </div>

              {/* View All / Toggle Reviews Button */}
              {lab.reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-1.5 mt-1 border border-slate-150 hover:bg-slate-50 text-slate-655 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-transparent outline-none"
                >
                  {showAllReviews ? 'Show Less Reviews' : 'View All Reviews'}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
