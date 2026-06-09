const Doctor = require('../models/Doctor');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all doctors (with optional city/pincode filtering)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { city, pincode } = req.query;
    let query = {};

    if (city) {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    } else if (pincode) {
      query.pincode = pincode.trim();
    }

    const doctors = await Doctor.find(query);
    return ApiResponse.success(res, 200, 'Doctors retrieved successfully', doctors);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors
};
// Nodemon trigger comment
