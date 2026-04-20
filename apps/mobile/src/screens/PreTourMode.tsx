import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickWin } from '@/types';
import { useAppDispatch } from '../store/hooks';
import { fetchQuickWins } from '../store/slices/contentSlice';

export default function PreTourModeScreen() {
  const dispatch = useAppDispatch();
  const [quickWin, setQuickWin] = useState<QuickWin | null>(null);

  useEffect(() => {
    const loadRandomQuickWin = async () => {
      try {
        const quickWins = await dispatch(fetchQuickWins({ limit: 1 })).unwrap();
        if (quickWins.length > 0) {
          setQuickWin(quickWins[0]);
        }
      } catch (error) {
        console.error('Pre-tour quick win error:', error);
      }
    };

    loadRandomQuickWin();
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pre-Tour Mode</Text>
          <Text style={styles.subtitle}>A clean two-minute reset before stepping back on the floor.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb" size={24} color="#D4AF37" />
            <Text style={styles.cardTitle}>Mindset Affirmation</Text>
          </View>
          <Text style={styles.mindsetText}>
            I am calm, prepared, and ready to guide another family toward better vacations today.
          </Text>
        </View>

        {quickWin ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flash" size={24} color="#22C55E" />
              <Text style={styles.cardTitle}>Quick Win for Today</Text>
            </View>
            <Text style={styles.quickWinTitle}>{quickWin.title}</Text>
            <Text style={styles.quickWinOneLiner}>{quickWin.one_liner}</Text>

            <View style={styles.timingSection}>
              <Ionicons name="time" size={16} color="#94A3B8" />
              <Text style={styles.timingText}>{quickWin.timing}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Carry This Into Your Next Tour</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield" size={24} color="#F59E0B" />
            <Text style={styles.cardTitle}>Objection Prep</Text>
          </View>
          <Text style={styles.objectionText}>Most likely today: “It feels expensive.”</Text>
          <Text style={styles.responseText}>
            Start with empathy, then re-anchor the conversation around family use and memory value.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={24} color="#3B82F6" />
            <Text style={styles.cardTitle}>Today&apos;s Focus</Text>
          </View>
          <Text style={styles.goalText}>One strong presentation. One strong close. One strong follow-through.</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.startButton}>
          <Ionicons name="play" size={22} color="#020204" />
          <Text style={styles.startButtonText}>I&apos;m Ready for the Floor</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
  },
  mindsetText: {
    color: '#D4AF37',
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  quickWinTitle: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  quickWinOneLiner: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  timingSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timingText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
  },
  applyButtonText: {
    color: '#020204',
    fontSize: 15,
    fontWeight: '700',
  },
  objectionText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  responseText: {
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 21,
  },
  goalText: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 18,
  },
  startButtonText: {
    color: '#020204',
    fontSize: 17,
    fontWeight: '700',
  },
});
