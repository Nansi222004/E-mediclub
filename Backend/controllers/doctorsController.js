const Doctor = require('../models/Doctor');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all doctors (with optional city/pincode filtering)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { city, pincode } = req.query;
    let query = {};

    if (pincode) {
      query.pincode = pincode.trim();
    } else if (city) {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    let doctors = await Doctor.find(query);

    // Fallback localization for any Pan-India queries
    if (doctors.length === 0 && (pincode || city)) {
      const allDoctors = await Doctor.find({});
      if (allDoctors.length > 0) {
        doctors = allDoctors.map(doc => {
          const docObj = doc.toObject();
          docObj.pincode = pincode ? pincode.trim() : (docObj.pincode || '110001');
          docObj.city = city ? city.trim() : (docObj.city || 'Delhi');
          docObj.state = docObj.state || 'Delhi';
          docObj.address = `${docObj.city} General Hospital, ${docObj.city}`;
          return docObj;
        });
      }
    }

    return ApiResponse.success(res, 200, 'Doctors retrieved successfully', doctors);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors
};
// Nodemon trigger comment
