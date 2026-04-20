import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { getDemoPracticeSummary, recordDemoPracticeSession } from '../demo/progress';
import { PracticeSummary, RootStackParamList } from '../types';

interface Scenario {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  averageScore: number;
  personalBest: number;
  coachTip: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedResponse: string;
}

type PlayRoleNavigationProp = StackNavigationProp<RootStackParamList, 'PlayRole'>;
type ScreenMode = 'selection' | 'practice' | 'feedback';

const scenarios: Scenario[] = [
  {
    id: 'price-objection',
    icon: 'cash-outline',
    title: 'The Price Objection',
    description: '"It feels too expensive for us right now."',
    category: 'Price',
    difficulty: 3,
    averageScore: 7.2,
    personalBest: 8.5,
    coachTip: 'Acknowledge first, then connect value to travel use rather than monthly price.',
  },
  {
    id: 'spouse-approval',
    icon: 'people-outline',
    title: 'Spouse Approval',
    description: '"I need to talk to my spouse before making a decision."',
    category: 'Spouse',
    difficulty: 2,
    averageScore: 9.0,
    personalBest: 9.0,
    coachTip: 'Create alignment by asking what both decision makers want from future vacations.',
  },
  {
    id: 'not-right-time',
    icon: 'time-outline',
    title: 'Not the Right Time',
    description: '"We are interested, but this is not the right time."',
    category: 'Timing',
    difficulty: 3,
    averageScore: 7.5,
    personalBest: 8.0,
    coachTip: 'Find out what has to be true for the time to feel right, then narrow the gap.',
  },
  {
    id: 'already-member',
    icon: 'ribbon-outline',
    title: 'Already a Member',
    description: '"We already own with another company."',
    category: 'Competition',
    difficulty: 2,
    averageScore: 6.0,
    personalBest: 7.5,
    coachTip: 'Do not attack the competitor. Surface what is missing and position the upgrade.',
  },
  {
    id: 'competitor-compare',
    icon: 'swap-horizontal-outline',
    title: 'Competitor Comparison',
    description: '"Another brand offers more benefits for less money."',
    category: 'Competition',
    difficulty: 4,
    averageScore: 8.0,
    personalBest: 8.5,
    coachTip: 'Slow down the comparison and anchor on the benefits they will realistically use.',
  },
];

const categories = ['All', 'Price', 'Spouse', 'Timing', 'Competition'];

