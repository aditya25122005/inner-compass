import React from 'react';

const MentalStatusCard = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <h2 className="text-xl font-bold text-gray-300 self-start mb-2">Mental Status</h2>

    {/* ✅ Make parent relative */}
    <div className="mental-score-ring relative w-40 h-40">
      <div className="absolute w-full h-full rounded-full border-[10px] border-gray-700"></div>
      <div
        className="absolute w-full h-full rounded-full border-[10px] border-transparent"
        style={{
          background: 'conic-gradient(var(--accent-blue) 72%, #4b5563 72%)',
          mask: 'radial-gradient(transparent 72px, #fff 72px)',
          WebkitMask: 'radial-gradient(transparent 72px, #fff 72px)' // ✅ for Chrome/Safari
        }}
      ></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-gray-200 text-lg font-bold leading-none">Balanced</span>
        <span className="score-text text-glow">72</span>
      </div>
    </div>

    <p className="score-label">Mental Score</p>
  </div>
);

export default MentalStatusCard;
