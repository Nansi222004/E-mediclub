const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all products (with optional city filtering by vendorCity)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
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
          
          // Localize brand
          const brandLower = (prodObj.brand || '').toLowerCase();
          const cityLower = prodObj.vendorCity.toLowerCase();
          if (!brandLower.includes(cityLower)) {
            prodObj.brand = `${prodObj.vendorCity} ${prodObj.brand || 'Pharma'}`;
          }
          
          return prodObj;
        });
      }
    }

    // Deduplicate products by name
    const uniqueMap = new Map();
    products.forEach(p => {
      const name = p.name || (p.toObject && p.toObject().name);
      if (name && !uniqueMap.has(name)) {
        uniqueMap.set(name, p);
      }
    });
    products = Array.from(uniqueMap.values());

    return ApiResponse.success(res, 200, 'Products retrieved successfully', products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts
};
