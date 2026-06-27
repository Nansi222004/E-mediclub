import { motion } from 'framer-motion';

export default function AuthCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white rounded-[32px] p-8 border border-slate-100/60 shadow-premium glass-card relative overflow-hidden flex flex-col gap-6"
    >
      {/* Dynamic ambient highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-light/40 rounded-full filter blur-xl opacity-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-forest-light/40 rounded-full filter blur-xl opacity-80 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-6">
        {children}
      </div>
    </motion.div>
  );
}
