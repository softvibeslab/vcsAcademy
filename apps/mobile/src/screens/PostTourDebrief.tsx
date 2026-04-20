import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDailyGoal,
  fetchReadinessScore,
  recordTourResult,
} from '../store/slices/performanceSlice';
import { RootStackParamList } from '../types';

type PostTourDebriefRouteProp = RouteProp<RootStackParamList, 'PostTourDebrief'>;

export default function PostTourDebriefScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<PostTourDebriefRouteProp>();
  const { isLoading } = useAppSelector((state) => state.performance);
  const tourId = route.params?.tourId;

  const [outcome, setOutcome] = useState<'sale' | 'no_sale' | 'follow_up' | null>(null);
  const [objectionsHandled, setObjectionsHandled] = useState(0);
  const [confidenceBefore, setConfidenceBefore] = useState(5);
  const [confidenceAfter, setConfidenceAfter] = useState(5);
  const [notes, setNotes] = useState('');

  const insight = useMemo(() => {
    if (outcome === 'sale') {
      return {
        icon: 'trophy',
        color: '#D4AF37',
        title: 'Momentum logged',
        copy: `Your confidence climbed from ${confidenceBefore} to ${confidenceAfter}. Keep replaying what worked.`,
      };
    }

    if (outcome === 'no_sale') {
      return {
        icon: 'trending-up',
        color: '#3B82F6',
        title: 'Film room moment',
        copy: `You worked through ${objectionsHandled} objection${objectionsHandled === 1 ? '' : 's'}. Use that debrief in Play Role tomorrow.`,
      };
    }

    if (outcome === 'follow_up') {
      return {
        icon: 'refresh-circle',
        color: '#F59E0B',
        title: 'Follow-up protected',
        copy: 'Log the next step now so the opportunity does not cool off overnight.',
      };
    }

    return null;
  }, [confidenceAfter, confidenceBefore, objectionsHandled, outcome]);

  const handleSubmit = async () => {
    if (!outcome || isLoading) {
      return;
    }

    try {
      await dispatch(
        recordTourResult({
          tour_id: tourId || `tour_${Date.now()}`,
          outcome,
          duration_minutes: 30,
          objections_handled: objectionsHandled,
          ai_coach_used: true,
          confidence_before: confidenceBefore,
          confidence_after: confidenceAfter,
          notes,
        })
      ).unwrap();

      await Promise.all([
        dispatch(fetchReadinessScore()),
        dispatch(fetchDailyGoal()),
      ]);

      navigation.goBack();
    } catch (error) {
      console.error('Debrief submit error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Post-Tour Debrief</Text>
          <Text style={styles.subtitle}>
            Capture the result while the language, objections, and energy are still fresh.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tour Outcome</Text>
          <View style={styles.outcomeGrid}>
            <OutcomeOption
              icon="checkmark-circle"
              label="Sale"
              color="#22C55E"
              selected={outcome === 'sale'}
              onPress={() => setOutcome('sale')}
            />
            <OutcomeOption
              icon="close-circle"
              label="No Sale"
              color="#EF4444"
              selected={outcome === 'no_sale'}
              onPress={() => setOutcome('no_sale')}
            />
            <OutcomeOption
              icon="refresh"
              label="Follow Up"
              color="#F59E0B"
              selected={outcome === 'follow_up'}
              onPress={() => setOutcome('follow_up')}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tour Metrics</Text>

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Objections Handled</Text>
            <View style={styles.counter}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setObjectionsHandled(Math.max(0, objectionsHandled - 1))}>
                <Ionicons name="remove-circle" size={24} color="#D4AF37" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{objectionsHandled}</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setObjectionsHandled(objectionsHandled + 1)}>
                <Ionicons name="add-circle" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <ConfidenceRow
            label="Confidence Before"
            selectedValue={confidenceBefore}
            onSelect={setConfidenceBefore}
          />
          <ConfidenceRow
            label="Confidence After"
            selectedValue={confidenceAfter}
            onSelect={setConfidenceAfter}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.aiUsageRow}>
            <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
            <View style={styles.aiUsageContent}>
              <Text style={styles.aiUsageTitle}>AI Coach Used</Text>
              <Text style={styles.aiUsageSubtitle}>This debrief will count that interaction for today.</Text>
            </View>
            <Ionicons name="checkmark-circle" size={28} color="#22C55E" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="What did you learn? What would you say differently next time?"
            placeholderTextColor="#94A3B8"
            multiline
            value={notes}
            onChangeText={setNotes}
            maxLength={500}
          />
          <Text style={styles.notesCount}>{notes.length}/500</Text>
        </View>

        {insight ? (
          <View style={styles.insightCard}>
            <Ionicons name={insight.icon as keyof typeof Ionicons.glyphMap} size={30} color={insight.color} />
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightText}>{insight.copy}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.submitButton, (!outcome || isLoading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!outcome || isLoading}
        >
          <Ionicons name="checkmark" size={22} color="#020204" />
          <Text style={styles.submitButtonText}>{isLoading ? 'Saving...' : 'Submit Debrief'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ConfidenceRow({
  label,
  selectedValue,
  onSelect,
}: {
  label: string;
  selectedValue: number;
  onSelect: (value: number) => void;
}) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.slider}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <TouchableOpacity key={value} activeOpacity={0.8} onPress={() => onSelect(value)}>
            <View style={[styles.sliderDot, selectedValue >= value && styles.sliderDotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function OutcomeOption({
  icon,
  label,
  color,
  selected,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.outcomeOption, selected && { borderColor: color, backgroundColor: `${color}20` }]}
      onPress={onPress}
    >
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={30} color={selected ? color : '#94A3B8'} />
      <Text style={[styles.outcomeLabel, selected && { color }]}>{label}</Text>
    </TouchableOpacity>
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
  cardTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  outcomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  outcomeOption: {
    alignItems: 'center',
    borderColor: '#334155',
    borderRadius: 14,
    borderWidth: 2,
    minWidth: 94,
    paddingVertical: 16,
    width: '30%',
  },
  outcomeLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  metricRow: {
    marginBottom: 14,
  },
  metricLabel: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  counter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  counterValue: {
    color: '#D4AF37',
    fontSize: 24,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: '#334155',
    height: 1,
    marginVertical: 6,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderDot: {
    backgroundColor: '#334155',
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  sliderDotActive: {
    backgroundColor: '#D4AF37',
  },
  aiUsageRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  aiUsageContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  aiUsageTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  aiUsageSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 16,
    borderWidth: 1,
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 130,
    padding: 16,
    textAlignVertical: 'top',
  },
  notesCount: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'right',
  },
  insightCard: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  insightTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  insightText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 18,
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    color: '#020204',
    fontSize: 16,
    fontWeight: '700',
  },
});
