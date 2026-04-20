import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { getDemoGoalSheet } from '../demo/progress';
import { useAppSelector } from '../store/hooks';
import { GoalSheetData, RootStackParamList } from '../types';

type GoalSheetNavigationProp = StackNavigationProp<RootStackParamList, 'GoalSheet'>;

export default function GoalSheetScreen() {
  const navigation = useNavigation<GoalSheetNavigationProp>();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GoalSheetData | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      const loadGoalSheet = async () => {
        setLoading(true);

        try {
          const goalSheet = await getDemoGoalSheet();
          if (active) {
            setData(goalSheet);
          }
        } catch (error) {
          console.error('Goal sheet load error:', error);
          if (active) {
            setData(null);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadGoalSheet();

      return () => {
        active = false;
      };
    }, [])
  );

  const firstName = user?.name?.split(' ')[0] || 'Closer';

  const insight = useMemo(() => {
    if (!data) {
      return null;
    }

    const earningsGap = Math.max(0, data.targetEarnings - data.currentEarnings);
    const pct = data.currentEarnings / data.targetEarnings;
    const projectedFinish = data.daysRemaining > 0
      ? Math.round(data.currentEarnings + (data.currentEarnings / Math.max(1, 30 - data.daysRemaining)) * data.daysRemaining)
      : data.currentEarnings;

    return {
      earningsGap,
      pct,
      projectedFinish,
    };
  }, [data]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#D4AF37" size="large" />
          <Text style={styles.loadingText}>Loading your goal sheet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data || !insight) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>We couldn&apos;t load your goal data right now.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#F1F5F9" />
          </TouchableOpacity>

          <View style={styles.headerCopy}>
            <Text style={styles.title}>Goal Sheet</Text>
            <Text style={styles.subtitle}>
              {firstName}, this is your pacing board for the rest of the month.
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroEyebrow}>Monthly Income Goal</Text>
              <Text style={styles.heroAmount}>${data.currentEarnings.toLocaleString()}</Text>
              <Text style={styles.heroTarget}>
                of ${data.targetEarnings.toLocaleString()} target
              </Text>
            </View>

            <View style={styles.heroBadge}>
              <Ionicons name="trending-up" size={18} color="#D4AF37" />
              <Text style={styles.heroBadgeText}>{Math.round(insight.pct * 100)}%</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(insight.pct * 100, 100)}%` }]} />
          </View>

          <View style={styles.heroStats}>
            <StatPill
              icon="arrow-up"
              label={`$${(data.currentEarnings - data.lastMonthEarnings).toLocaleString()} above last month`}
              tone="success"
            />
            <StatPill
              icon="calendar"
              label={`${data.daysRemaining} days left`}
              tone="neutral"
            />
          </View>
        </View>

        <View style={styles.grid}>
          <MetricCard
            icon="cash-outline"
            label="Gap to Goal"
            tone="#F97316"
            value={`$${insight.earningsGap.toLocaleString()}`}
            sublabel="still to close"
          />
          <MetricCard
            icon="trophy-outline"
            label="Sales Pace"
            tone="#22C55E"
            value={`${data.sales.current}/${data.sales.target}`}
            sublabel="deals this month"
          />
          <MetricCard
            icon="stats-chart-outline"
            label="Avg Deal"
            tone="#3B82F6"
            value={`$${data.averageDeal.amount.toLocaleString()}`}
            sublabel={`+$${(data.averageDeal.amount - data.averageDeal.lastMonth).toLocaleString()} vs last month`}
          />
          <MetricCard
            icon="flame-outline"
            label="Consistency"
            tone="#D4AF37"
            value={`${data.streak.current} days`}
            sublabel={`best ${data.streak.best} days`}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Income Breakdown</Text>
            <Ionicons name="pie-chart" size={18} color="#D4AF37" />
          </View>

          <BreakdownRow
            color="#22C55E"
            label="Sales Commissions"
            percentage={80}
            value={data.incomeBreakdown.commissions}
          />
          <BreakdownRow
            color="#3B82F6"
            label="Bonuses"
            percentage={10}
            value={data.incomeBreakdown.bonuses}
          />
          <BreakdownRow
            color="#64748B"
            label="Overrides"
            percentage={0}
            value={data.incomeBreakdown.overrides}
          />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Projected Finish</Text>
            <Text style={styles.totalValue}>${insight.projectedFinish.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Coach Notes</Text>
            <Ionicons name="bulb-outline" size={18} color="#D4AF37" />
          </View>

          <View style={styles.noteBlock}>
            <Text style={styles.noteTitle}>What moves the needle now</Text>
            <Text style={styles.noteCopy}>
              You only need {Math.max(0, data.sales.target - data.sales.current)} more deal
              {Math.max(0, data.sales.target - data.sales.current) === 1 ? '' : 's'} to hit the target.
              Keep average deal size above ${data.averageDeal.amount.toLocaleString()} and protect your conversion quality.
            </Text>
          </View>

          <View style={styles.noteBlock}>
            <Text style={styles.noteTitle}>Daily focus</Text>
            <Text style={styles.noteCopy}>
              Run one Pre-Tour reset, practice one objection in Play Role, and debrief every tour
              you present for the rest of the week.
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PostTourDebrief')}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>Log Debrief</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PreTourMode')}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>Run Pre-Tour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  label,
  tone,
  value,
  sublabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tone: string;
  value: string;
  sublabel: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${tone}20` }]}>
        <Ionicons name={icon} size={20} color={tone} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSublabel}>{sublabel}</Text>
    </View>
  );
}

