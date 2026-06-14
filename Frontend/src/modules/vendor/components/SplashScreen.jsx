import React from 'react';

import Logo from '../../../shared/components/Logo';

const SplashScreen = ({ vendorType }) => {
  // vendorType: 'pharmacy' | 'lab' | 'doctor'

  return (
    <div className="splash-container font-sans">
      {/* E Mediclub Logo — animates in */}
      <div className="splash-logo">
        <Logo showText={true} layout="stacked" />
      </div>

      {/* Vendor type label */}
      <div className="splash-vendor-label">
        {vendorType === 'pharmacy' && '💊 Pharmacy Partner Portal'}
        {vendorType === 'lab'      && '🔬 Diagnostics Partner Portal'}
        {vendorType === 'doctor'   && '👨‍⚕️ Clinical Partner Portal'}
      </div>

      {/* Shimmer loading bar */}
      <div className="splash-shimmer-bar">
        <div className="splash-shimmer-fill" />
      </div>
    </div>
  );
};

export default SplashScreen;
