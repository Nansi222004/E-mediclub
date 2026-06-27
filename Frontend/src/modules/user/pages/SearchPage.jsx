import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiFilter, FiList, FiGrid, FiCheck } from 'react-icons/fi';
import ProductCard from '../../../shared/components/ProductCard';
import { setSearchTerm } from '../store/productSlice';

export default function SearchPage() {
  const dispatch = useDispatch();

  // Redux Selectors
  const { medicines, searchTerm, location: locationState } = useSelector(state => state.products);
  
  const pincode = locationState?.pincode ? locationState.pincode.trim() : '';
  const city = locationState?.city ? locationState.city.trim() : '';

  // States
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply location filtering
  const baseMedicinesRaw = React.useMemo(() => {
    let result = medicines;
    if (pincode) {
      result = result.filter(med => med.vendorPincode === pincode);
    } else if (city) {
      result = result.filter(med => med.vendorCity && med.vendorCity.toLowerCase() === city.toLowerCase());
    }
    return result.length > 0 ? result : medicines;
  }, [medicines, pincode, city]);

  const baseMedicines = React.useMemo(() => {
    const unique = new Map();
    baseMedicinesRaw.forEach(med => {
      if (!unique.has(med.name)) {
        unique.set(med.name, med);
      }
    });
    return Array.from(unique.values());
  }, [baseMedicinesRaw]);

  // Search logic
  const brandList = React.useMemo(() => {
    const brands = baseMedicines.map(m => m.brand).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [baseMedicines]);
  
  const dosageForms = ['Tablet', 'Capsule', 'Spray', 'Strips', 'Tonic', 'Face Wash'];

  // Toggle Filters
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleFormToggle = (form) => {
    setSelectedForms(prev =>
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
    );
  };

  // Filter & Sort core logic
  const filteredProducts = baseMedicines
    .filter(med => {
      // 1. Text Search matching
      const query = searchTerm.toLowerCase().trim();
      const matchesText = !query || 
        med.name?.toLowerCase().includes(query) ||
        med.category?.toLowerCase().includes(query) ||
        med.composition?.toLowerCase().includes(query) ||
        med.brand?.toLowerCase().includes(query);

      // 2. Brand matching
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(med.brand);

      // 3. Form matching
      const matchesForm = selectedForms.length === 0 || selectedForms.some(form => med.packSize.toLowerCase().includes(form.toLowerCase()) || med.name.toLowerCase().includes(form.toLowerCase()));

      // 4. Discount matching
      const matchesDiscount = med.discountPercent >= selectedDiscount;

      return matchesText && matchesBrand && matchesForm && matchesDiscount;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: Popular (by reviews count)
      return b.reviewsCount - a.reviewsCount;
    });

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedForms([]);
    setSelectedDiscount(0);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10">
      
      {/* Search Header Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h1 className="text-lg font-black text-slate-800">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Medical Catalog'}
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
            {filteredProducts.length} matching health items
          </p>
        </div>

        {/* View togglers & sorter */}
        <div className="flex items-center gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="popular">Sort by: Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Ratings: Highest First</option>
          </select>

          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-forest shadow-sm' : 'text-slate-400'}`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1 px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold"
          >
            <FiFilter /> Filters
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="flex gap-6 md:gap-8">
        
        {/* 1. Left Filters Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col gap-6 w-64 shrink-0 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium select-none">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <FiFilter className="text-teal" /> Filters
            </h3>
            <button onClick={clearAllFilters} className="text-[10px] font-black text-coral hover:underline">
              CLEAR ALL
            </button>
          </div>

          {/* Brands selection */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</h4>
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
              {brandList.map(brand => (
                <button
                  key={brand}
                  onClick={() => handleBrandToggle(brand)}
                  className="flex items-center gap-2 text-left text-xs text-slate-600 font-semibold"
                >
                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    selectedBrands.includes(brand) ? 'bg-forest border-forest text-white' : 'border-slate-200 bg-slate-50'
                  }`}>
                    {selectedBrands.includes(brand) && <FiCheck className="w-3 h-3 stroke-[3px]" />}
                  </span>
                  <span className="truncate">{brand}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dosage Form selection */}
          <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage Form</h4>
            <div className="flex flex-col gap-2">
              {dosageForms.map(form => (
                <button
                  key={form}
                  onClick={() => handleFormToggle(form)}
                  className="flex items-center gap-2 text-left text-xs text-slate-600 font-semibold"
                >
                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    selectedForms.includes(form) ? 'bg-forest border-forest text-white' : 'border-slate-200 bg-slate-50'
                  }`}>
                    {selectedForms.includes(form) && <FiCheck className="w-3 h-3 stroke-[3px]" />}
                  </span>
                  <span>{form}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Discount range */}
          <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Discount</h4>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[0, 10, 15].map(disc => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscount(disc)}
                  className={`py-1.5 border rounded-xl text-[10px] font-black transition-all ${
                    selectedDiscount === disc ? 'border-teal bg-teal-light text-teal font-extrabold' : 'border-slate-100 bg-slate-50 text-slate-600'
                  }`}
                >
                  {disc === 0 ? 'Any' : `${disc}%+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 2. Search Results Panel */}
        <section className="flex-1">
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((med) => (
                  <ProductCard key={med.id} product={med} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredProducts.map((med) => (
                  <div key={med.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-premium flex items-center justify-between gap-4">
                    <img src={med.image} alt={med.name} className="w-16 h-16 object-contain mix-blend-multiply bg-slate-50 p-1 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">{med.brand}</span>
                      <h4 className="text-sm font-extrabold text-slate-800 truncate">{med.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{med.packSize}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through font-semibold">₹{med.price}</span>
                      <span className="text-base font-black text-slate-900 block">₹{med.discountPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-premium text-center flex flex-col items-center gap-3">
              <span className="text-6xl">🔍</span>
              <h4 className="font-extrabold text-slate-800 text-sm">No Results Match Your Search</h4>
              <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
                Check spelling errors, remove active filters, or search for generic clinical salt replacements (e.g. Paracetamol).
              </p>
              <button 
                onClick={() => { dispatch(setSearchTerm('')); clearAllFilters(); }}
                className="mt-2.5 px-6 py-2 bg-forest text-white text-xs font-black rounded-xl"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

      </div>

    </div>
  );
}
