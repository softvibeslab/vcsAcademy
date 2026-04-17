import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Calendar, Target, DollarSign,
  AlertTriangle, CheckCircle2, Lightbulb, Activity, BarChart3,
  ArrowRight, Sparkles, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { API } from '@/App';
import axios from 'axios';

export const PredictiveInsights = () => {
  const [predictions, setPredictions] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      // Fetch financial data for predictions
      const [summaryResponse, salesResponse] = await Promise.all([
        axios.get(`${API}/financial/goals/summary`, { withCredentials: true }),
        axios.get(`${API}/financial/sales/monthly`, { withCredentials: true })
      ]);

      if (summaryResponse.data.success && salesResponse.data.success) {
        const summary = summaryResponse.data.data;
        const sales = salesResponse.data.data.records || [];

        // Calculate predictions
        const predictions = calculatePredictions(summary, sales);
        const recommendations = generateRecommendations(summary, sales, predictions);

        setPredictions(predictions);
        setRecommendations(recommendations);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePredictions = (summary, sales) => {
    const daysPassed = sales.length;
    const daysRemaining = summary.days_remaining || 0;
    const totalDays = daysPassed + daysRemaining;

    // Current daily average
    const currentRevenue = summary.current_revenue || 0;
    const dailyAvg = daysPassed > 0 ? currentRevenue / daysPassed : 0;

    // Predicted end of month revenue (based on current trend)
    const predictedRevenue = dailyAvg * totalDays;

    // Predicted gap
    const predictedGap = Math.max(0, summary.target_income - predictedRevenue);

    // Probability of reaching goal (simple calculation)
    const revenueProgress = (currentRevenue / summary.target_income) * 100;
    const daysProgress = (daysPassed / totalDays) * 100;
    const goalProbability = Math.min(100, Math.max(0, (revenueProgress / daysProgress) * 100));

    // Performance trend (last 7 days vs previous 7 days)
    const last7Sales = sales.slice(-7);
    const prev7Sales = sales.slice(-14, -7);
    const last7Volume = last7Sales.reduce((sum, s) => sum + (s.volume || 0), 0);
    const prev7Volume = prev7Sales.reduce((sum, s) => sum + (s.volume || 0), 0);
    const trend = last7Volume > prev7Volume ? 'up' : last7Volume < prev7Volume ? 'down' : 'stable';
    const trendPercent = prev7Volume > 0 ? ((last7Volume - prev7Volume) / prev7Volume) * 100 : 0;

    // Daily pace needed to hit goal
    const dailyPaceNeeded = daysRemaining > 0 ? (summary.income_gap / daysRemaining) : 0;

    return {
      predictedRevenue,
      predictedGap,
      goalProbability,
      trend,
      trendPercent,
      dailyAvg,
      dailyPaceNeeded,
      daysRemaining,
      currentRevenue,
      targetIncome: summary.target_income
    };
  };

  const generateRecommendations = (summary, sales, predictions) => {
    const recommendations = [];

    // Revenue-based recommendations
    if (predictions.goalProbability < 50) {
      recommendations.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'Accelerate Your Pace',
        description: `You need $${predictions.dailyPaceNeeded.toFixed(0)}/day to reach your goal. Consider increasing tours.`,
        action: 'Focus on Prospecting'
      });
    }

    // Activity-based recommendations
    const recentSales = sales.slice(-7);
    const daysWithSalesLast7 = recentSales.filter(s => s.volume > 0).length;

    if (daysWithSalesLast7 < 5) {
      recommendations.push({
        type: 'warning',
        icon: Activity,
        title: 'Increase Daily Activity',
        description: `Only ${daysWithSalesLast7} sales days in the last week. Aim for 5+ days.`,
        action: 'Log More Sales'
      });
    }

    // Trend-based recommendations
    if (predictions.trend === 'down' && predictions.trendPercent < -10) {
      recommendations.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Reverse the Decline',
        description: `Sales are down ${Math.abs(predictions.trendPercent).toFixed(1)}% vs previous week.`,
        action: 'Review Training Modules'
      });
    }

    // Positive reinforcement
    if (predictions.trend === 'up' && predictions.trendPercent > 10) {
      recommendations.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Great Momentum!',
        description: `Sales are up ${predictions.trendPercent.toFixed(1)}% vs previous week. Keep it up!`,
        action: 'Maintain Pace'
      });
    }

    // Goal proximity recommendations
    if (predictions.goalProbability >= 80) {
      recommendations.push({
        type: 'success',
        icon: CheckCircle2,
        title: 'Almost There!',
        description: `You're ${predictions.goalProbability.toFixed(0)}% likely to hit your goal. Finish strong!`,
        action: 'Push to Finish'
      });
    }

    // Strategy recommendations
    if (predictions.dailyAvg < 500) {
      recommendations.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Boost Average Sale',
        description: 'Your daily average is below $500. Focus on value architecture to increase deal size.',
        action: 'View Value Training'
      });
    }

    return recommendations.slice(0, 4); // Limit to 4 recommendations
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!predictions) {
    return (
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-12 text-center">
          <Activity className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Predictions Available</h3>
          <p className="text-[#94A3B8]">Start logging sales to see predictions and insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            Predictive Insights
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            AI-powered predictions and actionable recommendations
          </p>
        </div>
      </div>

      {/* Goal Probability Card */}
      <Card className={`bg-gradient-to-br ${
        predictions.goalProbability >= 80
          ? 'from-[#10B981]/20 to-transparent border-[#10B981]/50'
          : predictions.goalProbability >= 50
          ? 'from-[#F59E0B]/20 to-transparent border-[#F59E0B]/50'
          : 'from-[#EF4444]/20 to-transparent border-[#EF4444]/50'
      } border-2`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-[#F8FAFC] mb-2">Goal Probability</h4>
              <p className="text-sm text-[#94A3B8] mb-4">
                Based on your current performance trend
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Predicted Revenue</span>
                  <span className="text-lg font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                    ${predictions.predictedRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Target Income</span>
                  <span className="text-lg font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                    ${predictions.targetIncome.toLocaleString()}
                  </span>
                </div>
                {predictions.predictedGap > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#94A3B8]">Predicted Gap</span>
                    <span className="text-lg font-bold text-[#EF4444] font-['JetBrains_Mono']">
                      -${predictions.predictedGap.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center ml-6">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${
                predictions.goalProbability >= 80
                  ? 'border-[#10B981] bg-[#10B981]/20'
                  : predictions.goalProbability >= 50
                  ? 'border-[#F59E0B] bg-[#F59E0B]/20'
                  : 'border-[#EF4444] bg-[#EF4444]/20'
              }`}>
                <div>
                  <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                    {predictions.goalProbability.toFixed(0)}%
                  </p>
                  <p className="text-xs text-[#94A3B8]">probability</p>
                </div>
              </div>
            </div>
          </div>

          <Progress
            value={predictions.goalProbability}
            className="h-3 mt-4 bg-white/10"
          />
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
            Performance Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${predictions.trend === 'up'
                  ? 'bg-[#10B981]/20'
                  : predictions.trend === 'down'
                  ? 'bg-[#EF4444]/20'
                  : 'bg-[#F59E0B]/20'}
              `}>
                {predictions.trend === 'up' ? (
                  <TrendingUp className="w-8 h-8 text-[#10B981]" />
                ) : predictions.trend === 'down' ? (
                  <TrendingDown className="w-8 h-8 text-[#EF4444]" />
                ) : (
                  <Activity className="w-8 h-8 text-[#F59E0B]" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  {predictions.trend === 'up' ? '+' : predictions.trend === 'down' ? '' : ''}
                  {predictions.trendPercent.toFixed(1)}%
                </p>
                <p className="text-sm text-[#94A3B8]">
                  {predictions.trend === 'up' ? 'Improving' : predictions.trend === 'down' ? 'Declining' : 'Stable'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-[#94A3B8]">Daily Average</p>
              <p className="text-xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                ${predictions.dailyAvg.toFixed(0)}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                ${predictions.dailyPaceNeeded.toFixed(0)}/day needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h4 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
          AI Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`
                border-2 h-full
                ${rec.type === 'critical'
                  ? 'border-[#EF4444]/50 bg-gradient-to-br from-[#EF4444]/10 to-transparent'
                  : rec.type === 'warning'
                  ? 'border-[#F59E0B]/50 bg-gradient-to-br from-[#F59E0B]/10 to-transparent'
                  : rec.type === 'success'
                  ? 'border-[#10B981]/50 bg-gradient-to-br from-[#10B981]/10 to-transparent'
                  : 'border-[#3B82F6]/50 bg-gradient-to-br from-[#3B82F6]/10 to-transparent'}
              `}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${rec.type === 'critical'
                        ? 'bg-[#EF4444]/20'
                        : rec.type === 'warning'
                        ? 'bg-[#F59E0B]/20'
                        : rec.type === 'success'
                        ? 'bg-[#10B981]/20'
                        : 'bg-[#3B82F6]/20'}
                    `}>
                      <rec.icon className={`w-5 h-5 ${
                        rec.type === 'critical'
                          ? 'text-[#EF4444]'
                          : rec.type === 'warning'
                          ? 'text-[#F59E0B]'
                          : rec.type === 'success'
                          ? 'text-[#10B981]'
                          : 'text-[#3B82F6]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-[#F8FAFC] mb-1">
                        {rec.title}
                      </h5>
                      <p className="text-xs text-[#94A3B8] mb-3">
                        {rec.description}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-white/10 text-[#F8FAFC] hover:bg-white/20"
                      >
                        {rec.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Time Remaining Countdown */}
      <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Days Remaining</p>
                <p className="text-3xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                  {predictions.daysRemaining}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-[#94A3B8] mb-1">To Hit Your Goal</p>
              <p className="text-xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                ${predictions.dailyPaceNeeded.toFixed(0)}/day
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Current: ${predictions.dailyAvg.toFixed(0)}/day
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
