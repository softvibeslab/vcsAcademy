import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Target, Zap, Award, Calendar,
  DollarSign, Percent, Users, Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { API } from '@/App';
import axios from 'axios';

export const DailyMetricsCard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyMetrics();
  }, []);

  const fetchDailyMetrics = async () => {
    try {
      // Fetch both financial summary and today's attributes
      const [summaryResponse, attributesResponse] = await Promise.all([
        axios.get(`${API}/financial/goals/summary`, { withCredentials: true }),
        axios.get(`${API}/financial/attributes/today`, { withCredentials: true })
      ]);

      if (summaryResponse.data.success && attributesResponse.data.success) {
        setMetrics({
          financial: summaryResponse.data.data,
          attributes: attributesResponse.data.data
        });
      }
    } catch (error) {
      console.error('Error fetching daily metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return null;
  }

  const { financial, attributes } = metrics;

  // Handle case when financial goal is not set yet
  if (!financial) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Financial Goal Set Yet</h3>
          <p className="text-[#94A3B8] mb-4">
            Start by setting your monthly income goal in Financial Planning
          </p>
          <Button
            onClick={() => window.location.href = '/financial'}
            className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
          >
            Set Financial Goal
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate daily targets from monthly
  const dailyTargetIncome = financial.target_income / 30; // Rough estimate
  const currentRevenue = financial.current_revenue || 0;
  const daysRemaining = financial.days_remaining || 0;

  // Calculate performance metrics
  const daysInMonth = 30;
  const daysPassed = daysInMonth - daysRemaining;
  const expectedRevenueByNow = (financial.target_income / daysInMonth) * daysPassed;
  const revenueVariance = currentRevenue - expectedRevenueByNow;
  const isAheadOfSchedule = revenueVariance >= 0;

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Daily Progress */}
        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-xs text-[#94A3B8]">Month Progress</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                {financial.progress_percentage.toFixed(1)}%
              </p>
              <Progress
                value={financial.progress_percentage}
                className="h-2 bg-white/10"
              />
              <p className="text-xs text-[#94A3B8]">
                ${currentRevenue.toLocaleString()} of ${financial.target_income.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Combo */}
        <Card className={`bg-gradient-to-br ${
          attributes.daily_combo_achieved
            ? 'from-[#10B981]/10 to-transparent border-[#10B981]/30'
            : 'from-white/5 to-transparent border-white/10'
        } border`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className={`w-4 h-4 ${attributes.daily_combo_achieved ? 'text-[#10B981]' : 'text-[#94A3B8]'}`} />
              <p className="text-xs text-[#94A3B8]">Daily Combo</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold font-['JetBrains_Mono']">
                {attributes.achieved_count}/{attributes.total_possible}
              </p>
              <Badge className={
                attributes.daily_combo_achieved
                  ? 'bg-[#10B981] text-white'
                  : 'bg-white/10 text-[#94A3B8]'
              }>
                {attributes.daily_combo_achieved ? 'COMPLETED!' : `${attributes.total_possible - attributes.achieved_count} more`}
              </Badge>
              {attributes.daily_combo_achieved && (
                <p className="text-xs text-[#10B981] font-bold">+100 BONUS PTS</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales Pace */}
        <Card className={`bg-gradient-to-br ${
          isAheadOfSchedule
            ? 'from-[#10B981]/10 to-transparent border-[#10B981]/30'
            : 'from-[#EF4444]/10 to-transparent border-[#EF4444]/30'
        } border`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-4 h-4 ${isAheadOfSchedule ? 'text-[#10B981]' : 'text-[#EF4444]'}`} />
              <p className="text-xs text-[#94A3B8]">Sales Pace</p>
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-bold font-['JetBrains_Mono'] ${
                isAheadOfSchedule ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                {isAheadOfSchedule ? 'Ahead' : 'Behind'}
              </p>
              <p className="text-xs text-[#94A3B8]">
                {isAheadOfSchedule ? '+' : ''}{revenueVariance.toLocaleString()} vs target
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Days Remaining */}
        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#8B5CF6]" />
              <p className="text-xs text-[#94A3B8]">Days Left</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                {daysRemaining}
              </p>
              <p className="text-xs text-[#94A3B8]">
                ~${Math.ceil(financial.income_gap / Math.max(1, daysRemaining)).toLocaleString()}/day needed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Targets Overview */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#D4AF37]" />
            Monthly Targets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Needed */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <p className="text-sm text-[#94A3B8] mb-1">Sales Needed</p>
              <p className="text-3xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
                {financial.sales_needed}
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">
                Avg: ${financial.avg_sale?.toLocaleString()} / sale
              </p>
            </div>

            {/* Tours Needed */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <p className="text-sm text-[#94A3B8] mb-1">Tours Needed</p>
              <p className="text-3xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                {financial.tours_needed}
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">
                Closing: {financial.closing_rate}%
              </p>
            </div>

            {/* Income Gap */}
            <div className={`text-center p-4 rounded-lg border ${
              financial.income_gap > 0
                ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                : 'bg-[#10B981]/10 border-[#10B981]/30'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                financial.income_gap > 0 ? 'bg-[#EF4444]/20' : 'bg-[#10B981]/20'
              }`}>
                <DollarSign className={`w-6 h-6 ${financial.income_gap > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
              </div>
              <p className="text-sm text-[#94A3B8] mb-1">Income Gap</p>
              <p className={`text-3xl font-bold font-['JetBrains_Mono'] ${
                financial.income_gap > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'
              }`}>
                ${financial.income_gap.toLocaleString()}
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">
                {financial.income_gap > 0 ? 'Still needed' : 'Covered! 🎉'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Card */}
      {!attributes.daily_combo_achieved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-2 border-[#D4AF37]/50 rounded-lg p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#D4AF37]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#D4AF37] mb-1">Daily Combo Available!</h3>
              <p className="text-sm text-[#94A3B8] mb-3">
                Complete all {attributes.total_possible} personal attributes today to unlock +100 bonus points!
              </p>
              <Badge className="bg-[#D4AF37] text-black">
                {attributes.total_possible - attributes.achieved_count} remaining
              </Badge>
            </div>
          </div>
        </motion.div>
      )}

      {attributes.daily_combo_achieved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#10B981]/20 to-transparent border-2 border-[#10B981]/50 rounded-lg p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#10B981]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#10B981] mb-1">Daily Combo Achieved! 🎉</h3>
              <p className="text-sm text-[#94A3B8]">
                Congratulations! You've unlocked +100 bonus points for completing all personal attributes today.
              </p>
            </div>
            <Badge className="bg-[#10B981] text-white text-lg px-4 py-2">
              +100 PTS
            </Badge>
          </div>
        </motion.div>
      )}
    </div>
  );
};
