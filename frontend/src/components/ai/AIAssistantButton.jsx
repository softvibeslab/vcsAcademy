import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Minimize2, Sparkles,
  TrendingUp, Award, Target, Zap
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
      content: '👋 Hola! Soy VCSA Coach, tu asistente personal de ventas. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef(null);

  const suggestedQuestions = [
    '¿Cómo voy en mis metas?',
    'Dame un consejo de ventas',
    '¿Qué debo hacer hoy?',
    'Ayúdame a mantenerme motivado'
  ];

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
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API}/assistant/chat`,
        {
          message: userMessage,
          conversation_history: messages.slice(-10) // Last 10 messages for context
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const assistantResponse = response.data.data.response;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantResponse
        }]);
        setConversationId(response.data.data.conversation_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.'
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

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
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
              <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center p-0">
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
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="bg-gradient-to-br from-[#020204] to-[#0a0a0f] border-2 border-[#D4AF37]/30 shadow-2xl">
              {/* Header */}
              <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B4942D] rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-[#D4AF37] font-['Playfair_Display']">
                        VCSA Coach
                      </CardTitle>
                      <p className="text-xs text-[#94A3B8]">Tu asistente personal de ventas</p>
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
                    <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
                      <div className="space-y-4">
                        {messages.map((msg, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                msg.role === 'user'
                                  ? 'bg-[#D4AF37] text-black'
                                  : 'bg-white/10 text-[#F8FAFC] border border-white/10'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.content}
                              </p>
                            </div>
                          </motion.div>
                        ))}

                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                          >
                            <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
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

                    {/* Suggested Questions */}
                    {messages.length <= 1 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-[#94A3B8] mb-2">Preguntas sugeridas:</p>
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuggestedQuestion(question)}
                            className="w-full justify-start text-left h-auto py-2 px-3 bg-white/5 border-white/10 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 text-[#F8FAFC] text-xs"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  {/* Input */}
                  <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        disabled={isLoading}
                        className="flex-1 bg-black/50 border-white/10 text-white placeholder:text-[#94A3B8] focus:border-[#D4AF37]/50"
                      />
                      <Button
                        size="icon"
                        onClick={() => sendMessage(message)}
                        disabled={isLoading || !message.trim()}
                        className="bg-[#D4AF37] hover:bg-[#B4942D] text-black h-10 w-10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-2 text-center">
                      Powered by Claude AI • Con acceso a tu información y metas
                    </p>
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
