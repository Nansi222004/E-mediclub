const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    consultationType: {
      type: String,
      enum: ['Video', 'In-Clinic'],
      default: 'Video'
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
