const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all products (with optional city filtering by vendorCity)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { city } = req.query;
    let query = {};

    if (city) {
      query.vendorCity = new RegExp(`^${city.trim()}$`, 'i');
    }

    const products = await Product.find(query);
    return ApiResponse.success(res, 200, 'Products retrieved successfully', products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts
};
