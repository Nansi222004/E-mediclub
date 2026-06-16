const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const ApiResponse = require('../utils/ApiResponse');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header for Bearer Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback to cookie if present
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return ApiResponse.error(res, 401, 'Not authorized to access this route, token missing');
  }

  // Development bypass for mock tokens
  if (token.startsWith('MOCK-JWT-TOKEN-')) {
    try {
      let user = await User.findOne({ email: 'ramesh@gmail.com' });
      if (!user) {
        user = await User.create({
          name: 'Ramesh Kumar',
          phone: '9876543210',
          email: 'ramesh@gmail.com',
          role: 'user',
          password: 'password123',
          isActive: true
        });
      }
      req.user = user;
      req.token = token;
      return next();
    } catch (err) {
      return ApiResponse.error(res, 500, 'Failed to handle mock token bypass');
    }
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return ApiResponse.error(res, 401, 'Token is blacklisted, please login again');
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'e_mediclub_access_jwt_secret_key_extremely_secure_321'
    );

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return ApiResponse.error(res, 404, 'No user found with this id');
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 403, 'User account is deactivated');
    }

    req.user = user;
    req.token = token; // Keep the active token in request for logout/blacklisting
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 401, 'Access token has expired', { expired: true });
    }
    return ApiResponse.error(res, 401, 'Not authorized to access this route');
  }
};

module.exports = { protect };
