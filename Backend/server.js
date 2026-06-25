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

const app = express();

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => callback(null, true),
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

const startServer = async () => {
  try {
    await connectDB();

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

  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();