function BreakdownRow({
  color,
  label,
  percentage,
  value,
}: {
  color: string;
  label: string;
  percentage: number;
  value: number;
}) {
  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownLabelRow}>
        <View style={styles.breakdownTextBlock}>
          <Text style={styles.breakdownLabel}>{label}</Text>
          <Text style={styles.breakdownValue}>${value.toLocaleString()}</Text>
        </View>
        <Text style={styles.breakdownPercent}>{percentage}%</Text>
      </View>
      <View style={styles.breakdownTrack}>
        <View style={[styles.breakdownFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function StatPill({
  icon,
  label,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tone: 'success' | 'neutral';
}) {
  const color = tone === 'success' ? '#22C55E' : '#94A3B8';

  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.statPillText, { color }]}>{label}</Text>
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
    paddingBottom: 28,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#020204',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerCopy: {
    flex: 1,
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
  heroCard: {
    backgroundColor: '#111827',
    borderColor: '#D4AF37',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroEyebrow: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroAmount: {
    color: '#F8FAFC',
    fontSize: 36,
    fontWeight: '700',
  },
  heroTarget: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  heroBadgeText: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#1F2937',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#D4AF37',
    borderRadius: 999,
    height: '100%',
  },
  heroStats: {
    gap: 10,
    marginTop: 16,
  },
  statPill: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    width: '48%',
  },
  metricIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  metricSublabel: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#F1F5F9',
    fontSize: 19,
    fontWeight: '700',
  },
  breakdownRow: {
    marginBottom: 16,
  },
  breakdownLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownTextBlock: {
    flex: 1,
  },
  breakdownLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownValue: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  breakdownPercent: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownTrack: {
    backgroundColor: '#0F172A',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  breakdownFill: {
    borderRadius: 999,
    height: '100%',
  },
  divider: {
    backgroundColor: '#334155',
    height: 1,
    marginVertical: 4,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  totalLabel: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: '#D4AF37',
    fontSize: 22,
    fontWeight: '700',
  },
  noteBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    marginTop: 10,
    padding: 14,
  },
  noteTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  noteCopy: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    flex: 1,
    paddingVertical: 16,
  },
  primaryActionText: {
    color: '#020204',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#475569',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 16,
  },
  secondaryActionText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
  },
});
