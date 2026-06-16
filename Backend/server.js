require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.error('Failed to set custom DNS servers:', e.message);
}
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes = require('./routes/userRoutes');
const locationRoutes = require('./routes/locationRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const labsRoutes = require('./routes/labsRoutes');
const productsRoutes = require('./routes/productsRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const User = require('./models/User');

const app = express();

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'https://e-mediclub-vert.vercel.app',
    'https://e-mediclub-git-main-harshita845s-projects.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom lightweight Cookie Parser Middleware
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts[0] && parts[1]) {
        req.cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
      }
    });
  }
  next();
});

// Seed Initial Data (Helper)
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Seeding default demo accounts...');

      // Default Admin
      await User.create({
        name: 'Demo Admin',
        phone: '9999999999',
        email: 'admin@emediclub.com',
        password: 'admin123',
        role: 'admin',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        profile: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      });

      // Default Vendor
      await User.create({
        name: 'Demo Vendor Store',
        phone: '8888888888',
        email: 'vendor@emediclub.com',
        password: 'vendor123',
        role: 'vendor',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        profile: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      });

      // Default Standard User
      await User.create({
        name: 'Demo Customer',
        phone: '7777777777',
        email: 'user@emediclub.com',
        password: 'user123',
        role: 'user',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        profile: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      });

      // Indore Standard User
      await User.create({
        name: 'Indore Patient 1',
        phone: '7777700001',
        email: 'indore_pat1@emediclub.com',
        password: 'user123',
        role: 'user',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        profile: { city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' }
      });

      console.log('Demo accounts seeded successfully.');
    }

    // Seed specific Multi-Vendor role demo accounts if they do not exist
    const pharmacyExists = await User.findOne({ email: 'pharmacy@emediclub.com' });
    if (!pharmacyExists) {
      await User.create({
        name: 'City Pharmacy',
        phone: '8888888889',
        email: 'pharmacy@emediclub.com',
        password: 'Pharmacy@123',
        role: 'pharmacy_vendor',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        profile: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
      });
      console.log('Seeded City Pharmacy (pharmacy@emediclub.com / Pharmacy@123)');
    }

    const labExists = await User.findOne({ email: 'lab@emediclub.com' });
    if (!labExists) {
      await User.create({
        name: 'Diagnostics Lab',
        phone: '8888888890',
        email: 'lab@emediclub.com',
        password: 'Lab@123',
        role: 'lab_vendor',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        profile: { city: 'Pune', state: 'Maharashtra', pincode: '411001' }
      });
      console.log('Seeded Diagnostics Lab (lab@emediclub.com / Lab@123)');
    }

    const doctorExists = await User.findOne({ email: 'doctor@emediclub.com' });
    if (!doctorExists) {
      await User.create({
        name: 'Dr. Ramesh (General Physician)',
        phone: '8888888891',
        email: 'doctor@emediclub.com',
        password: 'Doctor@123',
        role: 'doctor_vendor',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        profile: { city: 'Delhi', state: 'Delhi', pincode: '110001' }
      });
      console.log('Seeded Dr. Ramesh (doctor@emediclub.com / Doctor@123)');
    }

    const indoreVendorExists = await User.findOne({ email: 'indore_vendor@emediclub.com' });
    if (!indoreVendorExists) {
      await User.create({
        name: 'Indore Medical Services',
        phone: '8888800001',
        email: 'indore_vendor@emediclub.com',
        password: 'Vendor@123',
        role: 'pharmacy_vendor',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452010',
        profile: { city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' }
      });
      console.log('Seeded Indore Pharmacy Vendor');
    }

  } catch (err) {
    console.error(`Seeding error: ${err.message}`);
  }
};

