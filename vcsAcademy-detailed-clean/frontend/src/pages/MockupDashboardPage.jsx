import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Play, CheckCircle,
  Target, TrendingUp, DollarSign, BookOpen, Users,
  Calendar, FileText, Award, Zap, BarChart3, Settings,
  ArrowRight, Home, Menu, Grid, List, Info, Download,
  Star, Flame, Trophy, Clock, Eye, Filter, Search, MessageSquare, Globe
} from 'lucide-react';

// Mockup data for each module
const MOCKUP_MODULES = [
  {
    id: 1,
    name: 'Daily Performance',
    icon: Target,
    color: 'green',
    route: '/daily-performance',
    description: 'Track your daily sales, tours, and key metrics with our 25-day grid system',
    features: ['25-Day Grid View', '7 Core Attributes', 'Real-time Tracking', 'Streak Bonuses'],
    stats: { tours: 3, presentations: 2, closes: 1, revenue: 12500 },
    image: '📊'
  },
  {
    id: 2,
    name: 'Goal Sheet',
    icon: Award,
    color: 'blue',
    route: '/goals',
    description: 'Set SMART goals across 4 categories: Income, Activity, Skills, and Performance',
    features: ['SMART Goals', 'Progress Tracking', 'Milestones', 'Achievement Badges'],
    stats: { totalGoals: 11, completed: 4, inProgress: 7 },
    image: '🎯'
  },
  {
    id: 3,
    name: 'Financial Planner',
    icon: DollarSign,
    color: 'yellow',
    route: '/financial',
    description: 'Plan your financial future with income projections and savings tracking',
    features: ['3-Year Projections', 'Savings Goals', 'Budget Planner', 'Income Calculator'],
    stats: { monthlyIncome: 12200, savingsRate: 28, projected: 18500 },
    image: '💰'
  },
  {
    id: 4,
    name: 'Analytics',
    icon: BarChart3,
    color: 'purple',
    route: '/analytics',
    description: 'Deep dive into your performance with comprehensive analytics and insights',
    features: ['Efficiency Dashboard', 'Predictive Insights', 'Monthly Reports', 'Trends'],
    stats: { conversionRate: 28, growth: 12, ranking: 5 },
    image: '📈'
  },
  {
    id: 5,
    name: 'Top Producer Path',
    icon: Trophy,
    color: 'orange',
    route: '/path',
    description: '36 training sessions across 6 tracks to become a top producer',
    features: ['4 Stages', '6 Tracks', '36 Sessions', 'Certificates'],
    stats: { completed: 12, inProgress: 5, readiness: 67 },
    image: '🏆'
  },
  {
    id: 6,
    name: 'Training Library',
    icon: BookOpen,
    color: 'indigo',
    route: '/courses',
    description: 'Access comprehensive training content and video sessions',
    features: ['Video Library', 'Progress Tracking', 'Quizzes', 'Certificates'],
    stats: { totalModules: 36, completed: 12 },
    image: '📚'
  },
  {
    id: 7,
    name: 'Coaching Events',
    icon: Calendar,
    color: 'red',
    route: '/coaching/events',
    description: 'Join live coaching sessions, role play, and Q&A with experts',
    features: ['Live Sessions', 'Role Play', 'Q&A Forums', 'Expert Access'],
    stats: { upcoming: 10, registered: 3 },
    image: '🎪'
  },
  {
    id: 8,
    name: 'Group Coaching',
    icon: Users,
    color: 'cyan',
    route: '/coaching/group',
    description: 'Participate in group coaching sessions with peers and mentors',
    features: ['Weekly Sessions', 'Peer Learning', 'Expert Hosts', 'Recordings'],
    stats: { nextSession: 'Today 3PM', topic: 'Objection Handling' },
    image: '👥'
  },
  {
    id: 9,
    name: 'Role Play Sessions',
    icon: Play,
    color: 'pink',
    route: '/coaching/roleplay',
    description: 'Practice your sales skills in realistic role play scenarios',
    features: ['12 Scenarios', 'Real-time Feedback', 'Peer Matching', 'Scoring'],
    stats: { completed: 4, upcoming: 2 },
    image: '🎭'
  },
  {
    id: 10,
    name: 'Q&A Sessions',
    icon: MessageSquare,
    color: 'teal',
    route: '/coaching/qa',
    description: 'Get your questions answered by top producers and experts',
    features: ['Bi-weekly Sessions', 'Expert Panel', 'Question Queue', 'Recordings'],
    stats: { nextSession: 'Wed 2PM', questions: 5 },
    image: '❓'
  },
  {
    id: 11,
    name: 'Resources Library',
    icon: FileText,
    color: 'emerald',
    route: '/resources',
    description: 'Download frameworks, scripts, templates, and tools',
    features: ['Frameworks', 'Scripts', 'Templates', 'Tools', 'Case Studies'],
    stats: { total: 10, downloaded: 3 },
    image: '📄'
  },
  {
    id: 12,
    name: 'Community',
    icon: Globe,
    color: 'violet',
    route: '/community',
    description: 'Connect with other sales professionals and share insights',
    features: ['Discussion Feed', 'Success Stories', 'Tips & Tricks', 'Networking'],
    stats: { members: 234, posts: 89 },
    image: '🌐'
  }
];

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Welcome to VCSA Academy!',
    subtitle: 'Your Complete Sales Operating System',
    icon: Star,
    content: 'This platform will transform you into a top vacation club sales producer. Let me show you around.',
    action: 'Start Tour'
  },
  {
    id: 2,
    title: 'Track Daily Performance',
    subtitle: 'Daily Performance Module',
    icon: Target,
    content: 'Log your tours, presentations, and closes every day. Track 7 key attributes and build winning streaks.',
    action: 'See How It Works'
  },
  {
    id: 3,
    title: 'Set SMART Goals',
    subtitle: 'Goal Sheet Module',
    icon: Award,
    content: 'Define clear, measurable goals for income, activity, skills, and performance. Track progress and celebrate achievements.',
    action: 'Explore Goals'
  },
  {
    id: 4,
    title: 'Plan Your Financial Future',
    subtitle: 'Financial Planner Module',
    icon: DollarSign,
    content: 'Project your income, track savings goals, and create a budget. See where you\'ll be in 3 years.',
    action: 'View Planner'
  },
  {
    id: 5,
    title: 'Master the Training',
    subtitle: 'Top Producer Path',
    icon: Trophy,
    content: 'Complete 36 training sessions across 6 tracks. Progress from New Rep to Top Producer.',
    action: 'Start Training'
  },
  {
    id: 6,
    title: 'Get Expert Coaching',
    subtitle: 'Coaching Platform',
    icon: Users,
    content: 'Join live sessions, practice with role play, and get answers in Q&A forums.',
    action: 'View Coaching'
  },
  {
    id: 7,
    title: 'Access Proven Resources',
    subtitle: 'Knowledge Hub',
    icon: FileText,
    content: 'Download battle-tested frameworks, scripts, and templates used by top producers.',
    action: 'Browse Resources'
  },
  {
    id: 8,
    title: 'Analyze & Improve',
    subtitle: 'Analytics Dashboard',
    icon: BarChart3,
    content: 'Dive deep into your performance metrics. Get predictive insights and track trends over time.',
    action: 'See Analytics'
  },
  {
    id: 9,
    title: 'You\'re All Set!',
    subtitle: 'Start Your Journey',
    icon: Zap,
    content: 'All modules are ready to use. Start with Daily Performance or explore whatever interests you most.',
    action: 'Begin Using Platform'
  }
];

