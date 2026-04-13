import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home, TrendingUp, Target, BookOpen, Users, Calendar,
  Settings, Bell, Award, DollarSign, Clock, ChevronRight,
  Plus, Activity, Zap, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_MOBILE_DATA = {
  user: {
    name: 'Admin',
    level: 'New Rep',
    points: 1250,
    streak: 7
  },
  todayStats: {
    tours: 3,
    presentations: 2,
    closes: 0,
    revenue: 0
  },
  weeklyProgress: {
    tours: 18,
    presentations: 15,
    closes: 4,
    revenue: 48000,
    goalProgress: 72
  },
  upcomingEvents: [
    { id: 1, title: 'Group Coaching Session', time: 'Today, 3:00 PM', type: 'coaching' },
    { id: 2, title: 'Role Play Practice', time: 'Tomorrow, 10:00 AM', type: 'practice' },
    { id: 3, title: 'Training Module 5', time: 'Wed, 2:00 PM', type: 'training' }
  ],
  quickActions: [
    { id: 1, title: 'Log Tour', icon: Plus, route: '/daily-performance', color: 'green' },
    { id: 2, title: 'View Progress', icon: TrendingUp, route: '/analytics', color: 'blue' },
    { id: 3, title: 'Training', icon: BookOpen, route: '/path', color: 'purple' },
    { id: 4, title: 'Goals', icon: Target, route: '/goals', color: 'orange' }
  ],
  recentAchievements: [
    { id: 1, title: '7 Day Streak', icon: Zap, description: 'Keep it going!' },
    { id: 2, title: 'First Sale', icon: Star, description: 'Congratulations!' },
    { id: 3, title: 'Week 1 Complete', icon: Award, description: 'Great start!' }
  ]
};

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [data] = useState(DEMO_MOBILE_DATA);

  // Mobile bottom navigation
  const bottomNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'performance', icon: TrendingUp, label: 'Performance' },
    { id: 'training', icon: BookOpen, label: 'Training' },
    { id: 'coaching', icon: Users, label: 'Coaching' },
    { id: 'profile', icon: Settings, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020204] to-[#1E3A8A] text-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] p-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Good Morning!</h1>
            <p className="text-black/70 text-sm">Welcome back, {data.user.name}</p>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <Bell size={20} className="text-black" />
            </button>
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Level & Progress */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-black/70 text-xs uppercase tracking-wide">Current Level</p>
            <p className="text-black font-bold text-lg">{data.user.level}</p>
          </div>
          <div className="text-center">
            <p className="text-black/70 text-xs uppercase tracking-wide">Points</p>
            <p className="text-black font-bold text-lg">{data.user.points}</p>
          </div>
          <div className="text-right">
            <p className="text-black/70 text-xs uppercase tracking-wide">Streak</p>
            <p className="text-black font-bold text-lg flex items-center gap-1">
              <Zap size={16} className="text-orange-600" />
              {data.user.streak}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-10">
        {/* Today's Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-4"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-[#D4AF37]" />
            Today's Activity
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#F8FAFC]">{data.todayStats.tours}</p>
              <p className="text-xs text-[#94A3B8]">Tours</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#F8FAFC]">{data.todayStats.presentations}</p>
              <p className="text-xs text-[#94A3B8]">Presentations</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{data.todayStats.closes}</p>
              <p className="text-xs text-[#94A3B8]">Closes</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#D4AF37]">${data.todayStats.revenue.toLocaleString()}</p>
              <p className="text-xs text-[#94A3B8]">Revenue</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-4"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={20} className="text-[#D4AF37]" />
            Weekly Progress
          </h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#94A3B8]">Goal Progress</span>
              <span className="text-[#D4AF37] font-semibold">{data.weeklyProgress.goalProgress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data.weeklyProgress.goalProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-[#94A3B8]">Weekly Tours</span>
              <span className="text-[#F8FAFC] font-semibold">{data.weeklyProgress.tours}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-[#94A3B8]">Presentations</span>
              <span className="text-[#F8FAFC] font-semibold">{data.weeklyProgress.presentations}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-[#94A3B8]">Closes</span>
              <span className="text-green-400 font-semibold">{data.weeklyProgress.closes}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
              <span className="text-sm text-[#94A3B8]">Total Revenue</span>
              <span className="text-[#D4AF37] font-bold">${data.weeklyProgress.revenue.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.id} to={action.route}>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 active:scale-95 transition-transform">
                    <div className={`w-10 h-10 bg-${action.color}-500/20 rounded-lg flex items-center justify-center mb-2`}>
                      <Icon size={20} className={`text-${action.color}-400`} />
                    </div>
                    <p className="text-sm font-medium text-[#F8FAFC]">{action.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-4"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-[#D4AF37]" />
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {data.upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                  <Calendar size={18} className="text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">{event.title}</p>
                  <p className="text-xs text-[#94A3B8]">{event.time}</p>
                </div>
                <ChevronRight size={18} className="text-[#94A3B8]" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 mb-4"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award size={20} className="text-[#D4AF37]" />
            Recent Achievements
          </h2>
          <div className="space-y-3">
            {data.recentAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#D4AF37]/5 to-transparent rounded-lg border border-[#D4AF37]/10">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                    <Icon size={18} className="text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#F8FAFC]">{achievement.title}</p>
                    <p className="text-xs text-[#94A3B8]">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Financial Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 backdrop-blur-lg border border-[#D4AF37]/20 rounded-2xl p-5 mb-4"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-[#D4AF37]" />
            Financial Snapshot
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">This Month</span>
              <span className="text-lg font-bold text-[#D4AF37]">$12,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Projected (Month)</span>
              <span className="text-lg font-bold text-green-400">$18,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Savings Rate</span>
              <span className="text-lg font-bold text-blue-400">28%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#020204]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2">
        <div className="flex justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'text-[#D4AF37]' : 'text-[#94A3B8]'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
