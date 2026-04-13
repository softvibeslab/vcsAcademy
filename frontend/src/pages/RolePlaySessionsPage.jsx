import React from 'react';
import { MessageSquare, Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RolePlaySessionsPage = () => {
  const sessions = [
    {
      id: 1,
      title: 'Objection Handling Practice',
      scenario: 'Customer says "Too expensive"',
      duration: '15 min',
      difficulty: 'Intermediate',
      completed: false
    },
    {
      id: 2,
      title: 'Closing Techniques',
      scenario: 'Asking for the sale',
      duration: '20 min',
      difficulty: 'Advanced',
      completed: true
    },
    {
      id: 3,
      title: 'Discovery Questions',
      scenario: 'Understanding customer needs',
      duration: '10 min',
      difficulty: 'Beginner',
      completed: false
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
            <MessageSquare className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#F8FAFC]">Role Play Sessions</h1>
            <p className="text-[#94A3B8] mt-1">Practice real scenarios with AI feedback</p>
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
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  session.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {session.difficulty}
                </span>
                {session.completed && (
                  <span className="text-[#D4AF37]">✓ Completed</span>
                )}
              </div>

              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">{session.title}</h3>
              <p className="text-[#94A3B8] text-sm mb-4">{session.scenario}</p>

              <div className="flex items-center gap-4 text-sm text-[#94A3B8] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {session.duration}
                </div>
              </div>

              <button className={`w-full py-2 rounded-sm font-medium transition-colors ${
                session.completed
                  ? 'bg-white/10 text-[#94A3B8]'
                  : 'bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80'
              }`}>
                {session.completed ? 'Review' : (
                  <span className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Session
                  </span>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RolePlaySessionsPage;
