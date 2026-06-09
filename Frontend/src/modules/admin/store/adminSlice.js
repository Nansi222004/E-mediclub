import { createSlice } from '@reduxjs/toolkit';

// Realistic mock data for Super Admin Panel
const mockVendors = [
  { id: 1, name: 'MedPlus Wellness Pharmacy', email: 'wellnessrx@gmail.com', phone: '9876500001', storeName: 'MedPlus Wellness Main Store', status: 'approved', kyc: 'verified', earnings: 145000, commissionRate: 10, joinedDate: '2026-01-10', bankName: 'HDFC Bank', accountNo: '*****9876', role: 'pharmacy_vendor', drugLicense: 'DL-20831/15' },
  { id: 2, name: 'Apothecary Labs', email: 'apothecary@gmail.com', phone: '9876500002', storeName: 'Apothecary Labs Biotech', status: 'pending', kyc: 'submitted', earnings: 0, commissionRate: 12, joinedDate: '2026-05-15', bankName: 'ICICI Bank', accountNo: '*****1234', role: 'lab_vendor', accreditationCode: 'NABL-MC-5412-A' },
  { id: 3, name: 'Medicare Essentials', email: 'medicare@gmail.com', phone: '9876500003', storeName: 'Medicare Lifeline', status: 'approved', kyc: 'verified', earnings: 82000, commissionRate: 8, joinedDate: '2026-03-05', bankName: 'SBI', accountNo: '*****5678', role: 'doctor_vendor', medicalRegNo: 'MCI-20831/A' },
  { id: 4, name: 'Himalayan Herbal Care', email: 'himalayan@gmail.com', phone: '9876500004', storeName: 'Himalayan Ayurvedic Remedies', status: 'pending', kyc: 'submitted', earnings: 0, commissionRate: 15, joinedDate: '2026-05-24', bankName: 'Axis Bank', accountNo: '*****4321', role: 'pharmacy_vendor', drugLicense: 'DL-90412/16' },
];

const mockUsers = [
  { id: 1, name: 'Ramesh Kumar', email: 'ramesh@gmail.com', phone: '9876543201', status: 'active', joinedDate: '2026-02-01', totalOrders: 14, spent: 8900 },
  { id: 2, name: 'Anoop Singh', email: 'anoop@gmail.com', phone: '9876543202', status: 'active', joinedDate: '2026-03-12', totalOrders: 5, spent: 3420 },
  { id: 3, name: 'Sunita Sharma', email: 'sunita@gmail.com', phone: '9876543203', status: 'blocked', joinedDate: '2026-01-20', totalOrders: 2, spent: 1100 },
  { id: 4, name: 'Vijay Chawla', email: 'vijay@gmail.com', phone: '9876543204', status: 'active', joinedDate: '2026-04-18', totalOrders: 8, spent: 5740 },
];

