import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Target, Award, BookOpen,
  Calendar, MessageCircle, Users, ChevronRight, Play,
  Clock, CheckCircle, Star, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PullToRefresh from '@/components/mobile/PullToRefresh';
import QuickActionsFAB from '@/components/mobile/QuickActionsFAB';
import {
  MobileMetricCard,
  MobileActionCard,
  MobileProgressCard,
  MobileAIGreetingCard,
  MobileTrainingCard,
  MobileStreakCard
} from '@/components/mobile/MobileOptimizedCards';
import { useAuth } from '@/context/AuthContext';

export const MobileDashboardPage = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAddSale = () => {
    console.log('Add sale');
  };

  const handleSetGoal = () => {
    console.log('Set goal');
  };

  const handleStartTraining = () => {
    console.log('Start training');
  };

  const handleViewProgress = () => {
    console.log('View progress');
  };

  const handleOpenAI = () => {
    console.log('Open AI');
  };

  const quickActions = [
    {
      title: 'Add Sale',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      onPress: handleAddSale
    },
    {
      title: 'Training',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      onPress: handleStartTraining
    },
    {
      title: 'AI Coach',
      icon: MessageCircle,
      color: 'from-[#D4AF37] to-[#B4942D]',
      onPress: handleOpenAI
    },
    {
      title: 'Progress',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      onPress: handleViewProgress
    }
  ];

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-full">
      <div className="min-h-screen bg-[#020204] pb-24">
        {/* Greeting Card */}
        <div className="px-4 pt-4 pb-2">
          <MobileAIGreetingCard
            userName={user?.name || 'User'}
            timeOfDay={greeting}
            message="Ready to crush your goals today?"
            delay={0.1}
          />
        </div>

        {/* Metrics Grid */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-[#F1F5F9] mb-3">Today's Performance</h2>
          <div className="grid grid-cols-2 gap-3">
            <MobileMetricCard
              title="Revenue"
              value="$2,450"
              change={15}
              icon={DollarSign}
              color="text-green-400"
              delay={0.2}
            />
            <MobileMetricCard
              title="Sales"
              value="3"
              change={20}
              icon={TrendingUp}
              color="text-blue-400"
              delay={0.3}
            />
            <MobileMetricCard
              title="Goal"
              value="78%"
              change={-5}
              icon={Target}
              color="text-[#D4AF37]"
              delay={0.4}
            />
            <MobileMetricCard
              title="Points"
              value="125"
              change={10}
              icon={Award}
              color="text-purple-400"
              delay={0.5}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-[#F1F5F9] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (index * 0.05) }}
                  whileTap={{ scale: 0.9 }}
                  onClick={action.onPress}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-[#94A3B8] font-medium">{action.title}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Streak Card */}
        <div className="px-4 py-3">
          <MobileStreakCard
            currentStreak={5}
            bestStreak={12}
            daysActive={18}
            delay={0.7}
          />
        </div>

        {/* Continue Learning */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#F1F5F9]">Continue Learning</h2>
            <button className="text-sm text-[#D4AF37] flex items-center gap-1">
              See all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <MobileTrainingCard
              title="Mastering Objections"
              category="Sales Skills"
              duration={15}
              progress={65}
              delay={0.8}
            />

            <MobileTrainingCard
              title="Closing Techniques"
              category="Advanced"
              duration={20}
              progress={30}
              delay={0.9}
            />
          </div>
        </div>

        {/* Progress Cards */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-[#F1F5F9] mb-3">Your Progress</h2>
          <div className="space-y-3">
            <MobileProgressCard
              title="Discovery & Control"
              progress={4}
              total={6}
              icon={Target}
              delay={1.0}
            />

            <MobileProgressCard
              title="Value Architecture"
              progress={2}
              total={6}
              icon={Award}
              delay={1.1}
            />
          </div>
        </div>

        {/* Action Cards */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-[#F1F5F9] mb-3">Recommended</h2>
          <div className="grid grid-cols-1 gap-3">
            <MobileActionCard
              title="Role Play Session"
              description="Practice objection handling with AI coach"
              icon={Play}
              badge="New"
              color="from-purple-500/20 to-purple-600/10"
              onClick={() => console.log('Role play')}
              delay={1.2}
            />

            <MobileActionCard
              title="Daily Quiz"
              description="Test your knowledge and earn points"
              icon={CheckCircle}
              badge="5 pts"
              color="from-green-500/20 to-green-600/10"
              onClick={() => console.log('Quiz')}
              delay={1.3}
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#F1F5F9]">Upcoming Events</h2>
            <button className="text-sm text-[#D4AF37]">View Calendar</button>
          </div>

          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#F1F5F9] mb-1">Team Training Session</h4>
                <p className="text-sm text-[#94A3B8] mb-2">Advanced closing techniques workshop</p>

                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Tomorrow, 10:00 AM</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>12 attending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions FAB */}
        <QuickActionsFAB
          onAddSale={handleAddSale}
          onSetGoal={handleSetGoal}
          onStartTraining={handleStartTraining}
          onViewProgress={handleViewProgress}
          onOpenAI={handleOpenAI}
        />
      </div>
    </PullToRefresh>
  );
};

export default MobileDashboardPage;
