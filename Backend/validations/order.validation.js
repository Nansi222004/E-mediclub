const Joi = require('joi');

const orderItemsSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).required(),
  seller: Joi.string().required(),
  image: Joi.string().allow('', null).optional()
});

const shippingAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('', null).optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required()
});

const placeOrderSchema = Joi.object({
  items: Joi.array().items(orderItemsSchema).min(1).required(),
  shippingAddress: shippingAddressSchema.required(),
  paymentMethod: Joi.string().valid('credit_card', 'paypal', 'cod', 'upi').required(),
  itemsPrice: Joi.number().min(0).required(),
  taxPrice: Joi.number().min(0).required(),
  shippingPrice: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required()
});

module.exports = {
  placeOrderSchema
};
