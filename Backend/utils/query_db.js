const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://emediclub_user:V7ZCl2cejUmHYs71@cluster0.8wogsiv.mongodb.net/emediclub?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");
  
  // Get collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  // Query User collection
  const userCol = mongoose.connection.db.collection('users');
  
  console.log("\n--- Sample User (role: user) ---");
  const sampleUser = await userCol.findOne({ role: 'user' });
  console.log(JSON.stringify(sampleUser, null, 2));

  console.log("\n--- Sample Vendor ---");
  const sampleVendor = await userCol.findOne({ role: { $in: ['vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'] } });
  console.log(JSON.stringify(sampleVendor, null, 2));

  console.log("\n--- Total count by role ---");
  const roles = ['user', 'admin', 'vendor', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor'];
  for (const r of roles) {
    const count = await userCol.countDocuments({ role: r });
    console.log(`${r}: ${count}`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
