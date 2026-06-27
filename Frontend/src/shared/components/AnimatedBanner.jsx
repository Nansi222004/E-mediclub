import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

export default function AnimatedBanner({
  type = 'generics',
  banners = [],
  compact = false,
  className = '',
  showIndicators = true
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultBanners = useMemo(() => ({
    generics: [
      {
        title: 'Save up to 30% on Generics',
        subtitle: 'High-quality medicines at affordable prices',
        bgGradient: 'linear-gradient(135deg, #0F9D8A 0%, #157A6E 100%)',
        badge: 'MED',
        discount: 'Up to 30% OFF',
        eyebrow: 'Today Only',
        cta: 'Shop Now',
        route: '/categories'
      },
      {
        title: 'E Mediclub Picks for Everyday Care',
        subtitle: 'Trusted medicines, local pricing, and quick checkout',
        bgGradient: 'linear-gradient(135deg, #0B6B5F 0%, #0EA5A4 100%)',
        badge: 'HOT',
        discount: 'Top Rated',
        eyebrow: 'Featured',
        cta: 'Explore',
        route: '/medicines'
      }
    ],
    doctors: [
      {
        title: 'First Consultation FREE with code FIRST',
        subtitle: 'Connect with certified specialists today',
        bgGradient: 'linear-gradient(135deg, #0EA5A4 0%, #0F766E 100%)',
        badge: 'DOC',
        discount: 'Free First Visit',
        eyebrow: 'Limited Offer',
        cta: 'Book Now',
        route: '/doctor-appointments'
      },
      {
        title: 'Ask a Specialist, Skip the Wait',
        subtitle: 'Fast appointments, verified doctors, and friendly care',
        bgGradient: 'linear-gradient(135deg, #0F766E 0%, #135A57 100%)',
        badge: 'CARE',
        discount: 'Quick Consults',
        eyebrow: 'Telehealth',
        cta: 'See Doctors',
        route: '/doctor-appointments'
      }
    ],
    labs: [
      {
        title: 'Home Sample Collection Available 24/7',
        subtitle: 'Get tested in the comfort of your home',
        bgGradient: 'linear-gradient(135deg, #14B8A6 0%, #0F9D8A 100%)',
        badge: 'LAB',
        discount: 'Home Collection',
        eyebrow: 'Fast Reports',
        cta: 'Book Test',
        route: '/lab-tests'
      },
      {
        title: 'Health Quotes, Lab Offers, and Report Alerts',
        subtitle: 'Small reminders that help you keep moving forward',
        bgGradient: 'linear-gradient(135deg, #0F9D8A 0%, #0B7285 100%)',
        badge: 'FIT',
        discount: 'Daily Care',
        eyebrow: 'Wellness',
        cta: 'See Tests',
        route: '/lab-tests'
      }
    ]
  }), []);

  const displayBanners = banners.length > 0 ? banners : (defaultBanners[type] || defaultBanners.generics);

  useEffect(() => {
    setCurrentIndex(0);
  }, [displayBanners.length, type]);

  useEffect(() => {
    if (displayBanners.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  const banner = displayBanners[currentIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full overflow-hidden shadow-premium ${compact ? 'min-h-[84px] rounded-[20px]' : 'min-h-[96px] rounded-2xl'} ${className}`}
    >
      <div className="absolute inset-0" style={{ background: banner.bgGradient }} />

      <motion.div
        className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-5 top-4 hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-white/12 backdrop-blur-md border border-white/10"
        animate={{ scale: [0.92, 1.06, 0.96], rotate: [0, 8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FiStar className="text-white text-xl" />
      </motion.div>

      <div className={`relative ${compact ? 'min-h-[84px] px-4 md:px-5 py-3.5' : 'min-h-[96px] px-4 md:px-6 py-4'} flex items-center justify-between gap-3 md:gap-4`}>
        <div className="flex-1 min-w-0 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {banner.eyebrow && (
                  <span className="text-[8px] font-black uppercase tracking-[0.24em] bg-white/15 px-2 py-1 rounded-full border border-white/15">
                    {banner.eyebrow}
                  </span>
                )}
                {banner.discount && (
                  <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-400 text-slate-900 px-2 py-1 rounded-full">
                    {banner.discount}
                  </span>
                )}
              </div>
              <h3 className={`${compact ? 'text-[12px] sm:text-sm md:text-[15px]' : 'text-[13px] sm:text-sm md:text-base'} font-extrabold leading-tight truncate md:whitespace-normal`}>
                {banner.title}
              </h3>
              <p className={`${compact ? 'text-[9px]' : 'text-[10px]'} md:text-xs font-semibold opacity-90 mt-1 line-clamp-1 md:line-clamp-2`}>
                {banner.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <motion.div
            className={`${compact ? 'text-[11px]' : 'text-[12px]'} font-black tracking-[0.28em] text-white w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 border border-white/15 flex items-center justify-center`}
            animate={{ scale: [0.96, 1.08, 0.96], rotate: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {banner.badge}
          </motion.div>
          <button
            onClick={() => navigate(banner.route || '/')}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-black text-[10px] md:text-xs rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer border-0 uppercase tracking-wider whitespace-nowrap min-h-[38px]"
          >
            {banner.cta}
          </button>
        </div>
      </div>

      {showIndicators && displayBanners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
          {displayBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
