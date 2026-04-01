import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Calendar, Trophy, TrendingUp, Award,
  Target, DollarSign, Star, Zap, CheckCircle2, BarChart3,
  PieChart, Lightbulb, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { API } from '@/App';
import axios from 'axios';

export const MonthlyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMonthlyReport();
  }, [selectedMonth, selectedYear]);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      // Fetch data for the report
      const [summaryResponse, salesResponse, attributesResponse] = await Promise.all([
        axios.get(`${API}/financial/goals/summary`, { withCredentials: true }),
        axios.get(`${API}/financial/sales/monthly`, { withCredentials: true }),
        axios.get(`${API}/development/badges`, { withCredentials: true })
      ]);

      if (summaryResponse.data.success && salesResponse.data.success) {
        const summary = summaryResponse.data.summary;
        const sales = salesResponse.data.data.records || [];
        const badges = attributesResponse.data.data?.badges || [];

        // Generate monthly report
        const report = generateMonthlyReport(summary, sales, badges);
        setReport(report);
      }
    } catch (error) {
      console.error('Error fetching monthly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReport = (summary, sales, badges) => {
    const totalVolume = sales.reduce((sum, s) => sum + (s.volume || 0), 0);
    const daysWithSales = sales.filter(s => s.volume > 0).length;
    const avgSale = daysWithSales > 0 ? totalVolume / daysWithSales : 0;

    // Top achievements
    const topBadges = badges.filter(b => b.awarded).slice(0, 5);

    // Weekly breakdown
    const weeklyBreakdown = calculateWeeklyBreakdown(sales);

    // Best day
    const bestDay = sales.reduce((best, sale) =>
      (sale.volume || 0) > (best?.volume || 0) ? sale : best, null);

    // Streaks
    const currentStreak = calculateCurrentStreak(sales);
    const longestStreak = calculateLongestStreak(sales);

    // Improvements
    const improvements = identifyImprovements(summary, sales);

    return {
      month: selectedMonth,
      year: selectedYear,
      totalVolume,
      daysWithSales,
      avgSale,
      targetIncome: summary.target_income,
      progressPercentage: summary.progress_percentage,
      topBadges,
      weeklyBreakdown,
      bestDay,
      currentStreak,
      longestStreak,
      improvements,
      totalPoints: badges.reduce((sum, b) => sum + (b.points || 0), 0)
    };
  };

  const calculateWeeklyBreakdown = (sales) => {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekSales = sales.slice(i * 7, (i + 1) * 7);
      const weekVolume = weekSales.reduce((sum, s) => sum + (s.volume || 0), 0);
      weeks.push({
        week: i + 1,
        volume: weekVolume,
        days: weekSales.filter(s => s.volume > 0).length
      });
    }
    return weeks;
  };

  const calculateCurrentStreak = (sales) => {
    let streak = 0;
    for (let i = sales.length - 1; i >= 0; i--) {
      if (sales[i].volume > 0) streak++;
      else break;
    }
    return streak;
  };

  const calculateLongestStreak = (sales) => {
    let longestStreak = 0;
    let currentStreak = 0;
    for (const sale of sales) {
      if (sale.volume > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    return longestStreak;
  };

  const identifyImprovements = (summary, sales) => {
    const improvements = [];

    if (summary.progress_percentage >= 100) {
      improvements.push({
        type: 'achievement',
        icon: Trophy,
        title: 'Goal Achieved!',
        description: `You reached ${summary.progress_percentage.toFixed(0)}% of your monthly target.`
      });
    }

    const totalVolume = sales.reduce((sum, s) => sum + (s.volume || 0), 0);
    if (totalVolume > 10000) {
      improvements.push({
        type: 'achievement',
        icon: Star,
        title: '$10k+ Month',
        description: `Excellent performance with $${totalVolume.toLocaleString()} in sales.`
      });
    }

    const daysWithSales = sales.filter(s => s.volume > 0).length;
    if (daysWithSales >= 20) {
      improvements.push({
        type: 'achievement',
        icon: Zap,
        title: 'Consistent Performer',
        description: `${daysWithSales} days with sales this month. Great consistency!`
      });
    }

    const avgSale = daysWithSales > 0 ? totalVolume / daysWithSales : 0;
    if (avgSale >= 1000) {
      improvements.push({
        type: 'achievement',
        icon: Award,
        title: 'High Value Sales',
        description: `Average sale of $${avgSale.toFixed(0)} shows strong value architecture.`
      });
    }

    return improvements;
  };

  const exportReport = () => {
    // Export report as JSON or PDF (implementation depends on requirements)
    console.log('Exporting report:', report);
    alert('Report exported! (Feature coming soon)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <Card className="bg-white/5 border border-white/10">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Report Data</h3>
          <p className="text-[#94A3B8]">Start logging sales to generate monthly reports</p>
        </CardContent>
      </Card>
    );
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            Monthly Performance Report
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            {monthNames[report.month]} {report.year}
          </p>
        </div>

        <Button
          onClick={exportReport}
          className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Executive Summary */}
      <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border-2 border-[#D4AF37]/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#D4AF37] font-['Playfair_Display']">
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                ${report.totalVolume.toLocaleString()}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                of ${report.targetIncome.toLocaleString()} goal
              </p>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Progress</p>
              <p className="text-3xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                {report.progressPercentage.toFixed(0)}%
              </p>
              <Progress value={report.progressPercentage} className="h-2 mt-2 bg-white/10" />
            </div>

            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Days Active</p>
              <p className="text-3xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                {report.daysWithSales}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Avg sale: ${report.avgSale.toFixed(0)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Total Points</p>
              <p className="text-3xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                {report.totalPoints}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                {report.topBadges.length} badges earned
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Achievements */}
      {report.improvements.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            Key Achievements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.improvements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#10B981]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <improvement.icon className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[#F8FAFC] mb-1">
                          {improvement.title}
                        </h5>
                        <p className="text-xs text-[#94A3B8]">
                          {improvement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Breakdown */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
            Weekly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.weeklyBreakdown.map((week) => {
              const maxVolume = Math.max(...report.weeklyBreakdown.map(w => w.volume));
              const percentage = maxVolume > 0 ? (week.volume / maxVolume) * 100 : 0;

              return (
                <div key={week.week} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#F8FAFC]">Week {week.week}</span>
                      <span className="text-xs text-[#94A3B8]">{week.days} days active</span>
                    </div>
                    <span className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                      ${week.volume.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-white/10" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Streaks & Records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/30">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
            <p className="text-sm text-[#94A3B8] mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-[#F59E0B] font-['JetBrains_Mono']">
              {report.currentStreak}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/30">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-[#8B5CF6] mx-auto mb-2" />
            <p className="text-sm text-[#94A3B8] mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
              {report.longestStreak}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">days</p>
          </CardContent>
        </Card>

        {report.bestDay && (
          <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
              <p className="text-sm text-[#94A3B8] mb-1">Best Day</p>
              <p className="text-3xl font-bold text-[#10B981] font-['JetBrains_Mono']">
                ${report.bestDay.volume?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">Day {report.bestDay.day_number}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Badges */}
      {report.topBadges.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              Badges Earned This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {report.topBadges.map((badge) => (
                <div
                  key={badge.badge_id}
                  className="text-center p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-xs font-bold text-[#F8FAFC] line-clamp-2">
                    {badge.name}
                  </p>
                  {badge.points && (
                    <Badge className="mt-2 bg-[#D4AF37] text-black text-xs">
                      +{badge.points} pts
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights for Next Month */}
      <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#3B82F6]" />
            Recommendations for Next Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.progressPercentage < 100 && (
              <div className="flex items-start gap-3">
                <ArrowUpRight className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Increase Daily Activity</p>
                  <p className="text-xs text-[#94A3B8]">
                    Log more sales days to build momentum and reach your goal.
                  </p>
                </div>
              </div>
            )}

            {report.avgSale < 1000 && (
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Focus on Value Architecture</p>
                  <p className="text-xs text-[#94A3B8]">
                    Complete training modules to increase your average sale size.
                  </p>
                </div>
              </div>
            )}

            {report.longestStreak < 7 && (
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Build Longer Streaks</p>
                  <p className="text-xs text-[#94A3B8]">
                    Maintain consistent daily activity to build momentum.
                  </p>
                </div>
              </div>
            )}

            {report.progressPercentage >= 100 && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#F8FAFC]">Set a Higher Goal</p>
                  <p className="text-xs text-[#94A3B8]">
                    You've crushed it! Consider raising your target for next month.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
