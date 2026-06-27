import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiBox, 
  FiDollarSign, FiLayers, FiAlertTriangle, FiCheckCircle, FiEye, FiActivity
} from 'react-icons/fi';

// Rich Mock Medicine Data representing pharmacy inventory
const INITIAL_MEDICINES = [
  {
    id: 'med-001',
    name: 'Augmentin 625 Duo Tablet',
    brand: 'GLAXOSMITHKLINE',
    composition: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotic',
    price: 164.00,
    stock: 45,
    status: 'Active',
    expiryStatus: 'Normal',
    prescriptionRequired: true,
    drugSchedule: 'Schedule H',
    variantsCount: 2,
    variants: [
      { strength: '625mg', form: 'Tablet', packSize: '10 tablets', mrp: '204', sellingPrice: '164', stock: '45' },
      { strength: '1000mg', form: 'Tablet', packSize: '15 tablets', mrp: '350', sellingPrice: '300', stock: '20' }
    ],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'med-002',
    name: 'Pan 40 Tablet',
    brand: 'ALKEM LABORATORIES LTD',
    composition: 'Pantoprazole 40mg',
    category: 'Gastrointestinal',
    price: 139.50,
    stock: 120,
    status: 'Active',
    expiryStatus: 'Normal',
    prescriptionRequired: false,
    drugSchedule: 'OTC',
    variantsCount: 1,
    variants: [
      { strength: '40mg', form: 'Tablet', packSize: '15 tablets', mrp: '155', sellingPrice: '139.5', stock: '120' }
    ],
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'med-003',
    name: 'Dolo 650 Tablet',
    brand: 'MICRO LABS LTD',
    composition: 'Paracetamol 650mg',
    category: 'Pain Relief',
    price: 28.00,
    stock: 8,
    status: 'Low Stock',
    expiryStatus: 'Expiring Soon',
    prescriptionRequired: false,
    drugSchedule: 'OTC',
    variantsCount: 1,
    variants: [
      { strength: '650mg', form: 'Tablet', packSize: '15 tablets', mrp: '34', sellingPrice: '28', stock: '8' }
    ],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'med-004',
    name: 'Shelcal 500 Tablet',
    brand: 'TORRENT PHARMACEUTICALS LTD',
    composition: 'Calcium 500mg + Vitamin D3 250 IU',
    category: 'Vitamin',
    price: 101.50,
    stock: 0,
    status: 'Out of Stock',
    expiryStatus: 'Normal',
    prescriptionRequired: false,
    drugSchedule: 'OTC',
    variantsCount: 2,
    variants: [
      { strength: '500mg', form: 'Tablet', packSize: '15 tablets', mrp: '120', sellingPrice: '101.5', stock: '0' }
    ],
    image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'med-005',
    name: 'Glycomet 500mg SR',
    brand: 'USV PRIVATE LTD',
    composition: 'Metformin Hydrochloride 500mg',
    category: 'Diabetes',
    price: 52.00,
    stock: 14,
    status: 'Active',
    expiryStatus: 'Expiring Soon',
    prescriptionRequired: true,
    drugSchedule: 'Schedule H',
    variantsCount: 1,
    variants: [
      { strength: '500mg', form: 'Tablet', packSize: '10 tablets', mrp: '60', sellingPrice: '52', stock: '14' }
    ],
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'med-006',
    name: 'Atorva 10mg Tablet',
    brand: 'ZYDUS CADILA',
    composition: 'Atorvastatin 10mg',
    category: 'Cardiac',
    price: 85.00,
    stock: 65,
    status: 'Draft',
    expiryStatus: 'Normal',
    prescriptionRequired: true,
    drugSchedule: 'Schedule H',
    variantsCount: 1,
    variants: [
      { strength: '10mg', form: 'Tablet', packSize: '10 tablets', mrp: '98', sellingPrice: '85', stock: '65' }
    ],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
  }
];

