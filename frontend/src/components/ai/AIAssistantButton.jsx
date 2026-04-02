import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Minimize2, Sparkles,
  TrendingUp, Award, Target, Zap, Clock, User,
  Bot, ChevronDown, Heart, Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API } from '@/App';
import axios from 'axios';

export const AIAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hola! Soy VCSA Coach, tu asistente personal de ventas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userContext, setUserContext] = useState(null);
  const scrollRef = useRef(null);

  // Formato de tiempo relativo
  const formatTimestamp = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return date.toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener contexto del usuario para quick actions inteligentes
  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        const response = await axios.get(`${API}/financial/goals/current`, { withCredentials: true });
        if (response.data.success && response.data.data) {
          setUserContext(response.data.data);
        }
      } catch (error) {
        console.log('No se pudo obtener contexto del usuario');
      }
    };

    if (isOpen) {
      fetchUserContext();
    }
  }, [isOpen]);

  // Quick actions inteligentes basados en contexto
  const getQuickActions = () => {
    const baseActions = [
      { icon: TrendingUp, text: '¿Cómo voy en mis metas?', color: 'from-blue-500/20 to-blue-600/20' },
      { icon: Lightbulb, text: 'Dame un consejo de ventas', color: 'from-yellow-500/20 to-yellow-600/20' },
      { icon: Target, text: '¿Qué debo hacer hoy?', color: 'from-green-500/20 to-green-600/20' },
      { icon: Zap, text: 'Ayúdame a mantenerme motivado', color: 'from-purple-500/20 to-purple-600/20' }
    ];

    // Personalizar basado en contexto si está disponible
    if (userContext) {
      const { sales_needed = 15, income_gap = 0 } = userContext;

      if (income_gap > 5000) {
        return [
          { icon: Target, text: `Plan para recuperar $${(income_gap/1000).toFixed(1)}k`, color: 'from-red-500/20 to-red-600/20' },
          { icon: TrendingUp, text: 'Consejos de cierre rápido', color: 'from-orange-500/20 to-orange-600/20' },
          { icon: Award, text: 'Estrategias para hoy', color: 'from-blue-500/20 to-blue-600/20' },
          { icon: Zap, text: 'Motivación extra', color: 'from-purple-500/20 to-purple-600/20' }
        ];
      }
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setMessage('');
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API}/assistant/chat`,
        {
          message: userMessage,
          conversation_history: messages.slice(-10).map(({ timestamp, ...msg }) => msg)
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const assistantResponse = response.data.data.response;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date()
        }]);
        setConversationId(response.data.data.conversation_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action.text);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={toggleOpen}
            size="lg"
            className="h-16 w-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B4942D] text-white shadow-2xl hover:shadow-[#D4AF37]/50 border-2 border-white/20 relative"
          >
            <MessageCircle className="w-8 h-8" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center p-0 animate-pulse">
                {unreadCount}
              </Badge>
            )}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-xs px-3 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
              VCSA Coach
            </span>
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="bg-gradient-to-br from-[#020204] to-[#0a0a0f] border-2 border-[#D4AF37]/30 shadow-2xl">
              {/* Header */}
              <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B4942D] rounded-full flex items-center justify-center shadow-lg"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg font-bold text-[#D4AF37] font-['Playfair_Display']">
                        VCSA Coach
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xs text-[#94A3B8]">En línea • Listo para ayudarte</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-[#94A3B8] hover:text-white h-8 w-8 p-0"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleOpen}
                      className="text-[#94A3B8] hover:text-[#EF4444] h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <CardContent className="p-4">
                    <ScrollArea className="h-[380px] pr-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((msg, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex flex-col max-w-[85%]">
                              <div
                                className={`rounded-2xl px-4 py-3 relative ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B4942D] text-black shadow-lg'
                                    : 'bg-gradient-to-br from-white/10 to-white/5 text-[#F8FAFC] border border-white/10 backdrop-blur-sm'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  {msg.role === 'assistant' && (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Bot className="w-3 h-3 text-[#D4AF37]" />
                                    </div>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed flex-1">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1 px-1">
                                {msg.role === 'assistant' && (
                                  <>
                                    <Bot className="w-3 h-3 text-[#D4AF37]/50" />
                                    <span className="text-[10px] text-[#94A3B8]">VCSA Coach</span>
                                  </>
                                )}
                                {msg.role === 'user' && (
                                  <>
                                    <User className="w-3 h-3 text-[#D4AF37]/50" />
                                    <span className="text-[10px] text-[#94A3B8]">Tú</span>
                                  </>
                                )}
                                <span className="text-[10px] text-[#64748B]">•</span>
                                <Clock className="w-3 h-3 text-[#64748B]" />
                                <span className="text-[10px] text-[#64748B]">{formatTimestamp(msg.timestamp)}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {/* Enhanced Typing Indicator */}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                          >
                            <div className="flex flex-col max-w-[85%]">
                              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl px-4 py-3 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B4942D]/20 flex items-center justify-center">
                                    <Bot className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-[#94A3B8] mr-2">VCSA Coach está escribiendo</span>
                                    <div className="flex gap-1">
                                      <motion.div
                                        className="w-2 h-2 bg-[#D4AF37] rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                                      />
                                      <motion.div
                                        className="w-2 h-2 bg-[#D4AF37] rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                                      />
                                      <motion.div
                                        className="w-2 h-2 bg-[#D4AF37] rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Smart Quick Actions */}
                    {messages.length <= 1 && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[#94A3B8]">Preguntas sugeridas:</p>
                          {userContext && (
                            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 text-[10px]">
                              Personalizado
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickAction(action)}
                                  className={`w-full justify-start text-left h-auto py-3 px-4 bg-gradient-to-r ${action.color} border-white/10 hover:border-[#D4AF37]/50 hover:shadow-lg transition-all`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-4 h-4 text-[#D4AF37]" />
                                    </div>
                                    <span className="text-[#F8FAFC] text-xs font-medium">
                                      {action.text}
                                    </span>
                                  </div>
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Input Area */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Escribe tu mensaje..."
                          disabled={isLoading}
                          className="bg-black/50 border-white/10 text-white placeholder:text-[#94A3B8] focus:border-[#D4AF37]/50 pr-10"
                        />
                        {message.length > 0 && (
                          <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 text-[10px]">
                            {message.length}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="icon"
                        onClick={() => sendMessage(message)}
                        disabled={isLoading || !message.trim()}
                        className="bg-gradient-to-br from-[#D4AF37] to-[#B4942D] hover:from-[#C49427] hover:to-[#A3843D] text-black h-10 w-10 shadow-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-[#94A3B8]">
                        Powered by Ollama AI • Con acceso a tu información y metas
                      </p>
                      {isLoading && (
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 text-[10px] animate-pulse">
                          Procesando...
                        </Badge>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};