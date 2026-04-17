/**
 * VCSA V2 - Achievement Chip Component
 * Status pills with gradient backgrounds
 */

import React from 'react';

const AchievementChip = ({
  label,
  icon = null,
  variant = 'default',  // 'default' | 'secondary' | 'success' | 'warning'
  size = 'md',          // 'sm' | 'md' | 'lg'
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-2 font-bold uppercase tracking-widest rounded-full border transition-all duration-300';

  const sizeClasses = {
    sm: 'text-[10px] px-3 py-1',
    md: 'text-xs px-4 py-1.5',
    lg: 'text-sm px-5 py-2'
  };

  const variantClasses = {
    default: 'bg-[#264191]/30 text-[#9db2ff] border-[#264191]/50',
    secondary: 'bg-[#a8b3ca]/20 text-[#3a4559] border-[#a8b3ca]/30',
    success: 'achievement-gradient text-[#3c2f00] border-[#d4af37]/50',
    warning: 'bg-[#f2ca50]/20 text-[#3c2f00] border-[#f2ca50]/30'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <span className={classes}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {label}
    </span>
  );
};

export default AchievementChip;
