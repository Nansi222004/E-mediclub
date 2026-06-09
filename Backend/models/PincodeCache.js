const mongoose = require('mongoose');

const pincodeCacheSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    isServiceable: {
      type: Boolean,
      default: true
    },
    cachedAt: {
      type: Date,
      default: Date.now,
      expires: 2592000 // 30 days in seconds
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PincodeCache', pincodeCacheSchema);
