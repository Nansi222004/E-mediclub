const mongoose = require('mongoose');

const labSchema = new mongoose.Schema(
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
    logo: {
      type: String,
      default: '🔬'
    },
    regNumber: {
      type: String
    },
    nablCertified: {
      type: Boolean,
      default: true
    },
    isoCertified: {
      type: Boolean,
      default: true
    },
    experience: {
      type: String
    },
    homeCollection: {
      type: Boolean,
      default: true
    },
    timings: {
      type: String
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    testsCount: {
      type: Number,
      default: 0
    },
    gallery: [{
      type: String
    }],
    reviews: [{
      patientName: String,
      rating: Number,
      reviewText: String,
      date: String
    }],
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

module.exports = mongoose.model('Lab', labSchema);
