import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addMessage, generateCoachingResponse, setListening, clearError } from '../store/slices/aiCoachSlice';

export default function AICoachChatScreen() {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isListening, currentResponse, suggestions } = useAppSelector((state) => state.aiCoach);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add user message
    dispatch(addMessage({
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    }));

    const userInput = inputText;
    setInputText('');

    // Generate AI response
    try {
      await dispatch(generateCoachingResponse({
        input_type: 'text',
        content: userInput,
        context: {
          client_type: 'family',
          tour_number: 1,
          time_constraint: 120,
        },
        preference: {
          tone: 'motivational',
          length: 'medium',
        },
      }));
    } catch (error) {
      console.error('AI Coach error:', error);
    }
  };

  const handleVoiceInput = () => {
    dispatch(setListening(!isListening));

    // TODO: Implement voice input
    setTimeout(() => {
      dispatch(setListening(false));
      setInputText("They say it's too expensive and they need to think about it");
    }, 3000);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="chatbubbles" size={28} color="#D4AF37" />
          <View>
            <Text style={styles.headerTitle}>AI Coach</Text>
            <Text style={styles.headerSubtitle}>Real-time sales guidance</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isLoading ? '#F59E0B' : '#22c55e' }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{isLoading ? 'Thinking...' : 'Ready'}</Text>
        </View>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Ionicons name="sparkles" size={48} color="#D4AF37" />
            <Text style={styles.welcomeTitle}>Ask AI Coach</Text>
            <Text style={styles.welcomeText}>
              Get instant guidance on objections, closing techniques, and more
            </Text>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Try asking:</Text>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionPill}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.assistantIcon}>
                <Ionicons name="chatbubbles" size={20} color="#D4AF37" />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{message.content}</Text>
              {message.suggestions && message.suggestions.length > 0 && (
                <View style={styles.messageSuggestions}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.messageSuggestion}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={styles.messageSuggestionText}>→ {suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, { backgroundColor: '#D4AF37' }]} />
              <View style={[styles.typingDot, { backgroundColor: '#D4AF37' }]} />
              <View style={[styles.typingDot, { backgroundColor: '#D4AF37' }]} />
            </View>
          </View>
        )}
      </View>

      {/* Response Details */}
      {currentResponse && (
        <View style={styles.responseDetails}>
          <View style={styles.responseDetailItem}>
            <Ionicons name="bulb" size={16} color="#D4AF37" />
            <Text style={styles.responseDetailText}>{currentResponse.key_move}</Text>
          </View>
          <View style={styles.responseDetailItem}>
            <Ionicons name="trending-up" size={16} color={currentResponse.estimated_impact === 'high' ? '#22c55e' : '#F59E0B'} />
            <Text style={styles.responseDetailText}>{currentResponse.estimated_impact} impact</Text>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask AI Coach..."
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={handleVoiceInput}
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={24}
            color={isListening ? '#EF4444' : '#D4AF37'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons name="send" size={24} color="#020204" />
        </TouchableOpacity>
      </View>

      {isListening && (
        <View style={styles.listeningIndicator}>
          <Text style={styles.listeningText}>🎤 Listening... (tap to stop)</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020204',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F1F5F9',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F1F5F9',
    marginTop: 16,
    fontFamily: 'Playfair Display',
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
  suggestionsContainer: {
    marginTop: 24,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 12,
  },
  suggestionPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionText: {
    fontSize: 14,
    color: '#F1F5F9',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  assistantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#F1F5F9',
    lineHeight: 24,
  },
  messageSuggestions: {
    marginTop: 8,
    gap: 4,
  },
  messageSuggestion: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  messageSuggestionText: {
    fontSize: 14,
    color: '#D4AF37',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  responseDetails: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  responseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  responseDetailText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F1F5F9',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#1E293B',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F1F5F9',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  voiceButtonActive: {
    backgroundColor: '#7F1D1D',
    borderColor: '#EF4444',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#D4AF37',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  listeningIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  listeningText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});
