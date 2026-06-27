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
    'string.pattern.base': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('user', 'vendor', 'admin', 'pharmacy_vendor', 'lab_vendor', 'doctor_vendor').optional()
});

const loginSchema = Joi.object({
  emailOrPhone: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
}).or('emailOrPhone', 'phone', 'email').messages({
  'object.missing': 'Please provide email or phone number'
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional()
}).or('email', 'phone').messages({
  'object.missing': 'Please provide email or phone number'
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  otp: Joi.string().required().messages({
    'any.required': 'OTP is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required'
  })
}).or('email', 'phone').messages({
  'object.missing': 'Please provide email or phone number'
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required'
  })
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
}).min(1).messages({
  'object.min': 'Please provide at least one field to update'
});

const sendOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  })
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required'
  }),
  otp: Joi.string().required().messages({
    'any.required': 'OTP is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  sendOtpSchema,
  verifyOtpSchema
};
