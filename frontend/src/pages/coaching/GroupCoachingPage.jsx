import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Calendar, Clock, Video, CheckCircle, Star,
  TrendingUp, Target, Award, Play, ChevronRight
} from 'lucide-react';
import { EventCard } from '@/components/shared';
import { API } from '@/App';
import axios from 'axios';

export default function GroupCoachingPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingTab, setUpcomingTab] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/coaching/group`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching group coaching sessions:', error);
      // Use demo data
      setSessions([
        {
          id: 1,
          title: 'Advanced Closing Techniques',
          description: 'Master the art of closing with proven techniques from top producers',
          instructor: 'Maria Garcia',
          date: '2026-04-15',
          time: '2:00 PM EST',
          duration: '90 min',
          location: 'Zoom',
          registered: true,
          attendees: 45,
          max_attendees: 100,
          recording_available: false,
          topics: ['Handling objections', 'Closing techniques', 'Follow-up strategies'],
          rating: 4.9
        },
        {
          id: 2,
          title: 'Value Architecture Deep Dive',
          description: 'Learn how to build irresistible value propositions',
          instructor: 'John Smith',
          date: '2026-04-18',
          time: '3:00 PM EST',
          duration: '60 min',
          location: 'Zoom',
          registered: false,
          attendees: 28,
          max_attendees: 50,
          recording_available: false,
          topics: ['Value presentation', 'Benefit stacking', 'Price anchoring'],
          rating: 4.8
        },
        {
          id: 3,
          title: 'Mindset & Motivation Monday',
          description: 'Start your week with powerful mindset strategies',
          instructor: 'Sarah Johnson',
          date: '2026-04-08',
          time: '9:00 AM EST',
          duration: '45 min',
          location: 'Zoom',
          registered: true,
          attendees: 85,
          recording_available: true,
          topics: ['Goal setting', 'Morning routine', 'Success habits'],
          rating: 4.7
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerForSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/coaching/group/${sessionId}/register`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchSessions();
    } catch (error) {
      console.error('Error registering for session:', error);
    }
  };

  const filteredSessions = sessions.filter(session =>
    upcomingTab ? new Date(session.date) >= new Date() : session.recording_available
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Group Live Coaching
              </h1>
              <p className="text-on-surface-variant text-base">
                Learn from top producers in interactive live sessions
              </p>
            </div>
            <Link
              to="/coaching"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all"
            >
              Back to Coaching
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Users className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => new Date(s.date) >= new Date()).length}
                </div>
                <div className="text-sm text-on-surface-variant">Upcoming Sessions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => s.registered).length}
                </div>
                <div className="text-sm text-on-surface-variant">Registered</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Video className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => s.recording_available).length}
                </div>
                <div className="text-sm text-on-surface-variant">Recordings</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Star className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {(sessions.reduce((acc, s) => acc + (s.rating || 0), 0) / sessions.length || 0).toFixed(1)}
                </div>
                <div className="text-sm text-on-surface-variant">Avg Rating</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setUpcomingTab(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              upcomingTab
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setUpcomingTab(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              !upcomingTab
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
            }`}
          >
            Recordings
          </button>
        </motion.div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30"
            >
              {/* Session Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                      Group Coaching
                    </span>
                    {session.registered && !session.recording_available && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Registered
                      </span>
                    )}
                    {session.recording_available && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium flex items-center">
                        <Video size={12} className="mr-1" />
                        Recording
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">
                    {session.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-3">
                    {session.description}
                  </p>
                </div>
                {session.rating && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="text-sm font-medium text-primary">{session.rating}</span>
                  </div>
                )}
              </div>

              {/* Session Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Calendar size={16} />
                  <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  <Clock size={16} className="ml-2" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Users size={16} />
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Clock size={16} />
                  <span>{session.duration}</span>
                  <span className="ml-auto">
                    {session.attendees}/{session.max_attendees} attending
                  </span>
                </div>
              </div>

              {/* Topics */}
              {session.topics && session.topics.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!session.recording_available ? (
                <button
                  onClick={() => registerForSession(session.id)}
                  disabled={session.registered}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    session.registered
                      ? 'bg-green-500/20 text-green-300 cursor-default'
                      : 'bg-primary text-on-primary hover:bg-primary/90'
                  }`}
                >
                  {session.registered ? (
                    <>
                      <CheckCircle size={16} className="inline mr-2" />
                      You're Registered
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="inline mr-2" />
                      Register Now
                    </>
                  )}
                </button>
              ) : (
                <button className="w-full py-3 rounded-lg font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center justify-center">
                  <Play size={16} className="mr-2" />
                  Watch Recording
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass-card rounded-xl"
          >
            <Users className="mx-auto mb-4 text-on-surface-variant" size={48} />
            <p className="text-on-surface-variant mb-4">
              {upcomingTab ? 'No upcoming sessions' : 'No recordings available'}
            </p>
          </motion.div>
        )}

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Target className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Live Interaction</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Get real-time feedback and answers to your questions from expert coaches
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <TrendingUp className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Proven Strategies</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Learn techniques used by top producers to close more deals consistently
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Award className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Community Learning</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Connect with peers and learn from their experiences in a supportive environment
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
