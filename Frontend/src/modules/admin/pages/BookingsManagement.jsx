import { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAdminLocation } from '../context/AdminLocationContext';
import { FiSearch } from 'react-icons/fi';
import LocationFilter from '../components/LocationFilter';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import apiClient from '../../../shared/services/apiClient';
import { buildApiUrl } from '../utils/adminQueryHelper';

export default function BookingsManagement({ defaultTab }) {
  const [appointments, setAppointments] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [search, setSearch] = useState('');
  const { locationFilter, isFiltered } = useAdminLocation();
  const [searchParams] = useSearchParams();

  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';
  const timeframe = searchParams.get('timeframe') || 'month';

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('lab-bookings')) return 'Lab Tests';
    if (location.pathname.includes('appointments')) return 'Doctors';
    return 'Doctors';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [defaultTab, location.pathname]);

  useEffect(() => {
    const fetchBookingsData = async () => {
      setLoading(true);
      try {
        const apptsUrl = buildApiUrl('/api/admin/orders/appointments', locationFilter, timeframe);
        const labsUrl = buildApiUrl('/api/admin/orders/lab-bookings', locationFilter, timeframe);
        const [apptsRes, labsRes] = await Promise.all([
          apiClient.get(apptsUrl),
          apiClient.get(labsUrl)
        ]);
        setAppointments(apptsRes.data.data || []);
        setLabBookings(labsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingsData();
  }, [locationFilter.search, locationFilter.state, locationFilter.city, locationFilter.pincode, timeframe]);

  const filteredDoctors = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.doctorName?.toLowerCase().includes(search.toLowerCase()) || 
        apt.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        apt.specialty?.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      return true;
    });
  }, [appointments, search]);

  const filteredLabs = useMemo(() => {
    return labBookings.filter(lab => {
      const matchesSearch = lab.packageName?.toLowerCase().includes(search.toLowerCase()) || 
        lab.address?.toLowerCase().includes(search.toLowerCase()) || 
        lab.id?.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      return true;
    });
  }, [labBookings, search]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-12 bg-[#F5F7FA]">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <div>
          <div className="admin-page-title">Bookings Management</div>
          <p className="admin-page-subtitle mt-2">
            Supervise clinical appointments and diagnostics packages scheduled on E Mediclub.
          </p>
        </div>
        <span className="text-[9.5px] text-teal bg-teal-light/20 px-2.5 py-1 rounded font-black tracking-wider uppercase">
          {appointments.length + labBookings.length} Active Bookings
        </span>
      </div>

      {/* Location Filter */}
      <LocationFilter />
      <LocationBanner />

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex gap-2 border-b border-transparent">
          {['Doctors', 'Lab Tests'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(''); }}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 ${
                activeTab === tab 
                  ? 'bg-[#0D6E56] text-white shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
              }`}
            >
              {tab === 'Doctors' ? '👨‍⚕️ Clinicians' : '🧪 Diagnostics'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-3 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'Doctors' ? 'doctor or patient' : 'test package'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 focus:border-teal rounded-xl text-xs font-semibold outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* List viewport */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        {loading ? (
          <div className="admin-skeleton-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-skeleton-card" />
            ))}
          </div>
        ) : activeTab === 'Doctors' ? (
          isFiltered && filteredDoctors.length === 0 ? (
            <LocationEmptyState 
              locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ') || 'Selected Location'}
              hasVendors={true}
              hasOrders={false}
            />
          ) : !isFiltered && filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[200px]">
              <span className="text-3xl mb-3">📅</span>
              <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Appointments Yet</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no doctor appointments scheduled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Clinician</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-slate-650 divide-y divide-slate-50/50">
                  {filteredDoctors.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-slate-800">{apt.id}</td>
                      <td className="py-3 px-4 text-slate-850 font-extrabold">{apt.doctorName}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[#0D6E56]/5 text-[#0D6E56] border border-[#0D6E56]/10 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                          {apt.specialty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{apt.patientName}</td>
                      <td className="py-3 px-4 font-black text-slate-800">{apt.date} • {apt.timeSlot}</td>
                      <td className="py-3 px-4 text-slate-450">{apt.type}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          isFiltered && filteredLabs.length === 0 ? (
            <LocationEmptyState 
              locationName={[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' → ') || 'Selected Location'}
              hasVendors={true}
              hasOrders={false}
            />
          ) : !isFiltered && filteredLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-premium min-h-[200px]">
              <span className="text-3xl mb-3">🔬</span>
              <div className="text-xs font-black uppercase text-slate-800 tracking-wider">No Lab Bookings Yet</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">There are no lab bookings scheduled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Test Package</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Schedule Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-slate-650 divide-y divide-slate-50/50">
                  {filteredLabs.map(lab => (
                    <tr key={lab.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-slate-800">{lab.id}</td>
                      <td className="py-3 px-4 text-slate-850 font-extrabold">{lab.packageName}</td>
                      <td className="py-3 px-4 text-slate-500">{lab.address}</td>
                      <td className="py-3 px-4 font-black text-slate-800">{lab.date} • {lab.timeSlot}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                          {lab.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

    </div>
  );
}
