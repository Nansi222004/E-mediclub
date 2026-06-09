const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all saved addresses
// @route   GET /api/users/addresses
// @access  Protected
const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }
    return ApiResponse.success(res, 200, 'Addresses retrieved successfully', user.savedAddresses || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Protected
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    const { label, fullName, phone, pincode, city, state, district, fullAddress, isDefault } = req.body;

    if (isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      label: label || 'Home',
      fullName,
      phone,
      pincode,
      city,
      state,
      district,
      fullAddress,
      isDefault: isDefault || false
    };

    user.savedAddresses.push(newAddress);
    await user.save();

    return ApiResponse.success(res, 201, 'Address added successfully', user.savedAddresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Protected
const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    const addressId = req.params.id;
    const addressIndex = user.savedAddresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return ApiResponse.error(res, 404, 'Address not found');
    }

    const { label, fullName, phone, pincode, city, state, district, fullAddress, isDefault } = req.body;

    if (isDefault) {
      user.savedAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.savedAddresses[addressIndex].label = label || user.savedAddresses[addressIndex].label;
    user.savedAddresses[addressIndex].fullName = fullName !== undefined ? fullName : user.savedAddresses[addressIndex].fullName;
    user.savedAddresses[addressIndex].phone = phone !== undefined ? phone : user.savedAddresses[addressIndex].phone;
    user.savedAddresses[addressIndex].pincode = pincode !== undefined ? pincode : user.savedAddresses[addressIndex].pincode;
    user.savedAddresses[addressIndex].city = city !== undefined ? city : user.savedAddresses[addressIndex].city;
    user.savedAddresses[addressIndex].state = state !== undefined ? state : user.savedAddresses[addressIndex].state;
    user.savedAddresses[addressIndex].district = district !== undefined ? district : user.savedAddresses[addressIndex].district;
    user.savedAddresses[addressIndex].fullAddress = fullAddress !== undefined ? fullAddress : user.savedAddresses[addressIndex].fullAddress;
    user.savedAddresses[addressIndex].isDefault = isDefault !== undefined ? isDefault : user.savedAddresses[addressIndex].isDefault;

    await user.save();

    return ApiResponse.success(res, 200, 'Address updated successfully', user.savedAddresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Protected
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    const addressId = req.params.id;
    user.savedAddresses = user.savedAddresses.filter(addr => addr._id.toString() !== addressId);
    
    await user.save();

    return ApiResponse.success(res, 200, 'Address deleted successfully', user.savedAddresses);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
