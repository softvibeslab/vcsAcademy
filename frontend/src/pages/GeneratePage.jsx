/**
 * Generate Page - AI School Structure Generation
 *
 * Feature 3: Automatic generation with 3-step loading + strategy selection
 * - Animated loading with 3 stages
 * - 3 strategy cards: Aggressive / Balanced / Conservative
 * - Preview of generated structure
 * - Confetti on selection
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles, Wand2, CheckCircle2, ArrowRight, Home, RefreshCw,
  Zap, Target, Shield, BookOpen, Users, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// STRATEGY PRESETS
// ============================================
const GENERATION_STRATEGIES = {
  aggressive: {
    id: 'aggressive',
    name: 'Estrategia Agresiva',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Máxima conversión, estructura intensiva',
    highlights: [
      '12+ módulos profundos',
      'Comunidad premium incluida',
      'Gamificación avanzada',
      'Certificaciones múltiples',
      'Funnel de ventas completo'
    ],
    structure: {
      modules: 12,
      lessonsPerModule: 8,
      community: 'premium',
      gamification: 'advanced',
      certifications: 3,
      completionTime: '12-16 semanas',
      priceRange: '$2,000 - $15,000+'
    }
  },
  balanced: {
    id: 'balanced',
    name: 'Estrategia Equilibrada',
    icon: Target,
    color: 'from-purple-500 to-blue-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Balance perfecto entre engagement y resultados',
    highlights: [
      '8 módulos clave',
      'Comunidad privada',
      'Gamificación estándar',
      'Certificación principal',
      'Progresión clara'
    ],
    structure: {
      modules: 8,
      lessonsPerModule: 6,
      community: 'private',
      gamification: 'standard',
      certifications: 1,
      completionTime: '6-10 semanas',
      priceRange: '$500 - $5,000'
    }
  },
  conservative: {
    id: 'conservative',
    name: 'Estrategia Conservadora',
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Enfoque minimalista, resultados rápidos',
    highlights: [
      '5 módulos esenciales',
      'Sin comunidad (o básica)',
      'Sin gamificación',
      'Auto-estudio',
      'Lanzamiento rápido'
    ],
    structure: {
      modules: 5,
      lessonsPerModule: 4,
      community: 'none',
      gamification: 'minimal',
      certifications: 0,
      completionTime: '2-4 semanas',
      priceRange: '$100 - $1,000'
    }
  }
};

// ============================================
// GENERATION STAGES
// ============================================
const GENERATION_STAGES = [
  { id: 1, name: 'Analizando perfil...', duration: 2000 },
  { id: 2, name: 'Generando estructura...', duration: 2500 },
  { id: 3, name: 'Optimizando contenido...', duration: 2000 }
];

// ============================================
// CONFETTI COMPONENT
// ============================================
const ConfettiEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: -20,
      size: Math.random() * 10 + 5,
      color: ['#D4AF37', '#1E3A8A', '#8B5CF6', '#EC4899', '#10B981'][Math.floor(Math.random() * 5)],
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: Math.random() * 5 + 5,
      rotation: Math.random() * 360
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            x: `calc(${p.x}vw + ${p.velocityX * 20}px)`,
            rotate: p.rotation + 720,
            opacity: 0
          }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute"
        >
          <div
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function GeneratePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [schoolBlueprint, setSchoolBlueprint] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolBlueprint') || '{}');

    if (!data.schoolName) {
      navigate('/onboarding/create-school');
      return;
    }

    setSchoolBlueprint(data);

    // Start generation animation
    runGenerationStages(data);
  }, []);

  // ============================================
  // GENERATION FLOW
  // ============================================
  const runGenerationStages = async (data) => {
    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      setLoadingStage(i);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STAGES[i].duration));
    }

    // Generate strategies based on blueprint
    const generatedStrategies = generateStrategies(data);
    setStrategies(generatedStrategies);
    setIsLoading(false);
  };

  const generateStrategies = (blueprint) => {
    // Customize strategies based on user's blueprint
    return [
      {
        ...GENERATION_STRATEGIES.aggressive,
        // Customize based on blueprint
        structure: {
          ...GENERATION_STRATEGIES.aggressive.structure,
          modules: blueprint.ticketType === 'high-ticket' ? 15 : 12,
          community: blueprint.communityEnabled ? blueprint.communityType : 'premium'
        }
      },
      {
        ...GENERATION_STRATEGIES.balanced,
        structure: {
          ...GENERATION_STRATEGIES.balanced.structure,
          modules: blueprint.ticketType === 'high-ticket' ? 10 : 8,
          community: blueprint.communityEnabled ? blueprint.communityType : 'private'
        }
      },
      {
        ...GENERATION_STRATEGIES.conservative,
        structure: {
          ...GENERATION_STRATEGIES.conservative.structure,
          modules: 5,
          community: blueprint.communityEnabled ? blueprint.communityType : 'none'
        }
      }
    ];
  };

  const handleSelectStrategy = (strategy) => {
    setSelectedStrategy(strategy);
    setShowConfetti(true);

    // Update blueprint with selected strategy
    const updatedBlueprint = {
      ...schoolBlueprint,
      selectedStrategy: strategy.id,
      generatedStructure: strategy.structure
    };

    sessionStorage.setItem('schoolBlueprint', JSON.stringify(updatedBlueprint));

    // Show success toast
    toast.success('Estructura generada exitosamente', {
      description: `${strategy.name} seleccionada para tu academia`,
      duration: 3000
    });

    // Navigate to review page after confetti
    setTimeout(() => {
      navigate('/onboarding/review', {
        state: { schoolBlueprint: updatedBlueprint }
      });
    }, 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setIsLoading(true);
    setLoadingStage(0);
    setSelectedStrategy(null);

    setTimeout(() => {
      runGenerationStages(schoolBlueprint);
      setIsRegenerating(false);
    }, 500);
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

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl min-h-screen flex flex-col">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Generando tu academia
              </h1>
              <p className="text-sm text-slate-400">
                {schoolBlueprint?.schoolName || 'Tu escuela'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* LOADING STAGE */}
        {/* ============================================ */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex items-center justify-center"
            >
              <Card className="w-full max-w-2xl border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-12 text-center space-y-8">
                  {/* Animated Icon */}
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                    className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Stage Text */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      {GENERATION_STAGES[loadingStage]?.name}
                    </h2>
                    <p className="text-slate-400">
                      Personalizando todo para {schoolBlueprint?.ticketType === 'high-ticket' ? 'alto valor' : 'alto volumen'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <Progress
                      value={((loadingStage + 1) / GENERATION_STAGES.length) * 100}
                      className="h-3 bg-slate-800/50"
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Etapa {loadingStage + 1} de {GENERATION_STAGES.length}</span>
                      <span>{Math.round(((loadingStage + 1) / GENERATION_STAGES.length) * 100)}%</span>
                    </div>
                  </div>

                  {/* Stage Indicators */}
                  <div className="flex justify-center gap-3">
                    {GENERATION_STAGES.map((stage, idx) => (
                      <motion.div
                        key={stage.id}
                        initial={false}
                        animate={{
                          scale: idx <= loadingStage ? 1 : 0.8,
                          backgroundColor: idx <= loadingStage ? '#8B5CF6' : '#334155'
                        }}
                        className="w-3 h-3 rounded-full transition-colors duration-300"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================ */}
        {/* STRATEGY SELECTION */}
        {/* ============================================ */}
        <AnimatePresence>
          {!isLoading && strategies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-4"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generación completada</span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Elige tu estrategia
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Basado en tu academia de {schoolBlueprint?.schoolName}, he generado 3 opciones. Selecciona la que mejor se adapte a tu visión.
                </p>
              </div>

              {/* Strategy Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {strategies.map((strategy, idx) => {
                  const Icon = strategy.icon;
                  return (
                    <motion.div
                      key={strategy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className={cn(
                        "h-full border-slate-800/50 bg-slate-900/50 backdrop-blur-xl transition-all duration-300",
                        "hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30",
                        selectedStrategy?.id === strategy.id && strategy.borderColor
                      )}>
                        <CardHeader className="space-y-4">
                          {/* Icon & Badge */}
                          <div className="flex items-start justify-between">
                            <div className={cn(
                              "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center",
                              strategy.color
                            )}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            {idx === 1 && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                Recomendado
                              </Badge>
                            )}
                          </div>

                          <div>
                            <CardTitle className="text-xl text-white mb-2">
                              {strategy.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {strategy.description}
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Highlights */}
                          <div className="space-y-2">
                            {strategy.highlights.map((highlight, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>

                          {/* Structure Preview */}
                          <div className="pt-4 border-t border-slate-800/50">
                            <ScrollArea className="h-40">
                              <div className="space-y-3 pr-4">
                                <StructureItem
                                  icon={BookOpen}
                                  label="Módulos"
                                  value={strategy.structure.modules}
                                />
                                <StructureItem
                                  icon={Users}
                                  label="Comunidad"
                                  value={strategy.structure.community}
                                />
                                <StructureItem
                                  icon={TrendingUp}
                                  label="Precio"
                                  value={strategy.structure.priceRange}
                                />
                                <StructureItem
                                  icon={Target}
                                  label="Duración"
                                  value={strategy.structure.completionTime}
                                />
                              </div>
                            </ScrollArea>
                          </div>

                          {/* Select Button */}
                          <Button
                            onClick={() => handleSelectStrategy(strategy)}
                            disabled={selectedStrategy !== null}
                            className={cn(
                              "w-full h-12 text-base font-semibold",
                              "bg-gradient-to-r hover:shadow-lg transition-all duration-300",
                              strategy.color,
                              selectedStrategy?.id === strategy.id && "ring-2 ring-white/50"
                            )}
                          >
                            {selectedStrategy?.id === strategy.id ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Seleccionado
                              </>
                            ) : (
                              <>
                                Elegir esta estrategia
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pb-8">
                <Button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  variant="outline"
                  className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                >
                  <RefreshCw className={cn("w-5 h-5 mr-2", isRegenerating && "animate-spin")} />
                  Regenerar opciones
                </Button>

                <Button
                  onClick={() => navigate('/onboarding/interview')}
                  variant="outline"
                  className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                >
                  Volver a la entrevista
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// SUBCOMPONENTS
// ============================================
function StructureItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
      <Icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
      <span className="text-sm text-slate-400 flex-1">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