const seedMockData = async () => {
  try {
    const Doctor = require('./models/Doctor');
    const Lab = require('./models/Lab');
    const Product = require('./models/Product');

    console.log('Seeding mock database conditionally...');

    const cities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
      'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Indore', 'Bhopal',
      'Ujjain', 'Dewas', 'Ratlam', 'Jabalpur', 'Gwalior', 'Sagar',
      'Satna', 'Rewa', 'Chhindwara', 'Vidisha', 'Hoshangabad',
      'Nagpur', 'Nashik', 'Aurangabad', 'Kolhapur', 'Solapur'
    ];

    const cityDefaults = {
      'Mumbai': { pincode: '400001', state: 'Maharashtra' },
      'Delhi': { pincode: '110001', state: 'Delhi' },
      'Bangalore': { pincode: '560001', state: 'Karnataka' },
      'Chennai': { pincode: '600001', state: 'Tamil Nadu' },
      'Hyderabad': { pincode: '500001', state: 'Telangana' },
      'Pune': { pincode: '411001', state: 'Maharashtra' },
      'Kolkata': { pincode: '700001', state: 'West Bengal' },
      'Ahmedabad': { pincode: '380001', state: 'Gujarat' },
      'Jaipur': { pincode: '302001', state: 'Rajasthan' },
      'Surat': { pincode: '395003', state: 'Gujarat' },
      'Indore': { pincode: '452010', state: 'Madhya Pradesh' },
      'Bhopal': { pincode: '462001', state: 'Madhya Pradesh' },
      'Ujjain': { pincode: '456010', state: 'Madhya Pradesh' },
      'Dewas': { pincode: '455001', state: 'Madhya Pradesh' },
      'Ratlam': { pincode: '457001', state: 'Madhya Pradesh' },
      'Jabalpur': { pincode: '482001', state: 'Madhya Pradesh' },
      'Gwalior': { pincode: '474001', state: 'Madhya Pradesh' },
      'Sagar': { pincode: '470001', state: 'Madhya Pradesh' },
      'Satna': { pincode: '485001', state: 'Madhya Pradesh' },
      'Rewa': { pincode: '486001', state: 'Madhya Pradesh' },
      'Chhindwara': { pincode: '480001', state: 'Madhya Pradesh' },
      'Vidisha': { pincode: '464001', state: 'Madhya Pradesh' },
      'Hoshangabad': { pincode: '461001', state: 'Madhya Pradesh' },
      'Nagpur': { pincode: '440001', state: 'Maharashtra' },
      'Nashik': { pincode: '422001', state: 'Maharashtra' },
      'Aurangabad': { pincode: '431001', state: 'Maharashtra' },
      'Kolhapur': { pincode: '416001', state: 'Maharashtra' },
      'Solapur': { pincode: '413001', state: 'Maharashtra' }
    };

    const maleAvatars = [
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80"
    ];

    const femaleAvatars = [
      "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1622960210737-535d218274ac?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=300&q=80"
    ];

    const labLogos = [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=150&h=150&q=80"
    ];

    const labGalleries = [
      [
        "https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80"
      ],
      [
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80"
      ]
    ];

    const specialties = [
      { name: "General Physician", sub: "Internal Medicine", qual: "MBBS, MD" },
      { name: "Dermatology", sub: "Cosmetic Dermatology", qual: "MBBS, MD" },
      { name: "Gynaecology & Obstetrics", sub: "Women's Health", qual: "MBBS, MS" },
      { name: "Orthopaedics", sub: "Bone & Joint Specialist", qual: "MBBS, MS" },
      { name: "Cardiology", sub: "Heart Specialist", qual: "MBBS, DM" },
      { name: "Paediatrics", sub: "Child Care", qual: "MBBS, DCH" },
      { name: "Neurology", sub: "Brain & Spine Specialist", qual: "MBBS, DM" },
      { name: "ENT", sub: "Ear, Nose & Throat", qual: "MBBS, MS" },
      { name: "Ophthalmology", sub: "Eye Specialist", qual: "MBBS, MS" },
      { name: "Psychiatry", sub: "Mental Health", qual: "MBBS, MD" }
    ];

    const maleNames = ["Aarav", "Kabir", "Rohan", "Suresh", "Aditya", "Vikram", "Rajesh", "Sameer", "Arjun", "Amit"];
    const femaleNames = ["Priya", "Kavita", "Anjali", "Nisha", "Pooja", "Meena", "Sunita", "Shalini", "Anita", "Divya"];
    const lastNames = ["Sharma", "Gupta", "Verma", "Singh", "Patel", "Joshi", "Agarwal", "Dave", "Khanna", "Malhotra"];

    const labNames = [
      "Diagnostics", "Pathlabs", "Imaging & Diagnostic Centre", "Clinical Laboratories", "Metropolis Clinic", "Apollo Diagnostics"
    ];
    const prefixes = [
      "LifeCare", "Apex", "Niramaya", "Metropolis", "Sanjivani", "HealthCare", "MedPath", "Thyrocare"
    ];

    const productTemplates = [
      // Sun Pharmaceutical Industries Ltd
      { name: 'Revital H Capsule', category: 'Wellness', brand: 'Sun Pharmaceutical Industries Ltd', price: 310, discountPrice: 263, discountPercent: 15, packSize: 'Bottle of 30 capsules', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Volini Pain Relief Spray', category: 'Medicines', brand: 'Sun Pharmaceutical Industries Ltd', price: 160, discountPrice: 136, discountPercent: 15, packSize: 'Can of 55 g', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Suncros Aqua Lotion', category: 'Wellness', brand: 'Sun Pharmaceutical Industries Ltd', price: 350, discountPrice: 300, discountPercent: 14, packSize: 'Bottle of 50ml', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80' },

      // Micro Labs Ltd
      { name: 'Dolo 650 Tablet', category: 'Medicines', brand: 'Micro Labs Ltd', price: 34, discountPrice: 28, discountPercent: 18, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tenepride M 1000', category: 'Diabetes Care', brand: 'Micro Labs Ltd', price: 180, discountPrice: 150, discountPercent: 16, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Amlong 5 Tablet', category: 'Medicines', brand: 'Micro Labs Ltd', price: 65, discountPrice: 55, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },

      // Roche Diabetes Care
      { name: 'Accu-Chek Active Test Strips', category: 'Health Devices', brand: 'Roche Diabetes Care', price: 975, discountPrice: 875, discountPercent: 10, packSize: 'Box of 50 strips', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80' },
      { name: 'Accu-Chek Instant Glucometer', category: 'Health Devices', brand: 'Roche Diabetes Care', price: 1500, discountPrice: 1250, discountPercent: 16, packSize: '1 Kit', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80' },
      { name: 'Accu-Chek Softclix Lancets', category: 'Health Devices', brand: 'Roche Diabetes Care', price: 200, discountPrice: 180, discountPercent: 10, packSize: 'Box of 25 lancets', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80' },

      // Dabur India Ltd
      { name: 'Chyawanprash Awaleha', category: 'Ayurveda', brand: 'Dabur India Ltd', price: 495, discountPrice: 420, discountPercent: 15, packSize: 'Tub of 1 kg', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
      { name: 'Honey Squeezy', category: 'Ayurveda', brand: 'Dabur India Ltd', price: 250, discountPrice: 220, discountPercent: 12, packSize: 'Bottle of 400g', image: 'https://images.unsplash.com/photo-1587049352847-4d4b12630252?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pudin Hara Pearls', category: 'Ayurveda', brand: 'Dabur India Ltd', price: 55, discountPrice: 48, discountPercent: 12, packSize: 'Strip of 10 pearls', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },

      // Koye Pharmaceuticals
      { name: 'Celin 500 Vitamin C Tablet', category: 'Wellness', brand: 'Koye Pharmaceuticals', price: 45, discountPrice: 38, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },
      { name: 'Zincovit Tablet', category: 'Wellness', brand: 'Koye Pharmaceuticals', price: 105, discountPrice: 90, discountPercent: 14, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },
      { name: 'Calcimax 500', category: 'Wellness', brand: 'Koye Pharmaceuticals', price: 135, discountPrice: 115, discountPercent: 14, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },

      // GlaxoSmithKline
      { name: 'Crocin Advance Tablet', category: 'Medicines', brand: 'GlaxoSmithKline', price: 42, discountPrice: 36, discountPercent: 14, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sensodyne Repair & Protect', category: 'Wellness', brand: 'GlaxoSmithKline', price: 210, discountPrice: 185, discountPercent: 11, packSize: 'Tube of 100g', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80' },
      { name: 'Iodex Balm', category: 'Medicines', brand: 'GlaxoSmithKline', price: 75, discountPrice: 65, discountPercent: 13, packSize: 'Bottle of 40g', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80' },

      // Alkem Laboratories
      { name: 'Pan-D Tablet', category: 'Medicines', brand: 'Alkem Laboratories', price: 65, discountPrice: 55, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Taxim O 200 Tablet', category: 'Medicines', brand: 'Alkem Laboratories', price: 110, discountPrice: 95, discountPercent: 13, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Clavam 625 Tablet', category: 'Medicines', brand: 'Alkem Laboratories', price: 200, discountPrice: 170, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },

      // Sanofi India Ltd
      { name: 'Allegra 120mg Tablet', category: 'Medicines', brand: 'Sanofi India Ltd', price: 95, discountPrice: 80, discountPercent: 16, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Combiflam Tablet', category: 'Medicines', brand: 'Sanofi India Ltd', price: 45, discountPrice: 38, discountPercent: 15, packSize: 'Strip of 20 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Dulcolax Tablet', category: 'Medicines', brand: 'Sanofi India Ltd', price: 50, discountPrice: 42, discountPercent: 16, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },

      // Alembic Pharmaceuticals
      { name: 'Azithral 500mg Tablet', category: 'Medicines', brand: 'Alembic Pharmaceuticals', price: 85, discountPrice: 72, discountPercent: 15, packSize: 'Strip of 3 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Udiliv 300 Tablet', category: 'Medicines', brand: 'Alembic Pharmaceuticals', price: 480, discountPrice: 420, discountPercent: 12, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Wikoryl Tablet', category: 'Medicines', brand: 'Alembic Pharmaceuticals', price: 65, discountPrice: 55, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },

      // Himalaya Drug Company
      { name: 'Liv 52 Syrup', category: 'Ayurveda', brand: 'Himalaya Drug Company', price: 185, discountPrice: 158, discountPercent: 15, packSize: 'Bottle of 200ml', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
      { name: 'Cystone Tablet', category: 'Ayurveda', brand: 'Himalaya Drug Company', price: 160, discountPrice: 135, discountPercent: 15, packSize: 'Bottle of 60 tablets', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
      { name: 'Septilin Tablet', category: 'Ayurveda', brand: 'Himalaya Drug Company', price: 140, discountPrice: 120, discountPercent: 14, packSize: 'Bottle of 60 tablets', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },

      // Lupin Ltd
      { name: 'Shelcal 500 Tablet', category: 'Wellness', brand: 'Lupin Ltd', price: 125, discountPrice: 106, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },
      { name: 'Tonact 20 Tablet', category: 'Medicines', brand: 'Lupin Ltd', price: 160, discountPrice: 140, discountPercent: 12, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Telekast L Tablet', category: 'Medicines', brand: 'Lupin Ltd', price: 210, discountPrice: 180, discountPercent: 14, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },

      // Bayer India
      { name: 'Aspirin 500mg Tablet', category: 'Medicines', brand: 'Bayer India', price: 55, discountPrice: 46, discountPercent: 16, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Saridon Advance', category: 'Medicines', brand: 'Bayer India', price: 35, discountPrice: 30, discountPercent: 14, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Supradyn Daily Multivitamin', category: 'Wellness', brand: 'Bayer India', price: 65, discountPrice: 55, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },

      // Cipla Ltd
      { name: 'Ibuprofen 400mg Tablet', category: 'Medicines', brand: 'Cipla Ltd', price: 48, discountPrice: 41, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Foracort 200 Inhaler', category: 'Respiratory Care', brand: 'Cipla Ltd', price: 350, discountPrice: 310, discountPercent: 11, packSize: '1 Inhaler', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Montair LC Tablet', category: 'Medicines', brand: 'Cipla Ltd', price: 185, discountPrice: 160, discountPercent: 13, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' }
    ];

    for (let cIdx = 0; cIdx < cities.length; cIdx++) {
      const city = cities[cIdx];
      const defaults = cityDefaults[city];

      // 1. Doctors Seeding
      const docCount = await Doctor.countDocuments({ city });
      if (docCount === 0) {
        const doctorsToCreate = [];
        for (let i = 0; i < 6; i++) {
          const isFemale = i % 2 === 0;
          const firstName = isFemale ? femaleNames[(cIdx * 6 + i) % femaleNames.length] : maleNames[(cIdx * 6 + i) % maleNames.length];
          const lastName = lastNames[(cIdx * 6 + i) % lastNames.length];
          const name = `Dr. ${firstName} ${lastName}`;
          const spec = specialties[i % specialties.length];
          const fee = 249 + (i * 50);
          const expVal = 8 + (i * 2);

          doctorsToCreate.push({
            id: `doc-${city.toLowerCase().replace(/\s/g, '').slice(0, 4)}-${cIdx}-${i + 1}`,
            name,
            specialty: spec.name,
            subSpecialty: spec.sub,
            qualification: spec.qual,
            experience: `${expVal} Years Experience`,
            hospital: `${city} City Hospital`,
            fee,
            offlineFee: fee * 1.5,
            rating: Number((4.4 + (i * 0.1)).toFixed(1)),
            reviewsCount: 50 + (i * 35),
            consultationMode: "Both",
            registrationNumber: `MCI-${2010 + i}-${10000 + cIdx * 6 + i}`,
            bio: `${name} is a dedicated ${spec.name} specialist in ${city} with over ${expVal} years of clinical expertise.`,
            avatar: isFemale
              ? femaleAvatars[i % femaleAvatars.length]
              : maleAvatars[i % maleAvatars.length],
            languages: ["Hindi", "English"],
            availableDays: ["Mon", "Wed", "Fri"],
            timeSlots: ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
            testimonials: [],
            online: true,
            availability: `Available Mon, Wed & Fri (10:00 AM - 05:00 PM)`,
            city,
            pincode: defaults.pincode,
            state: defaults.state,
            address: `${city} General Hospital, Main Road, ${city}`
          });
        }
        await Doctor.create(doctorsToCreate);
        console.log(`Seeded 6 doctors for ${city}.`);
      }

      // 2. Labs Seeding
      const labCount = await Lab.countDocuments({ city });
      if (labCount === 0) {
        const labsToCreate = [];
        const specificLabNames = [
          "SRL Diagnostics",
          "Dr Lal PathLabs",
          "Thyrocare",
          "Redcliffe Labs"
        ];

        for (let i = 0; i < 9; i++) {
          let name;
          if (i < specificLabNames.length) {
            name = `${specificLabNames[i]} - ${city}`;
          } else {
            const prefix = prefixes[(cIdx * 5 + i) % prefixes.length];
            const suffix = labNames[i % labNames.length];
            name = `${prefix} ${suffix}`;
          }

          labsToCreate.push({
            id: `lab-${city.toLowerCase().slice(0, 3)}-${i + 1}`,
            name,
            logo: labLogos[i % labLogos.length],
            regNumber: `REG-LAB-${10000 + cIdx * 9 + i}`,
            nablCertified: i % 2 === 0,
            isoCertified: true,
            experience: `${8 + i} Years`,
            address: `${name}, Main Road, ${city}`,
            city,
            pincode: defaults.pincode,
            state: defaults.state,
            homeCollection: true,
            timings: "07:00 AM - 08:00 PM",
            rating: Number((4.3 + (i * 0.08)).toFixed(1)),
            reviewsCount: 40 + (i * 25),
            testsCount: 15 + (i * 5),
            gallery: labGalleries[i % labGalleries.length],
            reviews: []
          });
        }
        await Lab.create(labsToCreate);
        console.log(`Seeded 9 labs for ${city}.`);
      }

      // 3. Products Seeding
      const prodCount = await Product.countDocuments({ vendorCity: city });
      if (prodCount === 0) {
        const productsToCreate = [];
        productTemplates.forEach((template, prodIdx) => {
          productsToCreate.push({
            id: `med-${city.toLowerCase().slice(0, 3)}-${prodIdx + 1}`,
            name: template.name,
            category: template.category,
            brand: template.brand,
            price: template.price,
            discountPrice: template.discountPrice,
            discountPercent: template.discountPercent,
            packSize: template.packSize,
            image: template.image,
            vendorCity: city,
            vendorPincode: defaults.pincode,
            vendorState: defaults.state
          });
        });
        await Product.create(productsToCreate);
        console.log(`Seeded 6 products for ${city}.`);
      }
    }

    // Seed Orders
    const Order = require('./models/Order');
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create([
        { id: 'EM-OD-9081', customerName: 'Ramesh Kumar', items: 'Organic Ashvagandha Daily Tablets x 2, Paracetamol 650mg x 1', totalAmount: 630, status: 'pending', date: '2026-05-26', email: 'ramesh@gmail.com', phone: '9876543201', address: '12, Garden View, Link Road, Bandra, Mumbai, MH - 400050', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { id: 'EM-OD-9065', customerName: 'Vijay Chawla', items: 'Chyawanprash Awaleha Immune x 1', totalAmount: 304, status: 'shipped', date: '2026-05-25', email: 'vijay@gmail.com', phone: '9876543204', address: 'Plot 45, Tech Park, Sector V, Salt Lake, New Delhi, DL - 110001', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { id: 'EM-OD-8991', customerName: 'Anoop Singh', items: 'Amoxicillin 500mg Capsules x 2', totalAmount: 212, status: 'delivered', date: '2026-05-20', email: 'anoop@gmail.com', phone: '9876543202', address: '12, Garden View, Link Road, Bandra, Mumbai, MH - 400050', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { id: 'EM-OD-8772', customerName: 'Sunita Sharma', items: 'Multivitamins Daily Care x 1', totalAmount: 450, status: 'cancelled', date: '2026-05-18', email: 'sunita@gmail.com', phone: '9876543203', address: 'Apartment 34, City Heights, Sector 62, Gurgaon, HR - 122001', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { id: 'EM-OD-7712', customerName: 'Indore Patient 1', items: 'Crocin Advance Tablet x 3', totalAmount: 120, status: 'delivered', date: '2026-06-01', email: 'indore1@gmail.com', phone: '9999900001', address: 'Scheme 54, Vijay Nagar, Indore, MP - 452010', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' },
        { id: 'EM-OD-7713', customerName: 'Indore Patient 2', items: 'Revital H Capsule x 1', totalAmount: 310, status: 'pending', date: '2026-06-02', email: 'indore2@gmail.com', phone: '9999900002', address: 'Geeta Bhawan, Indore, MP - 452001', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' }
      ]);
      console.log('Seeded mock orders successfully.');
    }

    // Seed Appointments
    const Appointment = require('./models/Appointment');
    const appointmentCount = await Appointment.countDocuments();
    if (appointmentCount === 0) {
      await Appointment.create([
        { id: 'APT-1001', doctorName: 'Dr. Ramesh Gupta', specialty: 'General Physician', patientName: 'Rajesh Kumar', date: '2026-06-03', timeSlot: '10:00 AM', type: 'Video', status: 'confirmed', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { id: 'APT-1002', doctorName: 'Dr. Archana Sen', specialty: 'Dermatologist', patientName: 'Priya Patel', date: '2026-06-04', timeSlot: '11:00 AM', type: 'In-Clinic', status: 'pending', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { id: 'APT-1003', doctorName: 'Dr. Nitin Verma', specialty: 'Pediatrician', patientName: 'Anoop Singh', date: '2026-06-05', timeSlot: '02:00 PM', type: 'Video', status: 'completed', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        { id: 'APT-1004', doctorName: 'Dr. Sameer Patel', specialty: 'General Physician', patientName: 'Indore Patient 1', date: '2026-06-06', timeSlot: '04:00 PM', type: 'Video', status: 'confirmed', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' }
      ]);
      console.log('Seeded mock appointments successfully.');
    }

    // Seed Lab Bookings
    const LabBooking = require('./models/LabBooking');
    const labBookingCount = await LabBooking.countDocuments();
    if (labBookingCount === 0) {
      await LabBooking.create([
        { id: 'LAB-1001', packageName: 'Complete Blood Count', address: '12, Link Road, Mumbai', price: 499, status: 'confirmed', date: '2026-06-03', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { id: 'LAB-1002', packageName: 'Liver Function Test', address: 'Plot 45, Salt Lake, Delhi', price: 799, status: 'pending', date: '2026-06-04', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { id: 'LAB-1003', packageName: 'Thyroid Profile', address: 'Vijay Nagar, Indore', price: 599, status: 'completed', date: '2026-06-05', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' }
      ]);
      console.log('Seeded mock lab bookings successfully.');
    }

    console.log('Conditionally seeded mock data successfully.');
  } catch (err) {
    console.error(`Seed mock data error: ${err.message}`);
  }
};

// Run Seeder
const seedAll = async () => {
  await seedUsers();
  await seedMockData();
};
seedAll();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "E Mediclub API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      doctors: "/api/doctors",
      labs: "/api/labs",
      products: "/api/products",
      health: "/api/health"
    }
  });
});

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});


// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// trigger reload
