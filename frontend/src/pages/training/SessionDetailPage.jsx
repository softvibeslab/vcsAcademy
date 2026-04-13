import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Clock, Target, BookOpen, CheckCircle, ChevronLeft,
  Award, ArrowRight, Lock, Users, Star
} from 'lucide-react';
import { API } from '@/App';
import axios from 'axios';
import { StatCard } from '@/components/shared';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/training/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSession(response.data);
      setCompleted(response.data.completed || false);
    } catch (error) {
      console.error('Error fetching session:', error);
      // Use demo data if API fails
      setSession({
        id: sessionId,
        title: 'Session 1: Foundation of Sales Excellence',
        category: 'Mindset',
        duration: '45 min',
        difficulty: 'beginner',
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        key_takeaway: 'Adopt the champion mindset before every tour - visualize success',
        description: 'Learn the foundational principles that separate top producers from average sales representatives. This session covers the mental preparation, goal setting, and success rituals used by the top 1% of vacation club sales professionals.',
        instructor: 'Maria Garcia',
        points: 10,
        modules_count: 6,
        completed_modules: 0,
        related_sessions: [
          { id: 'session-2', title: 'Session 2: Discovery & Control', category: 'Discovery' },
          { id: 'session-3', title: 'Session 3: Value Architecture', category: 'Value' }
        ],
        resources: [
          { id: 1, title: 'Session Workbook', type: 'pdf', file_size: 2500000 },
          { id: 2, title: 'Goal Setting Template', type: 'template', file_size: 500000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/training/session/${sessionId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setCompleted(true);
    } catch (error) {
      console.error('Error marking complete:', error);
      // Demo mode - still mark as complete
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-on-surface p-8">
        <div className="text-center py-12">
          <p className="text-on-surface-variant mb-4">Session not found</p>
          <Link
            to="/training"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg"
          >
            Back to Training
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors = {
    'Mindset': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Discovery': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Value': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Closing': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Objections': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Post-Sale': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  };

  const progress = session.modules_count > 0
    ? Math.round((session.completed_modules / session.modules_count) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[session.category] || 'bg-gray-500/20 text-gray-300'}`}>
                {session.category}
              </span>
              {completed && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                  <CheckCircle size={12} className="inline mr-1" />
                  Completed
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {session.title}
          </h1>

          <p className="text-on-surface-variant text-base mb-4">
            {session.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{session.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>{session.points} points</span>
            </div>
            {session.instructor && (
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{session.instructor}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={session.video_url}
                    title={session.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </motion.div>

            {/* Key Takeaway */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6 border border-primary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Target className="text-primary" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-on-surface">Key Takeaway</h3>
              </div>
              <p className="text-on-surface text-base">
                {session.key_takeaway}
              </p>
            </motion.div>

            {/* Session Resources */}
            {session.resources && session.resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-on-surface mb-4">Session Resources</h3>
                <div className="space-y-3">
                  {session.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="glass-card rounded-lg p-4 hover:bg-surface-container transition-all border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500/10 p-2 rounded-lg">
                            <BookOpen className="text-blue-400" size={18} />
                          </div>
                          <div>
                            <p className="text-on-surface font-medium">{resource.title}</p>
                            <p className="text-on-surface-variant text-sm capitalize">{resource.type}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-primary text-on-primary rounded-lg text-sm font-medium">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mark Complete Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={markComplete}
                disabled={completed}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
                  completed
                    ? 'bg-green-500/20 text-green-300 cursor-default'
                    : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-on-primary'
                }`}
              >
                {completed ? (
                  <>
                    <CheckCircle size={20} className="inline mr-2" />
                    Session Completed!
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="inline mr-2" />
                    Mark as Complete
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-on-surface mb-4">Session Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-on-surface-variant">Modules</span>
                    <span className="text-on-surface font-medium">
                      {session.completed_modules}/{session.modules_count}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Completion</span>
                    <span className="text-2xl font-bold text-primary">{progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Sessions */}
            {session.related_sessions && session.related_sessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-on-surface mb-4">Continue Learning</h3>
                <div className="space-y-3">
                  {session.related_sessions.map((related) => (
                    <Link
                      key={related.id}
                      to={`/training/session/${related.id}`}
                      className="block p-3 rounded-lg bg-surface-container hover:bg-surface-container/80 transition-all border border-white/10 hover:border-primary/30"
                    >
                      <p className="text-on-surface font-medium text-sm mb-1">{related.title}</p>
                      <p className="text-on-surface-variant text-xs">{related.category}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-on-surface mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/dashboard/performance"
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container/80 transition-all"
                >
                  <span className="text-sm text-on-surface">Log Today's Performance</span>
                  <ArrowRight size={16} className="text-primary" />
                </Link>
                <Link
                  to="/coaching/group"
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container/80 transition-all"
                >
                  <span className="text-sm text-on-surface">Join Group Coaching</span>
                  <ArrowRight size={16} className="text-primary" />
                </Link>
                <Link
                  to="/resources"
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container/80 transition-all"
                >
                  <span className="text-sm text-on-surface">Browse Resources</span>
                  <ArrowRight size={16} className="text-primary" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
