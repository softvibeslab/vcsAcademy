import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, Video, CheckCircle,
  Filter, Search, ChevronRight
} from 'lucide-react';
import { EventCard } from '@/components/shared';
import { API } from '@/App';
import axios from 'axios';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, registered, past
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/coaching/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Use demo data
      setEvents([
        {
          id: 1,
          title: 'Advanced Closing Techniques Masterclass',
          date: '2026-04-15',
          time: '2:00 PM EST',
          location: 'Zoom',
          type: 'group-coaching',
          instructor: 'Maria Garcia',
          registered: true,
          attendees: 45,
          recording_available: false,
          description: 'Learn advanced closing techniques used by top producers'
        },
        {
          id: 2,
          title: 'Role Play: Handling Price Objections',
          date: '2026-04-16',
          time: '3:00 PM EST',
          location: 'Zoom',
          type: 'roleplay',
          instructor: 'John Smith',
          registered: false,
          attendees: 20,
          max_attendees: 30,
          recording_available: false,
          description: 'Practice handling price objections in real-time scenarios'
        },
        {
          id: 3,
          title: 'Q&A Session: Overcoming Sales Slumps',
          date: '2026-04-10',
          time: '4:00 PM EST',
          location: 'Zoom',
          type: 'qa',
          instructor: 'Sarah Johnson',
          registered: true,
          attendees: 60,
          recording_available: true,
          description: 'Get your questions answered about overcoming sales slumps'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/coaching/events/${eventId}/register`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Refresh events
      fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                         event.instructor?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'upcoming' && new Date(event.date) >= new Date()) ||
                         (filter === 'registered' && event.registered) ||
                         (filter === 'past' && new Date(event.date) < new Date());
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;
  const registeredCount = events.filter(e => e.registered).length;

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
                Events Calendar
              </h1>
              <p className="text-on-surface-variant text-base">
                Join live coaching sessions and connect with the community
              </p>
            </div>
            <Link
              to="/coaching"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-all"
            >
              Back to Coaching
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="text-2xl font-bold text-primary">{events.length}</div>
              <div className="text-sm text-on-surface-variant">Total Events</div>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="text-2xl font-bold text-green-400">{upcomingCount}</div>
              <div className="text-sm text-on-surface-variant">Upcoming</div>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{registeredCount}</div>
              <div className="text-sm text-on-surface-variant">Registered</div>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <div className="text-2xl font-bold text-purple-400">
                {events.filter(e => e.recording_available).length}
              </div>
              <div className="text-sm text-on-surface-variant">Recordings</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={18} />
              <input
                type="text"
                placeholder="Search events or instructors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container text-on-surface rounded-lg border border-white/10 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {['all', 'upcoming', 'registered', 'past'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              <EventCard
                event={event}
                onRegister={() => registerForEvent(event.id)}
              />
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass-card rounded-xl"
          >
            <Calendar className="mx-auto mb-4 text-on-surface-variant" size={48} />
            <p className="text-on-surface-variant mb-4">No events found</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            to="/coaching/group"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-all">
                <Users className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Group Coaching</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Join live group sessions</p>
          </Link>

          <Link
            to="/coaching/roleplay"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/10 p-2 rounded-lg group-hover:bg-purple-500/20 transition-all">
                <Video className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Role Play Sessions</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Practice with peers</p>
          </Link>

          <Link
            to="/coaching/qa"
            className="glass-card rounded-xl p-6 hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/10 p-2 rounded-lg group-hover:bg-green-500/20 transition-all">
                <Calendar className="text-green-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-on-surface">Q&A Sessions</h3>
            </div>
            <p className="text-on-surface-variant text-sm">Get your questions answered</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
