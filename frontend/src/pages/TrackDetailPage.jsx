import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Check, Lock, Play, Clock, 
  BookOpen, Target, Award
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TrackDetailPage() {
  const { trackId } = useParams();
  const { user } = useAuth();
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingModule, setCompletingModule] = useState(null);

  useEffect(() => {
    fetchData();
  }, [trackId]);

  const fetchData = async () => {
    try {
      const [trackRes, progressRes] = await Promise.all([
        axios.get(`${API}/development/tracks/${trackId}`, { withCredentials: true }),
        axios.get(`${API}/development/progress`, { withCredentials: true })
      ]);
      setTrack(trackRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async (moduleId) => {
    setCompletingModule(moduleId);
    try {
      await axios.post(`${API}/development/modules/${moduleId}/complete`, {}, { withCredentials: true });
      toast.success('Module completed! +10 points');
      await fetchData();
    } catch (error) {
      toast.error('Failed to complete module');
    } finally {
      setCompletingModule(null);
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

  if (!track) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Track not found</h2>
          <Link to="/path" className="text-[#D4AF37] hover:underline">Back to Path</Link>
        </div>
      </DashboardLayout>
    );
  }

  const modulesCompleted = progress?.progress?.modules_completed || [];
  const trackProgress = progress?.progress?.tracks_progress?.[trackId] || 0;
  const completedCount = track.modules?.filter(m => modulesCompleted.includes(m.module_id)).length || 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto" data-testid="track-detail-page">
        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link to="/path" className="text-[#94A3B8] hover:text-white flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Top Producer Path
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Track {track.track_number}</p>
              <h1 className="font-serif text-3xl font-bold">{track.name}</h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl font-bold text-[#D4AF37]">{Math.round(trackProgress)}%</p>
              <p className="text-xs text-[#94A3B8]">Complete</p>
            </div>
          </div>

          <p className="text-lg text-[#94A3B8] mb-6">{track.purpose}</p>

          <div className="bg-white/5 p-4 border-l-2 border-[#D4AF37] mb-6">
            <p className="text-sm text-[#94A3B8]">
              <strong className="text-white">Outcome:</strong> {track.outcome}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-[#94A3B8]">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {completedCount} / {track.modules?.length || 0} modules
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {track.total_duration} min total
              </span>
            </div>
            <Progress value={trackProgress} className="w-32 h-2 bg-white/10" />
          </div>
        </motion.div>

        {/* Modules List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Modules</h2>
          <div className="space-y-3">
            {track.modules?.map((module, i) => {
              const isCompleted = modulesCompleted.includes(module.module_id);
              const isNext = !isCompleted && (i === 0 || modulesCompleted.includes(track.modules[i - 1]?.module_id));
              
              return (
                <motion.div
                  key={module.module_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "glass p-5 flex items-center gap-4",
                    isNext && "border-[#D4AF37]/50",
                    isCompleted && "border-green-500/30"
                  )}
                  data-testid={`module-${module.module_id}`}
                >
                  {/* Status Icon */}
                  <div className={cn(
                    "w-12 h-12 flex items-center justify-center shrink-0",
                    isCompleted ? "bg-green-500/20" : isNext ? "bg-[#D4AF37]/20" : "bg-white/5"
                  )}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className={cn(
                        "font-mono text-sm font-bold",
                        isNext ? "text-[#D4AF37]" : "text-[#94A3B8]"
                      )}>
                        {module.module_number}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium",
                      isCompleted && "text-green-400"
                    )}>
                      {module.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mt-0.5">{module.focus}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-right shrink-0">
                    <span className="text-sm text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {module.duration} min
                    </span>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="text-xs text-green-400 uppercase tracking-wider">Completed</span>
                    ) : (
                      <Button
                        size="sm"
                        className={cn(
                          isNext 
                            ? "bg-[#D4AF37] text-black hover:bg-[#B4942D]" 
                            : "bg-white/10 hover:bg-white/20"
                        )}
                        onClick={() => handleCompleteModule(module.module_id)}
                        disabled={completingModule === module.module_id}
                      >
                        {completingModule === module.module_id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" /> 
                            {isNext ? 'Start' : 'Watch'}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Track Complete CTA */}
        {trackProgress >= 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass p-6 text-center border-[#D4AF37]/50"
          >
            <Award className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">Track Complete!</h3>
            <p className="text-[#94A3B8] mb-4">
              You've mastered {track.name}. Continue your journey to Top Producer status.
            </p>
            <Link to="/path">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D]">
                Continue Path
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
