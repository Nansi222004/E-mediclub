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
    gallery: [mongoose.Schema.Types.Mixed],
    reviews: [{
      patientName: String,
      rating: Number,
      reviewText: String,
      date: String,
      replyText: String
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
    labBanner: {
      type: String
    },
    aboutLaboratory: {
      type: String
    },
    establishedYear: {
      type: String
    },
    workingHours: {
      type: String
    },
    nablCertificateUrl: {
      type: String
    },
    isoCertificateUrl: {
      type: String
    },
    collectionRadius: {
      type: Number // in km
    },
    collectionCharges: {
      type: Number
    },
    reportDeliveryTime: {
      type: String
    },
    sameDayReports: {
      type: Boolean,
      default: false
    },
    expressReports: {
      type: Boolean,
      default: false
    },
    digitalReports: {
      type: Boolean,
      default: true
    },
    labLicenseUrl: {
      type: String
    },
    governmentIdUrl: {
      type: String
    },
    promotionalBanner: {
      image: String,
      title: String,
      subtitle: String,
      offerText: String,
      ctaButton: String
    },
    facilitiesList: {
      nablCertified: { type: Boolean, default: false },
      homeCollection: { type: Boolean, default: false },
      digitalReports: { type: Boolean, default: false },
      sameDayReports: { type: Boolean, default: false },
      parkingAvailable: { type: Boolean, default: false },
      wheelchairAccess: { type: Boolean, default: false },
      emergencyTesting: { type: Boolean, default: false },
      onlinePayments: { type: Boolean, default: false }
    },
    accreditations: {
      nablCertificate: String,
      isoCertificate: String,
      gstCertificate: String,
      registrationCertificate: String,
      labLicense: String
    },
    testsList: [{
      id: String,
      name: String,
      category: String,
      price: Number,
      turnaround: String,
      code: String,
      isActive: { type: Boolean, default: true }
    }],
    packagesList: [{
      id: String,
      name: String,
      description: String,
      price: Number,
      discountPrice: Number,
      discountPercent: Number,
      turnaround: String,
      fastingRequired: String,
      tests: [String],
      isActive: { type: Boolean, default: true }
    }],
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    vendorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      }
    }
  },
  {
    timestamps: true
  }
);

labSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Lab', labSchema);
