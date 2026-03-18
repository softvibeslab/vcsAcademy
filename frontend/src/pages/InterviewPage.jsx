/**
 * Interview Page - AI Assistant Onboarding
 *
 * Second step in the school creation flow.
 * Features an interactive AI chat interface to customize the academy.
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, ArrowRight, Home, Settings, Send, Sparkles, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// AI Message Types
const MESSAGE_TYPES = {
  GREETING: 'greeting',
  QUESTION: 'question',
  SUGGESTION: 'suggestion',
  CONFIRMATION: 'confirmation'
};

// Predefined AI conversation flow
const AI_CONVERSATION_FLOW = [
  {
    type: MESSAGE_TYPES.GREETING,
    content: "¡Hola! 👋 Soy tu Asistente IA. Estoy aquí para ayudarte a personalizar {schoolName} para que logres: {outcome}.",
    delay: 1000
  },
  {
    type: MESSAGE_TYPES.QUESTION,
    content: "Para empezar, ¿cuántos alumnos tendrás inicialmente en tu academia?",
    options: ["1-10 alumnos", "11-50 alumnos", "51-200 alumnos", "Más de 200 alumnos"],
    delay: 2000
  },
  {
    type: MESSAGE_TYPES.SUGGESTION,
    content: "Perfecto. Basado en tu respuesta, te recomiendo empezar con nuestro plan Enterprise, que incluye ilimitados alumnos y 500 llamadas mensuales al Asistente IA. ¿Te gustaría configurar esto ahora?",
    options: ["Sí, configurar ahora", "Prefiero explorar primero"],
    delay: 1500
  },
  {
    type: MESSAGE_TYPES.CONFIRMATION,
    content: "¡Excelente! Tu academia está configurada y lista para usar. 🎉 Puedes agregar contenido, personalizar el branding e invitar a tu equipo cuando quieras.",
    delay: 1000
  }
];

export default function InterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [schoolData, setSchoolData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    // Get school data from navigation state or sessionStorage
    const data = location.state?.schoolData || JSON.parse(sessionStorage.getItem('schoolData') || '{}');
    setSchoolData(data);

    if (!data.schoolName) {
      navigate('/onboarding/create-school');
      return;
    }

    // Start the conversation
    startConversation(data);
  }, [location.state, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startConversation = (data) => {
    setIsTyping(true);

    // Add first message with personalized content
    setTimeout(() => {
      const firstMessage = AI_CONVERSATION_FLOW[0];
      addMessage({
        role: 'assistant',
        content: firstMessage.content
          .replace('{schoolName}', data.schoolName)
          .replace('{outcome}', data.learningOutcome || 'mejores resultados'),
        type: firstMessage.type
      });
      setIsTyping(false);
      setCurrentStep(1);
    }, 1500);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);

    // Add user message
    addMessage({
      role: 'user',
      content: content.trim()
    });

    // Clear input
    setUserInput('');

    // Simulate AI response
    setTimeout(() => {
      handleAIResponse(content);
    }, 1000);
  };

  const handleAIResponse = (userMessage) => {
    setIsTyping(true);

    // Simple AI response logic (in real implementation, call actual AI API)
    setTimeout(() => {
      let responseContent = "Interesante. Basado en tu respuesta, te recomiendo explorar el dashboard para ver todas las opciones disponibles.";
      let options = null;

      // Simple keyword matching for demo
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('configurar') || lowerMessage.includes('sí')) {
        responseContent = "¡Perfecto! Voy a ayudarte con la configuración. ¿Qué aspecto te gustaría personalizar primero?";
        options = ["Branding (colores, logo)", "Contenido y módulos", "Configuración de equipo"];
      } else if (lowerMessage.includes('branding') || lowerMessage.includes('logo') || lowerMessage.includes('colores')) {
        responseContent = "Excelente elección. Puedes personalizar los colores, subir tu logo y definir la identidad visual de tu academia. Te llevaré a la configuración de branding.";
        options = ["Ir a configuración de branding", "Seguir en el chat"];
      } else if (lowerMessage.includes('contenido') || lowerMessage.includes('módulos')) {
        responseContent = "El contenido es fundamental. Tienes acceso a 36 módulos de entrenamiento, 15 análisis de casos y 20 tácticas rápidas. Puedes personalizarlos o crear los tuyos.";
        options = ["Explorar contenido", "Volver al dashboard"];
      } else if (lowerMessage.includes('explorar') || lowerMessage.includes('dashboard')) {
        responseContent = "¡Genial! Tu academia está lista. Puedes acceder al dashboard para empezar a explorar todas las funcionalidades.";
        options = ["Ir al Dashboard", "Configurar Branding"];
      }

      addMessage({
        role: 'assistant',
        content: responseContent,
        type: MESSAGE_TYPES.QUESTION,
        options: options
      });

      setIsTyping(false);
      setIsSending(false);
      setCurrentStep(prev => prev + 1);
    }, 1500);
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {schoolData && getInitials(schoolData.schoolName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-white">
                {schoolData?.schoolName || 'Tu Academia'}
              </h1>
              <p className="text-sm text-slate-400">Asistente IA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>En línea</span>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col gap-4"
        >
          <Card className="flex-1 border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl flex flex-col">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Configuración con IA
              </CardTitle>
              <CardDescription>
                Tu asistente te guiará para personalizar tu academia
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
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
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === 'user'
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "bg-slate-800/50 border border-slate-700/50 text-slate-100"
                        )}>
                          <p className="text-sm leading-relaxed">{message.content}</p>

                          {message.options && (
                            <div className="mt-3 space-y-2">
                              {message.options.map((option, index) => (
                                <Button
                                  key={index}
                                  onClick={() => handleOptionClick(option)}
                                  size="sm"
                                  variant="ghost"
                                  className="w-full justify-start text-left h-auto py-2 px-3 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white text-xs"
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>

                        {message.role === 'user' && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-slate-700 text-white text-xs">
                              <User className="w-4 h-4" />
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
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-slate-800/50 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(userInput);
                  }}
                  className="flex gap-2"
                >
                  <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isSending}
                    className="flex-1 bg-slate-800/50 border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <Button
                    type="submit"
                    disabled={!userInput.trim() || isSending}
                    size="icon"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Dashboard
          </Button>

          <Button
            onClick={() => navigate(`/onboarding/${schoolData?.schoolId}`)}
            variant="outline"
            className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Branding
          </Button>

          <Button
            onClick={() => navigate('/settings/organization')}
            variant="outline"
            className="h-12 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Configuración Avanzada
          </Button>
        </motion.div>
      </div>
    </div>
  );
}