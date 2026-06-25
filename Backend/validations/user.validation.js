const Joi = require('joi');

const addressSchema = Joi.object({
  name: Joi.string().required(),
  addressLine: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  isDefault: Joi.boolean().optional()
});

module.exports = {
  addressSchema
};
