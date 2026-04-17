/**
 * VCSA V2 - Metric Hero Component
 * Large display metrics for key numbers
 */

import React from 'react';

const MetricHero = ({
  value,
  label,
  icon = null,
  trend = null,
  size = 'lg',      // 'md' | 'lg' | 'xl'
  color = 'gold',   // 'gold' | 'white'
  className = ''
}) => {
  const sizeClasses = {
    md: 'text-4xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  const colorClasses = {
    gold: 'text-[#f2ca50]',
    white: 'text-[#e5e1e8]'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {icon && (
        <span className="material-symbols-outlined text-[#f2ca50] text-4xl mb-4 filled">
          {icon}
        </span>
      )}
      <div className={`font-headline font-bold ${sizeClasses[size]} ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      <div className="text-[#d0c5af] text-xs uppercase tracking-widest font-medium">
        {label}
      </div>
      {trend && (
        <div className="mt-2 text-sm text-[#d0c5af]">
          {trend}
        </div>
      )}
    </div>
  );
};

export default MetricHero;
