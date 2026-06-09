import React from 'react';

export default function MedicinesFilter({
  medicines = [],
  filters,
  onChange,
  onReset
}) {
  // Derive unique brands dynamically
  const uniqueBrands = React.useMemo(() => {
    if (!medicines) return [];
    const brands = medicines.map(m => m.brand).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [medicines]);

  const categories = ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'];
  const priceRanges = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 - ₹500', min: 100, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: 'Over ₹1000', min: 1000, max: Infinity }
  ];

  const handleFilterChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const activeRangeStr = JSON.stringify({
    min: filters.minPrice || 0,
    max: filters.maxPrice === undefined ? Infinity : filters.maxPrice
  });

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex flex-col">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Filter Catalog</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Narrow down healthcare products</p>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-black text-coral hover:text-coral-dark uppercase tracking-wider bg-transparent border-0 cursor-pointer outline-none transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Categories Tags */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category Type</span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange('category', cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                filters.category === cat
                  ? 'bg-forest border-forest text-white shadow-sm'
                  : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-forest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brand Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manufacturer / Brand</span>
          <select
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value || null)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-forest/30"
          >
            <option value="">All Brands</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price Range</span>
          <select
            value={activeRangeStr}
            onChange={(e) => {
              const range = JSON.parse(e.target.value);
              onChange({
                ...filters,
                minPrice: range.min,
                maxPrice: range.max
              });
            }}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-forest/30"
          >
            {priceRanges.map((range, idx) => (
              <option
                key={idx}
                value={JSON.stringify({ min: range.min, max: range.max })}
              >
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox Options */}
        <div className="flex flex-col gap-1.5 justify-end">
          <div className="flex items-center gap-4 py-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked ? true : null)}
                className="rounded text-forest focus:ring-forest border-slate-200 cursor-pointer"
              />
              In Stock Only
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-650 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.hasDiscount}
                onChange={(e) => handleFilterChange('hasDiscount', e.target.checked ? true : null)}
                className="rounded text-forest focus:ring-forest border-slate-200 cursor-pointer"
              />
              With Discount
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
