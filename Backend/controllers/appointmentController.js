const Appointment = require('../models/Appointment');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Cancel an appointment
// @route   POST /api/appointments/:id/cancel
// @access  Protected
const cancelAppointment = async (req, res, next) => {
  try {
    const { reason, customReason } = req.body;
    
    if (reason === "OTHER" && !customReason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please specify your reason."
      });
    }

    const appointment = await Appointment.findOne({ id: req.params.id });
    
    if (!appointment) {
      return ApiResponse.error(res, 404, 'Appointment not found');
    }

    if (appointment.bookingStatus === 'Cancelled' || appointment.bookingStatus === 'Completed' || appointment.bookingStatus === 'IN_PROGRESS') {
      return ApiResponse.error(res, 400, 'Appointment cannot be cancelled at this stage');
    }

    appointment.bookingStatus = 'Cancelled';
    appointment.reason = {
      type: reason,
      customReason: reason === 'OTHER' ? customReason.trim() : ''
    };
    
    appointment.refundStatus = 'Pending';

    await appointment.save();
    return ApiResponse.success(res, 200, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule an appointment
// @route   POST /api/appointments/:id/reschedule
// @access  Protected
const rescheduleAppointment = async (req, res, next) => {
  try {
    const { newDate, newTimeSlot } = req.body;
    
    if (!newDate || !newTimeSlot) {
      return ApiResponse.error(res, 400, 'New date and time slot are required');
    }

    const appointment = await Appointment.findOne({ id: req.params.id });
    
    if (!appointment) {
      return ApiResponse.error(res, 404, 'Appointment not found');
    }

    if (appointment.bookingStatus === 'Completed' || appointment.bookingStatus === 'Cancelled' || appointment.bookingStatus === 'IN_PROGRESS') {
      return ApiResponse.error(res, 400, 'Appointment cannot be rescheduled at this stage');
    }

    // Save previous slot history
    appointment.previousSlots.push({
      date: appointment.appointmentDate,
      time: appointment.timeSlot
    });

    appointment.appointmentDate = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.bookingStatus = 'RESCHEDULED';

    await appointment.save();
    return ApiResponse.success(res, 200, 'Appointment rescheduled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cancelAppointment,
  rescheduleAppointment
};
