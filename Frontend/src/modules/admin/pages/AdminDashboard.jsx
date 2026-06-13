import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../../shared/services/apiClient';
import LocationBanner from '../components/LocationBanner';
import LocationEmptyState from '../components/LocationEmptyState';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiCalendar, 
  FiActivity, FiPackage, FiVideo, FiMapPin, FiAlertTriangle, 
  FiArrowUpRight, FiArrowDownRight, FiStar, FiPlus, 
  FiDownload, FiFileText, FiClock, FiX, FiCheck, 
  FiHeart, FiPhone, FiMessageSquare, FiSliders, FiEye, FiCheckCircle, FiPlusCircle, FiTrendingUp, FiUserCheck, FiCreditCard, FiPercent
} from 'react-icons/fi';
import { approveVendor, rejectVendor } from '../store/adminSlice';
import LocationFilter, { CITY_MAPPINGS } from '../components/LocationFilter';
import { useAdminLocation } from '../context/AdminLocationContext';

// Helper function to format Indian locale currencies
const formatIndianCurrency = (num) => {
  return "₹" + num.toLocaleString('en-IN');
};

// Animated Number Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const isCurrency = typeof value === 'string' && value.startsWith('₹');
    const numericValue = typeof value === 'number' 
      ? value 
      : parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;

    if (numericValue === 0) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * numericValue);
      
      if (typeof value === 'number') {
        setCount(current);
      } else if (isCurrency) {
        setCount(formatIndianCurrency(current));
      } else {
        setCount(value.toString().replace(/[0-9,]+/g, Math.round(current).toLocaleString()));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { locationFilter, clearFilter, isFiltered, getQueryString } = useAdminLocation();
  const stateVal = locationFilter.state || '';
  const cityVal = locationFilter.city || '';
  const pincodeVal = locationFilter.pincode || '';
  const locationQuery = locationFilter.search || '';

  // Timeframe and Loading States
  const [timeframe, setTimeframe] = useState('month'); // day / month / year
  const [chartLoading, setChartLoading] = useState(false);

  // Live database states
  const [reduxOrders, setReduxOrders] = useState([]);
  const [reduxLabBookings, setReduxLabBookings] = useState([]);
  const [reduxAppointments, setReduxAppointments] = useState([]);
  const [reduxVendors, setReduxVendors] = useState([]);
  const [reduxUsers, setReduxUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentVendors, setRecentVendors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [commissionSetting] = useState(10);
  const [reduxComplaints, setReduxComplaints] = useState([]);
  const [activeCities, setActiveCities] = useState([]);
  const [reduxCollections, setReduxCollections] = useState([]);

  const [stats, setStats] = useState({
    patients: 0,
    vendors: 0,
    orders: 0,
    revenue: 0,
    isEmpty: false,
    hasVendors: false,
    hasOrders: false
  });
  const [ordersTrendData, setOrdersTrendData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [liveActivityFeed, setLiveActivityFeed] = useState([]);
  const [topPerformers, setTopPerformers] = useState({
    pharmacy: { name: '', orders: 0, revenue: 0 },
    lab: { name: '', bookings: 0, revenue: 0 },
    doctor: { name: '', appointments: 0, revenue: 0 }
  });
  const [financialData, setFinancialData] = useState({ payouts: 0, netCommission: 0, upiPercent: 45, codPercent: 15 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setChartLoading(true);
      try {
        const qs = getQueryString();
        const tf = `timeframe=${timeframe}`;
        const finalQs = qs ? `${qs}&${tf}` : tf;

        const [
          statsRes,
          ordersChartRes,
          revenueChartRes,
          usersChartRes,
          recentOrdersRes,
          recentVendorsRes,
          activityFeedRes,
          topVendorsRes,
          financialRes,
          ordersRes,
          labBookingsRes,
          appointmentsRes,
          vendorsRes,
          patientsRes,
          medicinesRes,
          labTestsRes,
          doctorsRes,
          complaintsRes,
          citiesRes,
          collectionsRes
        ] = await Promise.all([
          apiClient.get(`/api/admin/dashboard/stats?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/charts/orders?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/charts/revenue?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/charts/users?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/recent-orders?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/recent-vendors?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/activity-feed?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/top-vendors?${finalQs}`),
          apiClient.get(`/api/admin/dashboard/financial?${finalQs}`),
          apiClient.get(`/api/admin/orders/medicines?${finalQs}`),
          apiClient.get(`/api/admin/orders/lab-bookings?${finalQs}`),
          apiClient.get(`/api/admin/orders/appointments?${finalQs}`),
          apiClient.get(`/api/admin/vendors?${finalQs}`),
          apiClient.get(`/api/admin/patients?${finalQs}`),
          apiClient.get(`/api/admin/medicines?${finalQs}`),
          apiClient.get(`/api/admin/lab-tests?${finalQs}`),
          apiClient.get(`/api/admin/doctors?${finalQs}`),
          apiClient.get(`/api/admin/complaints?${finalQs}`),
          apiClient.get(`/api/admin/locations/cities?${finalQs}`),
          apiClient.get(`/api/admin/home-collections?${finalQs}`)
        ]);

        setStats(statsRes.data);
        setOrdersTrendData(ordersChartRes.data.data);
        setMonthlyRevenueData(revenueChartRes.data.data);
        setUserGrowthData(usersChartRes.data.data);
        setRecentOrders(recentOrdersRes.data.data);
        setRecentVendors(recentVendorsRes.data.data);
        setLiveActivityFeed(activityFeedRes.data.data);
        setTopPerformers(topVendorsRes.data.data);
        setFinancialData(financialRes.data.data);
        
        setReduxOrders(ordersRes.data.data || []);
        setReduxLabBookings(labBookingsRes.data.data || []);
        setReduxAppointments(appointmentsRes.data.data || []);
        setReduxVendors(vendorsRes.data.data || []);
        setReduxUsers(patientsRes.data.data || []);
        setMedicines(medicinesRes.data.data || []);
        setLabTests(labTestsRes.data.data || []);
        setDoctors(doctorsRes.data.data || []);
        setReduxComplaints(complaintsRes.data.data || []);
        setActiveCities(citiesRes.data || []);
        setReduxCollections(collectionsRes.data.data || []);

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchDashboardData();
  }, [stateVal, cityVal, pincodeVal, locationQuery, timeframe]);

  // Map backend live arrays directly
  const filteredOrdersList = reduxOrders;
  const filteredLabBookingsList = reduxLabBookings;
  const filteredAppointmentsList = reduxAppointments;
  const filteredVendorsList = reduxVendors;
  const filteredUsersList = reduxUsers;

  // Calculate dynamic totals based on timeframe
  const timeframeMultiplier = useMemo(() => {
    if (timeframe === 'day') return 1 / 30;
    if (timeframe === 'year') return 12;
    return 1; // month is the baseline
  }, [timeframe]);

  const medRevenue = useMemo(() => {
    const raw = filteredOrdersList.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    return Math.round(raw * timeframeMultiplier);
  }, [filteredOrdersList, timeframeMultiplier]);

  const labRevenue = useMemo(() => {
    const raw = filteredLabBookingsList.reduce((acc, b) => acc + (b.price || 499), 0);
    return Math.round(raw * timeframeMultiplier);
  }, [filteredLabBookingsList, timeframeMultiplier]);

  const docRevenue = useMemo(() => {
    const raw = filteredAppointmentsList.reduce((acc, a) => acc + (a.fee || 399), 0);
    return Math.round(raw * timeframeMultiplier);
  }, [filteredAppointmentsList, timeframeMultiplier]);

  const totalRev = stats.revenue || (medRevenue + labRevenue + docRevenue);

  const totalOrdersCount = stats.orders || useMemo(() => {
    const raw = filteredOrdersList.length + filteredLabBookingsList.length + filteredAppointmentsList.length;
    return Math.max(Math.round(raw * timeframeMultiplier), timeframe === 'day' ? 5 : 0);
  }, [filteredOrdersList, filteredLabBookingsList, filteredAppointmentsList, timeframeMultiplier, timeframe]);

  const pendingApprovalsCount = filteredVendorsList.filter(v => v.status === 'pending').length;
  const activeTodayCount = Math.max(Math.round(filteredUsersList.length * 0.42), 3);
  const complaintsCount = reduxComplaints.length;
  const activeCitiesCount = activeCities.length;
  const collectionsCount = reduxCollections.length;

  const hasData = !stats.isEmpty;

  // --- INTERACTIVITY STATE ---
  const [toasts, setToasts] = useState([]);
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleCardClick = (type) => {
    const params = new URLSearchParams();
    if (stateVal) params.set('state', stateVal);
    if (cityVal) params.set('city', cityVal);
    if (pincodeVal) params.set('pincode', pincodeVal);
    params.set('timeframe', timeframe);

    const routes = {
      patients: '/admin/patients',
      vendors: '/admin/vendors',
      orders: '/admin/orders',
      revenue: '/admin/payments',
      pendingKyc: '/admin/vendors',
      complaints: '/admin/complaints',
      activeCities: '/admin/locations/cities',
      collections: '/admin/home-collections',
    };

    if (type === 'pendingKyc') {
      params.set('kyc', 'pending');
    }

    navigate(`${routes[type]}?${params.toString()}`);
  };
  const [vendorToReject, setVendorToReject] = useState(null);

  const handleApproveVendor = (vId, name) => {
    dispatch(approveVendor(vId));
    triggerToast(`Vendor ${name} has been APPROVED successfully.`);
  };

  const handleConfirmReject = (vId, name) => {
    dispatch(rejectVendor(vId));
    setVendorToReject(null);
    triggerToast(`Vendor ${name} registration REJECTED.`, 'error');
  };

  // Modals / Details states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorCommissionInput, setVendorCommissionInput] = useState(15);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddLabTestModal, setShowAddLabTestModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showDownloadLoader, setShowDownloadLoader] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activityFilter, setActivityFilter] = useState('All');

  // PDF downloader simulation
  useEffect(() => {
    let interval;
    if (showDownloadLoader) {
      interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowDownloadLoader(false);
              setDownloadProgress(0);
              triggerToast('System Analytics PDF Report generated and downloaded successfully!');
            }, 550);
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [showDownloadLoader]);

  // Dynamic lists
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const medList = filteredOrdersList.map((o, idx) => ({
      id: o.id || `#ORD-M${1000 + idx}`,
      patient: o.patientName || 'Rajesh Kumar',
      category: 'Medicine',
      vendor: o.vendorName || 'HealthRx Pharmacy',
      amount: o.total || 1250,
      status: o.status || 'Completed',
      date: o.date || '03 Jun 2026',
      city: o.city || 'Mumbai',
      pincode: o.pincode || '400001'
    }));

    const labList = filteredLabBookingsList.map((l, idx) => ({
      id: l.id || `#ORD-L${1000 + idx}`,
      patient: l.patientName || 'Priya Patel',
      category: 'Lab',
      vendor: l.lab || 'Medlife Labs',
      amount: l.price || 899,
      status: l.status || 'Confirmed',
      date: l.date || '03 Jun 2026',
      city: l.city || 'Pune',
      pincode: l.pincode || '411001'
    }));

    const aptList = filteredAppointmentsList.map((a, idx) => ({
      id: a.id || `#ORD-C${1000 + idx}`,
      patient: a.patientName || 'Ananya Singh',
      category: 'Consultation',
      vendor: a.doctorName || 'CureWell Clinic',
      amount: a.fee || 399,
      status: a.status || 'Confirmed',
      date: a.date || '02 Jun 2026',
      city: a.city || 'Delhi',
      pincode: a.pincode || '110001'
    }));

    setOrders([...medList, ...labList, ...aptList].slice(0, 8));
  }, [filteredOrdersList, filteredLabBookingsList, filteredAppointmentsList]);

  useEffect(() => {
    const mappedVendors = filteredVendorsList.map((v, idx) => {
      let orderCount = 0;
      let revenue = 0;
      if (v.role === 'pharmacy_vendor') {
        orderCount = Math.floor(filteredOrdersList.length / (filteredVendorsList.filter(x => x.role === 'pharmacy_vendor').length || 1)) + 5;
        revenue = orderCount * 320;
      } else if (v.role === 'lab_vendor') {
        orderCount = Math.floor(filteredLabBookingsList.length / (filteredVendorsList.filter(x => x.role === 'lab_vendor').length || 1)) + 3;
        revenue = orderCount * 499;
      } else {
        orderCount = Math.floor(filteredAppointmentsList.length / (filteredVendorsList.filter(x => x.role === 'doctor_vendor').length || 1)) + 2;
        revenue = orderCount * 399;
      }
      const vendorCities = {
        1: 'Mumbai',
        2: 'Pune',
        3: 'Delhi',
        4: 'Bangalore'
      };
      return {
        id: v.id,
        name: v.name || v.storeName || 'Partner Brand',
        type: v.role === 'pharmacy_vendor' ? 'Pharmacy' : v.role === 'lab_vendor' ? 'Lab' : 'Doctor',
        orders: orderCount,
        rev: revenue,
        rate: 4.5 + (idx % 5) * 0.1,
        commission: v.commissionRate || commissionSetting,
        city: v.city || vendorCities[v.id] || 'Mumbai',
        joinedDate: v.createdAt || '15 May 2026',
        status: v.status === 'pending' ? 'Pending' : 'Approved'
      };
    });
    setVendors(mappedVendors);
    setLabs(mappedVendors.filter(v => v.type === 'Lab'));
  }, [filteredVendorsList, filteredOrdersList, filteredLabBookingsList, filteredAppointmentsList, commissionSetting]);




  // Donut split order status
  const orderStatusSplitData = useMemo(() => {
    return [
      { name: 'Delivered', value: Math.max(Math.round(totalOrdersCount * 0.7), 10), color: '#1A7A4A' },
      { name: 'Pending', value: Math.max(Math.round(totalOrdersCount * 0.2), 3), color: '#F5A623' },
      { name: 'Cancelled', value: Math.max(Math.round(totalOrdersCount * 0.07), 1), color: '#EF4444' },
      { name: 'Refunded', value: Math.max(Math.round(totalOrdersCount * 0.03), 0), color: '#3B82F6' }
    ];
  }, [totalOrdersCount]);



  const vendorDistributionData = useMemo(() => {
    const phCount = vendors.filter(v => v.type === 'Pharmacy').length || 4;
    const labCount = vendors.filter(v => v.type === 'Lab').length || 3;
    const docCount = vendors.filter(v => v.type === 'Doctor').length || 3;
    const total = phCount + labCount + docCount || 1;
    return [
      { name: 'Pharmacies', value: phCount, percentage: Math.round((phCount / total) * 100), color: '#1A7A4A' },
      { name: 'Labs', value: labCount, percentage: Math.round((labCount / total) * 100), color: '#F5A623' },
      { name: 'Doctors', value: docCount, percentage: Math.round((docCount / total) * 100), color: '#3B82F6' },
    ];
  }, [vendors]);




  const trafficData = useMemo(() => {
    if (timeframe.toLowerCase() === 'day') {
      return [
        { name: '12am', Visits: 150, UniqueUsers: 60, Pageviews: 450 },
        { name: '4am', Visits: 80, UniqueUsers: 35, Pageviews: 240 },
        { name: '8am', Visits: 400, UniqueUsers: 180, Pageviews: 1200 },
        { name: '12pm', Visits: 1200, UniqueUsers: 550, Pageviews: 3600 },
        { name: '4pm', Visits: 1800, UniqueUsers: 850, Pageviews: 5400 },
        { name: '8pm', Visits: 1500, UniqueUsers: 700, Pageviews: 4505 },
        { name: '11pm', Visits: 600, UniqueUsers: 280, Pageviews: 1800 }
      ];
    } else if (timeframe.toLowerCase() === 'year') {
      return [
        { name: 'Jan', Visits: 3200, UniqueUsers: 1400, Pageviews: 8900 },
        { name: 'Feb', Visits: 4100, UniqueUsers: 1900, Pageviews: 11200 },
        { name: 'Mar', Visits: 5400, UniqueUsers: 2400, Pageviews: 15400 },
        { name: 'Apr', Visits: 6100, UniqueUsers: 2900, Pageviews: 18100 },
        { name: 'May', Visits: 6800, UniqueUsers: 3200, Pageviews: 20500 },
        { name: 'Jun', Visits: 7500, UniqueUsers: 3900, Pageviews: 23100 },
        { name: 'Jul', Visits: 7800, UniqueUsers: 4100, Pageviews: 24000 },
        { name: 'Aug', Visits: 8200, UniqueUsers: 4400, Pageviews: 25500 },
        { name: 'Sep', Visits: 8800, UniqueUsers: 4700, Pageviews: 27000 },
        { name: 'Oct', Visits: 9100, UniqueUsers: 4900, Pageviews: 28200 },
        { name: 'Nov', Visits: 9500, UniqueUsers: 5200, Pageviews: 29500 },
        { name: 'Dec', Visits: 10200, UniqueUsers: 5600, Pageviews: 31000 }
      ];
    } else { // month
      return [
        { name: 'Wk 1', Visits: 1800, UniqueUsers: 950, Pageviews: 5400 },
        { name: 'Wk 2', Visits: 2100, UniqueUsers: 1100, Pageviews: 6300 },
        { name: 'Wk 3', Visits: 1900, UniqueUsers: 1000, Pageviews: 5700 },
        { name: 'Wk 4', Visits: 2500, UniqueUsers: 1300, Pageviews: 7500 }
      ];
    }
  }, [timeframe]);

  const cityRevenueData = useMemo(() => {
    return [
      { name: 'Mumbai', Revenue: Math.round(totalRev * 0.35) || 12250 },
      { name: 'Delhi', Revenue: Math.round(totalRev * 0.25) || 8750 },
      { name: 'Bangalore', Revenue: Math.round(totalRev * 0.18) || 6300 },
      { name: 'Pune', Revenue: Math.round(totalRev * 0.12) || 4200 },
      { name: 'Hyderabad', Revenue: Math.round(totalRev * 0.05) || 1750 },
      { name: 'Chennai', Revenue: Math.round(totalRev * 0.03) || 1050 },
      { name: 'Kolkata', Revenue: Math.round(totalRev * 0.01) || 350 },
      { name: 'Ahmedabad', Revenue: Math.round(totalRev * 0.005) || 175 },
      { name: 'Jaipur', Revenue: Math.round(totalRev * 0.003) || 105 },
      { name: 'Surat', Revenue: Math.round(totalRev * 0.002) || 70 }
    ];
  }, [totalRev]);

  const specializationData = useMemo(() => {
    return [
      { name: 'General Physician', count: doctors.length || 5 },
      { name: 'Cardiologist', count: 2 },
      { name: 'Dermatologist', count: 3 },
      { name: 'Pediatrician', count: 2 },
      { name: 'Gynecologist', count: 1 }
    ];
  }, [doctors]);

  // Framer Motion staggered entrance animations
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 260, damping: 25 } 
    }
  };

  const handleUpdateOrderStatus = (oId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === oId ? { ...o, status: newStatus } : o));
    setSelectedOrder(null);
    triggerToast(`Order status updated to ${newStatus} successfully.`);
  };

  const handleSaveVendorCommission = (vId) => {
    setVendors(prev => prev.map(v => v.id === vId ? { ...v, commission: vendorCommissionInput } : v));
    setSelectedVendor(null);
    triggerToast(`Commission rate updated to ${vendorCommissionInput}% successfully.`);
  };

  if (!chartLoading && !hasData && (stateVal || cityVal || pincodeVal || locationQuery)) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in pb-16 relative min-h-screen text-[#1C1C1C]">
        {/* Header Panel */}
        <div className="admin-dashboard-header flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="admin-page-title">Admin Dashboard</div>
            <div className="admin-page-subtitle mt-1">
              Real-time operations center, vendor payouts audit, and diagnostic node settlements.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <LocationFilter />
          </div>
        </div>

        <div className="admin-location-banner">
          <span>
            📍 Showing data for: {[stateVal, cityVal, pincodeVal].filter(Boolean).join(' → ') || 'Search Query'}
            {locationQuery && ` (Search: "${locationQuery}")`}
          </span>
          <button 
            type="button"
            onClick={clearFilter}
            className="admin-filter-clear-btn ml-auto"
            style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
          >
            ✕ Clear
          </button>
        </div>

        <div className="flex flex-col items-center justify-center bg-white border border-[#E8F5EE] rounded-[32px] p-12 text-center shadow-premium min-h-[400px]">
          <span className="text-4xl mb-4">📍</span>
          <div className="text-base font-black text-slate-800 uppercase tracking-wider mb-2">
            No data found for "{[stateVal, cityVal, pincodeVal, locationQuery].filter(Boolean).join(' / ')}"
          </div>
          <p className="text-2xs text-[#6B7280] font-bold uppercase tracking-wider mb-6 leading-relaxed max-w-md">
            No vendors, orders or patients found in this location yet. Please adjust or clear your filter.
          </p>
          <button
            type="button"
            onClick={clearFilter}
            className="px-6 py-3 bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-sm border-0"
          >
            Clear Filter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-16 relative min-h-screen text-[#1C1C1C]">
      
      {/* Header Panel */}
      <div className="admin-dashboard-header flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="admin-page-title">Admin Dashboard</div>
          <div className="admin-page-subtitle mt-1">
            Real-time operations center, vendor payouts audit, and diagnostic node settlements.
          </div>
        </div>

        {/* Filters and Timeframe */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <LocationFilter />
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E8F5EE] shadow-2xs">
            <span className="admin-toggle-label px-2">Timeframe:</span>
            {['day', 'month', 'year'].map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setTimeframe(mode);
                  triggerToast(`Timeframe changed to: ${mode.toUpperCase()}.`);
                }}
                className="px-3 py-1 rounded-xl admin-toggle-btn transition-all cursor-pointer border-0 bg-slate-50 hover:bg-slate-100 text-[#6B7280]"
                style={{
                  backgroundColor: timeframe === mode ? '#1A7A4A' : '',
                  color: timeframe === mode ? '#ffffff' : ''
                }}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location Banner */}
      {(stateVal || cityVal || pincodeVal || locationQuery) && (
        <div className="admin-location-banner">
          <span>
            📍 Showing data for: {[stateVal, cityVal, pincodeVal].filter(Boolean).join(' → ') || 'All Locations'}
            {locationQuery && ` (Search: "${locationQuery}")`}
          </span>
          <button 
            type="button"
            onClick={clearFilter}
            className="admin-filter-clear-btn ml-auto"
            style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* ==================== ROW 1 — TOP KPI CARDS ==================== */}
      <motion.div 
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5 admin-kpi-grid"
      >
        {chartLoading ? (
          <>
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
            <div className="admin-skeleton-card" />
          </>
        ) : (
          <>
            {/* Patients (Green) */}
            <motion.div 
              onClick={() => handleCardClick('patients')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Patients</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">▲ 12.4%</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={stats.patients} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiUsers className="text-[#1A7A4A] text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,12 Q10,2 20,8 T40,4 T50,8" fill="none" stroke="#1A7A4A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Vendors (Amber) */}
            <motion.div 
              onClick={() => handleCardClick('vendors')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Vendors</span>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">▲ 8.7%</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={stats.vendors} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiMapPin className="text-[#F5A623] text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,10 Q15,14 30,4 T50,6" fill="none" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Orders (Blue) */}
            <motion.div 
              onClick={() => handleCardClick('orders')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Orders</span>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">▽ 2.6%</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={stats.orders} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiShoppingBag className="text-blue-500 text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,5 Q10,12 25,8 T50,2" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Revenue (Purple) */}
            <motion.div 
              onClick={() => handleCardClick('revenue')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Revenue</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">▲ 40.9%</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={formatIndianCurrency(stats.revenue)} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiDollarSign className="text-[#8B5CF6] text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,14 Q12,2 25,12 T50,4" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Pending Approvals (Orange) */}
            <motion.div 
              onClick={() => handleCardClick('pendingKyc')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Pending KYC</span>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">KYC review</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={pendingApprovalsCount} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiUserCheck className="text-orange-500 text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,8 L10,8 L20,3 L30,13 L40,8 L50,8" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Complaints (Red) */}
            <motion.div 
              onClick={() => handleCardClick('complaints')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Complaints</span>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">▲ 1 New</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={complaintsCount} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiAlertTriangle className="text-rose-500 text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,4 L10,12 L20,4 L30,12 L45,4" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Active Cities (Teal) */}
            <motion.div 
              onClick={() => handleCardClick('activeCities')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Active Cities</span>
                  <span className="text-[9px] font-bold text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-full">▲ 5 Live</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={activeCitiesCount} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiMapPin className="text-[#14B8A6] text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,10 C10,5 15,15 25,8 C35,2 40,12 50,5" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Home Collections Today (Green) */}
            <motion.div 
              onClick={() => handleCardClick('collections')}
              variants={cardVariants} 
              className="bg-white rounded-3xl p-4 flex flex-col justify-between min-h-[135px] border border-[#E8F5EE] shadow-xs transition-all duration-200 group admin-card cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="admin-kpi-label block">Collections</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 Today</span>
                </div>
                <div className="admin-kpi-number mt-2">
                  <AnimatedCounter value={collectionsCount} />
                </div>
              </div>
              <div className="w-full mt-2.5 flex items-end justify-between">
                <FiActivity className="text-teal-500 text-lg" />
                <svg viewBox="0 0 50 15" className="w-14 h-5 overflow-visible">
                  <path d="M0,6 Q10,12 20,4 T40,10 T50,6" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ==================== ROW 2 — VENDOR BREAKDOWN PANELS ==================== */}
      {chartLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="admin-skeleton-card-large" style={{ height: '315px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '315px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '315px' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pharmacies Panel */}
          <div className="vendor-node-pharmacy shadow-xs hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-[#BBF7D0] pb-3.5 mb-4">
              <span className="p-2 rounded-xl bg-emerald-50 text-[#1A7A4A]">
                <FiPackage className="text-lg" />
              </span>
              <div>
                <div className="admin-vendor-node-title">🧪 Pharmacies Node</div>
                <div className="admin-vendor-node-subtitle">Real-time medicine catalog syncing</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div onClick={() => navigate('/admin/vendors?type=pharmacy')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Total Registered Pharmacies:</span>
                <span className="admin-vendor-row-value">{vendors.filter(v => v.type === 'Pharmacy').length || 4}</span>
              </div>
              <div onClick={() => navigate('/admin/vendors?type=pharmacy')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Active vs Inactive Nodes:</span>
                <span className="admin-vendor-row-value text-[#1A7A4A]">4 Active / 0 Inactive</span>
              </div>
              <div onClick={() => navigate('/admin/medicines')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Total Medicines Listed:</span>
                <span className="admin-vendor-row-value">{medicines.length || 15} formulations</span>
              </div>
              <div onClick={() => navigate('/admin/orders/medicines')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Orders Received (This Month):</span>
                <span className="admin-vendor-row-value">{reduxOrders.length || 18} orders</span>
              </div>
              <div onClick={() => navigate('/admin/locations/cities')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">City-wise Pharmacy Count:</span>
                <span className="admin-vendor-row-value text-[11px]">Mumbai: 2, Pune: 1, Delhi: 1</span>
              </div>
              <div onClick={() => navigate('/admin/medicines?filter=outofstock')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Out of Stock Alerts:</span>
                <span className="admin-vendor-row-value text-rose-650 font-black">0 Alerts</span>
              </div>
              <div onClick={() => navigate('/admin/medicines?sort=topselling')} className="flex justify-between border-t border-[#BBF7D0] pt-2 mt-1 admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Top Selling Medicine:</span>
                <span className="admin-vendor-row-value text-[#1A7A4A] text-right truncate max-w-[150px]">
                  {medicines[0]?.name || 'Paracetamol 650mg'}
                </span>
              </div>
            </div>
          </div>

          {/* Labs Panel */}
          <div className="vendor-node-lab shadow-xs hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-[#FDE68A] pb-3.5 mb-4">
              <span className="p-2 rounded-xl bg-amber-50 text-[#F5A623]">
                <FiActivity className="text-lg" />
              </span>
              <div>
                <div className="admin-vendor-node-title">🔬 Labs Node</div>
                <div className="admin-vendor-node-subtitle">Diagnostic testing & scheduling</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div onClick={() => navigate('/admin/vendors?type=lab')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Total Registered Labs:</span>
                <span className="admin-vendor-row-value">{labs.length || 3} centers</span>
              </div>
              <div onClick={() => navigate('/admin/lab-tests')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Total Diagnostic Tests Listed:</span>
                <span className="admin-vendor-row-value">{labTests.length || 8} panels</span>
              </div>
              <div onClick={() => navigate('/admin/orders/lab-bookings')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Bookings (This Month):</span>
                <span className="admin-vendor-row-value">{reduxLabBookings.length || 12} appointments</span>
              </div>
              <div onClick={() => navigate('/admin/home-collections')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Pending Home Pickups:</span>
                <span className="admin-vendor-row-value text-amber-600">3 Today</span>
              </div>
              <div onClick={() => navigate('/admin/orders/lab-bookings')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Home Collection vs Walk-in:</span>
                <span className="admin-vendor-row-value">70% Home / 30% Walk-in</span>
              </div>
              <div onClick={() => navigate('/admin/locations/cities')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">City-wise Lab Coverage:</span>
                <span className="admin-vendor-row-value text-[11px]">Mumbai, Pune, Bangalore</span>
              </div>
              <div onClick={() => navigate('/admin/lab-tests')} className="flex justify-between border-t border-[#FDE68A] pt-2 mt-1 admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Most Booked Test:</span>
                <span className="admin-vendor-row-value text-[#F5A623] text-right truncate max-w-[150px]">
                  {labTests[0]?.name || 'Complete Blood Count'}
                </span>
              </div>
            </div>
          </div>

          {/* Doctors Panel */}
          <div className="vendor-node-doctor shadow-xs hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2 border-b border-[#BFDBFE] pb-3.5 mb-4">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-500">
                <FiHeart className="text-lg" />
              </span>
              <div>
                <div className="admin-vendor-node-title">👨‍⚕️ Doctors Node</div>
                <div className="admin-vendor-node-subtitle">Telehealth & clinical appointments</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div onClick={() => navigate('/admin/vendors?type=doctor')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Total Onboarded Doctors:</span>
                <span className="admin-vendor-row-value">{doctors.length || 4} clinicians</span>
              </div>
              <div onClick={() => navigate('/admin/vendors?type=doctor')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Specialization Breakdown:</span>
                <span className="admin-vendor-row-value">General, Cardio, Derma</span>
              </div>
              <div onClick={() => navigate('/admin/orders/appointments')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Appointments (This Month):</span>
                <span className="admin-vendor-row-value">{reduxAppointments.length || 15} slots</span>
              </div>
              <div onClick={() => navigate('/admin/doctors?filter=online')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Clinicians Online Now:</span>
                <span className="admin-vendor-row-value text-emerald-600">2 Online / 2 Offline</span>
              </div>
              <div onClick={() => navigate('/admin/orders/appointments')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Online vs In-clinic Split:</span>
                <span className="admin-vendor-row-value">60% Video / 40% Clinic</span>
              </div>
              <div onClick={() => navigate('/admin/locations/cities')} className="flex justify-between admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">City-wise Doctor Count:</span>
                <span className="admin-vendor-row-value text-[11px]">Mumbai: 2, Pune: 1, Delhi: 1</span>
              </div>
              <div onClick={() => navigate('/admin/doctors?sort=rating')} className="flex justify-between border-t border-[#BFDBFE] pt-2 mt-1 admin-vendor-row-clickable py-1 px-1.5 rounded-lg">
                <span className="admin-vendor-row-label">Top Rated Doctor:</span>
                <span className="admin-vendor-row-value text-blue-500 text-right truncate max-w-[150px]">
                  {doctors[0]?.name || 'Dr. Ramesh Gupta'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ROW 3 — CHARTS SECTION ==================== */}
      {chartLoading ? (
        <div className="admin-charts-grid">
          <div className="admin-skeleton-card-large" style={{ height: '272px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '272px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '272px' }} />
        </div>
      ) : (
        <div className="admin-charts-grid">
          {/* Chart 1: Orders Over Time */}
          <div className="admin-chart-card relative">
            <div className="admin-chart-card-title">Orders Over Time</div>
            <div className="admin-chart-card-subtitle">Medicines vs Lab Tests vs Doctor Appointments</div>
            <div className="w-full h-48" style={{ height: '192px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <AreaChart data={ordersTrendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMeds2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A7A4A" stopOpacity="0.25"/>
                      <stop offset="95%" stopColor="#1A7A4A" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                  <Area type="monotone" dataKey="Medicines" stroke="#1A7A4A" strokeWidth={2} fillOpacity={1} fill="url(#colorMeds2)" />
                  <Line type="monotone" dataKey="LabTests" stroke="#F5A623" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Appointments" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Revenue Trend */}
          <div className="admin-chart-card relative">
            <div className="admin-chart-card-title">Revenue Trend</div>
            <div className="admin-chart-card-subtitle">Monthly platform ₹ revenue</div>
            <div className="w-full h-48" style={{ height: '192px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v)=>`₹${v/1000}k`} />
                  <Tooltip formatter={(v)=>[formatIndianCurrency(v), 'Revenue']} contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                  <Bar dataKey="Revenue" fill="#1A7A4A" radius={[6, 6, 0, 0]}>
                    {monthlyRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === monthlyRevenueData.length - 1 ? '#F5A623' : '#1A7A4A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: User Growth */}
          <div className="admin-chart-card relative">
            <div className="admin-chart-card-title">User Growth</div>
            <div className="admin-chart-card-subtitle">New patients registered per month</div>
            <div className="w-full h-48" style={{ height: '192px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity="0.25"/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                  <Area type="monotone" dataKey="Users" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Vendor Distribution */}
          <div className="admin-chart-card">
            <div className="admin-chart-card-title">Vendor Distribution</div>
            <div className="admin-chart-card-subtitle">Split of Pharmacies vs Labs vs Doctors</div>
            <div className="w-full h-40 flex items-center justify-center relative" style={{ height: '160px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <PieChart>
                  <Pie data={vendorDistributionData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value">
                    {vendorDistributionData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[9px] text-[#6B7280] font-bold">TOTAL</span>
                <span className="text-base font-bold text-slate-800">{reduxVendors.length || 10}</span>
              </div>
            </div>
            <div className="flex justify-around text-[9px] font-bold text-[#6B7280]">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1A7A4A]" /> Meds</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" /> Labs</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Doctors</span>
            </div>
          </div>

          {/* Chart 5: Order Status Split */}
          <div className="admin-chart-card">
            <div className="admin-chart-card-title">Order Status Split</div>
            <div className="admin-chart-card-subtitle">Delivered vs Pending vs Cancelled vs Refunded</div>
            <div className="w-full h-40 flex items-center justify-center relative" style={{ height: '160px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <PieChart>
                  <Pie data={orderStatusSplitData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value">
                    {orderStatusSplitData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[9px] text-[#6B7280] font-bold">ORDERS</span>
                <span className="text-base font-bold text-slate-800">{totalOrdersCount}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[9px] font-bold text-[#6B7280] text-center">
              {orderStatusSplitData.map((o, idx) => (
                <span key={idx} className="flex items-center gap-0.5 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                  {o.name}: {o.value}
                </span>
              ))}
            </div>
          </div>

          {/* Chart 6: City-wise Revenue */}
          <div className="admin-chart-card relative">
            <div className="admin-chart-card-title">City-wise Revenue</div>
            <div className="admin-chart-card-subtitle">Top 10 cities by ₹ revenue split</div>
            <div className="w-full h-40" style={{ height: '160px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <BarChart data={cityRevenueData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} tickFormatter={(v)=>`₹${v/1000}k`} />
                  <Tooltip formatter={(v)=>[formatIndianCurrency(v), 'Revenue']} contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                  <Bar dataKey="Revenue" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 7: Doctor Specialization */}
          <div className="admin-chart-card relative">
            <div className="admin-chart-card-title">Doctor Specialization</div>
            <div className="admin-chart-card-subtitle">Count of onboarded clinicians by specialty</div>
            <div className="w-full h-40" style={{ height: '160px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <BarChart data={specializationData} layout="vertical" margin={{ top: 10, right: 5, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={8} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={8} width={80} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ROW 4 — TRAFFIC SECTION ==================== */}
      {chartLoading ? (
        <div className="admin-skeleton-card-large mt-2" style={{ height: '380px' }} />
      ) : (
        <div className="w-full mt-2">
          <div className="bg-white rounded-3xl border border-[#E8F5EE] shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-[#E8F5EE] gap-4">
              <div>
                <div className="admin-section-heading">Traffic Analysis</div>
                <div className="admin-section-subtext">Visits, unique users, pageviews ({timeframe.toUpperCase()})</div>
              </div>
              <button 
                type="button"
                onClick={() => setShowDownloadLoader(true)}
                className="bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs border-0"
              >
                <FiDownload className="text-sm" />
              </button>
            </div>

            <div className="p-5 w-full h-72" style={{ height: '288px', minWidth: 0 }}>
              <ResponsiveContainer width="99%" height="100%" debounce={50}>
                <AreaChart data={trafficData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A7A4A" stopOpacity="0.15"/>
                      <stop offset="95%" stopColor="#1A7A4A" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="colorUniques2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5A623" stopOpacity="0.15"/>
                      <stop offset="95%" stopColor="#F5A623" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0F3D2B', color: '#fff', borderRadius: '12px', fontSize: '10px', border: 'none' }} />
                  <Area type="monotone" dataKey="Visits" stroke="#1A7A4A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits2)" />
                  <Area type="monotone" dataKey="UniqueUsers" stroke="#F5A623" strokeWidth={2} fillOpacity={1} fill="url(#colorUniques2)" />
                  <Line type="monotone" dataKey="Pageviews" stroke="#3B82F6" strokeWidth={2} dot={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 border-t border-[#E8F5EE] bg-slate-50/30 text-center divide-x divide-slate-100 py-4">
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#6B7280] block">Total Visits</span>
                <span className="text-base font-bold text-slate-800 block mt-1">{Math.round(totalOrdersCount * 25).toLocaleString()}</span>
                <div className="w-16 mx-auto bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#1A7A4A] h-full w-[45%]" />
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#6B7280] block">Unique Users</span>
                <span className="text-base font-bold text-slate-800 block mt-1">{Math.round(reduxUsers.length * 1.5).toLocaleString()}</span>
                <div className="w-16 mx-auto bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#F5A623] h-full w-[30%]" />
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#6B7280] block">Pageviews</span>
                <span className="text-base font-bold text-slate-800 block mt-1">{Math.round(totalRev / 10).toLocaleString()}</span>
                <div className="w-16 mx-auto bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#3B82F6] h-full w-[60%]" />
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#6B7280] block">New Users This Period</span>
                <span className="text-base font-bold text-slate-800 block mt-1">{Math.round(reduxUsers.length * 0.8).toLocaleString()}</span>
                <div className="w-16 mx-auto bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#8B5CF6] h-full w-[80%]" />
                </div>
              </div>
              <div className="p-3">
                <span className="text-[10px] font-bold text-[#6B7280] block">Bounce Rate</span>
                <span className="text-base font-bold text-slate-800 block mt-1">40.15%</span>
                <div className="w-16 mx-auto bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-50 h-full w-[40.15%]" />
                </div>
              </div>
            </div>

            {/* Detailed Traffic Splits */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E8F5EE] divide-y md:divide-y-0 md:divide-x divide-slate-100 p-5 bg-slate-50/10 gap-6">
              <div>
                <div className="text-[11px] font-bold text-[#1A7A4A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiActivity className="text-[#1A7A4A]" /> Most Visited Pages
                </div>
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">/doctor-appointments</span>
                    <span className="bg-emerald-50 text-[#1A7A4A] px-2 py-0.5 rounded-md text-[10px] font-black">3,450 (42%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">/medicines</span>
                    <span className="bg-emerald-50 text-[#1A7A4A] px-2 py-0.5 rounded-md text-[10px] font-black">2,870 (35%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">/lab-tests</span>
                    <span className="bg-emerald-50 text-[#1A7A4A] px-2 py-0.5 rounded-md text-[10px] font-black">1,890 (23%)</span>
                  </div>
                </div>
              </div>
              
              <div className="md:pl-6">
                <div className="text-[11px] font-bold text-[#F5A623] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiSliders className="text-amber-500" /> Device Split
                </div>
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Mobile Devices</span>
                    <span className="text-[#F5A623] font-black">65.2%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Desktop Browsers</span>
                    <span className="text-[#F5A623] font-black">29.8%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Tablet / Other</span>
                    <span className="text-[#F5A623] font-black">5.0%</span>
                  </div>
                </div>
              </div>

              <div className="md:pl-6">
                <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiMapPin className="text-blue-500" /> Top Traffic Cities
                </div>
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Mumbai</span>
                    <span className="text-blue-500 font-black">42.8%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Delhi NCR</span>
                    <span className="text-blue-500 font-black">28.4%</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-800">Bangalore</span>
                    <span className="text-blue-500 font-black">15.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ROW 5 — TABLES SECTION ==================== */}
      {chartLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="admin-skeleton-card-large" style={{ height: '380px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '380px' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <section className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-1 border-b border-[#E8F5EE] pb-3 mb-4">
                <div className="admin-section-heading-wrapper">
                  <span>Recent Orders</span>
                </div>
                <div className="admin-section-subtext">Auditing incoming transactions. Click row to view details & route to page.</div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-[#E8F5EE] admin-table-header">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Pincode</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="admin-table-body divide-y divide-slate-550/30">
                    {orders.map((ord) => (
                      <tr key={ord.id} onClick={() => navigate(`/admin/orders/${ord.id.replace('#', '')}`)} className="hover:bg-[#E8F5EE]/30 transition-colors cursor-pointer">
                        <td className="py-3 px-4 font-bold text-slate-900">{ord.id}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{ord.patient}</td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{ord.category}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{ord.city}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{ord.pincode}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatIndianCurrency(ord.amount)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                            ord.status === 'Completed' || ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                            ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-450 text-[10px]">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Registrations */}
          <section className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-1 border-b border-[#E8F5EE] pb-3 mb-4">
                <div className="admin-section-heading-wrapper">
                  <span>Recent Vendor Registrations</span>
                </div>
                <div className="admin-section-subtext">Onboarding partner listings status. Click row to modify commission.</div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-[#E8F5EE] admin-table-header">
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="admin-table-body divide-y divide-slate-550/30">
                    {vendors.map((vend) => (
                      <tr key={vend.id} onClick={() => { setSelectedVendor(vend); setVendorCommissionInput(vend.commission); }} className="hover:bg-[#E8F5EE]/30 transition-colors cursor-pointer">
                        <td className="py-3 px-4 font-bold text-slate-900">{vend.name}</td>
                        <td className="py-3 px-4 text-slate-650 font-medium">{vend.type}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{vend.city}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                            vend.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                            vend.status === 'rejected' || vend.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {vend.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-450 text-[10px]">{vend.joinedDate}</td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          {vend.status === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => handleApproveVendor(vend.id, vend.name)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border-0 cursor-pointer shadow-xs transition-all duration-150"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== ROW 6 — ACTIVITY FEED + TOP PERFORMERS ==================== */}
      {chartLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="admin-skeleton-card-large" style={{ height: '380px' }} />
          <div className="admin-skeleton-card-large" style={{ height: '380px' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs flex flex-col gap-4">
            <div className="border-b border-[#E8F5EE] pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="admin-section-heading">Live Activity Feed</div>
                <div className="admin-section-subtext">Real-time system events logs</div>
              </div>
              <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl">
                {['All', 'Orders', 'Vendors', 'Complaints'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivityFilter(tab)}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase cursor-pointer border-0 transition-all ${
                      activityFilter === tab ? 'bg-[#1A7A4A] text-white' : 'text-[#6B7280] hover:text-[#1c1c1c] bg-transparent'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto no-scrollbar">
              {liveActivityFeed
                .filter(item => {
                  if (activityFilter === 'All') return true;
                  const typeMap = {
                    'Orders': 'order',
                    'Vendors': 'vendor',
                    'Complaints': 'complaint'
                  };
                  return item.type === typeMap[activityFilter];
                })
                .map((notif, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start p-2 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100/10">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      notif.type === 'vendor' ? 'bg-[#F5A623]' : notif.type === 'order' ? 'bg-blue-500' : notif.type === 'complaint' ? 'bg-rose-500' : notif.type === 'payment' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                    <div className="min-w-0">
                      <div className="admin-alert-title">{notif.text}</div>
                      <div className="admin-alert-subtitle mt-0.5">{notif.time}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs flex flex-col gap-4 justify-between">
            <div>
              <div className="border-b border-[#E8F5EE] pb-2">
                <div className="admin-section-heading">Top Performing Vendors (This Month)</div>
                <div className="admin-section-subtext">Ranked by total clinical order volume</div>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <div 
                  onClick={() => navigate('/admin/vendors?type=pharmacy&sort=orders')}
                  className="flex justify-between items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100/30 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-50 text-[#1A7A4A]">🧪</span>
                    <div>
                      <div className="vendor-leader-title">Pharmacy Leader</div>
                      <div className="vendor-leader-subtitle">{topPerformers.pharmacy.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="vendor-leader-stat text-[#1A7A4A]">{topPerformers.pharmacy.orders} Orders</div>
                    <span className="vendor-leader-revenue">{formatIndianCurrency(topPerformers.pharmacy.revenue)}</span>
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/vendors?type=lab&sort=bookings')}
                  className="flex justify-between items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100/30 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-50 text-[#F5A623]">🔬</span>
                    <div>
                      <div className="vendor-leader-title">Lab Diagnostics Leader</div>
                      <div className="vendor-leader-subtitle">{topPerformers.lab.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="vendor-leader-stat text-[#F5A623]">{topPerformers.lab.bookings} Bookings</div>
                    <span className="vendor-leader-revenue">{formatIndianCurrency(topPerformers.lab.revenue)}</span>
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/vendors?type=doctor&sort=appointments')}
                  className="flex justify-between items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100/30 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-500">👨‍⚕️</span>
                    <div>
                      <div className="vendor-leader-title">Doctor Leader</div>
                      <div className="vendor-leader-subtitle">{topPerformers.doctor.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="vendor-leader-stat text-blue-500">{topPerformers.doctor.appointments} Appts</div>
                    <span className="vendor-leader-revenue">{formatIndianCurrency(topPerformers.doctor.revenue)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E8F5EE] pt-3 flex flex-col gap-2">
              <button onClick={() => navigate('/admin/medicines/add')} className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#1A7A4A]/30 hover:border-[#1A7A4A] hover:bg-[#1A7A4A]/5 text-slate-700 rounded-xl admin-btn transition-all duration-150 cursor-pointer text-left">
                <span>Add Medicine Formulation</span>
                <FiPackage className="text-[#1A7A4A]" />
              </button>
              <button onClick={() => navigate('/admin/lab-tests/add')} className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#1A7A4A]/30 hover:border-[#1A7A4A] hover:bg-[#1A7A4A]/5 text-slate-700 rounded-xl admin-btn transition-all duration-150 cursor-pointer text-left">
                <span>Add Lab Test Panel</span>
                <FiActivity className="text-[#1A7A4A]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ROW 7 — FINANCIAL OVERVIEW ==================== */}
      <section className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs">
        <div className="border-b border-[#E8F5EE] pb-3.5 mb-4">
          <div className="admin-section-heading flex items-center gap-1.5">
            <FiCreditCard className="text-[#1A7A4A]" /> Platform Financial Overview <span className="text-[9px] font-bold text-[#6B7280] bg-slate-100 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Admin Eyes Only</span>
          </div>
          <div className="admin-section-subtext">Platform payouts, net commissions, transaction splits, and settlement processing.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5 admin-table-body">
          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Total Platform Revenue</span>
            <span className="text-lg font-bold text-slate-900 block mt-1.5">{formatIndianCurrency(totalRev)}</span>
            <span className="text-[9px] text-[#1A7A4A] mt-1 block">100% Volume</span>
          </div>

          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Revenue by Type</span>
            <div className="flex flex-col gap-1 mt-1.5 text-[10px] font-bold">
              <span className="text-emerald-700">Meds: {formatIndianCurrency(medRevenue)}</span>
              <span className="text-amber-600">Labs: {formatIndianCurrency(labRevenue)}</span>
              <span className="text-blue-500">Docs: {formatIndianCurrency(docRevenue)}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Pending Payouts</span>
            <span className="text-lg font-bold text-amber-600 block mt-1.5">{formatIndianCurrency(Math.round(totalRev * 0.12))}</span>
            <span className="text-[9px] text-slate-400 mt-1 block">Scheduled on June 15th</span>
          </div>

          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Refunds Issued</span>
            <span className="text-lg font-bold text-rose-500 block mt-1.5">{formatIndianCurrency(499)}</span>
            <span className="text-[9px] text-rose-500 mt-1 block">1 Refund processed</span>
          </div>

          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Net Revenue</span>
            <span className="text-lg font-bold text-emerald-600 block mt-1.5">{formatIndianCurrency(Math.round(totalRev * commissionSetting / 100))}</span>
            <span className="text-[9px] text-emerald-600 mt-1 block">After payout cut ({commissionSetting}%)</span>
          </div>

          <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100/40">
            <span className="text-[#6B7280] text-[9.5px] uppercase block">Payment Method split</span>
            <div className="flex flex-col gap-1 mt-1.5 text-[9.5px] font-bold text-[#6B7280]">
              <span>UPI: 45% • Card: 35%</span>
              <span>COD: 15% • Wallet: 5%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ROW 8 — ALERTS & NOTIFICATIONS PANEL ==================== */}
      <section className="bg-white rounded-3xl p-5 border border-[#E8F5EE] shadow-xs">
        <div className="border-b border-[#E8F5EE] pb-3.5 mb-4">
          <div className="admin-section-heading">🚨 Action Alerts & Notifications Panel</div>
          <div className="admin-section-subtext">Critical items requiring immediate administrative resolution or verification.</div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Action item: pending approvals */}
          {reduxVendors.filter(v => v.status === 'pending').map((v) => (
            <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-rose-50/30 rounded-2xl border border-rose-100/30 gap-3">
              <div className="flex items-start gap-2.5">
                <span className="p-1 text-sm bg-rose-100 text-rose-600 rounded-lg mt-0.5">🔴</span>
                <div>
                  <div className="admin-alert-title">Pending Approval: {v.name || v.storeName} ({v.role === 'pharmacy_vendor' ? 'Pharmacy' : v.role === 'lab_vendor' ? 'Lab' : 'Doctor'})</div>
                  <div className="admin-alert-subtitle mt-0.5">Registration from {v.city || 'Mumbai'}. Credentials pending review.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setVendorToReject({ id: v.id, name: v.name || v.storeName })}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl admin-btn cursor-pointer border-0"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleApproveVendor(v.id, v.name || v.storeName)}
                  className="px-3.5 py-1.5 bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white rounded-xl admin-btn cursor-pointer border-0"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}

          {/* Stuck orders */}
          <div className="flex items-center justify-between p-3 bg-amber-50/20 rounded-2xl border border-amber-100/20 text-xs">
            <div className="flex gap-2">
              <span className="text-amber-500">🟡</span>
              <div>
                <div className="admin-alert-title">Order processing timeout (24hrs+)</div>
                <div className="admin-alert-subtitle mt-0.5">Order #ORD-M1004 has been stuck in 'Pending Pickup' for 28 hours.</div>
              </div>
            </div>
            <button onClick={() => triggerToast('Nudge sent! Notification dispatched to pharmacy.', 'warning')} className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-700 rounded-lg border border-amber-200 admin-btn uppercase cursor-pointer">
              Nudge Pharmacy
            </button>
          </div>

          {/* Complaints */}
          <div className="flex items-center justify-between p-3 bg-orange-50/20 rounded-2xl border border-orange-100/20 text-xs">
            <div className="flex gap-2">
              <span className="text-orange-500">🟠</span>
              <div>
                <div className="admin-alert-title">Unresolved Complaint (48hrs+)</div>
                <div className="admin-alert-subtitle mt-0.5">Patient reported diagnostic technician did not wear clean gloves for home collection.</div>
              </div>
            </div>
            <button onClick={() => navigate('/admin/complaints')} className="px-3 py-1 bg-white hover:bg-orange-50 text-orange-700 rounded-lg border border-orange-200 admin-btn uppercase cursor-pointer">
              Investigate
            </button>
          </div>

          {/* Low stock warnings */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="flex gap-2">
              <span className="text-slate-500">🔵</span>
              <div>
                <div className="admin-alert-title">Low stock alert from pharmacy</div>
                <div className="admin-alert-subtitle mt-0.5">HealthRx Pharmacy reported stock level of 'Amoxicillin 500mg' is below threshold.</div>
              </div>
            </div>
            <button onClick={() => triggerToast('Re-order notification triggered.')} className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 admin-btn uppercase cursor-pointer">
              Reorder
            </button>
          </div>

          {/* Failed payments */}
          <div className="flex items-center justify-between p-3 bg-rose-50/20 rounded-2xl border border-rose-100/20 text-xs">
            <div className="flex gap-2">
              <span className="text-rose-500">⚠️</span>
              <div>
                <div className="admin-alert-title">Failed payment needing review</div>
                <div className="admin-alert-subtitle mt-0.5">UPI transaction of ₹1,250 for Rajesh Kumar flagged as failed, but bank reported debit.</div>
              </div>
            </div>
            <button onClick={() => triggerToast('Reconciliation checks successfully launched.')} className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 rounded-lg border border-rose-200 admin-btn uppercase cursor-pointer">
              Reconcile
            </button>
          </div>

          {/* Unserviceable pincodes requested */}
          <div className="flex items-center justify-between p-3 bg-amber-50/20 rounded-2xl border border-amber-100/20 text-xs">
            <div className="flex gap-2">
              <span className="text-amber-550">📍</span>
              <div>
                <div className="admin-alert-title">Unserviceable Pincode Requests (400088)</div>
                <div className="admin-alert-subtitle mt-0.5">Pincode 400088 requested by 5 patients in the last 24 hours. No vendors covering this zone.</div>
              </div>
            </div>
            <button onClick={() => navigate('/admin/locations/gaps')} className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-700 rounded-lg border border-amber-200 admin-btn uppercase cursor-pointer">
              Configure
            </button>
          </div>

          {/* Offline critical doctors */}
          <div className="flex items-center justify-between p-3 bg-rose-50/25 rounded-2xl border border-rose-100/20 text-xs">
            <div className="flex gap-2">
              <span className="text-rose-550">🏥</span>
              <div>
                <div className="admin-alert-title">Critical Clinicians Offline</div>
                <div className="admin-alert-subtitle mt-0.5">2 critical specialty doctors are currently offline (Cardiologist, Neurologist).</div>
              </div>
            </div>
            <button onClick={() => triggerToast('Nudge sent! Alert notification dispatched to doctors.')} className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-750 rounded-lg border border-rose-200 admin-btn uppercase cursor-pointer">
              Nudge Clinicians
            </button>
          </div>
        </div>
      </section>

      {/* --- TOAST NOTIFICATIONS DRAWER --- */}
      <div className="fixed bottom-6 right-6 z-[99] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-[#0F3D2B] text-white px-4 py-3 rounded-2xl shadow-premium text-xs font-semibold flex items-center gap-2 border border-emerald-500/20 pointer-events-auto">
            <FiCheckCircle className="text-[#F5A623] text-sm shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Rejection Confirmation Modal */}
      <AnimatePresence>
        {vendorToReject && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-sm w-full shadow-premium border border-slate-100 text-left p-6"
            >
              <div className="admin-modal-title">Confirm Rejection</div>
              <div className="admin-modal-subtitle mt-2 text-slate-500 text-xs font-semibold leading-relaxed">
                Are you sure you want to reject the registration of "{vendorToReject.name}"? This action will mark their status as rejected.
              </div>
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  onClick={() => setVendorToReject(null)}
                  className="px-4.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-0 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleConfirmReject(vendorToReject.id, vendorToReject.name);
                  }}
                  className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#1A7A4A] p-4.5 text-white flex justify-between items-center">
                <div>
                  <div className="admin-modal-title text-white">Order Settlement Audit</div>
                  <span className="admin-modal-subtitle text-slate-100">{selectedOrder.id} • {selectedOrder.date}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Patient Directory:</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.patient}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Billing Category:</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Assigned Vendor Node:</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.vendor}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Total Invoiced Payout:</span>
                  <span className="text-slate-800 font-extrabold text-sm">{formatIndianCurrency(selectedOrder.amount)}</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Settlement Stage Updates</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Pending', 'Confirmed', 'Completed', 'Cancelled'].filter(s => s !== selectedOrder.status).slice(0, 3).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`py-2 px-2.5 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          st === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' :
                          st === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' :
                          'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        Mark {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Vendor Details / Commission rate modifier */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#1A7A4A] p-4.5 text-white flex justify-between items-center">
                <div>
                  <div className="admin-modal-title text-white">Vendor Commission Settings</div>
                  <span className="admin-modal-subtitle text-slate-200">{selectedVendor.id} • {selectedVendor.name}</span>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Total Fulfilled Orders:</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.orders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Revenue Generated:</span>
                  <span className="text-slate-800 font-extrabold">{formatIndianCurrency(selectedVendor.rev)}</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 tracking-wider">
                    <span>Platform Commission Cut</span>
                    <span className="text-[#1A7A4A] font-black">{vendorCommissionInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={vendorCommissionInput}
                    onChange={(e) => setVendorCommissionInput(parseInt(e.target.value))}
                    className="w-full accent-[#1A7A4A] cursor-pointer"
                  />
                  <p className="text-[9.5px] text-[#6B7280] font-bold leading-normal uppercase">
                    Platform takes this percentage of revenue from vendor settlements automatically.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-2.5 justify-end">
                <button onClick={() => setSelectedVendor(null)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-750 text-xs font-bold rounded-xl border-0 cursor-pointer">
                  Cancel
                </button>
                <button onClick={() => handleSaveVendorCommission(selectedVendor.id)} className="px-5 py-2 bg-[#1A7A4A] hover:bg-[#1A7A4A]/90 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. Report Download Progress Loader Overlay */}
      <AnimatePresence>
        {showDownloadLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-premium text-center flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#1A7A4A] animate-spin" />
                <span className="text-[11px] font-black text-[#1A7A4A]">{downloadProgress}%</span>
              </div>
              <div>
                <div className="font-extrabold text-slate-800 text-sm">Generating Clinical Registry PDF...</div>
                <p className="text-[10px] text-slate-450 font-bold mt-1.5 leading-normal uppercase">
                  Compiling clinical logs, vendor payouts, audit trails, and financial growth metrics.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
