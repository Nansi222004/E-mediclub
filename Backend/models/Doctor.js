const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    subSpecialty: {
      type: String,
      trim: true
    },
    avatar: {
      type: String
    },
    qualification: {
      type: String
    },
    experience: {
      type: String
    },
    hospital: {
      type: String
    },
    fee: {
      type: Number,
      default: 0
    },
    offlineFee: {
      type: Number,
      default: 0
    },
    languages: [{
      type: String
    }],
    availableDays: [{
      type: String
    }],
    timeSlots: [{
      type: String
    }],
    rating: {
      type: Number,
      default: 5.0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    consultationMode: {
      type: String,
      enum: ['Online', 'Offline', 'Both'],
      default: 'Both'
    },
    registrationNumber: {
      type: String
    },
    bio: {
      type: String
    },
    testimonials: [{
      patientName: String,
      rating: Number,
      reviewText: String,
      date: String,
      mode: String
    }],
    online: {
      type: Boolean,
      default: true
    },
    availability: {
      type: String
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
