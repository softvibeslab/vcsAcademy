import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, BookOpen, Calendar, Download, ChevronRight, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_BG = "https://images.unsplash.com/photo-1762254794468-1fb6fa893f73?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB0cm9waWNhbCUyMHJlc29ydCUyMHN1bnNldCUyMGluZmluaXR5JTIwcG9vbHxlbnwwfHx8fDE3NzI5NzYxOTR8MA&ixlib=rb-4.1.0&q=85";

const features = [
  { icon: BookOpen, title: "Structured Training", desc: "Step-by-step courses designed by top producers" },
  { icon: Users, title: "Elite Community", desc: "Connect with industry leaders and top performers" },
  { icon: Calendar, title: "Live Masterclasses", desc: "Weekly sessions with sales legends" },
  { icon: Download, title: "Proven Scripts", desc: "Battle-tested frameworks and templates" },
  { icon: Trophy, title: "Level Up System", desc: "Unlock content as you progress" },
  { icon: Play, title: "Video Library", desc: "Hundreds of hours of training content" },
];

const testimonials = [
  { name: "Michael Torres", role: "Top Producer, Cancun", quote: "VCSA transformed my close rate. I went from 15% to 42% in just 3 months.", image: "https://images.unsplash.com/photo-1618371690240-e0d46eead4b8?w=150" },
  { name: "Sarah Chen", role: "Sales Director", quote: "The frameworks here are gold. My team's performance increased by 60%.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { name: "David Williams", role: "Regional Manager", quote: "Best investment I've made in my career. The community alone is worth it.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
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

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-12 left-6 right-6 z-10"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2,500+", label: "Active Members" },
              { value: "$50M+", label: "Closed by Alumni" },
              { value: "150+", label: "Training Videos" },
              { value: "98%", label: "Success Rate" },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 text-center">
                <p className="font-mono text-2xl md:text-3xl font-bold text-[#D4AF37]">{stat.value}</p>
                <p className="text-sm text-[#94A3B8] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
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

      {/* Testimonials */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 vip-glow" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Success Stories</p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight">
              From our top producers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass p-8"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="font-serif text-lg italic text-[#F1F5F9] mb-8 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-[#94A3B8]">{t.role}</p>
                  </div>
                </div>
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10"
            >
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] mb-2">Free</p>
              <p className="font-serif text-4xl font-bold mb-2">$0<span className="text-lg font-normal text-[#94A3B8]">/mo</span></p>
              <p className="text-[#94A3B8] mb-8">Get started with basics</p>
              <ul className="space-y-4 mb-10">
                {["Community Access", "Basic Training", "Weekly Newsletter"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-12 border-white/20 hover:border-[#D4AF37]/50"
                onClick={() => navigate('/register')}
                data-testid="pricing-free-btn"
              >
                Get Started Free
              </Button>
            </motion.div>

            {/* VIP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative glass p-10 border-[#D4AF37]/30"
            >
              <div className="absolute -top-4 right-6 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-1">
                Most Popular
              </div>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] mb-2">VIP Member</p>
              <p className="font-serif text-4xl font-bold mb-2">$97<span className="text-lg font-normal text-[#94A3B8]">/mo</span></p>
              <p className="text-[#94A3B8] mb-8">Full access to everything</p>
              <ul className="space-y-4 mb-10">
                {[
                  "All Free Features",
                  "Full Course Library",
                  "Live Masterclasses",
                  "Premium Scripts & Frameworks",
                  "Exclusive Workshops",
                  "Priority Support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full h-12 bg-[#D4AF37] text-black hover:bg-[#B4942D] font-bold uppercase tracking-wider glow-gold"
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
