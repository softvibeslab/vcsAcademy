import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video, Users, Calendar, Clock, CheckCircle, Play,
  Target, TrendingUp, Award, Mic, ArrowRight
} from 'lucide-react';
import { EventCard } from '@/components/shared';
import { API } from '@/App';
import axios from 'axios';

export default function RoleplayPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/coaching/roleplay`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching roleplay sessions:', error);
      // Use demo data
      setSessions([
        {
          id: 1,
          title: 'Handling Price Objections',
          scenario: 'Practice responding to "it\'s too expensive" objections using value-building techniques',
          instructor: 'Maria Garcia',
          date: '2026-04-16',
          time: '3:00 PM EST',
          duration: '60 min',
          location: 'Zoom',
          registered: true,
          attendees: 12,
          max_attendees: 20,
          level: 'intermediate',
          recording_available: false,
          skill_focus: ['Objection handling', 'Value building', 'Confidence'],
          format: 'Small group practice'
        },
        {
          id: 2,
          title: 'The Close: Role Play Intensive',
          scenario: 'Master closing techniques through repeated practice scenarios',
          instructor: 'John Smith',
          date: '2026-04-20',
          time: '2:00 PM EST',
          duration: '90 min',
          location: 'Zoom',
          registered: false,
          attendees: 8,
          max_attendees: 15,
          level: 'advanced',
          recording_available: false,
          skill_focus: ['Closing techniques', 'Timing', 'Reading the room'],
          format: '1-on-1 coaching'
        },
        {
          id: 3,
          title: 'Discovery & Qualification',
          scenario: 'Practice asking the right questions to uncover customer needs',
          instructor: 'Sarah Johnson',
          date: '2026-04-05',
          time: '11:00 AM EST',
          duration: '45 min',
          location: 'Zoom',
          registered: true,
          attendees: 15,
          recording_available: true,
          level: 'beginner',
          skill_focus: ['Active listening', 'Questioning', 'Qualification'],
          format: 'Group rotation'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerForSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/coaching/roleplay/${sessionId}/register`, {}, {
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

  const levelColors = {
    beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-300 border-red-500/30'
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
                Role Play Sessions
              </h1>
              <p className="text-on-surface-variant text-base">
                Practice your sales skills in real-time scenarios with expert feedback
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
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Video className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => new Date(s.date) >= new Date()).length}
                </div>
                <div className="text-sm text-on-surface-variant">Upcoming</div>
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
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.reduce((acc, s) => acc + (s.attendees || 0), 0)}
                </div>
                <div className="text-sm text-on-surface-variant">Total Participants</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Target className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => s.recording_available).length}
                </div>
                <div className="text-sm text-on-surface-variant">Practice Videos</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sessions List */}
        <div className="space-y-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Session Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                          Role Play
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${levelColors[session.level]}`}>
                          {session.level}
                        </span>
                        {session.registered && !session.recording_available && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Registered
                          </span>
                        )}
                        {session.recording_available && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium flex items-center">
                            <Video size={12} className="mr-1" />
                            Recording Available
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-on-surface mb-2">
                        {session.title}
                      </h3>
                      <p className="text-on-surface-variant text-base">
                        {session.scenario}
                      </p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Calendar size={16} />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Clock size={16} />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Video size={16} />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Mic size={16} />
                      <span>{session.format}</span>
                    </div>
                  </div>

                  {/* Instructor & Attendees */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Users size={16} />
                      <span>{session.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span>{session.attendees}/{session.max_attendees} spots</span>
                    </div>
                  </div>

                  {/* Skills Focus */}
                  <div className="mb-4">
                    <p className="text-sm text-on-surface-variant mb-2">Skills You'll Practice:</p>
                    <div className="flex flex-wrap gap-2">
                      {session.skill_focus.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {!session.recording_available ? (
                    <button
                      onClick={() => registerForSession(session.id)}
                      disabled={session.registered}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        session.registered
                          ? 'bg-green-500/20 text-green-300 cursor-default'
                          : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-on-primary'
                      }`}
                    >
                      {session.registered ? (
                        <>
                          <CheckCircle size={16} className="inline mr-2" />
                          You're Registered - See You There!
                        </>
                      ) : (
                        <>
                          <Target size={16} className="inline mr-2" />
                          Join This Session
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="px-6 py-3 rounded-lg font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center">
                      <Play size={16} className="mr-2" />
                      Watch Practice Session
                    </button>
                  )}
                </div>

                {/* Right: Quick Info */}
                <div className="space-y-4">
                  {/* Level Badge */}
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-sm text-on-surface-variant mb-1">Experience Level</p>
                    <p className="text-lg font-semibold text-on-surface capitalize">{session.level}</p>
                  </div>

                  {/* Format */}
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-sm text-on-surface-variant mb-1">Format</p>
                    <p className="text-lg font-semibold text-on-surface">{session.format}</p>
                  </div>

                  {/* Spots Left */}
                  {!session.recording_available && (
                    <div className="p-4 bg-surface-container rounded-xl">
                      <p className="text-sm text-on-surface-variant mb-1">Spots Available</p>
                      <p className="text-lg font-semibold text-primary">
                        {session.max_attendees - session.attendees}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass-card rounded-xl"
          >
            <Video className="mx-auto mb-4 text-on-surface-variant" size={48} />
            <p className="text-on-surface-variant mb-4">No role play sessions scheduled</p>
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
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Target className="text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Real Practice</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Practice real scenarios you'll encounter on the sales floor in a safe environment
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Expert Feedback</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Get immediate, actionable feedback from experienced coaches
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <Award className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Build Confidence</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Develop the confidence to handle any situation that comes your way
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-on-surface mb-2">
                Ready to Level Up Your Skills?
              </h3>
              <p className="text-on-surface-variant">
                Join a role play session and practice with the best
              </p>
            </div>
            <Link
              to="/training"
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center"
            >
              View Training Modules
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
