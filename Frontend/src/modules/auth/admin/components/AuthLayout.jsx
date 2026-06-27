import { motion } from 'framer-motion';
import Logo from '../../../../shared/components/Logo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden relative">
      
      {/* 1. Left Side: Healthcare SaaS Vector Backdrop Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-forest to-teal-dark p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Animated backdrop circles */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/10 blur-2xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
        />
        <div className="absolute top-1/3 left-1/4 w-44 h-44 rounded-full bg-teal-light/10 blur-xl animate-pulse-subtle" />

        {/* Branding header */}
        <div className="z-10 flex items-center gap-2 select-none text-white brightness-200">
          <Logo showText={true} />
        </div>

        {/* Content Callout */}
        <div className="z-10 text-white max-w-md flex flex-col gap-4">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight leading-tight"
          >
            Clinical Platform <br />
            Control Center.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/80 text-sm leading-relaxed font-medium"
          >
            Authorized access point securing HIPAA compliant database parameters, payout Statements, and outpatient booking logs.
          </motion.p>
        </div>

        {/* Footer legalities */}
        <div className="z-10 text-white/50 text-[10px] font-black uppercase tracking-wider">
          © {new Date().getFullYear()} E Mediclub. All rights reserved.
        </div>

      </div>

      {/* 2. Right Side: Centered Glassmorphic Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Ambient glow blobs on background */}
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-teal-light rounded-full filter blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-forest-light rounded-full filter blur-3xl opacity-50 pointer-events-none" />

        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo showText={true} />
          </div>
          {children}
        </div>
      </div>

    </div>
  );
}