export default function MedicineCatalog() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Draft' | 'Low Stock' | 'Expiring Soon'
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    prescriptionRequired: '',
    stockStatus: '',
    expiryStatus: '',
    status: ''
  });

  // Unique Brands & Categories for filters
  const uniqueBrands = Array.from(new Set(medicines.map(m => m.brand)));
  const uniqueCategories = Array.from(new Set(medicines.map(m => m.category)));

  // Toggle Medicine Activation
  const handleToggleDeactivate = (id) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === id) {
        const nextStatus = med.status === 'Inactive' ? 'Active' : 'Inactive';
        return { ...med, status: nextStatus };
      }
      return med;
    }));
  };

  // Filter & Search Logic
  const filteredMedicines = medicines.filter(med => {
    // Search filter
    const matchesSearch = 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.composition.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab Filter
    let matchesTab = true;
    if (activeTab === 'Active') matchesTab = med.status === 'Active';
    else if (activeTab === 'Draft') matchesTab = med.status === 'Draft';
    else if (activeTab === 'Low Stock') matchesTab = med.status === 'Low Stock' || med.stock > 0 && med.stock < 15;
    else if (activeTab === 'Expiring Soon') matchesTab = med.expiryStatus === 'Expiring Soon';

    // Detailed Filters
    const matchesCategory = !filters.category || med.category === filters.category;
    const matchesBrand = !filters.brand || med.brand === filters.brand;
    const matchesRx = !filters.prescriptionRequired || 
      (filters.prescriptionRequired === 'Yes' ? med.prescriptionRequired : !med.prescriptionRequired);
    const matchesStock = !filters.stockStatus || 
      (filters.stockStatus === 'Out of Stock' ? med.stock === 0 :
       filters.stockStatus === 'Low Stock' ? (med.stock > 0 && med.stock < 15) : med.stock >= 15);
    const matchesExpiry = !filters.expiryStatus || med.expiryStatus === filters.expiryStatus;
    const matchesStatus = !filters.status || med.status === filters.status;

    return matchesSearch && matchesTab && matchesCategory && matchesBrand && matchesRx && matchesStock && matchesExpiry && matchesStatus;
  });

  // Tab counters calculation (from baseline inventory)
  const allCount = medicines.length;
  const activeCount = medicines.filter(m => m.status === 'Active').length;
  const draftCount = medicines.filter(m => m.status === 'Draft').length;
  const lowStockCount = medicines.filter(m => m.stock < 15 && m.stock > 0).length;
  const expiringCount = medicines.filter(m => m.expiryStatus === 'Expiring Soon').length;

  // Analytics sums
  const totalCount = medicines.length;
  const activeSum = medicines.filter(m => m.status === 'Active').length;
  const lowStockSum = medicines.filter(m => m.stock > 0 && m.stock < 15).length;
  const outOfStockSum = medicines.filter(m => m.stock === 0).length;

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      prescriptionRequired: '',
      stockStatus: '',
      expiryStatus: '',
      status: ''
    });
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-110px)] p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* 1. Header with ERP Title and New Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Medicine Catalog</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">
            Manage your pharmacy products, pricing, inventory and availability
          </p>
        </div>
      </div>

      {/* 2. Top Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Medicines */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Medicines</span>
            <span className="text-2xl font-black text-slate-850 mt-1">{totalCount}</span>
            <span className="text-[9px] text-teal font-extrabold uppercase mt-1">SaaS Catalog Items</span>
          </div>
          <div className="w-12 h-12 bg-teal-50 text-[#135A5A] rounded-xl flex items-center justify-center text-lg shadow-inner">
            <FiBox className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 2: Active Medicines */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active Medicines</span>
            <span className="text-2xl font-black text-slate-850 mt-1">{activeSum}</span>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase mt-1">Live in Store</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center text-lg shadow-inner">
            <FiCheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 3: Low Stock */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Low Stock Alerts</span>
            <span className="text-2xl font-black text-slate-850 mt-1">{lowStockSum}</span>
            <span className="text-[9px] text-amber-600 font-extrabold uppercase mt-1">Threshold warning</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center text-lg shadow-inner">
            <FiAlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Out of Stock</span>
            <span className="text-2xl font-black text-[#8C3A42] mt-1">{outOfStockSum}</span>
            <span className="text-[9px] text-[#8C3A42] font-extrabold uppercase mt-1">Needs Replenishment</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-[#8C3A42] rounded-xl flex items-center justify-center text-lg shadow-inner">
            <FiTrash2 className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* 3. Search and Dynamic Filters Panel */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex flex-col gap-4">
        
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input 
              type="text" 
              placeholder="Search medicines by name, brand or composition..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#135A5A] outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-xs font-black uppercase tracking-wider cursor-pointer w-full sm:w-auto
              ${showFilters 
                ? 'bg-[#135A5A] border-[#135A5A] text-white' 
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'}`}
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 transition-all duration-300">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Brand</label>
              <select 
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
                className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(brnd => <option key={brnd} value={brnd}>{brnd}</option>)}
              </select>
            </div>

            {/* Prescription Required */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Rx Required</label>
              <select 
                value={filters.prescriptionRequired}
                onChange={(e) => setFilters({...filters, prescriptionRequired: e.target.value})}
                className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="">All Types</option>
                <option value="Yes">Rx Required</option>
                <option value="No">OTC Only</option>
              </select>
            </div>

            {/* Stock Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Stock Status</label>
              <select 
                value={filters.stockStatus}
                onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
                className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="">All Stocks</option>
                <option value="In Stock">In Stock (15+)</option>
                <option value="Low Stock">Low Stock (&lt;15)</option>
                <option value="Out of Stock">Out of Stock (0)</option>
              </select>
            </div>

            {/* Expiry Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Expiry Status</label>
              <select 
                value={filters.expiryStatus}
                onChange={(e) => setFilters({...filters, expiryStatus: e.target.value})}
                className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none"
              >
                <option value="">All Batches</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Normal">Normal Batch</option>
              </select>
            </div>

            {/* Active / Inactive */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Operational Status</label>
              <div className="flex items-center gap-2 flex-1">
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 outline-none flex-1"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button 
                  type="button" 
                  onClick={resetFilters}
                  className="px-2 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. Filter Tabs Row */}
      <div className="bg-white border border-slate-100 p-2.5 rounded-2xl shadow-sm flex flex-wrap gap-1.5 overflow-x-auto">
        {[
          { key: 'All', label: 'All Medicines', count: allCount },
          { key: 'Active', label: 'Active', count: activeCount },
          { key: 'Draft', label: 'Draft', count: draftCount },
          { key: 'Low Stock', label: 'Low Stock', count: lowStockCount },
          { key: 'Expiring Soon', label: 'Expiring Soon', count: expiringCount }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border
              ${activeTab === tab.key 
                ? 'bg-[#135A5A] border-[#135A5A] text-white shadow-premium' 
                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-black px-1.5 py-0.25 rounded-md
              ${activeTab === tab.key ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 5. Medicine ERP Cards Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {filteredMedicines.map((med) => {
          let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-250";
          if (med.status === 'Low Stock') badgeColor = "bg-amber-50 text-amber-700 border-amber-250";
          if (med.status === 'Out of Stock') badgeColor = "bg-rose-50 text-rose-700 border-rose-250";
          if (med.status === 'Draft') badgeColor = "bg-slate-50 text-slate-500 border-slate-250";
          if (med.status === 'Inactive') badgeColor = "bg-red-50 text-red-700 border-red-250";

          return (
            <div 
              key={med.id} 
              className="bg-white border border-slate-100 rounded-3xl p-4.5 flex flex-col justify-between hover:shadow-premium group transition-all duration-300 relative min-h-[360px]"
            >
              
              {/* Image & Header Details */}
              <div className="flex flex-col gap-3">
                
                {/* Image Showcase Container */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-50 border border-slate-50 flex items-center justify-center p-2 relative">
                  <img src={med.image} alt={med.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  
                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 text-[8.5px] font-black uppercase px-2 py-0.5 border rounded-lg tracking-wider ${badgeColor}`}>
                    {med.status}
                  </span>

                  {med.prescriptionRequired && (
                    <span className="absolute bottom-2 left-2 text-[8px] bg-teal-500 text-white font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                      Rx Req
                    </span>
                  )}
                </div>

                {/* Product Meta */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">{med.brand}</span>
                  <h3 className="text-xs font-black text-slate-850 line-clamp-1 leading-tight">{med.name}</h3>
                  <span className="text-[10px] text-[#135A5A] font-extrabold truncate">Salt: {med.composition}</span>
                </div>

                {/* Variants Details */}
                <div className="flex flex-col gap-1 border-t border-slate-50 pt-2 text-[11px] font-semibold text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase">Pack Variants</span>
                    <span className="font-bold text-slate-800 font-mono">{med.variantsCount} Pack sizes</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {med.variants.map((v, i) => (
                      <span key={i} className="text-[8.5px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100 font-bold font-mono">
                        {v.packSize}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Pricing, Stock & Operational Status bottom row */}
              <div className="border-t border-slate-50 pt-3 mt-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 font-black uppercase">ERP Price</span>
                  <span className="text-sm font-black text-slate-850 font-mono">₹{med.price}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-slate-400 font-black uppercase">Stock Qty</span>
                  <span className={`text-xs font-black font-mono ${med.stock === 0 ? 'text-rose-600' : med.stock < 15 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {med.stock} pcs
                  </span>
                </div>
              </div>

              {/* ERP HOVER ACTIONS DRAWER */}
              <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-2.5 p-5">
                <span className="text-[10px] text-slate-200 font-bold uppercase tracking-widest absolute top-4 left-4">
                  ERP Operations
                </span>

                <button 
                  onClick={() => navigate(`/vendor/pharmacy/medicines/${med.id}?tab=basic`)}
                  className="w-full py-2 bg-white text-slate-805 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm border border-slate-200"
                >
                  <FiEdit2 className="w-3 h-3" /> Edit Medicine
                </button>

                <button 
                  onClick={() => navigate(`/vendor/pharmacy/medicines/${med.id}?tab=variants`)}
                  className="w-full py-2 bg-[#135A5A] text-white hover:bg-[#0F4A4A] rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <FiLayers className="w-3 h-3" /> Manage Variants
                </button>

                <button 
                  onClick={() => navigate(`/vendor/pharmacy/medicines/${med.id}?tab=inventory`)}
                  className="w-full py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <FiBox className="w-3 h-3" /> Manage Stock
                </button>

                <button 
                  onClick={() => navigate(`/vendor/pharmacy/medicines/${med.id}?tab=variants`)}
                  className="w-full py-2 bg-teal-800 text-white hover:bg-teal-900 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <FiDollarSign className="w-3 h-3" /> Update Pricing
                </button>

                <button 
                  onClick={() => navigate(`/vendor/pharmacy/medicines/${med.id}`)}
                  className="w-full py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <FiEye className="w-3 h-3" /> View Details
                </button>

                <button 
                  onClick={() => handleToggleDeactivate(med.id)}
                  className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border
                    ${med.status === 'Inactive' 
                      ? 'bg-emerald-500/10 text-emerald-100 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' 
                      : 'bg-rose-500/10 text-rose-100 border-rose-500/20 hover:bg-rose-500 hover:text-white'}`}
                >
                  <FiActivity className="w-3 h-3" />
                  <span>{med.status === 'Inactive' ? 'Activate' : 'Deactivate'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
