import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Trophy, Star, Flame, Target, Zap,
  Crown, Sparkles, TrendingUp, Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { API } from '@/App';
import axios from 'axios';

const BADGE_DEFINITIONS = {
  // Attribute Badges
  'attitude_master': {
    name: 'Attitude Master',
    icon: '😊',
    description: 'Achieved ATTITUDE attribute 7 days in a row',
    color: '#F59E0B',
    requirement: 7
  },
  'courage_champion': {
    name: 'Courage Champion',
    icon: '🦁',
    description: 'Achieved COURAGE attribute 7 days in a row',
    color: '#EF4444',
    requirement: 7
  },
  'focus_expert': {
    name: 'Focus Expert',
    icon: '🎯',
    description: 'Achieved FOCUS attribute 7 days in a row',
    color: '#3B82F6',
    requirement: 7
  },
  'training_dedicated': {
    name: 'Training Dedicated',
    icon: '📚',
    description: 'Achieved TRAINING attribute 7 days in a row',
    color: '#8B5CF6',
    requirement: 7
  },
  'discipline_master': {
    name: 'Discipline Master',
    icon: '⚡',
    description: 'Achieved DISCIPLINE attribute 7 days in a row',
    color: '#10B981',
    requirement: 7
  },
  'persistence_warrior': {
    name: 'Persistence Warrior',
    icon: '💪',
    description: 'Achieved PERSISTENCE attribute 7 days in a row',
    color: '#EC4899',
    requirement: 7
  },
  'commitment_legend': {
    name: 'Commitment Legend',
    icon: '🔥',
    description: 'Achieved COMMITMENT attribute 7 days in a row',
    color: '#D4AF37',
    requirement: 7
  },

  // Streak Badges
  'streak_3': {
    name: '3-Day Streak',
    icon: '🔥',
    description: '3-day daily combo streak',
    color: '#F59E0B',
    requirement: 3
  },
  'streak_7': {
    name: 'Week Warrior',
    icon: '⚡',
    description: '7-day daily combo streak',
    color: '#EF4444',
    requirement: 7
  },
  'streak_30': {
    name: 'Monthly Master',
    icon: '👑',
    description: '30-day daily combo streak',
    color: '#D4AF37',
    requirement: 30
  },

  // Achievement Badges
  'first_sale': {
    name: 'First Sale',
    icon: '💰',
    description: 'Logged your first sale',
    color: '#10B981',
    requirement: 1
  },
  'sales_10': {
    name: '10 Sales Club',
    icon: '🏆',
    description: 'Logged 10 sales total',
    color: '#3B82F6',
    requirement: 10
  },
  'month_10k': {
    name: '$10k Month',
    icon: '💎',
    description: 'Reached $10,000 in monthly sales',
    color: '#8B5CF6',
    requirement: 10000
  },
  'combo_master': {
    name: 'Combo Master',
    icon: '🌟',
    description: 'Completed 50 daily combos total',
    color: '#D4AF37',
    requirement: 50
  }
};

export const BadgesDisplay = () => {
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    fetchUserBadges();
  }, []);

  const fetchUserBadges = async () => {
    try {
      const response = await axios.get(`${API}/development/badges`, { withCredentials: true });
      if (response.data.success) {
        setUserBadges(response.data.data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeProgress = (badgeId) => {
    const badge = userBadges.find(b => b.badge_id === badgeId);
    if (badge?.awarded) {
      return 100;
    }

    const definition = BADGE_DEFINITIONS[badgeId];
    if (!definition) {
      return 0;
    }

    // Calculate progress based on user stats
    // This is a simplified calculation - in real implementation, you'd track specific stats
    return 0;
  };

  const earnedBadges = Object.keys(BADGE_DEFINITIONS).filter(badgeId =>
    userBadges.some(b => b.badge_id === badgeId && b.awarded)
  );

  const lockedBadges = Object.keys(BADGE_DEFINITIONS).filter(badgeId =>
    !userBadges.some(b => b.badge_id === badgeId && b.awarded)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            Achievement Badges
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Earn badges by completing challenges and maintaining streaks
          </p>
        </div>
        <Badge className="bg-[#D4AF37] text-black text-lg px-4 py-2">
          <Star className="w-4 h-4 mr-1" />
          {earnedBadges.length}/{Object.keys(BADGE_DEFINITIONS).length} Earned
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Badges Earned</p>
                <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                  {earnedBadges.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Current Streak</p>
                <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
                  {userBadges.find(b => b.badge_id === 'streak_3')?.awarded ? 'Active' : '0 days'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Total Points</p>
                <p className="text-2xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                  {userBadges.reduce((sum, b) => sum + (b.points || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[#10B981] mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Earned Badges
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {earnedBadges.map((badgeId, index) => {
              const definition = BADGE_DEFINITIONS[badgeId];
              const badge = userBadges.find(b => b.badge_id === badgeId);

              return (
                <motion.div
                  key={badgeId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`
                      relative overflow-hidden border-2
                      bg-gradient-to-br from-[${definition.color}]/20 to-transparent
                      border-[${definition.color}] cursor-pointer hover:scale-105 transition-all
                    `}
                    onClick={() => setSelectedBadge(definition)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{definition.icon}</div>
                      <p className="text-xs font-bold text-[#F8FAFC] line-clamp-2">
                        {definition.name}
                      </p>
                      <Badge className={`mt-2 bg-[${definition.color}] text-white text-xs`}>
                        Earned
                      </Badge>
                    </CardContent>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[#94A3B8] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Locked Badges
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {lockedBadges.map((badgeId, index) => {
              const definition = BADGE_DEFINITIONS[badgeId];
              const progress = getBadgeProgress(badgeId);

              return (
                <motion.div
                  key={badgeId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/5 border border-white/10 opacity-60 hover:opacity-100 transition-all">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2 grayscale">{definition.icon}</div>
                      <p className="text-xs font-medium text-[#94A3B8] line-clamp-2">
                        {definition.name}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                        {definition.description}
                      </p>
                      {progress > 0 && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-1 bg-white/10" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <Card
            className={`
              max-w-md w-full border-2
              bg-gradient-to-br from-[${selectedBadge.color}]/20 to-transparent
              border-[${selectedBadge.color}]
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{selectedBadge.icon}</div>
              <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                {selectedBadge.name}
              </CardTitle>
              <CardDescription className="text-sm mt-2">
                {selectedBadge.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setSelectedBadge(null)}
                className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
