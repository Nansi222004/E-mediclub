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
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'RESCHEDULED', 'IN_PROGRESS'],
      default: 'Scheduled'
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
      type: {
        type: String,
        enum: ["FEELING_BETTER", "SCHEDULING_CONFLICT", "BOOKED_BY_MISTAKE", "DOCTOR_UNAVAILABLE", "OTHER"]
      },
      customReason: String
    },
    previousSlots: [{
      date: String,
      time: String
    }],
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
