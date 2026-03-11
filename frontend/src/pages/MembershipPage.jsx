import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Check, Zap, BookOpen, Video, 
  Download, Users, Sparkles, Shield
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Free Member',
    price: 0,
    period: 'forever',
    description: 'Get started with the basics',
    features: [
      { text: 'Community access', included: true },
      { text: 'Basic training content', included: true },
      { text: 'Weekly newsletter', included: true },
      { text: 'Full course library', included: false },
      { text: 'Live masterclasses', included: false },
      { text: 'Premium resources', included: false },
      { text: 'Exclusive workshops', included: false },
    ],
  },
  {
    id: 'vip_monthly',
    name: 'VIP Monthly',
    price: 97,
    period: 'month',
    description: 'Full access to everything',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Full course library', included: true },
      { text: 'Live masterclasses', included: true },
      { text: 'Premium scripts & frameworks', included: true },
      { text: 'Exclusive workshops', included: true },
      { text: 'Priority support', included: true },
      { text: 'AI sales prompts', included: true },
    ],
  },
  {
    id: 'vip_annual',
    name: 'VIP Annual',
    price: 970,
    period: 'year',
    savings: '$194',
    description: 'Best value - 2 months free',
    features: [
      { text: 'Everything in VIP Monthly', included: true },
      { text: '2 months free', included: true },
      { text: 'Priority onboarding call', included: true },
      { text: 'Exclusive annual bonuses', included: true },
      { text: 'Early access to new content', included: true },
      { text: 'VIP badge in community', included: true },
      { text: 'Direct founder access', included: true },
    ],
  },
];

export default function MembershipPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState('');

  const handleSubscribe = async (packageId) => {
    if (packageId === 'free') return;
    
    setLoading(packageId);
    try {
      const response = await axios.post(
        `${API}/payments/checkout`,
        { 
          package_id: packageId,
          origin_url: window.location.origin 
        },
        { withCredentials: true }
      );
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Failed to start checkout');
      setLoading('');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto" data-testid="membership-page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Membership</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold mb-4">
            Invest in Your Success
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Join thousands of vacation club professionals who have transformed their careers with VCSA
          </p>
        </motion.div>

        {/* Current Plan Banner */}
        {user?.membership === 'vip' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="font-semibold">You're a VIP Member</p>
                <p className="text-sm text-[#94A3B8]">You have full access to all content and features</p>
              </div>
            </div>
            <span className="text-[#D4AF37] font-medium">Active</span>
          </motion.div>
        )}

        {/* Plans Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`glass p-8 relative ${plan.popular ? 'border-[#D4AF37]/50' : ''}`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-4 py-1">
                  Most Popular
                </div>
              )}
              
              {plan.savings && (
                <div className="absolute -top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1">
                  Save {plan.savings}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-[#94A3B8]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-serif text-4xl font-bold">${plan.price}</span>
                <span className="text-[#94A3B8]">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border border-white/20 rounded-full shrink-0" />
                    )}
                    <span className={feature.included ? '' : 'text-[#94A3B8]'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-white/20"
                  disabled
                >
                  Current Plan
                </Button>
              ) : user?.membership === 'vip' ? (
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-[#D4AF37]/50 text-[#D4AF37]"
                  disabled
                >
                  <Crown className="w-4 h-4 mr-2" /> VIP Active
                </Button>
              ) : (
                <Button 
                  className={`w-full h-12 font-bold uppercase tracking-wider ${
                    plan.popular 
                      ? 'bg-[#D4AF37] text-black hover:bg-[#B4942D] glow-gold' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  data-testid={`subscribe-${plan.id}`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" /> Get {plan.name}
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="font-serif text-2xl font-semibold text-center mb-8">What VIP Members Get</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, title: 'Full Course Library', desc: 'Complete training system' },
              { icon: Video, title: 'Live Masterclasses', desc: 'Weekly sessions with pros' },
              { icon: Download, title: 'Premium Resources', desc: 'Scripts & frameworks' },
              { icon: Users, title: 'Elite Community', desc: 'Network with top producers' },
            ].map((item, i) => (
              <div key={i} className="glass p-6 text-center">
                <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h4 className="font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass p-8 text-center"
        >
          <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            If you're not completely satisfied with your VIP membership, contact us within 30 days 
            for a full refund. No questions asked.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
