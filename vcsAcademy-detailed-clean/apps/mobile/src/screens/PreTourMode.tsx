import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { fetchQuickWins } from '../store/slices/contentSlice';
import { QuickWin } from '@/types';

export default function PreTourModeScreen() {
  const dispatch = useAppDispatch();
  const [quickWin, setQuickWin] = useState<QuickWin | null>(null);

  useEffect(() => {
    loadRandomQuickWin();
  }, []);

  const loadRandomQuickWin = async () => {
    const result = await dispatch(fetchQuickWins({ limit: 1 }));
    if (result.payload && result.payload.length > 0) {
      setQuickWin(result.payload[0]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pre-Tour Mode</Text>
        <Text style={styles.subtitle}>2-minute prep before your tour</Text>
      </View>

      {/* Mindset Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bulb" size={24} color="#D4AF37" />
          <Text style={styles.cardTitle}>Mindset Affirmation</Text>
        </View>
        <Text style={styles.mindsetText}>
          "I am confident, prepared, and ready to help another family create lasting vacation memories today."
        </Text>
      </View>

      {/* Quick Win of the Day */}
      {quickWin && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash" size={24} color="#22c55e" />
            <Text style={styles.cardTitle}>Quick Win for Today</Text>
          </View>
          <Text style={styles.quickWinTitle}>{quickWin.title}</Text>
          <Text style={styles.quickWinOneLiner}>{quickWin.one_liner}</Text>

          <View style={styles.timingSection}>
            <Ionicons name="time" size={16} color="#94A3B8" />
            <Text style={styles.timingText}>{quickWin.timing}</Text>
          </View>

          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Objection Prep */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield" size={24} color="#F59E0B" />
          <Text style={styles.cardTitle}>Objection Prep</Text>
        </View>
        <Text style={styles.objectionText}>
          Most likely today: "It's too expensive"
        </Text>
        <Text style={styles.responseText}>
          Response: Focus on emotional value of family memories vs the cost
        </Text>
      </View>

      {/* Goal Reminder */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flag" size={24} color="#3B82F6" />
          <Text style={styles.cardTitle}>Today's Goal</Text>
        </View>
        <Text style={styles.goalText}>Close 1 deal today! You've got this! 💪</Text>
      </View>

      {/* Start Tour Button */}
      <TouchableOpacity style={styles.startButton}>
        <Ionicons name="play" size={24} color="#020204" />
        <Text style={styles.startButtonText}>Start Tour Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020204',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F1F5F9',
    fontFamily: 'Playfair Display',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1E293B',
    margin: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  mindsetText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#D4AF37',
    lineHeight: 28,
    fontFamily: 'Playfair Display',
  },
  quickWinTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  quickWinOneLiner: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 16,
  },
  timingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  timingText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  applyButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#020204',
  },
  objectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  goalText: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#D4AF37',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#020204',
  },
});
