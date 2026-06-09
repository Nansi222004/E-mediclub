const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all products (with optional city filtering by vendorCity)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { city, pincode } = req.query;
    let query = {};

    if (pincode) {
      query.vendorPincode = pincode.trim();
    } else if (city) {
      query.vendorCity = new RegExp(`^${city.trim()}$`, 'i');
    }

    let products = await Product.find(query);

    // Fallback localization for any Pan-India queries
    if (products.length === 0 && (pincode || city)) {
      const allProducts = await Product.find({});
      if (allProducts.length > 0) {
        products = allProducts.map(prod => {
          const prodObj = prod.toObject();
          prodObj.vendorPincode = pincode ? pincode.trim() : (prodObj.vendorPincode || '110001');
          prodObj.vendorCity = city ? city.trim() : (prodObj.vendorCity || 'Delhi');
          prodObj.vendorState = prodObj.vendorState || 'Delhi';
          return prodObj;
        });
      }
    }

    return ApiResponse.success(res, 200, 'Products retrieved successfully', products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts
};
