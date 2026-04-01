import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Save, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export const DailyMetricsForm = ({ initialData, onSubmit }) => {
  const [metrics, setMetrics] = useState({
    tours_given: initialData?.metrics?.tours_given || 0,
    calls_made: initialData?.metrics?.calls_made || 0,
    new_leads: initialData?.metrics?.new_leads || 0,
    closes: initialData?.metrics?.closes || 0,
    referrals: initialData?.metrics?.referrals || 0,
    demos_booked: initialData?.metrics?.demos_booked || 0,
    presentations: initialData?.metrics?.presentations || 0,
  });

  const [goals, setGoals] = useState({
    tours_given: initialData?.goals?.tours_given || 0,
    calls_made: initialData?.goals?.calls_made || 0,
    new_leads: initialData?.goals?.new_leads || 0,
    closes: initialData?.goals?.closes || 0,
    referrals: initialData?.goals?.referrals || 0,
    demos_booked: initialData?.goals?.demos_booked || 0,
    presentations: initialData?.goals?.presentations || 0,
  });

  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showGoals, setShowGoals] = useState(!!initialData?.goals);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metricFields = [
    { key: 'tours_given', label: 'Tours Given', icon: '🎯', color: 'text-[#D4AF37]' },
    { key: 'calls_made', label: 'Calls Made', icon: '📞', color: 'text-[#3B82F6]' },
    { key: 'new_leads', label: 'New Leads', icon: '👤', color: 'text-[#10B981]' },
    { key: 'closes', label: 'Closes', icon: '💰', color: 'text-[#F59E0B]' },
    { key: 'referrals', label: 'Referrals', icon: '🤝', color: 'text-[#8B5CF6]' },
    { key: 'demos_booked', label: 'Demos Booked', icon: '📅', color: 'text-[#EC4899]' },
    { key: 'presentations', label: 'Presentations', icon: '🎤', color: 'text-[#14B8A6]' },
  ];

  const updateMetric = (key, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setMetrics(prev => ({ ...prev, [key]: numValue }));
  };

  const updateGoal = (key, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setGoals(prev => ({ ...prev, [key]: numValue }));
  };

  const calculateProgress = (metric, goal) => {
    if (!goal || goal === 0) return null;
    return Math.min((metric / goal) * 100, 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const goalsToSubmit = showGoals ? goals : null;
      await onSubmit(metrics, goalsToSubmit, notes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Metrics Form */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                Daily Metrics
              </CardTitle>
              <CardDescription className="text-[#94A3B8]">
                Track your performance for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            {initialData && (
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                Updated Today
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metricFields.map((field) => {
              const progress = calculateProgress(metrics[field.key], goals[field.key]);
              const hasGoal = goals[field.key] > 0;

              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
                    <span className="text-lg">{field.icon}</span>
                    {field.label}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-white/10 hover:border-[#D4AF37]/50"
                      onClick={() => updateMetric(field.key, metrics[field.key] - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={metrics[field.key]}
                      onChange={(e) => updateMetric(field.key, e.target.value)}
                      className="flex-1 bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] text-lg text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-white/10 hover:border-[#D4AF37]/50"
                      onClick={() => updateMetric(field.key, metrics[field.key] + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {hasGoal && progress !== null && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                        <span>Progress</span>
                        <span className="font-['JetBrains_Mono']">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <Label className="text-sm font-medium text-[#F8FAFC]">Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any highlights, challenges, or notes from today..."
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white min-h-[100px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showGoals}
                onCheckedChange={setShowGoals}
                className="data-[state=checked]:bg-[#D4AF37]"
              />
              <Label className="text-sm text-[#94A3B8] cursor-pointer">
                Set Weekly Goals
              </Label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Goal Sheet'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals Panel */}
      <Card className={`bg-gradient-to-br from-white/5 to-transparent border border-white/10 transition-all ${showGoals ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#D4AF37]" />
            Weekly Goals
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Set your weekly targets to track progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {metricFields.map((field) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Label className="text-xs font-medium text-[#94A3B8] flex items-center gap-2">
                <span>{field.icon}</span>
                {field.label}
              </Label>
              <Input
                type="number"
                min="0"
                value={goals[field.key]}
                onChange={(e) => updateGoal(field.key, e.target.value)}
                placeholder="Set goal..."
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] text-sm"
              />
              {goals[field.key] > 0 && (
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Today</span>
                  <span className="font-['JetBrains_Mono'] text-[#F8FAFC]">
                    {metrics[field.key]} / {goals[field.key]}
                  </span>
                </div>
              )}
            </motion.div>
          ))}

          <div className="pt-4 border-t border-white/10">
            <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
              <p className="text-xs text-[#D4AF37] font-medium">
                💡 Tip: Set realistic goals to track your progress. Goals reset every Monday.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
