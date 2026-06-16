const path = require('path');
const Prescription = require('../models/Prescription');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Upload new prescription
// @route   POST /api/prescriptions/upload
// @access  Protected
const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 400, 'Please upload a valid prescription file');
    }

    const { notes } = req.body;
    let fileUrl = req.file.path;

    if (fileUrl && !fileUrl.startsWith('http')) {
      const relativePath = path.relative(path.join(__dirname, '../'), fileUrl).replace(/\\/g, '/');
      fileUrl = `/${relativePath}`;
    }

    const prescription = await Prescription.create({
      userId: req.user.id,
      fileUrl: fileUrl,
      notes: notes || '',
      uploadedAt: Date.now()
    });

    return ApiResponse.success(res, 201, 'Prescription uploaded successfully', {
      id: prescription._id,
      fileUrl: prescription.fileUrl,
      notes: prescription.notes,
      uploadedAt: prescription.uploadedAt
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPrescription
};
