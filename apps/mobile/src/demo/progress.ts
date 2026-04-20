import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DailyGoal,
  GoalSheetData,
  PracticeSession,
  PracticeSummary,
  QuickWin,
  ReadinessScore,
  TourResult,
} from '../types';
import {
  createDemoDailyGoal,
  createDemoQuickWins,
  createDemoReadinessScore,
} from './data';

const DEMO_PROGRESS_STORAGE_KEY = 'vcsa-pocket-demo-progress-v2';

type StoredTourResult = TourResult & {
  created_at: string;
};

interface DemoProgressState {
  version: 2;
  dailyGoal: DailyGoal;
  goalSheet: GoalSheetData;
  quickWins: QuickWin[];
  practiceSessions: PracticeSession[];
  tourHistory: StoredTourResult[];
  aiCoachSessions: number;
  coursesOpened: string[];
  streak: number;
  lastUpdatedAt: string;
}

type DemoTourInput = TourResult & {
  created_at?: string;
};

type DemoPracticeInput = {
  scenario_id: string;
  scenario_title: string;
  category: string;
  score: number;
  response_excerpt: string;
};

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function createDefaultGoalSheet(): GoalSheetData {
  return {
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
  };
}

function createDefaultProgressState(): DemoProgressState {
  return {
    version: 2,
    dailyGoal: createDemoDailyGoal(),
    goalSheet: createDefaultGoalSheet(),
    quickWins: createDemoQuickWins(),
    practiceSessions: [
      {
        id: 'practice_seed_1',
        scenario_id: 'price-objection',
        scenario_title: 'The Price Objection',
        category: 'Price',
        score: 8.4,
        response_excerpt: 'I understand why it feels expensive at first.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'practice_seed_2',
        scenario_id: 'spouse-approval',
        scenario_title: 'Spouse Approval',
        category: 'Spouse',
        score: 8.9,
        response_excerpt: 'Let’s make sure both of you feel clear on the value.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    ],
    tourHistory: [],
    aiCoachSessions: 1,
    coursesOpened: [],
    streak: 12,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeDailyGoalForToday(goal: DailyGoal) {
  if (goal.date === getTodayIsoDate()) {
    return goal;
  }

  return {
    ...createDemoDailyGoal(),
    goals: goal.goals,
    goal_id: `goal_${getTodayIsoDate()}`,
  };
}

function normalizeProgressState(state: DemoProgressState): DemoProgressState {
  const normalizedDailyGoal = normalizeDailyGoalForToday(state.dailyGoal);
  const normalizedStreak = Math.max(state.streak || 0, state.goalSheet.streak.current || 0);

  return {
    ...state,
    version: 2,
    dailyGoal: normalizedDailyGoal,
    quickWins: state.quickWins?.length ? state.quickWins : createDemoQuickWins(),
    practiceSessions: state.practiceSessions || [],
    tourHistory: state.tourHistory || [],
    aiCoachSessions: state.aiCoachSessions || 0,
    coursesOpened: state.coursesOpened || [],
    streak: normalizedStreak,
    goalSheet: {
      ...createDefaultGoalSheet(),
      ...state.goalSheet,
      streak: {
        ...createDefaultGoalSheet().streak,
        ...state.goalSheet?.streak,
        current: normalizedStreak,
        best: Math.max(state.goalSheet?.streak?.best || 0, normalizedStreak),
      },
    },
    lastUpdatedAt: state.lastUpdatedAt || new Date().toISOString(),
  };
}

async function saveDemoProgressState(state: DemoProgressState) {
  await AsyncStorage.setItem(DEMO_PROGRESS_STORAGE_KEY, JSON.stringify(state));
}

export async function getDemoProgressState(): Promise<DemoProgressState> {
  const raw = await AsyncStorage.getItem(DEMO_PROGRESS_STORAGE_KEY);

  if (!raw) {
    const initial = createDefaultProgressState();
    await saveDemoProgressState(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(raw) as DemoProgressState;
    const normalized = normalizeProgressState(parsed);
    await saveDemoProgressState(normalized);
    return normalized;
  } catch {
    const fallback = createDefaultProgressState();
    await saveDemoProgressState(fallback);
    return fallback;
  }
}

export async function ensureDemoProgressState() {
  return getDemoProgressState();
}

export async function getDemoQuickWinsState() {
  const state = await getDemoProgressState();
  return clone(state.quickWins);
}

export async function toggleDemoQuickWinFavorite(quickWinId: string) {
  const state = await getDemoProgressState();
  const quickWinIndex = state.quickWins.findIndex((quickWin) => quickWin.id === quickWinId);

  if (quickWinIndex === -1) {
    return null;
  }

  const existing = state.quickWins[quickWinIndex];
  const nextFavorite = !existing.is_favorite;

  state.quickWins[quickWinIndex] = {
    ...existing,
    is_favorite: nextFavorite,
    favorite_count: Math.max(0, existing.favorite_count + (nextFavorite ? 1 : -1)),
  };

  state.lastUpdatedAt = new Date().toISOString();
  await saveDemoProgressState(state);

  return clone(state.quickWins[quickWinIndex]);
}

export async function recordDemoAiCoachSession() {
  const state = await getDemoProgressState();
  state.aiCoachSessions += 1;
  state.dailyGoal.progress.ai_sessions_used += 1;
  state.lastUpdatedAt = new Date().toISOString();
  await saveDemoProgressState(state);
}

export async function recordDemoCourseOpen(courseId: string) {
  const state = await getDemoProgressState();

  if (!state.coursesOpened.includes(courseId)) {
    state.coursesOpened.unshift(courseId);
  }

  state.lastUpdatedAt = new Date().toISOString();
  await saveDemoProgressState(state);
}

export async function recordDemoPracticeSession(input: DemoPracticeInput) {
  const state = await getDemoProgressState();
  const session: PracticeSession = {
    ...input,
    id: `practice_${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  state.practiceSessions.unshift(session);
  state.streak += 1;
  state.goalSheet.streak.current = state.streak;
  state.goalSheet.streak.best = Math.max(state.goalSheet.streak.best, state.streak);
  state.lastUpdatedAt = new Date().toISOString();

  await saveDemoProgressState(state);
  return session;
}

export async function recordDemoTourResult(input: DemoTourInput) {
  const state = await getDemoProgressState();
  const createdAt = input.created_at || new Date().toISOString();
  const storedResult: StoredTourResult = {
    ...input,
    created_at: createdAt,
  };

  state.tourHistory.unshift(storedResult);
  state.dailyGoal.progress.tours_completed += 1;

  if (storedResult.outcome === 'sale') {
    state.dailyGoal.progress.sales_closed += 1;
    state.goalSheet.sales.current += 1;
    state.goalSheet.commission.total += state.goalSheet.averageDeal.amount;
    state.goalSheet.currentEarnings += state.goalSheet.averageDeal.amount;
    state.goalSheet.incomeBreakdown.commissions += state.goalSheet.averageDeal.amount;
  }

  if (storedResult.ai_coach_used) {
    state.aiCoachSessions += 1;
    state.dailyGoal.progress.ai_sessions_used += 1;
  }

  state.streak += 1;
  state.goalSheet.streak.current = state.streak;
  state.goalSheet.streak.best = Math.max(state.goalSheet.streak.best, state.streak);
  state.lastUpdatedAt = createdAt;

  await saveDemoProgressState(state);
  return clone(storedResult);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export async function getDemoReadinessScore(): Promise<ReadinessScore> {
  const state = await getDemoProgressState();
  const base = createDemoReadinessScore();
  const practiceSummary = await getDemoPracticeSummary();
  const saleCount = state.tourHistory.filter((tour) => tour.outcome === 'sale').length;
  const closeRate = state.tourHistory.length > 0 ? saleCount / state.tourHistory.length : 0.35;

  const training = clamp(72 + practiceSummary.weeklySessions * 4, 72, 97);
  const performance = clamp(68 + closeRate * 45 + saleCount * 2, 68, 96);
  const streak = clamp(55 + state.streak * 2.6, 55, 98);
  const aiUsage = clamp(60 + state.aiCoachSessions * 4, 60, 95);
  const quickWins = clamp(
    70 + state.quickWins.filter((quickWin) => quickWin.is_favorite).length * 3,
    70,
    94
  );
  const mentalGame = clamp(
    72 + Math.max(0, practiceSummary.averageScore - 7) * 8,
    72,
    95
  );

  const score = Math.round(
    training * 0.28 +
      performance * 0.24 +
      streak * 0.16 +
      aiUsage * 0.1 +
      quickWins * 0.1 +
      mentalGame * 0.12
  );

  return {
    ...base,
    score,
    components: {
      training: Math.round(training),
      performance: Math.round(performance),
      streak: Math.round(streak),
      ai_usage: Math.round(aiUsage),
      quick_wins: Math.round(quickWins),
      mental_game: Math.round(mentalGame),
    },
    recommended_actions: buildRecommendations(state, practiceSummary),
  };
}

function buildRecommendations(state: DemoProgressState, practiceSummary: PracticeSummary) {
  const recommendations: string[] = [];

  if (practiceSummary.weeklySessions < 3) {
    recommendations.push('Run at least one Play Role drill before your next shift.');
  }

  if (state.dailyGoal.progress.tours_completed < state.dailyGoal.goals.tours) {
    recommendations.push('Log every tour in Post-Tour Debrief to keep your pace honest.');
  }

  if (state.aiCoachSessions < state.dailyGoal.goals.ai_coach_sessions) {
    recommendations.push('Use AI Coach for one live objection before the day ends.');
  }

  if (recommendations.length < 3) {
    recommendations.push('Review one Skool lesson and turn it into a floor action today.');
  }

  return recommendations.slice(0, 3);
}

export async function getDemoDailyGoal(): Promise<DailyGoal> {
  const state = await getDemoProgressState();

  return clone(state.dailyGoal);
}

export async function getDemoGoalSheet(): Promise<GoalSheetData> {
  const state = await getDemoProgressState();
  return clone(state.goalSheet);
}

export async function getDemoPracticeSummary(): Promise<PracticeSummary> {
  const state = await getDemoProgressState();
  const sevenDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
  const weeklySessions = state.practiceSessions.filter(
    (session) => new Date(session.created_at).getTime() >= sevenDaysAgo
  );
  const totalSessions = state.practiceSessions.length;
  const averageScore =
    totalSessions > 0
      ? Number(
          (
            state.practiceSessions.reduce((total, session) => total + session.score, 0) /
            totalSessions
          ).toFixed(1)
        )
      : 0;
  const bestScore = state.practiceSessions.reduce(
    (best, session) => Math.max(best, session.score),
    0
  );

  return {
    totalSessions,
    weeklySessions: weeklySessions.length,
    averageScore,
    bestScore,
    lastScenarioTitle: state.practiceSessions[0]?.scenario_title || null,
  };
}

export async function getDemoTourHistory() {
  const state = await getDemoProgressState();
  return clone(state.tourHistory);
}
