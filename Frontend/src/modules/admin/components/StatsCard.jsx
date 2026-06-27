import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatsCard({ title, value, change, isPositive = true, icon: Icon, color = 'teal', sparklineData = [10, 20, 15, 30, 25, 40] }) {
  
  // Custom color mappings matching E Mediclub CSS tokens
  const colorMap = {
    teal: {
      light: 'bg-teal-light text-teal border-teal/10',
      gradient: 'from-teal/5 to-teal-light/20',
      sparkColor: 'var(--color-teal)'
    },
    forest: {
      light: 'bg-teal-light text-forest border-forest/10',
      gradient: 'from-forest/5 to-teal-light/20',
      sparkColor: 'var(--color-forest)'
    },
    coral: {
      light: 'bg-coral-light text-coral border-coral/10',
      gradient: 'from-coral/5 to-coral-light/20',
      sparkColor: 'var(--color-coral)'
    },
    gold: {
      light: 'bg-gold-light text-gold-dark border-gold/10',
      gradient: 'from-gold/5 to-gold-light/20',
      sparkColor: 'var(--color-gold)'
    }
  };

  const activeColor = colorMap[color] || colorMap.teal;

  // Render SVG Sparkline
  const width = 120;
  const height = 40;
  const points = sparklineData.map((val, index) => {
    const x = (index / (sparklineData.length - 1)) * width;
    // Normalize val assuming max of 50 and min of 0
    const y = height - ((val / 50) * height);
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card rounded-[28px] border border-slate-100/60 p-4 sm:p-5 shadow-premium bg-gradient-to-br ${activeColor.gradient} hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate" title={title}>
            {title}
          </span>
          <div className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate">
            {value}
          </div>
        </div>
        
        {/* Dynamic Rounded Icon Plate */}
        <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 ${activeColor.light}`}>
          <Icon className="text-base sm:text-xl shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-slate-100/40 gap-2">
        {/* Percentage trend indicators */}
        <div className="flex items-center gap-1 min-w-0 flex-wrap">
          {isPositive ? (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-black text-teal bg-teal-light px-1.5 sm:px-2 py-0.5 rounded-full uppercase shrink-0">
              <FiTrendingUp className="text-[10px] sm:text-xs" /> {change}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-black text-coral bg-coral-light px-1.5 sm:px-2 py-0.5 rounded-full uppercase shrink-0">
              <FiTrendingDown className="text-[10px] sm:text-xs" /> {change}
            </span>
          )}
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-extrabold uppercase whitespace-nowrap">vs last month</span>
        </div>

        {/* Custom Mini Sparkline SVG */}
        <svg width={width} height={height} className="overflow-visible opacity-80 shrink-0 hidden sm:block">
          <polyline
            fill="none"
            stroke={activeColor.sparkColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="sparkline-path"
          />
        </svg>
      </div>
    </motion.div>
  );
}
