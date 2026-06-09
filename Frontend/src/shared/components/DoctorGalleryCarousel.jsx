import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const docHighlights = [
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    title: "Instant Secure Video Consultations",
    subtitle: "Discuss health concerns from the comfort of your home with active HD calling"
  },
  {
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    title: "Sterile and Guided In-Clinic Bookings",
    subtitle: "Get prioritized offline OPD slots at top city-partnered hospitals"
  },
  {
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    title: "100% Certified Clinical Specialists",
    subtitle: "Highly experienced doctors with verified registrations and active certifications"
  }
];

export default function DoctorGalleryCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % docHighlights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 rounded-3xl overflow-hidden shadow-premium select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={docHighlights[index].url}
            alt="Doctor Consultation Highlight"
            className="w-full h-full object-cover filter brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-7 md:p-8 text-white">
            <h4 className="text-base sm:text-lg md:text-xl font-extrabold tracking-wide leading-tight">
              {docHighlights[index].title}
            </h4>
            <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1.5 font-sans leading-relaxed">
              {docHighlights[index].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {docHighlights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all border-0 p-0 cursor-pointer ${
              index === idx ? 'bg-white w-5' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