const mockCMS = {
  heroBanners: [
    { id: 1, title: 'Flat 25% Off on Ayurvedic Immunity Builders', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80', status: 'active' },
    { id: 2, title: 'Save Up to 50% on Diagnostic Packages', image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=1200&auto=format&fit=crop&q=80', status: 'active' },
  ],
  coupons: [
    { id: 1, code: 'HEALTH25', discount: '25% OFF', description: 'Applicable on all Ayurvedic medicines above ₹999', expiry: '2026-06-30' },
    { id: 2, code: 'LABTEST50', discount: '50% OFF', description: 'Applicable on full body wellness health checkups', expiry: '2026-07-15' },
    { id: 3, code: 'DOCFREE', discount: 'FREE FIRST CONSULT', description: 'Get 100% cashback on your first video doctor slot', expiry: '2026-08-31' },
  ],
  blogs: [
    { id: 1, title: '5 Herbs for Natural Immunity Strengthening', author: 'Dr. Archana Sen', status: 'published', date: '2026-05-20' },
    { id: 2, title: 'Understanding Liver Function Panels (LFT)', author: 'Dr. Nitin Verma', status: 'published', date: '2026-05-18' },
  ],
};

const initialState = {
  vendors: mockVendors,
  users: mockUsers,
  cms: mockCMS,
  commissionSetting: 10, // Global baseline commission percentage
  analytics: {
    totalRevenue: 227000,
    platformCommission: 22700,
    totalOrdersCount: 228,
    activeVendorsCount: 4,
    monthlySales: [
      { name: 'Jan', sales: 12000, orders: 18 },
      { name: 'Feb', sales: 28000, orders: 35 },
      { name: 'Mar', sales: 45000, orders: 52 },
      { name: 'Apr', sales: 67000, orders: 61 },
      { name: 'May', sales: 75000, orders: 62 },
    ]
  },
  recentActivities: [
    { id: 1, text: 'New vendor Himalayan Herbal Care submitted verification docs', time: '2 hours ago', type: 'vendor' },
    { id: 2, text: 'Customer Ramesh Kumar booked Complete Hemogram test', time: '4 hours ago', type: 'order' },
    { id: 3, text: 'Payout request of ₹45,000 processed for MedPlus Wellness Pharmacy', time: '1 day ago', type: 'payout' },
    { id: 4, text: 'Product Ashvagandha Tablets updated by Apothecary Labs', time: '1 day ago', type: 'catalog' }
  ]
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    approveVendor: (state, action) => {
      state.vendors = state.vendors.map(v => 
        v.id === action.payload ? { ...v, status: 'approved', kyc: 'verified' } : v
      );
      state.recentActivities.unshift({
        id: Date.now(),
        text: `Vendor ID ${action.payload} was approved and KYC documents verified`,
        time: 'Just now',
        type: 'vendor'
      });
    },
    rejectVendor: (state, action) => {
      state.vendors = state.vendors.map(v => 
        v.id === action.payload ? { ...v, status: 'rejected', kyc: 'rejected' } : v
      );
      state.recentActivities.unshift({
        id: Date.now(),
        text: `Vendor ID ${action.payload} registration was rejected`,
        time: 'Just now',
        type: 'vendor'
      });
    },
    updateCommissionRate: (state, action) => {
      const { vendorId, rate } = action.payload;
      state.vendors = state.vendors.map(v => 
        v.id === vendorId ? { ...v, commissionRate: rate } : v
      );
    },
    setGlobalCommission: (state, action) => {
      state.commissionSetting = action.payload;
    },
    toggleUserStatus: (state, action) => {
      state.users = state.users.map(u => 
        u.id === action.payload ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
      );
    },
    addCoupon: (state, action) => {
      const newCoupon = {
        id: Date.now(),
        ...action.payload
      };
      state.cms.coupons.push(newCoupon);
    },
    deleteCoupon: (state, action) => {
      state.cms.coupons = state.cms.coupons.filter(c => c.id !== action.payload);
    },
    addHeroBanner: (state, action) => {
      const newBanner = {
        id: Date.now(),
        ...action.payload,
        status: 'active'
      };
      state.cms.heroBanners.push(newBanner);
    },
    deleteVendor: (state, action) => {
      state.vendors = state.vendors.filter(v => v.id !== action.payload);
      state.recentActivities.unshift({
        id: Date.now(),
        text: `Vendor ID ${action.payload} was removed from the directory`,
        time: 'Just now',
        type: 'vendor'
      });
    },
    toggleBannerStatus: (state, action) => {
      state.cms.heroBanners = state.cms.heroBanners.map(b => 
        b.id === action.payload ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
      );
    }
  }
});

export const {
  approveVendor,
  rejectVendor,
  deleteVendor,
  updateCommissionRate,
  setGlobalCommission,
  toggleUserStatus,
  addCoupon,
  deleteCoupon,
  addHeroBanner,
  toggleBannerStatus
} = adminSlice.actions;

export default adminSlice.reducer;
