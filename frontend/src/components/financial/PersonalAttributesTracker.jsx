import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, CheckCircle2, Flame, Zap, Target, Heart,
  Brain, Shield, Sparkles, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { API } from '@/App';
import axios from 'axios';

const PERSONAL_ATTRIBUTES = [
  {
    id: 'attitude',
    name: 'ATTITUDE',
    icon: '😊',
    description: 'Maintained positive mindset throughout the day',
    points: 10,
    color: '#F59E0B'
  },
  {
    id: 'courage',
    name: 'COURAGE',
    icon: '🦁',
    description: 'Stepped out of comfort zone',
    points: 10,
    color: '#EF4444'
  },
  {
    id: 'focus',
    name: 'FOCUS',
    icon: '🎯',
    description: 'Stayed focused on goals without distractions',
    points: 10,
    color: '#3B82F6'
  },
  {
    id: 'training',
    name: 'TRAINING',
    icon: '📚',
    description: 'Completed training module or learned new skill',
    points: 15,
    color: '#8B5CF6'
  },
  {
    id: 'discipline',
    name: 'DISCIPLINE',
    icon: '⚡',
    description: 'Followed schedule and commitments perfectly',
    points: 20,
    color: '#10B981'
  },
  {
    id: 'persistence',
    name: 'PERSISTENCE',
    icon: '💪',
    description: 'Did not give up despite challenges',
    points: 15,
    color: '#EC4899'
  },
  {
    id: 'commitment',
    name: 'COMMITMENT',
    icon: '🔥',
    description: 'Fully committed to goals and took massive action',
    points: 25,
    color: '#D4AF37'
  }
];

export const PersonalAttributesTracker = ({ onUpdate }) => {
  const [todayAttributes, setTodayAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodayAttributes();
  }, []);

  const fetchTodayAttributes = async () => {
    try {
      const response = await axios.get(`${API}/financial/attributes/today`, { withCredentials: true });
      if (response.data.success) {
        setTodayAttributes(response.data.data.attributes || []);
      }
    } catch (error) {
      console.error('Error fetching today attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttribute = async (attribute) => {
    const existing = todayAttributes.find(attr => attr.attribute_type === attribute.id);
    const newState = !existing || !existing.achieved;

    setSaving(true);
    try {
      const response = await axios.post(
        `${API}/financial/attributes/daily`,
        null,
        {
          params: {
            attribute_type: attribute.id,
            achieved: newState,
            notes: newState ? notes : null
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Update local state
        if (existing) {
          setTodayAttributes(prev => prev.map(attr =>
            attr.attribute_type === attribute.id
              ? { ...attr, achieved: newState, points_earned: newState ? attribute.points : 0 }
              : attr
          ));
        } else {
          setTodayAttributes(prev => [...prev, {
            attribute_type: attribute.id,
            achieved: newState,
            points_earned: newState ? attribute.points : 0
          }]);
        }

        setNotes('');
        setDialogOpen(false);

        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error toggling attribute:', error);
    } finally {
      setSaving(false);
    }
  };

  const openAttributeDialog = (attribute) => {
    setSelectedAttribute(attribute);
    const existing = todayAttributes.find(attr => attr.attribute_type === attribute.id);
    setNotes(existing?.notes || '');
    setDialogOpen(true);
  };

  const achievedCount = todayAttributes.filter(attr => attr.achieved).length;
  const totalPoints = todayAttributes.reduce((sum, attr) => sum + (attr.points_earned || 0), 0);
  const dailyComboAchieved = achievedCount === 7;
  const dailyBonusPoints = dailyComboAchieved ? 100 : 0;
  const totalPointsWithBonus = totalPoints + dailyBonusPoints;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Combo Bonus */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#D4AF37]" />
            Personal Attributes
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Track your daily mindset achievements
          </p>
        </div>

        {dailyComboAchieved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-[#D4AF37]/20 border-2 border-[#D4AF37] px-4 py-2 rounded-full"
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div className="text-right">
              <p className="text-xs font-bold text-[#D4AF37]">DAILY COMBO!</p>
              <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">+100 BONUS</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Overview */}
      <Card className={`bg-gradient-to-br ${
        dailyComboAchieved
          ? 'from-[#D4AF37]/20 to-transparent border-[#D4AF37]/50'
          : 'from-white/5 to-transparent border-white/10'
      } border`}>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Progress Bar */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#F8FAFC]">Daily Progress</p>
                <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                  {achievedCount}/7 Attributes
                </p>
              </div>
              <Progress
                value={(achievedCount / 7) * 100}
                className="h-3 bg-white/10"
              />
              <p className="text-xs text-[#94A3B8] mt-2">
                {achievedCount < 7
                  ? `${7 - achievedCount} more to unlock Daily Combo bonus!`
                  : '🎉 All attributes achieved! +100 bonus points!'
                }
              </p>
            </div>

            {/* Points */}
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-[#94A3B8] mb-1">Base Points</p>
              <p className="text-2xl font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                {totalPoints}
              </p>
            </div>

            <div className="text-center p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
              <p className="text-sm text-[#D4AF37] mb-1">Total Today</p>
              <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                {totalPointsWithBonus}
              </p>
              {dailyBonusPoints > 0 && (
                <Badge className="mt-1 bg-[#D4AF37] text-black text-xs">
                  +{dailyBonusPoints} Bonus
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONAL_ATTRIBUTES.map((attribute, index) => {
          const achieved = todayAttributes.find(attr => attr.attribute_type === attribute.id)?.achieved || false;

          return (
            <motion.div
              key={attribute.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`
                  relative overflow-hidden transition-all cursor-pointer hover:scale-105
                  ${achieved
                    ? `bg-gradient-to-br from-[${attribute.color}]/20 to-transparent border-2 border-[${attribute.color}]`
                    : 'bg-gradient-to-br from-white/5 to-transparent border border-white/10'
                  }
                `}
                onClick={() => openAttributeDialog(attribute)}
              >
                {/* Attribute Icon & Name */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        text-4xl p-2 rounded-full
                        ${achieved ? `bg-[${attribute.color}]/30` : 'bg-white/5'}
                      `}>
                        {attribute.icon}
                      </div>
                      <div>
                        <CardTitle className={`text-lg font-bold font-['Playfair_Display'] ${
                          achieved ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'
                        }`}>
                          {attribute.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {attribute.description}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Achieved Badge */}
                    {achieved && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-[#10B981] rounded-full p-1"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </CardHeader>

                {/* Points */}
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge className={`
                      ${achieved
                        ? `bg-[${attribute.color}] text-white`
                        : 'bg-white/10 text-[#94A3B8]'
                      }
                    `}>
                      <Zap className="w-3 h-3 mr-1" />
                      +{attribute.points} pts
                    </Badge>

                    {achieved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#94A3B8] hover:text-[#EF4444]"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAttribute(attribute);
                        }}
                      >
                        Uncheck
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Shine Effect */}
                {achieved && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Notes Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-['Playfair_Display'] text-[#D4AF37] flex items-center gap-2">
              <span className="text-3xl">{selectedAttribute?.icon}</span>
              {selectedAttribute?.name}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Add notes about your achievement today
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-sm text-[#94A3B8]">Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you demonstrate this attribute today?"
                rows={4}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37]/50"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => toggleAttribute(selectedAttribute)}
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {saving ? 'Saving...' : `Mark as Achieved (+${selectedAttribute?.points} pts)`}
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
