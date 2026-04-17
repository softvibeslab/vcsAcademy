import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type PostTourDebriefRouteProp = RouteProp<RootStackParamList, 'PostTourDebrief'>;

export default function PostTourDebriefScreen() {
  const navigation = useNavigation();
  const route = useRoute<PostTourDebriefRouteProp>();
  const tourId = route.params?.tourId;

  const [outcome, setOutcome] = useState<'sale' | 'no_sale' | 'follow_up' | null>(null);
  const [objectionsHandled, setObjectionsHandled] = useState(0);
  const [confidenceBefore, setConfidenceBefore] = useState(5);
  const [confidenceAfter, setConfidenceAfter] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // TODO: Submit tour result to API
    console.log({
      tour_id: tourId || `tour_${Date.now()}`,
      outcome,
      duration_minutes: 30,
      objections_handled: objectionsHandled,
      ai_coach_used: true,
      confidence_before: confidenceBefore,
      confidence_after: confidenceAfter,
      notes,
    });

    // Show success and navigate back
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post-Tour Debrief</Text>
        <Text style={styles.subtitle}>1-minute reflection & learning</Text>
      </View>

      {/* Outcome Selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tour Outcome</Text>
        <View style={styles.outcomeGrid}>
          <OutcomeOption
            icon="checkmark-circle"
            label="Sale!"
            color="#22c55e"
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

      {/* Metrics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tour Metrics</Text>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Objections Handled</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setObjectionsHandled(Math.max(0, objectionsHandled - 1))}>
              <Ionicons name="remove-circle" size={24} color="#D4AF37" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{objectionsHandled}</Text>
            <TouchableOpacity onPress={() => setObjectionsHandled(objectionsHandled + 1)}>
              <Ionicons name="add-circle" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Confidence Before</Text>
          <View style={styles.slider}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setConfidenceBefore(value)}
              >
                <View
                  style={[
                    styles.sliderDot,
                    confidenceBefore >= value && styles.sliderDotActive
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Confidence After</Text>
          <View style={styles.slider}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setConfidenceAfter(value)}
              >
                <View
                  style={[
                    styles.sliderDot,
                    confidenceAfter >= value && styles.sliderDotActive
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* AI Coach Usage */}
      <View style={styles.card}>
        <View style={styles.aiUsageRow}>
          <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
          <View style={styles.aiUsageContent}>
            <Text style={styles.aiUsageTitle}>AI Coach Used</Text>
            <Text style={styles.aiUsageSubtitle}>Get insights from this tour</Text>
          </View>
          <View style={styles.checkContainer}>
            <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="What did you learn? What would you do differently?"
          placeholderTextColor="#94A3B8"
          multiline
          value={notes}
          onChangeText={setNotes}
          maxLength={500}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, !outcome && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!outcome}
      >
        <Ionicons name="checkmark" size={24} color="#020204" />
        <Text style={styles.submitButtonText}>Submit Debrief</Text>
      </TouchableOpacity>

      {/* Insight Card */}
      {outcome === 'sale' && (
        <View style={styles.insightCard}>
          <Ionicons name="trophy" size={32} color="#D4AF37" />
          <Text style={styles.insightTitle}>Great Job! 🎉</Text>
          <Text style={styles.insightText}>
            Your confidence improved from {confidenceBefore} to {confidenceAfter}. Keep up the momentum!
          </Text>
        </View>
      )}

      {outcome === 'no_sale' && (
        <View style={styles.insightCard}>
          <Ionicons name="trending-up" size={32} color="#3B82F6" />
          <Text style={styles.insightTitle}>Learning Opportunity</Text>
          <Text style={styles.insightText}>
            You handled {objectionsHandled} objection{objectionsHandled !== 1 ? 's' : ''}. Review the AI Coach suggestions for next time.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

interface OutcomeOptionProps {
  icon: string;
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

function OutcomeOption({ icon, label, color, selected, onPress }: OutcomeOptionProps) {
  return (
    <TouchableOpacity
      style={[styles.outcomeOption, selected && { borderColor: color, backgroundColor: `${color}20` }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={32} color={selected ? color : '#94A3B8'} />
      <Text style={[styles.outcomeLabel, selected && { color }]}>{label}</Text>
    </TouchableOpacity>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 16,
  },
  outcomeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  outcomeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  outcomeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  metricRow: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 16,
    color: '#F1F5F9',
    marginBottom: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D4AF37',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
  },
  sliderDotActive: {
    backgroundColor: '#D4AF37',
  },
  aiUsageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiUsageContent: {
    flex: 1,
  },
  aiUsageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  aiUsageSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesInput: {
    backgroundColor: '#0F172A',
    color: '#F1F5F9',
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#020204',
  },
  insightCard: {
    backgroundColor: '#1E293B',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1F5F9',
    marginTop: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
