import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Check, Lock, ChevronLeft, ChevronRight, 
  Clock, BookOpen, Crown, Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API}/courses/${courseId}`, { withCredentials: true });
        setCourse(response.data.course);
        setLessons(response.data.lessons);
        setCompletedLessons(response.data.completed_lessons || []);
        if (response.data.lessons.length > 0) {
          setActiveLesson(response.data.lessons[0]);
        }
      } catch (error) {
        console.error('Course error:', error);
        toast.error(error.response?.data?.detail || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleCompleteLesson = async (lessonId) => {
    try {
      await axios.post(`${API}/lessons/${lessonId}/complete`, {}, { withCredentials: true });
      setCompletedLessons([...completedLessons, lessonId]);
      toast.success('Lesson completed! +10 points');
    } catch (error) {
      toast.error('Failed to mark lesson complete');
    }
  };

  const progress = lessons.length > 0 
    ? (completedLessons.length / lessons.length) * 100 
    : 0;

  const currentIndex = lessons.findIndex(l => l.lesson_id === activeLesson?.lesson_id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const getVideoEmbed = (url) => {
    if (!url) return null;
    
    // YouTube
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Course not found</h2>
          <Link to="/courses" className="text-[#D4AF37] hover:underline">
            Back to courses
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto" data-testid="course-detail-page">
        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link to="/courses" className="text-[#94A3B8] hover:text-white flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Training Library
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass overflow-hidden"
            >
              {activeLesson ? (
                <div className="aspect-video bg-black">
                  {activeLesson.video_url ? (
                    <iframe
                      src={getVideoEmbed(activeLesson.video_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={activeLesson.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                        <p className="text-[#94A3B8]">Video coming soon</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <p className="text-[#94A3B8]">Select a lesson to begin</p>
                </div>
              )}
            </motion.div>

            {/* Lesson Info */}
            {activeLesson && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-1">
                      Lesson {currentIndex + 1} of {lessons.length}
                    </p>
                    <h2 className="font-serif text-2xl font-semibold">{activeLesson.title}</h2>
                  </div>
                  {!completedLessons.includes(activeLesson.lesson_id) ? (
                    <Button 
                      onClick={() => handleCompleteLesson(activeLesson.lesson_id)}
                      className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold shrink-0"
                      data-testid="complete-lesson-btn"
                    >
                      <Check className="w-4 h-4 mr-2" /> Mark Complete
                    </Button>
                  ) : (
                    <span className="flex items-center gap-2 text-green-500 text-sm shrink-0">
                      <Check className="w-4 h-4" /> Completed
                    </span>
                  )}
                </div>
                
                <p className="text-[#94A3B8] leading-relaxed mb-4">
                  {activeLesson.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {activeLesson.duration} min
                  </span>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  {prevLesson ? (
                    <Button 
                      variant="outline" 
                      className="border-white/10"
                      onClick={() => setActiveLesson(prevLesson)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                  ) : <div />}
                  {nextLesson && (
                    <Button 
                      className="bg-[#D4AF37] text-black hover:bg-[#B4942D]"
                      onClick={() => setActiveLesson(nextLesson)}
                    >
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Lessons List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Course Info */}
            <div className="glass p-6">
              <h3 className="font-serif text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-[#94A3B8] mb-4">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#94A3B8]">Progress</span>
                  <span className="font-mono">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm text-[#94A3B8]">
                <span>{lessons.length} lessons</span>
                <span>{completedLessons.length} completed</span>
              </div>
            </div>

            {/* Lessons */}
            <div className="glass p-4">
              <h4 className="font-medium mb-4 px-2">Course Content</h4>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {lessons.map((lesson, i) => {
                  const isActive = activeLesson?.lesson_id === lesson.lesson_id;
                  const isCompleted = completedLessons.includes(lesson.lesson_id);
                  
                  return (
                    <button
                      key={lesson.lesson_id}
                      onClick={() => setActiveLesson(lesson)}
                      className={cn(
                        "w-full text-left p-3 rounded-sm transition-colors flex items-start gap-3",
                        isActive 
                          ? "bg-[#D4AF37]/10 border-l-2 border-[#D4AF37]" 
                          : "hover:bg-white/5"
                      )}
                      data-testid={`lesson-${lesson.lesson_id}`}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs",
                        isCompleted ? "bg-green-500/20 text-green-500" : "bg-white/10 text-[#94A3B8]"
                      )}>
                        {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive && "text-[#D4AF37]"
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{lesson.duration} min</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
