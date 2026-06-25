const Joi = require('joi');

const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().required(),
  customReason: Joi.string().allow('', null).optional()
});

const doctorBookingSchema = Joi.object({
  id: Joi.string().required(),
  doctorId: Joi.string().required(),
  doctorName: Joi.string().required(),
  specialty: Joi.string().required(),
  avatar: Joi.string().allow('', null).optional(),
  date: Joi.string().isoDate().required(),
  timeSlot: Joi.string().required(),
  type: Joi.string().valid('Online Consultation', 'Offline / In-Person Consultation').required(),
  patientName: Joi.string().min(2).max(100).required(),
  patientAge: Joi.number().integer().min(1).max(120).required(),
  notes: Joi.string().allow('', null).optional(),
  hasPrescription: Joi.boolean().optional(),
  amountPaid: Joi.number().min(0).required(),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').required(),
  paymentMethod: Joi.string().valid('upi', 'card', 'cash').required(),
  city: Joi.string().required(),
  pincode: Joi.string().required()
});

module.exports = {
  cancelAppointmentSchema,
  doctorBookingSchema
};
