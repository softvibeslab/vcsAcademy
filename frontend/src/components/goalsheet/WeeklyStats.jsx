import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const WeeklyStats = ({ data }) => {
  if (!data) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-[#94A3B8]">No weekly data available</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Tours This Week',
      value: data.tours_given,
      icon: '🎯',
      color: 'text-[#D4AF37]',
      bgColor: 'bg-[#D4AF37]/10',
      borderColor: 'border-[#D4AF37]/20'
    },
    {
      title: 'Calls Made',
      value: data.calls_made,
      icon: '📞',
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10',
      borderColor: 'border-[#3B82F6]/20'
    },
    {
      title: 'New Leads',
      value: data.new_leads,
      icon: '👤',
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10',
      borderColor: 'border-[#10B981]/20'
    },
    {
      title: 'Closes',
      value: data.closes,
      icon: '💰',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10',
      borderColor: 'border-[#F59E0B]/20'
    },
    {
      title: 'Referrals',
      value: data.referrals,
      icon: '🤝',
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10',
      borderColor: 'border-[#8B5CF6]/20'
    },
    {
      title: 'Demos Booked',
      value: data.demos_booked,
      icon: '📅',
      color: 'text-[#EC4899]',
      bgColor: 'bg-[#EC4899]/10',
      borderColor: 'border-[#EC4899]/20'
    },
    {
      title: 'Presentations',
      value: data.presentations,
      icon: '🎤',
      color: 'text-[#14B8A6]',
      bgColor: 'bg-[#14B8A6]/10',
      borderColor: 'border-[#14B8A6]/20'
    },
  ];

  const daysFilled = data.days_filled || 0;
  const weekProgress = (daysFilled / 7) * 100;

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                Weekly Overview
              </CardTitle>
              <CardDescription className="text-[#94A3B8] mt-2">
                Your performance this week
              </CardDescription>
            </div>
            <Badge className="bg-[#D4AF37] text-black font-bold px-4 py-2">
              Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#94A3B8]">Weekly Progress</span>
                <span className="text-sm font-['JetBrains_Mono'] text-[#F8FAFC]">
                  {daysFilled} / 7 days
                </span>
              </div>
              <Progress value={weekProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">Days Active</p>
                    <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                      {daysFilled}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-[#10B981]" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">Total Tours</p>
                    <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                      {data.tours_given}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#F59E0B]" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">Total Closes</p>
                    <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                      {data.closes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={`${stat.bgColor} bg-gradient-to-br from-transparent to-transparent border ${stat.borderColor} hover:border-white/20 transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#94A3B8] mb-2">{stat.title}</p>
                    <p className={`text-4xl font-bold ${stat.color} font-['JetBrains_Mono']`}>
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-[#D4AF37] mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Weekly Insights</h3>
              <div className="space-y-2 text-sm text-[#94A3B8]">
                {data.closes >= 5 && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span>
                    Great job! You've hit {data.closes} closes this week.
                  </p>
                )}
                {data.tours_given >= 20 && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span>
                    Excellent activity! {data.tours_given} tours this week.
                  </p>
                )}
                {days_filled >= 5 && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span>
                    Consistent effort! You've tracked {days_filled} days this week.
                  </p>
                )}
                {data.closes < 5 && data.tours_given < 20 && days_filled < 5 && (
                  <p className="flex items-center gap-2">
                    <span className="text-[#F59E0B]">!</span>
                    Keep pushing! Focus on increasing tours and closes.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
