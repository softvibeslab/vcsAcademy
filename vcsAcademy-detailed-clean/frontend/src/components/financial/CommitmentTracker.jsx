import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, CheckCircle2, Calendar, Clock, TrendingUp,
  AlertCircle, Plus, Edit2, Trash2, Save, Award, Flame
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { API } from '@/App';
import axios from 'axios';

const COMMITMENT_TYPES = [
  { id: 'daily', label: 'Daily', icon: '📅', color: '#3B82F6', duration: 'day' },
  { id: 'weekly', label: 'Weekly', icon: '📆', color: '#8B5CF6', duration: 'week' },
  { id: 'monthly', label: 'Monthly', icon: '🗓️', color: '#D4AF37', duration: 'month' }
];

const COMMITMENT_CATEGORIES = [
  { id: 'sales', label: 'Sales', icon: '💰', color: '#10B981' },
  { id: 'training', label: 'Training', icon: '📚', color: '#3B82F6' },
  { id: 'mindset', label: 'Mindset', icon: '💪', color: '#F59E0B' },
  { id: 'health', label: 'Health', icon: '🏃', color: '#EC4899' },
  { id: 'relationships', label: 'Relationships', icon: '🤝', color: '#6366F1' }
];

export const CommitmentTracker = ({ onCommitmentsUpdate }) => {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily',
    category: '',
    target_value: '',
    current_value: '0',
    start_date: '',
    end_date: '',
    reminder_time: '',
    check_in_days: [1, 2, 3, 4, 5] // Default: weekdays
  });

  useEffect(() => {
    fetchCommitments();
  }, []);

  const fetchCommitments = async () => {
    try {
      const response = await axios.get(`${API}/financial/commitments`, { withCredentials: true });
      if (response.data.success) {
        setCommitments(response.data.data.commitments || []);
      }
    } catch (error) {
      console.error('Error fetching commitments:', error);
      setCommitments([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      category: '',
      target_value: '',
      current_value: '0',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      reminder_time: '09:00',
      check_in_days: [1, 2, 3, 4, 5]
    });
    setEditingCommitment(null);
    setDialogOpen(true);
  };

  const openEditDialog = (commitment) => {
    setFormData({
      title: commitment.title,
      description: commitment.description || '',
      type: commitment.type,
      category: commitment.category,
      target_value: commitment.target_value || '',
      current_value: commitment.current_value?.toString() || '0',
      start_date: commitment.start_date || '',
      end_date: commitment.end_date || '',
      reminder_time: commitment.reminder_time || '',
      check_in_days: commitment.check_in_days || [1, 2, 3, 4, 5]
    });
    setEditingCommitment(commitment);
    setDialogOpen(true);
  };

  const saveCommitment = async () => {
    if (!formData.title || !formData.category) {
      return;
    }

    setSaving(true);
    try {
      const commitmentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        target_value: formData.target_value ? parseFloat(formData.target_value) : null,
        current_value: parseFloat(formData.current_value) || 0,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reminder_time: formData.reminder_time,
        check_in_days: formData.check_in_days
      };

      if (editingCommitment) {
        await axios.put(
          `${API}/financial/commitments/${editingCommitment.commitment_id}`,
          commitmentData,
          { withCredentials: true }
        );
        setCommitments(prev => prev.map(c =>
          c.commitment_id === editingCommitment.commitment_id ? { ...c, ...commitmentData } : c
        ));
      } else {
        const response = await axios.post(
          `${API}/financial/commitments`,
          commitmentData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setCommitments(prev => [...prev, response.data.data]);
        }
      }

      setDialogOpen(false);
      if (onCommitmentsUpdate) {
        onCommitmentsUpdate();
      }
    } catch (error) {
      console.error('Error saving commitment:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (commitmentId, newValue) => {
    try {
      await axios.patch(
        `${API}/financial/commitments/${commitmentId}`,
        { current_value: parseFloat(newValue) },
        { withCredentials: true }
      );
      setCommitments(prev => prev.map(c =>
        c.commitment_id === commitmentId ? { ...c, current_value: parseFloat(newValue) } : c
      ));
      if (onCommitmentsUpdate) {
        onCommitmentsUpdate();
      }
    } catch (error) {
      console.error('Error updating commitment:', error);
    }
  };

  const deleteCommitment = async (commitmentId) => {
    try {
      await axios.delete(`${API}/financial/commitments/${commitmentId}`, { withCredentials: true });
      setCommitments(prev => prev.filter(c => c.commitment_id !== commitmentId));
      if (onCommitmentsUpdate) {
        onCommitmentsUpdate();
      }
    } catch (error) {
      console.error('Error deleting commitment:', error);
    }
  };

  const calculateProgress = (commitment) => {
    if (!commitment.target_value || commitment.target_value === 0) return 0;
    return Math.min(100, (commitment.current_value / commitment.target_value) * 100);
  };

  const calculateStreak = (commitment) => {
    // Mock streak calculation - in production, track actual check-ins
    return Math.floor(Math.random() * 21); // 0-20 days
  };

  const getActiveCommitments = () => {
    const today = new Date();
    return commitments.filter(c => {
      if (!c.start_date) return false;
      const startDate = new Date(c.start_date);
      if (c.end_date) {
        const endDate = new Date(c.end_date);
        return today >= startDate && today <= endDate;
      }
      return today >= startDate;
    });
  };

  const getCommitmentStats = () => {
    const active = getActiveCommitments();
    const byType = {
      daily: active.filter(c => c.type === 'daily'),
      weekly: active.filter(c => c.type === 'weekly'),
      monthly: active.filter(c => c.type === 'monthly')
    };

    const byCategory = {};
    active.forEach(c => {
      if (!byCategory[c.category]) {
        byCategory[c.category] = { total: 0, completed: 0 };
      }
      byCategory[c.category].total++;
      if (calculateProgress(c) >= 100) {
        byCategory[c.category].completed++;
      }
    });

    return { active, byType, byCategory };
  };

  const toggleCheckInDay = (day) => {
    setFormData(prev => ({
      ...prev,
      check_in_days: prev.check_in_days.includes(day)
        ? prev.check_in_days.filter(d => d !== day)
        : [...prev.check_in_days, day]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = getCommitmentStats();
  const totalCompletionRate = stats.active.length > 0
    ? (stats.active.filter(c => calculateProgress(c) >= 100).length / stats.active.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            Commitment Tracker
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Track your promises and build consistency
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Commitment
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
              {totalCompletionRate.toFixed(0)}%
            </p>
            <Progress value={totalCompletionRate} className="h-2 mt-2 bg-white/10" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Active Commitments</p>
            <p className="text-2xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
              {stats.active.length}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">currently tracking</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Daily</p>
            <p className="text-2xl font-bold text-[#F59E0B] font-['JetBrains_Mono']">
              {stats.byType.daily.length}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">daily commitments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Best Streak</p>
            <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
              {stats.active.length > 0 ? Math.max(...stats.active.map(c => calculateStreak(c))) : 0}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">days in a row</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Commitments */}
      <div>
        <h4 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#F59E0B]" />
          Active Commitments ({stats.active.length})
        </h4>

        {stats.active.length === 0 ? (
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Active Commitments</h3>
              <p className="text-[#94A3B8] mb-4">Create your first commitment to start building consistency</p>
              <Button
                onClick={openCreateDialog}
                className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Commitment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.active.map((commitment) => {
              const type = COMMITMENT_TYPES.find(t => t.id === commitment.type);
              const category = COMMITMENT_CATEGORIES.find(c => c.id === commitment.category);
              const progress = calculateProgress(commitment);
              const streak = calculateStreak(commitment);

              return (
                <motion.div
                  key={commitment.commitment_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{category?.icon}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`bg-[${type?.color}] text-white text-xs`}>
                                {type?.icon} {type?.label}
                              </Badge>
                              <Badge className={`bg-[${category?.color}] text-white text-xs`}>
                                {category?.label}
                              </Badge>
                            </div>
                            <h5 className="text-lg font-bold text-[#F8FAFC]">{commitment.title}</h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {streak >= 7 && (
                            <Badge className="bg-[#D4AF37] text-black text-xs">
                              <Flame className="w-3 h-3 mr-1" />
                              {streak} day streak
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(commitment)}
                            className="text-[#94A3B8] hover:text-[#F8FAFC]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCommitment(commitment.commitment_id)}
                            className="text-[#94A3B8] hover:text-[#EF4444]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      {commitment.target_value && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-[#94A3B8]">Progress</p>
                            <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                              {progress.toFixed(0)}%
                            </p>
                          </div>
                          <Progress value={progress} className="h-2 bg-white/10" />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-[#94A3B8]">
                              {commitment.current_value} / {commitment.target_value}
                            </p>
                            <input
                              type="number"
                              value={commitment.current_value}
                              onChange={(e) => updateProgress(commitment.commitment_id, e.target.value)}
                              className="w-20 bg-black/50 border border-white/10 text-white text-xs rounded px-2 py-1"
                              placeholder="Update"
                            />
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {commitment.description && (
                        <p className="text-sm text-[#94A3B8] line-clamp-2 mb-4">
                          {commitment.description}
                        </p>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Started: {commitment.start_date}</span>
                        </div>
                        {commitment.end_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Ends: {commitment.end_date}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-['Playfair_Display'] text-[#D4AF37]">
              {editingCommitment ? 'Edit Commitment' : 'Create Commitment'}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Make a promise to yourself and track your consistency
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Commitment Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Exercise for 30 minutes daily"
                className="mt-1 bg-black/50 border-white/10 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What does this commitment mean to you?"
                rows={3}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm"
              />
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Type *</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  {COMMITMENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {COMMITMENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Value */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Target Value (Optional)</Label>
              <Input
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                placeholder="e.g., 30 (for minutes), 5 (for calls)"
                className="mt-1 bg-black/50 border-white/10 text-white"
              />
              <p className="text-xs text-[#94A3B8] mt-1">Leave empty for non-numeric commitments</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">End Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Reminder Time */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Daily Reminder Time</Label>
              <Input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reminder_time: e.target.value }))}
                className="mt-1 bg-black/50 border border-white/10 text-white"
              />
            </div>

            {/* Check-in Days (for daily commitments) */}
            {formData.type === 'daily' && (
              <div>
                <Label className="text-sm text-[#94A3B8]">Check-in Days</Label>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleCheckInDay(index + 1)}
                      className={`
                        p-2 rounded text-xs font-medium transition-all
                        ${formData.check_in_days.includes(index + 1)
                          ? 'bg-[#D4AF37] text-black'
                          : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'}
                      `}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveCommitment}
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{editingCommitment ? 'Update' : 'Create'} Commitment</>}
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
