import React from 'react';

const ActivityCard = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-300 mb-4">Weekly Activity</h2>
    <svg viewBox="0 0 400 200" className="activity-chart w-full h-full">
      <text x="10" y="20" className="text-sm fill-gray-400">80</text>
      <text x="10" y="50" className="text-sm fill-gray-400">70</text>
      <text x="10" y="80" className="text-sm fill-gray-400">60</text>
      <text x="10" y="110" className="text-sm fill-gray-400">50</text>
      <text x="40" y="175" className="text-sm fill-gray-400">Week 1</text>
      <text x="120" y="175" className="text-sm fill-gray-400">Week 2</text>
      <text x="200" y="175" className="text-sm fill-gray-400">Week 3</text>
      <text x="280" y="175" className="text-sm fill-gray-400">Week 4</text>
      <path d="M 40 20 L 380 20" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
      <path d="M 40 50 L 380 50" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
      <path d="M 40 80 L 380 80" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
      <path d="M 40 110 L 380 110" stroke="#4b5563" strokeWidth="1" strokeDasharray="4" />
      <path
        d="M 40 100 C 100 80, 140 10, 180 20 C 220 30, 260 5, 300 40 C 340 70, 380 50, 420 50"
        stroke="url(#gradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="100" r="4" fill="#6366f1" className="interactive" />
      <circle cx="120" cy="80" r="4" fill="#8b5cf6" className="interactive" />
      <circle cx="200" cy="50" r="4" fill="#06b6d4" className="interactive" />
      <circle cx="280" cy="65" r="4" fill="#8b5cf6" className="interactive" />
      <circle cx="360" cy="40" r="4" fill="#6366f1" className="interactive" />
    </svg>
  </div>
);

export default ActivityCard;