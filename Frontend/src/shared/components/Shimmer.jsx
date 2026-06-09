import React from 'react';

/**
 * Premium Shimmer Loading Skeleton
 * Supports different layout templates: 'card', 'list', 'avatar', 'text'
 */
export default function Shimmer({ type = 'card', count = 1, className = '' }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'brand':
        return (
          <div className={`flex flex-col items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100 shadow-premium ${className}`}>
            <div className="w-16 h-16 rounded-full shimmer-element flex-shrink-0" />
            <div className="w-14 h-3 rounded shimmer-element" />
            <div className="w-20 h-2.5 rounded shimmer-element" />
          </div>
        );

      case 'avatar':
        return (
          <div className={`flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 ${className}`}>
            <div className="w-12 h-12 rounded-full shimmer-element flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-2/3 h-3 rounded shimmer-element" />
              <div className="w-1/2 h-2.5 rounded shimmer-element" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 ${className}`}>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl shimmer-element flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="w-1/3 h-3 rounded shimmer-element" />
                <div className="w-1/4 h-2.5 rounded shimmer-element" />
              </div>
            </div>
            <div className="w-16 h-8 rounded-lg shimmer-element" />
          </div>
        );

      case 'text':
        return (
          <div className={`flex flex-col gap-2 ${className}`}>
            <div className="w-full h-3 rounded shimmer-element" />
            <div className="w-11/12 h-3 rounded shimmer-element" />
            <div className="w-4/5 h-3 rounded shimmer-element" />
            <div className="w-2/3 h-3 rounded shimmer-element" />
          </div>
        );

      case 'card':
      default:
        return (
          <div className={`bg-white rounded-3xl p-4 border border-slate-100 shadow-premium flex flex-col gap-3 overflow-hidden relative ${className}`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-emerald-500 to-forest" />
            <div className="w-full h-28 rounded-2xl shimmer-element" />
            <div className="w-1/3 h-2 bg-teal-light rounded shimmer-element" />
            <div className="w-5/6 h-4.5 rounded shimmer-element" />
            <div className="w-1/2 h-3.5 rounded shimmer-element" />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex flex-col gap-1">
                <div className="w-12 h-3 rounded shimmer-element" />
                <div className="w-16 h-4.5 rounded shimmer-element" />
              </div>
              <div className="w-20 h-8 rounded-full shimmer-element" />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}
