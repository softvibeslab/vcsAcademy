import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMessage, generateCoachingResponse, setListening } from '../store/slices/aiCoachSlice';

export default function AICoachChatScreen() {
  const dispatch = useAppDispatch();
  const { messages, isLoading, isListening, currentResponse, suggestions } = useAppSelector(
    (state) => state.aiCoach
  );
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    dispatch(
      addMessage({
        id: `msg_${Date.now()}`,
        role: 'user',
        content: inputText,
        timestamp: new Date().toISOString(),
      })
    );

    const userInput = inputText;
    setInputText('');

    try {
      await dispatch(
        generateCoachingResponse({
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
        })
      );
    } catch (error) {
      console.error('AI Coach error:', error);
    }
  };

  const handleVoiceInput = () => {
    dispatch(setListening(!isListening));

    setTimeout(() => {
      dispatch(setListening(false));
      setInputText("They say it's too expensive and they need to think about it");
    }, 3000);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="chatbubbles" size={28} color="#D4AF37" />
            <View>
              <Text style={styles.headerTitle}>AI Coach</Text>
              <Text style={styles.headerSubtitle}>Real-time sales guidance</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isLoading ? '#F59E0B' : '#22C55E' }]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{isLoading ? 'Thinking...' : 'Ready'}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Ionicons name="sparkles" size={48} color="#D4AF37" />
              <Text style={styles.welcomeTitle}>Ask AI Coach</Text>
              <Text style={styles.welcomeText}>
                Get instant guidance on objections, closing techniques, and more.
              </Text>

              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Try asking:</Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={`${suggestion}-${index}`}
                    style={styles.suggestionPill}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              {message.role === 'assistant' ? (
                <View style={styles.assistantIcon}>
                  <Ionicons name="chatbubbles" size={20} color="#D4AF37" />
                </View>
              ) : null}

              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{message.content}</Text>

                {message.suggestions && message.suggestions.length > 0 ? (
                  <View style={styles.messageSuggestions}>
                    {message.suggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={`${message.id}-${index}`}
                        style={styles.messageSuggestion}
                        onPress={() => handleSuggestionPress(suggestion)}
                      >
                        <Text style={styles.messageSuggestionText}>→ {suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          ))}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          ) : null}
        </ScrollView>

        {currentResponse ? (
          <View style={styles.responseDetails}>
            <View style={styles.responseDetailItem}>
              <Ionicons name="bulb" size={16} color="#D4AF37" />
              <Text numberOfLines={2} style={styles.responseDetailText}>
                {currentResponse.key_move}
              </Text>
            </View>
            <View style={styles.responseDetailItem}>
              <Ionicons
                name="trending-up"
                size={16}
                color={currentResponse.estimated_impact === 'high' ? '#22C55E' : '#F59E0B'}
              />
              <Text style={styles.responseDetailText}>
                {currentResponse.estimated_impact} impact
              </Text>
            </View>
          </View>
        ) : null}

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
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={22} color="#020204" />
          </TouchableOpacity>
        </View>

        {isListening ? (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>Listening... tap again to stop.</Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020204',
  },
  container: {
    flex: 1,
    backgroundColor: '#020204',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: 12,
  },
  headerTitle: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusDot: {
    backgroundColor: '#F1F5F9',
    borderRadius: 99,
    height: 8,
    width: 8,
  },
  statusText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '700',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  welcomeTitle: {
    color: '#F1F5F9',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  welcomeText: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  suggestionsContainer: {
    gap: 8,
    marginTop: 24,
    width: '100%',
  },
  suggestionsTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  suggestionPill: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionText: {
    color: '#F1F5F9',
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '88%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  assistantIcon: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
    width: 32,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 22,
  },
  messageSuggestions: {
    gap: 4,
    marginTop: 8,
  },
  messageSuggestion: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageSuggestionText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typingIndicator: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDot: {
    backgroundColor: '#D4AF37',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  responseDetails: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  responseDetailItem: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  responseDetailText: {
    color: '#F1F5F9',
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  inputArea: {
    alignItems: 'flex-end',
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  input: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 20,
    borderWidth: 1,
    color: '#F1F5F9',
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  voiceButton: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderColor: '#D4AF37',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  voiceButtonActive: {
    backgroundColor: '#7F1D1D',
    borderColor: '#EF4444',
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sendButtonActive: {
    backgroundColor: '#D4AF37',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  listeningIndicator: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  listeningText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
