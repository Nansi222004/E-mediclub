// Vendor Controller Skeletons
const getDashboard = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Route working — full logic coming soon",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Route working — full logic coming soon",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Route working — full logic coming soon",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Route working — full logic coming soon",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getEarnings = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Route working — full logic coming soon",
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const getVendorStatus = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const Pharmacy = require('../models/Pharmacy');
    const pharmacy = await Pharmacy.findOne({ vendorUserId: user._id });

    return res.status(200).json({
      success: true,
      status: user.status || 'pending',
      rejectionReason: user.rejectionReason || '',
      approvedAt: user.approvedAt || null,
      submittedAt: user.submittedAt || null,
      pharmacy: pharmacy ? {
        id: pharmacy.id,
        name: pharmacy.name,
        ownerName: pharmacy.ownerName,
        city: pharmacy.city,
        state: pharmacy.state,
        createdAt: pharmacy.createdAt,
      } : null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProducts,
  getOrders,
  getProfile,
  getEarnings,
  getVendorStatus
};
