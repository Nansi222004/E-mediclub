const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createUploadMiddleware = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
    },
  });

  return multer({ 
    storage: storage,
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
  uploadMedicineImage
};
