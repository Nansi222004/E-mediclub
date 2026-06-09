import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiChevronLeft, FiChevronRight, FiMapPin, FiX, FiFilter, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { setSelectedCategory, setPrescriptionFilterActive, fetchProducts, setLocation, normalizeCity } from '../store/productSlice';
import ProductCard from '../../../shared/components/ProductCard';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';
import PrescriptionReviewModal from '../../../shared/components/PrescriptionReviewModal';
import LocationSelectorModal, { getStateAbbreviation } from '../../../shared/components/LocationSelectorModal';

// Static Mapping of Medicine IDs to Therapeutic Classes
const MEDICINE_SUBCATEGORY_MAP = {
  'Pain Relief': ['med-2', 'med-4', 'med-10', 'med-18', 'med-29', 'med-47'],
  'Cold & Flu': ['med-13', 'med-19', 'med-30', 'med-32', 'med-33'],
  'Vitamins & Supplements': ['med-1', 'med-6', 'med-9', 'med-17', 'med-21', 'med-28', 'med-34', 'med-35', 'med-37', 'med-38'],
  'Diabetes Care': ['med-5', 'med-16', 'med-22', 'med-63', 'med-64', 'med-65'],
  'Heart Care': ['med-12', 'med-53', 'med-54', 'med-55'],
  'Stomach & Digestion': ['med-8', 'med-23', 'med-25', 'med-26', 'med-31', 'med-46', 'med-49'],
  'Eye Care': ['med-66', 'med-67', 'med-68'],
  'Baby Care': ['med-59', 'med-60', 'med-62'],
  'Ayurveda': [
    'med-3', 'med-8', 'med-11', 'med-15', 'med-20', 'med-23', 'med-43', 'med-44', 'med-45', 'med-46', 'med-47', 'med-48', 'med-49', 'med-50', 'med-51', 'med-52', 'med-57', 'med-58', 'med-60', 'med-65', 'med-66', 'med-68'
  ]
};

