import { motion } from 'framer-motion';
import { Flame, Award, Star, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const StreakDisplay = ({ streakData }) => {
  if (!streakData) {
    return null;
  }

  const { streak_days, bonus_points, next_badge } = streakData;

  const badges = [
    { name: 'Week Warrior', days: 7, icon: '🔥', color: 'from-orange-500/20 to-red-500/20', borderColor: 'border-orange-500/30' },
    { name: 'Two Week Titan', days: 14, icon: '⚡', color: 'from-blue-500/20 to-purple-500/20', borderColor: 'border-blue-500/30' },
    { name: 'Month Master', days: 30, icon: '👑', color: 'from-[#D4AF37]/20 to-yellow-500/20', borderColor: 'border-[#D4AF37]/30' },
  ];

  const getNextBadge = () => {
    if (streak_days < 7) return badges[0];
    if (streak_days < 14) return badges[1];
    if (streak_days < 30) return badges[2];
    return null;
  };

  const nextBadge = getNextBadge();
  const progressToNext = nextBadge
    ? ((streak_days % (nextBadge.days === 7 ? 7 : nextBadge.days === 14 ? 14 : 30)) / nextBadge.days) * 100
    : 100;

  const getStreakLevel = (days) => {
    if (days >= 30) return { level: 'Elite', color: 'text-[#D4AF37]', bgColor: 'bg-[#D4AF37]/10' };
    if (days >= 14) return { level: 'Advanced', color: 'text-purple-400', bgColor: 'bg-purple-500/10' };
    if (days >= 7) return { level: 'Intermediate', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    return { level: 'Beginner', color: 'text-gray-400', bgColor: 'bg-gray-500/10' };
  };

  const streakLevel = getStreakLevel(streak_days);

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#F59E0B]" />
            Current Streak
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Days you've consistently tracked your metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                className="relative"
              >
                <div className={`w-40 h-40 rounded-full ${streakLevel.bgColor} bg-gradient-to-br border-2 ${streakLevel.borderColor || 'border-white/10'} flex items-center justify-center mx-auto`}>
                  <div>
                    <Flame className={`w-12 h-12 ${streakLevel.color} mx-auto mb-2`} />
                    <p className="text-5xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                      {streak_days}
                    </p>
                    <p className="text-sm text-[#94A3B8] mt-1">days</p>
                  </div>
                </div>
                {streak_days > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Badge className={`${streakLevel.bgColor} ${streakLevel.color} border-0 font-bold`}>
                      {streakLevel.level}
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {bonus_points > 0 && (
            <div className="mt-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-[#D4AF37]">Bonus Points Earned</p>
                  <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                    +{bonus_points}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Badge Progress */}
      {nextBadge && (
        <Card className={`bg-gradient-to-br ${nextBadge.color} border ${nextBadge.borderColor}`}>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              Next Badge: {nextBadge.name}
            </CardTitle>
            <CardDescription className="text-[#94A3B8]">
              {nextBadge.days - streak_days} more days to unlock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94A3B8]">Progress</span>
                  <span className="text-sm font-['JetBrains_Mono'] text-[#F8FAFC]">
                    {streak_days} / {nextBadge.days} days
                  </span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm">
                <span className="text-3xl">{nextBadge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">{nextBadge.name}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {streak_days >= nextBadge.days
                      ? 'Unlocked! 🎉'
                      : `${nextBadge.days - streak_days} days remaining`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Badges Overview */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            Streak Badges
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Earn badges for consistent daily tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge, index) => {
              const isUnlocked = streak_days >= badge.days;
              const isNext = nextBadge?.name === badge.name;

              return (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-sm border transition-all ${
                    isUnlocked
                      ? `${badge.color} ${badge.borderColor} bg-gradient-to-br`
                      : isNext
                        ? 'bg-white/5 border-white/20'
                        : 'bg-black/30 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-3xl ${!isUnlocked ? 'grayscale' : ''}`}>
                      {badge.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isUnlocked ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>
                        {badge.name}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1">{badge.days} days</p>
                      {isUnlocked && (
                        <Badge className={`mt-2 ${badge.bgColor} text-xs`}>
                          Unlocked
                        </Badge>
                      )}
                      {isNext && !isUnlocked && (
                        <Badge className="mt-2 bg-[#D4AF37]/10 text-[#D4AF37] text-xs border border-[#D4AF37]/30">
                          Next
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
