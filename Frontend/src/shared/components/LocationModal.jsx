import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { setLocation } from '../../modules/user/store/productSlice';

export default function LocationModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [detecting, setDetecting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleGoToSettings = () => {
    if (!navigator.geolocation) {
      setErrorText('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    setErrorText('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const addr = data?.address;
          if (addr) {
            const city = addr.city || addr.town || addr.village || addr.suburb || "Mumbai";
            const pincode = (addr.postcode || "").replace(/\D/g, '').slice(0, 6);
            const state = addr.state || "Maharashtra";
            const district = addr.state_district || addr.county || city;
            
            const locObj = {
              pincode: pincode.length === 6 ? pincode : '400001',
              city,
              district: district || city,
              state,
              fullAddress: ''
            };
            dispatch(setLocation(locObj));
            if (onClose) onClose();
          } else {
            // Fallback
            dispatch(setLocation({
              pincode: '400001',
              city: 'Mumbai',
              district: 'Mumbai',
              state: 'Maharashtra',
              fullAddress: ''
            }));
            if (onClose) onClose();
          }
        } catch (err) {
          console.error(err);
          // Fallback
          dispatch(setLocation({
            pincode: '400001',
            city: 'Mumbai',
            district: 'Mumbai',
            state: 'Maharashtra',
            fullAddress: ''
          }));
          if (onClose) onClose();
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error(error);
        setDetecting(false);
        setErrorText('Location access was denied. Please select "Not now" to continue.');
      },
      { timeout: 8000 }
    );
  };

  const handleNotNow = () => {
    // Default to Mumbai so they are not blocked
    dispatch(setLocation({
      pincode: '400001',
      city: 'Mumbai',
      district: 'Mumbai',
      state: 'Maharashtra',
      fullAddress: ''
    }));
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="location-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <motion.div
            key="location-modal-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Center Location Pin Icon (similar to Tata 1mg brown/beige marker) */}
            <div className="w-20 h-20 rounded-full bg-[#FFF5EE] border-4 border-[#FFE4D5] flex items-center justify-center mb-6 relative animate-pulse-subtle">
              <div className="absolute w-12 h-12 rounded-full bg-[#FF7F50]/10 flex items-center justify-center">
                <FiMapPin className="text-[#FF5C3F] text-3xl stroke-[2.5]" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-black text-slate-800 leading-snug tracking-tight">
              Allow location access
            </h2>

            {/* Body Text */}
            <p className="text-xs text-slate-500 font-semibold mt-3.5 leading-relaxed max-w-[280px]">
              E-Mediclub uses your location to enhance your experience, ensuring you only see products and services available in your area
            </p>

            {/* Error/Status display */}
            {detecting && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#FF5C3F] font-bold">
                <svg className="animate-spin h-4 w-4 text-[#FF5C3F]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Detecting Location...</span>
              </div>
            )}
            
            {errorText && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold uppercase tracking-wide">
                {errorText}
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-6 shrink-0">
              <button
                type="button"
                onClick={handleGoToSettings}
                disabled={detecting}
                className="w-full py-3.5 bg-[#FF5C3F] hover:bg-[#E04B2F] disabled:opacity-75 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer border-0 outline-none"
              >
                Go to settings
              </button>
              
              <button
                type="button"
                onClick={handleNotNow}
                disabled={detecting}
                className="w-full py-3.5 bg-white hover:bg-slate-50 text-[#FF5C3F] text-xs font-black uppercase tracking-wider rounded-2xl transition-colors cursor-pointer border border-[#FFE4D5] outline-none"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

