require('dotenv').config();
const mongoose = require('mongoose');

const Doctor = require('./models/Doctor');
const Lab = require('./models/Lab');
const Pharmacy = require('./models/Pharmacy');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emediclub';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected.');

    // Note: Coordinates format is [longitude, latitude]
    // Base Location: Indore (approx lng: 75.8937, lat: 22.7533)
    
    // Clear old data for a clean test
    await Doctor.deleteMany({ name: /Test Doctor/ });
    await Lab.deleteMany({ name: /Test Lab/ });
    await Pharmacy.deleteMany({ name: /Test Pharmacy/ });
    await Product.deleteMany({ name: /Test Product/ });

    console.log('Seeding Geo-Spatial Data...');

    // 1. Doctor (Very Close: exactly at 75.8937, 22.7533)
    await Doctor.create({
      id: 'doc-geo-1',
      name: 'Dr. Test Doctor Near',
      specialty: 'Cardiology',
      city: 'Indore',
      pincode: '452001',
      state: 'Madhya Pradesh',
      fee: 500,
      location: {
        type: 'Point',
        coordinates: [75.8937, 22.7533] // Exactly here
      }
    });

    // 2. Doctor (Far Away: e.g., Delhi approx 77.2090, 28.6139)
    await Doctor.create({
      id: 'doc-geo-2',
      name: 'Dr. Test Doctor Far',
      specialty: 'Neurology',
      city: 'Delhi',
      pincode: '110001',
      state: 'Delhi',
      fee: 800,
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Delhi
      }
    });

    // 3. Lab (Close: approx 1km away)
    await Lab.create({
      id: 'lab-geo-1',
      name: 'Test Lab Near',
      city: 'Indore',
      pincode: '452001',
      state: 'Madhya Pradesh',
      location: {
        type: 'Point',
        coordinates: [75.8950, 22.7540] // Slightly shifted
      }
    });

    // 4. Pharmacy (Close)
    await Pharmacy.create({
      id: 'pharmacy-geo-1',
      name: 'Test Pharmacy Near',
      city: 'Indore',
      pincode: '452001',
      state: 'Madhya Pradesh',
      location: {
        type: 'Point',
        coordinates: [75.8940, 22.7535] // Slightly shifted
      }
    });

    // 5. Product (Close)
    await Product.create({
      id: 'product-geo-1',
      name: 'Test Product Paracetamol',
      category: 'Medicine',
      price: 50,
      vendorCity: 'Indore',
      vendorPincode: '452001',
      vendorState: 'Madhya Pradesh',
      location: {
        type: 'Point',
        coordinates: [75.8940, 22.7535] // Same as pharmacy
      }
    });

    console.log('Seed completed successfully. You now have test data!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
