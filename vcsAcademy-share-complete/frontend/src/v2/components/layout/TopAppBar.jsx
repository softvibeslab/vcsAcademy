/**
 * VCSA V2 - Top App Bar Component
 * Header with avatar, title, and navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';

const TopAppBar = ({
  title = 'The Vault',
  subtitle = null,
  showNav = true,
  user = null
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131317] bg-gradient-to-b from-[#1b1b20] to-transparent shadow-[0_20px_40px_-15px_rgba(242,202,80,0.06)] flex justify-between items-center px-8 h-20">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-[#353439] border border-[#4d4635]/20 overflow-hidden">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#d4af37] to-[#f2ca50] flex items-center justify-center">
              <span className="text-[#3c2f00] font-headline font-bold text-lg">
                {user?.name?.[0] || 'V'}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="font-headline font-bold text-[1.75rem] tracking-tight text-[#D4AF37]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#d0c5af] uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Navigation + Actions */}
      <div className="flex items-center gap-6">
        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex gap-8 text-[#d0c5af]">
            <Link
              to="/v2/dashboard"
              className="font-headline font-medium text-[0.75rem] uppercase tracking-widest hover:text-[#f2ca50] transition-colors duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/v2/training"
              className="font-headline font-medium text-[0.75rem] uppercase tracking-widest text-[#f2ca50] transition-colors duration-300"
            >
              Training
            </Link>
            <Link
              to="/v2/coaching"
              className="font-headline font-medium text-[0.75rem] uppercase tracking-widest hover:text-[#f2ca50] transition-colors duration-300"
            >
              Coaching
            </Link>
            <Link
              to="/v2/resources"
              className="font-headline font-medium text-[0.75rem] uppercase tracking-widest hover:text-[#f2ca50] transition-colors duration-300"
            >
              Resources
            </Link>
          </nav>
        )}

        {/* Streak Badge */}
        <div className="flex items-center gap-2 bg-[#1b1b20] px-4 py-2 rounded-full border border-[#4d4635]/15">
          <span className="material-symbols-outlined text-[#f2ca50] text-xl filled">local_fire_department</span>
          <span className="font-headline font-bold text-[#f2ca50]">15</span>
        </div>

        {/* Notifications */}
        <button className="text-[#D4AF37] transition-all duration-300 active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
};

export default TopAppBar;
