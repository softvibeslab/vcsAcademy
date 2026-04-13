/**
 * VCSA V2 - Coaching Hub Page
 * Events calendar with registration
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { AchievementChip, GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const CoachingHub = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Advanced Closing Workshop',
      type: 'group-coaching',
      date: 'Today',
      time: '3:00 PM EST',
      duration: '90 min',
      instructor: 'Maria Gonzalez',
      spotsAvailable: 5,
      totalSpots: 20,
      registered: false,
      recordingAvailable: false,
      description: 'Master the art of closing high-ticket vacation club memberships.'
    },
    {
      id: 2,
      title: 'Handling Price Objections - Role Play',
      type: 'roleplay',
      date: 'Tomorrow',
      time: '10:00 AM EST',
      duration: '60 min',
      instructor: 'James Wilson',
      spotsAvailable: 3,
      totalSpots: 10,
      registered: true,
      recordingAvailable: false,
      description: 'Practice handling price objections in small group scenarios.'
    },
    {
      id: 3,
      title: 'Q&A: Overcoming Call Reluctance',
      type: 'qa',
      date: 'Friday',
      time: '2:00 PM EST',
      duration: '45 min',
      instructor: 'Sarah Chen',
      spotsAvailable: null,
      totalSpots: null,
      registered: false,
      recordingAvailable: true,
      description: 'Get your questions answered about overcoming call reluctance.'
    },
    {
      id: 4,
      title: 'Weekend Warrior Intensive',
      type: 'webinar',
      date: 'Saturday',
      time: '9:00 AM EST',
      duration: '3 hours',
      instructor: 'Tony Martinez',
      spotsAvailable: 15,
      totalSpots: 50,
      registered: false,
      recordingAvailable: false,
      description: 'Full-day intensive training session for serious performers.'
    },
    {
      id: 5,
      title: 'Negotiation Mastery',
      type: 'group-coaching',
      date: 'Last Week',
      time: 'Completed',
      duration: '90 min',
      instructor: 'Maria Gonzalez',
      spotsAvailable: null,
      totalSpots: null,
      registered: true,
      recordingAvailable: true,
      description: 'Advanced negotiation techniques for top performers.'
    }
  ]);

  const [stats] = useState({
    upcomingEvents: 4,
    registeredEvents: 2,
    recordingsAvailable: 2
  });

  useEffect(() => {
    fetchCoachingData();
  }, []);

  const fetchCoachingData = async () => {
    try {
      const response = await axios.get(`${API}/api/dashboard/coaching/events`, {
        withCredentials: true
      });

      if (response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch coaching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`${API}/api/dashboard/coaching/events/${eventId}/register`, {}, {
        withCredentials: true
      });

      setEvents(events.map(event =>
        event.id === eventId
          ? { ...event, registered: true }
          : event
      ));
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !event.description.includes('Last Week');
    if (filter === 'registered') return event.registered;
    if (filter === 'recordings') return event.recordingAvailable;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131317] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'group-coaching': return 'groups';
      case 'roleplay': return 'theater_comedy';
      case 'qa': return 'question_answer';
      case 'webinar': return 'cast_for_education';
      default: return 'event';
    }
  };

  const getEventVariant = (type) => {
    switch (type) {
      case 'group-coaching': return 'secondary';
      case 'roleplay': return 'default';
      case 'qa': return 'success';
      case 'webinar': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] pb-32">
      <TopAppBar title="The Vault" subtitle="Coaching Hub" />

      <main className="pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#e5e1e8] font-headline leading-tight mb-4">
            Elevate Your <span className="text-[#f2ca50]">Game</span>
          </h1>
          <p className="text-[#d0c5af] text-lg max-w-2xl">
            Connect with industry experts, practice your skills in real scenarios, and get personalized feedback to accelerate your growth.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#f2ca50] text-3xl mb-3">event</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.upcomingEvents}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Upcoming Events</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#9db2ff] text-3xl mb-3">how_to_reg</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.registeredEvents}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Registered</div>
          </GlassCard>

          <GlassCard variant="default" padding="lg">
            <span className="material-symbols-outlined text-[#c3cee6] text-3xl mb-3">play_circle</span>
            <div className="text-4xl font-bold text-[#e5e1e8] font-headline mb-1">{stats.recordingsAvailable}</div>
            <div className="text-sm text-[#d0c5af] uppercase tracking-wider">Recordings</div>
          </GlassCard>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {['all', 'upcoming', 'registered', 'recordings'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all ${
                filter === filterType
                  ? 'achievement-gradient text-[#3c2f00]'
                  : 'bg-[#1b1b20] text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <GlassCard
              key={event.id}
              variant="default"
              padding="lg"
              className="hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
                    {getEventIcon(event.type)}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#e5e1e8] font-headline">
                      {event.title}
                    </h3>
                    <AchievementChip
                      label={event.type.replace('-', ' ')}
                      variant={getEventVariant(event.type)}
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[#d0c5af] text-sm mb-4">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#e5e1e8]">
                  <span className="material-symbols-outlined text-[#d0c5af] text-lg">calendar_today</span>
                  <span>{event.date}</span>
                  <span className="text-[#d0c5af]">•</span>
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#e5e1e8]">
                  <span className="material-symbols-outlined text-[#d0c5af] text-lg">schedule</span>
                  <span>{event.duration}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#e5e1e8]">
                  <span className="material-symbols-outlined text-[#d0c5af] text-lg">person</span>
                  <span>{event.instructor}</span>
                </div>

                {event.spotsAvailable !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[#d0c5af] text-lg">group</span>
                    <span className={event.spotsAvailable <= 5 ? 'text-[#f2ca50] font-bold' : 'text-[#e5e1e8]'}>
                      {event.spotsAvailable} spots left
                    </span>
                  </div>
                )}

                {event.recordingAvailable && (
                  <div className="flex items-center gap-2 text-sm text-[#9db2ff]">
                    <span className="material-symbols-outlined text-lg">play_circle</span>
                    <span>Recording Available</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!event.description.includes('Last Week') && !event.registered ? (
                  <button
                    onClick={() => handleRegister(event.id)}
                    className="flex-1 achievement-gradient text-[#3c2f00] font-bold py-3 px-6 rounded-lg hover:scale-[1.02] transition-transform"
                  >
                    Register Now
                  </button>
                ) : event.registered ? (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-[#264191]/20 text-[#9db2ff] py-3 px-6 rounded-lg border border-[#264191]/30">
                    <span className="material-symbols-outlined text-sm filled">check_circle</span>
                    Registered
                  </div>
                ) : (
                  <button className="flex-1 bg-[#1b1b20] text-[#e5e1e8] py-3 px-6 rounded-lg border border-[#4d4635]/10 hover:border-[#f2ca50]/30 transition-colors">
                    Watch Recording
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoachingHub;
