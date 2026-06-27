import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ReusableTable from '../components/ReusableTable';
import { toggleUserStatus } from '../store/adminSlice';
import { FiSlash, FiCheck, FiEye, FiActivity, FiShoppingBag } from 'react-icons/fi';
import AdminFilterBar from '../components/AdminFilterBar';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import StatusBadge from '../components/StatusBadge';
import DetailsModal from '../components/DetailsModal';
import apiClient from '../../../shared/services/apiClient';
import { useAdminLocation } from '../context/AdminLocationContext';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function UsersManagement() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { locationFilter, isFiltered } = useAdminLocation();
  const [searchParams] = useSearchParams();
  const [selectedUser, setSelectedUser] = useState(null);

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
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  // Action column triggers
  const tableActions = (row) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => setSelectedUser(row)}
        className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-[#1A7A4A] hover:bg-[#1A7A4A]/10 transition-colors cursor-pointer border-0"
        title="View Details"
      >
        <FiEye className="text-lg" />
      </button>
      <button 
        onClick={() => handleToggleBlock(row.id)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer tap-scale shadow-sm border-0
          ${row.status === 'active' 
            ? 'bg-rose-50 hover:bg-rose-100 text-rose-500' 
            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
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
    </div>
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
      <AdminFilterBar searchPlaceholder="Search by patient name, email..." />
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
      ) : (
        <ReusableTable 
          columns={columns}
          data={filteredUsers}
          loading={loading}
          hideSearch={true} // AdminFilterBar is used instead
          emptyStateComponent={
            <div className="flex flex-col items-center justify-center p-12 bg-white text-center min-h-[300px]">
              <span className="text-3xl mb-3">👤</span>
              <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Customers Yet</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no customers registered in the system yet.</p>
            </div>
          }
          filterOptions={{ key: 'status', label: 'Status', options: ['active', 'blocked'] }}
          actions={tableActions}
          fileName="emediclub-customer-base"
        />
      )}

      {/* User Details Modal */}
      <DetailsModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        title="Patient Profile & History"
      >
        {selectedUser && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1A7A4A]/10 text-[#1A7A4A] flex items-center justify-center font-black text-2xl shrink-0">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">{selectedUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-500">{selectedUser.email}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm font-bold text-slate-500">{selectedUser.phone}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <StatusBadge status={selectedUser.status} />
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {selectedUser.totalOrders || 0} Orders
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FiMapPin /> Location
                </div>
                <div className="text-sm font-bold text-slate-700">{selectedUser.city || 'Not Provided'}</div>
                <div className="text-sm text-slate-500">{selectedUser.pincode || 'N/A'}</div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FiActivity /> Health Profile
                </div>
                <div className="text-sm font-bold text-slate-700">Premium Member: No</div>
                <div className="text-sm text-slate-500">Joined: {selectedUser.joinedDate || new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <FiShoppingBag /> Recent Orders Summary
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden p-8 text-center flex flex-col items-center">
                <FiShoppingBag className="text-3xl text-slate-300 mb-2" />
                <div className="text-sm font-bold text-slate-600">Total Spent: ₹{(selectedUser.spent || 0).toLocaleString()}</div>
                <div className="text-xs font-semibold text-slate-400 mt-1">Detailed order history is synced in the Orders module.</div>
              </div>
            </div>
          </div>
        )}
      </DetailsModal>

    </div>
  );
}
