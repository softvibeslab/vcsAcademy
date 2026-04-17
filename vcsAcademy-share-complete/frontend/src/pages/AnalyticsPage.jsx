import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, FileText, Activity, RefreshCw,
  Sparkles, Calendar, Target
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EfficiencyDashboard } from '@/components/financial/EfficiencyDashboard';
import { PredictiveInsights } from '@/components/financial/PredictiveInsights';
import { MonthlyReport } from '@/components/financial/MonthlyReport';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('efficiency');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
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
      <div className="max-w-7xl mx-auto space-y-8" data-testid="analytics-page">
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
                Analytics & Insights
              </h1>
              <p className="text-lg text-[#94A3B8] mt-2">
                Performance analysis, predictions, and actionable recommendations
              </p>
            </div>
            <Button
              onClick={handleRefresh}
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
            className="bg-gradient-to-r from-[#10B981]/20 via-white/5 to-[#8B5CF6]/20 border border-white/10 rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#10B981]/30 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Track</p>
                  <p className="text-lg font-bold text-[#10B981]">Efficiency Metrics</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B5CF6]/30 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Predict</p>
                  <p className="text-lg font-bold text-[#8B5CF6]">Future Performance</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Improve</p>
                  <p className="text-lg font-bold text-[#D4AF37]">With AI Insights</p>
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
              <TabsTrigger value="efficiency" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Activity className="w-4 h-4 mr-2" />
                Efficiency
              </TabsTrigger>
              <TabsTrigger value="predictions" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <TrendingUp className="w-4 h-4 mr-2" />
                Predictions
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <FileText className="w-4 h-4 mr-2" />
                Monthly Report
              </TabsTrigger>
            </TabsList>

            {/* Efficiency Dashboard Tab */}
            <TabsContent value="efficiency" className="mt-6">
              <EfficiencyDashboard key={`efficiency-${refreshKey}`} />
            </TabsContent>

            {/* Predictive Insights Tab */}
            <TabsContent value="predictions" className="mt-6">
              <PredictiveInsights key={`predictions-${refreshKey}`} />
            </TabsContent>

            {/* Monthly Report Tab */}
            <TabsContent value="reports" className="mt-6">
              <MonthlyReport key={`reports-${refreshKey}`} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 hover:border-[#10B981]/50 transition-all cursor-pointer" onClick={() => setActiveTab('efficiency')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">View Efficiency</h3>
                    <p className="text-sm text-[#94A3B8]">Track your key performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50 transition-all cursor-pointer" onClick={() => setActiveTab('predictions')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">See Predictions</h3>
                    <p className="text-sm text-[#94A3B8]">AI-powered future insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all cursor-pointer" onClick={() => setActiveTab('reports')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Monthly Report</h3>
                    <p className="text-sm text-[#94A3B8]">Complete performance summary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Analytics Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#8B5CF6] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Analytics Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">📊 Track Metrics</p>
                  <p className="text-xs text-[#94A3B8]">
                    Monitor your efficiency score to identify improvement areas
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">🔮 Use Predictions</p>
                  <p className="text-xs text-[#94A3B8]">
                    Let AI insights guide your daily strategy and goal setting
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">📈 Review Reports</p>
                  <p className="text-xs text-[#94A3B8]">
                    Monthly reports help you celebrate wins and plan improvements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
