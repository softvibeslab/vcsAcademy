import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash, Archive, Star, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: Trash, label: 'Delete', color: 'bg-red-500' },
  rightAction = { icon: Archive, label: 'Archive', color: 'bg-blue-500' },
  className = ''
}) => {
  const [x, setX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [actionTriggered, setActionTriggered] = useState(null);
  const constraintsRef = useRef(null);

  const handleDragEnd = (event, info) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right - trigger right action
      setActionTriggered('right');
      if (onSwipeRight) {
        onSwipeRight();
      }
      setTimeout(() => {
        setX(0);
        setActionTriggered(null);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left - trigger left action
      setActionTriggered('left');
      if (onSwipeLeft) {
        onSwipeLeft();
      }
      setTimeout(() => {
        setX(0);
        setActionTriggered(null);
      }, 300);
    } else {
      // Reset if not swiped far enough
      setX(0);
    }

    setIsDragging(false);
  };

  const LeftIcon = leftAction.icon;
  const RightIcon = rightAction.icon;

  return (
    <div className={`relative ${className}`} ref={constraintsRef}>
      {/* Left Action Background */}
      {onSwipeLeft && (
        <div
          className={`absolute inset-y-0 left-0 ${leftAction.color} rounded-lg flex items-center justify-end pr-6 z-0`}
          style={{
            width: Math.abs(Math.min(x, 0)) + 80,
            opacity: x < -50 ? 1 : 0
          }}
        >
          <LeftIcon className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Right Action Background */}
      {onSwipeRight && (
        <div
          className={`absolute inset-y-0 right-0 ${rightAction.color} rounded-lg flex items-center justify-start pl-6 z-0`}
          style={{
            width: Math.max(x, 0) + 80,
            opacity: x > 50 ? 1 : 0
          }}
        >
          <RightIcon className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Card Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{ x }}
        style={{ x }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative z-10 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10">
          {children}
        </Card>
      </motion.div>
    </div>
  );
};

export const SwipeableActionCard = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  onComplete,
  onArchive,
  onDelete,
  delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <SwipeableCard
        onSwipeLeft={onDelete}
        onSwipeRight={onComplete}
        leftAction={{ icon: Trash, label: 'Delete', color: 'bg-red-500' }}
        rightAction={{ icon: Check, label: 'Complete', color: 'bg-green-500' }}
      >
        <div className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-[#D4AF37]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-[#F1F5F9] truncate">{title}</h4>
              {badge && (
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded text-xs">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-[#94A3B8] truncate">{subtitle}</p>
          </div>

          <div className="flex flex-col items-center gap-1 text-[#94A3B8]">
            <span className="text-xs">Swipe</span>
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-green-500/50 rounded-full" />
              <div className="w-1 h-4 bg-red-500/50 rounded-full" />
            </div>
          </div>
        </div>
      </SwipeableCard>
    </motion.div>
  );
};

export const SwipeableNotificationCard = ({
  title,
  message,
  timestamp,
  priority,
  onRead,
  onDismiss,
  delay
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <SwipeableCard
        onSwipeLeft={onDismiss}
        onSwipeRight={onRead}
        leftAction={{ icon: Trash, label: 'Dismiss', color: 'bg-red-500' }}
        rightAction={{ icon: Check, label: 'Read', color: 'bg-green-500' }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)} mt-2 flex-shrink-0`} />

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#F1F5F9] mb-1">{title}</h4>
              <p className="text-sm text-[#94A3B8] line-clamp-2">{message}</p>
              <p className="text-xs text-[#64748B] mt-2">{timestamp}</p>
            </div>
          </div>
        </div>
      </SwipeableCard>
    </motion.div>
  );
};

export default SwipeableCard;
