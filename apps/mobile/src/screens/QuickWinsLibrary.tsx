import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  skoolCourseSections,
  skoolCourses,
  skoolFeaturedCourseId,
  skoolPathOverview,
} from '../content/skoolCourses';
import { getDemoProgressState, recordDemoCourseOpen } from '../demo/progress';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchQuickWins,
  setSearchQuery,
  setSelectedCategory,
  toggleFavorite,
} from '../store/slices/contentSlice';
import { CourseItem, MainTabParamList } from '../types';

const quickWinCategories = ['All', 'before_tour', 'closing_help', 'objections', 'relationship'];

type LibraryTab = 'quickWins' | 'courses';
type LibraryNavigationProp = BottomTabNavigationProp<MainTabParamList, 'QuickWinsLibrary'>;

const posterThemes = {
  challenge: {
    accent: '#F1C84B',
    accentMuted: 'rgba(241, 200, 75, 0.22)',
    background: '#13151D',
    icon: 'ribbon-outline' as const,
    watermark: 'CHALLENGE',
  },
  pitch: {
    accent: '#C7D2E5',
    accentMuted: 'rgba(199, 210, 229, 0.18)',
    background: '#121317',
    icon: 'mic-outline' as const,
    watermark: 'PITCH',
  },
  incentive: {
    accent: '#8FB3FF',
    accentMuted: 'rgba(143, 179, 255, 0.18)',
    background: '#101522',
    icon: 'pricetag-outline' as const,
    watermark: 'ALCHEMY',
  },
  contract: {
    accent: '#F1C84B',
    accentMuted: 'rgba(241, 200, 75, 0.2)',
    background: '#18140C',
    icon: 'document-text-outline' as const,
    watermark: 'CONTRACT',
  },
  mindset: {
    accent: '#9B8CFF',
    accentMuted: 'rgba(155, 140, 255, 0.18)',
    background: '#121022',
    icon: 'sparkles-outline' as const,
    watermark: 'MINDSET',
  },
  story: {
    accent: '#78DAF8',
    accentMuted: 'rgba(120, 218, 248, 0.18)',
    background: '#0E151C',
    icon: 'business-outline' as const,
    watermark: 'TRUST',
  },
} as const;

