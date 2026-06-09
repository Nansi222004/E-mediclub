import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiNavigation, FiActivity, FiSearch, FiChevronRight, FiPlus } from 'react-icons/fi';
import { setLocation } from '../../modules/user/store/productSlice';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
  'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Indore', 'Bhopal',
  'Ujjain', 'Dewas', 'Ratlam', 'Jabalpur', 'Gwalior', 'Sagar',
  'Satna', 'Rewa', 'Chhindwara', 'Vidisha', 'Hoshangabad',
  'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur'
];

const CITY_MAPPINGS = {
  'Mumbai': { state: 'Maharashtra', pincode: '400001', district: 'Mumbai' },
  'Delhi': { state: 'Delhi', pincode: '110001', district: 'Delhi' },
  'Bangalore': { state: 'Karnataka', pincode: '560001', district: 'Bangalore' },
  'Chennai': { state: 'Tamil Nadu', pincode: '600001', district: 'Chennai' },
  'Hyderabad': { state: 'Telangana', pincode: '500001', district: 'Hyderabad' },
  'Pune': { state: 'Maharashtra', pincode: '411001', district: 'Pune' },
  'Kolkata': { state: 'West Bengal', pincode: '700001', district: 'Kolkata' },
  'Ahmedabad': { state: 'Gujarat', pincode: '380001', district: 'Ahmedabad' },
  'Jaipur': { state: 'Rajasthan', pincode: '302001', district: 'Jaipur' },
  'Surat': { state: 'Gujarat', pincode: '395003', district: 'Surat' },
  'Indore': { state: 'Madhya Pradesh', pincode: '452010', district: 'Indore' },
  'Bhopal': { state: 'Madhya Pradesh', pincode: '462001', district: 'Bhopal' },
  'Ujjain': { state: 'Madhya Pradesh', pincode: '456010', district: 'Ujjain' },
  'Dewas': { state: 'Madhya Pradesh', pincode: '455001', district: 'Dewas' },
  'Ratlam': { state: 'Madhya Pradesh', pincode: '457001', district: 'Ratlam' },
  'Jabalpur': { state: 'Madhya Pradesh', pincode: '482001', district: 'Jabalpur' },
  'Gwalior': { state: 'Madhya Pradesh', pincode: '474001', district: 'Gwalior' },
  'Sagar': { state: 'Madhya Pradesh', pincode: '470001', district: 'Sagar' },
  'Satna': { state: 'Madhya Pradesh', pincode: '485001', district: 'Satna' },
  'Rewa': { state: 'Madhya Pradesh', pincode: '486001', district: 'Rewa' },
  'Chhindwara': { state: 'Madhya Pradesh', pincode: '480001', district: 'Chhindwara' },
  'Vidisha': { state: 'Madhya Pradesh', pincode: '464001', district: 'Vidisha' },
  'Hoshangabad': { state: 'Madhya Pradesh', pincode: '461001', district: 'Hoshangabad' },
  'Nagpur': { state: 'Maharashtra', pincode: '440001', district: 'Nagpur' },
  'Nashik': { state: 'Maharashtra', pincode: '422001', district: 'Nashik' },
  'Aurangabad': { state: 'Maharashtra', pincode: '431001', district: 'Aurangabad' },
  'Kolhapur': { state: 'Maharashtra', pincode: '416001', district: 'Kolhapur' },
  'Solapur': { state: 'Maharashtra', pincode: '413001', district: 'Solapur' }
};

