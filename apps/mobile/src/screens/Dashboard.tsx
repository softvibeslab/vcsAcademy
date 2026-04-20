import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDailyGoal, fetchReadinessScore } from '../store/slices/performanceSlice';
import { MainTabParamList, RootStackParamList } from '../types';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  StackNavigationProp<RootStackParamList>
>;

interface MissionStat {
  label: string;
  current: number;
  target: number;
}

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accent: string;
  accentBackground: string;
  onPress: () => void;
}

interface MissionRowProps extends MissionStat {}

const chartBars = [18, 28, 22, 40, 52];

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { readinessScore, dailyGoal, streak } = useAppSelector((state) => state.performance);

  useEffect(() => {
    dispatch(fetchReadinessScore());
    dispatch(fetchDailyGoal());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchReadinessScore());
      dispatch(fetchDailyGoal());
    }, [dispatch])
  );

  const firstName = user?.name?.split(' ')[0] || 'Carlos';
  const displayReadiness = readinessScore?.score ?? 72;
  const performanceIndex = clamp(((displayReadiness - 50) / 1.8), -15, 20);
  const performanceLabel = `${performanceIndex >= 0 ? '+' : ''}${performanceIndex.toFixed(1)}%`;
  const isPositiveTrend = performanceIndex >= 0;
  const greeting = getGreeting();
  const initials = getInitials(firstName);

  const missionStats: MissionStat[] = [
    {
      label: 'Tours Completed',
      current: dailyGoal?.progress.tours_completed ?? 3,
      target: dailyGoal?.goals.tours ?? 4,
    },
    {
      label: 'Target Sales',
      current: dailyGoal?.progress.sales_closed ?? 1,
      target: dailyGoal?.goals.sales ?? 2,
    },
    {
      label: 'AI Coach Sessions',
      current: dailyGoal?.progress.ai_sessions_used ?? 4,
      target: dailyGoal?.goals.ai_coach_sessions ?? 5,
    },
  ];

  const topVelocityValue = `${missionStats[0].current}/${missionStats[0].target}`;

  const actionCards = [
    {
      icon: 'clipboard-outline' as const,
      label: 'Enter Pre-Tour',
      accent: '#F1C84B',
      accentBackground: '#352C12',
      onPress: () => navigation.navigate('PreTourMode'),
    },
    {
      icon: 'sparkles-outline' as const,
      label: 'Launch AI Coach',
      accent: '#98A8FF',
      accentBackground: '#20264A',
      onPress: () => navigation.navigate('AICoachChat'),
    },
    {
      icon: 'search-outline' as const,
      label: 'Quick Win Search',
      accent: '#F2EFEA',
      accentBackground: '#302F36',
      onPress: () => navigation.navigate('QuickWinsLibrary'),
    },
    {
      icon: 'checkmark-done-outline' as const,
      label: 'Log Outcome',
      accent: '#F1C84B',
      accentBackground: '#302911',
      onPress: () => navigation.navigate('PostTourDebrief'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.avatarShell}>
              {user?.picture ? (
                <Image source={{ uri: user.picture }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
            </View>

            <Text style={styles.brandLabel}>EXECUTIVE VAULT</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.notificationButton}>
            <Ionicons name="notifications" size={20} color="#F1C84B" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <View style={styles.titleRow}>
              <Text style={styles.heroTitle}>
                {greeting}
                {'\n'}
                {firstName}
              </Text>

              <View style={styles.titleIconWrap}>
                <Ionicons name="flame" size={18} color="#F1C84B" />
              </View>
            </View>
          </View>

          <View style={styles.velocityWrap}>
            <Text style={styles.velocityLabel}>Today&apos;s Velocity</Text>
            <Text style={styles.velocityValue}>{topVelocityValue}</Text>
          </View>
        </View>

        <View style={styles.readinessCard}>
          <View style={styles.cardGlow} />

          <View style={styles.readinessRingWrap}>
            <View style={styles.readinessRingTrack} />
            <View style={styles.readinessRingAccent} />
            <View style={styles.ringGapPrimary} />
            <View style={styles.ringGapSecondary} />

            <View style={styles.readinessRingInner}>
              <Text style={styles.readinessNumber}>{displayReadiness}</Text>
              <Text style={styles.readinessLabel}>READINESS</Text>
            </View>
          </View>

          <View style={styles.performanceRow}>
            <View>
              <Text style={styles.metricLabel}>Performance Index</Text>
              <View style={styles.performanceValueRow}>
                <Text style={styles.performanceValue}>{performanceLabel}</Text>
                <Ionicons
                  name={isPositiveTrend ? 'arrow-up' : 'arrow-down'}
                  size={14}
                  color="#F1C84B"
                />
              </View>
            </View>

            <View style={styles.chartWrap}>
              {chartBars.map((height, index) => {
                const isAccentBar = index >= 3;

                return (
                  <View
                    key={`${height}-${index}`}
                    style={[
                      styles.chartBar,
                      {
                        height,
                        backgroundColor: isAccentBar ? '#F1C84B' : 'rgba(241, 200, 75, 0.35)',
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.sectionEyebrow}>Daily Mission</Text>

        <View style={styles.missionCard}>
          {missionStats.map((item) => (
            <MissionRow
              key={item.label}
              current={item.current}
              label={item.label}
              target={item.target}
            />
          ))}
        </View>

        <View style={styles.actionsGrid}>
          {actionCards.map((action) => (
            <ActionCard
              key={action.label}
              accent={action.accent}
              accentBackground={action.accentBackground}
              icon={action.icon}
              label={action.label}
              onPress={action.onPress}
            />
          ))}
        </View>

        <View style={styles.footerStat}>
          <Ionicons name="flame" size={16} color="#F1C84B" />
          <Text style={styles.footerStatText}>{streak || 7} day momentum streak</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MissionRow({ label, current, target }: MissionRowProps) {
  const percentage = target > 0 ? Math.min(current / target, 1) : 0;

  return (
    <View style={styles.missionRow}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionLabel}>{label}</Text>
        <Text style={styles.missionValue}>
          {current}/{target}
        </Text>
      </View>

      <View style={styles.missionTrack}>
        <View style={[styles.missionFill, { width: `${percentage * 100}%` }]} />
      </View>
    </View>
  );
}

function ActionCard({ icon, label, accent, accentBackground, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.actionCard}>
      <View style={[styles.actionIconChip, { backgroundColor: accentBackground }]}>
        <Ionicons color={accent} name={icon} size={24} />
      </View>

      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning,';
  }

  if (hour < 19) {
    return 'Good afternoon,';
  }

  return 'Good evening,';
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0A0E',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B0A0E',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 116,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 20,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  avatarShell: {
    alignItems: 'center',
    backgroundColor: '#18161D',
    borderColor: '#2A2731',
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 48,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: '#1C2336',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  avatarInitials: {
    color: '#F4EEDF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  brandLabel: {
    color: '#F1C84B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.8,
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: '#15131A',
    borderColor: '#23212A',
    borderRadius: 18,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  heroRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 12,
  },
  welcomeText: {
    color: '#C9B89E',
    fontSize: 14,
    marginBottom: 6,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  heroTitle: {
    color: '#F4EFE7',
    flex: 1,
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 34,
  },
  titleIconWrap: {
    alignItems: 'center',
    backgroundColor: '#1B1820',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginTop: 6,
    width: 36,
  },
  velocityWrap: {
    alignItems: 'flex-start',
    paddingTop: 8,
    width: 104,
  },
  velocityLabel: {
    color: '#DDD3C4',
    fontSize: 12,
    letterSpacing: 2,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  velocityValue: {
    color: '#F1C84B',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  readinessCard: {
    backgroundColor: '#16161D',
    borderColor: '#23222A',
    borderRadius: 38,
    borderWidth: 1,
    marginBottom: 22,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
    position: 'relative',
  },
  cardGlow: {
    backgroundColor: '#5D4B19',
    borderRadius: 160,
    height: 220,
    opacity: 0.14,
    position: 'absolute',
    right: -80,
    top: -24,
    width: 220,
  },
  readinessRingWrap: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 252,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
    width: 252,
  },
  readinessRingTrack: {
    borderColor: '#35343C',
    borderRadius: 126,
    borderWidth: 14,
    height: 228,
    position: 'absolute',
    width: 228,
  },
  readinessRingAccent: {
    borderColor: '#F1C84B',
    borderRadius: 126,
    borderWidth: 14,
    height: 228,
    opacity: 0.96,
    position: 'absolute',
    width: 228,
  },
  ringGapPrimary: {
    backgroundColor: '#16161D',
    borderRadius: 20,
    height: 28,
    left: 48,
    position: 'absolute',
    top: 20,
    transform: [{ rotate: '-18deg' }],
    width: 76,
  },
  ringGapSecondary: {
    backgroundColor: '#16161D',
    borderRadius: 20,
    height: 30,
    left: 22,
    position: 'absolute',
    top: 120,
    transform: [{ rotate: '76deg' }],
    width: 62,
  },
  readinessRingInner: {
    alignItems: 'center',
    backgroundColor: '#16161D',
    borderRadius: 90,
    height: 180,
    justifyContent: 'center',
    width: 180,
  },
  readinessNumber: {
    color: '#F3EDE7',
    fontSize: 66,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 72,
  },
  readinessLabel: {
    color: '#D8CCBB',
    fontSize: 12,
    letterSpacing: 4.1,
    marginTop: 4,
  },
  performanceRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: '#D7CBB9',
    fontSize: 12,
    letterSpacing: 2.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  performanceValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  performanceValue: {
    color: '#F3EDE7',
    fontSize: 20,
    fontWeight: '700',
  },
  chartWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
    paddingRight: 8,
  },
  chartBar: {
    borderRadius: 8,
    width: 10,
  },
  sectionEyebrow: {
    color: '#F1C84B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 14,
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  missionCard: {
    backgroundColor: '#15151B',
    borderColor: '#23222A',
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  missionRow: {
    marginBottom: 18,
  },
  missionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  missionLabel: {
    color: '#E7DCCA',
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  missionValue: {
    color: '#F3EDE7',
    fontSize: 15,
    fontWeight: '700',
  },
  missionTrack: {
    backgroundColor: '#1F1D25',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  missionFill: {
    backgroundColor: '#E5BC3E',
    borderRadius: 999,
    height: '100%',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#15151B',
    borderColor: '#23222A',
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 154,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    width: '47.5%',
  },
  actionIconChip: {
    alignItems: 'center',
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    marginBottom: 26,
    width: 54,
  },
  actionLabel: {
    color: '#F3EDE7',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  footerStat: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#141319',
    borderColor: '#222028',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  footerStatText: {
    color: '#D6CBB9',
    fontSize: 13,
    fontWeight: '600',
  },
});
