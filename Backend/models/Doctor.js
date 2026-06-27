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
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    dateOfBirth: {
      type: Date
    },
    medicalCouncil: {
      type: String
    },
    clinicName: {
      type: String
    },
    clinicLogo: {
      type: String
    },
    clinicImages: [{
      type: String
    }],
    receptionImages: [{
      type: String
    }],
    consultationRoomImages: [{
      type: String
    }],
    degreeCertificateUrl: {
      type: String
    },
    medicalLicenseUrl: {
      type: String
    },
    governmentIdUrl: {
      type: String
    },
    consultationDuration: {
      type: Number, // in minutes
      default: 15
    },
    morningSlots: [{
      type: String
    }],
    eveningSlots: [{
      type: String
    }],
    emergencyAvailability: {
      type: Boolean,
      default: false
    },
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

doctorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Doctor', doctorSchema);
