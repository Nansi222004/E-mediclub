const Joi = require('joi');

const labBookingSchema = Joi.object({
  id: Joi.string().required(),
  packageName: Joi.string().required(),
  address: Joi.string().required(),
  price: Joi.number().min(0).required(),
  date: Joi.string().isoDate().required(),
  city: Joi.string().required(),
  pincode: Joi.string().required(),
  state: Joi.string().required(),
  patientName: Joi.string().min(2).max(100).required(),
  patientAge: Joi.number().integer().min(1).max(120).required(),
  patientGender: Joi.string().valid('Male', 'Female', 'Other').required(),
  patientPhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  timeSlot: Joi.string().required(),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').required(),
  paymentMethod: Joi.string().valid('upi', 'card', 'cash').required(),
  doctorName: Joi.string().allow('', null).optional(),
  doctorRegNo: Joi.string().allow('', null).optional(),
  labId: Joi.string().required()
});

module.exports = {
  labBookingSchema
};
