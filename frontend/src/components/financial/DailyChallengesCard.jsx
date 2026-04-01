import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Target, TrendingUp, Award, CheckCircle2,
  Clock, Flame, Star, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { API } from '@/App';
import axios from 'axios';

const DAILY_CHALLENGES = {
  0: { // Monday
    type: 'monday_focus',
    name: 'Monday Focus Challenge',
    icon: '🎯',
    description: 'Completa 3 tareas sin distracciones',
    points: 25,
    color: '#3B82F6',
    tasks: ['Task 1: Focus on top priority', 'Task 2: No social media for 2 hours', 'Task 3: Complete 1 sales module']
  },
  1: { // Tuesday
    type: 'tuesday_courage',
    name: 'Tuesday Courage Challenge',
    icon: '🦁',
    description: 'Llama a 5 leads cold',
    points: 25,
    color: '#EF4444',
    tasks: ['Call 1st cold lead', 'Call 2nd cold lead', 'Call 3rd cold lead', 'Call 4th cold lead', 'Call 5th cold lead']
  },
  2: { // Wednesday
    type: 'wednesday_training',
    name: 'Wednesday Training Challenge',
    icon: '📚',
    description: 'Completa 1 módulo de training',
    points: 25,
    color: '#8B5CF6',
    tasks: ['Watch training video', 'Take notes', 'Apply learning', 'Pass quiz']
  },
  3: { // Thursday
    type: 'thursday_discipline',
    name: 'Thursday Discipline Challenge',
    icon: '⚡',
    description: 'Sigue tu schedule perfectamente',
    points: 25,
    color: '#10B981',
    tasks: ['Wake up on time', 'Follow morning routine', 'Complete all scheduled tasks', 'End day reflection']
  },
  4: { // Friday
    type: 'friday_persistence',
    name: 'Friday Persistence Challenge',
    icon: '💪',
    description: 'No te rindas hasta lograr tu meta',
    points: 25,
    color: '#EC4899',
    tasks: ['Set daily goal', 'Push through obstacles', 'Stay motivated', 'Achieve goal']
  }
};

const WEEKLY_CHALLENGE = {
  type: 'weekly_commitment',
  name: 'Weekly Commitment Challenge',
  icon: '🔥',
  description: 'Cumple todos tus compromisos semanales',
  points: 50,
  color: '#D4AF37',
  tasks: ['Complete all daily challenges', 'Log sales daily', 'Track all attributes', 'Hit weekly target']
};

