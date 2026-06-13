import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { deleteMedicine } from '../../user/store/productSlice';
import { FiPackage, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function MedicinesPage() {
  const dispatch = useDispatch();
  const { medicineCategories } = useSelector(state => state.products);
  const { locationFilter, isFiltered } = useAdminLocation();
  const [medicinesList, setMedicinesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/medicines', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setMedicinesList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const handleDelete = (id) => {
    dispatch(deleteMedicine(id));
    setMedicinesList(prev => prev.filter(m => m.id !== id && m._id !== id));
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
      onClick={() => handleDelete(row._id || row.id)}
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
          <div className="admin-page-title">Medicines Directory</div>
          <p className="admin-page-subtitle mt-2">
            Browse and manage all registered pharmaceutical formulations, stocks, and pricing details.
          </p>
        </div>
      </div>

      {/* Location Filter Bar */}
      <LocationFilter />
      <LocationBanner />

      {/* Main Listing View */}
      <div className="flex-1">
        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && medicinesList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && medicinesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">💊</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Medicines Yet</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no medicines registered in the system yet.</p>
          </div>
        ) : (
          <ReusableTable 
            columns={columns}
            data={medicinesList}
            searchPlaceholder="Search medicines by name or composition..."
            searchKey="name"
            filterOptions={{ key: 'category', label: 'Therapy Class', options: medicineCategories }}
            actions={tableActions}
            fileName="emediclub-medicines-listings"
          />
        )}
      </div>

    </div>
  );
}
