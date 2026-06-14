require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emediclub';

const seedVendors = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    const vendors = [
      {
        name: 'City Labs Manager',
        email: 'manager@citylabs.com',
        phone: '1234567890',
        password: 'password123',
        role: 'lab_vendor',
        isActive: true
      },
      {
        name: 'Dr. John Smith',
        email: 'dr.smith@clinic.com',
        phone: '1234567891',
        password: 'password123',
        role: 'doctor_vendor',
        isActive: true
      },
      {
        name: 'Central Park Pharmacy',
        email: 'admin@pharmacy.com',
        phone: '1234567892',
        password: 'password123',
        role: 'pharmacy_vendor',
        isActive: true
      }
    ];

    for (const vendor of vendors) {
      const exists = await User.findOne({ email: vendor.email });
      if (exists) {
        console.log(`Vendor ${vendor.email} already exists.`);
        exists.password = vendor.password;
        await exists.save();
        console.log(`Updated password for ${vendor.email}`);
      } else {
        await User.create(vendor);
        console.log(`Created vendor ${vendor.email}.`);
      }
    }

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedVendors();