export const DailyChallengesCard = ({ onUpdate }) => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  [dialogOpen, setDialogOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActiveChallenges();
  }, []);

  const fetchActiveChallenges = async () => {
    try {
      const response = await axios.get(`${API}/financial/challenges/active`, { withCredentials: true });
      if (response.data.success) {
        setActiveChallenges(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching active challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayChallenge = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Weekend: No daily challenge
    if (today === 0 || today === 6) {
      return null;
    }

    // Map weekday (0-4) to challenges (0-4)
    const challengeKey = today === 0 ? 4 : today - 1;
    return DAILY_CHALLENGES[challengeKey];
  };

  const openChallengeDialog = (challenge) => {
    const existing = activeChallenges.find(ch => ch.challenge_type === challenge.type);

    setSelectedChallenge(challenge);
    setCompletedTasks(existing?.completed_tasks || 0);
    setNotes(existing?.notes || '');
    setDialogOpen(true);
  };

  const completeChallenge = async () => {
    if (!selectedChallenge) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API}/financial/challenges/complete`,
        null,
        {
          params: {
            challenge_type: selectedChallenge.type,
            target_tasks: selectedChallenge.tasks.length,
            completed_tasks: completedTasks,
            notes: notes
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // Update local state
        const existing = activeChallenges.find(ch => ch.challenge_type === selectedChallenge.type);

        if (existing) {
          setActiveChallenges(prev => prev.map(ch =>
            ch.challenge_type === selectedChallenge.type
              ? { ...ch, completed_tasks: completedTasks, points_awarded: response.data.data.points_awarded }
              : ch
          ));
        } else {
          setActiveChallenges(prev => [...prev, response.data.data]);
        }

        setDialogOpen(false);

        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const todayChallenge = getTodayChallenge();

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
            <Zap className="w-6 h-6 text-[#D4AF37]" />
            Daily Challenges
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Complete challenges to earn bonus points
          </p>
        </div>
      </div>

      {/* Today's Challenge */}
      {todayChallenge ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={`
              relative overflow-hidden border-2
              bg-gradient-to-br from-[${todayChallenge.color}]/10 to-transparent
              border-[${todayChallenge.color}]/50
            `}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{todayChallenge.icon}</div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                      {todayChallenge.name}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {todayChallenge.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`bg-[${todayChallenge.color}] text-white text-lg px-4 py-2`}>
                  <Star className="w-4 h-4 mr-1" />
                  +{todayChallenge.points} pts
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Check existing challenge */}
              {(() => {
                const existing = activeChallenges.find(ch => ch.challenge_type === todayChallenge.type);
                const isCompleted = existing?.completed;
                const progress = existing
                  ? (existing.completed_tasks / todayChallenge.tasks.length) * 100
                  : 0;

                return (
                  <div className="space-y-4">
                    {/* Tasks List */}
                    <div className="space-y-2">
                      {todayChallenge.tasks.map((task, index) => (
                        <div
                          key={index}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border
                            ${existing && existing.completed_tasks > index
                              ? `bg-[${todayChallenge.color}]/20 border-[${todayChallenge.color}]/50`
                              : 'bg-white/5 border-white/10'}
                          `}
                        >
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${existing && existing.completed_tasks > index
                              ? `bg-[${todayChallenge.color}]`
                              : 'bg-white/10'}
                          `}>
                            {existing && existing.completed_tasks > index ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-xs text-[#94A3B8]">{index + 1}</span>
                            )}
                          </div>
                          <p className="text-sm text-[#F8FAFC]">{task}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#94A3B8]">Progress</p>
                        <p className="text-sm font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                          {existing?.completed_tasks || 0}/{todayChallenge.tasks.length} tasks
                        </p>
                      </div>
                      <Progress
                        value={progress}
                        className="h-3 bg-white/10"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {!isCompleted ? (
                        <Button
                          onClick={() => openChallengeDialog(todayChallenge)}
                          className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
                        >
                          {existing && existing.completed_tasks > 0
                            ? 'Update Progress'
                            : 'Start Challenge'
                          }
                        </Button>
                      ) : (
                        <div className="flex-1 bg-[#10B981]/20 border-2 border-[#10B981] rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                            <p className="text-lg font-bold text-[#10B981]">Challenge Completed!</p>
                          </div>
                          <p className="text-sm text-[#10B981] mt-1">+{todayChallenge.points} points earned</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </CardContent>

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </Card>
        </motion.div>
      ) : (
        <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Weekend Mode</h3>
            <p className="text-[#94A3B8]">No daily challenges on weekends. Rest and recharge!</p>
          </CardContent>
        </Card>
      )}

      {/* Weekly Challenge */}
      <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border-2 border-[#D4AF37]/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{WEEKLY_CHALLENGE.icon}</div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#D4AF37] font-['Playfair_Display']">
                  {WEEKLY_CHALLENGE.name}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {WEEKLY_CHALLENGE.description}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-[#D4AF37] text-black text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-1" />
              +{WEEKLY_CHALLENGE.points} pts
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_CHALLENGE.tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <Flame className="w-5 h-5 text-[#D4AF37]" />
                <p className="text-sm text-[#F8FAFC]">{task}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => openChallengeDialog(WEEKLY_CHALLENGE)}
            className="w-full mt-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
          >
            Check Weekly Progress
          </Button>
        </CardContent>
      </Card>

      {/* Challenge Completion Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-['Playfair_Display'] text-[#D4AF37] flex items-center gap-2">
              <span className="text-3xl">{selectedChallenge?.icon}</span>
              {selectedChallenge?.name}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Update your challenge progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Tasks Completed */}
            <div>
              <Label className="text-sm text-[#94A3B8]">
                Tasks Completed: {completedTasks}/{selectedChallenge?.tasks.length}
              </Label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  type="range"
                  min="0"
                  max={selectedChallenge?.tasks.length || 5}
                  value={completedTasks}
                  onChange={(e) => setCompletedTasks(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                    {completedTasks}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you do with this challenge?"
                rows={4}
                className="mt-1 bg-black/50 border border-white/10 text-white text-sm focus:border-[#D4AF37]/50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={completeChallenge}
                disabled={submitting}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {submitting ? 'Saving...' : 'Save Progress'}
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
