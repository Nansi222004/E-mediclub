const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Lab = require('../models/Lab');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');
const LabBooking = require('../models/LabBooking');
const { buildLocationQuery } = require('../utils/locationQueryBuilder');

// Helper to calculate date ranges for day, month, year timeframes
const getDateRange = (timeframe) => {
  const now = new Date();
  switch(timeframe) {
    case 'day':
      return {
        start: new Date(new Date(now).setHours(0, 0, 0, 0)),
        end:   new Date(new Date(now).setHours(23, 59, 59, 999)),
      };
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end:   new Date(),
      };
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end:   new Date(),
      };
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end:   new Date(),
      };
  }
};

// Combine location query with timeframe date range filter
const getQueryWithTimeframe = (reqQuery) => {
  const query = buildLocationQuery(reqQuery);
  if (reqQuery.timeframe) {
    const { start, end } = getDateRange(reqQuery.timeframe);
    query.createdAt = { $gte: start, $lte: end };
  }
  return query;
};

// Check if mock date matches timeframe
const matchesTimeframe = (itemDateStr, timeframe) => {
  if (!timeframe) return true;
  const { start, end } = getDateRange(timeframe);
  let itemDate;
  if (itemDateStr === 'Today') {
    itemDate = new Date();
  } else if (itemDateStr === 'Yesterday') {
    itemDate = new Date();
    itemDate.setDate(itemDate.getDate() - 1);
  } else {
    itemDate = new Date(itemDateStr);
  }
  return itemDate >= start && itemDate <= end;
};

// Helper to check if location filter has matched records
const hasRecordsForQuery = async (locationQuery) => {
  const [patients, vendors, orders] = await Promise.all([
    User.countDocuments({ ...locationQuery, role: 'user' }),
    User.countDocuments({ ...locationQuery, role: { $ne: 'user' } }),
    Order.countDocuments(locationQuery)
  ]);
  return {
    isEmpty: patients === 0 && vendors === 0 && orders === 0,
    hasVendors: vendors > 0,
    hasOrders: orders > 0
  };
};

