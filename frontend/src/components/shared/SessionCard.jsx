import React from 'react';
import { Play, Clock, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SessionCard({ session, onClick, completed = false, locked = false }) {
  const categoryColors = {
    'Mindset': 'bg-purple-500/20 text-purple-300',
    'Discovery': 'bg-blue-500/20 text-blue-300',
    'Value': 'bg-green-500/20 text-green-300',
    'Closing': 'bg-orange-500/20 text-orange-300',
    'Objections': 'bg-red-500/20 text-red-300',
    'Post-Sale': 'bg-yellow-500/20 text-yellow-300'
  };

  if (locked) {
    return (
      <div className="glass-card rounded-xl p-6 opacity-60">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-surface-container p-3 rounded-lg">
            <Lock className="text-on-surface-variant" size={20} />
          </div>
          <Lock className="text-on-surface-variant" size={16} />
        </div>
        <h3 className="text-lg font-semibold text-on-surface mb-2">{session.title}</h3>
        <p className="text-on-surface-variant text-sm mb-4">{session.description}</p>
        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span className="flex items-center">
            <Clock size={14} className="inline mr-1" />
            {session.duration}
          </span>
          <span className="px-2 py-1 bg-surface-container rounded-full text-xs">
            Locked
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="glass-card rounded-xl p-6 cursor-pointer hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${completed ? 'bg-green-500/20' : 'bg-primary/10'} p-3 rounded-lg`}>
          <Play className={`${completed ? 'text-green-400' : 'text-primary'}`} size={20} />
        </div>
        {completed && (
          <CheckCircle className="text-green-400" size={20} />
        )}
      </div>

      <h3 className="text-lg font-semibold text-on-surface mb-2">
        {session.title}
      </h3>
      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
        {session.description}
      </p>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-on-surface-variant flex items-center">
          <Clock size={14} className="inline mr-1" />
          {session.duration}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[session.category] || 'bg-surface-container text-on-surface-variant'}`}>
          {session.category || 'General'}
        </span>
      </div>

      {session.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-on-surface-variant">Progress</span>
            <span className="text-on-surface">{session.progress}%</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
          completed
            ? 'bg-green-500/20 text-green-300'
            : 'bg-primary text-on-primary hover:bg-primary/90'
        }`}
      >
        {completed ? '✓ Completed' : session.progress > 0 ? 'Continue' : 'Start'}
      </button>
    </motion.div>
  );
}
