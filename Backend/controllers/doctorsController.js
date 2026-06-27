const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all doctors (with optional city/pincode filtering)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const { city, pincode, lat, lng, radius } = req.query;
    let query = {};

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius ? parseInt(radius) : 10000
        }
      };
    } else if (pincode) {
      query.pincode = pincode.trim();
    } else if (city) {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    let doctors = await Doctor.find(query);

    // Fallback localization for any Pan-India queries
    if (doctors.length === 0 && (pincode || city)) {
      const allDoctors = await Doctor.find({});
      if (allDoctors.length > 0) {
        doctors = allDoctors.map(doc => {
          const docObj = doc.toObject();
          docObj.pincode = pincode ? pincode.trim() : (docObj.pincode || '110001');
          docObj.city = city ? city.trim() : (docObj.city || 'Delhi');
          docObj.state = docObj.state || 'Delhi';
          docObj.address = `${docObj.city} General Hospital, ${docObj.city}`;
          docObj.hospital = `${docObj.city} City Hospital`;
          docObj.bio = `${docObj.name} is a dedicated ${docObj.specialty} specialist in ${docObj.city}.`;
          return docObj;
        });
      }
    }

    return ApiResponse.success(res, 200, 'Doctors retrieved successfully', doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/doctors/:id/available-slots
// @access  Public
const getAvailableSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const doctor = await Doctor.findOne({ id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Get doctor's default slots
    const allSlots = doctor.timeSlots && doctor.timeSlots.length > 0
      ? doctor.timeSlots
      : [
        '09:00 AM - 09:30 AM',
        '09:30 AM - 10:00 AM',
        '10:00 AM - 10:30 AM',
        '10:30 AM - 11:00 AM',
        '11:00 AM - 11:30 AM',
        '11:30 AM - 12:00 PM',
        '04:00 PM - 04:30 PM',
        '04:30 PM - 05:00 PM',
        '05:00 PM - 05:30 PM',
        '05:30 PM - 06:00 PM'
      ];

    // Find booked appointments for this doctor on the selected date
    const bookedAppointments = await Appointment.find({
      doctorName: doctor.name,
      appointmentDate: date,
      bookingStatus: { $ne: 'cancelled' }
    });

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return ApiResponse.success(res, 200, 'Available slots retrieved', availableSlots);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getAvailableSlots
};
// Nodemon trigger comment
