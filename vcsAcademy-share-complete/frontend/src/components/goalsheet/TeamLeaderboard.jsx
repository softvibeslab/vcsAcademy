import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { API } from '@/App';
import axios from 'axios';

export const TeamLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/goalsheet/leaderboard/team`, { withCredentials: true });
      if (response.data.success) {
        setLeaderboard(response.data.data);
      }
    } catch (error) {
      console.error('Leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-[#D4AF37]" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold text-[#94A3B8] font-['JetBrains_Mono']">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-[#D4AF37]/20 to-yellow-500/20 border-[#D4AF37]/30';
      case 1:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 2:
        return 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-700/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <p className="text-[#94A3B8]">No team data available</p>
            <p className="text-sm text-[#94A3B8] mt-2">You may not be assigned to a team yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#D4AF37]" />
                Team Leaderboard
              </CardTitle>
              <CardDescription className="text-[#94A3B8] mt-2">
                Top performers this week
              </CardDescription>
            </div>
            <Badge className="bg-[#D4AF37] text-black font-bold px-4 py-2">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((member, index) => (
          <motion.div
            key={member.user_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative ${
              index === 0
                ? 'md:-mt-4'
                : index === 1
                  ? 'md:mt-0'
                  : 'md:mt-2'
            }`}
          >
            <Card className={`${getRankBadge(index)} bg-gradient-to-br border transition-all hover:border-white/20`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <Avatar className="w-16 h-16 border-2 border-white/20">
                      <AvatarFallback className={`text-lg font-bold ${
                        index === 0
                          ? 'bg-[#D4AF37] text-black'
                          : index === 1
                            ? 'bg-gray-400 text-black'
                            : 'bg-amber-700 text-white'
                      }`}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(index)}
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold text-[#F8FAFC] font-['Playfair_Display'] ${
                    index === 0 ? 'text-[#D4AF37]' : ''
                  }`}>
                    {member.name}
                  </h3>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#94A3B8]">Tours</span>
                      <span className="font-['JetBrains_Mono'] text-[#F8FAFC] font-bold">
                        {member.tours_this_week}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#94A3B8]">Closes</span>
                      <span className={`font-['JetBrains_Mono'] font-bold ${
                        member.closes_this_week > 0 ? 'text-[#10B981]' : 'text-[#F8FAFC]'
                      }`}>
                        {member.closes_this_week}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                      <span className="text-[#94A3B8]">Active Days</span>
                      <span className="font-['JetBrains_Mono'] text-[#94A3B8]">
                        {member.days_active}
                      </span>
                    </div>
                  </div>

                  {index === 0 && (
                    <Badge className="mt-4 bg-[#D4AF37] text-black font-bold">
                      Top Performer
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      {leaderboard.length > 3 && (
        <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#F8FAFC] font-['Playfair_Display']">
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((member, index) => (
                <motion.div
                  key={member.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 rounded-sm border transition-all ${
                    index < 3
                      ? getRankBadge(index)
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(index)}
                  </div>

                  <Avatar className="w-10 h-10 border border-white/20">
                    <AvatarFallback className={`text-sm font-bold ${
                      index < 3
                        ? index === 0
                          ? 'bg-[#D4AF37] text-black'
                          : index === 1
                            ? 'bg-gray-400 text-black'
                            : 'bg-amber-700 text-white'
                        : 'bg-white/10 text-[#F8FAFC]'
                    }`}>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-[#F8FAFC] truncate ${
                      index === 0 ? 'text-[#D4AF37]' : ''
                    }`}>
                      {member.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-[#94A3B8]">Tours</p>
                      <p className="text-sm font-['JetBrains_Mono'] text-[#F8FAFC] font-bold">
                        {member.tours_this_week}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#94A3B8]">Closes</p>
                      <p className={`text-sm font-['JetBrains_Mono'] font-bold ${
                        member.closes_this_week > 0 ? 'text-[#10B981]' : 'text-[#F8FAFC]'
                      }`}>
                        {member.closes_this_week}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
