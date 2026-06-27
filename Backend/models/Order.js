const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    items: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_COMPLETED'],
      default: 'pending'
    },
    deliveryDate: {
      type: Date
    },
    date: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    reason: {
      type: {
        type: String,
        enum: ["WRONG_MEDICINE", "DAMAGED_PRODUCT", "EXPIRED_PRODUCT", "MISSING_ITEMS", "OTHER"]
      },
      customReason: String
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

module.exports = mongoose.model('Order', orderSchema);
