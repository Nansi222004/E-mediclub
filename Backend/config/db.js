const mongoose = require('mongoose');

// Helper to mask password in MongoDB URI for safe logging
const maskMongoUri = (uri) => {
  if (!uri) return 'Not set';
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/, '$1******$3');
  } catch (e) {
    return 'Masking failed';
  }
};

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!dbUri) {
    console.error("CRITICAL ERROR: MongoDB connection URI is missing! Please configure MONGODB_URI or MONGO_URI in your environment variables.");
    process.exit(1);
  }

  console.log(`Attempting to connect to MongoDB using URI: ${maskMongoUri(dbUri)}`);

  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
