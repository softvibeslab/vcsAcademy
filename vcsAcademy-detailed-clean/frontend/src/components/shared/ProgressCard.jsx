import React from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProgressCard({
  title,
  current,
  total,
  label,
  subtitle,
  color = 'primary',
  icon: Icon = TrendingUp,
  showPercentage = true
}) {
  const percentage = Math.round((current / total) * 100);

  const colorClasses = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      progress: 'bg-primary'
    },
    secondary: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      progress: 'bg-secondary'
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      progress: 'bg-green-400'
    },
    gold: {
      bg: 'bg-primary/20',
      text: 'text-primary',
      progress: 'bg-gradient-to-r from-primary to-secondary'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${colors.bg} p-2 rounded-lg`}>
            <Icon className={colors.text} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
            {subtitle && (
              <p className="text-sm text-on-surface-variant">{subtitle}</p>
            )}
          </div>
        </div>
        {showPercentage && (
          <span className="text-2xl font-bold text-on-surface">{percentage}%</span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Progress</span>
          <span className="text-on-surface font-medium">{current} / {total}</span>
        </div>

        <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-3 rounded-full ${colors.progress} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        {label && (
          <p className="text-sm text-on-surface-variant mt-2">{label}</p>
        )}
      </div>

      {percentage === 100 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-green-400">
            <Award size={16} />
            <span className="text-sm font-medium">Completed!</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
