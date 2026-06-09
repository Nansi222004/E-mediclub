import { createSlice } from '@reduxjs/toolkit';

// Realistic mock data for Vendor (MedPlus Wellness Pharmacy)
const mockVendorProducts = [
  { id: 101, name: 'Paracetamol 650mg Tablets', price: 32, stock: 140, category: 'Allopathy', packSize: 'Strip of 15 tablets', discPercent: 10, status: 'active', sku: 'PR-90812', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' },
  { id: 102, name: 'Amoxicillin 500mg Capsules', price: 112, stock: 85, category: 'Allopathy', packSize: 'Strip of 10 capsules', discPercent: 12, status: 'active', sku: 'AM-44129', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&auto=format&fit=crop&q=80' },
  { id: 103, name: 'Organic Ashvagandha Daily Tablets', price: 299, stock: 12, category: 'Ayurveda', packSize: 'Bottle of 60 tablets', discPercent: 15, status: 'active', sku: 'AS-88123', image: 'https://images.unsplash.com/photo-1611070973770-b1a672610041?w=300&auto=format&fit=crop&q=80' },
  { id: 104, name: 'Chyawanprash Awaleha Immune', price: 380, stock: 24, category: 'Ayurveda', packSize: 'Jar of 500g', discPercent: 8, status: 'active', sku: 'CP-11002', image: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3c86?w=300&auto=format&fit=crop&q=80' },
  { id: 105, name: 'Baidyanath Shankhapushpi Syrup', price: 145, stock: 0, category: 'Ayurveda', packSize: 'Bottle of 200ml', discPercent: 5, status: 'active', sku: 'SP-33211', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&auto=format&fit=crop&q=80' },
  { id: 106, name: 'Accu-Chek Active Test Strips', price: 975, stock: 45, category: 'Devices', packSize: 'Pack of 50 strips', discPercent: 15, status: 'active', sku: 'AC-10023', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80' }
];

const mockVendorOrders = [
  {
    id: 'EM-OD-9081',
    customerName: 'Ramesh Kumar',
    items: 'Organic Ashvagandha x 2, Paracetamol x 1',
    totalAmount: 630,
    status: 'pending',
    date: '2026-05-26',
    phone: '9876543201',
    address: '12, Garden View, Link Road, Bandra West, Mumbai, MH - 400050',
    paymentStatus: 'paid',
    paymentMethod: 'UPI (PhonePe)',
    deliveryPartner: 'Delivery Express',
    timeline: [
      { status: 'Pending', time: '2026-05-26 10:15 AM', description: 'Order received and awaiting merchant validation.' }
    ]
  },
  {
    id: 'EM-OD-9065',
    customerName: 'Vijay Chawla',
    items: 'Chyawanprash Awaleha x 1',
    totalAmount: 304,
    status: 'shipped',
    date: '2026-05-25',
    phone: '9876543204',
    address: 'Plot 45, Tech Park, Sector V, Salt Lake, Kolkata, WB - 700091',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    deliveryPartner: 'Shadowfax Courier',
    timeline: [
      { status: 'Pending', time: '2026-05-25 09:00 AM', description: 'Order received and verified.' },
      { status: 'Confirmed', time: '2026-05-25 09:30 AM', description: 'Stock allocated and order confirmed.' },
      { status: 'Packed', time: '2026-05-25 11:15 AM', description: 'Order packed in sterile clinical container.' },
      { status: 'Shipped', time: '2026-05-25 02:45 PM', description: 'Handed over to Shadowfax. Tracking ID: SFX-9882103.' }
    ]
  },
  {
    id: 'EM-OD-8991',
    customerName: 'Anoop Singh',
    items: 'Amoxicillin 500mg x 2',
    totalAmount: 212,
    status: 'delivered',
    date: '2026-05-20',
    phone: '9876543202',
    address: 'Flat 5B, Skyline Tower, MG Road, Bangalore, KA - 560001',
    paymentStatus: 'paid',
    paymentMethod: 'Netbanking',
    deliveryPartner: 'Dunzo FastTrack',
    timeline: [
      { status: 'Pending', time: '2026-05-20 01:10 PM', description: 'Order received.' },
      { status: 'Confirmed', time: '2026-05-20 01:25 PM', description: 'Order confirmed.' },
      { status: 'Packed', time: '2026-05-20 02:00 PM', description: 'Order packed and sanitized.' },
      { status: 'Shipped', time: '2026-05-20 02:30 PM', description: 'Dispatched with partner Dunzo.' },
      { status: 'Delivered', time: '2026-05-20 03:05 PM', description: 'Successfully delivered to doorsteps.' }
    ]
  },
];

const mockVendorStocks = [
  { id: 401, name: 'Paracetamol 650mg Tablets', category: 'Allopathy', batchNumber: 'PR-90812', stock: 140, reservedStock: 15, soldUnits: 420, purchasePrice: 18, sellingPrice: 32, expiryDate: '2027-11-30', status: 'In Stock' },
  { id: 402, name: 'Amoxicillin 500mg Capsules', category: 'Allopathy', batchNumber: 'AM-44129', stock: 85, reservedStock: 8, soldUnits: 190, purchasePrice: 65, sellingPrice: 112, expiryDate: '2027-08-15', status: 'In Stock' },
  { id: 403, name: 'Organic Ashvagandha Daily Tablets', category: 'Ayurveda', batchNumber: 'AS-88123', stock: 12, reservedStock: 4, soldUnits: 80, purchasePrice: 150, sellingPrice: 299, expiryDate: '2026-12-31', status: 'Low Stock' },
  { id: 404, name: 'Chyawanprash Awaleha Immune', category: 'Ayurveda', batchNumber: 'CP-11002', stock: 24, reservedStock: 2, soldUnits: 110, purchasePrice: 210, sellingPrice: 380, expiryDate: '2027-05-20', status: 'In Stock' },
  { id: 405, name: 'Baidyanath Shankhapushpi Syrup', category: 'Ayurveda', batchNumber: 'SP-33211', stock: 0, reservedStock: 0, soldUnits: 50, purchasePrice: 85, sellingPrice: 145, expiryDate: '2026-04-10', status: 'Out of Stock' },
  { id: 406, name: 'Suhana Homeopathic Cough Syrup', category: 'Homeopathy', batchNumber: 'HC-00912', stock: 60, reservedStock: 5, soldUnits: 120, purchasePrice: 40, sellingPrice: 75, expiryDate: '2027-01-22', status: 'In Stock' },
  { id: 407, name: 'Accu-Chek Active Test Strips', category: 'Devices', batchNumber: 'AC-10023', stock: 45, reservedStock: 3, soldUnits: 300, purchasePrice: 650, sellingPrice: 975, expiryDate: '2028-03-15', status: 'In Stock' },
  { id: 408, name: 'Dettol Antiseptic Liquid 500ml', category: 'OTC', batchNumber: 'DT-55210', stock: 8, reservedStock: 2, soldUnits: 450, purchasePrice: 120, sellingPrice: 198, expiryDate: '2028-10-31', status: 'Low Stock' },
];

const mockVendorLabTests = [
  { id: 201, name: 'Basic Fever Checkup Panel', price: 499, description: 'Covers Malaria, Dengue, CBC, and Widal test parameters.', durationHours: 24 },
  { id: 202, name: 'Advanced Kidney Panel (KFT)', price: 799, description: 'Covers Urea, Creatinine, Uric acid, and full Electrolytes.', durationHours: 12 },
];

const mockAppointments = [
  { id: 301, patientName: 'Rohan Joshi', doctorName: 'Dr. Archana Sen (Orthopedics)', slot: '10:30 AM - 11:00 AM', date: '2026-05-27', status: 'confirmed' },
  { id: 302, patientName: 'Meera Deshmukh', doctorName: 'Dr. Archana Sen (Orthopedics)', slot: '04:00 PM - 04:30 PM', date: '2026-05-27', status: 'pending' },
];

const mockWithdrawals = [
  { id: 'W-009', amount: 45000, date: '2026-05-24', status: 'approved', bankAccount: 'HDFC Bank - ****9876' },
  { id: 'W-008', amount: 30000, date: '2026-04-12', status: 'approved', bankAccount: 'HDFC Bank - ****9876' },
  { id: 'W-010', amount: 15000, date: '2026-05-26', status: 'pending', bankAccount: 'HDFC Bank - ****9876' },
];

const initialState = {
  products: mockVendorProducts,
  orders: mockVendorOrders,
  stocks: mockVendorStocks,
  labTests: mockVendorLabTests,
  appointments: mockAppointments,
  withdrawals: mockWithdrawals,
  doctors: [
    { id: 301, name: 'Dr. Archana Sen', specialty: 'Orthopedics', hospital: 'MedPlus Wellness Center', experience: '15 Years', fee: 500, qualification: 'MBBS, MD', status: 'approved', bio: 'Dedicated clinical medical professional.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
    { id: 302, name: 'Dr. Nitin Verma', specialty: 'General Physician', hospital: 'MedPlus Wellness Center', experience: '12 Years', fee: 600, qualification: 'MBBS, MD', status: 'approved', bio: 'Dedicated clinical medical professional.', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' }
  ],
  medicineCategories: ['Allopathy', 'Ayurveda', 'Homeopathy', 'Wellness', 'OTC', 'Surgical', 'Devices', 'Supplements'],
  doctorSpecialties: ['Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Neurologist', 'General Physician'],
  labCategories: ['Blood Test', 'Thyroid', 'Diabetes', 'Full Body Checkup', 'Vitamin Tests', 'Urine Test'],
  kycDetails: {
    status: 'verified',
    storeName: 'MedPlus Wellness Pharmacy',
    gstNumber: '27AAAAA1111A1Z1',
    drugLicense: 'DL-20831/15',
    panNumber: 'ABCDE1234F',
    bankName: 'HDFC Bank',
    accountHolder: 'MedPlus Wellness Retail Corp',
    accountNo: '501000987654',
    ifscCode: 'HDFC0000012',
    branch: 'Linking Road, Bandra W, Mumbai'
  },
  analytics: {
    totalRevenue: 84200,
    salesTarget: 100000,
    ordersCount: 48,
    activeProductsCount: 12,
    weeklySales: [
      { day: 'Mon', sales: 4200 },
      { day: 'Tue', sales: 6800 },
      { day: 'Wed', sales: 9100 },
      { day: 'Thu', sales: 7400 },
      { day: 'Fri', sales: 11200 },
      { day: 'Sat', sales: 14500 },
      { day: 'Sun', sales: 12000 }
    ]
  }
};

const getStockStatus = (qty) => {
  if (qty <= 0) return 'Out of Stock';
  if (qty < 20) return 'Low Stock';
  return 'In Stock';
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newId = Date.now();
      state.products.push({
        id: newId,
        ...action.payload,
        status: 'active'
      });
      state.analytics.activeProductsCount += 1;

      // Implicitly add to stocks array to keep inventory sync
      state.stocks.push({
        id: newId + 1000,
        name: action.payload.name,
        category: action.payload.category || 'Allopathy',
        batchNumber: `BT-${Math.floor(10000 + Math.random() * 90000)}`,
        stock: Number(action.payload.stock) || 0,
        reservedStock: 0,
        soldUnits: 0,
        purchasePrice: Math.round((Number(action.payload.price) || 0) * 0.6),
        sellingPrice: Number(action.payload.price) || 0,
        expiryDate: action.payload.expiryDate || '2028-12-31',
        status: getStockStatus(Number(action.payload.stock) || 0)
      });
    },
    editProduct: (state, action) => {
      state.products = state.products.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.analytics.activeProductsCount = Math.max(0, state.analytics.activeProductsCount - 1);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      state.orders = state.orders.map(o => {
        if (o.id === orderId) {
          const currentTimeline = [...o.timeline];
          // Avoid duplicate statuses in timeline
          if (!currentTimeline.some(t => t.status.toLowerCase() === status.toLowerCase())) {
            let desc = `Order marked as ${status}.`;
            if (status === 'confirmed') desc = 'Stock allocated and order confirmed.';
            if (status === 'packed') desc = 'Order packed in sterile clinical container.';
            if (status === 'shipped') desc = `Order dispatched with tracking partner: ${o.deliveryPartner || 'Express Courier'}`;
            if (status === 'delivered') desc = 'Successfully delivered to customer doorsteps.';
            if (status === 'cancelled') desc = 'Order cancelled by merchant/customer.';

            currentTimeline.push({
              status: status.charAt(0).toUpperCase() + status.slice(1),
              time: new Date().toISOString().replace('T', ' ').substring(0, 19),
              description: desc
            });
          }
          return { ...o, status, timeline: currentTimeline };
        }
        return o;
      });
    },
    addLabTest: (state, action) => {
      state.labTests.push({
        id: Date.now(),
        ...action.payload
      });
    },
    editAppointmentStatus: (state, action) => {
      const { id, status } = action.payload;
      state.appointments = state.appointments.map(a =>
        a.id === id ? { ...a, status } : a
      );
    },
    requestWithdrawal: (state, action) => {
      state.withdrawals.unshift({
        id: `W-0${state.withdrawals.length + 10}`,
        amount: action.payload,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        bankAccount: `${state.kycDetails.bankName} - ****${state.kycDetails.accountNo.slice(-4)}`
      });
    },
    updateKycDetails: (state, action) => {
      state.kycDetails = {
        ...state.kycDetails,
        ...action.payload,
        status: 'submitted'
      };
    },
    // Stocks mutations
    addStockBatch: (state, action) => {
      state.stocks.unshift({
        id: Date.now(),
        ...action.payload,
        status: getStockStatus(action.payload.stock)
      });
    },
    editStockBatch: (state, action) => {
      state.stocks = state.stocks.map(s => {
        if (s.id === action.payload.id) {
          const updated = { ...s, ...action.payload };
          updated.status = getStockStatus(updated.stock);
          return updated;
        }
        return s;
      });
    },
    increaseStockQuantity: (state, action) => {
      const { id, amount } = action.payload;
      state.stocks = state.stocks.map(s => {
        if (s.id === id) {
          const newQty = s.stock + amount;
          return { ...s, stock: newQty, status: getStockStatus(newQty) };
        }
        return s;
      });
    },
    reduceStockQuantity: (state, action) => {
      const { id, amount } = action.payload;
      state.stocks = state.stocks.map(s => {
        if (s.id === id) {
          const newQty = Math.max(0, s.stock - amount);
          return { ...s, stock: newQty, status: getStockStatus(newQty) };
        }
        return s;
      });
    },
    markStockExpired: (state, action) => {
      const id = action.payload;
      state.stocks = state.stocks.map(s => {
        if (s.id === id) {
          return { ...s, stock: 0, status: 'Expired', expiryDate: new Date().toISOString().split('T')[0] };
        }
        return s;
      });
    },
    deleteStockBatch: (state, action) => {
      state.stocks = state.stocks.filter(s => s.id !== action.payload);
    },
    adjustProductStock: (state, action) => {
      const { id, amount, type } = action.payload;
      state.products = state.products.map(p => {
        if (p.id === id) {
          const change = Number(amount) || 0;
          const newQty = type === 'restock' ? p.stock + change : Math.max(0, p.stock - change);
          return { ...p, stock: newQty };
        }
        return p;
      });
      state.stocks = state.stocks.map(s => {
        if (s.id === id || s.id === id + 1000) {
          const change = Number(amount) || 0;
          const newQty = type === 'restock' ? s.stock + change : Math.max(0, s.stock - change);
          return { ...s, stock: newQty, status: getStockStatus(newQty) };
        }
        return s;
      });
    },
    addMedicineCategory: (state, action) => {
      if (!state.medicineCategories.includes(action.payload)) {
        state.medicineCategories.push(action.payload);
      }
    },
    addDoctorSpecialty: (state, action) => {
      if (!state.doctorSpecialties.includes(action.payload)) {
        state.doctorSpecialties.push(action.payload);
      }
    },
    addLabCategory: (state, action) => {
      if (!state.labCategories.includes(action.payload)) {
        state.labCategories.push(action.payload);
      }
    },
    addDoctor: (state, action) => {
      state.doctors.push({
        id: Date.now(),
        status: 'approved',
        ...action.payload
      });
    },
    deleteDoctor: (state, action) => {
      state.doctors = state.doctors.filter(d => d.id !== action.payload);
    },
    deleteLabTest: (state, action) => {
      state.labTests = state.labTests.filter(l => l.id !== action.payload);
    }
  }
});

export const {
  addProduct,
  editProduct,
  deleteProduct,
  updateOrderStatus,
  addLabTest,
  editAppointmentStatus,
  requestWithdrawal,
  updateKycDetails,
  addStockBatch,
  editStockBatch,
  increaseStockQuantity,
  reduceStockQuantity,
  markStockExpired,
  deleteStockBatch,
  adjustProductStock,
  addMedicineCategory,
  addDoctorSpecialty,
  addLabCategory,
  addDoctor,
  deleteDoctor,
  deleteLabTest
} = vendorSlice.actions;

export default vendorSlice.reducer;