export const getStateAbbreviation = (stateName) => {
  if (!stateName) return "";
  const name = stateName.trim().toLowerCase();
  const states = {
    'maharashtra': 'MH',
    'madhya pradesh': 'MP',
    'delhi': 'DL',
    'new delhi': 'DL',
    'karnataka': 'KA',
    'tamil nadu': 'TN',
    'telangana': 'TG',
    'andhra pradesh': 'AP',
    'west bengal': 'WB',
    'gujarat': 'GJ',
    'rajasthan': 'RJ',
    'uttar pradesh': 'UP',
    'bihar': 'BR',
    'odisha': 'OD',
    'kerala': 'KL',
    'punjab': 'PB',
    'haryana': 'HR',
    'uttarakhand': 'UK',
    'jammu & kashmir': 'JK',
    'jammu and kashmir': 'JK',
    'assam': 'AS',
    'chhattisgarh': 'CG',
    'jharkhand': 'JH',
    'himachal pradesh': 'HP',
    'goa': 'GA',
    'chandigarh': 'CH',
    'puducherry': 'PY',
    'pondicherry': 'PY',
    'manipur': 'MN',
    'meghalaya': 'ML',
    'mizoram': 'MZ',
    'nagaland': 'NL',
    'sikkim': 'SK',
    'tripura': 'TR',
    'arunachal pradesh': 'AR'
  };
  return states[name] || stateName.toUpperCase().slice(0, 2);
};

const SUGGESTED_CITIES = [
  { name: 'Indore', icon: '🕌', desc: 'Rajwada Palace' },
  { name: 'Mumbai', icon: '🌆', desc: 'Gateway of India' },
  { name: 'Delhi', icon: '🏛️', desc: 'India Gate' },
  { name: 'Bangalore', icon: '🏰', desc: 'Vidhana Soudha' },
  { name: 'Pune', icon: '🗻', desc: 'Shaniwar Wada' },
  { name: 'Hyderabad', icon: '🕌', desc: 'Charminar' },
  { name: 'Chennai', icon: '🌊', desc: 'Marina Beach' },
  { name: 'Kolkata', icon: '🌉', desc: 'Howrah Bridge' },
  { name: 'Dewas', icon: '🏭', desc: 'Chamunda Devi Hill' },
  { name: 'Ujjain', icon: '🕉️', desc: 'Mahakaleshwar Temple' },
  { name: 'Bhopal', icon: '🕌', desc: 'Upper Lake' }
];

