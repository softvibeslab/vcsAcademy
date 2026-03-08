import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Zap, ChevronRight, Lock, Check,
  BookOpen, Play, Star, Flame, Shield, Search,
  ArrowRight, Clock, Award
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const stageIcons = {
  1: '01',
  2: '02', 
  3: '03',
  4: '04'
};

const badgeIcons = {
  foundation: Award,
  shield: Shield,
  target: Target,
  search: Search,
  zap: Zap,
  flame: Flame,
  trophy: Trophy
};

export default function TopProducerPath() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [stages, setStages] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, tracksRes, stagesRes, badgesRes] = await Promise.all([
        axios.get(`${API}/development/progress`, { withCredentials: true }),
        axios.get(`${API}/development/tracks`, { withCredentials: true }),
        axios.get(`${API}/development/stages`, { withCredentials: true }),
        axios.get(`${API}/development/badges`, { withCredentials: true })
      ]);
      setProgress(progressRes.data);
      setTracks(tracksRes.data);
      setStages(stagesRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
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

  const currentStage = progress?.current_stage;
  const nextAssignment = progress?.next_assignment;
  const readinessScore = progress?.readiness_score || 0;
  const trackProgress = progress?.progress?.tracks_progress || {};

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8" data-testid="top-producer-path">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Your Journey</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold">Top Producer Path</h1>
          <p className="text-[#94A3B8] mt-2">Your roadmap to becoming a consistent top producer</p>
        </motion.div>

        {/* Stage Progress + Readiness Score */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Stage Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 vip-glow opacity-50" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1">Current Stage</p>
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#D4AF37] text-black font-mono text-sm font-bold flex items-center justify-center">
                      {stageIcons[currentStage?.stage_number] || '01'}
                    </span>
                    {currentStage?.title}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#94A3B8]">Points</p>
                  <p className="font-mono text-2xl font-bold text-[#D4AF37]">{user?.points || 0}</p>
                </div>
              </div>

              <p className="text-[#94A3B8] mb-6">{currentStage?.objective}</p>

              {/* Key Skills */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Key Skills to Develop</p>
                <div className="flex flex-wrap gap-2">
                  {currentStage?.key_skills?.map((skill, i) => (
                    <span key={i} className="text-xs bg-white/5 px-3 py-1.5 border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress to Next Stage */}
              {progress?.next_stage && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#94A3B8]">Progress to {progress.next_stage.title}</span>
                    <span className="font-mono">{user?.points || 0} / {progress.next_stage.points_required} pts</span>
                  </div>
                  <Progress 
                    value={((user?.points || 0) / progress.next_stage.points_required) * 100} 
                    className="h-2 bg-white/10" 
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Readiness Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass p-6 flex flex-col"
          >
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-4">Readiness Score</p>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${readinessScore * 2.83} 283`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-3xl font-bold">{readinessScore}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Modules</span>
                <span>{progress?.stats?.modules_completed || 0} / {progress?.stats?.total_modules || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Breakdowns</span>
                <span>{progress?.stats?.breakdowns_reviewed || 0} reviewed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Quick Wins</span>
                <span>{progress?.stats?.quickwins_applied || 0} applied</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Assignment */}
        {nextAssignment && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 border-[#D4AF37]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37]">Your Next Step</p>
                <h3 className="font-serif text-lg font-semibold">
                  {nextAssignment.type === 'module' 
                    ? nextAssignment.module.title 
                    : nextAssignment.breakdown?.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                {nextAssignment.type === 'module' && (
                  <>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" /> {nextAssignment.track}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {nextAssignment.module.duration} min
                    </span>
                  </>
                )}
                {nextAssignment.type === 'breakdown' && (
                  <span className="flex items-center gap-1">
                    <Search className="w-4 h-4" /> Deal Breakdown
                  </span>
                )}
              </div>
              <Link to={nextAssignment.type === 'module' ? `/path/track/${nextAssignment.module.track_id}` : '/path/breakdowns'}>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold">
                  Start Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* 4-Stage Journey */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Your Journey</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {stages.map((stage, i) => {
              const isCurrentStage = stage.stage_number === currentStage?.stage_number;
              const isCompleted = stage.stage_number < currentStage?.stage_number;
              const isLocked = stage.stage_number > currentStage?.stage_number;
              
              return (
                <div 
                  key={stage.stage_id}
                  className={cn(
                    "glass p-5 relative",
                    isCurrentStage && "border-[#D4AF37]/50",
                    isLocked && "opacity-60"
                  )}
                >
                  {isCurrentStage && (
                    <div className="absolute -top-3 left-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-3 py-1">
                      Current
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center font-mono text-sm font-bold",
                      isCompleted ? "bg-green-500/20 text-green-400" : 
                      isCurrentStage ? "bg-[#D4AF37] text-black" : 
                      "bg-white/10 text-[#94A3B8]"
                    )}>
                      {isCompleted ? <Check className="w-5 h-5" /> : stageIcons[stage.stage_number]}
                    </div>
                    <div>
                      <p className="font-medium">{stage.title}</p>
                      <p className="text-xs text-[#94A3B8]">{stage.typical_duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2">{stage.objective}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">{stage.points_required} pts required</span>
                    {isLocked && <Lock className="w-4 h-4 text-[#94A3B8]" />}
                    {isCompleted && <Check className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 6-Track Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Training Tracks</h2>
            <p className="text-sm text-[#94A3B8]">6 tracks to mastery</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track, i) => {
              const trackProg = trackProgress[track.track_id] || 0;
              const modulesCompleted = track.modules?.filter(
                m => progress?.progress?.modules_completed?.includes(m.module_id)
              ).length || 0;
              
              return (
                <Link
                  key={track.track_id}
                  to={`/path/track/${track.track_id}`}
                  className="glass p-5 hover:border-[#D4AF37]/30 transition-colors group"
                  data-testid={`track-${track.track_id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-[#D4AF37] mb-1">Track {track.track_number}</p>
                      <h3 className="font-medium group-hover:text-[#D4AF37] transition-colors">
                        {track.name}
                      </h3>
                    </div>
                    <span className="font-mono text-sm text-[#94A3B8]">
                      {Math.round(trackProg)}%
                    </span>
                  </div>
                  
                  <Progress value={trackProg} className="h-1.5 bg-white/10 mb-3" />
                  
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>{modulesCompleted} / {track.modules?.length || 0} modules</span>
                    <span>{track.total_duration} min</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Achievement Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {badges.map((badge) => {
              const isEarned = progress?.progress?.badges_earned?.includes(badge.badge_id);
              const BadgeIcon = badgeIcons[badge.icon] || Award;
              
              return (
                <div 
                  key={badge.badge_id}
                  className={cn(
                    "glass p-4 text-center",
                    isEarned ? "border-[#D4AF37]/50" : "opacity-50"
                  )}
                  title={badge.criteria}
                >
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center",
                    isEarned ? "bg-[#D4AF37]/20" : "bg-white/5"
                  )}>
                    <BadgeIcon className={cn(
                      "w-6 h-6",
                      isEarned ? "text-[#D4AF37]" : "text-[#94A3B8]"
                    )} />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Link to="/path/breakdowns" className="glass p-6 hover:border-[#D4AF37]/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-[#D4AF37] transition-colors">Real Deal Breakdowns</h3>
                <p className="text-sm text-[#94A3B8]">Learn from real sales scenarios</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </Link>
          
          <Link to="/path/quickwins" className="glass p-6 hover:border-[#D4AF37]/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-[#D4AF37] transition-colors">Quick Wins Library</h3>
                <p className="text-sm text-[#94A3B8]">Tactical tips for the floor</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
