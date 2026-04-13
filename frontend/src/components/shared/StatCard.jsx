import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, change, color = 'primary', loading = false }) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    green: 'text-green-400',
    red: 'text-red-400',
    blue: 'text-blue-400'
  };

  const bgClasses = {
    primary: 'bg-primary/10',
    secondary: 'bg-secondary/10',
    green: 'bg-green-400/10',
    red: 'bg-red-400/10',
    blue: 'bg-blue-400/10'
  };

  if (loading) {
    return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      <div className="h-20 bg-surface-container rounded"></div>
    </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-on-surface-variant text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-on-surface">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`${bgClasses[color]} p-3 rounded-lg`}>
          <Icon className={colorClasses[color]} size={24} />
        </div>
      </div>
    </motion.div>
  );
}
