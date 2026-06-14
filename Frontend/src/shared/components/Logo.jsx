import React, { useEffect } from 'react';

const logoEmblem = '/assets/logo_emblem.png';

/**
 * E Mediclub Authentic Logo Component
 * Renders the emblem icon and the cursive brand text "Emediclub"
 * using the HTML text node styled with Great Vibes font in brand red.
 */
export default function Logo({ showText = true, layout = 'horizontal' }) {
  useEffect(() => {
    // Pre-cache fonts as a fallback (if still needed elsewhere)
    const fontId = 'google-fonts-cursive';
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Alex+Brush&family=Allura&family=Playball&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Stacked layout for splash, login, and auth pages
  if (layout === 'stacked') {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-transparent">
        {/* Emblem portion */}
        <div className="w-28 h-28 rounded-3xl overflow-hidden border border-slate-100/50 shadow-premium flex items-center justify-center bg-white select-none animate-pulse-subtle shrink-0">
          <img
            src={logoEmblem}
            alt="E Mediclub Icon"
            className="w-full h-full object-contain p-3"
            loading="eager"
          />
        </div>
        
        {/* Brand text portion */}
        {showText && (
          <span 
            style={{ 
              fontFamily: "'Great Vibes', cursive", 
              color: '#9B2C3A' 
            }} 
            className="text-3xl sm:text-4xl font-bold select-none mt-1.5 block"
          >
            Emediclub
          </span>
        )}
      </div>
    );
  }

  // Standard horizontal layout for Navbars & Footers
  return (
    <div className="flex items-center gap-1 select-none bg-transparent">
      {/* Icon portion (green E emblem) */}
      <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100/50 shadow-sm hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white shrink-0">
        <img
          src={logoEmblem}
          alt="E Mediclub Icon"
          className="w-full h-full object-contain p-1"
          loading="eager"
        />
      </div>
      
      {/* Brand text portion */}
      {showText && (
        <span 
          style={{ 
            fontFamily: "'Great Vibes', cursive", 
            color: '#9B2C3A' 
          }} 
          className="text-xl sm:text-2xl md:text-3xl font-bold shrink-0 tracking-wide select-none leading-none pt-1"
        >
          Emediclub
        </span>
      )}
    </div>
  );
}

