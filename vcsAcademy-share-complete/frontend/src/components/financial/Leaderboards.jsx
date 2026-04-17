import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, Award, Crown, Target,
  Zap, Medal, Star, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { API } from '@/App';
import axios from 'axios';

// Mock data for leaderboards (replace with real API calls)
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Maria Rodriguez', points: 1250, avatar: 'MR', change: 'up' },
  { rank: 2, name: 'John Smith', points: 1180, avatar: 'JS', change: 'up' },
  { rank: 3, name: 'Sarah Johnson', points: 1150, avatar: 'SJ', change: 'same' },
  { rank: 4, name: 'Mike Williams', points: 1080, avatar: 'MW', change: 'down' },
  { rank: 5, name: 'Emily Davis', points: 1020, avatar: 'ED', change: 'up' },
  { rank: 6, name: 'David Brown', points: 980, avatar: 'DB', change: 'down' },
  { rank: 7, name: 'Lisa Anderson', points: 950, avatar: 'LA', change: 'up' },
  { rank: 8, name: 'James Wilson', points: 920, avatar: 'JW', change: 'same' },
  { rank: 9, name: 'Jennifer Taylor', points: 890, avatar: 'JT', change: 'down' },
  { rank: 10, name: 'Robert Martinez', points: 850, avatar: 'RM', change: 'up' },
];

const ATTRIBUTE_LEADERBOARDS = {
  attitude: {
    name: 'Attitude Masters',
    icon: '😊',
    color: '#F59E0B',
    data: [
      { rank: 1, name: 'Maria Rodriguez', streak: 15, avatar: 'MR' },
      { rank: 2, name: 'Sarah Johnson', streak: 12, avatar: 'SJ' },
      { rank: 3, name: 'Emily Davis', streak: 10, avatar: 'ED' },
    ]
  },
  courage: {
    name: 'Courage Champions',
    icon: '🦁',
    color: '#EF4444',
    data: [
      { rank: 1, name: 'John Smith', streak: 14, avatar: 'JS' },
      { rank: 2, name: 'Mike Williams', streak: 11, avatar: 'MW' },
      { rank: 3, name: 'David Brown', streak: 9, avatar: 'DB' },
    ]
  },
  discipline: {
    name: 'Discipline Masters',
    icon: '⚡',
    color: '#10B981',
    data: [
      { rank: 1, name: 'Lisa Anderson', streak: 20, avatar: 'LA' },
      { rank: 2, name: 'Maria Rodriguez', streak: 18, avatar: 'MR' },
      { rank: 3, name: 'Sarah Johnson', streak: 15, avatar: 'SJ' },
    ]
  }
};

export const Leaderboards = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setUserRank({
        daily: { rank: 7, points: 890 },
        weekly: { rank: 5, points: 3200 },
        monthly: { rank: 8, points: 12500 }
      });
    }, 1000);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-[#D4AF37]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[#C0C0C0]" />;
      case 3:
        return <Medal className="w-6 h-6 text-[#CD7F32]" />;
      default:
        return <span className="text-lg font-bold text-[#94A3B8] font-['JetBrains_Mono']">#{rank}</span>;
    }
  };

  const getChangeIcon = (change) => {
    switch (change) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-[#10B981]" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-[#EF4444]" />;
      default:
        return null;
    }
  };

  const LeaderboardRow = ({ entry, index, showChange = true, metric = 'points' }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        flex items-center gap-4 p-4 rounded-lg border transition-all
        ${entry.rank === 1
          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-[#D4AF37]/50'
          : 'bg-white/5 border-white/10 hover:border-white/20'}
      `}
    >
      {/* Rank */}
      <div className="w-12 flex justify-center">
        {getRankIcon(entry.rank)}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 bg-[#1E3A8A] rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-[#F8FAFC]">{entry.avatar}</span>
      </div>

      {/* Name */}
      <div className="flex-1">
        <p className="text-sm font-medium text-[#F8FAFC]">{entry.name}</p>
      </div>

      {/* Metric */}
      <div className="text-right">
        <p className="text-lg font-bold text-[#D4AF37] font-['JetBrains_Mono']">
          {metric === 'points' ? `${entry.points} pts` : `${entry.streak} days`}
        </p>
      </div>

      {/* Change */}
      {showChange && entry.change && entry.change !== 'same' && (
        <div className="w-8">
          {getChangeIcon(entry.change)}
        </div>
      )}
    </motion.div>
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
            Leaderboards
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Compete with top performers and climb the ranks
          </p>
        </div>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border-2 border-[#D4AF37]/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#D4AF37] font-['Playfair_Display'] flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-[#94A3B8] mb-1">Today</p>
                <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  #{userRank.daily.rank}
                </p>
                <p className="text-xs text-[#94A3B8]">{userRank.daily.points} pts</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#94A3B8] mb-1">This Week</p>
                <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  #{userRank.weekly.rank}
                </p>
                <p className="text-xs text-[#94A3B8]">{userRank.weekly.points} pts</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#94A3B8] mb-1">This Month</p>
                <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  #{userRank.monthly.rank}
                </p>
                <p className="text-xs text-[#94A3B8]">{userRank.monthly.points} pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="daily" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Zap className="w-4 h-4 mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Award className="w-4 h-4 mr-2" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="attributes" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Target className="w-4 h-4 mr-2" />
            Attributes
          </TabsTrigger>
        </TabsList>

        {/* Daily Leaderboard */}
        <TabsContent value="daily" className="mt-6">
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                Daily Top Performers
              </CardTitle>
              <CardDescription className="text-[#94A3B8]">
                Top 10 performers today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_LEADERBOARD.map((entry, index) => (
                <LeaderboardRow key={entry.rank} entry={entry} index={index} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Leaderboard */}
        <TabsContent value="weekly" className="mt-6">
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                Weekly Top Performers
              </CardTitle>
              <CardDescription className="text-[#94A3B8]">
                Top 10 performers this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_LEADERBOARD.map((entry, index) => (
                <LeaderboardRow
                  key={entry.rank}
                  entry={{ ...entry, points: entry.points * 7 }}
                  index={index}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Leaderboard */}
        <TabsContent value="monthly" className="mt-6">
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                Monthly Top Performers
              </CardTitle>
              <CardDescription className="text-[#94A3B8]">
                Top 10 performers this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_LEADERBOARD.map((entry, index) => (
                <LeaderboardRow
                  key={entry.rank}
                  entry={{ ...entry, points: entry.points * 30 }}
                  index={index}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Leaderboard */}
        <TabsContent value="attributes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(ATTRIBUTE_LEADERBOARDS).map(([key, leaderboard]) => (
              <Card
                key={key}
                className={`bg-gradient-to-br from-[${leaderboard.color}]/10 to-transparent border border-[${leaderboard.color}]/30`}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
                    <span className="text-2xl">{leaderboard.icon}</span>
                    {leaderboard.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboard.data.map((entry, index) => (
                    <LeaderboardRow
                      key={entry.rank}
                      entry={entry}
                      index={index}
                      showChange={false}
                      metric="streak"
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Motivational Card */}
      <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#8B5CF6]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#8B5CF6] mb-2">Climb the Ranks!</h3>
              <p className="text-sm text-[#94A3B8]">
                Complete daily challenges, maintain streaks, and log your sales to climb the leaderboards.
                Top performers earn exclusive badges and recognition!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
