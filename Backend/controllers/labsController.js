const Lab = require('../models/Lab');
const LabBooking = require('../models/LabBooking');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all labs (with optional city/pincode filtering)
// @route   GET /api/labs
// @access  Public
const getLabs = async (req, res, next) => {
  try {
    const { city, pincode, lat, lng, radius } = req.query;
    let query = {};

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius ? parseInt(radius) : 10000
        }
      };
    } else if (pincode) {
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
    const {
      id,
      packageName,
      address,
      price,
      date,
      city,
      pincode,
      state,
      patientName,
      patientAge,
      patientPhone,
      patientGender,
      timeSlot,
      paymentStatus,
      paymentMethod,
      doctorName,
      doctorRegNo,
      hasPrescription,
      prescriptionFileName,
      labId
    } = req.body;
    
    // Check if file is uploaded
    let reportUrl = null;
    if (req.file) {
      reportUrl = req.file.path; // Cloudinary or local path
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const newBooking = await LabBooking.create({
      id: id || `LAB-${Date.now()}`,
      packageName,
      address,
      price,
      date,
      city,
      pincode,
      state,
      patientName,
      patientAge: patientAge ? Number(patientAge) : undefined,
      patientPhone,
      patientGender,
      timeSlot,
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'UPI',
      doctorName,
      doctorRegNo,
      hasPrescription: hasPrescription === 'true' || hasPrescription === true,
      prescriptionFileName,
      labId,
      otp,
      reportUrl,
      status: 'new_booking'
    });

    return ApiResponse.success(res, 201, 'Lab test booked successfully', newBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/labs/my-bookings
// @access  Protected
const getMyLabBookings = async (req, res, next) => {
  try {
    const { ids } = req.query;
    let query = {};
    if (ids) {
      const idArray = ids.split(',');
      query = { id: { $in: idArray } };
    } else {
      query = { patientPhone: req.user.phone };
    }
    const bookings = await LabBooking.find(query);
    return ApiResponse.success(res, 200, 'My bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a lab booking
// @route   POST /api/labs/bookings/:id/cancel
// @access  Protected
const cancelLabBooking = async (req, res, next) => {
  try {
    const { reason, customReason } = req.body;
    
    if (reason === "Other" && !customReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please specify your reason."
      });
    }

    const booking = await LabBooking.findOne({ id: req.params.id });
    
    if (!booking) {
      return ApiResponse.error(res, 404, 'Lab booking not found');
    }

    if (booking.status === 'Cancelled' || booking.status === 'completed') {
      return ApiResponse.error(res, 400, 'Booking cannot be cancelled');
    }

    booking.status = 'Cancelled';
    booking.reason = reason;
    booking.customReason = reason === 'Other' ? customReason.trim() : '';
    booking.returnStatus = 'Requested'; // Treat as cancellation/refund request
    
    if (booking.paymentStatus === 'Paid') {
      booking.refundStatus = 'Pending';
    } else {
      booking.refundStatus = 'Not Applicable';
    }

    await booking.save();
    return ApiResponse.success(res, 200, 'Lab booking cancelled successfully', booking);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// VENDOR PORTAL API ENDPOINTS
// ==========================================

// Helper function to get vendor's lab
const getOrCreateVendorLab = async (userId, name = 'Diagnostics Lab') => {
  let lab = await Lab.findOne({ vendorUserId: userId });
  if (!lab) {
    lab = await Lab.create({
      id: 'LAB-' + Math.floor(100000 + Math.random() * 900000),
      name: name + ' Center',
      city: 'Mumbai',
      pincode: '400001',
      state: 'Maharashtra',
      vendorUserId: userId,
      gallery: [
        { id: '1', url: 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=800&q=80', category: 'Testing Area', isFeatured: true }
      ],
      promotionalBanner: {
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
        title: 'Advanced Diagnostics Center',
        subtitle: 'NABL Certified | 100% Accurate Results | Free Home Sample Collection',
        ctaButton: 'View Test Packages'
      },
      facilitiesList: {
        nablCertified: true,
        homeCollection: true,
        digitalReports: true,
        sameDayReports: true,
        parkingAvailable: true,
        wheelchairAccess: false
      }
    });
  }
  return lab;
};

// @desc    Get all bookings for vendor
// @route   GET /api/labs/vendor/bookings
// @access  Private (Vendor only)
const getVendorBookings = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    // Find bookings matching labId
    const bookings = await LabBooking.find({ labId: lab.id });
    return ApiResponse.success(res, 200, 'Vendor bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/labs/vendor/bookings/:id/status
// @access  Private (Vendor only)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, collectorName, collectorPhone, otp } = req.body;
    
    const booking = await LabBooking.findOne({ id });
    if (!booking) {
      return ApiResponse.error(res, 404, 'Booking not found');
    }

    if (status === 'collector_assigned') {
      booking.collectorName = collectorName;
      booking.collectorPhone = collectorPhone;
    }

    if (status === 'sample_collected') {
      // OTP verification if provided
      if (otp && booking.otp && otp !== booking.otp) {
        return ApiResponse.error(res, 400, 'Invalid Collection OTP verification code');
      }
    }

    booking.status = status;
    await booking.save();

    return ApiResponse.success(res, 200, `Booking status updated to ${status}`, booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload booking report
// @route   PUT /api/labs/vendor/bookings/:id/report
// @access  Private (Vendor only)
const uploadBookingReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return ApiResponse.error(res, 400, 'Please upload a PDF report file');
    }

    const booking = await LabBooking.findOne({ id });
    if (!booking) {
      return ApiResponse.error(res, 404, 'Booking not found');
    }

    booking.reportUrl = req.file.path;
    booking.status = 'report_uploaded';
    await booking.save();

    return ApiResponse.success(res, 200, 'PDF report uploaded successfully', booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor's lab profile
// @route   GET /api/labs/vendor/profile
// @access  Private (Vendor only)
const getVendorProfile = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    return ApiResponse.success(res, 200, 'Lab profile retrieved successfully', lab);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor's lab profile
// @route   PUT /api/labs/vendor/profile
// @access  Private (Vendor only)
const updateVendorProfile = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { name, rating, reviewsCount, city, pincode, state, address, ownerName, mobileNumber, emailAddress, promotionalBanner, facilitiesList, accreditations, gallery, lat, lng } = req.body;
    
    if (name) lab.name = name;
    if (rating !== undefined) lab.rating = rating;
    if (reviewsCount !== undefined) lab.reviewsCount = reviewsCount;
    if (city) lab.city = city;
    if (pincode) lab.pincode = pincode;
    if (state) lab.state = state;
    if (address) lab.address = address;
    if (ownerName) lab.ownerName = ownerName;
    if (mobileNumber) lab.mobileNumber = mobileNumber;
    if (emailAddress) lab.emailAddress = emailAddress;
    if (promotionalBanner) lab.promotionalBanner = promotionalBanner;
    if (facilitiesList) lab.facilitiesList = facilitiesList;
    if (accreditations) lab.accreditations = accreditations;
    if (gallery) lab.gallery = gallery;

    if (lat && lng) {
      lab.location = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }

    await lab.save();
    return ApiResponse.success(res, 200, 'Lab profile updated successfully', lab);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tests list for vendor
// @route   GET /api/labs/vendor/tests
// @access  Private (Vendor only)
const getVendorTests = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    return ApiResponse.success(res, 200, 'Lab tests retrieved successfully', lab.testsList || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Add individual test
// @route   POST /api/labs/vendor/tests
// @access  Private (Vendor only)
const addVendorTest = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { name, category, price, turnaround, code } = req.body;

    const newTest = {
      id: 'TEST-' + Date.now(),
      name,
      category,
      price: Number(price),
      turnaround,
      code: code || `TC-${category.substring(0,3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      isActive: true
    };

    lab.testsList.push(newTest);
    await lab.save();

    return ApiResponse.success(res, 201, 'Test added successfully', newTest);
  } catch (error) {
    next(error);
  }
};

// @desc    Update individual test
// @route   PUT /api/labs/vendor/tests/:id
// @access  Private (Vendor only)
const updateVendorTest = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { id } = req.params;
    const { name, category, price, turnaround, code, isActive } = req.body;

    const test = lab.testsList.find(t => t.id === id);
    if (!test) {
      return ApiResponse.error(res, 404, 'Test not found');
    }

    if (name) test.name = name;
    if (category) test.category = category;
    if (price !== undefined) test.price = Number(price);
    if (turnaround) test.turnaround = turnaround;
    if (code) test.code = code;
    if (isActive !== undefined) test.isActive = isActive;

    await lab.save();
    return ApiResponse.success(res, 200, 'Test updated successfully', test);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete individual test
// @route   DELETE /api/labs/vendor/tests/:id
// @access  Private (Vendor only)
const deleteVendorTest = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { id } = req.params;

    lab.testsList = lab.testsList.filter(t => t.id !== id);
    await lab.save();

    return ApiResponse.success(res, 200, 'Test deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get packages list for vendor
// @route   GET /api/labs/vendor/packages
// @access  Private (Vendor only)
const getVendorPackages = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    return ApiResponse.success(res, 200, 'Lab packages retrieved successfully', lab.packagesList || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Add package
// @route   POST /api/labs/vendor/packages
// @access  Private (Vendor only)
const addVendorPackage = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { name, description, price, discountPrice, turnaround, fastingRequired, tests } = req.body;

    const discountPercent = price && discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

    const newPkg = {
      id: 'PKG-' + Date.now(),
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      discountPercent,
      turnaround,
      fastingRequired: fastingRequired || 'Not Required',
      tests: tests || [],
      isActive: true
    };

    lab.packagesList.push(newPkg);
    await lab.save();

    return ApiResponse.success(res, 201, 'Package added successfully', newPkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/labs/vendor/packages/:id
// @access  Private (Vendor only)
const updateVendorPackage = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { id } = req.params;
    const { name, description, price, discountPrice, turnaround, fastingRequired, tests, isActive } = req.body;

    const pkg = lab.packagesList.find(p => p.id === id);
    if (!pkg) {
      return ApiResponse.error(res, 404, 'Package not found');
    }

    if (name) pkg.name = name;
    if (description) pkg.description = description;
    if (price !== undefined) pkg.price = Number(price);
    if (discountPrice !== undefined) pkg.discountPrice = Number(discountPrice);
    if (price !== undefined || discountPrice !== undefined) {
      const p = price !== undefined ? Number(price) : pkg.price;
      const dp = discountPrice !== undefined ? Number(discountPrice) : pkg.discountPrice;
      pkg.discountPercent = p && dp ? Math.round(((p - dp) / p) * 100) : 0;
    }
    if (turnaround) pkg.turnaround = turnaround;
    if (fastingRequired) pkg.fastingRequired = fastingRequired;
    if (tests) pkg.tests = tests;
    if (isActive !== undefined) pkg.isActive = isActive;

    await lab.save();
    return ApiResponse.success(res, 200, 'Package updated successfully', pkg);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/labs/vendor/packages/:id
// @access  Private (Vendor only)
const deleteVendorPackage = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { id } = req.params;

    lab.packagesList = lab.packagesList.filter(p => p.id !== id);
    await lab.save();

    return ApiResponse.success(res, 200, 'Package deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to review
// @route   POST /api/labs/vendor/reviews/:id/reply
// @access  Private (Vendor only)
const replyToReview = async (req, res, next) => {
  try {
    const lab = await getOrCreateVendorLab(req.user._id, req.user.name);
    const { id } = req.params; // review _id
    const { replyText } = req.body;

    const review = lab.reviews.id(id);
    if (!review) {
      return ApiResponse.error(res, 404, 'Review not found');
    }

    review.replyText = replyText;
    await lab.save();

    return ApiResponse.success(res, 200, 'Reply added successfully', review);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabs,
  bookLab,
  getMyLabBookings,
  cancelLabBooking,
  getVendorBookings,
  updateBookingStatus,
  uploadBookingReport,
  getVendorProfile,
  updateVendorProfile,
  getVendorTests,
  addVendorTest,
  updateVendorTest,
  deleteVendorTest,
  getVendorPackages,
  addVendorPackage,
  updateVendorPackage,
  deleteVendorPackage,
  replyToReview
};
