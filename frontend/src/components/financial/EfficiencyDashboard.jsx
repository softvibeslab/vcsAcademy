import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, DollarSign, Percent,
  Activity, BarChart3, PieChart, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Zap, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { API } from '@/App';
import axios from 'axios';

export const EfficiencyDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchEfficiencyMetrics();
  }, [timeRange]);

  const fetchEfficiencyMetrics = async () => {
    setLoading(true);
    try {
      // For now, calculate from existing data
      // In production, this would be a dedicated API endpoint
      const response = await axios.get(`${API}/financial/sales/monthly`, { withCredentials: true });

      if (response.data.success) {
        const records = response.data.data.records || [];

        // Calculate efficiency metrics
        const totalVolume = records.reduce((sum, r) => sum + (r.volume || 0), 0);
        const totalCommission = records.reduce((sum, r) => sum + (r.milesingreso || 0), 0);
        const daysWithSales = records.filter(r => r.volume > 0).length;

        // Calculate closing rate (mock data for now)
        const totalTours = records.filter(r => r.socio).length; // Tours = records with client names
        const closingRate = totalTours > 0 ? ((daysWithSales / totalTours) * 100).toFixed(1) : 0;

        // Calculate avg sale
        const avgSale = daysWithSales > 0 ? (totalVolume / daysWithSales).toFixed(0) : 0;

        // Calculate avg commission
        const avgCommission = daysWithSales > 0 ? (totalCommission / daysWithSales).toFixed(0) : 0;

        // Calculate efficiency trends (vs last month - mock)
        const vsLastMonth = {
          volume: 12.5, // % change
          closingRate: -3.2,
          avgSale: 8.7,
          daysActive: 15.0
        };

        setMetrics({
          totalVolume,
          totalCommission,
          daysWithSales,
          totalTours,
          closingRate,
          avgSale,
          avgCommission,
          vsLastMonth,
          efficiency: calculateEfficiencyScore({ totalVolume, daysWithSales, closingRate, avgSale })
        });
      }
    } catch (error) {
      console.error('Error fetching efficiency metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEfficiencyScore = (data) => {
    // Simple efficiency score calculation (0-100)
    let score = 0;

    // Volume score (0-40 points)
    if (data.totalVolume > 10000) score += 40;
    else if (data.totalVolume > 5000) score += 30;
    else if (data.totalVolume > 2000) score += 20;
    else if (data.totalVolume > 0) score += 10;

    // Activity score (0-30 points)
    if (data.daysWithSales > 20) score += 30;
    else if (data.daysWithSales > 15) score += 25;
    else if (data.daysWithSales > 10) score += 20;
    else if (data.daysWithSales > 5) score += 15;
    else if (data.daysWithSales > 0) score += 10;

    // Closing rate score (0-30 points)
    if (data.closingRate > 30) score += 30;
    else if (data.closingRate > 25) score += 25;
    else if (data.closingRate > 20) score += 20;
    else if (data.closingRate > 15) score += 15;
    else if (data.closingRate > 10) score += 10;

    return score;
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend, format = 'number' }) => {
    const isPositive = trend >= 0;
    const trendColor = isPositive ? 'text-[#10B981]' : 'text-[#EF4444]';

    return (
      <Card className={`bg-gradient-to-br from-[${color}]/10 to-transparent border border-[${color}]/30`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-[${color}]`} />
                <p className="text-sm text-[#94A3B8]">{title}</p>
              </div>
              <p className={`text-3xl font-bold font-['JetBrains_Mono'] text-[${color}]`}>
                {format === 'currency' ? `$${value.toLocaleString()}` :
                 format === 'percent' ? `${value}%` :
                 value}
              </p>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isPositive ? '+' : ''}{trend}% vs last month
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-12 text-center">
          <Activity className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Data Available</h3>
          <p className="text-[#94A3B8]">Start logging sales to see your efficiency metrics</p>
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
            <Activity className="w-6 h-6 text-[#D4AF37]" />
            Efficiency Dashboard
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Track your performance metrics and identify improvement areas
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${timeRange === range
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'}
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Efficiency Score */}
      <Card className={`bg-gradient-to-br ${
        metrics.efficiency >= 80 ? 'from-[#10B981]/20 to-transparent border-[#10B981]/50' :
        metrics.efficiency >= 60 ? 'from-[#F59E0B]/20 to-transparent border-[#F59E0B]/50' :
        'from-[#EF4444]/20 to-transparent border-[#EF4444]/50'
      } border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-[#F8FAFC] mb-2">Efficiency Score</h4>
              <p className="text-sm text-[#94A3B8]">
                {metrics.efficiency >= 80 ? 'Excellent performance! 🎉' :
                 metrics.efficiency >= 60 ? 'Good progress, room to improve' :
                 'Focus on key metrics to boost performance'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                {metrics.efficiency}
              </p>
              <p className="text-sm text-[#94A3B8] mt-1">/ 100</p>
            </div>
          </div>

          <Progress
            value={metrics.efficiency}
            className="h-3 mt-4 bg-white/10"
          />
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Volume"
          value={metrics.totalVolume}
          icon={DollarSign}
          color="#10B981"
          trend={metrics.vsLastMonth.volume}
          format="currency"
        />

        <MetricCard
          title="Closing Rate"
          value={metrics.closingRate}
          icon={Target}
          color="#3B82F6"
          trend={metrics.vsLastMonth.closingRate}
          format="percent"
        />

        <MetricCard
          title="Avg Sale"
          value={metrics.avgSale}
          icon={TrendingUp}
          color="#8B5CF6"
          trend={metrics.vsLastMonth.avgSale}
          format="currency"
        />

        <MetricCard
          title="Days Active"
          value={metrics.daysWithSales}
          icon={Clock}
          color="#F59E0B"
          trend={metrics.vsLastMonth.daysActive}
        />
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Efficiency */}
        <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              Sales Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#94A3B8]">Tours to Sales Ratio</p>
                <p className="text-sm font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  {metrics.totalTours > 0 ? (metrics.daysWithSales / metrics.totalTours).toFixed(1) : 0}
                </p>
              </div>
              <Progress
                value={metrics.totalTours > 0 ? (metrics.daysWithSales / metrics.totalTours) * 100 : 0}
                className="h-2 bg-white/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#94A3B8]">Avg Commission per Sale</p>
                <p className="text-sm font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  ${metrics.avgCommission}
                </p>
              </div>
              <Progress
                value={Math.min(100, (metrics.avgCommission / 500) * 100)}
                className="h-2 bg-white/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#94A3B8]">Daily Sales Avg</p>
                <p className="text-sm font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                  ${(metrics.totalVolume / Math.max(1, metrics.daysWithSales)).toFixed(0)}
                </p>
              </div>
              <Progress
                value={Math.min(100, ((metrics.totalVolume / Math.max(1, metrics.daysWithSales)) / 1000) * 100)}
                className="h-2 bg-white/10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#D4AF37]" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.closingRate >= 25 ? (
              <div className="flex items-start gap-3 p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Strong Closing Rate</p>
                  <p className="text-xs text-[#94A3B8]">
                    Your closing rate is above 25%. Keep up the great work!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Improve Closing Rate</p>
                  <p className="text-xs text-[#94A3B8]">
                    Focus on training modules to improve your closing skills.
                  </p>
                </div>
              </div>
            )}

            {metrics.avgSale >= 1000 ? (
              <div className="flex items-start gap-3 p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Healthy Avg Sale</p>
                  <p className="text-xs text-[#94A3B8]">
                    Your average sale is $1,000+. Great job maintaining value!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Increase Average Sale</p>
                  <p className="text-xs text-[#94A3B8]">
                    Focus on value architecture modules to increase deal size.
                  </p>
                </div>
              </div>
            )}

            {metrics.daysWithSales >= 20 ? (
              <div className="flex items-start gap-3 p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Consistent Activity</p>
                  <p className="text-xs text-[#94A3B8]">
                    You've been active 20+ days this month. Excellent consistency!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Increase Activity</p>
                  <p className="text-xs text-[#94A3B8]">
                    Log more sales days to build momentum and consistency.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
