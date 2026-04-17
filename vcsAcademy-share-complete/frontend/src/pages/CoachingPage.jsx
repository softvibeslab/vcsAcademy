import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Users, Video, Check, X, ChevronRight,
  Filter, TrendingUp, MessageSquare, Target, CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { cn } from '@/lib/utils';

const sessionTypeConfig = {
  group: { label: 'Group Coaching', color: 'text-blue-400 bg-blue-400/10', icon: Users },
  'q&a': { label: 'Q&A Session', color: 'text-purple-400 bg-purple-400/10', icon: MessageSquare },
  strategy_review: { label: 'Strategy Review', color: 'text-orange-400 bg-orange-400/10', icon: Target },
};

const topicTags = {
  objections: 'Objections',
  closing: 'Closing',
  discovery: 'Discovery',
  mindset: 'Mindset',
  presentation: 'Presentation',
  general: 'General',
  strategy: 'Strategy',
  roleplay: 'Role Play',
};

export default function CoachingPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API}/coaching/sessions`, { withCredentials: true });
        setSessions(response.data);
      } catch (error) {
        console.error('Coaching sessions error:', error);
        // Seed mock data if no sessions exist
        setSessions(getMockSessions());
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleRSVP = async (sessionId) => {
    setRsvpLoading(sessionId);
    try {
      await axios.post(`${API}/coaching/sessions/${sessionId}/rsvp`, {}, { withCredentials: true });
      // Update local state
      setSessions(sessions.map(s =>
        s.session_id === sessionId
          ? { ...s, attendees: [...(s.attendees || []), user.user_id] }
          : s
      ));
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setRsvpLoading(null);
    }
  };

  const handleCancelRSVP = async (sessionId) => {
    setRsvpLoading(sessionId);
    try {
      await axios.delete(`${API}/coaching/sessions/${sessionId}/rsvp`, { withCredentials: true });
      // Update local state
      setSessions(sessions.map(s =>
        s.session_id === sessionId
          ? { ...s, attendees: s.attendees?.filter(id => id !== user.user_id) || [] }
          : s
      ));
    } catch (error) {
      console.error('Cancel RSVP error:', error);
    } finally {
      setRsvpLoading(null);
    }
  };

  const now = new Date();
  const upcomingSessions = sessions
    .filter(s => new Date(s.scheduled_date) > now && s.status === 'scheduled')
    .filter(s => filterType === 'all' || s.session_type === filterType);

  const pastSessions = sessions
    .filter(s => new Date(s.scheduled_date) <= now || s.status === 'completed')
    .filter(s => filterType === 'all' || s.session_type === filterType);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate()
    };
  };

  const isRSVPed = (session) => session.attendees?.includes(user?.user_id);
  const isFull = (session) => session.max_attendees && session.attendees?.length >= session.max_attendees;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto" data-testid="coaching-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Coaching Sessions</h1>
          <p className="text-[#94A3B8]">Live group coaching, Q&A sessions, and strategy reviews with top producers</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-sm flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                <p className="text-sm text-[#94A3B8]">Upcoming Sessions</p>
              </div>
            </div>
          </div>
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-sm flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sessions.filter(s => isRSVPed(s)).length}</p>
                <p className="text-sm text-[#94A3B8]">Your RSVPs</p>
              </div>
            </div>
          </div>
          <div className="glass p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-sm flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pastSessions.filter(s => s.recording_url).length}</p>
                <p className="text-sm text-[#94A3B8]">Recordings Available</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={cn(
                  "px-3 py-1 text-sm rounded-sm transition-colors",
                  filterType === 'all'
                    ? "bg-[#D4AF37] text-black font-medium"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                )}
              >
                All Types
              </button>
              <button
                onClick={() => setFilterType('group')}
                className={cn(
                  "px-3 py-1 text-sm rounded-sm transition-colors",
                  filterType === 'group'
                    ? "bg-[#D4AF37] text-black font-medium"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                )}
              >
                Group Coaching
              </button>
              <button
                onClick={() => setFilterType('q&a')}
                className={cn(
                  "px-3 py-1 text-sm rounded-sm transition-colors",
                  filterType === 'q&a'
                    ? "bg-[#D4AF37] text-black font-medium"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                )}
              >
                Q&A Sessions
              </button>
              <button
                onClick={() => setFilterType('strategy_review')}
                className={cn(
                  "px-3 py-1 text-sm rounded-sm transition-colors",
                  filterType === 'strategy_review'
                    ? "bg-[#D4AF37] text-black font-medium"
                    : "bg-white/5 text-[#94A3B8] hover:text-white"
                )}
              >
                Strategy Reviews
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" /> Upcoming Sessions
              </h2>

              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session, i) => {
                    const { date, time, month, day } = formatDateTime(session.scheduled_date);
                    const hasRSVPed = isRSVPed(session);
                    const full = isFull(session);
                    const config = sessionTypeConfig[session.session_type] || sessionTypeConfig.group;
                    const TypeIcon = config.icon;

                    return (
                      <motion.div
                        key={session.session_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="glass p-6 hover:border-[#D4AF37]/30 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Date Badge */}
                          <div className="lg:w-20 flex lg:flex-col items-center lg:items-center gap-2 lg:gap-0">
                            <div className="w-16 h-16 bg-[#1E3A8A] flex flex-col items-center justify-center shrink-0">
                              <span className="text-xs text-[#94A3B8] uppercase">{month}</span>
                              <span className="text-2xl font-bold">{day}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={cn("text-xs uppercase tracking-wider px-2 py-0.5 flex items-center gap-1", config.color)}>
                                <TypeIcon className="w-3 h-3" />
                                {config.label}
                              </span>
                              {session.topics?.map(topic => (
                                <span key={topic} className="text-xs bg-white/5 text-[#94A3B8] px-2 py-0.5">
                                  {topicTags[topic] || topic}
                                </span>
                              ))}
                              {hasRSVPed && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> RSVP'd
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-xl font-semibold mb-2">{session.title}</h3>

                            <p className="text-[#94A3B8] mb-4">{session.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#94A3B8] mb-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {session.host?.name || 'Guest Coach'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {session.duration_minutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {session.attendees?.length || 0}
                                {session.max_attendees && ` / ${session.max_attendees}`} spots
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {hasRSVPed ? (
                                <>
                                  <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                                    <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold">
                                      <Video className="w-4 h-4 mr-2" /> Join Session
                                      <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  </a>
                                  <Button
                                    variant="outline"
                                    className="border-white/10 text-[#94A3B8]"
                                    onClick={() => handleCancelRSVP(session.session_id)}
                                    disabled={rsvpLoading === session.session_id}
                                  >
                                    <X className="w-4 h-4 mr-2" /> Cancel RSVP
                                  </Button>
                                </>
                              ) : full ? (
                                <Button disabled className="bg-white/10 text-[#94A3B8]">
                                  Session Full
                                </Button>
                              ) : (
                                <Button
                                  className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold"
                                  onClick={() => handleRSVP(session.session_id)}
                                  disabled={rsvpLoading === session.session_id}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  {rsvpLoading === session.session_id ? 'RSVPing...' : 'RSVP Now'}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Host Image */}
                          {session.host?.avatar_url && (
                            <div className="lg:w-32 shrink-0">
                              <img
                                src={session.host.avatar_url}
                                alt={session.host?.name}
                                className="w-full aspect-square object-cover rounded-sm"
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass p-8 text-center">
                  <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
                  <p className="text-[#94A3B8]">No upcoming sessions</p>
                  <p className="text-sm text-[#94A3B8]/70 mt-1">Check back soon for new coaching sessions</p>
                </div>
              )}
            </motion.div>

            {/* Past Sessions / Recordings */}
            {pastSessions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#94A3B8]" /> Past Sessions & Recordings
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {pastSessions.map((session, i) => {
                    const { month, day } = formatDateTime(session.scheduled_date);
                    const config = sessionTypeConfig[session.session_type] || sessionTypeConfig.group;

                    return (
                      <motion.div
                        key={session.session_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="glass p-4 hover:border-[#D4AF37]/30 transition-colors"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white/5 flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs text-[#94A3B8] uppercase">{month}</span>
                            <span className="font-bold">{day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={cn("text-xs uppercase tracking-wider", config.color)}>
                              {config.label}
                            </span>
                            <h4 className="font-medium truncate">{session.title}</h4>
                            <p className="text-sm text-[#94A3B8]">{session.host?.name}</p>
                          </div>
                          {session.recording_url ? (
                            <a href={session.recording_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="border-white/10 shrink-0">
                                <Video className="w-4 h-4" />
                              </Button>
                            </a>
                          ) : (
                            <span className="text-xs text-[#94A3B8] px-2">Recording coming soon</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

// Mock data for development
function getMockSessions() {
  return [
    {
      session_id: 'coaching_001',
      title: 'Weekly Group Coaching: Advanced Objection Handling',
      description: 'Live role-play and feedback on handling tough objections like price, timing, and "need to think about it".',
      session_type: 'group',
      scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      host: {
        name: 'Sarah Mitchell',
        bio: '15 years vacation club sales, $50M+ career sales',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
      },
      meeting_link: 'https://zoom.us/j/123456789',
      max_attendees: 50,
      attendees: [],
      topics: ['objections', 'closing', 'roleplay'],
      status: 'scheduled',
      created_at: new Date().toISOString()
    },
    {
      session_id: 'coaching_002',
      title: 'Q&A Friday: Your Questions, Real Answers',
      description: 'Open floor for any sales questions from the week. Bring your toughest scenarios.',
      session_type: 'q&a',
      scheduled_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 45,
      host: {
        name: 'Marcus Chen',
        bio: 'Sales Coach, VCSA Founder',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
      },
      meeting_link: 'https://zoom.us/j/987654321',
      topics: ['general', 'strategy'],
      attendees: [],
      status: 'scheduled',
      created_at: new Date().toISOString()
    },
    {
      session_id: 'coaching_003',
      title: 'Strategy Review: Analyzing Lost Deals',
      description: 'Deep dive into common reasons deals are lost and how to prevent them.',
      session_type: 'strategy_review',
      scheduled_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration_minutes: 60,
      host: {
        name: 'James Rodriguez',
        bio: 'VP of Sales, Premier Resorts',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      },
      topics: ['strategy', 'closing'],
      attendees: [],
      status: 'completed',
      recording_url: 'https://example.com/recording1',
      created_at: new Date().toISOString()
    }
  ];
}
