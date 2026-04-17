import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, CheckSquare, BookOpen, Shield, RefreshCw,
  Sparkles, Award, TrendingUp, Calendar, Lightbulb
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SMARTGoalsBuilder } from '@/components/financial/SMARTGoalsBuilder';
import { ActionPlanningTool } from '@/components/financial/ActionPlanningTool';
import { TrainingIntegration } from '@/components/financial/TrainingIntegration';
import { CommitmentTracker } from '@/components/financial/CommitmentTracker';

export default function StrategyPlanningPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
      <div className="max-w-7xl mx-auto space-y-8" data-testid="strategy-planning-page">
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
                Strategy & Action Planning
              </h1>
              <p className="text-lg text-[#94A3B8] mt-2">
                Set goals, plan actions, and track your commitments
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
            className="bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#8B5CF6]/20 border border-white/10 rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Plan</p>
                  <p className="text-lg font-bold text-[#D4AF37]">SMART Goals</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#10B981]/30 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Execute</p>
                  <p className="text-lg font-bold text-[#10B981]">Action Plan</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3B82F6]/30 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Learn</p>
                  <p className="text-lg font-bold text-[#3B82F6]">Training</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#8B5CF6]/30 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Commit</p>
                  <p className="text-lg font-bold text-[#8B5CF6]">Promises</p>
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
            <TabsList className="bg-white/5 border border-white/10 p-1 flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Lightbulb className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Target className="w-4 h-4 mr-2" />
                SMART Goals
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <CheckSquare className="w-4 h-4 mr-2" />
                Action Plan
              </TabsTrigger>
              <TabsTrigger value="training" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <BookOpen className="w-4 h-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="commitments" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Shield className="w-4 h-4 mr-2" />
                Commitments
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all cursor-pointer" onClick={() => setActiveTab('goals')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                        <Target className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Set Goals</h3>
                        <p className="text-sm text-[#94A3B8]">Create SMART goals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 hover:border-[#10B981]/50 transition-all cursor-pointer" onClick={() => setActiveTab('actions')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                        <CheckSquare className="w-8 h-8 text-[#10B981]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Plan Actions</h3>
                        <p className="text-sm text-[#94A3B8]">Strategic action items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30 hover:border-[#3B82F6]/50 transition-all cursor-pointer" onClick={() => setActiveTab('training')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Training</h3>
                        <p className="text-sm text-[#94A3B8]">Recommended modules</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50 transition-all cursor-pointer" onClick={() => setActiveTab('commitments')}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">Commit</h3>
                        <p className="text-sm text-[#94A3B8]">Track promises</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Strategy Framework */}
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-4 font-['Playfair_Display'] flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Strategic Planning Framework
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#D4AF37]">1</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">Set SMART Goals</h4>
                          <p className="text-xs text-[#94A3B8]">
                            Define Specific, Measurable, Achievable, Relevant, Time-Bound objectives
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#10B981]">2</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">Plan Actions</h4>
                          <p className="text-xs text-[#94A3B8]">
                            Break down goals into actionable steps with priorities and deadlines
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#3B82F6]">3</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">Learn & Apply</h4>
                          <p className="text-xs text-[#94A3B8]">
                            Complete recommended training modules to build skills
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#8B5CF6]">4</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">Build Consistency</h4>
                          <p className="text-xs text-[#94A3B8]">
                            Track commitments and maintain streaks for lasting success
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                      <h4 className="text-sm font-bold text-[#D4AF37] mb-2">💡 Pro Tip</h4>
                      <p className="text-xs text-[#94A3B8]">
                        Start with 1-2 SMART goals and 3-5 key actions. Add commitments as you build momentum.
                        Training recommendations will adjust based on your progress.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Motivational Quote */}
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                <CardContent className="p-6">
                  <blockquote className="text-center">
                    <p className="text-xl font-['Playfair_Display'] text-[#D4AF37] mb-2">
                      "A goal without a plan is just a wish."
                    </p>
                    <p className="text-sm text-[#94A3B8]">— Antoine de Saint-Exupéry</p>
                  </blockquote>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SMART Goals Tab */}
            <TabsContent value="goals" className="mt-6">
              <SMARTGoalsBuilder key={`goals-${refreshKey}`} onGoalsUpdate={handleRefresh} />
            </TabsContent>

            {/* Action Plan Tab */}
            <TabsContent value="actions" className="mt-6">
              <ActionPlanningTool key={`actions-${refreshKey}`} onActionsUpdate={handleRefresh} />
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="mt-6">
              <TrainingIntegration key={`training-${refreshKey}`} onTrainingUpdate={handleRefresh} />
            </TabsContent>

            {/* Commitments Tab */}
            <TabsContent value="commitments" className="mt-6">
              <CommitmentTracker key={`commitments-${refreshKey}`} onCommitmentsUpdate={handleRefresh} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Strategy Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#8B5CF6] mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Strategy Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">🎯 Start Small</p>
                  <p className="text-xs text-[#94A3B8]">
                    Begin with 1-2 achievable goals to build momentum and confidence
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">📊 Track Daily</p>
                  <p className="text-xs text-[#94A3B8]">
                    Update progress daily to stay accountable and motivated
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F8FAFC]">🔄 Iterate Often</p>
                  <p className="text-xs text-[#94A3B8]">
                    Review and adjust your strategy weekly based on performance
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
