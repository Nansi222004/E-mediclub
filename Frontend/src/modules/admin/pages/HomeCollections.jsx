import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiTruck, FiSearch, FiFilter, FiCheckCircle } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { useAdminLocation } from '../context/AdminLocationContext';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function HomeCollections() {
  const { locationFilter, isFiltered } = useAdminLocation();
  const [collectionsList, setCollectionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('All'); // Today / This Week / All
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState('');
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const url = buildApiUrl('/api/admin/home-collections', locationFilter, timeframe);
        const res = await apiClient.get(url);
        setCollectionsList(res.data.data || []);
      } catch (err) {
        console.error('Error fetching home collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const updateStatus = async (id, newStatus) => {
    try {
      // Mock status update call or update local list directly
      setCollectionsList(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      setToast(`Status updated to ${newStatus} for collection ${id}`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredCollections = useMemo(() => {
    return collectionsList.filter(c => {
      const matchesSearch = c.patient.toLowerCase().includes(search.toLowerCase()) || 
                            c.test.toLowerCase().includes(search.toLowerCase()) ||
                            c.tech.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      
      const matchesDate = filterDate === 'All' ? true : 
                          filterDate === 'Today' ? c.date === 'Today' : true;
      if (!matchesDate) return false;
      
      const matchesStatus = filterStatus === 'All' ? true : c.status === filterStatus;
      if (!matchesStatus) return false;

      return true;
    });
  }, [collectionsList, search, filterDate, filterStatus]);

  const statuses = ['Scheduled', 'Out for Collection', 'Sample Collected', 'Report Ready', 'Cancelled'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 pr-1 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <div className="admin-page-title">Home Collections</div>
          <div className="admin-page-subtitle mt-2">
            Track diagnostics home sample pick-ups, dispatch diagnostics technicians, and verify report status.
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[99] bg-[#0F3D2B] text-white px-4 py-3 rounded-2xl shadow-premium text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
          <FiCheckCircle className="text-[#F5A623] text-sm shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Location Filter */}
      <LocationFilter />
      <LocationBanner />

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-premium">
        
        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
            <FiFilter className="text-slate-400 text-xs" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black text-slate-655 uppercase tracking-wide cursor-pointer"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
            <FiFilter className="text-slate-400 text-xs" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black text-slate-655 uppercase tracking-wide cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-450 text-xs" />
          <input
            type="text"
            placeholder="Search patient, test, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 focus:border-teal rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-premium">
        <div className="admin-section-heading-wrapper">
          <FiTruck className="text-[#1A7A4A]" />
          <span>Active Diagnostics Collection Dispatch</span>
        </div>

        {loading ? (
          <div className="admin-skeleton-grid mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : isFiltered && collectionsList.length === 0 ? (
          <LocationEmptyState 
            locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ')}
            hasVendors={false}
            hasOrders={false}
          />
        ) : !isFiltered && collectionsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[300px]">
            <span className="text-3xl mb-3">🩺</span>
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Home Collections Scheduled</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no diagnostics home sample collection dispatches registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar mt-4">
            <table className="w-full text-left border-collapse admin-table">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="py-3 px-4">Collection ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Address / Pincode</th>
                  <th className="py-3 px-4">Test Booked</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Assigned Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCollections.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 admin-table-name font-black">{col.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{col.patient}</td>
                    <td className="py-3 px-4">
                      <span className="block font-medium text-slate-655 truncate max-w-xs">{col.address}</span>
                      <span className="block text-[10px] text-slate-400 font-extrabold tracking-wider">{col.pincode} • {col.city}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-teal">{col.test}</td>
                    <td className="py-3 px-4 text-slate-700 font-bold">{col.slot}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-855">{col.tech}</td>
                    <td className="py-3 px-4">
                      <span className={`admin-badge uppercase tracking-wider text-[9px] font-black ${
                        col.status === 'Report Ready' ? 'bg-emerald-50 text-emerald-600' :
                        col.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                        col.status === 'Out for Collection' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {col.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                         value={col.status}
                         onChange={(e) => updateStatus(col.id, e.target.value)}
                         className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none text-slate-700 focus:border-[#1A7A4A] cursor-pointer"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