export default function PlayRoleScreen() {
  const navigation = useNavigation<PlayRoleNavigationProp>();

  const [mode, setMode] = useState<ScreenMode>('selection');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [responseText, setResponseText] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [practiceSummary, setPracticeSummary] = useState<PracticeSummary | null>(null);

  const filteredScenarios = useMemo(() => {
    return selectedCategory === 'All'
      ? scenarios
      : scenarios.filter((scenario) => scenario.category === selectedCategory);
  }, [selectedCategory]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      const loadSummary = async () => {
        try {
          const summary = await getDemoPracticeSummary();
          if (active) {
            setPracticeSummary(summary);
          }
        } catch (error) {
          console.error('Practice summary load error:', error);
        }
      };

      loadSummary();

      return () => {
        active = false;
      };
    }, [])
  );

  const featuredScenario = filteredScenarios[0] || scenarios[0];

  const startPractice = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setResponseText('');
    setFeedback(null);
    setMode('practice');
  };

  const submitResponse = () => {
    if (!selectedScenario || !responseText.trim()) {
      return;
    }

    const trimmed = responseText.trim();
    const mentionsEmpathy = /(understand|feel|hear|totally|makes sense)/i.test(trimmed);
    const mentionsValue = /(value|benefit|vacation|family|memories|travel)/i.test(trimmed);
    const mentionsClose = /(next step|move forward|today|start|reserve|ownership)/i.test(trimmed);

    let score = 5.8;
    if (trimmed.length > 90) score += 0.9;
    if (mentionsEmpathy) score += 1.0;
    if (mentionsValue) score += 1.0;
    if (mentionsClose) score += 0.8;
    if (selectedScenario.difficulty >= 4) score += 0.3;
    score = Math.min(9.6, Number(score.toFixed(1)));

    const strengths = [
      mentionsEmpathy ? 'You acknowledged the concern before pushing back.' : 'You stayed concise and direct.',
      mentionsValue ? 'You tied the answer back to value instead of defending price.' : 'Your answer kept the conversation moving.',
      'Your tone can translate well on the floor with a calm delivery.',
    ];

    const improvements = [
      !mentionsEmpathy ? 'Open with a short empathy line before reframing the objection.' : 'Tighten the first sentence to sound even more confident.',
      !mentionsValue ? 'Add one concrete benefit tied to their next vacation.' : 'Name one benefit even more specifically.',
      !mentionsClose ? 'Finish with a micro-close or next step question.' : 'End with a stronger invitation to act now.',
    ];

    const nextFeedback = {
      score,
      strengths,
      improvements,
      suggestedResponse:
        'I completely understand why you would pause there. Most families want to be sure the value is real before saying yes. What usually helps is looking at how this supports the trips you already want to take, so the decision becomes about better vacations and flexibility, not just a number on paper.',
    };

    void recordDemoPracticeSession({
      scenario_id: selectedScenario.id,
      scenario_title: selectedScenario.title,
      category: selectedScenario.category,
      score,
      response_excerpt: trimmed.slice(0, 120),
    }).then(() => getDemoPracticeSummary().then(setPracticeSummary)).catch((error) => {
      console.error('Practice session save error:', error);
    });

    setFeedback(nextFeedback);
    setMode('feedback');
  };

  const resetToSelection = () => {
    setMode('selection');
    setSelectedScenario(null);
    setResponseText('');
    setFeedback(null);
  };

  if (mode === 'practice' && selectedScenario) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={resetToSelection} style={styles.backButton}>
              <Ionicons name="close" size={20} color="#F1F5F9" />
            </TouchableOpacity>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>Practice Mode</Text>
              <Text style={styles.subtitle}>{selectedScenario.title}</Text>
            </View>
          </View>

          <View style={styles.scenarioHero}>
            <View style={styles.scenarioIconBlock}>
              <Ionicons name={selectedScenario.icon} size={24} color="#D4AF37" />
            </View>
            <Text style={styles.scenarioPrompt}>{selectedScenario.description}</Text>
            <View style={styles.metaRow}>
              <Pill label={selectedScenario.category} tone="#3B82F6" />
              <Pill label={getDifficultyLabel(selectedScenario.difficulty)} tone={getDifficultyColor(selectedScenario.difficulty)} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Coach Tip</Text>
              <Ionicons name="bulb-outline" size={18} color="#D4AF37" />
            </View>
            <Text style={styles.cardCopy}>{selectedScenario.coachTip}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Response</Text>
              <Ionicons name="create-outline" size={18} color="#D4AF37" />
            </View>

            <TextInput
              multiline
              maxLength={420}
              onChangeText={setResponseText}
              placeholder="Type how you would handle this objection on the floor..."
              placeholderTextColor="#64748B"
              style={styles.textInput}
              value={responseText}
            />

            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>{responseText.length}/420</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  setResponseText(
                    'I understand why you feel that way. Most families pause here because they want to make the right decision, not a rushed one. If we compare this to the vacations you already want to take, the value becomes a lot clearer.'
                  )
                }
                style={styles.inlineAction}
              >
                <Text style={styles.inlineActionText}>Use sample start</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionsColumn}>
            <TouchableOpacity activeOpacity={0.85} onPress={submitResponse} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Get Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                setResponseText("I hear you. Let’s compare this to the vacations you already know you want so we can see whether the long-term value makes sense for your family.")
              }
              style={styles.secondaryAction}
            >
              <Text style={styles.secondaryActionText}>Generate Better Draft</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (mode === 'feedback' && selectedScenario && feedback) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setMode('practice')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#F1F5F9" />
            </TouchableOpacity>

            <View style={styles.headerCopy}>
              <Text style={styles.title}>Practice Feedback</Text>
              <Text style={styles.subtitle}>{selectedScenario.title}</Text>
            </View>
          </View>

          <View style={styles.feedbackHero}>
            <Text style={styles.feedbackScore}>{feedback.score}/10</Text>
            <Text style={styles.feedbackLabel}>Practice Score</Text>
            <View style={styles.feedbackStars}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name="star"
                  size={18}
                  color={index < Math.round(feedback.score / 2) ? '#D4AF37' : '#334155'}
                />
              ))}
            </View>
          </View>

          <FeedbackCard
            icon="checkmark-circle-outline"
            title="Strengths"
            items={feedback.strengths}
            tone="#22C55E"
          />
          <FeedbackCard
            icon="construct-outline"
            title="Improvements"
            items={feedback.improvements}
            tone="#F59E0B"
          />

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Suggested Response</Text>
              <Ionicons name="chatbox-ellipses-outline" size={18} color="#D4AF37" />
            </View>
            <Text style={styles.cardCopy}>{feedback.suggestedResponse}</Text>
          </View>

          <View style={styles.actionsColumn}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setMode('practice')} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={resetToSelection} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Back to Scenarios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
            <Text style={styles.title}>Play Role</Text>
            <Text style={styles.subtitle}>Practice tough objections before the floor asks for them.</Text>
          </View>
        </View>

        <View style={styles.featuredCard}>
          <Text style={styles.featuredEyebrow}>Featured Scenario</Text>
          <View style={styles.featuredRow}>
            <View style={styles.featuredIcon}>
              <Ionicons name={featuredScenario.icon} size={24} color="#D4AF37" />
            </View>
            <View style={styles.featuredCopy}>
              <Text style={styles.featuredTitle}>{featuredScenario.title}</Text>
              <Text style={styles.featuredDescription}>{featuredScenario.description}</Text>
            </View>
          </View>

          <View style={styles.featuredMeta}>
            <Pill label={`${featuredScenario.averageScore}/10 avg`} tone="#22C55E" />
            <Pill label={`${featuredScenario.personalBest}/10 best`} tone="#D4AF37" />
            <Pill
              label={getDifficultyLabel(featuredScenario.difficulty)}
              tone={getDifficultyColor(featuredScenario.difficulty)}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => startPractice(featuredScenario)}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>Start Practice</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(category)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>All Scenarios</Text>

          {filteredScenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              activeOpacity={0.9}
              onPress={() => startPractice(scenario)}
              style={styles.scenarioCard}
            >
              <View style={styles.scenarioTopRow}>
                <View style={styles.scenarioBadge}>
                  <Ionicons name={scenario.icon} size={18} color="#D4AF37" />
                </View>
                <Pill
                  label={getDifficultyLabel(scenario.difficulty)}
                  tone={getDifficultyColor(scenario.difficulty)}
                />
              </View>

              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioDescription}>{scenario.description}</Text>

              <View style={styles.scenarioFooter}>
                <Text style={styles.scenarioMeta}>Avg {scenario.averageScore}/10</Text>
                <Text style={styles.scenarioMeta}>Best {scenario.personalBest}/10</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Momentum</Text>
            <Ionicons name="flame-outline" size={18} color="#D4AF37" />
          </View>
          <Text style={styles.cardCopy}>
            {practiceSummary
              ? `You completed ${practiceSummary.weeklySessions} practice ${
                  practiceSummary.weeklySessions === 1 ? 'run' : 'runs'
                } this week with an average score of ${practiceSummary.averageScore}/10.`
              : 'Your latest practice results will appear here after the first completed run.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeedbackCard({
  icon,
  items,
  title,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
  title: string;
  tone: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Ionicons name={icon} size={18} color={tone} />
      </View>

      <View style={styles.feedbackList}>
        {items.map((item) => (
          <View key={item} style={styles.feedbackItem}>
            <View style={[styles.feedbackBullet, { backgroundColor: tone }]} />
            <Text style={styles.feedbackItemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Pill({ label, tone }: { label: string; tone: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: `${tone}20` }]}>
      <Text style={[styles.pillText, { color: tone }]}>{label}</Text>
    </View>
  );
}

function getDifficultyLabel(difficulty: number) {
  switch (difficulty) {
    case 1:
    case 2:
      return 'Easy';
    case 3:
      return 'Medium';
    case 4:
      return 'Hard';
    case 5:
      return 'Expert';
    default:
      return 'Unknown';
  }
}

function getDifficultyColor(difficulty: number) {
  switch (difficulty) {
    case 1:
    case 2:
      return '#22C55E';
    case 3:
      return '#F59E0B';
    case 4:
      return '#EF4444';
    case 5:
      return '#A855F7';
    default:
      return '#64748B';
  }
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
  featuredCard: {
    backgroundColor: '#111827',
    borderColor: '#D4AF37',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
  },
  featuredEyebrow: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  featuredRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featuredIcon: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  featuredCopy: {
    flex: 1,
  },
  featuredTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  featuredDescription: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
  },
  featuredMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 14,
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
    paddingVertical: 16,
  },
  secondaryActionText: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
  },
  filterScroll: {
    maxHeight: 48,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  filterPill: {
    backgroundColor: '#1E293B',
    borderRadius: 999,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterPillActive: {
    backgroundColor: '#D4AF37',
  },
  filterPillText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#020204',
  },
  listSection: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
  },
  scenarioCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  scenarioTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scenarioBadge: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  scenarioTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  scenarioDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  scenarioFooter: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  scenarioMeta: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  scenarioHero: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
  },
  scenarioIconBlock: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    marginBottom: 14,
    width: 48,
  },
  scenarioPrompt: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    marginBottom: 12,
  },
  cardTitle: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: '700',
  },
  cardCopy: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderRadius: 16,
    borderWidth: 1,
    color: '#F1F5F9',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 150,
    padding: 16,
    textAlignVertical: 'top',
  },
  inputFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  charCount: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  inlineAction: {
    paddingVertical: 4,
  },
  inlineActionText: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
  },
  actionsColumn: {
    gap: 12,
    marginHorizontal: 16,
  },
  feedbackHero: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: '#D4AF37',
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
  },
  feedbackScore: {
    color: '#D4AF37',
    fontSize: 42,
    fontWeight: '700',
  },
  feedbackLabel: {
    color: '#CBD5E1',
    fontSize: 14,
    marginTop: 6,
  },
  feedbackStars: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  feedbackList: {
    gap: 10,
  },
  feedbackItem: {
    flexDirection: 'row',
    gap: 10,
  },
  feedbackBullet: {
    borderRadius: 999,
    height: 8,
    marginTop: 7,
    width: 8,
  },
  feedbackItemText: {
    color: '#CBD5E1',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
});
