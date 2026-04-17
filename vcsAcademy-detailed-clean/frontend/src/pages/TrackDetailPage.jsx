import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Check, Play, Clock, 
  BookOpen, Award, Bookmark, BookmarkCheck, Lightbulb, X
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
  const [activeModule, setActiveModule] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarking, setBookmarking] = useState(null);

  useEffect(() => {
    fetchData();
  }, [trackId]);

  const fetchData = async () => {
    try {
      const [trackRes, progressRes, bookmarksRes] = await Promise.all([
        axios.get(`${API}/development/tracks/${trackId}`, { withCredentials: true }),
        axios.get(`${API}/development/progress`, { withCredentials: true }),
        axios.get(`${API}/development/bookmarks`, { withCredentials: true }).catch(() => ({ data: [] }))
      ]);
      setTrack(trackRes.data);
      setProgress(progressRes.data);
      setBookmarks(bookmarksRes.data?.map(b => b.content_id) || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load track');
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbed = (url) => {
    if (!url) return null;
    // YouTube - handle various formats
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const handleCompleteModule = async (contentId) => {
    setCompletingModule(contentId);
    try {
      const response = await axios.post(`${API}/development/content/${contentId}/complete`, {}, { withCredentials: true });
      const { points_earned, streak, stage_advanced, new_stage } = response.data;
      
      let message = `Module completed! +${points_earned} points`;
      if (streak > 1) message += ` | ${streak} day streak!`;
      if (stage_advanced) message = `Stage ${new_stage} unlocked! ${message}`;
      
      toast.success(message);
      await fetchData();
    } catch (error) {
      toast.error('Failed to complete module');
    } finally {
      setCompletingModule(null);
    }
  };

  const handleBookmark = async (contentId, tag = 'before_tour') => {
    setBookmarking(contentId);
    try {
      if (bookmarks.includes(contentId)) {
        await axios.delete(`${API}/development/bookmarks/${contentId}`, { withCredentials: true });
        setBookmarks(prev => prev.filter(id => id !== contentId));
        toast.success('Removed from Watch Later');
      } else {
        await axios.post(`${API}/development/bookmarks`, { content_id: contentId, tag }, { withCredentials: true });
        setBookmarks(prev => [...prev, contentId]);
        toast.success('Added to Watch Later');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarking(null);
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

  const contentCompleted = progress?.progress?.content_completed || [];
  const trackProgress = progress?.progress?.tracks_progress?.[trackId] || 0;
  const completedCount = track.modules?.filter(m => contentCompleted.includes(m.content_id)).length || 0;

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

        {/* Video Player with Key Move */}
        <AnimatePresence>
          {activeModule && activeModule.video_url && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass overflow-hidden mb-8"
            >
              <div className="aspect-video bg-black relative">
                <iframe
                  src={getVideoEmbed(activeModule.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeModule.title}
                />
                <button
                  onClick={() => setActiveModule(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Video Info Bar */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#D4AF37] uppercase tracking-wider">Now Playing</p>
                    <h3 className="font-medium text-lg">{activeModule.title}</h3>
                    <p className="text-sm text-[#94A3B8]">{activeModule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-[#94A3B8] hover:text-white",
                        bookmarks.includes(activeModule.content_id) && "text-[#D4AF37]"
                      )}
                      onClick={() => handleBookmark(activeModule.content_id)}
                      disabled={bookmarking === activeModule.content_id}
                    >
                      {bookmarks.includes(activeModule.content_id) ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                    {!contentCompleted.includes(activeModule.content_id) && (
                      <Button
                        size="sm"
                        className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
                        onClick={() => handleCompleteModule(activeModule.content_id)}
                        disabled={completingModule === activeModule.content_id}
                      >
                        <Check className="w-4 h-4 mr-1" /> Mark Complete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Key Move - The actionable takeaway */}
                {activeModule.key_move && (
                  <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 border-l-2 border-[#D4AF37]">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">
                          Key Move From This Lesson
                        </p>
                        <p className="text-white">
                          {activeModule.key_move}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modules List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Modules</h2>
          <div className="space-y-3">
            {track.modules?.map((module, i) => {
              const isCompleted = contentCompleted.includes(module.content_id);
              const isNext = !isCompleted && (i === 0 || contentCompleted.includes(track.modules[i - 1]?.content_id));
              const isActive = activeModule?.content_id === module.content_id;
              const hasVideo = !!module.video_url;
              const isBookmarked = bookmarks.includes(module.content_id);
              
              return (
                <motion.div
                  key={module.content_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn(
                    "glass p-5 flex items-center gap-4 cursor-pointer transition-all",
                    isActive && "border-[#D4AF37] bg-[#D4AF37]/5",
                    !isActive && isNext && "border-[#D4AF37]/50",
                    !isActive && isCompleted && "border-green-500/30",
                    !isActive && "hover:border-[#D4AF37]/30"
                  )}
                  onClick={() => hasVideo && setActiveModule(module)}
                  data-testid={`module-${module.content_id}`}
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
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "font-medium",
                        isCompleted && "text-green-400"
                      )}>
                        {module.title}
                      </h3>
                      {isBookmarked && (
                        <BookmarkCheck className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>
                    <p className="text-sm text-[#94A3B8] mt-0.5">{module.description || module.focus}</p>
                  </div>

                  {/* Duration */}
                  <div className="text-right shrink-0">
                    <span className="text-sm text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {module.duration} min
                    </span>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        isBookmarked ? "text-[#D4AF37]" : "text-[#94A3B8] hover:text-white"
                      )}
                      onClick={() => handleBookmark(module.content_id)}
                      disabled={bookmarking === module.content_id}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </Button>
                    
                    {isCompleted ? (
                      <span className="text-xs text-green-400 uppercase tracking-wider w-20 text-center">Completed</span>
                    ) : hasVideo ? (
                      <Button
                        size="sm"
                        className={cn(
                          "w-20",
                          isActive
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : isNext 
                              ? "bg-[#D4AF37] text-black hover:bg-[#B4942D]" 
                              : "bg-white/10 hover:bg-white/20"
                        )}
                        onClick={() => setActiveModule(module)}
                      >
                        <Play className="w-4 h-4 mr-1" /> 
                        {isActive ? 'Playing' : isNext ? 'Start' : 'Watch'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 w-20"
                        onClick={() => handleCompleteModule(module.content_id)}
                        disabled={completingModule === module.content_id}
                      >
                        {completingModule === module.content_id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" /> Done
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
