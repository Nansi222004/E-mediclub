const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config({ path: '../.env' }); // load from parent dir since scratch is a subdir

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/e-mediclub';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB:', MONGO_URI);
  // Get collection and drop it or delete all documents
  try {
    await mongoose.connection.db.collection('labs').deleteMany({});
    console.log('Cleared all Labs from collection.');
  } catch (err) {
    console.log('No labs collection or error clearing:', err.message);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
