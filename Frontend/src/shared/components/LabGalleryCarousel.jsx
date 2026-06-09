import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const labImages = [
  {
    url: "https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&w=800&q=80",
    title: "State-of-the-art NABL Certified Facilities",
    subtitle: "Ensuring 100% precision in every clinical report"
  },
  {
    url: "https://images.unsplash.com/photo-1579154261908-5f9c1c5f0d6d?auto=format&fit=crop&w=800&q=80",
    title: "Advanced Diagnostic Testing & Screening",
    subtitle: "Equipped with high-end automated analyzers"
  },
  {
    url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    title: "Sterile and Safe Sample Collections",
    subtitle: "Your safety is our medical staff's top priority"
  }
];

export default function LabGalleryCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % labImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden shadow-premium select-none">
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
            src={labImages[index].url}
            alt="Lab Facility"
            className="w-full h-full object-cover filter brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 md:p-6 text-white">
            <h4 className="text-sm md:text-base font-extrabold tracking-wide leading-tight">
              {labImages[index].title}
            </h4>
            <p className="text-[10px] md:text-xs font-semibold opacity-90 mt-1">
              {labImages[index].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
        {labImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all border-0 p-0 cursor-pointer ${
              index === idx ? 'bg-white w-4' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
