import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export const PullToRefresh = ({ onRefresh, children, className = '' }) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    const container = containerRef.current;
    if (container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!pulling || refreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    // Only allow pulling down, not up
    if (distance > 0) {
      // Add resistance
      const maxPull = 120;
      const resistance = 0.4;
      setPullDistance(Math.min(distance * resistance, maxPull));
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling || refreshing) return;

    // Trigger refresh if pulled past threshold
    const threshold = 80;
    if (pullDistance >= threshold) {
      setRefreshing(true);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }

      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      // Reset if not pulled far enough
      setPullDistance(0);
    }

    setPulling(false);
    startY.current = 0;
    currentY.current = 0;
  };

  const pullProgress = Math.min(pullDistance / 120, 1);
  const rotate = pullProgress * 360;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overscrollBehaviorY: 'contain'
      }}
    >
      {/* Pull Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          opacity: pullProgress
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: refreshing ? 360 : rotate }}
            transition={{ duration: refreshing ? 1 : 0 }}
            className={`w-10 h-10 rounded-full ${
              refreshing
                ? 'bg-[#D4AF37]/20'
                : 'bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/10'
            } flex items-center justify-center`}
          >
            <RefreshCw className={`w-5 h-5 text-[#D4AF37] ${refreshing ? 'animate-spin' : ''}`} />
          </motion.div>

          {pullDistance > 80 && !refreshing && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#D4AF37] font-medium"
            >
              Release to refresh
            </motion.p>
          )}

          {refreshing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#94A3B8] font-medium"
            >
              Refreshing...
            </motion.p>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform"
        style={{
          transform: refreshing ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
