import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, BookOpen, Calendar, Download, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_BG = "https://images.unsplash.com/photo-1762254794468-1fb6fa893f73?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB0cm9waWNhbCUyMHJlc29ydCUyMHN1bnNldCUyMGluZmluaXR5JTIwcG9vbHxlbnwwfHx8fDE3NzI5NzYxOTR8MA&ixlib=rb-4.1.0&q=85";

const features = [
  { icon: BookOpen, title: "Structured Training", desc: "Step-by-step courses designed by top producers" },
  { icon: Users, title: "Elite Community", desc: "Connect with industry leaders and top performers" },
  { icon: Calendar, title: "Live Masterclasses", desc: "Weekly sessions with sales legends" },
  { icon: Download, title: "Proven Scripts", desc: "Battle-tested frameworks and templates" },
  { icon: Trophy, title: "Level Up System", desc: "Unlock content as you progress" },
  { icon: Play, title: "Video Library", desc: "Complete training system" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020204] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-gold flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold tracking-tight leading-tight">Vacation Club</span>
              <span className="text-xs text-[#D4AF37] uppercase tracking-widest">Sales Academy</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-[#94A3B8] hover:text-white"
              onClick={() => navigate('/login')}
              data-testid="nav-login-btn"
            >
              Login
            </Button>
            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-semibold uppercase tracking-wider text-sm px-6"
              onClick={() => navigate('/register')}
              data-testid="nav-join-btn"
            >
              Join Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Luxury Resort" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020204] via-[#020204]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-[#020204]/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4 font-medium">
              The Premier Sales Academy
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
              Become a <br />
              <span className="text-[#D4AF37]">Top Producer</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed mb-10 max-w-xl">
              Master the art of vacation club sales. Join the elite community of high performers 
              who consistently close deals and build wealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider text-sm h-14 px-10 glow-gold"
                onClick={() => navigate('/register')}
                data-testid="hero-start-btn"
              >
                Start Your Journey
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-[#D4AF37]/50 font-medium h-14 px-8"
                onClick={() => navigate('/login')}
                data-testid="hero-login-btn"
              >
                Member Login
              </Button>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4">What You Get</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight max-w-xl">
              Everything you need to dominate
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 group hover:border-[#D4AF37]/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Membership</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              Invest in your success
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Standard - Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-8"
            >
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Standard</p>
              <p className="font-serif text-4xl font-bold mb-2">Free</p>
              <p className="text-[#94A3B8] mb-6">Get started with the essentials</p>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "Community access",
                  "(Part 1) Front-to-Back Roadmap",
                  "AI-curated scripts",
                  "Selected recordings",
                  "Best Concept pitch ever!",
                  "Private 1-on-1 Strategy Call"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-12 border-white/20 hover:border-[#D4AF37]/50"
                onClick={() => navigate('/register')}
                data-testid="pricing-standard-btn"
              >
                Get Started Free
              </Button>
            </motion.div>

            {/* Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative glass p-8 border-[#D4AF37]/30"
            >
              <div className="absolute -top-4 right-6 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-1">
                Most Popular
              </div>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Premium</p>
              <p className="font-serif text-4xl font-bold mb-2">$19<span className="text-lg font-normal text-[#94A3B8]">/mo</span></p>
              <p className="text-[#94A3B8] mb-6">Everything in Standard, plus:</p>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "The FULL Front-to-Back Roadmap",
                  "ALL Interview Recordings (Road to the Vacation Club Sales Summit)",
                  "Private 1-on-1 VIP Coaching",
                  "VIP Weekly live private group coaching call",
                  "Front to Back Roadmap PlayBook",
                  "The Members Front to Back Roadmap",
                  "Invite to VIP Events"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-12 bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider glow-gold"
                onClick={() => navigate('/register')}
                data-testid="pricing-premium-btn"
              >
                Go Premium
              </Button>
            </motion.div>

            {/* VIP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-8 bg-gradient-to-b from-[#D4AF37]/5 to-transparent"
            >
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">VIP</p>
              <p className="font-serif text-4xl font-bold mb-2">$299<span className="text-lg font-normal text-[#94A3B8]">/mo</span></p>
              <p className="text-[#94A3B8] mb-6">Everything in Premium, plus:</p>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  "UNLIMITED VIP (1 on 1 Private Coaching)",
                  "Master Closer Secrets (VIP Call)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-12 bg-white/10 hover:bg-white/20 font-bold uppercase tracking-wider"
                onClick={() => navigate('/register')}
                data-testid="pricing-vip-btn"
              >
                Become VIP
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1758778689622-b756560264ef?w=1920" 
            alt="Ocean" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-[#020204]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ready to become a <span className="text-[#D4AF37]">top producer</span>?
          </h2>
          <p className="text-lg text-[#94A3B8] mb-10">
            Join thousands of sales professionals who have transformed their careers with VCSA.
          </p>
          <Button 
            size="lg"
            className="bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider text-sm h-14 px-12 glow-gold"
            onClick={() => navigate('/register')}
            data-testid="cta-join-btn"
          >
            Start Today
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-gold flex items-center justify-center">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <span className="font-serif font-semibold">Vacation Club Sales Academy</span>
          </div>
          <p className="text-sm text-[#94A3B8]">
            &copy; {new Date().getFullYear()} Vacation Club Sales Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
