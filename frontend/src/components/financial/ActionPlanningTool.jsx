import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare, Plus, Trash2, Calendar, Clock, Target,
  TrendingUp, AlertCircle, CheckCircle2, Edit2, Save, Zap
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

const ACTION_PRIORITIES = [
  { value: 'high', label: 'High', color: '#EF4444', icon: '🔴' },
  { value: 'medium', label: 'Medium', color: '#F59E0B', icon: '🟡' },
  { value: 'low', label: 'Low', color: '#10B981', icon: '🟢' }
];

const ACTION_CATEGORIES = [
  { id: 'prospecting', label: 'Prospecting', icon: '📞', color: '#3B82F6' },
  { id: 'training', label: 'Training', icon: '📚', color: '#8B5CF6' },
  { id: 'client_followup', label: 'Client Follow-up', icon: '💬', color: '#EC4899' },
  { id: 'admin', label: 'Admin', icon: '📋', color: '#6B7280' },
  { id: 'strategy', label: 'Strategy', icon: '🎯', color: '#D4AF37' }
];

export const ActionPlanningTool = ({ onActionsUpdate }) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    due_date: '',
    estimated_time: '',
    linked_goal_id: '',
    recurring: false,
    frequency: 'once'
  });

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await axios.get(`${API}/financial/action-plan`, { withCredentials: true });
      if (response.data.success) {
        setActions(response.data.data.actions || []);
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      due_date: '',
      estimated_time: '',
      linked_goal_id: '',
      recurring: false,
      frequency: 'once'
    });
    setEditingAction(null);
    setDialogOpen(true);
  };

  const openEditDialog = (action) => {
    setFormData({
      title: action.title,
      description: action.description || '',
      category: action.category,
      priority: action.priority,
      due_date: action.due_date || '',
      estimated_time: action.estimated_time || '',
      linked_goal_id: action.linked_goal_id || '',
      recurring: action.recurring || false,
      frequency: action.frequency || 'once'
    });
    setEditingAction(action);
    setDialogOpen(true);
  };

  const saveAction = async () => {
    if (!formData.title || !formData.category) {
      return;
    }

    setSaving(true);
    try {
      const actionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        due_date: formData.due_date,
        estimated_time: formData.estimated_time,
        linked_goal_id: formData.linked_goal_id,
        recurring: formData.recurring,
        frequency: formData.frequency
      };

      if (editingAction) {
        await axios.put(
          `${API}/financial/action-plan/${editingAction.action_id}`,
          actionData,
          { withCredentials: true }
        );
        setActions(prev => prev.map(a =>
          a.action_id === editingAction.action_id ? { ...a, ...actionData } : a
        ));
      } else {
        const response = await axios.post(
          `${API}/financial/action-plan`,
          actionData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setActions(prev => [...prev, response.data.data]);
        }
      }

      setDialogOpen(false);
      if (onActionsUpdate) {
        onActionsUpdate();
      }
    } catch (error) {
      console.error('Error saving action:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (actionId) => {
    try {
      await axios.patch(
        `${API}/financial/action-plan/${actionId}/toggle`,
        { withCredentials: true }
      );
      setActions(prev => prev.map(a =>
        a.action_id === actionId ? { ...a, completed: !a.completed } : a
      ));
      if (onActionsUpdate) {
        onActionsUpdate();
      }
    } catch (error) {
      console.error('Error toggling action:', error);
    }
  };

  const deleteAction = async (actionId) => {
    try {
      await axios.delete(`${API}/financial/action-plan/${actionId}`, { withCredentials: true });
      setActions(prev => prev.filter(a => a.action_id !== actionId));
      if (onActionsUpdate) {
        onActionsUpdate();
      }
    } catch (error) {
      console.error('Error deleting action:', error);
    }
  };

  const getOverdueActions = () => {
    const today = new Date();
    return actions.filter(action => {
      if (!action.due_date || action.completed) return false;
      const dueDate = new Date(action.due_date);
      return dueDate < today;
    });
  };

  const getTodayActions = () => {
    const today = new Date().toISOString().split('T')[0];
    return actions.filter(action => action.due_date === today && !action.completed);
  };

  const getUpcomingActions = () => {
    const today = new Date();
    return actions.filter(action => {
      if (!action.due_date || action.completed) return false;
      const dueDate = new Date(action.due_date);
      return dueDate > today;
    }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  };

  const getCategoryStats = () => {
    const stats = {};
    actions.forEach(action => {
      if (!stats[action.category]) {
        stats[action.category] = { total: 0, completed: 0 };
      }
      stats[action.category].total++;
      if (action.completed) {
        stats[action.category].completed++;
      }
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const overdueActions = getOverdueActions();
  const todayActions = getTodayActions();
  const upcomingActions = getUpcomingActions();
  const categoryStats = getCategoryStats();
  const completionRate = actions.length > 0
    ? (actions.filter(a => a.completed).length / actions.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#D4AF37]" />
            Action Plan
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Strategic actions to achieve your goals
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
              {completionRate.toFixed(0)}%
            </p>
            <Progress value={completionRate} className="h-2 mt-2 bg-white/10" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#EF4444]/10 to-transparent border border-[#EF4444]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Overdue</p>
            <p className="text-2xl font-bold text-[#EF4444] font-['JetBrains_Mono']">
              {overdueActions.length}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">actions need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Today</p>
            <p className="text-2xl font-bold text-[#F59E0B] font-['JetBrains_Mono']">
              {todayActions.length}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">actions scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Total Actions</p>
            <p className="text-2xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
              {actions.length}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">active actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Actions */}
      {overdueActions.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[#EF4444] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Overdue Actions ({overdueActions.length})
          </h4>
          <div className="space-y-3">
            {overdueActions.map((action) => (
              <ActionCard
                key={action.action_id}
                action={action}
                onToggle={toggleComplete}
                onEdit={openEditDialog}
                onDelete={deleteAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Actions */}
      <div>
        <h4 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#F59E0B]" />
          Today's Actions ({todayActions.length})
        </h4>
        {todayActions.length === 0 ? (
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-2" />
              <p className="text-sm text-[#94A3B8]">No actions scheduled for today</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayActions.map((action) => (
              <ActionCard
                key={action.action_id}
                action={action}
                onToggle={toggleComplete}
                onEdit={openEditDialog}
                onDelete={deleteAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Actions */}
      <div>
        <h4 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#3B82F6]" />
          Upcoming Actions ({upcomingActions.length})
        </h4>
        {upcomingActions.length === 0 ? (
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-sm text-[#94A3B8]">No upcoming actions</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingActions.slice(0, 5).map((action) => (
              <ActionCard
                key={action.action_id}
                action={action}
                onToggle={toggleComplete}
                onEdit={openEditDialog}
                onDelete={deleteAction}
              />
            ))}
            {upcomingActions.length > 5 && (
              <Button
                variant="ghost"
                className="w-full text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                View all {upcomingActions.length} upcoming actions
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-['Playfair_Display'] text-[#D4AF37]">
              {editingAction ? 'Edit Action' : 'Create Action'}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Plan strategic actions to achieve your goals
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Action Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Call 5 cold leads today"
                className="mt-1 bg-black/50 border-white/10 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add details about this action..."
                rows={3}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm"
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {ACTION_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">Priority *</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  {ACTION_PRIORITIES.map(pri => (
                    <option key={pri.value} value={pri.value}>{pri.icon} {pri.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Estimated Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-[#94A3B8]">Estimated Time</Label>
                <Input
                  value={formData.estimated_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
                  placeholder="e.g., 30 min, 1 hour"
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Recurring */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="recurring"
                checked={formData.recurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring: checked }))}
              />
              <Label htmlFor="recurring" className="text-sm text-[#94A3B8]">
                This is a recurring action
              </Label>
            </div>

            {formData.recurring && (
              <div>
                <Label className="text-sm text-[#94A3B8]">Frequency</Label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="mt-1 w-full bg-black/50 border border-white/10 text-white rounded px-3 py-2 text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveAction}
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{editingAction ? 'Update' : 'Create'} Action</>}
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

const ActionCard = ({ action, onToggle, onEdit, onDelete }) => {
  const category = ACTION_CATEGORIES.find(c => c.id === action.category);
  const priority = ACTION_PRIORITIES.find(p => p.value === action.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden border rounded-lg transition-all
        ${action.completed
          ? 'border-[#10B981]/30 bg-[#10B981]/10 opacity-75'
          : 'border-white/10 bg-white/5 hover:border-white/20'}
      `}
    >
      <div className="flex items-start gap-4 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(action.action_id)}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
            ${action.completed
              ? 'border-[#10B981] bg-[#10B981]'
              : 'border-white/30 hover:border-[#D4AF37]'}
          `}
        >
          {action.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h5 className={`font-bold ${action.completed ? 'line-through text-[#94A3B8]' : 'text-[#F8FAFC]'}`}>
                {action.title}
              </h5>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`bg-[${category?.color}] text-white text-xs`}>
                  {category?.icon} {category?.label}
                </Badge>
                <Badge className={`bg-[${priority?.color}] text-white text-xs`}>
                  {priority?.label}
                </Badge>
                {action.due_date && (
                  <Badge className="bg-white/10 text-[#94A3B8] text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {action.due_date}
                  </Badge>
                )}
                {action.estimated_time && (
                  <Badge className="bg-white/10 text-[#94A3B8] text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {action.estimated_time}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(action)}
                className="text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(action.action_id)}
                className="text-[#94A3B8] hover:text-[#EF4444]"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {action.description && (
            <p className="text-sm text-[#94A3B8] mt-2 line-clamp-2">
              {action.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
