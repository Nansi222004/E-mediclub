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
          
          // Localize lab name
          const labNameLower = (labObj.name || '').toLowerCase();
          const cityLower = labObj.city.toLowerCase();
          if (!labNameLower.includes(cityLower)) {
            const parts = labObj.name.split(' ');
            if (parts.length > 1) {
              labObj.name = `${labObj.city} ${parts.slice(1).join(' ')}`;
            } else {
              labObj.name = `${labObj.city} ${labObj.name}`;
            }
          }
          
          labObj.address = `${labObj.name}, Main Road, ${labObj.city}`;
          return labObj;
        });
      }
    }

    // Deduplicate labs by name
    const uniqueMap = new Map();
    labs.forEach(l => {
      const name = l.name || (l.toObject && l.toObject().name);
      if (name && !uniqueMap.has(name)) {
        uniqueMap.set(name, l);
      }
    });
    labs = Array.from(uniqueMap.values());

    return ApiResponse.success(res, 200, 'Labs retrieved successfully', labs);
  } catch (error) {
    next(error);
  }
};

// @desc    Book a lab test (with optional prescription/report upload)
// @route   POST /api/labs/book
// @access  Protected
const bookLab = async (req, res, next) => {
  try {
    const { id, packageName, address, price, date, city, pincode, state } = req.body;
    
    // Check if file is uploaded
    let reportUrl = null;
    if (req.file) {
      reportUrl = req.file.path; // Cloudinary URL
    }

    const LabBooking = require('../models/LabBooking');
    
    const newBooking = await LabBooking.create({
      id: id || `LAB-${Date.now()}`,
      packageName,
      address,
      price,
      date,
      city,
      pincode,
      state,
      reportUrl,
      status: 'confirmed'
    });

    return ApiResponse.success(res, 201, 'Lab test booked successfully', newBooking);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabs,
  bookLab
};