export default function LocationSelectorModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const reduxLocation = useSelector(state => state.products.location);

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Custom permission dialog state
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrFlat, setAddrFlat] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');

  const [resolvedPincodeLocation, setResolvedPincodeLocation] = useState(null);

  useEffect(() => {
    if (reduxLocation && reduxLocation.city) {
      setLocationEnabled(true);
    }
  }, [reduxLocation]);

  // Real-time pincode search resolution
  useEffect(() => {
    const pin = citySearchQuery.trim().replace(/\D/g, '');
    if (pin.length === 6) {
      const localCity = Object.keys(CITY_MAPPINGS).find(k => CITY_MAPPINGS[k].pincode === pin);
      if (localCity) {
        setResolvedPincodeLocation({
          pincode: pin,
          city: localCity,
          state: CITY_MAPPINGS[localCity].state,
          district: CITY_MAPPINGS[localCity].district || localCity
        });
      } else {
        // Immediate smart fallback guess
        const prefix = pin.slice(0, 3);
        const prefix2 = pin.slice(0, 2);
        let city = 'Bhopal';
        let state = 'Madhya Pradesh';
        if (prefix === '452') { city = 'Indore'; state = 'Madhya Pradesh'; }
        else if (prefix === '462') { city = 'Bhopal'; state = 'Madhya Pradesh'; }
        else if (prefix.startsWith('40')) { city = 'Mumbai'; state = 'Maharashtra'; }
        else if (prefix.startsWith('41')) { city = 'Pune'; state = 'Maharashtra'; }
        else if (prefix.startsWith('11')) { city = 'Delhi'; state = 'Delhi'; }
        else if (prefix.startsWith('56')) { city = 'Bangalore'; state = 'Karnataka'; }
        else if (prefix.startsWith('60')) { city = 'Chennai'; state = 'Tamil Nadu'; }
        else if (prefix.startsWith('50')) { city = 'Hyderabad'; state = 'Telangana'; }
        else if (prefix.startsWith('70')) { city = 'Kolkata'; state = 'West Bengal'; }
        else {
          if (prefix2 >= '11' && prefix2 <= '13') { city = 'Delhi'; state = 'Delhi'; }
          else if (prefix2 >= '40' && prefix2 <= '44') { city = 'Mumbai'; state = 'Maharashtra'; }
          else if (prefix2 >= '45' && prefix2 <= '48') { city = 'Bhopal'; state = 'Madhya Pradesh'; }
          else if (prefix2 >= '56' && prefix2 <= '59') { city = 'Bangalore'; state = 'Karnataka'; }
          else if (prefix2 >= '60' && prefix2 <= '64') { city = 'Chennai'; state = 'Tamil Nadu'; }
          else if (prefix2 >= '50' && prefix2 <= '53') { city = 'Hyderabad'; state = 'Telangana'; }
          else if (prefix2 >= '70' && prefix2 <= '74') { city = 'Kolkata'; state = 'West Bengal'; }
        }
        setResolvedPincodeLocation({
          pincode: pin,
          city,
          state,
          district: city
        });

        // Query API to refine
        fetch(`https://api.postalpincode.in/pincode/${pin}`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
              const po = data[0].PostOffice[0];
              setResolvedPincodeLocation({
                pincode: pin,
                city: po.District || po.Name,
                state: po.State,
                district: po.Name || po.District
              });
            }
          })
          .catch(err => {
            console.log('Postal API lookup offline or timed out; using local smart guess.');
          });
      }
    } else {
      setResolvedPincodeLocation(null);
    }
  }, [citySearchQuery]);

  // Handle automatic Geolocation lookup
  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setStatusMsg({
        type: 'invalid',
        text: '❌ Geolocation is not supported by your browser'
      });
      setShowPermissionPopup(false);
      return;
    }
    setDetecting(true);
    setStatusMsg(null);
    setShowPermissionPopup(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(async () => {
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
              setLocationEnabled(true);
              onClose();
            } else {
              setStatusMsg({
                type: 'invalid',
                text: '❌ Could not detect address. Please choose a popular city.'
              });
            }
          } catch (err) {
            console.warn('Reverse Geocoding failed:', err);
            setStatusMsg({
              type: 'invalid',
              text: '❌ Failed to connect to location service.'
            });
          } finally {
            setDetecting(false);
          }
        }, 1200);
      },
      (error) => {
        setDetecting(false);
        setStatusMsg({
          type: 'invalid',
          text: '❌ Geolocation permission was denied.'
        });
      },
      { timeout: 8000 }
    );
  };

  const handleCitySelect = (cityName) => {
    const mapping = CITY_MAPPINGS[cityName];
    if (mapping) {
      dispatch(setLocation({
        pincode: mapping.pincode,
        city: cityName,
        district: mapping.district || cityName,
        state: mapping.state,
        fullAddress: ''
      }));
      onClose();
    }
  };

  const handleAddressPincodeChange = async (val) => {
    const pin = val.replace(/\D/g, '').slice(0, 6);
    setAddrPincode(pin);
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setAddrCity(po.District || po.Name);
          setAddrState(po.State);
        } else {
          const localCity = Object.keys(CITY_MAPPINGS).find(k => CITY_MAPPINGS[k].pincode === pin);
          if (localCity) {
            setAddrCity(localCity);
            setAddrState(CITY_MAPPINGS[localCity].state);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrPincode || !addrCity) return;
    dispatch(setLocation({
      pincode: addrPincode,
      city: addrCity,
      district: addrCity,
      state: addrState,
      fullAddress: `${addrFlat}, ${addrArea}`
    }));
    setShowAddressForm(false);
    onClose();
  };

  // Filter Suggested Cities + Other list
  const filteredSuggested = SUGGESTED_CITIES.filter(c => 
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    (CITY_MAPPINGS[c.name] && CITY_MAPPINGS[c.name].pincode.includes(citySearchQuery))
  );

  const filteredOthers = Object.keys(CITY_MAPPINGS)
    .filter(c => !SUGGESTED_CITIES.some(sc => sc.name === c))
    .filter(c => 
      c.toLowerCase().includes(citySearchQuery.toLowerCase()) || 
      CITY_MAPPINGS[c].pincode.includes(citySearchQuery)
    );

  return (
    <AnimatePresence>
      {/* Geolocation Loading Screen */}
      {detecting && (
        <motion.div
          key="map-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center select-none font-sans"
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0d9488_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-teal-55 animate-ping" />
              <div className="absolute inset-3 rounded-full bg-teal-100 animate-pulse" />
              <div className="w-14 h-14 bg-[#0d9488] text-white rounded-full flex items-center justify-center shadow-md">
                <FiNavigation className="w-6 h-6 animate-bounce" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black text-slate-800 tracking-wide">Searching your location...</h3>
              <p className="text-[11px] text-slate-500 font-bold max-w-[260px] leading-relaxed">
                Allow browser location permissions to get faster delivery times & view partner clinics.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {isOpen && !detecting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            key="selector-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-transparent"
          />

          {/* Selector Bottom Sheet Modal */}
          <motion.div
            key="selector-content"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-white rounded-t-[32px] sm:rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-7 z-10 relative flex flex-col gap-4 max-h-[85vh] overflow-hidden transition-all duration-300"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-1 sm:hidden shrink-0" />

            {/* Custom Allow Location Access Permission dialog */}
            {showPermissionPopup ? (
              <div className="flex flex-col items-center text-center p-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-[#FFF5EE] border-4 border-[#FFE4D5] flex items-center justify-center mb-6">
                  <FiMapPin className="text-[#FF5C3F] text-3xl stroke-[2.5]" />
                </div>
                <h2 className="text-lg font-black text-slate-800 leading-snug">
                  Allow location access
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-3.5 leading-relaxed max-w-[280px]">
                  E-Mediclub uses your location to enhance your experience, ensuring you only see products and services available in your area.
                </p>
                <div className="w-full flex flex-col gap-2.5 mt-6 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoDetect}
                    className="w-full py-3 bg-[#0d9488] hover:bg-[#0b7e73] text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0"
                  >
                    Go to settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPermissionPopup(false)}
                    className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer"
                  >
                    Not now
                  </button>
                </div>
              </div>
            ) : showAddressForm ? (
              /* Add New Address Form */
              <form onSubmit={handleSaveAddress} className="flex flex-col gap-3.5 text-left overflow-y-auto max-h-[70vh] pr-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Add delivery address</h3>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    className="text-xs font-bold text-teal bg-transparent border-0 cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="Enter 10-digit number"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) => handleAddressPincodeChange(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="City"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="State"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Flat / House no. / Area</label>
                  <input
                    type="text"
                    required
                    value={addrFlat}
                    onChange={(e) => setAddrFlat(e.target.value)}
                    placeholder="Flat, House no., Area info"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!addrPincode || !addrCity}
                  className="w-full py-3.5 bg-[#0d9488] hover:bg-[#0b7e73] disabled:bg-slate-200 text-white text-xs font-black uppercase tracking-wider rounded-2xl border-0 cursor-pointer transition-colors"
                >
                  Save & Select Location
                </button>
              </form>
            ) : (
              /* Main location selector sheets content */
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[#0d9488] text-lg shrink-0" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Select delivery location</h3>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Pan India Delivery</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-50 text-slate-400 border-0 bg-transparent cursor-pointer">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Device location not enabled warning banner */}
                {!locationEnabled && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between gap-3 text-left shrink-0 animate-fade-in">
                    <div>
                      <h4 className="text-[11px] font-black text-rose-800">Device location not enabled</h4>
                      <p className="text-[10px] text-rose-500 font-semibold mt-0.5 leading-tight">Enable GPS permissions for accurate delivery estimates.</p>
                    </div>
                    <button 
                      onClick={() => setShowPermissionPopup(true)} 
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer border-0 shrink-0"
                    >
                      Enable
                    </button>
                  </div>
                )}

                {/* Scrollable sheet body */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar select-none">
                  {/* Search input field */}
                  <div className="relative shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <FiSearch className="text-slate-400 text-base" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search for your city or pincode"
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl text-slate-800 text-xs outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Geolocation navigation option */}
                  <button
                    onClick={() => setShowPermissionPopup(true)}
                    className="w-full py-3 px-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all border-0 shadow-sm shrink-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#0d9488] shrink-0">
                        <FiNavigation className="w-4.5 h-4.5 transform rotate-45" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#0d9488] block">Use your current location</span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">Detect automatically via GPS</span>
                      </div>
                    </div>
                  </button>

                  {/* Add New Address triggers */}
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-3 px-4 bg-slate-50/50 hover:bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-600 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    <FiPlus className="w-4 h-4 text-slate-400" />
                    <span>Add New Address</span>
                  </button>

                  {resolvedPincodeLocation && (
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setLocation({
                          pincode: resolvedPincodeLocation.pincode,
                          city: resolvedPincodeLocation.city,
                          district: resolvedPincodeLocation.district,
                          state: resolvedPincodeLocation.state,
                          fullAddress: ''
                        }));
                        onClose();
                      }}
                      className="w-full py-3.5 px-4 border border-teal bg-teal-50/20 hover:bg-teal-50/40 rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all shadow-sm shrink-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-55 flex items-center justify-center text-teal-dark shrink-0">
                          📍
                        </div>
                        <div>
                          <span className="text-xs font-black text-teal-dark block">Pincode: {resolvedPincodeLocation.pincode}</span>
                          <span className="text-[10px] text-slate-550 font-bold block">{resolvedPincodeLocation.city}, {resolvedPincodeLocation.state}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-teal text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Select</span>
                    </button>
                  )}

                  {/* Suggested Cities Section */}
                  <div className="flex flex-col gap-2 mt-1 shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Suggested Cities</p>
                    <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                      {filteredSuggested.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleCitySelect(city.name)}
                          className={`w-full py-3 px-4 border rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all border-slate-100 bg-white hover:bg-teal-light/25 hover:border-teal/30 group
                            ${reduxLocation?.city === city.name 
                              ? '!border-teal !bg-teal-light/20 text-teal-dark font-black shadow-sm' 
                              : 'text-slate-700'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base group-hover:scale-110 transition-transform">{city.icon}</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-extrabold">{city.name}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">{city.desc}</span>
                            </div>
                          </div>
                          <FiChevronRight className="text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}

                      {/* Render other matched cities if searching */}
                      {citySearchQuery && filteredOthers.map((cityName) => (
                        <button
                          key={cityName}
                          onClick={() => handleCitySelect(cityName)}
                          className={`w-full py-3 px-4 border rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all border-slate-100 bg-white hover:bg-teal-light/25 hover:border-teal/30 group
                            ${reduxLocation?.city === cityName 
                              ? '!border-teal !bg-teal-light/20 text-teal-dark font-black shadow-sm' 
                              : 'text-slate-700'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">🏘️</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-extrabold">{cityName}</span>
                              <span className="text-[9px] text-slate-400 font-semibold">{CITY_MAPPINGS[cityName].state} - {CITY_MAPPINGS[cityName].pincode}</span>
                            </div>
                          </div>
                          <FiChevronRight className="text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer status/info */}
                <div className="pt-3 border-t border-slate-100 shrink-0">
                  <div className="bg-[#e6f4f2] p-2.5 rounded-xl flex items-center gap-2 text-[10px] text-[#0d9488] font-bold justify-center">
                    <FiActivity className="w-3.5 h-3.5 text-[#0d9488] shrink-0 animate-bounce" />
                    <span>Real-time local medical clinics & delivery check.</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
