import React from 'react';
import { Calendar, Clock, Users, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventCard({ event, onClick, registered = false }) {
  const formatEventDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const eventTypeColors = {
    'group-coaching': 'bg-blue-500/20 text-blue-300',
    'roleplay': 'bg-purple-500/20 text-purple-300',
    'qa': 'bg-green-500/20 text-green-300',
    'webinar': 'bg-orange-500/20 text-orange-300',
    'live': 'bg-red-500/20 text-red-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="glass-card rounded-xl p-6 cursor-pointer hover:bg-surface-container transition-all border border-white/10 hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Calendar className="text-primary" size={20} />
        </div>
        {registered && (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
            ✓ Registered
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-on-surface mb-2">
        {event.title}
      </h3>

      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-on-surface-variant">
          <Clock size={14} className="inline mr-2" />
          {formatEventDate(event.start_time)}
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-on-surface-variant">
            <MapPin size={14} className="inline mr-2" />
            {event.location}
          </div>
        )}

        <div className="flex items-center text-sm text-on-surface-variant">
          <Users size={14} className="inline mr-2" />
          {event.attendees || 0} / {event.max_attendees || '∞'} attendees
        </div>

        {event.recording_available && (
          <div className="flex items-center text-sm text-blue-300">
            <Video size={14} className="inline mr-2" />
            Recording available
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs ${eventTypeColors[event.type] || 'bg-surface-container text-on-surface-variant'}`}>
          {event.type?.replace('-', ' ').toUpperCase() || 'EVENT'}
        </span>

        {event.instructor && (
          <span className="text-xs text-on-surface-variant">
            with {event.instructor}
          </span>
        )}
      </div>
    </motion.div>
  );
}
