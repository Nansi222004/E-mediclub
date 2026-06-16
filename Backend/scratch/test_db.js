const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/emediclub');
    console.log('Connected!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const User = require('../models/User');
    const users = await User.find({});
    console.log('Number of users in DB:', users.length);
    console.log('Users:', users.map(u => ({ name: u.name, email: u.email, role: u.role, phone: u.phone })));
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