export default function QuickWinsLibraryScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LibraryNavigationProp>();
  const { quickWins, isLoading, searchQuery, selectedCategory } = useAppSelector(
    (state) => state.content
  );

  const [activeTab, setActiveTab] = useState<LibraryTab>('quickWins');
  const [openedCourseIds, setOpenedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchQuickWins());
  }, [dispatch]);

  useEffect(() => {
    void loadCourseProgress();
  }, []);

  const filteredWins = useMemo(() => {
    return quickWins.filter((win) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        win.title.toLowerCase().includes(query) ||
        win.one_liner.toLowerCase().includes(query) ||
        win.action_steps.some((step) => step.toLowerCase().includes(query));
      const matchesCategory =
        !selectedCategory || selectedCategory === 'All' || win.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [quickWins, searchQuery, selectedCategory]);

  const filteredCourses = useMemo(() => {
    return [...skoolCourses]
      .sort((left, right) => (left.order ?? 99) - (right.order ?? 99))
      .filter((course) => {
        const query = searchQuery.trim().toLowerCase();

        return (
          !query ||
          course.title.toLowerCase().includes(query) ||
          course.module.toLowerCase().includes(query) ||
          course.copy.toLowerCase().includes(query) ||
          course.section?.toLowerCase().includes(query) ||
          course.coverTitle?.toLowerCase().includes(query)
        );
      });
  }, [searchQuery]);

  const filteredCourseSections = useMemo(() => {
    const filteredIds = new Set(filteredCourses.map((course) => course.id));

    return skoolCourseSections
      .map((section) => ({
        ...section,
        courses: section.courseIds
          .map((courseId) => filteredCourses.find((course) => course.id === courseId))
          .filter(Boolean) as CourseItem[],
      }))
      .filter((section) => section.courseIds.some((courseId) => filteredIds.has(courseId)));
  }, [filteredCourses]);

  const placeholder =
    activeTab === 'quickWins'
      ? 'Search quick wins, objections, closing help...'
      : 'Search sessions, tracks, and academy material...';

  const modulesCompleted = openedCourseIds.filter((courseId) =>
    skoolCourses.some((course) => course.id === courseId)
  ).length;
  const completionPercent =
    modulesCompleted === 0
      ? skoolPathOverview.defaultCompletionPercent
      : Math.max(
          skoolPathOverview.defaultCompletionPercent,
          Math.round((modulesCompleted / skoolCourses.length) * 100)
        );

  const featuredCourse =
    filteredCourses.find((course) => course.id === skoolFeaturedCourseId) || filteredCourses[0];
  const nextCourse =
    filteredCourses.find((course) => !openedCourseIds.includes(course.id)) || featuredCourse;
  const activeCourse = nextCourse || featuredCourse;
  const activeProgress = activeCourse
    ? getCourseProgress(activeCourse, openedCourseIds, activeCourse.id)
    : 0;

  async function loadCourseProgress() {
    try {
      const state = await getDemoProgressState();
      setOpenedCourseIds(state.coursesOpened);
    } catch {
      setOpenedCourseIds([]);
    }
  }

  const handleOpenCourse = async (courseId: string, url: string) => {
    try {
      await recordDemoCourseOpen(courseId);
      setOpenedCourseIds((current) => {
        if (current.includes(courseId)) {
          return current;
        }

        return [courseId, ...current];
      });
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', 'This lesson link could not be opened on this device.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Library</Text>
          <Text style={styles.subtitle}>
            Quick wins for the floor plus a structured academy path for your Skool sessions.
          </Text>
        </View>

        <View style={styles.segmentedControl}>
          <SegmentButton
            active={activeTab === 'quickWins'}
            label="Quick Wins"
            onPress={() => setActiveTab('quickWins')}
          />
          <SegmentButton
            active={activeTab === 'courses'}
            label="Courses"
            onPress={() => setActiveTab('courses')}
          />
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
          />
        </View>

        {activeTab === 'quickWins' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            {quickWinCategories.map((filter) => {
              const isActive = selectedCategory === filter;

              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.85}
                  onPress={() => dispatch(setSelectedCategory(filter))}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {formatFilterLabel(filter)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'courses' ? (
            <>
              <View style={styles.pathCard}>
                <Text style={styles.pathEyebrow}>{skoolPathOverview.eyebrow}</Text>
                <Text style={styles.pathTitle}>{skoolPathOverview.title}</Text>
                <Text style={styles.pathDescription}>{skoolPathOverview.description}</Text>

                <View style={styles.pathMetricRow}>
                  <Text style={styles.pathMetricValue}>{completionPercent}%</Text>
                  <Text style={styles.pathMetricLabel}>Path completion</Text>
                </View>

                <View style={styles.pathTrack}>
                  <View style={[styles.pathFill, { width: `${completionPercent}%` }]} />
                </View>
              </View>

              {activeCourse ? (
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => handleOpenCourse(activeCourse.id, activeCourse.link)}
                  style={styles.resumeCard}
                >
                  <View style={styles.resumeHeader}>
                    <View style={styles.resumeBadge}>
                      <Ionicons name="play-circle" size={12} color="#AEBEFF" />
                      <Text style={styles.resumeBadgeText}>In Progress</Text>
                    </View>

                    <Text style={styles.resumeMetaText}>
                      {openedCourseIds.includes(activeCourse.id) ? 'Completed' : 'Now learning'}
                    </Text>
                  </View>

                  <Text style={styles.resumeTitle}>{activeCourse.title}</Text>
                  <Text style={styles.resumeCopy}>{activeCourse.copy}</Text>

                  <View style={styles.resumeProgressRow}>
                    <Text style={styles.resumeProgressLabel}>Progress: {activeProgress}%</Text>
                    <Text style={styles.resumeProgressValue}>
                      {openedCourseIds.includes(activeCourse.id)
                        ? 'Mastered'
                        : activeCourse.statusLabel || 'Resume Session'}
                    </Text>
                  </View>

                  <View style={styles.resumeTrack}>
                    <View style={[styles.resumeFill, { width: `${activeProgress}%` }]} />
                  </View>

                  <View style={styles.resumeButton}>
                    <Text style={styles.resumeButtonText}>
                      {openedCourseIds.includes(activeCourse.id) ? 'Review Session' : 'Resume Session'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              <View style={styles.statGrid}>
                <StatTile
                  icon="ribbon-outline"
                  label="Modules Completed"
                  value={`${modulesCompleted}/${skoolCourses.length}`}
                />
                <StatTile
                  icon="time-outline"
                  label="Total Training Time"
                  value={`${skoolPathOverview.totalTrainingHours}h`}
                />
              </View>

              {filteredCourseSections.map((section) => (
                <View key={section.id} style={styles.courseSection}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <Text style={styles.sectionEyebrow}>{section.eyebrow}</Text>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>

                    <Text style={styles.sectionAction}>View All</Text>
                  </View>

                  {section.courses.map((course) => {
                    const isOpened = openedCourseIds.includes(course.id);
                    const progress = getCourseProgress(course, openedCourseIds, activeCourse?.id);

                    return (
                      <TouchableOpacity
                        key={course.id}
                        activeOpacity={0.92}
                        onPress={() => handleOpenCourse(course.id, course.link)}
                        style={styles.lessonCard}
                      >
                        <CoursePoster course={course} />

                        <View style={styles.lessonBody}>
                          <Text style={styles.lessonTitle}>{course.title}</Text>
                          <Text style={styles.lessonCopy}>{course.copy}</Text>

                          <View style={styles.lessonMetaRow}>
                            <View style={styles.lessonMetaLeft}>
                              <Ionicons name="time-outline" size={12} color="#C9BEAB" />
                              <Text style={styles.lessonMetaText}>
                                {course.durationLabel || '32m Session'}
                              </Text>
                            </View>

                            <Text style={styles.lessonStatus}>
                              {isOpened
                                ? 'Completed'
                                : activeCourse?.id === course.id
                                  ? course.statusLabel || 'In Progress'
                                  : 'Get Started'}
                            </Text>
                          </View>

                          <View style={styles.lessonTrack}>
                            <View style={[styles.lessonFill, { width: `${progress}%` }]} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              {filteredCourses.length === 0 ? (
                <EmptyState
                  copy="No courses matched that search. Try a shorter phrase or search by topic."
                  icon="film-outline"
                  title="No matching lessons"
                />
              ) : null}
            </>
          ) : (
            <>
              {isLoading ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator color="#D4AF37" />
                  <Text style={styles.loadingText}>Loading quick wins...</Text>
                </View>
              ) : null}

              {!isLoading &&
                filteredWins.map((win) => (
                  <View key={win.id} style={styles.winCard}>
                    <View style={styles.winHeader}>
                      <View style={styles.winCategoryBadge}>
                        <Text style={styles.winCategoryText}>{formatFilterLabel(win.category)}</Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => dispatch(toggleFavorite(win.id))}
                        style={styles.favoriteButton}
                      >
                        <Ionicons
                          name={win.is_favorite ? 'heart' : 'heart-outline'}
                          size={20}
                          color={win.is_favorite ? '#EF4444' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.winTitle}>{win.title}</Text>
                    <Text style={styles.winOneLiner}>{win.one_liner}</Text>

                    <View style={styles.winFooter}>
                      <View style={styles.timingSection}>
                        <Ionicons name="time" size={14} color="#94A3B8" />
                        <Text style={styles.timingText}>{win.timing}</Text>
                      </View>

                      <View style={styles.impactSection}>
                        <Text style={styles.impactLabel}>Impact</Text>
                        <View style={styles.impactStars}>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Ionicons
                              key={`${win.id}-${index}`}
                              name="star"
                              size={12}
                              color={
                                index < Math.ceil(win.estimated_impact / 2) ? '#D4AF37' : '#334155'
                              }
                            />
                          ))}
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('AICoachChat')}
                      style={styles.applyButton}
                    >
                      <Text style={styles.applyButtonText}>Practice in AI Coach</Text>
                    </TouchableOpacity>
                  </View>
                ))}

              {!isLoading && filteredWins.length === 0 ? (
                <EmptyState
                  copy="Try another category or clear the search to see more battle-tested tactics."
                  icon="flash-outline"
                  title="No quick wins found"
                />
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.segmentButton, active && styles.segmentButtonActive]}
    >
      <Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statTile}>
      <View style={styles.statIconChip}>
        <Ionicons name={icon} size={18} color="#F1C84B" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CoursePoster({ course }: { course: CourseItem }) {
  const theme = posterThemes[(course.coverVariant as keyof typeof posterThemes) || 'challenge'];

  return (
    <View style={[styles.posterCard, { backgroundColor: theme.background }]}>
      <View style={[styles.posterGlow, { backgroundColor: theme.accentMuted }]} />
      <View style={styles.posterTopRow}>
        <Text style={[styles.posterEyebrow, { color: theme.accent }]}>
          {course.coverEyebrow || course.section || 'ACADEMY SESSION'}
        </Text>
        <Text style={styles.posterDuration}>{course.durationLabel || '32m'}</Text>
      </View>

      <View style={styles.posterIconWrap}>
        <Ionicons color={theme.accentMuted} name={theme.icon} size={68} />
        <Text style={[styles.posterWatermark, { color: theme.accent }]}>
          {course.coverTitle || course.title.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

function EmptyState({
  copy,
  icon,
  title,
}: {
  copy: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={28} color="#D4AF37" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyCopy}>{copy}</Text>
    </View>
  );
}

function formatFilterLabel(value: string) {
  if (value === 'All') {
    return value;
  }

  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCourseProgress(course: CourseItem, openedCourseIds: string[], activeCourseId?: string) {
  if (openedCourseIds.includes(course.id)) {
    return 100;
  }

  if (activeCourseId === course.id) {
    return course.id === skoolFeaturedCourseId ? 25 : 18;
  }

  return 4;
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    color: '#F4EFE7',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9B9083',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  segmentedControl: {
    backgroundColor: '#121218',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 6,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#F1C84B',
  },
  segmentButtonText: {
    color: '#8F867B',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentButtonTextActive: {
    color: '#0B0A0E',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#14141B',
    borderColor: '#24232A',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: '#F1F5F9',
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  filterPill: {
    backgroundColor: '#15151C',
    borderRadius: 999,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterPillActive: {
    backgroundColor: '#F1C84B',
  },
  filterText: {
    color: '#B2A99D',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#0B0A0E',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
  },
  pathCard: {
    backgroundColor: '#13131A',
    borderColor: '#23222B',
    borderRadius: 26,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
  },
  pathEyebrow: {
    color: '#F1C84B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pathTitle: {
    color: '#F4EFE7',
    fontSize: 33,
    fontWeight: '700',
    lineHeight: 38,
  },
  pathDescription: {
    color: '#B2A99D',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 18,
  },
  pathMetricRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  pathMetricValue: {
    color: '#F1C84B',
    fontSize: 38,
    fontWeight: '700',
  },
  pathMetricLabel: {
    color: '#D2C8BA',
    fontSize: 11,
    letterSpacing: 1.9,
    textTransform: 'uppercase',
  },
  pathTrack: {
    backgroundColor: '#23212A',
    borderRadius: 999,
    height: 7,
    overflow: 'hidden',
  },
  pathFill: {
    backgroundColor: '#F1C84B',
    borderRadius: 999,
    height: '100%',
  },
  resumeCard: {
    backgroundColor: '#17171F',
    borderColor: '#282730',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  resumeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resumeBadge: {
    alignItems: 'center',
    backgroundColor: '#1F2340',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resumeBadgeText: {
    color: '#AEBEFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resumeMetaText: {
    color: '#F1C84B',
    fontSize: 11,
    fontWeight: '700',
  },
  resumeTitle: {
    color: '#F4EFE7',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 8,
  },
  resumeCopy: {
    color: '#B6AC9F',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  resumeProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumeProgressLabel: {
    color: '#D8CDBD',
    fontSize: 12,
  },
  resumeProgressValue: {
    color: '#F1C84B',
    fontSize: 12,
    fontWeight: '700',
  },
  resumeTrack: {
    backgroundColor: '#26242C',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  resumeFill: {
    backgroundColor: '#F1C84B',
    borderRadius: 999,
    height: '100%',
  },
  resumeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F1C84B',
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  resumeButtonText: {
    color: '#0B0A0E',
    fontSize: 14,
    fontWeight: '700',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  statTile: {
    backgroundColor: '#14141B',
    borderColor: '#24232A',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    minHeight: 122,
    padding: 16,
  },
  statIconChip: {
    alignItems: 'center',
    backgroundColor: '#2A2312',
    borderRadius: 12,
    height: 34,
    justifyContent: 'center',
    marginBottom: 14,
    width: 34,
  },
  statValue: {
    color: '#F4EFE7',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  statLabel: {
    color: '#9C9387',
    fontSize: 11,
    letterSpacing: 1.2,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  courseSection: {
    marginBottom: 18,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionEyebrow: {
    color: '#8F867B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#F4EFE7',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionAction: {
    color: '#D5CCBE',
    fontSize: 12,
  },
  lessonCard: {
    backgroundColor: '#14141A',
    borderColor: '#24232A',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  posterCard: {
    height: 172,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    position: 'relative',
  },
  posterGlow: {
    borderRadius: 120,
    height: 150,
    opacity: 1,
    position: 'absolute',
    right: -28,
    top: 12,
    width: 150,
  },
  posterTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  posterEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    maxWidth: '70%',
    textTransform: 'uppercase',
  },
  posterDuration: {
    color: '#EDE8DF',
    fontSize: 10,
    fontWeight: '700',
  },
  posterIconWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4,
    zIndex: 1,
  },
  posterWatermark: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.8,
    lineHeight: 26,
    marginTop: 18,
    maxWidth: '80%',
  },
  lessonBody: {
    padding: 14,
  },
  lessonTitle: {
    color: '#F4EFE7',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 8,
  },
  lessonCopy: {
    color: '#AFA598',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lessonMetaLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  lessonMetaText: {
    color: '#C9BEAB',
    fontSize: 12,
  },
  lessonStatus: {
    color: '#F1C84B',
    fontSize: 12,
    fontWeight: '700',
  },
  lessonTrack: {
    backgroundColor: '#26242C',
    borderRadius: 999,
    height: 4,
    overflow: 'hidden',
  },
  lessonFill: {
    backgroundColor: '#F1C84B',
    borderRadius: 999,
    height: '100%',
  },
  loadingState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 30,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  winCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  winHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  winCategoryBadge: {
    backgroundColor: '#0F172A',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  winCategoryText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  favoriteButton: {
    padding: 4,
  },
  winTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  winOneLiner: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  winFooter: {
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  timingSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  timingText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  impactSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  impactLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  impactStars: {
    flexDirection: 'row',
    gap: 2,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 13,
  },
  applyButtonText: {
    color: '#020204',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    padding: 20,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  emptyCopy: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});
