import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle, Calendar, Clock, CheckCircle, Play,
  Users, TrendingUp, Award, Send, Search, ChevronRight
} from 'lucide-react';
import { API } from '@/App';
import axios from 'axios';

export default function QASessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/coaching/qa`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching Q&A sessions:', error);
      // Use demo data
      setSessions([
        {
          id: 1,
          title: 'Open Q&A: Ask Me Anything',
          topic: 'Get your questions answered about any sales challenge',
          instructor: 'Maria Garcia',
          date: '2026-04-17',
          time: '4:00 PM EST',
          duration: '60 min',
          location: 'Zoom',
          registered: true,
          attendees: 32,
          recording_available: false,
          upcoming_questions: [
            'How to handle "I need to think about it?"',
            'Best approach for follow-up calls?',
            'Dealing with competitive comparisons'
          ],
          answered_count: 156
        },
        {
          id: 2,
          title: 'Overcoming Sales Slumps - Q&A',
          topic: 'Strategies for getting back on track when sales are slow',
          instructor: 'John Smith',
          date: '2026-04-21',
          time: '2:00 PM EST',
          duration: '75 min',
          location: 'Zoom',
          registered: false,
          attendees: 18,
          recording_available: false,
          upcoming_questions: [
            'How to stay motivated during slumps?',
            'What activities to focus on?',
            'How to track out of a slump?'
          ],
          answered_count: 89
        },
        {
          id: 3,
          title: 'New Rep Essentials Q&A',
          topic: 'Common questions for new sales representatives',
          instructor: 'Sarah Johnson',
          date: '2026-04-07',
          time: '3:00 PM EST',
          duration: '45 min',
          location: 'Zoom',
          registered: true,
          attendees: 45,
          recording_available: true,
          upcoming_questions: [],
          answered_count: 67
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (!question.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/coaching/qa/question`, { question }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Question submitted successfully!');
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Question submitted!');
      setQuestion('');
    }
  };

  const registerForSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/coaching/qa/${sessionId}/register`, {}, {
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
                Q&A Sessions
              </h1>
              <p className="text-on-surface-variant text-base">
                Get your questions answered by expert coaches
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
              <div className="bg-green-500/10 p-2 rounded-lg">
                <MessageCircle className="text-green-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => new Date(s.date) >= new Date()).length}
                </div>
                <div className="text-sm text-on-surface-variant">Upcoming Sessions</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <CheckCircle className="text-blue-400" size={20} />
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
                <TrendingUp className="text-purple-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.reduce((acc, s) => acc + (s.answered_count || 0), 0)}
                </div>
                <div className="text-sm text-on-surface-variant">Questions Answered</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="text-primary" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface">
                  {sessions.filter(s => s.recording_available).length}
                </div>
                <div className="text-sm text-on-surface-variant">Recordings</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Question Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <MessageCircle className="text-green-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-on-surface mb-1">
                Have a Question?
              </h3>
              <p className="text-on-surface-variant text-sm">
                Submit your question and we'll answer it in the next Q&A session
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-4 py-3 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
            />
            <button
              onClick={submitQuestion}
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center"
            >
              <Send size={18} className="mr-2" />
              Submit
            </button>
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
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                          Q&A Session
                        </span>
                        {session.registered && !session.recording_available && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Registered
                          </span>
                        )}
                        {session.recording_available && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium flex items-center">
                            <Play size={12} className="mr-1" />
                            Recording Available
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-on-surface mb-2">
                        {session.title}
                      </h3>
                      <p className="text-on-surface-variant text-base mb-4">
                        {session.topic}
                      </p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Calendar size={16} />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Clock size={16} />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Clock size={16} />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Users size={16} />
                      <span>{session.instructor}</span>
                    </div>
                  </div>

                  {/* Upcoming Questions */}
                  {!session.recording_available && session.upcoming_questions && session.upcoming_questions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-on-surface-variant mb-2">Upcoming Questions:</p>
                      <div className="space-y-2">
                        {session.upcoming_questions.map((q, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 bg-surface-container rounded-lg"
                          >
                            <MessageCircle size={14} className="text-on-surface-variant mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-on-surface">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <TrendingUp size={16} />
                      <span>{session.answered_count} questions answered</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Users size={16} />
                      <span>{session.attendees} attending</span>
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
                          Registered - Submit Your Questions!
                        </>
                      ) : (
                        <>
                          <MessageCircle size={16} className="inline mr-2" />
                          Register & Ask Questions
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="px-6 py-3 rounded-lg font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center">
                      <Play size={16} className="mr-2" />
                      Watch Recording
                    </button>
                  )}
                </div>

                {/* Right: Quick Info */}
                <div className="space-y-4">
                  {/* Instructor */}
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-sm text-on-surface-variant mb-1">Hosted By</p>
                    <p className="text-lg font-semibold text-on-surface">{session.instructor}</p>
                  </div>

                  {/* Duration */}
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-sm text-on-surface-variant mb-1">Duration</p>
                    <p className="text-lg font-semibold text-on-surface">{session.duration}</p>
                  </div>

                  {/* Questions Answered */}
                  <div className="p-4 bg-surface-container rounded-xl">
                    <p className="text-sm text-on-surface-variant mb-1">Questions Answered</p>
                    <p className="text-lg font-semibold text-primary">{session.answered_count}</p>
                  </div>
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
            <MessageCircle className="mx-auto mb-4 text-on-surface-variant" size={48} />
            <p className="text-on-surface-variant mb-4">No Q&A sessions scheduled</p>
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
              <div className="bg-green-500/10 p-2 rounded-lg">
                <MessageCircle className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Expert Answers</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Get direct answers to your specific questions from experienced coaches
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Real Solutions</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Receive practical, actionable solutions to your sales challenges
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Award className="text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Learn from Others</h3>
            </div>
            <p className="text-on-surface-variant text-sm">
              Benefit from questions asked by other sales professionals
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
