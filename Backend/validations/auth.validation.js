const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': `Name cannot be an empty field`,
    'string.min': `Name should have a minimum length of {#limit}`,
    'any.required': `Name is a required field`
  }),
  email: Joi.string().email().required().messages({
    'string.email': `Please enter a valid email`,
    'any.required': `Email is a required field`
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': `Phone number must have exactly 10 digits`,
    'any.required': `Phone number is a required field`
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `Password should have a minimum length of {#limit}`,
    'any.required': `Password is a required field`
  }),
  role: Joi.string().valid('user', 'admin', 'vendor').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  password: Joi.string().required().messages({
    'any.required': `Password is a required field`
  })
}).or('email', 'phone').messages({
  'object.missing': 'Please provide either email or phone for login'
});

const sendOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required()
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  otp: Joi.string().length(4).required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  addresses: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required(),
      addressLine: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().required(),
      isDefault: Joi.boolean().optional()
    })
  ).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  updateProfileSchema
};
