import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, TrendingUp, DollarSign, Calendar, Award,
  Trophy, Zap, ArrowRight, Plus, Edit3, CheckCircle2,
  Circle, BarChart3, PieChart, Star, Crown, Flame,
  Clock, Users, Briefcase, Building2, Percent, Phone, BookOpen
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function GoalSheetPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: '',
    title: '',
    target: '',
    current: '',
    deadline: '',
    description: ''
  });

  useEffect(() => {
    fetchGoalSheet();
  }, [selectedPeriod]);

  const fetchGoalSheet = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      // const response = await axios.get(`${API}/goalsheet?period=${selectedPeriod}`, { withCredentials: true });

      // Mock data matching VCSA luxury sales academy style
      setGoals({
        sales: {
          volume: { current: 84750, target: 150000, unit: 'VP' },
          tours: { current: 42, target: 60, unit: 'tours' },
          sales: { current: 12, target: 20, unit: 'sales' },
          closing_rate: { current: 28.5, target: 35, unit: '%' }
        },
        revenue: {
          gross: { current: 142800, target: 250000, unit: 'USD' },
          commission: { current: 21340, target: 37500, unit: 'USD' },
          bonuses: { current: 2800, target: 5000, unit: 'USD' },
          avg_deal: { current: 11900, target: 12500, unit: 'USD' }
        },
        personal: {
          training_hours: { current: 24, target: 40, unit: 'hrs' },
          modules_completed: { current: 18, target: 30, unit: 'modules' },
          coaching_calls: { current: 8, target: 12, unit: 'calls' },
          readiness_score: { current: 72, target: 85, unit: 'score' }
        },
        achievements: [
          { id: 1, title: 'Top 10%', icon: 'trophy', unlocked: true, description: 'Top 10% performer this month' },
          { id: 2, title: 'Hot Streak', icon: 'flame', unlocked: true, description: '5 sales in a row' },
          { id: 3, title: 'Club Elite', icon: 'crown', unlocked: false, description: '100K+ in monthly volume' },
          { id: 4, title: 'Perfect Week', icon: 'star', unlocked: false, description: '100% closing rate for a week' }
        ],
        milestones: [
          { id: 1, title: 'Quarter 1 Target', target: 450000, current: 342800, deadline: '2026-03-31', status: 'on-track' },
          { id: 2, title: 'Annual Bonus', target: 1500000, current: 84750, deadline: '2026-12-31', status: 'in-progress' }
        ]
      });

      setStats({
        today: {
          tours: 3,
          presentations: 2,
          sales: 1,
          volume: 11900
        },
        week: {
          tours: 18,
          presentations: 12,
          sales: 5,
          volume: 59500
        },
        streak: {
          current: 5,
          best: 12
        },
        rank: {
          current: 8,
          total: 42,
          movement: '+3'
        }
      });
    } catch (error) {
      console.error('Error fetching goal sheet:', error);
      toast.error('Failed to load goal sheet');
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-[#D4AF37]';
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGoalIcon = (category) => {
    const icons = {
      volume: Briefcase,
      tours: Users,
      sales: DollarSign,
      closing_rate: Percent,
      gross: Building2,
      commission: DollarSign,
      bonuses: Award,
      avg_deal: TrendingUp,
      training_hours: Clock,
      modules_completed: BookOpen,
      coaching_calls: Phone,
      readiness_score: Target
    };
    return icons[category] || Target;
  };

  const handleCreateGoal = () => {
    toast.success('Goal created successfully!');
    setIsGoalDialogOpen(false);
    setNewGoal({
      category: '',
      title: '',
      target: '',
      current: '',
      deadline: '',
      description: ''
    });
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold">
              Goal Sheet
            </h1>
            <p className="text-[#94A3B8] mt-1">Track your performance and crush your targets</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-black/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="quarterly">This Quarter</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold uppercase tracking-wider text-sm gap-2">
                  <Plus className="w-4 h-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0A0A0B] border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Create New Goal</DialogTitle>
                  <DialogDescription className="text-[#94A3B8]">
                    Set a new target to track your performance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                      <SelectTrigger className="bg-black/50 border-white/10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="personal">Personal Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Goal Title</Label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Monthly Sales Target"
                      className="bg-black/50 border-white/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target</Label>
                      <Input
                        type="number"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        placeholder="100"
                        className="bg-black/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current</Label>
                      <Input
                        type="number"
                        value={newGoal.current}
                        onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                        placeholder="0"
                        className="bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="bg-black/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal..."
                      className="bg-black/50 border-white/10 min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setIsGoalDialogOpen(false)}
                    className="text-[#94A3B8] hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGoal}
                    className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
                  >
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Today's Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="glass p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 vip-glow" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Today's Volume</p>
              <p className="font-mono text-3xl font-bold text-[#D4AF37]">
                ${stats?.today.volume.toLocaleString()}
              </p>
              <p className="text-xs text-[#94A3B8] mt-2">{stats?.today.sales} sales</p>
            </div>
          </div>

          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Tours Today</p>
            <p className="font-mono text-3xl font-bold">{stats?.today.tours}</p>
            <p className="text-xs text-[#94A3B8] mt-2">{stats?.today.presentations} presentations</p>
          </div>

          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Weekly Volume</p>
            <p className="font-mono text-3xl font-bold">${stats?.week.volume.toLocaleString()}</p>
            <p className="text-xs text-[#94A3B8] mt-2">{stats?.week.sales} sales</p>
          </div>

          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Sales Streak</p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-3xl font-bold text-[#D4AF37]">{stats?.streak.current}</p>
              <Flame className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-xs text-[#94A3B8] mt-2">Best: {stats?.streak.best} days</p>
          </div>
        </motion.div>

        {/* Rank & Leaderboard Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-sm flex items-center justify-center border border-[#D4AF37]/30">
              <Trophy className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1">Current Rank</p>
              <p className="font-serif text-3xl font-bold">
                #{stats?.rank.current} <span className="text-lg text-[#94A3B8]">/ {stats?.rank.total}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats?.rank.movement} this week
            </Badge>
            <p className="text-xs text-[#94A3B8] mt-2">Keep climbing!</p>
          </div>
        </motion.div>

        {/* Goals Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList className="bg-black/50 border border-white/10 p-1">
              <TabsTrigger value="sales" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Target className="w-4 h-4 mr-2" />
                Sales Goals
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="personal" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Zap className="w-4 h-4 mr-2" />
                Personal Growth
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Sales Goals */}
            <TabsContent value="sales" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(goals?.sales || {}).map(([key, goal]) => {
                  const Icon = getGoalIcon(key);
                  const progress = getProgressPercentage(goal.current, goal.target);
                  const statusColor = getStatusColor(progress);

                  return (
                    <Card key={key} className="glass border-white/5 hover:border-[#D4AF37]/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="font-semibold capitalize">{key.replace('_', ' ')}</p>
                              <p className="text-xs text-[#94A3B8]">Target: {goal.target.toLocaleString()} {goal.unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-mono text-2xl font-bold", statusColor)}>
                              {progress.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Progress value={progress} className="h-2 bg-white/10" />
                          <div className="flex justify-between text-sm">
                            <span className="text-[#94A3B8]">
                              {goal.current.toLocaleString()} {goal.unit}
                            </span>
                            <span className="text-[#94A3B8]">
                              {goal.target.toLocaleString()} {goal.unit}
                            </span>
                          </div>
                        </div>

                        {progress >= 100 && (
                          <div className="mt-4 flex items-center gap-2 text-[#D4AF37]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Goal Achieved!</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Revenue Goals */}
            <TabsContent value="revenue" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(goals?.revenue || {}).map(([key, goal]) => {
                  const Icon = getGoalIcon(key);
                  const progress = getProgressPercentage(goal.current, goal.target);
                  const statusColor = getStatusColor(progress);

                  return (
                    <Card key={key} className="glass border-white/5 hover:border-[#D4AF37]/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-sm flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="font-semibold capitalize">{key.replace('_', ' ')}</p>
                              <p className="text-xs text-[#94A3B8]">Target: ${goal.target.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-mono text-2xl font-bold", statusColor)}>
                              {progress.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Progress value={progress} className="h-2 bg-white/10" />
                          <div className="flex justify-between text-sm">
                            <span className="text-[#94A3B8]">
                              ${goal.current.toLocaleString()}
                            </span>
                            <span className="text-[#94A3B8]">
                              ${goal.target.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {progress >= 100 && (
                          <div className="mt-4 flex items-center gap-2 text-[#D4AF37]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Goal Achieved!</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Personal Growth Goals */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(goals?.personal || {}).map(([key, goal]) => {
                  const Icon = getGoalIcon(key);
                  const progress = getProgressPercentage(goal.current, goal.target);
                  const statusColor = getStatusColor(progress);

                  return (
                    <Card key={key} className="glass border-white/5 hover:border-[#D4AF37]/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center">
                              <Icon className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="font-semibold capitalize">{key.replace('_', ' ')}</p>
                              <p className="text-xs text-[#94A3B8]">Target: {goal.target} {goal.unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-mono text-2xl font-bold", statusColor)}>
                              {progress.toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Progress value={progress} className="h-2 bg-white/10" />
                          <div className="flex justify-between text-sm">
                            <span className="text-[#94A3B8]">
                              {goal.current} {goal.unit}
                            </span>
                            <span className="text-[#94A3B8]">
                              {goal.target} {goal.unit}
                            </span>
                          </div>
                        </div>

                        {progress >= 100 && (
                          <div className="mt-4 flex items-center gap-2 text-[#D4AF37]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Goal Achieved!</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {goals?.achievements.map((achievement) => {
                  const Icon = achievement.icon === 'trophy' ? Trophy :
                              achievement.icon === 'flame' ? Flame :
                              achievement.icon === 'crown' ? Crown : Star;

                  return (
                    <Card key={achievement.id} className={cn(
                      "glass border-white/5 transition-all relative overflow-hidden",
                      achievement.unlocked ? "border-[#D4AF37]/30" : "opacity-50"
                    )}>
                      <CardContent className="p-6 text-center">
                        <div className={cn(
                          "w-16 h-16 mx-auto mb-4 rounded-sm flex items-center justify-center",
                          achievement.unlocked ? "bg-[#D4AF37]/20" : "bg-white/5"
                        )}>
                          <Icon className={cn(
                            "w-8 h-8",
                            achievement.unlocked ? "text-[#D4AF37]" : "text-[#94A3B8]"
                          )} />
                        </div>
                        <h3 className="font-semibold mb-1">{achievement.title}</h3>
                        <p className="text-xs text-[#94A3B8] mb-3">{achievement.description}</p>
                        {achievement.unlocked ? (
                          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/10 text-[#94A3B8]">
                            <Circle className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-serif text-2xl font-semibold mb-4">Major Milestones</h2>
          <div className="space-y-4">
            {goals?.milestones.map((milestone) => {
              const progress = getProgressPercentage(milestone.current, milestone.target);
              const statusColor = milestone.status === 'on-track' ? 'text-green-400' :
                                milestone.status === 'ahead' ? 'text-[#D4AF37]' : 'text-yellow-400';

              return (
                <Card key={milestone.id} className="glass border-white/5 hover:border-[#D4AF37]/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{milestone.title}</h3>
                        <p className="text-sm text-[#94A3B8] mt-1">
                          Target: ${milestone.target.toLocaleString()} by {new Date(milestone.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge className={cn(
                        "capitalize",
                        milestone.status === 'on-track' ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        milestone.status === 'ahead' ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30" :
                        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      )}>
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Progress value={progress} className="h-3 bg-white/10" />
                      <div className="flex justify-between text-sm">
                        <span className="font-mono font-semibold text-[#D4AF37]">
                          ${milestone.current.toLocaleString()}
                        </span>
                        <span className="text-[#94A3B8]">
                          ${milestone.target.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div className="bg-black/30 rounded-sm p-3">
                        <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Remaining</p>
                        <p className="font-mono font-semibold">
                          ${(milestone.target - milestone.current).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-black/30 rounded-sm p-3">
                        <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Days Left</p>
                        <p className="font-mono font-semibold">
                          {Math.ceil((new Date(milestone.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                      <div className="bg-black/30 rounded-sm p-3">
                        <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Daily Target</p>
                        <p className="font-mono font-semibold">
                          ${Math.ceil((milestone.target - milestone.current) / Math.max(1, Math.ceil((new Date(milestone.deadline) - new Date()) / (1000 * 60 * 60 * 24)))).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Link to="/top-producer" className="glass p-4 hover:border-[#D4AF37]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <Target className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-medium">Continue Training</p>
                <p className="text-xs text-[#94A3B8]">Improve your skills</p>
              </div>
            </div>
          </Link>

          <Link to="/deal-breakdowns" className="glass p-4 hover:border-[#D4AF37]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-medium">Study Breakdowns</p>
                <p className="text-xs text-[#94A3B8]">Learn from scenarios</p>
              </div>
            </div>
          </Link>

          <Link to="/quick-wins" className="glass p-4 hover:border-[#D4AF37]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-medium">Quick Wins</p>
                <p className="text-xs text-[#94A3B8]">Tactical knowledge</p>
              </div>
            </div>
          </Link>

          <Link to="/community" className="glass p-4 hover:border-[#D4AF37]/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-medium">Community</p>
                <p className="text-xs text-[#94A3B8]">Connect with reps</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
