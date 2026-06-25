const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;

const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured && process.env.NODE_ENV === 'production') {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('../config/cloudinary');
  storage = (folderName) => new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
      resource_type: 'auto',
    },
  });
} else {
  // Offline local fallback
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = (folderName) => multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = path.join(uploadDir, folderName);
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const createUploadMiddleware = (folderName) => {
  const currentStorage = typeof storage === 'function' ? storage(folderName) : storage;
  return multer({ 
    storage: currentStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
};

const uploadPrescription = createUploadMiddleware("emediclub/prescriptions");
const uploadProfilePhoto = createUploadMiddleware("emediclub/profiles");
const uploadLabReport = createUploadMiddleware("emediclub/lab-reports");
const uploadMedicineImage = createUploadMiddleware("emediclub/medicines");

module.exports = {
  uploadPrescription,
  uploadProfilePhoto,
  uploadLabReport,
  uploadMedicineImage,
  createUploadMiddleware
};
