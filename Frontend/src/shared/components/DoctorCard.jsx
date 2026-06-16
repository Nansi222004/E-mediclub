import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiClock, FiActivity, FiArrowRight, FiStar } from 'react-icons/fi';

export default function DoctorCard({ doctor, onViewProfile }) {
  const navigate = useNavigate();
  const appointments = useSelector(state => state.products.appointments);
  const { isAuthenticated } = useSelector(state => state.auth || {});
  const fallbackAvatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80';

  const isAppointmentActive = (apt) => {
    if (!apt.date) return false;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    if (apt.date < todayStr) return false;
    if (apt.date > todayStr) return true;
    
    const parts = apt.timeSlot.split(' - ');
    if (parts.length < 2) return true;
    const endTimeStr = parts[1].trim();
    
    const timeMatch = endTimeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return true;
    
    let hour = parseInt(timeMatch[1]);
    const min = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    if (currentHour > hour || (currentHour === hour && currentMin >= min)) {
      return false;
    }
    return true;
  };

  // Check if user already has an appointment booked with this doctor
  const isBooked = isAuthenticated && appointments.some(apt => 
    apt.doctorName === doctor.name && 
    (apt.status === 'Confirmed' || apt.status === 'Scheduled') &&
    isAppointmentActive(apt)
  );

  return (
    <div
      className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-forest/30 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden select-none transition-all duration-300 group"
    >
      <div>
        {/* Rating and Specialization row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
            {doctor.specialty}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded">
            <FiStar className="fill-amber-500 stroke-[3px]" />
            <span>{doctor.rating}</span>
            <span className="text-slate-355 font-bold"></span>
            <span className="text-slate-400 font-bold">{doctor.reviewsCount} reviews</span>
          </div>
        </div>

        {/* Doctor Identity Header */}
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0 relative border border-slate-50">
            <img
              src={doctor.avatar || fallbackAvatar}
              alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar;
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                {doctor.name}
              </h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block shrink-0" title="Active Online" />
            </div>
            <span className="text-[10.5px] text-slate-500 font-semibold block mt-0.5 truncate">
              {doctor.subSpecialty}
            </span>
            <p className="text-[10px] text-slate-400 font-bold block mt-1">
              {doctor.qualification}
            </p>
          </div>
        </div>

        {/* Doctor Quick stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50 text-[10px] text-slate-550 font-bold">
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            {doctor.experience}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            Languages: {doctor.languages?.[0] || 'English'}, {doctor.languages?.[1] || 'Hindi'}
          </p>
        </div>

        {/* Availability and hospital affiliation */}
        <div className="mt-3.5 flex flex-col gap-1 text-[10px]">
          <p className="text-slate-455 font-bold flex items-center gap-1.5 truncate">
            <span>🏥</span> {doctor.hospital}
          </p>
          <p className="text-teal-dark font-black flex items-center gap-1.5">
            <FiClock className="text-teal" /> {doctor.availability}
          </p>
        </div>
      </div>

      {/* Pricing and Action Slot */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Consultation Fee</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-base font-black text-slate-800">₹{doctor.fee}</span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">Online</span>
            </div>
            <span className="text-[9px] text-slate-400 font-bold mt-0.5">In-Clinic: ₹{doctor.offlineFee}</span>
          </div>

          <div className="flex w-full sm:w-auto items-stretch sm:items-center gap-3.5 sm:gap-3 mt-1.5 sm:mt-0">
            {/* View Profile Button */}
            <button 
              type="button"
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onViewProfile) {
                  onViewProfile();
                } else {
                  navigate('/doctor-appointments');
                }
              }}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-teal hover:underline rounded-full shadow-sm cursor-pointer transition-colors border-0 flex items-center justify-center gap-1 uppercase tracking-wide min-h-[44px] sm:min-h-[36px] min-w-0 sm:min-w-[92px] outline-none flex-1 sm:flex-initial"
            >
              <FiArrowRight className="text-[10px] shrink-0" />
              <span>Profile</span>
            </button>

            {isBooked ? (
              <span className="w-full sm:w-auto bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-2.5 rounded-full flex items-center justify-center gap-1 border border-emerald-100 min-h-[44px] sm:min-h-[36px] min-w-0 sm:min-w-[92px] select-none flex-1 sm:flex-initial">
                <FiCheckCircle className="stroke-[3px]" />
                BOOKED
              </span>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(`/doctors/${doctor.id}/book`);
                  } else {
                    navigate('/login', { state: { from: `/doctors/${doctor.id}/book` } });
                  }
                }}
                className="w-full sm:w-auto bg-forest hover:bg-forest-dark text-white font-bold text-xs px-4 py-2.5 sm:py-2 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1 cursor-pointer border-0 min-h-[44px] sm:min-h-[36px] min-w-0 sm:min-w-[92px] outline-none flex-1 sm:flex-initial"
              >
                <FiCalendar className="w-4 h-4 shrink-0" />
                <span>BOOK</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