export default function MockupDashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);
  const [viewMode, setViewMode] = useState('onboarding');
  const [layoutView, setLayoutView] = useState('grid');

  const currentOnboarding = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setViewMode('dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setViewMode('module-detail');
  };

  const handleStartTour = () => {
    setCurrentStep(0);
    setViewMode('onboarding');
  };

  const handleSkipTour = () => {
    setViewMode('dashboard');
  };

  // Onboarding View
  if (viewMode === 'onboarding') {
    const Icon = currentOnboarding.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020204] via-[#1E3A8A] to-[#020204] text-[#F8FAFC] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] p-3 rounded-xl">
                <Star className="text-black" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#F8FAFC]">VCSA Academy</h1>
                <p className="text-sm text-[#94A3B8]">Platform Tour</p>
              </div>
            </div>
            <button
              onClick={handleSkipTour}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Skip Tour
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#94A3B8]">Step {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
              <span className="text-sm font-medium text-[#D4AF37]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 p-8 rounded-3xl border-2 border-[#D4AF37]/30">
                  <Icon className="text-[#D4AF37]" size={80} />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
                  {currentOnboarding.title}
                </h2>
                <p className="text-xl text-[#D4AF37]">
                  {currentOnboarding.subtitle}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
                <p className="text-lg text-[#94A3B8] leading-relaxed">
                  {currentOnboarding.content}
                </p>
              </div>

              {/* Module Preview (for steps 2-8) */}
              {currentStep >= 1 && currentStep <= 7 && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{MOCKUP_MODULES[currentStep].image}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">
                        {MOCKUP_MODULES[currentStep].name}
                      </h3>
                      <p className="text-[#94A3B8]">
                        {MOCKUP_MODULES[currentStep].description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {MOCKUP_MODULES[currentStep].features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                        <CheckCircle size={16} className="text-[#D4AF37]" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
                    {Object.entries(MOCKUP_MODULES[currentStep].stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-[#94A3B8] capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-xl font-bold text-[#D4AF37]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'text-[#94A3B8] cursor-not-allowed'
                      : 'text-[#F8FAFC] hover:bg-white/5'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-xl font-semibold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Finish Tour' : 'Next'}
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Module Detail View
  if (viewMode === 'module-detail' && selectedModule) {
    const Icon = selectedModule.icon;
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020204] via-[#1E3A8A] to-[#020204] text-[#F8FAFC] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setViewMode('dashboard')}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#F8FAFC]">{selectedModule.name}</h1>
              <p className="text-[#94A3B8]">{selectedModule.description}</p>
            </div>
          </div>

          {/* Module Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Visual Preview */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 p-12 rounded-3xl border-2 border-[#D4AF37]/30 mb-4">
                  <div className="text-9xl">{selectedModule.image}</div>
                </div>
                <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">{selectedModule.name}</h2>
                <p className="text-[#94A3B8]">Interactive Module Preview</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#F8FAFC]">Key Features</h3>
                {selectedModule.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle size={18} className="text-[#D4AF37]" />
                    <span className="text-[#94A3B8]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-[#F8FAFC] mb-4">Module Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedModule.stats).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
                      <p className="text-xs text-[#94A3B8] capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-[#F8FAFC] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-xl font-semibold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all">
                    <span>Open Module</span>
                    <ArrowRight size={20} />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white/5 text-[#F8FAFC] rounded-xl hover:bg-white/10 transition-all">
                    <span>View Demo Data</span>
                    <Eye size={20} />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-white/5 text-[#F8FAFC] rounded-xl hover:bg-white/10 transition-all">
                    <span>Read Documentation</span>
                    <FileText size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Screenshot Area */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">Module Interface Preview</h3>
            <div className="bg-gradient-to-br from-[#020204] to-[#1E3A8A] rounded-xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedModule.image}</div>
                <p className="text-xl text-[#94A3B8]">
                  {selectedModule.name} Interface
                </p>
                <p className="text-sm text-[#94A3B8] mt-2">
                  Interactive mockup with real functionality
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020204] via-[#1E3A8A] to-[#020204] text-[#F8FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 via-white/5 to-[#D4AF37]/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] p-3 rounded-xl">
                <Star className="text-black" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#F8FAFC]">VCSA Academy</h1>
                <p className="text-sm text-[#94A3B8]">Complete Sales Operating System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLayoutView(layoutView === 'grid' ? 'list' : 'grid')}
                className="p-2 hover:bg-white/5 rounded-lg transition-all"
                title={layoutView === 'grid' ? 'List View' : 'Grid View'}
              >
                {layoutView === 'grid' ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button
                onClick={handleStartTour}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              >
                <Info size={18} />
                <span className="hidden md:inline">Restart Tour</span>
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#8B5CF6]/20 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">
                Welcome to Your Sales Operating System
              </h2>
              <p className="text-[#94A3B8]">
                12 powerful modules to transform your sales performance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <Target className="text-[#D4AF37] mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-[#F8FAFC]">12</p>
            <p className="text-xs text-[#94A3B8]">Modules</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <BookOpen className="text-blue-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-[#F8FAFC]">36</p>
            <p className="text-xs text-[#94A3B8]">Sessions</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <Zap className="text-yellow-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-[#F8FAFC]">11</p>
            <p className="text-xs text-[#94A3B8]">Badges</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <Trophy className="text-green-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-[#F8FAFC]">500+</p>
            <p className="text-xs text-[#94A3B8]">Demo Data</p>
          </div>
        </div>

        {/* Module Grid */}
        <div className={`${layoutView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {MOCKUP_MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => handleModuleClick(module)}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-xl group-hover:bg-[#D4AF37]/20 transition-all">
                    <Icon className="text-[#D4AF37]" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-sm text-[#94A3B8] line-clamp-2">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="text-4xl mb-4">{module.image}</div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {module.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-white/5 text-[#94A3B8] px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/20">
                  {Object.entries(module.stats).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-lg font-bold text-[#D4AF37]">
                        {typeof value === 'number' && value > 1000
                          ? `${(value / 1000).toFixed(1)}K`
                          : value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-3 border-t border-white/5">
                  <span>Click to explore</span>
                  <ArrowRight size={16} className="group-hover:text-[#D4AF37] transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