// GET /admin/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const timeframe = req.query.timeframe || 'month';
    const query = getQueryWithTimeframe({ timeframe, ...req.query });
    
    // Revenue Query: sum totalAmount only for delivered orders, matching location + timeframe
    const revenueQuery = { 
      ...query, 
      status: { $in: ['delivered', 'completed', 'paid'] }
    };

    const [patients, vendors, orders, revenue] = await Promise.all([
      User.countDocuments({ ...query, role: 'user' }),
      User.countDocuments({ ...query, role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } }),
      Order.countDocuments(query),
      Order.aggregate([
        { $match: revenueQuery },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const locationQuery = buildLocationQuery(req.query);
    const status = await hasRecordsForQuery(locationQuery);

    return res.status(200).json({
      success: true,
      patients,
      vendors,
      orders,
      revenue: revenue[0]?.total || 0,
      isEmpty: status.isEmpty,
      hasVendors: status.hasVendors,
      hasOrders: status.hasOrders
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/vendors/pharmacy
const getDashboardVendorsPharmacy = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe({ timeframe: 'month', ...req.query });
    const count = await User.countDocuments({ ...query, role: 'pharmacy_vendor' });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/vendors/labs
const getDashboardVendorsLabs = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe({ timeframe: 'month', ...req.query });
    const count = await User.countDocuments({ ...query, role: 'lab_vendor' });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/vendors/doctors
const getDashboardVendorsDoctors = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe({ timeframe: 'month', ...req.query });
    const count = await User.countDocuments({ ...query, role: 'doctor_vendor' });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/charts/orders
const getDashboardChartsOrders = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const { timeframe = 'month' } = req.query;

    let chartData = [];
    if (timeframe === 'day') {
      chartData = [
        { name: '12am', Medicines: 2, LabTests: 0, Appointments: 0 },
        { name: '4am', Medicines: 1, LabTests: 0, Appointments: 0 },
        { name: '8am', Medicines: 4, LabTests: 3, Appointments: 2 },
        { name: '12pm', Medicines: 8, LabTests: 5, Appointments: 6 },
        { name: '4pm', Medicines: 12, LabTests: 4, Appointments: 8 },
        { name: '8pm', Medicines: 10, LabTests: 2, Appointments: 4 },
        { name: '11pm', Medicines: 3, LabTests: 1, Appointments: 1 },
      ];
    } else if (timeframe === 'year') {
      chartData = [
        { name: 'Jan', Medicines: 30, LabTests: 15, Appointments: 10 },
        { name: 'Feb', Medicines: 45, LabTests: 20, Appointments: 15 },
        { name: 'Mar', Medicines: 60, LabTests: 25, Appointments: 20 },
        { name: 'Apr', Medicines: 75, LabTests: 30, Appointments: 25 },
        { name: 'May', Medicines: 90, LabTests: 35, Appointments: 30 },
        { name: 'Jun', Medicines: 110, LabTests: 45, Appointments: 38 },
        { name: 'Jul', Medicines: 120, LabTests: 50, Appointments: 42 },
        { name: 'Aug', Medicines: 130, LabTests: 55, Appointments: 48 },
        { name: 'Sep', Medicines: 140, LabTests: 60, Appointments: 52 },
        { name: 'Oct', Medicines: 150, LabTests: 65, Appointments: 58 },
        { name: 'Nov', Medicines: 160, LabTests: 70, Appointments: 62 },
        { name: 'Dec', Medicines: 180, LabTests: 80, Appointments: 70 },
      ];
    } else {
      chartData = [
        { name: 'Wk 1', Medicines: 25, LabTests: 12, Appointments: 8 },
        { name: 'Wk 2', Medicines: 35, LabTests: 18, Appointments: 12 },
        { name: 'Wk 3', Medicines: 45, LabTests: 22, Appointments: 16 },
        { name: 'Wk 4', Medicines: 55, LabTests: 32, Appointments: 24 },
      ];
    }

    return res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/charts/revenue
const getDashboardChartsRevenue = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const { timeframe = 'month' } = req.query;

    let chartData = [];
    if (timeframe === 'day') {
      chartData = [
        { name: '12am', Revenue: 1200 },
        { name: '4am', Revenue: 800 },
        { name: '8am', Revenue: 3500 },
        { name: '12pm', Revenue: 7800 },
        { name: '4pm', Revenue: 11200 },
        { name: '8pm', Revenue: 9400 },
        { name: '11pm', Revenue: 2800 }
      ];
    } else if (timeframe === 'year') {
      chartData = [
        { name: 'Jan', Revenue: 15000 },
        { name: 'Feb', Revenue: 18000 },
        { name: 'Mar', Revenue: 24000 },
        { name: 'Apr', Revenue: 28000 },
        { name: 'May', Revenue: 31000 },
        { name: 'Jun', Revenue: 35000 },
        { name: 'Jul', Revenue: 38000 },
        { name: 'Aug', Revenue: 42000 },
        { name: 'Sep', Revenue: 45000 },
        { name: 'Oct', Revenue: 48000 },
        { name: 'Nov', Revenue: 52000 },
        { name: 'Dec', Revenue: 60000 }
      ];
    } else {
      chartData = [
        { name: 'Wk 1', Revenue: 8000 },
        { name: 'Wk 2', Revenue: 10000 },
        { name: 'Wk 3', Revenue: 11000 },
        { name: 'Wk 4', Revenue: 35000 }
      ];
    }

    return res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/charts/users
const getDashboardChartsUsers = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const { timeframe = 'month' } = req.query;

    let chartData = [];
    if (timeframe === 'day') {
      chartData = [
        { name: '12am', Users: 0 },
        { name: '4am', Users: 1 },
        { name: '8am', Users: 3 },
        { name: '12pm', Users: 5 },
        { name: '4pm', Users: 8 },
        { name: '8pm', Users: 10 },
        { name: '11pm', Users: 12 }
      ];
    } else if (timeframe === 'year') {
      chartData = [
        { name: 'Jan', Users: 15 },
        { name: 'Feb', Users: 22 },
        { name: 'Mar', Users: 28 },
        { name: 'Apr', Users: 35 },
        { name: 'May', Users: 42 },
        { name: 'Jun', Users: 52 },
        { name: 'Jul', Users: 58 },
        { name: 'Aug', Users: 65 },
        { name: 'Sep', Users: 70 },
        { name: 'Oct', Users: 78 },
        { name: 'Nov', Users: 85 },
        { name: 'Dec', Users: 92 }
      ];
    } else {
      chartData = [
        { name: 'Wk 1', Users: 8 },
        { name: 'Wk 2', Users: 16 },
        { name: 'Wk 3', Users: 28 },
        { name: 'Wk 4', Users: 52 }
      ];
    }

    return res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/recent-orders
const getDashboardRecentOrders = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/recent-vendors
const getDashboardRecentVendors = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const vendors = await User.find({ ...query, role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/activity-feed
const getDashboardActivityFeed = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const feed = [
      { text: "New order placed by Rajesh Kumar (Medicine - ₹1,250)", time: "Just Now", type: "order", city: "Mumbai", pincode: "400001", state: "Maharashtra" },
      { text: "New vendor registered: MedPlus Pharmacy", time: "10 mins ago", type: "vendor", city: "Mumbai", pincode: "400001", state: "Maharashtra" },
      { text: "New user registered: Amit Trivedi", time: "25 mins ago", type: "user", city: "Pune", pincode: "411001", state: "Maharashtra" },
      { text: "Complaint raised: Patient reported home collection delay for LAB-105", time: "1 hr ago", type: "complaint", city: "Pune", pincode: "411001", state: "Maharashtra" },
      { text: "Payment received: ₹399 for consultation APT-106", time: "2 hrs ago", type: "payment", city: "Delhi", pincode: "110001", state: "Delhi" },
      { text: "New vendor registered: Dr. Ramesh Gupta (Cardiologist)", time: "4 hrs ago", type: "vendor", city: "Delhi", pincode: "110001", state: "Delhi" },
      { text: "Order placed by Priya Patel (Lab Screen - ₹899)", time: "5 hrs ago", type: "order", city: "Pune", pincode: "411001", state: "Maharashtra" },
      { text: "Payment received: ₹1,250 for Medicine Order ORD-M1001", time: "6 hrs ago", type: "payment", city: "Mumbai", pincode: "400001", state: "Maharashtra" },
      { text: "New order placed by Indore Patient 1 (Medicine - ₹120)", time: "1 day ago", type: "order", city: "Indore", pincode: "452010", state: "Madhya Pradesh" }
    ];

    // Filter using query
    const filteredFeed = feed.filter(item => {
      if (req.query.state && item.state.toLowerCase() !== req.query.state.toLowerCase()) return false;
      if (req.query.city && item.city.toLowerCase() !== req.query.city.toLowerCase()) return false;
      if (req.query.pincode && item.pincode !== req.query.pincode) return false;
      if (req.query.locationQuery) {
        const term = req.query.locationQuery.toLowerCase();
        return item.city.toLowerCase().includes(term) || item.state.toLowerCase().includes(term) || item.pincode.includes(term);
      }
      return true;
    });

    return res.status(200).json({ success: true, data: filteredFeed });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/top-vendors
const getDashboardTopVendors = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const topPerformers = {
      pharmacy: { name: 'HealthRx Pharmacy', orders: 18, revenue: 5760 },
      lab: { name: 'Medlife Labs', bookings: 12, revenue: 5988 },
      doctor: { name: 'Dr. Ramesh Gupta', appointments: 15, revenue: 5985 }
    };
    return res.status(200).json({ success: true, data: topPerformers });
  } catch (error) {
    next(error);
  }
};

// GET /admin/dashboard/financial
const getDashboardFinancial = async (req, res, next) => {
  try {
    const query = buildLocationQuery(req.query);
    const financial = {
      payouts: 45000,
      netCommission: 22700,
      upiPercent: 45,
      codPercent: 15
    };
    return res.status(200).json({ success: true, data: financial });
  } catch (error) {
    next(error);
  }
};

// GET /admin/locations/states
const getLocationsStates = async (req, res, next) => {
  try {
    const [
      vendorStates,
      patientStates,
      orderStates,
      doctorStates,
      labStates,
      productStates,
      appointmentStates,
      labBookingStates
    ] = await Promise.all([
      User.distinct('state', { role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } }),
      User.distinct('state', { role: 'user' }),
      Order.distinct('state'),
      Doctor.distinct('state'),
      Lab.distinct('state'),
      Product.distinct('vendorState'),
      Appointment.distinct('state'),
      LabBooking.distinct('state')
    ]);

    const allStates = [...new Set([
      ...vendorStates,
      ...patientStates,
      ...orderStates,
      ...doctorStates,
      ...labStates,
      ...productStates,
      ...appointmentStates,
      ...labBookingStates
    ])].filter(Boolean).map(s => s.trim()).sort();

    return res.status(200).json(allStates);
  } catch (error) {
    next(error);
  }
};

// GET /admin/locations/cities?state=Maharashtra
const getLocationsCities = async (req, res, next) => {
  try {
    const { state } = req.query;
    const stateFilter = state
      ? { state: { $regex: `^${state.trim()}$`, $options: 'i' } }
      : {};
    const vendorStateFilter = state
      ? { vendorState: { $regex: `^${state.trim()}$`, $options: 'i' } }
      : {};

    const [
      vendorCities,
      patientCities,
      orderCities,
      doctorCities,
      labCities,
      productCities,
      appointmentCities,
      labBookingCities
    ] = await Promise.all([
      User.distinct('city', { ...stateFilter, role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } }),
      User.distinct('city', { ...stateFilter, role: 'user' }),
      Order.distinct('city', stateFilter),
      Doctor.distinct('city', stateFilter),
      Lab.distinct('city', stateFilter),
      Product.distinct('vendorCity', vendorStateFilter),
      Appointment.distinct('city', stateFilter),
      LabBooking.distinct('city', stateFilter)
    ]);

    const allCities = [...new Set([
      ...vendorCities,
      ...patientCities,
      ...orderCities,
      ...doctorCities,
      ...labCities,
      ...productCities,
      ...appointmentCities,
      ...labBookingCities
    ])].filter(Boolean).map(c => c.trim()).sort();

    return res.status(200).json(allCities);
  } catch (error) {
    next(error);
  }
};

// GET /admin/locations/pincodes?city=Mumbai&state=Maharashtra
const getLocationsPincodes = async (req, res, next) => {
  try {
    const { city, state } = req.query;
    
    const filter = {};
    if (city)  filter.city  = { $regex: `^${city.trim()}$`,  $options: 'i' };
    if (state) filter.state = { $regex: `^${state.trim()}$`, $options: 'i' };

    const vendorFilter = {};
    if (city)  vendorFilter.vendorCity  = { $regex: `^${city.trim()}$`,  $options: 'i' };
    if (state) vendorFilter.vendorState = { $regex: `^${state.trim()}$`, $options: 'i' };

    const [
      vendorPins,
      patientPins,
      orderPins,
      doctorPins,
      labPins,
      productPins,
      appointmentPins,
      labBookingPins
    ] = await Promise.all([
      User.distinct('pincode', { ...filter, role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } }),
      User.distinct('pincode', { ...filter, role: 'user' }),
      Order.distinct('pincode', filter),
      Doctor.distinct('pincode', filter),
      Lab.distinct('pincode', filter),
      Product.distinct('vendorPincode', vendorFilter),
      Appointment.distinct('pincode', filter),
      LabBooking.distinct('pincode', filter)
    ]);

    const allPincodes = [...new Set([
      ...vendorPins,
      ...patientPins,
      ...orderPins,
      ...doctorPins,
      ...labPins,
      ...productPins,
      ...appointmentPins,
      ...labBookingPins
    ])].filter(Boolean).map(p => p.trim()).sort();

    return res.status(200).json(allPincodes);
  } catch (error) {
    next(error);
  }
};

// Sub-pages endpoints
const getOrdersMedicines = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const orders = await Order.find({ ...query });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const getOrdersLabBookings = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const bookings = await LabBooking.find(query);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getOrdersAppointments = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const appointments = await Appointment.find(query);
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

const getMedicines = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const medicines = await Product.find({ ...query, category: 'Medicines' });
    return res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    next(error);
  }
};

