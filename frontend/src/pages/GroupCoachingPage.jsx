import React from 'react';
import { Users, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const GroupCoachingPage = () => {
  const sessions = [
    {
      id: 1,
      title: 'Advanced Closing Techniques',
      instructor: 'John Smith',
      date: '2026-04-15',
      time: '2:00 PM EST',
      enrolled: 45,
      capacity: 50,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Handling Tough Objections',
      instructor: 'Sarah Johnson',
      date: '2026-04-18',
      time: '3:00 PM EST',
      enrolled: 32,
      capacity: 40,
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-sm p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-[#D4AF37]/10 rounded-sm">
            <Users className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#F8FAFC]">Group Live Coaching</h1>
            <p className="text-[#94A3B8] mt-1">Join live coaching sessions with top performers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm text-[#94A3B8]">Live Session</span>
              </div>

              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">{session.title}</h3>
              <p className="text-[#94A3B8] text-sm mb-4">by {session.instructor}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Date:</span>
                  <span className="text-[#F8FAFC]">{session.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Time:</span>
                  <span className="text-[#F8FAFC]">{session.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Enrolled:</span>
                  <span className="text-[#F8FAFC]">{session.enrolled}/{session.capacity}</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-[#D4AF37] text-black py-2 rounded-sm font-medium hover:bg-[#D4AF37]/80 transition-colors">
                Join Session
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GroupCoachingPage;
