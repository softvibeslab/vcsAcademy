import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getDemoDailyGoal,
  getDemoGoalSheet,
  getDemoPracticeSummary,
  getDemoProgressState,
} from '../demo/progress';
import { RootStackParamList } from '../types';

type MoreHubNavigationProp = StackNavigationProp<RootStackParamList>;

const tools: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  route: keyof Omit<RootStackParamList, 'Login' | 'MainTabs' | 'Profile'>;
  color: string;
}> = [
  {
    icon: 'trophy',
    title: 'Pre-Tour Mode',
    description: 'Two-minute floor prep with mindset, objection focus, and a quick win.',
    route: 'PreTourMode',
    color: '#D4AF37',
  },
  {
    icon: 'clipboard',
    title: 'Post-Tour Debrief',
    description: 'Capture objections, confidence swings, and lessons while they are fresh.',
    route: 'PostTourDebrief',
    color: '#3B82F6',
  },
  {
    icon: 'cash',
    title: 'Goal Sheet',
    description: 'Track earnings, pace, and the number that matters before the month closes.',
    route: 'GoalSheet',
    color: '#22C55E',
  },
  {
    icon: 'school',
    title: 'Play Role',
    description: 'Practice common scenarios with guided feedback before your next tour.',
    route: 'PlayRole',
    color: '#A855F7',
  },
];

type HubSummary = {
  toursCompleted: number;
  toursGoal: number;
  salesClosed: number;
  practiceSessions: number;
  averageScore: number;
  income: number;
  coursesOpened: number;
  streak: number;
};

export default function MoreHubScreen() {
  const navigation = useNavigation<MoreHubNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<HubSummary | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      const loadSummary = async () => {
        setLoading(true);

        try {
          const [dailyGoal, practiceSummary, goalSheet, progressState] = await Promise.all([
            getDemoDailyGoal(),
            getDemoPracticeSummary(),
            getDemoGoalSheet(),
            getDemoProgressState(),
          ]);

          if (!active) {
            return;
          }

          setSummary({
            toursCompleted: dailyGoal.progress.tours_completed,
            toursGoal: dailyGoal.goals.tours,
            salesClosed: dailyGoal.progress.sales_closed,
            practiceSessions: practiceSummary.weeklySessions,
            averageScore: practiceSummary.averageScore,
            income: goalSheet.currentEarnings,
            coursesOpened: progressState.coursesOpened.length,
            streak: goalSheet.streak.current,
          });
        } catch (error) {
          console.error('More hub summary load error:', error);

          if (active) {
            setSummary(null);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadSummary();

      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>More Tools</Text>
          <Text style={styles.subtitle}>
            The Android-friendly home for prep, practice, debriefs, and deeper tracking.
          </Text>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planEyebrow}>Suggested Flow</Text>
          <Text style={styles.planTitle}>Prep, present, reflect, improve.</Text>
          <Text style={styles.planCopy}>
            Start with Pre-Tour Mode, use AI Coach on the floor, log a Debrief right after,
            and finish the day by checking your Goal Sheet.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Demo Progress</Text>
            {loading ? <ActivityIndicator color="#D4AF37" size="small" /> : null}
          </View>

          {summary ? (
            <>
              <View style={styles.summaryGrid}>
                <SummaryPill
                  accent="#D4AF37"
                  icon="walk"
                  label="Tours Today"
                  value={`${summary.toursCompleted}/${summary.toursGoal}`}
                />
                <SummaryPill
                  accent="#22C55E"
                  icon="cash"
                  label="Sales Closed"
                  value={`${summary.salesClosed}`}
                />
                <SummaryPill
                  accent="#3B82F6"
                  icon="school"
                  label="Practice 7d"
                  value={`${summary.practiceSessions}`}
                />
                <SummaryPill
                  accent="#A855F7"
                  icon="play-circle"
                  label="Courses Opened"
                  value={`${summary.coursesOpened}`}
                />
              </View>

              <View style={styles.highlightRow}>
                <View style={styles.highlightItem}>
                  <Text style={styles.highlightLabel}>Average Roleplay Score</Text>
                  <Text style={styles.highlightValue}>{summary.averageScore.toFixed(1)}</Text>
                </View>
                <View style={styles.highlightDivider} />
                <View style={styles.highlightItem}>
                  <Text style={styles.highlightLabel}>Current Earnings</Text>
                  <Text style={styles.highlightValue}>${summary.income.toLocaleString()}</Text>
                </View>
                <View style={styles.highlightDivider} />
                <View style={styles.highlightItem}>
                  <Text style={styles.highlightLabel}>Streak</Text>
                  <Text style={styles.highlightValue}>{summary.streak} days</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.summaryFallback}>
              Open the tools below to start building demo progress for this rep.
            </Text>
          )}
        </View>

        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.title}
              activeOpacity={0.85}
              onPress={() =>
                tool.route === 'PostTourDebrief'
                  ? navigation.navigate('PostTourDebrief')
                  : navigation.navigate(tool.route)
              }
              style={styles.toolCard}
            >
              <View style={[styles.toolIcon, { backgroundColor: `${tool.color}20` }]}>
                <Ionicons name={tool.icon} size={24} color={tool.color} />
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
              <View style={styles.toolFooter}>
                <Text style={[styles.toolLink, { color: tool.color }]}>Open tool</Text>
                <Ionicons name="arrow-forward" size={16} color={tool.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryPill({
  accent,
  icon,
  label,
  value,
}: {
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryPill}>
      <View style={[styles.summaryIcon, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon} size={16} color={accent} />
      </View>
      <Text style={styles.summaryPillLabel}>{label}</Text>
      <Text style={styles.summaryPillValue}>{value}</Text>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
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
    marginTop: 8,
  },
  planCard: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  planEyebrow: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  planTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  planCopy: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
  },
  summaryCard: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  summaryTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  summaryPill: {
    backgroundColor: '#111827',
    borderColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    minWidth: '47%',
    padding: 14,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    marginBottom: 10,
    width: 30,
  },
  summaryPillLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryPillValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  highlightRow: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  highlightItem: {
    flex: 1,
  },
  highlightLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
  },
  highlightValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  highlightDivider: {
    backgroundColor: '#1E293B',
    height: 34,
    marginHorizontal: 10,
    width: 1,
  },
  summaryFallback: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  toolsGrid: {
    gap: 14,
  },
  toolCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  toolIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    marginBottom: 14,
    width: 44,
  },
  toolTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  toolDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  toolFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  toolLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
