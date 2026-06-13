import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ReusableTable from '../components/ReusableTable';
import { toggleUserStatus } from '../store/adminSlice';
import { FiUserCheck, FiSlash, FiCheck, FiUsers } from 'react-icons/fi';
import LocationFilter, { CITY_MAPPINGS } from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import apiClient from '../../../shared/services/apiClient';
import { useAdminLocation } from '../context/AdminLocationContext';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function UsersManagement() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { locationFilter, isFiltered } = useAdminLocation();
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || '';

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/patients', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setUsers(res.data.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const handleToggleBlock = (id) => {
    dispatch(toggleUserStatus(id));
    setUsers(prev => prev.map(u => u.id === id || u._id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  const filteredUsers = users;

  // Define table column mappings
  const columns = [
    { 
      key: 'name', 
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-extrabold text-slate-800 block">{row.name}</span>
            <span className="text-[9px] text-slate-400 font-semibold block uppercase">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'phone', header: 'Contact Mobile' },
    {
      key: 'city',
      header: 'City',
      render: (row) => <span>{row.city || 'Mumbai'}</span>
    },
    {
      key: 'pincode',
      header: 'Pincode',
      render: (row) => <span className="font-extrabold text-slate-500">{row.pincode || '400001'}</span>
    },
    { 
      key: 'joinedDate', 
      header: 'Joined Date',
      render: (row) => <span className="font-bold text-slate-500">{row.joinedDate || (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '2026-05-26')}</span>
    },
    { 
      key: 'totalOrders', 
      header: 'Orders',
      render: (row) => <span className="font-extrabold text-slate-700">{row.totalOrders || 0} bookings</span>
    },
    { 
      key: 'spent', 
      header: 'Total Spent',
      render: (row) => <span className="font-black text-slate-800">₹{(row.spent || 0).toLocaleString()}</span>
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => {
        if (row.status === 'active') {
          return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Active</span>;
        }
        return <span className="bg-coral-light text-coral px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Blocked</span>;
      }
    }
  ];

  // Action column triggers
  const tableActions = (row) => (
    <button 
      onClick={() => handleToggleBlock(row.id)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale shadow-sm
        ${row.status === 'active' 
          ? 'bg-coral-light/40 hover:bg-coral-light text-coral' 
          : 'bg-teal-light hover:bg-teal-light/80 text-teal'
        }
      `}
    >
      {row.status === 'active' ? (
        <>
          <FiSlash className="shrink-0" /> Block
        </>
      ) : (
        <>
          <FiCheck className="shrink-0" /> Unblock
        </>
      )}
    </button>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="admin-page-title">Customer Core Registry</div>
          <p className="admin-page-subtitle mt-2">
            Review active clients registries, spent history totals, and toggle platform access controls.
          </p>
        </div>
      </div>

      {/* Location Filter */}
      <LocationFilter />
      <LocationBanner />

      {/* Main Table Grid or Empty State */}
      {loading ? (
        <div className="admin-skeleton-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="admin-skeleton-card" />
          ))}
        </div>
      ) : isFiltered && filteredUsers.length === 0 ? (
        <LocationEmptyState 
          locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ') || 'Selected Location'}
          hasVendors={true}
          hasOrders={false}
        />
      ) : !isFiltered && filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
          <span className="text-3xl mb-3">👤</span>
          <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Customers Yet</div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no customers registered in the system yet.</p>
        </div>
      ) : (
        <ReusableTable 
          columns={columns}
          data={filteredUsers}
          searchPlaceholder="Search customer by name or email..."
          searchKey="name"
          filterOptions={{ key: 'status', label: 'Status', options: ['active', 'blocked'] }}
          actions={tableActions}
          fileName="emediclub-customer-base"
        />
      )}

    </div>
  );
}
