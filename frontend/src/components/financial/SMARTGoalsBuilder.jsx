import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target, CheckCircle2, Calendar, TrendingUp, DollarSign,
  Award, Plus, Trash2, Edit2, Save, Lightbulb, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { API } from '@/App';
import axios from 'axios';

const SMART_CRITERIA = [
  {
    key: 'specific',
    label: 'Specific',
    icon: Target,
    description: 'Define clearly what you want to achieve',
    color: '#3B82F6',
    examples: ['Close 5 sales this week', 'Make $15,000 in November', 'Complete 3 training modules']
  },
  {
    key: 'measurable',
    icon: TrendingUp,
    label: 'Measurable',
    description: 'Include concrete metrics to track progress',
    color: '#10B981',
    examples: ['$10,000 revenue', '20 tours', '80% closing rate']
  },
  {
    key: 'achievable',
    icon: CheckCircle2,
    label: 'Achievable',
    description: 'Set realistic goals based on your capabilities',
    color: '#F59E0B',
    examples: ['10% increase from last month', '2 sales per week', '1 module per day']
  },
  {
    key: 'relevant',
    icon: Award,
    label: 'Relevant',
    description: 'Align with your long-term objectives',
    color: '#8B5CF6',
    examples: ['Build to $20k/month', 'Reach Stage 3', 'Become Top Producer']
  },
  {
    key: 'time_bound',
    icon: Calendar,
    label: 'Time-Bound',
    description: 'Set a clear deadline for completion',
    color: '#EF4444',
    examples: ['By end of month', 'In 2 weeks', 'This quarter']
  }
];

const TIMEFRAMES = [
  { value: 'immediate', label: 'Immediate', description: 'This week', color: '#EF4444' },
  { value: 'short_term', label: 'Short-term', description: 'This month', color: '#F59E0B' },
  { value: 'medium_term', label: 'Medium-term', description: 'This quarter', color: '#3B82F6' },
  { value: 'long_term', label: 'Long-term', description: 'This year', color: '#8B5CF6' }
];

const GOAL_CATEGORIES = [
  { id: 'sales', label: 'Sales', icon: '💰', color: '#10B981' },
  { id: 'training', label: 'Training', icon: '📚', color: '#3B82F6' },
  { id: 'skills', label: 'Skills', icon: '🎯', color: '#8B5CF6' },
  { id: 'mindset', label: 'Mindset', icon: '💪', color: '#F59E0B' },
  { id: 'relationships', label: 'Relationships', icon: '🤝', color: '#EC4899' }
];

