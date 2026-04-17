/**
 * VCSA V2 - Glass Card Component
 * Glass morphism card with backdrop blur
 */

import React from 'react';

const GlassCard = ({
  children,
  variant = 'default',  // 'default' | 'elevated' | 'outlined'
  padding = 'lg',      // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  onClick = null
}) => {
  const baseClasses = 'relative rounded-xl backdrop-blur-xl border transition-all duration-300';

  const variantClasses = {
    default: 'bg-[#1b1b20]/60 border-[#4d4635]/15',
    elevated: 'bg-[#1b1b20]/60 border-[#4d4635]/15 hover-lift hover:border-[#4d4635]/25',
    outlined: 'bg-[#1b1b20]/40 border-[#4d4635]/30'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const interactiveClasses = onClick ? 'cursor-pointer hover:scale-[1.02]' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default GlassCard;
