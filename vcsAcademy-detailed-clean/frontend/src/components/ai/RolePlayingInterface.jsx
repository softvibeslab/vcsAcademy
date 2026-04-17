import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle, Send, Target, Award, Clock,
  Play, RotateCcw, TrendingUp, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RolePlayingInterface = ({ user }) => {
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch('/api/ai-assistant/roleplay/scenarios?difficulty=intermediate', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setScenarios(data.scenarios);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const startScenario = async (scenario) => {
    try {
      setLoading(true);

      const response = await fetch('/api/ai-assistant/roleplay/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenario_id: scenario.scenario_id
        })
      });

      const data = await response.json();

      if (data.success) {
        setActiveScenario(scenario);
        setActiveSession(data.session_id);

        // Initialize with scenario description
        setMessages([
          {
            role: 'assistant',
            content: `🎯 **Escenario: ${scenario.objective}**\n\n${scenario.scenario_type === 'cold_call' ? 'El AI jugará el rol de un prospecto potencial. Tu objetivo es hacer una llamada en frío efectiva.' : 'El AI jugará el rol de un prospecto con objeciones. Tu objetivo es manejarlas profesionalmente.'}\n\n**Criterios de Éxito:**\n${scenario.success_criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n¡Comienza cuando estés listo!`
          }
        ]);
      }
    } catch (error) {
      console.error('Error starting scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = {
      role: 'user',
      content: userInput
    };

    setMessages([...messages, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-assistant/chat/enhanced', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userInput,
          conversation_history: [...messages, newMessage],
          scenario_id: activeScenario?.scenario_id,
          session_id: activeSession
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.response
        }]);

        // Check if scenario is complete
        if (data.data.feedback) {
          setFeedback(data.data.feedback);
          setPerformanceScore(data.data.performance_score);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetScenario = () => {
    setActiveScenario(null);
    setActiveSession(null);
    setMessages([]);
    setFeedback(null);
    setPerformanceScore(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getScenarioTypeLabel = (type) => {
    switch (type) {
      case 'cold_call': return 'Llamada en Frío';
      case 'objection_handling': return 'Manejo de Objeciones';
      case 'closing': return 'Cierre de Venta';
      default: return type;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!activeScenario ? (
        <>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#F1F5F9] flex items-center gap-2">
              <Target className="w-6 h-6 text-[#D4AF37]" />
              Role Playing & Simulaciones
            </h2>
            <p className="text-[#94A3B8] mt-1">Practica escenarios reales de ventas con AI</p>
          </div>

          {/* Scenarios Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.scenario_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 hover:border-[#D4AF37]/30 transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-[#F1F5F9] text-lg">
                          {getScenarioTypeLabel(scenario.scenario_type)}
                        </CardTitle>
                        <Badge className={getDifficultyColor(scenario.difficulty)}>
                          {getDifficultyLabel(scenario.difficulty)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-[#94A3B8] mb-2">Objetivo:</p>
                        <p className="text-[#F1F5F9]">{scenario.objective}</p>
                      </div>

                      <div>
                        <p className="text-sm text-[#94A3B8] mb-2">Criterios de Éxito:</p>
                        <ul className="space-y-1">
                          {scenario.success_criteria.map((criteria, idx) => (
                            <li key={idx} className="text-xs text-[#F1F5F9] flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5-10 min
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          AI: {scenario.aiplays_role}
                        </div>
                      </div>

                      <Button
                        onClick={() => startScenario(scenario)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B4942D] text-black font-semibold hover:opacity-90"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Escenario
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <>
          {/* Active Scenario Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[#F1F5F9]">
                  {getScenarioTypeLabel(activeScenario.scenario_type)}
                </h3>
                <Badge className={getDifficultyColor(activeScenario.difficulty)}>
                  {getDifficultyLabel(activeScenario.difficulty)}
                </Badge>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1">{activeScenario.objective}</p>
            </div>

            <Button
              onClick={resetScenario}
              variant="outline"
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Terminar
            </Button>
          </div>

          {/* Messages Area */}
          <Card className="flex-1 bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-4">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-[#D4AF37] to-[#B4942D] text-black'
                              : 'bg-[#0F172A] text-[#F1F5F9] border border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs opacity-70">
                              {msg.role === 'user' ? 'Tú' : '🤖 VCSA Coach'}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#0F172A] border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Performance Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#D4AF37] flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Feedback de Rendimiento
                    </h4>
                    {performanceScore && (
                      <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                        {performanceScore}/100
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#F1F5F9]">{feedback}</p>
                </motion.div>
              )}

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Tu respuesta..."
                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-lg px-4 py-2 text-[#F1F5F9] placeholder-[#94A3B8]"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !userInput.trim()}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B4942D] text-black font-semibold hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RolePlayingInterface;
