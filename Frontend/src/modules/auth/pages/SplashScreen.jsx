import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from '../../../shared/components/Logo';
import Shimmer from '../../../shared/components/Shimmer';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500); // 2.5 seconds duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7FCFB] overflow-hidden select-none">
      {/* Background ambient glowing medical blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal/20 rounded-full filter blur-3xl opacity-60 animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-forest/15 rounded-full filter blur-3xl opacity-50 animate-pulse-subtle" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/90 to-transparent" />

      {/* Main logo symbol container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex flex-col items-center gap-5 z-10 w-full max-w-sm px-6"
      >
        <Logo showText={true} layout="stacked" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full"
        >
          <Shimmer type="brand" count={1} className="bg-white/80 shadow-premium border border-slate-100/80" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.24em] text-center"
        >
          Your Clinical Healthcare Partner
        </motion.p>
      </motion.div>

      {/* Loading indicator bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          className="h-full bg-teal"
        />
      </div>
    </div>
  );
}
