const Order = require('../models/Order');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Cancel an order
// @route   POST /api/orders/:id/cancel
// @access  Protected
const cancelOrder = async (req, res, next) => {
  try {
    const { reason, customReason } = req.body;
    
    // Backend Validation
    if (reason === "Other" && !customReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please specify your reason."
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return ApiResponse.error(res, 404, 'Order not found');
    }

    // Ensure the user owns the order or is an admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 403, 'Not authorized to cancel this order');
    }

    if (order.status === 'Cancelled' || order.status === 'Delivered') {
      return ApiResponse.error(res, 400, 'Order cannot be cancelled');
    }

    order.status = 'Cancelled';
    order.reason = reason;
    order.customReason = reason === 'Other' ? customReason.trim() : '';
    
    // Set refund status if applicable
    if (order.paymentStatus === 'Paid') {
      order.refundStatus = 'Pending';
    } else {
      order.refundStatus = 'Not Applicable';
    }

    await order.save();

    return ApiResponse.success(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
};

// @desc    Return an order
// @route   POST /api/orders/:id/return
// @access  Protected
const returnOrder = async (req, res, next) => {
  try {
    const { reason, customReason } = req.body;
    
    // Backend Validation
    if (reason === "Other" && !customReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please specify your reason."
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return ApiResponse.error(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return ApiResponse.error(res, 403, 'Not authorized to return this order');
    }

    if (order.status !== 'Delivered') {
      return ApiResponse.error(res, 400, 'Only delivered orders can be returned');
    }

    order.returnStatus = 'Requested';
    order.reason = reason;
    order.customReason = reason === 'Other' ? customReason.trim() : '';
    order.refundStatus = 'Pending';

    await order.save();

    return ApiResponse.success(res, 200, 'Return requested successfully', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cancelOrder,
  returnOrder
};
