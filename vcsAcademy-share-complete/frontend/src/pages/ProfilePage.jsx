import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Crown, Trophy, BookOpen, MessageCircle,
  Calendar, Award, Settings, Camera
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/App';

const levelNames = {
  1: 'Newcomer',
  2: 'Rising Star',
  3: 'Performer',
  4: 'Top Producer',
  5: 'Legend',
};

const levelBenefits = {
  1: ['Community Access', 'Basic Training'],
  2: ['Training Recordings', 'Discussion Access'],
  3: ['Advanced Frameworks', 'Event Replays'],
  4: ['Workshop Access', 'Premium Resources'],
  5: ['Mastermind Sessions', 'Direct Mentor Access'],
};

export default function ProfilePage() {
  const { user } = useAuth();
  const levelProgress = user ? ((user.points % 100) / 100) * 100 : 0;
  const pointsToNext = user ? ((user.level || 1) * 100) - (user.points || 0) : 100;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto" data-testid="profile-page">
        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 vip-glow" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#D4AF37]"
                />
              ) : (
                <div className="w-24 h-24 bg-[#1E3A8A] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
                  <span className="font-serif text-3xl">{user?.name?.charAt(0)}</span>
                </div>
              )}
              {user?.membership === 'vip' && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-black" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="font-serif text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-[#94A3B8] mb-2">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {user?.membership === 'vip' && (
                  <span className="flex items-center gap-1 text-sm bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1">
                    <Crown className="w-3 h-3" /> VIP Member
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm bg-[#1E3A8A]/30 text-blue-400 px-3 py-1">
                  <Trophy className="w-3 h-3" /> Level {user?.level || 1} - {levelNames[user?.level || 1]}
                </span>
              </div>
            </div>

            {/* Points */}
            <div className="text-center md:text-right">
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-1">Total Points</p>
              <p className="font-mono text-3xl font-bold text-[#D4AF37]">{user?.points || 0}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Level Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6"
          >
            <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" /> Level Progress
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Level {user?.level || 1}</span>
                <span>Level {Math.min((user?.level || 1) + 1, 5)}</span>
              </div>
              <Progress value={levelProgress} className="h-3 bg-white/10" />
              <p className="text-sm text-[#94A3B8] mt-2">
                {pointsToNext > 0 ? `${pointsToNext} points to next level` : 'Max level reached!'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Current Benefits</p>
              {levelBenefits[user?.level || 1]?.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Level Roadmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6"
          >
            <h2 className="font-serif text-lg font-semibold mb-4">Level Roadmap</h2>
            
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((level) => {
                const isCurrentOrPast = level <= (user?.level || 1);
                const isCurrent = level === (user?.level || 1);
                
                return (
                  <div 
                    key={level}
                    className={`flex items-center gap-3 p-3 rounded-sm ${
                      isCurrent ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCurrentOrPast ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#94A3B8]'
                    }`}>
                      {level}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${!isCurrentOrPast && 'text-[#94A3B8]'}`}>
                        {levelNames[level]}
                      </p>
                      <p className="text-xs text-[#94A3B8]">{level * 100} points required</p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs text-[#D4AF37] uppercase tracking-wider">Current</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* How to Earn Points */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 md:col-span-2"
          >
            <h2 className="font-serif text-lg font-semibold mb-4">How to Earn Points</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, action: 'Complete a lesson', points: 10 },
                { icon: MessageCircle, action: 'Post in community', points: 5 },
                { icon: MessageCircle, action: 'Comment on a post', points: 3 },
                { icon: Calendar, action: 'Attend live event', points: 15 },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 text-center">
                  <item.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-sm mb-1">{item.action}</p>
                  <p className="font-mono text-lg text-[#D4AF37]">+{item.points} pts</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
