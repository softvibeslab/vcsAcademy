/**
 * AI Assistant Settings Section
 *
 * Configure AI-powered customization assistant
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

export default function AIAssistantSection({ organization, onSave, saving }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you customize your ${organization.name} academy. Try asking me to:\n\n• "Make it look more professional"\n• "Change the colors to blue"\n• "Enable gamification"\n• "What features should I enable?"`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedChanges, setSuggestedChanges] = useState([]);
  const [applyingChange, setApplyingChange] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      const response = await fetch(
        `${backendUrl}/api/organizations/${organization.organization_id}/ai/suggest`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);

      if (data.changes && data.changes.length > 0) {
        setSuggestedChanges(data.changes);
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please make sure the AI assistant is enabled and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applyChange = async (change) => {
    setApplyingChange(change.id);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      await fetch(
        `${backendUrl}/api/organizations/${organization.organization_id}/ai/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            change,
            conversation_id: 'current', // In real implementation, track conversation ID
          }),
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✓ Applied: ${change.field} updated to "${change.value}"`,
        },
      ]);

      setSuggestedChanges((prev) => prev.filter((c) => c.id !== change.id));
    } catch (error) {
      console.error('Error applying change:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to apply change. Please try again.' },
      ]);
    } finally {
      setApplyingChange(null);
    }
  };

  const isEnabled = organization.settings?.enable_ai_assistant ?? true;

  if (!isEnabled) {
    return (
      <div className="p-12 text-center">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-heading font-bold mb-2">AI Assistant Disabled</h2>
        <p className="text-muted-foreground mb-6">
          Enable the AI Assistant in the Features tab to use this functionality.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-primary" />
          AI Assistant
        </h2>
        <p className="text-muted-foreground">
          Customize your academy using natural language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 rounded-xl border border-border/50 bg-background/50 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent/10'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me to customize your academy..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Suggested Changes */}
        <div className="space-y-4">
          <h3 className="font-semibold">Suggested Changes</h3>

          {suggestedChanges.length > 0 ? (
            <div className="space-y-3">
              {suggestedChanges.map((change) => (
                <div
                  key={change.id}
                  className="p-4 rounded-lg border border-border/50 bg-background/50"
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {change.type} • {change.field}
                  </div>
                  <div className="font-medium text-sm mb-2">
                    Change to: <code className="text-primary">{change.value}</code>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {change.reason}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round(change.confidence * 100)}%
                    </div>
                    <button
                      onClick={() => applyChange(change)}
                      disabled={applyingChange === change.id}
                      className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {applyingChange === change.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed border-border text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Ask the AI assistant to suggest changes, and they'll appear here
              </p>
            </div>
          )}

          {/* Example Prompts */}
          <div className="p-4 rounded-lg bg-accent/5 border border-border/50">
            <h4 className="font-medium text-sm mb-2">Try asking:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• "Make it look more professional"</li>
              <li>• "Change the colors to blue"</li>
              <li>• "Enable all gamification features"</li>
              <li>• "What should I set for a sales team?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
