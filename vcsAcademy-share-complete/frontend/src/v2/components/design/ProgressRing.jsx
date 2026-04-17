/**
 * VCSA V2 - Progress Ring Component
 * SVG circular progress indicator
 */

import React from 'react';

const ProgressRing = ({
  value = 0,           // 0-100
  size = 256,          // Pixel size
  strokeWidth = 12,    // Width of progress ring
  showPercentage = true,
  label = 'Readiness Score',
  trend = null,        // { value: 5, label: 'this week' }
  className = ''
}) => {
  // Calculate SVG properties
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[#201f24]"
          />

          {/* Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-[#f2ca50] gold-glow transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center">
          {showPercentage && (
            <span className="text-display-lg text-[#f2ca50] tracking-tighter">
              {Math.round(value)}
            </span>
          )}
          <span className="text-label-md text-[#d0c5af] uppercase tracking-widest mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-6 flex items-center gap-2 bg-[#264191]/20 text-[#9db2ff] px-4 py-1.5 rounded-full text-sm font-medium border border-[#264191]/30">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span>{trend.value}% {trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