export const SMARTGoalsBuilder = ({ onGoalsUpdate }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    timeframe: 'short_term',
    target_value: '',
    current_value: '0',
    deadline: '',
    action_steps: [''],
    motivation: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      // Fetch from API (endpoint to be created)
      const response = await axios.get(`${API}/financial/smart-goals`, { withCredentials: true });
      if (response.data.success) {
        setGoals(response.data.data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching SMART goals:', error);
      // Use mock data for now
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      timeframe: 'short_term',
      target_value: '',
      current_value: '0',
      deadline: '',
      action_steps: [''],
      motivation: ''
    });
    setEditingGoal(null);
    setDialogOpen(true);
  };

  const openEditDialog = (goal) => {
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      timeframe: goal.timeframe,
      target_value: goal.target_value,
      current_value: goal.current_value,
      deadline: goal.deadline || '',
      action_steps: goal.action_steps || [''],
      motivation: goal.motivation || ''
    });
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const saveGoal = async () => {
    if (!formData.title || !formData.category || !formData.target_value) {
      return;
    }

    setSaving(true);
    try {
      const goalData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        timeframe: formData.timeframe,
        target_value: parseFloat(formData.target_value),
        current_value: parseFloat(formData.current_value) || 0,
        deadline: formData.deadline,
        action_steps: formData.action_steps.filter(step => step.trim()),
        motivation: formData.motivation
      };

      if (editingGoal) {
        // Update existing goal
        await axios.put(
          `${API}/financial/smart-goals/${editingGoal.goal_id}`,
          goalData,
          { withCredentials: true }
        );
        setGoals(prev => prev.map(g =>
          g.goal_id === editingGoal.goal_id ? { ...g, ...goalData } : g
        ));
      } else {
        // Create new goal
        const response = await axios.post(
          `${API}/financial/smart-goals`,
          goalData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setGoals(prev => [...prev, response.data.data]);
        }
      }

      setDialogOpen(false);
      if (onGoalsUpdate) {
        onGoalsUpdate();
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`${API}/financial/smart-goals/${goalId}`, { withCredentials: true });
      setGoals(prev => prev.filter(g => g.goal_id !== goalId));
      if (onGoalsUpdate) {
        onGoalsUpdate();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const updateProgress = async (goalId, newCurrentValue) => {
    try {
      await axios.patch(
        `${API}/financial/smart-goals/${goalId}`,
        { current_value: parseFloat(newCurrentValue) },
        { withCredentials: true }
      );
      setGoals(prev => prev.map(g =>
        g.goal_id === goalId ? { ...g, current_value: parseFloat(newCurrentValue) } : g
      ));
      if (onGoalsUpdate) {
        onGoalsUpdate();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const calculateProgress = (goal) => {
    if (!goal.target_value || goal.target_value === 0) return 0;
    return Math.min(100, (goal.current_value / goal.target_value) * 100);
  };

  const getSMARTScore = (goal) => {
    let score = 0;
    if (goal.title) score += 20; // Specific
    if (goal.target_value) score += 20; // Measurable
    if (goal.action_steps && goal.action_steps.length > 0) score += 20; // Achievable
    if (goal.category) score += 20; // Relevant
    if (goal.deadline) score += 20; // Time-bound
    return score;
  };

  const addActionStep = () => {
    setFormData(prev => ({
      ...prev,
      action_steps: [...prev.action_steps, '']
    }));
  };

  const removeActionStep = (index) => {
    setFormData(prev => ({
      ...prev,
      action_steps: prev.action_steps.filter((_, i) => i !== index)
    }));
  };

  const updateActionStep = (index, value) => {
    setFormData(prev => ({
      ...prev,
      action_steps: prev.action_steps.map((step, i) => i === index ? value : step)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Target className="w-6 h-6 text-[#D4AF37]" />
            SMART Goals
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Set Specific, Measurable, Achievable, Relevant, Time-Bound goals
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* SMART Criteria Guide */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
            SMART Criteria Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {SMART_CRITERIA.map((criteria) => (
              <div key={criteria.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[${criteria.color}]/20`}>
                    <criteria.icon className={`w-4 h-4 text-[${criteria.color}]`} />
                  </div>
                  <p className="text-sm font-bold text-[#F8FAFC]">{criteria.label}</p>
                </div>
                <p className="text-xs text-[#94A3B8]">{criteria.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Goals Set Yet</h3>
            <p className="text-[#94A3B8] mb-4">Create your first SMART goal to start tracking your progress</p>
            <Button
              onClick={openCreateDialog}
              className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const category = GOAL_CATEGORIES.find(c => c.id === goal.category);
            const timeframe = TIMEFRAMES.find(t => t.value === goal.timeframe);
            const progress = calculateProgress(goal);
            const smartScore = getSMARTScore(goal);
            const isCompleted = progress >= 100;

            return (
              <motion.div
                key={goal.goal_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`
                    relative overflow-hidden border-2 h-full
                    ${isCompleted
                      ? 'border-[#10B981]/50 bg-gradient-to-br from-[#10B981]/10 to-transparent'
                      : 'border-white/10 bg-gradient-to-br from-white/5 to-transparent'}
                  `}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category?.icon}</div>
                        <div>
                          <CardTitle className={`text-lg font-bold ${isCompleted ? 'text-[#10B981]' : 'text-[#F8FAFC]'} font-['Playfair_Display']`}>
                            {goal.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`bg-[${category?.color}] text-white text-xs`}>
                              {category?.label}
                            </Badge>
                            <Badge className={`bg-[${timeframe?.color}] text-white text-xs`}>
                              {timeframe?.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(goal)}
                          className="text-[#94A3B8] hover:text-[#F8FAFC]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.goal_id)}
                          className="text-[#94A3B8] hover:text-[#EF4444]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#94A3B8]">Progress</p>
                        <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                          {progress.toFixed(0)}%
                        </p>
                      </div>
                      <Progress value={progress} className="h-2 bg-white/10" />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-[#94A3B8]">
                          Current: {goal.current_value} / {goal.target_value}
                        </p>
                        <input
                          type="number"
                          value={goal.current_value}
                          onChange={(e) => updateProgress(goal.goal_id, e.target.value)}
                          className="w-20 bg-black/50 border border-white/10 text-white text-xs rounded px-2 py-1"
                          placeholder="Update"
                        />
                      </div>
                    </div>

                    {/* SMART Score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#94A3B8]">SMART Score</p>
                        <p className="text-sm font-bold text-[#8B5CF6] font-['JetBrains_Mono']">
                          {smartScore}/100
                        </p>
                      </div>
                      <Progress value={smartScore} className="h-2 bg-white/10" />
                    </div>

                    {/* Action Steps */}
                    {goal.action_steps && goal.action_steps.length > 0 && (
                      <div>
                        <p className="text-sm text-[#94A3B8] mb-2">Action Steps</p>
                        <div className="space-y-1">
                          {goal.action_steps.slice(0, 3).map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[#F8FAFC]">
                              <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[10px]">{i + 1}</span>
                              </div>
                              <p className="line-clamp-1">{step}</p>
                            </div>
                          ))}
                          {goal.action_steps.length > 3 && (
                            <p className="text-xs text-[#94A3B8]">
                              +{goal.action_steps.length - 3} more steps
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Deadline */}
                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-4 h-4 text-[#94A3B8]" />
                        <p className="text-[#94A3B8]">Deadline: {goal.deadline}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-['Playfair_Display'] text-[#D4AF37]">
              {editingGoal ? 'Edit Goal' : 'Create SMART Goal'}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Define your goal using SMART criteria for maximum effectiveness
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Goal Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Close $20,000 in sales this month"
                className="mt-1 bg-black/50 border-white/10 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal in detail..."
                rows={3}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm"
              />
            </div>

            {/* Category & Timeframe */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {GOAL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">Timeframe *</Label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  {TIMEFRAMES.map(tf => (
                    <option key={tf.value} value={tf.value}>{tf.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target & Current Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Target Value *</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">$</span>
                  <Input
                    type="number"
                    value={formData.target_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                    placeholder="10000"
                    className="pl-7 bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">Current Value</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">$</span>
                  <Input
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                    placeholder="0"
                    className="pl-7 bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Deadline</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="mt-1 bg-black/50 border-white/10 text-white"
              />
            </div>

            {/* Action Steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-[#94A3B8]">Action Steps</Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={addActionStep}
                  className="text-[#D4AF37] hover:text-[#B4942D]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {formData.action_steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-[#94A3B8]">{index + 1}</span>
                    </div>
                    <Input
                      value={step}
                      onChange={(e) => updateActionStep(index, e.target.value)}
                      placeholder="Action step..."
                      className="flex-1 bg-black/50 border-white/10 text-white text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeActionStep(index)}
                      className="text-[#EF4444] hover:text-[#DC2626]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Why is this goal important to you?</Label>
              <Textarea
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                placeholder="Your motivation will keep you focused..."
                rows={2}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveGoal}
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{editingGoal ? 'Update' : 'Create'} Goal</>}
              </Button>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outline"
                className="bg-white/10 text-[#F8FAFC] hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
