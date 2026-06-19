const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
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
    ownerName: {
      type: String
    },
    mobileNumber: {
      type: String
    },
    emailAddress: {
      type: String
    },
    logo: {
      type: String,
      default: '💊'
    },
    banner: {
      type: String
    },
    images: [{
      type: String
    }],
    about: {
      type: String
    },
    drugLicenseNumber: {
      type: String
    },
    gstNumber: {
      type: String
    },
    establishedYear: {
      type: String
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
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
    },
    googleMapsLocation: {
      type: String
    },
    homeDelivery: {
      type: Boolean,
      default: true
    },
    deliveryRadius: {
      type: Number // in km
    },
    deliveryCharges: {
      type: Number,
      default: 0
    },
    openingTime: {
      type: String
    },
    closingTime: {
      type: String
    },
    is24x7: {
      type: Boolean,
      default: false
    },
    drugLicenseUrl: {
      type: String
    },
    governmentIdUrl: {
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
    productsCount: {
      type: Number,
      default: 0
    },
    pharmacistRegistrationNumber: {
      type: String
    },
    landmark: {
      type: String
    },
    pharmacistCertificateUrl: {
      type: String
    },
    panCardUrl: {
      type: String
    },
    gstCertificateUrl: {
      type: String
    },
    logoUrl: {
      type: String
    },
    storeFrontImageUrl: {
      type: String
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    vendorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);
