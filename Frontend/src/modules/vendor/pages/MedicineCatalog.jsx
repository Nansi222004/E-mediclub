import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiBox, FiDollarSign } from 'react-icons/fi';
import ProductCard from '../../../shared/components/ProductCard';

// Dummy medicines data based on customer app style
const MOCK_MEDICINES = [
  {
    id: 'med-001',
    name: 'Augmentin 625 Duo Tablet',
    brand: 'GlaxoSmithKline',
    price: 204.50,
    discountPrice: 163.60,
    discountPercent: 20,
    packSize: '10 tablets in 1 strip',
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    stock: 45,
    status: 'Active'
  },
  {
    id: 'med-002',
    name: 'Pan 40 Tablet',
    brand: 'Alkem Laboratories Ltd',
    price: 155.00,
    discountPrice: 139.50,
    discountPercent: 10,
    packSize: '15 tablets in 1 strip',
    rating: 4.6,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    stock: 120,
    status: 'Active'
  },
  {
    id: 'med-003',
    name: 'Dolo 650 Tablet',
    brand: 'Micro Labs Ltd',
    price: 30.91,
    discountPrice: null,
    discountPercent: 0,
    packSize: '15 tablets in 1 strip',
    rating: 4.9,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    stock: 8,
    status: 'Low Stock'
  },
  {
    id: 'med-004',
    name: 'Shelcal 500 Tablet',
    brand: 'Torrent Pharmaceuticals Ltd',
    price: 119.50,
    discountPrice: 101.57,
    discountPercent: 15,
    packSize: '15 tablets in 1 strip',
    rating: 4.7,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    stock: 0,
    status: 'Out of Stock'
  }
];

export default function MedicineCatalog() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 lg:p-6 rounded-3xl border border-slate-100 shadow-premium">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-800">Medicine Catalog</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Manage your pharmacy products and pricing</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-[#135A5A]/30 w-full sm:w-auto">
          <FiPlus className="text-base stroke-[3]" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 border border-slate-200/60 p-2 rounded-2xl">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search medicines by name or brand..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-semibold focus:ring-2 focus:ring-[#135A5A]/20 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm w-full sm:w-auto">
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {MOCK_MEDICINES.map((med) => (
          <div key={med.id} className="relative group flex flex-col h-full">
            {/* 1. The original customer-facing card */}
            <div className="pointer-events-none z-0 h-full flex flex-col">
              <ProductCard product={med} />
            </div>

            {/* 2. Vendor Actions Overlay (appears on hover) */}
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3 p-4">
              
              {/* Stock Status Badge inside overlay */}
              <div className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider
                ${med.status === 'Active' ? 'bg-emerald-500 text-white' : ''}
                ${med.status === 'Low Stock' ? 'bg-orange-500 text-white' : ''}
                ${med.status === 'Out of Stock' ? 'bg-red-500 text-white' : ''}
              `}>
                {med.status}
              </div>

              <button className="w-full max-w-[180px] py-2.5 bg-white text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <FiEdit2 /> Edit Details
              </button>
              
              <button className="w-full max-w-[180px] py-2.5 bg-[#135A5A] text-white hover:bg-[#0F4A4A] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <FiDollarSign /> Update Pricing
              </button>

              <button className="w-full max-w-[180px] py-2.5 bg-slate-800 text-white hover:bg-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <FiBox /> Manage Stock
              </button>

              <button className="w-full max-w-[180px] py-2.5 bg-red-500/10 text-red-100 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2">
                <FiTrash2 /> Remove
              </button>
            </div>
            
            {/* Persistent Vendor Info Strip below the card (visible without hover) */}
            <div className="mt-3 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Stock: <span className={`font-black text-sm ml-1 ${med.stock === 0 ? 'text-red-500' : med.stock < 10 ? 'text-orange-500' : 'text-slate-800'}`}>{med.stock}</span>
              </span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider
                ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : ''}
                ${med.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : ''}
                ${med.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : ''}
              `}>
                {med.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
