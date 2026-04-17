/**
 * VCSA V2 - AI Coach Chat Page
 * Interactive AI coaching chat interface
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TopAppBar from '../components/layout/TopAppBar';
import { GlassCard } from '../components/design';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const AICoachChat = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI Sales Coach. I'm here to help you improve your sales techniques, handle objections, and close more deals. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [quickPrompts] = useState([
    { id: 1, text: "How do I handle price objections?", category: 'Objections' },
    { id: 2, text: "What's the best way to build rapport?", category: 'Discovery' },
    { id: 3, text: "Help me close a stalled deal", category: 'Closing' },
    { id: 4, text: "Improve my presentation skills", category: 'Training' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API}/api/ai/chat/completions`,
        {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        },
        { withCredentials: true }
      );

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response.data.message || "I'm here to help! Could you tell me more about your specific situation?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Fallback responses for demo
      const fallbackResponses = [
        "Great question! When facing that situation, I recommend focusing on value rather than price. Would you like me to share some specific scripts?",
        "That's a common challenge. The key is to acknowledge their concern first, then pivot to the value proposition. Shall we practice some scenarios?",
        "Excellent topic! Let me break this down into three actionable steps you can implement right away..."
      ];

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#131317] navy-glow text-[#e5e1e8] flex flex-col">
      <TopAppBar title="AI Coach" subtitle="Your Personal Sales Assistant" />

      {/* Chat Container */}
      <main className="flex-1 pt-24 px-6 md:px-16 max-w-5xl mx-auto w-full flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full achievement-gradient flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#3c2f00] text-xl">
                        smart_toy
                      </span>
                    </div>
                  )}

                  <GlassCard
                    variant={message.role === 'user' ? 'elevated' : 'default'}
                    padding="lg"
                    className={`${
                      message.role === 'user'
                        ? 'bg-[#f2ca50]/10 border-[#f2ca50]/30'
                        : 'bg-[#1b1b20]/80'
                    }`}
                  >
                    <p className="text-[#e5e1e8] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <span className="text-xs text-[#d0c5af] mt-2 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </GlassCard>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-[#264191] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#9db2ff] text-xl">
                        person
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full achievement-gradient flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#3c2f00] text-xl">
                      smart_toy
                    </span>
                  </div>
                  <GlassCard variant="default" padding="lg" className="bg-[#1b1b20]/80">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#f2ca50] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#f2ca50] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#f2ca50] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-sm text-[#d0c5af] uppercase tracking-wider mb-3">
              Quick Start
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="px-4 py-2 bg-[#1b1b20] border border-[#4d4635]/10 rounded-lg text-sm text-[#e5e1e8] hover:border-[#f2ca50]/30 transition-colors"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <GlassCard variant="default" padding="lg" className="mb-8">
          <div className="flex items-end gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about sales, objections, closing techniques..."
              rows={1}
              className="flex-1 bg-[#131317] border border-[#4d4635]/10 rounded-lg py-3 px-4 text-[#e5e1e8] placeholder-[#d0c5af] focus:outline-none focus:border-[#f2ca50]/50 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || loading}
              className="px-6 py-3 achievement-gradient text-[#3c2f00] font-bold rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined">send</span>
              Send
            </button>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-[#d0c5af]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info</span>
              AI Coach uses advanced language models for sales coaching
            </span>
            <span className="text-[#4d4635]">•</span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </GlassCard>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard variant="default" padding="md">
            <span className="material-symbols-outlined text-[#f2ca50] text-2xl mb-2">
              lightning
            </span>
            <h3 className="text-sm font-bold text-[#e5e1e8] mb-1">Instant Responses</h3>
            <p className="text-xs text-[#d0c5af]">Get immediate answers to your sales questions</p>
          </GlassCard>

          <GlassCard variant="default" padding="md">
            <span className="material-symbols-outlined text-[#9db2ff] text-2xl mb-2">
              school
            </span>
            <h3 className="text-sm font-bold text-[#e5e1e8] mb-1">24/7 Availability</h3>
            <p className="text-xs text-[#d0c5af]">Your coach is always ready to help</p>
          </GlassCard>

          <GlassCard variant="default" padding="md">
            <span className="material-symbols-outlined text-[#c3cee6] text-2xl mb-2">
              trending_up
            </span>
            <h3 className="text-sm font-bold text-[#e5e1e8] mb-1">Personalized Tips</h3>
            <p className="text-xs text-[#d0c5af]">Tailored advice for your situation</p>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default AICoachChat;
