/**
 * VCSA Pocket - Goal Sheet Screen
 * Financial goal tracking with real-time earnings
 * Based on STITCH_DESIGN_PROMPT.md Screen 6 specifications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  Typography,
  CommonStyles,
  Shadows,
} from '@/theme';
import {
  Button,
  Card,
  ProgressBar,
  StatCard,
  Badge,
  SectionHeader,
} from '@/components/ui';

interface GoalSheetData {
  currentEarnings: number;
  targetEarnings: number;
  lastMonthEarnings: number;
  daysRemaining: number;
  sales: {
    current: number;
    target: number;
  };
  commission: {
    total: number;
    rate: number;
  };
  averageDeal: {
    amount: number;
    lastMonth: number;
  };
  streak: {
    current: number;
    best: number;
  };
  incomeBreakdown: {
    commissions: number;
    bonuses: number;
    overrides: number;
  };
}

const GoalSheetScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GoalSheetData | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        currentEarnings: 12000,
        targetEarnings: 15000,
        lastMonthEarnings: 9600,
        daysRemaining: 18,
        sales: {
          current: 8,
          target: 10,
        },
        commission: {
          total: 4800,
          rate: 60,
        },
        averageDeal: {
          amount: 1500,
          lastMonth: 1300,
        },
        streak: {
          current: 12,
          best: 15,
        },
        incomeBreakdown: {
          commissions: 4800,
          bonuses: 600,
          overrides: 0,
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const progressPercentage = data
    ? data.currentEarnings / data.targetEarnings
    : 0;

  const salesProgress = data ? data.sales.current / data.sales.target : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Goal Sheet...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load goal data</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GOAL SHEET</Text>
        <Text style={styles.headerSubtitle}>Track Your Success</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card - Monthly Income Goal */}
        <Card style={styles.heroCard} padding={24}>
          <View style={styles.heroIconRow}>
            <Text style={styles.heroIcon}>💰</Text>
            <Text style={styles.heroTitle}>MONTHLY INCOME GOAL</Text>
          </View>

          <View style={styles.heroAmountRow}>
            <Text style={styles.heroAmount}>
              ${data.currentEarnings.toLocaleString()}
            </Text>
            <Text style={styles.heroTarget}>
              of ${data.targetEarnings.toLocaleString()} target
            </Text>
          </View>

          <View style={styles.heroProgressRow}>
            <ProgressBar
              progress={progressPercentage}
              height={12}
              color={Colors.gold}
              showPercentage
            />
          </View>

          <View style={styles.heroStatsRow}>
            <Text style={styles.heroTrend}>
              ↑ ${(data.currentEarnings - data.lastMonthEarnings).toLocaleString()}{' '}
              above last month
            </Text>
            <Text style={styles.heroDays}>
              📅 {data.daysRemaining} days remaining
            </Text>
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Sales */}
          <StatCard
            icon="🎯"
            value={data.sales.current.toString()}
            label={`target: ${data.sales.target}`}
            progress={salesProgress}
            style={styles.statCardItem}
          />

          {/* Commission */}
          <StatCard
            icon="💵"
            value={`$${data.commission.total.toLocaleString()}`}
            label={`rate: ${data.commission.rate}%`}
            progress={0.8}
            style={styles.statCardItem}
          />
        </View>

        <View style={styles.statsGrid}>
          {/* Average Deal */}
          <StatCard
            icon="📊"
            value={`$${data.averageDeal.amount.toLocaleString()}`}
            label="this month"
            trend={`↑ $${(data.averageDeal.amount - data.averageDeal.lastMonth).toLocaleString()}`}
            style={styles.statCardItem}
          />

          {/* Streak */}
          <StatCard
            icon="🔥"
            value={`${data.streak.current} days`}
            label="personal best"
            trend={`🏆 ${data.streak.best} days`}
            style={styles.statCardItem}
          />
        </View>

        {/* Income Breakdown */}
        <Card style={styles.breakdownCard}>
          <SectionHeader
            icon="📈"
            title="INCOME BREAKDOWN"
            subtitle="Detailed breakdown by source"
          />

          {/* Sales Commissions */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownLabel}>Sales Commissions</Text>
              <Text style={styles.breakdownAmount}>
                ${data.incomeBreakdown.commissions.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownMeta}>
              <Text style={styles.breakdownPercentage}>80%</Text>
              <ProgressBar
                progress={0.8}
                height={8}
                color={Colors.success}
                style={styles.breakdownProgress}
              />
            </View>
          </View>

          {/* Bonuses */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownLabel}>Bonuses</Text>
              <Text style={styles.breakdownAmount}>
                ${data.incomeBreakdown.bonuses.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownMeta}>
              <Text style={styles.breakdownPercentage}>10%</Text>
              <ProgressBar
                progress={0.1}
                height={8}
                color={Colors.info}
                style={styles.breakdownProgress}
              />
            </View>
          </View>

          {/* Overrides */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownInfo}>
              <Text style={styles.breakdownLabel}>Overrides</Text>
              <Text style={styles.breakdownAmount}>
                ${data.incomeBreakdown.overrides.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownMeta}>
              <Text style={styles.breakdownPercentage}>0%</Text>
              <ProgressBar
                progress={0}
                height={8}
                color={Colors.border}
                style={styles.breakdownProgress}
              />
            </View>
          </View>

          {/* Total */}
          <View style={styles.breakdownTotalRow}>
            <View style={styles.breakdownTotalLine} />
            <View style={styles.breakdownTotalContent}>
              <Text style={styles.breakdownTotalLabel}>TOTAL</Text>
              <Text style={styles.breakdownTotalAmount}>
                ${(data.currentEarnings + data.incomeBreakdown.bonuses).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <Button
            title="Set New Goal"
            onPress={() => console.log('Set new goal')}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="View History"
            onPress={() => console.log('View history')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },

  loadingText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
  },

  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.error,
  },

  header: {
    paddingHorizontal: Spacing.padding.md,
    paddingTop: Spacing.padding.sm,
    paddingBottom: Spacing.padding.md,
    backgroundColor: Colors.black,
  },

  backButton: {
    padding: Spacing.s,
  },

  backIcon: {
    fontSize: Typography.fontSize.h3,
    color: Colors.textPrimary,
  },

  headerTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.s,
  },

  headerSubtitle: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
  },

  heroCard: {
    marginHorizontal: Spacing.padding.md,
    marginTop: Spacing.padding.md,
    marginBottom: Spacing.padding.md,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 24,
    ...Shadows.goldGlow,
  },

  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },

  heroIcon: {
    fontSize: 32,
    marginRight: Spacing.s,
  },

  heroTitle: {
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  heroAmountRow: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  heroAmount: {
    fontSize: 48,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
  },

  heroTarget: {
    fontSize: Typography.fontSize.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  heroProgressRow: {
    marginBottom: Spacing.lg,
  },

  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroTrend: {
    fontSize: Typography.fontSize.caption,
    color: Colors.success,
  },

  heroDays: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
  },

  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: Spacing.padding.md,
    marginBottom: Spacing.md,
    gap: Spacing.padding.md,
  },

  statCardItem: {
    flex: 1,
    aspectRatio: 1.5,
  },

  breakdownCard: {
    marginHorizontal: Spacing.padding.md,
    marginBottom: Spacing.padding.md,
  },

  breakdownRow: {
    marginBottom: Spacing.lg,
  },

  breakdownInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },

  breakdownLabel: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },

  breakdownAmount: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },

  breakdownMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },

  breakdownPercentage: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    width: 40,
  },

  breakdownProgress: {
    flex: 1,
  },

  breakdownTotalRow: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },

  breakdownTotalLine: {
    height: 1,
    backgroundColor: Colors.gold,
  },

  breakdownTotalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },

  breakdownTotalLabel: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },

  breakdownTotalAmount: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.padding.md,
    marginBottom: Spacing.padding.md,
    gap: Spacing.s,
  },

  actionButton: {
    flex: 1,
  },

  bottomSpacing: {
    height: 80,
  },
});

export default GoalSheetScreen;
