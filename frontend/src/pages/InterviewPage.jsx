/**
 * Interview Page - AI Onboarding with Branching Flow
 *
 * Feature 2: Conversational interview with 4-stage branching
 * - Stage 1: Ticket type (high-ticket vs low-ticket)
 * - Stage 2: Format preference (video, text, hybrid)
 * - Stage 3: Modules structure
 * - Stage 4: Community features
 *
 * Saves all responses to SchoolBlueprint state for generation
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Bot, User, Sparkles, ArrowRight, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================
// SCHOOL BLUEPRINT TYPE
// ============================================
const initialSchoolBlueprint = {
  schoolName: '',
  learningOutcome: '',
  ticketType: '', // 'high-ticket' | 'low-ticket'
  format: '', // 'video' | 'text' | 'hybrid'
  modulesCount: 0,
  moduleTopics: [],
  communityEnabled: false,
  communityType: '', // 'public' | 'private' | 'premium'
  pricingModel: '',
  targetAudience: '',
  estimatedCompletionTime: '',
};

// ============================================
// INTERVIEW STAGES CONFIG
// ============================================
const INTERVIEW_STAGES = [
  {
    id: 'ticket_type',
    question: '¿Qué tipo de productos o servicios venderás en tu academia?',
    description: 'Esto me ayuda a adaptar la estructura y el tono del contenido.',
    options: [
      {
        value: 'high-ticket',
        label: 'High-Ticket Premium',
        description: 'Productos de $2,000+ (ej: consulting, coaching ejecutivo, B2B)',
        icon: '💎',
        followUp: {
          question: '¿Cuál es el ticket promedio que buscas?',
          options: [
            { value: '2k-5k', label: '$2,000 - $5,000', icon: '💰' },
            { value: '5k-15k', label: '$5,000 - $15,000', icon: '💎' },
            { value: '15k-50k', label: '$15,000 - $50,000', icon: '👑' },
            { value: '50k+', label: '+$50,000', icon: '🚀' }
          ]
        }
      },
      {
        value: 'low-ticket',
        label: 'Low-Ticket Volume',
        description: 'Productos de $50 - $2,000 (ej: cursos, memberships, B2C)',
        icon: '🚀',
        followUp: {
          question: '¿Cuál es el rango de precio objetivo?',
          options: [
            { value: '50-200', label: '$50 - $200', icon: '📚' },
            { value: '200-500', label: '$200 - $500', icon: '🎓' },
            { value: '500-1k', label: '$500 - $1,000', icon: '💡' },
            { value: '1k-2k', label: '$1,000 - $2,000', icon: '⭐' }
          ]
        }
      }
    ]
  },
  {
    id: 'format',
    question: '¿Qué formato prefieres para el contenido de tus módulos?',
    description: 'Puedes combinar varios formatos si lo deseas.',
    options: [
      {
        value: 'video',
        label: 'Principalmente Video',
        description: 'Lecciones grabadas con apoyo de texto y recursos descargables',
        icon: '🎬'
      },
      {
        value: 'text',
        label: 'Principalmente Texto',
        description: 'Contenido escrito detallado con imágenes y ejemplos',
        icon: '📝'
      },
      {
        value: 'hybrid',
        label: 'Híbrido Equilibrado',
        description: 'Mix de videos cortos + texto profundo + live sessions',
        icon: '🔄'
      }
    ]
  },
  {
    id: 'modules',
    question: '¿Cuántos módulos principales tendrá tu curso?',
    description: 'Esto define la estructura inicial que generaré.',
    options: [
      { value: '5', label: '5 Módulos', description: 'Express: 2-4 semanas de completado', icon: '⚡' },
      { value: '8', label: '8 Módulos', description: 'Estándar: 4-8 semanas de completado', icon: '📚' },
      { value: '12', label: '12 Módulos', description: 'Completo: 8-16 semanas de completado', icon: '🎓' },
      { value: 'custom', label: 'Personalizado', description: 'Diré el número exacto', icon: '✨' }
    ]
  },
  {
    id: 'community',
    question: '¿Qué tipo de comunidad quieres para tus alumnos?',
    description: 'La comunidad aumenta retención y engagement.',
    options: [
      {
        value: 'none',
        label: 'Sin Comunidad',
        description: 'Solo contenido de curso sin interacción social',
        icon: '🔒'
      },
      {
        value: 'public',
        label: 'Comunidad Abierta',
        description: 'Feed público tipo Skool donde todos pueden ver y comentar',
        icon: '🌐'
      },
      {
        value: 'private',
        label: 'Comunidad Privada',
        description: 'Solo miembros pueden acceder y participar',
        icon: '🔐'
      },
      {
        value: 'premium',
        label: 'Comunidad Premium',
        description: 'Acceso exclusivo con networking y eventos especiales',
        icon: '👑'
      }
    ]
  }
];

export default function InterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // STATE
  // ============================================
  const [schoolBlueprint, setSchoolBlueprint] = useState(initialSchoolBlueprint);
  const [messages, setMessages] = useState([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolData') || '{}');

    if (!data.schoolName) {
      navigate('/onboarding/create-school');
      return;
    }

    setSchoolBlueprint(prev => ({
      ...prev,
      schoolName: data.schoolName,
      learningOutcome: data.learningOutcome || '',
      schoolId: data.schoolId
    }));

    // Start conversation
    startInterview(data);
  }, []);

  // ============================================
  // AUTO-SCROLL
  // ============================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ============================================
  // CONVERSATION FLOW
  // ============================================
  const startInterview = (data) => {
    setIsTyping(true);

    setTimeout(() => {
      const greetingMessage = {
        role: 'assistant',
        content: `¡Perfecto! Voy a crear una estructura optimizada para **${data.schoolName}**${data.learningOutcome ? ` con el objetivo de: "${data.learningOutcome}"` : ''}.`,
        type: 'greeting'
      };
      addMessage(greetingMessage);

      setTimeout(() => {
        presentStageQuestion(0);
      }, 800);
    }, 1200);
  };

  const presentStageQuestion = (stageIndex) => {
    setIsTyping(true);
    const stage = INTERVIEW_STAGES[stageIndex];

    setTimeout(() => {
      const questionMessage = {
        role: 'assistant',
        content: stage.question,
        description: stage.description,
        type: 'question',
        options: stage.options,
        stageId: stage.id
      };
      addMessage(questionMessage);
      setIsTyping(false);
    }, 1000);
  };

  const presentFollowUp = (followUp, stageId) => {
    setShowFollowUp(true);
    setIsTyping(true);

    setTimeout(() => {
      const followUpMessage = {
        role: 'assistant',
        content: followUp.question,
        type: 'followup',
        options: followUp.options,
        stageId: stageId
      };
      addMessage(followUpMessage);
      setIsTyping(false);
    }, 800);
  };

  const handleOptionSelect = async (option, stageId) => {
    if (selectedOption) return; // Prevent double selection
    setSelectedOption(option.value);

    // Add user response
    const userMessage = {
      role: 'user',
      content: option.label,
      type: 'selection',
      stageId: stageId
    };
    addMessage(userMessage);

    // Update blueprint
    setSchoolBlueprint(prev => {
      const updated = { ...prev };

      if (stageId === 'ticket_type') {
        updated.ticketType = option.value;
        // Store the selected price range if this is a follow-up selection
        if (showFollowUp) {
          updated.pricingModel = option.label;
        }
      } else if (stageId === 'format') {
        updated.format = option.value;
      } else if (stageId === 'modules') {
        updated.modulesCount = option.value === 'custom' ? 8 : parseInt(option.value);
      } else if (stageId === 'community') {
        updated.communityEnabled = option.value !== 'none';
        updated.communityType = option.value;
      }

      return updated;
    });

    setIsTyping(true);
    setSelectedOption(null);

    // Check if this option has a follow-up (only for main options, not follow-up options)
    if (option.followUp && !showFollowUp) {
      setTimeout(() => {
        presentFollowUp(option.followUp, stageId);
      }, 800);
      return;
    }

    // If this is a follow-up selection, move to next stage
    if (showFollowUp) {
      setTimeout(() => {
        setShowFollowUp(false);
        const nextStage = currentStageIndex + 1;
        if (nextStage < INTERVIEW_STAGES.length) {
          setCurrentStageIndex(nextStage);
          presentStageQuestion(nextStage);
        } else {
          completeInterview();
        }
      }, 800);
      return;
    }

    // Move to next stage or complete (for normal options without follow-up)
    setTimeout(() => {
      const nextStage = currentStageIndex + 1;

      if (nextStage < INTERVIEW_STAGES.length) {
        setCurrentStageIndex(nextStage);
        setShowFollowUp(false);
        presentStageQuestion(nextStage);
      } else {
        completeInterview();
      }
    }, 1200);
  };

  const completeInterview = () => {
    setIsCompleted(true);

    const pricingInfo = schoolBlueprint.pricingModel
      ? ` con rango de precios de **${schoolBlueprint.pricingModel}**`
      : '';

    const completionMessage = {
      role: 'assistant',
      content: `¡Excelente! Tengo toda la información necesaria. 🎉\n\nBasado en tus respuestas, voy a generar una estructura personalizada para tu academia de **${schoolBlueprint.ticketType === 'high-ticket' ? 'alto valor' : 'alto volumen'}**${pricingInfo}.`,
      type: 'complete'
    };
    addMessage(completionMessage);

    // Save to sessionStorage for next page
    sessionStorage.setItem('schoolBlueprint', JSON.stringify(schoolBlueprint));
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date()
    }]);
  };

  const handleGenerate = () => {
    toast.success('Iniciando generación de tu academia...', {
      description: 'Esto tomará solo unos segundos',
      duration: 2000
    });

    setTimeout(() => {
      navigate('/onboarding/generate', {
        state: { schoolBlueprint }
      });
    }, 500);
  };

  // ============================================
  // CALCULATIONS
  // ============================================
  const progress = isCompleted ? 100 : ((currentStageIndex + 1) / INTERVIEW_STAGES.length) * 100;

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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl h-screen flex flex-col">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {getInitials(schoolBlueprint.schoolName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-white">
                {schoolBlueprint.schoolName || 'Tu Academia'}
              </h1>
              <p className="text-sm text-slate-400">Configuración con IA</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Asistente activo</span>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* PROGRESS BAR */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">
              {isCompleted ? 'Configuración completa' : `Pregunta ${currentStageIndex + 1} de ${INTERVIEW_STAGES.length}`}
            </span>
            <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800/50" />
        </motion.div>

        {/* ============================================ */}
        {/* CHAT AREA */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col gap-4 overflow-hidden"
        >
          <Card className="flex-1 border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "flex gap-3",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className="w-10 h-10 flex-shrink-0 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={cn(
                          "max-w-[85%] rounded-2xl",
                          message.role === 'user'
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-3"
                            : "bg-slate-800/50 border border-slate-700/50 p-5"
                        )}>
                          {/* Message content */}
                          {message.description && (
                            <p className="text-slate-400 text-sm mb-2">{message.description}</p>
                          )}

                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                          </p>

                          {/* Options / Quick Replies */}
                          {message.options && (
                            <div className="mt-4 space-y-2">
                              {message.options.map((option, idx) => (
                                <motion.button
                                  key={idx}
                                  onClick={() => handleOptionSelect(option, message.stageId)}
                                  disabled={selectedOption !== null}
                                  whileHover={{ scale: 1.01, x: 4 }}
                                  whileTap={{ scale: 0.99 }}
                                  className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all duration-200",
                                    "bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50 hover:border-purple-500/50",
                                    "disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                  )}
                                >
                                  {/* Selection indicator */}
                                  {selectedOption === option.value && (
                                    <div className="absolute inset-0 bg-purple-500/10 border border-purple-500/30 rounded-xl" />
                                  )}

                                  <div className="relative flex items-start gap-3">
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="font-medium text-white text-sm">{option.label}</p>
                                        {selectedOption === option.value && (
                                          <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        )}
                                      </div>
                                      {option.description && (
                                        <p className="text-slate-400 text-xs mt-1">{option.description}</p>
                                      )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" />
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>

                        {message.role === 'user' && (
                          <Avatar className="w-10 h-10 flex-shrink-0 mt-1">
                            <AvatarFallback className="bg-slate-700 text-white">
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4">
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="w-2.5 h-2.5 rounded-full bg-purple-400"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                            className="w-2.5 h-2.5 rounded-full bg-purple-400"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                            className="w-2.5 h-2.5 rounded-full bg-purple-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* ============================================ */}
          {/* GENERATE BUTTON (shows when complete) */}
          {/* ============================================ */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex gap-3"
              >
                <Button
                  onClick={handleGenerate}
                  size="lg"
                  className={cn(
                    "flex-1 h-14 text-base font-semibold",
                    "bg-gradient-to-r from-purple-600 to-blue-600",
                    "hover:from-purple-700 hover:to-blue-700",
                    "shadow-lg shadow-purple-500/25"
                  )}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generar mi escuela ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  onClick={() => {
                    sessionStorage.removeItem('schoolBlueprint');
                    navigate('/onboarding/create-school');
                  }}
                  variant="outline"
                  size="lg"
                  className="h-14 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
                >
                  Empezar de nuevo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
