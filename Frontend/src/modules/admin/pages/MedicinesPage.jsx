import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { deleteMedicine } from '../../user/store/productSlice';
import { FiPackage, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

export default function MedicinesPage() {
  const dispatch = useDispatch();
  const { medicines, medicineCategories } = useSelector(state => state.products);

  const handleDelete = (id) => {
    dispatch(deleteMedicine(id));
  };

  // Define ReusableTable Columns
  const columns = [
    {
      key: 'name',
      header: 'Clinical Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'}
            alt={row.name}
            className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0"
          />
          <div>
            <span className="font-extrabold text-slate-800 block text-xs truncate max-w-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">{row.brand || 'Generic'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Therapy Class',
      render: (row) => (
        <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-650 uppercase tracking-wide">
          {row.category}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Price Info',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-850 text-xs">₹{row.discountPrice || row.price}</span>
          {row.discountPercent > 0 && (
            <span className="text-[9px] text-teal font-extrabold">{row.discountPercent}% OFF</span>
          )}
        </div>
      )
    },
    {
      key: 'packSize',
      header: 'Pack Size',
      render: (row) => <span className="text-2xs font-bold text-slate-500 uppercase">{row.packSize}</span>
    },
    {
      key: 'inStock',
      header: 'Availability',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
          row.inStock 
            ? 'bg-teal-light text-teal' 
            : 'bg-coral-light/60 text-coral'
        }`}>
          {row.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    }
  ];

  const tableActions = (row) => (
    <button
      onClick={() => handleDelete(row.id)}
      className="p-2 bg-coral-light/40 hover:bg-coral-light text-coral rounded-xl transition-all cursor-pointer tap-scale"
      title="Delete Product"
    >
      <FiTrash2 className="text-sm shrink-0" />
    </button>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Medicines Directory</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Browse and manage all registered pharmaceutical formulations, stocks, and pricing details.
          </p>
        </div>
      </div>

      {/* Main Listing View (Table for Desktop / Cards for Mobile handled inside ReusableTable implicitly or here) */}
      <div className="flex-1">
        <ReusableTable 
          columns={columns}
          data={medicines}
          searchPlaceholder="Search medicines by name or composition..."
          searchKey="name"
          filterOptions={{ key: 'category', label: 'Therapy Class', options: medicineCategories }}
          actions={tableActions}
          fileName="emediclub-medicines-listings"
        />
      </div>

    </div>
  );
}
