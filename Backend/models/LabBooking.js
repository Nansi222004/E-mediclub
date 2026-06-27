const mongoose = require('mongoose');

const labBookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    packageName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        'pending',
        'new_booking',
        'confirmed',
        'collector_assigned',
        'sample_collected',
        'in_progress',
        'report_uploaded',
        'completed',
        'cancelled'
      ],
      default: 'new_booking'
    },
    reportUrl: {
      type: String
    },
    date: {
      type: String,
      required: true
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
    patientName: {
      type: String
    },
    patientAge: {
      type: Number
    },
    patientGender: {
      type: String
    },
    patientPhone: {
      type: String
    },
    timeSlot: {
      type: String
    },
    paymentStatus: {
      type: String,
      default: 'Pending'
    },
    paymentMethod: {
      type: String
    },
    otp: {
      type: String
    },
    collectorName: {
      type: String
    },
    collectorPhone: {
      type: String
    },
    doctorName: {
      type: String
    },
    doctorRegNo: {
      type: String
    },
    hasPrescription: {
      type: Boolean,
      default: false
    },
    prescriptionFileName: {
      type: String
    },
    labId: {
      type: String
    },
    rating: {
      type: Number
    },
    reviewText: {
      type: String
    },
    reviewDate: {
      type: String
    },
    reviewReply: {
      type: String
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

module.exports = mongoose.model('LabBooking', labBookingSchema);

