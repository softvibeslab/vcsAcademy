/**
 * Student Onboarding Page - Welcome & Setup Flow
 *
 * A streamlined onboarding experience for new students joining an academy.
 * Features:
 * - Personalized welcome with academy branding
 * - 4-step setup process (Profile → Goals → Preferences → Dashboard)
 * - Progress tracking with animations
 * - Integration with existing user system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Target, CheckCircle2, ChevronRight, ChevronLeft, Loader2,
  User, ArrowRight, GraduationCap, Award, Clock, BookOpen, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// ONBOARDING STEPS
// ============================================
const ONBOARDING_STEPS = [
  { id: 1, title: 'Bienvenida', icon: Sparkles, description: 'Conoce tu academia' },
  { id: 2, title: 'Perfil', icon: User, description: 'Cuéntanos sobre ti' },
  { id: 3, title: 'Metas', icon: Target, description: '¿Qué quieres lograr?' },
  { id: 4, title: 'Listo', icon: CheckCircle2, description: 'Comienza tu viaje' },
];

// ============================================
// GOAL PRESETS
// ============================================
const LEARNING_GOALS = [
  {
    id: 'close-more',
    icon: '💰',
    title: 'Cerrar más ventas',
    description: 'Aumentar mi tasa de conversión y cerrar más deals',
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'confidence',
    icon: '💪',
    title: 'Mayor confianza',
    description: 'Sentirme más seguro en presentaciones y negociaciones',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'leadership',
    icon: '👑',
    title: 'Liderazgo',
    description: 'Desarrollar habilidades para dirigir equipos',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'promotion',
    icon: '📈',
    title: 'Ascenso',
    description: 'Prepararme para un rol de mayor responsabilidad',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'skills',
    icon: '🎯',
    title: 'Nuevas habilidades',
    description: 'Aprender técnicas y metodologías específicas',
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'custom',
    icon: '✨',
    title: 'Personalizado',
    description: 'Tengo un objetivo específico en mente',
    color: 'from-slate-500 to-slate-600'
  }
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function StudentOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [academyData, setAcademyData] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    // Step 2: Profile
    fullName: '',
    role: '',
    experience: '',
    company: '',

    // Step 3: Goals
    primaryGoal: '',
    customGoal: '',
    timeframe: '',
    currentChallenges: '',

    // Step 4: Complete
    completed: false,
  });

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    // Get academy data from location state or use default
    const data = location.state?.academyData || {
      name: 'VCSA Academy',
      description: 'Vacation Club Sales Academy',
      logo: 'VA',
      primaryColor: '#D4AF37'
    };

    setAcademyData(data);

    // Check if user is already logged in
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, []);

  // ============================================
  // HANDLERS
  // ============================================
  const handleNext = async () => {
    // Validate current step
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (currentStep < ONBOARDING_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }

    setLoading(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    // Save onboarding completion
    const completeData = {
      ...formData,
      selectedGoals,
      completedAt: new Date().toISOString(),
      academyId: academyData?.id
    };

    sessionStorage.setItem('studentOnboarding', JSON.stringify(completeData));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('¡Bienvenido a la comunidad! 🎉', {
      description: 'Tu configuración está lista',
      duration: 3000
    });

    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);

    setLoading(false);
  };

  const validateStep = (step) => {
    switch (step) {
      case 2:
        if (!formData.fullName.trim()) {
          toast.error('Por favor ingresa tu nombre completo');
          return false;
        }
        if (!formData.role.trim()) {
          toast.error('Por favor ingresa tu rol actual');
          return false;
        }
        return true;
      case 3:
        if (selectedGoals.length === 0 && !formData.customGoal) {
          toast.error('Por favor selecciona al menos una meta o describe tu objetivo personalizado');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const progress = ((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100;

  // ============================================
  // RENDER STEP CONTENT
  // ============================================
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>

            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Bienvenido a <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{academyData?.name}</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {academyData?.description || 'Tu camino hacia el éxito comienza aquí'}
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <FeatureCard
                icon={BookOpen}
                title="Contenido Premium"
                description="Módulos especializados"
                color="from-purple-500 to-blue-500"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Progreso Tracking"
                description="Mide tu evolución"
                color="from-emerald-500 to-teal-500"
              />
              <FeatureCard
                icon={Award}
                title="Certificaciones"
                description="Obtén reconocimientos"
                color="from-amber-500 to-orange-500"
              />
            </div>

            {/* Time Estimate */}
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Configuración rápida: 2 minutos</span>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Cuéntanos sobre ti</h2>
              <p className="text-slate-400">Esto nos ayuda a personalizar tu experiencia</p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Rol actual <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Sales Representative, Account Manager..."
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Años de experiencia
                </label>
                <Input
                  type="text"
                  placeholder="Ej: 2 años, 5+ años..."
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Empresa (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Nombre de tu empresa"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="h-12 bg-slate-800/50 border-slate-700 focus:border-purple-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">¿Qué quieres lograr?</h2>
              <p className="text-slate-400">Selecciona tus metas principales (máximo 3)</p>
            </div>

            {/* Goals Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              {LEARNING_GOALS.map((goal) => (
                <motion.button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  disabled={selectedGoals.length >= 3 && !selectedGoals.includes(goal.id)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all duration-200 text-left",
                    "bg-slate-800/30 backdrop-blur-sm",
                    selectedGoals.includes(goal.id)
                      ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                      : "border-slate-700/50 hover:border-slate-600",
                    selectedGoals.length >= 3 && !selectedGoals.includes(goal.id) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Selection Indicator */}
                  {selectedGoals.includes(goal.id) && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom Goal */}
            {selectedGoals.includes('custom') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="max-w-xl mx-auto"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Describe tu objetivo personalizado
                  </label>
                  <Textarea
                    placeholder="Describe en tus palabras qué quieres lograr..."
                    value={formData.customGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 focus:border-purple-500 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Selected Goals Summary */}
            {selectedGoals.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedGoals.length} meta{selectedGoals.length > 1 ? 's' : ''} seleccionada{selectedGoals.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            {/* Completion Text */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                ¡Estás listo para comenzar!
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Tu perfil está configurado y {academyData?.name} está listo para ayudarte a alcanzar tus metas
              </p>
            </div>

            {/* Summary */}
            <Card className="max-w-md mx-auto border-slate-800/50 bg-slate-900/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-800/50">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl">
                      {getInitials(formData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{formData.fullName || 'Usuario'}</h3>
                    <p className="text-sm text-slate-400">{formData.role || 'Rol no especificado'}</p>
                  </div>
                </div>

                {selectedGoals.length > 0 && (
                  <div className="text-left">
                    <p className="text-sm text-slate-400 mb-2">Metas seleccionadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGoals.slice(0, 3).map((goalId) => {
                        const goal = LEARNING_GOALS.find(g => g.id === goalId);
                        return goal ? (
                          <Badge key={goalId} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {goal.icon} {goal.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl min-h-screen flex flex-col">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-purple-500/30">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {getInitials(academyData?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold text-white">{academyData?.name}</h1>
              <p className="text-sm text-slate-400">Configuración de estudiante</p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            Saltar intro
          </Button>
        </motion.div>

        {/* ============================================ */}
        {/* PROGRESS BAR */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">
              Paso {currentStep} de {ONBOARDING_STEPS.length}
            </span>
            <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800/50" />

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {ONBOARDING_STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const StepIcon = isCompleted ? CheckCircle2 : step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isActive ? '#8B5CF6' : isCompleted ? '#10B981' : '#334155'
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <StepIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-purple-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================ */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
            <CardContent className="flex-1 p-8 md:p-12">
              <ScrollArea className="h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* NAVIGATION FOOTER */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 mt-6 p-6 border border-slate-800/50 rounded-xl bg-slate-900/50 backdrop-blur-sm"
          >
            <Button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              variant="outline"
              className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>

            <div className="text-sm text-slate-400">
              {currentStep < ONBOARDING_STEPS.length ? (
                <span>Paso {currentStep} de {ONBOARDING_STEPS.length}</span>
              ) : (
                <span className="text-emerald-400">¡Configuración completa!</span>
              )}
            </div>

            {currentStep < ONBOARDING_STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-purple-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    {currentStep === ONBOARDING_STEPS.length - 1 ? 'Comenzar' : 'Continuar'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  <>
                    Ir al Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUBCOMPONENTS
// ============================================
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-4 rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm"
    >
      <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}
