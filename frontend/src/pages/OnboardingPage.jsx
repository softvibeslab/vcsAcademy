import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle, Circle,
  Target, BookOpen, Users, Calendar, TrendingUp,
  Award, Play, ArrowRight, X, Star, Sparkles, Rocket
} from 'lucide-react';
import { useAuth } from '@/App';

const STEPS = [
  {
    id: 1,
    title: 'Welcome to VCSA!',
    description: 'Your journey to sales excellence starts here',
    component: 'Welcome'
  },
  {
    id: 2,
    title: 'Set Your Goals',
    description: 'Define your monthly income and activity targets',
    component: 'Goals'
  },
  {
    id: 3,
    title: 'Explore Training',
    description: 'Discover our comprehensive training library',
    component: 'Training'
  },
  {
    id: 4,
    title: 'Join Coaching',
    description: 'Connect with live coaching sessions',
    component: 'Coaching'
  },
  {
    id: 5,
    title: 'Start Learning',
    description: 'Begin your first training session',
    component: 'Start'
  }
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user already completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('vcsa_onboarding_completed') || localStorage.getItem('onboarding_completed');
    if (onboardingCompleted === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('vcsa_onboarding_completed', 'true'); // For App.js compatibility
    setCompleted(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Navigate to dashboard
    navigate('/dashboard', { replace: true });
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('vcsa_onboarding_completed', 'true'); // For App.js compatibility
    navigate('/dashboard', { replace: true });
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">VCSA Academy</h1>
              <p className="text-sm text-on-surface-variant">Your Sales Journey Starts Here</p>
            </div>
          </div>

          <button
            onClick={skipOnboarding}
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Skip
          </button>
        </motion.header>

        {/* Progress Bar */}
        <div className="px-4 md:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-on-surface-variant">
                Step {currentStep} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 md:px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && <WelcomeStep user={user} />}
                {currentStep === 2 && <GoalsStep />}
                {currentStep === 3 && <TrainingStep />}
                {currentStep === 4 && <CoachingStep />}
                {currentStep === 5 && <StartStep />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6 border-t border-white/10"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  : 'bg-surface-container hover:bg-surface-container/80 text-on-surface'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-2">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    step.id === currentStep
                      ? 'bg-primary scale-125'
                      : step.id < currentStep
                      ? 'bg-green-400'
                      : 'bg-surface-container'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                loading
                  ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-on-primary'
              }`}
            >
              {currentStep === STEPS.length ? (
                loading ? (
                  'Completing...'
                ) : (
                  <>
                    Get Started
                    <Rocket size={20} />
                  </>
                )
              ) : (
                <>
                  Next
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

// Step Components
function WelcomeStep({ user }) {
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-block"
      >
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-8 rounded-3xl inline-block mb-6">
          <Target className="text-primary mx-auto mb-4" size={64} />
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Welcome to VCSA!
          </h2>
          <p className="text-xl text-on-surface">
            {user?.name ? `Hello, ${user.name}!` : 'Hello!'}
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          You're about to join the <span className="text-primary font-semibold">Top Producer Development System</span> –
          a comprehensive training platform designed to transform you into a vacation club sales champion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all"
          >
            <div className="bg-primary/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <BookOpen className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">36 Training Sessions</h3>
            <p className="text-sm text-on-surface-variant">
              Comprehensive video library across 6 training tracks
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all"
          >
            <div className="bg-green-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <Users className="text-green-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Live Coaching</h3>
            <p className="text-sm text-on-surface-variant">
              Group sessions, role play, and Q&A with experts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all"
          >
            <div className="bg-blue-500/10 p-3 rounded-xl w-fit mx-auto mb-4">
              <TrendingUp className="text-blue-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Performance Tracking</h3>
            <p className="text-sm text-on-surface-variant">
              Daily metrics, goals, and progress monitoring
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-8"
      >
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Star className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-on-surface">
              What You'll Achieve
            </h3>
          </div>
          <ul className="space-y-2 text-left">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-on-surface">Master the complete sales process from discovery to close</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-on-surface">Learn proven techniques from top vacation club producers</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
              <span className="text-on-surface">Build consistent sales habits and hit your income goals</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function GoalsStep() {
  const [incomeGoal, setIncomeGoal] = useState(15000);
  const [tourGoal, setTourGoal] = useState(5);
  const [selectedDays, setSelectedDays] = useState(5);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Target className="text-primary mx-auto mb-4" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
          Set Your Monthly Goals
        </h2>
        <p className="text-on-surface-variant">
          Define your targets and we'll help you achieve them
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface">Monthly Income Goal</h3>
              <p className="text-sm text-on-surface-variant">Target monthly revenue</p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={incomeGoal}
              onChange={(e) => setIncomeGoal(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">
                ${incomeGoal.toLocaleString()}
              </span>
              <p className="text-sm text-on-surface-variant">per month</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <button
                onClick={() => setIncomeGoal(10000)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  incomeGoal === 10000
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
                }`}
              >
                $10K
              </button>
              <button
                onClick={() => setIncomeGoal(15000)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  incomeGoal === 15000
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
                }`}
              >
                $15K
              </button>
              <button
                onClick={() => setIncomeGoal(25000)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  incomeGoal === 25000
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
                }`}
              >
                $25K
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tour Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Users className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface">Daily Tours Goal</h3>
              <p className="text-sm text-on-surface-variant">Tours per day</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setTourGoal(Math.max(1, tourGoal - 1))}
                className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container/80 flex items-center justify-center text-on-surface transition-all"
              >
                -
              </button>
              <span className="text-5xl font-bold text-primary">
                {tourGoal}
              </span>
              <button
                onClick={() => setTourGoal(Math.min(10, tourGoal + 1))}
                className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container/80 flex items-center justify-center text-on-surface transition-all"
              >
                +
              </button>
            </div>
            <p className="text-sm text-on-surface-variant">tours per day</p>
          </div>
        </motion.div>
      </div>

      {/* Work Days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-on-surface mb-4">
          How many days per week will you work?
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDays(day)}
              className={`p-4 rounded-xl transition-all border-2 ${
                selectedDays === day
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container text-on-surface border-white/10 hover:border-primary/30'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{day}</div>
                <div className="text-xs">day</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30"
      >
        <h3 className="text-xl font-semibold text-on-surface mb-4">
          Your Monthly Goal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Income Goal</p>
            <p className="text-2xl font-bold text-primary">${incomeGoal.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Tours Per Month</p>
            <p className="text-2xl font-bold text-blue-400">{tourGoal * selectedDays * 4}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Daily Average</p>
            <p className="text-2xl font-bold text-green-400">${Math.round(incomeGoal / (tourGoal * selectedDays * 4)).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TrainingStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <BookOpen className="text-primary mx-auto mb-4" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
          Explore Training Library
        </h2>
        <p className="text-on-surface-variant">
          36 video sessions across 6 comprehensive training tracks
        </p>
      </div>

      {/* Training Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Pro Mindset', icon: '🧠', modules: 6, color: 'purple' },
          { name: 'Discovery & Control', icon: '🔍', modules: 6, color: 'blue' },
          { name: 'Value Architecture', icon: '💎', modules: 6, color: 'green' },
          { name: 'Decision Management', icon: '🎯', modules: 6, color: 'orange' },
          { name: 'Objection Mastery', icon: '🛡️', modules: 6, color: 'red' },
          { name: 'Post-Sale Integrity', icon: '⭐', modules: 6, color: 'yellow' }
        ].map((track, index) => (
          <motion.div
            key={track.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="text-4xl mb-3">{track.icon}</div>
            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
              {track.name}
            </h3>
            <p className="text-sm text-on-surface-variant">
              {track.modules} modules • Expert instructors
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Duration</span>
                <span className="text-on-surface font-medium">45 min each</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Win */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Play className="text-green-400" size={32} />
          <div>
            <h3 className="text-xl font-semibold text-on-surface">Start with a Quick Win</h3>
            <p className="text-sm text-on-surface-variant">Get immediate results with these tactical modules</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Breaking Objections', 'Value Building', 'Closing Techniques'].map((topic, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 bg-surface-container rounded-lg hover:bg-surface-container/80 transition-all"
            >
              <Circle className="text-green-400" size={16} />
              <span className="text-sm text-on-surface">{topic}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CoachingStep() {
  const events = [
    { title: 'Group Coaching', description: 'Live sessions with top producers', time: '2x weekly', icon: '👥' },
    { title: 'Role Play Sessions', description: 'Practice scenarios in real-time', time: 'Weekly', icon: '🎭' },
    { title: 'Q&A Sessions', description: 'Get your questions answered', time: 'Weekly', icon: '💬' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Users className="text-primary mx-auto mb-4" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
          Join Coaching Community
        </h2>
        <p className="text-on-surface-variant">
          Live coaching, role play, and Q&A sessions
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="glass-card rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{event.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-on-surface-variant mb-2">{event.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-primary" size={16} />
                  <span className="text-on-surface">{event.time}</span>
                </div>
              </div>
              <CheckCircle className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-on-surface mb-4">Why Join Coaching?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Award className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-on-surface font-medium">Learn from Experts</p>
              <p className="text-sm text-on-surface-variant">Direct access to top producers</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Target className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-on-surface font-medium">Practice Real Scenarios</p>
              <p className="text-sm text-on-surface-variant">Role play with feedback</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-on-surface font-medium">Accelerate Growth</p>
              <p className="text-sm text-on-surface-variant">Fast-track your success</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StartStep() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Rocket className="text-primary mx-auto mb-4" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
          You're All Set!
        </h2>
        <p className="text-on-surface-variant">
          Your journey to becoming a top producer starts now
        </p>
      </div>

      {/* What's Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5"
        >
          <h3 className="text-xl font-semibold text-on-surface mb-4">Your First Actions</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <span className="text-on-surface">Watch your first training session</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <span className="text-on-surface">Log your daily performance</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <span className="text-on-surface">Register for your first coaching event</span>
            </li>
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-on-surface mb-4">Quick Links</h3>
          <div className="space-y-3">
            <a
              href="/training"
              className="block p-3 bg-surface-container rounded-lg hover:bg-surface-container/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-on-surface">Training Library</span>
                <ArrowRight className="text-primary" size={16} />
              </div>
            </a>
            <a
              href="/dashboard/performance"
              className="block p-3 bg-surface-container rounded-lg hover:bg-surface-container/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-on-surface">Daily Performance</span>
                <ArrowRight className="text-primary" size={16} />
              </div>
            </a>
            <a
              href="/coaching/events"
              className="block p-3 bg-surface-container rounded-lg hover:bg-surface-container/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-on-surface">Coaching Events</span>
                <ArrowRight className="text-primary" size={16} />
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Celebration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-center"
      >
        <Star className="text-primary mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold text-on-surface mb-2">
          You're Ready to Launch! 🚀
        </h3>
        <p className="text-on-surface-variant mb-6">
          You've completed setup and are ready to begin your journey to becoming a top vacation club sales producer.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Your Goals</p>
            <p className="text-2xl font-bold text-primary">$15,000/mo</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Training</p>
            <p className="text-2xl font-bold text-blue-400">36 sessions</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-on-surface-variant mb-1">Support</p>
            <p className="text-2xl font-bold text-green-400">Live coaching</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
