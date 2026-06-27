const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number
    },
    discountPercent: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    image: {
      type: String
    },
    packSize: {
      type: String
    },
    composition: {
      type: String
    },
    benefits: {
      type: String
    },
    warnings: {
      type: String
    },
    dosage: {
      type: String
    },
    inStock: {
      type: Boolean,
      default: true
    },
    vendorCity: {
      type: String,
      required: true,
      trim: true
    },
    vendorPincode: {
      type: String,
      required: true,
      trim: true
    },
    vendorState: {
      type: String,
      required: true,
      trim: true
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

productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);