const getLabTests = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const tests = await Lab.find(query);
    return res.status(200).json({ success: true, data: tests });
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const doctors = await Doctor.find(query);
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
};

const getVendors = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const roles = ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'];
    
    const { kyc, license, licenseStatus, vendorType, type } = req.query;

    if (kyc && kyc !== 'all') {
      query.kyc = { $regex: `^${kyc}$`, $options: 'i' };
    }

    const lic = licenseStatus || license;
    if (lic && lic !== 'all') {
      const dbStatus = lic === 'awaiting' ? 'pending' : lic;
      query.status = { $regex: `^${dbStatus}$`, $options: 'i' };
    }

    const vType = vendorType || type;
    if (vType && vType !== 'all') {
      if (vType === 'pharmacy') {
        query.$or = [
          { role: 'pharmacy_vendor' },
          { role: 'vendor' },
          { role: { $exists: false } }
        ];
      } else if (vType === 'lab') {
        query.role = 'lab_vendor';
      } else if (vType === 'doctor') {
        query.role = 'doctor_vendor';
      }
    } else {
      query.role = { $in: roles };
    }

    const vendors = await User.find(query);
    return res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    console.log('=== PATIENTS API CALLED ===');
    console.log('Query params:', req.query);
    const query = getQueryWithTimeframe(req.query);
    console.log('Built query:', query);
    const users = await User.find({ ...query, role: 'user' });
    console.log('Patients found in DB:', users.length);
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('getPatients error:', error);
    next(error);
  }
};

