/**
 * VCSA Pocket - Play Role Screen
 * Practice scenarios with AI feedback
 * Based on STITCH_DESIGN_PROMPT.md Screen 7 specifications
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  Typography,
} from '@/theme';
import {
  Button,
  Card,
  Badge,
  ProgressBar,
} from '@/components/ui';

interface Scenario {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  difficulty: number; // 1-5
  averageScore: number;
  personalBest: number;
}

interface PracticeMode {
  active: boolean;
  scenario: Scenario | null;
  userInput: string;
  isRecording: boolean;
  recordingTime: number;
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedResponse: string;
}

const PlayRoleScreen: React.FC = () => {
  const navigation = useNavigation();
  const [mode, setMode] = useState<'selection' | 'practice' | 'feedback'>('selection');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock scenarios data
  const scenarios: Scenario[] = [
    {
      id: 'price-objection',
      icon: '💰',
      title: 'The Price Objection',
      description: '"It\'s too expensive for us"',
      category: 'Price',
      difficulty: 3,
      averageScore: 7.2,
      personalBest: 8.5,
    },
    {
      id: 'spouse-approval',
      icon: '📅',
      title: 'Spouse Needs Approval',
      description: '"I need to talk to my spouse"',
      category: 'Spouse',
      difficulty: 2,
      averageScore: 9.0,
      personalBest: 9.0,
    },
    {
      id: 'not-right-time',
      icon: '⏰',
      title: 'Not the Right Time',
      description: '"We\'re not looking right now"',
      category: 'Timing',
      difficulty: 3,
      averageScore: 7.5,
      personalBest: 8.0,
    },
    {
      id: 'already-member',
      icon: '🏆',
      title: 'Already a Member',
      description: '"We already have a membership"',
      category: 'Competition',
      difficulty: 2,
      averageScore: 6.0,
      personalBest: 7.5,
    },
    {
      id: 'competitor-compare',
      icon: '🔄',
      title: 'Competitor Comparison',
      description: '"X Brand offers more for less"',
      category: 'Competition',
      difficulty: 4,
      averageScore: 8.0,
      personalBest: 8.5,
    },
  ];

  const [practiceMode, setPracticeMode] = useState<PracticeMode>({
    active: false,
    scenario: null,
    userInput: '',
    isRecording: false,
    recordingTime: 0,
  });

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const categories = ['All', 'Price', 'Closing', 'Spouse', 'Timing', 'Competition'];

  const filteredScenarios = selectedCategory === 'All'
    ? scenarios
    : scenarios.filter(s => s.category === selectedCategory);

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return Colors.success;
      case 3:
        return Colors.warning;
      case 4:
        return Colors.error;
      case 5:
        return Colors.mindset; // Expert
      default:
        return Colors.border;
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
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
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return Colors.excellent;
    if (score >= 7) return Colors.good;
    if (score >= 5) return Colors.fair;
    return Colors.poor;
  };

  const startPractice = (scenario: Scenario) => {
    setPracticeMode({
      active: true,
      scenario,
      userInput: '',
      isRecording: false,
      recordingTime: 0,
    });
    setMode('practice');
  };

  const submitResponse = () => {
    // Simulate AI feedback
    setFeedback({
      score: 8.5,
      strengths: [
        'Good acknowledgment',
        'Confident delivery',
        'Used social proof effectively',
      ],
      improvements: [
        'Add specific benefit mention',
        'Include urgency element',
        'Close with next step',
      ],
      suggestedResponse:
        '"I understand budget is important. Most members find the value far exceeds the investment, especially with our exclusive perks like vacation exchanges and member-only events."',
    });
    setMode('feedback');
  };

  const renderSelectionScreen = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PLAY ROLE</Text>
        <Text style={styles.headerSubtitle}>Practice & Perfect</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Choose a Scenario</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Scenario */}
        <View style={styles.featuredSection}>
          <Card style={styles.featuredCard} padding={20}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredStar}>⭐</Text>
              <Text style={styles.featuredLabel}>FEATURED SCENARIO</Text>
            </View>

            <Text style={styles.featuredIcon}>{scenarios[0].icon}</Text>
            <Text style={styles.featuredTitle}>{scenarios[0].title}</Text>
            <Text style={styles.featuredDescription}>
              Practice: {scenarios[0].description}
            </Text>

            <View style={styles.featuredDifficulty}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.difficultyDot,
                    i < scenarios[0].difficulty && {
                      backgroundColor: getDifficultyColor(scenarios[0].difficulty),
                    },
                  ]}
                />
              ))}
              <Text style={styles.featuredDifficultyText}>
                {getDifficultyLabel(scenarios[0].difficulty)} Difficulty
              </Text>
            </View>

            <View style={styles.featuredScores}>
              <View style={styles.scoreColumn}>
                <Text style={styles.scoreLabel}>Avg. Score</Text>
                <Text style={styles.scoreValue}>{scenarios[0].averageScore}/10</Text>
                <ProgressBar progress={scenarios[0].averageScore / 10} height={4} />
              </View>
              <View style={styles.scoreColumn}>
                <Text style={styles.scoreLabel}>Your Best</Text>
                <Text style={[styles.scoreValue, { color: Colors.gold }]}>
                  {scenarios[0].personalBest}/10
                </Text>
                <ProgressBar progress={scenarios[0].personalBest / 10} height={4} color={Colors.gold} />
              </View>
            </View>

            <Button
              title="▶ START PRACTICE"
              onPress={() => startPractice(scenarios[0])}
              style={styles.featuredButton}
            />
          </Card>
        </View>

        {/* Scenario List */}
        <View style={styles.scenariosSection}>
          <Text style={styles.scenariosSectionTitle}>All Scenarios</Text>

          {scenarios.slice(1).map((scenario) => (
            <Card
              key={scenario.id}
              style={styles.scenarioCard}
              onPress={() => startPractice(scenario)}
              padding={16}
            >
              <View style={styles.scenarioHeader}>
                <Text style={styles.scenarioIcon}>{scenario.icon}</Text>
                <View style={styles.scenarioHeaderRight}>
                  <View style={styles.scenarioDifficulty}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.difficultyDotSmall,
                          i < scenario.difficulty && {
                            backgroundColor: getDifficultyColor(scenario.difficulty),
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <Text style={styles.scenarioDescription}>{scenario.description}</Text>

              <View style={styles.scenarioFooter}>
                {scenario.personalBest === 10 && (
                  <Badge text="🏆 Personal Best" variant="gold" size="small" />
                )}
                <Text
                  style={[
                    styles.scenarioScore,
                    { color: getScoreColor(scenario.personalBest) },
                  ]}
                >
                  Score: {scenario.personalBest}/10
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Weekly Stats Footer */}
        <View style={styles.weeklyStatsFooter}>
          <Text style={styles.weeklyStatsText}>
            This Week: 12 practices | +3 vs last week
          </Text>
          <Text style={styles.weeklyStatsMotivation}>
            🔥 You're on fire! Keep it up!
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );

  const renderPracticeMode = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setMode('selection');
            setPracticeMode({ ...practiceMode, active: false });
          }}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{practiceMode.scenario?.title}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>⏸️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Client Objection Display */}
        <View style={styles.objectionDisplay}>
          <Text style={styles.objectionIcon}>🙋</Text>
          <Text style={styles.objectionQuote}>
            "{practiceMode.scenario?.description}"
          </Text>
        </View>

        {/* AI Tip Box */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipLabel}>AI Coach Tip:</Text>
          <Text style={styles.tipText}>
            Acknowledge first, then pivot to value, not price
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>🎤 Your Response:</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Record your response..."
              placeholderTextColor={Colors.textMuted}
              multiline
              value={practiceMode.userInput}
              onChangeText={(text) => setPracticeMode({ ...practiceMode, userInput: text })}
              maxLength={280}
            />
            <Text style={styles.charCount}>
              {practiceMode.userInput.length}/280 characters
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.practiceActions}>
          <Button
            title="🎙️ Record"
            onPress={() => console.log('Record voice')}
            variant="primary"
            style={styles.practiceButton}
          />
          <Button
            title="⌨️ Type"
            onPress={() => console.log('Type mode')}
            variant="secondary"
            style={styles.practiceButton}
          />
          <Button
            title="✓ Submit"
            onPress={submitResponse}
            variant="primary"
            disabled={!practiceMode.userInput}
            style={styles.practiceButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );

  const renderFeedbackScreen = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Success Header */}
        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackIcon}>✓</Text>
          <Text style={styles.feedbackTitle}>Response Complete</Text>
        </View>

        {/* Score Display */}
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreDisplayText}>Your Score:</Text>
          <Text style={styles.scoreDisplayNumber}>{feedback?.score}/10</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.star,
                  i < Math.floor(feedback!.score / 2)
                    ? styles.starFilled
                    : styles.starEmpty,
                ]}
              >
                ⭐
              </Text>
            ))}
          </View>
        </View>

        {/* Strengths Section */}
        <Card style={styles.feedbackSection} padding={16}>
          <Text style={styles.feedbackSectionTitle}>
            ✅ Strengths
          </Text>
          {feedback?.strengths.map((strength, index) => (
            <Text key={index} style={styles.feedbackBullet}>
              • {strength}
            </Text>
          ))}
        </Card>

        {/* Improvements Section */}
        <Card style={styles.feedbackSection} padding={16}>
          <Text style={styles.feedbackSectionTitle}>
            💡 Improvements
          </Text>
          {feedback?.improvements.map((improvement, index) => (
            <Text key={index} style={styles.feedbackBullet}>
              • {improvement}
            </Text>
          ))}
        </Card>

        {/* Suggested Response */}
        <Card style={styles.suggestedResponseCard} padding={16}>
          <Text style={styles.suggestedResponseTitle}>
            🎯 Suggested Response
          </Text>
          <Text style={styles.suggestedResponseText}>
            {feedback?.suggestedResponse}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.feedbackActions}>
          <Button
            title="🔄 Try Again"
            onPress={() => {
              setMode('practice');
              setFeedback(null);
            }}
            variant="secondary"
            style={styles.feedbackButton}
          />
          <Button
            title="→ Next Scenario"
            onPress={() => {
              setMode('selection');
              setFeedback(null);
              setPracticeMode({
                active: false,
                scenario: null,
                userInput: '',
                isRecording: false,
                recordingTime: 0,
              });
            }}
            style={styles.feedbackButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {mode === 'selection' && renderSelectionScreen()}
      {mode === 'practice' && renderPracticeMode()}
      {mode === 'feedback' && renderFeedbackScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
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
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  headerSubtitle: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: Spacing.s,
  },

  headerAction: {
    padding: Spacing.s,
  },

  headerActionIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },

  scrollView: {
    flex: 1,
  },

  // Filter Section
  filterSection: {
    paddingHorizontal: Spacing.padding.md,
    paddingTop: Spacing.padding.md,
    paddingBottom: Spacing.sm,
  },

  filterTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  filterScroll: {
    flexDirection: 'row',
  },

  filterChip: {
    paddingHorizontal: Spacing.padding.md,
    paddingVertical: Spacing.xs,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.s,
  },

  filterChipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  filterChipText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },

  filterChipTextActive: {
    color: Colors.black,
  },

  // Featured Section
  featuredSection: {
    paddingHorizontal: Spacing.padding.md,
    marginBottom: Spacing.padding.md,
  },

  featuredCard: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: Colors.gold,
    borderRadius: 20,
  },

  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  featuredStar: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },

  featuredLabel: {
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  featuredIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  featuredTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },

  featuredDescription: {
    fontSize: Typography.fontSize.h5,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  featuredDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },

  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginHorizontal: 2,
  },

  featuredDifficultyText: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.s,
  },

  featuredScores: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },

  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },

  scoreLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  scoreValue: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  featuredButton: {
    marginTop: Spacing.sm,
  },

  // Scenario List
  scenariosSection: {
    paddingHorizontal: Spacing.padding.md,
  },

  scenariosSectionTitle: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  scenarioCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  scenarioIcon: {
    fontSize: 32,
  },

  scenarioHeaderRight: {
    alignItems: 'flex-end',
  },

  scenarioDifficulty: {
    flexDirection: 'row',
  },

  difficultyDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginRight: 2,
  },

  scenarioTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  scenarioDescription: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },

  scenarioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scenarioScore: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.bold,
  },

  // Weekly Stats Footer
  weeklyStatsFooter: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.padding.md,
  },

  weeklyStatsText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },

  weeklyStatsMotivation: {
    fontSize: Typography.fontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Practice Mode Styles
  objectionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    borderRadius: 8,
    padding: Spacing.padding.md,
    marginHorizontal: Spacing.padding.md,
    marginTop: Spacing.padding.md,
    marginBottom: Spacing.md,
  },

  objectionIcon: {
    fontSize: 40,
    marginRight: Spacing.md,
  },

  objectionQuote: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    flex: 1,
  },

  tipBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 8,
    padding: Spacing.padding.md,
    marginHorizontal: Spacing.padding.md,
    marginBottom: Spacing.md,
  },

  tipIcon: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },

  tipLabel: {
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },

  tipText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
  },

  inputSection: {
    paddingHorizontal: Spacing.padding.md,
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  inputBox: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.padding.md,
    minHeight: 120,
  },

  textInput: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    flex: 1,
    textAlignVertical: 'top',
  },

  charCount: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },

  practiceActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.padding.md,
    gap: Spacing.s,
  },

  practiceButton: {
    flex: 1,
  },

  // Feedback Screen Styles
  feedbackHeader: {
    alignItems: 'center',
    padding: Spacing.padding.xl,
    marginBottom: Spacing.lg,
  },

  feedbackIcon: {
    fontSize: 40,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },

  feedbackTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },

  scoreDisplay: {
    alignItems: 'center',
    paddingHorizontal: Spacing.padding.md,
    marginBottom: Spacing.xl,
  },

  scoreDisplayText: {
    fontSize: Typography.fontSize.h5,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },

  scoreDisplayNumber: {
    fontSize: 48,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
  },

  starsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },

  star: {
    fontSize: 32,
  },

  starFilled: {
    color: Colors.gold,
  },

  starEmpty: {
    color: Colors.border,
  },

  feedbackSection: {
    marginBottom: Spacing.md,
  },

  feedbackSectionTitle: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },

  feedbackBullet: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  suggestedResponseCard: {
    backgroundColor: '#0F172A',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    marginBottom: Spacing.md,
  },

  suggestedResponseTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.info,
    marginBottom: Spacing.sm,
  },

  suggestedResponseText: {
    fontSize: Typography.fontSize.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: Typography.lineHeight.body,
  },

  feedbackActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.padding.md,
    gap: Spacing.s,
    marginBottom: Spacing.xl,
  },

  feedbackButton: {
    flex: 1,
  },

  bottomSpacing: {
    height: 80,
  },
});

export default PlayRoleScreen;
