import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API } from '@/App';
import axios from 'axios';

export const GoalSheetHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [filter, setFilter] = useState('all'); // all, this_week, this_month

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/goalsheet/my?limit=30`, { withCredentials: true });
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('History error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMetricIcon = (key) => {
    const icons = {
      tours_given: '🎯',
      calls_made: '📞',
      new_leads: '👤',
      closes: '💰',
      referrals: '🤝',
      demos_booked: '📅',
      presentations: '🎤',
    };
    return icons[key] || '📊';
  };

  const getMetricLabel = (key) => {
    const labels = {
      tours_given: 'Tours',
      calls_made: 'Calls',
      new_leads: 'Leads',
      closes: 'Closes',
      referrals: 'Referrals',
      demos_booked: 'Demos',
      presentations: 'Presentations',
    };
    return labels[key] || key;
  };

  const calculateTotalScore = (metrics) => {
    return (
      (metrics.tours_given || 0) * 1 +
      (metrics.calls_made || 0) * 0.5 +
      (metrics.new_leads || 0) * 2 +
      (metrics.closes || 0) * 10 +
      (metrics.referrals || 0) * 3 +
      (metrics.demos_booked || 0) * 1.5 +
      (metrics.presentations || 0) * 1.5
    );
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <p className="text-[#94A3B8]">No history yet</p>
            <p className="text-sm text-[#94A3B8] mt-2">Start tracking your daily metrics to see history here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                Goal Sheet History
              </CardTitle>
              <CardDescription className="text-[#94A3B8] mt-2">
                Your tracked metrics over time
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-[#D4AF37] text-black' : 'border-white/10'}
              >
                All
              </Button>
              <Button
                variant={filter === 'this_week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('this_week')}
                className={filter === 'this_week' ? 'bg-[#D4AF37] text-black' : 'border-white/10'}
              >
                This Week
              </Button>
              <Button
                variant={filter === 'this_month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('this_month')}
                className={filter === 'this_month' ? 'bg-[#D4AF37] text-black' : 'border-white/10'}
              >
                This Month
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* History Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((sheet, index) => {
          const totalScore = calculateTotalScore(sheet.metrics || {});
          const progressPercentage = sheet.progress_percentage;

          return (
            <motion.div
              key={sheet.sheet_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#D4AF37]/30 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-[#F8FAFC] font-['Playfair_Display']">
                        {formatDate(sheet.date)}
                      </CardTitle>
                      <CardDescription className="text-[#94A3B8]">
                        {sheet.notes ? 'With notes' : 'No notes'}
                      </CardDescription>
                    </div>
                    <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-['JetBrains_Mono']">
                      {totalScore.toFixed(0)} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Top Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-white/5 rounded-sm">
                        <p className="text-xs text-[#94A3B8]">Tours</p>
                        <p className="text-lg font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                          {sheet.metrics?.tours_given || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded-sm">
                        <p className="text-xs text-[#94A3B8]">Closes</p>
                        <p className="text-lg font-bold text-[#10B981] font-['JetBrains_Mono']">
                          {sheet.metrics?.closes || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded-sm">
                        <p className="text-xs text-[#94A3B8]">Leads</p>
                        <p className="text-lg font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                          {sheet.metrics?.new_leads || 0}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progressPercentage && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#94A3B8]">vs Goals</span>
                          <span className="font-['JetBrains_Mono'] text-[#D4AF37]">
                            {progressPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10"
                          onClick={() => setSelectedSheet(sheet)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0A0A0B] border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                            {formatDate(sheet.date)}
                          </DialogTitle>
                          <DialogDescription className="text-[#94A3B8]">
                            Detailed metrics and goals
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
                          {/* All Metrics */}
                          <div>
                            <h3 className="text-sm font-medium text-[#F8FAFC] mb-3">Daily Metrics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(sheet.metrics || {}).map(([key, value]) => (
                                <div key={key} className="p-3 bg-white/5 border border-white/10 rounded-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{getMetricIcon(key)}</span>
                                    <p className="text-xs text-[#94A3B8]">{getMetricLabel(key)}</p>
                                  </div>
                                  <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                                    {value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Goals */}
                          {sheet.goals && (
                            <div>
                              <h3 className="text-sm font-medium text-[#F8FAFC] mb-3">Weekly Goals</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(sheet.goals).map(([key, value]) => (
                                  <div key={key} className="p-3 bg-white/5 border border-white/10 rounded-sm">
                                    <p className="text-xs text-[#94A3B8] mb-1">{getMetricLabel(key)}</p>
                                    <p className="text-xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                                      {value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {sheet.notes && (
                            <div>
                              <h3 className="text-sm font-medium text-[#F8FAFC] mb-2">Notes</h3>
                              <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                                <p className="text-sm text-[#94A3B8]">{sheet.notes}</p>
                              </div>
                            </div>
                          )}

                          {/* Score */}
                          <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#D4AF37]">Total Score</span>
                              <span className="text-3xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                                {totalScore.toFixed(0)} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
