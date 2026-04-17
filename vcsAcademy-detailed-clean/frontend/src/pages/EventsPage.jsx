import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, Video, Play, Crown,
  ExternalLink, MapPin
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API}/events`, { withCredentials: true });
        setEvents(response.data);
      } catch (error) {
        console.error('Events error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.start_time) > now);
  const pastEvents = events.filter(e => new Date(e.start_time) <= now);

  const getEventTypeColor = (type) => {
    const colors = {
      masterclass: 'text-purple-400 bg-purple-400/10',
      workshop: 'text-orange-400 bg-orange-400/10',
      interview: 'text-green-400 bg-green-400/10',
    };
    return colors[type] || 'text-[#D4AF37] bg-[#D4AF37]/10';
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate()
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto" data-testid="events-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Events</h1>
          <p className="text-[#94A3B8]">Live masterclasses, workshops, and exclusive sessions with top producers</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" /> Upcoming Events
              </h2>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event, i) => {
                    const { date, time, month, day } = formatDateTime(event.start_time);
                    const canJoin = !event.vip_only || user?.membership === 'vip';
                    
                    return (
                      <motion.div
                        key={event.event_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="glass p-6 hover:border-[#D4AF37]/30 transition-colors"
                        data-testid={`event-${event.event_id}`}
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
                              <span className={cn("text-xs uppercase tracking-wider px-2 py-0.5", getEventTypeColor(event.event_type))}>
                                {event.event_type}
                              </span>
                              {event.vip_only && (
                                <span className="flex items-center gap-1 text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5">
                                  <Crown className="w-3 h-3" /> VIP Only
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-serif text-xl font-semibold mb-2">{event.title}</h3>
                            
                            <p className="text-[#94A3B8] mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#94A3B8] mb-4">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {event.speaker}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {time}
                              </span>
                            </div>

                            {canJoin ? (
                              event.join_link ? (
                                <a href={event.join_link} target="_blank" rel="noopener noreferrer">
                                  <Button className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold">
                                    <Video className="w-4 h-4 mr-2" /> Join Event
                                    <ExternalLink className="w-3 h-3 ml-2" />
                                  </Button>
                                </a>
                              ) : (
                                <Button disabled className="bg-white/10 text-[#94A3B8]">
                                  Link coming soon
                                </Button>
                              )
                            ) : (
                              <Button 
                                variant="outline" 
                                className="border-[#D4AF37]/50 text-[#D4AF37]"
                                onClick={() => window.location.href = '/membership'}
                              >
                                <Crown className="w-4 h-4 mr-2" /> Upgrade to Join
                              </Button>
                            )}
                          </div>

                          {/* Speaker Image */}
                          {event.speaker_image && (
                            <div className="lg:w-32 shrink-0">
                              <img 
                                src={event.speaker_image} 
                                alt={event.speaker}
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
                  <p className="text-[#94A3B8]">No upcoming events scheduled</p>
                  <p className="text-sm text-[#94A3B8]/70 mt-1">Check back soon for new sessions</p>
                </div>
              )}
            </motion.div>

            {/* Past Events / Recordings */}
            {pastEvents.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#94A3B8]" /> Past Events & Recordings
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {pastEvents.map((event, i) => {
                    const { month, day } = formatDateTime(event.start_time);
                    const canWatch = !event.vip_only || user?.membership === 'vip';
                    
                    return (
                      <motion.div
                        key={event.event_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="glass p-4 hover:border-[#D4AF37]/30 transition-colors"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white/5 flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs text-[#94A3B8] uppercase">{month}</span>
                            <span className="font-bold">{day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={cn("text-xs uppercase tracking-wider", getEventTypeColor(event.event_type))}>
                              {event.event_type}
                            </span>
                            <h4 className="font-medium truncate">{event.title}</h4>
                            <p className="text-sm text-[#94A3B8]">{event.speaker}</p>
                          </div>
                          {event.recording_url && canWatch ? (
                            <a href={event.recording_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="border-white/10 shrink-0">
                                <Play className="w-4 h-4" />
                              </Button>
                            </a>
                          ) : event.vip_only && !canWatch ? (
                            <Button size="sm" variant="outline" className="border-[#D4AF37]/50 text-[#D4AF37] shrink-0">
                              <Crown className="w-4 h-4" />
                            </Button>
                          ) : null}
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
