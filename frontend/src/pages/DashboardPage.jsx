import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, BookOpen, Calendar, Users, Crown, 
  ChevronRight, Play, Clock, Star, TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth, API } from '@/App';
import axios from 'axios';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API}/dashboard`, { withCredentials: true });
        setDashboard(response.data);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const levelProgress = user ? ((user.points % 100) / 100) * 100 : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8" data-testid="dashboard-page">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold">
              Welcome back, <span className="text-[#D4AF37]">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-[#94A3B8] mt-1">Continue your journey to becoming a top producer</p>
          </div>
          {user?.membership !== 'vip' && (
            <Link to="/membership">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold uppercase tracking-wider text-sm gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to VIP
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Stats Grid - Bento Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Level Card */}
          <div className="col-span-2 lg:col-span-1 glass p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 vip-glow" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Current Level</p>
              <p className="font-serif text-4xl font-bold text-[#D4AF37]">{user?.level || 1}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>{user?.points || 0} pts</span>
                  <span>{(user?.level || 1) * 100} pts</span>
                </div>
                <Progress value={levelProgress} className="h-1 bg-white/10" />
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Total Points</p>
            <p className="font-mono text-3xl font-bold">{user?.points || 0}</p>
            <p className="text-xs text-[#D4AF37] mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Keep learning!
            </p>
          </div>

          {/* Completed */}
          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Lessons Done</p>
            <p className="font-mono text-3xl font-bold">{dashboard?.progress?.completed_lessons || 0}</p>
            <p className="text-xs text-[#94A3B8] mt-2">
              of {dashboard?.progress?.total_lessons || 0} total
            </p>
          </div>

          {/* Membership */}
          <div className="glass p-6">
            <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Membership</p>
            <p className="font-serif text-2xl font-bold flex items-center gap-2">
              {user?.membership === 'vip' ? (
                <>
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
                  VIP
                </>
              ) : (
                'Free'
              )}
            </p>
            {user?.membership !== 'vip' && (
              <Link to="/membership" className="text-xs text-[#D4AF37] mt-2 inline-block hover:underline">
                Upgrade now
              </Link>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold">Continue Learning</h2>
              <Link to="/courses" className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {dashboard?.recent_courses?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {dashboard.recent_courses.slice(0, 4).map((course, i) => (
                  <Link 
                    key={course.course_id} 
                    to={`/courses/${course.course_id}`}
                    className="glass group hover:border-[#D4AF37]/30 transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={course.thumbnail || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225`} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-xs uppercase tracking-wider text-[#D4AF37]">{course.category}</span>
                        <h3 className="font-medium mt-1 line-clamp-1">{course.title}</h3>
                      </div>
                      <div className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-[#D4AF37]" fill="currentColor" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass p-8 text-center">
                <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                <p className="text-[#94A3B8]">No courses available yet</p>
                <p className="text-sm text-[#94A3B8]/70 mt-1">Check back soon for new content</p>
              </div>
            )}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold">Upcoming Events</h2>
              <Link to="/events" className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {dashboard?.upcoming_events?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.upcoming_events.map((event) => (
                  <Link 
                    key={event.event_id}
                    to="/events"
                    className="glass p-4 block hover:border-[#D4AF37]/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#1E3A8A] rounded-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs text-[#94A3B8]">{new Date(event.start_time).toLocaleDateString('en', { month: 'short' })}</span>
                        <span className="font-bold">{new Date(event.start_time).getDate()}</span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-[#D4AF37]">{event.event_type}</span>
                        <h4 className="font-medium line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.start_time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass p-6 text-center">
                <Calendar className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="text-[#94A3B8] text-sm">No upcoming events</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Community Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Community Highlights</h2>
            <Link to="/community" className="text-sm text-[#D4AF37] hover:underline flex items-center gap-1">
              Join discussion <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {dashboard?.recent_posts?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboard.recent_posts.slice(0, 3).map((post) => (
                <Link 
                  key={post.post_id}
                  to="/community"
                  className="glass p-4 hover:border-[#D4AF37]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {post.user_picture ? (
                      <img src={post.user_picture} alt={post.user_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                        <span className="text-sm">{post.user_name?.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{post.user_name}</span>
                  </div>
                  <p className="text-sm text-[#94A3B8] line-clamp-3">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> {post.likes?.length || 0}
                    </span>
                    <span>{post.comments_count || 0} comments</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass p-8 text-center">
              <Users className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
              <p className="text-[#94A3B8]">No community posts yet</p>
              <Link to="/community" className="text-sm text-[#D4AF37] mt-2 inline-block hover:underline">
                Be the first to post
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