// Static Helper to get category icons
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'All': return '✨';
    case 'Medicines': return '💊';
    case 'Ayurveda': return '🌿';
    case 'Wellness': return '🧘';
    case 'Health Devices': return '🩸';
    case 'Sports Nutrition': return '🏋️‍♂️';
    case 'Respiratory Care': return '🫁';
    case 'Diabetes Care': return '🩸';
    case 'Homeopathy': return '🥛';
    case 'Geriatric Care': return '👵';
    case 'Herbal Extracts': return '🍯';
    case 'Cardiac Care': return '❤️';
    default: return '🩺';
  }
};

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Modal, Prescription Filtering & Sub-Category States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeMedicineSubCategory, setActiveMedicineSubCategory] = useState('All');
  const [activePrescription, setActivePrescription] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Selectors
  const { medicines, selectedCategory, selectedLocation, location: locationState, isPrescriptionFilterActive, orders = [] } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth || {});

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [isBrowsingAll, setIsBrowsingAll] = useState(false);

  // Unified Filter States
  const [filters, setFilters] = useState({
    category: 'All',
    brand: [],
    type: [],
    priceRange: 'All',
    availability: 'All'
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('category');
  const [optionSearchQuery, setOptionSearchQuery] = useState('');

  useEffect(() => {
    setOptionSearchQuery('');
  }, [activeFilterTab]);

  useEffect(() => {
    setIsBrowsingAll(false);
  }, [locationState?.city, locationState?.pincode]);

  const handleBrowseAll = () => {
    setIsBrowsingAll(true);
    dispatch(setLocation({ pincode: '', city: '', district: '', state: '', fullAddress: '' }));
  };

  // Direct derived route mapping
  const isDirectRoute = 
    location.pathname === '/medicines' || 
    location.pathname === '/wellness' || 
    location.pathname === '/ayurveda';

  const baseActiveCategory = isDirectRoute 
    ? (location.pathname === '/medicines' ? 'Medicines' : location.pathname === '/wellness' ? 'Wellness' : 'Ayurveda')
    : selectedCategory;

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

  // Dynamic Categories based on Location
  const locationCategories = {
    'Mumbai, Maharashtra': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'],
    'Bengaluru, Karnataka': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Sports Nutrition'],
    'New Delhi, Delhi': ['All', 'Medicines', 'Ayurveda', 'Respiratory Care', 'Wellness'],
    'Hyderabad, Telangana': ['All', 'Medicines', 'Ayurveda', 'Diabetes Care', 'Health Devices'],
    'Pune, Maharashtra': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Homeopathy'],
    'Chennai, Tamil Nadu': ['All', 'Medicines', 'Ayurveda', 'Geriatric Care', 'Health Devices'],
    'Kolkata, West Bengal': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Herbal Extracts'],
    'Ahmedabad, Gujarat': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Cardiac Care'],
    'Indore, Madhya Pradesh': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Homeopathy'],
    'Bhopal, Madhya Pradesh': ['All', 'Medicines', 'Ayurveda', 'Respiratory Care', 'Wellness'],
    'Ujjain, Madhya Pradesh': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'],
    'Dewas, Madhya Pradesh': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Homeopathy']
  };

  const categoriesList = locationCategories[cityKey] || locationCategories['Mumbai, Maharashtra'];

  const activeCategory = categoriesList.includes(baseActiveCategory) ? baseActiveCategory : 'All';

  // Reset medicine sub-category when main category changes
  useEffect(() => {
    setActiveMedicineSubCategory('All');
    setFilters(prev => ({
      ...prev,
      category: activeCategory
    }));
  }, [activeCategory]);

  const handleCategorySelect = (cat) => {
    dispatch(setSelectedCategory(cat));
    setFilters(prev => ({
      ...prev,
      category: cat
    }));
  };

  // Global Scroll-to-Top when category or sub-category is selected
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeCategory, activeMedicineSubCategory]);

  // Compile previously bought items from completed orders (User must be logged in)
  const previouslyBoughtMedicines = React.useMemo(() => {
    if (!isAuthenticated) return [];
    const boughtNames = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        boughtNames.add(item.name);
      });
    });
    return medicines.filter(med => med.category === 'Medicines' && boughtNames.has(med.name));
  }, [isAuthenticated, orders, medicines]);

  const pincode = locationState?.pincode ? locationState.pincode.trim() : '';
  const city = locationState?.city ? normalizeCity(locationState.city) : '';

  const medicinesInCity = pincode
    ? medicines.filter(med => med.vendorPincode === pincode)
    : city
      ? medicines.filter(med => med.vendorCity && normalizeCity(med.vendorCity).toLowerCase() === city.toLowerCase())
      : medicines;

  const hasNoResultsForCity = (pincode || city) && medicinesInCity.length === 0;

  const baseMedicines = ((pincode || city) && !hasNoResultsForCity && !isBrowsingAll)
    ? medicinesInCity
    : medicines;

  // Dynamic brands list derived from current listing medicines
  const uniqueBrands = React.useMemo(() => {
    const brands = baseMedicines.map(m => m.brand).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [baseMedicines]);

  // Unified Filtering Logic
  const filteredProducts = React.useMemo(() => {
    let result = baseMedicines;

    // 1. Main Category filter
    if (filters.category !== 'All') {
      result = result.filter(med => {
        if (filters.category === 'Sports Nutrition') return med.id === 'med-1' || med.id === 'med-9';
        if (filters.category === 'Respiratory Care') return med.id === 'med-13' || med.id === 'med-3';
        if (filters.category === 'Diabetes Care') return med.id === 'med-5' || med.id === 'med-12';
        if (filters.category === 'Homeopathy' || filters.category === 'Herbal Extracts') return med.id === 'med-3' || med.id === 'med-11';
        if (filters.category === 'Geriatric Care') return med.id === 'med-12' || med.id === 'med-1' || med.id === 'med-2';
        if (filters.category === 'Cardiac Care') return med.id === 'med-12' || med.id === 'med-5';
        return med.category === filters.category;
      });
    }

    // 2. Types of Medicines / Health Concerns filter
    if (filters.type.length > 0) {
      result = result.filter(med => {
        return filters.type.some(t => {
          if (t === 'Ayurveda') return med.category === 'Ayurveda' || (MEDICINE_SUBCATEGORY_MAP['Ayurveda'] || []).includes(med.id);
          if (t === 'Wellness') return med.category === 'Wellness' || (MEDICINE_SUBCATEGORY_MAP['Vitamins & Supplements'] || []).includes(med.id);
          if (t === 'Health Devices') return med.category === 'Health Devices' || med.id === 'med-5';
          if (t === 'Cold & Cough' || t === 'Cold & Flu') {
            return (MEDICINE_SUBCATEGORY_MAP['Cold & Flu'] || []).includes(med.id) || 
                   med.name.toLowerCase().includes('cold') || 
                   med.name.toLowerCase().includes('cough') ||
                   med.name.toLowerCase().includes('flu');
          }
          if (t === 'Stomach & Digestion' || t === 'Digestion') {
            return (MEDICINE_SUBCATEGORY_MAP['Stomach & Digestion'] || []).includes(med.id) || 
                   med.benefits.toLowerCase().includes('digestive') || 
                   med.benefits.toLowerCase().includes('stomach') ||
                   med.benefits.toLowerCase().includes('gut');
          }
          const allowedIds = MEDICINE_SUBCATEGORY_MAP[t] || [];
          return allowedIds.includes(med.id);
        });
      });
    }

    // 3. Brands/Companies filter
    if (filters.brand.length > 0) {
      result = result.filter(med => filters.brand.includes(med.brand));
    }

    // 4. Price range filter
    if (filters.priceRange !== 'All') {
      if (filters.priceRange === 'under-100') {
        result = result.filter(med => (med.discountPrice || med.price) < 100);
      } else if (filters.priceRange === '100-500') {
        result = result.filter(med => (med.discountPrice || med.price) >= 100 && (med.discountPrice || med.price) <= 500);
      } else if (filters.priceRange === '500-1000') {
        result = result.filter(med => (med.discountPrice || med.price) >= 500 && (med.discountPrice || med.price) <= 1000);
      } else if (filters.priceRange === 'over-1000') {
        result = result.filter(med => (med.discountPrice || med.price) > 1000);
      }
    }

    // 5. Availability filter
    if (filters.availability === 'inStock') {
      result = result.filter(med => med.inStock);
    } else if (filters.availability === 'discounted') {
      result = result.filter(med => med.discountPercent > 0);
    }

    // 6. Prescription filter tag
    if (isPrescriptionFilterActive) {
      result = result.filter(med => {
        if (filters.category === 'Medicines') return med.id === 'med-2';
        if (filters.category === 'Wellness') return med.id === 'med-1';
        if (filters.category === 'Ayurveda') return med.id === 'med-3';
        return med.id === 'med-1' || med.id === 'med-2' || med.id === 'med-3';
      });
    }

    return result;
  }, [baseMedicines, filters, isPrescriptionFilterActive]);

  // Dynamic products priorities by location
  const locationPriorities = {
    'Mumbai, Maharashtra': ['med-4', 'med-1', 'med-10', 'med-2', 'med-6', 'med-9'],
    'Bengaluru, Karnataka': ['med-3', 'med-6', 'med-11', 'med-1', 'med-9', 'med-2'],
    'New Delhi, Delhi': ['med-13', 'med-3', 'med-12', 'med-6', 'med-2', 'med-11'],
    'Hyderabad, Telangana': ['med-5', 'med-2', 'med-9', 'med-12', 'med-1', 'med-10'],
    'Pune, Maharashtra': ['med-8', 'med-1', 'med-4', 'med-3', 'med-6', 'med-11'],
    'Chennai, Tamil Nadu': ['med-6', 'med-9', 'med-12', 'med-2', 'med-1', 'med-10'],
    'Kolkata, West Bengal': ['med-3', 'med-8', 'med-11', 'med-6', 'med-1', 'med-2'],
    'Ahmedabad, Gujarat': ['med-2', 'med-4', 'med-5', 'med-12', 'med-9', 'med-6']
  };

  const priorityIds = locationPriorities[cityKey] || locationPriorities['Mumbai, Maharashtra'];

  const prioritizedFilteredProducts = [...filteredProducts].sort((a, b) => {
    const idxA = priorityIds.indexOf(a.id);
    const idxB = priorityIds.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const handleUploadSuccess = (newRx) => {
    dispatch(setPrescriptionFilterActive(true));
    if (newRx) {
      setActivePrescription(newRx);
      setShowReviewModal(true);
    }
  };

  // Helper checking prescription paths
  const isPrescriptionRoute = () => {
    return (
      location.pathname === '/medicines' || 
      location.pathname === '/wellness' || 
      location.pathname === '/ayurveda'
    );
  };

  const filterTabs = [
    { id: 'category', label: 'Category' },
    { id: 'brand', label: 'Brands' },
    { id: 'type', label: 'Concerns' },
    { id: 'priceRange', label: 'Price' },
    { id: 'availability', label: 'Availability' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-10 select-none">
      
      {/* ================= DESKTOP PERSISTENT FILTER SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium sticky top-20 h-fit gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Filters</h3>
          <button
            onClick={() => {
              setFilters({
                category: 'All',
                brand: [],
                type: [],
                priceRange: 'All',
                availability: 'All'
              });
              dispatch(setSelectedCategory('All'));
            }}
            className="text-[10px] font-black text-coral hover:text-coral-dark uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none"
          >
            Reset
          </button>
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</h4>
          <div className="flex flex-col gap-1.5">
            {['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer ${
                  filters.category === cat
                    ? 'bg-forest border-forest text-white shadow-sm font-extrabold'
                    : 'bg-slate-50 border-slate-100 text-slate-650 hover:bg-slate-100 hover:text-forest'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Selection */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Brands</h4>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
            {uniqueBrands.map(brand => {
              const isChecked = filters.brand.includes(brand);
              const count = baseMedicines.filter(m => m.brand === brand).length;
              return (
                <label key={brand} className="flex items-center justify-between text-xs font-semibold text-slate-705 cursor-pointer py-1 px-1 rounded hover:bg-slate-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setFilters(prev => ({
                          ...prev,
                          brand: isChecked
                            ? prev.brand.filter(b => b !== brand)
                            : [...prev.brand, brand]
                        }));
                      }}
                      className="text-teal focus:ring-teal cursor-pointer rounded shrink-0"
                    />
                    <span className="truncate">{brand}</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-bold bg-slate-50 px-1 rounded shrink-0">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Health Concerns / Types */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Concerns & Types</h4>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
            {[
              'Pain Relief', 'Cold & Cough', 'Stomach & Digestion', 'Vitamins & Supplements',
              'Diabetes Care', 'Heart Care', 'Eye Care', 'Baby Care', 'Ayurveda', 'Wellness', 'Health Devices'
            ].map(t => {
              const isChecked = filters.type.includes(t);
              let count = 0;
              if (t === 'Ayurveda') {
                count = baseMedicines.filter(m => m.category === 'Ayurveda' || (MEDICINE_SUBCATEGORY_MAP['Ayurveda'] || []).includes(m.id)).length;
              } else if (t === 'Wellness') {
                count = baseMedicines.filter(m => m.category === 'Wellness' || (MEDICINE_SUBCATEGORY_MAP['Vitamins & Supplements'] || []).includes(m.id)).length;
              } else if (t === 'Health Devices') {
                count = baseMedicines.filter(m => m.category === 'Health Devices' || m.id === 'med-5').length;
              } else if (t === 'Cold & Cough') {
                count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP['Cold & Flu'] || []).includes(m.id) || m.name.toLowerCase().includes('cold') || m.name.toLowerCase().includes('cough')).length;
              } else if (t === 'Stomach & Digestion') {
                count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP['Stomach & Digestion'] || []).includes(m.id)).length;
              } else {
                count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP[t] || []).includes(m.id)).length;
              }
              return (
                <label key={t} className="flex items-center justify-between text-xs font-semibold text-slate-705 cursor-pointer py-1 px-1 rounded hover:bg-slate-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setFilters(prev => ({
                          ...prev,
                          type: isChecked
                            ? prev.type.filter(x => x !== t)
                            : [...prev.type, t]
                        }));
                      }}
                      className="text-teal focus:ring-teal cursor-pointer rounded shrink-0"
                    />
                    <span className="truncate">{t}</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-bold bg-slate-50 px-1 rounded shrink-0">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price Range</h4>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'All', label: 'All Prices' },
              { id: 'under-100', label: 'Under ₹100' },
              { id: '100-500', label: '₹100 - ₹500' },
              { id: '500-1000', label: '₹500 - ₹1000' },
              { id: 'over-1000', label: 'Over ₹1000' }
            ].map(r => (
              <label key={r.id} className="flex items-center gap-2 text-xs font-semibold text-slate-705 cursor-pointer py-1 px-1 rounded hover:bg-slate-50">
                <input
                  type="radio"
                  name="priceRangeDesktop"
                  checked={filters.priceRange === r.id}
                  onChange={() => setFilters(prev => ({ ...prev, priceRange: r.id }))}
                  className="text-teal focus:ring-teal cursor-pointer shrink-0"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Availability</h4>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'All', label: 'All Items' },
              { id: 'inStock', label: 'In Stock Only' },
              { id: 'discounted', label: 'Discounted' }
            ].map(a => (
              <label key={a.id} className="flex items-center gap-2 text-xs font-semibold text-slate-705 cursor-pointer py-1 px-1 rounded hover:bg-slate-50">
                <input
                  type="radio"
                  name="availabilityDesktop"
                  checked={filters.availability === a.id}
                  onChange={() => setFilters(prev => ({ ...prev, availability: a.id }))}
                  className="text-teal focus:ring-teal cursor-pointer shrink-0"
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ================= MAIN PRODUCTS LIST COLUMN ================= */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Fallback Notice Banner */}
        {hasNoResultsForCity && (
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-xs font-bold text-amber-700 text-left flex items-center justify-between gap-2 select-none animate-fade-in">
            <span>No medicines found in {city} yet. Showing all available results instead.</span>
            <button
              onClick={handleBrowseAll}
              className="text-xs font-black text-amber-800 hover:text-amber-900 bg-transparent border-0 cursor-pointer outline-none transition-colors shrink-0"
            >
              [Browse All]
            </button>
          </div>
        )}

        {/* Mobile Top Sticky Filter Bar */}
        <div className="flex lg:hidden flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-14 z-30 select-none">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-black border bg-slate-50 border-slate-200 text-slate-750 cursor-pointer hover:bg-slate-100 outline-none"
            >
              All Filters <FiFilter className="text-teal text-[11px]" />
              {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'All') && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Quick Categories shortcut pills */}
            {['Medicines', 'Ayurveda', 'Wellness', 'Health Devices'].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(filters.category === cat ? 'All' : cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer outline-none ${
                  filters.category === cat
                    ? 'bg-teal border-teal text-white shadow-sm font-extrabold'
                    : 'bg-white border-slate-100 text-slate-650'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Selected Filter Tags/Chips row */}
          {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'All') && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 border-t border-slate-100 mt-1">
              {filters.category !== 'All' && (
                <span className="flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {filters.category}
                  <FiX className="cursor-pointer" onClick={() => handleCategorySelect('All')} />
                </span>
              )}
              {filters.brand.map(b => (
                <span key={b} className="flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {b.split(' ')[0]}...
                  <FiX className="cursor-pointer" onClick={() => {
                    setFilters(prev => ({ ...prev, brand: prev.brand.filter(x => x !== b) }));
                  }} />
                </span>
              ))}
              {filters.type.map(t => (
                <span key={t} className="flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t}
                  <FiX className="cursor-pointer" onClick={() => {
                    setFilters(prev => ({ ...prev, type: prev.type.filter(x => x !== t) }));
                  }} />
                </span>
              ))}
              {filters.priceRange !== 'All' && (
                <span className="flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  ₹ {filters.priceRange}
                  <FiX className="cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, priceRange: 'All' }))} />
                </span>
              )}
              {filters.availability !== 'All' && (
                <span className="flex items-center gap-1 bg-teal/10 text-teal border border-teal/20 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  {filters.availability}
                  <FiX className="cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, availability: 'All' }))} />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Prescription filter banner tag alert */}
        {isPrescriptionFilterActive && (
          <div className="w-full bg-teal-light/45 border border-teal/15 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold text-teal-dark select-none animate-fade-in">
            <span className="flex items-center gap-2 text-slate-700 font-bold">
              <span>📄</span> Prescribed medicines extracted from your uploaded prescription.
            </span>
            <button
              onClick={() => dispatch(setPrescriptionFilterActive(false))}
              className="px-3 py-1 bg-teal hover:bg-teal-dark text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer transition-colors border-0"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Curated scrollable horizontal product rows for Medicines page (when no custom filters applied) */}
        {filters.category === 'Medicines' && 
         filters.brand.length === 0 && 
         filters.type.length === 0 && 
         filters.priceRange === 'All' && 
         filters.availability === 'All' && (
          <div className="flex flex-col gap-4 select-none my-1 animate-fade-in">
            {/* Prescription Upload Banner inside Medicines Section */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-4.5 flex items-center justify-between gap-4 shadow-sm select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal/10 flex items-center justify-center text-teal">
                  <FiUploadCloud className="w-5.5 h-5.5" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs md:text-sm font-black text-slate-805">Order with Prescription</h3>
                  <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-normal">
                    Upload prescription and we will map the medicines for you.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-teal hover:bg-teal-dark text-white font-extrabold text-[10px] md:text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 transition-colors shrink-0"
              >
                Upload Rx
              </button>
            </div>
            {[
              {
                title: '🔁 Previously Bought',
                items: previouslyBoughtMedicines,
                key: 'Previously Bought'
              },
              {
                title: '💊 Best for Gut Health',
                items: medicines.filter(m => ['med-8', 'med-23', 'med-25', 'med-26', 'med-31', 'med-46', 'med-49'].includes(m.id)),
                key: 'Stomach & Digestion'
              },
              {
                title: '❤️ Heart & BP Care',
                items: medicines.filter(m => ['med-12', 'med-53', 'med-54', 'med-55'].includes(m.id)),
                key: 'Heart Care'
              },
              {
                title: '🌿 Immunity Boosters',
                items: medicines.filter(m => ['med-1', 'med-3', 'med-6', 'med-9', 'med-11', 'med-14', 'med-28', 'med-43', 'med-45'].includes(m.id)),
                key: 'Ayurveda'
              },
              {
                title: '😴 Sleep & Stress Relief',
                items: medicines.filter(m => ['med-11', 'med-45', 'med-56', 'med-57', 'med-58'].includes(m.id)),
                key: 'Ayurveda'
              },
              {
                title: '🧴 Skin & Hair Care',
                items: medicines.filter(m => ['med-7', 'med-36', 'med-39', 'med-40', 'med-41', 'med-42', 'med-48', 'med-50', 'med-51', 'med-61'].includes(m.id)),
                key: 'Skin Care'
              },
              {
                title: '👶 Baby & Mother Care',
                items: medicines.filter(m => ['med-59', 'med-60', 'med-61', 'med-62'].includes(m.id)),
                key: 'Baby Care'
              },
              {
                title: '💪 Vitamins & Nutrition',
                items: medicines.filter(m => ['med-1', 'med-6', 'med-9', 'med-17', 'med-21', 'med-28', 'med-34', 'med-35', 'med-37', 'med-38'].includes(m.id)),
                key: 'Vitamins & Supplements'
              },
              {
                title: '🩺 Diabetes Management',
                items: medicines.filter(m => ['med-5', 'med-16', 'med-22', 'med-63', 'med-64', 'med-65'].includes(m.id)),
                key: 'Diabetes Care'
              }
            ]
              .filter(sec => sec.items.length > 0)
              .map((section) => (
                <div key={section.title} className="flex flex-col gap-2 bg-white p-4.5 rounded-3xl border border-slate-100 shadow-premium">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{section.title}</h3>
                    {section.key !== 'Previously Bought' && (
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, type: [section.key] }))}
                        className="text-[10px] font-black text-teal hover:text-teal-dark border-0 bg-transparent cursor-pointer uppercase tracking-wider transition-colors"
                      >
                        See All →
                      </button>
                    )}
                  </div>
                  <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex gap-3 min-w-max py-1 pr-4">
                      {section.items.map((prod) => (
                        <div key={prod.id || prod._id} className="w-[155px] md:w-[175px] shrink-0">
                          <ProductCard product={prod} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Active Title, products count */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mt-1 select-none">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-extrabold text-slate-800">
              {filters.category === 'All' ? 'All Products' : filters.category} {filters.type.length > 0 ? `(${filters.type.join(', ')})` : ''}
            </h2>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {prioritizedFilteredProducts.length} items found
            </span>
          </div>
        </div>

        {medicines.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-4.5 select-none">
            <span className="text-5xl animate-pulse font-black">📦</span>
            <h4 className="font-black text-slate-805 text-sm">No Medicines Found in {locationState?.city || 'this area'}</h4>
            <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto leading-relaxed uppercase">
              We are expanding to your area soon! You can browse all products or change your location search.
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
        ) : prioritizedFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {prioritizedFilteredProducts.map((med) => (
              <ProductCard key={med.id || med._id} product={med} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-2">
            <span className="text-4xl animate-bounce">📦</span>
            <h4 className="font-extrabold text-slate-800 text-xs">No Products Found</h4>
            <p className="text-[11px] text-slate-400 font-semibold">We are expanding our apothecary catalog. Check back soon!</p>
          </div>
        )}
      </div>

      {/* ================= POPUP MODALS AND PERSISTENT UI SHEETS ================= */}

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

      {/* Mobile Floating Action Circular Upload Button */}
      {isPrescriptionRoute() && (
        <div className="fixed bottom-20 right-4 z-40 md:hidden animate-bounce">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-teal text-white shadow-xl hover:bg-teal-dark transition-all duration-200 border-0 cursor-pointer active:scale-95 outline-none"
            title="Upload Prescription"
          >
            <FiUploadCloud className="text-lg" />
          </button>
        </div>
      )}

      {/* Mobile Bottom-Sheet Filter Modal - Split-Pane Sidebar Style */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 select-none animate-fade-in md:hidden">
          <div className="w-full h-[80vh] bg-white rounded-t-3xl flex flex-col overflow-hidden shadow-2xl relative animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-black text-slate-805 uppercase tracking-wider">All filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center border-0 cursor-pointer text-slate-500 transition-colors outline-none"
              >
                <FiX className="text-base" />
              </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 flex min-h-0">
              
              {/* Left Pane (Tabs selector) */}
              <div className="w-1/3 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                {filterTabs.map(tab => {
                  const isActive = activeFilterTab === tab.id;
                  let badgeCount = 0;
                  if (tab.id === 'brand') badgeCount = filters.brand.length;
                  if (tab.id === 'type') badgeCount = filters.type.length;
                  if (tab.id === 'category' && filters.category !== 'All') badgeCount = 1;
                  if (tab.id === 'priceRange' && filters.priceRange !== 'All') badgeCount = 1;
                  if (tab.id === 'availability' && filters.availability !== 'All') badgeCount = 1;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id)}
                      className={`w-full text-left px-3.5 py-4 text-[10.5px] font-black uppercase tracking-wider transition-all relative border-b border-slate-100 flex items-center justify-between cursor-pointer outline-none border-0 ${
                        isActive
                          ? 'bg-white text-teal border-l-4 border-l-teal'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{tab.label}</span>
                      {badgeCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-teal text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-sm ml-1">
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Pane (Checkboxes or options list) */}
              <div className="w-2/3 bg-white p-4 overflow-y-auto flex flex-col gap-3">
                {/* Search Bar for Options */}
                {(activeFilterTab === 'brand' || activeFilterTab === 'type') && (
                  <div className="relative mb-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={optionSearchQuery}
                      onChange={(e) => setOptionSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 outline-none focus:border-teal/30"
                    />
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  </div>
                )}

                {/* Render Category Options */}
                {activeFilterTab === 'category' && (
                  <div className="flex flex-col gap-2">
                    {['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'].map(cat => (
                      <label key={cat} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100/50">
                        <span className="text-xs font-semibold text-slate-700">{cat}</span>
                        <input
                          type="radio"
                          name="filterCategoryRadio"
                          checked={filters.category === cat}
                          onChange={() => handleCategorySelect(cat)}
                          className="text-teal focus:ring-teal cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* Render Brand Checkboxes */}
                {activeFilterTab === 'brand' && (
                  <div className="flex flex-col gap-2">
                    {uniqueBrands
                      .filter(brand => brand.toLowerCase().includes(optionSearchQuery.toLowerCase()))
                      .map(brand => {
                        const isChecked = filters.brand.includes(brand);
                        const count = baseMedicines.filter(m => m.brand === brand).length;
                        return (
                          <label key={brand} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100/50">
                            <span className="text-xs font-semibold text-slate-700 max-w-[75%] truncate">{brand}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9.5px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{count}</span>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setFilters(prev => ({
                                    ...prev,
                                    brand: isChecked
                                      ? prev.brand.filter(b => b !== brand)
                                      : [...prev.brand, brand]
                                  }));
                                }}
                                className="text-teal focus:ring-teal cursor-pointer rounded"
                              />
                            </div>
                          </label>
                        );
                      })}
                  </div>
                )}

                {/* Render Health Concerns Checkboxes */}
                {activeFilterTab === 'type' && (
                  <div className="flex flex-col gap-2">
                    {[
                      'Pain Relief', 'Cold & Cough', 'Stomach & Digestion', 'Vitamins & Supplements',
                      'Diabetes Care', 'Heart Care', 'Eye Care', 'Baby Care', 'Ayurveda', 'Wellness', 'Health Devices'
                    ]
                      .filter(t => t.toLowerCase().includes(optionSearchQuery.toLowerCase()))
                      .map(t => {
                        const isChecked = filters.type.includes(t);
                        let count = 0;
                        if (t === 'Ayurveda') {
                          count = baseMedicines.filter(m => m.category === 'Ayurveda' || (MEDICINE_SUBCATEGORY_MAP['Ayurveda'] || []).includes(m.id)).length;
                        } else if (t === 'Wellness') {
                          count = baseMedicines.filter(m => m.category === 'Wellness' || (MEDICINE_SUBCATEGORY_MAP['Vitamins & Supplements'] || []).includes(m.id)).length;
                        } else if (t === 'Health Devices') {
                          count = baseMedicines.filter(m => m.category === 'Health Devices' || m.id === 'med-5').length;
                        } else if (t === 'Cold & Cough') {
                          count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP['Cold & Flu'] || []).includes(m.id) || m.name.toLowerCase().includes('cold') || m.name.toLowerCase().includes('cough')).length;
                        } else if (t === 'Stomach & Digestion') {
                          count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP['Stomach & Digestion'] || []).includes(m.id)).length;
                        } else {
                          count = baseMedicines.filter(m => (MEDICINE_SUBCATEGORY_MAP[t] || []).includes(m.id)).length;
                        }

                        return (
                          <label key={t} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100/50">
                            <span className="text-xs font-semibold text-slate-700">{t}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9.5px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">{count}</span>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setFilters(prev => ({
                                    ...prev,
                                    type: isChecked
                                      ? prev.type.filter(x => x !== t)
                                      : [...prev.type, t]
                                  }));
                                }}
                                className="text-teal focus:ring-teal cursor-pointer rounded"
                              />
                            </div>
                          </label>
                        );
                      })}
                  </div>
                )}

                {/* Render Price Range Option */}
                {activeFilterTab === 'priceRange' && (
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'All', label: 'All Prices' },
                      { id: 'under-100', label: 'Under ₹100' },
                      { id: '100-500', label: '₹100 - ₹500' },
                      { id: '500-1000', label: '₹500 - ₹1000' },
                      { id: 'over-1000', label: 'Over ₹1000' }
                    ].map(r => (
                      <label key={r.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100/50">
                        <span className="text-xs font-semibold text-slate-700">{r.label}</span>
                        <input
                          type="radio"
                          name="filterPriceRadio"
                          checked={filters.priceRange === r.id}
                          onChange={() => setFilters(prev => ({ ...prev, priceRange: r.id }))}
                          className="text-teal focus:ring-teal cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* Render Availability Option */}
                {activeFilterTab === 'availability' && (
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'All', label: 'All Items' },
                      { id: 'inStock', label: 'In Stock Only' },
                      { id: 'discounted', label: 'Discounted Items' }
                    ].map(a => (
                      <label key={a.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-slate-100/50">
                        <span className="text-xs font-semibold text-slate-700">{a.label}</span>
                        <input
                          type="radio"
                          name="filterAvailabilityRadio"
                          checked={filters.availability === a.id}
                          onChange={() => setFilters(prev => ({ ...prev, availability: a.id }))}
                          className="text-teal focus:ring-teal cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Clear and Apply */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between gap-4 select-none shrink-0">
              <button
                onClick={() => {
                  setFilters({
                    category: 'All',
                    brand: [],
                    type: [],
                    priceRange: 'All',
                    availability: 'All'
                  });
                  dispatch(setSelectedCategory('All'));
                }}
                className="text-xs font-black text-slate-500 hover:text-slate-800 bg-transparent border-0 cursor-pointer outline-none uppercase tracking-wider"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
