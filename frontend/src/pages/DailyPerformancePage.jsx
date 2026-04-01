import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, TrendingUp, Award, BarChart3, RefreshCw,
  Flame, Target, Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyMetricsCard } from '@/components/financial/DailyMetricsCard';
import { DailySalesGrid } from '@/components/financial/DailySalesGrid';
import { PersonalAttributesTracker } from '@/components/financial/PersonalAttributesTracker';
import { API } from '@/App';

export default function DailyPerformancePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1);
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8" data-testid="daily-performance-page">
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
                Daily Performance
              </h1>
              <p className="text-lg text-[#94A3B8] mt-2">
                Track your sales, mindset, and daily achievements
              </p>
            </div>
            <Button
              onClick={() => {
                handleDataUpdate();
                window.location.reload();
              }}
              className="bg-white/10 text-[#F8FAFC] hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Quick Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#8B5CF6]/20 border border-white/10 rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Focus</p>
                  <p className="text-lg font-bold text-[#D4AF37]">Track Sales Daily</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#10B981]/30 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Mindset</p>
                  <p className="text-lg font-bold text-[#10B981]">7 Daily Attributes</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B5CF6]/30 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Reward</p>
                  <p className="text-lg font-bold text-[#8B5CF6]">Daily Combo +100</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Calendar className="w-4 h-4 mr-2" />
                Sales Grid
              </TabsTrigger>
              <TabsTrigger value="attributes" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Award className="w-4 h-4 mr-2" />
                Attributes
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Daily Metrics */}
              <DailyMetricsCard key={`metrics-${refreshKey}`} />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30 hover:border-[#3B82F6]/50 transition-all cursor-pointer" onClick={() => setActiveTab('sales')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Log Daily Sales</h3>
                        <p className="text-sm text-[#94A3B8]">Track your sales performance in the 25-day grid</p>
                      </div>
                      <Badge className="bg-[#3B82F6] text-white">+10 pts</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all cursor-pointer" onClick={() => setActiveTab('attributes')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Track Attributes</h3>
                        <p className="text-sm text-[#94A3B8]">Complete daily mindset attributes for bonus points</p>
                      </div>
                      <Badge className="bg-[#D4AF37] text-black">+100 combo</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Motivational Quote */}
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <CardContent className="p-6">
                  <blockquote className="text-center">
                    <p className="text-xl font-['Playfair_Display'] text-[#D4AF37] mb-2">
                      "Success is the sum of small efforts repeated day in and day out."
                    </p>
                    <p className="text-sm text-[#94A3B8]">— Robert Collier</p>
                  </blockquote>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sales Grid Tab */}
            <TabsContent value="sales" className="mt-6">
              <DailySalesGrid key={`sales-${refreshKey}`} onRecordUpdate={handleDataUpdate} />
            </TabsContent>

            {/* Attributes Tab */}
            <TabsContent value="attributes" className="mt-6">
              <PersonalAttributesTracker key={`attributes-${refreshKey}`} onUpdate={handleDataUpdate} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Gamification Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#8B5CF6] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Gamification Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">🎯 Daily Sales</p>
                  <p className="text-xs text-[#94A3B8]">Log each sale in the 25-day grid to track your momentum</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">💪 Personal Attributes</p>
                  <p className="text-xs text-[#94A3B8]">Complete all 7 attributes daily to unlock the +100 bonus combo</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">🔥 Build Streaks</p>
                  <p className="text-xs text-[#94A3B8]">Consistent daily tracking multiplies your points and progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
