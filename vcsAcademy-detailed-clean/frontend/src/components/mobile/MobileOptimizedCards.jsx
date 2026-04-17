import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, DollarSign, Target, Award, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Flame,
  Star, Trophy, ChevronRight, Play, BookOpen
} from 'lucide-react';

export const MobileMetricCard = ({ title, value, change, icon: Icon, color, delay }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileTap={{ scale: 0.98 }}
      className="active:scale-98 transition-transform"
    >
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/10 flex items-center justify-center">
              <Icon className={`w-6 h-6 ${color}`} />
            </div>

            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 text-green-400" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-[#94A3B8] font-medium">{title}</p>
            <p className="text-2xl font-bold text-[#F1F5F9]">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const MobileActionCard = ({ title, description, icon: Icon, badge, color, onClick, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`bg-gradient-to-br ${color} border border-white/10 overflow-hidden h-full`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>

            {badge && (
              <Badge className="bg-white/20 text-white border-none text-xs">
                {badge}
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{description}</p>

          <div className="flex items-center gap-2 mt-3 text-white/60">
            <span className="text-xs">Tap to open</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const MobileProgressCard = ({ title, progress, total, icon: Icon, delay }) => {
  const percentage = Math.round((progress / total) * 100);
  const isCompleted = percentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <Card className={`bg-gradient-to-br ${isCompleted ? 'from-[#D4AF37]/20 to-[#B4942D]/10' : 'from-[#1E293B] to-[#0F172A]'} border ${isCompleted ? 'border-[#D4AF37]/30' : 'border-white/10'} overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${isCompleted ? 'bg-[#D4AF37]/20' : 'bg-white/5'} flex items-center justify-center`}>
              {isCompleted ? (
                <Trophy className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <Icon className="w-5 h-5 text-[#94A3B8]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#F1F5F9] truncate">{title}</h4>
              <p className="text-xs text-[#94A3B8]">
                {progress} of {total} completed
              </p>
            </div>

            {isCompleted && (
              <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-none">
                Done
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-[#0F172A] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`absolute top-0 left-0 h-full ${isCompleted ? 'bg-gradient-to-r from-[#D4AF37] to-[#B4942D]' : 'bg-gradient-to-r from-blue-500 to-blue-600'} rounded-full`}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#94A3B8]">{percentage}% complete</span>

            {isCompleted ? (
              <button className="text-xs text-[#D4AF37] flex items-center gap-1">
                <Award className="w-3 h-3" />
                Claim badge
              </button>
            ) : (
              <button className="text-xs text-[#94A3B8] flex items-center gap-1">
                <Play className="w-3 h-3" />
                Continue
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const MobileQuickActionCard = ({ title, icon: Icon, onPress, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onPress={onPress}
      className="cursor-pointer"
    >
      <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-2 shadow-lg`}>
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-white text-center">{title}</span>
      </div>
    </motion.div>
  );
};

export const MobileAIGreetingCard = ({ userName, timeOfDay, message, delay }) => {
  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 18) return '🌤️';
    return '🌙';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <Card className="bg-gradient-to-br from-[#D4AF37]/20 via-[#B4942D]/10 to-[#1E293B] border border-[#D4AF37]/30 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B4942D] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl">{getGreetingEmoji()}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#D4AF37] font-medium mb-1">
                {timeOfDay}, {userName}!
              </p>
              <h3 className="text-lg font-bold text-white mb-2">{message}</h3>

              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-white/80">
                  You're on a 5-day streak! Keep it up!
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const MobileTrainingCard = ({ title, category, duration, progress, thumbnail, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 overflow-hidden">
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37]/30 to-[#B4942D]/20 flex items-center justify-center flex-shrink-0">
            <Play className="w-8 h-8 text-[#D4AF37]" />
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-none text-xs mb-1 w-fit">
                {category}
              </Badge>
              <h4 className="font-semibold text-[#F1F5F9] text-sm line-clamp-1">{title}</h4>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                <Clock className="w-3 h-3" />
                <span>{duration} min</span>
              </div>

              {progress > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B4942D] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#94A3B8]">{progress}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const MobileStreakCard = ({ currentStreak, bestStreak, daysActive, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <Card className="bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-[#1E293B] border border-orange-500/30 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-orange-300 font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-white">{currentStreak}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-orange-300/80">Best</p>
              <p className="text-lg font-semibold text-orange-300">{bestStreak} days</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{daysActive} days active this month</span>
            </div>

            <button className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg text-xs font-medium transition-colors">
              View Stats
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default {
  MobileMetricCard,
  MobileActionCard,
  MobileProgressCard,
  MobileQuickActionCard,
  MobileAIGreetingCard,
  MobileTrainingCard,
  MobileStreakCard
};
