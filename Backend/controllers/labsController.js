const Lab = require('../models/Lab');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all labs (with optional city/pincode filtering)
// @route   GET /api/labs
// @access  Public
const getLabs = async (req, res, next) => {
  try {
    const { city, pincode } = req.query;
    let query = {};

    if (city) {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    } else if (pincode) {
      query.pincode = pincode.trim();
    }

    const labs = await Lab.find(query);
    return ApiResponse.success(res, 200, 'Labs retrieved successfully', labs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabs
};