const getVendorsDebug = async (req, res, next) => {
  try {
    const sample = await User.findOne({ role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } });
    return res.status(200).json({
      success: true,
      sample
    });
  } catch (error) {
    next(error);
  }
};

const getPatientsDebug = async (req, res, next) => {
  try {
    const query = getQueryWithTimeframe(req.query);
    const users = await User.find({ ...query, role: 'user' });
    return res.status(200).json({
      success: true,
      query,
      users
    });
  } catch (error) {
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const payments = [
      { id: 'TXN-93821', partner: 'HealthRx Pharmacy', rev: 12500, payout: 10625, commission: 1875, status: 'Settled', date: '03 Jun 2026', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      { id: 'TXN-93822', partner: 'Medlife Labs', rev: 8900, payout: 7300, commission: 1600, status: 'Settled', date: '03 Jun 2026', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      { id: 'TXN-93823', partner: 'CureWell Clinic', rev: 4900, payout: 3920, commission: 980, status: 'Pending', date: '02 Jun 2026', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      { id: 'TXN-93824', partner: 'Apollo Diagnostics', rev: 15000, payout: 13200, commission: 1800, status: 'Settled', date: '01 Jun 2026', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      { id: 'TXN-93825', partner: 'DocPrime', rev: 3100, payout: 2635, commission: 465, status: 'Settled', date: '01 Jun 2026', city: 'Mumbai', state: 'Maharashtra', pincode: '400002' },
      { id: 'TXN-93826', partner: 'Indore Care Lab', rev: 9500, payout: 8075, commission: 1425, status: 'Settled', date: '04 Jun 2026', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }
    ];
    
    // Filter payments
    const filteredPayments = payments.filter(item => {
      if (req.query.state && item.state.toLowerCase() !== req.query.state.toLowerCase()) return false;
      if (req.query.city && item.city.toLowerCase() !== req.query.city.toLowerCase()) return false;
      if (req.query.pincode && item.pincode !== req.query.pincode) return false;
      if (req.query.timeframe && !matchesTimeframe(item.date, req.query.timeframe)) return false;
      if (req.query.locationQuery) {
        const term = req.query.locationQuery.toLowerCase();
        return item.city.toLowerCase().includes(term) || item.state.toLowerCase().includes(term) || item.pincode.includes(term);
      }
      return true;
    });

    return res.status(200).json({ success: true, data: filteredPayments });
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    const complaints = [
      { id: 'COM-101', patient: 'Rajesh Kumar', against: 'MedPlus Wellness Pharmacy', issue: 'Wrong medicine dosage delivered. Received 500mg instead of 650mg.', status: 'Open', date: '2026-06-09', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      { id: 'COM-102', patient: 'Priya Patel', against: 'Apothecary Labs', issue: 'Diagnostic technician did not wear clean gloves for home collection.', status: 'In Progress', date: '2026-06-08', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      { id: 'COM-103', patient: 'Anoop Singh', against: 'Dr. Ramesh Gupta', issue: 'Consultation link was not generated for scheduled time.', status: 'Resolved', date: '2026-06-05', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      { id: 'COM-104', patient: 'Sunita Sharma', against: 'Medicare Essentials', issue: 'Overcharged for consultation. Billed ₹500 instead of ₹399.', status: 'Open', date: '2026-06-04', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      { id: 'COM-105', patient: 'Vijay Sen', against: 'Indore Care Lab', issue: 'Sample collection report delayed by 24 hours.', status: 'Open', date: '2026-06-11', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }
    ];

    const filteredComplaints = complaints.filter(item => {
      if (req.query.state && item.state.toLowerCase() !== req.query.state.toLowerCase()) return false;
      if (req.query.city && item.city.toLowerCase() !== req.query.city.toLowerCase()) return false;
      if (req.query.pincode && item.pincode !== req.query.pincode) return false;
      if (req.query.timeframe && !matchesTimeframe(item.date, req.query.timeframe)) return false;
      if (req.query.locationQuery) {
        const term = req.query.locationQuery.toLowerCase();
        return item.city.toLowerCase().includes(term) || item.state.toLowerCase().includes(term) || item.pincode.includes(term);
      }
      return true;
    });

    return res.status(200).json({ success: true, data: filteredComplaints });
  } catch (error) {
    next(error);
  }
};

const getHomeCollections = async (req, res, next) => {
  try {
    const collections = [
      { id: 'HC-901', patient: 'Rajesh Kumar', address: 'B/402 Skyline Towers, Andheri West', pincode: '400053', test: 'Complete Blood Count (CBC)', slot: '08:00 AM - 10:00 AM', tech: 'Vikram Singh', status: 'Out for Collection', date: 'Today', city: 'Mumbai', lab: 'Apothecary Labs', state: 'Maharashtra' },
      { id: 'HC-902', patient: 'Sunita Sharma', address: 'Flat 12, Rosewood Apts, Kothrud', pincode: '411038', test: 'Lipid Profile & Thyroid', slot: '10:00 AM - 12:00 PM', tech: 'Suresh Patil', status: 'Scheduled', date: 'Today', city: 'Pune', lab: 'MedPlus Lab', state: 'Maharashtra' },
      { id: 'HC-903', patient: 'Anoop Singh', address: 'H.No 124, Sector 15', pincode: '110024', test: 'HbA1c & Blood Sugar', slot: '07:00 AM - 09:00 AM', tech: 'Amit Sharma', status: 'Sample Collected', date: 'Today', city: 'Delhi', lab: 'Dr. Lal Pathlabs', state: 'Delhi' },
      { id: 'HC-904', patient: 'Priya Patel', address: 'Block C, Oasis Enclave, Indiranagar', pincode: '560038', test: 'Full Body Health Package', slot: '08:00 AM - 10:00 AM', tech: 'Naveen Kumar', status: 'Report Ready', date: 'Yesterday', city: 'Bangalore', lab: 'Apothecary Labs', state: 'Karnataka' },
      { id: 'HC-905', patient: 'Gaurav Verma', address: '12/4 Vijay Nagar', pincode: '452010', test: 'Liver Function Test', slot: '09:00 AM - 11:00 AM', tech: 'Rahul Sen', status: 'Scheduled', date: 'Today', city: 'Indore', lab: 'Indore Care Lab', state: 'Madhya Pradesh' }
    ];

    const filtered = collections.filter(item => {
      if (req.query.state && item.state.toLowerCase() !== req.query.state.toLowerCase()) return false;
      if (req.query.city && item.city.toLowerCase() !== req.query.city.toLowerCase()) return false;
      if (req.query.pincode && item.pincode !== req.query.pincode) return false;
      if (req.query.timeframe && !matchesTimeframe(item.date, req.query.timeframe)) return false;
      if (req.query.locationQuery) {
        const term = req.query.locationQuery.toLowerCase();
        return item.city.toLowerCase().includes(term) || item.state.toLowerCase().includes(term) || item.pincode.includes(term);
      }
      return true;
    });

    return res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
};

const getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = [
      { id: 'PR-401', patient: 'Anoop Singh', pharmacy: 'HealthRx Pharmacy', date: '2026-06-10', status: 'Pending Review', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      { id: 'PR-402', patient: 'Priya Patel', pharmacy: 'Apollo Pharmacy', date: '2026-06-09', status: 'Approved', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      { id: 'PR-403', patient: 'Sunita Sharma', pharmacy: 'Medicare Essentials', date: '2026-06-08', status: 'Flagged', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      { id: 'PR-404', patient: 'Rajesh Kumar', pharmacy: 'HealthRx Pharmacy', date: '2026-06-05', status: 'Rejected', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      { id: 'PR-405', patient: 'Vijay Sen', pharmacy: 'Indore Care Pharmacy', date: '2026-06-11', status: 'Pending Review', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }
    ];

    const filtered = prescriptions.filter(item => {
      if (req.query.state && item.state.toLowerCase() !== req.query.state.toLowerCase()) return false;
      if (req.query.city && item.city.toLowerCase() !== req.query.city.toLowerCase()) return false;
      if (req.query.pincode && item.pincode !== req.query.pincode) return false;
      if (req.query.timeframe && !matchesTimeframe(item.date, req.query.timeframe)) return false;
      if (req.query.locationQuery) {
        const term = req.query.locationQuery.toLowerCase();
        return item.city.toLowerCase().includes(term) || item.state.toLowerCase().includes(term) || item.pincode.includes(term);
      }
      return true;
    });

    return res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDashboardVendorsPharmacy,
  getDashboardVendorsLabs,
  getDashboardVendorsDoctors,
  getDashboardChartsOrders,
  getDashboardChartsRevenue,
  getDashboardChartsUsers,
  getDashboardRecentOrders,
  getDashboardRecentVendors,
  getDashboardActivityFeed,
  getDashboardTopVendors,
  getDashboardFinancial,
  getLocationsStates,
  getLocationsCities,
  getLocationsPincodes,
  getOrdersMedicines,
  getOrdersLabBookings,
  getOrdersAppointments,
  getMedicines,
  getLabTests,
  getDoctors,
  getVendors,
  getPatients,
  getVendorsDebug,
  getPatientsDebug,
  getPayments,
  getComplaints,
  getHomeCollections,
  getPrescriptions
};
