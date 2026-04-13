import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchReadinessScore, fetchDailyGoal } from '../store/slices/performanceSlice';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList>,
  StackNavigationProp<RootStackParamList>
>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { readinessScore, dailyGoal, streak } = useAppSelector((state) => state.performance);

  useEffect(() => {
    dispatch(fetchReadinessScore());
    dispatch(fetchDailyGoal());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}! 👋</Text>
          <Text style={styles.subtitle}>Ready to close more deals?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={20} color="#D4AF37" />
          <Text style={styles.streakCount}>{streak} days</Text>
        </View>
      </View>

      {/* Readiness Score Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Today's Readiness</Text>
          <Ionicons name="trending-up" size={24} color="#22c55e" />
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>{readinessScore?.score || 0}</Text>
          <Text style={styles.scoreLabel}>out of 100</Text>
        </View>

        {/* Score Components */}
        {readinessScore?.components && (
          <View style={styles.componentsGrid}>
            <ScoreComponent
              label="Training"
              score={readinessScore.components.training}
              color="#3B82F6"
            />
            <ScoreComponent
              label="Performance"
              score={readinessScore.components.performance}
              color="#22c55e"
            />
            <ScoreComponent
              label="Streak"
              score={readinessScore.components.streak}
              color="#D4AF37"
            />
          </View>
        )}
      </View>

      {/* Daily Goals Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Daily Goals</Text>
          <Ionicons name="flag" size={24} color="#D4AF37" />
        </View>

        {dailyGoal && (
          <View style={styles.goalsContainer}>
            <GoalItem
              label="Tours"
              current={dailyGoal.progress.tours_completed}
              target={dailyGoal.goals.tours}
              icon="people"
            />
            <GoalItem
              label="Sales"
              current={dailyGoal.progress.sales_closed}
              target={dailyGoal.goals.sales}
              icon="cash"
            />
            <GoalItem
              label="AI Coach"
              current={dailyGoal.progress.ai_sessions_used}
              target={dailyGoal.goals.ai_coach_sessions}
              icon="chatbubbles"
            />
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickAction
            icon="trophy"
            label="PreTour"
            onPress={() => navigation.navigate('PreTourMode')}
            color="#D4AF37"
          />
          <QuickAction
            icon="chatbubbles"
            label="AI Coach"
            onPress={() => navigation.navigate('AICoachChat')}
            color="#3B82F6"
          />
          <QuickAction
            icon="flash"
            label="Quick Wins"
            onPress={() => navigation.navigate('QuickWinsLibrary')}
            color="#22c55e"
          />
          <QuickAction
            icon="cash"
            label="Goal Sheet"
            onPress={() => navigation.navigate('GoalSheet')}
            color="#22c55e"
          />
          <QuickAction
            icon="musical-notes"
            label="Play Role"
            onPress={() => navigation.navigate('PlayRole')}
            color="#A855F7"
          />
          <QuickAction
            icon="person"
            label="Profile"
            onPress={() => console.log('Profile')}
            color="#94A3B8"
          />
        </View>
      </View>

      {/* Motivational Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>"</Text>
        <Text style={styles.quoteText}>
          "Success is not final, failure is not fatal: it is the courage to continue that counts."
        </Text>
        <Text style={styles.quoteAuthor}>- Winston Churchill</Text>
      </View>
    </ScrollView>
  );
}

interface ScoreComponentProps {
  label: string;
  score: number;
  color: string;
}

function ScoreComponent({ label, score, color }: ScoreComponentProps) {
  return (
    <View style={styles.scoreComponent}>
      <View style={[styles.scoreIndicator, { backgroundColor: color }]} />
      <View>
        <Text style={styles.componentLabel}>{label}</Text>
        <Text style={[styles.componentScore, { color }]}>{Math.round(score)}%</Text>
      </View>
    </View>
  );
}

interface GoalItemProps {
  label: string;
  current: number;
  target: number;
  icon: string;
}

function GoalItem({ label, current, target, icon }: GoalItemProps) {
  const progress = (current / target) * 100;
  const isComplete = current >= target;

  return (
    <View style={styles.goalItem}>
      <View style={styles.goalLeft}>
        <Ionicons
          name={icon as any}
          size={20}
          color={isComplete ? '#22c55e' : '#94A3B8'}
        />
        <Text style={styles.goalLabel}>{label}</Text>
      </View>
      <View style={styles.goalProgress}>
        <Text style={styles.goalNumbers}>
          {current}/{target}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%`, backgroundColor: isComplete ? '#22c55e' : '#D4AF37' },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

function QuickAction({ icon, label, onPress, color }: QuickActionProps) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
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
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F1F5F9',
    fontFamily: 'Playfair Display',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F1F5F9',
    fontFamily: 'Playfair Display',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: '#D4AF37',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#94A3B8',
  },
  componentsGrid: {
    gap: 12,
  },
  scoreComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
  },
  scoreIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  componentLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  componentScore: {
    fontSize: 18,
    fontWeight: '600',
  },
  goalsContainer: {
    gap: 16,
  },
  goalItem: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F1F5F9',
  },
  goalProgress: {
    alignItems: 'flex-end',
  },
  goalNumbers: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  progressBar: {
    width: width - 112,
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    alignItems: 'center',
    width: (width - 64) / 2,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F1F5F9',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  quoteIcon: {
    fontSize: 48,
    color: '#D4AF37',
    fontFamily: 'Playfair Display',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#F1F5F9',
    lineHeight: 24,
    marginVertical: 16,
    fontFamily: 'Playfair Display',
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'right',
  },
});
