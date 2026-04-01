import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, Award, Trophy, Calendar,
  Flame, Users, Plus, Save, BarChart3
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { DailyMetricsForm } from '@/components/goalsheet/DailyMetricsForm';
import { WeeklyStats } from '@/components/goalsheet/WeeklyStats';
import { StreakDisplay } from '@/components/goalsheet/StreakDisplay';
import { TeamLeaderboard } from '@/components/goalsheet/TeamLeaderboard';
import { GoalSheetHistory } from '@/components/goalsheet/GoalSheetHistory';

export default function GoalSheetPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchGoalSheetData();
  }, []);

  const fetchGoalSheetData = async () => {
    try {
      // Fetch today's goal sheet
      const todayResponse = await axios.get(`${API}/goalsheet/today`, { withCredentials: true });
      setTodayData(todayResponse.data.data);

      // Fetch weekly summary
      const weeklyResponse = await axios.get(`${API}/goalsheet/summary/week`, { withCredentials: true });
      setWeeklySummary(weeklyResponse.data.data);
    } catch (error) {
      console.error('Goal sheet error:', error);
      // Don't block the page if goal sheet fails - might not be set up yet
      setTodayData(null);
      setWeeklySummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricsSubmit = async (expandedData) => {
    try {
      const response = await axios.post(
        `${API}/goalsheet/daily`,
        expandedData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refresh data
        await fetchGoalSheetData();

        // Show success message
        if (response.data.data.is_new) {
          // Show toast for points earned
        }
      }
    } catch (error) {
      console.error('Submit goal sheet error:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const hasTodayData = todayData !== null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8" data-testid="goalsheet-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold tracking-tighter text-[#F8FAFC] font-['Playfair_Display']">
                Goal Sheets
              </h1>
              <p className="text-lg text-[#94A3B8] mt-2">
                Track your daily metrics and crush your weekly targets
              </p>
            </div>
            {hasTodayData && (
              <Badge className="bg-[#D4AF37] text-black font-bold px-4 py-2">
                <Flame className="w-4 h-4 mr-1" />
                {weeklySummary?.streak?.streak_days || 0} Day Streak
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#94A3B8]">Today's Tours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                {todayData?.metrics?.tours_given || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#94A3B8]">Weekly Closes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                {weeklySummary?.weekly_stats?.closes || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#94A3B8]">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                {todayData?.progress_percentage ? `${todayData.progress_percentage}%` : 'N/A'}
              </div>
              {todayData?.progress_percentage && (
                <Progress value={todayData.progress_percentage} className="mt-2 h-2" />
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#94A3B8]">Weekly Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-[#F59E0B]" />
                <div className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  {weeklySummary?.streak?.streak_days || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="today" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Target className="w-4 h-4 mr-2" />
                Today's Metrics
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4 mr-2" />
                Weekly Stats
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Trophy className="w-4 h-4 mr-2" />
                Team Leaderboard
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Calendar className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <DailyMetricsForm
                initialData={todayData}
                onSubmit={handleMetricsSubmit}
              />
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <WeeklyStats data={weeklySummary?.weekly_stats} />
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <TeamLeaderboard />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <GoalSheetHistory />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
