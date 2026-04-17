import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Target, Award, Globe, DollarSign,
  ArrowRight, CheckCircle, Zap, BarChart3, Brain,
  Rocket, Building2, Clock, Shield, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProposalPage() {
  const [activeTab, setActiveTab] = useState('comercial');

  const stats = [
    { label: 'Market Size', value: '$10B', sublabel: 'Vacation Club Sales', color: 'text-[#D4AF37]' },
    { label: 'Target CAGR', value: '8.2%', sublabel: 'Sales Training Industry', color: 'text-blue-400' },
    { label: 'Users Year 1', value: '2,000', sublabel: 'Conservative projection', color: 'text-green-400' },
    { label: 'ARR Year 5', value: '$12.6M', sublabel: 'Conservative projection', color: 'text-purple-400' },
  ];

  const stages = [
    { number: 1, name: 'New Rep', points: 150, duration: '1-2 weeks', color: 'from-blue-500 to-blue-700' },
    { number: 2, name: 'Developing Rep', points: 300, duration: '2-4 weeks', color: 'from-purple-500 to-purple-700' },
    { number: 3, name: 'Performing Rep', points: 500, duration: '4-8 weeks', color: 'from-orange-500 to-orange-700' },
    { number: 4, name: 'Top Producer', points: 750, duration: '8-12 weeks', color: 'from-[#D4AF37] to-[#B4942D]' },
  ];

  const revenueStreams = [
    { name: 'Pro Subscription', price: '$49/mes', users: 'Individual reps', icon: Users },
    { name: 'Elite Subscription', price: '$99/mes', users: 'Serious professionals', icon: Award },
    { name: 'Team License', price: '$299/mes', users: 'Up to 10 reps', icon: Building2 },
    { name: 'Enterprise', price: 'Custom', users: 'Unlimited reps', icon: Building2 },
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['FastAPI', 'Python 3.11+', 'MongoDB', 'Stripe'] },
    { category: 'Infrastructure', items: ['AWS/GCP', 'MongoDB Atlas', 'Cloudflare', 'Sentry'] },
    { category: 'AI/ML', items: ['OpenAI API', 'Voice Analysis', 'NLP', 'Recommendations'] },
  ];

  const roadmap = [
    { phase: 'Phase 1', status: 'completed', items: ['MVP Platform', '4-Stage Progression', 'Gamification', 'Community'] },
    { phase: 'Phase 2', status: 'completed', items: ['Coaching Sessions', 'RSVP System', 'Recordings'] },
    { phase: 'Phase 3', status: 'completed', items: ['Masterclasses', 'Knowledge Hub', 'Advanced Search'] },
    { phase: 'Phase 4', status: 'upcoming', items: ['AI Script Generator', 'AI Objection Coach', 'Voice Feedback'] },
    { phase: 'Phase 5', status: 'future', items: ['Manager Dashboard', 'Team Analytics', 'Benchmarking'] },
  ];

  const competitors = [
    { name: 'Gong.io', arr: '$100M+', valuation: '$2.1B', multiple: '21x' },
    { name: 'Outreach', arr: '$150M+', valuation: '$1.1B', multiple: '7.3x' },
    { name: 'Highspot', arr: '$150M+', valuation: '$2.3B', multiple: '15.3x' },
  ];

  return (
    <div className="min-h-screen bg-[#020204]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/20 via-transparent to-[#D4AF37]/10" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] uppercase tracking-wider">Investment Opportunity</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-bold mb-6">
              VCSA
              <span className="block text-[#D4AF37] mt-2">Vacation Club Sales Academy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#94A3B8] max-w-3xl mx-auto mb-8">
              The Sales Operating System for vacation club professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <button className="px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-sm hover:bg-[#B4942D] transition-colors flex items-center justify-center gap-2">
                  View Platform
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="px-8 py-4 border border-white/20 text-white rounded-sm hover:bg-white/5 transition-colors">
                Download Proposal
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className={cn("text-4xl lg:text-5xl font-bold mb-2", stat.color)}>
                  {stat.value}
                </p>
                <p className="font-semibold mb-1">{stat.label}</p>
                <p className="text-sm text-[#94A3B8]">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              The <span className="text-[#D4AF37]">Opportunity</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              $10B market with zero specialized solutions. Until now.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { title: 'Pain Point 1', desc: '60-80% annual turnover in sales teams', icon: Users },
              { title: 'Pain Point 2', desc: '6-12 month onboarding vs. our 4-8 weeks', icon: Clock },
              { title: 'Pain Point 3', desc: 'No daily tools for sales professionals', icon: Target },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 border-l-2 border-l-[#D4AF37]"
              >
                <item.icon className="w-12 h-12 text-[#D4AF37] mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[#94A3B8]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Stage Progression */}
      <section className="py-20 bg-gradient-to-b from-[#1E3A8A]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              4-Stage <span className="text-[#D4AF37]">Progression System</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              From new hire to top producer in 12 weeks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-20 rounded-sm blur-xl",
                  stage.color
                )} />
                <div className="relative glass p-6 border-t-4 border-t-[#D4AF37]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-bold text-[#D4AF37]">{stage.number}</span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">{stage.duration}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{stage.name}</h3>
                  <p className="text-sm text-[#94A3B8] mb-3">{stage.points} points</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", stage.color)}
                      style={{ width: `${(stage.points / 750) * 100}%` }}
                    />
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-[#D4AF37]">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Revenue <span className="text-[#D4AF37]">Streams</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              Diversified income streams for sustainable growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueStreams.map((stream, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 hover:border-[#D4AF37]/30 transition-all group"
              >
                <stream.icon className="w-10 h-10 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-1">{stream.name}</h3>
                <p className="text-2xl font-bold text-[#D4AF37] mb-2">{stream.price}</p>
                <p className="text-sm text-[#94A3B8]">{stream.users}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projections */}
      <section className="py-20 bg-gradient-to-b from-[#D4AF37]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              5-Year <span className="text-[#D4AF37]">Projections</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              Conservative path to $12.6M ARR
            </p>
          </motion.div>

          <div className="glass p-8 lg:p-12 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold">Year</th>
                  <th className="text-right py-4 px-4 font-semibold">Users B2C</th>
                  <th className="text-right py-4 px-4 font-semibold">MRR B2C</th>
                  <th className="text-right py-4 px-4 font-semibold">MRR Total</th>
                  <th className="text-right py-4 px-4 font-semibold">ARR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: 1, users: '2,000', mrrB2C: '$60K', mrrTotal: '$82K', arr: '$984K' },
                  { year: 2, users: '5,000', mrrB2C: '$150K', mrrTotal: '$210K', arr: '$2.5M' },
                  { year: 3, users: '12,000', mrrB2C: '$360K', mrrTotal: '$510K', arr: '$6.1M' },
                  { year: 4, users: '25,000', mrrB2C: '$750K', mrrTotal: '$1.05M', arr: '$12.6M' },
                  { year: 5, users: '50,000', mrrB2C: '$1.5M', mrrTotal: '$2.1M', arr: '$25.2M' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-semibold">{row.year}</td>
                    <td className="text-right py-4 px-4">{row.users}</td>
                    <td className="text-right py-4 px-4 text-green-400">{row.mrrB2C}</td>
                    <td className="text-right py-4 px-4 text-[#D4AF37] font-semibold">{row.mrrTotal}</td>
                    <td className="text-right py-4 px-4 font-bold">{row.arr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Modern <span className="text-[#D4AF37]">Tech Stack</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              Built for scale, performance, and developer experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6"
              >
                <h3 className="font-semibold text-lg mb-4 text-[#D4AF37]">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-gradient-to-b from-[#1E3A8A]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Development <span className="text-[#D4AF37]">Roadmap</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              Strategic rollout of features and capabilities
            </p>
          </motion.div>

          <div className="space-y-4">
            {roadmap.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 flex items-start gap-6"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                  phase.status === 'completed' && "bg-green-500/20 text-green-400",
                  phase.status === 'upcoming' && "bg-[#D4AF37]/20 text-[#D4AF37]",
                  phase.status === 'future' && "bg-white/5 text-[#94A3B8]"
                )}>
                  {phase.status === 'completed' && <CheckCircle className="w-6 h-6" />}
                  {phase.status === 'upcoming' && <Zap className="w-6 h-6" />}
                  {phase.status === 'future' && <Rocket className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{phase.phase}</h3>
                  <div className="flex flex-wrap gap-2">
                    {phase.items.map((item, j) => (
                      <span key={j} className="text-sm bg-white/5 text-[#94A3B8] px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Ask */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-8 lg:p-12 border border-[#D4AF37]/30 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] uppercase tracking-wider">Investment Opportunity</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-6">
              Seed Round: <span className="text-[#D4AF37]">$500K</span>
            </h2>
            <p className="text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto">
              Join us in building the Sales Operating System for the $10B vacation club industry.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-white/5 rounded-sm">
                <p className="text-3xl font-bold text-[#D4AF37] mb-1">10.4x</p>
                <p className="text-sm text-[#94A3B8]">ROI Year 5 (Conservative)</p>
              </div>
              <div className="p-4 bg-white/5 rounded-sm">
                <p className="text-3xl font-bold text-[#D4AF37] mb-1">$30-50M</p>
                <p className="text-sm text-[#94A3B8]">Valuation Year 5</p>
              </div>
              <div className="p-4 bg-white/5 rounded-sm">
                <p className="text-3xl font-bold text-[#D4AF37] mb-1">8:1</p>
                <p className="text-sm text-[#94A3B8]">LTV:CAC Ratio</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-sm hover:bg-[#B4942D] transition-colors">
                Schedule a Call
              </button>
              <button className="px-8 py-4 border border-white/20 text-white rounded-sm hover:bg-white/5 transition-colors">
                Download Deck
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="font-serif text-2xl font-bold text-[#D4AF37]">VCSA</p>
              <p className="text-sm text-[#94A3B8]">Vacation Club Sales Academy</p>
            </div>
            <div className="flex gap-8 text-sm text-[#94A3B8]">
              <a href="mailto:investors@vcsa.com" className="hover:text-[#D4AF37]">investors@vcsa.com</a>
              <a href="mailto:press@vcsa.com" className="hover:text-[#D4AF37]">press@vcsa.com</a>
            </div>
            <p className="text-sm text-[#94A3B8]">© 2026 VCSA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
