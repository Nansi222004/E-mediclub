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
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Video', 'In-Clinic'],
      default: 'Video'
    },
    status: {
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
    },
    reason: {
      type: String
    },
    customReason: {
      type: String
    },
    returnStatus: {
      type: String,
      enum: ["None", "Requested", "Under Review", "Approved", "Rejected"],
      default: "None"
    },
    refundStatus: {
      type: String,
      enum: ["Not Applicable", "Pending", "Processing", "Completed", "Failed"],
      default: "Not Applicable"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
