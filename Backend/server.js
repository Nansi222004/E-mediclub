require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.error('Failed to set custom DNS servers:', e.message);
}
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
const errorHandler = require('./middleware/errorMiddleware');
const User = require('./models/User');

const app = express();

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
      });

      // Default Vendor
      await User.create({
        name: 'Demo Vendor Store',
        phone: '8888888888',
        email: 'vendor@emediclub.com',
        password: 'vendor123',
        role: 'vendor',
      });

      // Default Standard User
      await User.create({
        name: 'Demo Customer',
        phone: '7777777777',
        email: 'user@emediclub.com',
        password: 'user123',
        role: 'user',
      });

      console.log('Demo accounts seeded successfully:');
      console.log('- Admin: Phone 9999999999, Password: admin123');
      console.log('- Vendor: Phone 8888888888, Password: vendor123');
      console.log('- User: Phone 7777777777, Password: user123');
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
      });
      console.log('Seeded Dr. Ramesh (doctor@emediclub.com / Doctor@123)');
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
      { name: 'Revital H Capsule', category: 'Wellness', brand: 'Sun Pharmaceutical Industries Ltd', price: 310, discountPrice: 263, discountPercent: 15, packSize: 'Bottle of 30 capsules', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Dolo 650 Tablet', category: 'Medicines', brand: 'Micro Labs Ltd', price: 34, discountPrice: 28, discountPercent: 18, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Accu-Chek Active Test Strips', category: 'Health Devices', brand: 'Roche Diabetes Care', price: 975, discountPrice: 875, discountPercent: 10, packSize: 'Box of 50 strips', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80' },
      { name: 'Chyawanprash Awaleha', category: 'Ayurveda', brand: 'Dabur India Ltd', price: 495, discountPrice: 420, discountPercent: 15, packSize: 'Tub of 1 kg', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
      { name: 'Volini Pain Relief Spray', category: 'Medicines', brand: 'Sun Pharmaceutical Industries Ltd', price: 160, discountPrice: 136, discountPercent: 15, packSize: 'Can of 55 g', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Celin 500 Vitamin C Tablet', category: 'Wellness', brand: 'Koye Pharmaceuticals', price: 45, discountPrice: 38, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },
      { name: 'Crocin Advance Tablet', category: 'Medicines', brand: 'GlaxoSmithKline', price: 42, discountPrice: 36, discountPercent: 14, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Pan-D Tablet', category: 'Medicines', brand: 'Alkem Laboratories', price: 65, discountPrice: 55, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Allegra 120mg Tablet', category: 'Medicines', brand: 'Sanofi India Ltd', price: 95, discountPrice: 80, discountPercent: 16, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Azithral 500mg Tablet', category: 'Medicines', brand: 'Alembic Pharmaceuticals', price: 85, discountPrice: 72, discountPercent: 15, packSize: 'Strip of 3 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
      { name: 'Liv 52 Syrup', category: 'Ayurveda', brand: 'Himalaya Drug Company', price: 185, discountPrice: 158, discountPercent: 15, packSize: 'Bottle of 200ml', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shelcal 500 Tablet', category: 'Wellness', brand: 'Lupin Ltd', price: 125, discountPrice: 106, discountPercent: 15, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80' },
      { name: 'Aspirin 500mg Tablet', category: 'Medicines', brand: 'Bayer India', price: 55, discountPrice: 46, discountPercent: 16, packSize: 'Strip of 15 tablets', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ibuprofen 400mg Tablet', category: 'Medicines', brand: 'Cipla Ltd', price: 48, discountPrice: 41, discountPercent: 15, packSize: 'Strip of 10 tablets', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' }
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
            id: `doc-${city.toLowerCase().slice(0, 3)}-${i + 1}`,
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
