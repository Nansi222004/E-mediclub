import { useState, useEffect } from 'react';
import apiClient from '../../../shared/services/apiClient';
import { useAdminLocation } from '../context/AdminLocationContext';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminFilterBar = ({ 
  searchPlaceholder = "Search...", 
  customFilters = [], 
  onFilterChange 
}) => {
  const { locationFilter, updateFilter, clearFilter, isFiltered } = useAdminLocation();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [search, setSearch] = useState(locationFilter.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Custom filters state initialized from props
  const [customState, setCustomState] = useState(() => {
    const initialState = {};
    customFilters.forEach(f => {
      if (f.value !== undefined) initialState[f.key] = f.value;
    });
    return initialState;
  });

  // Sync with prop updates if they change externally
  useEffect(() => {
    const updatedState = { ...customState };
    let hasChanges = false;
    customFilters.forEach(f => {
      if (f.value !== undefined && f.value !== updatedState[f.key]) {
        updatedState[f.key] = f.value;
        hasChanges = true;
      }
    });
    if (hasChanges) {
      setCustomState(updatedState);
    }
  }, [customFilters]);

  useEffect(() => {
    apiClient.get('/api/admin/locations/states')
      .then(res => setStates(res.data))
      .catch(err => console.error('Error fetching states:', err));
  }, []);

  useEffect(() => {
    if (locationFilter.state) {
      apiClient.get(`/api/admin/locations/cities?state=${encodeURIComponent(locationFilter.state)}`)
        .then(res => setCities(res.data))
        .catch(err => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
      setPincodes([]);
    }
  }, [locationFilter.state]);

  useEffect(() => {
    if (locationFilter.city) {
      apiClient.get(`/api/admin/locations/pincodes?city=${encodeURIComponent(locationFilter.city)}&state=${encodeURIComponent(locationFilter.state)}`)
        .then(res => setPincodes(res.data))
        .catch(err => console.error('Error fetching pincodes:', err));
    } else {
      setPincodes([]);
    }
  }, [locationFilter.city, locationFilter.state]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== locationFilter.search) {
        updateFilter({ search });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSearch(locationFilter.search);
  }, [locationFilter.search]);

  const handleCustomFilterChange = (key, value) => {
    const newState = { ...customState, [key]: value };
    setCustomState(newState);
    if (onFilterChange) onFilterChange(newState);
  };

  const activeCount = [
    locationFilter.search,
    locationFilter.state,
    locationFilter.city,
    locationFilter.pincode,
    ...Object.values(customState).filter(Boolean)
  ].filter(Boolean).length;

  const handleClearAll = () => {
    clearFilter();
    setSearch('');
    const emptyCustom = {};
    Object.keys(customState).forEach(k => emptyCustom[k] = '');
    setCustomState(emptyCustom);
    if (onFilterChange) onFilterChange(emptyCustom);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex flex-wrap items-center gap-2 relative">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/20 transition-all"
        />
      </div>

      {/* Filter Toggle Button */}
      <button 
        type="button" 
        onClick={() => setShowFilters(!showFilters)}
        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border-0 cursor-pointer ${showFilters || (activeCount > (locationFilter.search ? 1 : 0)) ? 'bg-[#1A7A4A] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
      >
        <FiFilter /> Filters
        {activeCount > (locationFilter.search ? 1 : 0) && <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">{activeCount - (locationFilter.search ? 1 : 0)}</span>}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[110%] right-0 bg-white rounded-2xl shadow-premium border border-slate-100 p-4 z-50 flex flex-col gap-4 min-w-[320px] origin-top-right"
          >
            {/* Location Filters */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Locations</div>
              <div className="flex flex-col gap-2">
                <select
                  value={locationFilter.state}
                  onChange={(e) => updateFilter({ state: e.target.value, city: '', pincode: '' })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/20 ${locationFilter.state ? 'bg-[#1A7A4A]/10 text-[#1A7A4A]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'} transition-colors`}
                >
                  <option value="">State / Region</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={locationFilter.city}
                  onChange={(e) => updateFilter({ city: e.target.value, pincode: '' })}
                  disabled={!locationFilter.state}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/20 ${locationFilter.city ? 'bg-[#1A7A4A]/10 text-[#1A7A4A]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50'} transition-colors`}
                >
                  <option value="">City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={locationFilter.pincode}
                  onChange={(e) => updateFilter({ pincode: e.target.value })}
                  disabled={!locationFilter.city}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/20 ${locationFilter.pincode ? 'bg-[#1A7A4A]/10 text-[#1A7A4A]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-50'} transition-colors`}
                >
                  <option value="">Pincode</option>
                  {pincodes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Custom Filters (e.g. Status, Date Range) */}
            {customFilters.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Advanced</div>
                <div className="flex flex-col gap-2">
                  {customFilters.map(filter => {
                    const currentValue = customState[filter.key] !== undefined ? customState[filter.key] : '';
                    return (
                      <select
                        key={filter.key}
                        value={currentValue}
                        onChange={(e) => handleCustomFilterChange(filter.key, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/20 ${currentValue ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'} transition-colors`}
                      >
                        <option value="">{filter.label}</option>
                        {filter.options.map(opt => (
                          <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
                        ))}
                      </select>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Button */}
      {(isFiltered || Object.values(customState).some(Boolean)) && (
        <button
          type="button"
          onClick={handleClearAll}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-100 transition-colors border-0 cursor-pointer tap-scale"
        >
          <FiX className="text-sm" /> Clear
          {activeCount > 0 && <span className="ml-1 bg-white/50 px-1.5 py-0.5 rounded-md text-[10px]">{activeCount}</span>}
        </button>
      )}
    </div>
  );
};

export default AdminFilterBar;
