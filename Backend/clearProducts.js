const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');
  await Product.deleteMany({});
  console.log('Cleared all Products so they can be re-seeded');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
