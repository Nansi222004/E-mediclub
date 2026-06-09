const PincodeCache = require('../models/PincodeCache');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Validate pincode (lookup India Post API and cache results)
// @route   GET /api/location/validate/:pincode
// @access  Public
const validatePincode = async (req, res, next) => {
  try {
    const { pincode } = req.params;

    // Validate 6-digit pin format
    if (!/^\d{6}$/.test(pincode)) {
      return ApiResponse.error(res, 400, 'Invalid pincode format. Pincode must be exactly 6 digits.');
    }

    // Check MongoDB cache first
    let cached = await PincodeCache.findOne({ pincode });
    if (cached) {
      return ApiResponse.success(res, 200, 'Pincode validation (Cache Hit)', {
        pincode: cached.pincode,
        city: cached.city,
        district: cached.district,
        state: cached.state,
        isServiceable: cached.isServiceable
      });
    }

    // Call India Post API
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve data from India Post API');
      }

      const data = await response.json();
      
      if (!data || data.length === 0 || data[0].Status !== 'Success' || !data[0].PostOffice || data[0].PostOffice.length === 0) {
        return ApiResponse.error(res, 404, 'Pincode not found or invalid.');
      }

      const postOffice = data[0].PostOffice[0];
      const city = postOffice.District || postOffice.Name;
      const district = postOffice.District || postOffice.Division;
      const state = postOffice.State;

      // Save to MongoDB cache
      const newCache = await PincodeCache.create({
        pincode,
        city,
        district,
        state,
        isServiceable: true // Default true for all pincodes
      });

      return ApiResponse.success(res, 200, 'Pincode validation (API Fetched)', {
        pincode: newCache.pincode,
        city: newCache.city,
        district: newCache.district,
        state: newCache.state,
        isServiceable: newCache.isServiceable
      });

    } catch (apiError) {
      console.error('India Post API error:', apiError.message);
      // Fallback in case of API failure to prevent blocking the user
      return ApiResponse.error(res, 502, 'Failed to fetch details from India Post service. Please type city manually.');
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Check serviceability of a pincode for a specific serviceType
// @route   POST /api/location/check-serviceability
// @access  Public
const checkServiceability = async (req, res, next) => {
  try {
    const { pincode, serviceType } = req.body;

    if (!pincode) {
      return ApiResponse.error(res, 400, 'Pincode is required');
    }

    if (!serviceType || !['medicine', 'lab', 'doctor'].includes(serviceType)) {
      return ApiResponse.error(res, 400, 'Valid serviceType is required (medicine, lab, doctor)');
    }

    // Return true for all pincodes as requested for now
    return ApiResponse.success(res, 200, 'Serviceability check successful', {
      pincode,
      serviceType,
      isServiceable: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby locations by city and type
// @route   GET /api/location/nearby
// @access  Public
const getNearbyLocations = async (req, res, next) => {
  try {
    const { city, type } = req.query;
    if (!city) {
      return ApiResponse.error(res, 400, 'City is required');
    }
    if (!type || !['doctor', 'lab', 'pharmacy'].includes(type)) {
      return ApiResponse.error(res, 400, 'Valid type is required (doctor, lab, pharmacy)');
    }

    const query = { city: new RegExp(`^${city.trim()}$`, 'i') };
    let results = [];

    if (type === 'doctor') {
      const Doctor = require('../models/Doctor');
      results = await Doctor.find(query);
    } else if (type === 'lab') {
      const Lab = require('../models/Lab');
      results = await Lab.find(query);
    } else if (type === 'pharmacy') {
      const Product = require('../models/Product');
      results = await Product.find({ vendorCity: query.city });
    }

    return ApiResponse.success(res, 200, 'Nearby locations retrieved successfully', results);
  } catch (error) {
    next(error);
  }
};
const verifyPincode = async (req, res, next) => {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return ApiResponse.error(res, 400, 'Pincode is required');
    }

    if (!/^\d{6}$/.test(pincode)) {
      return ApiResponse.error(res, 400, 'Invalid pincode format. Pincode must be exactly 6 digits.');
    }

    let cached = await PincodeCache.findOne({ pincode });
    if (cached) {
      return ApiResponse.success(res, 200, 'Pincode validation (Cache Hit)', {
        pincode: cached.pincode,
        city: cached.city,
        district: cached.district,
        state: cached.state,
        isServiceable: cached.isServiceable
      });
    }

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve data from India Post API');
      }

      const data = await response.json();
      
      if (!data || data.length === 0 || data[0].Status !== 'Success' || !data[0].PostOffice || data[0].PostOffice.length === 0) {
        return ApiResponse.error(res, 404, 'Pincode not found or invalid.');
      }

      const postOffice = data[0].PostOffice[0];
      const city = postOffice.District || postOffice.Name;
      const district = postOffice.District || postOffice.Division;
      const state = postOffice.State;

      const newCache = await PincodeCache.create({
        pincode,
        city,
        district,
        state,
        isServiceable: true
      });

      return ApiResponse.success(res, 200, 'Pincode validation (API Fetched)', {
        pincode: newCache.pincode,
        city: newCache.city,
        district: newCache.district,
        state: newCache.state,
        isServiceable: newCache.isServiceable
      });

    } catch (apiError) {
      console.error('India Post API error:', apiError.message);
      return ApiResponse.error(res, 502, 'Failed to fetch details from India Post service. Please type city manually.');
    }

  } catch (error) {
    next(error);
  }
};

module.exports = {
  validatePincode,
  checkServiceability,
  getNearbyLocations,
  verifyPincode
};
