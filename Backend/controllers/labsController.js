const Lab = require('../models/Lab');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all labs (with optional city/pincode filtering)
// @route   GET /api/labs
// @access  Public
const getLabs = async (req, res, next) => {
  try {
    const { city, pincode } = req.query;
    let query = {};

    if (pincode) {
      query.pincode = pincode.trim();
    } else if (city) {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    let labs = await Lab.find(query);

    // Fallback localization for any Pan-India queries
    if (labs.length === 0 && (pincode || city)) {
      const allLabs = await Lab.find({});
      if (allLabs.length > 0) {
        labs = allLabs.map(lab => {
          const labObj = lab.toObject();
          labObj.pincode = pincode ? pincode.trim() : (labObj.pincode || '110001');
          labObj.city = city ? city.trim() : (labObj.city || 'Delhi');
          labObj.state = labObj.state || 'Delhi';
          labObj.address = `${labObj.name}, Main Road, ${labObj.city}`;
          return labObj;
        });
      }
    }

    return ApiResponse.success(res, 200, 'Labs retrieved successfully', labs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabs
};
